import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Users,
  Shield,
  Lock,
  Layers,
  Award,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface SessionDetailData {
  id?: string;
  _id?: string;
  sessionNumber?: number;
  title: string;
  titleAr?: string;
  topicTitle?: string;
  category?: string;
  categoryNameAr?: string;
  format?: string;
  formatAr?: string;
  motion?: string;
  date?: string;
  time?: string;
  scheduledAt?: string | Date;
  durationMinutes?: number;
  timezone?: string;
  status?: string;
  moderator?: string;
  presenterName?: string;
  presenterCountry?: string;
  presenters?: Array<{
    name: string;
    role?: string;
    country?: string;
    avatar?: string;
    bio?: string;
  }>;
  propositionTeam?: string[];
  oppositionTeam?: string[];
  guestSpeaker?: {
    name?: string;
    title?: string;
    affiliation?: string;
  };
  summary?: string;
  summaryAr?: string;
  description?: string;
  descriptionAr?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  materialsUrl?: string;
  countries?: string[];
}

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionDetailData | null;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const { isArabic } = useLanguage();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  // Format Scheduled Date & Time
  let displayDate = session.date || '';
  let displayTime = session.time || '';
  if (session.scheduledAt) {
    const d = new Date(session.scheduledAt);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const utcHours = String(d.getUTCHours()).padStart(2, '0');
      const utcMins = String(d.getUTCMinutes()).padStart(2, '0');
      displayTime = `${utcHours}:${utcMins} UTC`;
    }
  }

  const rawStatus = (session.status || 'scheduled').toLowerCase();
  const isUpcoming = rawStatus === 'scheduled' || rawStatus === 'upcoming' || rawStatus === 'approved' || rawStatus === 'published';
  const isLive = rawStatus === 'live' || rawStatus === 'in progress';
  const isCompleted = rawStatus === 'completed' || rawStatus === 'archived';

  // Format name
  const sessionFormat = session.format || (isArabic ? 'مناظرة برلمانية' : 'Youth Chamber Debate');
  const sessionCategory = session.category || session.topicTitle || (isArabic ? 'حوار دولي' : 'Global Dialogue');
  const sessionTitle = isArabic && session.titleAr ? session.titleAr : session.title;
  const sessionOverview = isArabic && (session.descriptionAr || session.summaryAr)
    ? (session.descriptionAr || session.summaryAr)
    : (session.description || session.summary || '');

  // Theme-aware styles
  const bgCard = isDark ? '#141728' : '#ffffff';
  const textHeading = isDark ? '#ffffff' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const borderSubtle = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0';
  const sectionBg = isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: isDark ? 'rgba(5, 7, 15, 0.85)' : 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="sessionDetailModalDialog"
        className="session-detail-dialog"
        style={{
          width: '100%',
          maxWidth: '720px',
          background: bgCard,
          color: textHeading,
          borderRadius: '24px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid #e2e8f0',
          boxShadow: isDark
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.9)'
            : '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Modal Header Strip */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: `1px solid ${borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(248, 250, 252, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Status Pill */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                background: isLive
                  ? '#ef4444'
                  : isUpcoming
                  ? isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'
                  : isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9',
                color: isLive
                  ? '#ffffff'
                  : isUpcoming
                  ? isDark ? '#6ee7b7' : '#047857'
                  : isDark ? '#cbd5e1' : '#475569',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'currentColor',
                  animation: isLive ? 'pulse 1.5s infinite' : 'none',
                }}
              />
              {isLive
                ? (isArabic ? 'مباشر الآن' : 'Live Chamber')
                : isUpcoming
                ? (isArabic ? 'جلسة قادمة' : 'Upcoming Session')
                : (isArabic ? 'جلسة منعقدة ومؤرشفة' : 'Archived')}
            </span>

            {/* Session Format Badge (Prominent requirement) */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(72, 81, 186, 0.1)',
                color: isDark ? '#a5b4fc' : '#4851BA',
                border: isDark ? '1px solid rgba(165, 180, 252, 0.3)' : '1px solid rgba(72, 81, 186, 0.25)',
              }}
            >
              <Layers size={12} />
              <span>{sessionFormat}</span>
            </span>

            {/* Category / Sphere Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.1)',
                color: isDark ? '#fcd34d' : '#b45309',
              }}
            >
              <Globe size={11} />
              <span>{sessionCategory}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: textMuted,
              transition: 'all 0.15s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Session Title */}
          <div>
            <h2
              className="serif-text"
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: textHeading,
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              {sessionTitle}
            </h2>
          </div>

          {/* Dialogue Motion / Theme Quote Box */}
          {(session.motion || (session as any).topic?.motion || (session as any).debateMotion) && (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                background: isDark ? 'rgba(217, 119, 6, 0.12)' : '#fffbeb',
                borderInlineStart: isDark ? '4px solid #f59e0b' : '4px solid #d97706',
                border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid #fde68a',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#fcd34d' : '#92400e', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                {isArabic ? 'قضية الحوار والمناظرة (Motion)' : 'Dialogue Motion & Core Proposition'}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: isDark ? '#fef3c7' : '#78350f', lineHeight: 1.5, fontStyle: 'italic' }}>
                &ldquo;{session.motion || (session as any).topic?.motion || (session as any).debateMotion}&rdquo;
              </div>
            </div>
          )}

          {/* Key Logistics Matrix (Date, Time, Duration, Moderator) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: '16px',
              background: sectionBg,
              border: `1px solid ${borderSubtle}`,
            }}
          >
            {/* Date */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '10px', background: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(72, 81, 186, 0.08)', color: isDark ? '#818cf8' : '#4851BA' }}>
                <Calendar size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: textMuted, display: 'block', fontWeight: 600 }}>
                  {isArabic ? 'تاريخ الانعقاد' : 'Scheduled Date'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textHeading }}>
                  {displayDate || (isArabic ? 'يُحدد لاحقاً' : 'TBD')}
                </span>
              </div>
            </div>

            {/* Time & Timezone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '10px', background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.08)', color: isDark ? '#34d399' : '#059669' }}>
                <Clock size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: textMuted, display: 'block', fontWeight: 600 }}>
                  {isArabic ? 'توقيت الجلسة' : 'Chamber Time'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textHeading }}>
                  {displayTime || '14:00 UTC'}
                  {session.timezone && ` (${session.timezone})`}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '10px', background: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.08)', color: isDark ? '#fbbf24' : '#d97706' }}>
                <Award size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: textMuted, display: 'block', fontWeight: 600 }}>
                  {isArabic ? 'مدة الجلسة' : 'Duration'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textHeading }}>
                  {session.durationMinutes || 90} {isArabic ? 'دقيقة' : 'Minutes'}
                </span>
              </div>
            </div>

            {/* Moderator */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '10px', background: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(147, 51, 234, 0.08)', color: isDark ? '#c084fc' : '#9333ea' }}>
                <Shield size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: textMuted, display: 'block', fontWeight: 600 }}>
                  {isArabic ? 'مدير الجلسة' : 'Chamber Moderator'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textHeading }}>
                  {session.moderator || (isArabic ? 'الأمانة الأكاديمية لـ GYDE' : 'GYDE Academic Secretariat')}
                </span>
              </div>
            </div>
          </div>

          {/* Participants, Speakers & Teams Breakdown */}
          {((session.propositionTeam && session.propositionTeam.length > 0) ||
            (session.oppositionTeam && session.oppositionTeam.length > 0)) ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Proposition / Affirmative Team */}
              <div
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '16px',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(209, 250, 229, 0.45)',
                  border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #a7f3d0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#6ee7b7' : '#065f46', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.65rem' }}>
                  <Users size={14} />
                  <span>{isArabic ? 'فريق التأييد / المتحدثون الرئيسيون' : 'Affirmative / Proposition Team'}</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {session.propositionTeam?.map((sp, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: textHeading }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opposition Team */}
              <div
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '16px',
                  background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(254, 226, 226, 0.45)',
                  border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDark ? '#fca5a5' : '#991b1b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.65rem' }}>
                  <Users size={14} />
                  <span>{isArabic ? 'فريق المعارضة / الرأي المقابل' : 'Opposition / Critical Perspective'}</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {session.oppositionTeam?.map((sp, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: textHeading }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : session.presenters && session.presenters.length > 0 ? (
            <div
              style={{
                padding: '1rem 1.15rem',
                borderRadius: '16px',
                background: sectionBg,
                border: `1px solid ${borderSubtle}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: textHeading, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.65rem' }}>
                <Users size={14} />
                <span>{isArabic ? 'المتحدثون والوفود المشاركة' : 'Confirmed Presenters & Youth Fellows'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                {session.presenters.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                      border: `1px solid ${borderSubtle}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isDark ? '#312e81' : '#e0e7ff',
                        color: isDark ? '#c7d2fe' : '#4338ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textHeading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: textMuted }}>
                        {p.role || (isArabic ? 'مندوب وباحث' : 'Fellow Delegate')}
                        {p.country && ` • ${p.country}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : session.presenterName ? (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderRadius: '14px',
                background: sectionBg,
                border: `1px solid ${borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Users size={16} color={textMuted} />
              <div>
                <span style={{ fontSize: '0.7rem', color: textMuted, display: 'block', fontWeight: 600 }}>
                  {isArabic ? 'المتحدث الرئيسي' : 'Lead Presenter'}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: textHeading }}>
                  {session.presenterName} {session.presenterCountry && `(${session.presenterCountry})`}
                </span>
              </div>
            </div>
          ) : null}

          {/* Overview / Abstract */}
          {sessionOverview && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: textMuted, letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                {isArabic ? 'الملخص والمحاور الأكاديمية' : 'Session Briefing & Agenda'}
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.6 }}>
                {sessionOverview}
              </p>
            </div>
          )}

          {/* CRITICAL REQUIREMENT: SESSION MEETING LINK / AUTHENTICATION ENFORCEMENT */}
          {/* User rule: "dont show session link in not sign inned home page.....make this chnage in every upcoming session options of every dashboards..." */}
          <div
            style={{
              marginTop: '0.5rem',
              padding: '1.25rem',
              borderRadius: '18px',
              background: isAuthenticated
                ? isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(236, 253, 245, 0.8)'
                : isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(248, 250, 252, 0.95)',
              border: isAuthenticated
                ? isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #a7f3d0'
                : isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #e2e8f0',
            }}
          >
            {isCompleted ? (
              /* Concluded Session: Explicitly block Google Meet and show YouTube Recording */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#334155' }}>
                    <CheckCircle2 size={16} />
                    <span>{isArabic ? 'هذه الجلسة منعقدة ومكتملة' : 'Dialogue Chamber Concluded'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.2rem' }}>
                    {session.recordingUrl
                      ? (isArabic ? 'تسجيل الجلسة متاح للمشاهدة الكاملة عبر يوتيوب' : 'Full recorded session is available on YouTube')
                      : (isArabic ? 'التسجيل قيد المعالجة والأرشفة وسيتوفر قريباً' : 'Recording is being processed and will be available shortly')}
                  </div>
                </div>

                {session.recordingUrl ? (
                  <a
                    href={session.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                    }}
                  >
                    <Video size={16} />
                    <span>{isArabic ? 'مشاهدة الجلسة المسجلة' : 'Watch Recorded Session'}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                      color: textMuted,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {isArabic ? 'التسجيل قيد المعالجة' : 'Recording Processing'}
                  </span>
                )}
              </div>
            ) : isAuthenticated ? (
              /* Signed-in View: Allowed to access the live chamber link */
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#6ee7b7' : '#047857' }}>
                    <CheckCircle2 size={16} />
                    <span>{isArabic ? 'تصريح الدخول متاح لحسابك' : 'Live Chamber Access Granted'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.2rem' }}>
                    {session.meetingUrl
                      ? (isArabic ? 'رابط قاعة المناظرة المباشرة نشط الآن' : 'Interactive video chamber is open for delegates')
                      : (isArabic ? 'ينشط رابط الجلسة تلقائياً قبل الموعد بـ 15 دقيقة' : 'Meeting chamber link activates 15 minutes prior to scheduled start')}
                  </div>
                </div>

                {session.meetingUrl ? (
                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Video size={16} />
                    <span>{isArabic ? 'الانضمام للقاعة المباشرة' : 'Join Live Chamber'}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                      color: textMuted,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {isArabic ? 'الرابط ينشط قريباً' : 'Activates 15m Prior'}
                  </span>
                )}
              </div>
            ) : (
              /* Unauthenticated View: NEVER expose session meeting link! */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(72, 81, 186, 0.1)',
                      color: isDark ? '#a5b4fc' : '#4851BA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Lock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: textHeading }}>
                      {isArabic ? 'رابط قاعة الحوار محصور بالأعضاء المسجلين' : 'Chamber Link Reserved for Authenticated Fellows'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: textMuted, marginTop: '0.25rem', lineHeight: 1.45 }}>
                      {isArabic
                        ? 'لحماية خصوصية ونزاهة المداولات الدولية، يتم إتاحة رابط قاعة الاجتماع الافتراضية حصرياً للأعضاء المعتمدين بعد تسجيل الدخول.'
                        : 'To uphold deliberative protocol and security, live meeting chamber links are strictly restricted to verified delegates and approved members.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingInlineStart: '2.8rem' }}>
                  <Link
                    to="/signin"
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {isArabic ? 'تسجيل الدخول للحضور' : 'Sign In to Access'}
                  </Link>
                  <Link
                    to="/apply"
                    onClick={onClose}
                    className="btn btn-outline"
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {isArabic ? 'تقديم طلب عضوية' : 'Apply for Membership'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: `1px solid ${borderSubtle}`,
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(248, 250, 252, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: textMuted }}>
            {isArabic ? 'منصة الحوار والتبادل الشبابي الدولي (GYDE)' : 'Global Youth Dialogue & Exchange (GYDE)'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {session.recordingUrl && (
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem', fontWeight: 600 }}
              >
                <span>{isArabic ? 'مشاهدة التسجيل' : 'Watch Recording'}</span>
                <ExternalLink size={12} style={{ marginInlineStart: '0.35rem' }} />
              </a>
            )}
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: '0.45rem 1.25rem', fontSize: '0.78rem', fontWeight: 600 }}
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
