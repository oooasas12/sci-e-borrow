package config

import (
	"log"
	"sci-e-borrow-backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func InitDB() {
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	dsn := "root:rootpassword@tcp(127.0.0.1:3306)/e-borrow?charset=utf8mb4&parseTime=True&loc=Local"
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
		&models.BorrowStatus{},
		&models.EquipmentStatus{},
		&models.EquipmentName{},
		&models.Unit{},
		&models.BudgetSource{},
		&models.SetTime{}); err != nil {
		log.Fatal("❌ AutoMigrate failed:", err)
	}
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
