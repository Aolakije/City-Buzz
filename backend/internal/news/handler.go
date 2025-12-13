package news

import (
	"log"
	"strconv"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// GetTopHeadlines handles GET /api/v1/news/top-headlines
func (h *Handler) GetTopHeadlines(c *fiber.Ctx) error {
	category := c.Query("category", "")
	country := c.Query("country", "fr")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	// For France, use top headlines API
	// For other locations, use search
	var news *models.NewsAPIResponse
	var err error

	if country == "fr" {
		news, err = h.service.GetFranceNews(c.Context(), category, language, page, pageSize)
	} else {
		news, err = h.service.GetTopHeadlines(c.Context(), category, country, page, pageSize)
	}

	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch news headlines")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Top headlines fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
	})
}

// SearchNews handles GET /api/v1/news/search
func (h *Handler) SearchNews(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Search query is required")
	}

	language := c.Query("language", "fr")
	sortBy := c.Query("sortBy", "publishedAt")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	news, err := h.service.SearchNews(c.Context(), query, language, sortBy, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to search news")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Search results fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
	})
}

// GetRouenNews handles GET /api/v1/news/rouen
func (h *Handler) GetRouenNews(c *fiber.Ctx) error {
	category := c.Query("category", "")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	news, err := h.service.GetRouenNews(c.Context(), category, language, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch Rouen news")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Rouen news fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
		"location":     "Rouen",
		"category":     category,
	})
}

// GetNormandyNews handles GET /api/v1/news/normandy
func (h *Handler) GetNormandyNews(c *fiber.Ctx) error {
	category := c.Query("category", "")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	news, err := h.service.GetNormandyNews(c.Context(), category, language, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch Normandy news")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Normandy news fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
		"location":     "Normandy",
		"category":     category,
	})
}

// GetFranceNews handles GET /api/v1/news/france
func (h *Handler) GetFranceNews(c *fiber.Ctx) error {
	category := c.Query("category", "")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	news, err := h.service.GetFranceNews(c.Context(), category, language, page, pageSize)
	if err != nil {
		log.Println("FRANCE NEWS ERROR:", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch France news")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "France news fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
		"location":     "France",
		"category":     category,
	})
}

// GetCityNews handles GET /api/v1/news/city
func (h *Handler) GetCityNews(c *fiber.Ctx) error {
	city := c.Query("city")
	if city == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "City parameter is required")
	}

	category := c.Query("category", "")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	news, err := h.service.GetCityNews(c.Context(), city, category, language, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch city news")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "City news fetched successfully", fiber.Map{
		"articles":     news.Articles,
		"totalResults": news.TotalResults,
		"location":     city,
		"category":     category,
	})
}

// SaveArticle handles POST /api/v1/news/save
func (h *Handler) SaveArticle(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	var req models.SaveArticleRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	article, err := h.service.SaveArticle(c.Context(), userID, &req)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to save article")
	}

	return utils.SuccessResponse(c, fiber.StatusCreated, "Article saved successfully", article)
}

// GetSavedArticles handles GET /api/v1/news/saved
func (h *Handler) GetSavedArticles(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	articles, err := h.service.GetSavedArticles(c.Context(), userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to get saved articles")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Saved articles fetched successfully", articles)
}

// DeleteSavedArticle handles DELETE /api/v1/news/saved
func (h *Handler) DeleteSavedArticle(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	articleURL := c.Query("url")
	if articleURL == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Article URL is required")
	}

	if err := h.service.DeleteSavedArticle(c.Context(), userID, articleURL); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete saved article")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Article removed successfully", fiber.Map{
		"message": "Article removed from saved items",
	})
}
