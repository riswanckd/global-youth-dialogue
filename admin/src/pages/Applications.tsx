import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
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
  X
} from 'lucide-react';

export const Applications: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateStatus, translateCategory } = useAdminLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isPresenter, setIsPresenter] = useState(false);

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

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['admin-applications', statusFilter],
    queryFn: async () => {
      let remoteApps: Application[] = [];
      try {
        const res = await apiRequest<any>(
          `/admin/applications${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`
        );
        if (Array.isArray(res)) {
          remoteApps = res;
        } else if (res && Array.isArray(res.data)) {
          remoteApps = res.data;
        }
      } catch (err) {
        console.warn('Could not query /admin/applications:', err);
      }

      // If remote returned nothing, try querying /applications as resilient fallback
      if (remoteApps.length === 0) {
        try {
          const fallbackRes = await apiRequest<any>('/applications');
          if (Array.isArray(fallbackRes)) {
            remoteApps = fallbackRes;
          } else if (fallbackRes && Array.isArray(fallbackRes.data)) {
            remoteApps = fallbackRes.data;
          }
        } catch {}
      }

      // Check local shared applications cache (inter-connected across web & admin)
      let localApps: Application[] = [];
      try {
        const cached = localStorage.getItem('gyde_cached_applications');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localApps = parsed;
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
        const existing = mergedMap.get(app.email.toLowerCase());
        if (!existing) {
          mergedMap.set(app.email.toLowerCase(), app);
        } else if (app.status === 'pending' && existing.status !== 'pending') {
          mergedMap.set(app.email.toLowerCase(), { ...existing, ...app });
        }
      });

      const all = Array.from(mergedMap.values());
      try {
        localStorage.setItem('gyde_cached_applications', JSON.stringify(all));
      } catch {}

      if (statusFilter !== 'all') {
        return all.filter((a) => a.status === statusFilter);
      }
      return all;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
      approvePresenter,
    }: {
      id: string;
      status: string;
      notes?: string;
      approvePresenter?: boolean;
    }) => {
      // 1. Remote API call
      await apiRequest(`/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reviewNotes: notes, isApprovedPresenter: approvePresenter }),
      }).catch((err) => console.warn('Remote status update error:', err));

      // 2. Local shared cache update
      try {
        const raw = localStorage.getItem('gyde_cached_applications');
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.map((a: Application) => {
            if (a.id === id || a.email === selectedApp?.email) {
              return {
                ...a,
                status,
                reviewNotes: notes || a.reviewNotes,
                isApprovedPresenter: approvePresenter || a.isApprovedPresenter,
              };
            }
            return a;
          });
          localStorage.setItem('gyde_cached_applications', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedApp(null);
      setReviewNotes('');
      setIsPresenter(false);
    },
  });

  const filtered = applications.filter((app) => {
    if (!app) return false;
    const q = search.toLowerCase();
    const name = (app.applicantName || (app as any).name || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const country = (app.country || '').toLowerCase();
    return name.includes(q) || email.includes(q) || country.includes(q);
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const underReviewCount = applications.filter((a) => a.status === 'under_review').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="space-y-6">
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
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {t('apps.totalDossiers', 'Total Dossiers')}: {applications.length}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Dossiers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
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

        {/* Pending Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {pendingCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabPending', 'Pending')}
            </div>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {underReviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabUnderReview', 'Under Review')}
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {approvedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('apps.tabApproved', 'Approved')}
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
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {translateStatus(st)}
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
                        <div className="font-bold text-slate-900 dark:text-white">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-500">{app.email}</div>
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
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewNotes(app.reviewNotes || '');
                            setIsPresenter(app.isApprovedPresenter || false);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('apps.reviewBtn', 'Inspect')}</span>
                        </button>
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
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {app.applicantName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{app.email}</p>
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

                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setReviewNotes(app.reviewNotes || '');
                      setIsPresenter(app.isApprovedPresenter || false);
                    }}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('apps.reviewBtn', 'Inspect Dossier')}</span>
                  </button>
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

            {/* Presenter Accreditation Checkbox */}
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

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t('apps.closeModal', 'Close')}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: 'rejected',
                      notes: reviewNotes,
                    })
                  }
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  {t('apps.rejectApplication', 'Reject Application')}
                </button>

                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: 'approved',
                      notes: reviewNotes,
                      approvePresenter: isPresenter,
                    })
                  }
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  {t('apps.approveApplication', 'Approve & Onboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
