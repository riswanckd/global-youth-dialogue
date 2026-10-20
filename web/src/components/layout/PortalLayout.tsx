import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ApplyPresenterModal } from '../portal/ApplyPresenterModal';
import { getCountryMeta } from '../../utils/country';
import {
  LayoutDashboard,
  Mic,
  FileText,
  MessageSquareQuote,
  BookOpen,
  Lightbulb,
  Award,
  User,
  LogOut,
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  X,
  Globe,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presenterModalOpen, setPresenterModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  useEffect(() => {
    if (location.search.includes('notifications=open')) {
      setNotificationsOpen(true);
    }
  }, [location]);

  // Ensure mobile drawer is always closed on initial load and route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userRoleUpper = user?.role?.toUpperCase() || '';
  const isSuperAdmin = userRoleUpper === 'SUPER_ADMIN' || user?.email === 'admin@thegyde.in';
  const isAdmin = isSuperAdmin || userRoleUpper === 'ADMIN' || userRoleUpper === 'COORDINATOR';
  const hasPresenterAccess = isAdmin || userRoleUpper === 'PRESENTER';

  // Toggle state between Member View and Presenter View (stored in localStorage for seamless experience)
  const [activeDashboardMode, setActiveDashboardMode] = useState<'member' | 'presenter'>(() => {
    if (!hasPresenterAccess) return 'member';
    const saved = localStorage.getItem('gyde_active_view_mode');
    return (saved === 'member' || saved === 'presenter') ? saved : (hasPresenterAccess ? 'presenter' : 'member');
  });

  const toggleDashboardMode = (mode: 'member' | 'presenter') => {
    if (mode === 'presenter' && !hasPresenterAccess) {
      setPresenterModalOpen(true);
      return;
    }
    setActiveDashboardMode(mode);
    localStorage.setItem('gyde_active_view_mode', mode);
  };

  const isPresenter = activeDashboardMode === 'presenter';

  const navItems = [
    {
      label: isPresenter
        ? (isArabic ? 'لوحة المتحدث' : 'Presenter Dashboard')
        : (isArabic ? 'لوحة العضو' : 'Member Dashboard'),
      path: '/portal',
      exact: true,
      icon: LayoutDashboard,
    },
    {
      label: isArabic ? 'الجلسات والأرشيف' : 'Sessions & Chambers',
      path: '/portal/sessions',
      icon: Mic,
    },
    {
      label: isArabic ? 'الأوراق البحثية' : 'Academic Writings',
      path: '/portal/publications',
      icon: FileText,
    },
    {
      label: isArabic ? 'تقديم التقييم' : 'Submit Feedback',
      path: '/portal/feedback',
      icon: MessageSquareQuote,
    },
    {
      label: isArabic ? 'بنك المواضيع' : 'Topic Bank',
      path: '/portal/topic-bank',
      icon: BookOpen,
    },
    {
      label: isArabic ? 'اقتراح موضوع' : 'Suggest a Topic',
      path: '/portal/suggest-topic',
      icon: Lightbulb,
    },
    {
      label: isArabic ? 'مسيرتي والأوسمة' : 'My Journey & Badges',
      path: '/portal/journey',
      icon: Award,
    },
    {
      label: isArabic ? 'الملف الشخصي' : 'My Profile & Settings',
      path: '/portal/profile',
      icon: User,
    },
  ];

  const displayName = user?.name || (isArabic ? 'عضو معتمد' : 'Kofi Mensah');
  const roleLabel = isPresenter
    ? (isArabic ? 'متحدث رسمي معتمد' : 'PRESENTER')
    : (user?.role || (isArabic ? 'عضو' : 'MEMBER'));
  const avatarLetter = (displayName[0] || 'M').toUpperCase();
  const userCountry = user?.country || 'Ghana';
  const countryMeta = getCountryMeta(userCountry);

  return (
    <div className="h-screen bg-[#fcfdfe] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* TOP WORKSPACE NAVBAR (Mirroring Admin Portal Design) */}
      <header className="shrink-0 z-50 w-full h-16 lg:h-[72px] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative">
        <div className="w-full px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/portal" className="flex items-center gap-2">
              <img
                src="/assets/images/gyde_official_logo.svg"
                alt="GYDE Official Logo"
                className="h-7 sm:h-9 w-auto object-contain dark:hidden"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo.png';
                }}
              />
              <img
                src="/assets/images/gyde_official_logo_dark.svg"
                alt="GYDE Official Logo"
                className="h-7 sm:h-9 w-auto object-contain hidden dark:block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo_dark.png';
                }}
              />
            </Link>
          </div>

          {/* Center: Multi-Dashboard Access Controller / Switcher (Hidden on mobile, placed inside drawer) */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => toggleDashboardMode('member')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDashboardMode === 'member'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isArabic ? 'لوحة العضو' : 'Member Dashboard'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDashboardMode('presenter')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDashboardMode === 'presenter'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isArabic ? 'لوحة المتحدث' : 'Presenter Dashboard'}</span>
              {!hasPresenterAccess && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {isArabic ? 'طلب' : 'Apply'}
                </span>
              )}
            </button>

            {isAdmin && (
              <a
                href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5174/dashboard' : 'https://gyde-admin.vercel.app/dashboard'}
                target={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? undefined : '_blank'}
                rel={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? undefined : 'noopener noreferrer'}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/60 hover:bg-amber-100/90 transition-colors"
                title="Universal Admin Access"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>{isArabic ? 'بوابة الإدارة' : 'Admin Portal'}</span>
              </a>
            )}
          </div>

          {/* Right: Actions (Borderless, low-opacity professional fills) */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Search Pill (Hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-500 hover:bg-slate-200/70 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isArabic ? 'بحث...' : 'Search...'}
                className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-24 lg:w-32"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isArabic ? 'تبديل المظهر' : 'Toggle Light / Dark mode'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              title={isArabic ? 'الإشعارات' : 'Notifications'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 relative transition-colors shrink-0 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {!notificationsRead && (
                <span className="absolute -top-0.5 -right-0.5 rtl:-right-auto rtl:-left-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={isArabic ? 'Switch Language' : 'تغيير اللغة'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{isArabic ? 'English' : 'العربية'}</span>
              <span className="sm:hidden font-bold">{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              title={isArabic ? 'تسجيل الخروج' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="hidden sm:inline">{isArabic ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH LEFT MENU BAR & SCROLLABLE MAIN CONTENT */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* MOBILE BACKDROP OVERLAY */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 lg:hidden z-30 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* SIDEBAR: DESKTOP COLUMN & FULL-HEIGHT MOBILE DRAWER */}
        <aside
          className={`
            ${mobileMenuOpen ? 'flex fixed top-16 bottom-0 left-0 rtl:left-auto rtl:right-0 z-40 w-[280px] max-w-[85vw] shadow-2xl' : 'hidden'}
            lg:flex lg:static lg:top-auto lg:bottom-auto lg:z-10 lg:w-64 lg:shadow-none
            h-[calc(100dvh-64px)] lg:h-full bg-white dark:bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-100 dark:border-slate-800
            flex-col justify-between py-4 px-3 shrink-0 select-none
          `}
        >
          {/* Upper Sidebar: Mobile Header + Profile Card + Mode Switcher + Menu */}
          <div className="flex flex-col flex-1 overflow-y-auto space-y-3 overscroll-contain no-scrollbar">
            {/* Mobile Drawer Top Bar with Close Button */}
            <div className="lg:hidden flex items-center justify-between pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isArabic ? 'القائمة الرئيسية' : 'Navigation Menu'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card with Compulsory Country Badge Under Avatar */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/50 flex items-center gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#1e2540] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-500/20">
                  {avatarLetter}
                </div>
                {/* Compulsory Country Flag Badge directly under the Profile Picture */}
                <div
                  title={countryMeta.name}
                  className="mt-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-xs flex items-center justify-center gap-1.5 max-w-[72px]"
                >
                  <img
                    src={countryMeta.flagUrl}
                    alt={countryMeta.name}
                    className="w-4 h-2.5 rounded-[2px] object-cover shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider truncate">
                    {countryMeta.name}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {roleLabel}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {user?.organization || 'Academic Forum'}
                </div>
              </div>
            </div>

            {/* Mobile Mode Switcher (Member vs Presenter) */}
            <div className="md:hidden flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  toggleDashboardMode('member');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeDashboardMode === 'member'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isArabic ? 'لوحة العضو' : 'Member'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleDashboardMode('presenter');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeDashboardMode === 'presenter'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Mic className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isArabic ? 'لوحة المتحدث' : 'Presenter'}</span>
              </button>
            </div>

            {/* Navigation Menu List (Exact Admin Pill Style) */}
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname === item.path ||
                    (item.path !== '/portal' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-xs transition-colors ${
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

          {/* Lower Sidebar: Action & Sign Out Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!hasPresenterAccess ? (
              <button
                type="button"
                onClick={() => {
                  setPresenterModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2.5 transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{isArabic ? 'طلب الاعتماد كمتحدث' : 'Request to be Presenter'}</span>
              </button>
            ) : !isPresenter ? (
              <button
                type="button"
                onClick={() => {
                  toggleDashboardMode('presenter');
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2.5 transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{isArabic ? 'التبديل إلى لوحة المتحدث' : 'Switch to Presenter Dashboard'}</span>
              </button>
            ) : (
              <div className="w-full rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{isArabic ? 'متحدث رسمي معتمد' : 'Accredited Presenter'}</span>
              </div>
            )}

            {/* Red color effect/shade for sign out button (Borderless, low opacity) */}
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2.5 px-3 py-2.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 h-full p-3.5 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain">
          <Outlet
            context={{
              openPresenterModal: () => setPresenterModalOpen(true),
              activeDashboardMode,
              toggleDashboardMode,
            }}
          />
        </main>
      </div>

      {/* Apply to Become an Official Presenter Modal */}
      <ApplyPresenterModal
        isOpen={presenterModalOpen}
        onClose={() => setPresenterModalOpen(false)}
      />

      {/* Member / Presenter Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 mt-14 mr-2 rtl:mr-auto rtl:ml-2 overflow-hidden flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {isArabic ? 'إشعارات العضوية والأكاديمية' : 'Delegate & Member Notifications'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isArabic ? 'تحديثات الجلسات وأوراق الحوار' : 'Live session updates & editorial alerts'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNotificationsRead(true)}
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {isArabic ? 'تحديد كمقروء' : 'Mark read'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    if (location.search.includes('notifications=')) {
                      navigate(location.pathname, { replace: true });
                    }
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-1">
              {/* Item 1: Accreditation status */}
              <div className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'اعتماد العضوية الأكاديمية' : 'Accredited Membership Active'}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {isArabic
                      ? 'تم التحقق من بياناتك للمشاركة الكاملة في جلسات الحوار واللجان الافتراضية.'
                      : 'Your credentials have been verified for multilateral chambers and voting.'}
                  </p>
                </div>
              </div>

              {/* Item 2: Academic Writing Studio */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/portal/publications');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {isArabic ? 'استوديو الكتابة الأكاديمية' : 'Academic Writing Studio'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic
                      ? 'قدّم مقالك أو ورقتك الأكاديمية للمراجعة ونشرها في المكتبة الرقمية العامة.'
                      : 'Draft and submit your research essay or article for editorial review and public publishing.'}
                  </p>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1 inline-block">
                    {isArabic ? 'فتح الاستوديو ←' : 'Open Writing Studio →'}
                  </span>
                </div>
              </button>

              {/* Item 3: Upcoming Session */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/portal/sessions');
                }}
                className="w-full text-left rtl:text-right p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  🎙
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {isArabic ? 'جلسات الحوار الدولية القادمة' : 'Upcoming Dialogue Chambers'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic
                      ? 'غرف الحوار المباشرة مفتوحة للتسجيل وتأكيد الحضور الافتراضي.'
                      : 'Join official live plenary debates and reserve your seat on the floor.'}
                  </p>
                  <span className="text-[10px] text-purple-500 font-semibold mt-1 inline-block">
                    {isArabic ? 'عرض الجلسات ←' : 'Explore Sessions →'}
                  </span>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>GYDE Secretariat Network</span>
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
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
