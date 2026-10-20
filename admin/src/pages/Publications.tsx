import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Publication } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Lightbulb,
  X,
  Eye,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
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

export const Publications: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reviewModalPaper, setReviewModalPaper] = useState<Publication | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: SPHERES[0],
    abstract: '',
    content: '',
    authorName: 'GYDE Super Administrator',
    authorAffiliation: 'Founding Secretariat',
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      setReviewModalPaper(null);
    },
  });

  const createPubMutation = useMutation({
    mutationFn: (newPub: typeof formData) =>
      apiRequest('/admin/publications', {
        method: 'POST',
        body: JSON.stringify({
          title: newPub.title,
          category: newPub.category,
          abstract: newPub.abstract,
          content: newPub.content,
          status: newPub.status,
          authors: [
            {
              name: newPub.authorName.trim() || 'GYDE Super Administrator',
              country: 'India',
              role: 'Secretariat Admin',
              affiliation: newPub.authorAffiliation.trim() || 'Founding Secretariat',
            },
          ],
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        category: SPHERES[0],
        abstract: '',
        content: '',
        authorName: 'GYDE Super Administrator',
        authorAffiliation: 'Founding Secretariat',
        status: 'published',
      });
    },
  });

  const filtered = publications.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.authors && p.authors.some((a) => a.name.toLowerCase().includes(q)));
    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'review'
        ? p.status !== 'published'
        : p.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = publications.filter((p) => p.status === 'published').length;
  const reviewCount = publications.filter((p) => p.status !== 'published').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('pubs.title', 'Academic Writing Studio')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author official secretariat monographs, review delegate and presenter research submissions, and publish to the public repository.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write Academic Piece</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Papers */}
        <div
          onClick={() => setSelectedStatusFilter('all')}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publications.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Total Works
            </div>
          </div>
        </div>

        {/* In Editorial Review */}
        <div
          onClick={() => setSelectedStatusFilter('review')}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {reviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Presenter Requests
            </div>
          </div>
        </div>

        {/* Published Online */}
        <div
          onClick={() => setSelectedStatusFilter('published')}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publishedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Published on Site
            </div>
          </div>
        </div>

        {/* Core Disciplines */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              16
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Active Disciplines
            </div>
          </div>
        </div>
      </div>

      {/* Publications Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder="Search pieces by title, category, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
            {['all', 'review', 'published'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  selectedStatusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Works' : st === 'review' ? 'Presenter Requests' : 'Published Online'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading research pieces...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No research pieces found matching filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((paper) => (
              <div key={paper.id} className="p-4 space-y-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setReviewModalPaper(paper)}
                      className="text-left group"
                    >
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {paper.title}
                      </h4>
                    </button>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                      {translateCategory(paper.category)}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      paper.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {paper.status === 'published' ? 'Published Online' : 'Pending Review'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                  <div>
                    Authors: <strong className="text-slate-700 dark:text-slate-300">{paper.authors?.map((a: any) => a.name).join(', ') || 'GYDE Scholar'}</strong>
                    {paper.authors?.[0]?.affiliation && ` (${paper.authors[0].affiliation})`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewModalPaper(paper)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>

                    {paper.status !== 'published' ? (
                      <button
                        type="button"
                        onClick={() => publishMutation.mutate({ id: paper.id, status: 'published' })}
                        disabled={publishMutation.isPending}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish to Site</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Visible on Public Site</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Write Academic Piece Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Write Academic Piece / Essay / Article
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compose official secretariat monographs, policy resolutions, or research essays.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPubMutation.mutate(formData);
              }}
              className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Title of the Academic Work *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multilateral AI Governance & Transnational Ethical Standards"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Discipline / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {SPHERES.map((sphere) => (
                      <option key={sphere} value={sphere}>
                        {translateCategory(sphere)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="published">Publish Immediately to Public Site</option>
                    <option value="draft">Save as Draft (Private)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Abstract / Executive Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive summary of the problem statement, thesis, methodology, and key policy findings..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Piece Content / Article Body (Optional)
                </label>
                <textarea
                  rows={6}
                  placeholder="Full text of the essay, article, or policy recommendation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lead Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Author Affiliation
                  </label>
                  <input
                    type="text"
                    value={formData.authorAffiliation}
                    onChange={(e) => setFormData({ ...formData, authorAffiliation: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPubMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {createPubMutation.isPending
                    ? 'Publishing...'
                    : formData.status === 'published'
                    ? 'Publish to Site'
                    : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Publish Modal for Presenter Submissions */}
      {reviewModalPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {reviewModalPaper.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                  {reviewModalPaper.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalPaper(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
              {/* Authors info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Author & Scholar</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {reviewModalPaper.authors?.map((a) => a.name).join(', ') || 'GYDE Scholar'}
                  </span>
                  {reviewModalPaper.authors?.[0]?.affiliation && (
                    <span className="text-slate-500 text-[11px] block">{reviewModalPaper.authors[0].affiliation}</span>
                  )}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    reviewModalPaper.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {reviewModalPaper.status === 'published' ? 'Published Online' : 'Pending Review'}
                </span>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Abstract / Executive Summary
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {reviewModalPaper.abstract}
                </p>
              </div>

              {/* Content / Body */}
              {reviewModalPaper.content && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Submitted Full Text Body
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap font-sans">
                    {reviewModalPaper.content}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setReviewModalPaper(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>

              {reviewModalPaper.status !== 'published' ? (
                <button
                  type="button"
                  onClick={() => publishMutation.mutate({ id: reviewModalPaper.id, status: 'published' })}
                  disabled={publishMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{publishMutation.isPending ? 'Publishing...' : 'Approve & Publish to Public Site'}</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved & Live on Website</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
