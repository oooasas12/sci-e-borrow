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

type PositionFac struct {
	DB *gorm.DB
}

type PositionCreateFacForm struct {
	Name string `form:"name" binding:"required"`
}

func (b *PositionFac) FindAll(ctx *gin.Context) {
	var positionFacs []models.PositionFac
	b.DB.Find(&positionFacs)

	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &positionFacs)
	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (b *PositionFac) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var positionFacs models.PositionFac
	if err := b.DB.First(&positionFacs, id).Error; err != nil {
		log.Fatal("Error findOne PositionFac :", err)
		return
	}
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &positionFacs)

	ctx.JSON(http.StatusOK, gin.H{"data": repornse})
}

func (b *PositionFac) Update(ctx *gin.Context) {
	var form PositionCreateFacForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var positionFacs models.PositionFac
	if err := b.DB.First(&positionFacs, id).Error; err != nil {
		log.Fatal("Error findOne PositionFac :", err)
		return
	}

	copier.Copy(&positionFacs, &form)
	if err := b.DB.Save(&positionFacs).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	b.DB.Save(positionFacs)
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &positionFacs)

	ctx.JSON(http.StatusOK, gin.H{"position_fac": repornse})
}

func (b *PositionFac) Create(ctx *gin.Context) {
	var form PositionCreateFacForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var positionFac models.PositionFac
	copier.Copy(&positionFac, &form)

	if err := b.DB.Create(&positionFac).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.GenaralRepornse{}
	copier.Copy(&repornse, &positionFac)

	ctx.JSON(http.StatusCreated, gin.H{"position_fac": repornse})
}

func (b *PositionFac) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var positionFac models.PositionFac
	if err := b.DB.First(&positionFac, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "positionFac not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := b.DB.Delete(&positionFac).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "positionFac deleted successfully"})
}
