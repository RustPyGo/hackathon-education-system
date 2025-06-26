package initialize

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/models"
	"go.uber.org/zap"
)

func RunMigrations() {
	err := global.DB.AutoMigrate(
		&models.User{},
		// Thêm các models khác ở đây
	)
	if err != nil {
		global.Logger.Error("Failed to run migrations", zap.Error(err))
		panic(err)
	}
	global.Logger.Info("Database migrations completed")
}
