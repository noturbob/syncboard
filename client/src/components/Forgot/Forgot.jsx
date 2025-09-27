import React from "react";
import styles from './Forgot.module.css';

const Login = () => {
    return(
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2>Recover Account</h2>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required />
                    </div>
                    <button type="submit" className={styles.submitButton}>Send OTP</button>
                </form>
                <p>
                    Don't have an accounut? <a href="../Signup/">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;