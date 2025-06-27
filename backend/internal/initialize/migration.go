package initialize

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/internal/models"
)

func AutoMigrate() {
	err := global.DB.AutoMigrate(
		&models.User{},
	)

	if err != nil {
		global.Logger.Error("Failed to migrate database: " + err.Error())
		panic("Failed to migrate database: " + err.Error())
	}

	global.Logger.Info("Database migration completed successfully")
}
