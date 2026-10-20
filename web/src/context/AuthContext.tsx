import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiRequest, getStoredToken, setStoredToken, removeStoredToken } from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isPresenter: boolean;
  isCoordinator: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'gyde_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(USER_SESSION_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    const cachedSession = localStorage.getItem(USER_SESSION_KEY);

    // If no token, browser is completely unauthenticated
    if (!token) {
      setUser(null);
      localStorage.removeItem(USER_SESSION_KEY);
      setLoading(false);
      return;
    }

    // Temporarily restore cached session while validating with server
    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      } catch {}
    }

    try {
      const res = await apiRequest<{ user: User }>('/auth/me');
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
      } else {
        removeStoredToken();
        localStorage.removeItem(USER_SESSION_KEY);
        setUser(null);
      }
    } catch (err: any) {
      if (err?.statusCode === 401 || err?.statusCode === 403) {
        removeStoredToken();
        localStorage.removeItem(USER_SESSION_KEY);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{ user: User; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      setStoredToken(res.token);
    }
    if (res.user) {
      setUser(res.user);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
    }
  };

  const register = async (data: any) => {
    const res = await apiRequest<{ user: User; token?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    if (res.user) {
      setUser(res.user);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(res.user));
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      removeStoredToken();
      localStorage.removeItem(USER_SESSION_KEY);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const roleLower = user?.role?.toLowerCase() || '';
  const isPresenter = roleLower === 'presenter' || roleLower === 'coordinator' || roleLower === 'admin' || roleLower === 'super_admin';
  const isCoordinator = roleLower === 'coordinator' || roleLower === 'admin' || roleLower === 'super_admin';
  const isAdmin = roleLower === 'admin' || roleLower === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isPresenter,
        isCoordinator,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
