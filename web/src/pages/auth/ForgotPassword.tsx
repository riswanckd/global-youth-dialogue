import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import {
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1 = Email, 2 = Code (OTP), 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form States
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for code resend
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send 6-digit verification code to the entered email address
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Dispatches verification code securely to user inbox
      // Note: Verification code is never returned in response data to protect against F12 inspect/memory inspection
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail }),
      });

      setStep(2);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Unable to find an account with that email address. Please verify your spelling.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the 6-digit code received in the user's email inbox
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      setError('Please enter the full 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest('/auth/verify-reset-code', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: cleanCode,
        }),
      });

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code. Please check your inbox or request a new code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError(null);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code. Please try again in a few moments.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set and confirm new password, updating the database automatically
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The passwords you entered do not match. Please verify and try again.');
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword,
        }),
      });

      setStep(4);
      // Automatically redirect to login page after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Your verification code may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gyde-green/10 text-gyde-green mb-1">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {step === 4 ? 'Password Updated!' : 'Reset Your Password'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {step === 1 && 'Enter your registered email address to receive an official verification code.'}
          {step === 2 && 'Enter the 6-digit verification code dispatched to your email inbox.'}
          {step === 3 && 'Choose a strong new password to restore your account access.'}
          {step === 4 && 'Your credentials have been securely updated in the database.'}
        </p>
      </div>

      {/* Step Indicator (Steps 1 to 3) */}
      {step < 4 && (
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-gyde-green' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-gyde-green text-white' : 'bg-slate-200 text-slate-500'}`}>
              1
            </span>
            <span>Email</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-gyde-green' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-gyde-green text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            <span>Code</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-gyde-green' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-gyde-green text-white' : 'bg-slate-200 text-slate-500'}`}>
              3
            </span>
            <span>Password</span>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
                  placeholder="yourname@gmail.com"
                  autoFocus
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Code...</span>
                </>
              ) : (
                <>
                  <span>Next: Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter Verification Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Sent to: <strong>{email}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => { setStep(1); setError(null); }}
                className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0 ml-2"
              >
                Change
              </button>
            </div>

            <div className="space-y-1.5 text-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block text-left">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-2xl font-mono text-center tracking-[0.4em] font-extrabold text-gyde-green focus:outline-none focus:ring-2 focus:ring-gyde-green"
                placeholder="------"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 text-left pt-1">
                Please check your inbox (and spam/junk folder) for the 6-digit code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.trim().length !== 6}
              className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Next: Choose New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendCode}
                className="text-xs font-semibold text-slate-500 hover:text-gyde-green disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Did not receive code? Resend'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
                  placeholder="At least 6 characters"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
                  placeholder="Repeat new password"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Database...</span>
                </>
              ) : (
                <>
                  <span>Save New Password & Finish</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success Message */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Password Successfully Reset!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Your new password has been encrypted and updated in the database. Redirecting you to sign in...
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white text-xs font-bold transition-all shadow"
              >
                <span>Sign In to Member Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Back to Login link */}
        {step < 4 && (
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-gyde-green transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
