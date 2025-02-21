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

type BorrowList struct {
	DB *gorm.DB
}

func (db *BorrowList) FindAll(ctx *gin.Context) {
	var borrowLists []models.BorrowList
	db.DB.Preload("User").Preload("ApprovalStatus").Find(&borrowLists)

	var repornse []models.BorrowListResponse
	copier.Copy(&repornse, &borrowLists)
	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *BorrowList) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var borrowLists models.BorrowList
	if err := db.DB.Preload("User").Preload("ApprovalStatus").First(&borrowLists, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowLists ID"})
		return
	}

	var repornse []models.BorrowListResponse
	copier.Copy(&repornse, &borrowLists)

	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *BorrowList) Update(ctx *gin.Context) {
	var form models.CreateBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var borrowLists models.BorrowList
	if err := db.DB.First(&borrowLists, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowLists ID"})
		return
	}

	copier.Copy(&borrowLists, &form)
	if err := db.DB.Save(&borrowLists).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(borrowLists)
	var repornse []models.BorrowListResponse
	copier.Copy(&repornse, &borrowLists)

	ctx.JSON(http.StatusOK, gin.H{"borrowLists": repornse})
}

func (db *BorrowList) Create(ctx *gin.Context) {
	var form models.CreateBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var borrowList models.BorrowList
	copier.Copy(&borrowList, &form)

	if err := db.DB.Create(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.BorrowListResponse{}
	copier.Copy(&repornse, &borrowList)

	ctx.JSON(http.StatusCreated, gin.H{"borrowList": repornse})
}

func (db *BorrowList) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete borrowList"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList deleted successfully"})
}

func (db *BorrowList) UpdateByName(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateByNameBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	// ใช้ reflect เพื่อตรวจสอบค่าที่ถูกส่งมา และอัปเดตเฉพาะค่าที่ไม่เป็นค่าเริ่มต้น (zero value)
	borrowListValue := reflect.ValueOf(&borrowList).Elem()
	formValue := reflect.ValueOf(form)
	formType := reflect.TypeOf(form)

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)

		// ตรวจสอบว่าเป็นค่าศูนย์หรือไม่ (ถ้าไม่ใช่ แสดงว่าผู้ใช้ส่งค่าเข้ามา)
		if !fieldValue.IsZero() {
			borrowListValue.FieldByName(fieldType.Name).Set(fieldValue)
		}
	}

	// บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
	if err := db.DB.Save(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowList"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList updated successfully", "borrowList": borrowList})
}
