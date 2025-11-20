import axios from 'axios';

// API base URL - detect environment and use appropriate URL
// Note: Create React App uses process.env, Vite uses import.meta.env
const getApiBaseUrl = () => {
  let baseUrl = 'http://localhost:8000'; // Default fallback
  
  // Try to get from environment variables
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    baseUrl = process.env.REACT_APP_API_URL;
  }
  
  // Clean up URL - remove trailing slashes, backslashes, or extra characters
  baseUrl = baseUrl.replace(/[\/\\]+$/, '').trim();
  
  // Ensure it's a valid URL format
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = 'http://localhost:8000';
  }
  
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);

// Create axios instance with enhanced config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds timeout for predictions
  withCredentials: false, // Disable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  }
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

    console.log('🔄 Making prediction request to:', `${API_BASE_URL}/predict-cloud`);
    console.log('📁 File details:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
      type: imageFile.type
    });
    
    // Make API request with enhanced configuration
    const response = await api.post('/predict-cloud', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // Increased timeout for file upload
      withCredentials: false,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload progress: ${progress}%`);
        }
      }
    });

    console.log('✅ Prediction response:', response.data);

    // Validate response structure
    if (!response.data || !response.data.success) {
      throw new Error('Invalid response from server');
    }

    const { 
      cloud_type, 
      confidence, 
      processing_time, 
      description,
      weather_significance,
      altitude,
      appearance 
    } = response.data;

    if (!cloud_type || confidence === undefined) {
      throw new Error('Invalid prediction data received');
    }

    return {
      success: true,
      cloudType: cloud_type,
      confidence: Math.round(confidence * 100), // Convert to percentage
      processingTime: processing_time || 0,
      description: description || '',
      weatherSignificance: weather_significance || '',
      altitude: altitude || '',
      appearance: appearance || '',
      timestamp: new Date().toISOString(),
      filename: imageFile.name
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
 * Health check endpoint with enhanced connection testing
 * @returns {Promise<Object>} Server health status
 */
export const healthCheck = async () => {
  try {
    console.log('🔍 Testing connection to:', `${API_BASE_URL}/health`);
    
    const response = await api.get('/health', {
      timeout: 15000, // 15 seconds timeout for health check
    });
    
    console.log('💚 Health check successful:', response.data);
    return {
      success: true,
      data: response.data,
      url: `${API_BASE_URL}/health`
    };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    let errorMessage = 'Connection test failed. ';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage += 'Server is taking too long to respond. It might be starting up.';
    } else if (error.response) {
      errorMessage += `Server responded with status ${error.response.status}.`;
    } else if (error.request) {
      errorMessage += 'Cannot reach the server. Please check if the backend is running.';
    } else {
      errorMessage += error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      url: `${API_BASE_URL}/health`
    };
  }
};

/**
 * Test backend connection with detailed diagnostics
 * @returns {Promise<Object>} Connection test results
 */
export const testBackendConnection = async () => {
  console.log('🧪 Running comprehensive backend connection test...');
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment:', process.env.NODE_ENV);
  
  try {
    // First, try a simple ping
    const pingResponse = await api.get('/ping', { timeout: 10000 });
    console.log('📡 Ping successful:', pingResponse.data);
    
    // Then try the health check
    const healthResponse = await healthCheck();
    
    return {
      success: true,
      message: 'Backend connection successful!',
      details: {
        ping: pingResponse.data,
        health: healthResponse.data,
        url: API_BASE_URL
      }
    };
  } catch (error) {
    console.error('🚨 Connection test failed:', error);
    
    // Try just the health endpoint as fallback
    try {
      const healthResponse = await healthCheck();
      if (healthResponse.success) {
        return {
          success: true,
          message: 'Backend connection successful (health check only)!',
          details: {
            health: healthResponse.data,
            url: API_BASE_URL,
            note: 'Ping endpoint not available, but health check works'
          }
        };
      }
    } catch (healthError) {
      console.error('🚨 Health check also failed:', healthError);
    }
    
    return {
      success: false,
      message: 'Backend connection failed',
      error: error.message || 'Unknown error occurred',
      url: API_BASE_URL,
      suggestions: [
        'Check if the backend server is running',
        'Verify the API URL is correct',
        'Wait a moment if using free hosting (server might be sleeping)',
        'Check your internet connection'
      ]
    };
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