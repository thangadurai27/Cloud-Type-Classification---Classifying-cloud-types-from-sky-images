import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-cloud-900/80 backdrop-blur-md border-t border-sky-100 dark:border-cloud-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-cloud-800 dark:text-cloud-200 mb-2">
              Cloud Type Classification
            </h3>
            <p className="text-cloud-600 dark:text-cloud-400 text-sm">
              AI-powered cloud type detection using CNN models trained on meteorological data.
            </p>
          </div>

          {/* Resources & Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-cloud-800 dark:text-cloud-200 mb-2">
              Resources & Links
            </h3>
            <div className="flex justify-center space-x-4">
              <motion.a
                href="https://github.com/thangadurai27/Cloud-Type-Classification---Classifying-cloud-types-from-sky-images"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cloud-600 dark:text-cloud-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </motion.a>
              <motion.a
                href="https://www.kaggle.com/datasets/nakendraprasathk/cloud-image-classification-dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cloud-600 dark:text-cloud-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Dataset</span>
              </motion.a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-cloud-500 dark:text-cloud-500">
              © 2025 Cloud Type Classification. All rights reserved.
            </p>
            <p className="text-xs text-cloud-500 dark:text-cloud-500 mt-1">
              AI-powered meteorological analysis
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-sky-100 dark:border-cloud-700">
          <div className="text-center text-xs text-cloud-500 dark:text-cloud-500">
            <p>
              Powered by React, TailwindCSS, and advanced CNN models. 
              Dataset courtesy of{' '}
              <a 
                href="https://www.kaggle.com/datasets/nakendraprasathk/cloud-image-classification-dataset" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                Nakendra Prasath K
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;