import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { ADMIN_MODULES } from './Users';
import {
  User,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Layers,
  Sparkles,
  Mail,
  Fingerprint,
} from 'lucide-react';

export const CoordinatorProfile: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();
  const { isArabic, translateRole } = useAdminLanguage();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!passwordForm.currentPassword) {
      setErrorMsg(isArabic ? 'يرجى إدخال كلمة المرور الحالية' : 'Current password is required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMsg(isArabic ? 'يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف' : 'New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg(isArabic ? 'كلمات المرور غير متطابقة' : 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      setSuccessMsg(isArabic ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || (isArabic ? 'فشل تحديث كلمة المرور' : 'Failed to update password. Please check your current password.'));
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.name || 'GYDE Super Administrator';
  const displayRole = user?.role ? translateRole(user.role) : 'Super Administrator';
  const displayEmail = user?.email || 'admin@thegyde.in';
  const displayCountry = user?.country || 'Qatar / Global Secretariat';
  const allowedMenus = user?.allowedMenus || [];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="w-6 h-6 text-indigo-600" />
          <span>{isArabic ? 'الملف الشخصي واعتمادات المنسق' : 'Coordinator Profile & Credentials'}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isArabic
            ? 'بيانات الاعتماد الرسمية، وصلاحيات الإدارة، وإعدادات الأمان الخاصة بحسابك في الأمانة العامة.'
            : 'Official Secretariat credentials, assigned administrative module clearances, and security credentials.'}
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {(displayName[0] || 'A').toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {displayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold uppercase">
                  {displayRole}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayEmail}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayCountry}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isArabic ? 'جلسة نشطة وموثقة' : 'Active & Authenticated'}</span>
            </span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isArabic ? 'مستوى الصلاحية' : 'Privilege Tier'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {isSuperAdmin ? 'Full Secretariat SuperAdmin' : 'Accredited Co-Admin / Coordinator'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isArabic ? 'طريقة المصادقة' : 'Auth Protocol'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
              Secure HTTP-Only JWT (SHA-256)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isArabic ? 'حالة التكليف' : 'Secretariat Scope'}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              Founding Secretariat / Qatar ISDC7
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Module Permissions & Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Administrative Module Clearances */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>{isArabic ? 'صلاحيات الوحدات والوحدات المفعلة' : 'Assigned Administrative Modules'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSuperAdmin
                ? (isArabic ? 'بصفتك مسؤولاً أعلى، تمتلك صلاحية الوصول الكاملة إلى كافة الوحدات.' : 'As a Super Administrator, you have full access across all platform modules.')
                : (isArabic ? 'الوحدات المعتمدة والممنوحة لك من قبل المسؤول الأعلى.' : 'Modules authorized specifically for your coordinator delegation.')}
            </p>
          </div>

          <div className="space-y-2">
            {ADMIN_MODULES.map((mod) => {
              const isGranted = isSuperAdmin || allowedMenus.length === 0 || allowedMenus.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isGranted
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-50/30 dark:bg-slate-900/30 border-transparent text-slate-400 opacity-50'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold">
                      {isArabic ? mod.nameAr : mod.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {isArabic ? mod.descriptionAr : mod.description}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                      isGranted
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isGranted ? (isArabic ? 'مفعل' : 'Authorized') : (isArabic ? 'مقفل' : 'Locked')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Security & Change Password Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" />
              <span>{isArabic ? 'تغيير كلمة المرور والأمان' : 'Security & Change Password'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isArabic
                ? 'تحديث بيانات تسجيل الدخول الخاصة بحسابك الإداري بشكل فوري وآمن.'
                : 'Update your administrator credentials securely across all active sessions.'}
            </p>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'كلمة المرور الجديدة' : 'New Password (min 6 characters)'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {loading
                    ? (isArabic ? 'جاري التحديث...' : 'Updating Password...')
                    : (isArabic ? 'حفظ وتحديث كلمة المرور' : 'Update Credentials')}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
