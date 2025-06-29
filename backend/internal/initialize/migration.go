package initialize

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
)

func enableUUIDExtension() error {
	// Enable UUID extension
	err := global.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"").Error
	if err != nil {
		global.Logger.Error("Failed to enable UUID extension: " + err.Error())
		return err
	}
	global.Logger.Info("UUID extension enabled successfully")
	return nil
}

func AutoMigrate() {
	// Enable UUID extension first
	if err := enableUUIDExtension(); err != nil {
		panic("Failed to enable UUID extension: " + err.Error())
	}

	// Auto migrate all models in dependency order
	err := global.DB.AutoMigrate(
		&models.User{},           // No dependencies
		&models.Project{},        // Depends on User
		&models.Document{},       // Depends on Project
		&models.Question{},       // Depends on Project
		&models.QuestionChoice{}, // Depends on Question
		&models.Response{},       // Depends on Project and User
		&models.Answer{},         // Depends on Response, Question, and QuestionChoice
		&models.ChatMessage{},    // Depends on Project
	)

	if err != nil {
		global.Logger.Error("Failed to migrate database: " + err.Error())
		panic("Failed to migrate database: " + err.Error())
	}

	global.Logger.Info("Database migration completed successfully")
}
