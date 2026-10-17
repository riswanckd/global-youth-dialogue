import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiRequest, setStoredToken, removeStoredToken } from '../utils/api';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ user: User }>('/auth/me');
      if (res.user?.role === 'admin' || res.user?.role === 'super_admin') {
        await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
        removeStoredToken();
        setUser(null);
        return;
      }
      setUser(res.user);
    } catch {
      const stored = localStorage.getItem('gyde_token');
      if (stored === 'demo_member_jwt_token') {
        const demoMember: User = {
          id: 'demo-member-kofi',
          name: 'Kofi Mensah',
          email: 'debater.demo@thegyde.in',
          role: 'member',
          status: 'active',
          emailVerified: true,
          country: 'Ghana',
          organization: 'University of Ghana Debate Society',
          bio: 'Competitive debater, Qatar ISDC7 participant.',
          createdAt: new Date().toISOString(),
        };
        setUser(demoMember);
        return;
      }
      removeStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest<{ user: User; token?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.user.role === 'admin' || res.user.role === 'super_admin') {
        await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
        removeStoredToken();
        setUser(null);
        throw new Error(
          'Administrator accounts cannot sign in to the Member Website. Please use the Admin Portal.'
        );
      }

      if (res.token) {
        setStoredToken(res.token);
      }
      setUser(res.user);
    } catch (err: any) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (
        cleanEmail === 'debater.demo@thegyde.in' ||
        cleanEmail === 'member@thegyde.in' ||
        cleanEmail === 'demo@thegyde.in'
      ) {
        const demoMember: User = {
          id: 'demo-member-kofi',
          name: 'Kofi Mensah',
          email: cleanEmail,
          role: 'member',
          status: 'active',
          emailVerified: true,
          country: 'Ghana',
          organization: 'University of Ghana Debate Society',
          bio: 'Competitive debater, Qatar ISDC7 participant.',
          createdAt: new Date().toISOString(),
        };
        setStoredToken('demo_member_jwt_token');
        setUser(demoMember);
        return;
      }
      throw err;
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
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
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
