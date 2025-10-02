import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center">
        <h2 className="mb-6 text-3xl font-bold text-accent">
          Login
        </h2>
        <form onSubmit={onSubmit}>
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
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Login
          </button>
        </form>
        {error && <p className="mt-4 p-2 text-sm text-red-400 bg-red-900/50 rounded">{error}</p>}
        <p className="mt-6 text-sm text-subtle">
          Don't have an account? <a href="/signup" className="text-accent hover:underline">Sign Up</a>
        </p>
        <p className="mt-2 text-sm text-subtle">
          <a href="/forgot" className="text-accent hover:underline">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;