package models

import (
	"time"

	"gorm.io/gorm"
)

type BorrowDetail struct {
	gorm.Model
	DateBorrow             time.Time `gorm:"type:DATE;not null"`
	DateReturn             time.Time `gorm:"type:DATE"`
	DocBorrow              string    `gorm:"type:varchar(255)"`
	DocReturn              string    `gorm:"type:varchar(255)"`
	ApprovalStatusBorrowID uint
	ApprovalStatusBorrow   ApprovalStatus
	ApprovalStatusReturnID uint
	ApprovalStatusReturn   ApprovalStatus
	UserID                 uint
	User                   User
}

type CreateBorrowDetailForm struct {
	DateBorrow             time.Time  `form:"date_borrow" binding:"required" time_format:"2006-01-02"`
	DateReturn             *time.Time `form:"date_return" time_format:"2006-01-02"`
	DocBorrow              string     `form:"doc_borrow"`
	DocReturn              string     `form:"doc_return"`
	ApprovalStatusBorrowID uint       `form:"approval_status_borrow_id" `
	ApprovalStatusReturnID uint       `form:"approval_status_return_id" `
	UserID                 uint       `form:"user_id" binding:"required"`
}

type UpdateByNameBorrowDetailForm struct {
	DateBorrow             *time.Time `form:"date_borrow" binding:"omitempty" time_format:"2006-01-02"`
	DateReturn             *time.Time `form:"date_return" binding:"omitempty" time_format:"2006-01-02"`
	DocBorrow              string     `form:"doc_borrow" binding:"omitempty"`
	DocReturn              string     `form:"doc_return" binding:"omitempty"`
	ApprovalStatusBorrowID uint       `form:"approval_status_borrow_id" binding:"omitempty"`
	ApprovalStatusReturnID uint       `form:"approval_status_return_id" binding:"omitempty"`
	UserID                 uint       `form:"user_id" binding:"omitempty"`
}

type BorrowDetailResponse struct {
	ID                     uint       `json:"id"`
	DateBorrow             *time.Time `json:"date_borrow"`
	DateReturn             *time.Time `json:"date_return"`
	DocBorrow              string     `json:"doc_borrow"`
	DocReturn              string     `json:"doc_return"`
	ApprovalStatusBorrowID uint       `json:"approval_status_borrow_id"`
	ApprovalStatusReturnID uint       `json:"approval_status_return_id"`
	UserID                 uint       `json:"user_id"`
}
