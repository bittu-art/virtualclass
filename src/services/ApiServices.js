import axios from 'axios';



const API_BASE_URL = 'http://localhost:4000'; // Replace with your actual API base URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // DO NOT hardcode the token here. It will be added by the interceptor.
    },
});

api.interceptors.response.use(
    (response) => response, // Just return the response if successful
    async (error) => {
      // console.error('API request failed:', error);
        // Example: Handle 401 Unauthorized errors (token expired, invalid)
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access - token might be expired or invalid.');
          
        }
        return Promise.reject(error); // Re-throw the error for component-level handling
    }
);


const apiService = {
 
    get: async (endpoint, params = {}) => {
        try {
            const response = await api.get(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error(`API GET request to ${endpoint} failed:`, error);
            throw error; // Rethrow the error for the caller to handle
        }
    },

    
    post: async (endpoint, data) => {
        try {
            const response = await api.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`API POST request to ${endpoint} failed:`, error);
            throw error;
        }
    },

    put: async (endpoint, data) => {
        try {
            const response = await api.put(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`API PUT request to ${endpoint} failed:`, error);
            throw error;
        }
    },

   
    delete: async (endpoint) => {
        try {
            const response = await api.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error(`API DELETE request to ${endpoint} failed:`, error);
            throw error;
        }
    },

    
};

export default apiService;
