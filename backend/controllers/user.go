package controllers

import (
	"sci-e-borrow-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type User struct {
	DB *gorm.DB
}

func (u *User) FindAll(ctx *gin.Context) {

}

func (u *User) FindOne(ctx *gin.Context) {

}

func (u *User) Create(ctx *gin.Context) {
	var form models.CreateUserForm
	ctx.ShouldBind(&form)
}
