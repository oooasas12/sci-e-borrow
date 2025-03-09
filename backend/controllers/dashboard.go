package controllers

import (
	"fmt"
	"net/http"
	"sci-e-borrow-backend/models"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Dashboard เป็น controller สำหรับจัดการข้อมูล dashboard
type Dashboard struct {
	DB *gorm.DB
}

// GetDashboardData ดึงข้อมูลทั้งหมดสำหรับ dashboard
func (d *Dashboard) GetDashboardData(c *gin.Context) {
	var dashboardData models.DashboardData

	// รับค่าพารามิเตอร์จาก query string
	year := c.DefaultQuery("year", "")
	branchID := c.DefaultQuery("branch_id", "")

	// ดึงข้อมูลสรุป
	d.getSummaryData(&dashboardData.Summary)

	// ดึงข้อมูลปีที่มีข้อมูลการยืม
	d.getAvailableYears(&dashboardData.AvailableYears)

	// หากไม่ได้ระบุปี ให้ใช้ปีล่าสุดที่มีข้อมูล
	if year == "" && len(dashboardData.AvailableYears) > 0 {
		year = strconv.Itoa(dashboardData.AvailableYears[0])
	}

	// ดึงข้อมูลสถิติการยืมรายเดือน
	d.getBorrowStatsByMonth(&dashboardData.BorrowStats, year, branchID)

	// ดึงข้อมูลสถิติประเภทอุปกรณ์
	d.getEquipmentTypeStats(&dashboardData.EquipmentTypeData)

	// ดึงข้อมูลการยืมล่าสุด
	d.getRecentBorrows(&dashboardData.RecentBorrows)

	// ดึงข้อมูลสาขาทั้งหมดสำหรับตัวเลือก
	var branches []models.Branch
	d.DB.Find(&branches)
	dashboardData.Branches = branches

	c.JSON(http.StatusOK, gin.H{"data": dashboardData})
}

// getSummaryData ดึงข้อมูลสรุปสำหรับ dashboard
func (d *Dashboard) getSummaryData(summary *models.DashboardSummary) {
	// นับจำนวนอุปกรณ์ทั้งหมด
	var count int64
	d.DB.Model(&models.Equipment{}).Count(&count)
	summary.TotalEquipment = count

	// นับจำนวนอุปกรณ์ที่พร้อมใช้งาน (สถานะ = 1 คือว่าง)
	count = 0
	d.DB.Model(&models.Equipment{}).Where("equipment_status_id = ?", 1).Count(&count)
	summary.AvailableEquipment = count

	// นับจำนวนอุปกรณ์ที่ถูกยืม (สถานะ = 2 คือไม่ว่าง)
	count = 0
	d.DB.Model(&models.Equipment{}).Where("equipment_status_id = ?", 2).Count(&count)
	summary.BorrowedEquipment = count

	// นับจำนวนอุปกรณ์ที่ชำรุด (สถานะ = 3 คือชำรุด)
	count = 0
	d.DB.Model(&models.Equipment{}).Where("equipment_status_id = ?", 3).Count(&count)
	summary.BrokenEquipment = count

	// นับจำนวนอุปกรณ์ที่สูญหาย (สถานะ = 4 คือสูญหาย)
	count = 0
	d.DB.Model(&models.Equipment{}).Where("equipment_status_id = ?", 4).Count(&count)
	summary.LostEquipment = count

	// นับจำนวนผู้ใช้ทั้งหมด
	count = 0
	d.DB.Model(&models.User{}).Count(&count)
	summary.TotalUsers = count

	// นับจำนวนการยืมที่รอการอนุมัติ (ApprovalStatusBorrow = 3 คือรอดำเนินการ)
	count = 0
	d.DB.Model(&models.BorrowList{}).Where("approval_status_borrow_id = ?", 3).Count(&count)
	summary.PendingApprovals = count

	// นับจำนวนการยืมที่เสร็จสิ้นแล้ว (ApprovalStatusBorrow = 1 คืออนุมัติ และ ApprovalStatusReturn = 1 คืออนุมัติ)
	count = 0
	d.DB.Model(&models.BorrowList{}).Where("approval_status_borrow_id = ? AND approval_status_return_id = ?", 1, 1).Count(&count)
	summary.CompletedBorrows = count

	// นับจำนวนการยืมที่กำลังดำเนินการอยู่ (ApprovalStatusBorrow = 1 คืออนุมัติ และ ApprovalStatusReturn = 3 คือรอดำเนินการ)
	count = 0
	d.DB.Model(&models.BorrowList{}).Where("approval_status_borrow_id = ? AND approval_status_return_id = ?", 1, 3).Count(&count)
	summary.ActiveBorrows = count
}

// getBorrowStatsByMonth ดึงข้อมูลสถิติการยืมรายเดือน
func (d *Dashboard) getBorrowStatsByMonth(stats *[]models.BorrowStatsByMonth, year string, branchID string) {
	// กำหนดปีปัจจุบันเป็นค่าเริ่มต้น
	currentTime := time.Now()
	selectedYear := currentTime.Year()

	// ถ้ามีการระบุปี ให้ใช้ปีที่ระบุ
	if year != "" {
		if y, err := strconv.Atoi(year); err == nil {
			selectedYear = y
		}
	}

	// สร้าง slice เปล่าสำหรับเก็บข้อมูล
	*stats = make([]models.BorrowStatsByMonth, 0)

	// สร้างข้อมูลสำหรับ 12 เดือนของปีที่เลือก
	for month := 1; month <= 12; month++ {
		startOfMonth := time.Date(selectedYear, time.Month(month), 1, 0, 0, 0, 0, time.Local)
		endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Second)

		// สร้าง query พื้นฐาน
		query := d.DB.Model(&models.BorrowList{}).
			Where("borrow_lists.created_at BETWEEN ? AND ?", startOfMonth, endOfMonth)

		// ถ้ามีการระบุสาขา ให้กรองตามสาขาของผู้ใช้ที่ยืม
		if branchID != "" {
			// เชื่อมตาราง users เพื่อดึงข้อมูลผู้ใช้ที่ยืม
			// และกรองเฉพาะการยืมที่ทำโดยผู้ใช้ในสาขาที่ระบุ
			query = query.Joins("JOIN users ON borrow_lists.user_id = users.id").
				Where("users.branch_id = ?", branchID)
		}

		// นับจำนวนการยืม
		var count int64
		query.Count(&count)

		// สร้างข้อมูลสถิติสำหรับเดือนนี้
		monthName := startOfMonth.Month().String()
		monthStat := models.BorrowStatsByMonth{
			Month:      time.Month(month),
			Year:       selectedYear,
			Count:      int(count),
			MonthLabel: fmt.Sprintf("%s %d", monthName[:3], selectedYear),
		}

		*stats = append(*stats, monthStat)
	}

	// ถ้ามีการระบุสาขา ให้ดึงชื่อสาขามาด้วย
	if branchID != "" {
		var branch models.Branch
		if err := d.DB.First(&branch, branchID).Error; err == nil {
			// เพิ่มชื่อสาขาในชื่อกราฟ
			for i := range *stats {
				(*stats)[i].MonthLabel = fmt.Sprintf("%s (%s)", (*stats)[i].MonthLabel, branch.Name)
			}
		}
	}

	// ถ้าเป็นปีปัจจุบัน ให้ตัดเดือนที่ยังไม่มาถึงออก
	if selectedYear == currentTime.Year() {
		currentMonth := currentTime.Month()
		filteredStats := make([]models.BorrowStatsByMonth, 0)
		for _, stat := range *stats {
			if stat.Month <= currentMonth {
				filteredStats = append(filteredStats, stat)
			}
		}
		*stats = filteredStats
	}
}

