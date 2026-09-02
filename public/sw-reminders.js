/* Imported into the generated service worker (vite-plugin-pwa workbox.importScripts).
   Best-effort background reminder on Periodic Background Sync — installed
   Android/Chrome only. iOS/Safari don't fire this (platform limit). */
function idbGet(key) {
  return new Promise((resolve) => {
    const req = indexedDB.open('al-furqan', 2);
    req.onsuccess = () => {
      try {
        const tx = req.result.transaction('kv', 'readonly');
        const g = tx.objectStore('kv').get(key);
        g.onsuccess = () => resolve(g.result);
        g.onerror = () => resolve(undefined);
      } catch {
        resolve(undefined);
      }
    };
    req.onerror = () => resolve(undefined);
  });
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'reminders') return;
  event.waitUntil(
    idbGet('reminderNudge').then((n) => {
      if (n && n.title) return self.registration.showNotification(n.title, { body: n.body, icon: 'icon-192.png', badge: 'icon-192.png' });
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((cs) => {
      for (const c of cs) if ('focus' in c) return c.focus();
      return self.clients.openWindow('.');
    }),
  );
});
