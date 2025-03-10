import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { login, register } from '../services/authService';
import { AuthUser, LoginCredentials, RegisterData } from '@/types';

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<AuthUser>;
  registerUser: (userData: RegisterData) => Promise<AuthUser>;
  logout: () => void;
  updateUserData: (updatedData: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  loginUser: async () => ({ _id: '', name: '', email: '', YOB: 0, gender: true, isAdmin: false, token: '', createdAt: '', updatedAt: '' }),
  registerUser: async () => ({ _id: '', name: '', email: '', YOB: 0, gender: true, isAdmin: false, token: '', createdAt: '', updatedAt: '' }),
  logout: () => {},
  updateUserData: () => {},
  isAuthenticated: false,
  isAdmin: false
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login user
  const loginUser = async (credentials: LoginCredentials): Promise<AuthUser> => {
    try {
      setLoading(true);
      const data = await login(credentials);
      setCurrentUser(data);
      localStorage.setItem('userData', JSON.stringify(data));
      message.success('Login successful!');
      return data;
    } catch (error) {
      message.error((error as any).response?.data?.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const registerUser = async (userData: RegisterData): Promise<AuthUser> => {
    try {
      setLoading(true);
      const data = await register(userData);
      setCurrentUser(data);
      localStorage.setItem('userData', JSON.stringify(data));
      message.success('Registration successful!');
      return data;
    } catch (error) {
      message.error((error as any).response?.data?.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('userData');
    message.success('Logout successful!');
  };

  // Update user data in context after profile updates
  const updateUserData = (updatedData: Partial<AuthUser>): void => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginUser,
        registerUser,
        logout,
        updateUserData,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};