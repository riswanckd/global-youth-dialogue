import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Topic } from '../types';
import {
  Lightbulb,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  X,
  BookOpen,
  Filter,
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

const ACTIVITY_FORMATS = [
  'Topic Presentation',
  'Structural Debate',
  'Discussion',
  'Guest Talks',
  'Academic Discussion / Policy Roundtable',
];

const INITIAL_FORM = {
  title: '',
  motion: '',
  category: 'Geopolitics & International Relations',
  format: 'Academic Discussion / Policy Roundtable',
  status: 'approved',
  regionalPerspective: '',
  description: '',
};

export const Topics: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, translateCategory, translateStatus, isArabic } = useAdminLanguage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Automatically open modal if ?add=true is present in the URL
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['admin-topics'],
    queryFn: () => apiRequest<Topic[]>('/admin/topics'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/admin/topics/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-topics'] }),
  });

  const createTopicMutation = useMutation({
    mutationFn: (newTopic: typeof INITIAL_FORM) =>
      apiRequest('/admin/topics', {
        method: 'POST',
        body: JSON.stringify({
          ...newTopic,
          motion: newTopic.motion.trim() || undefined,
          regionalPerspective: newTopic.regionalPerspective.trim() || undefined,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      setCreateSuccess(true);
      setFormError('');
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
        setFormData(INITIAL_FORM);
        if (searchParams.get('add')) {
          searchParams.delete('add');
          setSearchParams(searchParams);
        }
      }, 1000);
    },
    onError: (err: any) => {
      setFormError(err?.message || 'Failed to add topic. Please check required fields.');
    },
  });

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData(INITIAL_FORM);
    setFormError('');
    setCreateSuccess(false);
    if (searchParams.get('add')) {
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required.');
      return;
    }
    createTopicMutation.mutate(formData);
  };

  const filtered = topics.filter((tItem) => {
    const q = search.toLowerCase();
    const matchesSearch =
      tItem.title.toLowerCase().includes(q) ||
      tItem.category.toLowerCase().includes(q) ||
      (tItem.motion && tItem.motion.toLowerCase().includes(q)) ||
      (tItem.description && tItem.description.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'proposed'
        ? tItem.status === 'proposed' || tItem.status === 'reviewing'
        : tItem.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' ? true : tItem.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const inReviewCount = topics.filter((t) => t.status === 'proposed' || t.status === 'reviewing').length;
  const approvedCount = topics.filter((t) => t.status === 'approved').length;
  const rejectedCount = topics.filter((t) => t.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Topic Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('topics.title', 'Topic Bank & Pipeline')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'topics.subtitle',
              'Curate and manage parliamentary debate motions across the 16 core knowledge disciplines.'
            )}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('topics.addTopicBtn', 'Add Topic')}</span>
        </button>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Topics */}
        <div
          onClick={() => {
            setStatusFilter('all');
            setCategoryFilter('all');
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {topics.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('dash.kpiTopicLibrary', 'Topic Bank')}
            </div>
          </div>
        </div>

        {/* In Review */}
        <div
          onClick={() => setStatusFilter('proposed')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            statusFilter === 'proposed'
              ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {inReviewCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('in_review')}
            </div>
          </div>
        </div>

        {/* Approved Motions */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            statusFilter === 'approved'
              ? 'border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/20'
              : 'border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {approvedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('approved')}
            </div>
          </div>
        </div>

        {/* Rejected Motions */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={`bg-white dark:bg-slate-900 rounded-2xl border p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group cursor-pointer transition-colors ${
            statusFilter === 'rejected'
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
              {translateStatus('rejected')}
            </div>
          </div>
        </div>
      </div>

      {/* Topics Table Container with Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('topics.searchPlaceholder', 'Search topics by motion or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">
                  {isArabic ? 'جميع المجالات المعرفية' : 'All Disciplines'}
                </option>
                {SPHERES.map((sphere) => (
                  <option key={sphere} value={sphere}>
                    {translateCategory(sphere)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {isArabic ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  statusFilter === 'approved'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {translateStatus('approved')}
              </button>
              <button
                onClick={() => setStatusFilter('proposed')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  statusFilter === 'proposed'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {translateStatus('in_review')}
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                  statusFilter === 'rejected'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {translateStatus('rejected')}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading topic motions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Lightbulb className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('topics.noTopics', 'No topics found.')}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('topics.addTopicBtn', 'Add Topic')}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('sessions.motionLabel', 'Motion / Topic')}</th>
                    <th className="py-3 px-4">{t('sessions.categoryLabel', 'Category')}</th>
                    <th className="py-3 px-4">{t('apps.colApplicant', 'Proposer')}</th>
                    <th className="py-3 px-4">{t('apps.colStatus', 'Status')}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{t('apps.colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                  {filtered.map((topicItem) => {
                    const topicId = (topicItem as any).id || (topicItem as any)._id;
                    return (
                      <tr key={topicId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 max-w-md">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{topicItem.title}</span>
                            {topicItem.format && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                                {translateCategory(topicItem.format)}
                              </span>
                            )}
                          </div>
                          {topicItem.motion && (
                            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic mt-0.5">
                              "{topicItem.motion}"
                            </div>
                          )}
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {topicItem.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                            {translateCategory(topicItem.category)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {topicItem.proposedBy?.name || 'Administrator / Coordinator'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {topicItem.proposedBy?.country || t('dash.global', 'Global')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              topicItem.status === 'approved'
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                                : topicItem.status === 'rejected'
                                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {translateStatus(topicItem.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right rtl:text-left">
                          <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                            {topicItem.status !== 'approved' && (
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: topicId, status: 'approved' })}
                                className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                              >
                                {t('dash.approve', 'Approve')}
                              </button>
                            )}
                            {topicItem.status !== 'rejected' && (
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: topicId, status: 'rejected' })}
                                className="px-2 py-1 text-xs font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                              >
                                {t('topics.rejectMotion', 'Decline')}
                              </button>
                            )}
                            {topicItem.status === 'approved' && (
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {translateStatus('approved')}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {filtered.map((topicItem) => {
                const topicId = (topicItem as any).id || (topicItem as any)._id;
                return (
                  <div
                    key={topicId}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {topicItem.title}
                        </h4>
                        <div className="flex items-center flex-wrap gap-1.5 mt-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                            {translateCategory(topicItem.category)}
                          </span>
                          {topicItem.format && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {translateCategory(topicItem.format)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          topicItem.status === 'approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : topicItem.status === 'rejected'
                            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {translateStatus(topicItem.status)}
                      </span>
                    </div>

                    {topicItem.motion && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium italic">
                        "{topicItem.motion}"
                      </p>
                    )}

                    {topicItem.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {topicItem.description}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span>
                        {topicItem.proposedBy?.name || 'Administrator'} ({topicItem.proposedBy?.country || t('dash.global', 'Global')})
                      </span>

                      <div className="flex items-center gap-1.5">
                        {topicItem.status !== 'approved' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: topicId, status: 'approved' })}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                          >
                            {t('dash.approve', 'Approve')}
                          </button>
                        )}
                        {topicItem.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: topicId, status: 'rejected' })}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            {t('topics.rejectMotion', 'Decline')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Add New Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('topics.addModalTitle', 'Add New Topic to Bank')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(
                      'topics.addModalSubtitle',
                      'Administrators have authorization to directly add approved debate topics to the global repository.'
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Success Notifications */}
            {createSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{t('topics.toastSuccess', 'New topic successfully added to Topic Bank!')}</span>
              </div>
            )}
            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-medium">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Topic Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.titleInputLabel', 'Topic Title')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t(
                    'topics.titlePlaceholder',
                    'e.g., Geopolitical Realignment in South Asia'
                  )}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Debate Motion / Thesis */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.motionInputLabel', 'Suggested Debate Motion')}
                </label>
                <input
                  type="text"
                  placeholder={t(
                    'topics.motionPlaceholder',
                    'This House Believes That / This House Would...'
                  )}
                  value={formData.motion}
                  onChange={(e) => setFormData({ ...formData, motion: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-[11px]"
                />
              </div>

              {/* Sphere & Activity Format 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Academic Discipline / Category */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('topics.categoryInputLabel', 'Core Discipline / Sphere')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {SPHERES.map((sphere) => (
                      <option key={sphere} value={sphere}>
                        {translateCategory(sphere)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Proposed Activity Format */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('topics.formatInputLabel', 'Proposed Activity Format')}
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {ACTIVITY_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {translateCategory(fmt)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Status & Regional Perspective Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Initial Status */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('topics.statusInputLabel', 'Topic Status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="approved">{translateStatus('approved')} (Direct to Bank)</option>
                    <option value="proposed">{translateStatus('pending')} (Requires Moderation)</option>
                    <option value="reviewing">{translateStatus('in_review')}</option>
                  </select>
                </div>

                {/* Regional / Policy Perspective */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('topics.perspectiveInputLabel', 'Regional / Policy Perspective (Optional)')}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      'topics.perspectivePlaceholder',
                      'e.g., GCC, Global South, European Union'
                    )}
                    value={formData.regionalPerspective}
                    onChange={(e) =>
                      setFormData({ ...formData, regionalPerspective: e.target.value })
                    }
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Description & Academic Context */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.descriptionInputLabel', 'Academic Rationale & Description')} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t(
                    'topics.descriptionPlaceholder',
                    'Provide contextual framing, core debate lines, and background notes...'
                  )}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('topics.cancelBtn', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createTopicMutation.isPending || createSuccess}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {createTopicMutation.isPending ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('topics.savingBtn', 'Adding Topic...')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('topics.saveBtn', 'Save & Approve Topic')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
