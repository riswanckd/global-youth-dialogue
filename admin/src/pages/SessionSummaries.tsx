import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { DialogueSession } from '../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  Video,
  ExternalLink,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  Presentation,
  Filter,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';

export const SessionSummaries: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus, isArabic } = useAdminLanguage();

  const [filterType, setFilterType] = useState<'all' | 'completed' | 'awaiting'>('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Summary form state
  const [summaryForm, setSummaryForm] = useState({
    summary: '',
    summaryAr: '',
    outcomes: '',
    keyTakeaways: [''],
    recordingUrl: '',
    markCompleted: true,
    publishToPublications: false,
    publicationTitle: '',
  });

  // Fetch all sessions
  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['admin-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/admin/sessions'),
  });

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    if (filterType === 'completed') return s.status === 'completed';
    if (filterType === 'awaiting') return !s.summary || s.summary.trim() === '';
    return true;
  });

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const summarizedCount = sessions.filter((s) => s.summary && s.summary.trim().length > 0).length;
  const awaitingCount = sessions.length - summarizedCount;

  // Selected session object
  const selectedSession = sessions.find(
    (s) => ((s as any).id || (s as any)._id) === selectedSessionId
  );

  // Sync form when selected session changes
  useEffect(() => {
    if (selectedSession) {
      setSummaryForm({
        summary: selectedSession.summary || '',
        summaryAr: selectedSession.summaryAr || '',
        outcomes: selectedSession.outcomes || '',
        keyTakeaways:
          Array.isArray(selectedSession.keyTakeaways) && selectedSession.keyTakeaways.length > 0
            ? selectedSession.keyTakeaways
            : [''],
        recordingUrl: selectedSession.recordingUrl || '',
        markCompleted: selectedSession.status === 'completed' ? true : true,
        publishToPublications: false,
        publicationTitle: `Academic Deliberation Summary: ${selectedSession.title}`,
      });
      setErrorMessage('');
    }
  }, [selectedSessionId, selectedSession]);

  // Mutation to update session summary
  const saveSummaryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSessionId) {
        throw new Error('Please select a session first.');
      }

      const sessionId = selectedSessionId;
      const cleanTakeaways = summaryForm.keyTakeaways
        .map((t) => t.trim())
        .filter(Boolean);

      // 1. Update session summary
      const sessionPayload: Record<string, any> = {
        summary: summaryForm.summary.trim(),
        summaryAr: summaryForm.summaryAr.trim(),
        outcomes: summaryForm.outcomes.trim(),
        keyTakeaways: cleanTakeaways,
        recordingUrl: summaryForm.recordingUrl.trim(),
      };

      if (summaryForm.markCompleted) {
        sessionPayload.status = 'completed';
      }

      await apiRequest(`/admin/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(sessionPayload),
      });

      // 2. Optional: Publish directly to research publications repository
      if (summaryForm.publishToPublications && selectedSession) {
        const authors = (selectedSession.presenters || []).length > 0
          ? selectedSession.presenters.map((p) => ({
              name: p.name,
              country: p.country || 'International Delegation',
              role: p.role || 'Fellow Presenter',
            }))
          : [
              {
                name: selectedSession.moderator || 'GYDE Academic Secretariat',
                country: 'International',
                role: 'Session Moderator & Academic Coordinator',
              },
            ];

        const slugBase = (summaryForm.publicationTitle || selectedSession.title)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80);
        const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

        const publicationPayload = {
          title: summaryForm.publicationTitle.trim() || `Executive Summary: ${selectedSession.title}`,
          slug,
          category: selectedSession.category,
          abstract:
            summaryForm.summary.trim().slice(0, 400) ||
            selectedSession.description.slice(0, 400),
          content: `${summaryForm.summary.trim()}\n\n### Deliberation Outcomes & Academic Synthesis\n${summaryForm.outcomes.trim()}\n\n### Core Insights\n${cleanTakeaways.map((t) => `- ${t}`).join('\n')}`,
          authors,
          status: 'published',
          visibility: 'public',
        };

        await apiRequest('/admin/publications', {
          method: 'POST',
          body: JSON.stringify(publicationPayload),
        }).catch((err) => console.warn('Publication creation notice:', err));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      setSuccessToast(t('summaries.summarySavedToast', 'Session summary saved successfully!'));
      setTimeout(() => setSuccessToast(''), 4500);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to save session summary.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('summaries.title', 'Conducted Session Summaries & Synthesis')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t(
              'summaries.subtitle',
              'Draft, curate, and publish academic summaries and outcome syntheses for completed dialogue sessions.'
            )}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {sessions.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('summaries.allSessions', 'All Sessions')}
            </div>
          </div>
        </div>

        {/* Conducted / Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {completedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('summaries.completedOnly', 'Completed / Conducted')}
            </div>
          </div>
        </div>

        {/* Summaries Documented */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {summarizedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('summaries.summaryDocumented', 'Summary Documented')}
            </div>
          </div>
        </div>

        {/* Awaiting Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {awaitingCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('summaries.awaitingSummary', 'Awaiting Summary')}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Drafting Section: Session Selector Dropdown + Rich Editor */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-6">
        {/* Step 1: Dropdown to Select Session */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {t('summaries.selectSession', 'Select Conducted / Completed Session')} *
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {sessions.length} sessions in system
            </span>
          </label>

          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="">
              {t('summaries.selectPlaceholder', '-- Select a Session to Draft / View Summary --')}
            </option>
            {sessions.map((s) => {
              const id = (s as any).id || (s as any)._id;
              const dateStr = s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '';
              const isCompleted = s.status === 'completed';
              const hasSummary = Boolean(s.summary && s.summary.trim());

              return (
                <option key={id} value={id}>
                  {isCompleted ? '✓ [Completed]' : `[${s.status}]`} {s.title} — {dateStr} (
                  {translateCategory(s.category)}) {hasSummary ? '• [Summary Added]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Selected Session Metadata Banner (if selected) */}
        {selectedSession && (
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {translateCategory(selectedSession.category)} •{' '}
                  {translateCategory(selectedSession.format || 'Structured Dialogue')}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedSession.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedSession.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                  }`}
                >
                  {translateStatus(selectedSession.status)}
                </span>
                {selectedSession.summary && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Summary Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Rosters / Moderator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Date:</strong>{' '}
                {new Date(selectedSession.scheduledAt).toLocaleString()}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Moderator:</strong>{' '}
                {selectedSession.moderator || 'None assigned'}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Presenters / Teams:</strong>{' '}
                {selectedSession.presenters?.length
                  ? selectedSession.presenters.map((p) => p.name).join(', ')
                  : selectedSession.propositionTeam?.length
                  ? `Team 1 (${selectedSession.propositionTeam.length}), Team 2 (${selectedSession.oppositionTeam?.length || 0})`
                  : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Summary Form Fields */}
        {selectedSession ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSummaryMutation.mutate();
            }}
            className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            {/* Executive Summary */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('summaries.summaryLabel', 'Executive Summary & Academic Synthesis')} *
              </label>
              <textarea
                required
                rows={5}
                value={summaryForm.summary}
                onChange={(e) => setSummaryForm({ ...summaryForm, summary: e.target.value })}
                placeholder={t(
                  'summaries.summaryPlaceholder',
                  'Provide contextual framing, core dialogue themes, analytical perspectives, and intellectual synthesis...'
                )}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Arabic Summary (Optional) */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'الملخص التنفيذي باللغة العربية (اختياري)' : 'Executive Summary in Arabic (Optional)'}
              </label>
              <textarea
                dir="rtl"
                rows={3}
                value={summaryForm.summaryAr}
                onChange={(e) => setSummaryForm({ ...summaryForm, summaryAr: e.target.value })}
                placeholder="صياغة الملخص التنفيذي والتحليل الأكاديمي باللغة العربية..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed text-right"
              />
            </div>

            {/* Deliberation Outcomes & Key Conclusions */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('summaries.outcomesLabel', 'Deliberation Outcomes & Key Conclusions')}
              </label>
              <textarea
                rows={3}
                value={summaryForm.outcomes}
                onChange={(e) => setSummaryForm({ ...summaryForm, outcomes: e.target.value })}
                placeholder={t(
                  'summaries.outcomesPlaceholder',
                  'Key consensus points, policy insights, and academic conclusions reached during this session...'
                )}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Key Takeaways Dynamic List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('summaries.keyTakeawaysLabel', 'Key Takeaways (Core Arguments & Ideas)')}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSummaryForm({
                      ...summaryForm,
                      keyTakeaways: [...summaryForm.keyTakeaways, ''],
                    })
                  }
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('summaries.addTakeaway', '+ Add Key Takeaway')}</span>
                </button>
              </div>

              <div className="space-y-2">
                {summaryForm.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Key takeaway point #${idx + 1}...`}
                      value={takeaway}
                      onChange={(e) => {
                        const updated = [...summaryForm.keyTakeaways];
                        updated[idx] = e.target.value;
                        setSummaryForm({ ...summaryForm, keyTakeaways: updated });
                      }}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {summaryForm.keyTakeaways.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSummaryForm({
                            ...summaryForm,
                            keyTakeaways: summaryForm.keyTakeaways.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                        aria-label="Remove takeaway"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Archive Recording URL */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('summaries.recordingUrl', 'Archived Recording URL (Google Drive / YouTube / Zoom)')}
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://youtube.com/..."
                  value={summaryForm.recordingUrl}
                  onChange={(e) => setSummaryForm({ ...summaryForm, recordingUrl: e.target.value })}
                  className="w-full p-2.5 pl-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
                <Video className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Checkbox Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Mark Completed Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={summaryForm.markCompleted}
                  onChange={(e) =>
                    setSummaryForm({ ...summaryForm, markCompleted: e.target.checked })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('summaries.markCompletedLabel', 'Set Status to "Completed / Conducted"')}
                </span>
              </label>

              {/* Publish to Publications Library Checkbox */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={summaryForm.publishToPublications}
                    onChange={(e) =>
                      setSummaryForm({ ...summaryForm, publishToPublications: e.target.checked })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    {t(
                      'summaries.publishToLibrary',
                      'Publish as Accredited Paper in Digital Research Library'
                    )}
                  </span>
                </label>

                {summaryForm.publishToPublications && (
                  <div className="pt-1.5 pl-6">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Paper Publication Title:
                    </label>
                    <input
                      type="text"
                      value={summaryForm.publicationTitle}
                      onChange={(e) =>
                        setSummaryForm({ ...summaryForm, publicationTitle: e.target.value })
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={saveSummaryMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                {saveSummaryMutation.isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('summaries.savingSummary', 'Saving Summary...')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('summaries.saveSummary', 'Save & Publish Summary')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-10 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">
              Please choose a conducted or completed session from the dropdown above to add its summary.
            </p>
          </div>
        )}
      </div>

      {/* Conducted Sessions Inventory / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('summaries.title', 'Session Summaries Inventory')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review documented summaries, deliberation outcomes, and archive recordings across dialogue chambers.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setFilterType('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilterType('awaiting')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'awaiting'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Awaiting Summary ({awaitingCount})
            </button>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {t('summaries.noSessions', 'No sessions found matching current filter.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSessions.map((s) => {
              const id = (s as any).id || (s as any)._id;
              const isSelected = selectedSessionId === id;
              const isCompleted = s.status === 'completed';
              const hasSummary = Boolean(s.summary && s.summary.trim());

              return (
                <div
                  key={id}
                  onClick={() => setSelectedSessionId(id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider line-clamp-1">
                        {translateCategory(s.category)}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {translateStatus(s.status)}
                        </span>
                        {hasSummary ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Summary Added
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Awaiting
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {s.title}
                    </h4>

                    {s.summary ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                        "{s.summary}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
                        No summary added yet. Click to draft summary.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500">
                    <span>{new Date(s.scheduledAt).toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSessionId(id);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{hasSummary ? 'Edit Summary' : 'Add Summary'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
