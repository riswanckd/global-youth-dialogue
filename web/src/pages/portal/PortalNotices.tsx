import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { user } = useAuth();
  const { t, isArabic, dir, language } = useLanguage();
  const userId = user?.id || 'anon';

  const { data, isLoading } = useQuery<{ notices: NoticeItem[]; unreadCount: number }>({
    queryKey: ['portal-notices-unread-count', userId],
    queryFn: () => apiRequest<{ notices: NoticeItem[]; unreadCount: number }>('/notices'),
    enabled: Boolean(user?.id),
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000,
  });

  const notices = (Array.isArray(data?.notices)
    ? data.notices
    : Array.isArray((data as any)?.data?.notices)
    ? (data as any).data.notices
    : Array.isArray(data)
    ? data
    : []) as NoticeItem[];

  const unreadCount =
    typeof data?.unreadCount === 'number'
      ? data.unreadCount
      : typeof (data as any)?.data?.unreadCount === 'number'
      ? (data as any).data.unreadCount
      : notices.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await apiRequest('/notices/mark-all-read', { method: 'POST' });
      queryClient.invalidateQueries({ queryKey: ['portal-notices-unread-count'] });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkSingleRead = async (noticeId: string) => {
    if (!user?.id) return;
    try {
      await apiRequest(`/notices/${noticeId}/read`, { method: 'POST' });
      queryClient.invalidateQueries({ queryKey: ['portal-notices-unread-count'] });
    } catch (err) {
      console.error('Failed to mark notice as read:', err);
    }
  };

  const getAudienceLabel = (aud: string) => {
    switch (aud) {
      case 'ALL':
        return t('notices.targetAll', 'All Delegates');
      case 'MEMBERS':
        return t('notices.targetMembers', 'Members Only');
      case 'PRESENTERS':
        return t('notices.targetPresenters', 'Presenters Only');
      case 'SPECIFIC_USERS':
        return t('notices.targetSpecific', 'Confidential Notice');
      default:
        return aud;
    }
  };

  return (
    <div key={userId} className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6" dir={dir}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#4851BA]/10 dark:bg-[#4851BA]/20 text-[#4851BA] dark:text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('notices.title', 'Official Notice Board')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t(
              'notices.subtitle',
              'Official communiqués, plenaries, and institutional circulars from the GYDE Secretariat.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-[#4851BA] dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#4851BA] dark:text-indigo-400" />
              <span>{isArabic ? `تحديد الكل كمقروء (${unreadCount})` : `Mark All as Read (${unreadCount})`}</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#4851BA]/10 dark:bg-[#4851BA]/20 border border-[#4851BA]/30 text-[#4851BA] dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('notices.verifiedBadge', 'Verified Secretariat Dispatches')}</span>
          </div>
        </div>
      </div>

      {/* Notices List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          {t('notices.loading', 'Loading institutional dispatches...')}
        </div>
      ) : notices.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('notices.noNotices', 'No Active Notices')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {t(
              'notices.noNoticesDesc',
              'The notice board is up to date. New announcements from the Super Administrator will appear here.'
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm transition-all ${
                !notice.isRead
                  ? 'border-[#4851BA]/60 ring-2 ring-[#4851BA]/10'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-[#4851BA]/40'
              }`}
            >
              {/* Notice Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4851BA] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                    {getAudienceLabel(notice.targetAudience)}
                  </span>
                  {!notice.isRead ? (
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      {isArabic ? 'جديد' : 'NEW'}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {isArabic ? 'مقروء' : 'Read'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <time dateTime={notice.createdAt}>
                      {new Date(notice.createdAt).toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>

                  {!notice.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkSingleRead(notice.id)}
                      className="ms-1 text-[10px] font-bold text-[#4851BA] hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200/80 dark:border-indigo-800/80 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isArabic ? 'تحديد كمقروء' : 'Mark as Read'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Subject */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug break-words">
                {notice.subject}
              </h2>

              {/* Message Content (Strictly Read-Only) */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                {notice.message}
              </div>

              {/* Read-Only Status Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-[#4851BA] dark:text-indigo-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isArabic ? 'سجل رسمي موثق من الأمانة العامة' : 'Official Secretariat Record'}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  {isArabic ? 'إعلان رسمي للقراءة فقط' : 'Read-Only Announcement'}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
