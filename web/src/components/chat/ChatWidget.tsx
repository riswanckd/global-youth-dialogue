import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Volume2,
  AlertCircle,
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

export const ChatWidget: React.FC = () => {
  const { user } = useAuth();

  // Widget visibility & spotlight state
  const [isOpen, setIsOpen] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

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

  // Determine first-time spotlight visibility
  useEffect(() => {
    if (user && user.hasSeenChatSpotlight === false) {
      setShowSpotlight(true);
    } else {
      setShowSpotlight(false);
    }
  }, [user]);

  // Dismiss spotlight and notify server
  const handleDismissSpotlight = async () => {
    setShowSpotlight(false);
    if (user) {
      user.hasSeenChatSpotlight = true;
    }
    try {
      await apiRequest('/chat/spotlight-seen', { method: 'PATCH' });
    } catch {}
  };

  // Fetch messages from backend
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiRequest<{
        messages: ChatMessage[];
        hasSeenChatSpotlight: boolean;
        unreadCount: number;
      }>('/chat/messages');

      if (res?.messages) {
        setMessages(res.messages);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {}
  }, [user]);

  // Polling mechanism (3.5s when open, 15s when closed)
  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const intervalTime = isOpen ? 3500 : 15000;
    const interval = setInterval(fetchMessages, intervalTime);

    return () => clearInterval(interval);
  }, [user, isOpen, fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages.length]);

  // Memory hygiene: clean up object URLs when unmounting or clearing attachments
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
      setErrorMsg('Please select a valid image or video file.');
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

  // Voice recording handlers using MediaRecorder API
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
            // Auto-stop at 2 minutes
            stopRecordingAndSend();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Microphone access was denied or is unavailable.');
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
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.onstop = async () => {
      clearInterval(recordingTimerRef.current);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

      if (audioBlob.size > 5 * 1024 * 1024) {
        setErrorMsg('Voice note exceeds 5MB limit');
        return;
      }

      await sendMediaMessage(audioBlob, 'VOICE', 'audio/webm', recordingSeconds);
      setRecordingSeconds(0);
    };

    mediaRecorderRef.current.stop();
  };

  // Convert blob/file to base64
  const fileToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Send text message
  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSending) return;

    if (selectedFile) {
      await sendMediaMessage(selectedFile.file, selectedFile.type, selectedFile.file.type);
      removeSelectedFile();
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed) return;

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await apiRequest<{ data: ChatMessage }>('/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          content: trimmed,
          messageType: 'TEXT',
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

  // Send media message (Image, Video, Voice)
  const sendMediaMessage = async (
    blobOrFile: Blob | File,
    type: 'IMAGE' | 'VIDEO' | 'VOICE',
    mimeType: string,
    duration?: number
  ) => {
    setIsSending(true);
    setErrorMsg(null);

    try {
      const base64Data = await fileToBase64(blobOrFile);
      const res = await apiRequest<{ data: ChatMessage }>('/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          content: inputText.trim() || `[${type}]`,
          messageType: type,
          mediaBase64: base64Data,
          mediaMimeType: mimeType,
          mediaDuration: duration,
        }),
      });

      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        setInputText('');
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
      {/* 1. First-Time Onboarding Spotlight Overlay */}
      {showSpotlight && !isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-500 flex flex-col justify-end items-end p-6 pointer-events-auto">
          {/* Spotlight Tooltip Card */}
          <div className="mb-24 mr-2 max-w-sm w-full bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h4 className="font-semibold text-base text-emerald-950 dark:text-emerald-200">
                Chat with Admin
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Have suggestions, questions, or need help? You can now directly message the Super Administrator securely from here with text, image, video, and voice notes.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDismissSpotlight}
                className="px-4 py-1.5 text-xs font-medium rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Action Button (FAB) */}
      <button
        onClick={() => {
          if (showSpotlight) {
            handleDismissSpotlight();
          }
          setIsOpen((prev) => !prev);
        }}
        className={`fixed bottom-6 right-6 ${
          showSpotlight ? 'z-[60] animate-bounce' : 'z-40'
        } w-14 h-14 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-600/30`}
        aria-label="Chat with Admin"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

        {/* Unread badge indicator */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 3. Compact Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-emerald-100 shadow-inner">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-white">
                  GYDE Secretariat
                </h3>
                <p className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  End-to-End Encrypted
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-2 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Direct Line with Super Admin
                </p>
                <p className="text-[11px] mt-1 max-w-[200px]">
                  All messages and media are AES-256 encrypted and strictly confidential.
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
                          ? 'bg-[#0E4D3C] text-white rounded-tr-sm'
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
                          isMe ? 'text-emerald-100/70' : 'text-slate-400'
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

          {/* Selected File Preview Banner */}
          {selectedFile && (
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                {selectedFile.type === 'IMAGE' ? (
                  <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <VideoIcon className="w-4 h-4 text-emerald-600 shrink-0" />
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
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message Toast */}
          {errorMsg && (
            <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="ml-auto text-xs font-bold"
              >
                &times;
              </button>
            </div>
          )}

          {/* Bottom Controls / Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {isRecording ? (
              /* Voice Recording Bar */
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl border border-red-200/60 dark:border-red-900/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                    Recording: {formatTime(recordingSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    title="Cancel Recording"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={stopRecordingAndSend}
                    className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors"
                    title="Send Voice Note"
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
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Attach Image or Video"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Voice Note Button */}
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedFile ? 'Add a caption...' : 'Type message to Admin...'}
                  disabled={isSending}
                  className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSending || (!inputText.trim() && !selectedFile)}
                  className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white shadow-sm transition-all shrink-0"
                  title="Send"
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
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
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
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
          isMe
            ? 'bg-emerald-800 text-white hover:bg-emerald-900'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="flex-1">
        <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isMe ? 'bg-emerald-300' : 'bg-emerald-600'
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
