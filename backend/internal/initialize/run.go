package initialize

import (
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
)

func Init() {
	LoadConfig()
	InitLogger()
	InitRedis()
	InitDatabase()
	AutoMigrate()

	r := InitRouter()

	port := global.Config.Server.Port
	global.Logger.Info(fmt.Sprintf("Server starting on port %d", port))
	r.Run(fmt.Sprintf(":%d", port))
}
