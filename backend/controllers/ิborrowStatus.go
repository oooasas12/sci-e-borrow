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

type BorrowStatus struct {
	DB *gorm.DB
}

type CreateBorrowStatusForm struct {
	Name string `form:"name" binding:"required"`
}

func (db *BorrowStatus) FindAll(ctx *gin.Context) {
	var status []models.BorrowStatus
	db.DB.Find(&status)

	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &status)
	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *BorrowStatus) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.BorrowStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne BorrowStatus :", err)
		return
	}
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &status)

	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *BorrowStatus) Update(ctx *gin.Context) {
	var form CreateBorrowStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var status models.BorrowStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		log.Fatal("Error findOne BorrowStatus :", err)
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

	ctx.JSON(http.StatusOK, gin.H{"borrow_status": repornse})
}

func (db *BorrowStatus) Create(ctx *gin.Context) {
	var form CreateBorrowStatusForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var status models.BorrowStatus
	copier.Copy(&status, &form)

	if err := db.DB.Create(&status).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.GenaralRepornse{}
	copier.Copy(&repornse, &status)

	ctx.JSON(http.StatusCreated, gin.H{"borrow_status": repornse})
}

func (db *BorrowStatus) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BorrowStatus ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var status models.BorrowStatus
	if err := db.DB.First(&status, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowStatus not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&status).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete BorrowStatus"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowStatus deleted successfully"})
}
