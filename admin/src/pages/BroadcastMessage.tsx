import React, { useState, useEffect, useMemo, useRef } from 'react';
import { apiRequest } from '../utils/api';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import {
  Megaphone,
  Send,
  Users,
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Radio,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Search,
  CheckSquare,
  Square,
  X,
  User as UserIcon,
} from 'lucide-react';

interface BroadcastRecord {
  id: string;
  subject: string;
  message: string;
  targetAudience: 'ALL' | 'MEMBERS' | 'PRESENTERS' | 'CO_ADMINS' | 'SPECIFIC_USERS';
  targetUserIds?: string[];
  deliveryStats: {
    totalRecipients: number;
    emailsSent: number;
    pushSent: number;
    inAppCreated: number;
  };
  createdAt: string;
}

interface AudienceCounts {
  ALL: number;
  MEMBERS: number;
  PRESENTERS: number;
  CO_ADMINS: number;
}

interface BroadcastUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  country?: string;
  flag?: string;
}

export const BroadcastMessage: React.FC = () => {
  const { user } = useAdminAuth();
  const { t, isArabic, dir, translateRole } = useAdminLanguage();

  // Form State
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'MEMBERS' | 'PRESENTERS' | 'CO_ADMINS' | 'SPECIFIC_USERS'>('ALL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Specific Users Picker State
  const [userList, setUserList] = useState<BroadcastUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [lastDispatched, setLastDispatched] = useState<{
    subject: string;
    totalRecipients: number;
  } | null>(null);

  // Audience counts & History
  const [audienceCounts, setAudienceCounts] = useState<AudienceCounts>({
    ALL: 0,
    MEMBERS: 0,
    PRESENTERS: 0,
    CO_ADMINS: 0,
  });
  const [history, setHistory] = useState<BroadcastRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch counts & history
  const loadData = async () => {
    try {
      const [countsRes, historyRes] = await Promise.all([
        apiRequest<any>('/admin/broadcast/audience-counts'),
        apiRequest<any>('/admin/broadcast/history'),
      ]);

      const counts = countsRes?.data !== undefined ? countsRes.data : countsRes;
      if (counts && typeof counts === 'object' && 'ALL' in counts) {
        setAudienceCounts(counts);
      }

      const hist = Array.isArray(historyRes)
        ? historyRes
        : Array.isArray(historyRes?.data)
        ? historyRes.data
        : [];
      setHistory(hist);
    } catch {} finally {
      setIsLoadingHistory(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await apiRequest<any>('/admin/broadcast/users');
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setUserList(list);
    } catch (err) {
      console.error('Failed to load broadcast users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (targetAudience === 'SPECIFIC_USERS') {
      setIsDropdownOpen(true);
      if (userList.length === 0) {
        loadUsers();
      }
    } else {
      setIsDropdownOpen(false);
    }
  }, [targetAudience]);

  // Debounced backend user search when typing
  useEffect(() => {
    if (targetAudience !== 'SPECIFIC_USERS') return;
    if (!userSearchQuery.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await apiRequest<any>(
          `/admin/broadcast/users?search=${encodeURIComponent(userSearchQuery.trim())}`
        );
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (list.length > 0) {
          setUserList((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const newUsers = list.filter((u: any) => !existingIds.has(u.id));
            return [...prev, ...newUsers];
          });
        }
      } catch (err) {
        console.error('Debounced user search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [userSearchQuery, targetAudience]);

  // Filtered users for specific user selection
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return userList;
    const q = userSearchQuery.toLowerCase();
    return userList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.country && u.country.toLowerCase().includes(q)) ||
        u.role.toLowerCase().includes(q)
    );
  }, [userList, userSearchQuery]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllFiltered = () => {
    const idsToAdd = filteredUsers.map((u) => u.id);
    setSelectedUserIds((prev) => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!subject.trim()) {
      setErrorMsg(t('broadcast.errSubject', 'Please enter a broadcast subject.'));
      return;
    }
    if (!message.trim()) {
      setErrorMsg(t('broadcast.errMessage', 'Please enter the message body.'));
      return;
    }
    if (targetAudience === 'SPECIFIC_USERS' && selectedUserIds.length === 0) {
      setErrorMsg(t('broadcast.errSelectUser', 'Please select at least one recipient user.'));
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmSend = async () => {
    setConfirmModalOpen(false);
    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<any>('/admin/broadcast/send', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          targetAudience,
          targetUserIds: targetAudience === 'SPECIFIC_USERS' ? selectedUserIds : undefined,
        }),
      });

      const payload = res?.data !== undefined ? res.data : res;
      if (payload) {
        setLastDispatched({
          subject: payload.subject || subject.trim(),
          totalRecipients: payload.totalRecipients || (targetAudience === 'SPECIFIC_USERS' ? selectedUserIds.length : 0),
        });
        setSubject('');
        setMessage('');
        setSelectedUserIds([]);
        loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const audiencePills = [
    {
      id: 'ALL' as const,
      label: t('broadcast.audAll', 'All Accounts'),
      count: audienceCounts.ALL,
      desc: t('broadcast.audAllDesc', 'Every registered active account'),
    },
    {
      id: 'MEMBERS' as const,
      label: t('broadcast.audMembers', 'Members'),
      count: audienceCounts.MEMBERS,
      desc: t('broadcast.audMembersDesc', 'Accredited debaters and delegates'),
    },
    {
      id: 'PRESENTERS' as const,
      label: t('broadcast.audPresenters', 'Presenters'),
      count: audienceCounts.PRESENTERS,
      desc: t('broadcast.audPresentersDesc', 'Approved keynote youth presenters'),
    },
    {
      id: 'CO_ADMINS' as const,
      label: t('broadcast.audCoAdmins', 'Co-Admins'),
      count: audienceCounts.CO_ADMINS,
      desc: t('broadcast.audCoAdminsDesc', 'Chapter coordinators and administrators'),
    },
    {
      id: 'SPECIFIC_USERS' as const,
      label: t('broadcast.audSpecificUsers', 'Specific Users'),
      count: selectedUserIds.length,
      desc: t('broadcast.audSpecificUsersDesc', 'Message 1 or more specified delegates'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8" dir={dir}>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-[#3B43A1] to-[#4851BA] text-white shadow-sm shadow-[#4851BA]/20">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('broadcast.title', 'Official Broadcast Dispatcher')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t(
              'broadcast.subtitle',
              'One-click simultaneous institutional dispatch across In-App Notice Boards, Web Push Panels, and Personalized Emails.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#4851BA]/10 dark:bg-[#4851BA]/20 border border-[#4851BA]/30 text-[#4851BA] dark:text-indigo-300 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('broadcast.authority', 'Super Admin Authority')}</span>
        </div>
      </div>

      {/* Delivery Summary Banner upon successful send */}
      {lastDispatched && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-slate-900 dark:text-slate-100 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4851BA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('broadcast.successTitle', 'Broadcast Successfully Dispatched!')}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                "{lastDispatched.subject}" {t('broadcast.queuedFor', 'has been queued for triple-channel delivery to')}{' '}
                <span className="font-bold text-[#4851BA] dark:text-indigo-300 underline">
                  {lastDispatched.totalRecipients} {t('broadcast.targetedDelegates', 'targeted delegates')}
                </span>.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-semibold text-[#4851BA] dark:text-indigo-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('broadcast.stepInApp', '1. In-App Notice Created')}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('broadcast.stepEmail', '2. Individual Emails Queued')}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('broadcast.stepPush', '3. Web Push Triggered')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastDispatched(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold cursor-pointer">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* ======================================================== */}
        {/* COMPOSER FORM (7 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleOpenConfirm} className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#4851BA] dark:text-indigo-400" />
              {t('broadcast.compose', 'Compose Communiqué')}
            </h2>

            {/* Target Audience Selector (Clean Responsive Wrap) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                {t('broadcast.selectAudience', 'Select Target Audience')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
                {audiencePills.map((pill) => {
                  const isSelected = targetAudience === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setTargetAudience(pill.id)}
                      className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4851BA] bg-[#4851BA]/10 dark:bg-[#4851BA]/20 text-slate-900 dark:text-white ring-2 ring-[#4851BA]/30 font-bold'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="truncate">{pill.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#4851BA] text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {pill.count}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight line-clamp-2">
                        {pill.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Users Multi-Select Selector (Visible only when SPECIFIC_USERS is chosen) */}
            {targetAudience === 'SPECIFIC_USERS' && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4851BA] dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t('broadcast.selectedRecipients', 'Selected Recipients')}:{' '}
                      <span className="text-[#4851BA] dark:text-indigo-300 font-extrabold">
                        {selectedUserIds.length} {t('broadcast.usersSelected', 'users selected')}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#4851BA] dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {t('broadcast.selectAll', 'Select All')}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      {t('broadcast.clearSelection', 'Clear Selection')}
                    </button>
                  </div>
                </div>

                {/* Selected User Chips */}
                {selectedUserIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    {selectedUserIds.map((uid) => {
                      const matchedUser = userList.find((u) => u.id === uid);
                      if (!matchedUser) return null;
                      return (
                        <span
                          key={uid}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#4851BA]/10 dark:bg-[#4851BA]/20 border border-[#4851BA]/30 text-[#4851BA] dark:text-indigo-300 text-[11px] font-medium"
                        >
                          <span className="max-w-[120px] truncate">{matchedUser.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleUserSelection(uid)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Search Bar with Automatic Floating Dropdown for Users */}
                <div ref={dropdownRef} className="relative">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute top-3 start-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="admin_broadcast_recipient_filter"
                      id="admin_broadcast_recipient_filter"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-autocomplete="none"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      role="combobox"
                      aria-expanded={isDropdownOpen}
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setIsDropdownOpen(true);
                        if (userList.length === 0) {
                          loadUsers();
                        }
                      }}
                      placeholder={t(
                        'broadcast.searchUsersPlaceholder',
                        'Type letters to search delegates by name, email, country, or role...'
                      )}
                      className="w-full ps-9 pe-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
                    />
                    {userSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserSearchQuery('');
                          setIsDropdownOpen(true);
                        }}
                        className="absolute top-2.5 end-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Floating Autocomplete Dropdown List */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-2xl divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
                          <span>
                            {filteredUsers.length} {t('broadcast.matchingDelegates', 'matching delegates')}
                          </span>
                        </span>
                        {filteredUsers.length > 0 && (
                          <button
                            type="button"
                            onClick={handleSelectAllFiltered}
                            className="text-[#4851BA] dark:text-indigo-300 hover:underline cursor-pointer"
                          >
                            {t('broadcast.selectAll', 'Select All')}
                          </button>
                        )}
                      </div>

                      {isLoadingUsers && userList.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          {t('common.loading', 'Loading delegates...')}
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="p-5 text-center text-xs text-slate-400">
                          {t('broadcast.noUsersFound', 'No users found matching query.')}
                        </div>
                      ) : (
                        filteredUsers.map((u) => {
                          const isChecked = selectedUserIds.includes(u.id);
                          return (
                            <div
                              key={u.id}
                              onClick={() => toggleUserSelection(u.id)}
                              className={`p-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[#4851BA] dark:text-indigo-400 shrink-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </span>
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-300 shrink-0 overflow-hidden">
                                  {u.avatar ? (
                                    <img src={u.avatar} alt={u.name} className="w-7 h-7 object-cover" />
                                  ) : (
                                    u.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold truncate text-slate-900 dark:text-white">
                                    {u.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {u.country && (
                                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                                    {u.country}
                                  </span>
                                )}
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                                  {translateRole(u.role)}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('broadcast.subject', 'Broadcast Subject')}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t(
                  'broadcast.subjectPlaceholder',
                  'e.g. Urgent Plenary Convocations & ISDC7 Debate Calendar'
                )}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
              />
            </div>

            {/* Message Body Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('broadcast.messageBody', 'Message Body')}
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t(
                  'broadcast.messagePlaceholder',
                  "Type the full announcement content here. In emails, this will be automatically personalized with 'Hi {FirstName},' for every individual recipient..."
                )}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
              />
            </div>

            {/* Triple Channel Checkmarks */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                {t('broadcast.channelsTitle', 'Simultaneous Delivery Channels')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
                  <span>{t('broadcast.channelInApp', 'In-App Notice Board')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
                  <span>{t('broadcast.channelEmail', 'Personalized Email')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
                  <span>{t('broadcast.channelPush', 'Web Push Panel')}</span>
                </div>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSending || !subject.trim() || !message.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#3B43A1] via-[#4851BA] to-[#9E59AC] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? t('broadcast.dispatching', 'Dispatching...') : t('broadcast.dispatchBtn', 'Dispatch Broadcast')}</span>
            </button>
          </form>
        </div>

        {/* ======================================================== */}
        {/* LOG & LIVE EMAIL PREVIEW (5 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Personalization Preview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
              {t('broadcast.previewTitle', 'Live Email Personalization Preview')}
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950 text-xs space-y-2">
              <div className="pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('broadcast.toDelegate', 'To: individual delegate (e.g. amal@thegyde.org)')}
                </span>
              </div>
              <div className="font-bold text-[#4851BA] dark:text-indigo-300">
                {isArabic ? 'مرحباً أمل،' : 'Hi Amal,'}
              </div>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {message.trim() ||
                  t(
                    'broadcast.previewFallback',
                    'Your broadcast body will render here with confidential individual greeting, personalized for each delegate automatically...'
                  )}
              </p>
            </div>
          </div>

          {/* Past Broadcast History */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4851BA] dark:text-indigo-400" />
              {t('broadcast.logTitle', 'Broadcast Dispatch Log')}
            </h3>

            {isLoadingHistory ? (
              <div className="p-6 text-center text-xs text-slate-400">
                {t('common.loading', 'Loading...')}
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">
                {t('broadcast.noHistory', 'No past broadcasts sent yet.')}
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {item.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(item.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-[#4851BA] dark:text-indigo-300">
                        {item.targetAudience === 'SPECIFIC_USERS'
                          ? t('broadcast.audSpecificUsers', 'Specific Users')
                          : item.targetAudience}
                      </span>
                      <span>
                        {item.deliveryStats?.totalRecipients || 0} {t('broadcast.recipients', 'Recipients')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4851BA]/10 text-[#4851BA] dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('broadcast.confirmTitle', 'Confirm Broadcast Dispatch')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('broadcast.confirmSubtitle', 'This will initiate simultaneous delivery immediately.')}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('broadcast.targetAudienceLabel', 'Target Audience:')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {targetAudience === 'SPECIFIC_USERS'
                    ? t('broadcast.audSpecificUsers', 'Specific Users')
                    : targetAudience}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('broadcast.estimatedRecipients', 'Estimated Recipients:')}</span>
                <span className="font-bold text-[#4851BA] dark:text-indigo-300">
                  {targetAudience === 'SPECIFIC_USERS'
                    ? `${selectedUserIds.length} ${t('broadcast.recipients', 'Recipients')}`
                    : `${audienceCounts[targetAudience]} Users`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('broadcast.subject', 'Broadcast Subject')}:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {subject}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                'broadcast.confirmNote',
                'Every recipient will receive an in-app notice, a personalized email with their individual greeting, and a web push notification.'
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('broadcast.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#4851BA] hover:bg-[#3B43A1] text-white shadow-sm cursor-pointer"
              >
                {t('broadcast.confirmBtn', 'Confirm & Dispatch')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
