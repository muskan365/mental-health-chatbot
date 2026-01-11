import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api.types';
import { authService } from '@/services/auth.service';
import { tokenUtils } from '@/utils/token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = authService.getCurrentUser();
    const isAuth = authService.isAuthenticated();
    if (isAuth && storedUser) {
      setUser(storedUser);
    }
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setUser({
      id: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    });
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await authService.register({ email, password, name: name || '', department: '', year: '' });
    setUser({
      id: response.userId,
      email: response.email,
      name: response.name,
      role: response.role,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    tokenUtils.setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
