import api from './api';

const postService = {
  // Get feed
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single post
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Create post
  createPost: async (content) => {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  // Update post
  updatePost: async (postId, content) => {
    const response = await api.put(`/posts/${postId}`, { content });
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Unlike post
  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  // Get comments
  getComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Create comment
  createComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentID) => {
    const response = await api.delete(`/comments/${commentID}`);
    return response.data;
  },
};

export default postService;