import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newUser = { name, email, password };
      await axios.post('/auth/signup', newUser);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center">
        <h2 className="mb-6 text-3xl font-bold text-accent">Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-subtle">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-subtle">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mb-6 text-left">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-subtle">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Sign Up
          </button>
        </form>
        {error && <p className="mt-4 p-2 text-sm text-red-400 bg-red-900/50 rounded">{error}</p>}
        <p className="mt-6 text-sm text-subtle">
          Already have an account? <a href="/login" className="text-accent hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;