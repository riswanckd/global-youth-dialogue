import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest, getStoredAdminToken } from '../utils/api';
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
  Eye,
} from 'lucide-react';

interface OutletContextType {
  openDeleteTrialModal?: () => void;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openDeleteTrialModal } = useOutletContext<OutletContextType>() || {};
  const { t, isArabic, translateCategory } = useAdminLanguage();
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

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
          const token = getStoredAdminToken();
          const directRes = await fetch(
            'https://gyde-api.vercel.app/api/v1/admin/applications?status=pending&limit=100',
            {
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

  // Approve / Decline mutation with instant optimistic UI update, live backend sync, and cache sync
  const updateAppMutation = useMutation({
    onMutate: async ({ id, status, email }: { id: string; status: string; email?: string; approvePresenter?: boolean; scope?: string; notes?: string }) => {
      // 0ms Optimistic UI removal from pending queue
      queryClient.setQueryData<Application[]>(['admin-applications', 'pending'], (old = []) =>
        old.filter((a) => a.id !== id && (email ? a.email?.toLowerCase() !== email.toLowerCase() : true))
      );
      showToast(
        status === 'approved'
          ? t('dash.appApprovedToast', 'Application approved successfully.')
          : t('dash.appDeclinedToast', 'Application declined.')
      );
    },
    mutationFn: async ({ id, status, email, approvePresenter = false, scope = 'membership', notes }: { id: string; status: string; email?: string; approvePresenter?: boolean; scope?: string; notes?: string }) => {
      let remoteSuccess = false;
      try {
        await apiRequest(`/admin/applications/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, email, approvePresenter, scope, reviewNotes: notes }),
        });
        remoteSuccess = true;
      } catch (err) {
        console.warn('apiRequest error, trying direct live API fallback:', err);
      }

      if (!remoteSuccess) {
        try {
          const token = getStoredAdminToken();
          const directRes = await fetch(`https://gyde-api.vercel.app/api/v1/admin/applications/${id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              'x-client-app': 'admin',
            },
            body: JSON.stringify({ status, email, approvePresenter, scope, reviewNotes: notes }),
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
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
                  className="rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors"
                >
                  <div
                    className="cursor-pointer group flex-1 min-w-0"
                    onClick={() => {
                      setSelectedAppForReview(app);
                      setReviewNotes(app.reviewNotes || '');
                    }}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {app.applicantName} ({app.country || t('dash.global', 'Global')})
                      </span>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        <span>{t('dash.review', 'Review')}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {app.organization || app.experience || t('dash.applicantFallback', 'Applicant')}
                    </div>
                    {app.motivation && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 font-serif line-clamp-2">
                        &quot;{app.motivation}&quot;
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAppForReview(app);
                        setReviewNotes(app.reviewNotes || '');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      title={isArabic ? 'مراجعة ملف وتفاصيل المتقدم الكاملة' : 'Review applicant details, interests, and motivation'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('dash.review', 'Review')}</span>
                    </button>
                    <button
                      onClick={() => updateAppMutation.mutate({ id: app.id, status: 'approved', approvePresenter: false, scope: 'membership', email: app.email } as any)}
                      disabled={updateAppMutation.isPending}
                      className="px-3.5 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      title={isArabic ? 'اعتماد العضوية (صلاحيات عضو فقط)' : 'Approve Membership (Member Access Only)'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t('dash.approve', 'Approve')}</span>
                    </button>
                    <button
                      onClick={() => updateAppMutation.mutate({ id: app.id, status: 'rejected', scope: 'membership', email: app.email } as any)}
                      disabled={updateAppMutation.isPending}
                      className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
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

      {/* Review Applicant Details & Dossier Modal */}
      {selectedAppForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedAppForReview.applicantName}
                  </h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {isArabic ? 'بانتظار المراجعة والاعتماد' : 'Pending Review'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedAppForReview.email}</span>
                  <span>•</span>
                  <span>{selectedAppForReview.country || t('dash.global', 'Global')}</span>
                  <span>•</span>
                  <span>{selectedAppForReview.organization || t('apps.independent', 'Independent Scholar')}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAppForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Profile Details Grid (Except Password) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'الاسم الكامل:' : 'Full Applicant Name:'}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.applicantName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'الدولة والوفد:' : 'Country & Delegation:'}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.country || 'Global'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'المؤسسة أو الجامعة:' : 'Institution / Organization:'}</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.organization || t('apps.independent', 'Independent Scholar')}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'اللغات المفضلة:' : 'Preferred Working Languages:'}</span>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5 font-medium">
                  {selectedAppForReview.preferredLanguages?.join(', ') || 'English, Arabic'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{isArabic ? 'تاريخ تقديم الطلب:' : 'Application Submitted:'}</span>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5 font-medium">
                  {selectedAppForReview.createdAt ? new Date(selectedAppForReview.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </p>
              </div>
            </div>

            {/* Academic Spheres of Interest */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isArabic ? 'المجالات والمحاور المعرفية ذات الاهتمام' : 'Thematic Knowledge Disciplines & Spheres of Interest'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {selectedAppForReview.areasOfInterest && selectedAppForReview.areasOfInterest.length > 0 ? (
                  selectedAppForReview.areasOfInterest.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {translateCategory ? translateCategory(area) : area}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">{isArabic ? 'عام — كافة مجالات الحوار الدولي' : 'General — International Dialogue & Global Affairs'}</span>
                )}
              </div>
            </div>

            {/* Motivation for Joining GYDE (Personal Motive & Statement) */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-purple-500" />
                <span>{isArabic ? 'رسالة الاهتمام والدافع للانضمام للمجتمع' : 'Motivation for Joining GYDE (Personal Statement)'}</span>
              </h4>
              <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-purple-50/40 dark:bg-purple-950/20 p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/50 font-serif italic">
                {selectedAppForReview.motivation ? (
                  `"${selectedAppForReview.motivation}"`
                ) : (
                  <span className="text-slate-400 not-italic">{isArabic ? 'لم يتم تقديم رسالة دافع مفصلة.' : 'No detailed motivation statement provided.'}</span>
                )}
              </div>
            </div>

            {/* Dialogue & Academic Experience */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isArabic ? 'الخبرة الحوارية والأكاديمية السابقة' : 'Dialogue, Research & Academic Experience'}</span>
              </h4>
              <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {selectedAppForReview.experience || (
                  <span className="text-slate-400 italic">{isArabic ? 'لم تذكر خبرات سابقة.' : 'No prior debate or academic experience listed.'}</span>
                )}
              </div>
            </div>

            {/* Keynote Presenter Proposal Dossier (if candidate applied for Presenter role) */}
            {selectedAppForReview.presenterProposal?.proposedTopic && (
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    {isArabic ? 'طلب اعتماد متحدث رئيسي' : 'Keynote Presenter Accreditation Proposal'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'الموضوع المقترح:' : 'Proposed Topic:'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.presenterProposal.proposedTopic}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'المجال:' : 'Sphere:'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedAppForReview.presenterProposal.sphere}</p>
                  </div>
                </div>
                {selectedAppForReview.presenterProposal.statementOfIntent && (
                  <p className="text-xs text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/60">
                    {selectedAppForReview.presenterProposal.statementOfIntent}
                  </p>
                )}
              </div>
            )}

            {/* Internal Secretariat Deliberation Notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isArabic ? 'ملاحظات المنسق الداخلية (اختياري للتدقيق)' : 'Secretariat Review Notes (Internal Audit)'}
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={isArabic ? 'أدخل ملاحظات التقييم أو معايير القبول...' : 'Enter observations, dialogue suitability, or deliberation rationale...'}
                rows={2}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedAppForReview(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updateAppMutation.isPending}
                  onClick={() => {
                    updateAppMutation.mutate({
                      id: selectedAppForReview.id,
                      status: 'rejected',
                      email: selectedAppForReview.email,
                      notes: reviewNotes,
                    } as any);
                    setSelectedAppForReview(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isArabic ? 'رفض الطلب' : 'Reject / Decline'}</span>
                </button>

                <button
                  type="button"
                  disabled={updateAppMutation.isPending}
                  onClick={() => {
                    updateAppMutation.mutate({
                      id: selectedAppForReview.id,
                      status: 'approved',
                      email: selectedAppForReview.email,
                      approvePresenter: false,
                      scope: 'membership',
                      notes: reviewNotes,
                    } as any);
                    setSelectedAppForReview(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isArabic ? 'الموافقة واعتماد العضوية' : 'Approve Membership'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
