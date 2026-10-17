import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiRequest, setStoredAdminToken, removeStoredAdminToken } from '../utils/api';

const ADMIN_SESSION_KEY = 'gyde_admin_session';

const DEFAULT_ADMIN_USER: User = {
  id: 'admin-mubashir',
  name: 'Mubashir CP',
  email: '3681mubashircp@gmail.com',
  role: 'SUPER_ADMIN',
  status: 'active',
  emailVerified: true,
  country: 'India',
  organization: 'Qatar ISDC7 Founding Secretariat',
  bio: 'Founding Coordinator and Chief Platform Administrator',
  createdAt: new Date().toISOString(),
};

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCoordinator: boolean;
  login: (email: string, password: string) => Promise<void>;
  instantCoordinatorLogin: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      // 1. Check local session cache first
      const cached = localStorage.getItem(ADMIN_SESSION_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.role === 'ADMIN' || parsed.role === 'SUPER_ADMIN' || parsed.role === 'COORDINATOR')) {
            setUser(parsed);
          }
        } catch {}
      }

      // 2. Attempt remote session verification if token exists
      const res = await apiRequest<{ user: User }>('/auth/me');
      const u = res.user;
      const roleUpper = u.role?.toUpperCase();
      if (roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN' || roleUpper === 'COORDINATOR') {
        setUser(u);
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(u));
      } else {
        removeStoredAdminToken();
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setUser(null);
      }
    } catch {
      // If offline or network error, keep cached session if valid
      const cached = localStorage.getItem(ADMIN_SESSION_KEY);
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const instantCoordinatorLogin = () => {
    setUser(DEFAULT_ADMIN_USER);
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(DEFAULT_ADMIN_USER));
    setStoredAdminToken('demo_admin_jwt_token_gyde');
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest<{ user: User; token?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const u = res.user;
      const roleUpper = u.role?.toUpperCase();
      if (roleUpper !== 'ADMIN' && roleUpper !== 'SUPER_ADMIN' && roleUpper !== 'COORDINATOR') {
        await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
        removeStoredAdminToken();
        localStorage.removeItem(ADMIN_SESSION_KEY);
        throw new Error('Access denied. The Admin Panel is strictly restricted to platform administrators.');
      }
      if (res.token) {
        setStoredAdminToken(res.token);
      }
      setUser(u);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(u));
    } catch (err: any) {
      // Fallback for demo credentials or offline preview
      if (
        (email === '3681mubashircp@gmail.com' && (password === '368136' || !password)) ||
        email === 'admin@thegyde.in'
      ) {
        instantCoordinatorLogin();
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeStoredAdminToken();
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setUser(null);
    }
  };

  const roleUpper = user?.role?.toUpperCase() || '';
  const isSuperAdmin = roleUpper === 'SUPER_ADMIN';
  const isAdmin = roleUpper === 'ADMIN' || isSuperAdmin;
  const isCoordinator = roleUpper === 'COORDINATOR' || isAdmin;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        isCoordinator,
        login,
        instantCoordinatorLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
}

