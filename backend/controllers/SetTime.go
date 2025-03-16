package controllers

import (
	"fmt"
	"log"
	"net/http"
	"sci-e-borrow-backend/models"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type SetTime struct {
	DB *gorm.DB
}

func (db *SetTime) FindAll(ctx *gin.Context) {
	var data []models.SetTime
	db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").Find(&data)

	var response []models.SetTimeResponse
	copier.Copy(&response, &data)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *SetTime) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.SetTime
	if err := db.DB.Preload("User").Preload("User.PositionFac").Preload("User.PositionBranch").Preload("User.Branch").First(&data, id).Error; err != nil {
		log.Fatal("Error findOne SetTime :", err)
		return
	}
	var response []models.SetTimeResponse
	copier.Copy(&response, &data)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (db *SetTime) Update(ctx *gin.Context) {
	var form models.CreateSetTimeForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.SetTime
	if err := db.DB.First(&data, id).Error; err != nil {
		log.Fatal("Error findOne SetTime :", err)
		return
	}

	copier.Copy(&data, &form)
	if err := db.DB.Save(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(data)
	var response []models.SetTimeResponse
	copier.Copy(&response, &data)

	ctx.JSON(http.StatusOK, gin.H{"set_time": response})
}

func (db *SetTime) Create(ctx *gin.Context) {
	var form models.CreateSetTimeForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("form :: ", form)

	var data models.SetTime
	copier.Copy(&data, &form)

	if err := db.DB.Create(&data).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.SetTimeResponse{}
	copier.Copy(&response, &data)

	ctx.JSON(http.StatusCreated, gin.H{"set_time": response})
}

func (db *SetTime) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SetTime ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var data models.SetTime
	if err := db.DB.First(&data, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "SetTime not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := db.DB.Delete(&data).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete SetTime"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "SetTime deleted successfully"})
}

func (db *SetTime) CheckCurrentTime(ctx *gin.Context) {
	// รับค่าวันและเวลาปัจจุบันจาก request
	currentTime := ctx.Query("current_time")
	currentDate := ctx.Query("current_date")

	if currentTime == "" || currentDate == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุวันและเวลา"})
		return
	}

	// แปลงวันที่จาก string เป็น time.Time
	parsedDate, err := time.Parse("2006-01-02", currentDate)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่ไม่ถูกต้อง"})
		return
	}

	var setTimes []models.SetTime
	// ค้นหาข้อมูลที่วันที่ปัจจุบันอยู่ระหว่าง DateStart และ DateStop
	if err := db.DB.Where("date_start <= ? AND date_stop >= ?", parsedDate, parsedDate).
		Preload("User").
		Find(&setTimes).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการค้นหาข้อมูล"})
		return
	}

	// ตรวจสอบเวลา
	var matchingSetTimes []models.SetTimeResponse
	for _, setTime := range setTimes {
		// แปลงเวลาเป็นนาที เพื่อเปรียบเทียบ
		currentMinutes := convertTimeToMinutes(currentTime)
		startMinutes := convertTimeToMinutes(setTime.TimeStart)
		stopMinutes := convertTimeToMinutes(setTime.TimeStop)

		if currentMinutes >= startMinutes && currentMinutes <= stopMinutes {
			var response models.SetTimeResponse
			copier.Copy(&response, &setTime)
			matchingSetTimes = append(matchingSetTimes, response)
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"is_within_time": len(matchingSetTimes) > 0,
		"matching_times": matchingSetTimes,
	})
}

// ฟังก์ชันช่วยแปลงเวลาเป็นนาที
func convertTimeToMinutes(timeStr string) int {
	parts := strings.Split(timeStr, ":")
	if len(parts) < 2 {
		return 0
	}
	hours, _ := strconv.Atoi(parts[0])
	minutes, _ := strconv.Atoi(parts[1])
	return hours*60 + minutes
}
