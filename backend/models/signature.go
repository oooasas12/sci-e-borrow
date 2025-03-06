package models

import (
	"mime/multipart"

	"gorm.io/gorm"
)

type Signature struct {
	gorm.Model
	UserID    uint   `json:"user_id" gorm:"not null"`
	ImagePath string `json:"image_path" gorm:"not null"`
	ImageName string `json:"image_name" gorm:"not null"`
	User      User   `json:"user" gorm:"foreignKey:UserID"`
}

type CreateSignatureForm struct {
	UserID uint                  `form:"user_id" binding:"required"`
	Image  *multipart.FileHeader `form:"image" binding:"required"`
}

type SignatureResponse struct {
	ID        uint   `json:"id"`
	ImagePath string `json:"image_path"`
	ImageName string `json:"image_name"`
}
