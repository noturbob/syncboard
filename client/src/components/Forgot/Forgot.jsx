import React, { useState } from 'react';
import axios from 'axios';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center">
        <h2 className="mb-2 text-3xl font-bold text-accent">Forgot Password</h2>
        <p className="mb-6 text-subtle">Enter your email to receive a password reset link.</p>
        <form onSubmit={onSubmit}>
          <div className="mb-6 text-left">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-subtle">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 p-2 text-sm text-green-400 bg-green-900/50 rounded">{message}</p>}
        {error && <p className="mt-4 p-2 text-sm text-red-400 bg-red-900/50 rounded">{error}</p>}
        <p className="mt-6 text-sm text-subtle">
          <a href="/login" className="text-accent hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default Forgot;