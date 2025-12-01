import { useState, useEffect } from 'react';

export default function WeatherExpanded() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [tempUnit, setTempUnit] = useState('C');
  const [selectedCity, setSelectedCity] = useState('rouen');
  const [currentWeather, setCurrentWeather] = useState('sunny');
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };

  const weatherBackgrounds = {
    sunny: {
      light: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      dark: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
    },
    cloudy: {
      light: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      dark: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
    },
    rainy: {
      light: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
      dark: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)'
    },
    snowy: {
      light: 'linear-gradient(135deg, #e6f7ff 0%, #c3e4ff 100%)',
      dark: 'linear-gradient(135deg, #7ea8d1 0%, #b8d9f0 100%)'
    },
    stormy: {
      light: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      dark: 'linear-gradient(135deg, #0a0e14 0%, #1a1d29 100%)'
    },
    foggy: {
      light: 'linear-gradient(135deg, #d7d2cc 0%, #949494 100%)',
      dark: 'linear-gradient(135deg, #434343 0%, #1a1a1a 100%)'
    },
    partlyCloudy: {
      light: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      dark: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)'
    },
    night: {
      light: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      dark: 'linear-gradient(135deg, #0c0d13 0%, #1a1c2e 100%)'
    }
  };
  
  const bgGradient = isDark ? weatherBackgrounds[currentWeather].dark : weatherBackgrounds[currentWeather].light;
  
  const theme = {
    bg: bgGradient,
    text: currentWeather === 'snowy' && !isDark ? '#1a1c2e' : '#ffffff',
    textSecondary: currentWeather === 'snowy' && !isDark ? 'rgba(26, 28, 46, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    border: currentWeather === 'snowy' && !isDark ? 'rgba(26, 28, 46, 0.2)' : 'rgba(255, 255, 255, 0.2)',
  };

  const weatherOptions = [
    { value: 'sunny', label: language === 'FR' ? '☀️ Ensoleillé' : '☀️ Sunny' },
    { value: 'partlyCloudy', label: language === 'FR' ? '⛅ Partiellement nuageux' : '⛅ Partly Cloudy' },
    { value: 'cloudy', label: language === 'FR' ? '☁️ Nuageux' : '☁️ Cloudy' },
    { value: 'rainy', label: language === 'FR' ? '🌧️ Pluvieux' : '🌧️ Rainy' },
    { value: 'stormy', label: language === 'FR' ? '⛈️ Orageux' : '⛈️ Stormy' },
    { value: 'snowy', label: language === 'FR' ? '❄️ Neigeux' : '❄️ Snowy' },
    { value: 'foggy', label: language === 'FR' ? '🌫️ Brouillard' : '🌫️ Foggy' },
    { value: 'night', label: language === 'FR' ? '🌙 Nuit' : '🌙 Night' }
  ];

  const t = {
    feelsLike: language === 'FR' ? 'Ressenti' : 'Feels like',
    humidity: language === 'FR' ? 'Humidité' : 'Humidity',
    wind: language === 'FR' ? 'Vent' : 'Wind',
    visibility: language === 'FR' ? 'Visibilité' : 'Visibility',
    pressure: language === 'FR' ? 'Pression' : 'Pressure',
    uvIndex: language === 'FR' ? 'Indice UV' : 'UV Index',
    sunrise: language === 'FR' ? 'Lever du soleil' : 'Sunrise',
    sunset: language === 'FR' ? 'Coucher du soleil' : 'Sunset',
    hourly: language === 'FR' ? 'Par heure' : 'Hourly',
    daily: language === 'FR' ? 'Par jour' : 'Daily',
    airQuality: language === 'FR' ? 'Qualité de l\'air' : 'Air Quality',
    good: language === 'FR' ? 'Bon' : 'Good',
    alert: language === 'FR' ? 'Alerte météo' : 'Weather Alert',
    alertMessage: language === 'FR' ? 'Alerte orages - Vigilance orange sur la région de Rouen' : 'Storm Alert - Orange warning for Rouen region',
  };

  const cities = [
    { id: 'rouen', name: 'Rouen' },
    { id: 'paris', name: 'Paris' },
    { id: 'lyon', name: 'Lyon' },
    { id: 'marseille', name: 'Marseille' }
  ];

  const convertTemp = (celsius) => tempUnit === 'F' ? Math.round((celsius * 9/5) + 32) : celsius;

  const weatherData = {
    current: {
      temp: 18, feelsLike: 16,
      condition: language === 'FR' ? 'Partiellement nuageux' : 'Partly Cloudy',
      humidity: 65, wind: 12, windDirection: 'NO',
      visibility: 10, pressure: 1013, uvIndex: 5,
      sunrise: '07:15', sunset: '20:42',
      airQuality: 42, airQualityLevel: t.good
    },
    hourly: [
      { time: '14:00', temp: 18, condition: '☀️', precipitation: 0 },
      { time: '15:00', temp: 19, condition: '☀️', precipitation: 0 },
      { time: '16:00', temp: 20, condition: '⛅', precipitation: 10 },
      { time: '17:00', temp: 19, condition: '⛅', precipitation: 15 },
      { time: '18:00', temp: 18, condition: '☁️', precipitation: 20 },
      { time: '19:00', temp: 17, condition: '☁️', precipitation: 30 },
      { time: '20:00', temp: 16, condition: '🌧️', precipitation: 60 },
      { time: '21:00', temp: 15, condition: '🌧️', precipitation: 70 },
      { time: '22:00', temp: 14, condition: '🌧️', precipitation: 50 },
      { time: '23:00', temp: 13, condition: '☁️', precipitation: 20 }
    ],
    daily: [
      { day: language === 'FR' ? 'Aujourd\'hui' : 'Today', high: 20, low: 13, condition: '⛅', precipitation: 30 },
      { day: language === 'FR' ? 'Lundi' : 'Monday', high: 18, low: 12, condition: '🌧️', precipitation: 70 },
      { day: language === 'FR' ? 'Mardi' : 'Tuesday', high: 16, low: 11, condition: '🌧️', precipitation: 80 },
      { day: language === 'FR' ? 'Mercredi' : 'Wednesday', high: 17, low: 10, condition: '☁️', precipitation: 40 },
      { day: language === 'FR' ? 'Jeudi' : 'Thursday', high: 19, low: 12, condition: '⛅', precipitation: 20 },
      { day: language === 'FR' ? 'Vendredi' : 'Friday', high: 21, low: 14, condition: '☀️', precipitation: 5 },
      { day: language === 'FR' ? 'Samedi' : 'Saturday', high: 22, low: 15, condition: '☀️', precipitation: 0 }
    ]
  };

  const maxTemp = Math.max(...weatherData.hourly.map(h => h.temp));
  const minTemp = Math.min(...weatherData.hourly.map(h => h.temp));

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Rain */}
      {(currentWeather === 'rainy' || currentWeather === 'stormy') && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          {Array.from({length: currentWeather === 'stormy' ? 120 : 80}).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: '-20px', width: '2px', height: '25px', background: `linear-gradient(transparent, rgba(174,194,224,${0.4+Math.random()*0.5}))`, animation: `fall ${0.4+Math.random()*0.4}s linear infinite ${Math.random()*2}s` }} />
          ))}
        </div>
      )}

      {/* Snow */}
      {currentWeather === 'snowy' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          {Array.from({length: 60}).map((_, i) => {
            const size = 3+Math.random()*6;
            return <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: '-10px', width: `${size}px`, height: `${size}px`, background: isDark ? `rgba(255,255,255,${0.5+Math.random()*0.5})` : `rgba(180,200,220,${0.5+Math.random()*0.5})`, borderRadius: '50%', boxShadow: `0 0 ${size}px rgba(255,255,255,0.5)`, animation: `snowfall ${4+Math.random()*6}s linear infinite ${Math.random()*5}s, sway 3s ease-in-out infinite ${Math.random()*5}s` }} />
          })}
        </div>
      )}

      {/* Fog */}
      {currentWeather === 'foggy' && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '150%', height: '100%', background: 'radial-gradient(ellipse at 50% 50%, rgba(200,200,200,0.3) 0%, transparent 60%)', animation: 'fog1 12s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: '150%', height: '100%', background: 'radial-gradient(ellipse at 30% 70%, rgba(180,180,180,0.25) 0%, transparent 50%)', animation: 'fog2 15s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
        </>
      )}

      {/* Stars */}
      {currentWeather === 'night' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          {Array.from({length: 80}).map((_, i) => {
            const size = 2+Math.random()*2;
            return <div key={i} style={{ position: 'absolute', left: `${Math.random()*100}%`, top: `${Math.random()*70}%`, width: `${size}px`, height: `${size}px`, background: 'white', borderRadius: '50%', boxShadow: '0 0 4px rgba(255,255,255,0.8)', animation: `twinkle ${1.5+Math.random()*2.5}s ease-in-out infinite ${Math.random()*3}s` }} />
          })}
        </div>
      )}

      {/* Clouds */}
      {(currentWeather === 'cloudy' || currentWeather === 'partlyCloudy') && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ position: 'absolute', top: `${15+i*20}%`, left: '-25%', width: `${250+i*50}px`, height: `${80+i*20}px`, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(40px)', animation: `cloudMove ${25+i*7}s linear infinite ${i*4}s` }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall { to { transform: translateY(100vh); }}
        @keyframes snowfall { to { transform: translateY(100vh); }}
        @keyframes sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(30px); }}
        @keyframes fog1 { 0%, 100% { opacity: 0.6; transform: translateX(-10%); } 50% { opacity: 0.9; transform: translateX(10%); }}
        @keyframes fog2 { 0%, 100% { opacity: 0.5; transform: translateX(10%); } 50% { opacity: 0.3; transform: translateX(-15%); }}
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); }}
        @keyframes cloudMove { from { transform: translateX(0); } to { transform: translateX(calc(100vw + 400px)); }}
      `}</style>

      <header style={{ position: 'sticky', top: 0, height: '60px', backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 1000 }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.text }}>City-Buzz</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={currentWeather} onChange={(e)=>setCurrentWeather(e.target.value)} style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: `1px solid ${theme.border}`, borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {weatherOptions.map(o => <option key={o.value} value={o.value} style={{backgroundColor:'#1a1c2e',color:'#fff'}}>{o.label}</option>)}
          </select>
          <select value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)} style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: `1px solid ${theme.border}`, borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>
            {cities.map(c => <option key={c.id} value={c.id} style={{backgroundColor:'#1a1c2e',color:'#fff'}}>{c.name}</option>)}
          </select>
          <button onClick={()=>setTempUnit(tempUnit==='C'?'F':'C')} style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: `1px solid ${theme.border}`, borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>°{tempUnit}</button>
          <button onClick={()=>setLanguage(language==='FR'?'EN':'FR')} style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: `1px solid ${theme.border}`, borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{language}</button>
          <button onClick={()=>setIsDark(!isDark)} style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: `1px solid ${theme.border}`, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isDark?'☀️':'🌙'}</button>
        </div>
      </header>

      {(currentWeather==='stormy'||currentWeather==='rainy') && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(10px)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid rgba(255,255,255,0.2)`, zIndex: 100 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{t.alert}: {t.alertMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ padding: '32px 0', marginBottom: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '100px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>⛅</div>
            <h1 style={{ fontSize: '96px', fontWeight: 'bold', color: theme.text, margin: '0 0 8px 0', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{convertTemp(weatherData.current.temp)}°{tempUnit}</h1>
            <p style={{ fontSize: '24px', color: theme.textSecondary, margin: '0 0 8px 0', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{weatherData.current.condition}</p>
            <p style={{ fontSize: '18px', color: theme.textSecondary, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{t.feelsLike} {convertTemp(weatherData.current.feelsLike)}°{tempUnit}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            {[
              { icon: '💧', label: t.humidity, value: `${weatherData.current.humidity}%` },
              { icon: '💨', label: t.wind, value: `${weatherData.current.wind} km/h ${weatherData.current.windDirection}` },
              { icon: '👁️', label: t.visibility, value: `${weatherData.current.visibility} km` },
              { icon: '🌡️', label: t.pressure, value: `${weatherData.current.pressure} hPa` },
              { icon: '☀️', label: t.uvIndex, value: weatherData.current.uvIndex },
              { icon: '🌅', label: t.sunrise, value: weatherData.current.sunrise },
              { icon: '🌇', label: t.sunset, value: weatherData.current.sunset },
              { icon: '🌿', label: t.airQuality, value: `${weatherData.current.airQuality} - ${weatherData.current.airQualityLevel}` }
            ].map((item, idx) => (
              <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: theme.text, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 0', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{t.hourly}</h2>
          <div style={{ marginBottom: '24px', height: '140px', padding: '0 20px' }}>
            <svg width="100%" height="140">
              <defs>
                <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={currentWeather==='snowy'&&!isDark?'rgba(41,45,79,0.3)':'rgba(255,255,255,0.4)'} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={currentWeather==='snowy'&&!isDark?'rgba(41,45,79,0.1)':'rgba(255,255,255,0.1)'} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i*35} x2="100%" y2={i*35} stroke={theme.border} strokeWidth="1" strokeDasharray="4" />)}
              <path d={weatherData.hourly.map((it,i)=>{const x=(i/(weatherData.hourly.length-1))*100;const y=120-((it.temp-minTemp)/(maxTemp-minTemp))*100-10;return`${i===0?'M':'L'} ${x}% ${y}`;}).join(' ')+' L 100% 140 L 0 140 Z'} fill="url(#tg)" />
              <path d={weatherData.hourly.map((it,i)=>{const x=(i/(weatherData.hourly.length-1))*100;const y=120-((it.temp-minTemp)/(maxTemp-minTemp))*100-10;return`${i===0?'M':'L'} ${x}% ${y}`;}).join(' ')} stroke={currentWeather==='snowy'&&!isDark?'rgba(41,45,79,0.8)':'rgba(255,255,255,0.9)'} strokeWidth="3" fill="none" strokeLinecap="round" />
              {weatherData.hourly.map((it,i)=>{const x=(i/(weatherData.hourly.length-1))*100;const y=120-((it.temp-minTemp)/(maxTemp-minTemp))*100-10;return <circle key={i} cx={`${x}%`} cy={y} r="5" fill={currentWeather==='snowy'&&!isDark?'#1a1c2e':'#fff'} stroke="rgba(255,255,255,0.5)" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />})}
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {weatherData.hourly.map((h,i) => (
              <div key={i} style={{ minWidth: '90px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '20px 12px', borderRadius: '16px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '10px', fontWeight: '500' }}>{h.time}</div>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{h.condition}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: theme.text, marginBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{convertTemp(h.temp)}°</div>
                <div style={{ fontSize: '13px', color: 'rgba(59,130,246,1)', fontWeight: '600' }}>💧 {h.precipitation}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{t.daily}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weatherData.daily.map((d,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text, minWidth: '120px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{d.day}</div>
                <div style={{ fontSize: '40px' }}>{d.condition}</div>
                <div style={{ fontSize: '14px', color: 'rgba(59,130,246,1)', minWidth: '70px', textAlign: 'center', fontWeight: '600' }}>💧 {d.precipitation}%</div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '700', color: theme.text, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{convertTemp(d.high)}°</span>
                  <div style={{ height: '4px', width: '80px', background: `linear-gradient(90deg, ${currentWeather==='snowy'&&!isDark?'rgba(41,45,79,0.8)':'rgba(255,255,255,0.8)'} 0%, ${currentWeather==='snowy'&&!isDark?'rgba(41,45,79,0.3)':'rgba(255,255,255,0.3)'} 100%)`, borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  <span style={{ fontSize: '22px', fontWeight: '600', color: theme.textSecondary, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{convertTemp(d.low)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}