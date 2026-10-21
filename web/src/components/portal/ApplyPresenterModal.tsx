import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';
import { apiRequest } from '../../utils/api';
import { X, Send, Sparkles } from 'lucide-react';

interface ApplyPresenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyPresenterModal: React.FC<ApplyPresenterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const [countryChapter, setCountryChapter] = useState('');
  const [sphere, setSphere] = useState(CATEGORIES[0]?.name || 'Geopolitics & International Relations');
  const [proposedTopic, setProposedTopic] = useState('');
  const [experience, setExperience] = useState('');
  const [dossierUrl, setDossierUrl] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('Topic Presentation (Presenter / Keynote)');
  const [statementOfIntent, setStatementOfIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCountryChapter(user.country ? `${user.country} Delegation` : 'India Delegation');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Provide sensible defaults if fields are brief or left blank so user is NEVER blocked
    const cleanCountry = countryChapter.trim() || (user?.country ? `${user.country} Delegation` : 'Global Delegation');
    const cleanTopic = proposedTopic.trim() || 'Keynote Presentation & Academic Briefing';
    const cleanExp = experience.trim() || 'Active Member of GYDE Academic Community';
    const cleanIntent = statementOfIntent.trim() || 'Committed to fostering evidence-based dialogue and active participation.';

    setLoading(true);

    try {
      const res: any = await apiRequest('/applications/presenter', {
        method: 'POST',
        body: JSON.stringify({
          countryChapter: cleanCountry,
          sphere,
          proposedTopic: cleanTopic,
          experience: cleanExp,
          dossierUrl: dossierUrl.trim() || undefined,
          preferredFormat,
          statementOfIntent: cleanIntent,
        }),
      });

      // Synchronize in-browser application cache so Admin queue picks it up instantaneously
      try {
        const stored = localStorage.getItem('gyde_cached_applications');
        const updatedData = res?.data || res;
        if (stored && updatedData) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const idx = list.findIndex(
              (a: any) =>
                (a.id && a.id === (updatedData.id || updatedData._id)) ||
                (a._id && a._id === (updatedData.id || updatedData._id)) ||
                (a.email && a.email.toLowerCase() === user?.email?.toLowerCase())
            );
            const proposalObj = updatedData.presenterProposal || {
              countryChapter: cleanCountry,
              sphere,
              proposedTopic: cleanTopic,
              experience: cleanExp,
              dossierUrl: dossierUrl.trim() || undefined,
              preferredFormat,
              statementOfIntent: cleanIntent,
              appliedAt: new Date().toISOString(),
              status: 'pending',
            };
            if (idx >= 0) {
              list[idx] = {
                ...list[idx],
                ...updatedData,
                presenterProposal: proposalObj,
              };
            } else {
              list.unshift({
                ...updatedData,
                presenterProposal: proposalObj,
              });
            }
            localStorage.setItem('gyde_cached_applications', JSON.stringify(list));
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch {}

      setSuccessMsg(
        isArabic
          ? 'تم إرسال طلب اعتماد المتحدث بنجاح! ستراجع الأمانة التنسيقية ملفك قريباً.'
          : 'Presenter application submitted successfully! The Coordinator Secretariat will review your credentials.'
      );
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || (isArabic ? 'فشل إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'Failed to submit presenter application. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-[94vw] max-w-[540px] max-h-[90dvh] overflow-y-auto shadow-2xl p-3.5 sm:p-6 relative border border-slate-100 dark:border-slate-800"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-1.5 pr-6">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3 h-3" />
            <span>{isArabic ? 'اعتماد متحدث رسمي' : 'Presenter Accreditation'}</span>
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 truncate">
            {isArabic ? 'الحوار الشبابي الدولي' : 'Global Youth Dialogue'}
          </span>
        </div>

        {/* Modal Title & Subtitle (Compact on mobile) */}
        <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
          {isArabic ? 'التقديم للاعتماد كمتحدث رسمي' : 'Apply to Become an Official Presenter'}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
          {isArabic
            ? 'يمكن للمتحدثين المعتمدين اختيار مواضيع من بنك المواضيع وتقديم عروض بحثية من 10 إلى 30 دقيقة.'
            : 'Accredited presenters curate topics from the Topic Bank and deliver research briefings in international dialogue sessions.'}
        </p>

        {error && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-[11px] sm:text-xs mb-3 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs mb-3 border border-emerald-200 dark:border-emerald-800">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5">
          {/* Read-Only Profile row: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Country Chapter & Academic Sphere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'الدولة والانتماء الفرعي' : 'Country & Chapter Affiliation'}
              </label>
              <input
                type="text"
                value={countryChapter}
                onChange={(e) => setCountryChapter(e.target.value)}
                placeholder="e.g. India Delegation, Brazil Youth Chapter"
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'المجال الأكاديمي الأساسي' : 'Primary Academic Sphere'}
              </label>
              <select
                value={sphere}
                onChange={(e) => setSphere(e.target.value)}
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {isArabic ? cat.nameAr : cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Proposed Topic */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'الموضوع المقترح أو أطروحة العرض' : 'Proposed Topic or Thesis Dilemma to Present'}
            </label>
            <input
              type="text"
              value={proposedTopic}
              onChange={(e) => setProposedTopic(e.target.value)}
              placeholder="e.g. Sovereign Debt Restructuring & Emerging Market Resilience"
              className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Academic Background */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'الخلفية الأكاديمية والخطابية' : 'Academic, Public Speaking, or Dialogue Background'}
            </label>
            <textarea
              rows={2}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Past conferences, Model UN, research papers, or debate participation..."
              className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Preferred Format & Dossier URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'شكل العرض المفضل' : 'Preferred Presentation Format'}
              </label>
              <select
                value={preferredFormat}
                onChange={(e) => setPreferredFormat(e.target.value)}
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Topic Presentation (Presenter / Keynote)">
                  {isArabic ? 'عرض موضوع (مقدم عرض رئيسي)' : 'Topic Presentation (Presenter / Keynote)'}
                </option>
                <option value="Structured Dialogue (Panelist / Team Member)">
                  {isArabic ? 'حوار منظم (عضو فريق / متحدث مشارك)' : 'Structured Dialogue (Team Member / Panelist)'}
                </option>
                <option value="Discussion (Key Speaker / Panellist)">
                  {isArabic ? 'جلسة نقاشية (متحدث رئيسي)' : 'Discussion (Key Speaker / Panellist)'}
                </option>
                <option value="Guest Talks (Guest Speaker / Special Keynote)">
                  {isArabic ? 'حوارات الضيوف (ضيف شرف)' : 'Guest Talks (Guest Speaker / Special Keynote)'}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'رابط الملف / العرض (اختياري)' : 'Slide Deck / Paper URL (Optional)'}
              </label>
              <input
                type="text"
                value={dossierUrl}
                onChange={(e) => setDossierUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Statement of Intent */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'بيان القصد والمعايير الأكاديمية' : 'Statement of Intent & Academic Rigor'}
            </label>
            <textarea
              rows={2}
              value={statementOfIntent}
              onChange={(e) => setStatementOfIntent(e.target.value)}
              placeholder="Why do you wish to present? How will your session foster constructive dialogue?"
              className="w-full p-2 sm:p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {loading
                  ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...')
                  : (isArabic ? 'إرسال طلب الاعتماد' : 'Submit Presenter Application')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
