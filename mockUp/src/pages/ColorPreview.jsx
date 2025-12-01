import { useState } from 'react';

export default function ColorPreview() {
  const [isDark, setIsDark] = useState(true);
  
  const colors = {
    primary: '#8e0e00',
    accent: '#1f1c18',
    dark: {
      bg: '#18191a',
      bgCard: '#242526',
      bgHover: '#3a3b3c',
      text: '#e4e6eb',
      textSecondary: '#b0b3b8',
      border: '#3e4042'
    },
    light: {
      bg: '#f0f2f5',
      bgCard: '#ffffff',
      bgHover: '#f0f2f5',
      text: '#050505',
      textSecondary: '#65676b',
      border: '#dddfe2'
    }
  };
  
  const theme = isDark ? colors.dark : colors.light;
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.bgCard,
        padding: '12px 20px',
        borderBottom: `1px solid ${theme.border}`,
        marginBottom: '20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo with Gradient */}
        <div style={{
          fontSize: '26px',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          City-Buzz
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: '8px 16px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            border: 'none',
            borderRadius: '20px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      {/* Color Palette Display */}
      <div style={{
        backgroundColor: theme.bgCard,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${theme.border}`
      }}>
        <h3 style={{ color: theme.text, marginBottom: '16px', fontSize: '16px' }}>
          🎨 Your Color Palette
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.primary,
              borderRadius: '12px',
              marginBottom: '8px'
            }} />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Primary<br/>#292d4f</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.accent,
              borderRadius: '12px',
              marginBottom: '8px'
            }} />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Accent<br/>#f6f182</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              borderRadius: '12px',
              marginBottom: '8px'
            }} />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Gradient<br/>Logo & Buttons</span>
          </div>
        </div>
      </div>
      
      {/* Sample Feed Post */}
      <div style={{
        backgroundColor: theme.bgCard,
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        marginBottom: '16px',
        overflow: 'hidden'
      }}>
        {/* Post Header */}
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`
          }} />
          <div>
            <div style={{ color: theme.text, fontWeight: '600', fontSize: '15px' }}>Marie Dupont</div>
            <div style={{ color: theme.textSecondary, fontSize: '13px' }}>Il y a 2 heures · Rouen</div>
          </div>
        </div>
        
        {/* Post Content */}
        <div style={{ padding: '0 16px 12px' }}>
          <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.5', margin: 0 }}>
            Belle journée à Rouen ! 🌞 Le marché du Vieux-Marché était magnifique ce matin. 
            Qui d'autre y était ?
          </p>
        </div>
        
        {/* Post Image Placeholder */}
        <div style={{
          height: '200px',
          background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.accent}22 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.textSecondary,
          fontSize: '14px'
        }}>
          📷 Image du marché
        </div>
        
        {/* Post Stats */}
        <div style={{
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.border}`,
          color: theme.textSecondary,
          fontSize: '14px'
        }}>
          <span>👍 24 J'aime</span>
          <span>8 commentaires</span>
        </div>
        
        {/* Post Actions */}
        <div style={{
          display: 'flex',
          padding: '4px 8px'
        }}>
          {['👍 J\'aime', '💬 Commenter', '↗️ Partager'].map((action, i) => (
            <button
              key={i}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.bgHover}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sample Button Styles */}
      <div style={{
        backgroundColor: theme.bgCard,
        padding: '20px',
        borderRadius: '8px',
        border: `1px solid ${theme.border}`
      }}>
        <h3 style={{ color: theme.text, marginBottom: '16px', fontSize: '16px' }}>
          🔘 Button Styles
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            padding: '10px 24px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Primary Button
          </button>
          <button style={{
            padding: '10px 24px',
            backgroundColor: 'transparent',
            border: `2px solid ${colors.primary}`,
            borderRadius: '6px',
            color: isDark ? colors.accent : colors.primary,
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Secondary Button
          </button>
          <button style={{
            padding: '10px 24px',
            backgroundColor: theme.bgHover,
            border: 'none',
            borderRadius: '6px',
            color: theme.text,
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Ghost Button
          </button>
        </div>
      </div>
    </div>
  );
}