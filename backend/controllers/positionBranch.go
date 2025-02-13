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
	var branches []models.PositionBranch
	b.DB.Find(&branches)

	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &branches)
	ctx.JSON(http.StatusOK, gin.H{"position_branch": repornse})
}

func (b *PositionBranchs) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var branches models.PositionBranch
	if err := b.DB.First(&branches, id).Error; err != nil {
		log.Fatal("Error findOne Branch :", err)
		return
	}
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &branches)

	ctx.JSON(http.StatusOK, gin.H{"position_branch": repornse})
}

func (b *PositionBranchs) Update(ctx *gin.Context) {
	var form PositionCreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var branches models.PositionBranch
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
	var repornse []models.GenaralRepornse
	copier.Copy(&repornse, &branches)

	ctx.JSON(http.StatusOK, gin.H{"position_branch": repornse})
}

func (b *PositionBranchs) Create(ctx *gin.Context) {
	var form PositionCreateBranchForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var branch models.PositionBranch
	copier.Copy(&branch, &form)

	if err := b.DB.Create(&branch).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.GenaralRepornse{}
	copier.Copy(&repornse, &branch)

	ctx.JSON(http.StatusCreated, gin.H{"position_branch": repornse})
}
