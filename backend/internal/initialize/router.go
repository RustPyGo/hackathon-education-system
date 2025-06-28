package initialize

import (
	"net/http"

	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/routers"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	var r *gin.Engine
	if global.Config.Server.Mode == "dev" {
		gin.SetMode(gin.DebugMode)
		gin.ForceConsoleColor()
		r = gin.Default()
	} else {
		gin.SetMode(gin.ReleaseMode)
		r = gin.New()
	}

	userRouter := routers.RouterGroupApp.User

	MainGroup := r.Group("/api/v1")
	{
		MainGroup.GET("/CheckStatus", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "ok",
				"message": "Server is running",
			})
		})
	}
	{
		userRouter.InitUserRouter(MainGroup)
	}

	return r
}
