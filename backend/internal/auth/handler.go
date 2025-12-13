package auth

import (
	"log"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
	cfg     *config.Config
}

func NewHandler(service *Service, cfg *config.Config) *Handler {
	return &Handler{
		service: service,
		cfg:     cfg,
	}
}

// Register handles user registration
// POST /api/v1/auth/register
func (h *Handler) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	// Create user
	user, err := h.service.Register(c.Context(), &req)
	if err != nil {
		log.Printf("Registration error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	log.Printf("New user registered: %s (ID: %s)", user.Username, user.ID)

	return utils.SuccessResponse(c, fiber.StatusCreated, "Account created successfully", fiber.Map{
		"user": user.ToResponse(),
	})
}

// Login handles user login
// POST /api/v1/auth/login
func (h *Handler) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate request
	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	// Authenticate user
	user, token, err := h.service.Login(c.Context(), &req)
	if err != nil {
		log.Printf("Login error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid credentials")
	}

	// Set JWT token in httpOnly cookie
	cookie := new(fiber.Cookie)
cookie.Name = "auth_token"
cookie.Value = token
cookie.Path = "/"
cookie.MaxAge = 60 * 60 * 24 * 7 // 7 days
cookie.HTTPOnly = true
cookie.Secure = false           // false for localhost / Docker
cookie.SameSite = "None"        // critical for cross-port POST from Vite frontend
c.Cookie(cookie)


	log.Printf("User logged in: %s (ID: %s)", user.Username, user.ID)

	return utils.SuccessResponse(c, fiber.StatusOK, "Login successful", fiber.Map{
		"user": user.ToResponse(),
	})
}

// Logout handles user logout
// POST /api/v1/auth/logout
func (h *Handler) Logout(c *fiber.Ctx) error {
	// Clear the auth cookie
	c.Cookie(&fiber.Cookie{
		Name:     "auth_token",
		Value:    "",
		HTTPOnly: true,
		Secure:   h.cfg.Cookie.Secure,
		SameSite: "Strict",
		MaxAge:   -1, // Delete cookie
		Path:     "/",
		Domain:   h.cfg.Cookie.Domain,
	})

	log.Printf("User logged out")

	return utils.SuccessResponse(c, fiber.StatusOK, "Logged out successfully", nil)
}

// GetMe returns current authenticated user
// GET /api/v1/users/me
func (h *Handler) GetMe(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("userID").(string)

	// Parse UUID
	id, err := utils.ParseUUID(userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	// Get user from database
	user, err := h.service.GetUserByID(c.Context(), id)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "User not found")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "", fiber.Map{
		"user": user.ToResponse(),
	})
}
