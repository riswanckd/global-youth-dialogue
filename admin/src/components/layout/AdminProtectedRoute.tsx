import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD] dark:bg-[#000000] text-black dark:text-white transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-[#4950BA] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#4950BA] dark:text-[#A159AF] font-bold tracking-wider uppercase">
            Authenticating Administrator Clearance...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

