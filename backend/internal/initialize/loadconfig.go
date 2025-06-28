package initialize

import (
	"github.com/RustPyGo/hackathon-education-system/backend/global"
	"github.com/spf13/viper"
)

func LoadConfig() {

	viper := viper.New()
	viper.AddConfigPath("./configs")
	viper.SetConfigName("local")
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	if err := viper.Unmarshal(&global.Config); err != nil {
		panic(err)
	}
}
