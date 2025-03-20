package config

import (
	"fmt"
	"log"
	"os"
	"sci-e-borrow-backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func InitDB() {
	// ใช้ค่า DSN จาก environment variable
	fmt.Println("database_connect", os.Getenv("database_connect"))
	dsn := os.Getenv("database_connect")
	if dsn == "" {
		// กรณีไม่มีค่าใน environment variable ใช้ค่าเริ่มต้น
		dsn = "root:rootpassword@tcp(mysql:3306)/mydatabase?charset=utf8mb4&parseTime=True&loc=Local"
	}

	var database *gorm.DB
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal(err)
	}

	// อัปเดตตัวแปรระดับแพ็กเกจ `db`
	db = database

	// ตรวจสอบการ Migrate ฐานข้อมูล
	if err := db.AutoMigrate(
		&models.User{},
		&models.Branch{},
		&models.PositionBranch{},
		&models.PositionFac{},
		&models.EquipmentGroup{},
		&models.ApprovalStatus{},
		&models.EquipmentStatus{},
		&models.EquipmentName{},
		&models.Unit{},
		&models.BudgetSource{},
		&models.SetTime{},
		&models.Equipment{},
		&models.EquipmentBroken{},
		&models.BorrowList{},
		&models.BorrowListDetail{},
		&models.Signature{}); err != nil {
		log.Fatal("❌ AutoMigrate failed:", err)
	}
	// &models.BorrowStatus{},
}

func GetDB() *gorm.DB {
	if db == nil {
		log.Println("⚠️ Database connection is not initialized")
	}
	return db
}

func CloseDB() {
	sqlDB, err := db.DB()
	if err != nil {
		log.Println("Error getting DB instance:", err)
		return
	}
	sqlDB.Close()
}
