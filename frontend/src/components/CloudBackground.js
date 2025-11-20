import React from 'react';
import { motion } from 'framer-motion';

const CloudBackground = () => {
  const clouds = [
    { id: 1, size: 'large', delay: 0, duration: 20 },
    { id: 2, size: 'medium', delay: 5, duration: 25 },
    { id: 3, size: 'small', delay: 10, duration: 30 },
    { id: 4, size: 'large', delay: 15, duration: 35 },
    { id: 5, size: 'medium', delay: 8, duration: 22 },
  ];

  const getCloudStyles = (size) => {
    switch (size) {
      case 'large':
        return 'w-32 h-16 opacity-20';
      case 'medium':
        return 'w-24 h-12 opacity-15';
      case 'small':
        return 'w-16 h-8 opacity-10';
      default:
        return 'w-24 h-12 opacity-15';
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className={`absolute bg-white dark:bg-cloud-200 rounded-full ${getCloudStyles(cloud.size)}`}
          initial={{ x: -200, y: Math.random() * window.innerHeight }}
          animate={{ 
            x: window.innerWidth + 200,
            y: Math.random() * window.innerHeight
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: 'blur(1px)',
          }}
        />
      ))}
      
      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50/30 to-transparent dark:from-cloud-900/30 pointer-events-none" />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-sky-300 dark:bg-cloud-600 rounded-full opacity-30"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 10 
          }}
          animate={{ 
            y: -10,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default CloudBackground;