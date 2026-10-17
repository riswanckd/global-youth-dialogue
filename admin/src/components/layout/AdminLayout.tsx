import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiRequest } from '../../utils/api';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BookOpen,
  Mic,
  FileText,
  MessageSquareQuote,
  UserCheck,
  Award,
  Globe,
  Share2,
  User,
  Trash2,
  LogOut,
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextAr = !isArabic;
    setIsArabic(nextAr);
    document.documentElement.setAttribute('dir', nextAr ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', nextAr ? 'ar' : 'en');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteTrialData = async () => {
    setIsDeleting(true);
    try {
      // 1. Wipe backend database trial records (users, applications, topics, sessions)
      await apiRequest('/admin/trial-data', { method: 'DELETE' }).catch(() => {});
      // 2. Wipe serverless applications.json store
      await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ action: 'clearTrialData' }),
      }).catch(() => {});

      // 3. Clear local storage caches
      try {
        localStorage.removeItem('gyd_applied_email');
        localStorage.removeItem('gyd_pending_registration');
        localStorage.removeItem('gyd_otp_session');
        localStorage.removeItem('gyd_user_votes');
        localStorage.removeItem('gyd_ballot_votes');
        localStorage.removeItem('gyd_deleted_community_emails');
      } catch {}

      // 4. Invalidate all React Query caches to instantly reflect empty state
      await queryClient.invalidateQueries();
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeleteSuccessToast(true);
      setTimeout(() => setDeleteSuccessToast(false), 4000);
    }
  };

  const navItems = [
    { label: 'Programme Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'The Community', path: '/users', icon: Users },
    { label: 'Topic Lifecycle Pipeline', path: '/topics/pipeline', icon: GitBranch },
    { label: 'Topic Bank', path: '/topics', icon: BookOpen },
    { label: 'Session Management', path: '/sessions', icon: Mic },
    { label: 'Academic Writing Studio', path: '/publications', icon: FileText },
    { label: 'Delegate Feedback Analysis', path: '/feedback', icon: MessageSquareQuote },
    { label: 'Pending Applications', path: '/applications', icon: UserCheck },
    { label: 'ISDC7 Coordinator Team', path: '/users?role=COORDINATOR', icon: Award },
    { label: 'Country Chapters', path: '/analytics', icon: Globe },
    { label: 'Media & PR Studio', path: '/settings', icon: Share2 },
    { label: 'Coordinator Profile', path: '/settings', icon: User },
  ];

  const displayName = user?.name || 'Mubashir CP';
  const displayRole = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
    ? 'Founding Coordinator (India)'
    : (user?.role || 'Founding Coordinator (India)');
  const avatarLetter = (displayName[0] || 'M').toUpperCase();

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {deleteSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <span>All trial and demo data have been cleared successfully.</span>
        </div>
      )}

      {/* TOP NAVBAR (Exact design from screenshot) */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/images/gyde_official_logo.svg"
                alt="GYDE Official Logo"
                className="h-10 sm:h-11 w-auto object-contain dark:hidden"
                onError={(e) => {
                  // Fallback if svg is missing or errored
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo.png';
                }}
              />
              <img
                src="/assets/images/gyde_official_logo_dark.svg"
                alt="GYDE Official Logo"
                className="h-10 sm:h-11 w-auto object-contain hidden dark:block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo_dark.png';
                }}
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Pill */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-500 hover:border-slate-300 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-24 lg:w-32"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Light / Dark mode"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              title="Notifications"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                4
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / تغيير اللغة"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Home Link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Home
            </a>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* SIDEBAR DESKTOP & MOBILE DRAWER */}
        <aside
          className={`
            fixed lg:sticky top-[72px] z-30 lg:z-10
            h-[calc(100vh-72px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
            flex flex-col justify-between py-4 px-3 shrink-0 transition-transform duration-200
            ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Upper Sidebar: Profile Card & Menu */}
          <div className="flex flex-col flex-1 overflow-y-auto space-y-3">
            {/* User Profile Card (Exact screenshot style) */}
            <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1e2540] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-400 font-normal truncate">
                  {displayRole}
                </div>
              </div>
            </div>

            {/* Navigation Menu List */}
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path.split('?')[0]));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-[#f1f5f9] dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Lower Sidebar: Delete Trial Data & Sign Out */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-full rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 px-3 py-2 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Delete Trial Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ openDeleteTrialModal: () => setDeleteModalOpen(true) }} />
        </main>
      </div>

      {/* DELETE TRIAL DATA CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete All Trial & Demo Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This action will wipe trial submissions, applicant evaluations, demo session drafts, and local test cookies. Primary administrator accounts remain preserved.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTrialData}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-xs font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Purging Data...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
