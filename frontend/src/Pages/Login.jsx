import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../Api/auth';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/profile', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);

    }
    const data = await login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    toast.success('Login successful!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aiPrimary dark:bg-aiPrimary-dark text-aiText dark:text-aiText-dark transition-colors">
      <div className="max-w-md w-full p-8 bg-white  rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-aiAccent">Login to Financial Assistant</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded bg-gray-100 dark:bg-gray-800 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 rounded bg-gray-100 dark:bg-gray-800 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-aiAccent text-white py-3 rounded hover:bg-aiAccent-dark transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-center mt-6 text-aiText">
            Don't have an account?{' '}
            <Link to="/signup" className="text-aiAccent hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
