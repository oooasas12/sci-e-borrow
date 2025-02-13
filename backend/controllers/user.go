package controllers

import (
	"fmt"
	"net/http"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

type User struct {
	DB *gorm.DB
}

func (u *User) FindAll(ctx *gin.Context) {
	var users []models.User
	u.DB.Preload("PositionFac").Preload("PositionBranch").Preload("Branch").Find(&users)

	fmt.Println("users :: ", users)
	var repornse []models.UserResponse
	copier.Copy(&repornse, &users)
	ctx.JSON(http.StatusOK, gin.H{"users": repornse})
}

func (u *User) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var users models.User
	if err := u.DB.Preload("PositionFac").Preload("PositionBranch").Preload("Branch").First(&users, id).Error; err != nil {
		ctx.JSON(http.StatusOK, gin.H{"users": nil})
		return
	}

	var repornse []models.UserResponse
	copier.Copy(&repornse, &users)

	ctx.JSON(http.StatusOK, gin.H{"users": repornse})
}

func (u *User) Update(ctx *gin.Context) {
	var form models.CreateUserForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var users models.User
	if err := u.DB.First(&users, id).Error; err != nil {
		ctx.JSON(http.StatusOK, gin.H{"users": nil})
		return
	}

	copier.Copy(&users, &form)
	if err := u.DB.Save(&users).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	u.DB.Save(users)
	var repornse []models.UserResponse
	copier.Copy(&repornse, &users)

	ctx.JSON(http.StatusOK, gin.H{"users": repornse})
}

func (u *User) Create(ctx *gin.Context) {
	var form models.CreateUserForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	copier.Copy(&user, &form)

	if err := u.DB.Create(&user).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	repornse := models.UserResponse{}
	copier.Copy(&repornse, &user)

	ctx.JSON(http.StatusCreated, gin.H{"user": repornse})
}
