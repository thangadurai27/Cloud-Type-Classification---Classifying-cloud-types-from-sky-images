import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload as UploadIcon, 
  Image, 
  X, 
  Camera,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictCloudType } from '../services/api';

const Upload = ({ setPredictionResult }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      // Simple health check to backend
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/health`, { method: 'GET' });
      if (response.ok) {
        setConnectionStatus('connected');
        setError(null);
      } else {
        setConnectionStatus('failed');
        setError(`Backend responded with status ${response.status}`);
      }
    } catch (err) {
      setConnectionStatus('failed');
      setError('Cannot connect to backend. Please ensure it\'s running on the configured URL.');
    }
  };

  const handlePrediction = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await predictCloudType(selectedFile);
      setPredictionResult({
        ...result,
        image: preview,
        filename: selectedFile.name
      });
      navigate('/results');
    } catch (err) {
      console.error('Upload prediction error:', err);
      setError(err.message || 'Failed to classify cloud type. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cloud-900 dark:text-white mb-4">
            Upload Sky Image
          </h1>
          <p className="text-lg text-cloud-600 dark:text-cloud-300 max-w-2xl mx-auto">
            Select a clear sky image with visible clouds for accurate classification. 
            Our AI will analyze the cloud patterns and identify the cloud type.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div variants={itemVariants} className="mb-8">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
              isDragActive || dragActive
                ? 'border-sky-400 bg-sky-50 dark:bg-cloud-800 scale-105'
                : selectedFile
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-sky-200 dark:border-cloud-600 bg-white/50 dark:bg-cloud-800/50 hover:border-sky-300 dark:hover:border-cloud-500 hover:bg-sky-50 dark:hover:bg-cloud-800'
            }`}
          >
            <input {...getInputProps()} />
            
            {!selectedFile ? (
              <div className="space-y-6">
                <motion.div
                  className="flex justify-center"
                  animate={{ y: isDragActive ? -10 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <UploadIcon className={`h-16 w-16 ${
                    isDragActive ? 'text-sky-500' : 'text-cloud-400 dark:text-cloud-500'
                  }`} />
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cloud-900 dark:text-white mb-2">
                    {isDragActive ? 'Drop your image here' : 'Drag & drop your sky image'}
                  </h3>
                  <p className="text-cloud-600 dark:text-cloud-400 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-cloud-500 dark:text-cloud-500">
                    Supports: JPG, PNG, GIF (max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                    Image Selected
                  </h3>
                  <p className="text-cloud-600 dark:text-cloud-400">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-cloud-500 dark:text-cloud-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Image Preview */}
        {preview && (
          <motion.div
            variants={itemVariants}
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-6 shadow-lg border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Preview
                </h3>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-cloud-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-2xl shadow-md"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  <Camera className="h-4 w-4 inline mr-1" />
                  Ready for analysis
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connection Status */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {connectionStatus === 'testing' ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>
                {connectionStatus === 'testing' ? 'Testing...' : 'Test Backend Connection'}
              </span>
            </button>
            {connectionStatus === 'connected' && (
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ Backend connected
              </span>
            )}
            {connectionStatus === 'failed' && (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                ✗ Connection failed
              </span>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                    API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          {selectedFile && !isLoading && (
            <motion.button
              onClick={handlePrediction}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="h-6 w-6" />
              <span>Detect Cloud Type</span>
            </motion.button>
          )}

          {isLoading && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="large" />
              <div className="text-center">
                <p className="text-lg font-semibold text-cloud-900 dark:text-white mb-2">
                  Analyzing Image...
                </p>
                <p className="text-cloud-600 dark:text-cloud-400">
                  Our AI is examining cloud patterns and characteristics
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-sky-50 dark:bg-cloud-800 rounded-3xl p-8 border border-sky-100 dark:border-cloud-700">
            <h3 className="text-lg font-semibold text-cloud-900 dark:text-white mb-4 text-center">
              Tips for Better Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Use images with clear, visible clouds',
                'Ensure good lighting and contrast',
                'Avoid images with heavy filters or editing',
                'Include sufficient sky area in the frame'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-cloud-700 dark:text-cloud-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Upload;