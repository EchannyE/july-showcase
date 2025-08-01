import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// This component serves as the application's footer, providing copyright information,
// navigation links, and social media icons.
const Footer = () => {
  // Use the theme hook to adapt to dark mode
  const { darkMode } = useTheme();

  // Function to smoothly scroll to the top of the page
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`py-6 px-4 md:px-8 font-inter shadow-inner transition-colors duration-300 
        ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Copyright and brand section */}
        <button 
          onClick={handleScrollTop} 
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          © {new Date().getFullYear()} AI Financial Assistant. All rights reserved.
        </button>

        {/* Navigation and social media links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
          {/* Navigation links */}
          <div className="flex space-x-4">
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
            <Link to="/upload-receipt" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Upload</Link>
            <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Profile</Link>
            <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
          </div>
          
          {/* Social media icons */}
          <div className="flex space-x-4 text-gray-500 dark:text-gray-400">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;