import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for the getToken function
let getTokenFunction = null;

// Function to set the token getter
export const setTokenGetter = (getToken) => {
  getTokenFunction = getToken;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Use the stored getToken function if available
      if (getTokenFunction) {
        const token = await getTokenFunction();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      console.error('API Error:', message);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login or refresh token
        console.error('Unauthorized access');
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
