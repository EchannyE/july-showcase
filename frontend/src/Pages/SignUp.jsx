import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../Api/auth';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Signup successful! Please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aiPrimary dark:bg-aiPrimary-dark text-aiText dark:text-aiText-dark transition-colors">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-aiAccent">Sign Up for Financial Assistant</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-4 p-3 rounded bg-gray-100  outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded bg-gray-100  outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 rounded bg-gray-100 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-aiAccent text-white py-3 rounded hover:bg-aiAccent-dark transition"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="text-sm text-center mt-6 text-aiText">
            Already have an account?{' '}
            <Link to="/login" className="text-aiAccent hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
