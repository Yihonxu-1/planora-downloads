const CACHE = 'cloverplan-shell-v7';
const APP_SHELL = ['/app/', '/app', '/manifest.webmanifest', '/favicon.svg', '/apple-touch-icon.png'];
// Capacitor's Android WebView is already a native application shell. Its
// remote entry point must not be intercepted by a PWA service worker: a
// stale Worker can otherwise leave the native shell on a blank page.
// Android browsers (especially the WebView used by the native wrapper) have
// proven unreliable with this app's service worker. Keep the offline shell on
// iPhone/desktop and always use the network directly on Android.
const IS_ANDROID_NATIVE_SHELL = /Android/i.test(self.navigator.userAgent);

self.addEventListener('install', (event) => {
  if (IS_ANDROID_NATIVE_SHELL) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(Promise.all([
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)),
    self.skipWaiting(),
  ]));
});
self.addEventListener('activate', (event) => event.waitUntil(Promise.all([
  IS_ANDROID_NATIVE_SHELL ? self.registration.unregister() : Promise.resolve(),
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  self.clients.claim(),
]));
self.addEventListener('fetch', (event) => {
  if (IS_ANDROID_NATIVE_SHELL) return;
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  const isAppPage = url.pathname === '/app' || url.pathname === '/app/';
  const isAppAsset = url.pathname.startsWith('/_next/') || APP_SHELL.includes(url.pathname);
  if (!isAppPage && !isAppAsset) return;

  // Pages use network-first so releases show up normally.  Every successful
  // visit refreshes the offline copy.  Hashed Next assets are cache-first,
  // which lets an installed iPhone app boot with no connection at all.
  if (isAppPage) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) void caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request).then((saved) => saved || caches.match('/app/'))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((saved) => saved || fetch(event.request).then((response) => {
      if (response.ok) void caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    })),
  );
});

// Safari can finish loading the first installed page before its Service Worker
// takes control.  The page therefore sends its already-loaded JS and CSS here
// once the Worker is ready, so the very first offline launch has a complete
// application shell as well (not just cached HTML).
self.addEventListener('message', (event) => {
  if (IS_ANDROID_NATIVE_SHELL || event.data?.type !== 'PRECACHE_APP') return;
  const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await Promise.all(urls.map(async (value) => {
      try {
        const url = new URL(value, self.location.origin);
        if (url.origin !== self.location.origin) return;
        const response = await fetch(url.toString());
        if (response.ok) await cache.put(url.toString(), response.clone());
      } catch {
        // A missing optional asset must not prevent the rest of the shell
        // from becoming available offline.
      }
    }));
  }));
});
