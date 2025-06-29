package setting

type Config struct {
	Server ServerSetting   `mapstructure:"server"`
	Redis  RedisSetting    `mapstructure:"redis"`
	DB     DatabaseSetting `mapstructure:"database"`
	AWS    AWSSetting      `mapstructure:"aws"`
}

type ServerSetting struct {
	Port int    `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type Logger struct{}

type RedisSetting struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Password string `mapstructure:"password"`
	Db       int    `mapstructure:"db"`
}

type DatabaseSetting struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
}

type AWSSetting struct {
	Region    string `mapstructure:"region"`
	Bucket    string `mapstructure:"bucket"`
	AccessKey string `mapstructure:"access_key"`
	SecretKey string `mapstructure:"secret_key"`
	Endpoint  string `mapstructure:"endpoint"`
}
