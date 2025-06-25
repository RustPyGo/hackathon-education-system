package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type LoggerZap struct {
	*zap.Logger
}

func NewLoggerZap() *LoggerZap {

	logLevel := "debug"

	var level zapcore.Level

	switch logLevel {
	case "debug":
		level = zapcore.DebugLevel
	case "info":
		level = zapcore.InfoLevel
	case "warn":
		level = zapcore.WarnLevel
	case "error":
		level = zapcore.ErrorLevel
	case "dpanic":
		level = zapcore.DPanicLevel
	case "panic":
		level = zapcore.PanicLevel
	case "fatal":
		level = zapcore.FatalLevel
	default:
		level = zapcore.DebugLevel
	}

	encoder := getEncoderLog()
	hook := lumberjack.Logger{
		Filename:   "./storages/logs/dev.log",
		MaxSize:    500, // megabytes
		MaxBackups: 3,
		MaxAge:     28, // days
		Compress:   true,
	}

	core := zapcore.NewCore(
		encoder,
		zapcore.NewMultiWriteSyncer(zapcore.AddSync(&hook), zapcore.AddSync(os.Stderr)),
		level,
	)
	logger := zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))

	return &LoggerZap{
		Logger: logger,
	}
}

func getEncoderLog() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	// 1239723430232.2348022 => 2023-10-11T17:12:21.11231231+0700
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	// ts => time
	encoderConfig.TimeKey = "time"

	// log => level
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder

	// log => caller
	encoderConfig.EncodeCaller = zapcore.ShortCallerEncoder

	return zapcore.NewJSONEncoder(encoderConfig)

}
