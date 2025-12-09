import { useState } from 'react';
import Layout from '../components/layout';

export default function NewsMockup() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedArticles, setSavedArticles] = useState({});
  
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
    news: language === 'FR' ? 'Actualités' : 'News',
    search: language === 'FR' ? 'Rechercher...' : 'Search...',
    featured: language === 'FR' ? 'À la une' : 'Featured',
    forYou: language === 'FR' ? 'Pour vous' : 'For You',
    readMore: language === 'FR' ? 'Lire la suite' : 'Read more',
    save: language === 'FR' ? 'Enregistrer' : 'Save',
    share: language === 'FR' ? 'Partager' : 'Share',
    video: language === 'FR' ? 'Vidéo' : 'Video',
    basedOnSearch: language === 'FR' ? 'Basé sur vos recherches' : 'Based on your searches'
  };

  const categories = [
    { id: 'all', label: language === 'FR' ? 'Tout' : 'All', color: colors.accent },
    { id: 'breaking', label: language === 'FR' ? 'Dernière minute' : 'Breaking', color: '#ef4444' },
    { id: 'local', label: language === 'FR' ? 'Local' : 'Local', color: '#3b82f6' },
    { id: 'politics', label: language === 'FR' ? 'Politique' : 'Politics', color: '#8b5cf6' },
    { id: 'sports', label: 'Sports', color: '#10b981' },
    { id: 'culture', label: 'Culture', color: '#f59e0b' },
    { id: 'economy', label: language === 'FR' ? 'Économie' : 'Economy', color: '#06b6d4' }
  ];

  const featuredNews = {
    id: 0,
    title: language === 'FR' 
      ? "Rouen: Le nouveau tramway inauguré en grande pompe" 
      : "Rouen: New tramway inaugurated with fanfare",
    summary: language === 'FR'
      ? "Le maire de Rouen a inauguré ce matin la nouvelle ligne de tramway qui reliera le centre-ville à la périphérie. Un projet attendu depuis plus de 10 ans par les Rouennais."
      : "The mayor of Rouen inaugurated this morning the new tramway line that will connect the city center to the suburbs. A project awaited for over 10 years by the residents of Rouen.",
    image: 'https://images.unsplash.com/photo-1554672407-e9e45a0b3ad8?w=1200&h=400&fit=crop',
    source: 'Paris-Normandie',
    time: '2h',
    category: 'local',
    hasVideo: false
  };

  const newsArticles = [
    {
      id: 1,
      title: language === 'FR'
        ? "Football: Le FC Rouen remporte le derby normand"
        : "Football: FC Rouen wins the Norman derby",
      summary: language === 'FR'
        ? "Dans un match haletant, le FC Rouen s'est imposé 2-1 face au Havre AC devant plus de 10,000 spectateurs au Stade Robert Diochon..."
        : "In a thrilling match, FC Rouen won 2-1 against Le Havre AC in front of more than 10,000 spectators at Robert Diochon Stadium...",
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=350&fit=crop',
      source: 'France Bleu Normandie',
      time: '4h',
      category: 'sports',
      hasVideo: true,
      isPersonalized: false
    },
    {
      id: 2,
      title: language === 'FR'
        ? "Élections municipales: Les résultats attendus ce soir"
        : "Municipal elections: Results expected tonight",
      summary: language === 'FR'
        ? "Les bureaux de vote ont fermé à 20h. Les premières estimations pour les élections municipales de Rouen sont attendues dans les prochaines heures..."
        : "Polling stations closed at 8pm. First estimates for Rouen's municipal elections are expected in the coming hours...",
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=350&fit=crop',
      source: 'Le Parisien',
      time: '1h',
      category: 'politics',
      hasVideo: false,
      isPersonalized: false
    },
    {
      id: 3,
      title: language === 'FR'
        ? "Culture: Le Musée des Beaux-Arts dévoile sa nouvelle exposition"
        : "Culture: Fine Arts Museum unveils new exhibition",
      summary: language === 'FR'
        ? "Une exposition exceptionnelle consacrée aux impressionnistes normands ouvrira ses portes ce weekend. Plus de 50 œuvres seront présentées..."
        : "An exceptional exhibition dedicated to Norman Impressionists will open this weekend. More than 50 works will be presented...",
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=350&fit=crop',
      source: 'Actu.fr',
      time: '6h',
      category: 'culture',
      hasVideo: false,
      isPersonalized: true
    },
    {
      id: 4,
      title: language === 'FR'
        ? "Économie: Nouvelle usine créera 200 emplois à Rouen"
        : "Economy: New factory will create 200 jobs in Rouen",
      summary: language === 'FR'
        ? "Une entreprise spécialisée dans les énergies renouvelables annonce l'ouverture d'une nouvelle usine dans la zone industrielle. Les recrutements débuteront dès janvier..."
        : "A company specializing in renewable energy announces the opening of a new factory in the industrial zone. Recruitment will begin in January...",
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=350&fit=crop',
      source: 'Les Échos',
      time: '8h',
      category: 'economy',
      hasVideo: true,
      isPersonalized: false
    },
    {
      id: 5,
      title: language === 'FR'
        ? "Breaking: Incident majeur sur l'A13, circulation perturbée"
        : "Breaking: Major incident on A13, traffic disrupted",
      summary: language === 'FR'
        ? "Un accident impliquant plusieurs véhicules provoque d'importants embouteillages sur l'A13 en direction de Paris. Les secours sont sur place..."
        : "An accident involving several vehicles is causing major traffic jams on the A13 towards Paris. Emergency services are on site...",
      image: 'https://images.unsplash.com/photo-1533092781476-0f31e99f7c8b?w=600&h=350&fit=crop',
      source: 'Info Trafic',
      time: '30min',
      category: 'breaking',
      hasVideo: true,
      isPersonalized: false
    }
  ];

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(n => n.category === activeCategory);

  const toggleSave = (id) => {
    setSavedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCatColor = (catId) => categories.find(c => c.id === catId)?.color || colors.accent;

  return (
    <Layout>
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
          <button onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            style={{ padding: '8px 14px', backgroundColor: theme.bgInput, border: 'none', borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            {language}
          </button>
          <button onClick={() => setIsDark(!isDark)}
            style={{ width: '40px', height: '40px', backgroundColor: theme.bgInput, border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* Title & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{t.news}</h1>
          <input
            type="text"
            placeholder={t.search}
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
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '10px 18px',
                backgroundColor: activeCategory === cat.id ? colors.primary : theme.bgCard,
                border: `1px solid ${activeCategory === cat.id ? colors.accent : theme.border}`,
                borderRadius: '24px',
                color: activeCategory === cat.id ? colors.accent : theme.text,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured News */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.featured}</h2>
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img src={featuredNews.image} alt={featuredNews.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: getCatColor(featuredNews.category),
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {categories.find(c => c.id === featuredNews.category)?.label}
                </span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {featuredNews.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                {featuredNews.summary}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  {featuredNews.source} • {featuredNews.time}
                </span>
                <button style={{
                  padding: '10px 20px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  {t.readMore}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredNews.map((article) => (
            <div
              key={article.id}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden'
              }}
            >
              {/* Personalized Tag */}
              {article.isPersonalized && (
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: theme.bgHover,
                  borderBottom: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  <span style={{ color: colors.accent, fontSize: '12px', fontWeight: '600' }}>
                    {t.basedOnSearch}
                  </span>
                </div>
              )}
              
              {/* Article Image/Video */}
              <div style={{ position: 'relative' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                
                {/* Category & Video Badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '6px 14px',
                    backgroundColor: getCatColor(article.category),
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {categories.find(c => c.id === article.category)?.label}
                  </span>
                  {article.hasVideo && (
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {t.video}
                    </span>
                  )}
                </div>
                
                {/* Play button overlay for videos */}
                {article.hasVideo && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.primary}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Article Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  {article.title}
                </h3>
                <p style={{ color: theme.textSecondary, fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                  {article.summary}
                </p>
                
                {/* Source & Time */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                    </svg>
                    <span style={{ color: theme.textSecondary, fontSize: '13px', fontWeight: '500' }}>
                      {article.source}
                    </span>
                    <span style={{ color: theme.textSecondary, fontSize: '13px' }}>•</span>
                    <span style={{ color: theme.textSecondary, fontSize: '13px' }}>
                      {article.time}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => toggleSave(article.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: savedArticles[article.id] ? colors.primary : 'transparent',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: savedArticles[article.id] ? colors.accent : theme.text,
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={savedArticles[article.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                      </svg>
                      {t.save}
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.text,
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      {t.share}
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      {t.readMore}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}