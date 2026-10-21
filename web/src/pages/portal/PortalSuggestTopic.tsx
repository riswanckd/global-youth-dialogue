import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';
import { TOPIC_BANK, TopicBankItem } from '../../constants/topicBank';
import { apiRequest } from '../../utils/api';
import { EditTopicModal } from '../../components/portal/EditTopicModal';

interface TopicItem {
  id: string;
  title: string;
  titleAr?: string;
  category: string;
  description: string;
  status: string;
  motion?: string;
  format?: string;
  subtopic?: string;
  regionalPerspective?: string;
  sources?: string;
  isCustom?: boolean;
  interestedToPresent?: boolean;
  assignedCoordinator?: any;
  reviewNotes?: string;
  proposedBy?: {
    userId?: string;
    name: string;
    country?: string;
  };
  upvotesCount?: number;
  createdAt: string;
}

export const PortalSuggestTopic: React.FC = () => {
  const { user, isCoordinator } = useAuth();
  const { isArabic } = useLanguage();

  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [pipelineFilter, setPipelineFilter] = useState<'all' | 'assigned' | 'mine'>('all');

  // Form State
  const [selectedBankId, setSelectedBankId] = useState<string>(TOPIC_BANK[0]?.id || '');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState(CATEGORIES[0]?.id || '');
  const [customSubtopics, setCustomSubtopics] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');

  const [format, setFormat] = useState('Topic Presentation');
  const [motion, setMotion] = useState('');
  const [reason, setReason] = useState('');
  const [countryPerspective, setCountryPerspective] = useState('');
  const [sources, setSources] = useState('');
  const [interestedToPresent, setInterestedToPresent] = useState(false);
  const [isPresenter, setIsPresenter] = useState(false);

  // Selected bank item
  const currentBankItem: TopicBankItem | undefined = TOPIC_BANK.find((t) => t.id === selectedBankId);

  useEffect(() => {
    if (currentBankItem && currentBankItem.subtopics && currentBankItem.subtopics.length > 0) {
      setSelectedSubtopic(currentBankItem.subtopics[0]);
    }
  }, [selectedBankId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ data?: TopicItem[]; topics?: TopicItem[] } | TopicItem[]>('/topics?limit=50');
      const list = Array.isArray(res) ? res : (res as any)?.topics || (res as any)?.data || [];
      setTopics(list);
    } catch (err: any) {
      console.error('Failed to load topics pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();

    const checkPresenter = async () => {
      const rolePresenter = ['presenter', 'PRESENTER'].includes(user?.role as string);
      if (rolePresenter) {
        setIsPresenter(true);
        return;
      }
      try {
        const res = await apiRequest<{ isPresenter?: boolean }>('/applications/presenter/status');
        if (res?.isPresenter) {
          setIsPresenter(true);
        }
      } catch {
        // Ignore error
      }
    };
    checkPresenter();
  }, [user]);

  const handleBankSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustom(true);
      setSelectedBankId('custom');
    } else {
      setIsCustom(false);
      setSelectedBankId(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      let finalTitle = '';
      let finalCategory = '';
      let subtopicsList: string[] = [];

      if (isCustom) {
        if (!customTitle.trim()) {
          setError(isArabic ? 'يرجى إدخال عنوان الموضوع المقترح.' : 'Please enter a custom topic title.');
          setSubmitting(false);
          return;
        }
        finalTitle = customTitle.trim();
        finalCategory = customCategory;
        subtopicsList = customSubtopics.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        if (!currentBankItem) {
          setError(isArabic ? 'يرجى اختيار موضوع من بنك المواضيع.' : 'Please select a topic from the Topic Bank.');
          setSubmitting(false);
          return;
        }
        finalTitle = currentBankItem.title;
        finalCategory = currentBankItem.categoryId;
        subtopicsList = currentBankItem.subtopics;
      }

      await apiRequest('/topics', {
        method: 'POST',
        body: JSON.stringify({
          title: finalTitle,
          category: finalCategory,
          description: reason.trim() || currentBankItem?.description || finalTitle || 'Proposed topic for international youth dialogue.',
          subtopics: subtopicsList,
          subtopic: selectedSubtopic || undefined,
          motion: motion.trim() || undefined,
          format,
          regionalPerspective: countryPerspective.trim() || undefined,
          sources: sources.trim() || undefined,
          isCustom,
          interestedToPresent: isPresenter ? interestedToPresent : false,
        }),
      });

      setSuccessMsg(
        isArabic
          ? 'تم تقديم مقترح الموضوع بنجاح إلى مسار مراجعة الأمانة التنسيقية!'
          : 'Proposal submitted successfully into the dialogue review pipeline!'
      );

      // Reset fields
      setMotion('');
      setReason('');
      setCountryPerspective('');
      setSources('');
      setInterestedToPresent(false);
      if (isCustom) {
        setCustomTitle('');
        setCustomSubtopics('');
      }

      fetchTopics();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      await apiRequest(`/topics/${id}/upvote`, { method: 'POST' });
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? { ...t, upvotesCount: (t.upvotesCount || 0) + 1 } : t))
      );
    } catch (err: any) {
      console.error('Failed to upvote topic:', err);
    }
  };

  const pipelineSteps = ['Proposed', 'Under Review', 'Approved', 'Scheduled', 'Completed'];

  return (
    <div className="portal-subview-content space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="portal-page-header mb-3 sm:mb-6">
        <div className="portal-page-title">
          <h1 className="font-heading text-base sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight m-0">
            {isArabic ? 'اقتراح موضوع أو نشاط حواري' : 'Suggest a Topic or Dialogue Activity'}
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
            {isArabic
              ? 'اختر موضوعاً من بنك المواضيع أو اقترح محوراً أكاديمياً مخصصاً لمسار مراجعة المجتمع.'
              : 'Select a topic from the Topic Bank or propose a custom academic subject for the community review pipeline.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Form: Propose Dialogue Session Topic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs space-y-3.5 card-panel">
          <div className="panel-header pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="m-0 text-xs sm:text-base font-bold font-heading text-slate-900 dark:text-white">
              {isArabic ? 'اقتراح موضوع جلسة حوارية' : 'Propose Dialogue Session Topic'}
            </h2>
          </div>

          {error && (
            <div className="alert-box" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="alert-box" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} id="memberTopicForm" className="space-y-3">
            {/* Topic Selection from Topic Bank */}
            <div className="form-group">
              <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                {isArabic ? 'اختيار الموضوع من بنك المواضيع' : 'Topic Selection from Topic Bank'}
              </label>
              <select
                className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                value={isCustom ? 'custom' : selectedBankId}
                onChange={handleBankSelectChange}
              >
                <option value="" disabled>
                  -- {isArabic ? 'اختر موضوعاً من بنك المواضيع الأكاديمي' : 'Select a Topic from Academic Topic Bank'} --
                </option>
                {CATEGORIES.map((cat) => {
                  const catTopics = TOPIC_BANK.filter((t) => t.categoryId === cat.id);
                  if (catTopics.length === 0) return null;
                  return (
                    <optgroup key={cat.id} label={isArabic ? cat.nameAr : cat.name}>
                      {catTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
                <option value="custom">{isArabic ? '+ اقتراح موضوع مخصص جديد (غير مدرج)...' : '+ Propose Custom Topic (Others)...'}</option>
              </select>
            </div>

            {/* Subtopic selector (when bank item chosen) */}
            {!isCustom && currentBankItem && currentBankItem.subtopics && currentBankItem.subtopics.length > 0 && (
              <div className="form-group">
                <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                  {isArabic ? 'المحور الفرعي المركّز' : 'Selected Focus Subtopic'}
                </label>
                <select
                  className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                >
                  {currentBankItem.subtopics.map((st, idx) => (
                    <option key={idx} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Topic Fields (when 'Others' is selected) */}
            {isCustom && (
              <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 sm:p-4 space-y-2.5">
                <div className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                  <strong>{isArabic ? 'اقتراح موضوع أكاديمي جديد:' : 'Suggesting a New Custom Topic:'}</strong>{' '}
                  {isArabic
                    ? 'تتم مراجعة المواضيع المخصصة من قبل أمانة التنسيق. وعند اعتمادها تضاف تلقائياً إلى بنك المواضيع الدولي!'
                    : 'Custom topics are vetted by the Coordinator Secretariat. When approved, this topic and its subtopics will automatically be added to the Global Youth Dialogue Topic Bank!'}
                </div>

                <div className="form-group">
                  <label className="form-label block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                    {isArabic ? 'عنوان الموضوع المخصص / القضية الأكاديمية' : 'Custom Topic Title / Academic Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                    placeholder="e.g. Sovereign Algorithmic Governance in the Global South"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                    {isArabic ? 'تصنيف الموضوع' : 'Topic Category'}
                  </label>
                  <select
                    className="form-control w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isArabic ? cat.nameAr : cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                    {isArabic ? 'المحاور الفرعية وأسئلة البحث (اختياري، مفصولة بفواصل)' : 'Subtopics & Research Questions (Optional, comma-separated)'}
                  </label>
                  <input
                    type="text"
                    className="form-control w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                    placeholder="e.g. Legal jurisdiction, Data center sovereignty, Economic disparities"
                    value={customSubtopics}
                    onChange={(e) => setCustomSubtopics(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Proposed Activity Format */}
            <div className="form-group">
              <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                {isArabic ? 'شكل النشاط الحواري المقترح' : 'Proposed Activity Format'}
              </label>
              <select
                className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="Topic Presentation">
                  {isArabic ? 'عرض موضوع (مدير الجلسة ومقدم العرض - 1 أو أكثر)' : 'Topic Presentation (moderator and presenter - 1 or more)'}
                </option>
                <option value="Structured Dialogue">
                  {isArabic ? 'حوار منظم (فريقان ومحاور نقاشية)' : 'Structured Dialogue (2 teams and their members)'}
                </option>
                <option value="Discussion">
                  {isArabic ? 'جلسة نقاشية (مدير الجلسة والمتحدثون الرئيسيون - إن وجدوا)' : 'Discussion (moderator, and key speakers - if any)'}
                </option>
                <option value="Guest Talks">
                  {isArabic ? 'حوارات الضيوف (اسم الضيف، النبذة والصورة)' : 'Guest Talks (guest name, bio, image)'}
                </option>
              </select>
            </div>

            {/* Suggested Dialogue Resolution or Theme (Optional) */}
            <div className="form-group">
              <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                {isArabic ? 'صيغة القضية أو الموضوع المقترح (اختياري)' : 'Suggested Dialogue Theme or Resolution (Optional)'}
              </label>
              <input
                type="text"
                className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans placeholder:text-slate-400 placeholder:text-xs"
                value={motion}
                onChange={(e) => setMotion(e.target.value)}
                placeholder="e.g. Multilateral governance mechanisms for autonomous technologies..."
              />
              <span className="block text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-sans">
                {isArabic ? 'اقتراح عنوان محدد أو صياغة واضحة لصلب الموضوع الحواري' : 'Provide a focused resolution or core thematic question for discussion'}
              </span>
            </div>

            {/* Academic Context & Why We Should Discuss This */}
            <div className="form-group">
              <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                {isArabic ? 'السياق الأكاديمي ولماذا يجب مناقشة هذا الموضوع (اختياري)' : 'Academic Context & Why We Should Discuss This (Optional)'}
              </label>
              <textarea
                className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans placeholder:text-slate-400 placeholder:text-xs"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the global relevance, timeliness, and cross-border implications..."
              />
            </div>

            {/* 2-Column: Country / Regional Perspective & Relevant Sources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                  {isArabic ? 'المنظور الإقليمي / الوطني (اختياري)' : 'Country / Regional Perspective (Optional)'}
                </label>
                <input
                  type="text"
                  className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans placeholder:text-slate-400 placeholder:text-xs"
                  value={countryPerspective}
                  onChange={(e) => setCountryPerspective(e.target.value)}
                  placeholder="e.g. Gulf energy transition, Southeast Asian digital sovereignty..."
                />
              </div>
              <div>
                <label className="form-label block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-sans">
                  {isArabic ? 'المصادر والأوراق ذات الصلة (اختياري)' : 'Relevant Sources / Papers (Optional)'}
                </label>
                <input
                  type="text"
                  className="form-control w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans placeholder:text-slate-400 placeholder:text-xs"
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                  placeholder="e.g. UN Reports, think-tank articles, academic journals..."
                />
              </div>
            </div>

            {/* Presenter Interest Toggle (Shown if user is a presenter) */}
            {isPresenter && (
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl p-3 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="interestedToPresent"
                  checked={interestedToPresent}
                  onChange={(e) => setInterestedToPresent(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="interestedToPresent"
                  className="text-xs font-semibold text-slate-900 dark:text-slate-100 cursor-pointer select-none flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-indigo-600 dark:text-indigo-400">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <span>
                    {isArabic
                      ? 'أنا مهتم بتقديم هذا الموضوع كمتحدث رئيسي في الجلسة'
                      : 'I am interested to present this topic (Presenter Keynote Briefing)'}
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 font-sans mt-2"
            >
              {submitting ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting Proposal...') : (isArabic ? 'إرسال المقترح للمراجعة الأكاديمية' : 'Submit Proposal for Review')}
            </button>
          </form>
        </div>

        {/* Right Panel: Proposal Review Lifecycle */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs space-y-3.5 card-panel">
          <div className="panel-header pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="m-0 text-xs sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                {isArabic ? 'مسار مراجعة المقترحات' : 'Proposal Review Lifecycle'}
              </h2>
              {isCoordinator && (
                <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
                  {isArabic ? 'صلاحيات منسق: مراجعة وتعديل القضايا المكلفة' : 'Coordinator: Edit & curate assigned motions'}
                </span>
              )}
            </div>

            {isCoordinator && (
                <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.2rem', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPipelineFilter('all')}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      background: pipelineFilter === 'all' ? '#ffffff' : 'transparent',
                      color: pipelineFilter === 'all' ? '#4851BA' : '#64748b',
                      boxShadow: pipelineFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setPipelineFilter('assigned')}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      background: pipelineFilter === 'assigned' ? '#ffffff' : 'transparent',
                      color: pipelineFilter === 'assigned' ? '#4851BA' : '#64748b',
                      boxShadow: pipelineFilter === 'assigned' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Assigned to Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setPipelineFilter('mine')}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      background: pipelineFilter === 'mine' ? '#ffffff' : 'transparent',
                      color: pipelineFilter === 'mine' ? '#4851BA' : '#64748b',
                      boxShadow: pipelineFilter === 'mine' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Proposed by Me
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
                {isArabic ? 'جارٍ تحميل المقترحات...' : 'Loading proposal lifecycle...'}
              </div>
            ) : topics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{isArabic ? 'لا توجد مقترحات حالية' : 'No topics proposed yet'}</p>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{isArabic ? 'كن أول من يقترح موضوعاً لجلسات الحوار الدولية القادمة!' : 'Be the first fellow to submit a dialogue topic for upcoming sessions!'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topics
                  .filter((t) => {
                    if (!isCoordinator || pipelineFilter === 'all') return true;
                    const coordId = typeof t.assignedCoordinator === 'object' ? (t.assignedCoordinator?.id || t.assignedCoordinator?._id) : t.assignedCoordinator;
                    if (pipelineFilter === 'assigned') {
                      return coordId === user?.id || !t.assignedCoordinator;
                    }
                    if (pipelineFilter === 'mine') {
                      return t.proposedBy?.userId === user?.id;
                    }
                    return true;
                  })
                  .map((t) => {
                    const statusNormalized = (t.status || 'proposed').toLowerCase();
                    let stepIdx = 0;
                    if (statusNormalized === 'reviewing' || statusNormalized === 'under_review') stepIdx = 1;
                    else if (statusNormalized === 'approved' || statusNormalized === 'shortlisted') stepIdx = 2;
                    else if (statusNormalized === 'scheduled') stepIdx = 3;
                    else if (statusNormalized === 'completed') stepIdx = 4;

                    const coordId = typeof t.assignedCoordinator === 'object' ? (t.assignedCoordinator?.id || t.assignedCoordinator?._id) : t.assignedCoordinator;
                    const isAssignedToMe = isCoordinator && (coordId === user?.id || !t.assignedCoordinator);

                    return (
                      <div
                        key={t.id}
                        style={{
                          background: '#f8fafc',
                          border: isAssignedToMe ? '1.5px solid rgba(72, 81, 186, 0.35)' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1rem 1.15rem',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(72, 81, 186, 0.1)', color: '#4851BA' }}>
                                {t.category}
                              </span>
                              {t.isCustom && (
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(184, 142, 62, 0.15)', color: '#b45309' }}>
                                  Custom
                                </span>
                              )}
                              {t.interestedToPresent && (
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(158, 89, 172, 0.15)', color: '#9E59AC', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                  </svg>
                                  <span>Speaker Volunteer</span>
                                </span>
                              )}
                              {isAssignedToMe && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(72, 81, 186, 0.15)', color: '#4851BA', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="6"></circle>
                                    <circle cx="12" cy="12" r="2"></circle>
                                  </svg>
                                  <span>{isArabic ? 'مكلف لك' : 'Assigned to You'}</span>
                                </span>
                              )}
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{t.title}</h4>
                            {t.subtopic && (
                              <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 500, marginTop: '2px' }}>
                                Focus: {t.subtopic}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            {isCoordinator && (
                              <button
                                type="button"
                                onClick={() => setEditingTopic(t)}
                                style={{
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '6px',
                                  background: '#4851BA',
                                  color: '#ffffff',
                                  border: 'none',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  boxShadow: '0 1px 2px rgba(72, 81, 186, 0.25)',
                                }}
                                title="Edit & curate topic as Coordinator"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                                <span>{isArabic ? 'تعديل' : 'Edit / Review'}</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleUpvote(t.id)}
                              style={{
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: '#4851BA',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="Upvote motion"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                              <span>{t.upvotesCount || 0}</span>
                            </button>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '999px',
                                textTransform: 'uppercase',
                                background: statusNormalized === 'approved' ? '#dcfce7' : '#f1f5f9',
                                color: statusNormalized === 'approved' ? '#15803d' : '#475569',
                              }}
                            >
                              {t.status}
                            </span>
                          </div>
                        </div>

                        {t.motion && (
                          <div style={{ fontSize: '0.82rem', background: '#ffffff', padding: '0.4rem 0.65rem', borderRadius: '6px', borderLeft: '3px solid #4851BA', margin: '0.5rem 0', color: '#1e293b' }}>
                            <strong>Motion:</strong> {t.motion}
                          </div>
                        )}

                        <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.4rem 0 0.75rem 0', lineHeight: 1.4 }}>
                          {t.description}
                        </p>

                        {t.reviewNotes && (
                          <div style={{ fontSize: '0.78rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.45rem 0.65rem', marginBottom: '0.65rem', color: '#475569' }}>
                            <strong style={{ color: '#4851BA' }}>{isArabic ? 'ملاحظة المنسق:' : 'Coordinator Note:'}</strong> {t.reviewNotes}
                          </div>
                        )}

                        {/* 5-Step Visual Tracker */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0' }}>
                          {pipelineSteps.map((step, idx) => {
                            const isDone = idx < stepIdx;
                            const isActive = idx === stepIdx;
                            return (
                              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: isDone ? '#15803d' : isActive ? '#4851BA' : '#cbd5e1',
                                    boxShadow: isActive ? '0 0 0 3px rgba(72, 81, 186, 0.2)' : 'none',
                                  }}
                                ></div>
                                <span style={{ fontSize: '0.65rem', color: isActive ? '#4851BA' : '#94a3b8', fontWeight: isActive ? 700 : 500, marginTop: '0.25rem', textAlign: 'center' }}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

      <EditTopicModal
        isOpen={!!editingTopic}
        topic={editingTopic as any}
        onClose={() => setEditingTopic(null)}
        onSuccess={fetchTopics}
      />
    </div>
  );
};
