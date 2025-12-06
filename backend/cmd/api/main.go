package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/database"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to PostgreSQL
	db, err := database.NewPostgresDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer database.ClosePostgresDB(db)

	// Connect to Redis
	redisClient, err := database.NewRedisClient(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer database.CloseRedis(redisClient)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName: "City-Buzz Platform API",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	// Setup all routes
	SetupRoutes(app, db, cfg)

	// Start server
	port := cfg.Server.Port
	log.Printf("Starting server on port %s", port)
	log.Printf("Environment: %s", cfg.Server.Env)
	log.Printf("Frontend URL: %s", cfg.CORS.FrontendURL)

	// Graceful shutdown
	go func() {
		if err := app.Listen(":" + port); err != nil {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}
	log.Println("Server stopped")
}
