package main

import (
	"log"
	"os"
	"sci-e-borrow-backend/config"
	"sci-e-borrow-backend/routes"

	"github.com/gin-contrib/cors"
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

	// เพิ่ม CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://46e7-223-206-64-225.ngrok-free.app", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routes.Server(r)

	r.Run(":" + os.Getenv("port"))
}
