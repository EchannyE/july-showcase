import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// This component provides a contact form for users to send a message.
const Contact = () => {
  // State to manage the input values of the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // State to handle the form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !message) {
      toast.error('Please fill in all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a network request with a delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would make an API call here, e.g.:
      // await axios.post('/api/contact', { name, email, message });
      
      toast.success('Your message has been sent successfully!');
      
      // Reset form fields after successful submission
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 font-inter">
      {/* Toast container for showing notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <Mail size={40} className="mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white">Contact Us</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
          
          {/* Email Input */}
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />

          {/* Message Textarea */}
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ${
              isSubmitting ? 'bg-indigo-300 dark:bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
