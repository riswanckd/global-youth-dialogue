import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';
import { CATEGORIES } from '../../constants';
import { BookOpen, Calendar, ArrowRight, User, Plus, X, Send, CheckCircle2, FileText, AlertCircle } from 'lucide-react';

export const PortalPublications: React.FC = () => {
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0]?.name || 'Geopolitics & International Relations',
    abstract: '',
    content: '',
    documentUrl: '',
    coverImage: ''
  });

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ['portal-publications-all'],
    queryFn: () => apiRequest<Publication[]>('/publications'),
  });

  const submitMutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest<Publication>('/publications', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-publications-all'] });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(false);
        setFormData({
          title: '',
          category: CATEGORIES[0]?.name || 'Geopolitics & International Relations',
          abstract: '',
          content: '',
          documentUrl: '',
          coverImage: ''
        });
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.abstract) return;

    submitMutation.mutate({
      title: formData.title,
      category: formData.category,
      abstract: formData.abstract,
      content: formData.content,
      documentUrl: formData.documentUrl || undefined,
      coverImage: formData.coverImage || undefined,
      authors: [
        {
          name: user?.name || 'GYDE Presenter',
          country: user?.country || 'International',
          role: 'Author & Presenter',
          affiliation: user?.organization || 'Global Youth Dialogue Platform'
        }
      ]
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'الأوراق البحثية والمكتبة الأكاديمية' : 'Academic Research Repository'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isArabic
              ? 'الوصول الكامل إلى مسودات الأوراق البحثية المحكمة والمطبوعات الأكاديمية'
              : 'Access complete monographs, essays, and academic syntheses published by the GYDE research fellows.'}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-sm transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'كتابة وتقديم ورقة بحثية' : 'Submit Academic Work'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading publications...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-gyde-green border border-emerald-200 dark:border-emerald-800">
                    {paper.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(paper.publishedAt || paper.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                  <Link to={`/publications/${paper.slug}`} className="hover:text-gyde-green">
                    {paper.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {paper.authors?.map((a) => a.name).join(', ') || 'Fellow'}
                </span>
                <Link
                  to={`/publications/${paper.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gyde-green hover:underline"
                >
                  <span>Read Paper</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Presenter Academic Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'كتابة وتقديم ورقة أكاديمية' : 'Academic Writing Studio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic
                      ? 'قدّم مسودتك أو مقالك الأكاديمي لمراجعة أمانة الحوار ونشره على الموقع'
                      : 'Draft essays, research briefs, or monographs for Secretariat peer-review and publication'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {submitSuccess ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تم إرسال العمل بنجاح' : 'Academic Work Submitted!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {isArabic
                    ? 'تم إرسال مسودتك بنجاح إلى فريق الإدارة للمراجعة العلمية. ستظهر على الموقع العام فور اعتمادها.'
                    : 'Your piece has been received by the Secretariat editorial board. Once reviewed and approved by the Super Admin, it will be published live to the public repository.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                {submitMutation.isError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Failed to submit proposal. Please verify fields and try again.</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'عنوان الورقة / المقال الأكاديمي' : 'Paper / Essay Title'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Autonomous Decision-Making in Multilateral Treaties"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'المجال الأكاديمي / المحور' : 'Academic Field / Category'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'الملخص التنفيذي' : 'Executive Abstract'} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="A concise synopsis outlining the core thesis, methodology, and regional implications..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'النص الأكاديمي الكامل / المقال' : 'Complete Academic Text / Monograph Essay'}
                  </label>
                  <textarea
                    rows={7}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write or paste your full academic piece, introduction, structured analysis, and concluding propositions..."
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'رابط ملف PDF الخارجي' : 'External PDF Document Link'} (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.documentUrl}
                      onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                      placeholder="https://drive.google.com/... or https://..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'رابط صورة الغلاف' : 'Cover Image URL'} (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Admin Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
