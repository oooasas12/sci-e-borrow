package controllers

import (
	"net/http"
	"reflect"
	"sci-e-borrow-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	DB *gorm.DB
}

func (u *User) FindAll(ctx *gin.Context) {
	var users []models.User
	u.DB.Preload("PositionFac").Preload("PositionBranch").Preload("Branch").Find(&users)

	var response []models.UserResponse
	copier.Copy(&response, &users)
	ctx.JSON(http.StatusOK, gin.H{"data": response})
}

func (u *User) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var users models.User
	if err := u.DB.Preload("PositionFac").Preload("PositionBranch").Preload("Branch").First(&users, id).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var response []models.UserResponse
	copier.Copy(&response, &users)

	ctx.JSON(http.StatusOK, gin.H{"data": response})
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

	oldPassword := users.Password
	copier.Copy(&users, &form)

	// เข้ารหัส password ใหม่ด้วย bcrypt ถ้ามีการเปลี่ยนแปลง
	if users.Password != oldPassword && users.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(users.Password), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		users.Password = string(hashedPassword)
	} else {
		// ถ้าไม่มีการเปลี่ยนแปลง password ให้ใช้ค่าเดิม
		users.Password = oldPassword
	}

	if err := u.DB.Save(&users).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var response []models.UserResponse
	copier.Copy(&response, &users)

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

	// เข้ารหัส password ด้วย bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	if err := u.DB.Create(&user).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	response := models.UserResponse{}
	copier.Copy(&response, &user)

	ctx.JSON(http.StatusCreated, gin.H{"user": response})
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

	// เก็บค่ารหัสผ่านเดิมไว้
	oldPassword := user.Password
	passwordChanged := false

	for i := 0; i < formValue.NumField(); i++ {
		fieldValue := formValue.Field(i)
		fieldType := formType.Field(i)
		fieldName := fieldType.Name

		// ตรวจสอบว่าเป็นค่าศูนย์หรือไม่ (ถ้าไม่ใช่ แสดงว่าผู้ใช้ส่งค่าเข้ามา)
		if !fieldValue.IsZero() {
			// ถ้าเป็นฟิลด์ Password ให้จำไว้ว่ามีการเปลี่ยนแปลง
			if fieldName == "Password" {
				passwordChanged = true
			}
			userValue.FieldByName(fieldName).Set(fieldValue)
		}
	}

	// ถ้ามีการเปลี่ยนแปลงรหัสผ่าน ให้เข้ารหัสก่อนบันทึก
	if passwordChanged && user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = string(hashedPassword)
	} else {
		// ถ้าไม่มีการเปลี่ยนแปลงรหัสผ่าน ให้ใช้รหัสผ่านเดิม
		user.Password = oldPassword
	}

	// บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
	if err := db.DB.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	response := models.UserResponse{}
	copier.Copy(&response, &user)

	ctx.JSON(http.StatusOK, gin.H{"message": "User updated Select Name successfully"})
}

func (u *User) ChangePassword(ctx *gin.Context) {
	var form models.ChangePasswordForm

	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	if form.NewPassword != form.ConfirmPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	var user models.User
	if err := u.DB.First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบรหัสผ่านเก่าด้วย bcrypt
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(form.OldPassword))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "รหัสผ่านเดิมไม่ถูกต้อง"})
		return
	}

	// เข้ารหัสรหัสผ่านใหม่
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(form.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	if err := u.DB.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
