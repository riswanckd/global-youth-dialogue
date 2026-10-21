import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Feedback as FeedbackType } from '../types';
import { MessageSquareQuote, Search, Star, CheckCircle2, Calendar, Trash2 } from 'lucide-react';

export const Feedback: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useAdminLanguage();
  const [search, setSearch] = useState('');

  const { data: feedback = [], isLoading } = useQuery<FeedbackType[]>({
    queryKey: ['admin-feedback'],
    queryFn: () => apiRequest<FeedbackType[]>('/admin/feedback'),
  });

  const deleteFeedbackMutation = useMutation({
    onMutate: (id: string) => {
      queryClient.setQueryData<FeedbackType[]>(['admin-feedback'], (old = []) =>
        old.filter((f: any) => (f.id || f._id) !== id)
      );
    },
    mutationFn: async (id: string) => {
      let success = false;
      try {
        await apiRequest(`/admin/feedback/${id}`, { method: 'DELETE' });
        success = true;
      } catch {}
      if (!success) {
        await apiRequest(`/feedback/${id}`, { method: 'DELETE' }).catch(() => {});
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
  });

  const filtered = feedback.filter((f) => {
    const q = search.toLowerCase();
    const sessionTitle = f.sessionId?.title || '';
    const submitter = f.submittedBy?.name || '';
    return sessionTitle.toLowerCase().includes(q) || submitter.toLowerCase().includes(q);
  });

  const avgScore = feedback.length > 0
    ? (feedback.reduce((acc, f) => {
        const r = f.ratings;
        const subAvg = r ? (r.argumentation + r.evidence + r.delivery + r.engagement) / 4 : 5;
        return acc + subAvg;
      }, 0) / feedback.length).toFixed(1)
    : '5.0';

  const strengthsCount = feedback.filter((f) => f.strengths && f.strengths.length > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('fb.title', 'Delegate Reviews & Feedback')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('fb.subtitle', 'Peer reflections and ratings on presentation clarity, argument strength, and floor dialogue rigor.')}
        </p>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Reviews */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquareQuote className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {feedback.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('fb.title', 'Reviews')}
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {avgScore} / 5
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Average Rating
            </div>
          </div>
        </div>

        {/* Commendations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {strengthsCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Commendations
            </div>
          </div>
        </div>

        {/* Dialogue Chambers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Deliberation Rigor
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('fb.searchPlaceholder', 'Search feedback by session or member...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading delegate reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <MessageSquareQuote className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('fb.noFb', 'No peer reviews found.')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => {
              const avgRating = item.ratings
                ? Math.round(
                    ((item.ratings.argumentation || 0) +
                      (item.ratings.evidence || 0) +
                      (item.ratings.delivery || 0) +
                      (item.ratings.engagement || 0)) /
                      4
                  )
                : 5;

              return (
                <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.sessionId?.title || 'Chamber Dialogue Session'}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{avgRating}/5</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>{t('fb.strengths', 'Strengths')}:</strong> {item.strengths || 'N/A'}
                  </div>
                  {item.improvements && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>{t('fb.improvements', 'Areas for Growth')}:</strong> {item.improvements}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div>
                      Review by: <strong className="text-slate-600 dark:text-slate-300">{item.submittedBy?.name || 'Anonymous'}</strong> ({item.submittedBy?.country || t('dash.global', 'Global')})
                    </div>
                    <div className="flex items-center gap-3">
                      <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                      <button
                        type="button"
                        onClick={() => {
                          const fid = (item as any).id || (item as any)._id;
                          if (window.confirm('Delete this peer feedback entry permanently?')) {
                            deleteFeedbackMutation.mutate(fid);
                          }
                        }}
                        disabled={deleteFeedbackMutation.isPending}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
