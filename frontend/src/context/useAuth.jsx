// src/context/useAuth.js - Custom useAuth hook for Vite AI Financial Assistant

// src/context/useAuth.js - Correct export for Vite AI Financial Assistant

import { useContext } from 'react';
import AuthContext from './AuthContext'; // Ensure default export is used

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
