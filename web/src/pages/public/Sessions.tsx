import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { SessionDetailModal, SessionDetailData } from '../../components/SessionDetailModal';
import { Calendar, Users, Layers, ArrowRight, Search, CheckCircle } from 'lucide-react';

export interface SessionItem extends SessionDetailData {
  id: string;
  sessionNumber: number;
  title: string;
  topicTitle?: string;
  date: string;
  time?: string;
  status: 'Upcoming' | 'Completed' | 'In Progress';
  presenterName: string;
  presenterCountry: string;
  countries: string[];
  summary?: string;
  recordingUrl?: string;
  materialsUrl?: string;
}

// Function to detect and exclude legacy demo sessions
export const isDemoSession = (title?: string): boolean => {
  if (!title) return false;
  const t = title.toLowerCase().trim();
  const demoPatterns = [
    'ai sovereignty, algorithmic governance',
    'post-dollar multilateralism',
    'climate migration & cross-border legal status',
    'digital surveillance capitalism',
    'ai sovereignty & international human rights',
  ];
  return demoPatterns.some((pattern) => t.includes(pattern));
};

// Initial clean fallback session (matches genuine database entry)
const FALLBACK_SESSIONS: SessionItem[] = [
  {
    id: '6ad8ca177942951d48be2b6f',
    sessionNumber: 1,
    title: 'Youth representation in policy making',
    titleAr: 'تمثيل الشباب في صنع السياسات العامة',
    topicTitle: 'Geopolitics & International Relations',
    category: 'Geopolitics & International Relations',
    format: 'Structural Debate',
    motion: 'This House believes institutional youth quotas should be mandated across national and multilateral policymaking councils.',
    date: 'Oct 26, 2026',
    time: '14:00 UTC',
    durationMinutes: 90,
    timezone: 'UTC',
    status: 'Completed',
    presenterName: 'Global Youth Delegation',
    presenterCountry: 'International',
    moderator: 'GYDE Academic Secretariat',
    countries: ['IN', 'QA', 'UK', 'GH', 'LB', 'SD'],
    summary: 'Evaluating youth representation, intergenerational equity, and institutional advisory mechanisms in national and international policy architecture.',
  },
];

