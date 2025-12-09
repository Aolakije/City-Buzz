package main

import (
	"github.com/Aolakije/City-Buzz/internal/auth"
	"github.com/Aolakije/City-Buzz/internal/middleware"
	"github.com/Aolakije/City-Buzz/internal/news"
	"github.com/Aolakije/City-Buzz/internal/post"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupRoutes(app *fiber.App, db *pgxpool.Pool, cfg *config.Config) {
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

	// Initialize news module
	newsRepo := news.NewRepository(db)
	newsService := news.NewService(newsRepo, cfg)
	newsHandler := news.NewHandler(newsService)

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
	// News routes
	newsRoutes := api.Group("/news")
	// Public routes (no auth required)
	newsRoutes.Get("/rouen", newsHandler.GetRouenNews)
	newsRoutes.Get("/normandy", newsHandler.GetNormandyNews)
	newsRoutes.Get("/france", newsHandler.GetFranceNews)
	newsRoutes.Get("/city", newsHandler.GetCityNews)
	newsRoutes.Get("/search", newsHandler.SearchNews)

	// Protected routes (auth required)
	newsProtected := newsRoutes.Group("/", middleware.AuthMiddleware(cfg))
	newsProtected.Post("/save", newsHandler.SaveArticle)
	newsProtected.Get("/saved", newsHandler.GetSavedArticles)
	newsProtected.Delete("/saved", newsHandler.DeleteSavedArticle)
}
