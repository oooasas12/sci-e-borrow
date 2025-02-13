package routes

import (
	"sci-e-borrow-backend/config"
	"sci-e-borrow-backend/controllers"

	"github.com/gin-gonic/gin"
)

func Server(r *gin.Engine) {

	db := config.GetDB()
	userGroup := r.Group("/api/users")
	userController := controllers.User{DB: db}
	{
		userGroup.GET("", userController.FindAll)
		userGroup.GET("/:id", userController.FindOne)
		userGroup.PUT("/:id", userController.Update)
		userGroup.POST("", userController.Create)
		userGroup.DELETE("/:id", userController.Delete)
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

	BorrowStatusGroup := r.Group("/api/borrow-status")
	BorrowStatusController := controllers.BorrowStatus{DB: db}
	{
		BorrowStatusGroup.GET("", BorrowStatusController.FindAll)
		BorrowStatusGroup.GET("/:id", BorrowStatusController.FindOne)
		BorrowStatusGroup.PUT("/:id", BorrowStatusController.Update)
		BorrowStatusGroup.POST("", BorrowStatusController.Create)
		BorrowStatusGroup.DELETE("/:id", BorrowStatusController.Delete)
	}

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

}
