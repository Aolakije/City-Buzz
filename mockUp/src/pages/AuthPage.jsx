import { useState } from 'react';

// use environment variable id not found use the default localhost URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('en');
  const [confirmMethod, setConfirmMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    }
  });
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? '#1a1c2e' : '#f5f5f7',
    bgCard: isDark ? 'rgba(41, 45, 79, 0.6)' : 'rgba(255, 255, 255, 0.9)',
    bgInput: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    text: isDark ? '#e4e6eb' : '#050505',
    textSecondary: isDark ? '#b0b3b8' : '#65676b',
    border: isDark ? 'rgba(246, 241, 130, 0.2)' : '#dddfe2'
  };

  const translations = {
    en: {
      login: 'Login',
      register: 'Register',
      email: 'Email or Phone',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      forgotPassword: 'Forgot password?',
      createAccount: 'Create Account'
    },
    fr: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email ou Téléphone',
      password: 'Mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      username: "Nom d'utilisateur",
      forgotPassword: 'Mot de passe oublié?',
      createAccount: 'Créer un compte'
    }
  };

  const t = translations[language];
  
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    backgroundColor: theme.bgInput,
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box'
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.text
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess('Login successful! Redirecting...');
      // Store token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
            setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!registerData.firstName || !registerData.lastName || !registerData.username || 
          !registerData.email || !registerData.password || !registerData.gender ||
          !registerData.dateOfBirth.day || !registerData.dateOfBirth.month || !registerData.dateOfBirth.year) {
        throw new Error('Please fill in all fields');
      }

      // Format date of birth
      const dob = `${registerData.dateOfBirth.year}-${registerData.dateOfBirth.month.padStart(2, '0')}-${registerData.dateOfBirth.day.padStart(2, '0')}`;

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          gender: registerData.gender.toLowerCase(),
          date_of_birth: dob
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Account created successfully! Please login.');
      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
        setError('');
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? `linear-gradient(135deg, #0d0e17 0%, ${colors.primary} 50%, #1a1c2e 100%)`
        : `linear-gradient(135deg, #f5f5f7 0%, #e8e8ec 50%, #f5f5f7 100%)`,
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark 
          ? `radial-gradient(circle at 30% 50%, rgba(246, 241, 130, 0.08) 0%, transparent 50%)`
          : 'none',
        pointerEvents: 'none'
      }} />
      
      {/* Theme & Language Toggles */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          style={{
            padding: '8px 16px',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            color: theme.text,
            cursor: 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
        </button>
        
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: '8px 16px',
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '20px',
            color: theme.text,
            cursor: 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: isDark ? colors.accent : colors.primary,
          textShadow: isDark 
            ? `0 0 30px ${colors.accent}40` 
            : 'none'
        }}>
          City-Buzz
        </h1>
        <p style={{
          fontSize: '18px',
          textAlign: 'center',
          maxWidth: '380px',
          lineHeight: '1.7',
          color: theme.textSecondary
        }}>
          {language === 'en' 
            ? 'Connect with your local community in Rouen. Discover events, share moments, and stay informed.'
            : 'Connectez-vous avec votre communauté locale à Rouen. Découvrez des événements, partagez des moments et restez informé.'}
        </p>
        
        <div style={{ 
          marginTop: '50px', 
          display: 'flex', 
          gap: '40px'
        }}>
          {[
            { title: language === 'en' ? 'Events' : 'Événements', sub: language === 'en' ? 'Local activities' : 'Activités locales' },
            { title: language === 'en' ? 'News' : 'Actualités', sub: language === 'en' ? 'Stay updated' : 'Restez informé' },
            { title: language === 'en' ? 'Connect' : 'Connecter', sub: language === 'en' ? 'Meet people' : 'Rencontrer des gens' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: isDark ? colors.accent : colors.primary,
                textShadow: isDark 
                  ? `0 0 30px ${colors.accent}40` 
                  : 'none'             
              }}>
                {item.title}
              </div>
              <div style={{ 
                fontSize: '13px',
                color: theme.textSecondary,
                marginTop: '4px'
              }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {/* Error/Success Messages */}
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              borderRadius: '8px',
              color: '#ff3b30',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: 'rgba(52, 199, 89, 0.1)',
              border: '1px solid rgba(52, 199, 89, 0.3)',
              borderRadius: '8px',
              color: '#34c759',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}
          
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            marginBottom: '24px',
            backgroundColor: theme.bgInput,
            borderRadius: '10px',
            padding: '4px'
          }}>
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isLogin ? colors.primary : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isLogin ? colors.accent : theme.textSecondary,
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t.login}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: !isLogin ? colors.primary : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: !isLogin ? colors.accent : theme.textSecondary,
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t.register}
            </button>
          </div>
          
          {isLogin ? (
            /* LOGIN FORM */
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t.email}</label>
                <input 
                  type="text" 
                  placeholder={t.email}
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>{t.password}</label>
                <input 
                  type="password" 
                  placeholder={t.password}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <button 
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#999' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '16px',
                  transition: 'transform 0.2s ease',
                }}>
                {loading ? 'Loading...' : t.login}
              </button>
              
              <p style={{
                textAlign: 'center',
                color: colors.accent,
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                {t.forgotPassword}
              </p>
            </div>
          ) : (
            /* REGISTER FORM */
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{t.firstName}</label>
                  <input 
                    type="text" 
                    placeholder={t.firstName}
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{t.lastName}</label>
                  <input 
                    type="text" 
                    placeholder={t.lastName}
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t.username}</label>
                <input 
                  type="text" 
                  placeholder={t.username}
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t.email}</label>
                <input 
                  type="email" 
                  placeholder={t.email}
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t.password}</label>
                <input 
                  type="password" 
                  placeholder={t.password}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Gender</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: registerData.gender === gender ? colors.primary : theme.bgInput,
                      border: `1px solid ${registerData.gender === gender ? colors.accent : theme.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: registerData.gender === gender ? colors.accent : theme.text,
                      fontSize: '13px'
                    }}>
                      {gender}
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={registerData.gender === gender}
                        onChange={() => setRegisterData({...registerData, gender})}
                        style={{ marginLeft: '6px' }} 
                      />
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '6px' }}>
                <label style={labelStyle}>Date of Birth</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={registerData.dateOfBirth.day}
                    onChange={(e) => setRegisterData({...registerData, dateOfBirth: {...registerData.dateOfBirth, day: e.target.value}})}
                    style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select 
                    value={registerData.dateOfBirth.month}
                    onChange={(e) => setRegisterData({...registerData, dateOfBirth: {...registerData.dateOfBirth, month: e.target.value}})}
                    style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}
                  >
                    <option value="">Month</option>
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m, i) => (
                      <option key={i} value={m}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</option>
                    ))}
                  </select>
                  <select 
                    value={registerData.dateOfBirth.year}
                    onChange={(e) => setRegisterData({...registerData, dateOfBirth: {...registerData.dateOfBirth, year: e.target.value}})}
                    style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}
                  >
                    <option value="">Year</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={i} value={2024 - i}>{2024 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleRegister}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#999' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '16px',
                  transition: 'transform 0.2s ease'
                }}>
                {loading ? 'Creating...' : t.createAccount}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}