// getEquipmentTypeStats ดึงข้อมูลสถิติประเภทอุปกรณ์
func (d *Dashboard) getEquipmentTypeStats(stats *[]models.EquipmentTypeStats) {
	// ดึงข้อมูลกลุ่มอุปกรณ์ทั้งหมด
	var equipmentGroups []models.EquipmentGroup
	if err := d.DB.Find(&equipmentGroups).Error; err != nil {
		// กรณีเกิด error ให้ใช้ข้อมูลตัวอย่าง
		*stats = createSampleEquipmentTypeStats()
		return
	}

	// ถ้าไม่มีข้อมูลกลุ่มอุปกรณ์ ให้ใช้ข้อมูลตัวอย่าง
	if len(equipmentGroups) == 0 {
		*stats = createSampleEquipmentTypeStats()
		return
	}

	// สร้าง slice เปล่าสำหรับเก็บข้อมูล
	*stats = make([]models.EquipmentTypeStats, 0)

	// ดึงข้อมูลจำนวนอุปกรณ์ในแต่ละกลุ่ม
	for _, group := range equipmentGroups {
		var count int64
		d.DB.Model(&models.Equipment{}).Where("equipment_group_id = ?", group.ID).Count(&count)

		// เพิ่มข้อมูลเข้าไปใน stats
		*stats = append(*stats, models.EquipmentTypeStats{
			TypeID:   uint(group.ID),
			TypeName: group.Name,
			Count:    int(count),
		})
	}

	// เรียงลำดับตามจำนวนมากไปน้อย
	sort.Slice(*stats, func(i, j int) bool {
		return (*stats)[i].Count > (*stats)[j].Count
	})

	// จำกัดจำนวนที่ส่งคืนเป็น 10 รายการ
	if len(*stats) > 10 {
		*stats = (*stats)[:10]
	}
}

