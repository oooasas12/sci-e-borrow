package models

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentBroken struct {
	gorm.Model
	DateBroken        time.Time `gorm:"type:DATE"`
	Detail            string    `gorm:"type:varchar(255)"`
	EquipmentID       uint
	Equipment         Equipment
	EquipmentStatusID uint
	EquipmentStatus   EquipmentStatus
}

type CreateEquipmentBrokenForm struct {
	DateBroken        time.Time `form:"date_broken" binding:"required"`
	Detail            string    `form:"detail"`
	EquipmentID       uint      `form:"equipment_id" binding:"required"`
	EquipmentStatusID uint      `form:"equipment_status_id"`
}

type EquipmentBrokenResponse struct {
	ID              uint              `json:"id"`
	DateBroken      time.Time         `json:"date_broken"`
	Detail          string            `json:"detail"`
	Equipment       EquipmentResponse `json:"equipment"`
	EquipmentStatus GenaralRepornse   `json:"equipment_status"`
}
