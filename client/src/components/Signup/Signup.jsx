import React, { useState } from 'react';
import axios from 'axios';
import styles from './Signup.module.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newUser = {
        name,
        email,
        password,
      };

      const res = await axios.post('http://localhost:4000/api/auth/signup', newUser);
      
      console.log(res.data);
      alert('Signup successful! Please log in.');
      
    } catch (err) {
      if (err.response) {
        // The server responded with an error (e.g., "User already exists")
        console.error(err.response.data);
        alert('Error: ' + err.response.data.msg);
      } else if (err.request) {
        // The request was made but no response was received
        console.error(err.request);
        alert('Error: No response from server. Please try again later.');
      } else {
        // Something else happened while setting up the request
        console.error('Error', err.message);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Sign Up</h2>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={name} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={onChange} required minLength="6" />
          </div>
          <button type="submit" className={styles.submitButton}>Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;