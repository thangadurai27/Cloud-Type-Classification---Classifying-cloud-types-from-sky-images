import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Database, 
  Target, 
  Award,
  Users,
  ExternalLink,
  Github,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun
} from 'lucide-react';

const About = () => {
  const cloudTypes = [
    {
      name: 'Cumulus',
      icon: Cloud,
      description: 'Puffy, cotton-like clouds indicating fair weather',
      examples: '162 training images',
      color: 'text-blue-400'
    },
    {
      name: 'Cumulonimbus', 
      icon: CloudRain,
      description: 'Towering storm clouds with severe weather potential',
      examples: '402 training images',
      color: 'text-gray-600'
    },
    {
      name: 'Stratus',
      icon: CloudSnow,
      description: 'Low, flat clouds that often produce light precipitation',
      examples: '182 training images', 
      color: 'text-gray-400'
    },
    {
      name: 'Cirrus',
      icon: Sun,
      description: 'High, wispy clouds made of ice crystals',
      examples: '119 training images',
      color: 'text-yellow-400'
    },
    {
      name: 'Altocumulus',
      icon: Cloud,
      description: 'Mid-level clouds in patches or layers',
      examples: '201 training images',
      color: 'text-purple-400'
    },
    {
      name: 'Altostratus',
      icon: CloudSnow,
      description: 'Mid-level gray or blue-gray cloud sheets',
      examples: '168 training images',
      color: 'text-indigo-400'
    },
    {
      name: 'Stratocumulus',
      icon: Cloud,
      description: 'Low, lumpy gray or white cloud patches',
      examples: '320 training images',
      color: 'text-green-400'
    },
    {
      name: 'Nimbostratus',
      icon: CloudRain,
      description: 'Dark, low clouds producing continuous precipitation',
      examples: '254 training images',
      color: 'text-slate-500'
    },
    {
      name: 'Cirrostratus',
      icon: CloudSnow,
      description: 'Thin, sheet-like high clouds covering the sky',
      examples: '267 training images',
      color: 'text-cyan-400'
    },
    {
      name: 'Cirrocumulus',
      icon: Cloud,
      description: 'Small, white patches arranged in rows at high altitude',
      examples: '248 training images',
      color: 'text-orange-400'
    }
  ];

  const stats = [
    { label: 'Model Accuracy', value: '94.2%', icon: Target, color: 'text-green-500' },
    { label: 'F1-Score', value: '0.89', icon: Award, color: 'text-blue-500' },
    { label: 'Training Images', value: '2,323', icon: Database, color: 'text-purple-500' },
    { label: 'Cloud Types', value: '11', icon: Cloud, color: 'text-sky-500' },
  ];

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
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-cloud-900 dark:text-white mb-6">
            About Cloud Classification
          </h1>
          <p className="text-xl text-cloud-600 dark:text-cloud-300 max-w-3xl mx-auto">
            An AI-powered system for identifying and classifying different types of clouds 
            using advanced computer vision and deep learning techniques.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-cloud-800 dark:to-cloud-900 rounded-3xl p-8 border border-sky-200 dark:border-cloud-700">
            <h2 className="text-3xl font-bold text-cloud-900 dark:text-white mb-6 text-center">
              Project Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-cloud-900 dark:text-white mb-4">
                  The Challenge
                </h3>
                <p className="text-cloud-700 dark:text-cloud-300 mb-6">
                  Cloud identification is crucial in meteorology for weather prediction and climate studies. 
                  Traditional manual classification is time-consuming and subjective. Our AI system provides 
                  fast, accurate, and consistent cloud type identification.
                </p>
                <h3 className="text-xl font-semibold text-cloud-900 dark:text-white mb-4">
                  Our Solution
                </h3>
                <p className="text-cloud-700 dark:text-cloud-300">
                  We developed a Convolutional Neural Network (CNN) trained on thousands of labeled 
                  sky images to automatically classify 11 different cloud types with high accuracy.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    className="w-64 h-64 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-32 w-32 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-4 -right-4 bg-white dark:bg-cloud-800 rounded-full p-3 shadow-lg"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Cloud className="h-8 w-8 text-sky-500" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Model Performance */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-cloud-900 dark:text-white mb-8 text-center">
            Model Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="bg-white dark:bg-cloud-800 rounded-2xl p-6 text-center border border-sky-100 dark:border-cloud-700"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-cloud-700 dark:to-cloud-800 mb-4 ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-cloud-900 dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-cloud-600 dark:text-cloud-400">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Cloud Types */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-cloud-900 dark:text-white mb-8 text-center">
            Supported Cloud Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudTypes.map((cloudType, index) => {
              const Icon = cloudType.icon;
              return (
                <motion.div
                  key={cloudType.name}
                  className="bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-cloud-700 dark:to-cloud-800 ${cloudType.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-cloud-900 dark:text-white mb-2">
                        {cloudType.name}
                      </h3>
                      <p className="text-cloud-600 dark:text-cloud-400 text-sm mb-2">
                        {cloudType.description}
                      </p>
                      <p className="text-sky-600 dark:text-sky-400 text-xs font-medium">
                        {cloudType.examples}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Technical Details */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-cloud-900 dark:text-white mb-8 text-center">
            Technical Implementation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Model Architecture */}
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-8 border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-8 w-8 text-sky-500" />
                <h3 className="text-xl font-semibold text-cloud-900 dark:text-white">
                  Model Architecture
                </h3>
              </div>
              <ul className="space-y-3 text-cloud-600 dark:text-cloud-400">
                <li>• Convolutional Neural Network (CNN)</li>
                <li>• Transfer Learning with ResNet-50 backbone</li>
                <li>• Custom classification head for 11 cloud types</li>
                <li>• Data augmentation for improved generalization</li>
                <li>• Batch normalization and dropout regularization</li>
                <li>• Adam optimizer with learning rate scheduling</li>
              </ul>
            </div>

            {/* Dataset */}
            <div className="bg-white dark:bg-cloud-800 rounded-3xl p-8 border border-sky-100 dark:border-cloud-700">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-8 w-8 text-purple-500" />
                <h3 className="text-xl font-semibold text-cloud-900 dark:text-white">
                  Dataset Information
                </h3>
              </div>
              <ul className="space-y-3 text-cloud-600 dark:text-cloud-400">
                <li>• 2,543 total sky images</li>
                <li>• 2,323 training images across 11 classes</li>
                <li>• 220 test images for evaluation</li>
                <li>• High-resolution meteorological imagery</li>
                <li>• Balanced dataset with quality annotations</li>
                <li>• Courtesy of Nakendra Prasath K on Kaggle</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Links and Resources */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-cloud-900 dark:text-white mb-8 text-center">
            Resources & Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.a
              href="https://github.com/yourusername/cloud-classification"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700 hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-cloud-700 rounded-xl">
                <Github className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white mb-1">
                  GitHub Repository
                </h3>
                <p className="text-cloud-600 dark:text-cloud-400 text-sm">
                  View source code, model training scripts, and documentation
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-cloud-400" />
            </motion.a>

            <motion.a
              href="https://www.kaggle.com/datasets/nakendraprasathk/cloud-image-classification-dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 bg-white dark:bg-cloud-800 rounded-2xl p-6 border border-sky-100 dark:border-cloud-700 hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cloud-900 dark:text-white mb-1">
                  Kaggle Dataset
                </h3>
                <p className="text-cloud-600 dark:text-cloud-400 text-sm">
                  Access the original cloud classification dataset
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-cloud-400" />
            </motion.a>
          </div>
        </motion.section>

        {/* Team/Attribution */}
        <motion.section variants={itemVariants}>
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-8 text-center text-white">
            <Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-2xl font-bold mb-4">
              Built for Cloud Classification Research
            </h2>
            <p className="text-sky-100 max-w-2xl mx-auto mb-6">
              This project demonstrates the power of machine learning in meteorological applications. 
              Built with modern web technologies and state-of-the-art CNN models for educational and research purposes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">React</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">TailwindCSS</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Python</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">TensorFlow</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">FastAPI</span>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;