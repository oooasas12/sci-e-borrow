package controllers

import (
	"fmt"
	"net/http"
	"reflect"
	"sci-e-borrow-backend/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type BorrowList struct {
	DB *gorm.DB
}

func (db *BorrowList) FindAll(ctx *gin.Context) {
	var borrowLists []models.BorrowList
	db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Preload("ApprovalStatusBorrow").Preload("ApprovalStatusReturn").Find(&borrowLists)

	var response []models.BorrowListResponse
	copier.Copy(&response, &borrowLists)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowList) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var borrowLists models.BorrowList
	if err := db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Preload("ApprovalStatusBorrow").Preload("ApprovalStatusReturn").First(&borrowLists, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Invalid borrowLists ID"})
		return
	}

	var response models.BorrowListResponse
	copier.Copy(&response, &borrowLists)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowList) Update(ctx *gin.Context) {
	var form models.CreateBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var borrowLists models.BorrowList
	if err := db.DB.First(&borrowLists, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowLists ID"})
		return
	}

	copier.Copy(&borrowLists, &form)
	if err := db.DB.Save(&borrowLists).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(borrowLists)
	var response []models.BorrowListResponse
	copier.Copy(&response, &borrowLists)

	ctx.JSON(http.StatusOK, gin.H{"borrowLists": response})
}

func (db *BorrowList) Create(ctx *gin.Context) {
	var form models.CreateBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// สร้าง BorrowList
	var borrowList models.BorrowList
	copier.Copy(&borrowList, &form)

	if err := db.DB.Create(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบและสร้าง BorrowListDetail
	for _, equipmentIDStr := range form.EquipmentID {
		equipmentID, err := strconv.ParseUint(equipmentIDStr, 10, 64)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid equipment ID"})
			return
		}

		// ดึงข้อมูลอุปกรณ์จากฐานข้อมูล
		var equipment models.Equipment
		if err := db.DB.Where("id = ? AND equipment_status_id = ?", equipmentID, 1).First(&equipment).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Equipment ID %d not not available for borrowing", equipmentID)})
			return
		}

		// สร้าง BorrowListDetail
		borrowListDetail := models.BorrowListDetail{
			BorrowListID: borrowList.ID,
			EquipmentID:  uint(equipmentID),
		}

		if err := db.DB.Create(&borrowListDetail).Error; err != nil {
			ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
			return
		}

		if err := db.DB.Model(&equipment).Where("id = ?", equipmentID).Update("equipment_status_id", 7).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Equipment ID %d not not available for borrowing", equipmentID)})
			return
		}
	}

	// เตรียม response
	response := models.BorrowListResponse{}
	copier.Copy(&response, &borrowList)

	ctx.JSON(http.StatusCreated, gin.H{"borrowList": response})
}

func (db *BorrowList) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
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

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList deleted successfully"})
}

func (db *BorrowList) UpdateByName(ctx *gin.Context) {
	// Parse BorrowList ID from URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// Retrieve the existing BorrowList entry
	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// Bind form data
	var form models.UpdateByNameBorrowListForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// Dynamically update only non-zero values
	updateBorrowListFields(&borrowList, form)

	// Save updates
	if err := db.DB.Save(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowList"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList updated successfully", "borrowList": borrowList})
}

func (db *BorrowList) UpdateDateReturn(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// กำหนดค่า date_return เป็นเวลาปัจจุบัน
	now := time.Now().Format("2006-01-02") // ใช้รูปแบบวันที่ที่กำหนด
	parsedTime, _ := time.Parse("2006-01-02", now)

	// อัพเดตค่า date_return ในฐานข้อมูล
	if err := db.DB.Model(&borrowList).Update("date_return", parsedTime).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update BorrowList"})
		return
	}

	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// อัปเดต EquipmentStatusID เป็น 8 สำหรับ Equipment ทั้งหมดที่เกี่ยวข้อง
	var equipment models.Equipment
	equipmentIDs := []uint{}
	for _, detail := range borrowListDetails {
		equipmentIDs = append(equipmentIDs, detail.EquipmentID)
	}

	if len(equipmentIDs) > 0 {
		if err := db.DB.Model(&equipment).
			Where("id IN ?", equipmentIDs).
			Update("equipment_status_id", 8).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList updated date return successfully"})
}

func (db *BorrowList) UpdateStatusBorrow(ctx *gin.Context) {
	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateStatusBorrow
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	if err := db.DB.Model(&borrowList).Update("approval_status_borrow_id", form.ApprovalStatusBorrowID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Update BorrowList not found"})
		return
	}

	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// อัปเดต EquipmentStatusID สำหรับ Equipment ทั้งหมดที่เกี่ยวข้อง
	var equipment models.Equipment
	equipmentIDs := []uint{}
	for _, detail := range borrowListDetails {
		equipmentIDs = append(equipmentIDs, detail.EquipmentID)
	}

	if form.ApprovalStatusBorrowID == 1 {
		if len(equipmentIDs) > 0 {
			if err := db.DB.Model(&equipment).
				Where("id IN ?", equipmentIDs).
				Update("equipment_status_id", 2).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
				return
			}

			// สร้างไฟล์ PDF ใบยืม เข้า BlockChain และนำรหัส hash กลับมาบันทึกลงฐานข้อมูล
		}
	} else if form.ApprovalStatusBorrowID == 2 {
		if len(equipmentIDs) > 0 {
			if err := db.DB.Model(&equipment).
				Where("id IN ?", equipmentIDs).
				Update("equipment_status_id", 1).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
				return
			}
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList updated status borrow successfully"})
}

func (db *BorrowList) UpdateStatusReturn(ctx *gin.Context) {
	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateStatusReturn
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	var borrowList models.BorrowList
	if err := db.DB.First(&borrowList, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	if err := db.DB.Model(&borrowList).Update("approval_status_return_id", form.ApprovalStatusReturnID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Update BorrowList not found"})
		return
	}

	var borrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&borrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	// อัปเดต EquipmentStatusID เป็น 1 สำหรับ Equipment ทั้งหมดที่เกี่ยวข้อง
	var equipment models.Equipment
	equipmentIDs := []uint{}
	for _, detail := range borrowListDetails {
		equipmentIDs = append(equipmentIDs, detail.EquipmentID)
	}

	if form.ApprovalStatusReturnID == 1 {
		if len(equipmentIDs) > 0 {
			if err := db.DB.Model(&equipment).
				Where("id IN ?", equipmentIDs).
				Update("equipment_status_id", 1).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
				return
			}
		}

		// สร้างไฟล์ PDF ใบส่งคืน เข้า BlockChain และนำรหัส hash กลับมาบันทึกลงฐานข้อมูล

	}

	ctx.JSON(http.StatusOK, gin.H{"message": "BorrowList updated status return successfully"})
}

// updateBorrowListFields updates only non-zero fields from form
func updateBorrowListFields(borrowList *models.BorrowList, form models.UpdateByNameBorrowListForm) {
	borrowListValue := reflect.ValueOf(borrowList).Elem()
	formValue := reflect.ValueOf(form)
	formType := reflect.TypeOf(form)

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)

		// Ignore zero values (default empty values)
		if !fieldValue.IsZero() {
			field := borrowListValue.FieldByName(fieldType.Name)

			// Handle pointer fields (*time.Time)
			if field.Kind() == reflect.Ptr && field.Type().Elem() == reflect.TypeOf(time.Time{}) {
				if !fieldValue.IsNil() {
					field.Set(fieldValue)
				}
			} else {
				field.Set(fieldValue)
			}
		}
	}
}
