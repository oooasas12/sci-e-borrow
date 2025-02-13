package models

import "gorm.io/gorm"

// type DB
type PositionFac struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type PositionBranch struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type Branch struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type EquipmentGroup struct {
	gorm.Model
	Code string `gorm:"unique;not null"`
	Name string `gorm:"unique;not null"`
}

type EquipmentStatus struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type BorrowStatus struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type ApprovalStatus struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type EquipmentName struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type Unit struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

type BudgetSource struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
}

// type Reponse
type GenaralRepornse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type EquipmentGroupRepornse struct {
	ID   uint   `json:"id"`
	Code string `json:"code"`
	Name string `json:"name"`
}
