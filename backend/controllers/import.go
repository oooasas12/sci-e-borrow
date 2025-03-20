package controllers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sci-e-borrow-backend/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Import struct {
	DB *gorm.DB
}

// ฟังก์ชันสำหรับนำเข้าข้อมูลจากไฟล์ CSV
func (db *Import) ImportEquipmentFromCSV(ctx *gin.Context) {
	// อ่านไฟล์ CSV
	csvFile, err := os.Open("backend/test.csv")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเปิดไฟล์ CSV ได้: " + err.Error()})
		return
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile)
	reader.FieldsPerRecord = -1 // ยอมรับจำนวนฟิลด์ไม่เท่ากันในแต่ละแถว
	reader.LazyQuotes = true    // ยอมรับ quote ที่ไม่สมบูรณ์

	records, err := reader.ReadAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่านไฟล์ CSV ได้: " + err.Error()})
		return
	}

	// ข้ามแถวแรกที่เป็นหัวข้อ
	records = records[1:]

	// เก็บ map ของชื่อรายการครุภัณฑ์ กับ ID
	equipmentNameMap := make(map[string]uint)
	unitMap := make(map[string]uint)
	budgetSourceMap := make(map[string]uint)

	// ตัวแปรเก็บจำนวนการเพิ่มข้อมูล
	countEquipmentName := 0
	countUnit := 0
	countBudgetSource := 0
	countEquipment := 0

	// วนลูปผ่านแต่ละแถวในไฟล์ CSV
	for _, record := range records {
		// ตรวจสอบว่ามีข้อมูลครบไหม
		if len(record) < 10 {
			continue
		}

		// ดึงข้อมูลจากแต่ละคอลัมน์
		equipmentCode := strings.TrimSpace(record[1])
		equipmentNameStr := strings.TrimSpace(record[2])
		equipmentValue := strings.TrimSpace(record[5])
		// ลบตัวอักษร " " ออกและแปลงเป็นตัวเลข
		equipmentValue = strings.ReplaceAll(equipmentValue, " ", "")
		equipmentValue = strings.ReplaceAll(equipmentValue, "\"", "")
		equipmentValue = strings.ReplaceAll(equipmentValue, ",", "")

		unitStr := strings.TrimSpace(record[4])
		budgetSourceStr := strings.TrimSpace(record[7])

		// ข้อมูลวันที่ได้มา
		dateComeStr := strings.TrimSpace(record[6])

		// คุณสมบัติ
		feature := strings.TrimSpace(record[8])

		// สถานที่ตั้ง/จัดเก็บ
		location := strings.TrimSpace(record[9])

		// แปลงรูปแบบวันที่
		var dateCome time.Time
		layouts := []string{
			"2 Jan 06",
			"_2 Jan 06",
			"2 Jan. 06",
			"_2 Jan. 06",
		}

		// ทดลองแปลงวันที่จากหลายรูปแบบ
		success := false
		for _, layout := range layouts {
			parsed, err := time.Parse(layout, dateComeStr)
			if err == nil {
				dateCome = parsed
				success = true
				break
			}
		}

		if !success {
			// หากไม่สามารถแปลงวันที่ได้ ให้ใช้วันที่ปัจจุบัน
			dateCome = time.Now()
		}
		dateCome = time.Now()
		// 1. เพิ่มข้อมูลในตาราง EquipmentName โดยไม่ซ้ำ
		var equipmentNameID uint
		if id, exists := equipmentNameMap[equipmentNameStr]; exists {
			equipmentNameID = id
		} else {
			var equipmentName models.EquipmentName
			if err := db.DB.Where("name = ?", equipmentNameStr).First(&equipmentName).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				equipmentName = models.EquipmentName{
					Name: equipmentNameStr,
				}
				if err := db.DB.Create(&equipmentName).Error; err != nil {
					continue
				}
				countEquipmentName++
			}
			equipmentNameID = equipmentName.ID
			equipmentNameMap[equipmentNameStr] = equipmentNameID
		}

		// 2. เพิ่มข้อมูลในตาราง Unit โดยไม่ซ้ำ
		var unitID uint
		if id, exists := unitMap[unitStr]; exists {
			unitID = id
		} else {
			var unit models.Unit
			if err := db.DB.Where("name = ?", unitStr).First(&unit).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				unit = models.Unit{
					Name: unitStr,
				}
				if err := db.DB.Create(&unit).Error; err != nil {
					continue
				}
				countUnit++
			}
			unitID = unit.ID
			unitMap[unitStr] = unitID
		}

		// 3. เพิ่มข้อมูลในตาราง BudgetSource โดยไม่ซ้ำ
		var budgetSourceID uint
		if id, exists := budgetSourceMap[budgetSourceStr]; exists {
			budgetSourceID = id
		} else {
			var budgetSource models.BudgetSource
			if err := db.DB.Where("name = ?", budgetSourceStr).First(&budgetSource).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				budgetSource = models.BudgetSource{
					Name: budgetSourceStr,
				}
				if err := db.DB.Create(&budgetSource).Error; err != nil {
					continue
				}
				countBudgetSource++
			}
			budgetSourceID = budgetSource.ID
			budgetSourceMap[budgetSourceStr] = budgetSourceID
		}

		// 4. เพิ่มข้อมูลในตาราง Equipment
		equipment := models.Equipment{
			Code:              equipmentCode,
			Value:             equipmentValue,
			DateCome:          dateCome,
			Feature:           feature,
			Location:          location,
			EquipmentStatusID: 1, // ตั้งค่าเป็น 1 ตามที่กำหนด
			EquipmentGroupID:  1, // ตั้งค่าเป็น 1 ตามที่กำหนด
			BudgetSourceID:    budgetSourceID,
			UnitID:            unitID,
			EquipmentNameID:   equipmentNameID,
		}

		// ตรวจสอบว่ามีข้อมูลนี้อยู่แล้วหรือไม่
		var existingEquipment models.Equipment
		if err := db.DB.Where("code = ?", equipmentCode).First(&existingEquipment).Error; err != nil {
			// ไม่พบข้อมูล ให้สร้างใหม่
			if err := db.DB.Create(&equipment).Error; err != nil {
				continue
			}
			countEquipment++
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "นำเข้าข้อมูลเรียบร้อยแล้ว",
		"summary": gin.H{
			"equipment_names": countEquipmentName,
			"units":           countUnit,
			"budget_sources":  countBudgetSource,
			"equipments":      countEquipment,
		},
	})
}

