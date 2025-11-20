import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Clock, 
  Eye, 
  Trash2,
  Calendar,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('cloudHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('cloudHistory');
    setHistory([]);
  };

  const deleteItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('cloudHistory', JSON.stringify(updatedHistory));
  };

  const cloudTypes = [...new Set(history.map(item => item.cloudType))];
  
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.cloudType === filter);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  };

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-cloud-900 dark:text-white mb-4 flex items-center">
                <HistoryIcon className="h-12 w-12 mr-4 text-sky-500" />
                Classification History
              </h1>
              <p className="text-lg text-cloud-600 dark:text-cloud-300">
                View your previous cloud type classifications and results
              </p>
            </div>
            
            {history.length > 0 && (
              <motion.button
                onClick={clearHistory}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="h-5 w-5" />
                <span className="hidden sm:inline">Clear All</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {history.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-8 w-8 text-sky-500" />
                  <div>
                    <p className="text-2xl font-bold text-cloud-900 dark:text-white">
                      {history.length}
                    </p>
                    <p className="text-sm text-cloud-600 dark:text-cloud-400">
                      Total Classifications
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-cloud-900 dark:text-white">
                      {Math.round(history.reduce((acc, item) => acc + item.confidence, 0) / history.length)}%
                    </p>
                    <p className="text-sm text-cloud-600 dark:text-cloud-400">
                      Avg. Confidence
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-cloud-900 dark:text-white">
                      {new Set(history.map(item => new Date(item.timestamp).toDateString())).size}
                    </p>
                    <p className="text-sm text-cloud-600 dark:text-cloud-400">
                      Days Active
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-cloud-900 dark:text-white">
                      {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-cloud-600 dark:text-cloud-400">
                      Last Classification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter */}
        {history.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-sky-500 text-white'
                    : 'bg-white dark:bg-cloud-800 text-cloud-700 dark:text-cloud-300 border border-sky-200 dark:border-cloud-600 hover:border-sky-400 dark:hover:border-sky-500'
                }`}
              >
                All ({history.length})
              </button>
              {cloudTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === type
                      ? 'bg-sky-500 text-white'
                      : 'bg-white dark:bg-cloud-800 text-cloud-700 dark:text-cloud-300 border border-sky-200 dark:border-cloud-600 hover:border-sky-400 dark:hover:border-sky-500'
                  }`}
                >
                  {type} ({history.filter(item => item.cloudType === type).length})
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* History Grid */}
        {filteredHistory.length > 0 ? (
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-white dark:bg-cloud-800 rounded-2xl overflow-hidden shadow-lg border border-sky-100 dark:border-cloud-700 hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100 dark:bg-cloud-700">
                      <img
                        src={item.image}
                        alt={`${item.cloudType} classification`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence}%
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-lg text-sm backdrop-blur-sm">
                        {item.cloudType}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-cloud-900 dark:text-white">
                          {item.filename}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedImage(item)}
                            className="p-1 text-cloud-500 hover:text-sky-500 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 text-cloud-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-cloud-600 dark:text-cloud-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-16">
            <div className="max-w-md mx-auto">
              <HistoryIcon className="h-24 w-24 text-cloud-300 dark:text-cloud-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-cloud-900 dark:text-white mb-4">
                {filter === 'all' ? 'No Classifications Yet' : `No ${filter} Classifications`}
              </h3>
              <p className="text-cloud-600 dark:text-cloud-400 mb-8">
                {filter === 'all' 
                  ? 'Start by uploading and analyzing your first sky image to see results here.'
                  : `You haven't classified any ${filter} clouds yet. Try analyzing more images!`
                }
              </p>
              <motion.button
                onClick={() => window.location.href = '/upload'}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Upload First Image</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="bg-white dark:bg-cloud-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-cloud-900 dark:text-white">
                    Classification Details
                  </h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-cloud-500 hover:text-cloud-700 dark:hover:text-cloud-300"
                  >
                    ×
                  </button>
                </div>
                
                <img
                  src={selectedImage.image}
                  alt={selectedImage.cloudType}
                  className="w-full h-64 object-cover rounded-2xl mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-cloud-600 dark:text-cloud-400">Cloud Type:</span>
                    <span className="font-semibold text-cloud-900 dark:text-white">
                      {selectedImage.cloudType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cloud-600 dark:text-cloud-400">Confidence:</span>
                    <span className={`font-semibold ${getConfidenceColor(selectedImage.confidence)}`}>
                      {selectedImage.confidence}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cloud-600 dark:text-cloud-400">Filename:</span>
                    <span className="font-semibold text-cloud-900 dark:text-white">
                      {selectedImage.filename}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cloud-600 dark:text-cloud-400">Date:</span>
                    <span className="font-semibold text-cloud-900 dark:text-white">
                      {new Date(selectedImage.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default History;