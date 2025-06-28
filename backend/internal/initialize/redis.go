package initialize

import (
	"context"
	"fmt"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

var ctx = context.Background()

func InitRedis() {
	// Initialize the Redis connection
	// This is a placeholder function. You can implement the actual initialization logic here.
	r := global.Config.Redis

	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", r.Host, r.Port),
		Password: r.Password, // no password set
		DB:       r.Db,       // use default DB
		PoolSize: 10,
	})

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		global.Logger.Error("Failed to connect to Redis", zap.Error(err))
	}

	fmt.Println("Connected to Redis successfully")

	global.RedisClient = rdb
	RedisExample()
}

func RedisExample() {
	err := global.RedisClient.Set(ctx, "key", "value", 0).Err()
	if err != nil {
		fmt.Println("Failed to set key in Redis", err)
	}

	val, err := global.RedisClient.Get(ctx, "key").Result()
	if err != nil {
		fmt.Println("Failed to get key from Redis", err)
	}

	global.Logger.Info("Value from Redis", zap.String("key", "key"), zap.String("value", val))

}
