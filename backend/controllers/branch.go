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

type Branchs struct {
	DB *gorm.DB
}

type CreateBranchForm struct {
	Name string `form:"name" binding:"required"`
}

func (b *Branchs) FindAll(ctx *gin.Context) {
	var branches []models.Branch
	b.DB.Find(&branches)

	var response []models.GenaralResponse
	copier.Copy(&response, &branches)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (b *Branchs) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var branches models.Branch
	if err := b.DB.First(&branches, id).Error; err != nil {
		log.Fatal("Error findOne Branch :", err)
		return
	}
	var response []models.GenaralResponse
	copier.Copy(&response, &branches)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (b *Branchs) Update(ctx *gin.Context) {
	var form CreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var branches models.Branch
	if err := b.DB.First(&branches, id).Error; err != nil {
		log.Fatal("Error findOne Branch :", err)
		return
	}

	copier.Copy(&branches, &form)
	if err := b.DB.Save(&branches).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	b.DB.Save(branches)
	var response []models.GenaralResponse
	copier.Copy(&response, &branches)

	ctx.JSON(http.StatusOK, gin.H{"branchs": response})
}

func (b *Branchs) Create(ctx *gin.Context) {
	var form CreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var branch models.Branch
	copier.Copy(&branch, &form)

	if err := b.DB.Create(&branch).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.GenaralResponse{}
	copier.Copy(&response, &branch)

	ctx.JSON(http.StatusCreated, gin.H{"branch": response})
}

func (b *Branchs) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var branch models.Branch
	if err := b.DB.First(&branch, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "branch not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := b.DB.Delete(&branch).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "branch deleted successfully"})
}
