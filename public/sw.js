/* inread — service worker mínimo: instalável + ecrã offline.
   Não guarda páginas nem dados da conta (privacidade): só ficheiros estáticos. */
const V = 'inread-v2';

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

/* O servidor (edge do alojamento) responde 429 sem conteúdo quando há muitos pedidos seguidos:
   sem isto o ecrã ficava em branco. Repetimos com pausas e, se persistir, mostramos uma página que volta a tentar. */
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function comRepeticao(r, pausas) {
  let res = await fetch(r.clone());
  for (const ms of pausas) {
    if (res.status !== 429 && res.status !== 503) return res;
    await espera(ms);
    res = await fetch(r.clone());
  }
  return res;
}
const OCUPADO = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>inread</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#ece9e0;color:#15160f;font-family:Inter,system-ui,sans-serif;text-align:center;padding:24px}
p{margin:0 0 18px;color:rgba(21,22,15,.62);line-height:1.6}h1{margin:0 0 8px;font-size:20px}
button{border:0;border-radius:999px;background:#14150f;color:#fff;font:inherit;font-weight:700;padding:12px 24px;cursor:pointer}</style></head>
<body><main><h1>A carregar…</h1><p>O servidor está ocupado. Voltamos a tentar dentro de segundos.</p><button onclick="location.reload()">Tentar agora</button></main>
<script>setTimeout(function(){location.reload()},6000)</script></body></html>`;

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;

  if (r.mode === 'navigate') {
    e.respondWith(
      comRepeticao(r, [1200, 2500, 4000])
        .then((res) =>
          res.status === 429 || res.status === 503
            ? new Response(OCUPADO, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
            : res
        )
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  const estatico =
    u.pathname.startsWith('/_next/static/') ||
    u.pathname.startsWith('/fonts/') ||
    u.pathname === '/api/logo' ||
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
    return;
  }

  // navegação interna da app (dados das páginas) e sessão: repetir se o servidor disser "ocupado"
  if (r.headers.get('RSC') || u.pathname === '/api/auth/session') {
    e.respondWith(comRepeticao(r, [1200, 2500, 4000]));
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
