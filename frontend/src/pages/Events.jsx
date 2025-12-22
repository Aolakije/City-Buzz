import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout';
import CreateEventModal from '../components/CreateEventModal';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import AttendeesModal from '../components/AttendeesModal';
import ShareEventModal from '../components/ShareEventModal';
import DeleteEventModal from '../components/DeleteEventModal';

export default function Events() {
  const { i18n } = useTranslation();
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();
  
  // State
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentEvents, setCurrentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userRSVPs, setUserRSVPs] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();
  const lastEventRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#0d0e17' : '#ffffff',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.08)',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
  };

  const t = {
    events: i18n.language === 'fr' ? 'Événements' : 'Events',
    search: i18n.language === 'fr' ? 'Rechercher...' : 'Search...',
    createEvent: i18n.language === 'fr' ? 'Créer un événement' : 'Create Event',
    upcoming: i18n.language === 'fr' ? 'À venir' : 'Upcoming',
    trending: i18n.language === 'fr' ? 'Aujourd\'hui' : 'Today',
    free: i18n.language === 'fr' ? 'Gratuit' : 'Free',
    going: i18n.language === 'fr' ? "J'y vais" : 'Going',
    interested: i18n.language === 'fr' ? 'Intéressé(e)' : 'Interested',
    attendees: i18n.language === 'fr' ? 'participants' : 'attendees',
    loading: i18n.language === 'fr' ? 'Chargement...' : 'Loading...',
    loadingMore: i18n.language === 'fr' ? 'Chargement...' : 'Loading more...',
    noEvents: i18n.language === 'fr' ? 'Aucun événement trouvé' : 'No events found',
    errorLoading: i18n.language === 'fr' ? 'Erreur lors du chargement' : 'Error loading events',
    calendar: i18n.language === 'fr' ? 'Calendrier' : 'Calendar',
  };

  const categories = [
    { id: 'all', label: i18n.language === 'fr' ? 'Tous' : 'All', color: colors.accent },
    { id: 'concerts', label: 'Concerts', color: '#8b5cf6' },
    { id: 'festivals', label: 'Festivals', color: '#f59e0b' },
    { id: 'sports', label: 'Sports', color: '#10b981' },
    { id: 'culture', label: 'Culture', color: '#3b82f6' },
    { id: 'markets', label: i18n.language === 'fr' ? 'Marchés' : 'Markets', color: '#ef4444' },
    { id: 'nightlife', label: i18n.language === 'fr' ? 'Vie nocturne' : 'Nightlife', color: '#ec4899' },
    { id: 'clubs', label: 'Clubs & Restos', color: '#06b6d4' }
  ];

// Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Fetch upcoming events only once on mount (not affected by category)
  useEffect(() => {
    fetchUpcomingEvents();
    fetchTrendingEvents();
  }, []);

  // Fetch current events when category changes
  useEffect(() => {
    setPage(1);
    setCurrentEvents([]);
    setHasMore(true);
    fetchEvents(1, true);
    if (user) {
      loadUserRSVPs();
    }
  }, [activeCategory, i18n.language, user]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchEvents(page, false);
    }
  }, [page]);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/events/rouen?category=&language=${i18n.language}&page=1&pageSize=100`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setUpcomingEvents(data.data.upcoming || []);
      }
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    }
  };

const fetchEvents = async (pageNum, reset = false) => {
  try {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');
    
    const apiCategory = activeCategory === 'all' ? '' : activeCategory;
    const response = await fetch(
      `http://localhost:8080/api/v1/events/rouen?category=${apiCategory}&language=${i18n.language}&page=${pageNum}&pageSize=50`,
      { credentials: 'include' }
    );
    
    const data = await response.json();
    
    if (data.success) {
      const newEvents = data.data.current || [];
      
      if (reset) {
        setCurrentEvents(newEvents);
      } else {
        setCurrentEvents(prev => [...prev, ...newEvents]);
      }
      
      // Continue loading if we got events
      setHasMore(newEvents.length > 0);
    } else {
      setError(data.message || 'Failed to fetch events');
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    setError(err.message || 'Failed to fetch events');
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};

  const handleEventCreated = (newEvent) => {
    setCurrentEvents(prev => [newEvent, ...prev]);
    fetchTrendingEvents();
  };

  const fetchTrendingEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/events/trending?city=Rouen&limit=10`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setTrendingEvents(data.data.events || []);
      }
    } catch (err) {
      console.error('Error fetching trending events:', err);
    }
  };

  const loadUserRSVPs = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/events/my-rsvps',
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const rsvpMap = {};
        data.data.forEach(rsvp => {
          rsvpMap[rsvp.event_id] = rsvp.status;
        });
        setUserRSVPs(rsvpMap);
      }
    } catch (err) {
      console.error('Error loading user RSVPs:', err);
    }
  };

  const handleRSVP = async (eventId, status) => {
    if (!user) {
      alert(i18n.language === 'fr' ? 'Connectez-vous pour répondre' : 'Please log in to RSVP');
      return;
    }

    try {
      const currentStatus = userRSVPs[eventId];
      
      if (currentStatus === status) {
        const response = await fetch(
          `http://localhost:8080/api/v1/events/${eventId}/rsvp`,
          { method: 'DELETE', credentials: 'include' }
        );
        
        if (response.ok) {
          setUserRSVPs(prev => {
            const updated = { ...prev };
            delete updated[eventId];
            return updated;
          });
          fetchEvents(1, true);
        }
      } else {
        const response = await fetch(
          `http://localhost:8080/api/v1/events/${eventId}/rsvp`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status }),
          }
        );
        
        if (response.ok) {
          setUserRSVPs(prev => ({ ...prev, [eventId]: status }));
          fetchEvents(1, true);
        }
      }
    } catch (err) {
      console.error('Error updating RSVP:', err);
    }
  };

  const handleShowAttendees = (event) => {
  setSelectedEvent(event);
  setShowAttendeesModal(true);
};

 const handleDeleteEvent = (event) => {
  setSelectedEvent(event);
  setShowDeleteModal(true);
  setOpenMenuId(null);
};

