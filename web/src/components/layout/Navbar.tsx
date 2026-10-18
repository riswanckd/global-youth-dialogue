import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { JoinCommunityModal } from '../auth/JoinCommunityModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [memberAccessModalOpen, setMemberAccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          {/* Brand Logo (Official GYDE Full Logo) */}
          <Link to="/" className="brand-identity" id="brandLogo" aria-label="Global Youth Dialogue & Exchange">
            <img src="/assets/images/gyde_full_logo.png" alt="Global Youth Dialogue & Exchange (GYDE)" className="brand-logo-img logo-light" />
            <img src="/assets/images/gyde_full_logo_dark.png" alt="Global Youth Dialogue & Exchange (GYDE)" className="brand-logo-img logo-dark" />
          </Link>

          {/* Public Navigation */}
          <nav className="main-nav" id="publicNav">
            <Link to="/" className={`nav-link ${isActive('/') && !location.hash ? 'active' : ''}`}>
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              {isArabic ? 'عن المبادرة' : 'About'}
            </Link>
            <Link to="/topics" className={`nav-link ${isActive('/topics') ? 'active' : ''}`}>
              {isArabic ? 'المواضيع' : 'Topics'}
            </Link>
            <Link to="/sessions" className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}>
              {isArabic ? 'الجلسات' : 'Sessions'}
            </Link>
            <Link to="/publications" className={`nav-link ${isActive('/publications') ? 'active' : ''}`}>
              {isArabic ? 'الأوراق البحثية' : 'Publications'}
            </Link>
            <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>
              {isArabic ? 'المجتمع' : 'Our Impact'}
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="header-actions">
            {/* Search Button */}
            <button
              className="header-control-btn"
              id="headerSearchBtn"
              title={isArabic ? 'البحث' : 'Search GYDE'}
              onClick={() => navigate('/topics')}
            >
              <span className="svg-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <span className="search-btn-label">{isArabic ? 'بحث' : 'Search'}</span>
            </button>

            {/* Theme Switcher Button */}
            <button
              className="theme-toggle-btn"
              id="themeToggleBtn"
              title={isArabic ? 'تبديل المظهر' : 'Toggle Light / Dark Mode'}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <span id="themeToggleIcon">
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                )}
              </span>
            </button>

            {/* Language Switcher Button */}
            <button
              className="btn-lang"
              id="langToggleBtn"
              title={isArabic ? 'Switch to English' : 'تغيير اللغة إلى العربية'}
              onClick={toggleLanguage}
            >
              <span className="svg-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Dynamic User Status / Action Buttons */}
            <div id="authActionsContainer">
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/portal" className="btn btn-primary btn-sm">
                    {isArabic ? 'لوحة العضو' : 'Portal'}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    {isArabic ? 'خروج' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline btn-sm" id="headerLoginBtn">
                    {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                  </Link>
                  <button
                    onClick={() => setJoinModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    id="headerJoinBtn"
                    style={{ cursor: 'pointer' }}
                  >
                    {isArabic ? 'انضم إلينا' : 'Join Us'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Sign In / Member Access Button */}
            <div className="mobile-auth-btn-wrapper">
              {isAuthenticated && user ? (
                <Link
                  to="/portal"
                  className="mobile-header-signin-btn member-active"
                  id="mobileHeaderPortalBtn"
                  title={isArabic ? 'لوحة العضو' : 'Member Portal'}
                >
                  <span className="mobile-signin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <span className="mobile-signin-text">{isArabic ? 'لوحتي' : 'Portal'}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setMemberAccessModalOpen(true)}
                  className="mobile-header-signin-btn"
                  id="mobileHeaderSignInBtn"
                  aria-label={isArabic ? 'تسجيل الدخول' : 'Sign In'}
                >
                  <span className="mobile-signin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                  </span>
                  <span className="mobile-signin-text">{isArabic ? 'دخول' : 'Sign In'}</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button (hidden on home page and on mobile view) */}
            {location.pathname !== '/' && location.pathname !== '' && (
              <button
                className="mobile-menu-btn"
                id="mobileMenuToggleBtn"
                aria-label="Toggle Navigation Menu"
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas / Drawer Navigation */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          id="mobileDrawerBackdrop"
          style={{ display: 'block', opacity: 1 }}
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <aside
        className={`mobile-nav-drawer ${mobileDrawerOpen ? 'open' : ''}`}
        id="mobileNavDrawer"
        aria-hidden={!mobileDrawerOpen}
        style={{ transform: mobileDrawerOpen ? 'translateX(0)' : undefined }}
      >
        <div className="mobile-drawer-header">
          <div className="brand-identity">
            <img src="/assets/images/gyde_full_logo.png" alt="GYDE Logo" className="brand-logo-img logo-light" style={{ height: '44px', width: 'auto' }} />
            <img src="/assets/images/gyde_full_logo_dark.png" alt="GYDE Logo" className="brand-logo-img logo-dark" style={{ height: '44px', width: 'auto' }} />
          </div>
          <button
            className="modal-close-btn"
            id="mobileDrawerCloseBtn"
            aria-label="Close Menu"
            onClick={() => setMobileDrawerOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="mobile-drawer-body">
          <nav className="mobile-drawer-nav">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'عن المبادرة' : 'About'}
            </Link>
            <Link to="/dialogue-cycle" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'دورة الحوار' : 'Process'}
            </Link>
            <Link to="/topics" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'المواضيع' : 'Topics'}
            </Link>
            <Link to="/sessions" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الجلسات' : 'Sessions'}
            </Link>
            <Link to="/publications" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الأوراق البحثية' : 'Publications'}
            </Link>
            <Link to="/community" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الأثر والمجتمع' : 'Our Impact'}
            </Link>
          </nav>
          <div className="mobile-drawer-actions" id="mobileDrawerActions" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <Link to="/portal" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileDrawerOpen(false)}>
                  {isArabic ? 'لوحة العضو' : 'Member Portal'}
                </Link>
                <button onClick={() => { handleLogout(); setMobileDrawerOpen(false); }} className="btn btn-outline" style={{ width: '100%' }}>
                  {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileDrawerOpen(false)}>
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setJoinModalOpen(true);
                  }}
                >
                  {isArabic ? 'انضم إلينا' : 'Join Us'}
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Member Access Modal (Registered Member Sign In vs New User Apply) */}
      {memberAccessModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setMemberAccessModalOpen(false)}
        >
          <div
            className="modal-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              backgroundColor: isDark ? '#141728' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
              borderRadius: '20px',
              padding: '1.75rem 1.5rem',
              boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #e2e8f0',
              textAlign: isArabic ? 'right' : 'left',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMemberAccessModalOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                insetInlineEnd: '1rem',
                background: 'transparent',
                border: 'none',
                color: isDark ? '#94a3b8' : '#64748b',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                lineHeight: 1,
              }}
            >
              &times;
            </button>

            {/* Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)'
                    : 'linear-gradient(135deg, rgba(72, 81, 186, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
                  color: isDark ? '#a5b4fc' : '#4851BA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: isDark ? '#c084fc' : '#4851BA',
                  background: isDark ? 'rgba(192, 132, 252, 0.14)' : 'rgba(72, 81, 186, 0.08)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  display: 'inline-block',
                }}
              >
                {isArabic ? 'بوابة دخول الأعضاء' : 'Member Portal Access'}
              </span>

              <h2
                className="serif-text"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  marginTop: '0.65rem',
                  marginBottom: '0.35rem',
                  lineHeight: '1.3',
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
              >
                {isArabic ? 'تسجيل الدخول إلى المجتمع' : 'Sign In to GYDE Portal'}
              </h2>

              <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.5', margin: 0 }}>
                {isArabic
                  ? 'مرحباً بك في مجتمع الحوار والتبادل الشبابي الدولي. يرجى اختيار حالة حسابك للمتابعة:'
                  : 'Welcome to the international youth dialogue chambers. Please select your account status to continue:'}
              </p>
            </div>

            {/* Actions Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Option 1: Registered Member */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: isDark ? '1.5px solid rgba(255, 255, 255, 0.1)' : '1.5px solid #e2e8f0',
                  backgroundColor: isDark ? '#1a1e34' : '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isDark ? '#ffffff' : '#0f172a' }}>
                    {isArabic ? 'عضو مسجل بالفعل؟' : 'Registered Member?'}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isDark ? '#4ade80' : '#16a34a', background: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(22, 163, 74, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                    {isArabic ? 'حساب نشط' : 'Active Account'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {isArabic ? 'سجل دخولك ببريدك الإلكتروني وكلمة المرور للدخول إلى لوحة المندوب.' : 'Sign in using your accredited email and credentials to enter your member dossier.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMemberAccessModalOpen(false);
                    navigate('/login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    marginTop: '0.25rem',
                    background: isDark ? '#222744' : '#ffffff',
                    color: isDark ? '#c7d2fe' : '#4851BA',
                    border: isDark ? '1.5px solid rgba(129, 140, 248, 0.35)' : '1.5px solid #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>{isArabic ? 'تسجيل الدخول كعضو مسجل' : 'Sign In as Registered Member'}</span>
                </button>
              </div>

              {/* Option 2: New User Suggestion */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: isDark ? '1.5px solid rgba(129, 140, 248, 0.35)' : '1.5px solid rgba(72, 81, 186, 0.35)',
                  backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(72, 81, 186, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isDark ? '#c7d2fe' : '#4851BA' }}>
                    {isArabic ? 'مستخدم جديد؟' : 'New User?'}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isDark ? '#e9d5ff' : '#4851BA', background: isDark ? 'rgba(192, 132, 252, 0.2)' : 'rgba(72, 81, 186, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                    {isArabic ? 'مطلوب طلب عضوية' : 'Application Required'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {isArabic
                    ? 'عضوية المنتدى معتمدة وتخضع للمراجعة. يرجى تقديم طلبك للانضمام إلى الوفود الدولية.'
                    : 'GYDE membership is selective and accredited. New delegates must submit a membership application to be approved.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMemberAccessModalOpen(false);
                    setJoinModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    marginTop: '0.25rem',
                    background: isDark ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#4851BA',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: isDark ? '0 4px 14px rgba(99, 102, 241, 0.4)' : '0 4px 12px rgba(72, 81, 186, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  <span>{isArabic ? 'تقديم طلب العضوية الآن' : 'Apply for Membership'} &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Membership Registration Modal with OTP Verification */}
      <JoinCommunityModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </>
  );
};
