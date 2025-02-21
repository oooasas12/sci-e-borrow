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

type EquipmentGroup struct {
	DB *gorm.DB
}

type CreateEquipmentGroupForm struct {
	Code string `form:"code" binding:"required"`
	Name string `form:"name" binding:"required"`
}

func (db *EquipmentGroup) FindAll(ctx *gin.Context) {
	var groups []models.EquipmentGroup
	db.DB.Find(&groups)

	var response []models.EquipmentGroupResponse
	copier.Copy(&response, &groups)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *EquipmentGroup) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var groups models.EquipmentGroup
	if err := db.DB.First(&groups, id).Error; err != nil {
		log.Fatal("Error findOne EquipmentGroup :", err)
		return
	}
	var response []models.EquipmentGroupResponse
	copier.Copy(&response, &groups)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *EquipmentGroup) Update(ctx *gin.Context) {
	var form CreateEquipmentGroupForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var groups models.EquipmentGroup
	if err := db.DB.First(&groups, id).Error; err != nil {
		log.Fatal("Error findOne EquipmentGroup :", err)
		return
	}

	copier.Copy(&groups, &form)
	if err := db.DB.Save(&groups).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(groups)
	var response []models.EquipmentGroupResponse
	copier.Copy(&response, &groups)

	ctx.JSON(http.StatusOK, gin.H{"equipment_group": response})
}

func (db *EquipmentGroup) Create(ctx *gin.Context) {
	var form CreateEquipmentGroupForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var group models.EquipmentGroup
	copier.Copy(&group, &form)

	if err := db.DB.Create(&group).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.EquipmentGroupResponse{}
	copier.Copy(&response, &group)

	ctx.JSON(http.StatusCreated, gin.H{"equipment_group": response})
}

func (db *EquipmentGroup) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentGroup ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var group models.EquipmentGroup
	if err := db.DB.First(&group, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "EquipmentGroup not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&group).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete EquipmentGroup"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "EquipmentGroup deleted successfully"})
}
