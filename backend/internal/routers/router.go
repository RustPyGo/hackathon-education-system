package routers

import (
	"github.com/RustPyGo/hackathon-education-system/backend/internal/controllers"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.Default() // Initialize the Gin router with default middleware (logger and recovery)

	v1 := r.Group("/v1") // Create a new route group for version 1 of the API
	{
		v1.GET("/ping", controllers.NewPongController().Pong) // Define the /ping endpoint
		// v1.GET("/user", controllers.NewUserController().GetUser) // Define the /user endpoint
	}

	return r
}
