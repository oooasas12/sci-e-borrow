package routes

import (
	"sci-e-borrow-backend/config"
	"sci-e-borrow-backend/controllers"

	"github.com/gin-gonic/gin"
)

func Server(r *gin.Engine) {
	// // เพิ่ม CORS middleware
	// r.Use(func(c *gin.Context) {
	// 	c.Header("Access-Control-Allow-Origin", "*")
	// 	c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
	// 	c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	// 	if c.Request.Method == "OPTIONS" {
	// 		c.AbortWithStatus(204)
	// 		return
	// 	}

	// 	c.Next()
	// })

	db := config.GetDB()
	userGroup := r.Group("/api/users")
	userController := controllers.User{DB: db}
	{
		userGroup.GET("", userController.FindAll)
		userGroup.GET("/:id", userController.FindOne)
		userGroup.PUT("/:id", userController.Update)
		userGroup.PATCH("/:id", userController.UpdateByName)
		userGroup.POST("", userController.Create)
		userGroup.DELETE("/:id", userController.Delete)
		userGroup.PATCH("/password/:id", userController.ChangePassword)
	}

	branchGroup := r.Group("/api/branch")
	branchController := controllers.Branchs{DB: db}
	{
		branchGroup.GET("", branchController.FindAll)
		branchGroup.GET("/:id", branchController.FindOne)
		branchGroup.PUT("/:id", branchController.Update)
		branchGroup.POST("", branchController.Create)
		branchGroup.DELETE("/:id", branchController.Delete)
	}

	PositionBranchGroup := r.Group("/api/position-branch")
	PositionBranchController := controllers.PositionBranchs{DB: db}
	{
		PositionBranchGroup.GET("", PositionBranchController.FindAll)
		PositionBranchGroup.GET("/:id", PositionBranchController.FindOne)
		PositionBranchGroup.PUT("/:id", PositionBranchController.Update)
		PositionBranchGroup.POST("", PositionBranchController.Create)
		PositionBranchGroup.DELETE("/:id", PositionBranchController.Delete)
	}

	PositionFacGroup := r.Group("/api/position-fac")
	PositionFacController := controllers.PositionFac{DB: db}
	{
		PositionFacGroup.GET("", PositionFacController.FindAll)
		PositionFacGroup.GET("/:id", PositionFacController.FindOne)
		PositionFacGroup.PUT("/:id", PositionFacController.Update)
		PositionFacGroup.POST("", PositionFacController.Create)
		PositionFacGroup.DELETE("/:id", PositionFacController.Delete)
	}

	EquipmentGroup_Group := r.Group("/api/equipment-group")
	EquipmentGroupController := controllers.EquipmentGroup{DB: db}
	{
		EquipmentGroup_Group.GET("", EquipmentGroupController.FindAll)
		EquipmentGroup_Group.GET("/:id", EquipmentGroupController.FindOne)
		EquipmentGroup_Group.PUT("/:id", EquipmentGroupController.Update)
		EquipmentGroup_Group.POST("", EquipmentGroupController.Create)
		EquipmentGroup_Group.DELETE("/:id", EquipmentGroupController.Delete)
	}

	EquipmentStatusGroup := r.Group("/api/equipment-status")
	EquipmentStatusController := controllers.EquipmentStatus{DB: db}
	{
		EquipmentStatusGroup.GET("", EquipmentStatusController.FindAll)
		EquipmentStatusGroup.GET("/:id", EquipmentStatusController.FindOne)
		EquipmentStatusGroup.PUT("/:id", EquipmentStatusController.Update)
		EquipmentStatusGroup.POST("", EquipmentStatusController.Create)
		EquipmentStatusGroup.DELETE("/:id", EquipmentStatusController.Delete)
	}

	// BorrowStatusGroup := r.Group("/api/borrow-status")
	// BorrowStatusController := controllers.BorrowStatus{DB: db}
	// {
	// 	BorrowStatusGroup.GET("", BorrowStatusController.FindAll)
	// 	BorrowStatusGroup.GET("/:id", BorrowStatusController.FindOne)
	// 	BorrowStatusGroup.PUT("/:id", BorrowStatusController.Update)
	// 	BorrowStatusGroup.POST("", BorrowStatusController.Create)
	// 	BorrowStatusGroup.DELETE("/:id", BorrowStatusController.Delete)
	// }

	ApprovalStatusGroup := r.Group("/api/approval-status")
	ApprovalStatusController := controllers.ApprovalStatus{DB: db}
	{
		ApprovalStatusGroup.GET("", ApprovalStatusController.FindAll)
		ApprovalStatusGroup.GET("/:id", ApprovalStatusController.FindOne)
		ApprovalStatusGroup.PUT("/:id", ApprovalStatusController.Update)
		ApprovalStatusGroup.POST("", ApprovalStatusController.Create)
		ApprovalStatusGroup.DELETE("/:id", ApprovalStatusController.Delete)
	}

	EquipmentNameGroup := r.Group("/api/equipment-name")
	EquipmentNameController := controllers.EquipmentName{DB: db}
	{
		EquipmentNameGroup.GET("", EquipmentNameController.FindAll)
		EquipmentNameGroup.GET("/:id", EquipmentNameController.FindOne)
		EquipmentNameGroup.PUT("/:id", EquipmentNameController.Update)
		EquipmentNameGroup.POST("", EquipmentNameController.Create)
		EquipmentNameGroup.DELETE("/:id", EquipmentNameController.Delete)
	}

	UnitGroup := r.Group("/api/unit")
	UnitController := controllers.Unit{DB: db}
	{
		UnitGroup.GET("", UnitController.FindAll)
		UnitGroup.GET("/:id", UnitController.FindOne)
		UnitGroup.PUT("/:id", UnitController.Update)
		UnitGroup.POST("", UnitController.Create)
		UnitGroup.DELETE("/:id", UnitController.Delete)
	}

	BudgetSourceGroup := r.Group("/api/budget-source")
	BudgetSourceController := controllers.BudgetSource{DB: db}
	{
		BudgetSourceGroup.GET("", BudgetSourceController.FindAll)
		BudgetSourceGroup.GET("/:id", BudgetSourceController.FindOne)
		BudgetSourceGroup.PUT("/:id", BudgetSourceController.Update)
		BudgetSourceGroup.POST("", BudgetSourceController.Create)
		BudgetSourceGroup.DELETE("/:id", BudgetSourceController.Delete)
	}

	SetTimeGroup := r.Group("/api/set-time")
	SetTimeController := controllers.SetTime{DB: db}
	{
		SetTimeGroup.GET("", SetTimeController.FindAll)
		SetTimeGroup.GET("/:id", SetTimeController.FindOne)
		SetTimeGroup.PUT("/:id", SetTimeController.Update)
		SetTimeGroup.POST("", SetTimeController.Create)
		SetTimeGroup.DELETE("/:id", SetTimeController.Delete)
		SetTimeGroup.GET("/check", SetTimeController.CheckCurrentTime)
	}

	EquipmentGroup := r.Group("/api/equipment")
	EquipmentController := controllers.Equipment{DB: db}
	{
		EquipmentGroup.GET("", EquipmentController.FindAll)
		EquipmentGroup.GET("/:id", EquipmentController.FindOne)
		EquipmentGroup.GET("/find-data-free", EquipmentController.FindDatafree)
		EquipmentGroup.GET("/find-data-borrow", EquipmentController.FindDataBorrow)
		EquipmentGroup.GET("/find-data-broken", EquipmentController.FindDataEquipmentBroken)
		EquipmentGroup.GET("/find-data-lost", EquipmentController.FindDataEquipmentLost)
		EquipmentGroup.GET("/find-data-unable", EquipmentController.FindDataEquipmentUnableUse)
		EquipmentGroup.GET("/find-data-inform-broken", EquipmentController.FindDataEquipmentInformBroken)
		EquipmentGroup.PUT("/:id", EquipmentController.Update)
		EquipmentGroup.PATCH("/:id", EquipmentController.UpdateByName)
		EquipmentGroup.POST("", EquipmentController.Create)
		EquipmentGroup.DELETE("/:id", EquipmentController.Delete)
	}

	EquipmentBrokenGroup := r.Group("/api/equipment-broken")
	EquipmentBrokenController := controllers.EquipmentBroken{DB: db}
	{
		EquipmentBrokenGroup.GET("", EquipmentBrokenController.FindAll)
		EquipmentBrokenGroup.GET("/:id", EquipmentBrokenController.FindOne)
		EquipmentBrokenGroup.GET("/user/:id", EquipmentBrokenController.FindByUserID)
		EquipmentBrokenGroup.GET("/branch/:id", EquipmentBrokenController.FindByBranchID)
		EquipmentBrokenGroup.PUT("/:id", EquipmentBrokenController.Update)
		EquipmentBrokenGroup.PATCH("/:id", EquipmentBrokenController.UpdateByName)
		EquipmentBrokenGroup.PATCH("/update-status", EquipmentBrokenController.UpdateStatus)
		EquipmentBrokenGroup.POST("", EquipmentBrokenController.Create)
		EquipmentBrokenGroup.DELETE("/:id", EquipmentBrokenController.Delete)
	}

	BorrowListGroup := r.Group("/api/borrow-list")
	BorrowListController := controllers.BorrowList{DB: db}
	{
		BorrowListGroup.GET("", BorrowListController.FindAll)
		BorrowListGroup.GET("/user/:id", BorrowListController.FindByUserID)
		BorrowListGroup.GET("/:id", BorrowListController.FindOne)
		BorrowListGroup.GET("/branch/:id", BorrowListController.FindByBranchID)
		BorrowListGroup.GET("/pdf/:file_name", BorrowListController.GetPDFFile)
		BorrowListGroup.GET("/equipment-last-use/:id", BorrowListController.FindLastUserBorrowedEquipment)
		BorrowListGroup.PATCH("/update-date-return/:id", BorrowListController.UpdateDateReturn)
		BorrowListGroup.PATCH("/update-status-borrow/:id", BorrowListController.UpdateStatusBorrow)
		BorrowListGroup.PATCH("/update-status-return/:id", BorrowListController.UpdateStatusReturn)
		BorrowListGroup.PUT("/:id", BorrowListController.Update)
		BorrowListGroup.PATCH("/:id", BorrowListController.UpdateByName)
		BorrowListGroup.POST("", BorrowListController.Create)
		BorrowListGroup.DELETE("/:id", BorrowListController.Delete)
	}

	BorrowListDetailGroup := r.Group("/api/borrow-list-detail")
	BorrowListDetailController := controllers.BorrowListDetail{DB: db}
	{
		BorrowListDetailGroup.GET("/:id", BorrowListDetailController.FindByBorrowListID)
		BorrowListDetailGroup.POST("", BorrowListDetailController.Create)
		BorrowListDetailGroup.DELETE("", BorrowListDetailController.Delete)
	}

	signatureGroup := r.Group("/api/signature")
	signatureController := controllers.Signature{DB: db}
	{
		signatureGroup.POST("/upload", signatureController.Upload)
		signatureGroup.GET("/image/:image_path", signatureController.GetSignatureImage)
		signatureGroup.GET("/user/:user_id", signatureController.GetSignatureByUser)
		signatureGroup.DELETE("/:id", signatureController.DeleteSignature)
	}

	loginController := controllers.Login{DB: db}
	r.POST("/api/login", loginController.Login)

	dashboardGroup := r.Group("/api/dashboard")
	dashboardController := controllers.Dashboard{DB: db}
	{
		dashboardGroup.GET("", dashboardController.GetDashboardData)
		dashboardGroup.GET("/borrow-stats", dashboardController.GetBorrowStats)
		dashboardGroup.GET("/yearly-borrow-stats", dashboardController.GetYearlyBorrowStats)
	}

	// เพิ่ม route สำหรับการนำเข้าข้อมูล
	importGroup := r.Group("/api/import")
	importController := controllers.Import{DB: db}
	{
		importGroup.GET("/equipment", importController.ImportEquipmentFromCSV)
		importGroup.POST("/equipment", importController.UploadAndImportCSV)
	}
}
