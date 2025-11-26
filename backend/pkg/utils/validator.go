package utils

import (
	"fmt"
	"regexp"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

// ValidateStruct validates a struct using validator tags
func ValidateStruct(s interface{}) error {
	return validate.Struct(s)
}

// ValidateUsername checks username format: 3-20 chars, alphanumeric, underscore, hyphen
func ValidateUsername(username string) error {
	if len(username) < 3 || len(username) > 20 {
		return fmt.Errorf("username must be between 3 and 20 characters")
	}

	validUsername := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
	if !validUsername.MatchString(username) {
		return fmt.Errorf("username can only contain letters, numbers, underscores, and hyphens")
	}

	return nil
}

// ValidateAge checks if user is at least 13 years old
func ValidateAge(dateOfBirth time.Time) error {
	age := time.Since(dateOfBirth).Hours() / 24 / 365.25
	if age < 13 {
		return fmt.Errorf("you must be at least 13 years old to register")
	}
	return nil
}

// ValidateEmailOrPhone ensures at least one is provided
func ValidateEmailOrPhone(email, phone *string) error {
	if (email == nil || *email == "") && (phone == nil || *phone == "") {
		return fmt.Errorf("either email or phone number is required")
	}
	return nil
}

// ParseUUID converts string to UUID
func ParseUUID(s string) (uuid.UUID, error) {
	return uuid.Parse(s)
}
