package controllers

import (
	"net/http"
	"reflect"
	"sci-e-borrow-backend/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type EquipmentBroken struct {
	DB *gorm.DB
}

func (db *EquipmentBroken) FindAll(ctx *gin.Context) {
	var equipmentBrokens []models.EquipmentBroken
	db.DB.Preload("Equipment").Preload("Equipment.EquipmentName").Preload("EquipmentStatus").Preload("User").Preload("Equipment.EquipmentGroup").Find(&equipmentBrokens)

	var response []models.EquipmentBrokenResponse
	copier.Copy(&response, &equipmentBrokens)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *EquipmentBroken) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var equipmentBroken models.EquipmentBroken
	if err := db.DB.Preload("Equipment").Preload("Equipment.EquipmentName").Preload("EquipmentStatus").Preload("User").Preload("Equipment.EquipmentGroup").First(&equipmentBroken, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var response []models.EquipmentBrokenResponse
	copier.Copy(&response, &equipmentBroken)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *EquipmentBroken) Update(ctx *gin.Context) {
	var form models.CreateEquipmentBrokenForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var equipmentBroken models.EquipmentBroken
	if err := db.DB.First(&equipmentBroken, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	copier.Copy(&equipmentBroken, &form)
	if err := db.DB.Save(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(equipmentBroken)
	var response []models.EquipmentBrokenResponse
	copier.Copy(&response, &equipmentBroken)

	ctx.JSON(http.StatusOK, gin.H{"equipmentBroken": response})
}

func (db *EquipmentBroken) Create(ctx *gin.Context) {
	var form models.CreateEquipmentBrokenForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var equipment models.Equipment
	if err := db.DB.Where("id = ? AND equipment_status_id = ?", form.EquipmentID, 1).First(&equipment).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error equipment status": "Equipment not found or status is not available"})
		return
	}

	var equipmentBroken models.EquipmentBroken
	copier.Copy(&equipmentBroken, &form)
	if err := db.DB.Create(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error ceate data EquipmentBroken": err.Error()})
		return
	}

	if err := db.DB.Model(&equipment).Where("id = ?", form.EquipmentID).Update("equipment_status_id", 3).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "equipment update status"})
		return
	}

	response := models.EquipmentBrokenResponse{}
	copier.Copy(&response, &equipmentBroken)

	ctx.JSON(http.StatusCreated, gin.H{"equipmentBroken": response})
}

func (db *EquipmentBroken) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentBroken ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var equipmentBroken models.EquipmentBroken
	if err := db.DB.First(&equipmentBroken, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "EquipmentBroken not found"})
		return
	}

	// เปลี่ยน equipment_status_id ของ equipment ที่เชื่อมอยู่กับ EquipmentBroken ให้เป็น 1
	var equipment models.Equipment
	if err := db.DB.Where("id = ?", equipmentBroken.EquipmentID).First(&equipment).Error; err == nil {
		equipment.EquipmentStatusID = 1
		if err := db.DB.Save(&equipment).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update equipment status"})
			return
		}
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete EquipmentBroken"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Equipment deleted successfully"})
}

func (db *EquipmentBroken) UpdateByName(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentBroken ID"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	var equipmentBroken models.EquipmentBroken
	if err := db.DB.First(&equipmentBroken, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Equipment not found"})
		return
	}

	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateByNameEquipmentBrokenForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	// ตรวจสอบว่า equipment_id ที่ส่งมาไม่ตรงกับค่าเดิมใน DB
	if equipmentBroken.EquipmentID != form.EquipmentID {
		var equipments []models.Equipment

		// ดึงข้อมูลอุปกรณ์ที่เกี่ยวข้องทั้งหมดในครั้งเดียว
		if err := db.DB.Where("id IN (?)", []uint{equipmentBroken.EquipmentID, form.EquipmentID}).Find(&equipments).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch equipment"})
			return
		}

		// ใช้ Transaction เพื่อความปลอดภัย
		tx := db.DB.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		for i := range equipments {
			if equipments[i].ID == equipmentBroken.EquipmentID {
				if equipments[i].EquipmentStatusID != 1 {
					equipments[i].EquipmentStatusID = 1
					if err := tx.Save(&equipments[i]).Error; err != nil {
						tx.Rollback()
						ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update equipment status"})
						return
					}
				}
			} else if equipments[i].ID == form.EquipmentID {
				if equipments[i].EquipmentStatusID != 3 {
					equipments[i].EquipmentStatusID = 3
					if err := tx.Save(&equipments[i]).Error; err != nil {
						tx.Rollback()
						ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update equipment status"})
						return
					}
				}
			}
		}

		// Commit transaction หากไม่มีข้อผิดพลาด
		if err := tx.Commit().Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
			return
		}
	}

	// ใช้ reflect เพื่อตรวจสอบค่าที่ถูกส่งมา และอัปเดตเฉพาะค่าที่ไม่เป็นค่าเริ่มต้น (zero value)
	equipmentBrokenValue := reflect.ValueOf(&equipmentBroken).Elem()
	formValue := reflect.ValueOf(form)
	formType := reflect.TypeOf(form)

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)

		// ตรวจสอบว่าเป็นค่าศูนย์หรือไม่ (ถ้าไม่ใช่ แสดงว่าผู้ใช้ส่งค่าเข้ามา)
		if !fieldValue.IsZero() {
			equipmentBrokenValue.FieldByName(fieldType.Name).Set(fieldValue)
		}
	}

	// บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
	if err := db.DB.Save(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update EquipmentBroken"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Equipment updated successfully", "EquipmentBroken": equipmentBroken})
}

