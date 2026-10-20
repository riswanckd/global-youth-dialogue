import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAdminAuth();
  const { isArabic, toggleLanguage, t } = useAdminLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim().toLowerCase(), password.trim());
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Secretariat authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans transition-colors duration-300 bg-[#FAFBFD] dark:bg-[#000000] text-black dark:text-white">
      {/* Top-Right Action Controls (Theme & Language) */}
      <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          title={t('nav.switchLanguage', 'Switch Language / تغيير اللغة')}
          className="px-3.5 py-2 rounded-full border border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-sm flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-[#4950BA]" />
          <span>{isArabic ? 'English' : 'العربية'}</span>
        </button>

        <button
          onClick={toggleTheme}
          title={t('nav.lightDark', 'Toggle Light / Dark mode')}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#A159AF]" /> : <Moon className="w-4 h-4 text-[#4950BA]" />}
        </button>
      </div>

      {/* Dynamic Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] rounded-full bg-[#4950BA]/15 dark:bg-[#4950BA]/25 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[520px] h-[520px] rounded-full bg-[#A159AF]/15 dark:bg-[#A159AF]/25 blur-[130px] pointer-events-none" />

      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/95 dark:bg-[#0c0d14]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_-15px_rgba(73,80,186,0.15)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6">
          {/* Header Brand & Badges */}
          <div className="text-center space-y-3">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4950BA]/10 dark:bg-[#4950BA]/20 border border-[#4950BA]/20 dark:border-[#4950BA]/40 text-[11px] font-semibold text-[#4950BA] dark:text-[#A159AF] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A159AF] animate-pulse" />
              <span>GYDE Admin Portal</span>
            </div>

            {/* Official Logo */}
            <div className="flex justify-center pt-1">
              <img
                src="/assets/images/gyde_official_logo.svg"
                alt="GYDE Official Logo"
                className="h-11 sm:h-12 w-auto object-contain dark:hidden"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo.png';
                }}
              />
              <img
                src="/assets/images/gyde_official_logo_dark.svg"
                alt="GYDE Official Logo"
                className="h-11 sm:h-12 w-auto object-contain hidden dark:block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo_dark.png';
                }}
              />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1 pt-1">
              <h1
                style={{ fontFamily: isArabic ? "'Noto Kufi Arabic', sans-serif" : "'Sora', sans-serif" }}
                className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight"
              >
                {t('dash.title', 'Coordinator Workspace')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {t('login.subtitle', 'Restricted access for Qatar ISDC7 Founding Coordinators and Academic Administrators.')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 flex items-center gap-2.5 text-rose-700 dark:text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('login.emailLabel', 'Official Secretariat Email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@thegyde.org"
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/90 text-black dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4950BA] focus:border-[#4950BA] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('login.passwordLabel', 'Security Passcode')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 rtl:pl-10 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/90 text-black dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4950BA] focus:border-[#4950BA] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4950BA] via-[#6e53b2] to-[#A159AF] hover:from-[#3e44a0] hover:to-[#8f4da0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(73,80,186,0.35)] transition-all active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? t('login.authLoading', 'Authenticating Secretariat...') : t('login.authBtn', 'Authenticate Secretariat Clearance')}</span>
            </button>
          </form>

          {/* Footer Status */}
          <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-[11px] text-[#4950BA] dark:text-[#A159AF] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4950BA] dark:bg-[#A159AF] animate-pulse" />
              <span>{t('login.nodeActive', 'Secretariat Node Active')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

