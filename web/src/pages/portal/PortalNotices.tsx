import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../utils/api';
import { Bell, Clock, ShieldCheck, Megaphone, CheckCircle2 } from 'lucide-react';

interface NoticeItem {
  id: string;
  subject: string;
  message: string;
  targetAudience: string;
  createdAt: string;
  isRead: boolean;
}

export const PortalNotices: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ notices: NoticeItem[]; unreadCount: number }>({
    queryKey: ['portal-notices'],
    queryFn: () => apiRequest<{ notices: NoticeItem[]; unreadCount: number }>('/notices'),
    refetchInterval: 15000,
  });

  const notices = data?.notices || [];

  // Automatically mark all as read on mount
  useEffect(() => {
    apiRequest('/notices/mark-all-read', { method: 'POST' })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['portal-notices-unread-count'] });
      })
      .catch(() => {});
  }, [queryClient]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Official Notice Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official communiqués, plenaries, and institutional circulars from the GYDE Secretariat.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Secretariat Dispatches</span>
        </div>
      </div>

      {/* Notices List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Loading institutional dispatches...
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Active Notices
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            The notice board is up to date. New announcements from the Super Administrator will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
            >
              {/* Notice Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {notice.targetAudience === 'ALL' ? 'All Delegates' : notice.targetAudience}
                  </span>
                  {!notice.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <time dateTime={notice.createdAt}>
                    {new Date(notice.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </div>

              {/* Subject */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {notice.subject}
              </h2>

              {/* Message Content */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                {notice.message}
              </div>

              {/* Read-Only Status Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Official Secretariat Record
                </span>
                <span>Read-Only Announcement</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
