import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Globe2,
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
    <div className="min-h-screen bg-[#071824] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0E4D3C]/35 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#B88E3E]/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#0E4D3C]/15 blur-[160px] pointer-events-none" />

      {/* Decorative Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-xl w-full">
        {/* Main Glassmorphism Card */}
        <div className="bg-[#0b2131]/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.55)] space-y-7">
          {/* Header Brand & Badges */}
          <div className="text-center space-y-3">
            {/* Top Secretariat Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E4D3C]/80 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Qatar ISDC7 Founding Secretariat</span>
            </div>

            {/* Official Logo */}
            <div className="flex justify-center pt-1">
              <img
                src="/assets/images/gyde_official_logo_dark.svg"
                alt="GYDE Official Logo"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo_dark.png';
                }}
              />
            </div>

            {/* Title & Bilingual Subtitle */}
            <div className="space-y-1 pt-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Coordinator Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Restricted Programme &amp; Academic Administration
              </p>
              <p className="text-[11px] text-[#E6C875] font-arabic font-semibold pt-0.5">
                بوابة الأمانة العامة وإدارة الحوار الدولي
              </p>
            </div>
          </div>

          {/* 1-CLICK INSTANT COORDINATOR ACCESS (VIP CARD) */}
          <div className="relative group overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-amber-400/40 via-emerald-500/40 to-amber-500/40 shadow-lg">
            <div className="bg-gradient-to-b from-[#112d42] to-[#0c2233] p-5 rounded-[15px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                    M
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Mubashir CP</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">
                      Founding Coordinator (India) • Executive Director
                    </div>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Secretariat Clearance
                </span>
              </div>

              <button
                type="button"
                onClick={handleInstantCoordinatorAccess}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B88E3E] via-[#cca34e] to-[#B88E3E] hover:from-[#c59c47] hover:to-[#a98135] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(184,142,62,0.35)] transition-all transform active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Enter Coordinator Workspace (1-Click)</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Elegant Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-[#0b2131] px-3 text-[10px] uppercase tracking-widest text-slate-400 font-bold shrink-0">
              Or Sign In With Secretariat Credentials
            </span>
            <div className="border-t border-slate-700/80 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 flex items-center gap-2.5 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Secretariat Email</span>
                <span className="text-[10px] text-slate-400">3681mubashircp@gmail.com</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thegyde.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E3E] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Security Clearance Passcode</span>
                <span className="text-[10px] text-slate-400">Default: 368136</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B88E3E] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0E4D3C] to-[#136750] hover:from-[#115b47] hover:to-[#177c61] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating Secretariat...' : 'Authenticate Secretariat Clearance'}</span>
            </button>
          </form>

          {/* Footer Navigation & Status */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <a
              href="https://gydonline.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Return to Public Youth Dialogue</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secretariat Node Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
