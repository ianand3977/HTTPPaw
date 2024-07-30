import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from './urls'; // Import baseUrl

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
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/login`, credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
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
