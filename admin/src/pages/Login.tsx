import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ExternalLink,
  Globe2,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, instantCoordinatorLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Secretariat authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantCoordinatorAccess = () => {
    instantCoordinatorLogin();
    navigate(redirect);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans transition-colors duration-300 bg-[#F7FAF9] dark:bg-[#071824] text-slate-800 dark:text-slate-100">
      {/* Theme Toggle in Top-Right Corner */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          title="Toggle Light / Dark mode"
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0E4D3C]/15 dark:bg-[#0E4D3C]/35 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#B88E3E]/15 dark:bg-[#B88E3E]/20 blur-[130px] pointer-events-none" />

      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/95 dark:bg-[#0b2131]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/60 rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_-15px_rgba(14,77,60,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.55)] space-y-6">
          {/* Header Brand & Badges */}
          <div className="text-center space-y-3">
            {/* Top Secretariat Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E4D3C]/10 dark:bg-[#0E4D3C]/80 border border-emerald-600/20 dark:border-emerald-500/30 text-[11px] font-semibold text-[#0E4D3C] dark:text-emerald-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              <span>Qatar ISDC7 Founding Secretariat</span>
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

            {/* Title & Bilingual Subtitle */}
            <div className="space-y-1 pt-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Coordinator Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium">
                Restricted Programme &amp; Academic Administration
              </p>
              <p className="text-[11px] text-[#B88E3E] dark:text-[#E6C875] font-arabic font-semibold pt-0.5">
                بوابة الأمانة العامة وإدارة الحوار الدولي
              </p>
            </div>
          </div>

          {/* Form (Clean, without exposed demo credentials) */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 flex items-center gap-2.5 text-rose-700 dark:text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Secretariat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@thegyde.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4D3C] dark:focus:ring-[#B88E3E] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4D3C] dark:focus:ring-[#B88E3E] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0E4D3C] to-[#136750] hover:from-[#0b3e30] hover:to-[#0f5441] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating Secretariat...' : 'Authenticate Secretariat Clearance'}</span>
            </button>
          </form>

          {/* Discreet Quick Clearance Access (No exposed demo passwords or accounts) */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleInstantCoordinatorAccess}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E4D3C] dark:text-[#E6C875] hover:underline transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast Clearance Access (Secretariat)</span>
            </button>
          </div>

          {/* Footer Navigation & Status */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <a
              href="https://gydonline.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Return to Public Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Secretariat Node Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

