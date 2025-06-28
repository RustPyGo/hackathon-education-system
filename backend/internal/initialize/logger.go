package initialize

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/logger"
)

func InitLogger() {
	// Initialize the logger
	// This is a placeholder function. You can implement the actual initialization logic here.
	global.Logger = logger.NewLoggerZap()
}
