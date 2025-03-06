package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sci-e-borrow-backend/models"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Signature struct {
	DB *gorm.DB
}

func (s *Signature) Upload(c *gin.Context) {
	// รับไฟล์จาก form-data
	var form models.CreateSignatureForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// สร้างชื่อไฟล์ใหม่ด้วยรูปแบบเวลา
	now := time.Now()
	ext := filepath.Ext(form.Image.Filename)
	timeFormat := fmt.Sprintf("%d_%d_%d_%d_%d_%d_%d",
		now.Nanosecond()/1000000, // มิลลิวินาที
		now.Second(),             // วินาที
		now.Minute(),             // นาที
		now.Hour(),               // ชั่วโมง
		now.Day(),                // วัน
		now.Month(),              // เดือน
		now.Year(),               // ปี
	)
	newFileName := fmt.Sprintf("signature_%s%s", timeFormat, ext)

	// สร้างโฟลเดอร์ถ้ายังไม่มี
	uploadDir := "images/signature"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างโฟลเดอร์ได้"})
		return
	}

	// บันทึกไฟล์
	filePath := filepath.Join(uploadDir, newFileName)
	if err := c.SaveUploadedFile(form.Image, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
		return
	}

	// สร้างข้อมูลลายเซ็นตามฐานข้อมูล
	signature := models.Signature{
		UserID:    form.UserID,
		ImagePath: timeFormat, // เก็บเฉพาะรูปแบบเวลา
		ImageName: newFileName,
	}

	if err := s.DB.Create(&signature).Error; err != nil {
		// ลบไฟล์ถ้าบันทึกข้อมูลไม่สำเร็จ
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลลายเซ็นได้"})
		return
	}

	// ส่งข้อมูลตอบกลับพร้อมข้อมูลที่บันทึก
	c.JSON(http.StatusOK, gin.H{"message": "อัปโหลดลายเซ็นสำเร็จ"})
}

// GetSignatureImage ดึงรูปภาพลายเซ็น
func (s *Signature) GetSignatureImage(c *gin.Context) {
	imagePath := c.Param("image_path")
	if imagePath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ image_path"})
		return
	}

	// ค้นหาข้อมูลลายเซ็นจากฐานข้อมูล
	var signature models.Signature
	if err := s.DB.Where("image_path = ?", imagePath).First(&signature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลลายเซ็น"})
		return
	}

	// สร้าง path ไปยังไฟล์
	filePath := filepath.Join("images/signature", signature.ImageName)

	// ตรวจสอบว่าไฟล์มีอยู่จริง
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบไฟล์รูปภาพ"})
		return
	}

	// ส่งไฟล์กลับไป
	c.File(filePath)
}

// GetSignatureByUser ดึงข้อมูลลายเซ็นทั้งหมดตาม user_id
func (s *Signature) GetSignatureByUser(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ user_id"})
		return
	}

	var signatures []models.Signature
	if err := s.DB.Where("user_id = ?", userID).Find(&signatures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลลายเซ็นได้"})
		return
	}

	// ถ้าไม่พบข้อมูล
	if len(signatures) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลลายเซ็น"})
		return
	}

	// แปลงข้อมูลเป็น response array
	var response []models.SignatureResponse
	for _, sig := range signatures {
		// ตรวจสอบว่าไฟล์มีอยู่จริง
		filePath := filepath.Join("images/signature", sig.ImageName)
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			continue // ข้ามรายการที่ไม่พบไฟล์
		}

		response = append(response, models.SignatureResponse{
			ID:        sig.ID,
			ImagePath: sig.ImagePath,
			ImageName: sig.ImageName,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": response,
	})
}
