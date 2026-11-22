import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { registerWebPush } from '../../utils/pushManager';

export const PushNotificationPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      Notification.permission === 'default'
    ) {
      setShowPrompt(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const ok = await registerWebPush();
        if (ok) {
          setSuccess(true);
          setTimeout(() => setShowPrompt(false), 2500);
        } else {
          setShowPrompt(false);
        }
      } else {
        setShowPrompt(false);
      }
    } catch {
      setShowPrompt(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="mb-4 mx-4 sm:mx-6 p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-emerald-950 dark:text-emerald-100">
            Enable Official GYDE Notifications
          </p>
          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
            Receive instant announcements and session calls directly on your phone or desktop notification panel.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {success ? (
          <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4" /> Enabled
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={handleEnableNotifications}
              disabled={isSubscribing}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubscribing ? 'Enabling...' : 'Allow Notifications'}
            </button>
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="p-1 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
