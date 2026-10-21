import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { EditSessionModal } from '../../components/portal/EditSessionModal';
import { SessionDetailModal } from '../../components/SessionDetailModal';
import { isDemoSession } from '../public/Sessions';
import {
  Calendar,
  Video,
  ExternalLink,
  ArrowRight,
  Clock,
  Users,
  Shield,
  Edit3,
  Target,
  Layers,
  Info,
} from 'lucide-react';

export const PortalSessions: React.FC = () => {
  const { user, isCoordinator } = useAuth();
  const { isArabic } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'assigned' | 'scheduled' | 'completed'>('all');
  const [editingSession, setEditingSession] = useState<DialogueSession | null>(null);
  const [selectedDetailSession, setSelectedDetailSession] = useState<DialogueSession | null>(null);

  const { data: apiSessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['portal-sessions-list'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions'),
  });

  const [cachedSessions, setCachedSessions] = useState<DialogueSession[]>([]);

  useEffect(() => {
    const readCache = () => {
      try {
        const stored = localStorage.getItem('gyde_cached_sessions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((s: any) => !isDemoSession(s?.title));
            if (cleaned.length !== parsed.length) {
              localStorage.setItem('gyde_cached_sessions', JSON.stringify(cleaned));
            }
            setCachedSessions(cleaned);
            return;
          }
        }
      } catch {}
    };
    readCache();
    window.addEventListener('storage', readCache);
    return () => window.removeEventListener('storage', readCache);
  }, []);

  const allSessions = React.useMemo(() => {
    const list = Array.isArray(apiSessions) ? apiSessions : [];
    const validApi = list.filter((s: any) => !isDemoSession(s?.title));
    const combined = [...cachedSessions, ...validApi];
    const seen = new Set<string>();
    const unique: DialogueSession[] = [];
    for (const s of combined) {
      if (isDemoSession(s?.title)) continue;
      const key = (s.id || (s as any)._id || s.title || '').toString();
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(s);
      }
    }
    return unique;
  }, [apiSessions, cachedSessions]);

  // Check URL query param ?session=<id> or ?session=<title>
  useEffect(() => {
    const sessionQuery = searchParams.get('session');
    if (sessionQuery && allSessions.length > 0) {
      const match = allSessions.find(
        (s) =>
          String(s.id).toLowerCase() === sessionQuery.toLowerCase() ||
          String((s as any)._id).toLowerCase() === sessionQuery.toLowerCase() ||
          s.title.toLowerCase().includes(sessionQuery.toLowerCase())
      );
      if (match) {
        setSelectedDetailSession(match);
      }
    }
  }, [searchParams, allSessions]);

  const filtered = allSessions.filter((s) => {
    if (filter === 'assigned') {
      const coordId =
        typeof s.assignedCoordinator === 'object'
          ? s.assignedCoordinator?.id || (s.assignedCoordinator as any)?._id
          : s.assignedCoordinator;
      return coordId === user?.id || !s.assignedCoordinator;
    }
    if (filter === 'scheduled')
      return (
        s.status === 'scheduled' ||
        s.status === 'approved' ||
        s.status === 'live' ||
        (s.status as any) === 'published'
      );
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'جلسات ومنتديات الحوار' : 'Dialogue Sessions & Forums'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isArabic
              ? 'جدول الجلسات المباشرة ومسودات القضايا الحوارية والصيغ المعتمدة'
              : 'Scheduled live dialogue sessions, debate formats, and forum briefings'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shrink-0 ${
              filter === 'all'
                ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {isArabic ? 'جميع الجلسات' : 'All Sessions'}
          </button>
          {isCoordinator && (
            <button
              onClick={() => setFilter('assigned')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shrink-0 ${
                filter === 'assigned'
                  ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {isArabic ? 'جلساتي المعينة' : 'Assigned to Me'}
            </button>
          )}
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shrink-0 ${
              filter === 'scheduled'
                ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {isArabic ? 'الجلسات القادمة' : 'Upcoming'}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shrink-0 ${
              filter === 'completed'
                ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {isArabic ? 'الأرشيف المكتمل' : 'Completed'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">{isArabic ? 'جارٍ تحميل الجلسات...' : 'Loading sessions...'}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gyde-canvas-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
            {isArabic ? 'لا توجد جلسات مطابقة' : 'No sessions found'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      session.status === 'live'
                        ? 'bg-red-500 text-white animate-pulse'
                        : session.status === 'scheduled' ||
                          session.status === 'approved' ||
                          (session.status as any) === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isArabic
                      ? session.status === 'live'
                        ? 'مباشر الآن'
                        : session.status === 'scheduled' ||
                          session.status === 'approved' ||
                          (session.status as any) === 'published'
                        ? 'مجدولة'
                        : 'منعقدة'
                      : session.status === 'approved' || (session.status as any) === 'published'
                      ? 'Scheduled'
                      : session.status}
                  </span>

                  {/* PROMINENT SESSION FORMAT BADGE */}
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{session.format || 'Youth Chamber Debate'}</span>
                  </span>

                  <span className="text-xs font-semibold text-gyde-gold">
                    {session.category}
                  </span>

                  {isCoordinator && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <Target className="w-3 h-3" />
                      <span>{isArabic ? 'جلسة منسقة' : 'Coordinator Assigned'}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(session.scheduledAt).toLocaleString()} ({session.durationMinutes}{' '}
                    {isArabic ? 'دقيقة' : 'mins'})
                  </span>
                </div>
              </div>

              <div>
                <h2
                  className="serif-heading text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setSelectedDetailSession(session)}
                >
                  {isArabic && session.titleAr ? session.titleAr : session.title}
                </h2>
                {session.motion && (
                  <p className="mt-1 text-xs font-semibold text-gyde-green dark:text-emerald-400 italic">
                    &ldquo;{session.motion}&rdquo;
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {isArabic && session.descriptionAr ? session.descriptionAr : session.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-gyde-gold" />
                  <span>
                    {session.presenters?.map((p) => p.name).join(', ') ||
                      (isArabic ? 'الوفود المعينة' : 'Delegates assigned')}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {isCoordinator && (
                    <button
                      type="button"
                      onClick={() => setEditingSession(session)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      title="Edit assigned session details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تعديل الجلسة' : 'Edit Session'}</span>
                    </button>
                  )}

                  {/* POP-UP SESSION DETAILS BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSelectedDetailSession(session)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تفاصيل الجلسة' : 'Session Details'}</span>
                  </button>

                  <Link
                    to={`/portal/sessions/${session.id}`}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-gyde-green"
                  >
                    {isArabic ? 'استعراض ملف الجلسة' : 'View Briefing Dossier'}
                  </Link>

                  {session.meetingUrl && (session.status === 'scheduled' || session.status === 'live') && (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white text-xs font-bold shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'دخول القاعة' : 'Join Chamber'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {session.recordingUrl && session.status === 'completed' && (
                    <a
                      href={session.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      <span>{isArabic ? 'مشاهدة التسجيل' : 'Watch Recording'}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Session Detail Modal */}
      <SessionDetailModal
        isOpen={!!selectedDetailSession}
        onClose={() => {
          setSelectedDetailSession(null);
          if (searchParams.get('session')) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('session');
            setSearchParams(nextParams);
          }
        }}
        session={selectedDetailSession}
      />

      <EditSessionModal
        isOpen={!!editingSession}
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['portal-sessions-list'] })}
      />
    </div>
  );
};
