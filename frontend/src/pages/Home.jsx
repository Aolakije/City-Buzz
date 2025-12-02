import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout';
import postService from '../services/post.service';
import useAuthStore from '../store/authStore';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#0d0e17' : '#ffffff',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.08)',
    bgHover: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(41, 45, 79, 0.08)',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
    iconColor: isDark ? '#ffffff' : '#292d4f'
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getFeed();
      setPosts(response.data || []);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };
    const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
        setCreatingPost(true);
        const newPost = await postService.createPost(newPostContent); // string only
        setPosts([newPost, ...posts]); // prepend the new post correctly
        setNewPostContent('');
    } catch (err) {
        setError('Failed to create post');
        console.error('Error creating post:', err);
    } finally {
        setCreatingPost(false);
    }
    };


  const handleLikePost = async (postId) => {
    try {
      if (likedPosts[postId]) {
        await postService.unlikePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p));
      } else {
        await postService.likePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return i18n.language === 'fr' ? 'À l\'instant' : 'Just now';
    if (diffInHours < 24) return i18n.language === 'fr' ? `Il y a ${diffInHours} heures` : `${diffInHours} hours ago`;
    if (diffInDays === 1) return i18n.language === 'fr' ? 'Il y a 1 jour' : '1 day ago';
    return i18n.language === 'fr' ? `Il y a ${diffInDays} jours` : `${diffInDays} days ago`;
  };

  const createPostOptions = [
    { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: i18n.language === 'fr' ? 'Photo/Vidéo' : 'Photo/Video', color: '#10b981' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: i18n.language === 'fr' ? 'Localisation' : 'Location', color: '#ef4444' },
    { icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', label: i18n.language === 'fr' ? 'Taguer' : 'Tag', color: '#3b82f6' },
    { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: i18n.language === 'fr' ? 'Humeur' : 'Feeling', color: '#f59e0b' },
  ];

  return (
    <Layout>
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '24px',
        padding: '0 20px 20px'
      }}>
        {/* Feed Column */}
        <div style={{ flex: 1, maxWidth: '680px' }}>
          {/* Create Post Box */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <input
                type="text"
                placeholder={i18n.language === 'fr' ? "Qu'avez-vous en tête ?" : "What's on your mind?"}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
                disabled={creatingPost}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: theme.bgInput,
                  border: 'none',
                  borderRadius: '24px',
                  color: theme.text,
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: `1px solid ${theme.border}`,
              paddingTop: '12px'
            }}>
              {createPostOptions.map((option, i) => (
                <button
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: theme.textSecondary,
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={option.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={option.icon} />
                  </svg>
                  <span style={{ color: theme.text }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: theme.textSecondary
            }}>
              Loading posts...
            </div>
          )}

          {/* Posts */}
          {!loading && posts.map((post) => {
            const isLong = post?.content?.length > 150;
            const isExpanded = expandedPosts[post?.id];
            const displayContent = isLong && !isExpanded 
                 ? post.content.substring(0, 150) + '...' 
                 : post?.content;

            return (
              <div
                key={post?.id}
                style={{
                  backgroundColor: theme.bgCard,
                  borderRadius: '12px',
                  border: `1px solid ${theme.border}`,
                  marginBottom: '20px',
                  overflow: 'hidden'
                }}
              >
                {/* Post Header */}
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {post.user?.first_name?.[0]}{post.user?.last_name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: theme.text, fontWeight: '600', fontSize: '15px' }}>
                      {post.user?.first_name} {post.user?.last_name}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                      {formatTime(post.created_at)}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ padding: '0 16px 12px' }}>
                  <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.5', margin: 0 }}>
                    {displayContent}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.accent,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '4px 0',
                        marginTop: '4px'
                      }}
                    >
                      {isExpanded 
                        ? (i18n.language === 'fr' ? 'Voir moins' : 'See less')
                        : (i18n.language === 'fr' ? 'Voir plus' : 'See more')
                      }
                    </button>
                  )}
                </div>

                {/* Post Image */}
                {post.image_urls && post.image_urls.length > 0 && (
                  <img
                    src={post.image_urls[0]}
                    alt=""
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                  />
                )}

                {/* Post Stats */}
                <div style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: theme.textSecondary,
                  fontSize: '14px'
                }}>
                  <span>{post.likes_count || 0} {i18n.language === 'fr' ? "j'aime" : 'likes'}</span>
                  <span>{post.comments_count || 0} {i18n.language === 'fr' ? 'commentaires' : 'comments'}</span>
                </div>

                {/* Post Actions */}
                <div style={{
                  display: 'flex',
                  borderTop: `1px solid ${theme.border}`,
                  padding: '4px 8px'
                }}>
                  {[
                    { 
                      label: i18n.language === 'fr' ? "J'aime" : 'Like', 
                      icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3', 
                      isLike: true 
                    },
                    { 
                      label: i18n.language === 'fr' ? 'Commenter' : 'Comment', 
                      icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' 
                    },
                    { 
                      label: i18n.language === 'fr' ? 'Partager' : 'Share', 
                      icon: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' 
                    }
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.isLike && handleLikePost(post.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: action.isLike && likedPosts[post.id] ? colors.accent : theme.textSecondary,
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={action.isLike && likedPosts[post.id] ? colors.accent : 'none'} stroke={action.isLike && likedPosts[post.id] ? colors.accent : theme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={action.icon} />
                      </svg>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.textSecondary
            }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: theme.text }}>
                {i18n.language === 'fr' ? 'Aucune publication' : 'No posts yet'}
              </div>
              <div style={{ fontSize: '14px' }}>
                {i18n.language === 'fr' ? 'Soyez le premier à publier quelque chose!' : 'Be the first to post something!'}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          {/* Weather Widget */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              {i18n.language === 'fr' ? 'Météo à Rouen' : 'Weather in Rouen'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
              <div>
                <div style={{ color: theme.text, fontSize: '32px', fontWeight: 'bold' }}>18°C</div>
                <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                  {i18n.language === 'fr' ? 'Ensoleillé' : 'Sunny'}
                </div>
              </div>
            </div>
          </div>

          {/* Trending */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '16px'
          }}>
            <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              {i18n.language === 'fr' ? 'Tendances' : 'Trending'}
            </h3>
            {['#RouenFestival', '#MarchéVieuxRouen', '#Normandie', '#CathédraleRouen'].map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 0',
                  borderBottom: i < 3 ? `1px solid ${theme.border}` : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ color: colors.accent, fontSize: '14px', fontWeight: '600' }}>{tag}</div>
                <div style={{ color: theme.textSecondary, fontSize: '12px' }}>{120 - i * 20} posts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}