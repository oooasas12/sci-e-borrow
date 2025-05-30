package controllers

import (
	"net/http"
	"reflect"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type Equipment struct {
	DB *gorm.DB
}

func (db *Equipment) FindAll(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var equipments models.Equipment
	if err := db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").First(&equipments, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
		return
	}

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) Update(ctx *gin.Context) {
	var form models.CreateEquipmentForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var equipments models.Equipment
	if err := db.DB.First(&equipments, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
		return
	}

	copier.Copy(&equipments, &form)
	if err := db.DB.Save(&equipments).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(equipments)
	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)

	ctx.JSON(http.StatusOK, gin.H{"equipments": response})
}

func (db *Equipment) Create(ctx *gin.Context) {
	var form models.CreateEquipmentForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var equipment models.Equipment
	copier.Copy(&equipment, &form)

	if err := db.DB.Create(&equipment).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.EquipmentResponse{}
	copier.Copy(&response, &equipment)

	ctx.JSON(http.StatusCreated, gin.H{"equipment": response})
}

func (db *Equipment) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var equipment models.Equipment
	if err := db.DB.First(&equipment, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Equipment not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&equipment).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete equipment"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Equipment deleted successfully"})
}

func (db *Equipment) UpdateByName(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	var equipment models.Equipment
	if err := db.DB.First(&equipment, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Equipment not found"})
		return
	}

	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateByNameEquipmentForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	// ใช้ reflect เพื่อตรวจสอบค่าที่ถูกส่งมา และอัปเดตเฉพาะค่าที่ไม่เป็นค่าเริ่มต้น (zero value)
	equipmentValue := reflect.ValueOf(&equipment).Elem()
	formValue := reflect.ValueOf(form)
	formType := reflect.TypeOf(form)

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)

		// ตรวจสอบว่าเป็นค่าศูนย์หรือไม่ (ถ้าไม่ใช่ แสดงว่าผู้ใช้ส่งค่าเข้ามา)
		if !fieldValue.IsZero() {
			equipmentValue.FieldByName(fieldType.Name).Set(fieldValue)
		}
	}

	// บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
	if err := db.DB.Save(&equipment).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update equipment"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Equipment updated successfully", "equipment": equipment})
}

func (db *Equipment) FindDatafree(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id = ?", 1).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindDataBorrow(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id = ?", 2).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindDataEquipmentBroken(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id = ?", 3).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindDataEquipmentInformBroken(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id != ? AND equipment_status_id != ? AND equipment_status_id != ? AND equipment_status_id != ?", 3, 4, 5, 6).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindDataEquipmentLost(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id = ?", 4).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *Equipment) FindDataEquipmentUnableUse(ctx *gin.Context) {
	var equipments []models.Equipment
	db.DB.Preload("EquipmentStatus").Preload("BudgetSource").Preload("Unit").Preload("EquipmentGroup").Preload("EquipmentName").Where("equipment_status_id = ?", 6).Find(&equipments)

	var response []models.EquipmentResponse
	copier.Copy(&response, &equipments)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}
