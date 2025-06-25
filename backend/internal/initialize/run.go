package initialize

func Init() {
	LoadConfig()
	InitLogger()
	InitMysql()
	InitRedis()

	r := InitRouter()

	r.Run(":3000")
}
