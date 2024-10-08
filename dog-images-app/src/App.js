import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import ListingPage from './pages/ListingPage';
import ListDetailPage from './pages/ListDetailPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "963397881584-vrkmqtnt402thqdndi7vgp3th06pnpvl.apps.googleusercontent.com"; // Replace with your actual Client ID

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lists"
              element={
                <ProtectedRoute>
                  <ListingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lists/:id"
              element={
                <ProtectedRoute>
                  <ListDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
