import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { getCountryMeta } from '../../utils/country';
import { EditSessionModal } from '../../components/portal/EditSessionModal';
import {
  ArrowLeft,
  Calendar,
  Video,
  Clock,
  Users,
  Shield,
  ExternalLink,
  Edit3,
  Globe,
  Award,
  Presentation,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  User,
  Mic,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const PortalSessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isArabic } = useLanguage();
  const { isCoordinator } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: session, isLoading, isError } = useQuery<DialogueSession>({
    queryKey: ['portal-session', id],
    queryFn: () => apiRequest<DialogueSession>(`/sessions/${id}`),
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">{isArabic ? 'جاري تحميل ملف إحاطة الجلسة...' : 'Loading session briefing dossier...'}</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'لم يتم العثور على الجلسة' : 'Session Not Found'}
        </h2>
        <Link to="/portal/sessions" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">
          {isArabic ? 'العودة إلى جدول الجلسات' : 'Return to Sessions'}
        </Link>
      </div>
    );
  }

  // Determine Session Format
  const rawFormat = (session.format || (session as any).sessionCategory || '').toLowerCase();
  const isStructuralDebate = rawFormat.includes('debate') || rawFormat.includes('parliamentary');
  const isDiscussion = rawFormat.includes('discussion') || rawFormat.includes('roundtable') || rawFormat.includes('forum');
  const isGuestTalk = rawFormat.includes('guest');
  const isTopicPresentation = !isStructuralDebate && !isDiscussion && !isGuestTalk;

  // Format Scheduled Date & Time
  let displayDate = '';
  let displayUtcTime = '';
  let displayLocalTime = '';
  if (session.scheduledAt) {
    const d = new Date(session.scheduledAt);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
      const utcHours = String(d.getUTCHours()).padStart(2, '0');
      const utcMins = String(d.getUTCMinutes()).padStart(2, '0');
      displayUtcTime = `${utcHours}:${utcMins} UTC`;
      displayLocalTime = '';
    }
  }

  const rawMod = session.moderator?.trim();
  const hasModerator = !isStructuralDebate && Boolean(rawMod);
  const moderatorName = rawMod || '';
  let moderatorCountry = session.moderatorCountry?.trim() || '';
  if (hasModerator && !moderatorCountry && moderatorName) {
    const lower = moderatorName.toLowerCase();
    if (lower.includes('sümeyye') || lower.includes('sumeyye')) moderatorCountry = 'Türkiye';
    else if (lower.includes('mubashir')) moderatorCountry = 'India';
    else if (lower.includes('atheer') || lower.includes('ghassan') || lower.includes('safaa')) moderatorCountry = 'Sudan';
    else if (lower.includes('menna') || lower.includes('أناهيد')) moderatorCountry = 'Libya';
    else if (lower.includes('charrak')) moderatorCountry = 'Algeria';
    else if (lower.includes('jwan')) moderatorCountry = 'Jordan';
  }
  const moderatorCountryMeta = moderatorCountry ? getCountryMeta(moderatorCountry) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back and Coordinator Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/portal/sessions')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isArabic ? 'العودة إلى الجلسات والمناقشات' : 'Back to Sessions & Chambers'}</span>
        </button>

        {isCoordinator && (
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'تعديل بيانات الجلسة' : 'Edit Session'}</span>
          </button>
        )}
      </div>

      {/* Main Dossier Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 inline-flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>{session.category}</span>
            </span>

            <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 inline-flex items-center gap-1.5">
              {isTopicPresentation && <Presentation className="w-3 h-3" />}
              {isStructuralDebate && <Layers className="w-3 h-3" />}
              {isDiscussion && <MessageSquare className="w-3 h-3" />}
              {isGuestTalk && <Award className="w-3 h-3" />}
              <span>{session.format || (isTopicPresentation ? 'Topic Presentation' : 'Dialogue Chamber')}</span>
            </span>

            {session.status === 'completed' ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {isArabic ? 'مكتملة ومؤرشفة' : 'Concluded'}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {isArabic ? 'مجدولة ومؤكدة' : 'Scheduled & Confirmed'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{session.durationMinutes || 90} {isArabic ? 'دقيقة' : 'Mins'}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="serif-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {isArabic && session.titleAr ? session.titleAr : session.title}
        </h1>

        {/* Motion or Thesis (if applicable) */}
        {session.motion && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-200">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              {isArabic ? 'قضية الحوار / المحور المؤسسي:' : 'Dialogue Resolution / Core Proposition:'}
            </span>
            &ldquo;{session.motion}&rdquo;
          </div>
        )}

        {/* Description / Overview */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isArabic && session.descriptionAr ? session.descriptionAr : session.description}
        </p>

        {/* Action Link: Live Meeting or Completed Recording */}
        {session.status !== 'completed' && session.meetingUrl && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isArabic ? 'قاعة الحوار المباشرة عبر الإنترنت' : 'Live Dialogue Chamber Video Link'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isArabic ? 'يمكن لجميع الأعضاء والوفود الانضمام مباشرة للقاعة' : 'Open to all verified youth delegates & participants'}
              </span>
            </div>
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{isArabic ? 'دخول القاعة (Google Meet)' : 'Launch Google Meet'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {session.status === 'completed' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isArabic ? 'تسجيل وقائع الجلسة' : 'Session Proceeding & Recording Archive'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isArabic ? 'تم اختتام الجلسة وتوثيق مخرجاتها في الأرشيف' : 'The session has concluded and entered the official digital archive'}
              </span>
            </div>
            {session.recordingUrl ? (
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{isArabic ? 'مشاهدة الجلسة المسجلة (يوتيوب)' : 'Watch Recorded Session (YouTube)'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-400 font-medium px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 inline-block">
                {isArabic ? 'التسجيل قيد المعالجة والرفع' : 'Recording Processing'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Logistics & Administration Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isArabic ? 'تاريخ الانعقاد' : 'Scheduled Date'}
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
              {displayDate || (isArabic ? 'يُحدد لاحقاً' : 'Scheduled')}
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isArabic ? 'توقيت الجلسة (UTC)' : 'Chamber Time (UTC)'}
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              {displayUtcTime}
            </div>
          </div>
        </div>

        {/* Duration & Format */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isArabic ? 'المدة ونمط القاعة' : 'Duration & Format'}
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
              {session.durationMinutes || 90} {isArabic ? 'دقيقة' : 'Mins'} • {session.format || (isTopicPresentation ? 'Topic Presentation' : 'Dialogue Chamber')}
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTED CHAMBER MODERATOR SPOTLIGHT BOX (Only if format permits and moderator is assigned - Debates have no moderator) */}
      {hasModerator && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/5 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-transparent border border-purple-200/90 dark:border-purple-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-300">
                  {isArabic ? 'رئاسة وإدارة القاعة الأكاديمية' : 'Chamber Moderator & Session Chair'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-[9px] font-extrabold uppercase">
                  {isArabic ? 'رئيس الجلسة' : 'Presiding Chair'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  {moderatorName}
                </h3>
                {moderatorCountry && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 text-xs font-bold border border-purple-200 dark:border-purple-800">
                    {moderatorCountryMeta?.flagEmoji && <span className="text-sm">{moderatorCountryMeta.flagEmoji}</span>}
                    <span>{moderatorCountry}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                {isArabic
                  ? 'يدير وقائع الجلسة، ويشرف على مداخلات المتحدثين الرئيسيين، وينظم طرح أسئلة الوفود والحضور في قاعة الحوار.'
                  : 'Presides over chamber proceedings, speaker rotations, and moderates delegate interventions and Q&A.'}
              </p>
            </div>
          </div>

          {moderatorCountry && (
            <div className="hidden lg:flex flex-col items-end shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">{isArabic ? 'الدولة' : 'Delegation'}</span>
              <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mt-0.5">
                {moderatorCountryMeta?.flagEmoji && <span className="text-base">{moderatorCountryMeta.flagEmoji}</span>}
                <span>{moderatorCountry}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* FORMAT-SPECIFIC SECTION: TOPIC PRESENTATION */}
      {isTopicPresentation && (
        <div className="space-y-6">
          {/* Keynote Presenters & Directors Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-indigo-600" />
                  <span>{isArabic ? 'مقدمو العرض والمتحدثون الرئيسيون' : 'Keynote Presenters & Assigned Speakers'}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'الوفود والممثلون المعتمدون لتقديم محاور ومخرجات هذا الموضوع'
                    : 'Accredited fellows delivering the thematic presentation and structural briefing.'}
                </p>
              </div>
              {session.presenters && session.presenters.length > 0 && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-full">
                  {session.presenters.length} {isArabic ? 'متحدثين' : 'Presenters'}
                </span>
              )}
            </div>

            {session.presenters && session.presenters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {session.presenters.map((p, idx) => {
                  const countryMeta = getCountryMeta(p.country);
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                            {p.name}
                          </h4>
                          {countryMeta?.flagEmoji && (
                            <span className="text-xs" title={countryMeta.name}>
                              {countryMeta.flagEmoji}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {p.role || (isArabic ? 'مقدم عرض' : 'Keynote Presenter')}
                          </span>
                          {p.country && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              • {p.country}
                            </span>
                          )}
                        </div>

                        {p.bio && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {p.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Users className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'سيتم اعتماد وتعيين مقدمي العرض قريباً' : 'Presenters to be accredited shortly'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isArabic ? 'تقوم الأمانة العامة بتعيين الوفود المقدمة قبل موعد الجلسة' : 'The Secretariat will finalize presenter assignments prior to the chamber session'}
                </p>
              </div>
            )}
          </div>

          {/* Session Proceedings & Delegate Q&A Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>{isArabic ? 'بروتوكول جلسة العرض والحوار المفتوح' : 'Topic Presentation Protocol & Delegate Interaction'}</span>
            </div>
            <p className="text-xs text-indigo-900/80 dark:text-indigo-200 leading-relaxed">
              {isArabic
                ? 'تنقسم الجلسة إلى مرحلتين: تبدأ بتقديم العرض المفصل من قبل الوفود المعينة، يليها فتح باب المداخلات والأسئلة والمناقشة المفتوحة لجميع الأعضاء الحاضرين في القاعة.'
                : 'This session follows a structured format: accredited presenters deliver the keynote briefing, after which the floor opens for questions, comments, and open multilateral discussion from all attending youth members.'}
            </p>
          </div>
        </div>
      )}

      {/* FORMAT-SPECIFIC SECTION: STRUCTURAL DEBATE */}
      {isStructuralDebate && (
        <div className="space-y-6">
          {/* Proposition vs Opposition Teams Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Proposition Team */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{isArabic ? 'فريق التأييد / المتحدثون الرئيسيون' : 'Perspective Group 1 (Proposition)'}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {session.propositionTeam?.length || 0}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                {session.propositionTeam && session.propositionTeam.length > 0 ? (
                  session.propositionTeam.map((speaker, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold">{speaker}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic text-xs py-2">
                    {isArabic ? 'سيتم تعيين المتحدثين قريباً' : 'Proposition speakers will be assigned shortly'}
                  </li>
                )}
              </ul>
            </div>

            {/* Opposition Team */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200/80 dark:border-rose-800/50 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{isArabic ? 'فريق المعارضة / الرأي المقابل' : 'Perspective Group 2 (Opposition)'}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {session.oppositionTeam?.length || 0}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                {session.oppositionTeam && session.oppositionTeam.length > 0 ? (
                  session.oppositionTeam.map((speaker, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-semibold">{speaker}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic text-xs py-2">
                    {isArabic ? 'سيتم تعيين المتحدثين قريباً' : 'Opposition speakers will be assigned shortly'}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FORMAT-SPECIFIC SECTION: DISCUSSION / ROUNDTABLE / GUEST TALK */}
      {(isDiscussion || isGuestTalk) && (
        <div className="space-y-6">
          {/* Speakers List */}
          {session.presenters && session.presenters.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{isArabic ? 'المتحدثون والخبراء المشاركون' : 'Featured Speakers & Discussants'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {session.presenters.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {p.role || 'Panelist'} {p.country && `• ${p.country}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discussion Questions / Key Points (if available) */}
      {session.discussionQuestions && session.discussionQuestions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{isArabic ? 'محاور وأسئلة النقاش الموجهة' : 'Key Dialogue & Inquiry Questions'}</span>
          </h3>
          <ul className="space-y-2">
            {session.discussionQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Session Modal for Coordinators */}
      <EditSessionModal
        isOpen={isEditOpen}
        session={session}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['portal-session', id] })}
      />
    </div>
  );
};
