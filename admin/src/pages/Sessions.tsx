import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { DialogueSession, Topic } from '../types';
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
  X,
  Presentation,
  MessageSquare,
  Sparkles,
  Trash2,
  User,
  Shield,
  Layers,
  Image as ImageIcon,
  BookOpen
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
  'International Relations',
  'Global Economics',
  'Philosophy & Human Rights',
  'Environmental Policy',
  'Biomedical Ethics',
  'Education Reform',
  'Media & Information Integrity',
];

export const Sessions: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateCategory, translateStatus, isArabic } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    sessionCategory: 'Topic Presentation' as 'Topic Presentation' | 'Structural Debate' | 'Structured Dialogue' | 'Discussion' | 'Guest Talk' | 'Guest Talks',
    academicSphere: 'Technology & AI Ethics',
    description: '',
    scheduledAt: '',
    durationMinutes: 90,
    meetingUrl: '',
    moderator: '',
    presenters: [{ name: '', country: '', bio: '' }],
    team1Members: [''],
    team2Members: [''],
    keySpeakers: [''],
    guestName: '',
    guestBio: '',
    guestImage: '',
  });

  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['admin-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/admin/sessions'),
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['admin-topics'],
    queryFn: () => apiRequest<Topic[]>('/admin/topics'),
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [showAddTopicModal, setShowAddTopicModal] = useState<boolean>(false);
  const [topicCreateSuccess, setTopicCreateSuccess] = useState<string>('');
  const [topicCreateError, setTopicCreateError] = useState<string>('');

  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    motion: '',
    category: 'Technology & AI Ethics',
    format: 'Topic Presentation',
    description: '',
    regionalPerspective: '',
    status: 'approved',
  });

  const createTopicMutation = useMutation({
    mutationFn: (topicData: typeof newTopicForm) =>
      apiRequest<Topic>('/admin/topics', {
        method: 'POST',
        body: JSON.stringify({
          ...topicData,
          motion: topicData.motion.trim() || undefined,
          regionalPerspective: topicData.regionalPerspective.trim() || undefined,
        }),
      }),
    onSuccess: async (createdTopic: any) => {
      await queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      const tId = createdTopic?.id || createdTopic?._id;
      if (tId) setSelectedTopicId(tId);

      const rawFormat = (createdTopic?.format || newTopicForm.format || '').toLowerCase();
      let matchedFormat: any = 'Topic Presentation';
      if (rawFormat.includes('debate') || rawFormat.includes('structured dialogue')) {
        matchedFormat = 'Structural Debate';
      } else if (rawFormat.includes('guest')) {
        matchedFormat = 'Guest Talk';
      } else if (rawFormat.includes('discussion') || rawFormat.includes('roundtable')) {
        matchedFormat = 'Discussion';
      } else {
        matchedFormat = 'Topic Presentation';
      }

      setFormData((prev) => ({
        ...prev,
        title: createdTopic?.title || newTopicForm.title,
        academicSphere: createdTopic?.category || newTopicForm.category,
        description: createdTopic?.description || newTopicForm.description,
        sessionCategory: matchedFormat,
      }));
      setTopicCreateSuccess(t('sessions.topicAddedSuccess', 'New topic created and selected for this session!'));
      setTimeout(() => {
        setShowAddTopicModal(false);
        setTopicCreateSuccess('');
        setNewTopicForm({
          title: '',
          motion: '',
          category: 'Technology & AI Ethics',
          format: 'Topic Presentation',
          description: '',
          regionalPerspective: '',
          status: 'approved',
        });
      }, 700);
    },
    onError: (err: any) => {
      setTopicCreateError(err?.message || 'Failed to add topic to bank.');
    },
  });

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    if (!topicId || topicId === 'custom') {
      return;
    }
    const found = topics.find((t) => ((t as any).id || (t as any)._id) === topicId);
    if (found) {
      const rawFormat = (found.format || '').toLowerCase();
      let matchedFormat: any = 'Topic Presentation';
      if (rawFormat.includes('debate') || rawFormat.includes('structured dialogue')) {
        matchedFormat = 'Structural Debate';
      } else if (rawFormat.includes('guest')) {
        matchedFormat = 'Guest Talk';
      } else if (rawFormat.includes('discussion') || rawFormat.includes('roundtable')) {
        matchedFormat = 'Discussion';
      } else {
        matchedFormat = 'Topic Presentation';
      }

      setFormData((prev) => ({
        ...prev,
        title: found.title,
        academicSphere: found.category || prev.academicSphere,
        description: found.description || prev.description,
        sessionCategory: matchedFormat,
      }));
    }
  };

  const selectedTopic = topics.find((t) => ((t as any).id || (t as any)._id) === selectedTopicId);

  const resetForm = () => {
    setSelectedTopicId('');
    setTopicCreateSuccess('');
    setTopicCreateError('');
    setFormData({
      title: '',
      sessionCategory: 'Topic Presentation',
      academicSphere: 'Technology & AI Ethics',
      description: '',
      scheduledAt: '',
      durationMinutes: 90,
      meetingUrl: '',
      moderator: '',
      presenters: [{ name: '', country: '', bio: '' }],
      team1Members: [''],
      team2Members: [''],
      keySpeakers: [''],
      guestName: '',
      guestBio: '',
      guestImage: '',
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      const payload: any = {
        title: data.title,
        category: data.academicSphere,
        format: data.sessionCategory,
        description: data.description,
        scheduledAt: data.scheduledAt,
        durationMinutes: Number(data.durationMinutes) || 90,
        meetingUrl: data.meetingUrl,
      };

      if (data.sessionCategory === 'Topic Presentation') {
        payload.moderator = data.moderator.trim();
        payload.presenters = data.presenters
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name.trim(),
            role: 'Presenter',
            country: p.country?.trim() || '',
            bio: p.bio?.trim() || '',
          }));
      } else if (data.sessionCategory === 'Structural Debate' || (data.sessionCategory as any) === 'Structured Dialogue') {
        payload.moderator = data.moderator.trim();
        payload.propositionTeam = data.team1Members.map((m) => m.trim()).filter(Boolean);
        payload.oppositionTeam = data.team2Members.map((m) => m.trim()).filter(Boolean);
        payload.presenters = [
          ...payload.propositionTeam.map((name: string) => ({ name, role: 'Affirmative Team' })),
          ...payload.oppositionTeam.map((name: string) => ({ name, role: 'Alternative Team' })),
        ];
      } else if (data.sessionCategory === 'Discussion') {
        payload.moderator = data.moderator.trim();
        payload.presenters = data.keySpeakers
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name) => ({ name, role: 'Key Speaker' }));
      } else if (data.sessionCategory === 'Guest Talk' || (data.sessionCategory as any) === 'Guest Talks') {
        payload.moderator = data.moderator.trim();
        if (data.guestName.trim()) {
          payload.presenters = [
            {
              name: data.guestName.trim(),
              role: 'Guest Speaker',
              bio: data.guestBio.trim(),
              avatar: data.guestImage.trim(),
            },
          ];
        }
      }

      return apiRequest('/admin/sessions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setShowCreateModal(false);
      resetForm();
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
            {t('sessions.title', 'Academic Sessions & Structured Dialogues')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('sessions.subtitle', 'Schedule and preside over bi-weekly academic dialogues, configure session assignments, and upload recordings.')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setNewTopicForm({
                title: '',
                motion: '',
                category: formData.academicSphere || 'Technology & AI Ethics',
                format: formData.sessionCategory || 'Topic Presentation',
                description: '',
                regionalPerspective: '',
                status: 'approved',
              });
              setTopicCreateError('');
              setTopicCreateSuccess('');
              setShowAddTopicModal(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>+ Add Topic to Bank</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('sessions.scheduleBtn', 'Schedule Session')}</span>
          </button>
        </div>
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
                  {filtered.map((s) => {
                    const sessionCat = s.format || 'Topic Presentation';
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{s.title}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              sessionCat === 'Topic Presentation'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                                : (sessionCat === 'Structured Dialogue' || sessionCat === 'Structural Debate')
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                : sessionCat === 'Discussion'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                            }`}>
                              {sessionCat === 'Topic Presentation' && <Presentation className="w-3 h-3" />}
                              {(sessionCat === 'Structured Dialogue' || sessionCat === 'Structural Debate') && <Users className="w-3 h-3" />}
                              {sessionCat === 'Discussion' && <MessageSquare className="w-3 h-3" />}
                              {(sessionCat === 'Guest Talks' || sessionCat === 'Guest Talk') && <Sparkles className="w-3 h-3" />}
                              <span>{translateCategory(sessionCat)}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              • {translateCategory(s.category)}
                            </span>
                          </div>

                          {/* Dynamic participant summary */}
                          <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                            {sessionCat === 'Topic Presentation' && (
                              <div className="flex flex-wrap items-center gap-2">
                                {s.moderator && <span><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</span>}
                                {s.presenters && s.presenters.length > 0 && (
                                  <span><strong className="text-slate-700 dark:text-slate-300">Presenter(s):</strong> {s.presenters.map((p) => p.name).join(', ')}</span>
                                )}
                              </div>
                            )}

                            {(sessionCat === 'Structured Dialogue' || sessionCat === 'Structural Debate') && (
                              <div className="flex flex-wrap items-center gap-2">
                                {s.moderator && <span><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</span>}
                                {s.propositionTeam && s.propositionTeam.length > 0 && (
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    Team 1 ({s.propositionTeam.length}): {s.propositionTeam.join(', ')}
                                  </span>
                                )}
                                {s.oppositionTeam && s.oppositionTeam.length > 0 && (
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                                    vs Team 2 ({s.oppositionTeam.length}): {s.oppositionTeam.join(', ')}
                                  </span>
                                )}
                              </div>
                            )}

                            {sessionCat === 'Discussion' && (
                              <div className="flex flex-wrap items-center gap-2">
                                {s.moderator && <span><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</span>}
                                {s.presenters && s.presenters.length > 0 && (
                                  <span><strong className="text-slate-700 dark:text-slate-300">Speakers:</strong> {s.presenters.map((p) => p.name).join(', ')}</span>
                                )}
                              </div>
                            )}

                            {(sessionCat === 'Guest Talks' || sessionCat === 'Guest Talk') && (
                              <div className="flex flex-wrap items-center gap-2">
                                {s.moderator && <span><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</span>}
                                {s.presenters && s.presenters[0] && (
                                  <div className="flex items-center gap-1.5">
                                    {s.presenters[0].avatar ? (
                                      <img src={s.presenters[0].avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                    ) : (
                                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                    )}
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">
                                      Guest: {s.presenters[0].name}
                                    </span>
                                    {s.presenters[0].bio && (
                                      <span className="text-slate-400 truncate max-w-xs">({s.presenters[0].bio})</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {filtered.map((s) => {
                const sessionCat = s.format || 'Topic Presentation';
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {s.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            sessionCat === 'Topic Presentation'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                              : (sessionCat === 'Structured Dialogue' || sessionCat === 'Structural Debate')
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : sessionCat === 'Discussion'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                          }`}>
                            <span>{translateCategory(sessionCat)}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {translateCategory(s.category)}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 shrink-0">
                        {translateStatus(s.status)}
                      </span>
                    </div>

                    {/* Participant summary for mobile card */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      {sessionCat === 'Topic Presentation' && (
                        <div className="space-y-0.5">
                          {s.moderator && <div><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</div>}
                          {s.presenters && s.presenters.length > 0 && (
                            <div><strong className="text-slate-700 dark:text-slate-300">Presenters:</strong> {s.presenters.map((p) => p.name).join(', ')}</div>
                          )}
                        </div>
                      )}
                      {(sessionCat === 'Structured Dialogue' || sessionCat === 'Structural Debate') && (
                        <div className="space-y-1">
                          {s.propositionTeam && s.propositionTeam.length > 0 && (
                            <div className="text-indigo-600 dark:text-indigo-400 font-medium">Team 1: {s.propositionTeam.join(', ')}</div>
                          )}
                          {s.oppositionTeam && s.oppositionTeam.length > 0 && (
                            <div className="text-amber-600 dark:text-amber-400 font-medium">Team 2: {s.oppositionTeam.join(', ')}</div>
                          )}
                        </div>
                      )}
                      {sessionCat === 'Discussion' && (
                        <div className="space-y-0.5">
                          {s.moderator && <div><strong className="text-slate-700 dark:text-slate-300">Mod:</strong> {s.moderator}</div>}
                          {s.presenters && s.presenters.length > 0 && (
                            <div><strong className="text-slate-700 dark:text-slate-300">Speakers:</strong> {s.presenters.map((p) => p.name).join(', ')}</div>
                          )}
                        </div>
                      )}
                      {(sessionCat === 'Guest Talks' || sessionCat === 'Guest Talk') && s.presenters && s.presenters[0] && (
                        <div className="flex items-center gap-2">
                          {s.presenters[0].avatar && (
                            <img src={s.presenters[0].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span className="font-bold text-purple-700 dark:text-purple-300">
                            Guest: {s.presenters[0].name}
                          </span>
                        </div>
                      )}
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
                        <span>{t('sessions.joinChamber', 'Join Dialogue Chamber')}</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create Modal with Category Specific Dynamic Fields */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('sessions.modalTitle', 'Schedule Session')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isArabic
                    ? 'حدد شكل النشاط الحواري المقترح لتهيئة المشاركين، مديري الجلسات، وأدوار المتحدثين.'
                    : 'Select the proposed activity format to configure specific participants, moderators, and team rosters.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (formData.sessionCategory === 'Discussion' && !formData.moderator.trim()) {
                  alert('Session Moderator is required for Discussion format.');
                  return;
                }
                if (
                  (formData.sessionCategory === 'Guest Talk' || (formData.sessionCategory as any) === 'Guest Talks') &&
                  (!formData.guestName.trim() || !formData.guestBio.trim())
                ) {
                  alert('Guest Name and Biography are required for Guest Talk.');
                  return;
                }
                if (
                  formData.sessionCategory === 'Topic Presentation' &&
                  (!formData.presenters[0] || !formData.presenters[0].name.trim())
                ) {
                  alert('At least one presenter name is required for Topic Presentation.');
                  return;
                }
                createMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              {/* 1. SELECT TOPIC FROM TOPIC BANK (PROMINENT AT TOP) */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 dark:from-indigo-950/40 dark:to-indigo-900/20 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{t('sessions.chooseTopic', 'Select Topic from Topic Bank')}</span>
                    <span className="text-[10px] font-normal text-indigo-600 dark:text-indigo-400">
                      ({topics.length} {t('sessions.availableTopics', 'available in bank')})
                    </span>
                  </label>

                  {/* Admin access to add new topic to topic bank */}
                  <button
                    type="button"
                    onClick={() => {
                      setNewTopicForm({
                        title: '',
                        motion: '',
                        category: formData.academicSphere || 'Technology & AI Ethics',
                        format: formData.sessionCategory || 'Topic Presentation',
                        description: '',
                        regionalPerspective: '',
                        status: 'approved',
                      });
                      setTopicCreateError('');
                      setTopicCreateSuccess('');
                      setShowAddTopicModal(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('sessions.addNewTopicBtn', '+ Add New Topic to Bank')}</span>
                  </button>
                </div>

                <select
                  value={selectedTopicId}
                  onChange={(e) => handleTopicSelect(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
                >
                  <option value="">{t('sessions.chooseTopicPlaceholder', '-- Select an Approved Topic from Topic Bank --')}</option>
                  <option value="custom">{t('sessions.customTopicOption', '✎ Custom Topic / Type Title Manually')}</option>
                  {topics.map((tItem) => {
                    const tId = (tItem as any).id || (tItem as any)._id;
                    return (
                      <option key={tId} value={tId}>
                        {tItem.title} — [{translateCategory(tItem.category)}]
                      </option>
                    );
                  })}
                </select>

                {selectedTopic && (
                  <div className="text-[11px] text-indigo-900 dark:text-indigo-200 bg-white/90 dark:bg-slate-900/80 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-1">
                    {selectedTopic.motion && (
                      <div className="italic font-medium text-slate-700 dark:text-slate-300">
                        "{selectedTopic.motion}"
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{translateCategory(selectedTopic.category)}</span>
                      {selectedTopic.format && <span>• {translateCategory(selectedTopic.format)}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. FORMAT DROPDOWN */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {t('sessions.activityFormat', 'Activity Format')} *
                </label>
                <select
                  value={formData.sessionCategory === 'Structured Dialogue' ? 'Structural Debate' : (formData.sessionCategory === 'Guest Talks' ? 'Guest Talk' : formData.sessionCategory)}
                  onChange={(e) => setFormData({ ...formData, sessionCategory: e.target.value as any })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium mb-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                >
                  <option value="Topic Presentation">
                    {isArabic
                      ? 'عرض موضوع (اسم مدير الجلسة - اختياري، اسم مقدم العرض)'
                      : 'Topic Presentation (moderator name - optional, presenter name)'}
                  </option>
                  <option value="Structural Debate">
                    {isArabic
                      ? 'مناظرة هيكلية (مدير الجلسة - اختياري، فريقان وأسماء أعضائهما)'
                      : 'Structural Debate (moderator - optional, two teams and their members names)'}
                  </option>
                  <option value="Discussion">
                    {isArabic
                      ? 'جلسة نقاشية (مدير الجلسة - إلزامي، المتحدثون الرئيسيون - اختياري)'
                      : 'Discussion (moderator - required, key speakers - optional)'}
                  </option>
                  <option value="Guest Talk">
                    {isArabic
                      ? 'حوار الضيف (مدير الجلسة - اختياري، اسم الضيف، النبذة، الصورة)'
                      : 'Guest Talk (moderator - optional, guest name, bio, picture)'}
                  </option>
                </select>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Topic Presentation */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionCategory: 'Topic Presentation' })}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                      formData.sessionCategory === 'Topic Presentation'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Presentation className="w-4 h-4 mb-1" />
                      {formData.sessionCategory === 'Topic Presentation' && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div className="font-bold text-xs leading-tight">Topic Presentation</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Moderator (opt) & Presenter(s)</div>
                  </button>

                  {/* Structural Debate */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionCategory: 'Structural Debate' })}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                      formData.sessionCategory === 'Structural Debate' || (formData.sessionCategory as any) === 'Structured Dialogue'
                        ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Users className="w-4 h-4 mb-1" />
                      {(formData.sessionCategory === 'Structural Debate' || (formData.sessionCategory as any) === 'Structured Dialogue') && (
                        <div className="w-2 h-2 rounded-full bg-amber-600" />
                      )}
                    </div>
                    <div className="font-bold text-xs leading-tight">Structural Debate</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Moderator (opt) & 2 Teams</div>
                  </button>

                  {/* Discussion */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionCategory: 'Discussion' })}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                      formData.sessionCategory === 'Discussion'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <MessageSquare className="w-4 h-4 mb-1" />
                      {formData.sessionCategory === 'Discussion' && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <div className="font-bold text-xs leading-tight">Discussion</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Moderator (Req) & Speakers</div>
                  </button>

                  {/* Guest Talk */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionCategory: 'Guest Talk' })}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                      formData.sessionCategory === 'Guest Talk' || (formData.sessionCategory as any) === 'Guest Talks'
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sparkles className="w-4 h-4 mb-1" />
                      {(formData.sessionCategory === 'Guest Talk' || (formData.sessionCategory as any) === 'Guest Talks') && (
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <div className="font-bold text-xs leading-tight">Guest Talk</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Guest, Bio, Picture & Mod</div>
                  </button>
                </div>
              </div>

              {/* 3. TITLE / MOTION */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.motionLabel', 'Session Motion / Title')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Sovereignty & Civil Liberties in the Global South"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* 4. DYNAMIC PARTICIPANTS SECTION BASED ON FORMAT */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                {/* 1. TOPIC PRESENTATION */}
                {formData.sessionCategory === 'Topic Presentation' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <Presentation className="w-4 h-4" />
                      <span>Topic Presentation Configuration (Moderator name - optional, Presenter name)</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {t('sessions.moderator', 'Session Moderator')} <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder={t('sessions.moderatorPlaceholder', 'e.g. Dr. Tariq Al-Mansoor (Optional)')}
                        value={formData.moderator}
                        onChange={(e) => setFormData({ ...formData, moderator: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {t('sessions.presentersLabel', 'Presenter(s) (1 or more)')} *
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              presenters: [...formData.presenters, { name: '', country: '', bio: '' }],
                            })
                          }
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('sessions.addPresenter', '+ Add Presenter')}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.presenters.map((pres, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              required={idx === 0}
                              placeholder={`Presenter ${idx + 1} Name *`}
                              value={pres.name}
                              onChange={(e) => {
                                const newP = [...formData.presenters];
                                newP[idx].name = e.target.value;
                                setFormData({ ...formData, presenters: newP });
                              }}
                              className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                            <input
                              type="text"
                              placeholder="Country (optional)"
                              value={pres.country}
                              onChange={(e) => {
                                const newP = [...formData.presenters];
                                newP[idx].country = e.target.value;
                                setFormData({ ...formData, presenters: newP });
                              }}
                              className="w-28 sm:w-36 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                            {formData.presenters.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newP = formData.presenters.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, presenters: newP });
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Remove Presenter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. STRUCTURAL DEBATE */}
                {(formData.sessionCategory === 'Structural Debate' || (formData.sessionCategory as any) === 'Structured Dialogue') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <Users className="w-4 h-4" />
                      <span>Structural Debate Configuration (Moderator - optional, Two teams and their members names)</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Chamber President / Moderator <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Session Speaker / Adjudicator Name (Optional)"
                        value={formData.moderator}
                        onChange={(e) => setFormData({ ...formData, moderator: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Team 1 / Affirmative */}
                      <div className="p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-indigo-700 dark:text-indigo-400">
                            Team 1 (Affirmative / Proposition)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, team1Members: [...formData.team1Members, ''] })
                            }
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            + Add Member
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {formData.team1Members.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                placeholder={`Member ${idx + 1} Name`}
                                value={member}
                                onChange={(e) => {
                                  const updated = [...formData.team1Members];
                                  updated[idx] = e.target.value;
                                  setFormData({ ...formData, team1Members: updated });
                                }}
                                className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                              />
                              {formData.team1Members.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      team1Members: formData.team1Members.filter((_, i) => i !== idx),
                                    });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team 2 / Alternative */}
                      <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-700 dark:text-amber-400">
                            Team 2 (Alternative / Opposition)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, team2Members: [...formData.team2Members, ''] })
                            }
                            className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            + Add Member
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {formData.team2Members.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                placeholder={`Member ${idx + 1} Name`}
                                value={member}
                                onChange={(e) => {
                                  const updated = [...formData.team2Members];
                                  updated[idx] = e.target.value;
                                  setFormData({ ...formData, team2Members: updated });
                                }}
                                className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                              />
                              {formData.team2Members.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      team2Members: formData.team2Members.filter((_, i) => i !== idx),
                                    });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DISCUSSION */}
                {formData.sessionCategory === 'Discussion' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>Discussion Configuration (Moderator - required, Key speakers - optional)</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {t('sessions.moderator', 'Session Moderator')} *
                        </label>
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                          * Required
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova (Discussion Chair) - Required"
                        value={formData.moderator}
                        onChange={(e) => setFormData({ ...formData, moderator: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {t('sessions.speakersLabel', 'Key Speakers (1 or more)')} <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, keySpeakers: [...formData.keySpeakers, ''] })
                          }
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('sessions.addSpeaker', '+ Add Key Speaker')}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.keySpeakers.map((speaker, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Key Speaker ${idx + 1} Name (Optional)`}
                              value={speaker}
                              onChange={(e) => {
                                const updated = [...formData.keySpeakers];
                                updated[idx] = e.target.value;
                                setFormData({ ...formData, keySpeakers: updated });
                              }}
                              className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                            {formData.keySpeakers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    keySpeakers: formData.keySpeakers.filter((_, i) => i !== idx),
                                  });
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Remove Key Speaker"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. GUEST TALK */}
                {(formData.sessionCategory === 'Guest Talk' || (formData.sessionCategory as any) === 'Guest Talks') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Guest Talk Configuration (Moderator - optional, Guest name, Bio, Picture)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          {t('sessions.guestName', 'Guest Name')} *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Prof. Michael Sandel"
                          value={formData.guestName}
                          onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Host / Moderator <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mubashir CP (Optional)"
                          value={formData.moderator}
                          onChange={(e) => setFormData({ ...formData, moderator: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {t('sessions.guestBio', 'Guest Biography & Credentials')} *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Professor of Government at Harvard University, author of 'Justice'..."
                        value={formData.guestBio}
                        onChange={(e) => setFormData({ ...formData, guestBio: e.target.value })}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {t('sessions.guestImage', 'Guest Picture / Photo')} <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </label>
                      {/* Tab: URL or File Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Paste image URL: https://..."
                            value={formData.guestImage && !formData.guestImage.startsWith('data:') ? formData.guestImage : ''}
                            onChange={(e) => setFormData({ ...formData, guestImage: e.target.value })}
                            className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex-1 justify-center font-semibold">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Upload from device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFormData({ ...formData, guestImage: ev.target?.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {formData.guestImage && (
                            <img
                              src={formData.guestImage}
                              alt="Guest Preview"
                              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Discipline */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.academicSphere', 'Academic Discipline / Sphere')}
                </label>
                <select
                  value={formData.academicSphere}
                  onChange={(e) => setFormData({ ...formData, academicSphere: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {SPHERES.map((sphere) => (
                    <option key={sphere} value={sphere}>
                      {translateCategory(sphere)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('sessions.dateLabel', 'Scheduled Date & Time (UTC)')} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('sessions.meetingUrlLabel', 'Virtual Meeting URL (Zoom / Google Meet)')} *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/... or Zoom"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('sessions.descLabel', 'Motion Description & Rules of Engagement')}
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of proposition, core dilemmas, or guest talk overview..."
                  className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  {t('sessions.cancelBtn', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  {createMutation.isPending ? 'Scheduling...' : t('sessions.createBtn', 'Publish Session')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Topic to Bank Sub-Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-5 space-y-3.5 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {t('topics.addModalTitle', 'Add New Topic to Bank')}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isArabic
                      ? 'أضف موضوعاً جديداً إلى بنك المواضيع وسيتم اختياره فوراً لهذه الجلسة.'
                      : 'Add topic to Topic Bank and auto-select it for this session.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTopicModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {topicCreateSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{topicCreateSuccess}</span>
              </div>
            )}
            {topicCreateError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-medium">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{topicCreateError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTopicCreateError('');
                if (!newTopicForm.title.trim() || !newTopicForm.description.trim()) {
                  setTopicCreateError('Title and description are required.');
                  return;
                }
                createTopicMutation.mutate(newTopicForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.titleInputLabel', 'Topic Title')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geopolitics of Critical Mineral Supply Chains"
                  value={newTopicForm.title}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.motionInputLabel', 'Suggested Dialogue Motion / Focus')}
                </label>
                <input
                  type="text"
                  placeholder="Key proposition or dialogue question..."
                  value={newTopicForm.motion}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, motion: e.target.value })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('topics.categoryInputLabel', 'Core Discipline / Sphere')} *
                  </label>
                  <select
                    value={newTopicForm.category}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, category: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                    {t('topics.formatInputLabel', 'Proposed Activity Format')}
                  </label>
                  <select
                    value={newTopicForm.format}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, format: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Topic Presentation">{translateCategory('Topic Presentation')}</option>
                    <option value="Structural Debate">{translateCategory('Structural Debate')}</option>
                    <option value="Discussion">{translateCategory('Discussion')}</option>
                    <option value="Guest Talk">{translateCategory('Guest Talk')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('topics.descriptionInputLabel', 'Academic Rationale & Description')} *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Context, core dilemma, background information..."
                  value={newTopicForm.description}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, description: e.target.value })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t('topics.cancelBtn', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createTopicMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {createTopicMutation.isPending ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('topics.savingBtn', 'Adding Topic...')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Add & Select for Session</span>
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
