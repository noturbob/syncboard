import React from "react";
import styles from './Login.module.css';

const Login = () => {
    return(
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2>Login</h2>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required/>
                    </div>
                    <button type="submit" className={styles.submitButton}>Login</button>
                </form>
                <p>
                    Don't have an accounut? <a href="../Signup/">Sign Up</a>
                </p>
                <p>
                    Forgot Password? <a href="../Forgot/">Change Password</a>
                </p>
            </div>
        </div>
    );
}

export default Login;