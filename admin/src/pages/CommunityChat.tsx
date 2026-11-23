import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest, getAdminTokenForRequest, API_BASE } from '../utils/api';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Mic,
  X,
  Play,
  Pause,
  ArrowLeft,
  ShieldCheck,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Video as VideoIcon,
  Volume2,
  AlertCircle,
  Clock,
  Sparkles,
  User as UserIcon,
  FileText,
  Download,
} from 'lucide-react';

interface ConversationParticipant {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  country?: string;
  flag?: string;
  status?: string;
  joinedAt?: string;
}

interface ConversationItem {
  userId: string;
  user: ConversationParticipant;
  lastMessage: {
    id: string;
    messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'DOCUMENT';
    preview: string;
    senderId: string;
    senderRole: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  conversationUserId: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'DOCUMENT';
  content: string;
  hasMedia: boolean;
  mediaMimeType?: string;
  mediaDuration?: number;
  mediaSize?: number;
  fileName?: string;
  mediaUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export const CommunityChat: React.FC = () => {
  const { user: currentAdmin } = useAdminAuth();
  const { t, isArabic, dir, translateRole } = useAdminLanguage();

  // Conversations list & selection
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<ConversationParticipant | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'MEMBER' | 'PRESENTER'>('ALL');

  // Input & sending
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Attachment state
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to convert Blob or File to Base64
  const fileToBase64 = (blobOrFile: Blob | File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to encode file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from storage'));
      reader.readAsDataURL(blobOrFile);
    });
  };

