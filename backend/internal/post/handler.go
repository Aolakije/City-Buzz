package post

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// CreatePost handles post creation
// POST /api/v1/posts
func (h *Handler) CreatePost(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	var req models.CreatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	post, err := h.service.CreatePost(c.Context(), userID, &req)
	if err != nil {
		log.Printf("Create post error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create post")
	}

	log.Printf("Post created: ID=%s by User=%s", post.ID, userID)

	return utils.SuccessResponse(c, fiber.StatusCreated, "Post created successfully", fiber.Map{
		"post": post,
	})
}

// GetFeed handles feed retrieval
// GET /api/v1/posts?page=1&limit=10
func (h *Handler) GetFeed(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	posts, err := h.service.GetFeed(c.Context(), page, limit, userID)
	if err != nil {
		log.Printf("Get feed error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to get feed")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "", fiber.Map{
		"posts": posts,
		"page":  page,
		"limit": limit,
	})
}

// GetPost handles single post retrieval
// GET /api/v1/posts/:id
func (h *Handler) GetPost(c *fiber.Ctx) error {
	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	post, err := h.service.GetPostByID(c.Context(), postID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Post not found")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "", fiber.Map{
		"post": post,
	})
}

// UpdatePost handles post update
// PUT /api/v1/posts/:id
func (h *Handler) UpdatePost(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	var req models.UpdatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	if err := h.service.UpdatePost(c.Context(), postID, userID, &req); err != nil {
		log.Printf("Update post error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	log.Printf("Post updated: ID=%s by User=%s", postID, userID)

	return utils.SuccessResponse(c, fiber.StatusOK, "Post updated successfully", nil)
}

// DeletePost handles post deletion
// DELETE /api/v1/posts/:id
func (h *Handler) DeletePost(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	if err := h.service.DeletePost(c.Context(), postID, userID); err != nil {
		log.Printf("Delete post error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	log.Printf("Post deleted: ID=%s by User=%s", postID, userID)

	return utils.SuccessResponse(c, fiber.StatusOK, "Post deleted successfully", nil)
}

// LikePost handles post liking
// POST /api/v1/posts/:id/like
func (h *Handler) LikePost(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	if err := h.service.LikePost(c.Context(), postID, userID); err != nil {
		if err.Error() == "post already liked" {
			return utils.ErrorResponse(c, fiber.StatusConflict, "Post already liked")
		}
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to like post")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Post liked", nil)
}

// UnlikePost handles post unliking
// DELETE /api/v1/posts/:id/like
func (h *Handler) UnlikePost(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	if err := h.service.UnlikePost(c.Context(), postID, userID); err != nil {
		if err.Error() == "post not liked" {
			return utils.ErrorResponse(c, fiber.StatusConflict, "Post not liked")
		}
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to unlike post")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Post unliked", nil)
}

// CreateComment handles comment creation
// POST /api/v1/posts/:id/comments
func (h *Handler) CreateComment(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	var req models.CreateCommentRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	comment, err := h.service.CreateComment(c.Context(), postID, userID, &req)
	if err != nil {
		log.Printf("Create comment error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	log.Printf("Comment created: ID=%s on Post=%s by User=%s", comment.ID, postID, userID)

	return utils.SuccessResponse(c, fiber.StatusCreated, "Comment created successfully", fiber.Map{
		"comment": comment,
	})
}

// GetComments handles comment retrieval
// GET /api/v1/posts/:id/comments
func (h *Handler) GetComments(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	postID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid post ID")
	}

	comments, err := h.service.GetCommentsByPostID(c.Context(), postID, userID)
	if err != nil {
		log.Printf("Get comments error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to get comments")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "", fiber.Map{
		"comments": comments,
	})
}

// DeleteComment handles comment deletion
// DELETE /api/v1/comments/:id
func (h *Handler) DeleteComment(c *fiber.Ctx) error {
	userID, err := utils.ParseUUID(c.Locals("userID").(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid user ID")
	}

	commentID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid comment ID")
	}

	if err := h.service.DeleteComment(c.Context(), commentID, userID); err != nil {
		log.Printf("Delete comment error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusForbidden, err.Error())
	}

	log.Printf("Comment deleted: ID=%s by User=%s", commentID, userID)

	return utils.SuccessResponse(c, fiber.StatusOK, "Comment deleted successfully", nil)
}