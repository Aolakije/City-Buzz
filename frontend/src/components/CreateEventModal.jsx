import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/themeStore';

export default function CreateEventModal({ isOpen, onClose, onEventCreated, event = null }) {
  const { i18n } = useTranslation();
  const isDark = useThemeStore((state) => state.isDark);
  const isEditing = !!event; // Check if we're editing
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    address: '',
    city: 'Rouen',
    category: 'concerts',
    event_type: 'party',
    price: '',
    is_free: false,
    organizer_name: '',
    organizer_contact: '',
    ticket_url: '',
    max_capacity: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill form when editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        address: event.address || '',
        city: event.city || 'Rouen',
        category: event.category || 'concerts',
        event_type: event.event_type || 'party',
        price: event.price || '',
        is_free: event.is_free || false,
        organizer_name: event.organizer_name || '',
        organizer_contact: event.organizer_contact || '',
        ticket_url: event.ticket_url || '',
        max_capacity: event.max_capacity || '',
      });
      
      // Set existing image as preview
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
    }
  }, [event]);

  const eventTypes = [
    { id: 'party', label: i18n.language === 'fr' ? 'Fête / Soirée' : 'Party / Nightlife', icon: '🥂' },
    { id: 'concert', label: 'Concert / Live', icon: '🎙️' },
    { id: 'dining', label: i18n.language === 'fr' ? 'Dîner / Gastro' : 'Dining / Food', icon: '🍽️' },
    { id: 'networking', label: 'Pro / Networking', icon: '💼' },
    { id: 'workshop', label: 'Atelier / Workshop', icon: '🧠' },
    { id: 'art', label: 'Art & Expo', icon: '🎨' },
    { id: 'show', label: i18n.language === 'fr' ? 'Spectacle / Théâtre' : 'Show / Theater', icon: '🎭' },
    { id: 'movie', label: i18n.language === 'fr' ? 'Cinéma' : 'Cinema', icon: '🎬' },
    { id: 'gaming', label: 'Gaming / Tournoi', icon: '👾' },
    { id: 'sports', label: 'Sport / Fitness', icon: '🏅' },
    { id: 'outdoor', label: i18n.language === 'fr' ? 'Nature / Plein air' : 'Outdoor / Nature', icon: '🌲' },
    { id: 'travel', label: i18n.language === 'fr' ? 'Voyage' : 'Travel', icon: '✈️' },
    { id: 'coffee', label: i18n.language === 'fr' ? 'Café / Détente' : 'Coffee / Chill', icon: '☕' },
  ];

  const categories = [
    { id: 'concerts', label: 'Concerts' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'sports', label: 'Sports' },
    { id: 'culture', label: 'Culture' },
    { id: 'markets', label: i18n.language === 'fr' ? 'Marchés' : 'Markets' },
    { id: 'nightlife', label: i18n.language === 'fr' ? 'Vie nocturne' : 'Nightlife' },
    { id: 'clubs', label: 'Clubs & Restos' },
  ];

  const t = {
    createEvent: i18n.language === 'fr' ? 'Nouvel Événement' : 'New Event',
    editEvent: i18n.language === 'fr' ? 'Modifier l\'Événement' : 'Edit Event',
    sectionGeneral: i18n.language === 'fr' ? 'Informations' : 'General Info',
    sectionTimePlace: i18n.language === 'fr' ? 'Où et Quand ?' : 'Where & When',
    sectionDetails: i18n.language === 'fr' ? 'Détails & Billets' : 'Details & Tickets',
    title: i18n.language === 'fr' ? 'Titre de l\'événement' : 'Event Title',
    description: i18n.language === 'fr' ? 'Description complète' : 'Full Description',
    startDate: i18n.language === 'fr' ? 'Début' : 'Starts',
    endDate: i18n.language === 'fr' ? 'Fin' : 'Ends',
    location: i18n.language === 'fr' ? 'Lieu (ex: Le 106)' : 'Venue Name',
    address: i18n.language === 'fr' ? 'Adresse' : 'Address',
    category: i18n.language === 'fr' ? 'Catégorie' : 'Category',
    eventType: i18n.language === 'fr' ? 'Type d\'activité' : 'Activity Type',
    uploadImage: i18n.language === 'fr' ? 'Ajouter une image' : 'Upload Image',
    changeImage: i18n.language === 'fr' ? 'Changer l\'image' : 'Change Image',
    price: i18n.language === 'fr' ? 'Prix (€)' : 'Price (€)',
    isFree: i18n.language === 'fr' ? 'Gratuit' : 'Free',
    organizer: i18n.language === 'fr' ? 'Organisateur' : 'Organizer',
    ticketUrl: i18n.language === 'fr' ? 'Lien billetterie (optionnel)' : 'Ticket Link (optional)',
    capacity: i18n.language === 'fr' ? 'Places dispo' : 'Capacity',
    cancel: i18n.language === 'fr' ? 'Annuler' : 'Cancel',
    create: i18n.language === 'fr' ? 'Publier' : 'Publish',
    update: i18n.language === 'fr' ? 'Mettre à jour' : 'Update',
    uploading: i18n.language === 'fr' ? 'Upload en cours...' : 'Uploading...',
  };

  const theme = {
    overlay: 'rgba(0, 0, 0, 0.4)',
    bgCard: isDark ? '#1a1c2e' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
    inputBg: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db',
    accent: '#6366f1'
  };

  const styles = {
    overlay: {
      position: 'fixed', inset: 0, backgroundColor: theme.overlay,
      backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    },
    modal: {
      backgroundColor: theme.bgCard,
      width: '100%', maxWidth: '700px',
      maxHeight: '85vh',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${theme.border}`,
      overflow: 'hidden',
      position: 'relative'
    },
    header: {
      padding: '20px 24px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: theme.bgCard,
    },
    content: {
      padding: '24px',
      overflowY: 'auto',
      flex: 1,
      display: 'flex', flexDirection: 'column', gap: '32px',
    },
    section: {
      display: 'flex', flexDirection: 'column', gap: '16px',
    },
    sectionTitle: {
      fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px',
      fontWeight: '800', color: theme.accent,
      display: 'flex', alignItems: 'center', gap: '8px'
    },
    grid2: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px',
    },
    inputGroup: {
      display: 'flex', flexDirection: 'column', gap: '6px',
    },
    label: {
      fontSize: '13px', fontWeight: '600', color: theme.textMuted,
    },
    input: {
      width: '100%', padding: '12px 14px',
      backgroundColor: theme.inputBg,
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: '10px',
      color: theme.text, fontSize: '14px',
      outline: 'none', transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    footer: {
      padding: '16px 24px',
      borderTop: `1px solid ${theme.border}`,
      display: 'flex', justifyContent: 'flex-end', gap: '12px',
      backgroundColor: theme.bgCard,
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(i18n.language === 'fr' ? 'Veuillez sélectionner une image' : 'Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(i18n.language === 'fr' ? 'L\'image ne doit pas dépasser 10MB' : 'Image must be under 10MB');
      return;
    }

    setImageFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('image', imageFile);

      const response = await fetch('http://localhost:8080/api/v1/upload/event-image', {
        method: 'POST',
        credentials: 'include',
        body: formDataToUpload,
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err) {
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload new image if one was selected
      let imageUrl = event?.image_url || null; // Keep existing image URL
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        location: formData.location,
        address: formData.address || null,
        city: formData.city,
        category: formData.category,
        event_type: formData.event_type,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
        price: formData.is_free ? null : formData.price,
        is_free: formData.is_free,
        image_url: imageUrl,
        ticket_url: formData.ticket_url?.trim() || null,
        organizer_name: formData.organizer_name || null,
        organizer_contact: formData.organizer_contact || null,
      };

      const url = isEditing 
        ? `http://localhost:8080/api/v1/events/${event.id}`
        : 'http://localhost:8080/api/v1/events';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        onEventCreated(data.data);
        onClose();
        
        // Reset form only if creating
        if (!isEditing) {
          setFormData({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            location: '',
            address: '',
            city: 'Rouen',
            category: 'concerts',
            event_type: 'party',
            price: '',
            is_free: false,
            organizer_name: '',
            organizer_contact: '',
            ticket_url: '',
            max_capacity: '',
          });
          setImageFile(null);
          setImagePreview(null);
        }
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: theme.text }}>
            {isEditing ? t.editEvent : t.createEvent}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
                background: 'rgba(255,255,255,0.05)', border: 'none', color: theme.textMuted, 
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
            }}>
                ×
            </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={styles.content}>
            
            {error && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px' }}>{error}</div>}

            <div style={styles.section}>
              <div style={styles.sectionTitle}><span>📝</span> {t.sectionGeneral}</div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>{t.title} *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} style={styles.input} placeholder="Ex: Summer Vibes Festival" />
              </div>

              <div style={styles.grid2}>
                 <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.category} *</label>
                  <select required name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.eventType} *</label>
                  <select required name="event_type" value={formData.event_type} onChange={handleChange} style={styles.input}>
                    {eventTypes.map(type => <option key={type.id} value={type.id}>{type.icon} {type.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>{t.description} *</label>
                <textarea 
                  required 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  style={{...styles.input, minHeight: '100px', resize: 'none'}} 
                  placeholder={i18n.language === 'fr' ? "Description de l'événement..." : "Event description..."}
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>{t.uploadImage}</label>
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '10px',
                        border: `1px solid ${theme.inputBorder}`
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {t.changeImage}
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    border: `2px dashed ${theme.inputBorder}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: theme.inputBg,
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '48px', marginBottom: '12px' }}>📷</span>
                    <span style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>
                      {t.uploadImage}
                    </span>
                    <span style={{ color: theme.textMuted, fontSize: '12px', marginTop: '4px' }}>
                      {i18n.language === 'fr' ? 'JPG, PNG, GIF (max 10MB)' : 'JPG, PNG, GIF (max 10MB)'}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}><span>📍</span> {t.sectionTimePlace}</div>
              
              <div style={styles.grid2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.startDate} *</label>
                  <input required type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.endDate}</label>
                  <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.location} *</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} placeholder="Le 106" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.address}</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} style={styles.input} placeholder="Quai Jean de Béthencourt" />
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}><span>🎟️</span> {t.sectionDetails}</div>

              <div style={styles.grid2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.price}</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      disabled={formData.is_free} 
                      placeholder="0.00" 
                      style={{...styles.input, opacity: formData.is_free ? 0.4 : 1, flex: 1}} 
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleChange} style={{ accentColor: theme.accent }} />
                      <span style={{ fontSize: '13px', color: theme.text }}>{t.isFree}</span>
                    </label>
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{t.ticketUrl}</label>
                  <input type="url" name="ticket_url" value={formData.ticket_url} onChange={handleChange} style={styles.input} placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={{
                 padding: '10px 20px', borderRadius: '10px', border: `1px solid ${theme.border}`,
                 background: 'transparent', color: theme.text, fontWeight: '600', cursor: 'pointer'
            }}>
              {t.cancel}
            </button>
            <button type="submit" disabled={loading || uploadingImage} style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none',
                background: theme.accent, color: 'white', fontWeight: '600', cursor: 'pointer',
                opacity: (loading || uploadingImage) ? 0.7 : 1
            }}>
              {uploadingImage ? t.uploading : loading ? '...' : (isEditing ? t.update : t.create)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}