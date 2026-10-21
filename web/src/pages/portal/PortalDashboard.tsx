import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession, Topic, Publication } from '../../types';
import {
  Mic,
  Calendar,
  MessageSquareQuote,
  Lightbulb,
  BookOpen,
  FileText,
  Shield,
  Video,
  ExternalLink,
  ArrowRight,
  Bell,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { ApplyPresenterModal } from '../../components/portal/ApplyPresenterModal';
import { PresentTopicModal } from '../../components/portal/PresentTopicModal';

interface OutletContextType {
  openPresenterModal?: () => void;
  activeDashboardMode?: 'member' | 'presenter';
  toggleDashboardMode?: (mode: 'member' | 'presenter') => void;
}

export const PortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { openPresenterModal, activeDashboardMode, toggleDashboardMode } = useOutletContext<OutletContextType>() || {};

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [presentModalOpen, setPresentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'present') {
      setPresentModalOpen(true);
    }
  }, [location.search]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const userRoleUpper = user?.role?.toUpperCase() || '';
  const isSuperAdmin = userRoleUpper === 'SUPER_ADMIN' || user?.email === 'admin@thegyde.in';
  const isAdmin = isSuperAdmin || userRoleUpper === 'ADMIN' || userRoleUpper === 'COORDINATOR';
  const hasPresenterAccess = isAdmin || userRoleUpper === 'PRESENTER';

  const isPresenter = activeDashboardMode ? activeDashboardMode === 'presenter' : user?.role === 'PRESENTER';

  // Fetch dialogue sessions
  const { data: sessions = [] } = useQuery<DialogueSession[]>({
    queryKey: ['portal-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions').catch(() => []),
  });

  // Fetch topics
  const { data: topics = [], refetch: refetchTopics } = useQuery<Topic[]>({
    queryKey: ['portal-topics'],
    queryFn: () => apiRequest<Topic[]>('/topics').catch(() => []),
  });

  // Fetch research publications
  const { data: publications = [] } = useQuery<Publication[]>({
    queryKey: ['portal-publications'],
    queryFn: () => apiRequest<Publication[]>('/publications').catch(() => []),
  });

  const myPresentationApplications = topics.filter((t: any) =>
    t.interestedToPresent || (t.proposedBy?.userId && user?.id && String(t.proposedBy.userId) === String(user.id))
  );

  const nextSession = sessions.find((s) => s.status === 'scheduled' || s.status === 'live');
  const upcomingSessionsCount = sessions.filter((s) => s.status === 'scheduled' || s.status === 'live').length || 1;
  const activeEvaluationsCount = 4;
  const topicLibraryCount = topics.length || 16;
  const academicPapersCount = publications.length || 8;

  const handleOpenPresenterModal = () => {
    if (openPresenterModal) {
      openPresenterModal();
    } else {
      setLocalModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Page Header (Exact Admin Style & Sora Typography) */}
      <div>
        <h1
          style={{ fontFamily: isArabic ? "'Noto Kufi Arabic', sans-serif" : "'Sora', sans-serif" }}
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          {isPresenter
            ? (isArabic ? 'مساحة عمل المتحدث المعتمد' : 'Presenter Workspace')
            : (isArabic ? 'مساحة عمل العضو المعتمد' : 'Member Workspace')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          {isPresenter
            ? (isArabic
                ? 'متحدث رسمي معتمد • إلقاء الكلمات الافتتاحية وإدارة أوراق الحوار الأكاديمي'
                : 'Accredited Keynote Speaker & Floor Orator (Global Youth Dialogue Secretariat)')
            : (isArabic
                ? 'عضوية معتمدة تم التحقق منها • المشاركة في الحوارات الافتراضية والتصويت والتقييم'
                : 'Verified Academic Fellow & Floor Delegate (Global Youth Dialogue Framework)')}
        </p>

        {/* Action Buttons: 2x2 grid on mobile, row on desktop (Borderless, light tinted pills) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-2.5 mt-3.5">
          {/* Notifications button */}
          <button
            onClick={() => navigate('/portal/dashboard?notifications=open')}
            className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{isArabic ? 'الإشعارات' : 'Notifications'}</span>
          </button>

          {/* + Suggest / Propose Topic (Light indigo tint, no stroke) */}
          <button
            onClick={() => navigate('/portal/suggest-topic')}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-indigo-50/90 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">{isArabic ? 'اقتراح موضوع' : 'Suggest a Topic'}</span>
          </button>

          {/* Action pill: Request to be Presenter / Switch to Presenter Dashboard / Floor Speaking Schedule */}
          {!hasPresenterAccess ? (
            <button
              onClick={handleOpenPresenterModal}
              className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{isArabic ? 'طلب الاعتماد كمتحدث' : 'Request to be Presenter'}</span>
            </button>
          ) : !isPresenter ? (
            <button
              onClick={() => toggleDashboardMode ? toggleDashboardMode('presenter') : navigate('/portal')}
              className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{isArabic ? 'التبديل إلى لوحة المتحدث' : 'Switch to Presenter Dashboard'}</span>
            </button>
          ) : (
            <>
              {/* Primary Presenter Action: Apply to Present a Topic */}
              <button
                onClick={() => setPresentModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Mic className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">{isArabic ? 'تقديم طلب إلقاء كلمة' : 'Present a Topic'}</span>
              </button>

              {/* Floor Speaking Schedule */}
              <button
                onClick={() => navigate('/portal/sessions')}
                className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-violet-50/90 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                <span className="truncate">{isArabic ? 'جدول الكلمات الرسمية' : 'Floor Speaking Schedule'}</span>
              </button>
            </>
          )}

          {/* Delegate Dossier (Light neutral tint pill, no stroke) */}
          <button
            onClick={() => navigate('/portal/profile')}
            className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full border-0 border-none outline-none shadow-none bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{isArabic ? 'ملف التفويض' : 'Delegate Dossier'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid (2x2 on mobile, 4 in a row on desktop - Exact Admin Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 pt-1">
        {/* Card 1: Upcoming Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {upcomingSessionsCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {isArabic ? 'الجلسات القادمة' : 'Upcoming Sessions'}
            </div>
          </div>
        </div>

        {/* Card 2: Peer Evaluations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FEF3C7] dark:bg-amber-950/60 text-[#B45309] dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquareQuote className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeEvaluationsCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {isArabic ? 'تقييمات المناظرين' : 'Peer Evaluations'}
            </div>
          </div>
        </div>

        {/* Card 3: Topic Library */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {topicLibraryCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {isArabic ? 'بنك المواضيع والقضايا' : 'Topic Library & Motions'}
            </div>
          </div>
        </div>

        {/* Card 4: Academic Papers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-2.5 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {academicPapersCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {isArabic ? 'الأوراق البحثية المحكمة' : 'Academic Papers'}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout (Matching Admin Portal Arrangements) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2">
        {/* Left Column (2 Cols): Active Sessions & Research Papers */}
        <div className="lg:col-span-2 space-y-6">

          {/* Presenter Primary Hero Banner */}
          {isPresenter && (
            <div className="rounded-2xl bg-gradient-to-r from-indigo-50/90 via-violet-50/90 to-purple-50/90 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-purple-950/40 p-5 sm:p-6 border-0 border-none shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                    {isArabic ? 'الخيار الرئيسي للمتحدث' : 'Presenter Main Action'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {isArabic ? 'هل ترغب في إلقاء كلمة أو تقديم جلسة حوارية؟' : 'Apply to Present a Topic or Lead an Academic Dialogue'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {isArabic
                    ? 'اختر موضوعاً من بنك المواضيع الـ ١٦ المعتمد أو اقترح موضوعك الخاص يدوياً، وحدد التاريخ والتوقيت المفضلين لك وقدم طلبك للأمانة العامة لاعتماد موعدك.'
                    : 'Choose from our 16 curated research spheres or propose a custom motion, determine your preferred session date & time slot, and submit your official application to the Secretariat.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPresentModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer border-0 border-none outline-none"
              >
                <Mic className="w-4 h-4" />
                <span>{isArabic ? 'تقديم طلب إلقاء كلمة' : 'Apply to Present a Topic'}</span>
              </button>
            </div>
          )}

          {/* Member & Presenter Submitted Applications & Requests */}
          {myPresentationApplications.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'طلبات التقديم واقتراحات المواضيع الخاصة بك' : 'My Submissions & Applications Tracker'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic ? 'متابعة حالة الطلبات المقدمة للأمانة العامة واعتماد الإدارة' : 'Track review, approval, and scheduling status with the Secretariat Admin'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPresentModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 border-0 border-none outline-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'طلب جديد' : 'New Request'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {myPresentationApplications.map((app: any, idx: number) => (
                  <div key={app.id || idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                          {app.category}
                        </span>
                        {app.preferredDate && (
                          <span className="text-[11px] text-slate-400">
                            {app.preferredDate} ({app.preferredTimeSlot || '12:00 UTC'})
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {app.title}
                      </h4>
                    </div>
                    <div className="shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        app.status === 'scheduled' || app.status === 'approved' || app.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {app.status === 'scheduled'
                          ? (isArabic ? 'معتمد ومجدول' : 'Scheduled on Floor')
                          : app.status === 'approved' || app.status === 'published'
                          ? (isArabic ? 'معتمد ومنشور' : 'Approved & Published')
                          : app.status === 'rejected'
                          ? (isArabic ? 'مرفوض من الإدارة' : 'Denied by Admin')
                          : (isArabic ? 'قيد مراجعة الإدارة' : 'Pending Admin Review')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 1: Active Debate Chambers & Scheduled Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'جلسات ومنتديات الحوار المجدولة' : 'Active Dialogue Forums & Scheduled Sessions'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic ? 'الجلسات المجدولة ومسودات القضايا المطروحة للنقاش' : 'Live forum schedules and dialogue briefings'}
                </p>
              </div>
              <Link
                to="/portal/sessions"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                {isArabic ? 'عرض الكل' : 'Manage All'}
              </Link>
            </div>

            {nextSession ? (
              <div className="rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      {isArabic ? 'جلسة حوارية قادمة' : 'Next Scheduled Session'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(nextSession.scheduledAt).toLocaleString()} ({nextSession.timezone || 'Doha Time GMT+3'})
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {isArabic && nextSession.titleAr ? nextSession.titleAr : nextSession.title}
                  </h3>
                  {nextSession.motion && (
                    <div className="mt-2 text-xs bg-amber-50 dark:bg-amber-950/40 border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-400 text-amber-900 dark:text-amber-200 p-3 rounded-r-lg rtl:rounded-l-lg rtl:rounded-r-none font-medium">
                      <strong>{isArabic ? 'موضوع الحوار:' : 'Dialogue Theme:'}</strong> &quot;{nextSession.motion}&quot;
                    </div>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {isArabic && nextSession.descriptionAr ? nextSession.descriptionAr : nextSession.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextSession.presenters?.map((p) => p.name).join(', ') || 'Assigned Fellows'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextSession.durationMinutes || 90} {isArabic ? 'دقيقة' : 'Minutes'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {nextSession.meetingUrl ? (
                    <a
                      href={nextSession.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-slate-950 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'الانضمام لغرفة المناظرة' : 'Join Live Meeting Chamber'}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                      {isArabic ? 'الرابط ينشط قبل 15 دقيقة' : 'Meeting Link Activates 15m Prior'}
                    </span>
                  )}

                  <Link
                    to={`/portal/sessions/${nextSession.id}`}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>{isArabic ? 'ملف الجلسة والأبحاث' : 'Session Briefing & Dossier'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800">
                <Mic className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {isArabic ? 'لا توجد جلسات مجدولة حالياً' : 'No upcoming dialogue sessions.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isArabic
                    ? 'سيتم إشعارك فور اعتماد موعد المناظرة القادمة.'
                    : 'Upcoming parliamentary chambers and keynote sessions will appear here.'}
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Academic Research Papers & Syntheses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'أحدث الأوراق البحثية المحكمة' : 'Latest Research Papers & Syntheses'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic ? 'دراسات محكمة وملخصات السياسات العامة' : 'Peer-reviewed youth scholarship & policy dossiers'}
                </p>
              </div>
              <Link
                to="/portal/publications"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                {isArabic ? 'عرض المكتبة' : 'Browse Library'}
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {publications.length === 0 ? (
                <div className="py-10 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800">
                  <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {isArabic ? 'جاري فهرسة أحدث الأوراق الأكاديمية...' : 'New academic research papers will be indexed soon.'}
                  </p>
                </div>
              ) : (
                publications.slice(0, 3).map((pub) => (
                  <Link
                    key={pub.id}
                    to={`/publications/${pub.slug}`}
                    className="rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {isArabic && pub.titleAr ? pub.titleAr : pub.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{pub.category}</span>
                        <span>•</span>
                        <span className="truncate">{pub.authors?.join(', ') || 'GYDE Fellows'}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Dossier & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 1: Delegate Dossier */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'ملف التفويض والمصادقة' : 'Delegate Dossier'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                {isPresenter ? (isArabic ? 'متحدث' : 'PRESENTER') : (user?.role || (isArabic ? 'عضو' : 'MEMBER'))}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isPresenter
                ? (isArabic
                    ? 'تفويض أكاديمي معتمد لإلقاء أوراق العمل وقيادة المداولات في المناظرات الدولية.'
                    : 'Accredited keynote clearance to deliver thematic research presentations and lead parliamentary motions.')
                : (isArabic
                    ? 'عضوية معتمدة تم التحقق منها للمشاركة في المناظرات الافتراضية والتصويت البرلماني.'
                    : 'Verified institutional clearance to take the floor during live motions and cast peer evaluations.')}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isArabic ? 'الوفد والدولة:' : 'Delegation:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{user?.country || 'Ghana'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isArabic ? 'المؤسسة:' : 'Institution:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {user?.organization || 'Academic Forum'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isArabic ? 'مستوى التفويض:' : 'Clearance Level:'}</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isPresenter ? (isArabic ? 'متحدث رئيسي' : 'Keynote Presenter') : (isArabic ? 'وفد معتمد' : 'Verified Delegate')}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isArabic ? 'حالة الفصل الوطني:' : 'Chapter Status:'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{isArabic ? 'عضو نشط' : 'Active Delegate'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Delegate Actions (Exact Admin Coordinator Actions Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {isPresenter
                ? (isArabic ? 'إجراءات المتحدث' : 'Presenter Actions')
                : (isArabic ? 'إجراءات العضو' : 'Delegate Actions')}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              <Link
                to="/portal/sessions"
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="line-clamp-2 leading-snug">
                  {isArabic ? 'الانضمام للجلسات المباشرة' : 'Join Active Chambers'}
                </span>
              </Link>

              <Link
                to="/portal/publications"
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="line-clamp-2 leading-snug">
                  {isArabic ? 'قراءة الأوراق البحثية' : 'Read Academic Papers'}
                </span>
              </Link>

              <Link
                to="/portal/feedback"
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-purple-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <span className="line-clamp-2 leading-snug">
                  {isArabic ? 'تقديم تقييم المناظرين' : 'Submit Peer Evaluation'}
                </span>
              </Link>

              <Link
                to="/portal/suggest-topic"
                className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span className="line-clamp-2 leading-snug">
                  {isArabic ? 'اقتراح موضوع حوار' : 'Propose Dialogue Topic'}
                </span>
              </Link>
            </div>
          </div>

          {/* Card 3: Chamber Notices */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'تنبيهات منتدى الحوار' : 'Dialogue Forum Notices'}
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'جلسة الأحد القادمة مباشرة' : 'Upcoming Dialogue Session Ready'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {isArabic
                      ? 'تتوفر مذكرات الحوار والأوراق التمهيدية للأعضاء.'
                      : 'Dossier and research briefings uploaded for preparation.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'نموذج تقييم المتحدثين نشط' : 'Peer Evaluations Active'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {isArabic
                      ? 'شارك بملاحظاتك على أداء المناظرين في الجلسة الأخيرة.'
                      : 'Submit constructive critique on recent speaker motions.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback local presenter modal */}
      <ApplyPresenterModal
        isOpen={localModalOpen}
        onClose={() => setLocalModalOpen(false)}
      />

      {/* Present Topic Application Modal (Main Presenter Action) */}
      <PresentTopicModal
        isOpen={presentModalOpen}
        onClose={() => setPresentModalOpen(false)}
        onSuccess={() => {
          refetchTopics();
          showToast(
            isArabic
              ? 'تم تقديم طلب الجلسة بنجاح إلى الأمانة العامة!'
              : 'Presentation application submitted successfully to the Secretariat!'
          );
        }}
      />
    </div>
  );
};
