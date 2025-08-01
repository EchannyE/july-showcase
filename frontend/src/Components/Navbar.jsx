import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// This component provides the navigation bar for the application.
// It includes links to different pages and a theme toggle for dark mode.
const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // A variant for the motion.div to animate the mobile menu
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`p-4 shadow-xl font-inter transition-colors duration-300 
        ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo and App Name */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          AI Financial Assistant
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            About
          </Link>
          <Link 
            to="/upload-receipt" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Upload
          </Link>
          <Link 
            to="/receipts" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Receipts
          </Link>
          <Link 
            to="/profile" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Profile
          </Link>
          <Link 
            to="/contact" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Contact
          </Link>

          {/* Theme Toggle Button for desktop */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                      hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col items-center space-y-4 pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
          <Link 
            to="/" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/upload-receipt" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Upload
          </Link>
          <Link 
            to="/receipts" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Receipts
          </Link>
          <Link 
            to="/profile" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link 
            to="/contact" 
            className="w-full text-center py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