const handleDeleteConfirmed = (eventId) => {
  setCurrentEvents(prev => prev.filter(e => e.id !== eventId));
  setShowDeleteModal(false);
  setSelectedEvent(null);
};

const handleEditEvent = (event) => {
  setEditingEvent(event);
  setShowEditModal(true);
};

const handleEventUpdated = (updatedEvent) => {
  // Update event in the list
  setCurrentEvents(prev => 
    prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
  );
  setShowEditModal(false);
  setEditingEvent(null);
};

const handleShareEvent = (event) => {
  setSelectedEvent(event);
  setShowShareModal(true);
  setOpenMenuId(null);
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEvents = searchQuery
    ? currentEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentEvents;

  const EventCard = ({ event, isLast }) => {
    const userStatus = userRSVPs[event.id];
    
    return (
      <div
        ref={isLast ? lastEventRef : null}
        style={{
          backgroundColor: theme.bgCard,
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative' }}>
          <img 
            src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=300&fit=crop'} 
            alt={event.title}
            style={{ width: '100%', height: '280px', objectFit: 'cover' }}
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=300&fit=crop'}
          />
          {/* Three-dot menu */}
          {user && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === event.id ? null : event.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 4px',
                  marginTop: '-6px',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: openMenuId === event.id ? '#f6f182' : '#161616ff',
                }}
              >
                ⋯
              </button>

              {/* Dropdown Menu */}
              {openMenuId === event.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    minWidth: '160px',
                    zIndex: 100,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Share - available for all */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareEvent(event);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderBottom: event.created_by === user.id && event.source === 'user' ? `1px solid ${theme.border}` : 'none',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgInput}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {i18n.language === 'fr' ? 'Partager' : 'Share'}
                  </button>

                  {/* Edit & Delete - Only for user's own events */}
                  {event.created_by === user.id && event.source === 'user' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          handleEditEvent(event);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          color: theme.text,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgInput}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        {i18n.language === 'fr' ? 'Modifier' : 'Edit'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          handleDeleteEvent(event);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          color: '#ef4444',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        {i18n.language === 'fr' ? 'Supprimer' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {event.event_type ? (
            <span style={{
              position: 'absolute', top: '16px', left: '16px',
              padding: '6px 14px', backgroundColor: colors.primary,
              borderRadius: '12px', color: colors.accent,
              fontSize: '13px', fontWeight: '600', textTransform: 'capitalize'
            }}>
              {event.event_type}
            </span>
          ) : (
            <span style={{
              position: 'absolute', top: '16px', left: '16px',
              padding: '6px 14px',
              backgroundColor: categories.find(c => c.id === event.category)?.color || colors.accent,
              borderRadius: '12px', color: '#fff',
              fontSize: '13px', fontWeight: '600'
            }}>
              {categories.find(c => c.id === event.category)?.label}
            </span>
          )}
          {event.is_free && (
            <span style={{
              position: 'absolute', top: '16px', right: '46px',
              padding: '6px 14px', backgroundColor: '#10b981',
              borderRadius: '12px', color: '#fff',
              fontSize: '13px', fontWeight: '600'
            }}>
              {t.free}
            </span>
          )}
        </div>
        
        <div style={{ padding: '20px' }}>
          <h3 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>
            {event.title}
          </h3>
          
          <p style={{ color: theme.textSecondary, fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            {event.description.length > 200 ? event.description.substring(0, 200) + '...' : event.description}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ color: theme.text, fontSize: '15px' }}>
                {formatDate(event.start_date)} • {formatTime(event.start_date)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ color: theme.text, fontSize: '15px' }}>{event.location}</span>
            </div>
            
            <div 
                onClick={() => handleShowAttendees(event)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgInput}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span style={{ color: theme.text, fontSize: '15px' }}>
                  {event.going_count + event.interested_count} {t.attendees}
                </span>
          </div>
          </div>
          
          {user && (
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
              <button
                onClick={() => handleRSVP(event.id, 'going')}
                style={{
                  flex: 1, padding: '12px',
                  background: userStatus === 'going' ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` : 'transparent',
                  border: userStatus === 'going' ? 'none' : `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: userStatus === 'going' ? '#fff' : theme.text,
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={userStatus === 'going' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                {t.going} ({event.going_count})
              </button>
              
              <button
                onClick={() => handleRSVP(event.id, 'interested')}
                style={{
                  flex: 1, padding: '12px',
                  background: userStatus === 'interested' ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` : 'transparent',
                  border: userStatus === 'interested' ? 'none' : `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: userStatus === 'interested' ? '#fff' : theme.text,
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={userStatus === 'interested' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {t.interested} ({event.interested_count})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div style={{
        minHeight: '100vh', backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingTop: '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{t.events}</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text" placeholder={t.search} value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 16px', width: '240px', backgroundColor: theme.bgInput,
                  border: 'none', borderRadius: '24px', color: theme.text,
                  fontSize: '14px', outline: 'none'
                }}
              />
              {user && (
                <button onClick={() => setShowCreateModal(true)} style={{
                  padding: '10px 20px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none', borderRadius: '24px', color: '#fff',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontSize: '18px' }}>+</span>
                  {t.createEvent}
                </button>
              )}
            </div>
          </div>

          {/* Upcoming Carousel - NEVER CHANGES */}
          {upcomingEvents.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: theme.text, fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.upcoming}
              </h2>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} style={{
                    minWidth: '320px', maxWidth: '320px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`, overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform}
                  onMouseLeave={(e) => e.currentTarget.style.transform}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=200&fit=crop'} 
                        alt={event.title}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
                      }} />
        
                      <div style={{
                        position: 'absolute', bottom: '12px', left: '12px', right: '12px', color: '#fff'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                          {event.title.length > 40 ? event.title.substring(0, 40) + '...' : event.title}
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>
                          {formatDate(event.start_date)}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textSecondary, fontSize: '13px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                padding: '10px 18px',
                backgroundColor: activeCategory === cat.id ? colors.primary : theme.bgCard,
                border: `1px solid ${activeCategory === cat.id ? colors.primary : theme.border}`,
                borderRadius: '14px',
                color: activeCategory === cat.id ? colors.accent : theme.text,
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s ease'
              }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            
            {/* Events Feed */}
            <div style={{ flex: '0 0 70%' }}>
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: theme.text, fontSize: '18px' }}>
                  {t.loading}
                </div>
              )}

              {error && (
                <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px' }}>
                  {t.errorLoading}: {error}
                </div>
              )}

              {!loading && filteredEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.textSecondary, fontSize: '16px' }}>
                  {t.noEvents}
                </div>
              )}

              {!loading && filteredEvents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      isLast={index === filteredEvents.length - 1}
                    />
                  ))}
                  
                  {loadingMore && (
                    <div style={{ textAlign: 'center', padding: '10px', color: theme.textSecondary }}>
                      {t.loadingMore}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ flex: '0 0 28%', position: 'sticky', top: '20px' }}>
              
              {/* Calendar */}
              <div style={{ backgroundColor: theme.bgCard, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {t.calendar}
                </h3>
                <p style={{ color: theme.textSecondary, fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  {i18n.language === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
                </p>
              </div>
              
              {/* Trending Today */}
              <div style={{ backgroundColor: theme.bgCard, borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {t.trending}
                </h3>
                
                {trendingEvents.length === 0 ? (
                  <p style={{ color: theme.textSecondary, fontSize: '14px' }}>
                    {i18n.language === 'fr' ? 'Aucun événement aujourd\'hui' : 'No events today'}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {trendingEvents.map((event) => (
                      <div key={event.id} style={{ padding: '12px', backgroundColor: theme.bgInput, borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ color: theme.text, fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                          {event.title}
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '6px' }}>
                          {formatTime(event.start_date)}
                        </div>
                        <div style={{ color: theme.textSecondary, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{
                            display: 'inline-block', width: '8px', height: '8px',
                            borderRadius: '50%',
                            backgroundColor: categories.find(c => c.id === event.category)?.color || colors.accent
                          }} />
                          {categories.find(c => c.id === event.category)?.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />

      {showEditModal && editingEvent && (
        <CreateEventModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingEvent(null);
          }}
          onEventCreated={handleEventUpdated}
          event={editingEvent}
        />
      )}

      <AttendeesModal
        isOpen={showAttendeesModal}
        onClose={() => setShowAttendeesModal(false)}
        eventId={selectedEvent?.id}
        eventTitle={selectedEvent?.title}
      />

      <ShareEventModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />

      <DeleteEventModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onDelete={handleDeleteConfirmed}
      />
     </Layout>
   );
 }