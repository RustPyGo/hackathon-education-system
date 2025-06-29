// @title Education System API
// @version 1.0
// @description This is a education system server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:3000
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
package main

import (
	_ "github.com/RustPyGo/hackathon-education-system/backend/docs"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/initialize"
)

func main() {
	initialize.Init()
}
