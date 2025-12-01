import { useState } from 'react';

export default function ChatMessages() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('FR');
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  
  const colors = {
    primary: '#292d4f',
    accent: '#f6f182',
  };
  
  const theme = {
    bg: isDark ? 'linear-gradient(135deg, #0d0e17 0%, #1a1c2e 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
    bgChat: isDark ? '#1a1c2e' : '#ffffff',
    bgSidebar: isDark ? '#0d0e17' : '#f0f4f8',
    text: isDark ? '#ffffff' : '#292d4f',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(41, 45, 79, 0.7)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(41, 45, 79, 0.12)',
    messageSent: isDark ? colors.primary : '#e3f2fd',
    messageReceived: isDark ? '#2a2d3a' : '#f5f5f5',
  };

  const t = {
    messages: language === 'FR' ? 'Messages' : 'Messages',
    search: language === 'FR' ? 'Rechercher...' : 'Search...',
    typing: language === 'FR' ? 'est en train d\'écrire...' : 'is typing...',
    online: language === 'FR' ? 'En ligne' : 'Online',
    typeMessage: language === 'FR' ? 'Écrire un message...' : 'Type a message...',
    expires: language === 'FR' ? 'Expire dans' : 'Expires in',
    you: language === 'FR' ? 'Vous' : 'You',
    replyTo: language === 'FR' ? 'Répondre à' : 'Reply to',
    newNotifications: language === 'FR' ? 'nouvelles notifications' : 'new notifications',
  };

  const conversations = [
    {
      id: 1,
      name: 'Marie Dubois',
      avatar: '👩',
      lastMessage: 'Super ! On se voit demain alors 🎉',
      timestamp: '14:32',
      unread: 2,
      online: true,
      isGroup: false
    },
    {
      id: 2,
      name: 'Groupe Amis Rouen',
      avatar: '👥',
      lastMessage: 'Pierre: Qui vient au match samedi ?',
      timestamp: '13:15',
      unread: 5,
      online: false,
      isGroup: true
    },
    {
      id: 3,
      name: 'Jean Martin',
      avatar: '👨',
      lastMessage: 'Ok merci pour l\'info',
      timestamp: 'Hier',
      unread: 0,
      online: false,
      isGroup: false
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      avatar: '👩‍🦰',
      lastMessage: 'Photo.jpg',
      timestamp: 'Hier',
      unread: 0,
      online: true,
      isGroup: false
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'Marie Dubois',
        isOwn: false,
        type: 'text',
        content: 'Salut ! Tu es libre demain soir ?',
        timestamp: '14:28',
        expiresIn: '2h 15min',
        read: true
      },
      {
        id: 2,
        sender: 'You',
        isOwn: true,
        type: 'text',
        content: 'Oui, pourquoi ?',
        timestamp: '14:29',
        expiresIn: '2h 16min',
        read: true
      },
      {
        id: 3,
        sender: 'Marie Dubois',
        isOwn: false,
        type: 'text',
        content: 'J\'ai des places pour le concert au 106 🎵',
        timestamp: '14:30',
        expiresIn: '2h 17min',
        read: true,
        reactions: ['❤️', '🔥']
      },
      {
        id: 4,
        sender: 'You',
        isOwn: true,
        type: 'text',
        content: 'Génial ! Je suis partant 😊',
        timestamp: '14:31',
        expiresIn: '2h 18min',
        read: true,
        replyTo: { sender: 'Marie Dubois', content: 'J\'ai des places pour le concert au 106 🎵' }
      },
      {
        id: 5,
        sender: 'Marie Dubois',
        isOwn: false,
        type: 'text',
        content: 'Super ! On se voit demain alors 🎉',
        timestamp: '14:32',
        expiresIn: '2h 19min',
        read: true
      },
      {
        id: 6,
        sender: 'Marie Dubois',
        isOwn: false,
        type: 'image',
        content: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
        caption: 'Voilà l\'affiche du concert !',
        timestamp: '14:33',
        expiresIn: '2h 20min',
        read: false
      }
    ],
    2: [
      {
        id: 1,
        sender: 'Pierre',
        isOwn: false,
        type: 'text',
        content: 'Qui vient au match samedi ?',
        timestamp: '13:15',
        expiresIn: '1h 42min',
        read: true
      }
    ]
  };

  const activeConversation = conversations.find(c => c.id === activeChat);
  const activeMessages = messages[activeChat] || [];
  const isTyping = activeChat === 1;
  
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  const handleBellClick = () => {
    setShowToast(true);
    setIsRinging(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Message sending logic would go here
      setMessageInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        height: '60px',
        backgroundColor: isDark ? 'rgba(13, 14, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.text }}>
          City-Buzz
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleBellClick}
            style={{ 
              position: 'relative',
              width: '40px', 
              height: '40px', 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.08)', 
              border: 'none', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '18px',
              animation: isRinging ? 'ring 0.5s ease-in-out 3' : 'none'
            }}
          >
            🔔
            {totalUnread > 0 && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '18px',
                height: '18px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '9px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: `2px solid ${isDark ? '#0d0e17' : '#ffffff'}`
              }}>
                {totalUnread}
              </div>
            )}
          </button>
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
          <span style={{ fontSize: '20px' }}>🔔</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>
              {totalUnread} {t.newNotifications}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar - Conversation List */}
        <div style={{
          width: showMobileChat ? '0' : '100%',
          maxWidth: '380px',
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.3s ease'
        }}>
          {/* Search */}
          <div style={{ padding: '16px' }}>
            <h2 style={{ color: theme.text, fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              {t.messages}
            </h2>
            <input
              type="text"
              placeholder={t.search}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: '12px',
                color: theme.text,
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveChat(conv.id);
                  setShowMobileChat(true);
                }}
                style={{
                  padding: '16px',
                  borderBottom: `1px solid ${theme.border}`,
                  cursor: 'pointer',
                  backgroundColor: activeChat === conv.id ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(41,45,79,0.05)') : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#10b981',
                        border: `2px solid ${theme.bgSidebar}`,
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.name}
                      </h3>
                      <span style={{ color: theme.textSecondary, fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>
                        {conv.timestamp}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: theme.textSecondary, fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <div style={{
                          minWidth: '20px',
                          height: '20px',
                          backgroundColor: colors.accent,
                          color: colors.primary,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          marginLeft: '8px',
                          padding: '0 6px'
                        }}>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{
          flex: 1,
          backgroundColor: theme.bgChat,
          display: showMobileChat || window.innerWidth > 768 ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: theme.bgChat
              }}>
                {showMobileChat && (
                  <button
                    onClick={() => setShowMobileChat(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.text,
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '0',
                      marginRight: '8px'
                    }}
                  >
                    ←
                  </button>
                )}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {activeConversation.avatar}
                  </div>
                  {activeConversation.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#10b981',
                      border: `2px solid ${theme.bgChat}`,
                      borderRadius: '50%'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '600', margin: '0 0 2px 0' }}>
                    {activeConversation.name}
                  </h3>
                  {activeConversation.online && (
                    <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>
                      {t.online}
                    </p>
                  )}
                </div>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: theme.text,
                  fontSize: '20px',
                  cursor: 'pointer'
                }}>
                  ⋮
                </button>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {activeMessages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                    gap: '8px'
                  }}>
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.isOwn ? 'flex-end' : 'flex-start'
                    }}>
                      {msg.replyTo && (
                        <div style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          marginBottom: '4px',
                          borderLeft: `3px solid ${colors.accent}`,
                          maxWidth: '100%'
                        }}>
                          <div style={{ color: colors.accent, fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                            {t.replyTo} {msg.replyTo.sender}
                          </div>
                          <div style={{ color: theme.textSecondary, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.replyTo.content}
                          </div>
                        </div>
                      )}
                      
                      <div style={{
                        backgroundColor: msg.isOwn ? theme.messageSent : theme.messageReceived,
                        padding: msg.type === 'image' ? '4px' : '12px 16px',
                        borderRadius: '16px',
                        color: theme.text,
                        wordBreak: 'break-word'
                      }}>
                        {msg.type === 'text' && (
                          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                            {msg.content}
                          </p>
                        )}
                        
                        {msg.type === 'image' && (
                          <div>
                            <img src={msg.content} alt="Shared" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', display: 'block' }} />
                            {msg.caption && (
                              <p style={{ margin: '8px 8px 4px 8px', fontSize: '15px', lineHeight: '1.5' }}>
                                {msg.caption}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {msg.type === 'voice' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                            <button style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: colors.accent,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: colors.primary,
                              fontSize: '12px'
                            }}>
                              ▶
                            </button>
                            <div style={{ flex: 1, height: '32px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {Array.from({length: 20}).map((_, i) => (
                                <div key={i} style={{
                                  width: '3px',
                                  height: `${Math.random() * 24 + 8}px`,
                                  backgroundColor: msg.isOwn ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
                                  borderRadius: '2px'
                                }} />
                              ))}
                            </div>
                            <span style={{ fontSize: '13px', color: theme.textSecondary }}>0:45</span>
                          </div>
                        )}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '4px',
                        fontSize: '12px',
                        color: theme.textSecondary
                      }}>
                        <span>{msg.timestamp}</span>
                        {msg.isOwn && (
                          <span style={{ color: msg.read ? '#10b981' : theme.textSecondary }}>
                            {msg.read ? '✓✓' : '✓'}
                          </span>
                        )}
                        <span style={{ color: '#f59e0b', fontSize: '11px' }}>
                          ⏱ {t.expires} {msg.expiresIn}
                        </span>
                      </div>
                      
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          marginTop: '4px',
                          padding: '4px 8px',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          borderRadius: '12px',
                          fontSize: '14px'
                        }}>
                          {msg.reactions.map((reaction, i) => (
                            <span key={i}>{reaction}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: theme.messageReceived,
                      padding: '12px 16px',
                      borderRadius: '16px',
                      display: 'flex',
                      gap: '4px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.textSecondary, animation: 'bounce 1.4s infinite' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.textSecondary, animation: 'bounce 1.4s infinite 0.2s' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.textSecondary, animation: 'bounce 1.4s infinite 0.4s' }} />
                    </div>
                    <span style={{ fontSize: '13px', color: theme.textSecondary }}>
                      {activeConversation.name} {t.typing}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div style={{
                padding: '16px 20px',
                borderTop: `1px solid ${theme.border}`,
                backgroundColor: theme.bgChat,
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}>
                <button style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(41,45,79,0.08)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  📎
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.typeMessage}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '24px',
                    color: theme.text,
                    fontSize: '15px',
                    outline: 'none',
                    minHeight: '40px',
                    maxHeight: '120px',
                    resize: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: colors.primary,
                    flexShrink: 0
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.textSecondary,
              fontSize: '18px'
            }}>
              {language === 'FR' ? 'Sélectionnez une conversation' : 'Select a conversation'}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
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
        @media (max-width: 768px) {
          .sidebar { display: ${showMobileChat ? 'none' : 'flex'} !important; }
          .chat-window { display: ${showMobileChat ? 'flex' : 'none'} !important; }
        }
      `}</style>
    </div>
  );
}