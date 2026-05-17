/*
 * Service worker for Pokémon Gen 2 eGuide.
 *
 * Strategy:
 *   • Precache the static shell (HTML / CSS / JS / data) on install.
 *   • Cache-first for same-origin static assets — works offline.
 *   • Network-first for external resources (sprite CDN, simplyblgdev maps,
 *     Google Drive auth) — fall back to cache if available.
 *   • Bump CACHE_VERSION on every site update to invalidate old caches.
 */
const CACHE_VERSION = 'gen2-v29';  // bump on every site update to invalidate old caches
const STATIC_CACHE  = 'gen2-static-' + CACHE_VERSION;
const RUNTIME_CACHE = 'gen2-runtime-' + CACHE_VERSION;

// Files that make up the offline-capable shell.
const PRECACHE_URLS = [
  './',
  './index.html',
  './assets/css/app.css',
  './assets/js/app.js',
  './assets/js/auth.js',
  './assets/favicon.svg',
  './manifest.webmanifest',
  './assets/data/pokedata.js',
  './assets/data/app-static.js',
  './assets/data/encounters-gen2.js',
  './assets/data/bulba-data-gs.js',
  './assets/data/bulba-data-c.js',
  './assets/js/pages/apricorns.js',
  './assets/js/pages/battletower.js',
  './assets/js/pages/bugcontest.js',
  './assets/js/pages/daynight.js',
  './assets/js/pages/distributionchecklist.js',
  './assets/js/pages/distributions.js',
  './assets/js/pages/e4ref.js',
  './assets/js/pages/encounters.js',
  './assets/js/pages/gen2features.js',
  './assets/js/pages/gymleaders.js',
  './assets/js/pages/itemlocs.js',
  './assets/js/pages/learnsets.js',
  './assets/js/pages/rematches.js',
  './assets/js/pages/routebrowser.js',
  './assets/js/pages/statcalc.js',
  './assets/js/pages/tutors.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      // Use addAll best-effort; one missing file shouldn't abort the install.
      return Promise.allSettled(PRECACHE_URLS.map(function(u) { return cache.add(u); }));
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== STATIC_CACHE && k !== RUNTIME_CACHE) return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // Never cache Google auth / Drive API responses.
  if (url.hostname.indexOf('googleapis.com') !== -1
      || url.hostname.indexOf('accounts.google.com') !== -1
      || url.hostname.indexOf('googletagmanager.com') !== -1) {
    return; // pass through to network
  }

  if (sameOrigin) {
    // Cache-first for our own files.
    event.respondWith(
      caches.match(req).then(function(hit) {
        if (hit) return hit;
        return fetch(req).then(function(resp) {
          if (resp && resp.status === 200) {
            var copy = resp.clone();
            caches.open(STATIC_CACHE).then(function(c) { c.put(req, copy); });
          }
          return resp;
        }).catch(function() { return hit; });
      })
    );
    return;
  }

  // Cross-origin (PokéAPI sprites, simplyblgdev iframe assets, etc.):
  // network-first with cache fallback.
  event.respondWith(
    fetch(req).then(function(resp) {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        var copy = resp.clone();
        caches.open(RUNTIME_CACHE).then(function(c) { c.put(req, copy); });
      }
      return resp;
    }).catch(function() {
      return caches.match(req);
    })
  );
});
