package controllers

import (
	"fmt"
	"net/http"
	"reflect"
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
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

	ctx.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
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

func (u *User) Delete(ctx *gin.Context) {
	// ดึงค่า ID จากพารามิเตอร์ใน URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ค้นหาผู้ใช้ตาม ID
	var user models.User
	if err := u.DB.First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ลบข้อมูลผู้ใช้
	if err := u.DB.Delete(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (db *User) UpdateByName(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ดึงข้อมูลเดิมจากฐานข้อมูล
	var user models.User
	if err := db.DB.First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// อ่านค่าจาก form-data และบันทึกลง struct
	var form models.UpdateByNameUserForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error form": err.Error()})
		return
	}

	// ใช้ reflect เพื่อตรวจสอบค่าที่ถูกส่งมา และอัปเดตเฉพาะค่าที่ไม่เป็นค่าเริ่มต้น (zero value)
	userValue := reflect.ValueOf(&user).Elem()
	formValue := reflect.ValueOf(form)
	formType := reflect.TypeOf(form)

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)

		// ตรวจสอบว่าเป็นค่าศูนย์หรือไม่ (ถ้าไม่ใช่ แสดงว่าผู้ใช้ส่งค่าเข้ามา)
		if !fieldValue.IsZero() {
			userValue.FieldByName(fieldType.Name).Set(fieldValue)
		}
	}

	// บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
	if err := db.DB.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	repornse := models.UserResponse{}
	copier.Copy(&repornse, &user)

	ctx.JSON(http.StatusOK, gin.H{"message": "User updated Select Name successfully"})
}
