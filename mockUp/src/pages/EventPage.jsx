import { useState } from 'react';

export default function EventsMockup() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [eventStates, setEventStates] = useState({});
  
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
    events: language === 'FR' ? 'Événements' : 'Events',
    search: language === 'FR' ? 'Rechercher...' : 'Search...',
    featured: language === 'FR' ? 'À la une' : 'Featured',
    upcoming: language === 'FR' ? 'À venir' : 'Upcoming',
    free: language === 'FR' ? 'Gratuit' : 'Free',
    going: language === 'FR' ? "J'y vais" : 'Going',
    interested: language === 'FR' ? 'Intéressé' : 'Interested',
    attendees: language === 'FR' ? 'participants' : 'attendees',
    invite: language === 'FR' ? 'Inviter' : 'Invite'
  };

  const categories = [
    { id: 'all', label: language === 'FR' ? 'Tous' : 'All', color: colors.accent },
    { id: 'concerts', label: 'Concerts', color: '#8b5cf6' },
    { id: 'festivals', label: 'Festivals', color: '#f59e0b' },
    { id: 'sports', label: 'Sports', color: '#10b981' },
    { id: 'culture', label: 'Culture', color: '#3b82f6' },
    { id: 'markets', label: language === 'FR' ? 'Marchés' : 'Markets', color: '#ef4444' },
    { id: 'nightlife', label: language === 'FR' ? 'Vie nocturne' : 'Nightlife', color: '#ec4899' },
    { id: 'clubs', label: 'Clubs & Restos', color: '#06b6d4' }
  ];

  const events = [
    {
      id: 1,
      title: language === 'FR' ? 'Concert Jazz au 106' : 'Jazz Concert at Le 106',
      date: '22 Nov 2024',
      time: '20:30',
      location: 'Le 106, Rouen',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=250&fit=crop',
      price: '25€',
      attendees: 234,
      category: 'concerts'
    },
    {
      id: 2,
      title: language === 'FR' ? 'Match Rugby Rouen' : 'Rouen Rugby Match',
      date: '24 Nov 2024',
      time: '15:00',
      location: 'Stade Mermoz',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
      price: '15€',
      attendees: 1250,
      category: 'sports'
    },
    {
      id: 3,
      title: language === 'FR' ? 'Marché de Noël' : 'Christmas Market',
      date: '1-24 Déc 2024',
      time: '10:00 - 20:00',
      location: 'Place du Vieux-Marché',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=250&fit=crop',
      price: t.free,
      attendees: 5670,
      category: 'markets'
    },
    {
      id: 4,
      title: language === 'FR' ? 'Soirée Électro' : 'Electro Night',
      date: '23 Nov 2024',
      time: '23:00',
      location: 'Le Bateau Ivre',
      image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=250&fit=crop',
      price: '20€',
      attendees: 320,
      category: 'nightlife'
    }
  ];

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(e => e.category === activeCategory);

  const toggleGoing = (id) => {
    setEventStates(prev => ({ ...prev, [id]: { ...prev[id], going: !prev[id]?.going } }));
  };

  const toggleInterested = (id) => {
    setEventStates(prev => ({ ...prev, [id]: { ...prev[id], interested: !prev[id]?.interested } }));
  };

  const getCatColor = (catId) => categories.find(c => c.id === catId)?.color || colors.accent;

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
      <div style={{ paddingTop: '80px', maxWidth: '1100px', margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* Title & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{t.events}</h1>
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

        {/* Featured Event */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.featured}</h2>
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            height: '280px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#f59e0b',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                Festivals
              </span>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                Festival Armada Rouen 2024
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                15-20 Juin 2024 • Quais de Seine, Rouen • 15,420 {t.attendees}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
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
                  {t.going}
                </button>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  {t.interested}
                </button>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  {t.invite}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events - Feed Style */}
        <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.upcoming}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden'
              }}
            >
              {/* Event Image */}
              <div style={{ position: 'relative' }}>
                <img src={event.image} alt={event.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  padding: '6px 14px',
                  backgroundColor: getCatColor(event.category),
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {categories.find(c => c.id === event.category)?.label}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 14px',
                  backgroundColor: event.price === t.free ? '#10b981' : 'rgba(0,0,0,0.75)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {event.price}
                </span>
              </div>
              
              {/* Event Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>
                  {event.title}
                </h3>
                
                {/* Event Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ color: theme.text, fontSize: '15px' }}>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ color: theme.text, fontSize: '15px' }}>
                      {event.location}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                    <span style={{ color: theme.text, fontSize: '15px' }}>
                      {event.attendees.toLocaleString()} {t.attendees}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: `1px solid ${theme.border}`
                }}>
                  <button
                    onClick={() => toggleGoing(event.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: eventStates[event.id]?.going 
                        ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` 
                        : 'transparent',
                      border: eventStates[event.id]?.going ? 'none' : `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: eventStates[event.id]?.going ? '#fff' : theme.text,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={eventStates[event.id]?.going ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    {t.going}
                  </button>
                  
                  <button
                    onClick={() => toggleInterested(event.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: eventStates[event.id]?.interested 
                        ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` 
                        : 'transparent',
                      border: eventStates[event.id]?.interested ? 'none' : `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: eventStates[event.id]?.interested ? '#fff' : theme.text,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={eventStates[event.id]?.interested ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    {t.interested}
                  </button>
                  
                  <button
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.text,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {t.invite}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}