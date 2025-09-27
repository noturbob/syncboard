// src/components/Forgot/Forgot.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Forgot.module.css'; // Assuming you have a CSS module

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response.data.msg || 'An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.submitButton}>Send Reset Link</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Forgot;