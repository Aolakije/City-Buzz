package auth

import (
	"context"
	"fmt"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

// CreateUser creates a new user in the database
func (r *Repository) CreateUser(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (
			email, phone, username, password_hash, first_name, last_name,
			gender, date_of_birth, language, confirm_method
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10
		) RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
		ctx, query,
		user.Email, user.Phone, user.Username, user.PasswordHash,
		user.FirstName, user.LastName, user.Gender, user.DateOfBirth,
		user.Language, user.ConfirmMethod,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// FindUserByIdentifier finds user by email, phone, or username
func (r *Repository) FindUserByIdentifier(ctx context.Context, identifier string) (*models.User, error) {
	query := `
		SELECT id, email, phone, username, password_hash, first_name, last_name,
		       gender, date_of_birth, bio, avatar_url, language, confirm_method,
		       created_at, updated_at, last_login, is_active, email_verified, phone_verified
		FROM users
		WHERE (email = $1 OR phone = $1 OR username = $1) AND is_active = true
	`

	var user models.User
	err := r.db.QueryRow(ctx, query, identifier).Scan(
		&user.ID, &user.Email, &user.Phone, &user.Username, &user.PasswordHash,
		&user.FirstName, &user.LastName, &user.Gender, &user.DateOfBirth,
		&user.Bio, &user.AvatarURL, &user.Language, &user.ConfirmMethod,
		&user.CreatedAt, &user.UpdatedAt, &user.LastLogin, &user.IsActive,
		&user.EmailVerified, &user.PhoneVerified,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	return &user, nil
}

// FindUserByID finds user by ID
func (r *Repository) FindUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, email, phone, username, password_hash, first_name, last_name,
		       gender, date_of_birth, bio, avatar_url, language, confirm_method,
		       created_at, updated_at, last_login, is_active, email_verified, phone_verified
		FROM users
		WHERE id = $1 AND is_active = true
	`

	var user models.User
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&user.ID, &user.Email, &user.Phone, &user.Username, &user.PasswordHash,
		&user.FirstName, &user.LastName, &user.Gender, &user.DateOfBirth,
		&user.Bio, &user.AvatarURL, &user.Language, &user.ConfirmMethod,
		&user.CreatedAt, &user.UpdatedAt, &user.LastLogin, &user.IsActive,
		&user.EmailVerified, &user.PhoneVerified,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	return &user, nil
}

// CheckUsernameExists checks if username already exists
func (r *Repository) CheckUsernameExists(ctx context.Context, username string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`
	err := r.db.QueryRow(ctx, query, username).Scan(&exists)
	return exists, err
}

// CheckEmailExists checks if email already exists
func (r *Repository) CheckEmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	err := r.db.QueryRow(ctx, query, email).Scan(&exists)
	return exists, err
}

// CheckPhoneExists checks if phone already exists
func (r *Repository) CheckPhoneExists(ctx context.Context, phone string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE phone = $1)`
	err := r.db.QueryRow(ctx, query, phone).Scan(&exists)
	return exists, err
}

// UpdateLastLogin updates user's last login timestamp
func (r *Repository) UpdateLastLogin(ctx context.Context, userID uuid.UUID) error {
	query := `UPDATE users SET last_login = NOW() WHERE id = $1`
	_, err := r.db.Exec(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("failed to update last login: %w", err)
	}
	return nil
}
