-- Drop triggers
DROP TRIGGER IF EXISTS comment_like_removed ON comment_likes;
DROP TRIGGER IF EXISTS comment_like_added ON comment_likes;
DROP TRIGGER IF EXISTS post_comment_removed ON comments;
DROP TRIGGER IF EXISTS post_comment_added ON comments;
DROP TRIGGER IF EXISTS post_like_removed ON post_likes;
DROP TRIGGER IF EXISTS post_like_added ON post_likes;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- Drop functions
DROP FUNCTION IF EXISTS decrement_comment_likes();
DROP FUNCTION IF EXISTS increment_comment_likes();
DROP FUNCTION IF EXISTS decrement_post_comments();
DROP FUNCTION IF EXISTS increment_post_comments();
DROP FUNCTION IF EXISTS decrement_post_likes();
DROP FUNCTION IF EXISTS increment_post_likes();

-- Drop indexes
DROP INDEX IF EXISTS idx_comment_likes_user_id;
DROP INDEX IF EXISTS idx_comment_likes_comment_id;
DROP INDEX IF EXISTS idx_post_likes_user_id;
DROP INDEX IF EXISTS idx_post_likes_post_id;
DROP INDEX IF EXISTS idx_comments_created_at;
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_comments_post_id;
DROP INDEX IF EXISTS idx_posts_is_deleted;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_user_id;

-- Drop tables
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;