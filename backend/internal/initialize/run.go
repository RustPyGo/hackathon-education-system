package initialize

func Init() {
	LoadConfig()
	InitLogger()
	InitDatabase()
	RunMigrations()
	InitRedis()

	r := InitRouter()

	r.Run(":3000")
}
