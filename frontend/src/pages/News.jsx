import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import newsService from '../services/news.service';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';

export default function News() {
  const { i18n } = useTranslation();
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();
  
  // State
  const [activeLocation, setActiveLocation] = useState('rouen');
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
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

  const t = {
    news: i18n.language === 'fr' ? 'Actualités' : 'News',
    search: i18n.language === 'fr' ? 'Rechercher...' : 'Search...',
    readMore: i18n.language === 'fr' ? 'Lire la suite' : 'Read more',
    save: i18n.language === 'fr' ? 'Enregistrer' : 'Save',
    saved: i18n.language === 'fr' ? 'Enregistré' : 'Saved',
    loading: i18n.language === 'fr' ? 'Chargement...' : 'Loading...',
    noArticles: i18n.language === 'fr' ? 'Aucun article trouvé' : 'No articles found',
    errorLoading: i18n.language === 'fr' ? 'Erreur lors du chargement des actualités' : 'Error loading news',
    rouen: 'Rouen',
    normandy: i18n.language === 'fr' ? 'Normandie' : 'Normandy',
    france: 'France',
    loadMore: i18n.language === 'fr' ? 'Voir plus d\'articles' : 'Load More Articles',
    noMore: i18n.language === 'fr' ? 'Vous avez vu tous les articles' : 'You\'ve seen all articles'
  };

  const locations = [
    { id: 'rouen', label: t.rouen, },
    { id: 'normandy', label: t.normandy,},
    { id: 'france', label: t.france,}
  ];

  const categories = [
    { id: 'all', label: i18n.language === 'fr' ? 'Tout' : 'All', color: colors.accent, apiCategory: '' },
    { id: 'sports', label: 'Sports', color: '#10b981', apiCategory: 'sports' },
    { id: 'business', label: i18n.language === 'fr' ? 'Économie' : 'Business', color: '#06b6d4', apiCategory: 'business' },
    { id: 'technology', label: i18n.language === 'fr' ? 'Technologie' : 'Technology', color: '#8b5cf6', apiCategory: 'technology' },
    { id: 'entertainment', label: i18n.language === 'fr' ? 'Divertissement' : 'Entertainment', color: '#f59e0b', apiCategory: 'entertainment' },
    { id: 'science', label: 'Science', color: '#3b82f6', apiCategory: 'science' },
    { id: 'health', label: i18n.language === 'fr' ? 'Santé' : 'Health', color: '#ef4444', apiCategory: 'health' }
  ];

  const getApiCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.apiCategory || '';
  };

  const fetchNews = async (category = 'all', location = 'rouen', pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');
      
      const apiCategory = getApiCategory(category);
      const language = i18n.language;
      let response;
      
      if (location === 'rouen') {
        response = await newsService.getRouenNews(apiCategory, language, pageNum, 20);
      } else if (location === 'normandy') {
        response = await newsService.getNormandyNews(apiCategory, language, pageNum, 20);
      } else if (location === 'france') {
        response = await newsService.getFranceNews(apiCategory, language, pageNum, 20);
      }
      
      if (response && response.articles) {
        if (append) {
          setArticles(prev => [...prev, ...response.articles]);
        } else {
          setArticles(response.articles);
        }
        setHasMore(response.articles.length === 20);
      } else {
        if (!append) {
          setArticles([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
      if (!append) {
        setArticles([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNews(activeCategory, activeLocation, 1, false);
  }, [activeCategory, activeLocation, i18n.language]);

  useEffect(() => {
    if (user) {
      loadSavedArticles();
    }
  }, [user]);

  const loadSavedArticles = async () => {
    try {
      const saved = await newsService.getSavedArticles();
      const savedMap = {};
      saved.forEach(article => {
        savedMap[article.article_url] = true;
      });
      setSavedArticles(savedMap);
    } catch (err) {
      console.error('Error loading saved articles:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await newsService.searchNews(searchQuery, i18n.language, 1, 20);
      
      if (response && response.articles) {
        setArticles(response.articles);
        setActiveCategory('all');
        setPage(1);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error searching news:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (article) => {
    if (!user) {
      alert(i18n.language === 'fr' ? 'Connectez-vous pour enregistrer des articles' : 'Please log in to save articles');
      return;
    }

    const articleUrl = article.url;
    const isCurrentlySaved = savedArticles[articleUrl];

    try {
      if (isCurrentlySaved) {
        await newsService.removeSavedArticle(articleUrl);
        setSavedArticles(prev => {
          const updated = { ...prev };
          delete updated[articleUrl];
          return updated;
        });
      } else {
        const articleData = {
          article_url: article.url,
          article_title: article.title,
          article_image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
          article_source: article.source?.name || 'Unknown',
        };
        await newsService.saveArticle(articleData);
        setSavedArticles(prev => ({ ...prev, [articleUrl]: true }));
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      alert(i18n.language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Error saving article');
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
    setPage(1);
  };

  const handleLocationChange = (locationId) => {
    setActiveLocation(locationId);
    setShowLocationMenu(false);
    setSearchQuery('');
    setPage(1);
  };

  const loadMoreArticles = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(activeCategory, activeLocation, nextPage, true);
  };

  const currentLocation = locations.find(loc => loc.id === activeLocation);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHrs < 24) return `${diffHrs}h`;
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US');
  };

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingTop: '20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 40px' }}>
          
          {/* Title & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{t.news}</h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 16px',
                  width: '240px',
                  backgroundColor: theme.bgInput,
                  border: 'none',
                  borderRadius: '24px',
                  color: theme.text,
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </form>
          </div>

          {/* Location Dropdown + Categories */}
          <div style={{ marginBottom: '14px' }}>
            {/* Location Selector */}
            <div style={{ marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '24px',
                  color: theme.text,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{currentLocation?.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showLocationMenu && (
                <>
                  <div 
                    onClick={() => setShowLocationMenu(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    minWidth: '200px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    padding: '8px',
                    zIndex: 1000
                  }}>
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationChange(loc.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: activeLocation === loc.id ? theme.bgHover : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '15px',
                          color: theme.text,
                          fontWeight: activeLocation === loc.id ? '600' : '400',
                          marginBottom: '4px'
                        }}
                        onMouseOver={(e) => {
                          if (activeLocation !== loc.id) e.currentTarget.style.backgroundColor = theme.bgHover;
                        }}
                        onMouseOut={(e) => {
                          if (activeLocation !== loc.id) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{loc.flag}</span>
                        <span>{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginTop: '16px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: activeCategory === cat.id ? colors.primary : theme.bgCard,
                    border: `1px solid ${activeCategory === cat.id ? colors.primary : theme.border}`,
                    borderRadius: '10px',
                    color: activeCategory === cat.id ? colors.accent : theme.text,
                    fontSize: '14px',
                    fontWeight: activeCategory === cat.id ? '700' : '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.backgroundColor = theme.bgHover;
                      e.currentTarget.style.borderColor = colors.primary;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.backgroundColor = theme.bgCard;
                      e.currentTarget.style.borderColor = theme.border;
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {t.errorLoading}: {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              color: theme.text,
              fontSize: '18px'
            }}>
              {t.loading}
            </div>
          )}

          {/* No Articles */}
          {!loading && articles.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.textSecondary,
              fontSize: '16px'
            }}>
              {t.noArticles}
            </div>
          )}

          {/* Articles */}
          {!loading && articles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {articles.map((article, index) => {
                const articleUrl = article.url;
                const isSaved = savedArticles[articleUrl];
                
                return (
                  <div
                    key={`${articleUrl}-${index}`}
                    style={{
                      backgroundColor: theme.bgCard,
                      borderRadius: '5px',
                      border: `1px solid ${theme.border}`,
                      overflow: 'visible',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=350&fit=crop'} 
                        alt={article.title} 
                        style={{  width: '100%', height:'240px',objectFit: 'cover' }}
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=350&fit=crop'}
                      />
                    </div>
                    
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                        {article.title}
                      </h3>
                      <p style={{ color: theme.textSecondary, fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                        {article.description || ''}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: `1px solid ${theme.border}`,
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                          </svg>
                          <span style={{ color: theme.textSecondary, fontSize: '13px', fontWeight: '500' }}>
                            {article.source?.name || 'Source'}
                          </span>
                          <span style={{ color: theme.textSecondary, fontSize: '13px' }}>•</span>
                          <span style={{ color: theme.textSecondary, fontSize: '13px' }}>
                            {formatTime(article.publishedAt)}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {user && (
                            <button
                              onClick={() => toggleSave(article)}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: isSaved ? colors.primary : 'transparent',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '8px',
                                color: isSaved ? colors.accent : theme.text,
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                              </svg>
                              {isSaved ? t.saved : t.save}
                            </button>
                          )}
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '8px 16px',
                              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              display: 'inline-block'
                            }}
                          >
                            {t.readMore}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {!loading && articles.length > 0 && hasMore && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '32px',
              marginBottom: '20px'
            }}>
              <button
                onClick={loadMoreArticles}
                disabled={loadingMore}
                style={{
                  padding: '14px 32px',
                  background: loadingMore 
                    ? theme.bgInput 
                    : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '24px',
                  color: loadingMore ? theme.textSecondary : '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (!loadingMore) e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {loadingMore ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    {t.loadMore}
                  </>
                )}
              </button>
            </div>
          )}

          {/* No More Articles */}
          {!loading && articles.length > 0 && !hasMore && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: theme.textSecondary,
              fontSize: '14px',
              marginTop: '20px'
            }}>
              {t.noMore}
            </div>
          )}
        </div>

        {/* Spinning animation */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Layout>
  );
}