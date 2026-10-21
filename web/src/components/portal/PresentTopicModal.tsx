import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { TOPIC_BANK, TopicBankItem } from '../../constants/topicBank';
import { CATEGORIES } from '../../constants';
import { apiRequest } from '../../utils/api';
import {
  X,
  Mic,
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface PresentTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTopicId?: string;
}

const PRESENTATION_FORMATS = [
  { id: 'Keynote Presentation', nameEn: 'Thematic Keynote Lecture (20-30 min address + Q&A)', nameAr: 'محاضرة رئيسية متخصصة (٢٠-٣٠ دقيقة + نقاش)' },
  { id: 'Oxford Parliamentary Debate', nameEn: 'Oxford Parliamentary Debate (Opening Lead / Floor Motion)', nameAr: 'مناظرة برلمانية على الطراز الأكسفوردي (قيادة الجلسة)' },
  { id: 'Academic Roundtable', nameEn: 'Academic Policy Roundtable & Structured Dialogue', nameAr: 'طاولة حوار أكاديمية مستديرة ومناقشة سياسات' },
  { id: 'Research Briefing', nameEn: 'Peer-Reviewed Research Paper Synthesis Briefing', nameAr: 'عرض ملخص بحثي أكاديمي محكم' },
];

const TIME_SLOTS = [
  { id: '12:00 UTC', nameEn: '12:00 UTC (15:00 Doha/Riyadh - Early Afternoon Chamber)', nameAr: '١٢:٠٠ غرينتش (١٥:٠٠ الدوحة/الرياض - الجلسة الأولى)' },
  { id: '14:00 UTC', nameEn: '14:00 UTC (17:00 Doha/Riyadh - European & African Track)', nameAr: '١٤:٠٠ غرينتش (١٧:٠٠ الدوحة/الرياض - المسار الإقليمي)' },
  { id: '16:00 UTC', nameEn: '16:00 UTC (19:00 Doha/Riyadh - Prime Keynote Chamber)', nameAr: '١٦:٠٠ غرينتش (١٩:٠٠ الدوحة/الرياض - القاعة الرئيسية)' },
  { id: 'Flexible', nameEn: 'Flexible / Next Available Weekend Session', nameAr: 'مرن / أقرب جلسة نهاية أسبوع متاحة' },
  { id: 'manual', nameEn: '+ Manual Time (Specify Your Own UTC Slot)', nameAr: '+ تحديد وقت مخصص يدوياً' },
];

