import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

// API service for comments
export const commentApi = {
    // Fetch comments for a specific page
    getComments: async (pageName, accessToken) => {
        const response = await axios.get(`${API_BASE_URL}/comments/?page_name=${pageName}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },

    // Create a new comment
    createComment: async ({ pageName, text, accessToken }) => {
        const response = await axios.post(
            `${API_BASE_URL}/comments/`,
            { page_name: pageName, text },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    },

    // Update a comment
    updateComment: async ({ commentId, text, accessToken }) => {
        const response = await axios.put(
            `${API_BASE_URL}/comments/${commentId}/`,
            { text },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    },

    // Delete a comment
    deleteComment: async ({ commentId, accessToken }) => {
        await axios.delete(
            `${API_BASE_URL}/comments/${commentId}/`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return commentId;
    }
};