  // Auto-compress large photos on an in-memory canvas to HD (max 1920px) under 1MB
  const compressImageIfNeeded = (file: File): Promise<Blob | File> => {
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      return Promise.resolve(file);
    }
    if (file.size < 600 * 1024) {
      return Promise.resolve(file);
    }
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_DIM = 1920;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.82
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Lightbox preview for images
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      const res = await apiRequest<any>('/admin/chat/conversations');
      const list = Array.isArray(res)
        ? res
        : res?.conversations || res?.data?.conversations || (Array.isArray(res?.data) ? res.data : []);
      setConversations(list);
    } catch {} finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Polling conversations
  useEffect(() => {
    fetchConversations();
    const timer = setInterval(fetchConversations, 10000);
    return () => clearInterval(timer);
  }, [fetchConversations]);

  // 2. Fetch specific user messages
  const fetchMessages = useCallback(async (userId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await apiRequest<any>(`/admin/chat/messages/${userId}`);
      const payload = res?.user ? res : res?.data;
      if (payload?.user) {
        setActiveUser(payload.user);
        setActiveMessages(payload.messages || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load thread');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // When selected user changes, fetch their thread
  useEffect(() => {
    if (!selectedUserId) {
      setActiveUser(null);
      setActiveMessages([]);
      return;
    }
    fetchMessages(selectedUserId);

    // Fast polling active thread (3.5s)
    const timer = setInterval(() => {
      apiRequest<any>(`/admin/chat/messages/${selectedUserId}`)
        .then((res) => {
          const payload = res?.messages ? res : res?.data;
          if (payload?.messages) {
            setActiveMessages(payload.messages);
          }
        })
        .catch(() => {});
    }, 3500);

    return () => clearInterval(timer);
  }, [selectedUserId, fetchMessages]);

  useEffect(() => {
    if (activeMessages.length > 0) {
      scrollToBottom();
    }
  }, [activeMessages]);

  // Handle media selection (Image, Video, or Document)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type.toLowerCase();
    const isImage = mime.startsWith('image/');
    const isVideo = mime.startsWith('video/');
    const isDocument =
      mime.startsWith('application/') ||
      mime.startsWith('text/') ||
      file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx|zip)$/i);

    if (!isImage && !isVideo && !isDocument) {
      setErrorMsg('Please attach an image, video, or document.');
      return;
    }

    // Size limit check: Images up to 15MB (auto-compressed on canvas), Documents & Media max 3.2MB
    if (isImage && file.size > 15 * 1024 * 1024) {
      setErrorMsg('Images must be smaller than 15 MB.');
      return;
    }
    if (!isImage && file.size > 3.2 * 1024 * 1024) {
      setErrorMsg('Documents and media files must be smaller than 3.2 MB for upload.');
      return;
    }

    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }

    setSelectedFile({
      file,
      previewUrl: isImage ? URL.createObjectURL(file) : '',
      type: isImage ? 'IMAGE' : isVideo ? 'VIDEO' : 'DOCUMENT',
    });
    setErrorMsg(null);
  };

  const removeSelectedFile = () => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setErrorMsg('Microphone access is unavailable.');
    }
  };

  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || !selectedUserId) return;
    clearInterval(recordingTimerRef.current);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || 'audio/webm',
      });
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());

      if (audioBlob.size > 5 * 1024 * 1024) {
        setErrorMsg('Voice note exceeds 5 MB limit.');
        setIsRecording(false);
        return;
      }

      await sendMediaReply(audioBlob, 'VOICE', 'voice_reply.webm', recordingSeconds);
      setIsRecording(false);
      setRecordingSeconds(0);
    };

    mediaRecorderRef.current.stop();
  };

  const cancelRecording = () => {
    if (!mediaRecorderRef.current) return;
    clearInterval(recordingTimerRef.current);
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  // Send reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    const text = replyText.trim();
    if (!text && !selectedFile) return;

    if (selectedFile) {
      await sendMediaReply(selectedFile.file, selectedFile.type, selectedFile.file.name, undefined, text);
      removeSelectedFile();
      setReplyText('');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<any>(`/admin/chat/reply/${selectedUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageType: 'TEXT',
          content: text,
        }),
      });

      const newMsg = res?.id ? res : res?.data;
      if (newMsg) {
        setActiveMessages((prev) => [...prev, newMsg]);
        setReplyText('');
        scrollToBottom();
        fetchConversations();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const sendMediaReply = async (
    blobOrFile: Blob | File,
    type: 'IMAGE' | 'VIDEO' | 'VOICE' | 'DOCUMENT',
    fileName: string,
    duration?: number,
    caption?: string
  ) => {
    if (!selectedUserId) return;
    setIsSending(true);
    setErrorMsg(null);

    try {
      let fileToSend = blobOrFile;
      if (type === 'IMAGE' && blobOrFile instanceof File) {
        fileToSend = await compressImageIfNeeded(blobOrFile);
      }
      const base64Data = await fileToBase64(fileToSend);
      const rawBase64 = base64Data.includes(';base64,') ? base64Data.split(';base64,')[1] : base64Data;
      const mime = blobOrFile.type
        ? blobOrFile.type.split(';')[0].trim().toLowerCase()
        : type === 'VOICE'
        ? 'audio/webm'
        : type === 'DOCUMENT'
        ? 'application/pdf'
        : 'application/octet-stream';

      const res = await apiRequest<any>(`/admin/chat/reply/${selectedUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageType: type,
          content: caption || '',
          mediaBase64: rawBase64,
          mediaMimeType: mime,
          mediaDuration: duration,
          fileName: fileName || (blobOrFile instanceof File ? blobOrFile.name : `${type.toLowerCase()}_reply_${Date.now()}`),
        }),
      });

      const newMsg = res?.id ? res : res?.data;
      if (newMsg) {
        setActiveMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
        fetchConversations();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch media reply');
    } finally {
      setIsSending(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (roleFilter === 'MEMBER') {
      return c.user.role?.toUpperCase() === 'MEMBER';
    }
    if (roleFilter === 'PRESENTER') {
      return c.user.role?.toUpperCase() === 'PRESENTER';
    }
    return true;
  });

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[calc(100dvh-5rem)] flex flex-col bg-slate-50 dark:bg-[#05070e] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden" dir={dir}>
      <div className="flex-1 flex overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT PANE: Conversation List */}
        {/* ======================================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
            selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#4851BA] dark:text-indigo-400" />
                {t('chat.title', 'Community Chat')}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#4851BA]/10 dark:bg-[#4851BA]/20 text-[#4851BA] dark:text-indigo-300 border border-[#4851BA]/20">
                {conversations.length} {isArabic ? 'محادثة' : 'Threads'}
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('chat.searchPlaceholder', 'Search community members...')}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1.5 pt-1">
              {(['ALL', 'MEMBER', 'PRESENTER'] as const).map((tab) => {
                const count =
                  tab === 'ALL'
                    ? conversations.length
                    : conversations.filter((c) => c.user.role?.toUpperCase() === tab).length;
                const tabUnread =
                  tab === 'ALL'
                    ? conversations.reduce((acc, curr) => acc + curr.unreadCount, 0)
                    : conversations
                        .filter((c) => c.user.role?.toUpperCase() === tab)
                        .reduce((acc, curr) => acc + curr.unreadCount, 0);

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRoleFilter(tab)}
                    className={`flex-1 py-1.5 px-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      roleFilter === tab
                        ? 'bg-[#4851BA] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>
                      {tab === 'ALL'
                        ? t('chat.tabAll', 'All')
                        : tab === 'MEMBER'
                        ? t('chat.tabMembers', 'Members')
                        : t('chat.tabPresenters', 'Presenters')}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        roleFilter === tab
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                    {tabUnread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400">{t('common.loading', 'Loading...')}</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#4851BA]" />
                <p className="text-xs font-medium text-slate-500">
                  {t('chat.noConversations', 'No active conversations found')}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isArabic
                    ? 'عندما يراسل الأعضاء أو المتحدثون المشرف العام، ستظهر محادثاتهم هنا.'
                    : 'When members or presenters message the Admin, they will appear here.'}
                </p>
                {roleFilter !== 'ALL' && conversations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRoleFilter('ALL')}
                    className="mt-3 text-xs font-semibold text-[#4851BA] dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isArabic ? `عرض كافة المحادثات (${conversations.length})` : `View All Conversations (${conversations.length})`}
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedUserId === conv.userId;
                const isPresenter = conv.user.role?.toUpperCase() === 'PRESENTER';

                return (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUserId(conv.userId)}
                    className={`w-full text-start p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#4851BA]/10 dark:bg-[#4851BA]/20 border-s-4 border-[#4851BA]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1e1b4b] to-[#3B43A1] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {conv.user.name[0]?.toUpperCase() || 'U'}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -end-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {conv.user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.lastMessage.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isPresenter
                              ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/50 text-[#4851BA] dark:text-indigo-300'
                          }`}
                        >
                          {translateRole(conv.user.role)}
                        </span>
                        {conv.user.country && (
                          <span className="text-[10px] text-slate-400 truncate">
                            {conv.user.country}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs truncate ${
                          conv.unreadCount > 0
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {conv.lastMessage.preview}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANE: Active Chat Thread (Mobile Responsive) */}
        {/* ======================================================== */}
        <div
          className={`flex-1 flex flex-col bg-slate-100/50 dark:bg-[#05070e] ${
            !selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedUserId && activeUser ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="px-3 sm:px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Mobile Back Button to Return to Single-Pane Conversation List */}
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B43A1] to-[#4851BA] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {activeUser.name[0]?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {activeUser.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-[#4851BA] dark:text-indigo-300 shrink-0">
                        {translateRole(activeUser.role)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {activeUser.email} {activeUser.country && `• ${activeUser.country}`}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#4851BA]/10 dark:bg-[#4851BA]/20 border border-[#4851BA]/30 text-[#4851BA] dark:text-indigo-300 text-xs font-medium shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('chat.encryptedBadge', 'AES-256-GCM Encrypted Channel')}</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    {isArabic ? 'جارٍ تحميل وفك تشفير الرسائل...' : 'Loading decrypted message thread...'}
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-[#4851BA]" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isArabic ? `محادثة مع ${activeUser.name}` : `Conversation with ${activeUser.name}`}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isArabic ? 'أرسل رسالة بالأسفل للرد أو بدء الحوار.' : 'Send a message below to start or reply.'}
                    </p>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isAdminSender =
                      msg.senderRole === 'SUPER_ADMIN' || msg.senderRole === 'ADMIN';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdminSender ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 sm:px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                            isAdminSender
                              ? 'bg-[#4851BA] text-white rounded-tr-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-sm'
                          }`}
                        >
                          {/* Media Renderers */}
                          {msg.hasMedia && msg.mediaUrl && (
                            <div className="mb-2">
                              {msg.messageType === 'IMAGE' && (
                                <AdminMediaImage
                                  mediaUrl={msg.mediaUrl}
                                  onClick={() => setLightboxUrl(msg.mediaUrl!)}
                                />
                              )}

                              {msg.messageType === 'VIDEO' && (
                                <AdminMediaVideo mediaUrl={msg.mediaUrl} />
                              )}

                              {msg.messageType === 'VOICE' && (
                                <AdminAudioPlayer
                                  mediaUrl={msg.mediaUrl}
                                  duration={msg.mediaDuration}
                                  isAdminSender={isAdminSender}
                                />
                              )}

                              {msg.messageType === 'DOCUMENT' && (
                                <a
                                  href={msg.mediaUrl.startsWith('http') ? msg.mediaUrl : `https://gyde-api.vercel.app${msg.mediaUrl}?token=${encodeURIComponent(getAdminTokenForRequest() || '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={msg.fileName || 'document'}
                                  className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                                    isAdminSender
                                      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100'
                                  }`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${
                                      isAdminSender ? 'bg-white/20 text-white' : 'bg-[#4851BA]/10 text-[#4851BA] dark:text-indigo-400'
                                    }`}
                                  >
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0 text-start">
                                    <p className="font-semibold text-xs truncate max-w-[140px]">
                                      {msg.fileName || 'Document'}
                                    </p>
                                    {msg.mediaSize && (
                                      <span className="text-[10px] opacity-75">
                                        {(msg.mediaSize / (1024 * 1024)).toFixed(1)} MB
                                      </span>
                                    )}
                                  </div>
                                  <Download className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Text Content */}
                          {msg.content && msg.content !== `[${msg.messageType}]` && (
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          )}

                          {/* Footer */}
                          <div
                            className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                              isAdminSender ? 'text-indigo-100/75' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isAdminSender && (
                              <span>
                                {msg.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-indigo-200" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Selected File Banner */}
              {selectedFile && (
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {selectedFile.type === 'IMAGE' ? (
                      <ImageIcon className="w-4 h-4 text-[#4851BA] shrink-0" />
                    ) : selectedFile.type === 'VIDEO' ? (
                      <VideoIcon className="w-4 h-4 text-[#4851BA] shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#4851BA] shrink-0" />
                    )}
                    <span className="truncate text-slate-800 dark:text-slate-200 font-medium">
                      {selectedFile.file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({(selectedFile.file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="px-4 py-1.5 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="truncate">{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="ml-auto font-bold">
                    &times;
                  </button>
                </div>
              )}

              {/* Bottom Reply Bar */}
              <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        {t('chat.recording', 'Recording Voice Reply:')} {formatSecs(recordingSeconds)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                        title={t('chat.cancelRecording', 'Cancel Recording')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={stopRecordingAndSend}
                        className="p-1.5 rounded-lg bg-[#4851BA] hover:bg-[#3B43A1] text-white shadow-sm cursor-pointer"
                        title={t('chat.sendVoice', 'Send Voice Note')}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      className="hidden"
                    />

                    {/* Attachment button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-[#4851BA] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t('chat.attach', 'Attach Image, Video, or Document')}
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Voice note button */}
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-[#4851BA] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t('chat.recordVoice', 'Record Voice Note')}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Input */}
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        selectedFile
                          ? t('chat.captionPlaceholder', 'Add a caption to media...')
                          : isArabic
                          ? `الرد مباشرة على ${activeUser.name}...`
                          : `Reply directly to ${activeUser.name}...`
                      }
                      disabled={isSending}
                      className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
                    />

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={isSending || (!replyText.trim() && !selectedFile)}
                      className="p-2 sm:p-2.5 rounded-xl bg-[#4851BA] hover:bg-[#3B43A1] disabled:opacity-40 text-white shadow-sm transition-all shrink-0 cursor-pointer"
                      title={t('chat.send', 'Send')}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            /* Empty State when no conversation selected */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#4851BA] dark:text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {t('chat.selectConversation', 'Select a conversation to start chatting')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                {t(
                  'chat.selectConversationDesc',
                  'Communicate directly with registered fellows, delegates, and keynote speakers.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxUrl}
              alt="Preview"
              className="rounded-2xl max-h-[85vh] object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Media components for authenticated streaming
 */
const AdminMediaImage: React.FC<{ mediaUrl: string; onClick: () => void }> = ({
  mediaUrl,
  onClick,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const token = getAdminTokenForRequest();
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `https://gyde-api.vercel.app${mediaUrl}`;
    const urlWithToken = token ? `${fullUrl}?token=${encodeURIComponent(token)}` : fullUrl;

    fetch(urlWithToken, { headers, credentials: 'include' })
      .then((res) => res.blob())
      .then((blob) => {
        if (active) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [mediaUrl]);

  if (!blobUrl) {
    return <div className="h-32 w-48 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />;
  }

  return (
    <img
      src={blobUrl}
      alt="Chat attachment"
      onClick={onClick}
      className="rounded-xl max-h-56 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
      loading="lazy"
    />
  );
};

const AdminMediaVideo: React.FC<{ mediaUrl: string }> = ({ mediaUrl }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const token = getAdminTokenForRequest();
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `https://gyde-api.vercel.app${mediaUrl}`;
    const urlWithToken = token ? `${fullUrl}?token=${encodeURIComponent(token)}` : fullUrl;

    fetch(urlWithToken, { headers, credentials: 'include' })
      .then((res) => res.blob())
      .then((blob) => {
        if (active) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [mediaUrl]);

  if (!blobUrl) {
    return <div className="h-40 w-64 rounded-xl bg-black/20 animate-pulse" />;
  }

  return (
    <video
      src={blobUrl}
      controls
      playsInline
      preload="metadata"
      className="rounded-xl max-h-56 w-full bg-black"
    />
  );
};

const AdminAudioPlayer: React.FC<{
  mediaUrl: string;
  duration?: number;
  isAdminSender: boolean;
}> = ({ mediaUrl, duration, isAdminSender }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let active = true;
    const token = getAdminTokenForRequest();
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `https://gyde-api.vercel.app${mediaUrl}`;
    const urlWithToken = token ? `${fullUrl}?token=${encodeURIComponent(token)}` : fullUrl;

    fetch(urlWithToken, { headers, credentials: 'include' })
      .then((res) => res.blob())
      .then((blob) => {
        if (active) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [mediaUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.ended) {
      audioRef.current.currentTime = 0;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error('Audio playback error:', err);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const total = audioRef.current.duration || duration || 1;
      setProgress((audioRef.current.currentTime / total) * 100);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!blobUrl) {
    return <div className="h-8 w-40 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />;
  }

  return (
    <div
      className={`flex items-center gap-2.5 py-1 px-1 rounded-xl w-52 ${
        isAdminSender ? 'text-white' : 'text-slate-800 dark:text-slate-200'
      }`}
    >
      <audio
        ref={audioRef}
        src={blobUrl}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer ${
          isAdminSender
            ? 'bg-[#3B43A1] text-white hover:bg-[#1e1b4b]'
            : 'bg-[#4851BA] text-white hover:bg-[#3B43A1]'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="flex-1">
        <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isAdminSender ? 'bg-indigo-200' : 'bg-[#4851BA]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] mt-1 opacity-70">
          <span>{formatSecs(currentTime)}</span>
          <span>{formatSecs(duration || audioRef.current?.duration || 0)}</span>
        </div>
      </div>
    </div>
  );
};
