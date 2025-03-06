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
	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Preload("Equipment").Preload("Equipment.EquipmentStatus").Preload("Equipment.BudgetSource").Preload("Equipment.Unit").Preload("Equipment.EquipmentGroup").Preload("Equipment.EquipmentName").Preload("BorrowList").Preload("BorrowList.User").Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Invalid borrowListDetails ID"})
		return
	}

	var response []models.BorrowListDetailResponse
	if err := copier.Copy(&response, &borrowListDetails); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process response data"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowListDetail) Create(ctx *gin.Context) {
	var form models.CreateBorrowListDetailForm

	// Bind request data
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Prepare slice to hold created borrow list details
	var borrowListDetails []models.BorrowListDetail
	var equipment models.Equipment
	// Iterate over EquipmentID slice and create a new record for each equipment
	for _, equipmentID := range form.EquipmentID {
		equipmentIDUint, err := strconv.ParseUint(equipmentID, 10, 64) // Convert string to uint
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
			return
		}

		borrowListDetail := models.BorrowListDetail{
			BorrowListID: form.BorrowListID,
			EquipmentID:  uint(equipmentIDUint),
		}

		borrowListDetails = append(borrowListDetails, borrowListDetail)
	}

	// Save all borrow list details in a single batch insert
	if err := db.DB.Create(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	if err := db.DB.Model(&equipment).
		Where("id IN ?", form.EquipmentID).
		Update("equipment_status_id", 7).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "messages": "Failed to update EquipmentStatus"})
		return
	}

	// Return response
	ctx.JSON(http.StatusCreated, gin.H{"messages": "BorrowListDetail created successfully"})
}

func (db *BorrowListDetail) Delete(ctx *gin.Context) {
	var form models.DeleteBorrowListDetailForm

	// Bind request data
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Convert string IDs to uint
	var ids []uint
	for _, idStr := range form.ID {
		id, err := strconv.ParseUint(idStr, 10, 64) // Convert string to uint
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}
		ids = append(ids, uint(id))
	}

	// Start a transaction to ensure atomicity
	tx := db.DB.Begin()
	if tx.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Get Equipment IDs before deletion
	var borrowListDetails []models.BorrowListDetail
	var equipmentIDs []uint
	if err := tx.Model(&borrowListDetails).
		Where("id IN ?", ids).
		Pluck("equipment_id", &equipmentIDs).Error; err != nil {
		tx.Rollback()
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve Equipment IDs"})
		return
	}

	// Perform deletion
	if err := tx.Where("id IN ?", ids).Delete(&borrowListDetails).Error; err != nil {
		tx.Rollback()
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete records"})
		return
	}

	// Update Equipment Status only if there are equipment IDs
	if len(equipmentIDs) > 0 {
		if err := tx.Model(&models.Equipment{}).
			Where("id IN ?", equipmentIDs).
			Update("equipment_status_id", 1).Error; err != nil {
			tx.Rollback()
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
			return
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	// Return success response
	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowListDetail deleted successfully"})
}