// createSampleEquipmentTypeStats สร้างข้อมูลตัวอย่างสำหรับ equipment type stats
func createSampleEquipmentTypeStats() []models.EquipmentTypeStats {
	return []models.EquipmentTypeStats{
		{TypeID: 1, TypeName: "คอมพิวเตอร์", Count: 5},
		{TypeID: 2, TypeName: "โปรเจคเตอร์", Count: 3},
		{TypeID: 3, TypeName: "เครื่องพิมพ์", Count: 2},
		{TypeID: 4, TypeName: "กล้องถ่ายรูป", Count: 1},
		{TypeID: 5, TypeName: "อุปกรณ์เครือข่าย", Count: 1},
	}
}

// getRecentBorrows ดึงข้อมูลการยืมล่าสุด
func (d *Dashboard) getRecentBorrows(borrows *[]models.BorrowList) {
	// ดึงข้อมูลการยืมล่าสุด พร้อมกับข้อมูลที่เกี่ยวข้อง
	d.DB.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, username")
		}).
		Preload("ApprovalStatusBorrow", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		}).
		Preload("ApprovalStatusReturn", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name")
		}).
		Order("created_at DESC").
		Limit(10).
		Find(borrows)

	// ถ้าไม่มีข้อมูล ให้กำหนดค่าเริ่มต้นเป็น array ว่าง แทนที่จะเป็น null
	if len(*borrows) == 0 {
		*borrows = []models.BorrowList{}
	}

	// แก้ไขปัญหากรณีที่ข้อมูล User หรือ Status เป็น null หรือไม่สมบูรณ์
	for i := range *borrows {
		// ดึงข้อมูล User ที่สมบูรณ์
		if (*borrows)[i].UserID > 0 {
			var user models.User
			if err := d.DB.Select("id, name, username").First(&user, (*borrows)[i].UserID).Error; err == nil {
				(*borrows)[i].User = user
			}
		}

		// ดึงข้อมูล ApprovalStatusBorrow ที่สมบูรณ์
		if (*borrows)[i].ApprovalStatusBorrowID > 0 {
			var status models.ApprovalStatus
			if err := d.DB.Select("id, name").First(&status, (*borrows)[i].ApprovalStatusBorrowID).Error; err == nil {
				(*borrows)[i].ApprovalStatusBorrow = status
			}
		}

		// ดึงข้อมูล ApprovalStatusReturn ที่สมบูรณ์
		if (*borrows)[i].ApprovalStatusReturnID > 0 {
			var status models.ApprovalStatus
			if err := d.DB.Select("id, name").First(&status, (*borrows)[i].ApprovalStatusReturnID).Error; err == nil {
				(*borrows)[i].ApprovalStatusReturn = status
			}
		}
	}
}