export const PresentTopicModal: React.FC<PresentTopicModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultTopicId,
}) => {
  const { isArabic } = useLanguage();
  const { user } = useAuth();

  // Mode: select from 16 curated topics or add custom topic
  const [mode, setMode] = useState<'bank' | 'custom'>('bank');

  // Selected bank topic
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    defaultTopicId || TOPIC_BANK[0]?.id || ''
  );
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');

  // Custom Topic Fields
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState(CATEGORIES[0]?.name || 'Geopolitics & International Relations');
  const [customMotion, setCustomMotion] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [saveToBank, setSaveToBank] = useState(true);

  // Scheduling & Presentation Preferences
  const [preferredDate, setPreferredDate] = useState(() => {
    // Default to the upcoming Saturday
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0].id);
  const [manualTime, setManualTime] = useState('');
  const [format, setFormat] = useState(PRESENTATION_FORMATS[0].id);
  const [presentationLanguage, setPresentationLanguage] = useState<'English' | 'Arabic' | 'Bilingual'>('English');
  const [presentationNotes, setPresentationNotes] = useState('');
  const [dossierUrl, setDossierUrl] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const activeBankItem: TopicBankItem | undefined = TOPIC_BANK.find((t) => t.id === selectedTopicId);

  useEffect(() => {
    if (activeBankItem?.subtopics && activeBankItem.subtopics.length > 0) {
      setSelectedSubtopic(activeBankItem.subtopics[0]);
    } else {
      setSelectedSubtopic('');
    }
  }, [selectedTopicId, activeBankItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isCustom = mode === 'custom';
    const title = isCustom ? customTitle.trim() : (isArabic && activeBankItem?.titleAr ? activeBankItem.titleAr : activeBankItem?.title || '');
    const category = isCustom ? customCategory : (activeBankItem?.categoryName || 'General');
    const description = isCustom ? customDescription.trim() : (activeBankItem?.description || '');
    const motion = isCustom ? customMotion.trim() : (activeBankItem?.title || '');
    const subtopic = isCustom ? '' : selectedSubtopic;

    if (!title) {
      setError(isArabic ? 'يرجى كتابة عنوان الموضوع أو اختياره من القائمة' : 'Please provide or select a topic title.');
      return;
    }

    if (!preferredDate) {
      setError(isArabic ? 'يرجى تحديد التاريخ المفضل لتقديم الجلسة' : 'Please choose your preferred presentation date.');
      return;
    }

    let finalTimeSlot = preferredTimeSlot;
    if (preferredTimeSlot === 'manual') {
      const trimmed = manualTime.trim();
      if (!trimmed) {
        setError(isArabic ? 'يرجى كتابة التوقيت المفضل يدوياً' : 'Please enter your custom preferred time slot.');
        return;
      }
      finalTimeSlot = /utc/i.test(trimmed) ? trimmed : `${trimmed} UTC`;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        titleAr: isCustom ? '' : (activeBankItem?.titleAr || ''),
        category,
        description: description || 'Presenter session application submitted via Presenter Workspace.',
        descriptionAr: isCustom ? '' : (activeBankItem?.descriptionAr || ''),
        motion: motion || title,
        subtopic,
        subtopics: isCustom ? [] : (activeBankItem?.subtopics || []),
        format,
        isCustom,
        interestedToPresent: true,
        preferredDate,
        preferredTimeSlot: finalTimeSlot,
        presentationLanguage,
        presentationNotes,
        dossierUrl,
        status: 'proposed',
      };

      const res = await apiRequest<any>('/topics', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Submit session application into session pipeline for Secretariat Admin review
      try {
        await apiRequest<any>('/sessions', {
          method: 'POST',
          body: JSON.stringify({
            title,
            titleAr: isCustom ? '' : (activeBankItem?.titleAr || ''),
            category,
            description: description || 'Presenter session application submitted via Presenter Workspace for Secretariat approval.',
            descriptionAr: isCustom ? '' : (activeBankItem?.descriptionAr || ''),
            motion: motion || title,
            format,
            scheduledAt: new Date(preferredDate).toISOString(),
            preferredTimeSlot: finalTimeSlot,
            presentationLanguage,
            proposalNotes: presentationNotes,
            dossierUrl,
            isPresenterProposal: true,
            status: 'proposed',
            presenters: [
              {
                name: user?.name || 'Applicant Presenter',
                country: user?.country || 'Global',
                role: 'Session Speaker',
                bio: presentationNotes || 'Keynote and dialogue presentation application.',
              },
            ],
          }),
        });
      } catch (sessionErr) {
        console.warn('Session pipeline registration note:', sessionErr);
      }

      setSubmittedData({
        ...payload,
        id: res?.id || res?.data?.id || `APP-${Date.now().toString().slice(-6)}`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Failed to submit presentation application:', err);
      setError(
        err?.message ||
          (isArabic
            ? 'تعذر إرسال الطلب. يرجى التحقق من الاتصال وإعادة المحاولة.'
            : 'Failed to submit presentation application. Please verify details and retry.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setSubmittedData(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-0 border-none overflow-hidden my-6 transition-all text-slate-800 dark:text-slate-100">
        {/* Top Header with Gradient Accent */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={resetModal}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border-0 border-none outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {isArabic ? 'بوابة المتحدثين المعتمدين' : 'Accredited Presenter Chamber'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-snug">
                {isArabic ? 'تقديم طلب إلقاء كلمة أو إدارة جلسة' : 'Apply to Present a Topic or Lead a Session'}
              </h2>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                {isArabic
                  ? 'اختر موضوعاً من بنك المواضيع الـ ١٦ أو اقترح موضوعك الخاص، وحدد موعدك المفضل.'
                  : 'Select from our 16 curated research topics or propose your own, and reserve your floor schedule.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {submittedData ? (
          /* Confirmation Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isArabic ? 'تم استلام طلب التقديم بنجاح!' : 'Presentation Application Submitted!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                {isArabic
                  ? 'تم إرسال طلبك إلى أمانة التنسيق بالمنتدى لمراجعته واعتماده ضمن جدول المناظرات الرسمي.'
                  : 'Your session proposal has been routed to the Coordinator Secretariat for review and inclusion in the upcoming official floor schedule.'}
              </p>
            </div>

            {/* Application Summary Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 text-left rtl:text-right space-y-3 text-xs border-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">{isArabic ? 'المتحدث مقدم الطلب:' : 'Presenter:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.name} ({user?.country || 'Fellow'})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">{isArabic ? 'الموضوع المختار:' : 'Topic:'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 max-w-[65%] truncate">{submittedData.title}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">{isArabic ? 'الموعد والتوقيت المفضل:' : 'Preferred Schedule:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedData.preferredDate} • {submittedData.preferredTimeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'الحالة الحالية:' : 'Status:'}</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[11px]">
                  {isArabic ? 'قيد مراجعة الأمانة' : 'Pending Secretariat Scheduling'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={resetModal}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer border-0 border-none outline-none"
              >
                {isArabic ? 'العودة إلى لوحة المتحدث' : 'Back to Presenter Workspace'}
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Topic Source Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isArabic ? '١. اختيار موضوع الجلسة' : '1. Select Presentation Topic'}</span>
              </label>

              {/* Segmented Toggle: 16 Topics vs Custom Proposal */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0">
                <button
                  type="button"
                  onClick={() => setMode('bank')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 border-none outline-none ${
                    mode === 'bank'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'اختر من بنك المواضيع (١٦ موضوعاً)' : 'Choose from Topic Bank (16 Spheres)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('custom')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 border-none outline-none ${
                    mode === 'custom'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إضافة موضوع جديد يدوياً' : 'Add Topic Manually'}</span>
                </button>
              </div>
            </div>

            {/* OPTION A: 16 Topics Dropdown */}
            {mode === 'bank' ? (
              <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-0">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اختر القضية المعرفية المطروحة:' : 'Select Research Sphere & Topic:'}
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-medium border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
                  >
                    {TOPIC_BANK.map((item, idx) => (
                      <option key={item.id} value={item.id}>
                        {idx + 1}. [{item.categoryName}] {isArabic && item.titleAr ? item.titleAr : item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {activeBankItem && (
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 text-[10px] font-bold">
                        {activeBankItem.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isArabic ? 'قضية معتمدة من اللجنة الأكاديمية' : 'Curated Academic Sphere'}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 italic text-[11px] bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl">
                      &quot;{isArabic && activeBankItem.descriptionAr ? activeBankItem.descriptionAr : activeBankItem.description}&quot;
                    </p>

                    {/* Subtopics dropdown */}
                    {activeBankItem.subtopics && activeBankItem.subtopics.length > 0 && (
                      <div className="pt-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isArabic ? 'المحور التخصصي الفرعي:' : 'Specific Focus / Subtopic:'}
                        </label>
                        <select
                          value={selectedSubtopic}
                          onChange={(e) => setSelectedSubtopic(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {activeBankItem.subtopics.map((sub, sIdx) => (
                            <option key={sIdx} value={sub}>
                              • {sub}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* OPTION B: Propose Manually */
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-0">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'عنوان الموضوع أو الورقة المقترحة:' : 'Proposed Topic Title:'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'مثال: أثر السيادة الرقمية والذكاء الاصطناعي في التعليم الجامعي'
                        : 'e.g. Sovereign AI Architectures & Epistemic Diversity in Higher Education'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'المجال / المحور المعرفي:' : 'Sphere / Domain:'}
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'صيغة القضية البرلمانية (Motion):' : 'Proposed Motion / Thesis:'}
                    </label>
                    <input
                      type="text"
                      value={customMotion}
                      onChange={(e) => setCustomMotion(e.target.value)}
                      placeholder={isArabic ? 'هذا المجلس يرى أن...' : 'This House Would...'}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'ملخص مختصر للموضوع والنقاط الرئيسية:' : 'Topic Summary & Central Arguments:'}
                  </label>
                  <textarea
                    rows={2}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'موجز عن خلفية القضية، الأسئلة البحثية، وما ستقدمه الجلسة...'
                        : 'Brief abstract detailing background, key research questions, and policy implications...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <input
                    type="checkbox"
                    checked={saveToBank}
                    onChange={(e) => setSaveToBank(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span>
                    {isArabic
                      ? 'إضافة هذا الموضوع إلى بنك المواضيع العام للمنتدى ليستفيد منه بقية المتحدثين'
                      : 'Contribute and register this topic into the public GYDE Topic Bank library'}
                  </span>
                </label>
              </div>
            )}

            {/* STEP 2: Preferred Schedule & Format */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isArabic ? '٢. تحديد الموعد والتوقيت المفضل' : '2. Preferred Date & Time Slot'}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'التاريخ المفضل لعقد الجلسة:' : 'Preferred Session Date:'} *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الفترة الزمنية المفضلة:' : 'Preferred Dialogue Chamber Slot:'}
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => {
                      setPreferredTimeSlot(e.target.value);
                      if (e.target.value !== 'manual') {
                        setManualTime('');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {isArabic ? slot.nameAr : slot.nameEn}
                      </option>
                    ))}
                  </select>

                  {/* Manual / Custom Time Input */}
                  {preferredTimeSlot === 'manual' && (
                    <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                        {isArabic ? 'أدخل الوقت المفضل يدوياً (بتوقيت غرينتش UTC):' : 'Specify Custom Dialogue Time (UTC):'}
                      </label>
                      <div className="relative flex items-center">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={manualTime}
                          onChange={(e) => setManualTime(e.target.value)}
                          placeholder={isArabic ? 'مثال: 13:30 UTC أو 15:00 UTC' : 'e.g., 13:30 UTC, 15:00 UTC, or 18:30 UTC'}
                          className="w-full pl-9 pr-14 rtl:pl-14 rtl:pr-9 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-indigo-300 dark:border-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                          autoFocus
                        />
                        <span className="absolute right-3 rtl:right-auto rtl:left-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          UTC
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isArabic
                          ? 'أدخل التوقيت المناسب لك، وسيقوم المنسقون بمراجعته والتنسيق معك.'
                          : 'Enter your preferred timing in UTC. Secretariat will review and coordinate the slot.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Format & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'نمط وشكل الجلسة:' : 'Presentation Format:'}
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PRESENTATION_FORMATS.map((fmt) => (
                      <option key={fmt.id} value={fmt.id}>
                        {isArabic ? fmt.nameAr : fmt.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{isArabic ? 'لغة تقديم الكلمة:' : 'Presentation Language:'}</span>
                  </label>
                  <select
                    value={presentationLanguage}
                    onChange={(e) => setPresentationLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">العربية (Arabic)</option>
                    <option value="Bilingual">Bilingual (English & Arabic)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 3: Presenter Notes & Slide Deck */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isArabic ? '٣. ملاحظات العرض ومحاور النقاط' : '3. Presentation Plan & Notes'}</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'النقاط الجوهرية التي سيتناولها المتحدث (اختياري):' : 'Key Takeaways & Speaker Outline (Optional):'}
                </label>
                <textarea
                  rows={2}
                  value={presentationNotes}
                  onChange={(e) => setPresentationNotes(e.target.value)}
                  placeholder={
                    isArabic
                      ? '١. الإطار النظري للموضوع... ٢. دراسة الحالة التجريبية... ٣. التوصيات العامة'
                      : '1. Theoretical framework... 2. Empirical case study... 3. Proposed multilateral policy recommendations'
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500 shadow-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'رابط ملف العرض أو مسودة البحث (Google Slides / Drive / PDF):' : 'Presentation Slide Deck / Draft Dossier Link (Optional):'}
                </label>
                <input
                  type="url"
                  value={dossierUrl}
                  onChange={(e) => setDossierUrl(e.target.value)}
                  placeholder="https://docs.google.com/presentation/d/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs border-0 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={resetModal}
                disabled={submitting}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer border-0 border-none outline-none"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border-0 border-none outline-none"
              >
                {submitting ? (
                  <span>{isArabic ? 'جارٍ إرسال الطلب...' : 'Submitting Application...'}</span>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تقديم طلب الجلسة للأمانة' : 'Submit Presentation Application'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
