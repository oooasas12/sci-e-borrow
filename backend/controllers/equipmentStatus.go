package controllers

import (
	"log"
	"net/http"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type EquipmentStatus struct {
	DB *gorm.DB
}

type CreateEquipmentStatusForm struct {
	Name string `form:"name" binding:"required"`
}

func (db *EquipmentStatus) FindAll(ctx *gin.Context) {
	var status []models.EquipmentStatus
	db.DB.Find(&status)

	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &status)
	ctx.JSON(http.StatusOK, gin.H{"equipment_status": repornse})
}

func (db *EquipmentStatus) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.EquipmentStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne EquipmentStatus :", err)
		return
	}
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &status)

	ctx.JSON(http.StatusOK, gin.H{"equipment_status": repornse})
}

func (db *EquipmentStatus) Update(ctx *gin.Context) {
	var form CreateEquipmentStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.EquipmentStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne EquipmentStatus :", err)
		return
	}

	copier.Copy(&status, &form)
	if err := db.DB.Save(&status).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(status)
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &status)

	ctx.JSON(http.StatusOK, gin.H{"equipment_status": repornse})
}

func (db *EquipmentStatus) Create(ctx *gin.Context) {
	var form CreateEquipmentStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var status models.EquipmentStatus
	copier.Copy(&status, &form)

	if err := db.DB.Create(&status).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.GenaralRepornse{}
	copier.Copy(&repornse, &status)

	ctx.JSON(http.StatusCreated, gin.H{"equipment_status": repornse})
}

func (db *EquipmentStatus) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentStatus ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var status models.EquipmentStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "EquipmentStatus not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&status).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete EquipmentStatus"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "EquipmentStatus deleted successfully"})
}
