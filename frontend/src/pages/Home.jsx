import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout';
import postService from '../services/post.service';
import useAuthStore from '../store/authStore';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  
  // State
  const [isDark, setIsDark] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInput, setCommentInput] = useState({}); // Track comment inputs per post
  const [submittingComment, setSubmittingComment] = useState({}); // Track loading per post
  const [showCommentsFor, setShowCommentsFor] = useState({}); // Track which posts show comments
  const [showMenuFor, setShowMenuFor] = useState(null); // Track which post menu is open
  const [editingPost, setEditingPost] = useState(null); // Track which post is being edited
  const [editContent, setEditContent] = useState(''); // Content for editing

  // Theme Config
  const colors = { 
    primary: '#292d4f', 
    accent: '#f6f182', 
    likeRed: '#e11d48',
    linkBlue: '#3b82f6'
  };
  
  const theme = {
    bg: isDark ? '#0d0e17' : '#f3f4f6',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f0f2f5',
    bgHover: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f2f2f2',
    text: isDark ? '#e2e8f0' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    divider: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb',
  };

  useEffect(() => { fetchPosts(); }, []);
  // Initialize liked posts from backend data
    useEffect(() => {
    const initialLikes = {};
    posts.forEach(post => {
        if (post.is_liked) {
        initialLikes[post.id] = true;
        }
    });
    setLikedPosts(initialLikes);
    }, [posts.length]); // Only run when posts are first loaded

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getFeed();
      const safePosts = (data || []).map(p => ({
        ...p,
        author: p.author || user,
        comments: p.comments || []
      }));
      setPosts(safePosts);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      setCreatingPost(true);
      const newPost = await postService.createPost(newPostContent);
      if (!newPost.author) newPost.author = user;
      if (!newPost.comments) newPost.comments = [];
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error('Create post error:', err);
      setError('Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      if (likedPosts[postId]) {
        await postService.unlikePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) - 1 } : p));
      } else {
        await postService.likePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
      }
    } catch (err) { 
      console.error('Like post error:', err); 
    }
  };

  // Handle comment submission
 const handleSubmitComment = async (postId) => {
  const content = commentInput[postId]?.trim();
  if (!content) return;

  try {
    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    
    // Create comment via API
    const newComment = await postService.createComment(postId, content);
    
    if (!newComment) {
      throw new Error('No comment data returned from API');
    }
    
    // OPTIMISTIC UPDATE: Add comment immediately without refetching
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const updatedComments = [...(p.comments || []), {
          id: newComment.id || Date.now(),
          content: newComment.content || content,
          author: newComment.author || user,
          created_at: newComment.created_at || new Date().toISOString()
        }];
        
        return {
          ...p,
          comments: updatedComments,
          comments_count: updatedComments.length
        };
      }
      return p;
    }));

    // Clear input IMMEDIATELY (don't wait for backend)
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
    
  } catch (err) {
    console.error('Submit comment error:', err);
    setError('Failed to post comment. Please try again.');
    setTimeout(() => setError(''), 5000);
  } finally {
    setSubmittingComment(prev => ({ ...prev, [postId]: false }));
  }
}; 

  // Handle comment input change
  const handleCommentInputChange = (postId, value) => {
    setCommentInput(prev => ({ ...prev, [postId]: value }));
  };

 const toggleComments = async (postId) => {
  const isCurrentlyShowing = showCommentsFor[postId];
  
  // Toggle the visibility first
  setShowCommentsFor(prev => ({ ...prev, [postId]: !prev[postId] }));

  // ONLY fetch if we're OPENING (not closing) AND comments aren't already loaded
  if (!isCurrentlyShowing && (!posts.find(p => p.id === postId)?.comments?.length)) {
    try {
      const comments = await postService.getComments(postId);
      
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: comments,
            comments_count: comments.length // Update count from backend
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }
};
  // Toggle post menu
  const toggleMenu = (postId) => {
    setShowMenuFor(showMenuFor === postId ? null : postId);
  };

  // Start editing a post
  const startEdit = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
    setShowMenuFor(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
  };

  // Save edited post
  const handleUpdatePost = async (postId) => {
    if (!editContent.trim()) return;
    
    try {
      await postService.updatePost(postId, editContent);
      setPosts(posts.map(p => p.id === postId ? { ...p, content: editContent } : p));
      setEditingPost(null);
      setEditContent('');
    } catch (err) {
      console.error('Update post error:', err);
      setError('Failed to update post');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      setShowMenuFor(null);
    } catch (err) {
      console.error('Delete post error:', err);
      setError('Failed to delete post');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleExpand = (postId) => { 
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] })); 
  };

  const btnStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: theme.textSecondary,
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  };

  const createPostOptions = [
    { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Media', color: '#45bd62' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Location', color: '#f5533d' },
    { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Feeling', color: '#f7b928' },
  ];

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: theme.text }}>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', gap: '24px', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        
        {/* Main Feed */}
        <div style={{ flex: 1, maxWidth: '600px' }}>
          
          {/* Error Display */}
          {error && (
            <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* Create Post Card */}
          <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '20px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <input
                type="text"
                placeholder={i18n.language === 'fr' ? "Quoi de neuf, " + user?.first_name + " ?" : `What's on your mind, ${user?.first_name}?`}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
                disabled={creatingPost}
                style={{ flex: 1, padding: '10px 16px', backgroundColor: theme.bgInput, border: 'none', borderRadius: '20px', color: theme.text, fontSize: '15px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.divider}`, paddingTop: '12px' }}>
              {createPostOptions.map((option, i) => (
                <button key={i} style={{ ...btnStyle, flex: 'unset', padding: '8px 12px' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={option.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={option.icon} />
                  </svg>
                  <span style={{ color: theme.textSecondary }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          {posts.map(post => {
            const isLiked = likedPosts[post.id];
            const hasComments = post.comments && post.comments.length > 0;
            const showComments = showCommentsFor[post.id];
            const isEditing = editingPost === post.id;
            const isOwnPost = post.author?.id === user?.id;
            
            return (
              <div key={post.id} style={{ backgroundColor: theme.bgCard, borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                
                {/* Post Header */}
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: `linear-gradient(45deg, ${colors.primary}, ${colors.linkBlue})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600' }}>
                    {post.author?.first_name?.[0]}
                  </div>
                  <div>
                    <div style={{ color: theme.text, fontWeight: '600', fontSize: '15px' }}>
                      {post.author?.first_name} {post.author?.last_name}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Three Dots Menu (only for own posts) */}
                  {isOwnPost && (
                    <div style={{ marginLeft: 'auto', position: 'relative' }}>
                      <button 
                        onClick={() => toggleMenu(post.id)}
                        style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '20px', padding: '4px 8px', borderRadius: '4px', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        •••
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showMenuFor === post.id && (
                        <div style={{ 
                          position: 'absolute', 
                          right: 0, 
                          top: '100%', 
                          marginTop: '4px',
                          backgroundColor: theme.bgCard, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          minWidth: '150px',
                          zIndex: 1000,
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => startEdit(post)}
                            style={{ 
                              width: '100%', 
                              padding: '12px 16px', 
                              border: 'none', 
                              background: 'none', 
                              textAlign: 'left', 
                              color: theme.text, 
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Post
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ 
                              width: '100%', 
                              padding: '12px 16px', 
                              border: 'none', 
                              background: 'none', 
                              textAlign: 'left', 
                              color: colors.likeRed, 
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete Post
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Content - Editable or Display */}
                {isEditing ? (
                  <div style={{ padding: '0 16px 16px' }}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        backgroundColor: theme.bgInput,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.text,
                        fontSize: '15px',
                        lineHeight: '1.5',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => handleUpdatePost(post.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: colors.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          color: theme.textSecondary,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '0 16px 16px', color: theme.text, fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </div>
                )}

                {/* Stats Bar */}
                <div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: theme.textSecondary }}>
                   {post.likes_count > 0 && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ background: colors.likeRed, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </span>
                        {post.likes_count}
                     </div>
                   )}
                   <div style={{ marginLeft: 'auto' }}>
                      {post.comments?.length > 0 && <span>{post.comments.length} comments</span>}
                   </div>
                </div>

                {/* ACTION BAR */}
                <div style={{ borderTop: `1px solid ${theme.divider}`, borderBottom: `1px solid ${theme.divider}`, padding: '4px 16px', display: 'flex' }}>
                  
                  {/* LIKE BUTTON */}
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={{ ...btnStyle, color: isLiked ? colors.likeRed : theme.textSecondary }}
                  >
                    {isLiked ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    )}
                    <span>{i18n.language === 'fr' ? 'J\'aime' : 'Like'}</span>
                  </button>

                {/* COMMENT BUTTON */}
<button 
  onClick={() => toggleComments(post.id)}
  style={btnStyle}
  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
  <span>{i18n.language === 'fr' ? 'Commenter' : 'Comment'}</span>
</button>

{/* SHARE BUTTON */}
<button 
  style={btnStyle}
  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
  <span>Partager</span>
</button>
</div>

{/* Comment Section & Input */}
{/* ======= FIX ADDED: Wrap comments & input with showCommentsFor[post.id] ======= */}
{showCommentsFor[post.id] && (
  <div style={{ padding: '16px' }}>

    {/* Existing Comments */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
      {post.comments.map(comment => (
        <div key={comment.id} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#ccc', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
            {comment.author?.first_name?.[0]}
          </div>
          <div style={{ backgroundColor: theme.bgInput, padding: '8px 12px', borderRadius: '12px', fontSize: '14px' }}>
            <div style={{ fontWeight: '600', color: theme.text, fontSize: '13px' }}>
              {comment.author?.first_name} {comment.author?.last_name}
            </div>
            <div style={{ color: theme.text }}>{comment.content}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Write Comment Input - FIXED */}
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ width: '32px', height: '32px', background: colors.primary, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
        {user?.first_name?.[0]}
      </div>
      <div style={{ flex: 1, backgroundColor: theme.bgInput, borderRadius: '20px', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder={i18n.language === 'fr' ? 'Écrire un commentaire...' : 'Write a comment...'}
          value={commentInput[post.id] || ''}
          onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !submittingComment[post.id]) {
              handleSubmitComment(post.id);
            }
          }}
          disabled={submittingComment[post.id]}
          style={{ width: '100%', padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', color: theme.text, fontSize: '14px' }}
        />
        <button 
          onClick={() => handleSubmitComment(post.id)}
          disabled={!commentInput[post.id]?.trim() || submittingComment[post.id]}
          style={{ border: 'none', background: 'none', cursor: commentInput[post.id]?.trim() ? 'pointer' : 'not-allowed', padding: '8px', opacity: commentInput[post.id]?.trim() ? 1 : 0.5 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>

  </div>
)}
</div>
);
})}
</div>     

        {/* Right Sidebar */}
        <div style={{ width: '300px', flexShrink: 0, display: 'none', '@media(min-width: 900px)': { display: 'block' } }}> 
           <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '16px' }}>
             <h3 style={{ margin: '0 0 12px 0', color: theme.textSecondary, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
               {i18n.language === 'fr' ? 'Météo' : 'Weather'}
             </h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>☀️</span>
                <div>
                  <div style={{ color: theme.text, fontWeight: 'bold' }}>Rouen</div>
                  <div style={{ color: theme.textSecondary, fontSize: '13px' }}>18°C • Ensoleillé</div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </Layout>
  );
}