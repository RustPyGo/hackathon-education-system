package initialize

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/setting"
)

func LoadConfig() {
	// Load .env file from root directory if it exists
	loadEnvFile()

	// Load configuration from environment variables
	config := setting.Config{
		Server: setting.ServerSetting{
			Port: getEnvAsInt("SERVER_PORT", 3000),
			Mode: getEnv("SERVER_MODE", "debug"),
		},
		Redis: setting.RedisSetting{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvAsInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			Db:       getEnvAsInt("REDIS_DB", 0),
		},
		DB: setting.DatabaseSetting{
			Host:     getEnv("DATABASE_HOST", "localhost"),
			Port:     getEnvAsInt("DATABASE_PORT", 5432),
			User:     getEnv("PG_USER", "postgres"),
			Password: getEnv("PG_PASS", "postgres"),
			DBName:   getEnv("PG_DB", "education_system"),
			SSLMode:  getEnv("DATABASE_SSLMODE", "disable"),
		},
		AWS: setting.AWSSetting{
			Region:    getEnv("AWS_REGION", "us-east-1"),
			Bucket:    getEnv("AWS_BUCKET", ""),
			AccessKey: getEnv("AWS_ACCESS_KEY", ""),
			SecretKey: getEnv("AWS_SECRET_KEY", ""),
			Endpoint:  getEnv("AWS_ENDPOINT", ""),
		},
		CORS: setting.CORSSetting{
			AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"},
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With", "Accept", "X-API-Key"},
			ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
			AllowCredentials: true,
			MaxAge:           43200, // 12 hours in seconds
		},
	}

	global.Config = config
}

// loadEnvFile reads .env file from root directory
func loadEnvFile() {
	// Try to find .env file in root directory (2 levels up from backend)
	envPath := filepath.Join("..", "..", ".env")
	fmt.Println("envPath", envPath)

	if _, err := os.Stat(envPath); os.IsNotExist(err) {

		// Try current directory
		envPath = ".env"
		if _, err := os.Stat(envPath); os.IsNotExist(err) {
			return // .env file not found, use default values
		}
	}

	file, err := os.Open(envPath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		// Parse key=value
		if strings.Contains(line, "=") {
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				value := strings.TrimSpace(parts[1])

				// Remove quotes if present
				if len(value) >= 2 && (value[0] == '"' && value[len(value)-1] == '"') {
					value = value[1 : len(value)-1]
				}

				// Set environment variable if not already set
				if os.Getenv(key) == "" {
					os.Setenv(key, value)
				}
			}
		}
	}
}

// Helper function to get environment variable with default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Helper function to get environment variable as integer with default value
func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
