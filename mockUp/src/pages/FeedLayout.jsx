import { useState } from 'react';

export default function FeedMockup() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
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

  const labels = {
    FR: {
      whatsOnMind: "Qu'avez-vous en tête ?",
      photo: 'Photo/Vidéo',
      location: 'Localisation',
      tagPeople: 'Taguer',
      feeling: 'Humeur',
      music: 'Musique',
      like: "J'aime",
      comment: 'Commenter',
      share: 'Partager',
      seeMore: 'Voir plus',
      seeLess: 'Voir moins',
      likes: "j'aime",
      comments: 'commentaires',
      weather: 'Météo à Rouen',
      trending: 'Tendances',
      suggestions: 'Suggestions'
    },
    EN: {
      whatsOnMind: "What's on your mind?",
      photo: 'Photo/Video',
      location: 'Location',
      tagPeople: 'Tag',
      feeling: 'Feeling',
      music: 'Music',
      like: 'Like',
      comment: 'Comment',
      share: 'Share',
      seeMore: 'See more',
      seeLess: 'See less',
      likes: 'likes',
      comments: 'comments',
      weather: 'Weather in Rouen',
      trending: 'Trending',
      suggestions: 'Suggestions'
    }
  };
  
  const t = labels[language];

  const posts = [
    {
      id: 1,
      user: { name: 'Marie Laurent', avatar: 'ML' },
      time: language === 'FR' ? 'Il y a 2 heures' : '2 hours ago',
      content: language === 'FR' 
        ? "Magnifique journée au marché du Vieux-Rouen ce matin ! J'ai trouvé des produits locaux incroyables. Les fromages normands sont vraiment les meilleurs. Je recommande à tous de visiter ce marché le weekend, l'ambiance est vraiment unique et les commerçants sont très sympathiques."
        : "Beautiful day at the Old Rouen market this morning! Found amazing local products. Norman cheeses are truly the best. I recommend everyone to visit this market on weekends, the atmosphere is really unique and the merchants are very friendly.",
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop',
      music: { title: 'Sunny Day', artist: 'Jazz Café' },
      likes: 47,
      commentsCount: 12
    },
    {
      id: 2,
      user: { name: 'Thomas Dubois', avatar: 'TD' },
      time: language === 'FR' ? 'Il y a 5 heures' : '5 hours ago',
      content: language === 'FR' 
        ? "Concert incroyable hier soir au 106 ! L'énergie était folle."
        : "Incredible concert last night at Le 106! The energy was insane.",
      image: null,
      music: null,
      likes: 23,
      commentsCount: 5
    },
    {
      id: 3,
      user: { name: 'Sophie Martin', avatar: 'SM' },
      time: language === 'FR' ? 'Il y a 1 jour' : '1 day ago',
      content: language === 'FR'
        ? "La cathédrale de Rouen au coucher du soleil... Toujours aussi impressionnante après toutes ces années. Cette ville ne cesse jamais de me surprendre avec sa beauté architecturale. Monet avait vraiment raison de l'immortaliser dans ses peintures."
        : "Rouen Cathedral at sunset... Still as impressive after all these years. This city never ceases to amaze me with its architectural beauty. Monet was really right to immortalize it in his paintings.",
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop',
      music: { title: 'Clair de Lune', artist: 'Debussy' },
      likes: 156,
      commentsCount: 34
    }
  ];

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const createPostOptions = [
    { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: t.photo, color: '#10b981' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: t.location, color: '#ef4444' },
    { icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', label: t.tagPeople, color: '#3b82f6' },
    { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: t.feeling, color: '#f59e0b' },
    { icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', label: t.music, color: '#8b5cf6' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: theme.bgCard,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          City-Buzz
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            style={{
              padding: '8px 14px',
              backgroundColor: theme.bgInput,
              border: 'none',
              borderRadius: '16px',
              color: theme.text,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {language}
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: theme.bgInput,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.iconColor} strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.iconColor} strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '80px',
        gap: '24px',
        padding: '80px 20px 20px'
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
                JD
              </div>
              <input
                type="text"
                placeholder={t.whatsOnMind}
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

          {/* Posts */}
          {posts.map((post) => {
            const isLong = post.content.length > 150;
            const isExpanded = expandedPosts[post.id];
            const displayContent = isLong && !isExpanded 
              ? post.content.substring(0, 150) + '...' 
              : post.content;

            return (
              <div
                key={post.id}
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
                    {post.user.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: theme.text, fontWeight: '600', fontSize: '15px' }}>
                      {post.user.name}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                      {post.time}
                    </div>
                  </div>
                  <button style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
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
                      {isExpanded ? t.seeLess : t.seeMore}
                    </button>
                  )}
                </div>

                {/* Music Tag */}
                {post.music && (
                  <div style={{
                    margin: '0 16px 12px',
                    padding: '10px 14px',
                    backgroundColor: theme.bgInput,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                      <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <div>
                      <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{post.music.title}</div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>{post.music.artist}</div>
                    </div>
                  </div>
                )}

                {/* Post Image */}
                {post.image && (
                  <img
                    src={post.image}
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
                  <span>{(likedPosts[post.id] ? post.likes + 1 : post.likes)} {t.likes}</span>
                  <span>{post.commentsCount} {t.comments}</span>
                </div>

                {/* Post Actions */}
                <div style={{
                  display: 'flex',
                  borderTop: `1px solid ${theme.border}`,
                  padding: '4px 8px'
                }}>
                  {[
                    { label: t.like, icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3', isLike: true },
                    { label: t.comment, icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' },
                    { label: t.share, icon: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' }
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.isLike && toggleLike(post.id)}
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
              {t.weather}
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
                  {language === 'FR' ? 'Ensoleillé' : 'Sunny'}
                </div>
              </div>
            </div>
          </div>

          {/* Trending */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              {t.trending}
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

          {/* Suggestions */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '16px'
          }}>
            <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              {t.suggestions}
            </h3>
            {[
              { name: 'Pierre Leroy', mutual: 5 },
              { name: 'Claire Moreau', mutual: 3 },
              { name: 'Lucas Bernard', mutual: 8 }
            ].map((person, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>{person.name}</div>
                  <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                    {person.mutual} {language === 'FR' ? 'amis en commun' : 'mutual friends'}
                  </div>
                </div>
                <button style={{
                  padding: '6px 14px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  {language === 'FR' ? 'Ajouter' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}