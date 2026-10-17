import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiRequest, setStoredAdminToken, removeStoredAdminToken } from '../utils/api';

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCoordinator: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ user: User }>('/auth/me');
      const u = res.user;
      const roleUpper = u.role?.toUpperCase();
      if (roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN') {
        setUser(u);
      } else {
        removeStoredAdminToken();
        setUser(null);
      }
    } catch {
      removeStoredAdminToken();
      setUser(null);
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
    const u = res.user;
    const roleUpper = u.role?.toUpperCase();
    if (roleUpper !== 'ADMIN' && roleUpper !== 'SUPER_ADMIN') {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
      removeStoredAdminToken();
      throw new Error('Access denied. The Admin Panel is strictly restricted to platform administrators.');
    }
    if (res.token) {
      setStoredAdminToken(res.token);
    }
    setUser(u);
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeStoredAdminToken();
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
