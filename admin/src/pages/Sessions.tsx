import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { DialogueSession } from '../types';
import {
  Calendar,
  Plus,
  Search,
  Video,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  X
} from 'lucide-react';

export const Sessions: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology & AI Ethics',
    description: '',
    scheduledAt: '',
    durationMinutes: 90,
    meetingUrl: '',
  });

  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['admin-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/admin/sessions'),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest('/admin/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'Technology & AI Ethics',
        description: '',
        scheduledAt: '',
        durationMinutes: 90,
        meetingUrl: '',
      });
    },
  });

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const scheduledCount = sessions.filter((s) => s.status === 'scheduled').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const liveCount = sessions.filter((s) => s.status === 'live').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('sessions.title', 'Parliamentary Sessions & Debates')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('sessions.subtitle', 'Schedule and preside over bi-weekly parliamentary debates, configure motion assignments, and upload recordings.')}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('sessions.scheduleBtn', 'Schedule Debate Chamber')}</span>
        </button>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Chambers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {sessions.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('sessions.title', 'Chambers')}
            </div>
          </div>
        </div>

        {/* Scheduled */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {scheduledCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('scheduled')}
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {completedCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateStatus('completed')}
            </div>
          </div>
        </div>

        {/* In Session / Active */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {liveCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('common.active', 'Active Live')}
            </div>
          </div>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('sessions.searchPlaceholder', 'Search sessions by title or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading scheduled sessions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('sessions.noSessions', 'No parliamentary sessions found.')}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('sessions.motionLabel', 'Title & Discipline')}</th>
                    <th className="py-3 px-4">{t('sessions.dateLabel', 'Scheduled Date')}</th>
                    <th className="py-3 px-4">{t('apps.colStatus', 'Status')}</th>
                    <th className="py-3 px-4">{t('sessions.meetingUrlLabel', 'Meeting Room')}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{t('apps.colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.title}</div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {translateCategory(s.category)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{new Date(s.scheduledAt).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-500">{new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({s.durationMinutes}m)</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                          {translateStatus(s.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {s.meetingUrl ? (
                          <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                            <Video className="w-3.5 h-3.5" />
                            <span>{t('sessions.joinChamber', 'Join Chamber')}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right rtl:text-left">
                        <button className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                          {t('apps.colActions', 'Edit')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {s.title}
                      </h4>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {translateCategory(s.category)}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 shrink-0">
                      {translateStatus(s.status)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{new Date(s.scheduledAt).toLocaleDateString()} at {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{s.durationMinutes}m</span>
                  </div>

                  {s.meetingUrl && (
                    <a
                      href={s.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{t('sessions.joinChamber', 'Join Debate Chamber')}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('sessions.modalTitle', 'Schedule Parliamentary Debate Session')}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.motionLabel', 'Session Motion / Title')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Sovereignty & Civil Liberties"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.categoryLabel', 'Academic Discipline Category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Technology & AI Ethics">{translateCategory('Technology & AI Ethics')}</option>
                  <option value="International Relations">{translateCategory('International Relations')}</option>
                  <option value="Global Economics">{translateCategory('Global Economics')}</option>
                  <option value="Philosophy & Human Rights">{translateCategory('Philosophy & Human Rights')}</option>
                  <option value="Environmental Policy">{translateCategory('Environmental Policy')}</option>
                  <option value="Biomedical Ethics">{translateCategory('Biomedical Ethics')}</option>
                  <option value="Education Reform">{translateCategory('Education Reform')}</option>
                  <option value="Media & Information Integrity">{translateCategory('Media & Information Integrity')}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.dateLabel', 'Scheduled Date & Time (UTC)')}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.meetingUrlLabel', 'Virtual Meeting URL (Zoom / Google Meet)')}
                </label>
                <input
                  type="url"
                  required
                  value={formData.meetingUrl}
                  onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.descLabel', 'Motion Description & Rules of Engagement')}
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of proposition and opposition arguments..."
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  {t('sessions.cancelBtn', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
                >
                  {createMutation.isPending ? 'Scheduling...' : t('sessions.createBtn', 'Publish Session Chamber')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
