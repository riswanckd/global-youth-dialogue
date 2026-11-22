import webpush from 'web-push';
import { env } from '../config/env';
import { PushSubscription } from '../models/PushSubscription';

let vapidConfigured = false;

try {
  if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      env.VAPID_SUBJECT,
      env.VAPID_PUBLIC_KEY,
      env.VAPID_PRIVATE_KEY
    );
    vapidConfigured = true;
  }
} catch {
  vapidConfigured = false;
}

export function isVapidReady(): boolean {
  return vapidConfigured;
}

export function getVapidPublicKey(): string {
  return env.VAPID_PUBLIC_KEY;
}

export async function sendPushNotificationToUsers(
  userIds: any[],
  payload: { title: string; body: string; url?: string; tag?: string }
): Promise<number> {
  if (!vapidConfigured || !userIds.length) return 0;

  try {
    const subscriptions = await PushSubscription.find({ userId: { $in: userIds } });
    if (!subscriptions.length) return 0;

    let successfulCount = 0;
    const stringifiedPayload = JSON.stringify({
      ...payload,
      timestamp: Date.now(),
    });

    // Send push notifications in parallel
    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            stringifiedPayload,
            {
              TTL: 60 * 60 * 24, // 24 hours
              urgency: 'high',
            }
          );
          successfulCount++;
        } catch (err: any) {
          // If subscription is expired or invalidated, purge from database
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id }).catch(() => {});
          }
        }
      })
    );

    return successfulCount;
  } catch {
    return 0;
  }
}
