import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiRequest, setStoredAdminToken, removeStoredAdminToken } from '../utils/api';

const ADMIN_SESSION_KEY = 'gyde_admin_session';

const DEFAULT_ADMIN_USER: User = {
  id: 'super-admin-gyde',
  name: 'GYDE Super Administrator',
  email: 'admin@thegyde.in',
  role: 'SUPER_ADMIN',
  status: 'active',
  emailVerified: true,
  country: 'India',
  organization: 'Global Youth Dialogue & Exchange Secretariat',
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
      const storedToken = localStorage.getItem('gyde_admin_token');
      const cachedSession = localStorage.getItem(ADMIN_SESSION_KEY);

      // If no token exists in this browser instance, strictly remain unauthenticated
      if (!storedToken || storedToken.startsWith('demo_') || storedToken.startsWith('gyde_admin_super_clearance')) {
        removeStoredAdminToken();
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if JWT token is expired
      try {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 <= Date.now()) {
            removeStoredAdminToken();
            localStorage.removeItem(ADMIN_SESSION_KEY);
            setUser(null);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Fast restore of existing browser session
      if (cachedSession) {
        try {
          const parsed = JSON.parse(cachedSession);
          if (parsed && (parsed.role === 'ADMIN' || parsed.role === 'SUPER_ADMIN' || parsed.role === 'COORDINATOR')) {
            setUser(parsed);
          }
        } catch {}
      }

      // Verify session with backend using this browser's credentials
      const res = await apiRequest<{ user: User }>('/auth/me');
      const u = res?.user;
      const roleUpper = u?.role?.toUpperCase();
      if (roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN' || roleUpper === 'COORDINATOR') {
        setUser(u);
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(u));
      } else {
        removeStoredAdminToken();
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setUser(null);
      }
    } catch {
      // If server explicitly rejects token (401/403), invalidate session
      removeStoredAdminToken();
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (rawEmail: string, rawPassword: string) => {
    const email = (rawEmail || '').trim().toLowerCase();
    const password = (rawPassword || '').trim();

    const res = await apiRequest<{ user: User; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const u = res?.user;
    const roleUpper = u?.role?.toUpperCase();
    if (roleUpper !== 'ADMIN' && roleUpper !== 'SUPER_ADMIN' && roleUpper !== 'COORDINATOR') {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
      removeStoredAdminToken();
      localStorage.removeItem(ADMIN_SESSION_KEY);
      throw new Error('Access denied. The Admin Panel is strictly restricted to platform administrators.');
    }

    if (res?.token) {
      setStoredAdminToken(res.token);
    }
    if (u) {
      setUser(u);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(u));
    }
  };

  const instantCoordinatorLogin = () => {
    // Deprecated for cross-device security; redirect to explicit credentials login
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
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

