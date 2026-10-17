import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Topic } from '../types';
import { Lightbulb, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const Topics: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['admin-topics'],
    queryFn: () => apiRequest<Topic[]>('/admin/topics'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/admin/topics/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-topics'] }),
  });

  const filtered = topics.filter((tItem) => {
    const q = search.toLowerCase();
    return tItem.title.toLowerCase().includes(q) || tItem.category.toLowerCase().includes(q);
  });

  const inReviewCount = topics.filter((t) => t.status === 'proposed' || t.status === 'reviewing').length;
  const approvedCount = topics.filter((t) => t.status === 'approved').length;
  const rejectedCount = topics.filter((t) => t.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('topics.title', 'Topic Pipeline & Proposals')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('topics.subtitle', 'Curate member-suggested parliamentary debate motions across the 16 core knowledge disciplines.')}
        </p>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Topics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {topics.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('dash.kpiTopicLibrary', 'Topic Bank')}
            </div>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {inReviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('in_review')}
            </div>
          </div>
        </div>

        {/* Approved Motions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {approvedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('approved')}
            </div>
          </div>
        </div>

        {/* Rejected Motions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {rejectedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('rejected')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('topics.searchPlaceholder', 'Search topics by motion or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading topic motions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Lightbulb className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('topics.noTopics', 'No topics found.')}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('sessions.motionLabel', 'Motion')}</th>
                    <th className="py-3 px-4">{t('sessions.categoryLabel', 'Category')}</th>
                    <th className="py-3 px-4">{t('apps.colApplicant', 'Proposer')}</th>
                    <th className="py-3 px-4">{t('apps.colStatus', 'Status')}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{t('apps.colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                  {filtered.map((topicItem) => (
                    <tr key={topicItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{topicItem.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{topicItem.description}</div>
                      </td>
                      <td className="py-3 px-4">{translateCategory(topicItem.category)}</td>
                      <td className="py-3 px-4">
                        {topicItem.proposedBy?.name || 'Anonymous Member'} ({topicItem.proposedBy?.country || t('dash.global', 'Global')})
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                          {translateStatus(topicItem.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'approved' })}
                            className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                          >
                            {t('dash.approve', 'Approve')}
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'rejected' })}
                            className="px-2 py-1 text-xs font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            {t('topics.rejectMotion', 'Reject')}
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
              {filtered.map((topicItem) => (
                <div
                  key={topicItem.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {topicItem.title}
                      </h4>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                        {translateCategory(topicItem.category)}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 shrink-0">
                      {translateStatus(topicItem.status)}
                    </span>
                  </div>

                  {topicItem.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {topicItem.description}
                    </p>
                  )}

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span>
                      {topicItem.proposedBy?.name || 'Anonymous Member'} ({topicItem.proposedBy?.country || t('dash.global', 'Global')})
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'approved' })}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                      >
                        {t('dash.approve', 'Approve')}
                      </button>
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'rejected' })}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                      >
                        {t('topics.rejectMotion', 'Reject')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
