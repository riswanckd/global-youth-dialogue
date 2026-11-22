import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAdminAuth } from '../context/AdminAuthContext';
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
} from 'lucide-react';

interface BroadcastRecord {
  id: string;
  subject: string;
  message: string;
  targetAudience: 'ALL' | 'MEMBERS' | 'PRESENTERS' | 'CO_ADMINS';
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

export const BroadcastMessage: React.FC = () => {
  const { user } = useAdminAuth();

  // Form State
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'MEMBERS' | 'PRESENTERS' | 'CO_ADMINS'>('ALL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        apiRequest<{ data: AudienceCounts }>('/admin/broadcast/audience-counts'),
        apiRequest<{ data: BroadcastRecord[] }>('/admin/broadcast/history'),
      ]);

      if (countsRes?.data) setAudienceCounts(countsRes.data);
      if (historyRes?.data) setHistory(historyRes.data);
    } catch {} finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!subject.trim()) {
      setErrorMsg('Please enter a broadcast subject.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter the message body.');
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmSend = async () => {
    setConfirmModalOpen(false);
    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<{ data: any }>('/admin/broadcast/send', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          targetAudience,
        }),
      });

      if (res?.data) {
        setLastDispatched({
          subject: res.data.subject,
          totalRecipients: res.data.totalRecipients,
        });
        setSubject('');
        setMessage('');
        loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const audiencePills = [
    { id: 'ALL', label: 'All Accounts', count: audienceCounts.ALL, desc: 'Every registered active account' },
    { id: 'MEMBERS', label: 'Members', count: audienceCounts.MEMBERS, desc: 'Accredited debaters and delegates' },
    { id: 'PRESENTERS', label: 'Presenters', count: audienceCounts.PRESENTERS, desc: 'Approved keynote youth presenters' },
    { id: 'CO_ADMINS', label: 'Co-Admins', count: audienceCounts.CO_ADMINS, desc: 'Chapter coordinators and administrators' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2.5 rounded-xl bg-emerald-800 text-white shadow-sm">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Official Broadcast Dispatcher
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            One-click simultaneous institutional dispatch across In-App Notice Boards, Web Push Panels, and Personalized Emails.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Super Admin Authority</span>
        </div>
      </div>

      {/* Delivery Summary Banner upon successful send */}
      {lastDispatched && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Broadcast Successfully Dispatched!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">
                "{lastDispatched.subject}" has been queued for triple-channel delivery to{' '}
                <span className="font-bold underline">{lastDispatched.totalRecipients} targeted delegates</span>.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1. In-App Notice Created
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 2. Individual Emails Queued
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3. Web Push Triggered
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastDispatched(null)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-900 dark:hover:text-white"
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
          <button onClick={() => setErrorMsg(null)} className="font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ======================================================== */}
        {/* COMPOSER FORM (7 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleOpenConfirm} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              Compose Communiqué
            </h2>

            {/* Target Audience Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Select Target Audience
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {audiencePills.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setTargetAudience(pill.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetAudience === pill.id
                        ? 'border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-white ring-2 ring-emerald-600/30 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{pill.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                        {pill.count}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight">
                      {pill.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Broadcast Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Urgent Plenary Convocations & ISDC7 Debate Calendar"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            {/* Message Body Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Message Body
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type the full announcement content here. In emails, this will be automatically personalized with 'Hi {FirstName},' for every individual recipient..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            {/* Triple Channel Checkmarks */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                Simultaneous Delivery Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In-App Notice Board</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Personalized Email</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Web Push Panel</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending || !subject.trim() || !message.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
            </button>
          </form>
        </div>

        {/* ======================================================== */}
        {/* LOG & LIVE EMAIL PREVIEW (5 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Personalization Preview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Live Email Personalization Preview
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950 text-xs space-y-2">
              <div className="pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">To:</span> individual delegate (e.g. amal@thegyde.org)
              </div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                Hi Amal,
              </div>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {message.trim() || 'Your broadcast body will render here with confidential individual greeting, personalized for each delegate automatically...'}
              </p>
            </div>
          </div>

          {/* Past Broadcast History */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Broadcast Dispatch Log
            </h3>

            {isLoadingHistory ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading history...</div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No past broadcasts sent yet.</p>
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
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.targetAudience}
                      </span>
                      <span>
                        {item.deliveryStats?.totalRecipients || 0} Recipients
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
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Broadcast Dispatch
                </h3>
                <p className="text-xs text-slate-500">
                  This will initiate simultaneous delivery immediately.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Audience:</span>
                <span className="font-bold text-slate-900 dark:text-white">{targetAudience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Recipients:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {audienceCounts[targetAudience]} Users
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {subject}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every recipient will receive an in-app notice, a personalized email with their individual greeting, and a web push notification.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
