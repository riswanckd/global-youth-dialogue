import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { DashboardStats, Application } from '../types';
import {
  Users,
  Mail,
  Lightbulb,
  BookOpen,
  Mic,
  Plus,
  Trash2,
  Bell,
  Check,
  X,
  FileText,
  MessageSquareQuote,
  Volume2,
  RotateCw,
} from 'lucide-react';

interface OutletContextType {
  openDeleteTrialModal?: () => void;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openDeleteTrialModal } = useOutletContext<OutletContextType>() || {};
  const { t, isArabic } = useAdminLanguage();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch admin dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiRequest<DashboardStats>('/admin/dashboard/stats').catch(() => null as any),
  });

  // Fetch pending applications with multi-source synchronization (MongoDB + Serverless + Local Cache)
  const { data: applications = [], refetch: refetchApps, isFetching: isFetchingApps } = useQuery<Application[]>({
    queryKey: ['admin-applications', 'pending'],
    refetchInterval: 5000, // Synchronize pending applications every 5 seconds
    queryFn: async () => {
      let remoteApps: Application[] = [];
      try {
        const res = await apiRequest<any>('/admin/applications?status=pending&limit=100');
        let items: any[] = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res && Array.isArray(res.data)) {
          items = res.data;
        }
        items.forEach((item: any) => {
          if (item && item.email) {
            remoteApps.push({
              id: item.id || item._id?.toString() || `app-${Date.now()}`,
              applicantName: item.applicantName || item.name || 'Applicant',
              email: item.email,
              country: item.country || 'Global',
              flag: item.flag || 'INT',
              organization: item.organization || '',
              experience: item.experience || item.debateExperience || '',
              motivation: item.motivation || '',
              areasOfInterest: item.areasOfInterest || item.interests || ['Global Affairs'],
              preferredLanguages: item.preferredLanguages || ['English'],
              status: (item.status || 'pending').toLowerCase() as any,
              emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
              createdAt: item.createdAt || item.date || new Date().toISOString(),
            });
          }
        });
      } catch {}

      // Fallback: Direct live backend call if apiRequest returned zero items
      if (remoteApps.length === 0) {
        try {
          const directRes = await fetch(
            'https://gyde-api.vercel.app/api/v1/admin/applications?status=pending&limit=100',
            {
              headers: {
                'Authorization': 'Bearer demo_admin_jwt_token_gyde',
                'x-client-app': 'admin',
              },
            }
          );
          if (directRes.ok) {
            const directJson = await directRes.json();
            const directItems = Array.isArray(directJson?.data)
              ? directJson.data
              : (Array.isArray(directJson) ? directJson : []);
            directItems.forEach((item: any) => {
              if (item && item.email) {
                remoteApps.push({
                  id: item.id || item._id?.toString() || `app-${Date.now()}`,
                  applicantName: item.applicantName || item.name || 'Applicant',
                  email: item.email,
                  country: item.country || 'Global',
                  flag: item.flag || 'INT',
                  organization: item.organization || '',
                  experience: item.experience || item.debateExperience || '',
                  motivation: item.motivation || '',
                  areasOfInterest: item.areasOfInterest || item.interests || ['Global Affairs'],
                  preferredLanguages: item.preferredLanguages || ['English'],
                  status: (item.status || 'pending').toLowerCase() as any,
                  emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
                  createdAt: item.createdAt || item.date || new Date().toISOString(),
                });
              }
            });
          }
        } catch {}
      }

      // Fallback: Query /applications
      if (remoteApps.length === 0) {
        try {
          const res2 = await apiRequest<any>('/applications?limit=100');
          let items2: any[] = [];
          if (Array.isArray(res2)) items2 = res2;
          else if (res2 && Array.isArray(res2.data)) items2 = res2.data;
          items2.forEach((item: any) => {
            if (item && item.email) {
              remoteApps.push({
                id: item.id || item._id?.toString() || `app-${Date.now()}`,
                applicantName: item.applicantName || item.name || 'Applicant',
                email: item.email,
                country: item.country || 'Global',
                flag: item.flag || 'INT',
                organization: item.organization || '',
                experience: item.experience || item.debateExperience || '',
                motivation: item.motivation || '',
                areasOfInterest: item.areasOfInterest || item.interests || ['Global Affairs'],
                preferredLanguages: item.preferredLanguages || ['English'],
                status: (item.status || 'pending').toLowerCase() as any,
                emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
                createdAt: item.createdAt || item.date || new Date().toISOString(),
              });
            }
          });
        } catch {}
      }

      // Query Vercel Serverless Function /api/applications
      try {
        const sRes = await fetch('/api/applications');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData)) {
            sData.forEach((item: any) => {
              if (item && item.email) {
                remoteApps.push({
                  id: item.id || item._id?.toString() || `app-${Date.now()}`,
                  applicantName: item.applicantName || item.name || 'Applicant',
                  email: item.email,
                  country: item.country || 'Global',
                  flag: item.flag || 'INT',
                  organization: item.organization || '',
                  experience: item.experience || item.debateExperience || '',
                  motivation: item.motivation || '',
                  areasOfInterest: item.areasOfInterest || item.interests || ['Global Affairs'],
                  preferredLanguages: item.preferredLanguages || ['English'],
                  status: (item.status || 'pending').toLowerCase() as any,
                  emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
                  createdAt: item.createdAt || item.date || new Date().toISOString(),
                });
              }
            });
          }
        }
      } catch {}

      // Check local shared applications cache
      let localApps: Application[] = [];
      try {
        const cached = localStorage.getItem('gyde_cached_applications');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localApps = parsed.map((item: any) => ({
              id: item.id || item._id?.toString() || `app-${Date.now()}`,
              applicantName: item.applicantName || item.name || 'Applicant',
              email: item.email,
              country: item.country || 'Global',
              flag: item.flag || 'INT',
              organization: item.organization || '',
              experience: item.experience || item.debateExperience || '',
              motivation: item.motivation || '',
              areasOfInterest: item.areasOfInterest || item.interests || ['Global Affairs'],
              preferredLanguages: item.preferredLanguages || ['English'],
              status: (item.status || 'pending').toLowerCase() as any,
              emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
              createdAt: item.createdAt || item.date || new Date().toISOString(),
            }));
          }
        }
      } catch {}

      const mergedMap = new Map<string, Application>();
      remoteApps.forEach((app) => {
        if (app && app.email) mergedMap.set(app.email.toLowerCase(), app);
      });
      localApps.forEach((app) => {
        if (!app || !app.email) return;
        const key = app.email.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, app);
        }
      });

      return Array.from(mergedMap.values()).filter(
        (a) => (a.status || '').toLowerCase() === 'pending'
      );
    },
  });

  // Approve / Decline mutation with direct live fallback and cache sync
  const updateAppMutation = useMutation({
    mutationFn: async ({ id, status, email }: { id: string; status: string; email?: string }) => {
      let remoteSuccess = false;
      try {
        await apiRequest(`/admin/applications/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, email }),
        });
        remoteSuccess = true;
      } catch (err) {
        console.warn('apiRequest error, trying direct live API fallback:', err);
      }

      if (!remoteSuccess) {
        try {
          const directRes = await fetch(`https://gyde-api.vercel.app/api/v1/admin/applications/${id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer demo_admin_jwt_token_gyde',
              'x-client-app': 'admin',
            },
            body: JSON.stringify({ status, email }),
          });
          if (directRes.ok) remoteSuccess = true;
        } catch {}
      }

      // Synchronize local shared applications cache immediately
      try {
        const raw = localStorage.getItem('gyde_cached_applications');
        if (raw) {
          const list = JSON.parse(raw);
          const targetEmail = (email || '').toLowerCase();
          const updated = list.map((a: Application) => {
            if (a.id === id || (targetEmail && a.email?.toLowerCase() === targetEmail)) {
              return { ...a, status };
            }
            return a;
          });
          localStorage.setItem('gyde_cached_applications', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast(
        vars.status === 'approved'
          ? t('dash.appApprovedToast', 'Application approved successfully.')
          : t('dash.appDeclinedToast', 'Application declined.')
      );
    },
    onError: () => {
      showToast(t('dash.localProcessed', 'Action processed locally.'));
    },
  });

  const activeMembersCount = stats?.totalMembers ?? 0;
  const pendingAppsCount = stats?.pendingApplications ?? applications.length;
  const topicLibraryCount = stats?.topicsInReview ?? 0;
  const academicPapersCount = stats?.publishedPapers ?? 0;

  // Real pending applications from API
  const displayApplications = applications;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1
          style={{ fontFamily: isArabic ? "'Noto Kufi Arabic', sans-serif" : "'Sora', sans-serif" }}
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          {t('dash.title', 'Coordinator Workspace')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          {t('dash.subtitle', 'Restricted Programme & Academic Administration (Qatar ISDC7 Founding Secretariat)')}
        </p>

        {/* Action Buttons: 2x2 grid on mobile, row on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-2.5 mt-3.5">
          {/* Notifications button */}
          <button
            onClick={() => navigate('/dashboard?notifications=open')}
            className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{t('dash.notificationsBtn', 'Notifications')}</span>
          </button>

          {/* Create Session (black pill) */}
          <button
            onClick={() => navigate('/sessions')}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 dark:hover:bg-white shadow-xs transition-all"
          >
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('dash.createSessionBtn', 'Create Session')}</span>
          </button>

          {/* + Add Topic (indigo pill) */}
          <button
            onClick={() => navigate('/topics?add=true')}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('dash.addTopicBtn', 'Add Topic')}</span>
          </button>

          {/* Delete Trial Data (red outline pill) */}
          <button
            onClick={() => openDeleteTrialModal && openDeleteTrialModal()}
            className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full border border-rose-300 dark:border-rose-900 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-xs transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{t('dash.deleteTrialBtn', 'Delete Trial Data')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 pt-1">
        {/* Card 1: Active Members */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeMembersCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {t('dash.kpiActiveMembers', 'Active Members')}
            </div>
          </div>
        </div>

        {/* Card 2: Pending Applications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FEF3C7] dark:bg-amber-950/60 text-[#B45309] dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {pendingAppsCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {t('dash.kpiPendingApps', 'Pending Applications')}
            </div>
          </div>
        </div>

        {/* Card 3: Topic Library */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {topicLibraryCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {t('dash.kpiTopicLibrary', 'Topic Library')}
            </div>
          </div>
        </div>

        {/* Card 4: Academic Papers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {academicPapersCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {t('dash.kpiAcademicPapers', 'Academic Papers')}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout (Pending Applications & Coordinator Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2">
        {/* Left (Wider): Pending Membership Applications */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('dash.pendingHeader', 'Pending Membership Applications')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetchApps()}
                disabled={isFetchingApps}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
                title="Sync pending applications"
              >
                <RotateCw className={`w-3 h-3 ${isFetchingApps ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isFetchingApps ? 'Syncing...' : 'Sync'}</span>
              </button>
              <Link
                to="/applications"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                {t('dash.manageAll', 'Manage All')}
              </Link>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {displayApplications.length === 0 ? (
              <div className="py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800">
                <Mail className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {t('dash.noPending', 'No pending membership applications.')}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('dash.noPendingDesc', 'New submissions from prospective youth scholars and fellows will appear here for review.')}
                </p>
              </div>
            ) : (
              displayApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {app.applicantName} ({app.country || t('dash.global', 'Global')})
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {app.organization || app.experience || t('dash.applicantFallback', 'Applicant')}
                    </div>
                    {app.motivation && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 font-serif">
                        &quot;{app.motivation}&quot;
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateAppMutation.mutate({ id: app.id, status: 'approved', email: app.email })}
                      disabled={updateAppMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t('dash.approve', 'Approve')}</span>
                    </button>
                    <button
                      onClick={() => updateAppMutation.mutate({ id: app.id, status: 'rejected', email: app.email })}
                      disabled={updateAppMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t('dash.decline', 'Decline')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Coordinator Actions */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {t('dash.coordinatorActions', 'Coordinator Actions')}
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <Link
              to="/sessions"
              className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <span className="line-clamp-2 leading-snug">{t('dash.actionCreateSession', 'Create New Session')}</span>
            </Link>

            <Link
              to="/session-summaries"
              className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="line-clamp-2 leading-snug">{t('dash.actionDraftSummary', 'Draft Academic Summary')}</span>
            </Link>

            <Link
              to="/feedback"
              className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-purple-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquareQuote className="w-4 h-4" />
              </div>
              <span className="line-clamp-2 leading-snug">{t('dash.actionInspectFeedback', 'Inspect Feedback Reviews')}</span>
            </Link>

            <button
              onClick={() => showToast(t('dash.announcementToast', 'Announcement composer opened.'))}
              className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group text-left rtl:text-right"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="line-clamp-2 leading-snug">{t('dash.actionPostAnnouncement', 'Post Community Announcement')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
