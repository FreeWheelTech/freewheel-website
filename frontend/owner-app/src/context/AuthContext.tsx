import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/api';

type User = {
  id: string;
  email: string;
  role: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setUser(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          const res = await api.get('/auth/me');
          if (res.data.role === 'OWNER') {
             setUser(res.data);
          } else {
             await logout();
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: any) => {
    const res = await api.post('/auth/login', data);
    
    if (res.data.user.role !== 'OWNER') {
        throw new Error('Unauthorized Role: Customers cannot access the Owner App.');
    }

    await SecureStore.setItemAsync('accessToken', res.data.accessToken);
    await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
