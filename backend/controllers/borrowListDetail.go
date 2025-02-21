package controllers

import (
	"net/http"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type BorrowListDetail struct {
	DB *gorm.DB
}

func (db *BorrowListDetail) FindByBorrowListID(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var borrowLists []models.BorrowListDetail
	if err := db.DB.Preload("Equipment").Preload("Equipment.EquipmentStatus").Preload("Equipment.BorrowStatus").Preload("Equipment.BudgetSource").Preload("Equipment.Unit").Preload("Equipment.EquipmentGroup").Preload("Equipment.EquipmentName").Preload("BorrowList").Where("borrow_list_id = ?", id).Find(&borrowLists).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Invalid borrowLists ID"})
		return
	}

	var response models.BorrowListDetailResponse
	if err := copier.Copy(&response, &borrowLists); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process response data"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowListDetail) Create(ctx *gin.Context) {
	var form models.CreateBorrowListDetailForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// สร้าง BorrowListDetail
	var borrowList models.BorrowListDetail
	copier.Copy(&borrowList, &form)

	if err := db.DB.Create(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// เตรียม response
	response := models.BorrowListDetailResponse{}
	copier.Copy(&response, &borrowList)

	ctx.JSON(http.StatusCreated, gin.H{"borrowList": response})
}

func (db *BorrowListDetail) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var borrowList models.BorrowListDetail
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowListDetail not found"})
		return
	}

	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowListDetail not found"})
		return
	}

	// อัปเดต EquipmentStatusID เป็น 8 สำหรับ Equipment ทั้งหมดที่เกี่ยวข้อง
	var equipment models.Equipment
	equipmentIDs := []uint{}
	for _, detail := range borrowListDetails {
		equipmentIDs = append(equipmentIDs, detail.EquipmentID)
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete borrowList"})
		return
	}

	if len(equipmentIDs) > 0 {
		if err := db.DB.Model(&equipment).
			Where("id IN ?", equipmentIDs).
			Update("equipment_status_id", 1).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowListDetail deleted successfully"})
}
