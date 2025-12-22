import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/themeStore';

export default function DeleteEventModal({ isOpen, onClose, event, onDelete }) {
  const { i18n } = useTranslation();
  const isDark = useThemeStore((state) => state.isDark);
  const [loading, setLoading] = useState(false);

  const theme = {
    overlay: 'rgba(0, 0, 0, 0.75)',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
  };

  const t = {
    deleteEvent: i18n.language === 'fr' ? 'Supprimer l\'événement' : 'Delete Event',
    confirmMessage: i18n.language === 'fr' 
      ? 'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.' 
      : 'Are you sure you want to delete this event? This action cannot be undone.',
    eventTitle: i18n.language === 'fr' ? 'Événement :' : 'Event:',
    cancel: i18n.language === 'fr' ? 'Annuler' : 'Cancel',
    delete: i18n.language === 'fr' ? 'Supprimer' : 'Delete',
    deleting: i18n.language === 'fr' ? 'Suppression...' : 'Deleting...',
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/events/${event.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        onDelete(event.id);
        onClose();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

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
          maxWidth: '450px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text }}>
            {t.deleteEvent}
          </h3>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            {t.confirmMessage}
          </p>

          <div
            style={{
              padding: '16px',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>
              {t.eventTitle}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: theme.text }}>
              {event.title}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#ef4444',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                {t.deleting}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {t.delete}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}