/* inread — service worker mínimo: instalável + ecrã offline.
   Não guarda páginas nem dados da conta (privacidade): só ficheiros estáticos. */
const V = 'inread-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(V).then((c) => c.addAll(['/offline.html', '/icon-192.png'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => !k.startsWith(V)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;

  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(() => caches.match('/offline.html')));
    return;
  }

  const estatico =
    u.pathname.startsWith('/_next/static/') ||
    u.pathname.startsWith('/fonts/') ||
    (/\.(png|svg|woff2?|otf)$/.test(u.pathname) && !u.pathname.startsWith('/api/'));
  if (estatico) {
    e.respondWith(
      caches.open(V + '-static').then(async (c) => {
        const hit = await c.match(r);
        if (hit) return hit;
        const res = await fetch(r);
        if (res.ok) c.put(r, res.clone());
        return res;
      })
    );
  }
});

/* ---- notificações push ---- */
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(d.titulo || 'inread', {
      body: d.corpo || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: d.tag,
      data: { url: d.url || '/caixa' },
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/caixa';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ('focus' in c) {
          if ('navigate' in c) c.navigate(url);
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
