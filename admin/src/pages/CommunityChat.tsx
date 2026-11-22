import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest, getAdminTokenForRequest, API_BASE } from '../utils/api';
import { useAdminAuth } from '../context/AdminAuthContext';
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
    messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE';
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
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE';
  content: string;
  hasMedia: boolean;
  mediaMimeType?: string;
  mediaDuration?: number;
  mediaSize?: number;
  mediaUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export const CommunityChat: React.FC = () => {
  const { user: currentAdmin } = useAdminAuth();

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
    type: 'IMAGE' | 'VIDEO';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await apiRequest<{
        conversations: ConversationItem[];
        totalUnread: number;
      }>('/admin/chat/conversations');

      if (res?.conversations) {
        setConversations(res.conversations);
      }
    } catch {} finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Fetch active conversation messages
  const fetchActiveMessages = useCallback(async (userId: string) => {
    try {
      const res = await apiRequest<{
        user: ConversationParticipant;
        messages: ChatMessage[];
      }>(`/admin/chat/messages/${userId}`);

      if (res) {
        setActiveUser(res.user);
        setActiveMessages(res.messages || []);
      }
    } catch {}
  }, []);

  // Polling conversations list every 5s
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Polling active chat messages every 3s
  useEffect(() => {
    if (!selectedUserId) return;

    setIsLoadingMessages(true);
    fetchActiveMessages(selectedUserId).finally(() => setIsLoadingMessages(false));

    const msgInterval = setInterval(() => {
      fetchActiveMessages(selectedUserId);
    }, 3000);

    return () => clearInterval(msgInterval);
  }, [selectedUserId, fetchActiveMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  // Revoke object URLs on cleanup
  useEffect(() => {
    return () => {
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
    };
  }, [selectedFile]);

  // File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size cannot exceed 5MB');
        return;
      }
      setSelectedFile({
        file,
        previewUrl: URL.createObjectURL(file),
        type: 'IMAGE',
      });
      setErrorMsg(null);
    } else if (file.type.startsWith('video/')) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('Video size cannot exceed 15MB');
        return;
      }
      setSelectedFile({
        file,
        previewUrl: URL.createObjectURL(file),
        type: 'VIDEO',
      });
      setErrorMsg(null);
    } else {
      setErrorMsg('Only safe image and video formats are allowed.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedFile = () => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
  };

  // Convert blob to base64
  const fileToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Audio recording
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
      setErrorMsg(null);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            stopRecordingAndSend();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Microphone permission denied.');
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || !isRecording || !selectedUserId) return;

    mediaRecorderRef.current.onstop = async () => {
      clearInterval(recordingTimerRef.current);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

      if (audioBlob.size > 5 * 1024 * 1024) {
        setErrorMsg('Voice note exceeds 5MB limit');
        return;
      }

      await sendMediaReply(audioBlob, 'VOICE', 'audio/webm', recordingSeconds);
      setRecordingSeconds(0);
    };

    mediaRecorderRef.current.stop();
  };

  // Send Admin Text Reply
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUserId || isSending) return;

    if (selectedFile) {
      await sendMediaReply(selectedFile.file, selectedFile.type, selectedFile.file.type);
      removeSelectedFile();
      return;
    }

    const trimmed = replyText.trim();
    if (!trimmed) return;

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<{ data: ChatMessage }>(`/admin/chat/reply/${selectedUserId}`, {
        method: 'POST',
        body: JSON.stringify({
          content: trimmed,
          messageType: 'TEXT',
        }),
      });

      if (res?.data) {
        setActiveMessages((prev) => [...prev, res.data]);
        setReplyText('');
        fetchConversations();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  // Send Admin Media Reply
  const sendMediaReply = async (
    blobOrFile: Blob | File,
    type: 'IMAGE' | 'VIDEO' | 'VOICE',
    mimeType: string,
    duration?: number
  ) => {
    if (!selectedUserId) return;
    setIsSending(true);
    setErrorMsg(null);

    try {
      const base64Data = await fileToBase64(blobOrFile);
      const res = await apiRequest<{ data: ChatMessage }>(`/admin/chat/reply/${selectedUserId}`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyText.trim() || `[${type}]`,
          messageType: type,
          mediaBase64: base64Data,
          mediaMimeType: mimeType,
          mediaDuration: duration,
        }),
      });

      if (res?.data) {
        setActiveMessages((prev) => [...prev, res.data]);
        setReplyText('');
        fetchConversations();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload media');
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
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Community Chat
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {conversations.length} Threads
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member or presenter..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1.5 pt-1">
              {(['ALL', 'MEMBER', 'PRESENTER'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRoleFilter(tab)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    roleFilter === tab
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'MEMBER' ? 'Members' : 'Presenters'}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading community conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium text-slate-500">No active conversations found</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  When members message the Admin, they will appear here.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedUserId === conv.userId;
                const isPresenter = conv.user.role?.toUpperCase() === 'PRESENTER';

                return (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUserId(conv.userId)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
                        {conv.user.name[0]?.toUpperCase() || 'U'}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
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
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {conv.user.role}
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
        {/* RIGHT PANE: Active Chat Thread */}
        {/* ======================================================== */}
        <div
          className={`flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-950/80 ${
            !selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedUserId && activeUser ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                    {activeUser.name[0]?.toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeUser.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {activeUser.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeUser.email} {activeUser.country && `• ${activeUser.country}`}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AES-256 Encrypted</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Loading decrypted message thread...
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-emerald-600" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Conversation with {activeUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Send a message below to start or reply.
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
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                            isAdminSender
                              ? 'bg-emerald-900 text-white rounded-tr-sm'
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
                            </div>
                          )}

                          {/* Text Content */}
                          {msg.content && msg.content !== `[${msg.messageType}]` && (
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          )}

                          {/* Footer */}
                          <div
                            className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                              isAdminSender ? 'text-emerald-200/70' : 'text-slate-400'
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
                                  <CheckCheck className="w-3 h-3 text-emerald-300" />
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
                <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {selectedFile.type === 'IMAGE' ? (
                      <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <VideoIcon className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        Recording Voice Reply: {formatSecs(recordingSeconds)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={stopRecordingAndSend}
                        className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                      className="hidden"
                    />

                    {/* Attachment button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Attach Image or Video"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Voice note button */}
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Record Voice Note"
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
                          ? 'Add a caption...'
                          : `Reply directly to ${activeUser.name}...`
                      }
                      disabled={isSending}
                      className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={isSending || (!replyText.trim() && !selectedFile)}
                      className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white shadow-sm transition-all shrink-0"
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
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Community Direct Dialogue
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select a member or presenter from the left list to review their messages and reply in real-time.
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
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
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

    fetch(mediaUrl, { headers, credentials: 'include' })
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

    fetch(mediaUrl, { headers, credentials: 'include' })
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

    fetch(mediaUrl, { headers, credentials: 'include' })
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
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
          isAdminSender
            ? 'bg-emerald-800 text-white hover:bg-emerald-700'
            : 'bg-emerald-700 text-white hover:bg-emerald-800'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="flex-1">
        <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isAdminSender ? 'bg-emerald-300' : 'bg-emerald-600'
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
