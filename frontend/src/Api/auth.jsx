import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------
// Request Interceptor: Attach token
// -----------------------------
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------
// Response Interceptor: Auto refresh token on 401
// -----------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(`${API_URL}/api/auth/refresh-token`, {}, {
          withCredentials: true,
        });

        const newToken = refreshRes.data.token;
        localStorage.setItem('token', newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// -----------------------------
// Auth APIs
// -----------------------------
export const register = async (name, email, password) => {
  const res = await axiosInstance.post('/auth/register', { name, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axiosInstance.post('/auth/login', { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout');
  localStorage.removeItem('token');
  return res.data;
};

// -----------------------------
// Profile APIs
// -----------------------------

const getProfile = (token) => {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const updateProfile = async (data) => {
  const res = await axiosInstance.put('/profile', data);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axiosInstance.delete('/profile');
  localStorage.removeItem('token');
  return res.data;
};

// -----------------------------
// OCR APIs
// -----------------------------
export const uploadReceipt = async (file) => {
  if (!file) throw new Error('No file selected');
  const formData = new FormData();
  formData.append('receipt', file);

  const res = await axiosInstance.post('/ocr/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const getReceipts = async () => {
  const res = await axiosInstance.get('/ocr/receipts');
  return res.data;
};

// -----------------------------
// Transactions APIs
// -----------------------------
export const uploadTransaction = async (file) => {
  if (!file) throw new Error('No file selected');
  const formData = new FormData();
  formData.append('transaction', file);

  const res = await axiosInstance.post('/transactions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const getTransactions = async () => {
  const res = await axiosInstance.get('/transactions');
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await axiosInstance.post('/transactions', data);
  return res.data;
};

export const getSpendingStats = async (token) => {
  const res = await fetch(`${API_URL}/auth/monthly`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
;


// -----------------------------
// Export grouped APIs + axiosInstance
// -----------------------------
const auth = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
  uploadReceipt,
  getReceipts,
  uploadTransaction,
  getTransactions,
  createTransaction,
  getSpendingStats,
};

export default auth;
export { axiosInstance };