// ฟังก์ชันสำหรับอัพโหลดไฟล์ CSV แล้วนำเข้าข้อมูล
func (db *Import) UploadAndImportCSV(ctx *gin.Context) {
	// รับไฟล์ที่อัพโหลดมา
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ไม่มีไฟล์ที่อัพโหลด"})
		return
	}

	// ตรวจสอบนามสกุลไฟล์
	ext := filepath.Ext(file.Filename)
	if ext != ".csv" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "รองรับเฉพาะไฟล์ .csv เท่านั้น"})
		return
	}

	// บันทึกไฟล์ไว้ที่เซิร์ฟเวอร์ชั่วคราว
	dst := filepath.Join("backend/tmp", file.Filename)
	if err := ctx.SaveUploadedFile(file, dst); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
		return
	}

	// อ่านไฟล์ CSV
	csvFile, err := os.Open(dst)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเปิดไฟล์ CSV ได้"})
		return
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile)
	reader.FieldsPerRecord = -1 // ยอมรับจำนวนฟิลด์ไม่เท่ากันในแต่ละแถว
	reader.LazyQuotes = true    // ยอมรับ quote ที่ไม่สมบูรณ์

	records, err := reader.ReadAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอ่านไฟล์ CSV ได้"})
		return
	}

	// ข้ามแถวแรกที่เป็นหัวข้อ
	records = records[1:]

	// เก็บ map ของชื่อรายการครุภัณฑ์ กับ ID
	equipmentNameMap := make(map[string]uint)
	unitMap := make(map[string]uint)
	budgetSourceMap := make(map[string]uint)

	// ตัวแปรเก็บจำนวนการเพิ่มข้อมูล
	countEquipmentName := 0
	countUnit := 0
	countBudgetSource := 0
	countEquipment := 0
	errors := []string{}

	// วนลูปผ่านแต่ละแถวในไฟล์ CSV
	for i, record := range records {
		// ตรวจสอบว่ามีข้อมูลครบไหม
		if len(record) < 10 {
			errors = append(errors, fmt.Sprintf("แถวที่ %d: ข้อมูลไม่ครบถ้วน", i+2))
			continue
		}

		// ดึงข้อมูลจากแต่ละคอลัมน์
		equipmentCode := strings.TrimSpace(record[1])
		equipmentNameStr := strings.TrimSpace(record[2])
		equipmentValue := strings.TrimSpace(record[5])
		// ลบตัวอักษร " " ออกและแปลงเป็นตัวเลข
		equipmentValue = strings.ReplaceAll(equipmentValue, " ", "")
		equipmentValue = strings.ReplaceAll(equipmentValue, "\"", "")
		equipmentValue = strings.ReplaceAll(equipmentValue, ",", "")

		unitStr := strings.TrimSpace(record[4])
		budgetSourceStr := strings.TrimSpace(record[7])

		// ข้อมูลวันที่ได้มา
		dateComeStr := strings.TrimSpace(record[6])

		// คุณสมบัติ
		feature := strings.TrimSpace(record[8])

		// สถานที่ตั้ง/จัดเก็บ
		location := strings.TrimSpace(record[9])

		// แปลงรูปแบบวันที่
		var dateCome time.Time
		layouts := []string{
			"2 Jan 06",
			"_2 Jan 06",
			"2 Jan. 06",
			"_2 Jan. 06",
		}

		// ทดลองแปลงวันที่จากหลายรูปแบบ
		success := false
		for _, layout := range layouts {
			parsed, err := time.Parse(layout, dateComeStr)
			if err == nil {
				dateCome = parsed
				success = true
				break
			}
		}

		if !success {
			// หากไม่สามารถแปลงวันที่ได้ ให้ใช้วันที่ปัจจุบัน
			dateCome = time.Now()
			errors = append(errors, fmt.Sprintf("แถวที่ %d: ไม่สามารถแปลงวันที่ '%s' ได้ ใช้วันที่ปัจจุบันแทน", i+2, dateComeStr))
		}

		// 1. เพิ่มข้อมูลในตาราง EquipmentName โดยไม่ซ้ำ
		var equipmentNameID uint
		if id, exists := equipmentNameMap[equipmentNameStr]; exists {
			equipmentNameID = id
		} else {
			var equipmentName models.EquipmentName
			if err := db.DB.Where("name = ?", equipmentNameStr).First(&equipmentName).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				equipmentName = models.EquipmentName{
					Name: equipmentNameStr,
				}
				if err := db.DB.Create(&equipmentName).Error; err != nil {
					errors = append(errors, fmt.Sprintf("แถวที่ %d: ไม่สามารถเพิ่มรายการครุภัณฑ์ '%s' ได้", i+2, equipmentNameStr))
					continue
				}
				countEquipmentName++
			}
			equipmentNameID = equipmentName.ID
			equipmentNameMap[equipmentNameStr] = equipmentNameID
		}

		// 2. เพิ่มข้อมูลในตาราง Unit โดยไม่ซ้ำ
		var unitID uint
		if id, exists := unitMap[unitStr]; exists {
			unitID = id
		} else {
			var unit models.Unit
			if err := db.DB.Where("name = ?", unitStr).First(&unit).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				unit = models.Unit{
					Name: unitStr,
				}
				if err := db.DB.Create(&unit).Error; err != nil {
					errors = append(errors, fmt.Sprintf("แถวที่ %d: ไม่สามารถเพิ่มหน่วยนับ '%s' ได้", i+2, unitStr))
					continue
				}
				countUnit++
			}
			unitID = unit.ID
			unitMap[unitStr] = unitID
		}

		// 3. เพิ่มข้อมูลในตาราง BudgetSource โดยไม่ซ้ำ
		var budgetSourceID uint
		if id, exists := budgetSourceMap[budgetSourceStr]; exists {
			budgetSourceID = id
		} else {
			var budgetSource models.BudgetSource
			if err := db.DB.Where("name = ?", budgetSourceStr).First(&budgetSource).Error; err != nil {
				// ไม่พบข้อมูล ให้สร้างใหม่
				budgetSource = models.BudgetSource{
					Name: budgetSourceStr,
				}
				if err := db.DB.Create(&budgetSource).Error; err != nil {
					errors = append(errors, fmt.Sprintf("แถวที่ %d: ไม่สามารถเพิ่มแหล่งเงิน '%s' ได้", i+2, budgetSourceStr))
					continue
				}
				countBudgetSource++
			}
			budgetSourceID = budgetSource.ID
			budgetSourceMap[budgetSourceStr] = budgetSourceID
		}

		// 4. เพิ่มข้อมูลในตาราง Equipment
		equipment := models.Equipment{
			Code:              equipmentCode,
			Value:             equipmentValue,
			DateCome:          dateCome,
			Feature:           feature,
			Location:          location,
			EquipmentStatusID: 1, // ตั้งค่าเป็น 1 ตามที่กำหนด
			EquipmentGroupID:  1, // ตั้งค่าเป็น 1 ตามที่กำหนด
			BudgetSourceID:    budgetSourceID,
			UnitID:            unitID,
			EquipmentNameID:   equipmentNameID,
		}

		// ตรวจสอบว่ามีข้อมูลนี้อยู่แล้วหรือไม่
		var existingEquipment models.Equipment
		if err := db.DB.Where("code = ?", equipmentCode).First(&existingEquipment).Error; err != nil {
			// ไม่พบข้อมูล ให้สร้างใหม่
			if err := db.DB.Create(&equipment).Error; err != nil {
				errors = append(errors, fmt.Sprintf("แถวที่ %d: ไม่สามารถเพิ่มครุภัณฑ์ '%s' ได้", i+2, equipmentCode))
				continue
			}
			countEquipment++
		} else {
			errors = append(errors, fmt.Sprintf("แถวที่ %d: ครุภัณฑ์รหัส '%s' มีอยู่แล้วในระบบ", i+2, equipmentCode))
		}
	}

	// ลบไฟล์หลังจากนำเข้าข้อมูลเสร็จสิ้น
	os.Remove(dst)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "นำเข้าข้อมูลเรียบร้อยแล้ว",
		"summary": gin.H{
			"equipment_names": countEquipmentName,
			"units":           countUnit,
			"budget_sources":  countBudgetSource,
			"equipments":      countEquipment,
		},
		"errors": errors,
	})
}
