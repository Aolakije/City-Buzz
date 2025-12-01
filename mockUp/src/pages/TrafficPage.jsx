import { useState } from 'react';

export default function TrafficPage() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [showToast, setShowToast] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? 'linear-gradient(135deg, #0d0e17 0%, #1a1c2e 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(41, 45, 79, 0.7)',
    border: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(41, 45, 79, 0.15)',
    overlay: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
  };

  const t = {
    traffic: language === 'FR' ? 'Trafic en temps réel' : 'Real-time Traffic',
    severAlert: language === 'FR' ? 'Alerte trafic' : 'Traffic Alert',
    alertMsg: language === 'FR' ? 'Accident grave sur l\'A13 - Circulation bloquée' : 'Severe accident on A13 - Traffic blocked',
    accident: language === 'FR' ? 'Accident' : 'Accident',
    construction: language === 'FR' ? 'Travaux' : 'Construction',
    closure: language === 'FR' ? 'Fermeture' : 'Closure',
    delay: language === 'FR' ? 'Ralentissement' : 'Delay',
    minor: language === 'FR' ? 'Mineur' : 'Minor',
    moderate: language === 'FR' ? 'Modéré' : 'Moderate',
    severe: language === 'FR' ? 'Grave' : 'Severe',
    reported: language === 'FR' ? 'Signalé' : 'Reported',
    duration: language === 'FR' ? 'Durée estimée' : 'Est. duration',
    publicTransport: language === 'FR' ? 'Transports en commun' : 'Public Transport',
    parking: language === 'FR' ? 'Stationnement' : 'Parking',
    gasPrices: language === 'FR' ? 'Prix essence' : 'Gas Prices',
    available: language === 'FR' ? 'Disponible' : 'Available',
    spots: language === 'FR' ? 'places' : 'spots',
    onTime: language === 'FR' ? 'À l\'heure' : 'On time',
    delayed: language === 'FR' ? 'Retardé' : 'Delayed',
    disrupted: language === 'FR' ? 'Perturbé' : 'Disrupted',
    newNotifications: language === 'FR' ? 'nouvelles alertes' : 'new alerts',
  };

  const severityColors = {
    minor: { bg: '#10b981', text: '#ffffff' },
    moderate: { bg: '#f59e0b', text: '#ffffff' },
    severe: { bg: '#ef4444', text: '#ffffff' }
  };

  const incidentIcons = {
    accident: '🚗💥',
    construction: '🚧',
    closure: '🚫',
    delay: '⏱️'
  };

  const feedItems = [
    {
      id: 1,
      type: 'alert',
      category: 'accident',
      severity: 'severe',
      title: language === 'FR' ? 'Accident grave sur A13' : 'Severe accident on A13',
      location: 'A13, sortie 22 direction Paris',
      description: language === 'FR' ? 'Collision entre 3 véhicules. Voie de gauche bloquée. Déviation mise en place.' : 'Collision between 3 vehicles. Left lane blocked. Detour in place.',
      time: '5 min',
      duration: language === 'FR' ? '2-3 heures' : '2-3 hours'
    },
    {
      id: 2,
      type: 'incident',
      category: 'construction',
      severity: 'moderate',
      title: language === 'FR' ? 'Travaux Pont Flaubert' : 'Flaubert Bridge Construction',
      location: 'Pont Flaubert, Rouen Centre',
      description: language === 'FR' ? 'Réfection de la chaussée. Une voie fermée jusqu\'à 18h.' : 'Road resurfacing. One lane closed until 6pm.',
      time: '15 min',
      duration: language === 'FR' ? 'Jusqu\'à 18h00' : 'Until 6:00 PM'
    },
    {
      id: 3,
      type: 'transport',
      category: 'metro',
      status: 'delayed',
      title: language === 'FR' ? 'Métro Ligne T1 - Retards' : 'Metro Line T1 - Delays',
      description: language === 'FR' ? 'Retards de 10 minutes en raison d\'un incident technique.' : '10 minute delays due to technical incident.',
      time: '8 min'
    },
    {
      id: 4,
      type: 'incident',
      category: 'delay',
      severity: 'minor',
      title: language === 'FR' ? 'Ralentissement Rue Jeanne d\'Arc' : 'Slow traffic on Rue Jeanne d\'Arc',
      location: 'Rue Jeanne d\'Arc, centre-ville',
      description: language === 'FR' ? 'Trafic dense en raison de l\'heure de pointe.' : 'Heavy traffic due to rush hour.',
      time: '12 min',
      duration: language === 'FR' ? '30-45 min' : '30-45 min'
    },
    {
      id: 5,
      type: 'parking',
      name: 'Parking Cathédrale',
      available: 45,
      total: 250,
      price: '2.50€/h',
      time: '2 min'
    },
    {
      id: 6,
      type: 'incident',
      category: 'accident',
      severity: 'moderate',
      title: language === 'FR' ? 'Accident Boulevard de l\'Europe' : 'Accident on Boulevard de l\'Europe',
      location: 'Boulevard de l\'Europe, près de Kindarena',
      description: language === 'FR' ? 'Accrochage sans gravité. Voie de droite encombrée.' : 'Minor collision. Right lane congested.',
      time: '20 min',
      duration: language === 'FR' ? '45 min' : '45 min'
    },
    {
      id: 7,
      type: 'gas',
      station: 'Total Energies',
      location: 'Avenue des Martyrs',
      prices: {
        sp95: '1.89€',
        sp98: '1.99€',
        diesel: '1.79€'
      },
      time: '5 min'
    },
    {
      id: 8,
      type: 'transport',
      category: 'bus',
      status: 'disrupted',
      title: language === 'FR' ? 'Bus Ligne 5 - Perturbations' : 'Bus Line 5 - Disruptions',
      description: language === 'FR' ? 'Déviation en raison de travaux. Arrêt "République" non desservi.' : 'Detour due to construction. "République" stop not served.',
      time: '18 min'
    },
    {
      id: 9,
      type: 'parking',
      name: 'Parking Vieux Marché',
      available: 12,
      total: 180,
      price: '2.00€/h',
      time: '10 min'
    },
    {
      id: 10,
      type: 'incident',
      category: 'closure',
      severity: 'severe',
      title: language === 'FR' ? 'Fermeture tunnel de la Grand-Mare' : 'Grand-Mare tunnel closure',
      location: 'Tunnel de la Grand-Mare',
      description: language === 'FR' ? 'Fermé pour maintenance d\'urgence jusqu\'à demain 6h.' : 'Closed for emergency maintenance until tomorrow 6am.',
      time: '25 min',
      duration: language === 'FR' ? 'Jusqu\'à demain 6h' : 'Until tomorrow 6am'
    },
    {
      id: 11,
      type: 'transport',
      category: 'train',
      status: 'onTime',
      title: language === 'FR' ? 'Trains SNCF - Normal' : 'SNCF Trains - Normal',
      description: language === 'FR' ? 'Trafic normal sur toutes les lignes.' : 'Normal traffic on all lines.',
      time: '3 min'
    },
    {
      id: 12,
      type: 'gas',
      station: 'Intermarché',
      location: 'Route de Darnétal',
      prices: {
        sp95: '1.85€',
        sp98: '1.95€',
        diesel: '1.75€'
      },
      time: '15 min'
    }
  ];

  const severeAlerts = feedItems.filter(item => 
    (item.type === 'incident' || item.type === 'alert') && item.severity === 'severe'
  ).length;

  const handleBellClick = () => {
    setShowToast(true);
    setIsRinging(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: isDark ? 'rgba(13, 14, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
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
          color: theme.text
        }}>
          City-Buzz
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            style={{ padding: '8px 14px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.08)', border: 'none', borderRadius: '16px', color: theme.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            {language}
          </button>
          <button onClick={() => setIsDark(!isDark)}
            style={{ width: '40px', height: '40px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.08)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          backgroundColor: isDark ? '#1a1c2e' : '#ffffff',
          color: theme.text,
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>
              {severeAlerts} {t.newNotifications}
            </div>
          </div>
        </div>
      )}

      {/* Severe Alert Banner */}
      <div style={{
        marginTop: '60px',
        backgroundColor: '#ef4444',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: `1px solid ${theme.border}`
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{t.severAlert}</div>
          <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '13px' }}>{t.alertMsg}</div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: '600' }}>il y a 5 min</div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px 40px' }}>
        <h1 style={{ color: theme.text, fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {t.traffic}
        </h1>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {feedItems.map(item => {
            if (item.type === 'incident' || item.type === 'alert') {
              const sevColor = severityColors[item.severity];
              return (
                <div key={item.id} style={{
                  padding: '20px 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      fontSize: '36px',
                      flexShrink: 0,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      {incidentIcons[item.category]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: sevColor.bg,
                          color: sevColor.text,
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          {t[item.severity]}
                        </span>
                        <span style={{ color: theme.textSecondary, fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                          {language === 'FR' ? 'il y a' : ''} {item.time} {language === 'EN' ? 'ago' : ''}
                        </span>
                      </div>
                      <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {item.title}
                      </h3>
                      <div style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        <span>📍</span>
                        <span>{item.location}</span>
                      </div>
                      <p style={{ color: theme.textSecondary, fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px 0', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <span style={{ fontSize: '14px' }}>⏱️</span>
                        <span style={{ color: theme.textSecondary, fontSize: '13px', fontWeight: '600' }}>
                          {t.duration}: {item.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.type === 'transport') {
              const statusColors = {
                onTime: { bg: '#10b981', icon: '✓' },
                delayed: { bg: '#f59e0b', icon: '⚠️' },
                disrupted: { bg: '#ef4444', icon: '✗' }
              };
              const statusColor = statusColors[item.status];
              const transportIcons = {
                metro: '🚇',
                bus: '🚌',
                train: '🚆'
              };
              return (
                <div key={item.id} style={{
                  padding: '20px 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '36px', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                      {transportIcons[item.category]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: statusColor.bg,
                          color: '#ffffff',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          <span>{statusColor.icon}</span>
                          {t[item.status]}
                        </span>
                        <span style={{ color: theme.textSecondary, fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                          {language === 'FR' ? 'il y a' : ''} {item.time} {language === 'EN' ? 'ago' : ''}
                        </span>
                      </div>
                      <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: theme.textSecondary, fontSize: '14px', lineHeight: '1.6', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.type === 'parking') {
              const availabilityPercent = (item.available / item.total) * 100;
              const availabilityColor = availabilityPercent > 30 ? '#10b981' : availabilityPercent > 10 ? '#f59e0b' : '#ef4444';
              return (
                <div key={item.id} style={{
                  padding: '20px 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '36px', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🅿️</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: availabilityColor,
                          color: '#ffffff',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          {item.available} {t.spots}
                        </span>
                        <span style={{ color: theme.textSecondary, fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                          {language === 'FR' ? 'mis à jour il y a' : 'updated'} {item.time} {language === 'EN' ? 'ago' : ''}
                        </span>
                      </div>
                      <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            {t.available}
                          </div>
                          <div style={{ color: theme.text, fontSize: '20px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {item.available}/{item.total}
                          </div>
                        </div>
                        <div style={{ height: '40px', width: '1px', backgroundColor: theme.border }} />
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            Prix
                          </div>
                          <div style={{ color: theme.text, fontSize: '20px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {item.price}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        marginTop: '12px',
                        height: '8px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${availabilityPercent}%`,
                          backgroundColor: availabilityColor,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.type === 'gas') {
              return (
                <div key={item.id} style={{
                  padding: '20px 0',
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '36px', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>⛽</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ color: theme.textSecondary, fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                          {language === 'FR' ? 'mis à jour il y a' : 'updated'} {item.time} {language === 'EN' ? 'ago' : ''}
                        </span>
                      </div>
                      <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {item.station}
                      </h3>
                      <div style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        <span>📍</span>
                        <span>{item.location}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div style={{ 
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            SP95
                          </div>
                          <div style={{ color: theme.text, fontSize: '18px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {item.prices.sp95}
                          </div>
                        </div>
                        <div style={{ 
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            SP98
                          </div>
                          <div style={{ color: theme.text, fontSize: '18px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {item.prices.sp98}
                          </div>
                        </div>
                        <div style={{ 
                          padding: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            Diesel
                          </div>
                          <div style={{ color: theme.text, fontSize: '18px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {item.prices.diesel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        @keyframes slideIn {
          from { 
            transform: translateX(400px);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}