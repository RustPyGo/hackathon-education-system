package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	encoder := getEncoderLog()

	writer := getWriterLog()
	core := zapcore.NewCore(encoder, writer, zapcore.InfoLevel)
	logger := zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))

	logger.Info("This is an info message")

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

func getWriterLog() zapcore.WriteSyncer {
	file, err := os.OpenFile("./log/log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModePerm)
	if err != nil {
		panic(err)
	}
	syncFile := zapcore.AddSync(file)

	syncConsole := zapcore.AddSync(os.Stderr)

	return zapcore.NewMultiWriteSyncer(syncFile, syncConsole)
}
