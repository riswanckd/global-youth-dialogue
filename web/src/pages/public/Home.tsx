import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { isDemoSession } from './Sessions';
import { SessionDetailModal } from '../../components/SessionDetailModal';
import { Layers, Calendar, PlayCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const { isArabic } = useLanguage();
  const { isDark } = useTheme();
  const highlightsRef = useRef<HTMLDivElement>(null);
  const [selectedHomeSession, setSelectedHomeSession] = useState<DialogueSession | null>(null);

  // Fetch approved & scheduled dialogue sessions for live homepage integration
  const { data: apiSessions = [], refetch } = useQuery<DialogueSession[]>({
    queryKey: ['public-home-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions').catch(() => []),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
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

    const handleSync = () => {
      readCache();
      refetch();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('gyde_sessions_updated', handleSync);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('gyde_channel');
      channel.onmessage = (e) => {
        if (e.data?.type === 'SESSIONS_UPDATED') {
          handleSync();
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('gyde_sessions_updated', handleSync);
      channel?.close();
    };
  }, [refetch]);

  // Keep local storage cache fresh whenever live API returns updated sessions
  useEffect(() => {
    if (Array.isArray(apiSessions) && apiSessions.length > 0) {
      const valid = apiSessions.filter((s: any) => !isDemoSession(s?.title));
      if (valid.length > 0) {
        try {
          localStorage.setItem('gyde_cached_sessions', JSON.stringify(valid));
        } catch {}
        setCachedSessions(valid);
      }
    }
  }, [apiSessions]);

  const nextUpcomingSession = useMemo(() => {
    const list = Array.isArray(apiSessions) ? apiSessions : [];
    const validApi = list.filter((s: any) => !isDemoSession(s?.title));
    // CRITICAL FIX: Server API data comes FIRST so admin updates instantly override stale cache
    const combined = [...validApi, ...cachedSessions];
    const now = Date.now();
    const seen = new Set<string>();
    const futureSessions: DialogueSession[] = [];

    for (const s of combined) {
      if (isDemoSession(s?.title)) continue;
      // Do not consider completed or cancelled sessions as upcoming
      if (s.status === 'completed' || s.status === 'cancelled' || s.status === 'rejected') continue;
      const key = (s.id || (s as any)._id || s.title || '').toString();
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const isApprovedOrScheduled = ['scheduled', 'approved', 'published', 'live'].includes(s.status);
      if (!isApprovedOrScheduled) continue;

      const sessionTime = s.scheduledAt ? new Date(s.scheduledAt).getTime() : 0;
      // Consider session upcoming if it is in future or within recent live window (last 3 hours)
      if (sessionTime >= now - 3 * 60 * 60 * 1000) {
        futureSessions.push(s);
      }
    }

    // Sort earliest upcoming first
    futureSessions.sort((a, b) => {
      const ta = a.scheduledAt ? new Date(a.scheduledAt).getTime() : Infinity;
      const tb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : Infinity;
      return ta - tb;
    });

    return futureSessions.length > 0 ? futureSessions[0] : null;
  }, [apiSessions, cachedSessions]);

  // Auto-center the middle highlight card on mobile view
  useEffect(() => {
    const centerSecondCard = () => {
      if (highlightsRef.current && window.innerWidth <= 768) {
        const secondCard = highlightsRef.current.children[1] as HTMLElement;
        if (secondCard) {
          const container = highlightsRef.current;
          const scrollPos = secondCard.offsetLeft - (container.clientWidth - secondCard.clientWidth) / 2;
          container.scrollTo({ left: Math.max(0, scrollPos), behavior: 'instant' as ScrollBehavior });
        }
      }
    };
    const t = setTimeout(centerSecondCard, 80);
    window.addEventListener('resize', centerSecondCard);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', centerSecondCard);
    };
  }, []);

  // Live countdown timer reactively listening to upcoming session date
  const [timeLeft, setTimeLeft] = useState({
    days: '03',
    hours: '14',
    minutes: '28',
    seconds: '42'
  });

  useEffect(() => {
    if (!nextUpcomingSession?.scheduledAt) {
      try {
        localStorage.removeItem('gyde_next_dialogue_time');
      } catch {}
      setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const target = new Date(nextUpcomingSession.scheduledAt).getTime();
      let diff = target - now;
      if (diff <= 0) {
        diff = 0;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [nextUpcomingSession?.scheduledAt]);

  return (
    <div className="public-section active" id="home">
      {/* Modern Asymmetric Split Hero Section */}
      <section className="hero-section">
        {/* Ambient Background Glow */}
        <div className="hero-ambient-glow"></div>

        {/* =========================================================================
            MOBILE VIEW HERO SHOWCASE (Matches Uploaded Design Pixel-for-Pixel)
            Only rendered on mobile screens (< 768px)
            ========================================================================= */}
        <div className="block md:hidden px-4 pt-3 pb-8 overflow-hidden relative">
          {/* Ambient Background Decorative Glows */}
          <div
            className="w-56 h-56 rounded-full blur-3xl absolute -top-10 -right-10 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(158,89,172,0.18) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(158,89,172,0.15) 0%, transparent 70%)',
            }}
          />
          <div
            className="w-40 h-40 rounded-full absolute top-[45%] -left-14 pointer-events-none"
            style={{
              border: isDark ? '1px solid rgba(158,89,172,0.2)' : '1px solid rgba(72,81,186,0.15)',
            }}
          />
          <div
            className="w-64 h-64 rounded-full blur-2xl absolute top-[52%] left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(72,81,186,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(72,81,186,0.1) 0%, transparent 70%)',
            }}
          />

          {/* 1. Community Eyebrow Pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3.5 shadow-xs"
            style={{
              background: isDark ? 'rgba(158, 89, 172, 0.16)' : 'rgba(72, 81, 186, 0.08)',
              border: isDark ? '1px solid rgba(158, 89, 172, 0.38)' : '1px solid rgba(72, 81, 186, 0.22)',
              color: isDark ? '#d8b4fe' : '#4851ba',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-soft shrink-0"
              style={{ background: isDark ? '#c084fc' : '#4851ba' }}
            />
            <span className="truncate">{isArabic ? 'مجتمع الحوار الشبابي العالمي' : 'GLOBAL YOUTH DIALOGUE COMMUNITY'}</span>
          </div>

          {/* 2. Bold Hero Heading */}
          <h1
            style={{
              fontFamily: isArabic ? "'Noto Kufi Arabic', sans-serif" : "'Sora', sans-serif",
              color: isDark ? '#FFFFFF' : '#000000',
            }}
            className="text-[34px] font-black leading-[1.12] tracking-tight mb-3"
          >
            {isArabic ? (
              <>
                <span style={{ color: isDark ? '#FFFFFF' : '#000000' }}>حيث تلتقي العقول الشابة</span>
                <span
                  style={{
                    display: 'block',
                    color: isDark ? '#c084fc' : '#4851ba',
                    fontWeight: 900,
                  }}
                >
                  بالعالم.
                </span>
              </>
            ) : (
              <>
                <span style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Where young minds</span>
                <span
                  style={{
                    display: 'block',
                    color: isDark ? '#c084fc' : '#4851ba',
                    fontWeight: 900,
                  }}
                >
                  meet the world.
                </span>
              </>
            )}
          </h1>

          {/* 3. Description Subheading */}
          <p
            className="text-[14px] leading-[1.65] font-normal mb-5"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.78)',
            }}
          >
            {isArabic
              ? 'مجتمع دولي يقوده الشباب، حيث يستكشف المفكرون والعقول الشابة القضايا العالمية، ويتبادلون الرؤى ويطورون أفكاراً محكمة عبر الحوار المنظم.'
              : 'A youth-led international community where young minds and thinkers explore global issues, exchange perspectives and develop well-reasoned ideas through structured dialogue.'}
          </p>

          {/* 4. Action Buttons (Full width with smooth active micro-animations) */}
          <div className="space-y-3 mb-8">
            <Link
              to="/apply"
              id="mobileHeroApplyBtn"
              className="w-full py-3.5 px-6 rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all active:scale-[0.98] outline-none"
              style={{
                background: 'linear-gradient(135deg, #4851BA 0%, #7038B0 50%, #9E59AC 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(72, 81, 186, 0.38)',
                border: 'none',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>
                {isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}
              </span>
              <span className="rtl:rotate-180 inline-block font-bold text-base" style={{ color: '#FFFFFF' }}>
                &rarr;
              </span>
            </Link>
            <Link
              to="/sessions"
              id="mobileHeroExploreBtn"
              className="w-full py-3.5 px-6 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-all active:scale-[0.98] outline-none"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#000000',
                border: isDark
                  ? '1.5px solid rgba(158, 89, 172, 0.45)'
                  : '1.5px solid rgba(72, 81, 186, 0.28)',
                boxShadow: isDark
                  ? '0 4px 14px rgba(0, 0, 0, 0.4)'
                  : '0 2px 8px rgba(72, 81, 186, 0.06)',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: isDark ? '#FFFFFF' : '#000000', fontWeight: 700 }}>
                {isArabic ? 'استكشاف جلسات الحوار' : 'Explore Dialogue Sessions'}
              </span>
            </Link>
          </div>

          {/* 5. Curated Photo Collage (Exact Composition from Mockup) */}
          <div className="relative pt-3 pb-6 w-full max-w-[360px] mx-auto">
            {/* Playful radiating dash sparks (Top-right of cards) */}
            <div
              className="absolute -top-1 right-6 sm:right-10 z-10 animate-spark-rotate pointer-events-none"
              style={{ color: isDark ? '#c084fc' : '#4851ba' }}
            >
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <path d="M12 28L6 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M22 20L20 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M30 10L36 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M26 18L36 16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Main Card: Keynote Speaker at podium */}
            <div
              className="w-[78%] rounded-[28px] overflow-hidden relative aspect-[4/4.8]"
              style={{
                border: isDark ? '3.5px solid #1e293b' : '3.5px solid #FFFFFF',
                boxShadow: isDark
                  ? '0 12px 32px rgba(0,0,0,0.5)'
                  : '0 12px 32px rgba(72,81,186,0.12)',
                background: isDark ? '#0f172a' : '#f8fafc',
              }}
            >
              <img
                src="/assets/images/delegate_floor_speech.jpg"
                alt="Youth delegate delivering keynote address"
                className="w-full h-full object-cover"
              />
              {/* Floor Keynote Speech Capsule Tag */}
              <div
                className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-md"
                style={{
                  background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                  color: isDark ? '#FFFFFF' : '#000000',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isDark ? '#c084fc' : '#4851ba' }} className="shrink-0">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span className="text-[11px] font-bold truncate" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                  {isArabic ? 'كلمة المتحدث الرئيسي' : 'Floor Keynote Speech'}
                </span>
              </div>
            </div>

            {/* Overlapping Card: International delegates walking together outdoors */}
            <div
              className="absolute -bottom-2 right-0 sm:-right-2 z-20 w-[60%] rounded-[24px] overflow-hidden aspect-[4/3.4] animate-float-slow"
              style={{
                border: isDark ? '3.5px solid #1e293b' : '3.5px solid #FFFFFF',
                boxShadow: isDark
                  ? '0 16px 36px rgba(0,0,0,0.6)'
                  : '0 16px 36px rgba(72,81,186,0.18)',
                background: isDark ? '#0f172a' : '#f8fafc',
              }}
            >
              <img
                src="/assets/images/delegates_walk_outdoor.jpg"
                alt="International youth delegates walking together"
                className="w-full h-full object-cover"
              />
              {/* 18+ Nations Badge (Top Right) */}
              <div
                className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs"
                style={{
                  background: 'rgba(0, 0, 0, 0.88)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span
                  className="text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: '#4851BA' }}
                >
                  18+
                </span>
                <span className="font-bold text-[10.5px]" style={{ color: '#FFFFFF' }}>
                  {isArabic ? 'دولة' : 'Nations'}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Bottom Indicators & Globe Hairline */}
          <div className="flex items-center justify-between mt-4 pt-1 max-w-[360px] mx-auto">
            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: isDark ? '#c084fc' : '#4851ba' }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: isDark ? 'rgba(192, 132, 252, 0.28)' : 'rgba(72, 81, 186, 0.22)' }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: isDark ? 'rgba(192, 132, 252, 0.28)' : 'rgba(72, 81, 186, 0.22)' }}
              />
            </div>

            {/* Subtle dividing line & delicate wireframe globe icon */}
            <div className="flex items-center gap-3 flex-1 ml-4 rtl:ml-0 rtl:mr-4">
              <div
                className="flex-1 h-[1px]"
                style={{ background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)' }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                style={{ color: isDark ? '#c084fc' : '#4851ba', opacity: 0.65 }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP VIEW HERO SECTION (Untouched original layout for md: and above)
            ========================================================================= */}
        <div className="hidden md:block container">
          <div className="hero-grid">
            {/* Left Column: Editorial Content & CTAs */}
            <div className="hero-content">
              <div className="hero-eyebrow mobile-pill-tag">
                <span className="pill-dash"></span>
                <span>{isArabic ? 'مجتمع الحوار الشبابي العالمي' : 'GLOBAL YOUTH DIALOGUE COMMUNITY'}</span>
              </div>

              <h1 className="hero-title serif-text">
                {isArabic ? (
                  <>
                    حيث تلتقي العقول الشابة <br />
                    <span className="gradient-accent-text">بالعالم.</span>
                  </>
                ) : (
                  <>
                    Where young minds <br />
                    <span className="gradient-accent-text">meet the world.</span>
                  </>
                )}
              </h1>

              <div className="hero-subtitle-lead">
                {isArabic
                  ? 'منتدى الحوار والأكاديميا الشبابي الدولي'
                  : 'Global Youth Academic & Dialogue Forum'}
              </div>

              <p className="hero-subtext">
                {isArabic
                  ? 'مجتمع دولي يقوده الشباب، حيث يستكشف المفكرون والعقول الشابة القضايا العالمية، ويتبادلون الرؤى ويطورون أفكاراً محكمة عبر الحوار المنظم.'
                  : 'A youth-led international community where young minds and thinkers explore global issues, exchange perspectives and develop well-reasoned ideas through structured dialogue.'}
              </p>

              <div className="hero-actions">
                <Link to="/apply" className="btn btn-primary btn-lg hero-cta-pill" id="heroJoinBtn">
                  <span>{isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
                </Link>
                <Link to="/sessions" className="btn btn-outline btn-lg hero-cta-explore" id="heroSessionsBtn">
                  {isArabic ? 'استكشاف جلسات الحوار' : 'Explore Dialogue Sessions'}
                </Link>
              </div>

              {/* 4-Item Diamond Bullet Metadata Grid */}
              <div className="hero-meta-grid">
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? '14+ فرعاً وممثلاً دولياً' : '14+ Global Chapters'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? 'حوارات فكرية أسبوعية منظمة' : 'Weekly Structured Dialogues'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? '60+ مفكراً وباحثاً شاباً' : '60+ Active Youth Fellows'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? 'أوراق بحثية شبابية 100%' : '100% Youth-Researched Papers'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Curated Photo Community Collage */}
            <div className="hero-collage-wrap">
              {/* Decorative Geometric Sunburst Accent (Desktop) */}
              <svg className="hero-sunburst-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
              </svg>

              <div className="hero-collage-grid">
                {/* Main Keynote Speaker Card */}
                <div className="collage-main-card">
                  <img src="/assets/images/delegate_floor_speech.jpg" alt="Youth delegate delivering keynote address" className="collage-main-img" />
                  <div className="collage-badge-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <span>{isArabic ? 'كلمة المتحدث الرئيسي' : 'Floor Keynote Speech'}</span>
                  </div>
                </div>

                {/* Stacked Column (Walk + Academic Presentation) */}
                <div className="collage-stack-col">
                  {/* Top: Outdoor Global Walk */}
                  <div className="collage-stack-card collage-sub-overlap">
                    <img src="/assets/images/delegates_walk_outdoor.jpg" alt="International youth delegates walking together" className="collage-stack-img" />
                    <div className="collage-badge-tag collage-walk-badge">
                      <span className="badge-num-pill">16+</span>
                      <span>{isArabic ? 'دولة' : 'Nations'}</span>
                    </div>
                  </div>

                  {/* Bottom: Academic Research Delegate */}
                  <div className="collage-stack-card collage-desktop-only">
                    <img src="/assets/images/debate_session_roundtable.jpg" alt="Youth delegates participating in academic dialogue session" className="collage-stack-img" />
                    <div className="collage-badge-tag">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                      <span>{isArabic ? 'البحث الأكاديمي' : 'Academic Research'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Live Session Countdown Strip (Overlapping Hero Bottom) */}
      <div className="container floating-countdown-strip" id="heroCountdownStrip">
        <div
          className="floating-countdown-card"
          style={
            !nextUpcomingSession
              ? {
                  background: isDark ? 'rgba(30, 27, 75, 0.95)' : 'linear-gradient(135deg, #ffffff 0%, #f4f6fc 100%)',
                  border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(72, 81, 186, 0.15)',
                  boxShadow: '0 12px 36px rgba(72, 81, 186, 0.08)',
                }
              : undefined
          }
        >
          <div className="countdown-label-wrap">
            <div className="countdown-radar-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span
                className="radar-dot"
                style={!nextUpcomingSession ? { background: '#6366f1', boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)' } : undefined}
              ></span>
              <span>{nextUpcomingSession ? (isArabic ? 'جلسة الحوار القادمة' : 'Next Global Dialogue Forum') : (isArabic ? 'حالة جدول الحوارات' : 'Dialogue Schedule Status')}</span>
              {nextUpcomingSession ? (
                <span style={{ padding: '0.12rem 0.5rem', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.16)', fontSize: '0.7rem', fontWeight: 700 }}>
                  {nextUpcomingSession.format || (isArabic ? 'مناظرة برلمانية' : 'Youth Chamber Debate')}
                </span>
              ) : (
                <span style={{ padding: '0.12rem 0.5rem', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.14)', color: 'var(--color-primary-1)', fontSize: '0.7rem', fontWeight: 700 }}>
                  {isArabic ? 'استراحة بين الجلسات' : 'Inter-Session Recess'}
                </span>
              )}
            </div>
            <h4
              className="countdown-topic-title"
              style={nextUpcomingSession ? { cursor: 'pointer' } : undefined}
              onClick={() => {
                if (nextUpcomingSession) setSelectedHomeSession(nextUpcomingSession);
              }}
            >
              {nextUpcomingSession
                ? (isArabic && nextUpcomingSession.titleAr ? nextUpcomingSession.titleAr : nextUpcomingSession.title)
                : (isArabic ? 'لا توجد جلسات حوارية قادمة مجدولة حالياً' : 'No upcoming session scheduled right now')}
            </h4>
          </div>

          {nextUpcomingSession ? (
            /* Digital Countdown Boxes Group */
            <div className="countdown-boxes-group">
              <div className="countdown-box">
                <span className="countdown-digit" id="timerDays">{timeLeft.days}</span>
                <span className="countdown-unit">{isArabic ? 'أيام' : 'Days'}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-box">
                <span className="countdown-digit" id="timerHours">{timeLeft.hours}</span>
                <span className="countdown-unit">{isArabic ? 'ساعات' : 'Hours'}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-box">
                <span className="countdown-digit" id="timerMinutes">{timeLeft.minutes}</span>
                <span className="countdown-unit">{isArabic ? 'دقائق' : 'Mins'}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-box">
                <span className="countdown-digit" id="timerSeconds">{timeLeft.seconds}</span>
                <span className="countdown-unit">{isArabic ? 'ثوانٍ' : 'Secs'}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>{isArabic ? 'تسجيلات الجلسات السابقة وأوراق السياسات متاحة' : 'Recordings & session papers available'}</span>
            </div>
          )}

          {/* Action Button: Routes directly to all sessions tab with session query OR completed sessions */}
          <Link
            to={
              nextUpcomingSession
                ? `/sessions?session=${nextUpcomingSession.id || (nextUpcomingSession as any)._id || encodeURIComponent(nextUpcomingSession.title)}`
                : '/sessions?filter=Completed'
            }
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {nextUpcomingSession ? (
              <>
                <span>{isArabic ? 'التسجيل للحضور' : 'Register to Attend'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
              </>
            ) : (
              <>
                <span>{isArabic ? 'مشاهدة الجلسات المكتملة' : 'View Completed Sessions'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
              </>
            )}
          </Link>
        </div>
      </div>

      {/* Continuous Silky Marquee Ribbon */}
      <div className="marquee-ribbon-wrap">
        <div className="marquee-track">
          {isArabic ? (
            <>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> ١٤+ فرع وممثل دولي
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> الدوحة</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> أكرا</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> ساو باولو</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> أكسفورد</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> نيودلهي</div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M4 7l8-4 8 4"></path><path d="M1 11l4-4 4 4a4 4 0 0 1-8 0z"></path><path d="M15 11l4-4 4 4a4 4 0 0 1-8 0z"></path></svg> جلسات حوار أسبوعية منظمة
              </div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> أوراق بحثية شبابية ١٠٠٪
              </div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> ٦٠+ مفكراً وباحثاً شاباً
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> واشنطن العاصمة</div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> ١٤+ فرع وممثل دولي
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> الدوحة</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> أكرا</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> ساو باولو</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> أكسفورد</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> نيودلهي</div>
            </>
          ) : (
            <>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> 14+ Global Chapters
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Accra</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Doha</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> S&atilde;o Paulo</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Oxford</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> New Delhi</div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M4 7l8-4 8 4"></path><path d="M1 11l4-4 4 4a4 4 0 0 1-8 0z"></path><path d="M15 11l4-4 4 4a4 4 0 0 1-8 0z"></path></svg> Weekly Structured Dialogue Sessions
              </div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> 100% Youth-Researched Papers
              </div>
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> 60+ International Fellows & Thinkers
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Washington D.C.</div>
              {/* Loop duplicates */}
              <div className="marquee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> 14+ Global Chapters
              </div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Accra</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Doha</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> S&atilde;o Paulo</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> Oxford</div>
              <div className="marquee-item"><span className="marquee-star">&#10022;</span> New Delhi</div>
            </>
          )}
        </div>
      </div>

      {/* Key Metrics Strip with Animated Numbers */}
      <div className="metrics-strip">
        <div className="container">
          <div className="metrics-grid" id="metricsCounterGrid">
            <div className="metric-item">
              <div className="metric-number-animated" id="statNationsNum">14+</div>
              <div className="metric-label">{isArabic ? 'دولة ممثلة' : 'Countries Represented'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statFellowsNum">60+</div>
              <div className="metric-label">{isArabic ? 'مفكراً وباحثاً شاباً' : 'Youth Fellows & Thinkers'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statSessionsNum">52</div>
              <div className="metric-label">{isArabic ? 'جلسة حوار أسبوعية سنوياً' : 'Weekly Dialogue Sessions / Yr'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statWritingsNum">100%</div>
              <div className="metric-label">{isArabic ? 'محتوى وبحوث يقودها الشباب' : 'Youth-Led & Researched (%)'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Upcoming Session Spotlight Box */}
      <section className="home-upcoming-section">
        <div className="container">
          <div className="home-upcoming-header">
            <div className="home-upcoming-title-wrap">
              <span className="section-tag">
                {nextUpcomingSession
                  ? (isArabic ? 'الجلسة القادمة المجدولة' : 'Next Scheduled Dialogue')
                  : (isArabic ? 'جدول الحوارات الدولية' : 'Global Dialogue Schedule')}
              </span>
              <h2 className="serif-text home-upcoming-main-title">
                {nextUpcomingSession
                  ? (isArabic ? 'جلسة الحوار القادمة' : 'Upcoming Dialogue Session')
                  : (isArabic ? 'جلسات الحوار والمناظرات' : 'Dialogue Sessions & Forums')}
              </h2>
              <p className="home-upcoming-sub">
                {nextUpcomingSession
                  ? (isArabic
                      ? 'انضم إلى حوارنا الدولي الأسبوعي المنظم مع مشاركين يمثلون أكثر من 14 دولة.'
                      : 'Join our weekly structured international dialogue with participants representing over 14 countries.')
                  : (isArabic
                      ? 'جلسات الحوار الأسبوعية المنظمة والأرشيف الأكاديمي لمشاركين يمثلون أكثر من 14 دولة.'
                      : 'Weekly structured international dialogues and recorded academic archives representing participants across 14+ countries.')}
              </p>
            </div>
            <Link to="/sessions?filter=Completed" className="btn btn-outline btn-sm home-upcoming-all-btn">
              <span>{isArabic ? 'عرض جميع الجلسات والأرشيف' : 'View All Sessions & Archives'}</span> &rarr;
            </Link>
          </div>

          {/* Spotlight Container with Rotating Sunburst Accents */}
          <div className="spotlight-sunburst-wrapper">
            <svg className="moving-sunburst-accent spotlight-sunburst-tr" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
            </svg>
            <svg className="moving-sunburst-accent spotlight-sunburst-bl accent-indigo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
            </svg>

            <div
              className="home-upcoming-container"
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '2.5rem',
                borderRadius: '24px',
              }}
            >
              {nextUpcomingSession ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: '1 1 400px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', background: 'rgba(72, 81, 186, 0.1)', color: 'var(--color-primary-1)', fontWeight: 700, fontSize: '0.78rem' }}>
                        {(isArabic && nextUpcomingSession.categoryNameAr ? nextUpcomingSession.categoryNameAr : nextUpcomingSession.category) || (isArabic ? 'حوار دولي' : 'International Dialogue')}
                      </span>
                      {/* FORMAT BADGE DISPLAYED EVERYWHERE UPCOMING SESSION IS PUBLISHED */}
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: 700, fontSize: '0.78rem', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Layers size={12} />
                        <span>{nextUpcomingSession.format || (isArabic ? 'مناظرة برلمانية' : 'Youth Chamber Debate')}</span>
                      </span>
                    </div>
                    <h3
                      className="serif-text"
                      style={{ fontSize: '1.65rem', marginBottom: '0.75rem', color: 'var(--text-main)', cursor: 'pointer' }}
                      onClick={() => setSelectedHomeSession(nextUpcomingSession)}
                    >
                      {isArabic && nextUpcomingSession.titleAr ? nextUpcomingSession.titleAr : nextUpcomingSession.title}
                    </h3>
                    {nextUpcomingSession.motion && (
                      <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', borderInlineStart: '3px solid #f59e0b', fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-body)', marginBottom: '0.75rem' }}>
                        &ldquo;{nextUpcomingSession.motion}&rdquo;
                      </div>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                      {isArabic && nextUpcomingSession.descriptionAr ? nextUpcomingSession.descriptionAr : nextUpcomingSession.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-body)', fontWeight: 500 }}>
                      <div>
                        <strong>{isArabic ? 'التاريخ:' : 'Date:'}</strong>{' '}
                        {nextUpcomingSession.scheduledAt
                          ? new Date(nextUpcomingSession.scheduledAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
                          : (isArabic ? 'تحدد لاحقاً' : 'TBD')}
                      </div>
                      <div>
                        <strong>{isArabic ? 'الوقت:' : 'Time:'}</strong>{' '}
                        {nextUpcomingSession.scheduledAt
                          ? `${String(new Date(nextUpcomingSession.scheduledAt).getUTCHours()).padStart(2, '0')}:${String(new Date(nextUpcomingSession.scheduledAt).getUTCMinutes()).padStart(2, '0')} UTC`
                          : '14:00 UTC'}
                      </div>
                      <div>
                        <strong>{isArabic ? 'مدير الجلسة:' : 'Moderator:'}</strong>{' '}
                        {nextUpcomingSession.moderator || (isArabic ? 'الأمانة الأكاديمية' : 'GYDE Secretariat')}
                      </div>
                    </div>
                  </div>
                  <div className="home-upcoming-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                      to={`/sessions?session=${nextUpcomingSession.id || (nextUpcomingSession as any)._id || encodeURIComponent(nextUpcomingSession.title)}`}
                      className="btn btn-outline"
                      style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                    >
                      <span>{isArabic ? 'تفاصيل الجلسة' : 'Session Details'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedHomeSession(nextUpcomingSession)}
                      className="btn btn-outline"
                      style={{ textAlign: 'center', whiteSpace: 'nowrap', fontSize: '0.78rem' }}
                    >
                      <span>{isArabic ? 'معاينة سريعة' : 'Quick Preview'}</span>
                    </button>
                    <Link to="/apply" className="btn btn-primary" id="upcomingApplyBtn" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span>{isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', maxWidth: '640px', margin: '0 auto' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: 'rgba(72, 81, 186, 0.08)',
                      color: 'var(--color-primary-1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(72, 81, 186, 0.15)',
                    }}
                  >
                    <Calendar size={32} />
                  </div>
                  <h3
                    className="serif-text"
                    style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}
                  >
                    {isArabic ? 'لا توجد جلسات قادمة مجدولة حالياً' : 'No upcoming session scheduled right now'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '1.85rem' }}>
                    {isArabic
                      ? 'سيتم الإعلان عن موعد منتدى الحوار والمناظرات البرلمانية القادمة هنا قريباً. في هذه الأثناء، يمكنك تصفح أرشيف الجلسات المنعقدة، ومشاهدة التسجيلات وقراءة الأوراق البحثية.'
                      : 'Upcoming parliamentary chambers, international debate forums, and keynote sessions will be announced here soon. In the meantime, explore recordings and briefs from our completed sessions.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link
                      to="/sessions?filter=Completed"
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                    >
                      <PlayCircle size={16} />
                      <span>{isArabic ? 'مشاهدة الجلسات المكتملة' : 'View Completed Sessions'}</span>
                      <span className="rtl-flip-arrow inline-block">&rarr;</span>
                    </Link>
                    <Link to="/apply" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
                      <span>{isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}</span>
                    </Link>
                    <Link to="/publications" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
                      <span>{isArabic ? 'الأبحاث والمنشورات' : 'Research Publications'}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Welcome Highlights (Home Section Cards) */}
      <section className="home-highlights-section">
        <div className="container">
          <div className="home-highlights-grid" ref={highlightsRef}>
            <Link to="/about" className="highlight-feature-card" data-public-nav="about" style={{ textDecoration: 'none' }}>
              <div className="feature-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="2" y1="22" x2="22" y2="22"></line>
                  <line x1="12" y1="2" x2="12" y2="7"></line>
                  <line x1="12" y1="2" x2="22" y2="7"></line>
                  <line x1="2" y1="7" x2="22" y2="7"></line>
                  <line x1="4" y1="7" x2="4" y2="18"></line>
                  <line x1="8" y1="7" x2="8" y2="18"></line>
                  <line x1="12" y1="7" x2="12" y2="18"></line>
                  <line x1="16" y1="7" x2="16" y2="18"></line>
                  <line x1="20" y1="7" x2="20" y2="18"></line>
                  <line x1="2" y1="18" x2="22" y2="18"></line>
                </svg>
              </div>
              <h3 className="serif-text">{isArabic ? 'عن المبادرة والنشأة' : 'About the Movement'}</h3>
              <p>
                {isArabic
                  ? 'أسسها شباب ومفكرون التقوا في محافل دولية لبناء شبكة أكاديمية حوارية عالمية دائمة.'
                  : 'Founded by young scholars who met at an international forum to build a lasting global academic dialogue network.'}
              </p>
              <span className="feature-learn-more">
                <span>{isArabic ? 'معرفة المزيد' : 'Learn More'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
              </span>
            </Link>

            {/* Center Featured Highlight with Rotating Geometric Sunburst Accent */}
            <div className="highlight-sunburst-card-wrap">
              <svg className="moving-sunburst-accent highlight-card-sunburst" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
              </svg>
              <Link to="/topics" className="highlight-feature-card highlight-featured-accent" data-public-nav="topics" style={{ textDecoration: 'none' }}>
                <div className="feature-icon-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="serif-text">{isArabic ? '16 محوراً معرفياً تخصصياً' : '16 Core Knowledge Spheres'}</h3>
                <p>
                  {isArabic
                    ? 'استكشف مجالات متعددة التخصصات من الجيوسياسة وأخلاقيات الذكاء الاصطناعي إلى المناخ والحوكمة وحقوق الإنسان.'
                    : 'Explore multidisciplinary arenas from Geopolitics & AI Ethics to Climate, Governance, and Human Rights.'}
                </p>
                <span className="feature-learn-more">
                  <span>{isArabic ? 'استكشاف المحاور' : 'Explore Topics'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
                </span>
              </Link>
            </div>

            <Link to="/community" className="highlight-feature-card" data-public-nav="impact" style={{ textDecoration: 'none' }}>
              <div className="feature-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h3 className="serif-text">{isArabic ? 'أثرنا في الشباب' : 'Our Impact'}</h3>
              <p>
                {isArabic
                  ? 'تطوير مستمر يمتد لآفاق واسعة: بناء مهارات البحث الرصين، الخطابة، الصياغة الأكاديمية، والقيادة الدولية.'
                  : 'Cultivate global perspectives: develop rigorous research, public discourse, academic writing, and international leadership.'}
              </p>
              <span className="feature-learn-more">
                <span>{isArabic ? 'اكتشف الأثر' : 'Discover Impact'}</span> <span className="rtl-flip-arrow inline-block">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pop-up Session Detail Modal (Protects meeting chamber link for non-signed-in home page visitors) */}
      <SessionDetailModal
        isOpen={!!selectedHomeSession}
        onClose={() => setSelectedHomeSession(null)}
        session={selectedHomeSession}
      />
    </div>
  );
};
