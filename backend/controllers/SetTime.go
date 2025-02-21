package controllers

import (
	"fmt"
	"log"
	"net/http"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type SetTime struct {
	DB *gorm.DB
}

func (db *SetTime) FindAll(ctx *gin.Context) {
	var data []models.SetTime
	db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Find(&data)

	var repornse []models.SetTimeResponse
	copier.Copy(&repornse, &data)
	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *SetTime) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.SetTime
	if err := db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").First(&data, id).Error; err != nil {
		log.Fatal("Error findOne SetTime :", err)
		return
	}
	var repornse []models.SetTimeResponse
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *SetTime) Update(ctx *gin.Context) {
	var form models.CreateSetTimeForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.SetTime
	if err := db.DB.First(&data, id).Error; err != nil {
		log.Fatal("Error findOne SetTime :", err)
		return
	}

	copier.Copy(&data, &form)
	if err := db.DB.Save(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(data)
	var repornse []models.SetTimeResponse
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusOK, gin.H{"set_time": repornse})
}

func (db *SetTime) Create(ctx *gin.Context) {
	var form models.CreateSetTimeForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("form :: ", form)

	var data models.SetTime
	copier.Copy(&data, &form)

	if err := db.DB.Create(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.SetTimeResponse{}
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusCreated, gin.H{"set_time": repornse})
}

func (db *SetTime) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SetTime ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var data models.SetTime
	if err := db.DB.First(&data, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "SetTime not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&data).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete SetTime"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "SetTime deleted successfully"})
}
