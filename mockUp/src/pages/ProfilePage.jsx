import { useState } from 'react';

export default function ProfileMockup() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [activeTab, setActiveTab] = useState('posts');
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
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
      posts: 'Publications',
      about: 'À propos',
      friends: 'Amis',
      photos: 'Photos',
      followers: 'Abonnés',
      following: 'Abonnements',
      editProfile: 'Modifier le profil',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre',
      message: 'Message',
      joinedOn: 'Membre depuis',
      livesIn: 'Habite à',
      bio: 'Bio',
      viewAs: 'Voir comme visiteur'
    },
    EN: {
      posts: 'Posts',
      about: 'About',
      friends: 'Friends',
      photos: 'Photos',
      followers: 'Followers',
      following: 'Following',
      editProfile: 'Edit Profile',
      follow: 'Follow',
      unfollow: 'Unfollow',
      message: 'Message',
      joinedOn: 'Joined',
      livesIn: 'Lives in',
      bio: 'Bio',
      viewAs: 'View as visitor'
    }
  };
  
  const t = labels[language];

  const profile = {
    name: 'Marie Laurent',
    username: '@marielaurent',
    bio: language === 'FR' 
      ? 'Passionnée de photographie et amoureuse de Rouen. Je partage mes découvertes de la ville et ses trésors cachés.'
      : 'Photography enthusiast and Rouen lover. Sharing my discoveries of the city and its hidden treasures.',
    location: 'Rouen, France',
    joinDate: language === 'FR' ? 'Mars 2023' : 'March 2023',
    followers: 1247,
    following: 892,
    postsCount: 156
  };

  const tabs = [
    { id: 'posts', label: t.posts },
    { id: 'about', label: t.about },
    { id: 'friends', label: t.friends },
    { id: 'photos', label: t.photos }
  ];

  const samplePosts = [
    {
      id: 1,
      content: language === 'FR' 
        ? 'Coucher de soleil sur la Seine ce soir...' 
        : 'Sunset over the Seine this evening...',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
      likes: 89,
      comments: 12
    },
    {
      id: 2,
      content: language === 'FR' 
        ? 'Marché du dimanche au Vieux-Rouen' 
        : 'Sunday market in Old Rouen',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=300&fit=crop',
      likes: 156,
      comments: 23
    }
  ];

  const friends = [
    { name: 'Thomas D.', avatar: 'TD' },
    { name: 'Sophie M.', avatar: 'SM' },
    { name: 'Pierre L.', avatar: 'PL' },
    { name: 'Claire B.', avatar: 'CB' },
    { name: 'Lucas R.', avatar: 'LR' },
    { name: 'Emma V.', avatar: 'EV' }
  ];

  const photos = [
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1541849546-216549ae216d?w=300&h=300&fit=crop'
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsOwnProfile(!isOwnProfile)}
            style={{
              padding: '8px 14px',
              backgroundColor: theme.bgInput,
              border: 'none',
              borderRadius: '16px',
              color: theme.textSecondary,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {t.viewAs}
          </button>
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

      {/* Profile Content */}
      <div style={{ paddingTop: '60px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Cover Photo */}
        <div style={{
          height: '320px',
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1a1c2e 50%, ${colors.accent}44 100%)`,
          backgroundImage: 'url(https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200&h=400&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          {/* Gradient overlay for better text readability */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: `linear-gradient(transparent, ${theme.bg})`
          }} />
        </div>

        {/* Profile Info Section */}
        <div style={{
          padding: '0 24px',
          marginTop: '-80px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '24px',
            marginBottom: '20px'
          }}>
            {/* Profile Picture */}
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              border: `4px solid ${theme.bg}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              ML
            </div>

            {/* Name and Actions */}
            <div style={{ flex: 1, paddingBottom: '12px' }}>
              <h1 style={{ 
                color: theme.text, 
                fontSize: '28px', 
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                {profile.name}
              </h1>
              <p style={{ 
                color: theme.textSecondary, 
                fontSize: '16px',
                marginBottom: '12px'
              }}>
                {profile.username}
              </p>
              
              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <span style={{ color: theme.text, fontWeight: 'bold', fontSize: '18px' }}>
                    {profile.followers.toLocaleString()}
                  </span>
                  <span style={{ color: theme.textSecondary, marginLeft: '6px', fontSize: '14px' }}>
                    {t.followers}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.text, fontWeight: 'bold', fontSize: '18px' }}>
                    {profile.following.toLocaleString()}
                  </span>
                  <span style={{ color: theme.textSecondary, marginLeft: '6px', fontSize: '14px' }}>
                    {t.following}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.text, fontWeight: 'bold', fontSize: '18px' }}>
                    {profile.postsCount}
                  </span>
                  <span style={{ color: theme.textSecondary, marginLeft: '6px', fontSize: '14px' }}>
                    {t.posts}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
              {isOwnProfile ? (
                <button style={{
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {t.editProfile}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    style={{
                      padding: '12px 24px',
                      background: isFollowing ? 'transparent' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      border: isFollowing ? `2px solid ${colors.accent}` : 'none',
                      borderRadius: '8px',
                      color: isFollowing ? colors.accent : '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isFollowing ? t.unfollow : t.follow}
                  </button>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: theme.bgInput,
                    border: 'none',
                    borderRadius: '8px',
                    color: theme.text,
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                    {t.message}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio and Info */}
          <div style={{
            backgroundColor: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
              {profile.bio}
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
                  {t.livesIn} <span style={{ color: theme.text }}>{profile.location}</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
                  {t.joinedOn} <span style={{ color: theme.text }}>{profile.joinDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: '0'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `3px solid ${colors.accent}` : '3px solid transparent',
                  color: activeTab === tab.id ? colors.accent : theme.textSecondary,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ paddingBottom: '40px' }}>
            {activeTab === 'posts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {samplePosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: theme.bgCard,
                      borderRadius: '12px',
                      border: `1px solid ${theme.border}`,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
                          fontSize: '14px'
                        }}>
                          ML
                        </div>
                        <div>
                          <div style={{ color: theme.text, fontWeight: '600', fontSize: '14px' }}>{profile.name}</div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>2h</div>
                        </div>
                      </div>
                      <p style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>{post.content}</p>
                    </div>
                    {post.image && (
                      <img src={post.image} alt="" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '12px 16px', display: 'flex', gap: '24px', color: theme.textSecondary, fontSize: '14px' }}>
                      <span>{post.likes} {language === 'FR' ? "j'aime" : 'likes'}</span>
                      <span>{post.comments} {language === 'FR' ? 'commentaires' : 'comments'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                padding: '24px'
              }}>
                <h3 style={{ color: theme.text, fontSize: '18px', marginBottom: '16px' }}>{t.about}</h3>
                <p style={{ color: theme.textSecondary, lineHeight: '1.7' }}>{profile.bio}</p>
              </div>
            )}

            {activeTab === 'friends' && (
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                padding: '20px'
              }}>
                <h3 style={{ color: theme.text, fontSize: '18px', marginBottom: '16px' }}>
                  {t.friends} ({friends.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {friends.map((friend, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: theme.bgHover,
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {friend.avatar}
                      </div>
                      <span style={{ color: theme.text, fontWeight: '500', fontSize: '14px' }}>{friend.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                padding: '20px'
              }}>
                <h3 style={{ color: theme.text, fontSize: '18px', marginBottom: '16px' }}>{t.photos}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt=""
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}