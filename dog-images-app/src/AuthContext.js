import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from './urls';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await axios.get(`${baseUrl}/api/auth/check`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setUser(data.user);
        } else {
          console.warn("No token found in localStorage");
        }
      } catch (error) {
        console.error('Error checking user:', error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access - redirecting to login.");
          setUser(null);
        }
      }
    };

    checkUser();
  }, []);

  const login = async (credentialsOrToken, token = null) => {
    try {
      if (token) {
        // OAuth Login
        localStorage.setItem('token', token);
        setUser(credentialsOrToken); // credentialsOrToken contains user info in this case
      } else {
        // Traditional email/password login
        const { data } = await axios.post(`${baseUrl}/api/auth/login`, credentialsOrToken);
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
