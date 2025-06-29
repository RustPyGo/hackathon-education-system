package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ResponseWriter wraps gin.ResponseWriter to capture response body
type ResponseWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w ResponseWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

// Logger middleware logs all API requests
func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		// Create structured log entry
		logEntry := logrus.WithFields(logrus.Fields{
			"timestamp":  param.TimeStamp.Format(time.RFC3339),
			"method":     param.Method,
			"path":       param.Path,
			"status":     param.StatusCode,
			"latency":    param.Latency.String(),
			"client_ip":  param.ClientIP,
			"user_agent": param.Request.UserAgent(),
			"error":      param.ErrorMessage,
		})

		// Log based on status code
		switch {
		case param.StatusCode >= 500:
			logEntry.Error("Server Error")
		case param.StatusCode >= 400:
			logEntry.Warn("Client Error")
		case param.StatusCode >= 300:
			logEntry.Info("Redirect")
		default:
			logEntry.Info("Success")
		}

		return ""
	})
}

// RequestLogger middleware logs request details including body
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Log request details
		logEntry := logrus.WithFields(logrus.Fields{
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"query":      c.Request.URL.RawQuery,
			"client_ip":  c.ClientIP(),
			"user_agent": c.Request.UserAgent(),
		})

		// Log request headers (excluding sensitive ones)
		headers := make(map[string]string)
		for key, values := range c.Request.Header {
			if key != "Authorization" && key != "Cookie" && key != "X-API-Key" {
				headers[key] = values[0]
			}
		}
		logEntry = logEntry.WithField("headers", headers)

		// Log request body for POST/PUT/PATCH requests
		if c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "PATCH" {
			if c.Request.Body != nil {
				bodyBytes, err := io.ReadAll(c.Request.Body)
				if err == nil {
					// Try to parse as JSON for better logging
					var prettyJSON bytes.Buffer
					if json.Indent(&prettyJSON, bodyBytes, "", "  ") == nil {
						logEntry = logEntry.WithField("request_body", prettyJSON.String())
					} else {
						// If not JSON, log as string (truncated if too long)
						bodyStr := string(bodyBytes)
						if len(bodyStr) > 1000 {
							bodyStr = bodyStr[:1000] + "... (truncated)"
						}
						logEntry = logEntry.WithField("request_body", bodyStr)
					}
				}
				// Restore body for further processing
				c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
			}
		}

		logEntry.Info("API Request Started")

		// Wrap response writer to capture response
		blw := &ResponseWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = blw

		// Process request
		c.Next()

		// Calculate duration
		duration := time.Since(start)

		// Log response details
		responseLogEntry := logrus.WithFields(logrus.Fields{
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"status":     c.Writer.Status(),
			"duration":   duration.String(),
			"client_ip":  c.ClientIP(),
			"user_agent": c.Request.UserAgent(),
		})

		// Log response body for errors or if it's small
		if c.Writer.Status() >= 400 || blw.body.Len() < 1000 {
			responseBody := blw.body.String()
			if len(responseBody) > 1000 {
				responseBody = responseBody[:1000] + "... (truncated)"
			}
			responseLogEntry = responseLogEntry.WithField("response_body", responseBody)
		}

		// Log based on status code
		switch {
		case c.Writer.Status() >= 500:
			responseLogEntry.Error("API Request Failed (Server Error)")
		case c.Writer.Status() >= 400:
			responseLogEntry.Warn("API Request Failed (Client Error)")
		case c.Writer.Status() >= 300:
			responseLogEntry.Info("API Request Redirected")
		default:
			responseLogEntry.Info("API Request Completed")
		}
	}
}

// ErrorLogger middleware logs errors specifically
func ErrorLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Log errors if any
		if len(c.Errors) > 0 {
			for _, err := range c.Errors {
				logrus.WithFields(logrus.Fields{
					"method":     c.Request.Method,
					"path":       c.Request.URL.Path,
					"client_ip":  c.ClientIP(),
					"error":      err.Error(),
					"error_type": fmt.Sprintf("%T", err.Err),
				}).Error("API Error")
			}
		}
	}
}
