import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const PortalJourney: React.FC = () => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const isPresenter = ['presenter', 'PRESENTER'].includes(user?.role as string);

  // Stats calculation based on user record / defaults matching legacy experience
  const dialoguesAttended = 2;
  const sessionsSpoken = isPresenter ? 3 : 1;
  const papersAuthored = 0;
  const communityScore = 92;

  const badges = [
    {
      id: 'isdc7_veteran',
      title: isArabic ? 'مندوب مؤسس في ملتقى قطر الدولي' : 'Qatar Founding Dialogue Delegate',
      desc: isArabic
        ? 'شارك في النسخة السابعة من المؤتمر الدولي للحوار الطلابي بالدوحة'
        : 'Participated in the Doha 7th International Youth Dialogue Forum',
      unlocked: true,
      progress: '100%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>
      ),
    },
    {
      id: 'distinguished_speaker',
      title: isArabic ? 'متحدث متميز' : 'Distinguished Speaker',
      desc: isArabic
        ? 'قدم خطابات افتتاحية أو تفنيدية رئيسية في 3 جلسات حوار دولية فأكثر'
        : 'Delivered principal constructive or rebuttal speeches in 3+ international sessions',
      unlocked: sessionsSpoken >= 3,
      progress: isPresenter ? '100%' : '33%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      ),
    },
    {
      id: 'academic_fellow',
      title: isArabic ? 'مساهم في البحث الأكاديمي' : 'Academic Research Contributor',
      desc: isArabic
        ? 'ألّف أو ساهم في إعداد أوراق سياسات شبابية محكمة ومعتمدة'
        : 'Authored or contributed to peer-reviewed youth policy synthesis papers',
      unlocked: papersAuthored >= 1,
      progress: '50%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      id: 'agenda_setter',
      title: isArabic ? 'صانع أجندة الحوار' : 'Dialogue Agenda Setter',
      desc: isArabic
        ? 'اقترح قضايا ومحاور حوارية معتمدة تتناول أولويات الحوكمة العالمية'
        : 'Suggested approved dialogue topics tackling high-priority global governance issues',
      unlocked: false,
      progress: '33%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path>
        </svg>
      ),
    },
    {
      id: 'peer_reviewer',
      title: isArabic ? 'مقيم أقران بنّاء' : 'Constructive Peer Reviewer',
      desc: isArabic
        ? 'قدّم تقييمات نوعية وملاحظات منظمة خلال جولات الحوار المكتملة'
        : 'Provided structured qualitative feedback across completed dialogue rounds',
      unlocked: false,
      progress: '20%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="portal-subview-content" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Page Header */}
      <div className="portal-page-header mb-4 sm:mb-6">
        <div className="portal-page-title">
          <h1 className="text-base sm:text-2xl font-bold font-heading text-slate-900 dark:text-white m-0">
            {isArabic ? 'مسيرتي الحوارية والأوسمة' : 'My Dialogue Journey & Badges'}
          </h1>
          <p className="text-[11px] sm:text-sm font-sans text-slate-500 dark:text-slate-400 mt-1 mb-0">
            {isArabic
              ? 'سجلك في الحوارات الأكاديمية ومساهماتك والتقدير الدولي المحقق.'
              : 'Your academic dialogue track record, contributions, and international recognition.'}
          </p>
        </div>
      </div>

      {/* Maintenance / Coming Soon Banner */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold text-sm">
          ⏳
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <span>{isArabic ? 'قيد التطوير والتحديث الأكاديمي' : 'Under Development & Maintenance'}</span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 tracking-wider">
              {isArabic ? 'قريباً' : 'Soon'}
            </span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300/90 mt-0.5 m-0 font-sans">
            {isArabic
              ? 'يجري حالياً تحديث مسار الأوسمة وسجل المشاركات الأكاديمية. سيتم إعادة تفعيل هذه الوحدة قريباً.'
              : 'The dialogue milestone and honors system is currently being upgraded and will be available shortly.'}
          </p>
        </div>
      </div>

      <div className="opacity-60 pointer-events-none select-none">
        {/* Analytics Hero Stats Strip: 2x2 on mobile, 4-col on desktop */}
      <div className="analytics-hero-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
        <div className="analytics-stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 sm:p-5 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="analytics-stat-num text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading leading-tight mb-0.5">{dialoguesAttended}</div>
          <div className="analytics-stat-label text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 font-sans leading-tight">{isArabic ? 'جلسات تم حضورها' : 'Dialogues Attended'}</div>
        </div>

        <div className="analytics-stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 sm:p-5 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="analytics-stat-num text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading leading-tight mb-0.5">{sessionsSpoken}</div>
          <div className="analytics-stat-label text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 font-sans leading-tight">{isArabic ? 'جلسات حوار تم التحدث فيها' : 'Sessions Spoken'}</div>
        </div>

        <div className="analytics-stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 sm:p-5 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="analytics-stat-num text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading leading-tight mb-0.5">{papersAuthored}</div>
          <div className="analytics-stat-label text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 font-sans leading-tight">{isArabic ? 'أوراق أكاديمية منشورة' : 'Academic Papers Authored'}</div>
        </div>

        <div className="analytics-stat-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 sm:p-5 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="analytics-stat-num text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading leading-tight mb-0.5">{communityScore}%</div>
          <div className="analytics-stat-label text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 font-sans leading-tight">{isArabic ? 'نقاط التفاعل المجتمعي' : 'Community Score'}</div>
        </div>
      </div>

      {/* Honorary Dialogue Badges Showcase */}
      <div className="card-panel bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs">
        <div className="panel-header flex justify-between items-center flex-wrap gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="m-0 text-xs sm:text-base font-bold font-heading text-slate-900 dark:text-white">
              {isArabic ? 'أوسمة الحوار الشرفية' : 'Honorary Dialogue Badges'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans mb-0">
              {isArabic ? 'تقدير التميز في الحوار والمساهمات الأكاديمية' : 'Recognizing dialogue excellence and academic contributions'}
            </p>
          </div>
        </div>

        <div className="badges-showcase-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {badges.map((b) => (
            <div key={b.id} className={`badge-honor-card ${b.unlocked ? '' : 'locked'} p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between`}>
              <div>
                <div className="badge-icon-header flex items-center justify-between gap-1 mb-2">
                  <div className="badge-icon-box w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shrink-0">
                    {b.icon}
                  </div>
                  <span
                    className={`badge-status-pill text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      b.unlocked
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {b.unlocked ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{isArabic ? 'تم الحصول عليه' : 'UNLOCKED'}</span>
                      </>
                    ) : (
                      <span>{isArabic ? 'قيد الإنجاز' : 'IN PROGRESS'}</span>
                    )}
                  </span>
                </div>

                <div className="badge-title text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {b.title}
                </div>
                <p className="badge-desc text-[10px] sm:text-xs font-sans text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {b.desc}
                </p>
              </div>

              <div className="badge-progress-wrap mt-auto">
                <div className="badge-progress-bar h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="badge-progress-fill h-full rounded-full transition-all duration-500"
                    style={{
                      width: b.progress,
                      background: b.unlocked ? 'linear-gradient(90deg, #4851BA, #9E59AC)' : '#94a3b8',
                    }}
                  ></div>
                </div>
                <div className="badge-progress-label flex justify-between text-[9px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-sans mt-1">
                  <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                  <span>{b.progress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
