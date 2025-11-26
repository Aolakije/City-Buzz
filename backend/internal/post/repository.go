package post

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

// CreatePost creates a new post
func (r *Repository) CreatePost(ctx context.Context, post *models.Post) error {
	query := `
		INSERT INTO posts (user_id, content)
		VALUES ($1, $2)
		RETURNING id, likes_count, comments_count, created_at, updated_at, is_deleted
	`

	err := r.db.QueryRow(ctx, query, post.UserID, post.Content).Scan(
		&post.ID,
		&post.LikesCount,
		&post.CommentsCount,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.IsDeleted,
	)

	if err != nil {
		return fmt.Errorf("failed to create post: %w", err)
	}

	return nil
}

// GetPostByID retrieves a post by ID
func (r *Repository) GetPostByID(ctx context.Context, postID uuid.UUID) (*models.Post, error) {
	query := `
		SELECT p.id, p.user_id, p.content, p.likes_count, p.comments_count, 
		       p.created_at, p.updated_at, p.is_deleted,
		       u.id, u.username, u.first_name, u.last_name, u.avatar_url
		FROM posts p
		JOIN users u ON p.user_id = u.id
		WHERE p.id = $1 AND p.is_deleted = false
	`

	var post models.Post
	var author models.UserResponse

	err := r.db.QueryRow(ctx, query, postID).Scan(
		&post.ID,
		&post.UserID,
		&post.Content,
		&post.LikesCount,
		&post.CommentsCount,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.IsDeleted,
		&author.ID,
		&author.Username,
		&author.FirstName,
		&author.LastName,
		&author.AvatarURL,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("post not found")
		}
		return nil, fmt.Errorf("failed to get post: %w", err)
	}

	post.Author = &author
	return &post, nil
}

// GetFeed retrieves paginated posts for feed
func (r *Repository) GetFeed(ctx context.Context, limit, offset int, currentUserID uuid.UUID) ([]models.Post, error) {
	query := `
		SELECT p.id, p.user_id, p.content, p.likes_count, p.comments_count, 
		       p.created_at, p.updated_at,
		       u.id, u.username, u.first_name, u.last_name, u.avatar_url,
		       EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $1) as is_liked
		FROM posts p
		JOIN users u ON p.user_id = u.id
		WHERE p.is_deleted = false
		ORDER BY p.created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(ctx, query, currentUserID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get feed: %w", err)
	}
	defer rows.Close()

	var posts []models.Post

	for rows.Next() {
		var post models.Post
		var author models.UserResponse

		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Content,
			&post.LikesCount,
			&post.CommentsCount,
			&post.CreatedAt,
			&post.UpdatedAt,
			&author.ID,
			&author.Username,
			&author.FirstName,
			&author.LastName,
			&author.AvatarURL,
			&post.IsLiked,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan post: %w", err)
		}

		post.Author = &author
		posts = append(posts, post)
	}

	return posts, nil
}

// UpdatePost updates a post
func (r *Repository) UpdatePost(ctx context.Context, postID uuid.UUID, content string) error {
	query := `UPDATE posts SET content = $1, updated_at = NOW() WHERE id = $2 AND is_deleted = false`
	result, err := r.db.Exec(ctx, query, content, postID)
	if err != nil {
		return fmt.Errorf("failed to update post: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("post not found or already deleted")
	}

	return nil
}

// DeletePost soft deletes a post
func (r *Repository) DeletePost(ctx context.Context, postID uuid.UUID) error {
	query := `UPDATE posts SET is_deleted = true WHERE id = $1 AND is_deleted = false`
	result, err := r.db.Exec(ctx, query, postID)
	if err != nil {
		return fmt.Errorf("failed to delete post: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("post not found or already deleted")
	}

	return nil
}

// LikePost adds a like to a post
func (r *Repository) LikePost(ctx context.Context, postID, userID uuid.UUID) error {
	query := `
		INSERT INTO post_likes (post_id, user_id)
		VALUES ($1, $2)
		ON CONFLICT (post_id, user_id) DO NOTHING
	`

	result, err := r.db.Exec(ctx, query, postID, userID)
	if err != nil {
		return fmt.Errorf("failed to like post: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("post already liked")
	}

	return nil
}

// UnlikePost removes a like from a post
func (r *Repository) UnlikePost(ctx context.Context, postID, userID uuid.UUID) error {
	query := `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`

	result, err := r.db.Exec(ctx, query, postID, userID)
	if err != nil {
		return fmt.Errorf("failed to unlike post: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("post not liked")
	}

	return nil
}

// CreateComment creates a new comment
func (r *Repository) CreateComment(ctx context.Context, comment *models.Comment) error {
	query := `
		INSERT INTO comments (post_id, user_id, content)
		VALUES ($1, $2, $3)
		RETURNING id, likes_count, created_at, updated_at, is_deleted
	`

	err := r.db.QueryRow(ctx, query, comment.PostID, comment.UserID, comment.Content).Scan(
		&comment.ID,
		&comment.LikesCount,
		&comment.CreatedAt,
		&comment.UpdatedAt,
		&comment.IsDeleted,
	)

	if err != nil {
		return fmt.Errorf("failed to create comment: %w", err)
	}

	return nil
}

// GetCommentsByPostID retrieves all comments for a post
func (r *Repository) GetCommentsByPostID(ctx context.Context, postID uuid.UUID, currentUserID uuid.UUID) ([]models.Comment, error) {
	query := `
		SELECT c.id, c.post_id, c.user_id, c.content, c.likes_count, 
		       c.created_at, c.updated_at,
		       u.id, u.username, u.first_name, u.last_name, u.avatar_url,
		       EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = $2) as is_liked
		FROM comments c
		JOIN users u ON c.user_id = u.id
		WHERE c.post_id = $1 AND c.is_deleted = false
		ORDER BY c.created_at ASC
	`

	rows, err := r.db.Query(ctx, query, postID, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get comments: %w", err)
	}
	defer rows.Close()

	var comments []models.Comment

	for rows.Next() {
		var comment models.Comment
		var author models.UserResponse

		err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.UserID,
			&comment.Content,
			&comment.LikesCount,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&author.ID,
			&author.Username,
			&author.FirstName,
			&author.LastName,
			&author.AvatarURL,
			&comment.IsLiked,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan comment: %w", err)
		}

		comment.Author = &author
		comments = append(comments, comment)
	}

	return comments, nil
}

// DeleteComment soft deletes a comment
func (r *Repository) DeleteComment(ctx context.Context, commentID uuid.UUID) error {
	query := `UPDATE comments SET is_deleted = true WHERE id = $1 AND is_deleted = false`
	result, err := r.db.Exec(ctx, query, commentID)
	if err != nil {
		return fmt.Errorf("failed to delete comment: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("comment not found or already deleted")
	}

	return nil
}

// CheckPostOwnership checks if user owns the post
func (r *Repository) CheckPostOwnership(ctx context.Context, postID, userID uuid.UUID) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1 AND user_id = $2)`
	err := r.db.QueryRow(ctx, query, postID, userID).Scan(&exists)
	return exists, err
}

// CheckCommentOwnership checks if user owns the comment
func (r *Repository) CheckCommentOwnership(ctx context.Context, commentID, userID uuid.UUID) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM comments WHERE id = $1 AND user_id = $2)`
	err := r.db.QueryRow(ctx, query, commentID, userID).Scan(&exists)
	return exists, err
}
