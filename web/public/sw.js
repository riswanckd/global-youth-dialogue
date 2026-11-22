// GYDE Official Web Push Service Worker
self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'GYDE Announcement';
    const options = {
      body: data.body || 'You have a new official notice from the GYDE Secretariat.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'gyde-notice',
      renotify: true,
      data: {
        url: data.url || '/portal/notices',
        timestamp: data.timestamp || Date.now(),
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('GYDE Announcement', {
        body: text,
        icon: '/favicon.ico',
        data: { url: '/portal/notices' },
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/portal/notices';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/portal') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
