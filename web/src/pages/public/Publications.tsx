import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';
import { JoinCommunityModal } from '../../components/auth/JoinCommunityModal';

import { BookOpen } from 'lucide-react';

export const DEMO_PUBLICATIONS: Publication[] = [];

export const Publications: React.FC = () => {
  const { isArabic } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Publication | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const { data: apiPubs = [] } = useQuery<Publication[]>({
    queryKey: ['publications', search],
    queryFn: () => apiRequest<Publication[]>(`/publications?search=${encodeURIComponent(search)}`).catch(() => []),
  });

  const [cachedPubs, setCachedPubs] = useState<Publication[]>([]);

  useEffect(() => {
    const readCache = () => {
      try {
        const stored = localStorage.getItem('gyde_cached_publications');
        if (stored) {
          setCachedPubs(JSON.parse(stored));
        }
      } catch {}
    };
    readCache();
    window.addEventListener('storage', readCache);
    return () => window.removeEventListener('storage', readCache);
  }, []);

  const combinedPubs = React.useMemo(() => {
    const apiList = Array.isArray(apiPubs) ? apiPubs : [];
    const all = [...cachedPubs, ...apiList];
    const seen = new Set<string>();
    const unique: Publication[] = [];

    for (const p of all) {
      const key = (p.slug || p.id || p.title || '').toLowerCase().trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }
    return unique;
  }, [apiPubs, cachedPubs]);

  const displayList = combinedPubs;
  const filtered = displayList.filter(p => {
    const authorName = p.authors?.[0]?.name || p.author?.name || '';
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.titleAr && p.titleAr.includes(search)) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      authorName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleReadPaperClick = (pub: Publication) => {
    if (isAuthenticated) {
      navigate(`/publications/${pub.slug || pub.id}`);
    } else {
      setSelectedPaper(pub);
      setAccessModalOpen(true);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="section-tag">{isArabic ? 'المكتبة الأكاديمية المحكمة' : 'Academic Research Repository'}</span>
        <h1 className="section-title serif-text" style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          {isArabic ? 'الأوراق البحثية والدراسات المحكمة' : 'Youth Research Papers & Publications'}
        </h1>
        <p className="section-desc" style={{ maxWidth: '680px', margin: '0 auto' }}>
          {isArabic
            ? 'أوراق بحثية من ثمانية أقسام منهجية تصاغ بعد كل جلسة حوارية وتخضع للتحكيم الأكاديمي بواسطة الهيئة الاستشارية.'
            : '8-part structured academic papers synthesized directly from bi-weekly academic dialogues, peer-reviewed by our research secretariat.'}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '480px', margin: '0 auto 2.5rem', position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          placeholder={isArabic ? 'بحث في العناوين والملخصات والمؤلفين...' : 'Search by paper title, abstract, or author...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingInlineStart: '2.25rem' }}
        />
        <span style={{ position: 'absolute', insetInlineStart: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </div>

      {/* Publications Grid or Empty State */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(72, 81, 186, 0.03)',
            borderRadius: '24px',
            border: '1px dashed rgba(72, 81, 186, 0.2)',
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(72, 81, 186, 0.08)',
              color: 'var(--brand-primary, #4851BA)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <BookOpen size={28} />
          </div>
          <h3 className="serif-text" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            {isArabic ? 'لا توجد أوراق بحثية منشورة حالياً' : 'No research papers published yet'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            {isArabic
              ? 'يتم إعداد الأوراق البحثية المحكمة بعد انعقاد الجلسات الحوارية واعتمادها من الهيئة الاستشارية. انضم إلينا أو سجل الدخول لتصلك الأبحاث فور نشرها.'
              : 'Peer-reviewed academic papers synthesized from our dialogue sessions will appear here once officially published. Apply for membership or sign in to access full research monographs.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.35rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.88rem' }}
            >
              <span>{isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}</span> &rarr;
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.88rem' }}
            >
              <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {filtered.map((pub) => {
            const author = pub.authors?.[0] || pub.author || { name: 'GYDE Fellow', country: 'Global' };
            return (
              <div key={pub.id} className="card-panel" style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="category-pill" style={{ color: 'var(--color-primary-1)', fontWeight: 600 }}>{pub.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pub.publishedAt}</span>
                </div>

                <h3 className="serif-text" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                  {isArabic && pub.titleAr ? pub.titleAr : pub.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                  {pub.abstract}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span><strong>{author.name}</strong> ({author.country})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReadPaperClick(pub)}
                    className="btn btn-outline btn-sm"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>{isArabic ? 'قراءة الورقة' : 'Read Paper'}</span> &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member-Access Restriction Pop-up Modal */}
      {accessModalOpen && selectedPaper && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(9, 13, 22, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setAccessModalOpen(false)}
        >
          <div
            className="card-panel"
            style={{
              maxWidth: '480px',
              width: '100%',
              background: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-main, #0f172a)',
              borderRadius: '24px',
              padding: '2.25rem 2rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              border: '1px solid var(--border-medium, rgba(72, 81, 186, 0.15))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setAccessModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                insetInlineEnd: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Lock Icon & Badge */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(72, 81, 186, 0.15), rgba(158, 89, 172, 0.2))',
                  color: 'var(--brand-primary, #4851BA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--brand-primary, #4851BA)',
                  background: 'rgba(72, 81, 186, 0.08)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  display: 'inline-block',
                }}
              >
                {isArabic ? 'محتوى أكاديمي محكم مخصص للأعضاء' : 'Members-Only Academic Research'}
              </span>

              <h2
                className="serif-text"
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                  marginBottom: '0.5rem',
                  lineHeight: '1.3',
                  color: 'var(--text-main)',
                }}
              >
                {isArabic ? 'يرجى تسجيل الدخول أو الانضمام لقراءة الورقة' : 'Sign In or Apply to Read Paper'}
              </h2>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>
                {isArabic
                  ? 'الأوراق الأكاديمية الكاملة المنبثقة عن جلسات الحوار مخصصة حصرياً لأعضاء منتدى الحوار الدولي المعتمدين.'
                  : 'Full academic monographs and dialogue briefing dossiers are peer-reviewed research papers reserved for verified GYDE community members.'}
              </p>
            </div>

            {/* Target Paper Box */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-subtle, rgba(72, 81, 186, 0.05))',
                border: '1px solid var(--border-light, rgba(72, 81, 186, 0.12))',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--brand-primary, #4851BA)', fontWeight: 700, marginBottom: '3px' }}>
                {selectedPaper.category}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.35' }}>
                "{isArabic && selectedPaper.titleAr ? selectedPaper.titleAr : selectedPaper.title}"
              </div>
            </div>

            {/* Dual CTAs: Registered Member vs New User */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setAccessModalOpen(false);
                  navigate(`/login?redirect=/publications/${selectedPaper.slug || selectedPaper.id}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>{isArabic ? 'عضو مسجل؟ تسجيل الدخول' : 'Registered Member? Sign In'}</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setAccessModalOpen(false);
                  setJoinModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                <span>{isArabic ? 'مستخدم جديد؟ تقديم طلب العضوية' : 'New User? Apply for Membership'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Membership Application Modal */}
      <JoinCommunityModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </div>
  );
};
