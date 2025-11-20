import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Upload, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const cloudTypes = [
    { 
      icon: Cloud, 
      name: 'Cumulus', 
      description: 'Puffy, cotton-like clouds',
      color: 'text-sky-400'
    },
    { 
      icon: CloudRain, 
      name: 'Cumulonimbus', 
      description: 'Towering storm clouds',
      color: 'text-gray-600'
    },
    { 
      icon: CloudSnow, 
      name: 'Stratus', 
      description: 'Low, flat layer clouds',
      color: 'text-blue-400'
    },
    { 
      icon: Sun, 
      name: 'Cirrus', 
      description: 'High, wispy clouds',
      color: 'text-yellow-400'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-sky-100 dark:bg-cloud-800 text-sky-600 dark:text-sky-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Cloud Detection</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-cloud-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                Cloud Type
              </span>
              <br />
              Classification
            </h1>
            
            <p className="text-xl md:text-2xl text-cloud-600 dark:text-cloud-300 max-w-3xl mx-auto mb-12">
              Upload a sky image and discover cloud types using advanced AI technology. 
              Identify cumulus, stratus, cirrus, and more with high accuracy.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-16"
          >
            <motion.button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="h-6 w-6" />
              <span>Start Classification</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Cloud Types Preview */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cloud-900 dark:text-white mb-4">
              Detect Various Cloud Types
            </h2>
            <p className="text-lg text-cloud-600 dark:text-cloud-300 max-w-2xl mx-auto">
              Our AI model can identify and classify different types of clouds 
              based on their visual characteristics and meteorological patterns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cloudTypes.map((cloudType, index) => {
              const Icon = cloudType.icon;
              return (
                <motion.div
                  key={cloudType.name}
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-cloud-800/80 backdrop-blur-md rounded-2xl p-6 text-center border border-sky-100 dark:border-cloud-700 hover:border-sky-200 dark:hover:border-cloud-600 transition-all duration-300"
                  whileHover={{ 
                    y: -8, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                  }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-cloud-700 dark:to-cloud-800 mb-4 ${cloudType.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-cloud-900 dark:text-white mb-2">
                    {cloudType.name}
                  </h3>
                  <p className="text-sm text-cloud-600 dark:text-cloud-400">
                    {cloudType.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-50 to-sky-100 dark:from-cloud-900 dark:to-cloud-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cloud-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-cloud-600 dark:text-cloud-300 max-w-2xl mx-auto">
              Simple, fast, and accurate cloud classification in three easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Image',
                description: 'Select or drag & drop a sky image from your device',
                icon: Upload
              },
              {
                step: '2',
                title: 'AI Analysis',
                description: 'Our CNN model analyzes cloud patterns and characteristics',
                icon: Sparkles
              },
              {
                step: '3',
                title: 'Get Results',
                description: 'Receive detailed classification with confidence scores',
                icon: Cloud
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.step}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-2xl font-bold mb-6">
                    {feature.step}
                  </div>
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-sky-500 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-cloud-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-cloud-600 dark:text-cloud-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;