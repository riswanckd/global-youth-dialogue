import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { Bell, Clock, ShieldCheck, Megaphone, CheckCircle2, ExternalLink } from 'lucide-react';

interface NoticeItem {
  id: string;
  subject: string;
  message: string;
  targetAudience: string;
  createdAt: string;
  isRead: boolean;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function renderFormattedMessage(rawText: string) {
  if (!rawText) return null;
  const decoded = decodeHtmlEntities(rawText);

  const urlRegex = /((?:https?:\/\/|www\.)[^\s<]+|t\.me\/[^\s<]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const parts = decoded.split(urlRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    const isUrl =
      part.startsWith('http://') ||
      part.startsWith('https://') ||
      part.startsWith('www.') ||
      part.startsWith('t.me/');
    const isEmail = !isUrl && part.includes('@') && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part);

    if (isUrl || isEmail) {
      let url = part;
      let trailing = '';
      while (/[.,;:!?)\]}>]$/.test(url)) {
        trailing = url.slice(-1) + trailing;
        url = url.slice(0, -1);
      }

      let href = url;
      if (url.startsWith('www.') || url.startsWith('t.me/')) {
        href = `https://${url}`;
      } else if (isEmail) {
        href = `mailto:${url}`;
      }

      return (
        <React.Fragment key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline underline-offset-2 break-all inline-flex items-center gap-1 transition-colors hover:opacity-90 cursor-pointer"
            title={href}
          >
            <span>{url}</span>
            <ExternalLink className="w-3 h-3 shrink-0 inline opacity-70" />
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export const AdminNotices: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ notices: NoticeItem[]; unreadCount: number }>({
    queryKey: ['admin-notices'],
    queryFn: () => apiRequest<{ notices: NoticeItem[]; unreadCount: number }>('/notices'),
    refetchInterval: 15000,
  });

  const notices = data?.notices || [];

  useEffect(() => {
    apiRequest('/notices/mark-all-read', { method: 'POST' })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['admin-notices-unread-count'] });
      })
      .catch(() => {});
  }, [queryClient]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Institutional Notice Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official communiqués and administrative circulars from the Super Administrator.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secretariat Dispatches</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Active Notices</h3>
          <p className="text-xs text-slate-400 mt-1">
            There are no unread administrative notices at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  {notice.targetAudience}
                </span>

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

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {decodeHtmlEntities(notice.subject)}
              </h2>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                {renderFormattedMessage(notice.message)}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Official Record
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
