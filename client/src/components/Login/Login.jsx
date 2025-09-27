import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
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
      
      // Save the token to browser's local storage
      localStorage.setItem('token', res.data.token);
      
      // Redirect to the home page
      navigate('/home');

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>Login</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <p>
          <a href="/forgot">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;