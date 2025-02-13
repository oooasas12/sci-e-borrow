package models

import (
	"time"

	"gorm.io/gorm"
)

type SetTime struct {
	gorm.Model
	DateStart time.Time `gorm:"type:DATE;not null"` // เก็บเฉพาะวันที่ (YYYY-MM-DD)
	DateStop  time.Time `gorm:"type:DATE;not null"`
	TimeStart string    `gorm:"type:varchar(10);not null"` // เก็บเฉพาะเวลา (HH:MM:SS)
	TimeStop  string    `gorm:"type:varchar(10);not null"`
	Note      string    `gorm:"type:varchar(255);not null"`
	UserID    uint      `gorm:"not null"`
	User      User
}

type CreateSetTimeForm struct {
	DateStart time.Time `form:"date_start" binding:"required" time_format:"2006-01-02"`
	DateStop  time.Time `form:"date_stop" binding:"required" time_format:"2006-01-02"`
	TimeStart string    `form:"time_start" binding:"required"` // อาจต้องแปลงเป็น time.Time ภายหลัง
	TimeStop  string    `form:"time_stop" binding:"required"`
	Note      string    `form:"note" binding:"required"`
	UserID    uint      `form:"user_id" binding:"required"`
}

type SetTimeResponse struct {
	ID        uint         `json:"id"`
	DateStart time.Time    `json:"date_start"`
	DateStop  time.Time    `json:"date_stop"`
	TimeStart string       `json:"time_start"`
	TimeStop  string       `json:"time_stop"`
	Note      string       `json:"note"`
	User      UserResponse `json:"user"`
}
