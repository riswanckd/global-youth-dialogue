import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Login: React.FC = () => {
  const { isArabic } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // User is authenticated and role is set in AuthContext
      navigate('/portal');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="viewSignIn" className="app-view" style={{ display: 'block', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="auth-page-view">
        <div className="auth-page-card auth-card-member">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Link
              to="/"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderRadius: '999px', fontSize: '0.82rem', padding: '0.3rem 0.8rem' }}
            >
              &larr; {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
            <div className="auth-card-top-badge" style={{ marginBottom: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>GYDE Secure Access</span>
            </div>
          </div>

          <h2 className="serif-text auth-page-title">{isArabic ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}</h2>
          <div className="auth-page-arabic">
            تسجيل الدخول &mdash; الحوار الشبابي الدولي
          </div>
          <p className="auth-page-desc">
            {isArabic
              ? 'أدخل بيانات اعتمادك للوصول إلى بوابة الحوار الشبابي، وجلساتك، وأوراقك البحثية.'
              : 'Enter your credentials to access your member dialogue portal, scheduled sessions, and research papers.'}
          </p>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="form-group">
              <label className="form-label" htmlFor="unifiedEmail">
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                className="form-control"
                id="unifiedEmail"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="unifiedPassword">
                  {isArabic ? 'كلمة المرور' : 'Password'}
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary-1)' }}>
                  {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="unifiedPassword"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{
                    paddingRight: isArabic ? '0.75rem' : '2.5rem',
                    paddingLeft: isArabic ? '2.5rem' : '0.75rem',
                    width: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? (isArabic ? 'إخفاء كلمة المرور' : 'Hide password') : (isArabic ? 'إظهار كلمة المرور' : 'Show password')}
                  title={showPassword ? (isArabic ? 'إخفاء كلمة المرور' : 'Hide password') : (isArabic ? 'إظهار كلمة المرور' : 'Show password')}
                  style={{
                    position: 'absolute',
                    right: isArabic ? 'auto' : '0.75rem',
                    left: isArabic ? '0.75rem' : 'auto',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (isArabic ? 'جارٍ التحقق...' : 'Signing in...') : (isArabic ? 'تسجيل الدخول' : 'Sign In')} &rarr;
            </button>
          </form>

          <div className="auth-card-footer">
            <p style={{ textAlign: 'center', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
              <span>{isArabic ? 'ليس لديك حساب معتمد بعد؟' : "Don't have an approved account yet?"}</span>
              <Link to="/apply" style={{ color: 'var(--color-primary-1)', fontWeight: 700, marginInlineStart: '0.35rem' }}>
                {isArabic ? 'قدم طلب الانضمام' : 'Apply for membership'}
              </Link>
            </p>
            <div className="auth-divider"><span>OR</span></div>
            <div className="auth-switch-links" style={{ justifyContent: 'center' }}>
              <Link to="/" className="auth-nav-link">&larr; {isArabic ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home'}</Link>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.65rem 0.85rem', background: 'var(--bg-body)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{isArabic ? 'هل أنت مسؤول نظام؟' : 'Platform administrator?'}</span>
              {' '}
              <a 
                href={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://gyde-admin.vercel.app'} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--color-primary-1)', fontWeight: 600 }}
              >
                {isArabic ? 'الانتقال إلى بوابة الإدارة المستقلة' : 'Sign in via Admin Portal'} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
