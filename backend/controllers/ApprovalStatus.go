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

type ApprovalStatus struct {
	DB *gorm.DB
}

type CreateApprovalStatusForm struct {
	Name string `form:"name" binding:"required"`
}

func (db *ApprovalStatus) FindAll(ctx *gin.Context) {
	var status []models.ApprovalStatus
	db.DB.Find(&status)

	var response []models.GenaralResponse
	copier.Copy(&response, &status)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *ApprovalStatus) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.ApprovalStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne ApprovalStatus :", err)
		return
	}
	var response []models.GenaralResponse
	copier.Copy(&response, &status)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *ApprovalStatus) Update(ctx *gin.Context) {
	var form CreateApprovalStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.ApprovalStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne ApprovalStatus :", err)
		return
	}

	copier.Copy(&status, &form)
	if err := db.DB.Save(&status).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(status)
	var response []models.GenaralResponse
	copier.Copy(&response, &status)

	ctx.JSON(http.StatusOK, gin.H{"approval_status": response})
}

func (db *ApprovalStatus) Create(ctx *gin.Context) {
	var form CreateApprovalStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var status models.ApprovalStatus
	copier.Copy(&status, &form)

	if err := db.DB.Create(&status).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.GenaralResponse{}
	copier.Copy(&response, &status)

	ctx.JSON(http.StatusCreated, gin.H{"approval_status": response})
}

func (db *ApprovalStatus) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ApprovalStatus ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var status models.ApprovalStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "ApprovalStatus not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&status).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete ApprovalStatus"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ApprovalStatus deleted successfully"})
}
