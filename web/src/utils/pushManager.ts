import { apiRequest } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerWebPush(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    // 1. Fetch VAPID Public Key from Backend
    const res = await apiRequest<{ publicKey: string }>('/push/vapid-public-key');
    if (!res?.publicKey) return false;

    // 2. Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // 3. Subscribe to push manager
    const applicationServerKey = urlBase64ToUint8Array(res.publicKey);
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as any,
      });
    }

    // 4. Send subscription to backend
    await apiRequest('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription.toJSON()),
    });

    return true;
  } catch (err) {
    return false;
  }
}
