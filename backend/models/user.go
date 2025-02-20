package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name             string `gorm:"type:varchar(255);not null"`
	Username         string `gorm:"unique;not null"`
	Password         string `gorm:"type:varchar(255);not null"`
	PositionFacID    uint
	PositionFac      PositionFac
	PositionBranchID uint
	PositionBranch   PositionBranch
	BranchID         uint
	Branch           Branch
}

type CreateUserForm struct {
	Name             string `form:"name" binding:"required"`
	Username         string `form:"username" binding:"required"`
	Password         string `form:"password" binding:"required"`
	PositionFacID    uint   `form:"position_fac_id" binding:"required"`
	PositionBranchID uint   `form:"position_branch_id" binding:"required"`
	BranchID         uint   `form:"branch_id" binding:"required"`
}

type UpdateByNameUserForm struct {
	Name             string `form:"name" binding:"omitempty"`
	Username         string `form:"username" binding:"omitempty"`
	Password         string `form:"password" binding:"omitempty"`
	PositionFacID    uint   `form:"position_fac_id" binding:"omitempty"`
	PositionBranchID uint   `form:"position_branch_id" binding:"omitempty"`
	BranchID         uint   `form:"branch_id" binding:"omitempty"`
}

type UserResponse struct {
	ID             uint            `json:"id"`
	Name           string          `json:"name"`
	Username       string          `json:"username"`
	PositionFac    GenaralRepornse `json:"position_fac"`
	PositionBranch GenaralRepornse `json:"position_branch"`
	Branch         GenaralRepornse `json:"branch"`
}
