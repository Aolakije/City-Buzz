import { useState } from 'react';

export default function HeaderMockup() {
  const [isDark, setIsDark] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [language, setLanguage] = useState('FR');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  const labels = {
    FR: {
      search: 'Rechercher sur City-Buzz',
      home: 'Accueil',
      events: 'Événements', 
      news: 'Actualités',
      viewProfile: 'Voir votre profil',
      settings: 'Paramètres',
      help: 'Aide & Support',
      logout: 'Déconnexion'
    },
    EN: {
      search: 'Search City-Buzz',
      home: 'Home',
      events: 'Events',
      news: 'News',
      viewProfile: 'View your profile',
      settings: 'Settings',
      help: 'Help & Support',
      logout: 'Log Out'
    }
  };
  
  const t = labels[language];
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#1a1c2e' : '#ffffff',
    bgHeader: isDark ? 'rgba(26, 28, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    bgHover: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    text: isDark ? '#e4e6eb' : '#050505',
    textSecondary: isDark ? '#b0b3b8' : '#65676b',
    border: isDark ? 'rgba(246, 241, 130, 0.15)' : '#dddfe2'
  };

  

  const navItems = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  ];

  const NavIcon = ({ path, active }) => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={active ? colors.accent : theme.textSecondary}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? `linear-gradient(135deg, #0d0e17 0%, ${colors.primary} 50%, #1a1c2e 100%)`
        : '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: theme.bgHeader,
        borderBottom: `1px solid ${theme.border}`,
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 1000
      }}>
        {/* Left Section - Search & Language */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            width: '240px'
          }}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={theme.textSecondary}
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search City-Buzz"
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                fontSize: '14px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: theme.bgInput,
                color: theme.text,
                outline: 'none'
              }}
            />
          </div>
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            style={{
              padding: '8px 12px',
              backgroundColor: theme.bgInput,
              border: 'none',
              borderRadius: '16px',
              color: theme.text,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {language}
          </button>
        </div>
        
        {/* Center Section - Logo */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${colors.accent} 0%, #fff 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          City-Buzz
        </div>
        
        {/* Right Section - Navigation & Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          {/* Navigation Icons */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeNav === item.id ? theme.bgHover : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative'
              }}
              title={item.label}
            >
              <NavIcon path={item.icon} active={activeNav === item.id} />
              {activeNav === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  backgroundColor: colors.accent,
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
          
          {/* Divider */}
          <div style={{
            width: '1px',
            height: '28px',
            backgroundColor: theme.border,
            margin: '0 8px'
          }} />
          
          {/* Messages */}
          <button
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: showMessages ? colors.primary : theme.bgInput,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={showMessages ? colors.accent : theme.text}
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
            {/* Notification Badge */}
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '18px',
              height: '18px',
              backgroundColor: '#e74c3c',
              borderRadius: '50%',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </button>
          
          {/* Notifications */}
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
              setShowProfileMenu(false);
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: showNotifications ? colors.primary : theme.bgInput,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={showNotifications ? colors.accent : theme.text}
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {/* Notification Badge */}
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '18px',
              height: '18px',
              backgroundColor: '#e74c3c',
              borderRadius: '50%',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              5
            </span>
          </button>
          
          {/* Dark/Light Mode Toggle */}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          
          {/* Profile Menu */}
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowMessages(false);
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: colors.primary,
              border: showProfileMenu ? `2px solid ${colors.accent}` : '2px solid transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            JD
          </button>
          
          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '55px',
              right: '16px',
              width: '280px',
              backgroundColor: isDark ? '#242536' : '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              padding: '12px',
              zIndex: 1001
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: theme.bgHover,
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: colors.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accent,
                  fontWeight: 'bold'
                }}>
                  JD
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '600' }}>Jean Dupont</div>
                  <div style={{ color: theme.textSecondary, fontSize: '13px' }}>View your profile</div>
                </div>
              </div>
              
              {['Settings', 'Help & Support', 'Log Out'].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    color: item === 'Log Out' ? '#e74c3c' : theme.text,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = theme.bgHover}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {/* Page Content Preview */}
      <div style={{
        paddingTop: '80px',
        padding: '80px 20px 20px',
        textAlign: 'center'
      }}>
        <p style={{ color: theme.textSecondary, marginTop: '40px' }}>
          Header is fixed at top. Scroll to test.
        </p>
        <div style={{ height: '1000px' }} />
      </div>
    </div>
  );
}