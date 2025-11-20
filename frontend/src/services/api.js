import axios from 'axios';

// API base URL - detect environment and use appropriate URL
// Note: Create React App uses process.env, Vite uses import.meta.env
const getApiBaseUrl = () => {
  // Try different environment variable patterns
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }
  // Fallback for different environments
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for predictions
  withCredentials: false, // Disable credentials for CORS
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.detail || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

/**
 * Predict cloud type from uploaded image
 * @param {File} imageFile - The image file to classify
 * @returns {Promise<Object>} Prediction result with cloud type and confidence
 */
export const predictCloudType = async (imageFile) => {
  try {
    // Validate file
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error('File too large. Please upload an image smaller than 10MB.');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', imageFile);

    console.log('Making prediction request to:', `${API_BASE_URL}/predict-cloud`);
    
    // Make API request with explicit URL and headers
    const response = await axios.post(`${API_BASE_URL}/predict-cloud`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
      withCredentials: false,
    });

    console.log('Prediction response:', response.data);

    // Validate response
    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    const { cloud_type, confidence, processing_time } = response.data;

    if (!cloud_type || confidence === undefined) {
      throw new Error('Invalid prediction data received');
    }

    return {
      cloudType: cloud_type,
      confidence: Math.round(confidence * 100), // Convert to percentage
      processingTime: processing_time || 0,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Prediction error:', error);
    
    // Enhanced error handling for different types of errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server took too long to respond.');
    }
    
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      throw new Error('Unable to connect to server. Please ensure the backend is running on ' + API_BASE_URL);
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.detail || 'Server error occurred';
      
      if (status === 404) {
        throw new Error('API endpoint not found. Please check if the backend server is properly configured.');
      } else if (status === 422) {
        throw new Error('Invalid file format or size. ' + message);
      } else if (status >= 500) {
        throw new Error('Server error: ' + message);
      } else {
        throw new Error(`Error ${status}: ${message}`);
      }
    }
    
    // Re-throw the original error if it's already a custom error
    throw error;
  }
};

/**
 * Get model information and health status
 * @returns {Promise<Object>} Model info including version, accuracy etc.
 */
export const getModelInfo = async () => {
  try {
    const response = await api.get('/model-info');
    return response.data;
  } catch (error) {
    console.error('Model info error:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

/**
 * Mock API function for development/testing when backend is not available
 * @param {File} imageFile - The image file to classify
 * @returns {Promise<Object>} Mock prediction result
 */
export const mockPredictCloudType = async (imageFile) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const cloudTypes = [
    'Cumulus', 'Cumulonimbus', 'Stratus', 'Cirrus', 
    'Altocumulus', 'Altostratus', 'Stratocumulus', 
    'Nimbostratus', 'Cirrostratus', 'Cirrocumulus'
  ];

  const randomCloudType = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
  const randomConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%

  return {
    cloudType: randomCloudType,
    confidence: randomConfidence,
    processingTime: 2.3,
    timestamp: new Date().toISOString()
  };
};

// Export API instance for custom requests
export default api;