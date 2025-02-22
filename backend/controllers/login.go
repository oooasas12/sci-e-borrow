package controllers

import (
	"fmt"
	"net/http"
	"sci-e-borrow-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type Login struct {
	DB *gorm.DB
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

	// ตรวจสอบ password
	if user.Password != loginForm.Password {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	// สร้าง response
	var response models.UserResponse
	copier.Copy(&response, &user)

	fmt.Println("response :: ", response)
	ctx.JSON(http.StatusOK, gin.H{
		"status": "login success",
		"data":   response,
	})
}
