import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string; password?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adgenius_token'));
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await apiClient.get<User>('/users/me');
      setUser(res.data);
    } catch (err) {
      // If auth token is invalid, clear token
      localStorage.removeItem('adgenius_token');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (newToken: string) => {
    localStorage.setItem('adgenius_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('adgenius_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string; password?: string }) => {
    const res = await apiClient.put<User>('/users/me', data);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
