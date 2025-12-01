import { useState } from 'react';

export default function SidebarMockup() {
  const [isDark, setIsDark] = useState(true);
  const [activeItem, setActiveItem] = useState('profile');
  const [language, setLanguage] = useState('FR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#0d0e17' : '#ffffff',
    bgSidebar: isDark ? '#1a1c2e' : '#ffffff',
    bgHover: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.08)',
    bgActive: isDark ? 'rgba(246, 241, 130, 0.15)' : 'rgba(41, 45, 79, 0.12)',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
    iconColor: isDark ? '#ffffff' : '#292d4f'
  };

  const labels = {
    FR: {
      profile: 'Profil',
      friends: 'Amis',
      groups: 'Groupes',
      events: 'Événements',
      news: 'Actualités',
      weather: 'Météo',
      traffic: 'Trafic',
      settings: 'Paramètres',
      signout: 'Déconnexion',
      menu: 'Menu'
    },
    EN: {
      profile: 'Profile',
      friends: 'Friends',
      groups: 'Groups',
      events: 'Events',
      news: 'News',
      weather: 'Weather',
      traffic: 'Traffic',
      settings: 'Settings',
      signout: 'Sign Out',
      menu: 'Menu'
    }
  };
  
  const t = labels[language];

  const menuItems = [
    { id: 'profile', label: t.profile, icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z' },
    { id: 'friends', label: t.friends, icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { id: 'groups', label: t.groups, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'events', label: t.events, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'news', label: t.news, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'weather', label: t.weather, icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { id: 'traffic', label: t.traffic, icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' }
  ];

  const SidebarContent = () => (
    <nav style={{ 
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100% - 24px)',
      justifyContent: 'space-between'
    }}>
      {/* Main Menu Items */}
      <div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveItem(item.id);
              setMobileMenuOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              marginBottom: '4px',
              backgroundColor: activeItem === item.id ? theme.bgActive : 'transparent',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              borderLeft: activeItem === item.id ? `3px solid ${colors.accent}` : '3px solid transparent'
            }}
            onMouseOver={(e) => {
              if (activeItem !== item.id) e.currentTarget.style.backgroundColor = theme.bgHover;
            }}
            onMouseOut={(e) => {
              if (activeItem !== item.id) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={activeItem === item.id ? colors.accent : theme.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.icon} />
            </svg>
            <span style={{
              fontSize: '15px',
              fontWeight: activeItem === item.id ? '600' : '500',
              color: activeItem === item.id ? colors.accent : theme.text
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Bottom Section - Settings & Sign Out */}
      <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px' }}>
        {/* Settings */}
        <button
          onClick={() => {
            setActiveItem('settings');
            setMobileMenuOpen(false);
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            marginBottom: '4px',
            backgroundColor: activeItem === 'settings' ? theme.bgActive : 'transparent',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            borderLeft: activeItem === 'settings' ? `3px solid ${colors.accent}` : '3px solid transparent'
          }}
          onMouseOver={(e) => {
            if (activeItem !== 'settings') e.currentTarget.style.backgroundColor = theme.bgHover;
          }}
          onMouseOut={(e) => {
            if (activeItem !== 'settings') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={activeItem === 'settings' ? colors.accent : theme.iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span style={{
            fontSize: '15px',
            fontWeight: activeItem === 'settings' ? '600' : '500',
            color: activeItem === 'settings' ? colors.accent : theme.text
          }}>
            {t.settings}
          </span>
        </button>
        
        {/* Sign Out */}
        <button
          onClick={() => alert(language === 'FR' ? 'Déconnexion...' : 'Signing out...')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            borderLeft: '3px solid transparent'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e74c3c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#e74c3c'
          }}>
            {t.signout}
          </span>
        </button>
      </div>
    </nav>
  );

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
        backgroundColor: theme.bgSidebar,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}>
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            width: '40px',
            height: '40px',
            backgroundColor: theme.bgHover,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.iconColor} strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          City-Buzz
        </div>
        
        {/* Right Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            style={{
              padding: '8px 14px',
              backgroundColor: theme.bgHover,
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
              backgroundColor: theme.bgHover,
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
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.iconColor} strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar - Always Visible */}
      <aside style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '240px',
        height: 'calc(100vh - 60px)',
        backgroundColor: theme.bgSidebar,
        borderRight: `1px solid ${theme.border}`,
        overflowY: 'auto',
        zIndex: 900
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside style={{
        position: 'fixed',
        top: '60px',
        left: mobileMenuOpen ? 0 : '-280px',
        width: '280px',
        height: 'calc(100vh - 60px)',
        backgroundColor: theme.bgSidebar,
        borderRight: `1px solid ${theme.border}`,
        overflowY: 'auto',
        zIndex: 999,
        transition: 'left 0.3s ease',
        display: 'none'
      }}
        className="mobile-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '240px',
        paddingTop: '60px',
        minHeight: '100vh'
      }}>
        <div style={{ padding: '24px' }}>
          <h1 style={{ color: theme.text, marginBottom: '8px', fontSize: '24px' }}>
            {menuItems.find(i => i.id === activeItem)?.label}
          </h1>
          <p style={{ color: theme.textSecondary }}>
            {language === 'FR' ? 'Contenu de la page' : 'Page content'} - {activeItem}
          </p>
          
          <div style={{
            marginTop: '24px',
            padding: '40px',
            backgroundColor: theme.bgSidebar,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            textAlign: 'center'
          }}>
            <p style={{ color: theme.textSecondary }}>
              {language === 'FR' 
                ? 'Cliquez sur les éléments de la barre latérale pour naviguer' 
                : 'Click sidebar items to navigate'}
            </p>
          </div>
        </div>
      </main>

      {/* CSS for responsive */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          aside:not(.mobile-sidebar) {
            display: none !important;
          }
          .mobile-sidebar {
            display: block !important;
          }
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}