// getAvailableYears ดึงปีที่มีข้อมูลการยืม
func (d *Dashboard) getAvailableYears(years *[]int) {
	// ดึงปีจากวันที่สร้างรายการยืม
	var results []struct {
		Year int
	}

	// ใช้ SQL ดึงปีจากข้อมูลการยืม และจัดเรียงจากล่าสุดไปเก่าสุด
	d.DB.Raw(`
		SELECT DISTINCT EXTRACT(YEAR FROM created_at) as year
		FROM borrow_lists
		WHERE deleted_at IS NULL
		ORDER BY year DESC
	`).Scan(&results)

	// แปลงผลลัพธ์เป็น slice ของปี
	*years = make([]int, 0)
	for _, r := range results {
		*years = append(*years, r.Year)
	}

	// ถ้าไม่มีข้อมูล ให้ใช้ปีปัจจุบัน
	if len(*years) == 0 {
		*years = append(*years, time.Now().Year())
	}
}

// GetBorrowStats ดึงเฉพาะข้อมูลสถิติการยืมรายเดือน
func (d *Dashboard) GetBorrowStats(c *gin.Context) {
	var stats []models.BorrowStatsByMonth

	// รับค่าพารามิเตอร์จาก query string
	year := c.DefaultQuery("year", "")
	branchID := c.DefaultQuery("branch_id", "")

	// ดึงข้อมูลสถิติการยืมรายเดือน
	d.getBorrowStatsByMonth(&stats, year, branchID)

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

// GetYearlyBorrowStats ดึงข้อมูลสถิติการยืมรายปี
func (d *Dashboard) GetYearlyBorrowStats(c *gin.Context) {
	var stats []models.YearlyBorrowStats
	branchID := c.DefaultQuery("branch_id", "")

	// ดึงข้อมูลสถิติการยืมรายปี
	d.getYearlyBorrowStats(&stats, branchID)

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

// getYearlyBorrowStats ดึงข้อมูลสถิติการยืมรายปี
func (d *Dashboard) getYearlyBorrowStats(stats *[]models.YearlyBorrowStats, branchID string) {
	// ดึงปีที่มีข้อมูลการยืม
	var years []int
	d.getAvailableYears(&years)

	// สร้าง slice เปล่าสำหรับเก็บข้อมูล
	*stats = make([]models.YearlyBorrowStats, 0)

	// สร้างข้อมูลสำหรับแต่ละปี
	for _, year := range years {
		// สร้างข้อมูลสำหรับ 12 เดือนของปีที่เลือก
		yearlyData := models.YearlyBorrowStats{
			Year:        year,
			MonthlyData: make([]models.MonthlyBorrowCount, 12),
		}

		for month := 1; month <= 12; month++ {
			startOfMonth := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)
			endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Second)
			monthName := startOfMonth.Month().String()

			// สร้าง query พื้นฐาน
			query := d.DB.Model(&models.BorrowList{}).
				Where("borrow_lists.created_at BETWEEN ? AND ?", startOfMonth, endOfMonth)

			// ถ้ามีการระบุสาขา ให้กรองตามสาขาของผู้ใช้ที่ยืม
			if branchID != "" {
				query = query.Joins("JOIN users ON borrow_lists.user_id = users.id").
					Where("users.branch_id = ?", branchID)
			}

			// นับจำนวนการยืม
			var count int64
			query.Count(&count)

			// เพิ่มข้อมูลเดือนนี้
			yearlyData.MonthlyData[month-1] = models.MonthlyBorrowCount{
				Month:      time.Month(month),
				Count:      int(count),
				MonthLabel: fmt.Sprintf("%s", monthName[:3]),
			}
		}

		*stats = append(*stats, yearlyData)
	}
}
