import api from './api';

const postService = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response?.data?.data?.posts || [];
  },

  createPost: async (content) => {
    const response = await api.post('/posts', { content });
    const post = response?.data?.data?.post;
    if (!post) throw new Error('No post returned');
    return post;
  },

  updatePost: async (postId, content) => {
    const response = await api.put(`/posts/${postId}`, { content });
    return response?.data?.data?.post || response.data.post;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  getComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    // Handle nested data structure
    return response?.data?.data?.comments || response.data.comments || [];
  },

  createComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    // Fix: Handle nested data.data.comment structure
    return response?.data?.data?.comment || response.data.comment;
  },

  deleteComment: async (commentID) => {
    const response = await api.delete(`/comments/${commentID}`);
    return response.data;
  },
};

export default postService;