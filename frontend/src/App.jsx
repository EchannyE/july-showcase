import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded pages
const Home = lazy(() => import('./Pages/Home'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const Profile = lazy(() => import('./Pages/Profile'));
const OcrUploader = lazy(() => import('./Pages/OcrUploader'));
const ReceiptList = lazy(() => import('./Pages/ReceiptList'));
const Login = lazy(() => import('./Pages/Login'));
const SignUp = lazy(() => import('./Pages/SignUp'));

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { darkMode } = useTheme();

  useEffect(() => {
    document.body.className = darkMode ? 'bg-gray-950 text-white' : 'bg-white text-black';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      <Helmet>
        <title>Receipt OCR App</title>
      </Helmet>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/upload-receipt' element={<OcrUploader />} />
          <Route path='/receipts' element={<ReceiptList />} />

          {/* Protected route */}
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* 404 fallback */}
          <Route path="*" element={<div className="p-10 text-center text-2xl">404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
      <Footer />
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
