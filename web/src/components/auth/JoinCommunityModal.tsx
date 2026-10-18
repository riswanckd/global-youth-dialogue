import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { countries } from 'countries-list';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { apiRequest } from '../../utils/api';
import { CATEGORIES } from '../../constants';

// Sorted countries list derived from countries-list
const countryOptions = Object.entries(countries)
  .map(([code, c]) => ({
    code,
    name: c.name,
    native: c.native,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isArabic } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Dynamic Theme Colors
  const bgCard = isDark ? '#141728' : '#ffffff';
  const bgInput = isDark ? '#1a1e34' : '#f8fafc';
  const borderInput = isDark ? '1.5px solid rgba(255, 255, 255, 0.14)' : '1.5px solid #e2e8f0';
  const textHeading = isDark ? '#ffffff' : '#0f172a';
  const textLabel = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const textInput = isDark ? '#ffffff' : '#0f172a';
  const btnBackBg = isDark ? '#1a1e34' : '#ffffff';
  const btnBackText = isDark ? '#e2e8f0' : '#475569';
  const btnBackBorder = isDark ? '1.5px solid rgba(255, 255, 255, 0.16)' : '1.5px solid #cbd5e1';
  const primaryBrand = isDark ? '#818cf8' : '#4851BA';
  const primaryGradient = isDark ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#4851BA';

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 Fields
  const [organization, setOrganization] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([CATEGORIES[0]?.name || 'Geopolitics & International Relations']);
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');

  // Step 3 Fields (OTP)
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (catName: string) => {
    setAreasOfInterest((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  // Step 1 -> Step 2 validation
  const handleNextToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError(isArabic ? 'يرجى إدخال الاسم الأول واسم العائلة.' : 'Please enter your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isArabic ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.');
      return;
    }
    if (!country) {
      setError(isArabic ? 'يرجى اختيار دولتك.' : 'Please select your country.');
      return;
    }
    if (password.length < 6) {
      setError(isArabic ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(isArabic ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    setStep(2);
  };

  // Step 2 -> Step 3: Trigger OTP sending
  const handleSendOtpAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (areasOfInterest.length === 0) {
      setError(isArabic ? 'يرجى اختيار مجال اهتمام واحد على الأقل.' : 'Please select at least one area of interest.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: fullName,
        }),
      });

      setStep(3);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(null);
    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: fullName,
        }),
      });

      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP and create application
  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError(isArabic ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام.' : 'Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const applicantName = `${firstName.trim()} ${lastName.trim()}`;

      // 1. Verify OTP
      await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email: normalizedEmail,
          otp: cleanOtp,
        }),
      });

      // 2. Submit Application
      await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({
          applicantName,
          email: normalizedEmail,
          password,
          country,
          organization: organization.trim(),
          experience: experience.trim() || 'Debate delegate applicant',
          motivation: motivation.trim() || 'Desire to contribute to international youth debate & exchange.',
          areasOfInterest,
          preferredLanguages: ['English'],
        }),
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Verification or submission failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      id="applyModal"
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .join-community-dialog {
          width: 100%;
          max-width: 680px !important;
          padding: 2rem 2.25rem !important;
        }
        @media (max-width: 768px) {
          .join-community-dialog {
            max-width: 450px !important;
            padding: 1.35rem 1.15rem !important;
          }
        }
      `}</style>
      <div
        id="applyModalDialog"
        className="modal-dialog join-community-dialog"
        style={{
          background: bgCard,
          color: textHeading,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          borderRadius: '20px',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.85)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.35rem',
            cursor: 'pointer',
            color: textMuted,
            lineHeight: 1,
            padding: '0.25rem',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(72, 81, 186, 0.12)',
                color: isDark ? '#a5b4fc' : '#4851BA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="serif-text" style={{ fontSize: '1.35rem', fontWeight: 700, color: textHeading, marginBottom: '0.45rem' }}>
              {isArabic ? 'تم التحقق وتقديم طلبك بنجاح!' : 'Application Submitted!'}
            </h2>
            <p style={{ color: textMuted, fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {isArabic
                ? 'تم التحقق من بريدك الإلكتروني بنجاح وتسجيل طلبك في سجل المراجعة. ستقوم الأمانة بإشعارك عند اعتماد العضوية.'
                : 'Your email has been verified and your community application is now queued for secretariat review. You can log in once approved.'}
            </p>
            <button
              onClick={handleSignInRedirect}
              style={{
                width: '100%',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: primaryGradient,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'الانتقال إلى صفحة تسجيل الدخول' : 'Proceed to Sign In'} &rarr;
            </button>
          </div>
        ) : (
          <>
            {/* Top Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  background: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(72, 81, 186, 0.08)',
                  color: isDark ? '#a5b4fc' : '#4851BA',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{isArabic ? 'التسجيل في مجتمع GYDE' : 'GYDE Community Registration'}</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2
              className="serif-text"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: textHeading,
                textAlign: 'center',
                margin: '0 0 0.25rem 0',
                lineHeight: 1.3,
              }}
            >
              {isArabic ? 'طلب العضوية في المجتمع الدولي' : 'Apply for Community Membership'}
            </h2>
            <p
              style={{
                fontSize: '0.78rem',
                color: textMuted,
                textAlign: 'center',
                margin: '0 auto 1.15rem auto',
                lineHeight: 1.4,
                maxWidth: '480px',
              }}
            >
              {isArabic
                ? 'أكمل طلبك في 3 خطوات بسيطة للانضمام إلى شبكتنا الدولية من المناظرين الشباب.'
                : 'Complete your application in 3 steps to join our international network of young debaters.'}
            </p>

            {/* 3-Step Stepper Header */}
            <div
              id="applyStepper"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                position: 'relative',
                padding: '0 0.75rem',
                maxWidth: '420px',
                margin: '0 auto 1.25rem auto',
              }}
            >
              {/* Stepper Connecting Lines */}
              <div
                style={{
                  position: 'absolute',
                  top: '13px',
                  left: '38px',
                  right: '38px',
                  height: '2px',
                  background: isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: isDark ? '#6366f1' : '#4851BA',
                    transition: 'width 0.3s ease',
                    width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                  }}
                ></div>
              </div>

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: step >= 1 ? (isDark ? '#6366f1' : '#4851BA') : (isDark ? '#1a1e34' : '#f1f5f9'),
                    border: step >= 1 ? 'none' : (isDark ? '1.5px solid rgba(255, 255, 255, 0.16)' : '2px solid #cbd5e1'),
                    color: step >= 1 ? '#ffffff' : textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: step === 1 ? (isDark ? '0 0 0 3px rgba(99, 102, 241, 0.3)' : '0 0 0 3px rgba(72, 81, 186, 0.15)') : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  1
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: step === 1 ? 700 : 500,
                    color: step === 1 ? textHeading : textMuted,
                    marginTop: '0.25rem',
                  }}
                >
                  {isArabic ? 'المعلومات الأساسية' : 'Basic Info'}
                </span>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: step >= 2 ? (isDark ? '#6366f1' : '#4851BA') : (isDark ? '#1a1e34' : '#f1f5f9'),
                    border: step >= 2 ? 'none' : (isDark ? '1.5px solid rgba(255, 255, 255, 0.16)' : '2px solid #cbd5e1'),
                    color: step >= 2 ? '#ffffff' : textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: step === 2 ? (isDark ? '0 0 0 3px rgba(99, 102, 241, 0.3)' : '0 0 0 3px rgba(72, 81, 186, 0.15)') : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  2
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: step === 2 ? 700 : 500,
                    color: step === 2 ? textHeading : textMuted,
                    marginTop: '0.25rem',
                  }}
                >
                  {isArabic ? 'التفاصيل' : 'Details'}
                </span>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: step === 3 ? (isDark ? '#6366f1' : '#4851BA') : (isDark ? '#1a1e34' : '#f1f5f9'),
                    border: step === 3 ? 'none' : (isDark ? '1.5px solid rgba(255, 255, 255, 0.16)' : '2px solid #cbd5e1'),
                    color: step === 3 ? '#ffffff' : textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: step === 3 ? (isDark ? '0 0 0 3px rgba(99, 102, 241, 0.3)' : '0 0 0 3px rgba(72, 81, 186, 0.15)') : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  3
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: step === 3 ? 700 : 500,
                    color: step === 3 ? textHeading : textMuted,
                    marginTop: '0.25rem',
                  }}
                >
                  {isArabic ? 'التحقق' : 'OTP Verification'}
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  background: isDark ? 'rgba(239, 68, 68, 0.18)' : '#fef2f2',
                  border: isDark ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid #fecaca',
                  color: isDark ? '#fca5a5' : '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}

            {/* Step 1 Form: Basic Info (1x6 Grid Format with Clean Refined Typography) */}
            {step === 1 && (
              <form onSubmit={handleNextToDetails}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem', marginBottom: '1rem' }}>
                  {/* 1. First Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'الاسم الأول' : 'First Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        border: borderInput,
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        background: bgInput,
                        color: textInput,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                      onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                    />
                  </div>

                  {/* 2. Last Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'اسم العائلة' : 'Last Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al-Mansoor"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        border: borderInput,
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        background: bgInput,
                        color: textInput,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                      onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                    />
                  </div>

                  {/* 3. Country */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'الدولة' : 'Country'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        border: borderInput,
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        background: bgInput,
                        color: textInput,
                        outline: 'none',
                      }}
                    >
                      {countryOptions.map((c) => (
                        <option key={c.code} value={c.name} style={{ background: bgCard, color: textHeading }}>
                          {c.name} {isArabic && c.native ? `(${c.native})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Email Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        border: borderInput,
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        background: bgInput,
                        color: textInput,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                      onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                    />
                  </div>

                  {/* 5. Set Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'تعيين كلمة المرور' : 'Set Password'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 2.2rem 0.55rem 0.75rem',
                          border: borderInput,
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          background: bgInput,
                          color: textInput,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                        onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.65rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: textMuted,
                          padding: '0.2rem',
                        }}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="7" r="3"></circle>
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        )}
                      </button>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: textMuted, marginTop: '0.2rem' }}>
                      {isArabic
                        ? 'ستستخدم كلمة المرور هذه لتسجيل الدخول بمجرد اعتماد عضويتك.'
                        : 'You will use this password to sign in once your membership is approved.'}
                    </span>
                  </div>

                  {/* 6. Confirm Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: textLabel, marginBottom: '0.25rem' }}>
                      {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 2.2rem 0.55rem 0.75rem',
                          border: borderInput,
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          background: bgInput,
                          color: textInput,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                        onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.65rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: textMuted,
                          padding: '0.2rem',
                        }}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                            <circle cx="12" cy="7" r="3"></circle>
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    background: primaryGradient,
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: isDark ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span>{isArabic ? 'التالي: التفاصيل الإضافية' : 'Next: Additional Details'}</span>
                  <span>&rarr;</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.78rem', color: textMuted }}>
                  <span>{isArabic ? 'هل لديك حساب معتمد بالفعل؟' : 'Already have an approved account?'}</span>{' '}
                  <button
                    type="button"
                    onClick={handleSignInRedirect}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDark ? '#a5b4fc' : '#4851BA',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '0.78rem',
                    }}
                  >
                    {isArabic ? 'تسجيل الدخول &larr;' : 'Sign In &rarr;'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Form: Details */}
            {step === 2 && (
              <form onSubmit={handleSendOtpAndProceed}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: textLabel, marginBottom: '0.35rem' }}>
                    {isArabic ? 'المؤسسة / المدرسة / الجامعة (اختياري)' : 'Organization / School / University (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Qatar Debate Alumni, Harvard Model UN, etc."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: borderInput,
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      background: bgInput,
                      color: textInput,
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                    onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: textLabel, marginBottom: '0.45rem' }}>
                    {isArabic ? 'المجالات الأكاديمية ومحاور النقاش المفضلة' : 'Primary Academic Spheres of Interest'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '140px', overflowY: 'auto', padding: '0.25rem 0' }}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = areasOfInterest.includes(cat.name);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleInterest(cat.name)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.76rem',
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected ? (isDark ? '#6366f1' : '#4851BA') : (isDark ? '#1a1e34' : '#f1f5f9'),
                            color: isSelected ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569'),
                            border: '1px solid',
                            borderColor: isSelected ? (isDark ? '#6366f1' : '#4851BA') : (isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0'),
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected ? (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginInlineEnd: '4px' }} aria-hidden="true">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <span style={{ marginInlineEnd: '4px' }}>+</span>
                          )}
                          {isArabic ? cat.nameAr : cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: textLabel, marginBottom: '0.35rem' }}>
                    {isArabic ? 'الخبرة التنافسية أو الخطابية السابقة' : 'Past Debate or Public Speaking Experience'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Participated in Qatar ISDC7, WSDC, local school debate tournaments..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: borderInput,
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      background: bgInput,
                      color: textInput,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                    onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: textLabel, marginBottom: '0.35rem' }}>
                    {isArabic ? 'دافع الانضمام إلى الحوار الدولي' : 'Statement of Motivation'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Why do you wish to join the GYDE international alumni chamber?"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: borderInput,
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      background: bgInput,
                      color: textInput,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = primaryBrand)}
                    onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0')}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      background: btnBackBg,
                      color: btnBackText,
                      border: btnBackBorder,
                      cursor: 'pointer',
                    }}
                  >
                    &larr; {isArabic ? 'السابق' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: primaryGradient,
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: isDark ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{loading ? (isArabic ? 'جارٍ إرسال الرمز...' : 'Sending Code...') : (isArabic ? 'التالي: رمز التحقق' : 'Next: Verify Email')}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3 Form: OTP Verification */}
            {step === 3 && (
              <form onSubmit={handleVerifyAndSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(72, 81, 186, 0.1)',
                      color: isDark ? '#a5b4fc' : '#4851BA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: textHeading, margin: '0 0 0.35rem 0' }}>
                    {isArabic ? 'التحقق من البريد الإلكتروني' : 'Verify Your Email'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: textMuted, margin: 0, lineHeight: 1.45 }}>
                    {isArabic ? 'أرسلنا رمز تحقق مكوّناً من 6 أرقام إلى:' : "We've sent a 6-digit verification code to:"}
                    <br />
                    <strong style={{ color: textHeading }}>{email}</strong>
                  </p>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: textLabel, marginBottom: '0.35rem', textAlign: 'center' }}>
                    {isArabic ? 'رمز التحقق (6 أرقام)' : 'Enter 6-Digit Code'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      maxWidth: '220px',
                      margin: '0 auto',
                      display: 'block',
                      padding: '0.75rem 1rem',
                      border: isDark ? '2px solid #818cf8' : '2px solid #4851BA',
                      borderRadius: '12px',
                      fontSize: '1.5rem',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: textInput,
                      background: bgInput,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      background: btnBackBg,
                      color: btnBackText,
                      border: btnBackBorder,
                      cursor: 'pointer',
                    }}
                  >
                    &larr; {isArabic ? 'السابق' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: primaryGradient,
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: isDark ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                      cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                      opacity: loading || otp.length !== 6 ? 0.7 : 1,
                    }}
                  >
                    {loading ? (isArabic ? 'جارٍ التحقق...' : 'Verifying & Submitting...') : (isArabic ? 'تأكيد الرمز وتقديم الطلب' : 'Verify & Submit Application')}
                  </button>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.825rem', color: textMuted }}>
                  <span>{isArabic ? 'لم تستلم الرمز؟' : "Didn't receive the code?"}</span>{' '}
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: resendCooldown > 0 ? textMuted : (isDark ? '#a5b4fc' : '#4851BA'),
                      fontWeight: 700,
                      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    {resendCooldown > 0
                      ? `${isArabic ? 'إعادة الإرسال بعد' : 'Resend in'} ${resendCooldown}s`
                      : (isArabic ? 'إعادة إرسال الرمز' : 'Resend Code')}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
