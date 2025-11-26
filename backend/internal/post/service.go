package post

import (
	"context"
	"fmt"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// CreatePost creates a new post
func (s *Service) CreatePost(ctx context.Context, userID uuid.UUID, req *models.CreatePostRequest) (*models.Post, error) {
	post := &models.Post{
		UserID:  userID,
		Content: req.Content,
	}

	if err := s.repo.CreatePost(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to create post: %w", err)
	}

	// Get post with author info
	fullPost, err := s.repo.GetPostByID(ctx, post.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get created post: %w", err)
	}

	return fullPost, nil
}

// GetPostByID retrieves a post by ID
func (s *Service) GetPostByID(ctx context.Context, postID uuid.UUID) (*models.Post, error) {
	return s.repo.GetPostByID(ctx, postID)
}

// GetFeed retrieves paginated feed
func (s *Service) GetFeed(ctx context.Context, page, limit int, userID uuid.UUID) ([]models.Post, error) {
	offset := (page - 1) * limit
	return s.repo.GetFeed(ctx, limit, offset, userID)
}

// UpdatePost updates a post
func (s *Service) UpdatePost(ctx context.Context, postID, userID uuid.UUID, req *models.UpdatePostRequest) error {
	// Check ownership
	isOwner, err := s.repo.CheckPostOwnership(ctx, postID, userID)
	if err != nil {
		return fmt.Errorf("failed to check ownership: %w", err)
	}

	if !isOwner {
		return fmt.Errorf("unauthorized: you don't own this post")
	}

	return s.repo.UpdatePost(ctx, postID, req.Content)
}

// DeletePost deletes a post
func (s *Service) DeletePost(ctx context.Context, postID, userID uuid.UUID) error {
	// Check ownership
	isOwner, err := s.repo.CheckPostOwnership(ctx, postID, userID)
	if err != nil {
		return fmt.Errorf("failed to check ownership: %w", err)
	}

	if !isOwner {
		return fmt.Errorf("unauthorized: you don't own this post")
	}

	return s.repo.DeletePost(ctx, postID)
}

// LikePost likes a post
func (s *Service) LikePost(ctx context.Context, postID, userID uuid.UUID) error {
	return s.repo.LikePost(ctx, postID, userID)
}

// UnlikePost unlikes a post
func (s *Service) UnlikePost(ctx context.Context, postID, userID uuid.UUID) error {
	return s.repo.UnlikePost(ctx, postID, userID)
}

// CreateComment creates a comment on a post
func (s *Service) CreateComment(ctx context.Context, postID, userID uuid.UUID, req *models.CreateCommentRequest) (*models.Comment, error) {
	// Check if post exists
	_, err := s.repo.GetPostByID(ctx, postID)
	if err != nil {
		return nil, fmt.Errorf("post not found")
	}

	comment := &models.Comment{
		PostID:  postID,
		UserID:  userID,
		Content: req.Content,
	}

	if err := s.repo.CreateComment(ctx, comment); err != nil {
		return nil, fmt.Errorf("failed to create comment: %w", err)
	}

	return comment, nil
}

// GetCommentsByPostID retrieves comments for a post
func (s *Service) GetCommentsByPostID(ctx context.Context, postID, userID uuid.UUID) ([]models.Comment, error) {
	return s.repo.GetCommentsByPostID(ctx, postID, userID)
}

// DeleteComment deletes a comment
func (s *Service) DeleteComment(ctx context.Context, commentID, userID uuid.UUID) error {
	// Check ownership
	isOwner, err := s.repo.CheckCommentOwnership(ctx, commentID, userID)
	if err != nil {
		return fmt.Errorf("failed to check ownership: %w", err)
	}

	if !isOwner {
		return fmt.Errorf("unauthorized: you don't own this comment")
	}

	return s.repo.DeleteComment(ctx, commentID)
}
