package initialize

import (
	"fmt"
	"time"

	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDatabase() {
	db := global.Config.Database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		db.Host, db.Username, db.Password, db.DBName, db.Port, db.SSLMode)

	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		global.Logger.Error("Failed to connect to database", zap.Error(err))
		panic(err)
	}

	sqlDB, err := gormDB.DB()
	if err != nil {
		panic(err)
	}

	// Connection pool settings
	sqlDB.SetMaxIdleConns(db.MaxIdleConns)
	sqlDB.SetMaxOpenConns(db.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Hour)

	global.DB = gormDB
	global.Logger.Info("Connected to PostgreSQL successfully")
}
