/**
 * AuthContext - Enhanced authentication context with Remember Me functionality
 * Manages user authentication state, token persistence, and session management
 * Supports both session-based and persistent authentication
 */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').replace(/\/$/, '');

const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const slugify = (value) => {
  if (!value) return null;
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || null;
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Storage utility functions for handling both localStorage and sessionStorage
   */
  const getStorageType = (rememberMe) => rememberMe ? localStorage : sessionStorage;
  
  const setAuthData = (token, user, rememberMe = false) => {
    const storage = getStorageType(rememberMe);
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('rememberMe', rememberMe.toString());
    
    // Clear data from the other storage type
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem('token');
    otherStorage.removeItem('user');
    otherStorage.removeItem('rememberMe');
  };

  const getAuthData = () => {
    // Check localStorage first (persistent), then sessionStorage
    let storage = localStorage;
    let token = storage.getItem('token');
    let user = storage.getItem('user');
    let rememberMe = storage.getItem('rememberMe') === 'true';

    if (!token) {
      storage = sessionStorage;
      token = storage.getItem('token');
      user = storage.getItem('user');
      rememberMe = false;
    }

    return { token, user, rememberMe, storage };
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('rememberMe');
  };

  /**
   * Check if user is logged in on app start
   * Handles both persistent and session-based authentication
   */
  useEffect(() => {
    const { token: storedToken, user: storedUser } = getAuthData();

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ User session restored from storage');
      } catch (error) {
        console.error('❌ Invalid stored auth data:', error);
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Enhanced login function with Remember Me support
   */
  const buildUserSlug = useCallback((targetUser = user) => {
    if (!targetUser) return null;
    const primary =
      targetUser.username ||
      [targetUser.firstname, targetUser.lastname].filter(Boolean).join(' ') ||
      targetUser.name ||
      (targetUser.email ? targetUser.email.split('@')[0] : '') ||
      (targetUser._id ? `user-${targetUser._id}` : 'user');
    return slugify(primary) || (targetUser._id ? targetUser._id.toString() : null);
  }, [user]);

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('🔐 Attempting login for:', email, rememberMe ? '(Remember Me enabled)' : '');
      
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Login response status:', response.status);

      if (response.ok) {
        console.log('✅ Login successful, storing auth data');
        setToken(data.token);
        setUser(data.user);
        setAuthData(data.token, data.user, rememberMe);

        return { success: true, user: data.user, token: data.token };
      } else {
        console.log('❌ Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log('💥 Login network error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  /**
   * Enhanced register function with Remember Me support
   */
  const register = async (username, email, password, firstname, lastname, rememberMe = false) => {
    try {
      console.log('📝 Attempting registration for:', { username, email, firstname, lastname });
      
      const response = await fetch(buildApiUrl('/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstname, lastname }),
      });

      const data = await response.json();
      console.log('📡 Registration response status:', response.status);

      if (response.ok) {
        console.log('✅ Registration successful');
        
        // Auto-login after successful registration if rememberMe is enabled
        if (rememberMe) {
          const loginResult = await login(email, password, rememberMe);
          if (loginResult.success) {
            return { success: true, message: 'Account created and logged in successfully!', user: loginResult.user };
          }
        }
        
        return { success: true, message: data.message };
      } else {
        console.log('❌ Registration failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log('💥 Registration network error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  /**
   * Enhanced logout function
   */
  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    clearAuthData();
    
    // Redirect to login page
    window.location.href = '/Login';
  };

  /**
   * Get user display name utility
   */
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.username) {
      return user.username;
    } else {
      return user.email || 'User';
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getUserDisplayName,
    getUserSlug: buildUserSlug,
    isAuthenticated: !!token,
    // Google Login: exchange Google ID token for backend JWT
    loginWithGoogleIdToken: async (idToken, rememberMe = true) => {
      try {
        if (!idToken) return { success: false, message: 'Missing Google ID token' };
        const response = await fetch('/api/oauth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
        });
        const data = await response.json();
        if (response.ok && data?.token && data?.user) {
          setToken(data.token);
          setUser(data.user);
          setAuthData(data.token, data.user, rememberMe);
          return { success: true, user: data.user, token: data.token };
        }
        return { success: false, message: data?.message || 'Google login failed' };
      } catch (e) {
        return { success: false, message: e.message || 'Google login error' };
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
