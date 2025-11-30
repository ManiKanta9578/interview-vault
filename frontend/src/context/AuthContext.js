"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { accessToken, username: userName, email } = response.data;
      
      setToken(accessToken);
      setUser({ username: userName, email });
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify({ username: userName, email }));
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password, fullName) => {
    try {
      const response = await authAPI.register({ 
        username, 
        email, 
        password, 
        fullName 
      });
      const { accessToken, username: userName, email: userEmail } = response.data;
      
      setToken(accessToken);
      setUser({ username: userName, email: userEmail });
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify({ username: userName, email: userEmail }));
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}