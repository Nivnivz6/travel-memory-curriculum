import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Helper to get auth headers for protected requests
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Example: Public API call (no auth needed)
export const registerApi = (data) => apiClient.post('/auth/register', data);
export const loginApi = (data) => apiClient.post('/auth/login', data);

// Example: Protected API call (auth required)
export const fetchImagesApi = (params = {}) => {
    return apiClient.get('/images', {
        params,
        headers: getAuthHeaders()
    });
};

export const uploadImageApi = (formData) => {
    return apiClient.post('/images/upload', formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteImagesApi = (ids) => {
    return apiClient.delete('/images', {
        data: { ids },
        headers: getAuthHeaders()
    });
};