import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
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
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response.data.msg || 'An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Reset Password</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Update Password</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;