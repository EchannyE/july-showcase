import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText, BarChart3, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Data for the FAQ section
const faqData = [
  { 
    question: 'What is AI Financial Assistant?', 
    answer: 'It helps you track and manage your expenses effortlessly with AI-powered receipt scanning and provides intelligent financial insights. It simplifies your financial life by automating tedious tasks.' 
  },
  { 
    question: 'How secure is my data?', 
    answer: 'Your data security is our top priority. All personal and financial data is encrypted at rest and in transit. You have full control over your account and can delete your data at any time.' 
  },
  { 
    question: 'How do I get started?', 
    answer: 'Getting started is simple! Just sign up, upload your first receipt, and let our AI handle the rest. You can immediately begin to see your expenses categorized and visualized.' 
  }
];

// The About component provides an overview of the application's features and answers common questions.
const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Memoized function to toggle the FAQ accordion, preventing unnecessary re-renders.
  const toggleFAQ = useCallback((index) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  return (
    <div className='min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 font-inter text-gray-800 dark:text-gray-200'>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className='max-w-4xl w-full text-center bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12'
      >
        {/* Main Header Section */}
        <h1 className='text-4xl font-extrabold mb-4 text-indigo-600 dark:text-indigo-400'>About AI Financial Assistant</h1>
        <p className='max-w-2xl mx-auto mb-12 text-lg text-gray-600 dark:text-gray-400'>
          Our mission is to simplify your finances with AI-powered receipt scanning, advanced expense tracking, and actionable insights. We eliminate manual stress, allowing you to take control of your financial goals effortlessly.
        </p>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-12'>
          <div className='flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105'>
            <ReceiptText size={50} className='text-indigo-500 mb-4' />
            <p className='text-xl font-bold text-gray-900 dark:text-white mb-2'>OCR Receipt Parsing</p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Automatically extract data from your receipts with powerful AI.</p>
          </div>
          <div className='flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105'>
            <BarChart3 size={50} className='text-indigo-500 mb-4' />
            <p className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Expense Tracking</p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Visualize and monitor your spending habits with clear charts and graphs.</p>
          </div>
          <div className='flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105'>
            <Brain size={50} className='text-indigo-500 mb-4' />
            <p className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Smart AI Insights</p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Get personalized recommendations to help you save money and reach goals.</p>
          </div>
        </div>

        {/* FAQs Section */}
        <div className='max-w-2xl w-full mx-auto text-left'>
          <h2 className='text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 text-center'>Frequently Asked Questions</h2>
          <div className='space-y-4'>
            {faqData.map((faq, index) => (
              <div key={index} className='bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600'>
                <button
                  onClick={() => toggleFAQ(index)}
                  className='flex justify-between items-center w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg'
                >
                  <h3 className='font-semibold text-lg text-gray-900 dark:text-white'>{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp size={24} className='text-indigo-500' />
                  ) : (
                    <ChevronDown size={24} className='text-indigo-500' />
                  )}
                </button>
                {openIndex === index && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    transition={{ duration: 0.3 }}
                    className='text-gray-600 dark:text-gray-400 text-sm mt-2 p-4 pt-0'
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-action or Navigation Button */}
        <div className='mt-12'>
          <Link 
            to='/' 
            className='px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300'
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
