package models

import (
	"time"
)

// DashboardSummary เป็นโครงสร้างข้อมูลสำหรับสรุปข้อมูลใน dashboard
type DashboardSummary struct {
	TotalEquipment     int64 `json:"totalEquipment"`
	AvailableEquipment int64 `json:"availableEquipment"`
	BorrowedEquipment  int64 `json:"borrowedEquipment"`
	BrokenEquipment    int64 `json:"brokenEquipment"`
	LostEquipment      int64 `json:"lostEquipment"`
	TotalUsers         int64 `json:"totalUsers"`
	PendingApprovals   int64 `json:"pendingApprovals"`
	CompletedBorrows   int64 `json:"completedBorrows"`
	ActiveBorrows      int64 `json:"activeBorrows"`
}

// BorrowStatsByMonth เป็นโครงสร้างข้อมูลสำหรับสถิติการยืมรายเดือน
type BorrowStatsByMonth struct {
	Month      time.Month `json:"month"`
	Year       int        `json:"year"`
	Count      int        `json:"count"`
	MonthLabel string     `json:"monthLabel"`
}

// MonthlyBorrowCount เป็นโครงสร้างข้อมูลสำหรับจำนวนการยืมในแต่ละเดือน
type MonthlyBorrowCount struct {
	Month      time.Month `json:"month"`
	Count      int        `json:"count"`
	MonthLabel string     `json:"monthLabel"`
}

// YearlyBorrowStats เป็นโครงสร้างข้อมูลสำหรับสถิติการยืมรายปี
type YearlyBorrowStats struct {
	Year        int                  `json:"year"`
	MonthlyData []MonthlyBorrowCount `json:"monthlyData"`
}

// EquipmentTypeStats เป็นโครงสร้างข้อมูลสำหรับสถิติประเภทอุปกรณ์
type EquipmentTypeStats struct {
	TypeID   uint   `json:"typeId"`
	TypeName string `json:"typeName"`
	Count    int    `json:"count"`
}

// DashboardData เป็นโครงสร้างข้อมูลหลักสำหรับ dashboard
type DashboardData struct {
	Summary           DashboardSummary     `json:"summary"`
	BorrowStats       []BorrowStatsByMonth `json:"borrowStats"`
	EquipmentTypeData []EquipmentTypeStats `json:"equipmentTypeData"`
	RecentBorrows     []BorrowList         `json:"recentBorrows"`
	Branches          []Branch             `json:"branches"`
	AvailableYears    []int                `json:"availableYears"`
}
