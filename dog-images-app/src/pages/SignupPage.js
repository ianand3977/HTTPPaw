import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';  // Import the CSS file for styling
import { baseUrl } from '../urls'; // Import baseUrl

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/auth/signup`, { email, password });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('User already exists. Try with another email ID.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Create Your Account</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">Signup</button>
        </form>
        {error && <p className="signup-error">{error}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
