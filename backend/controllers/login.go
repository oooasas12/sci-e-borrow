package controllers

import (
	"net/http"
	"os"
	"sci-e-borrow-backend/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Login struct {
	DB *gorm.DB
}

// สร้าง JWT token
func generateToken(user models.User) (string, error) {
	// สร้าง claims
	claims := jwt.MapClaims{
		"id":               user.ID,
		"username":         user.Username,
		"PositionFacID":    user.PositionFacID,
		"PositionBranchID": user.PositionBranchID,
		"BranchID":         user.BranchID,
		"exp":              time.Now().Add(time.Hour * 24).Unix(), // หมดอายุใน 24 ชั่วโมง
	}

	// สร้าง token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// เซ็น token ด้วย secret key
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		secretKey = "JWT_SECRET_KEY=zvU19y4S3Jk0H1Pyv10BTE7zKYlQMIoVkZdm1DISyce9COY74GmMEICaZWKKgTuZ" // ค่าเริ่มต้นถ้าไม่ได้กำหนด env
	}

	// สร้าง signed token
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (u *Login) Login(ctx *gin.Context) {
	var loginForm models.Login

	// ผูกข้อมูลจาก form-data
	if err := ctx.ShouldBind(&loginForm); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user จาก username
	var user models.User
	if err := u.DB.Preload("PositionFac").Preload("PositionBranch").Preload("Branch").Where("username = ?", loginForm.Username).First(&user).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	// ตรวจสอบ password โดยใช้ bcrypt
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginForm.Password))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	// สร้าง token
	token, err := generateToken(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}

	// สร้าง response
	var response models.UserResponse
	copier.Copy(&response, &user)

	ctx.JSON(http.StatusOK, gin.H{
		"status": "login success",
		"data":   response,
		"token":  token,
	})
}
