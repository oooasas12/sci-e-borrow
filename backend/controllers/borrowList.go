package controllers

import (
	"fmt"
	"net/http"
	"os"
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

	// สร้าง updates map สำหรับเก็บค่าที่จะอัพเดต
	updates := map[string]interface{}{
		"approval_status_borrow_id": form.ApprovalStatusBorrowID,
	}

	// จัดการกับไฟล์ PDF เฉพาะเมื่อ ApprovalStatusBorrowID = 1
	if form.ApprovalStatusBorrowID == 1 && form.File != nil {
		// สร้างชื่อไฟล์ใหม่
		now := time.Now()
		fileName := fmt.Sprintf("%d_%d_%d_%d_%d_%d_%d_%d.pdf",
			borrowList.UserID,
			now.UnixNano()/int64(time.Millisecond)%1000,
			now.Second(),
			now.Minute(),
			now.Hour(),
			now.Day(),
			now.Month(),
			now.Year(),
		)

		// สร้างโฟลเดอร์ถ้ายังไม่มี
		if err := os.MkdirAll("images/file_contact", 0755); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		// บันทึกไฟล์
		filePath := fmt.Sprintf("images/file_contact/%s", fileName)
		if err := ctx.SaveUploadedFile(form.File, filePath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		// เพิ่มชื่อไฟล์ลงใน updates map
		updates["doc_borrow"] = fileName
	}

	// อัพเดตข้อมูลใน DB
	if err := db.DB.Model(&borrowList).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Update BorrowList not found"})
		return
	}

	// ถ้า ApprovalStatusBorrowID = 1 หรือ 2 ให้อัพเดตสถานะอุปกรณ์
	if form.ApprovalStatusBorrowID == 1 || form.ApprovalStatusBorrowID == 2 {
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

		if len(equipmentIDs) > 0 {
			newStatus := 1 // สถานะเริ่มต้น (กรณี ApprovalStatusBorrowID = 2)
			if form.ApprovalStatusBorrowID == 1 {
				newStatus = 2 // เปลี่ยนเป็นสถานะ 2 เมื่อ ApprovalStatusBorrowID = 1
			}

			if err := db.DB.Model(&equipment).
				Where("id IN ?", equipmentIDs).
				Update("equipment_status_id", newStatus).Error; err != nil {
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

	// สร้าง updates map สำหรับเก็บค่าที่จะอัพเดต
	updates := map[string]interface{}{
		"approval_status_return_id": form.ApprovalStatusReturnID,
	}

	// จัดการกับไฟล์ PDF เฉพาะเมื่อ ApprovalStatusReturnID = 1
	if form.ApprovalStatusReturnID == 1 && form.File != nil {
		// สร้างชื่อไฟล์ใหม่
		now := time.Now()
		fileName := fmt.Sprintf("%d_%d_%d_%d_%d_%d_%d_%d.pdf",
			borrowList.UserID,
			now.UnixNano()/int64(time.Millisecond)%1000,
			now.Second(),
			now.Minute(),
			now.Hour(),
			now.Day(),
			now.Month(),
			now.Year(),
		)

		// สร้างโฟลเดอร์ถ้ายังไม่มี
		if err := os.MkdirAll("images/file_contact", 0755); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		// บันทึกไฟล์
		filePath := fmt.Sprintf("images/file_contact/%s", fileName)
		if err := ctx.SaveUploadedFile(form.File, filePath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		// เพิ่มชื่อไฟล์ลงใน updates map
		updates["doc_return"] = fileName
	}

	// ตรวจสอบว่ามีการส่ง equipment_ids มาหรือไม่
	equipmentIDs := form.EquipmentIDs
	if len(equipmentIDs) == 0 {
		// กรณีไม่มีการระบุ equipment_ids อัพเดตทุกรายการ (เข้ากับโค้ดเดิม)
		var allBorrowListDetails []models.BorrowListDetail
		if err := db.DB.Where("borrow_list_id = ?", id).Find(&allBorrowListDetails).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
			return
		}

		for _, detail := range allBorrowListDetails {
			equipmentIDs = append(equipmentIDs, detail.ID)
		}
	}

	// อัพเดตข้อมูลใน DB
	if err := db.DB.Model(&borrowList).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Update BorrowList not found"})
		return
	}

	// รับข้อมูลรายละเอียดทั้งหมดของการยืม
	var allBorrowListDetails []models.BorrowListDetail
	if err := db.DB.Where("borrow_list_id = ?", id).Find(&allBorrowListDetails).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList details not found"})
		return
	}

	// แยกรายการที่จะคืนและไม่คืน
	var detailsToReturn []models.BorrowListDetail
	var detailsNotReturning []models.BorrowListDetail

	for _, detail := range allBorrowListDetails {
		shouldReturn := false
		for _, eqID := range equipmentIDs {
			if detail.ID == eqID {
				shouldReturn = true
				break
			}
		}

		if shouldReturn {
			detailsToReturn = append(detailsToReturn, detail)
		} else {
			detailsNotReturning = append(detailsNotReturning, detail)
		}
	}

	// ถ้ามีรายการที่ไม่คืน
	if len(detailsNotReturning) > 0 {
		// สร้าง BorrowList ใหม่สำหรับรายการที่ยังไม่คืน
		newBorrowList := models.BorrowList{
			DateBorrow:             borrowList.DateBorrow,
			DateReturn:             borrowList.DateReturn,
			DocBorrow:              borrowList.DocBorrow,
			ApprovalStatusBorrowID: borrowList.ApprovalStatusBorrowID,
			ApprovalStatusReturnID: 3, // รอการคืน
			UserID:                 borrowList.UserID,
		}

		if err := db.DB.Create(&newBorrowList).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new BorrowList for remaining items"})
			return
		}

		// อัพเดต BorrowListDetail ของรายการที่ยังไม่คืนให้ชี้ไปที่ BorrowList ใหม่
		for _, detail := range detailsNotReturning {
			if err := db.DB.Model(&detail).Update("borrow_list_id", newBorrowList.ID).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update BorrowListDetail"})
				return
			}
		}
	}

	// ถ้า ApprovalStatusReturnID = 1 (อนุมัติการคืน) ให้อัพเดตสถานะอุปกรณ์
	if form.ApprovalStatusReturnID == 1 && len(detailsToReturn) > 0 {
		// อัปเดต EquipmentStatusID เป็น 1 สำหรับ Equipment ที่คืน
		var equipment models.Equipment
		equipmentIDsToUpdate := []uint{}
		for _, detail := range detailsToReturn {
			equipmentIDsToUpdate = append(equipmentIDsToUpdate, detail.EquipmentID)
		}

		if len(equipmentIDsToUpdate) > 0 {
			if err := db.DB.Model(&equipment).
				Where("id IN ?", equipmentIDsToUpdate).
				Update("equipment_status_id", 1).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentStatus"})
				return
			}
		}
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

