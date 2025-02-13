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
		userGroup.DELETE("", userController.Delete)
	}

	branchGroup := r.Group("/api/branch")
	branchController := controllers.Branchs{DB: db}
	{
		branchGroup.GET("", branchController.FindAll)
		branchGroup.GET("/:id", branchController.FindOne)
		branchGroup.PUT("/:id", branchController.Update)
		branchGroup.POST("", branchController.Create)
		branchGroup.DELETE("", branchController.Delete)
	}

	PositionBranchGroup := r.Group("/api/position-branch")
	PositionBranchController := controllers.PositionBranchs{DB: db}
	{
		PositionBranchGroup.GET("", PositionBranchController.FindAll)
		PositionBranchGroup.GET("/:id", PositionBranchController.FindOne)
		PositionBranchGroup.PUT("/:id", PositionBranchController.Update)
		PositionBranchGroup.POST("", PositionBranchController.Create)
		PositionBranchGroup.DELETE("", PositionBranchController.Delete)
	}

	PositionFacGroup := r.Group("/api/position-fac")
	PositionFacController := controllers.PositionFac{DB: db}
	{
		PositionFacGroup.GET("", PositionFacController.FindAll)
		PositionFacGroup.GET("/:id", PositionFacController.FindOne)
		PositionFacGroup.PUT("/:id", PositionFacController.Update)
		PositionFacGroup.POST("", PositionFacController.Create)
		PositionFacGroup.DELETE("", PositionFacController.Delete)
	}

}
