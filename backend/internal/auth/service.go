package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
	cfg  *config.Config
}

func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo: repo,
		cfg:  cfg,
	}
}

// Register creates a new user account
func (s *Service) Register(ctx context.Context, req *models.RegisterRequest) (*models.User, error) {
	// Validate email or phone is provided
	if err := utils.ValidateEmailOrPhone(req.Email, req.Phone); err != nil {
		return nil, err
	}

	// Validate username format
	if err := utils.ValidateUsername(req.Username); err != nil {
		return nil, err
	}

	// Validate password strength
	if err := utils.ValidatePassword(req.Password); err != nil {
		return nil, err
	}

	// Parse and validate date of birth
	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return nil, fmt.Errorf("invalid date of birth format, use YYYY-MM-DD")
	}

	if err := utils.ValidateAge(dob); err != nil {
		return nil, err
	}

	// Check if username already exists
	exists, err := s.repo.CheckUsernameExists(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check username: %w", err)
	}
	if exists {
		return nil, fmt.Errorf("username already taken")
	}

	// Check if email already exists
	if req.Email != nil && *req.Email != "" {
		exists, err := s.repo.CheckEmailExists(ctx, *req.Email)
		if err != nil {
			return nil, fmt.Errorf("failed to check email: %w", err)
		}
		if exists {
			return nil, fmt.Errorf("email already registered")
		}
	}

	// Check if phone already exists
	if req.Phone != nil && *req.Phone != "" {
		exists, err := s.repo.CheckPhoneExists(ctx, *req.Phone)
		if err != nil {
			return nil, fmt.Errorf("failed to check phone: %w", err)
		}
		if exists {
			return nil, fmt.Errorf("phone number already registered")
		}
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user object
	user := &models.User{
		Email:         req.Email,
		Phone:         req.Phone,
		Username:      req.Username,
		PasswordHash:  hashedPassword,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		Gender:        req.Gender,
		DateOfBirth:   dob,
		Language:      "fr",
		ConfirmMethod: req.ConfirmMethod,
		IsActive:      true,
	}

	// Save to database
	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

// Login authenticates a user and returns JWT token
func (s *Service) Login(ctx context.Context, req *models.LoginRequest) (*models.User, string, error) {
	// Find user by identifier (email, phone, or username)
	user, err := s.repo.FindUserByIdentifier(ctx, req.Identifier)
	if err != nil {
		return nil, "", fmt.Errorf("invalid credentials")
	}

	// Check password
	if err := utils.CheckPassword(user.PasswordHash, req.Password); err != nil {
		return nil, "", fmt.Errorf("invalid credentials")
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, user.Username, s.cfg.JWT.Secret, s.cfg.JWT.Expiry)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	// Update last login
	if err := s.repo.UpdateLastLogin(ctx, user.ID); err != nil {
		// Log error but don't fail the login
		fmt.Printf("Warning: failed to update last login for user %s: %v\n", user.ID, err)
	}

	return user, token, nil
}

// GetUserByID retrieves user by ID
func (s *Service) GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	user, err := s.repo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}
