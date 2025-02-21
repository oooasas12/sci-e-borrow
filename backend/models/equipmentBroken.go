package models

import (
	"time"

	"gorm.io/gorm"
)

type EquipmentBroken struct {
	gorm.Model
	DateBroken        time.Time  `gorm:"type:DATE"`
	DateEndRepair     *time.Time `gorm:"type:DATE"`
	Detail            string     `gorm:"type:varchar(255)"`
	EquipmentID       uint
	Equipment         Equipment
	EquipmentStatusID uint
	EquipmentStatus   EquipmentStatus
}

type CreateEquipmentBrokenForm struct {
	DateBroken        time.Time  `form:"date_broken" binding:"required" time_format:"2006-01-02"`
	DateEndRepair     *time.Time `form:"date_end_repair" binding:"omitempty" time_format:"2006-01-02"`
	Detail            string     `form:"detail"`
	EquipmentID       uint       `form:"equipment_id" binding:"required"`
	EquipmentStatusID uint       `form:"equipment_status_id"`
}

type UpdateByNameEquipmentBrokenForm struct {
	DateBroken        *time.Time `form:"date_broken" binding:"omitempty" time_format:"2006-01-02"`
	DateEndRepair     *time.Time `form:"date_end_repair" binding:"omitempty" time_format:"2006-01-02"`
	Detail            string     `form:"detail" binding:"omitempty"`
	EquipmentID       uint       `form:"equipment_id" binding:"omitempty"`
	EquipmentStatusID uint       `form:"equipment_status_id" binding:"omitempty"`
}

type UpdateStatusBrokenForm struct {
	ID                []string `form:"id[]" binding:"required"`
	EquipmentStatusID string   `form:"equipment_status_id" binding:"required"`
}

type EquipmentBrokenResponse struct {
	ID              uint              `json:"id"`
	DateBroken      *time.Time        `json:"date_broken"`
	DateEndRepair   *time.Time        `json:"date_end_repair"`
	Detail          string            `json:"detail"`
	Equipment       EquipmentResponse `json:"equipment"`
	EquipmentStatus GenaralRepornse   `json:"equipment_status"`
}
