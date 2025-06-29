package initialize

func Init() {
	LoadConfig()
	InitLogger()
	InitRedis()
	InitDatabase()
	AutoMigrate()

	r := InitRouter()

	r.Run(":3000")
}
