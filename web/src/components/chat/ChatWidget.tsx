import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  Mic,
  Square,
  Play,
  Pause,
  ShieldCheck,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
} from 'lucide-react';

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

interface ChatWidgetProps {
  onSpotlightComplete?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onSpotlightComplete }) => {
  const { user } = useAuth();
  const { t, isArabic, dir } = useLanguage();

  // Widget visibility & spotlight state
  const [isOpen, setIsOpen] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const spotlightDismissedRef = useRef(false);

  // Messages & interaction state (Strictly kept in memory / React state - ZERO browser storage)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Media attachment state
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    previewUrl: string;
    type: 'IMAGE' | 'VIDEO';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Lightbox preview for images
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dismiss spotlight, update database, and notify sequence listener
  const handleDismissSpotlight = useCallback(async () => {
    if (spotlightDismissedRef.current) return;
    spotlightDismissedRef.current = true;
    setShowSpotlight(false);

    if (user) {
      user.hasSeenChatSpotlight = true;
    }

    // Step 2 trigger callback (invokes Push Notification modal immediately after spotlight)
    onSpotlightComplete?.();

    try {
      await apiRequest('/chat/spotlight-seen', { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to update spotlight status:', err);
    }
  }, [user, onSpotlightComplete]);

  // Determine first-time spotlight visibility and start 5.5-second auto-fadeout timer
  useEffect(() => {
    if (user && user.hasSeenChatSpotlight !== true && !spotlightDismissedRef.current) {
      setShowSpotlight(true);

      const timer = setTimeout(() => {
        handleDismissSpotlight();
      }, 5500); // 5 to 6 seconds automatically

      return () => clearTimeout(timer);
    } else {
      setShowSpotlight(false);
    }
  }, [user, handleDismissSpotlight]);

  // Fetch messages from backend
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiRequest<{
        messages: ChatMessage[];
        hasSeenChatSpotlight: boolean;
        unreadCount: number;
      }>('/chat/messages');

      if (res) {
        if (res.messages) {
          setMessages(res.messages);
          setUnreadCount(res.unreadCount || 0);
        }
        if (res.hasSeenChatSpotlight !== undefined) {
          if (res.hasSeenChatSpotlight === true) {
            user.hasSeenChatSpotlight = true;
            if (showSpotlight) {
              handleDismissSpotlight();
            } else {
              onSpotlightComplete?.();
            }
          } else if (res.hasSeenChatSpotlight === false && !spotlightDismissedRef.current) {
            user.hasSeenChatSpotlight = false;
            setShowSpotlight(true);
          }
        }
      }
    } catch {}
  }, [user, showSpotlight, handleDismissSpotlight, onSpotlightComplete]);

  // Polling mechanism (3.5s when open, 15s when closed)
  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const interval = setInterval(fetchMessages, isOpen ? 3500 : 15000);
    return () => clearInterval(interval);
  }, [user, isOpen, fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up object URLs on unmount (Ephemeral memory hygiene)
  useEffect(() => {
    return () => {
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
    };
  }, [selectedFile]);

  // Handle file selection (Image or Video)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type.toLowerCase();
    const isImage = mime.startsWith('image/');
    const isVideo = mime.startsWith('video/');

    if (!isImage && !isVideo) {
      setErrorMsg('Invalid file format. Only images and videos are permitted.');
      return;
    }

    // Size limit check (Images: max 5MB, Video: max 15MB)
    if (isImage && file.size > 5 * 1024 * 1024) {
      setErrorMsg('Images must be smaller than 5 MB.');
      return;
    }
    if (isVideo && file.size > 15 * 1024 * 1024) {
      setErrorMsg('Videos must be smaller than 15 MB.');
      return;
    }

    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedFile({
      file,
      previewUrl,
      type: isImage ? 'IMAGE' : 'VIDEO',
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

  // Start voice note recording
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
      setErrorMsg('Microphone access denied or unavailable.');
    }
  };

  // Stop recording and send audio
  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current) return;

    clearInterval(recordingTimerRef.current);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || 'audio/webm',
      });

      // Stop all tracks to release hardware microphone
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());

      if (audioBlob.size > 5 * 1024 * 1024) {
        setErrorMsg('Voice notes must be under 5 MB.');
        setIsRecording(false);
        return;
      }

      await sendMediaMessage(audioBlob, 'VOICE', 'voice_note.webm', recordingSeconds);
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

  // Submit text message
  const handleSendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();

    if (!text && !selectedFile) return;

    if (selectedFile) {
      await sendMediaMessage(selectedFile.file, selectedFile.type, selectedFile.file.name, undefined, text);
      removeSelectedFile();
      setInputText('');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<{ data: ChatMessage }>('/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageType: 'TEXT',
          content: text,
        }),
      });

      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        setInputText('');
        scrollToBottom();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Upload encrypted media message
  const sendMediaMessage = async (
    blobOrFile: Blob | File,
    type: 'IMAGE' | 'VIDEO' | 'VOICE',
    fileName: string,
    duration?: number,
    caption?: string
  ) => {
    setIsSending(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('media', blobOrFile, fileName);
      formData.append('messageType', type);
      if (caption) formData.append('content', caption);
      if (duration) formData.append('mediaDuration', duration.toString());

      const res = await apiRequest<{ data: ChatMessage }>('/chat/send', {
        method: 'POST',
        body: formData,
      });

      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        scrollToBottom();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload media message');
    } finally {
      setIsSending(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <>
      {/* 1. Step 1: First-Time Onboarding Spotlight Overlay (5 to 6 seconds) */}
      {showSpotlight && !isOpen && (
        <>
          {/* Full-screen Dark Translucent Blur Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md transition-all duration-300 pointer-events-auto cursor-pointer"
            onClick={handleDismissSpotlight}
          />

          {/* Spotlight Callout Card (Firmly anchored at bottom-right, right above the chat button) */}
          <div
            className="fixed bottom-24 right-5 sm:bottom-28 sm:right-6 z-[60] w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm rounded-2xl p-4 sm:p-5 text-white backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 cursor-default"
            style={{
              background: '#0B0D1B',
              border: '2px solid rgba(72, 81, 186, 0.7)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(72, 81, 186, 0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient GYDE Purple Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#4851BA]/30 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#9E59AC]/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-2 relative z-10">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-[#3B43A1] to-[#4851BA] text-white shadow-md shadow-[#4851BA]/30">
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </span>
              <h4 className="font-bold text-base text-white">
                {t('chat.spotlightTitle', 'New Option Arrived!')}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10">
              {t(
                'chat.spotlightText',
                'You got a new option: Chat with Admin. Have suggestions or need help? Message the Super Admin directly from here.'
              )}
            </p>

            <div className="flex items-center justify-between relative z-10">
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4851BA] to-[#9E59AC] rounded-full animate-pulse w-full" />
              </div>

              <button
                type="button"
                onClick={handleDismissSpotlight}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#3B43A1] to-[#4851BA] hover:from-[#4851BA] hover:to-[#9E59AC] text-white shadow-md shadow-[#4851BA]/30 transition-all cursor-pointer"
              >
                {t('chat.gotIt', 'Got it')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. Floating Action Button (FAB) - Elevated & Bobbing during Spotlight */}
      <button
        type="button"
        onClick={() => {
          if (showSpotlight) {
            handleDismissSpotlight();
          }
          setIsOpen((prev) => !prev);
        }}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1e1b4b 45%, #4851BA 100%)',
          backgroundColor: '#4851BA',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px -5px rgba(72, 81, 186, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        }}
        className={`gyde-fab-circle fixed bottom-5 right-5 sm:bottom-6 sm:right-6 ${
          showSpotlight
            ? 'z-[60] animate-gyde-bob ring-4 ring-[#4851BA] ring-offset-4 ring-offset-black'
            : 'z-40'
        } w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#4851BA] hover:border-indigo-400 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer`}
        aria-label="Chat with Admin"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
        ) : (
          <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />
        )}

        {/* Unread red badge indicator */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 3. Compact Chat Popup (Mobile dvh Viewport Safe) */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-96 h-[520px] max-h-[calc(100dvh-5.5rem)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200" dir={dir}>
          {/* Header in Official GYDE Palette */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#000000] via-[#1e1b4b] to-[#3B43A1] text-white flex items-center justify-between border-b border-indigo-900/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#4851BA] flex items-center justify-center font-bold text-sm text-white shadow-inner">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-white">
                  {t('chat.secretariatTitle', 'GYDE Secretariat')}
                </h3>
                <p className="text-[11px] text-indigo-200/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-300" />
                  {t('chat.encryptedBadge', 'End-to-End Encrypted')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={t('chat.close', 'Close Chat')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mb-2 text-[#4851BA] dark:text-indigo-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {t('chat.directLine', 'Direct Line with Super Admin')}
                </p>
                <p className="text-[11px] mt-1 max-w-[200px] leading-relaxed">
                  {t(
                    'chat.confidentialDesc',
                    'All messages and media are AES-256 encrypted and strictly confidential.'
                  )}
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#4851BA] text-white rounded-tr-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-sm'
                      }`}
                    >
                      {/* Media Renderers */}
                      {msg.hasMedia && msg.mediaUrl && (
                        <div className="mb-2">
                          {msg.messageType === 'IMAGE' && (
                            <img
                              src={msg.mediaUrl}
                              alt="Chat attachment"
                              onClick={() => setLightboxUrl(msg.mediaUrl!)}
                              className="rounded-xl max-h-48 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              loading="lazy"
                            />
                          )}

                          {msg.messageType === 'VIDEO' && (
                            <video
                              src={msg.mediaUrl}
                              controls
                              playsInline
                              preload="metadata"
                              className="rounded-xl max-h-48 w-full bg-black"
                            />
                          )}

                          {msg.messageType === 'VOICE' && (
                            <AudioPlayerBubble
                              src={msg.mediaUrl}
                              duration={msg.mediaDuration}
                              isMe={isMe}
                            />
                          )}
                        </div>
                      )}

                      {/* Text content */}
                      {msg.content && msg.content !== `[${msg.messageType}]` && (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      )}

                      {/* Timestamp & read status */}
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                          isMe ? 'text-indigo-100/75' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
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

          {/* Selected File Preview Banner */}
          {selectedFile && (
            <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                {selectedFile.type === 'IMAGE' ? (
                  <ImageIcon className="w-4 h-4 text-[#4851BA] shrink-0" />
                ) : (
                  <VideoIcon className="w-4 h-4 text-[#4851BA] shrink-0" />
                )}
                <span className="truncate text-slate-700 dark:text-slate-200">
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
            <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 border-t border-red-200 dark:border-red-900/50 text-[11px] text-red-600 dark:text-red-400 flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Input & Media Controls Bar */}
          <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {isRecording ? (
              /* Voice Recording Bar */
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl border border-red-200/60 dark:border-red-900/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                    {t('chat.recording', 'Recording:')} {formatTime(recordingSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
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
                    className="p-1.5 rounded-lg bg-[#4851BA] hover:bg-[#3B43A1] text-white shadow-sm transition-colors cursor-pointer"
                    title={t('chat.sendVoice', 'Send Voice Note')}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Input Bar */
              <form onSubmit={handleSendTextMessage} className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  className="hidden"
                />

                {/* Attachment Picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#4851BA] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t('chat.attach', 'Attach Image or Video')}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Voice Note Button */}
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#4851BA] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t('chat.recordVoice', 'Record Voice Note')}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    selectedFile
                      ? t('chat.captionPlaceholder', 'Add a caption...')
                      : t('chat.typePlaceholder', 'Type message to Admin...')
                  }
                  disabled={isSending}
                  className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4851BA]/40"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSending || (!inputText.trim() && !selectedFile)}
                  className="p-2 rounded-xl bg-[#4851BA] hover:bg-[#3B43A1] disabled:opacity-40 disabled:hover:bg-[#4851BA] text-white shadow-sm transition-all shrink-0 cursor-pointer"
                  title={t('chat.send', 'Send')}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Lightbox Image Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={lightboxUrl}
              alt="Enlarged preview"
              className="rounded-2xl max-h-[85vh] object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Clean Inline Audio Player for Voice Notes
 */
const AudioPlayerBubble: React.FC<{
  src: string;
  duration?: number;
  isMe: boolean;
}> = ({ src, duration, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div
      className={`flex items-center gap-2 py-1 px-1 rounded-xl w-48 ${
        isMe ? 'text-white' : 'text-slate-800 dark:text-slate-200'
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer ${
          isMe
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
              isMe ? 'bg-indigo-200' : 'bg-[#4851BA]'
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
