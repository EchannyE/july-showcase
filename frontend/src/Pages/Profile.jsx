import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TransactionsTable from '../components/TransactionsTable';
import SpendingChart from '../Pages/SpendingChart'; // Assumed component path
import useAuth from '../context/useAuth';
import auth, { getSpendingStats } from '../Api/auth';

const Profile = () => {
  // State for the profile form data, including the new phone field
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  // State to control whether the profile is in edit mode
  const [editMode, setEditMode] = useState(false);
  // State to store the user's transactions
  const [transactions, setTransactions] = useState([]);
  // State to store the user's spending stats for the chart
  const [stats, setStats] = useState([]);
  // State to handle and display error messages for the whole page
  const [error, setError] = useState('');
  // State to indicate if data is currently being loaded (initial fetch)
  const [loading, setLoading] = useState(true);
  // State to indicate if profile changes are currently being saved
  const [saving, setSaving] = useState(false);
  // State to display success messages after an action
  const [message, setMessage] = useState('');
  // State to control the visibility of the custom confirmation modal
  const [showModal, setShowModal] = useState(false);
  // State to store the action for the modal (e.g., 'logout', 'delete')
  const [modalAction, setModalAction] = useState(null);
  // New state to handle errors for the transaction data specifically
  const [transactionsError, setTransactionsError] = useState('');
  // New state to handle errors for the spending stats specifically
  const [statsError, setStatsError] = useState('');

  // Custom hook for authentication context, providing user and setUser
  const { user, setUser } = useAuth();
  // Hook from react-router-dom for programmatic navigation
  const navigate = useNavigate();

  // useCallback memoizes the fetchData function for performance and dependency management
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setTransactionsError('');
    setStatsError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return navigate('/login');
    }

    try {
      // First, fetch the user profile, as it is the most critical data
      const profileRes = await auth.getProfile(token);
      const userData = profileRes.data.user;
      if (setUser) {
        setUser(userData);
      }
      // Initialize form data with current user data, clearing password for security
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '',
      });

      // Now, fetch transactions and stats independently
      // This is the core change to prevent a single failure from blocking the whole page
      try {
        const txRes = await auth.getTransactions(token);
        setTransactions(txRes.data.transactions || []);
      } catch (txErr) {
        console.error('Error fetching transactions:', txErr);
        // Set a specific error for transactions
        setTransactionsError('Failed to load transaction data. Please try again.');
        // Set transactions to an empty array so nothing is displayed
        setTransactions([]);
      }

      try {
        const statsRes = await getSpendingStats(token);
        setStats(statsRes.data.monthlySpending || []);
      } catch (statsErr) {
        console.error('Error fetching spending stats:', statsErr);
        // Set a specific error for spending stats
        setStatsError('Failed to load spending analytics. Please try again.');
        // Set stats to an empty array
        setStats([]);
      }

    } catch (err) {
      console.error('Error fetching profile data:', err);
      // Check for 401 or 403 errors and redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        if (setUser) {
          setUser(null);
        }
        navigate('/login');
        setError('Your session has expired. Please log in again.');
        return;
      }
          } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  // useEffect hook to call fetchData when the component mounts or its dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect to handle messages and errors, clearing them after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // Handler for form input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for saving profile changes
  const handleUpdate = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      setSaving(false);
      return navigate('/login');
    }
    
    // Construct payload: only include password if it's not empty
    const payload = form.password
      ? form
      : { name: form.name, email: form.email, phone: form.phone };

    try {
      const res = await auth.updateProfile(payload, token);
      if (setUser) {
        setUser(res.data.user);
      }
      setEditMode(false);
      setMessage('Profile updated successfully!');
      setForm((prev) => ({ ...prev, password: '' })); // Clear password field on success
    } catch (err) {
      console.error('Error updating profile:', err);
      // Check for 401 or 403 errors and redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        if (setUser) {
          setUser(null);
        }
        navigate('/login');
        setError('Your session has expired. Please log in again.');
        return;
      }
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handler for deleting the user's account
  const handleDeleteAccount = async () => {
    try {
      await auth.deleteAccount(localStorage.getItem('token'));
      localStorage.removeItem('token');
      if (setUser) {
        setUser(null);
      }
      navigate('/signup');
    } catch (err) {
      console.error('Account deletion failed:', err);
      const errorMessage = err.response?.data?.message || 'Account deletion failed. Please try again.';
      setError(errorMessage);
    }
    setShowModal(false); // Close the modal
  };

  // Handler for user logout
  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error('Logout failed, forcing redirect:', err);
    }
    // Always clear token and redirect regardless of server response
    localStorage.removeItem('token');
    if (setUser) {
      setUser(null);
    }
    navigate('/login');
    setShowModal(false); // Close the modal
  };
  
  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Conditional rendering for error state
  if (error && !user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
        <p className="font-semibold mb-2">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchData} // Allow user to retry fetching data
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-inter">
      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">
              {modalAction === 'logout' ? 'Confirm Logout' : 'Confirm Deletion'}
            </h3>
            <p className="mb-6 text-gray-700">
              {modalAction === 'logout'
                ? 'Are you sure you want to log out?'
                : 'Are you sure you want to delete your account? This action cannot be undone.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={modalAction === 'logout' ? handleLogout : handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
              >
                {modalAction === 'logout' ? 'Logout' : 'Delete'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header section with Welcome message and main actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          Welcome, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
          <Link
            to="/upload-receipt"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Upload New Receipt
          </Link>
          <button
            onClick={() => { setShowModal(true); setModalAction('logout'); }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success/Error message display */}
      {(message || error) && (
        <div className={`px-4 py-3 rounded-lg relative mb-6 shadow-sm ${message ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
          <span className="block sm:inline">{message || error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Details and Edit Form Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-md transition duration-200 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-md transition duration-200 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-md transition duration-200 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 rounded-md transition duration-200 text-gray-900" />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset form to the current user's data when cancelling an edit
                    setForm({
                      name: user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      password: ''
                    });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-800 space-y-4">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => { setShowModal(true); setModalAction('delete'); }}
                  className="bg-red-100 text-red-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-200 transition duration-300 ease-in-out"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Spending Analytics Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Spending Analytics</h2>
          {statsError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{statsError}</p>
            </div>
          ) : stats.length > 0 ? (
            <SpendingChart data={stats} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">No spending data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions History Section */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
        {transactionsError ? (
          <div className="text-center py-8">
            <p className="text-red-500">{transactionsError}</p>
          </div>
        ) : transactions.length > 0 ? (
          <TransactionsTable transactions={transactions} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">No transactions available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
