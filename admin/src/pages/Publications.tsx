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
  XCircle,
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
  const { t, translateCategory, translateStatus, isArabic } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reviewModalPaper, setReviewModalPaper] = useState<Publication | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

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
    mutationFn: ({ id, status, title }: { id: string; status: string; title?: string }) =>
      apiRequest(`/admin/publications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, title }),
      }),
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setReviewModalPaper(null);

      if (variables.status === 'published') {
        try {
          const publishedItem = data?.data || data || {
            id: variables.id,
            title: variables.title,
            status: 'published',
            visibility: 'public',
            publishedAt: new Date().toISOString(),
          };
          const stored = localStorage.getItem('gyde_cached_publications');
          const currentList = stored ? JSON.parse(stored) : [];
          const updated = [publishedItem, ...currentList.filter((p: any) => (p.id || p._id) !== variables.id)];
          localStorage.setItem('gyde_cached_publications', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      } else if (variables.status === 'rejected') {
        try {
          const stored = localStorage.getItem('gyde_cached_publications');
          if (stored) {
            const currentList = JSON.parse(stored);
            const updated = currentList.filter((p: any) => (p.id || p._id) !== variables.id);
            localStorage.setItem('gyde_cached_publications', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
          }
        } catch {}
      }

      showToast(
        variables.status === 'published'
          ? (isArabic ? 'تم اعتماد ونشر الورقة البحثية بنجاح!' : 'Paper approved & published to website successfully!')
          : (isArabic ? 'تم رفض الورقة واستبعادها من النشر.' : 'Academic paper submission declined/rejected.')
      );
    },
    onError: (err: any) => {
      showToast(err?.message || 'Failed to update publication status', 'error');
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
          visibility: 'public',
          publishedAt: newPub.status === 'published' ? new Date().toISOString() : undefined,
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      try {
        const publishedItem = data?.data || data;
        if (publishedItem) {
          const stored = localStorage.getItem('gyde_cached_publications');
          const currentList = stored ? JSON.parse(stored) : [];
          const updated = [publishedItem, ...currentList];
          localStorage.setItem('gyde_cached_publications', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}
      setIsCreateModalOpen(false);
      showToast(isArabic ? 'تم نشر الورقة البحثية بنجاح' : 'Academic piece created and published.');
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
    onError: (err: any) => {
      showToast(err?.message || 'Failed to publish piece', 'error');
    },
  });

  const filtered = publications.filter((p) => {
    const authorName = p.authors?.[0]?.name || (p as any).author?.name || '';
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      authorName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'review'
        ? (p.status === 'under_review' || p.status === 'draft')
        : p.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = publications.filter((p) => p.status === 'published').length;
  const reviewCount = publications.filter((p) => p.status === 'under_review' || p.status === 'draft').length;
  const rejectedCount = publications.filter((p) => p.status === 'rejected').length;

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-20 right-6 z-50 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 ${
            toastMsg.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {toastMsg.type === 'error' ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('pubs.title', 'Academic Writing Studio & Publications')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('pubs.subtitle', 'Author official secretariat monographs, review delegate and presenter research submissions, and publish to the public repository.')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('pubs.writePiece', 'Write Academic Piece')}</span>
        </button>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Papers */}
        <div
          onClick={() => setSelectedStatusFilter('all')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            selectedStatusFilter === 'all'
              ? 'border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publications.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('pubs.totalWorks', 'Total Works')}
            </div>
          </div>
        </div>

        {/* In Editorial Review */}
        <div
          onClick={() => setSelectedStatusFilter('review')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            selectedStatusFilter === 'review'
              ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {reviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('pubs.presenterRequests', 'Presenter Requests')}
            </div>
          </div>
        </div>

        {/* Published Online */}
        <div
          onClick={() => setSelectedStatusFilter('published')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            selectedStatusFilter === 'published'
              ? 'border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publishedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('pubs.publishedOnSite', 'Published on Site')}
            </div>
          </div>
        </div>

        {/* Denied / Rejected Works */}
        <div
          onClick={() => setSelectedStatusFilter('rejected')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            selectedStatusFilter === 'rejected'
              ? 'border-rose-400 dark:border-rose-600 ring-2 ring-rose-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {rejectedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {isArabic ? 'المرفوضة' : 'Denied / Rejected'}
            </div>
          </div>
        </div>
      </div>

      {/* Publications Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('pubs.searchPlaceholder', 'Search papers by title or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedStatusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t('pubs.allTab', 'All Papers')} ({publications.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedStatusFilter === 'review'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t('pubs.requestsTab', 'Presenter Requests')} ({reviewCount})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedStatusFilter === 'published'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t('pubs.publishedTab', 'Published Papers')} ({publishedCount})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedStatusFilter === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isArabic ? 'المرفوضة' : 'Denied'} ({rejectedCount})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">{t('common.loading', 'Loading...')}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">{t('pubs.noPubs', 'No research papers found.')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((paper) => {
              const paperId = (paper as any).id || (paper as any)._id;
              const isRejected = paper.status === 'rejected';
              const isPublished = paper.status === 'published';

              return (
                <div key={paperId || paper.slug} className="p-4 space-y-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setReviewModalPaper(paper)}
                        className="text-left rtl:text-right group cursor-pointer"
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
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {isPublished
                        ? t('pubs.publishedBadge', 'Published Online')
                        : isRejected
                        ? (isArabic ? 'مرفوض' : 'Declined / Denied')
                        : t('status.pending', 'Pending Review')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {paper.abstract}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                    <div>
                      {isArabic ? 'المؤلف:' : 'Author:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {paper.authors?.map((a: any) => a.name).join(', ') || 'GYDE Scholar'}
                      </strong>
                      {paper.authors?.[0]?.affiliation && ` (${paper.authors[0].affiliation})`}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewModalPaper(paper)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('pubs.reviewAction', 'Review Details')}</span>
                      </button>

                      {isPublished ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('pubs.publishedOnSite', 'Visible on Site')}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => publishMutation.mutate({ id: paperId, status: 'rejected', title: paper.title })}
                            disabled={publishMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                          >
                            {isArabic ? 'إلغاء النشر ورفض' : 'Unpublish & Deny'}
                          </button>
                        </div>
                      ) : isRejected ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-rose-600 dark:text-rose-400 font-semibold inline-flex items-center gap-1 text-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'مرفوض' : 'Denied'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => publishMutation.mutate({ id: paperId, status: 'published', title: paper.title })}
                            disabled={publishMutation.isPending}
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'إعادة اعتماد ونشر' : 'Approve & Publish'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => publishMutation.mutate({ id: paperId, status: 'rejected', title: paper.title })}
                            disabled={publishMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'رفض' : 'Deny'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => publishMutation.mutate({ id: paperId, status: 'published', title: paper.title })}
                            disabled={publishMutation.isPending}
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('pubs.publishBtn', 'Accredit & Publish')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
                    {t('pubs.createModalTitle', 'Draft & Publish Academic Piece')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('pubs.createModalSubtitle', 'Secretariat monographs are immediately published to the public digital repository.')}
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
                  {t('pubs.titleLabel', 'Paper Title')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('pubs.titlePlaceholder', 'e.g., Multilateral AI Governance & Transnational Ethical Standards')}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('pubs.categoryLabel', 'Academic Discipline / Category')} *
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
                    {isArabic ? 'حالة النشر *' : 'Publication Status *'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="published">{isArabic ? 'نشر فوري في الموقع العام' : 'Publish Immediately to Public Site'}</option>
                    <option value="draft">{isArabic ? 'حفظ كمسودة خاصة' : 'Save as Draft (Private)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('pubs.abstractLabel', 'Abstract / Executive Summary')} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('pubs.abstractPlaceholder', 'Comprehensive summary of the problem statement, thesis, methodology, and key policy findings...')}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('pubs.contentLabel', 'Full Piece Content / Article Body')}
                </label>
                <textarea
                  rows={6}
                  placeholder={t('pubs.contentPlaceholder', 'Full text of the essay, article, or policy recommendation...')}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('pubs.authorLabel', 'Lead Author Name')}
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
                    {t('pubs.affiliationLabel', 'Author Affiliation')}
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
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createPubMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {createPubMutation.isPending
                    ? t('common.loading', 'Publishing...')
                    : formData.status === 'published'
                    ? t('pubs.publishNowBtn', 'Publish to Site')
                    : t('pubs.saveDraftBtn', 'Save Draft')}
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
                  {translateCategory(reviewModalPaper.category)}
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
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {isArabic ? 'الكاتب والباحث' : 'Author & Scholar'}
                  </span>
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
                      : reviewModalPaper.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {reviewModalPaper.status === 'published'
                    ? t('pubs.publishedBadge', 'Published Online')
                    : reviewModalPaper.status === 'rejected'
                    ? (isArabic ? 'مرفوض' : 'Declined / Denied')
                    : t('status.pending', 'Pending Review')}
                </span>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t('pubs.abstractLabel', 'Abstract / Executive Summary')}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {reviewModalPaper.abstract}
                </p>
              </div>

              {/* Content / Body */}
              {reviewModalPaper.content && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t('pubs.contentLabel', 'Submitted Full Text Body')}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap font-sans">
                    {reviewModalPaper.content}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setReviewModalPaper(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {t('common.close', 'Close')}
              </button>

              <div className="flex items-center gap-2">
                {(() => {
                  const modalPaperId = (reviewModalPaper as any).id || (reviewModalPaper as any)._id;
                  if (reviewModalPaper.status === 'published') {
                    return (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isArabic ? 'معتمد ومنشور على الموقع' : 'Approved & Live on Website'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => publishMutation.mutate({ id: modalPaperId, status: 'rejected', title: reviewModalPaper.title })}
                          disabled={publishMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                        >
                          {isArabic ? 'إلغاء النشر ورفض' : 'Unpublish & Deny'}
                        </button>
                      </div>
                    );
                  }
                  if (reviewModalPaper.status === 'rejected') {
                    return (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>{isArabic ? 'هذا المقترح مرفوض حالياً' : 'Submission currently Denied'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => publishMutation.mutate({ id: modalPaperId, status: 'published', title: reviewModalPaper.title })}
                          disabled={publishMutation.isPending}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>{publishMutation.isPending ? t('common.loading', 'Publishing...') : (isArabic ? 'إعادة الاعتماد والنشر' : 'Reconsider & Publish to Site')}</span>
                        </button>
                      </div>
                    );
                  }
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => publishMutation.mutate({ id: modalPaperId, status: 'rejected', title: reviewModalPaper.title })}
                        disabled={publishMutation.isPending}
                        className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>{publishMutation.isPending ? (isArabic ? 'جاري المعالجة...' : 'Updating...') : (isArabic ? 'رفض الطلب واستبعاد' : 'Deny Submission')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => publishMutation.mutate({ id: modalPaperId, status: 'published', title: reviewModalPaper.title })}
                        disabled={publishMutation.isPending}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{publishMutation.isPending ? t('common.loading', 'Publishing...') : (isArabic ? 'اعتماد ونشر في الموقع' : 'Approve & Publish to Public Site')}</span>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
