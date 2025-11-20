import axios from 'axios';

// API base URL - detect environment and use appropriate URL
// Note: Create React App uses process.env, Vite uses import.meta.env
const getApiBaseUrl = () => {
  // Default to production URL for deployed app
  let baseUrl = 'https://cloud-type-classification-classifying.onrender.com';
  
  // Try to get from environment variables
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.REACT_APP_API_URL) {
      baseUrl = process.env.REACT_APP_API_URL;
    } else if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
      // Only use localhost in development if no env var is set
      baseUrl = 'http://localhost:8000';
    }
  }
  
  // Clean up URL - remove trailing slashes, backslashes, or extra characters
  baseUrl = baseUrl.replace(/[\/\\]+$/, '').trim();
  
  // Ensure it's a valid URL format
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = 'https://cloud-type-classification-classifying.onrender.com';
  }
  
  console.log('🔧 Environment detection:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    finalUrl: baseUrl
  });
  
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
 * Predict cloud type from uploaded image with comprehensive error handling
 * @param {File} imageFile - The image file to classify
 * @returns {Promise<Object>} Prediction result with cloud type and confidence
 */
export const predictCloudType = async (imageFile) => {
  try {
    console.log('🚀 Starting cloud type prediction...');
    
    // Validate file
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log('📁 File details:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
      type: imageFile.type,
      lastModified: new Date(imageFile.lastModified).toISOString()
    });

    // Check file type - be more permissive
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const hasValidType = allowedTypes.includes(imageFile.type) || 
                        imageFile.type.startsWith('image/') ||
                        imageFile.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
    
    if (!hasValidType) {
      throw new Error(`Invalid file type: ${imageFile.type}. Please upload a valid image file (JPG, PNG, GIF, etc.)`);
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      throw new Error(`File too large: ${(imageFile.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.`);
    }

    if (imageFile.size === 0) {
      throw new Error('File is empty. Please select a valid image file.');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', imageFile);

    console.log('🔄 Making prediction request to:', `${API_BASE_URL}/predict-cloud`);
    console.log('📤 FormData created with file:', imageFile.name);
    
    // Make API request with enhanced configuration
    const response = await api.post('/predict-cloud', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 90000, // 90 seconds for file upload
      withCredentials: false,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📈 Upload progress: ${progress}%`);
        }
      }
    });

    console.log('✅ Raw API response:', response);
    console.log('📊 Response data:', response.data);

    // Validate response structure
    if (!response.data) {
      throw new Error('No data received from server');
    }

    if (!response.data.success) {
      throw new Error(response.data.error || 'Server returned unsuccessful response');
    }

    const { 
      cloud_type, 
      confidence, 
      processing_time, 
      description,
      weather_significance,
      altitude,
      appearance,
      abbreviation,
      file_info,
      metadata
    } = response.data;

    if (!cloud_type || confidence === undefined) {
      throw new Error('Invalid prediction data received - missing cloud_type or confidence');
    }

    console.log(`🎯 Prediction successful: ${cloud_type} (${(confidence * 100).toFixed(1)}% confidence)`);

    return {
      success: true,
      cloudType: cloud_type,
      abbreviation: abbreviation || '',
      confidence: Math.round(confidence * 100), // Convert to percentage
      processingTime: processing_time || 0,
      description: description || '',
      weatherSignificance: weather_significance || '',
      altitude: altitude || '',
      appearance: appearance || '',
      timestamp: new Date().toISOString(),
      filename: imageFile.name,
      fileInfo: file_info || {},
      metadata: metadata || {}
    };

  } catch (error) {
    console.error('❌ Prediction error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    let errorMessage = 'Failed to classify cloud image. ';
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - The server took too long to respond. This may happen when the server is sleeping (free hosting). Please try again.';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      errorMessage = 'Network error - Please check your internet connection and try again.';
    } else if (error.code === 'ERR_CONNECTION_REFUSED') {
      if (API_BASE_URL.includes('localhost')) {
        errorMessage = `Cannot connect to localhost:8000. Make sure you're using the correct backend URL. For the deployed version, this should be the Render URL.`;
      } else {
        errorMessage = `Unable to connect to server at ${API_BASE_URL}. The server might be starting up - please wait a moment and try again.`;
      }
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const serverMessage = error.response.data?.detail || error.response.data?.message || error.response.data?.error;
      
      if (status === 400) {
        errorMessage = serverMessage || 'Invalid file or request. Please check your image file and try again.';
      } else if (status === 404) {
        errorMessage = 'API endpoint not found. Please check if the backend server is properly configured.';
      } else if (status === 413) {
        errorMessage = 'File too large. Please use an image smaller than 10MB.';
      } else if (status === 422) {
        errorMessage = 'Invalid file format or data. ' + (serverMessage || 'Please try a different image.');
      } else if (status >= 500) {
        errorMessage = 'Server error occurred. ' + (serverMessage || 'Please try again later.');
      } else {
        errorMessage = `Server error (${status}): ${serverMessage || 'Please try again.'}`;
      }
    } else if (error.message) {
      // Custom error message (from our validation)
      errorMessage = error.message;
    }
    
    console.error('🚨 Final error message:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error.message,
        code: error.code,
        status: error.response?.status,
        url: `${API_BASE_URL}/predict-cloud`
      }
    };
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