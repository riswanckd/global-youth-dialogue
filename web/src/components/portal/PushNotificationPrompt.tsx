import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { registerWebPush } from '../../utils/pushManager';

interface PushNotificationPromptProps {
  canShow?: boolean;
}

export const PushNotificationPrompt: React.FC<PushNotificationPromptProps> = ({ canShow = true }) => {
  const { user } = useAuth();
  const { t, isArabic, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Only check and show once the preceding Step 1 (Chat Spotlight) is finished or bypassed
    if (!canShow) {
      setIsOpen(false);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      Notification.permission === 'default' &&
      user &&
      user.hasDismissedNotificationPrompt !== true
    ) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [canShow, user]);

  const handleAllow = async () => {
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await registerWebPush();
      } else {
        // User dismissed or denied in browser native prompt
        await apiRequest('/push/dismiss-prompt', { method: 'PATCH' });
      }

      // Persist state in active session memory
      if (user) {
        user.hasDismissedNotificationPrompt = true;
      }
    } catch (err) {
      console.error('Failed to register push notifications:', err);
    } finally {
      setIsSubscribing(false);
      setIsOpen(false);
    }
  };

  const handleBlock = async () => {
    setIsSubscribing(true);
    try {
      // Record preference strictly in backend database (ZERO browser storage)
      await apiRequest('/push/dismiss-prompt', { method: 'PATCH' });
      if (user) {
        user.hasDismissedNotificationPrompt = true;
      }
    } catch (err) {
      console.error('Failed to dismiss notification prompt:', err);
    } finally {
      setIsSubscribing(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" dir={dir}>
      <div
        className="bg-[#0B0D1B]/95 backdrop-blur-xl rounded-3xl max-w-[calc(100vw-2rem)] sm:max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#4851BA]/40 text-center relative overflow-hidden animate-in zoom-in-95 duration-200 text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="allow-notifications-heading"
      >
        {/* Official GYDE Ambient Glow Background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#4851BA]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#9E59AC]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Vector SVG Bell Icon (Strictly NO Emojis) */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B43A1] via-[#4851BA] to-[#9E59AC] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#4851BA]/40 relative z-10">
          <Bell className="w-8 h-8 text-white" />
        </div>

        {/* Modal Heading */}
        <h3
          id="allow-notifications-heading"
          className="text-xl font-bold text-white tracking-tight"
        >
          {t('push.title', 'Allow Notifications')}
        </h3>

        {/* Modal Description */}
        <p className="text-sm text-slate-300 mt-2.5 leading-relaxed max-w-sm mx-auto">
          {t(
            'push.desc',
            'Stay updated with instant announcements and important notices from GYDE right in your notification panel.'
          )}
        </p>

        {/* Two Action Buttons: Block (Secondary) and Allow (Primary) */}
        <div className="mt-6 sm:mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleBlock}
            disabled={isSubscribing}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {t('push.block', 'Block')}
          </button>

          <button
            type="button"
            onClick={handleAllow}
            disabled={isSubscribing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#3B43A1] via-[#4851BA] to-[#9E59AC] hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-[#4851BA]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubscribing
              ? isArabic
                ? 'جارٍ التفعيل...'
                : 'Processing...'
              : t('push.allow', 'Allow')}
          </button>
        </div>
      </div>
    </div>
  );
};
