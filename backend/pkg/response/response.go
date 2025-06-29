package response

import (
	"github.com/gin-gonic/gin"
)

// Response represents the standard API response structure
// @Description Standard API response structure
type Response struct {
	Code    int         `json:"code" example:"200"`
	Message string      `json:"message" example:"Success"`
	Data    interface{} `json:"data,omitempty"`
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Code:    code,
		Message: message,
		Data:    nil,
	})
}

// SuccessResponse sends a success response
func SuccessResponse(c *gin.Context, code int, data interface{}) {
	c.JSON(code, Response{
		Code:    code,
		Message: "Success",
		Data:    data,
	})
}

func ErrorResponseWithCode(c *gin.Context, statusCode int, code int) {
	c.JSON(statusCode, Response{
		Code:    code,
		Message: msg[code],
		Data:    nil,
	})
}
