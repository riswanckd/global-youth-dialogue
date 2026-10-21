import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest, getStoredAdminToken } from '../utils/api';
import { Application } from '../types';
import {
  Inbox,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  RotateCw,
  Mic,
  Award,
  FileText,
  X,
  Trash2,
} from 'lucide-react';

function mapRawToApp(item: any): Application {
  const hasValidPresenterTopic = Boolean(item.presenterProposal?.proposedTopic);
  return {
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
    isApprovedPresenter: item.isApprovedPresenter !== undefined ? item.isApprovedPresenter : Boolean(hasValidPresenterTopic && item.presenterProposal?.status === 'approved'),
    presenterProposal: hasValidPresenterTopic ? item.presenterProposal : undefined,
    reviewNotes: item.reviewNotes || '',
    emailVerified: item.emailVerified !== undefined ? item.emailVerified : true,
    createdAt: item.createdAt || item.date || new Date().toISOString(),
  };
}

export const Applications: React.FC = () => {
  const queryClient = useQueryClient();
  const { isArabic, t, translateStatus, translateCategory } = useAdminLanguage();
  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter') || searchParams.get('type') || searchParams.get('tab');
  const urlId = searchParams.get('id') || searchParams.get('appId');

  const [statusFilter, setStatusFilter] = useState<string>(urlFilter === 'presenter' ? 'presenter' : (urlFilter || 'all'));
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isPresenter, setIsPresenter] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cross-portal real-time storage listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gyde_cached_applications' || !e.key) {
        queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient]);

  const { data: applications = [], isLoading, refetch, isFetching } = useQuery<Application[]>({
    queryKey: ['admin-applications'],
    refetchInterval: 5000, // Synchronize incoming applications every 5 seconds
    queryFn: async () => {
      let remoteApps: Application[] = [];

      // 1. Primary Query: /admin/applications with limit=200
      try {
        const res = await apiRequest<any>(
          `/admin/applications?limit=200`
        );
        let items: any[] = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res && Array.isArray(res.data)) {
          items = res.data;
        }
        items.forEach((item: any) => {
          if (item && item.email) {
            remoteApps.push(mapRawToApp(item));
          }
        });
      } catch (err) {
        console.warn('Could not query /admin/applications:', err);
      }

      // 2. Fallback Query: direct live backend call if apiRequest had zero results
      if (remoteApps.length === 0) {
        try {
          const token = getStoredAdminToken();
          const directRes = await fetch(
            `https://gyde-api.vercel.app/api/v1/admin/applications?limit=200`,
            {
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'x-client-app': 'admin',
              },
            }
          );
          if (directRes.ok) {
            const directJson = await directRes.json();
            const directItems = Array.isArray(directJson?.data) ? directJson.data : (Array.isArray(directJson) ? directJson : []);
            directItems.forEach((item: any) => {
              if (item && item.email) {
                remoteApps.push(mapRawToApp(item));
              }
            });
          }
        } catch {}
      }

      // 3. Query Vercel Serverless Function /api/applications (if running on same domain)
      try {
        const sRes = await fetch('/api/applications');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData)) {
            sData.forEach((item: any) => {
              if (item && item.email) {
                remoteApps.push(mapRawToApp(item));
              }
            });
          }
        }
      } catch {}

      // 4. Check local shared applications cache (inter-connected across web & admin)
      let localApps: Application[] = [];
      try {
        const cached = localStorage.getItem('gyde_cached_applications');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localApps = parsed.map((item: any) => mapRawToApp(item));
          }
        }
      } catch {}

      // Merge remote and local applications seamlessly
      const mergedMap = new Map<string, Application>();
      remoteApps.forEach((app) => {
        if (app && app.email) mergedMap.set(app.email.toLowerCase(), app);
      });
      localApps.forEach((app) => {
        if (!app || !app.email) return;
        const key = app.email.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, app);
        } else {
          // If local has newer presenter proposal, preserve it
          const remote = mergedMap.get(key)!;
          if (app.presenterProposal && !remote.presenterProposal) {
            mergedMap.set(key, { ...remote, presenterProposal: app.presenterProposal });
          }
        }
      });

      const all = Array.from(mergedMap.values());
      try {
        localStorage.setItem('gyde_cached_applications', JSON.stringify(all));
      } catch {}

      return all;
    },
  });

  // Handle URL deep-linking for direct notifications
  useEffect(() => {
    if (urlFilter) {
      setStatusFilter(urlFilter.toLowerCase());
    }
    if (urlId && applications.length > 0) {
      const target = applications.find((a) => a.id === urlId || (a as any)._id === urlId);
      if (target) {
        setSelectedApp(target);
        setReviewNotes(target.reviewNotes || '');
        setIsPresenter(target.isApprovedPresenter || Boolean(target.presenterProposal?.proposedTopic));
      }
    }
  }, [urlFilter, urlId, applications]);

  const updateMutation = useMutation({
    onMutate: async ({
      id,
      status,
      email,
      approvePresenter,
      scope,
    }: {
      id: string;
      status: string;
      notes?: string;
      approvePresenter?: boolean;
      scope?: 'membership' | 'presenter';
      email?: string;
    }) => {
      const targetEmail = (email || selectedApp?.email || '').toLowerCase();
      const nextStatus = status === 'declined' ? 'rejected' : status;
      const isPresApproval = approvePresenter === true;
      const isPresReject = scope === 'presenter';

      // Optimistic update in 0ms across all views
      queryClient.setQueryData<Application[]>(['admin-applications'], (old = []) =>
        old.map((a) => {
          if (a.id === id || (targetEmail && a.email?.toLowerCase() === targetEmail)) {
            const nextPresenterStatus = isPresApproval ? 'approved' : (nextStatus === 'rejected' ? 'rejected' : a.presenterProposal?.status);
            return {
              ...a,
              status: isPresReject ? a.status : (nextStatus as any),
              isApprovedPresenter: isPresApproval ? true : (nextStatus === 'rejected' ? false : a.isApprovedPresenter),
              presenterProposal: a.presenterProposal
                ? {
                    ...a.presenterProposal,
                    status: nextPresenterStatus as any,
                  }
                : undefined,
            };
          }
          return a;
        })
      );
      showToast(
        isPresApproval
          ? (isArabic ? 'تم اعتماد المتحدث وترقية الصلاحيات بنجاح.' : 'Presenter accredited & role elevated successfully.')
          : nextStatus === 'approved'
          ? t('dash.appApprovedToast', 'Application approved successfully.')
          : t('dash.appDeclinedToast', 'Application declined / denied.')
      );
    },
    mutationFn: async ({
      id,
      status,
      notes,
      approvePresenter,
      scope,
      email,
    }: {
      id: string;
      status: string;
      notes?: string;
      approvePresenter?: boolean;
      scope?: 'membership' | 'presenter';
      email?: string;
    }) => {
      const targetEmail = (email || selectedApp?.email || '').toLowerCase();
      const assignRole = approvePresenter ? 'PRESENTER' : undefined;
      let remoteSuccess = false;

      // 1. Remote API call with direct live backend fallback
      try {
        await apiRequest(`/admin/applications/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({
            status,
            reviewNotes: notes,
            assignRole,
            isApprovedPresenter: approvePresenter,
            scope,
            email: targetEmail,
          }),
        });
        remoteSuccess = true;
      } catch (err) {
        console.warn('Remote status update error via apiRequest, trying direct live fallback:', err);
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
            body: JSON.stringify({
              status,
              reviewNotes: notes,
              assignRole,
              isApprovedPresenter: approvePresenter,
              scope,
              email: targetEmail,
            }),
          });
          if (directRes.ok) remoteSuccess = true;
        } catch {}
      }

      // 2. Local shared cache update
      try {
        const raw = localStorage.getItem('gyde_cached_applications');
        if (raw) {
          const list = JSON.parse(raw);
          const nextStatus = status === 'declined' ? 'rejected' : status;
          const isPresApproval = approvePresenter === true;
          const isPresReject = scope === 'presenter';
          const updated = list.map((a: Application) => {
            if (a.id === id || (targetEmail && a.email?.toLowerCase() === targetEmail)) {
              return {
                ...a,
                status: isPresReject ? a.status : nextStatus,
                reviewNotes: notes !== undefined ? notes : a.reviewNotes,
                isApprovedPresenter: isPresApproval ? true : (nextStatus === 'rejected' ? false : a.isApprovedPresenter),
                presenterProposal: a.presenterProposal
                  ? {
                      ...a.presenterProposal,
                      status: isPresApproval ? 'approved' : (nextStatus === 'rejected' ? 'rejected' : a.presenterProposal.status),
                    }
                  : undefined,
              };
            }
            return a;
          });
          localStorage.setItem('gyde_cached_applications', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}

      // If presenter approved, also update user session role if active
      if (approvePresenter) {
        try {
          const storedSession = localStorage.getItem('gyde_user_session');
          if (storedSession) {
            const parsed = JSON.parse(storedSession);
            if (parsed.email?.toLowerCase() === targetEmail) {
              parsed.role = 'PRESENTER';
              localStorage.setItem('gyde_user_session', JSON.stringify(parsed));
            }
          }
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelectedApp(null);
      setReviewNotes('');
      setIsPresenter(false);
    },
  });

  const deleteApplicationMutation = useMutation({
    onMutate: (app: Application) => {
      const targetId = app.id || (app as any)._id;
      const targetEmail = app.email?.toLowerCase();
      // Optimistic cache update
      queryClient.setQueryData<Application[]>(['admin-applications'], (old = []) =>
        old.filter((a) => (a.id || (a as any)._id) !== targetId && a.email?.toLowerCase() !== targetEmail)
      );
      try {
        const raw = localStorage.getItem('gyde_cached_applications');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const updated = list.filter((a: any) => (a.id || a._id) !== targetId && a.email?.toLowerCase() !== targetEmail);
            localStorage.setItem('gyde_cached_applications', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch {}
      setSelectedApp(null);
    },
    mutationFn: async (app: Application) => {
      const targetId = app.id || (app as any)._id;
      let success = false;
      try {
        await apiRequest(`/admin/applications/${targetId}`, { method: 'DELETE' });
        success = true;
      } catch (err) {
        console.warn('API delete application failed on /admin/applications:', err);
      }
      if (!success && app.email) {
        try {
          await apiRequest(`/admin/applications/${encodeURIComponent(app.email)}`, { method: 'DELETE' });
          success = true;
        } catch {}
      }
      if (!success) {
        try {
          await apiRequest(`/applications/${targetId}`, { method: 'DELETE' });
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelectedApp(null);
    },
  });

  const pendingPresenterCount = applications.filter(
    (a) =>
      Boolean((a as any).presenterProposal?.proposedTopic) &&
      ((a as any).presenterProposal?.status === 'pending' || !a.isApprovedPresenter)
  ).length;

  const pendingMemberCount = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'pending' && !(a as any).presenterProposal?.proposedTopic
  ).length;
  const underReviewCount = applications.filter((a) => (a.status || '').toLowerCase() === 'under_review').length;
  const approvedCount = applications.filter((a) => (a.status || '').toLowerCase() === 'approved').length;
  const rejectedCount = applications.filter((a) => ['rejected', 'declined'].includes((a.status || '').toLowerCase())).length;

  const filtered = applications.filter((app) => {
    if (!app) return false;
    const st = (app.status || '').toLowerCase();
    const hasPresenterProposal = Boolean(
      (app as any).presenterProposal?.proposedTopic &&
      ((app as any).presenterProposal?.status === 'pending' || !app.isApprovedPresenter)
    );

    if (statusFilter === 'presenter') {
      if (!hasPresenterProposal && !(app as any).presenterProposal?.proposedTopic) return false;
    } else if (statusFilter === 'rejected') {
      if (!['rejected', 'declined'].includes(st)) return false;
    } else if (statusFilter === 'pending') {
      if (st !== 'pending' && !hasPresenterProposal) return false;
    } else if (statusFilter !== 'all') {
      if (st !== statusFilter.toLowerCase()) return false;
    }
    const q = search.toLowerCase();
    const name = (app.applicantName || (app as any).name || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const country = (app.country || '').toLowerCase();
    const topic = ((app as any).presenterProposal?.proposedTopic || '').toLowerCase();
    return name.includes(q) || email.includes(q) || country.includes(q) || topic.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('apps.title', 'Applicant Dossiers & Vetting')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('apps.subtitle', 'Review and deliberate on incoming membership requests from international youth scholars.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Live Sync</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {t('apps.totalDossiers', 'Total Dossiers')}: {applications.length}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid (2x3 on mobile, 6 in a row on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Dossiers */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {applications.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.totalDossiers', 'Total Dossiers')}
            </div>
          </div>
        </div>

        {/* Presenter Requests */}
        <div
          onClick={() => setStatusFilter('presenter')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'presenter' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-purple-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 leading-tight">
              {pendingPresenterCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {isArabic ? 'طلبات المتحدثين' : 'Presenter Requests'}
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-amber-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
              {pendingMemberCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabPending', 'Pending')}
            </div>
          </div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => setStatusFilter('under_review')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'under_review' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-purple-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 leading-tight">
              {underReviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabUnderReview', 'Under Review')}
            </div>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
              {approvedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabApproved', 'Approved')}
            </div>
          </div>
        </div>

        {/* Rejected / Denied */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={`cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group transition-all ${
            statusFilter === 'rejected' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-100 dark:border-slate-800 hover:border-rose-200'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 leading-tight">
              {rejectedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabRejected', 'Declined / Denied')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            placeholder={t('apps.searchPlaceholder', 'Search by name, email, or country...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t('common.all', 'All') },
            { id: 'presenter', label: `${isArabic ? 'طلبات المتحدثين' : 'Presenter Requests'} (${pendingPresenterCount})` },
            { id: 'pending', label: `${t('apps.tabPending', 'Pending')} (${pendingMemberCount})` },
            { id: 'under_review', label: `${t('apps.tabUnderReview', 'Under Review')} (${underReviewCount})` },
            { id: 'approved', label: `${t('apps.tabApproved', 'Approved')} (${approvedCount})` },
            { id: 'rejected', label: `${t('apps.tabRejected', 'Declined')} (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading applicant records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('apps.noApps', 'No applications found matching the selected criteria.')}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('apps.colApplicant', 'Applicant')}</th>
                    <th className="py-3 px-4">{t('apps.colCountry', 'Country & Inst.')}</th>
                    <th className="py-3 px-4">{t('apps.interests', 'Interests')}</th>
                    <th className="py-3 px-4">{t('apps.colStatus', 'Status')}</th>
                    <th className="py-3 px-4">{t('apps.date', 'Submitted')}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{t('apps.colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">{app.applicantName}</span>
                          {app.presenterProposal?.proposedTopic ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <Mic className="w-3 h-3" />
                              <span>{isArabic ? 'طلب متحدث' : 'Presenter Request'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{isArabic ? 'طلب عضوية' : 'Membership Application'}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{app.email}</div>
                        {app.presenterProposal?.proposedTopic && (
                          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold line-clamp-1 mt-0.5" title={app.presenterProposal.proposedTopic}>
                            {app.presenterProposal.proposedTopic}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div>{app.country}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {app.organization || t('apps.independent', 'Independent')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {app.areasOfInterest?.slice(0, 2).map((a: string, i: number) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate"
                            >
                              {translateCategory(a)}
                            </span>
                          ))}
                          {app.areasOfInterest?.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{app.areasOfInterest.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : app.status === 'under_review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {app.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {app.status === 'pending' && <Clock className="w-3 h-3" />}
                          {translateStatus(app.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right rtl:text-left">
                        <div className="inline-flex items-center gap-1.5 justify-end flex-wrap">
                          {/* Presenter Quick Approve - exclusively for existing members with pending proposal */}
                          {app.presenterProposal?.proposedTopic && app.presenterProposal.status === 'pending' && (
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: app.id,
                                  status: 'approved',
                                  approvePresenter: true,
                                  scope: 'presenter',
                                  email: app.email,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
                              title={isArabic ? 'اعتماد كمتحدث رسمي' : 'Approve Presenter Accreditation'}
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'اعتماد كمتحدث' : 'Approve Presenter'}</span>
                            </button>
                          )}
                          {(app.status === 'pending' || app.status === 'under_review') && (
                            <>
                              <button
                                type="button"
                                disabled={updateMutation.isPending}
                                onClick={() => updateMutation.mutate({ id: app.id, status: 'approved', approvePresenter: false, scope: 'membership', email: app.email })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                                title="Approve Membership"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{t('dash.approve', 'Approve')}</span>
                              </button>
                              <button
                                type="button"
                                disabled={updateMutation.isPending}
                                onClick={() => updateMutation.mutate({ id: app.id, status: 'rejected', scope: 'membership', email: app.email })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                                title="Decline / Deny"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t('dash.decline', 'Decline')}</span>
                              </button>
                            </>
                          )}
                          {app.status === 'approved' && !app.presenterProposal && (
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() => updateMutation.mutate({ id: app.id, status: 'rejected', email: app.email })}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                              title="Revoke / Deny"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t('dash.revoke', 'Revoke')}</span>
                            </button>
                          )}
                          {(app.status === 'rejected' || (app.status as any) === 'declined') && (
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() => updateMutation.mutate({ id: app.id, status: 'approved', email: app.email })}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                              title="Re-Approve"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('dash.reApprove', 'Re-Approve')}</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setReviewNotes(app.reviewNotes || '');
                              setIsPresenter(Boolean(app.isApprovedPresenter && app.presenterProposal?.proposedTopic));
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('apps.reviewBtn', 'Inspect')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Permanently delete application for "${app.applicantName}" (${app.email})?`)) {
                                deleteApplicationMutation.mutate(app);
                              }
                            }}
                            disabled={deleteApplicationMutation.isPending}
                            className="p-1 text-xs font-semibold rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {app.applicantName}
                        </h4>
                        {app.presenterProposal?.proposedTopic ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                            <Mic className="w-2.5 h-2.5" />
                            <span>{isArabic ? 'طلب متحدث' : 'Presenter Request'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>{isArabic ? 'طلب عضوية' : 'Membership Application'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{app.email}</p>
                      {app.presenterProposal?.proposedTopic && (
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          {app.presenterProposal.proposedTopic}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : app.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {translateStatus(app.status)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{app.country} • {app.organization || t('apps.independent', 'Independent')}</span>
                    <span className="text-[10px] text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  {app.areasOfInterest && app.areasOfInterest.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {app.areasOfInterest.map((a: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {translateCategory(a)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {/* Mobile Presenter Quick Approve - only for existing members with pending proposal */}
                    {app.presenterProposal?.proposedTopic && app.presenterProposal.status === 'pending' && (
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            id: app.id,
                            status: 'approved',
                            approvePresenter: true,
                            scope: 'presenter',
                            email: app.email,
                          })
                        }
                        className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'اعتماد كمتحدث رسمي' : 'Approve Presenter Role'}</span>
                      </button>
                    )}
                    {(app.status === 'pending' || app.status === 'under_review') && (
                      <>
                        <button
                          type="button"
                          disabled={updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: app.id, status: 'approved', approvePresenter: false, scope: 'membership', email: app.email })}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('dash.approve', 'Approve')}</span>
                        </button>
                        <button
                          type="button"
                          disabled={updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: app.id, status: 'rejected', scope: 'membership', email: app.email })}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t('dash.decline', 'Decline')}</span>
                        </button>
                      </>
                    )}
                    {app.status === 'approved' && !app.presenterProposal && (
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: app.id, status: 'rejected', email: app.email })}
                        className="flex-1 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('dash.revoke', 'Revoke')}</span>
                      </button>
                    )}
                    {(app.status === 'rejected' || (app.status as any) === 'declined') && (
                      <button
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: app.id, status: 'approved', email: app.email })}
                        className="flex-1 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('dash.reApprove', 'Re-Approve')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setReviewNotes(app.reviewNotes || '');
                        setIsPresenter(app.isApprovedPresenter || Boolean(app.presenterProposal));
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('apps.reviewBtn', 'Inspect')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Permanently delete application for "${app.applicantName}" (${app.email})?`)) {
                          deleteApplicationMutation.mutate(app);
                        }
                      }}
                      disabled={deleteApplicationMutation.isPending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Inspect / Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedApp.applicantName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedApp.email} • {selectedApp.country} • {selectedApp.organization || t('apps.independent', 'Independent')}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Alert Banner */}
            {selectedApp.status === 'rejected' || (selectedApp.status as any) === 'declined' ? (
              <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-semibold">
                <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>This application dossier is currently <strong>Declined / Denied</strong>. You can update review notes or re-approve below.</span>
              </div>
            ) : selectedApp.status === 'approved' ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>This application dossier is currently <strong>Approved & Onboarded</strong>.</span>
              </div>
            ) : null}

            {/* Presenter Accreditation Dossier (ONLY if existing member applied for Presenter role with proposed topic) */}
            {selectedApp.presenterProposal?.proposedTopic ? (
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                        {isArabic ? 'ملف اعتماد المتحدث الرسمي' : 'Presenter Accreditation Dossier'}
                      </h4>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300">
                        {isArabic ? 'طلب ترقية للدور وإلقاء كلمة افتتاحية' : 'Role Elevation & Keynote Presentation Application'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedApp.presenterProposal.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedApp.presenterProposal.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {selectedApp.presenterProposal.status === 'approved'
                      ? (isArabic ? 'معتمد' : 'Approved')
                      : selectedApp.presenterProposal.status === 'rejected'
                      ? (isArabic ? 'مرفوض' : 'Rejected')
                      : (isArabic ? 'بانتظار المراجعة' : 'Pending Review')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'الموضوع المقترح:' : 'Proposed Topic:'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedApp.presenterProposal.proposedTopic}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'المجال الأكاديمي:' : 'Sphere / Domain:'}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{selectedApp.presenterProposal.sphere}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'صيغة العرض:' : 'Preferred Format:'}</span>
                    <p className="text-slate-700 dark:text-slate-200 mt-0.5">{selectedApp.presenterProposal.preferredFormat}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">{isArabic ? 'الفرع / الوفد:' : 'Chapter Delegation:'}</span>
                    <p className="text-slate-700 dark:text-slate-200 mt-0.5">{selectedApp.presenterProposal.countryChapter || selectedApp.country}</p>
                  </div>
                </div>

                {selectedApp.presenterProposal.statementOfIntent && (
                  <div>
                    <span className="text-slate-400 font-semibold text-xs">{isArabic ? 'بيان النوايا والأهداف:' : 'Statement of Intent / Abstract:'}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/60">
                      {selectedApp.presenterProposal.statementOfIntent}
                    </p>
                  </div>
                )}

                {selectedApp.presenterProposal.experience && selectedApp.presenterProposal.experience !== selectedApp.experience && (
                  <div>
                    <span className="text-slate-400 font-semibold text-xs">{isArabic ? 'الخبرة البحثية للمتحدث:' : 'Presenter Research Experience:'}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/60">
                      {selectedApp.presenterProposal.experience}
                    </p>
                  </div>
                )}

                {selectedApp.presenterProposal.dossierUrl && (
                  <div>
                    <span className="text-slate-400 font-semibold text-xs">{isArabic ? 'رابط الملف البحثي / العرض:' : 'Research Dossier / Slides URL:'}</span>
                    <div className="mt-1">
                      <a
                        href={selectedApp.presenterProposal.dossierUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 dark:text-indigo-400 underline font-semibold break-all"
                      >
                        {selectedApp.presenterProposal.dossierUrl} &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200">
                    {isArabic ? 'طلب عضوية رسمي (صلاحيات عضو فقط)' : 'Official Membership Application (Member Access Only)'}
                  </h4>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-0.5 leading-relaxed">
                    {isArabic
                      ? 'مقدم الطلب يتقدم بطلب عضوية في المجتمع. عند الاعتماد يحصل على صلاحيات عضو رسمي. يمكنه التقدم لطلب صفة متحدث رسمي لاحقاً بعد نيل العضوية.'
                      : 'Candidate is applying for community membership. Upon approval, they receive official Member access only. Presenter accreditation may only be requested post-membership from their portal.'}
                  </p>
                </div>
              </div>
            )}

            {/* Experience */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('apps.debateExperience', 'Dialogue & Academic Experience')}
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedApp.experience}
              </p>
            </div>

            {/* Motivation */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('apps.personalStatement', 'Motivation for Joining GYDE')}
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedApp.motivation}
              </p>
            </div>

            {/* Areas of interest */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('apps.interests', 'Academic Spheres of Interest')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.areasOfInterest?.map((area: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {translateCategory(area)}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliberation review notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('apps.coordinatorNotes', 'Secretariat Review Notes (Internal Audit)')}
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={t('apps.notesPlaceholder', 'Enter observations, dialogue chamber suitability, or deliberation rationale...')}
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Presenter Accreditation Checkbox - ONLY for existing members with a submitted proposal */}
            {selectedApp.presenterProposal?.proposedTopic && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/40">
                <input
                  type="checkbox"
                  id="modalPresenterCheck"
                  checked={isPresenter}
                  onChange={(e) => setIsPresenter(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="modalPresenterCheck" className="text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                  {t('apps.accreditPresenter', 'Accredit as Keynote Presenter (permits slide upload and motion presentations)')}
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {t('apps.closeModal', 'Close')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Permanently delete application for "${selectedApp.applicantName}" (${selectedApp.email})? This action cannot be undone.`)) {
                      deleteApplicationMutation.mutate(selectedApp);
                    }
                  }}
                  disabled={deleteApplicationMutation.isPending}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Permanently Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isArabic ? 'حذف الطلب نهائياً' : 'Delete Application'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Presenter decline button */}
                {selectedApp.presenterProposal?.proposedTopic && selectedApp.presenterProposal.status === 'pending' && (
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedApp.id,
                        status: 'rejected',
                        scope: 'presenter',
                        notes: reviewNotes,
                        email: selectedApp.email,
                      })
                    }
                    className="px-3.5 py-2 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 shadow-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isArabic ? 'رفض طلب المتحدث فقط' : 'Decline Presenter Only'}</span>
                  </button>
                )}

                {(selectedApp.status === 'pending' || selectedApp.status === 'under_review' || (selectedApp.status === 'approved' && !selectedApp.presenterProposal?.proposedTopic)) && (
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedApp.id,
                        status: 'rejected',
                        scope: 'membership',
                        notes: reviewNotes,
                        email: selectedApp.email,
                      })
                    }
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{selectedApp.status === 'approved' ? t('apps.revokeApp', 'Revoke / Deny') : t('apps.rejectApplication', 'Decline Application')}</span>
                  </button>
                )}

                {(selectedApp.status === 'rejected' || (selectedApp.status as any) === 'declined') && (
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedApp.id,
                        status: 'rejected',
                        scope: 'membership',
                        notes: reviewNotes,
                        email: selectedApp.email,
                      })
                    }
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm"
                  >
                    {t('apps.saveNotesOnly', 'Save Notes Only')}
                  </button>
                )}

                {/* Main Approval Button */}
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: 'approved',
                      notes: reviewNotes,
                      approvePresenter: Boolean(selectedApp.presenterProposal?.proposedTopic && isPresenter),
                      scope: selectedApp.presenterProposal?.proposedTopic ? 'presenter' : 'membership',
                      email: selectedApp.email,
                    })
                  }
                  className={`px-5 py-2 text-xs font-bold rounded-lg text-white shadow-sm flex items-center gap-1.5 ${
                    selectedApp.presenterProposal?.proposedTopic && isPresenter
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedApp.presenterProposal?.proposedTopic && isPresenter
                      ? (isArabic ? 'اعتماد المتحدث وترقية الصلاحيات' : 'Approve & Accredit Presenter')
                      : selectedApp.status === 'approved'
                      ? t('apps.updateAccreditation', 'Update Accreditation')
                      : selectedApp.status === 'rejected'
                      ? t('apps.reApproveApp', 'Re-Approve Membership')
                      : (isArabic ? 'اعتماد العضوية (صلاحيات عضو)' : 'Approve Membership (Member Access Only)')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
