import { createContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (userData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'jobseeker';
}

interface LoginData {
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register user
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/api/auth/register`, userData, {
        withCredentials: true,
      });
      
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post(`${API_URL}/api/auth/login`, userData, {
        withCredentials: true,
      });
      
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      await axios.get(`${API_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};