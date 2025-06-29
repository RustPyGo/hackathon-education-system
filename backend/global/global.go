package global

import (
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/logger"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/setting"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

var (
	Config      setting.Config
	Logger      *logger.LoggerZap
	RedisClient *redis.Client
	DB          *gorm.DB
)
