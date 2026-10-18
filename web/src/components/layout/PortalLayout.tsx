import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ApplyPresenterModal } from '../portal/ApplyPresenterModal';
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
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presenterModalOpen, setPresenterModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isPresenter = user?.role === 'PRESENTER';

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
  const delegationText = user?.country
    ? `${roleLabel} • ${user.country}`
    : `${roleLabel} • ${isArabic ? 'دولي' : 'Global'}`;
  const avatarLetter = (displayName[0] || 'M').toUpperCase();

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* TOP WORKSPACE NAVBAR (Mirroring Admin Portal Design) */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 rtl:-ml-0 rtl:-mr-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/portal" className="flex items-center gap-2">
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
                placeholder={isArabic ? 'بحث...' : 'Search...'}
                className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-24 lg:w-32"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isArabic ? 'تبديل المظهر' : 'Toggle Light / Dark mode'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <Link
              to="/portal/sessions"
              title={isArabic ? 'الإشعارات' : 'Notifications'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-colors shrink-0"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={isArabic ? 'Switch Language' : 'تغيير اللغة'}
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
              {isArabic ? 'خروج' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH LEFT MENU BAR & MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT MENU BAR (SIDEBAR) */}
        <aside
          className={`
            fixed lg:sticky top-[72px] z-30 lg:z-10
            h-[calc(100vh-72px)] w-64 bg-white dark:bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-100 dark:border-slate-800
            flex flex-col justify-between py-4 px-3 shrink-0 transition-transform duration-200
            ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:lg:translate-x-0'}
          `}
        >
          {/* Upper Sidebar: Profile Card & Menu */}
          <div className="flex flex-col flex-1 overflow-y-auto space-y-3">
            {/* User Profile Card (Exact Admin Style) */}
            <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1e2540] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-400 font-normal truncate">
                  {delegationText}
                </div>
              </div>
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

          {/* Lower Sidebar: Action & Sign Out */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!isPresenter ? (
              <button
                type="button"
                onClick={() => setPresenterModalOpen(true)}
                className="w-full rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-2.5 px-3 py-2 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{isArabic ? 'طلب الاعتماد كمتحدث' : 'Request to be Presenter'}</span>
              </button>
            ) : (
              <div className="w-full rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{isArabic ? 'متحدث رسمي معتمد' : 'Accredited Presenter'}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
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
          <Outlet context={{ openPresenterModal: () => setPresenterModalOpen(true) }} />
        </main>
      </div>

      {/* Apply to Become an Official Presenter Modal */}
      <ApplyPresenterModal
        isOpen={presenterModalOpen}
        onClose={() => setPresenterModalOpen(false)}
      />
    </div>
  );
};