func (db *EquipmentBroken) UpdateStatus(ctx *gin.Context) {
	var form models.UpdateStatusBrokenForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// แปลง ID จาก string array เป็น uint array
	var ids []uint
	for _, idStr := range form.ID {
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}
		ids = append(ids, uint(id))
	}

	// แปลง EquipmentStatusID เป็น uint
	equipmentStatusID, err := strconv.ParseUint(form.EquipmentStatusID, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentStatusID format"})
		return
	}

	// อัปเดต EquipmentStatusID เป็นค่าที่รับเข้ามา
	var equipmentBroken models.EquipmentBroken
	result := db.DB.Model(&equipmentBroken).Where("id IN ?", ids).Update("equipment_status_id", uint(equipmentStatusID))
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	// หาก equipmentStatusID == 5 ให้ UPDATE date_end_repair เป็นวันนี้
	if equipmentStatusID == 5 {
		today := time.Now()
		if err := db.DB.Model(&equipmentBroken).Where("id IN ?", ids).Update("date_end_repair", today).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update date_end_repair"})
			return
		}
	}

	// ดึง EquipmentID จาก EquipmentBroken เพื่อนำไปอัปเดต EquipmentStatusID ของ Equipment
	var equipmentIDs []uint
	db.DB.Model(&equipmentBroken).Where("id IN ?", ids).Pluck("equipment_id", &equipmentIDs)

	// อัปเดต EquipmentStatusID ของ Equipment
	equipmentUpdateStatus := uint(equipmentStatusID)
	if equipmentStatusID == 5 {
		equipmentUpdateStatus = uint(1)
	}

	var equipment models.Equipment
	resultEquipment := db.DB.Model(&equipment).Where("id IN ?", equipmentIDs).Update("equipment_status_id", equipmentUpdateStatus)
	if resultEquipment.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Equipment status"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":                        "Status updated successfully",
		"updated_equipment_broken_count": result.RowsAffected,
		"updated_equipment_count":        resultEquipment.RowsAffected,
	})
}

func (db *EquipmentBroken) FindByUserID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentBroken ID"})
		return
	}

	var equipmentBroken []models.EquipmentBroken
	if err := db.DB.Preload("Equipment").Preload("Equipment.EquipmentName").Preload("EquipmentStatus").Preload("User").Preload("Equipment.EquipmentGroup").Where("user_id = ?", id).Find(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "EquipmentBroken not found"})
		return
	}

	var response []models.EquipmentBrokenResponse
	copier.Copy(&response, &equipmentBroken)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *EquipmentBroken) FindByBranchID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EquipmentBroken ID"})
		return
	}

	var equipmentBroken []models.EquipmentBroken
	if err := db.DB.Preload("Equipment").Preload("Equipment.EquipmentName").Preload("EquipmentStatus").Preload("User").Preload("User.Branch").Preload("Equipment.EquipmentGroup").Joins("JOIN users ON users.id = equipment_brokens.user_id").Where("users.branch_id = ?", id).Find(&equipmentBroken).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "EquipmentBroken not found"})
		return
	}

	var response []models.EquipmentBrokenResponse
	copier.Copy(&response, &equipmentBroken)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}
