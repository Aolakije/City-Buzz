import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import ColorPreview from './pages/ColorPreview';
import HeaderNav from './pages/HeaderNav';
import SideBar from './pages/SideBar';
import FeedLayout from './pages/FeedLayout';
import ProfilePage from './pages/ProfilePage';
import EventPage from './pages/EventPage';
import NewsFeed from './pages/NewsFeed';
import WeatherPage from './pages/WeatherPage';
import TrafficPage from './pages/TrafficPage';
import ChatPage from './pages/ChatPage';

// Import other mockup pages here as you add them

function App() {
  const [currentPage, setCurrentPage] = useState('auth');

  const pages = {
    auth: <AuthPage />,
    colorPreview: <ColorPreview />,
    headernav: <HeaderNav />,
    sidebar: <SideBar />,
    FeedLayout: <FeedLayout />,
    ProfilePage: <ProfilePage />,
    eventPage: <EventPage />,
    newsFeed: <NewsFeed />,
    weatherPage: <WeatherPage />,
    trafficPage: <TrafficPage />,
    chatPage: <ChatPage />    
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Simple navigation */}
      <nav style={{
        background: '#3d3c25ff',
        padding: '15px',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setCurrentPage('auth')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'auth' ? '#090a0aff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Auth Page
        </button>
        <button 
          onClick={() => setCurrentPage('colorPreview')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'colorPreview' ? '#141515ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Color Preview
        </button>
        <button 
          onClick={() => setCurrentPage('headernav')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'headernav' ? '#111112ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Header Nav
        </button>
        <button 
          onClick={() => setCurrentPage('sidebar')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'sidebar' ? '#06101bff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Side Bar
        </button>
        <button 
          onClick={() => setCurrentPage('FeedLayout')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'FeedLayout' ? '#131313ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Feed Layout
        </button>
        <button 
          onClick={() => setCurrentPage('ProfilePage')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'ProfilePage' ? '#1a1a1aff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Profile Page
        </button>
        <button 
          onClick={() => setCurrentPage('eventPage')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'eventPage' ? '#222222ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Event Page
        </button>
        <button 
          onClick={() => setCurrentPage('newsFeed')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'newsFeed' ? '#2a2a2aff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          News Feed
        </button>
        <button 
          onClick={() => setCurrentPage('weatherPage')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'weatherPage' ? '#303030ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Weather Page
        </button>
        <button 
          onClick={() => setCurrentPage('trafficPage')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'trafficPage' ? '#383838ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Traffic Page
        </button>
        <button 
          onClick={() => setCurrentPage('chatPage')}
          style={{
            padding: '8px 16px',
            background: currentPage === 'chatPage' ? '#404040ff' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chat Page
        </button>
     </nav>
      <div>
        {pages[currentPage]}
      </div>
    </div>
  );
}

export default App;