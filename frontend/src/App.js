import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import History from './pages/History';
import About from './pages/About';
import Results from './pages/Results';
import CloudBackground from './components/CloudBackground';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 dark:from-cloud-900 dark:to-cloud-800 transition-colors duration-300`}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CloudBackground />
        <div className="relative z-10">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/upload" 
                element={
                  <Upload 
                    setPredictionResult={setPredictionResult} 
                  />
                } 
              />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route 
                path="/results" 
                element={
                  <Results 
                    predictionResult={predictionResult} 
                  />
                } 
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;