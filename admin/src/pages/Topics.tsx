import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { Topic } from '../types';
import { Lightbulb, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const Topics: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');

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

  const filtered = topics.filter((tItem) => {
    const q = search.toLowerCase();
    return tItem.title.toLowerCase().includes(q) || tItem.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('topics.title', 'Topic Pipeline & Proposals')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('topics.subtitle', 'Curate member-suggested parliamentary debate motions across the 16 core knowledge disciplines.')}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('topics.searchPlaceholder', 'Search topics by motion or category...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading topic motions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Lightbulb className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('topics.noTopics', 'No topics found.')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">{t('sessions.motionLabel', 'Motion')}</th>
                  <th className="py-3 px-4">{t('sessions.categoryLabel', 'Category')}</th>
                  <th className="py-3 px-4">{t('apps.colApplicant', 'Proposer')}</th>
                  <th className="py-3 px-4">{t('apps.colStatus', 'Status')}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{t('apps.colActions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                {filtered.map((topicItem) => (
                  <tr key={topicItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{topicItem.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{topicItem.description}</div>
                    </td>
                    <td className="py-3 px-4">{translateCategory(topicItem.category)}</td>
                    <td className="py-3 px-4">
                      {topicItem.proposedBy?.name || 'Anonymous Member'} ({topicItem.proposedBy?.country || t('dash.global', 'Global')})
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                        {translateStatus(topicItem.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'approved' })}
                          className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          {t('dash.approve', 'Approve')}
                        </button>
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: topicItem.id, status: 'rejected' })}
                          className="px-2 py-1 text-xs font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                        >
                          {t('topics.rejectMotion', 'Reject')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
