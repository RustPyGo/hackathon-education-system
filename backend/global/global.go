package global

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/pkg/logger"
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/pkg/setting"
	"github.com/redis/go-redis/v9"
)

var (
	Config      setting.Config
	Logger      *logger.LoggerZap
	RedisClient *redis.Client
)
