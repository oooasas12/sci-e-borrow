package models

import (
	"gorm.io/gorm"
)

type BorrowListDetail struct {
	gorm.Model
	BorrowListID uint
	BorrowList   BorrowList
	EquipmentID  uint
	Equipment    Equipment
}

type CreateBorrowListDetailForm struct {
	BorrowListID uint `form:"borrow_list_id" binding:"required"`
	EquipmentID  uint `form:"equipment_id" binding:"required"`
}

type BorrowListDetailResponse struct {
	ID         uint       `json:"id"`
	BorrowList BorrowList `json:"borrow_list"`
	Equipment  Equipment  `json:"equipment"`
}
