import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  User,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SPHERES = [
  'Geopolitics & International Relations',
  'Technology & AI Ethics',
  'Education & Future of Learning',
  'Climate, Environment & Energy',
  'Economy, Trade & Labor',
  'Governance, Law & Human Rights',
  'Culture, Identity & Global Media',
  'Public Health, Bioethics & Science',
  'Space Governance & Astro-Politics',
  'Cybersecurity & Digital Sovereignty',
  'Youth Leadership & Future Generations',
  'Peacebuilding, Disarmament & Humanitarian Law',
  'Synthetic Biology & Genetic Horizons',
  'Food Sovereignty & Ocean Ecosystems',
  'Philosophy, Epistemology & Applied Ethics',
  'Urban Futures & Smart Habitats',
];

export const PortalPublications: React.FC = () => {
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userRoleUpper = user?.role?.toUpperCase() || '';
  const isPresenter =
    userRoleUpper === 'PRESENTER' ||
    userRoleUpper === 'ADMIN' ||
    userRoleUpper === 'SUPER_ADMIN' ||
    userRoleUpper === 'COORDINATOR';

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: SPHERES[0],
    abstract: '',
    content: '',
  });

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ['portal-publications-all'],
    queryFn: () => apiRequest<Publication[]>('/publications'),
  });

  // Query my submissions
  const mySubmissions = publications.filter((p) => {
    if (!user) return false;
    const authorNames = p.authors?.map((a) => a.name.toLowerCase()) || [];
    return (
      authorNames.includes(user.name.toLowerCase()) ||
      (p as any).createdBy === user.id
    );
  });

  const submitPaperMutation = useMutation({
    mutationFn: (newPaper: typeof formData) =>
      apiRequest('/publications', {
        method: 'POST',
        body: JSON.stringify({
          title: newPaper.title.trim() || 'Untitled Academic Research',
          category: newPaper.category || SPHERES[0],
          abstract: newPaper.abstract.trim() || 'Executive abstract and research summary.',
          content: newPaper.content.trim() || undefined,
          status: 'under_review',
          authors: [
            {
              name: user?.name || 'Keynote Presenter',
              country: user?.country || 'Global',
              role: 'Keynote Presenter & Scholar',
              affiliation: user?.organization || 'Global Youth Dialogue Framework',
            },
          ],
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-publications-all'] });
      setIsSubmitModalOpen(false);
      setFormData({
        title: '',
        category: SPHERES[0],
        abstract: '',
        content: '',
      });
      setSubmitSuccessToast(true);
      setTimeout(() => setSubmitSuccessToast(false), 5000);
    },
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {submitSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {isArabic
              ? 'تم تقديم ورقتك الأكاديمية بنجاح إلى الأمانة العامة للمراجعة والاعتماد!'
              : 'Your academic piece has been submitted successfully to the Secretariat for editorial review and publishing!'}
          </span>
        </div>
      )}

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'استوديو الكتابة والمكتبة الأكاديمية' : 'Academic Writing Studio & Repository'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isArabic
              ? 'الوصول إلى أوراق الحوار المحكمة، وتقديم المقالات والأبحاث للمراجعة والنشر العام.'
              : 'Access peer-assessed monographs, policy syntheses, and submit presenter research essays for secretariat publication.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>
            {isArabic ? 'كتابة وتقديم ورقة أكاديمية' : 'Submit Academic Work / Piece'}
          </span>
        </button>
      </div>

      {/* Presenter Callout Banner (If presenter) */}
      {isPresenter && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isArabic ? 'صلاحية النشر الأكاديمي للمتحدثين المعتمدين' : 'Presenter Academic Publishing Clearance'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                {isArabic
                  ? 'بصفتك متحدثاً رسمياً معتمداً، يمكنك صياغة مقالاتك وأوراقك البحثية وتقديمها كطلب إلى الأمانة العامة. بمجرد مراجعتها واعتمادها، ستُنشر مباشرة على الموقع العام.'
                  : 'As an accredited presenter, you can author academic pieces, essays, and resolutions. Once reviewed and approved by the Secretariat Admin, your work will be published to the public global repository.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
          >
            {isArabic ? 'صياغة ورقة جديدة' : 'Draft New Paper'}
          </button>
        </div>
      )}

      {/* My Submitted Requests (If presenter has any) */}
      {isPresenter && mySubmissions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>{isArabic ? 'أوراقي الأكاديمية المقدمة' : 'My Submitted Academic Pieces'}</span>
            </h2>
            <span className="text-xs text-slate-500">
              {mySubmissions.length} {isArabic ? 'طلبات' : 'pieces'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySubmissions.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {paper.category}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      paper.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {paper.status === 'published'
                      ? (isArabic ? 'منشور في الموقع العام' : 'Published on Public Site')
                      : (isArabic ? 'قيد مراجعة الأمانة العامة' : 'Under Secretariat Review')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </span>

                  {paper.status === 'published' ? (
                    <Link
                      to={`/publications/${paper.slug}`}
                      className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{isArabic ? 'عرض المقال العام' : 'View Public Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'بانتظار اعتماد الإدارة' : 'Awaiting Admin Approval'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Digital Repository Papers */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{isArabic ? 'المكتبة الرقمية العامة للأوراق والقرارات' : 'Official Public Digital Repository'}</span>
        </h2>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">{isArabic ? 'جاري تحميل الأوراق الأكاديمية...' : 'Loading publications...'}</p>
          </div>
        ) : publications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-sm">{isArabic ? 'لم يتم نشر أوراق بحثية بعد.' : 'No research papers published yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publications.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {paper.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(paper.publishedAt || paper.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                    <Link to={`/publications/${paper.slug}`} className="hover:text-indigo-600">
                      {paper.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {paper.authors?.map((a) => a.name).join(', ') || 'GYDE Scholar'}
                  </span>
                  <Link
                    to={`/publications/${paper.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <span>{isArabic ? 'قراءة الورقة' : 'Read Paper'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Presenter Compose / Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {isArabic ? 'تقديم ورقة / مقال أكاديمي جديد' : 'Submit Academic Piece / Essay for Review'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isArabic
                      ? 'سيتم تدقيق الورقة من قبل الأمانة العامة واعتمادها للنشر العام في الموقع.'
                      : 'Submitted pieces are reviewed by the secretariat and published to the public repository.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitPaperMutation.mutate(formData);
              }}
              className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'عنوان الورقة / المقال الأكاديمي *' : 'Title of the Academic Work *'}
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? 'مثال: سيادة البيانات والذكاء الاصطناعي في الجنوب العالمي'
                      : 'e.g. Transboundary Climate Liability & Sovereign Adaptation Financing'
                  }
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'المجال الأكاديمي / التخصص' : 'Academic Sphere / Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {SPHERES.map((sphere) => (
                    <option key={sphere} value={sphere}>
                      {sphere}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'الملخص الأكاديمي التنفيذي (اختياري)' : 'Abstract / Executive Summary (Optional)'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isArabic
                      ? 'ملخص دقيق للفرضية الأكاديمية والمنهجية والنتائج الرئيسية والتوصيات السياساتية...'
                      : 'Comprehensive summary of the problem, argument, methodology, and key policy takeaways...'
                  }
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص الورقة الكامل / المقال الأكاديمي' : 'Full Piece Content / Article Body'}
                </label>
                <textarea
                  rows={6}
                  placeholder={
                    isArabic
                      ? 'اكتب المقال أو الورقة الكاملة هنا مع التوصيات والمراجع...'
                      : 'Draft the full monograph, essay, or resolution arguments here...'
                  }
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                <span>
                  {isArabic
                    ? 'سيتم إدراج اسمك كمؤلف رئيسي للورقة، وستصلك إشعارات فور اعتماد الإدارة ونشرها على الموقع العام.'
                    : `Will be submitted under author: ${user?.name || 'Keynote Presenter'}. Once reviewed and approved by Secretariat Admin, it will be accredited and publicly indexed.`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitPaperMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitPaperMutation.isPending
                      ? (isArabic ? 'جاري الإرسال...' : 'Submitting Request...')
                      : (isArabic ? 'إرسال للمراجعة والاعتماد' : 'Submit for Admin Review')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
