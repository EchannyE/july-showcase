import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// This component serves as the landing page or "Home" screen for the application.
// It features a visually engaging hero section with a call-to-action.
const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center relative p-4 font-inter  text-white">
      {/* Background image layer for a professional visual */}
      <img
        src="/hero-finance.png"
        alt="Background of a financial dashboard with AI icons"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-black/70"></div>
      
      {/* Hero content container with a focus on animation and readability */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-8 sm:p-12 text-center bg-white/5 dark:bg-black/20 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10 max-w-2xl mx-auto"
      >
        {/* Main heading of the application */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-indigo-200">
          Take Control of Your Finances with AI
        </h1>
        
        {/* Subtitle or descriptive paragraph */}
        <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 text-gray-300">
          Track your spending effortlessly with AI-powered receipt scanning and smart expense insights. 
          Upload receipts, monitor expenses, and manage your money confidently—all in one place.
        </p>

        {/* Action buttons with refined styles and hover effects */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 transition-colors duration-300 transform hover:scale-105"
          >
            Get Started Now
          </Link>

          <Link
            to="/about"
            className="px-8 py-3 bg-transparent border-2 border-indigo-400 text-indigo-200 font-bold rounded-full hover:bg-indigo-400 hover:text-white transition-colors duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
