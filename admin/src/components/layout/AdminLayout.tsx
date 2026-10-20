import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { apiRequest } from '../../utils/api';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BookOpen,
  Mic,
  FileText,
  FileCheck,
  MessageSquareQuote,
  UserCheck,
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
  Lock,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const { isArabic, toggleLanguage, t, translateRole } = useAdminLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  useEffect(() => {
    if (location.search.includes('notifications=open') || location.pathname === '/notifications') {
      setNotificationsOpen(true);
    }
  }, [location]);

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
    { id: 'dashboard', label: t('menu.overview', 'Programme Overview'), path: '/dashboard', icon: LayoutDashboard },
    { id: 'users', label: t('menu.community', 'The Community'), path: '/users', icon: Users },
    { id: 'pipeline', label: t('menu.pipeline', 'Topic Lifecycle Pipeline'), path: '/topics/pipeline', icon: GitBranch },
    { id: 'topics', label: t('menu.topicBank', 'Topic Bank'), path: '/topics', icon: BookOpen },
    { id: 'sessions', label: t('menu.sessions', 'Session Management'), path: '/sessions', icon: Mic },
    { id: 'session-summaries', label: t('menu.sessionSummaries', 'Session Summaries'), path: '/session-summaries', icon: FileCheck },
    { id: 'publications', label: t('menu.writingStudio', 'Academic Writing Studio'), path: '/publications', icon: FileText },
    { id: 'feedback', label: t('menu.feedbackAnalysis', 'Delegate Feedback Analysis'), path: '/feedback', icon: MessageSquareQuote },
    { id: 'applications', label: t('menu.pendingApps', 'Pending Applications'), path: '/applications', icon: UserCheck },
    { id: 'analytics', label: t('menu.countryChapters', 'Country Chapters'), path: '/analytics', icon: Globe },
    { id: 'settings', label: t('menu.mediaStudio', 'Media & PR Studio'), path: '/settings', icon: Share2 },
    { id: 'profile', label: t('menu.coordinatorProfile', 'Coordinator Profile'), path: '/settings', icon: User },
  ];

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.email === 'admin@thegyde.in';
  const isCoAdmin = !isSuperAdmin && (user?.role === 'ADMIN' || user?.role === 'COORDINATOR');

  const isMenuAuthorized = (menuId: string) => {
    if (isSuperAdmin) return true;
    if (!isCoAdmin) return true;
    if (menuId === 'profile') return true;
    if (!user?.allowedMenus || user.allowedMenus.length === 0) return true;
    return user.allowedMenus.includes(menuId);
  };

  const currentActiveItem = navItems.find((item) =>
    item.path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(item.path.split('?')[0])
  );
  const isCurrentRouteAuthorized = !currentActiveItem || isMenuAuthorized(currentActiveItem.id);

  const displayName = user?.name || 'GYDE Super Administrator';
  const displayRole = user?.role
    ? translateRole(user.role)
    : 'Super Administrator';
  const avatarLetter = (displayName[0] || 'A').toUpperCase();

  return (
    <div className="h-screen bg-[#fcfdfe] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Toast Notification */}
      {deleteSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <span>{t('deleteModal.toastSuccess', 'All trial and demo data have been cleared successfully.')}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="shrink-0 z-40 w-full h-[72px] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 rtl:-ml-0 rtl:-mr-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/images/gyde_official_logo.svg"
                alt="GYDE Official Logo"
                className="h-8 sm:h-10 w-auto object-contain dark:hidden"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo.png';
                }}
              />
              <img
                src="/assets/images/gyde_official_logo_dark.svg"
                alt="GYDE Official Logo"
                className="h-8 sm:h-10 w-auto object-contain hidden dark:block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo_dark.png';
                }}
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Pill (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs text-slate-500 hover:border-slate-300 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder', 'Search...')}
                className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-24 lg:w-32"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={t('nav.lightDark', 'Toggle Light / Dark mode')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(true)}
              title={t('nav.notifications', 'Notifications')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-colors shrink-0"
            >
              <Bell className="w-4 h-4" />
              {!notificationsRead && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={t('nav.switchLanguage', 'Switch Language / تغيير اللغة')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{isArabic ? 'English' : 'العربية'}</span>
              <span className="sm:hidden text-[11px] font-bold">{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {t('nav.signOut', 'Sign Out')}
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto overflow-hidden relative">
        {/* SIDEBAR DESKTOP & MOBILE DRAWER */}
        <aside
          className={`
            fixed lg:static top-[72px] bottom-0 left-0 rtl:left-auto rtl:right-0 z-30 lg:z-10
            h-[calc(100vh-72px)] lg:h-full w-64 bg-white dark:bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-100 dark:border-slate-800
            flex flex-col justify-between py-4 px-3 shrink-0 transition-transform duration-200 select-none
            ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:lg:translate-x-0'}
          `}
        >
          {/* Upper Sidebar: Profile Card & Menu */}
          <div className="flex flex-col flex-1 overflow-y-auto space-y-3 overscroll-contain no-scrollbar">
            {/* User Profile Card */}
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
                const isAuthorized = isMenuAuthorized(item.id);
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    location.pathname.startsWith(item.path.split('?')[0]));

                if (!isAuthorized) {
                  return (
                    <div
                      key={item.label}
                      title={t('access.restrictedTooltip', 'Module access restricted by Super Administrator')}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-900/40 opacity-40 cursor-not-allowed select-none border border-transparent"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-600" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{t('access.locked', 'Locked')}</span>
                      </span>
                    </div>
                  );
                }

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
              <span>{t('menu.deleteTrialData', 'Delete Trial Data')}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{t('nav.signOut', 'Sign Out')}</span>
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
        <main className="flex-1 min-w-0 h-full p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain">
          {!isCurrentRouteAuthorized ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('access.restrictedTitle', 'Module Access Restricted')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                {t(
                  'access.restrictedDesc',
                  'Your Co-Admin account has not been granted clearance for this administrative module. Please contact the Super Administrator to configure your access settings.'
                )}
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                {t('access.returnDashboard', 'Return to Overview')}
              </button>
            </div>
          ) : (
            <Outlet context={{ openDeleteTrialModal: () => setDeleteModalOpen(true) }} />
          )}
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
                {t('deleteModal.title', 'Delete All Trial & Demo Data?')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('deleteModal.desc', 'This action will wipe trial submissions, applicant evaluations, demo session drafts, and local test cookies. Primary administrator accounts remain preserved.')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('deleteModal.cancel', 'Cancel')}
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
                    <span>{t('deleteModal.purging', 'Purging Data...')}</span>
                  </>
                ) : (
                  <span>{t('deleteModal.confirm', 'Confirm Delete')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Secretariat Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 mt-14 mr-2 overflow-hidden flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    Secretariat Notifications
                  </h3>
                  <p className="text-[11px] text-slate-500">Live operational & delegate telemetry</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNotificationsRead(true)}
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Mark read
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    if (location.search.includes('notifications=')) {
                      navigate(location.pathname, { replace: true });
                    }
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-1">
              {/* Item 1: Applications */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/applications');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Delegate Admissions Pending
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    Review and verify incoming international youth delegate and keynote speaker applications.
                  </p>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1 inline-block">Review in Applications →</span>
                </div>
              </button>

              {/* Item 2: Topic Pipeline */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/topics/pipeline');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Topic Lifecycle Motions
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    Academic debate motions submitted across the 16 core knowledge disciplines awaiting editorial clearance.
                  </p>
                  <span className="text-[10px] text-purple-500 font-semibold mt-1 inline-block">Review Pipeline →</span>
                </div>
              </button>

              {/* Item 3: Academic Writing Studio */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/publications');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Academic Writing Studio Requests
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    Presenters have submitted academic articles & essays for secretariat review and public publishing.
                  </p>
                  <span className="text-[10px] text-amber-500 font-semibold mt-1 inline-block">Open Writing Studio →</span>
                </div>
              </button>

              {/* Item 4: Scheduled Sessions */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/sessions');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Chambers & Dialogue Sessions
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    Manage upcoming virtual dialogue chambers, guest speakers, and executive session summaries.
                  </p>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1 inline-block">Manage Sessions →</span>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Platform telemetry: Operational</span>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  if (location.search.includes('notifications=')) {
                    navigate(location.pathname, { replace: true });
                  }
                }}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

