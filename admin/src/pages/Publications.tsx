import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Publication } from '../types';
import { BookOpen, Plus, Search, CheckCircle2, FileText, Clock, Lightbulb, X, Send, Sparkles } from 'lucide-react';

const CATEGORIES_LIST = [
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

export const Publications: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending'>('all');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Geopolitics & International Relations',
    abstract: '',
    content: '',
    authorName: 'GYDE Secretariat / Academic Fellows',
    authorAffiliation: 'Global Youth Dialogue & Exchange',
    documentUrl: '',
    status: 'published' as 'published' | 'draft',
  });

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ['admin-publications'],
    queryFn: () => apiRequest<Publication[]>('/admin/publications'),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/admin/publications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-publications'] }),
  });

  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.abstract.trim()) {
      alert('Title and Abstract are required.');
      return;
    }

    setFormSubmitting(true);
    try {
      await apiRequest('/admin/publications', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          abstract: formData.abstract.trim(),
          content: formData.content.trim() || formData.abstract.trim(),
          authors: [
            {
              name: formData.authorName.trim() || 'GYDE Secretariat',
              affiliation: formData.authorAffiliation.trim() || 'Global Youth Dialogue',
            },
          ],
          documentUrl: formData.documentUrl.trim() || undefined,
          status: formData.status,
          visibility: 'public',
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setShowWriteModal(false);
        setFormData({
          title: '',
          category: 'Geopolitics & International Relations',
          abstract: '',
          content: '',
          authorName: 'GYDE Secretariat / Academic Fellows',
          authorAffiliation: 'Global Youth Dialogue & Exchange',
          documentUrl: '',
          status: 'published',
        });
      }, 1200);
    } catch (err: any) {
      alert(err?.message || 'Failed to publish academic piece.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filtered = publications.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? p.status === 'published'
        : p.status !== 'published';
    return matchesSearch && matchesStatus;
  });

  const publishedCount = publications.filter((p) => p.status === 'published').length;
  const reviewCount = publications.filter((p) => p.status !== 'published').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('pubs.title', 'Academic Writing Studio')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and publish academic pieces, research essays, and policy papers directly to the platform, and review presenter submissions.
          </p>
        </div>

        <button
          onClick={() => setShowWriteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write & Publish Academic Piece</span>
        </button>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Papers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publications.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('dash.kpiAcademicPapers', 'Total Papers')}
            </div>
          </div>
        </div>

        {/* In Peer Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {reviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('in_review')}
            </div>
          </div>
        </div>

        {/* Published Online */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publishedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('pubs.publishedBadge', 'Published Online')}
            </div>
          </div>
        </div>

        {/* Disciplines */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              16
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('sessions.categoryLabel', 'Disciplines')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('pubs.searchPlaceholder', 'Search papers by title or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({publications.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'published'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pending Submissions ({reviewCount})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading research papers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('pubs.noPubs', 'No research papers found.')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((paper) => (
              <div key={paper.id} className="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{paper.title}</h4>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      {translateCategory(paper.category)}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      paper.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {paper.status === 'published' ? 'Published Online' : 'Pending Review'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{paper.abstract}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>Authors: <strong className="text-slate-700 dark:text-slate-200">{paper.authors?.map((a: any) => a.name).join(', ') || 'GYDE Fellows'}</strong></div>
                  {paper.status !== 'published' ? (
                    <button
                      onClick={() => publishMutation.mutate({ id: paper.id, status: 'published' })}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('pubs.publishBtn', 'Approve & Publish to Site')}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('pubs.publishedBadge', 'Live on Website')}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write & Publish Academic Piece Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    Write Academic Piece / Essay / Paper
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Compose scholarly articles, policy monographs, and working papers to publish directly on the platform.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWriteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePublication} className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1 no-scrollbar text-xs">
              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Academic piece successfully published and added to repository!</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Title of Academic Piece *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multilateral Sovereign Debt Restructuring in Developing Economies"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Discipline / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="published">Publish Directly to Site</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Author / Fellow Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Affiliation / Chapter
                  </label>
                  <input
                    type="text"
                    value={formData.authorAffiliation}
                    onChange={(e) => setFormData({ ...formData, authorAffiliation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Executive Abstract *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a comprehensive academic abstract summarizing the research methodology, premises, and conclusions..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Article Body / Full Monograph Text (Optional)
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste or compose the full text of the article or paper..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  PDF / External Document URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://.../paper.pdf"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{formSubmitting ? 'Publishing...' : 'Publish Academic Piece'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
