package models

import (
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
	BorrowStatusID    uint
	BorrowStatus      BorrowStatus
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
	Code              string `form:"code" binding:"required"`
	Value             string `form:"value" binding:"required"`
	DateCome          string `form:"date_come"`
	Feature           string `form:"feature"`
	Location          string `form:"location"`
	EquipmentStatusID uint   `form:"equipment_status_id"`
	BorrowStatusID    uint   `form:"borrow_status_id"`
	BudgetSourceID    uint   `form:"budget_source_id" binding:"required"`
	UnitID            uint   `form:"unit_id" binding:"required"`
	EquipmentGroupID  uint   `form:"equipment_group_id" binding:"required"`
	EquipmentNameID   uint   `form:"equipment_name_id" binding:"required"`
}

type UpdateByNameEquipmentForm struct {
	Code              string `form:"code" binding:"omitempty"`
	Value             string `form:"value" binding:"omitempty"`
	DateCome          string `form:"date_come" binding:"omitempty"`
	Feature           string `form:"feature" binding:"omitempty"`
	Location          string `form:"location" binding:"omitempty"`
	EquipmentStatusID uint   `form:"equipment_status_id" binding:"omitempty"`
	BorrowStatusID    uint   `form:"borrow_status_id" binding:"omitempty"`
	BudgetSourceID    uint   `form:"budget_source_id" binding:"omitempty"`
	UnitID            uint   `form:"unit_id" binding:"omitempty"`
	EquipmentGroupID  uint   `form:"equipment_group_id" binding:"omitempty"`
	EquipmentNameID   uint   `form:"equipment_name_id" binding:"omitempty"`
}

type EquipmentResponse struct {
	ID              uint                   `json:"id"`
	Code            string                 `json:"code"`
	Value           string                 `json:"value"`
	DateCome        string                 `json:"date_come"`
	Feature         string                 `json:"feature"`
	Location        string                 `json:"location"`
	EquipmentStatus GenaralRepornse        `json:"equipment_status"`
	BorrowStatus    GenaralRepornse        `json:"borrow_status"`
	BudgetSource    GenaralRepornse        `json:"budget_source"`
	Unit            GenaralRepornse        `json:"unit"`
	EquipmentGroup  EquipmentGroupRepornse `json:"equipment_group"`
	EquipmentName   GenaralRepornse        `json:"equipment_name"`
}
