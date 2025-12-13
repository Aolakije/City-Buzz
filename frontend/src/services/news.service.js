import api from './api';

const newsService = {
  /**
   * Get Rouen news with optional category filter
   * @param {string} category - Category filter (sports, business, etc.)
   * @param {string} language - Language code (fr, en)
   * @param {number} page - Page number
   * @param {number} pageSize - Articles per page
   */
  getRouenNews: async (category = '', language = 'fr', page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/news/rouen', {
        params: { category, language, page, pageSize }
      });
      return response?.data?.data || { articles: [], totalResults: 0 };
    } catch (err) {
      console.error('Error fetching Rouen news:', err);
      throw new Error('Failed to fetch Rouen news');
    }
  },

  /**
   * Get Normandy news with optional category filter
   */
  getNormandyNews: async (category = '', language = 'fr', page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/news/normandy', {
        params: { category, language, page, pageSize }
      });
      return response?.data?.data || { articles: [], totalResults: 0 };
    } catch (err) {
      console.error('Error fetching Normandy news:', err);
      throw new Error('Failed to fetch Normandy news');
    }
  },

  /**
   * Get France national news by category
   */
  getFranceNews: async (category = '', language = 'fr', page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/news/france', {
        params: { category, language, page, pageSize }
      });
      return response?.data?.data || { articles: [], totalResults: 0 };
    } catch (err) {
      console.error('Error fetching France news:', err);
      throw new Error('Failed to fetch France news');
    }
  },

  /**
   * Get news for any city with optional category filter
   */
  getCityNews: async (city, category = '', language = 'fr', page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/news/city', {
        params: { city, category, language, page, pageSize }
      });
      return response?.data?.data || { articles: [], totalResults: 0 };
    } catch (err) {
      console.error('Error fetching city news:', err);
      throw new Error('Failed to fetch city news');
    }
  },

  /**
   * Search news articles
   */
  searchNews: async (query, language = 'fr', page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/news/search', {
        params: { q: query, language, sortBy: 'publishedAt', page, pageSize }
      });
      return response?.data?.data || { articles: [], totalResults: 0 };
    } catch (err) {
      console.error('Error searching news:', err);
      throw new Error('Failed to search news');
    }
  },

  /**
   * Save article (requires authentication)
   */
  saveArticle: async (articleData) => {
    try {
      const response = await api.post('/news/save', articleData);
      return response?.data?.data;
    } catch (err) {
      console.error('Error saving article:', err);
      throw new Error('Failed to save article');
    }
  },

  /**
   * Get saved articles
   */
  getSavedArticles: async () => {
    try {
      const response = await api.get('/news/saved');
      return response?.data?.data || [];
    } catch (err) {
      console.error('Error fetching saved articles:', err);
      throw new Error('Failed to fetch saved articles');
    }
  },

  /**
   * Remove saved article
   */
  removeSavedArticle: async (articleUrl) => {
    try {
      const response = await api.delete('/news/saved', {
        params: { url: articleUrl }
      });
      return response?.data;
    } catch (err) {
      console.error('Error removing saved article:', err);
      throw new Error('Failed to remove saved article');
    }
  }
};

export default newsService;