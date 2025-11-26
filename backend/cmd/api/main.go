package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/Aolakije/City-Buzz/internal/auth"
	"github.com/Aolakije/City-Buzz/internal/middleware"
	"github.com/Aolakije/City-Buzz/internal/post"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/database"

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

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} (${latency})\n",
	}))

	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORS.FrontendURL,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true, // Important for cookies
	}))

	// Initialize auth module
	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg)
	authHandler := auth.NewHandler(authService, cfg)

	//Initialize post module
	postRepo := post.NewRepository(db)
	postService := post.NewService(postRepo)
	postHandler := post.NewHandler(postService)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "City-Buzz-api",
		})
	})

	// API routes
	api := app.Group("/api/v1")

	// Auth routes (public)
	authRoutes := api.Group("/auth")
	authRoutes.Post("/register", authHandler.Register)
	authRoutes.Post("/login", authHandler.Login)
	authRoutes.Post("/logout", authHandler.Logout)

	// User routes (protected)
	userRoutes := api.Group("/users", middleware.AuthMiddleware(cfg))
	userRoutes.Get("/me", authHandler.GetMe)

	// Post routes (protected)
	postRoutes := api.Group("/posts", middleware.AuthMiddleware(cfg))
	postRoutes.Post("/", postHandler.CreatePost)
	postRoutes.Get("/", postHandler.GetFeed)
	postRoutes.Get("/:id", postHandler.GetPost)
	postRoutes.Put("/:id", postHandler.UpdatePost)
	postRoutes.Delete("/:id", postHandler.DeletePost)
	postRoutes.Post("/:id/like", postHandler.LikePost)
	postRoutes.Delete("/:id/like", postHandler.UnlikePost)
	postRoutes.Post("/:id/comments", postHandler.CreateComment)
	postRoutes.Get("/:id/comments", postHandler.GetComments)

	// Comment routes (protected)
	commentRoutes := api.Group("/comments", middleware.AuthMiddleware(cfg))
	commentRoutes.Delete("/:id", postHandler.DeleteComment)

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
