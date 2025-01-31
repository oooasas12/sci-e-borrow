package models

import "gorm.io/gorm"

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

type BranchRepornse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
