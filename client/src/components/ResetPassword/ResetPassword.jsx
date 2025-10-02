import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:4000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center">
        <h2 className="mb-6 text-3xl font-bold text-accent">Set New Password</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-subtle">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mb-6 text-left">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-subtle">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Update Password
          </button>
        </form>
        {message && <p className="mt-4 p-2 text-sm text-green-400 bg-green-900/50 rounded">{message}</p>}
        {error && <p className="mt-4 p-2 text-sm text-red-400 bg-red-900/50 rounded">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;