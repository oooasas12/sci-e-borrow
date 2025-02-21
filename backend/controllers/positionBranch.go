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

type PositionBranchs struct {
	DB *gorm.DB
}

type PositionCreateBranchForm struct {
	Name string `form:"name" binding:"required"`
}

func (b *PositionBranchs) FindAll(ctx *gin.Context) {
	var positionbranches []models.PositionBranch
	b.DB.Find(&positionbranches)

	var response []models.GenaralResponse
	copier.Copy(&response, &positionbranches)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (b *PositionBranchs) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var positionbranches models.PositionBranch
	if err := b.DB.First(&positionbranches, id).Error; err != nil {
		log.Fatal("Error findOne positionbranches :", err)
		return
	}
	var response []models.GenaralResponse
	copier.Copy(&response, &positionbranches)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (b *PositionBranchs) Update(ctx *gin.Context) {
	var form PositionCreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var positionbranches models.PositionBranch
	if err := b.DB.First(&positionbranches, id).Error; err != nil {
		log.Fatal("Error findOne Branch :", err)
		return
	}

	copier.Copy(&positionbranches, &form)
	if err := b.DB.Save(&positionbranches).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	b.DB.Save(positionbranches)
	var response []models.GenaralResponse
	copier.Copy(&response, &positionbranches)

	ctx.JSON(http.StatusOK, gin.H{"position_branch": response})
}

func (b *PositionBranchs) Create(ctx *gin.Context) {
	var form PositionCreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var positionbranch models.PositionBranch
	copier.Copy(&positionbranch, &form)

	if err := b.DB.Create(&positionbranch).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.GenaralResponse{}
	copier.Copy(&response, &positionbranch)

	ctx.JSON(http.StatusCreated, gin.H{"position_branch": response})
}

func (b *PositionBranchs) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var positionbranch models.PositionBranch
	if err := b.DB.First(&positionbranch, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "positionbranch not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := b.DB.Delete(&positionbranch).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "positionbranch deleted successfully"})
}