export const Sessions: React.FC = () => {
  const { isArabic } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<'all' | 'Upcoming' | 'Completed'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('filter') || new URLSearchParams(window.location.search).get('tab');
      if (p && (p.toLowerCase() === 'completed' || p.toLowerCase() === 'past')) return 'Completed';
      if (p && (p.toLowerCase() === 'upcoming' || p.toLowerCase() === 'future')) return 'Upcoming';
    }
    return 'all';
  });
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState<SessionItem[]>(FALLBACK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);

  useEffect(() => {
    const p = searchParams.get('filter') || searchParams.get('tab');
    if (p) {
      const lower = p.toLowerCase();
      if (lower === 'completed' || lower === 'past') setFilter('Completed');
      else if (lower === 'upcoming' || lower === 'future') setFilter('Upcoming');
      else if (lower === 'all') setFilter('all');
    }
  }, [searchParams]);

  useEffect(() => {
    const loadSessions = () => {
      let cachedSessions: any[] = [];
      try {
        const stored = localStorage.getItem('gyde_cached_sessions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Filter out any cached demo sessions
            const cleaned = parsed.filter((s: any) => !isDemoSession(s?.title));
            if (cleaned.length !== parsed.length) {
              localStorage.setItem('gyde_cached_sessions', JSON.stringify(cleaned));
            }
            cachedSessions = cleaned;
          }
        }
      } catch {}

      apiRequest<any>('/sessions')
        .then((res: any) => {
          const rawItems = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          // Filter out demo sessions from API response as well
          const validApiItems = rawItems.filter((s: any) => !isDemoSession(s?.title));
          if (validApiItems.length > 0) {
            try {
              localStorage.setItem('gyde_cached_sessions', JSON.stringify(validApiItems));
            } catch {}
          }
          const combinedRaw = [...validApiItems, ...cachedSessions];

          if (combinedRaw.length > 0) {
            const mapped: SessionItem[] = combinedRaw.map((s: any, idx: number) => {
              const d = s.scheduledAt ? new Date(s.scheduledAt) : new Date();
              const isPast = d.getTime() < Date.now();
              const primaryPresenter = s.presenters?.[0] || s.presenter || {};
              const formattedTime =
                s.preferredTimeSlot ||
                (s.scheduledAt
                  ? `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')} UTC`
                  : '12:00 UTC');

              let status: 'Upcoming' | 'Completed' | 'In Progress' = 'Upcoming';
              if (s.status === 'completed' || isPast) {
                status = 'Completed';
              } else if (s.status === 'live') {
                status = 'In Progress';
              } else {
                status = 'Upcoming';
              }

              return {
                id: s._id || s.id || `ses-${idx + 1}`,
                _id: s._id,
                sessionNumber: s.sessionNumber || idx + 1,
                title: s.title,
                titleAr: s.titleAr,
                topicTitle: s.category || s.topic?.title || 'Academic Dialogue',
                category: s.category || 'Global Affairs',
                format: s.format || 'Youth Chamber Debate',
                motion: s.motion,
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: formattedTime,
                scheduledAt: s.scheduledAt,
                durationMinutes: s.durationMinutes || 90,
                timezone: s.timezone || 'UTC',
                status,
                presenterName: primaryPresenter.name || s.moderator || 'Assigned Delegate',
                presenterCountry: primaryPresenter.country || 'Global Delegation',
                presenters: s.presenters,
                propositionTeam: s.propositionTeam,
                oppositionTeam: s.oppositionTeam,
                moderator: s.moderator,
                meetingUrl: s.meetingUrl,
                countries: ['IN', 'QA', 'UK', 'GH', 'BR', 'DE'],
                summary: s.description || s.summary || '',
                description: s.description,
                descriptionAr: s.descriptionAr,
                recordingUrl: s.recordingUrl,
                materialsUrl: s.dossierUrl,
              };
            });

            const seen = new Set<string>();
            const unique: SessionItem[] = [];
            for (const item of mapped) {
              const key = item.title.toLowerCase().trim();
              if (key && !seen.has(key) && !isDemoSession(item.title)) {
                seen.add(key);
                unique.push(item);
              }
            }

            for (const fallback of FALLBACK_SESSIONS) {
              const key = fallback.title.toLowerCase().trim();
              if (!seen.has(key) && !isDemoSession(fallback.title)) {
                seen.add(key);
                unique.push(fallback);
              }
            }

            setSessions(unique);
          }
        })
        .catch(() => {
          // Keep clean fallback sessions
        });
    };

    loadSessions();
    window.addEventListener('storage', loadSessions);
    return () => window.removeEventListener('storage', loadSessions);
  }, []);

  // Check URL query param ?session=<id> or ?session=<title>
  useEffect(() => {
    const sessionQuery = searchParams.get('session');
    if (sessionQuery && sessions.length > 0) {
      const match = sessions.find(
        (s) =>
          String(s.id).toLowerCase() === sessionQuery.toLowerCase() ||
          String(s._id).toLowerCase() === sessionQuery.toLowerCase() ||
          s.title.toLowerCase().includes(sessionQuery.toLowerCase())
      );
      if (match) {
        setSelectedSession(match);
      }
    }
  }, [searchParams, sessions]);

  const filteredSessions = sessions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.presenterName.toLowerCase().includes(search.toLowerCase()) ||
      (s.format && s.format.toLowerCase().includes(search.toLowerCase())) ||
      (s.topicTitle && s.topicTitle.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="public-section active" id="sessions">
      <section className="sessions-public-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'أرشيف الحوارات' : 'Dialogue Archive'}</span>
            <h2 className="section-title serif-text">
              {isArabic ? 'الجلسات والأوراق الأكاديمية' : 'Sessions & Academic Writings'}
            </h2>
            <p className="section-desc">
              {isArabic
                ? 'استكشف جلسات الحوار الشبابي الدولي، وجداول أعمال الحوارات القادمة، والمداولات الأكاديمية المؤرشفة والمفتوحة للجميع.'
                : 'Explore our international youth dialogue sessions, upcoming dialogue agendas, panel discussions, and archived proceedings open for everyone.'}
            </p>
          </div>

          {/* Public Session Filter Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} id="publicSessionStatusFilters">
              <button
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                {isArabic ? 'جميع الجلسات' : 'All Dialogue Sessions'}
              </button>
              <button
                className={`btn btn-sm ${filter === 'Upcoming' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('Upcoming')}
              >
                {isArabic ? 'الجلسات القادمة' : 'Upcoming Sessions'}
              </button>
              <button
                className={`btn btn-sm ${filter === 'Completed' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('Completed')}
              >
                {isArabic ? 'الأرشيف المنعقد' : 'Completed Archive'}
              </button>
            </div>

            <div className="public-session-search-wrap" style={{ position: 'relative' }}>
              <input
                type="text"
                id="publicSessionSearch"
                className="form-control form-control-sm"
                placeholder={isArabic ? 'بحث في الجلسات والمتحدثين والصيغ...' : 'Search sessions, presenters, formats...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingInlineStart: '2rem' }}
              />
              <span
                style={{
                  position: 'absolute',
                  insetInlineStart: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Search size={14} />
              </span>
            </div>
          </div>

          {/* Preview Cards Grid (Open to Everyone) */}
          <div className="public-sessions-grid" id="publicSessionsPreview">
            {filteredSessions.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  background: 'rgba(72, 81, 186, 0.03)',
                  borderRadius: '20px',
                  border: '1px dashed rgba(72, 81, 186, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(72, 81, 186, 0.08)',
                    color: 'var(--color-primary-1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Calendar size={28} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {filter === 'Upcoming'
                    ? (isArabic ? 'لا توجد جلسات قادمة مجدولة حالياً' : 'No upcoming session scheduled right now')
                    : (isArabic ? 'لم يتم العثور على جلسات مطابقة' : 'No dialogue sessions found')}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                  {filter === 'Upcoming'
                    ? (isArabic
                        ? 'لم يتم تحديد مواعيد جديدة بعد. يمكنك الاطلاع على أرشيف الجلسات المكتملة وتسجيلاتها.'
                        : 'No upcoming sessions are scheduled at this time. Browse our completed dialogue archives and recorded sessions below.')
                    : (isArabic
                        ? 'جرب البحث بكلمات مختلفة أو قم بإلغاء الفلتر لعرض جميع الجلسات.'
                        : 'Try searching with different keywords or clear your active filters to explore all available sessions.')}
                </p>
                {filter === 'Upcoming' && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilter('Completed');
                      const next = new URLSearchParams(searchParams);
                      next.set('filter', 'Completed');
                      setSearchParams(next);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <span>{isArabic ? 'الانتقال إلى الجلسات المكتملة' : 'View Completed Sessions Archive'}</span>
                    <span className="rtl-flip-arrow inline-block">&rarr;</span>
                  </button>
                )}
              </div>
            ) : (
              filteredSessions.map((session) => (
              <div
                key={session.id}
                className="session-card-preview"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => setSelectedSession(session)}
              >
                {/* Top Status & Format Badges */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div className="session-lock-tag" style={{ margin: 0 }}>
                    {session.status === 'Upcoming' ? (
                      <span
                        style={{
                          color: 'var(--color-primary-1)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'currentColor',
                            display: 'inline-block',
                          }}
                        ></span>
                        {isArabic ? 'قادمة' : 'Upcoming'}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                        }}
                      >
                        <CheckCircle size={13} />
                        {isArabic ? 'منعقدة' : 'Archived'}
                      </span>
                    )}
                  </div>

                  {/* Prominent Session Format Badge */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: 'rgba(72, 81, 186, 0.08)',
                      color: 'var(--color-primary-1)',
                      border: '1px solid rgba(72, 81, 186, 0.2)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    <Layers size={11} />
                    <span>{session.format || (isArabic ? 'مناظرة برلمانية' : 'Youth Chamber Debate')}</span>
                  </span>
                </div>

                <div className="session-num-badge">
                  {isArabic ? `الجلسة #${session.sessionNumber}` : `Dialogue Session #${session.sessionNumber}`}
                </div>

                <h4
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    marginBottom: '0.75rem',
                    color: 'var(--text-main)',
                  }}
                >
                  {isArabic && session.titleAr ? session.titleAr : session.title}
                </h4>

                {session.motion && (
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderInlineStart: '3px solid #f59e0b',
                      fontSize: '0.78rem',
                      fontStyle: 'italic',
                      color: 'var(--text-body)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    &ldquo;{session.motion}&rdquo;
                  </div>
                )}

                <div className="session-meta-row" style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} />
                    <span>{session.date}</span>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} />
                    <span>
                      {session.presenterName} {session.presenterCountry && `(${session.presenterCountry})`}
                    </span>
                  </div>
                </div>

                {session.summary && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                      flexGrow: 1,
                    }}
                  >
                    {session.summary}
                  </p>
                )}

                <div className="session-countries-pills" style={{ marginTop: 'auto' }}>
                  {session.countries.map((c, i) => (
                    <span key={i} className="country-pill">
                      {c}
                    </span>
                  ))}
                  <div style={{ marginInlineStart: 'auto' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(session);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.76rem', fontWeight: 600 }}
                    >
                      {isArabic ? 'تفاصيل الجلسة' : 'Session Details'} <span className="rtl-flip-arrow inline-block">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>

      {/* Pop-up Session Detail Modal (Shows full details: moderator, participants, schedule, and protects meeting link) */}
      <SessionDetailModal
        isOpen={!!selectedSession}
        onClose={() => {
          setSelectedSession(null);
          // Clean URL param if set
          if (searchParams.get('session')) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('session');
            setSearchParams(nextParams);
          }
        }}
        session={selectedSession}
      />
    </div>
  );
};
