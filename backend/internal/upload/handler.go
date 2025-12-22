package upload

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Handler struct {
	config *config.Config
}

func NewHandler(cfg *config.Config) *Handler {
	// Create upload directory if it doesn't exist
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		panic(fmt.Sprintf("Failed to create upload directory: %v", err))
	}

	return &Handler{
		config: cfg,
	}
}

func (h *Handler) UploadEventImage(c *fiber.Ctx) error {
	// Get user ID from context
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	// Get the file from form
	file, err := c.FormFile("image")
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "No image file provided")
	}

	// Validate file type
	if !isValidImageType(file) {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed")
	}

	// Validate file size (max 10MB)
	if file.Size > 10*1024*1024 {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "File size exceeds 10MB limit")
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)

	// Create subdirectory by date (YYYY/MM)
	now := time.Now()
	subDir := filepath.Join("./uploads", fmt.Sprintf("%d/%02d", now.Year(), now.Month()))
	if err := os.MkdirAll(subDir, 0755); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create upload directory")
	}

	// Full file path
	filePath := filepath.Join(subDir, filename)

	// Save file
	if err := c.SaveFile(file, filePath); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to save image")
	}

	// Generate URL - use backend URL (port 8080)
	baseURL := "http://localhost:8080"
	if h.config.Server.Env == "production" {
		// In production, use your actual domain
		baseURL = strings.Replace(h.config.CORS.FrontendURL, "5173", "8080", 1)
	}

	imageURL := fmt.Sprintf("%s/uploads/%d/%02d/%s", baseURL, now.Year(), now.Month(), filename)

	return utils.SuccessResponse(c, fiber.StatusOK, "Image uploaded successfully", fiber.Map{
		"url":      imageURL,
		"filename": filename,
		"size":     file.Size,
	})
}

func isValidImageType(file *multipart.FileHeader) bool {
	// Check by extension first
	ext := strings.ToLower(filepath.Ext(file.Filename))
	validExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}

	for _, validExt := range validExts {
		if ext == validExt {
			return true
		}
	}

	// Open file to check MIME type
	src, err := file.Open()
	if err != nil {
		return false
	}
	defer src.Close()

	// Read first 512 bytes to detect content type
	buffer := make([]byte, 512)
	n, err := src.Read(buffer)
	if err != nil {
		return false
	}

	contentType := http.DetectContentType(buffer[:n])
	validTypes := []string{"image/jpeg", "image/png", "image/gif", "image/webp"}

	for _, validType := range validTypes {
		if contentType == validType {
			return true
		}
	}

	return false
}
