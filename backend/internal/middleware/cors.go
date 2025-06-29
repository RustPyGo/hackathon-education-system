package middleware

import (
	"time"

	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware returns a CORS middleware with configuration from global config
func CORSMiddleware() gin.HandlerFunc {
	corsConfig := global.Config.CORS

	return cors.New(cors.Config{
		AllowOrigins:     corsConfig.AllowOrigins,
		AllowMethods:     corsConfig.AllowMethods,
		AllowHeaders:     corsConfig.AllowHeaders,
		ExposeHeaders:    corsConfig.ExposeHeaders,
		AllowCredentials: corsConfig.AllowCredentials,
		MaxAge:           time.Duration(corsConfig.MaxAge) * time.Second,
	})
}

// DevelopmentCORSMiddleware returns a more permissive CORS config for development
func DevelopmentCORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: false, // Set to false when AllowOrigins is "*"
		MaxAge:           12 * time.Hour,
	})
}

// ProductionCORSMiddleware returns a strict CORS config for production
func ProductionCORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"https://yourdomain.com", "https://www.yourdomain.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
