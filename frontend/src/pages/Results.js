import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Clock,
  TrendingUp,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Results = ({ predictionResult }) => {
  const navigate = useNavigate();

  const saveToHistory = useCallback(() => {
    if (!predictionResult) return;
    
    const historyItem = {
      id: Date.now(),
      cloudType: predictionResult.cloudType,
      confidence: predictionResult.confidence,
      timestamp: new Date().toISOString(),
      image: predictionResult.image,
      filename: predictionResult.filename
    };

    const existingHistory = JSON.parse(localStorage.getItem('cloudHistory') || '[]');
    const updatedHistory = [historyItem, ...existingHistory.slice(0, 19)]; // Keep last 20
    localStorage.setItem('cloudHistory', JSON.stringify(updatedHistory));
  }, [predictionResult]);

  useEffect(() => {
    if (!predictionResult) {
      // Redirect to upload if no result is available
      navigate('/upload');
    } else {
      // Save to history when component mounts with valid data
      saveToHistory();
    }
  }, [predictionResult, navigate, saveToHistory]);

  if (!predictionResult) {
    return null;
  }

  // Cloud type descriptions
  const cloudDescriptions = {
    'Cumulus': {
      description: 'Puffy, cotton-like clouds that develop vertically. Often associated with fair weather.',
      significance: 'Indicates stable atmospheric conditions with light winds.',
      examples: 'Fair weather cumulus, towering cumulus',
      icon: '☁️'
    },
    'Cumulonimbus': {
      description: 'Towering clouds that can reach extreme heights. Associated with thunderstorms.',
      significance: 'Indicates severe weather potential including lightning, heavy rain, and strong winds.',
      examples: 'Thunderstorm clouds, anvil clouds',
      icon: '⛈️'
    },
    'Stratus': {
      description: 'Low, flat, gray clouds that often cover the entire sky like a blanket.',
      significance: 'Often produces light rain or drizzle. Associated with stable, overcast conditions.',
      examples: 'Fog, mist, overcast skies',
      icon: '🌫️'
    },
    'Cirrus': {
      description: 'High, thin, wispy clouds made of ice crystals. Often appear feathery.',
      significance: 'Usually indicates fair weather but can signal approaching weather changes.',
      examples: 'Mare\'s tails, ice crystal clouds',
      icon: '🌤️'
    },
    'Altocumulus': {
      description: 'Mid-level clouds that appear as gray or white patches or layers.',
      significance: 'May indicate thunderstorms later in the day during warm weather.',
      examples: 'Lenticular clouds, mackerel skies',
      icon: '⛅'
    },
    'Altostratus': {
      description: 'Mid-level, gray or blue-gray sheets or layers of clouds.',
      significance: 'Often precedes storms with continuous rain or snow.',
      examples: 'Thin overcast, sun may be visible as dim disk',
      icon: '☁️'
    },
    'Stratocumulus': {
      description: 'Low, lumpy gray or white patches or layers of clouds.',
      significance: 'Rarely produces rain but indicates stable weather conditions.',
      examples: 'Broken clouds, cloud patches',
      icon: '⛅'
    },
    'Nimbostratus': {
      description: 'Dark, low-level clouds that produce continuous rain or snow.',
      significance: 'Associated with steady precipitation and overcast skies.',
      examples: 'Rain clouds, snow clouds',
      icon: '🌧️'
    },
    'Cirrostratus': {
      description: 'Thin, sheet-like high clouds that often cover the entire sky.',
      significance: 'Often precedes warm fronts and indicates approaching weather changes.',
      examples: 'Halo clouds, thin overcast',
      icon: '🌫️'
    },
    'Cirrocumulus': {
      description: 'Small, white patches of clouds arranged in rows at high altitudes.',
      significance: 'Indicates fair but cold weather. Rarely produces precipitation.',
      examples: 'Mackerel skies, rippled clouds',
      icon: '☁️'
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle className="h-5 w-5" />;
    if (confidence >= 60) return <Info className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const cloudInfo = cloudDescriptions[predictionResult.cloudType] || cloudDescriptions['Cumulus'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center space-x-2 text-cloud-600 dark:text-cloud-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Upload</span>
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-cloud-900 dark:text-white mb-4">
            Classification Results
          </h1>
          <p className="text-lg text-cloud-600 dark:text-cloud-300">
            Here's what our AI detected in your sky image
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Display */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-6 shadow-lg border border-sky-100 dark:border-cloud-700">
              <h2 className="text-xl font-semibold text-cloud-900 dark:text-white mb-4">
                Analyzed Image
              </h2>
              <div className="relative">
                <img
                  src={predictionResult.image}
                  alt="Analyzed sky"
                  className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-md"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {predictionResult.filename}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-cloud-800 dark:to-cloud-900 rounded-3xl p-8 border border-sky-200 dark:border-cloud-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{cloudInfo.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-cloud-900 dark:text-white mb-2">
                  {predictionResult.cloudType}
                </h2>
                <div className={`inline-flex items-center space-x-2 ${getConfidenceColor(predictionResult.confidence)}`}>
                  {getConfidenceIcon(predictionResult.confidence)}
                  <span className="text-xl font-semibold">
                    {predictionResult.confidence}% Confidence
                  </span>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-cloud-700/50 rounded-2xl p-4">
                <p className="text-cloud-700 dark:text-cloud-300 text-center">
                  {cloudInfo.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                className="flex items-center justify-center space-x-2 bg-white dark:bg-cloud-800 text-cloud-700 dark:text-cloud-300 font-semibold py-3 px-4 rounded-xl border border-sky-200 dark:border-cloud-600 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-5 w-5" />
                <span>Save Result</span>
              </motion.button>
              
              <motion.button
                className="flex items-center justify-center space-x-2 bg-white dark:bg-cloud-800 text-cloud-700 dark:text-cloud-300 font-semibold py-3 px-4 rounded-xl border border-sky-200 dark:border-cloud-600 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Detailed Information */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather Significance */}
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-6 shadow-lg border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-sky-500" />
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white">
                  Weather Significance
                </h3>
              </div>
              <p className="text-cloud-600 dark:text-cloud-400">
                {cloudInfo.significance}
              </p>
            </div>

            {/* Examples */}
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-6 shadow-lg border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="h-6 w-6 text-sky-500" />
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white">
                  Common Examples
                </h3>
              </div>
              <p className="text-cloud-600 dark:text-cloud-400">
                {cloudInfo.examples}
              </p>
            </div>

            {/* Analysis Time */}
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-6 shadow-lg border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-sky-500" />
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white">
                  Analysis Details
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-cloud-600 dark:text-cloud-400 text-sm">
                  Processed: {new Date().toLocaleString()}
                </p>
                <p className="text-cloud-600 dark:text-cloud-400 text-sm">
                  Model: CNN v2.1
                </p>
                <p className="text-cloud-600 dark:text-cloud-400 text-sm">
                  Processing time: ~2.3s
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Try Another */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <motion.button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Analyze Another Image</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;