package utils

import (
	"github.com/fpt-ai-innovation-hackathon/education-system/backend/global"
	"gorm.io/gorm"
)

func GetDB() *gorm.DB {
	return global.DB
}

func Transaction(fn func(tx *gorm.DB) error) error {
	return global.DB.Transaction(fn)
}
