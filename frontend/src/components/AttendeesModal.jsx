import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/themeStore';

export default function AttendeesModal({ isOpen, onClose, eventId, eventTitle }) {
  const { i18n } = useTranslation();
  const isDark = useThemeStore((state) => state.isDark);
  
  const [attendees, setAttendees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('going'); // 'going' or 'interested'

  const theme = {
    overlay: 'rgba(0, 0, 0, 0.75)',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.08)',
  };

  const t = {
    going: i18n.language === 'fr' ? 'Participants' : 'Going',
    interested: i18n.language === 'fr' ? 'Intéressés' : 'Interested',
    loading: i18n.language === 'fr' ? 'Chargement...' : 'Loading...',
    noOne: i18n.language === 'fr' ? 'Personne pour le moment' : 'No one yet',
    close: i18n.language === 'fr' ? 'Fermer' : 'Close',
  };

  // Fetch attendees when modal opens
  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/events/${eventId}/attendees`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setAttendees(data.data);
      }
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const goingList = attendees?.going || [];
  const interestedList = attendees?.interested || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: theme.overlay,
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.bgCard,
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text }}>
              {eventTitle}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: theme.textSecondary,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => setActiveTab('going')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: activeTab === 'going' ? theme.bgInput : 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {t.going} ({goingList.length})
            </button>
            <button
              onClick={() => setActiveTab('interested')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: activeTab === 'interested' ? theme.bgInput : 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {t.interested} ({interestedList.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '20px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
              {t.loading}
            </div>
          ) : (
            <div>
              {activeTab === 'going' && (
                <div>
                  {goingList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
                      {t.noOne}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {goingList.map((attendee) => (
                        <div
                          key={attendee.user_id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: theme.bgInput,
                            borderRadius: '8px',
                          }}
                        >
                          <img
                            src={attendee.avatar_url || `https://ui-avatars.com/api/?name=${attendee.first_name}+${attendee.last_name}&background=292d4f&color=f6f182`}
                            alt={attendee.username}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                          <div>
                            <div style={{ color: theme.text, fontSize: '15px', fontWeight: '600' }}>
                              {attendee.first_name} {attendee.last_name}
                            </div>
                            <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                              @{attendee.username}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'interested' && (
                <div>
                  {interestedList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: theme.textSecondary }}>
                      {t.noOne}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {interestedList.map((attendee) => (
                        <div
                          key={attendee.user_id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: theme.bgInput,
                            borderRadius: '8px',
                          }}
                        >
                          <img
                            src={attendee.avatar_url || `https://ui-avatars.com/api/?name=${attendee.first_name}+${attendee.last_name}&background=292d4f&color=f6f182`}
                            alt={attendee.username}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                          <div>
                            <div style={{ color: theme.text, fontSize: '15px', fontWeight: '600' }}>
                              {attendee.first_name} {attendee.last_name}
                            </div>
                            <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                              @{attendee.username}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}