func (db *BorrowList) FindByUserID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	var borrowList []models.BorrowList
	if err := db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Preload("ApprovalStatusBorrow").Preload("ApprovalStatusReturn").Where("user_id = ?", id).Find(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	var response []models.BorrowListResponse
	copier.Copy(&response, &borrowList)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowList) FindByBranchID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowList ID"})
		return
	}

	var borrowList []models.BorrowList
	if err := db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Preload("ApprovalStatusBorrow").Preload("ApprovalStatusReturn").Joins("JOIN users ON users.id = borrow_lists.user_id").Where("users.branch_id = ?", id).Find(&borrowList).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "BorrowList not found"})
		return
	}

	var response []models.BorrowListResponse
	copier.Copy(&response, &borrowList)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *BorrowList) GetPDFFile(ctx *gin.Context) {
	// ตั้งค่า CORS headers
	ctx.Header("Access-Control-Allow-Origin", "*")
	ctx.Header("Access-Control-Allow-Methods", "GET")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type")

	fileName := ctx.Param("file_name")
	if fileName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "file_name is required"})
		return
	}

	// สร้าง path ของไฟล์
	filePath := fmt.Sprintf("images/file_contact/%s", fileName)

	// ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// ตั้งค่า header สำหรับการแสดงผล PDF
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	ctx.Header("Content-Type", "application/pdf")

	// ส่งไฟล์กลับไป
	ctx.File(filePath)
}

func (db *BorrowList) FindLastUserBorrowedEquipment(ctx *gin.Context) {
	// รับ equipment_id จากพารามิเตอร์
	equipmentID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "รหัสอุปกรณ์ไม่ถูกต้อง"})
		return
	}

	// ดึงข้อมูล BorrowListDetail ล่าสุดของอุปกรณ์นี้
	var borrowListDetail models.BorrowListDetail
	if err := db.DB.Where("equipment_id = ?", equipmentID).
		Order("created_at DESC").
		First(&borrowListDetail).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการยืมอุปกรณ์นี้"})
		return
	}

	// ดึงข้อมูล BorrowList ที่เกี่ยวข้อง
	var borrowList models.BorrowList
	if err := db.DB.Preload("User").
		Preload("User.PositionFac").
		Preload("User.PositionBranch").
		Preload("User.Branch").
		Preload("ApprovalStatusBorrow").
		Preload("ApprovalStatusReturn").
		First(&borrowList, borrowListDetail.BorrowListID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการยืม"})
		return
	}

	// สร้าง response
	var response models.BorrowListResponse
	copier.Copy(&response, &borrowList)

	ctx.JSON(http.StatusOK, gin.H{
		"data":    response,
		"message": "ดึงข้อมูลผู้ยืมล่าสุดสำเร็จ",
	})
}
