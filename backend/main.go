package main

import (
	"log"
	"os"
	"sci-e-borrow-backend/config"
	"sci-e-borrow-backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config.InitDB()
	defer config.CloseDB()
	// ตรวจสอบว่า DB ถูกเชื่อมต่อแล้ว
	// config.GetDB()
	r := gin.Default()

	routes.Server(r)

	r.Run(":" + os.Getenv("port"))
}
