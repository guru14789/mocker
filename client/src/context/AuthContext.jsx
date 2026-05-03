import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '../config/firebase';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // identifier = username OR email
  const login = async (identifier, password) => {
    const res = await axios.post(`${API}/auth/login`, { identifier, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  // signup sends all new fields; registration response does NOT auto-login
  // (user must verify email first)
  const signup = async (userData) => {
    const res = await axios.post(`${API}/auth/register`, userData);
    // No token stored — account pending verification
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const loginWithGoogle = async (role) => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const userEmail = result.user.email;
      const userName  = result.user.displayName;

      const res = await axios.post(`${API}/auth/google`, {
        email: userEmail,
        name: userName,
        role: role,
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  };

  const resendVerification = async (email) => {
    const res = await axios.post(`${API}/auth/resend-verification`, { email });
    return res.data;
  };

  const switchRole = async (newRole) => {
    try {
      const res = await axios.post(`${API}/auth/update-role`, { role: newRole });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
      setUser({ ...user, role: newRole });
      return true;
    } catch (err) {
      console.error('Failed to switch role:', err);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.post(`${API}/auth/update-profile`, profileData);
      setUser({ ...user, profileCompleted: true });
      return res.data;
    } catch (err) {
      console.error('updateProfile error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, resendVerification, switchRole, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
