import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './LoginPage.css';  // Import the CSS file for styling
import { baseUrl } from '../urls'; // Import baseUrl

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      login({ email, password }, data.token); // Pass user and token to login function
      navigate('/search');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="login-button">Login</button>
          <div>
            <a href="/">Forgot password</a>
            <br />
            <p>New User? <a href="/signup">Register Now</a></p>
          </div>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
