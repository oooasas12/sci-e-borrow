package models

import (
	"time"

	"gorm.io/gorm"
)

type Equipment struct {
	gorm.Model
	Code              string `gorm:"unique;not null"`
	Value             string `gorm:"type:varchar(10);not null"`
	DateCome          string `gorm:"type:DATE"`
	Feature           string `gorm:"type:varchar(150)"`
	Location          string `gorm:"type:varchar(150)"`
	EquipmentStatusID uint
	EquipmentStatus   EquipmentStatus
	BudgetSourceID    uint
	BudgetSource      BudgetSource
	UnitID            uint
	Unit              Unit
	EquipmentGroupID  uint
	EquipmentGroup    EquipmentGroup
	EquipmentNameID   uint
	EquipmentName     EquipmentName
}

type CreateEquipmentForm struct {
	Code              string    `form:"code" binding:"required"`
	Value             string    `form:"value" binding:"required"`
	DateCome          time.Time `form:"date_come" time_format:"2006-01-02"`
	Feature           string    `form:"feature"`
	Location          string    `form:"location"`
	EquipmentStatusID uint      `form:"equipment_status_id"`
	BudgetSourceID    uint      `form:"budget_source_id" binding:"required"`
	UnitID            uint      `form:"unit_id" binding:"required"`
	EquipmentGroupID  uint      `form:"equipment_group_id" binding:"required"`
	EquipmentNameID   uint      `form:"equipment_name_id" binding:"required"`
}

type UpdateByNameEquipmentForm struct {
	Code              string     `form:"code" binding:"omitempty"`
	Value             string     `form:"value" binding:"omitempty"`
	DateCome          *time.Time `form:"date_come" binding:"omitempty" time_format:"2006-01-02"`
	Feature           string     `form:"feature" binding:"omitempty"`
	Location          string     `form:"location" binding:"omitempty"`
	EquipmentStatusID uint       `form:"equipment_status_id" binding:"omitempty"`
	BudgetSourceID    uint       `form:"budget_source_id" binding:"omitempty"`
	UnitID            uint       `form:"unit_id" binding:"omitempty"`
	EquipmentGroupID  uint       `form:"equipment_group_id" binding:"omitempty"`
	EquipmentNameID   uint       `form:"equipment_name_id" binding:"omitempty"`
}

type EquipmentResponse struct {
	ID              uint                   `json:"id"`
	Code            string                 `json:"code"`
	Value           string                 `json:"value"`
	DateCome        *time.Time             `json:"date_come"`
	Feature         string                 `json:"feature"`
	Location        string                 `json:"location"`
	EquipmentStatus GenaralResponse        `json:"equipment_status"`
	BudgetSource    GenaralResponse        `json:"budget_source"`
	Unit            GenaralResponse        `json:"unit"`
	EquipmentGroup  EquipmentGroupResponse `json:"equipment_group"`
	EquipmentName   GenaralResponse        `json:"equipment_name"`
}
