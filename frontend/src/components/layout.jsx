import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  
  const [isDark, setIsDark] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#0d0e17' : '#ffffff',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    bgHeader: isDark ? 'rgba(26, 28, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    bgHover: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.08)',
    bgActive: isDark ? 'rgba(246, 241, 130, 0.15)' : 'rgba(41, 45, 79, 0.12)',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(41, 45, 79, 0.6)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
    iconColor: isDark ? '#ffffff' : '#292d4f'
  };

  const labels = {
    fr: {
      search: 'Rechercher sur City-Buzz',
      home: 'Accueil',
      profile: 'Profil',
      friends: 'Amis',
      events: 'Événements', 
      news: 'Actualités',
      weather: 'Météo',
      traffic: 'Trafic',
      chat: 'Messages',
      settings: 'Paramètres',
      signout: 'Déconnexion',
      viewProfile: 'Voir votre profil',
      help: 'Aide & Support'
    },
    en: {
      search: 'Search City-Buzz',
      home: 'Home',
      profile: 'Profile',
      friends: 'Friends',
      events: 'Events',
      news: 'News',
      weather: 'Weather',
      traffic: 'Traffic',
      chat: 'Messages',
      settings: 'Settings',
      signout: 'Sign Out',
      viewProfile: 'View your profile',
      help: 'Help & Support'
    }
  };
  
  const t = labels[i18n.language] || labels.en;

  // Navigation items for header
  const headerNavItems = [
    { id: 'home', path: '/home', label: t.home, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'events', path: '/events', label: t.events, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'news', path: '/news', label: t.news, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  ];

  // Sidebar menu items
  const sidebarMenuItems = [
    { id: 'profile', path: '/profile', label: t.profile, icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z' },
    { id: 'friends', path: '/friends', label: t.friends, icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { id: 'events', path: '/events', label: t.events, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'news', path: '/news', label: t.news, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'weather', path: '/weather', label: t.weather, icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { id: 'traffic', path: '/traffic', label: t.traffic, icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'chat', path: '/chat', label: t.chat, icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z' }
  ];

  const currentPath = location.pathname;
  const activeItem = sidebarMenuItems.find(item => item.path === currentPath)?.id || 'home';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const NavIcon = ({ path, active }) => (
    <svg 
      width="22" 
      height="22" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={active ? colors.accent : theme.iconColor}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );

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
        {sidebarMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
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
            <NavIcon path={item.icon} active={activeItem === item.id} />
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
            navigate('/settings');
            setMobileMenuOpen(false);
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            marginBottom: '4px',
            backgroundColor: currentPath === '/settings' ? theme.bgActive : 'transparent',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            borderLeft: currentPath === '/settings' ? `3px solid ${colors.accent}` : '3px solid transparent'
          }}
          onMouseOver={(e) => {
            if (currentPath !== '/settings') e.currentTarget.style.backgroundColor = theme.bgHover;
          }}
          onMouseOut={(e) => {
            if (currentPath !== '/settings') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={currentPath === '/settings' ? colors.accent : theme.iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span style={{
            fontSize: '15px',
            fontWeight: currentPath === '/settings' ? '600' : '500',
            color: currentPath === '/settings' ? colors.accent : theme.text
          }}>
            {t.settings}
          </span>
        </button>
        
        {/* Sign Out */}
        <button
          onClick={handleLogout}
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
        {/* Left Section - Mobile Menu + Search + Language */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              width: '40px',
              height: '40px',
              backgroundColor: theme.bgInput,
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
              placeholder={t.search}
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
            onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
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
            {i18n.language.toUpperCase()}
          </button>
        </div>
        
        {/* Center Section - Logo */}
        <div 
          onClick={() => navigate('/home')}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${colors.accent} 0%, #fff 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer'
          }}
        >
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
          {/* Header Navigation Icons */}
          {headerNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                padding: '10px 20px',
                backgroundColor: currentPath === item.path ? theme.bgHover : 'transparent',
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
              <NavIcon path={item.icon} active={currentPath === item.path} />
              {currentPath === item.path && (
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
              navigate('/chat');
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: currentPath === '/chat' ? colors.primary : theme.bgInput,
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
              stroke={currentPath === '/chat' ? colors.accent : theme.text}
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
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              border: showProfileMenu ? `2px solid ${colors.accent}` : '2px solid transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {user?.first_name?.[0]}{user?.last_name?.[0]}
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
              <div 
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: theme.bgHover,
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold'
                }}>
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div>
                  <div style={{ color: theme.text, fontWeight: '600' }}>
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '13px' }}>
                    {t.viewProfile}
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                style={{
                  padding: '12px',
                  color: theme.text,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = theme.bgHover}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {t.settings}
              </div>

              <div
                style={{
                  padding: '12px',
                  color: theme.text,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = theme.bgHover}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {t.help}
              </div>
              <div onClick={handleLogout} style={{
                padding: '12px', color: '#e74c3c', cursor: 'pointer', borderRadius: '8px', fontSize: '14px'
              }} onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
                 onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                {t.signout}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998
        }} />
      )}

      {/* Desktop Sidebar */}
      <aside style={{
        position: 'fixed', top: '60px', left: 0, width: '240px', height: 'calc(100vh - 60px)',
        backgroundColor: theme.bgCard, borderRight: `1px solid ${theme.border}`,
        overflowY: 'auto', zIndex: 900
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside style={{
        position: 'fixed', top: '60px', left: mobileMenuOpen ? 0 : '-280px', width: '280px',
        height: 'calc(100vh - 60px)', backgroundColor: theme.bgCard,
        borderRight: `1px solid ${theme.border}`, overflowY: 'auto', zIndex: 999,
        transition: 'left 0.3s ease', display: 'none'
      }} className="mobile-sidebar">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '240px', paddingTop: '60px', minHeight: '100vh'
      }} className="main-content">
        {children || (
          <div style={{ padding: '24px' }}>
            <h1 style={{ color: theme.text, marginBottom: '8px', fontSize: '24px' }}>
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Content for {currentPage} page goes here
            </p>
          </div>
        )}
      </main>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: block !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}