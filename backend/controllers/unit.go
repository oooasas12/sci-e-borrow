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

type Unit struct {
	DB *gorm.DB
}

type CreateUnitForm struct {
	Name string `form:"name" binding:"required"`
}

func (db *Unit) FindAll(ctx *gin.Context) {
	var data []models.Unit
	db.DB.Find(&data)

	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &data)
	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *Unit) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.Unit
	if err := db.DB.First(&data, id).Error; err != nil {
		log.Fatal("Error findOne Unit :", err)
		return
	}
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (db *Unit) Update(ctx *gin.Context) {
	var form CreateUnitForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.Unit
	if err := db.DB.First(&data, id).Error; err != nil {
		log.Fatal("Error findOne Unit :", err)
		return
	}

	copier.Copy(&data, &form)
	if err := db.DB.Save(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(data)
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusOK, gin.H{"unit": repornse})
}

func (db *Unit) Create(ctx *gin.Context) {
	var form CreateUnitForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var data models.Unit
	copier.Copy(&data, &form)

	if err := db.DB.Create(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.GenaralRepornse{}
	copier.Copy(&repornse, &data)

	ctx.JSON(http.StatusCreated, gin.H{"unit": repornse})
}

func (db *Unit) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Unit ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var data models.Unit
	if err := db.DB.First(&data, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&data).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Unit"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Unit deleted successfully"})
}
