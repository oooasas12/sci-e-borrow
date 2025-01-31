package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name             string `gorm:"unique;not null"`
	Username         string `gorm:"unique;not null"`
	Password         string `gorm:"unique;not null"`
	PositionFacID    uint
	PositionFac      PositionFac
	PositionBranchID uint
	PositionBranch   PositionBranch
	BranchID         uint
	Branch           Branch
}

type CreateUserForm struct {
	Name     string `form:"name" binding:"required"`
	Username string `form:"username" binding:"required"`
	Password string `form:"password" binding:"required"`
}
