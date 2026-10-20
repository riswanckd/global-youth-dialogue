import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Topic } from '../../types';
import { CATEGORIES } from '../../constants';
import { Lightbulb, Plus, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export const PortalTopics: React.FC = () => {
  const { isArabic, translateCategory, translateStatus } = useLanguage();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0].id,
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['portal-topics-list'],
    queryFn: () => apiRequest<Topic[]>('/topics'),
  });

  const mutation = useMutation({
    mutationFn: (newTopic: any) =>
      apiRequest('/topics', {
        method: 'POST',
        body: JSON.stringify(newTopic),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-topics-list'] });
      setShowForm(false);
      setFormData({ title: '', category: CATEGORIES[0].id, description: '' });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || (isArabic ? 'فشل إرسال مقترح الموضوع' : 'Failed to submit topic proposal'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const getStatusBadge = (status: Topic['status']) => {
    switch (status) {
      case 'proposed':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? 'مقترح' : 'Proposed'}
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? 'قيد المراجعة' : 'Under Review'}
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? 'معتمد' : 'Approved'}
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? 'مجدول' : 'Scheduled'}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
            {isArabic ? 'منعقد' : 'Completed'}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {translateStatus(status)}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'مسار القضايا والمقترحات الحوارية' : 'Topic Proposals & Dialogue Pipeline'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isArabic ? 'اطرح موضوعات حوارية جديدة وتابع تقدمها في مسار دورة الحوار' : 'Submit dialogue topics and track their progression through review to scheduling.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white font-bold text-xs shadow transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? (isArabic ? 'إلغاء' : 'Cancel') : (isArabic ? 'اقتراح موضوع جديد' : 'Propose New Topic')}</span>
        </button>
      </div>

      {/* Proposal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border-2 border-gyde-green/30 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gyde-gold" />
            <span>{isArabic ? 'تقديم مقترح موضوع حواري جديد' : 'Submit a Dialogue Topic Proposal'}</span>
          </h3>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {isArabic ? 'عنوان الموضوع / القضية الحوارية *' : 'Topic Title / Dialogue Theme *'}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder={isArabic ? 'مثال: يرى هذا المجلس وجوب إتاحة المصادر المفتوحة لنماذج الذكاء الاصطناعي التأسيسية' : 'e.g. This House would mandate open-weight source code for foundation AI models'}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {isArabic ? 'المجال التخصصي *' : 'Category Discipline *'}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {isArabic ? c.nameAr : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {isArabic ? 'السياق الأكاديمي وجوهر النزاع الفكري *' : 'Academic Context & Clashing Arguments *'}
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder={isArabic ? 'وضح التوتر الجوهري بين وجهتي النظر المؤيدة والمعارضة والأسس المعرفية...' : 'Outline the fundamental tension between affirmative and negative sides...'}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="py-2.5 px-6 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white font-bold text-xs shadow cursor-pointer"
          >
            {mutation.isPending
              ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...')
              : (isArabic ? 'إرسال المقترح إلى المسار الحواري' : 'Propose Motion to Pipeline')}
          </button>
        </form>
      )}

      {/* Topics Pipeline List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">{isArabic ? 'جارٍ تحميل مسار القضايا...' : 'Loading topic pipeline...'}</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gyde-canvas-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
            {isArabic ? 'لا توجد مقترحات مواضيع مسجلة بعد' : 'No topic proposals yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {isArabic ? 'كن أول من يقترح قضية حوارية للدورة القادمة.' : 'Be the first to submit a motion for the upcoming cycle.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(topic.status)}
                  <span className="text-xs font-semibold text-gyde-gold">
                    {translateCategory(topic.category)}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {isArabic ? 'اقتراح بواسطة:' : 'Proposed by:'}{' '}
                  <strong>{topic.proposedBy?.name || (isArabic ? 'وفد مشارك' : 'Delegate')}</strong>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic && (topic as any).titleAr ? (topic as any).titleAr : topic.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {isArabic && (topic as any).descriptionAr ? (topic as any).descriptionAr : topic.description}
                </p>
              </div>

              {topic.reviewNotes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong>{isArabic ? 'ملاحظة مراجعة الأمانة العامة:' : 'Secretariat Review Note:'}</strong> {topic.reviewNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
