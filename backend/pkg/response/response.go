package response

import "github.com/gin-gonic/gin"

type ResponseData struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func SuccessResponse(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, ResponseData{
		Code:    ErrorCodeSuccess,
		Message: msg[ErrorCodeSuccess],
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, ResponseData{
		Code:    ErrorCodeParamInvalid,
		Message: message,
		Data:    nil,
	})
}

func ErrorResponseWithCode(c *gin.Context, statusCode int, code int) {
	c.JSON(statusCode, ResponseData{
		Code:    code,
		Message: msg[code],
		Data:    nil,
	})
}
