/*
 * pgAuth — shared Google sign-in for pkmnguide.com and its game subdomains.
 *
 * Goals:
 *   - One Google account signs you in across pkmnguide.com, gen2.pkmnguide.com, gen4.pkmnguide.com.
 *   - Persist profile + access token in a cookie scoped to ".pkmnguide.com" so subdomains share state.
 *   - Silent re-auth on page load when an existing Google session is detected.
 *   - Expose a tiny API: pgAuth.signIn(), pgAuth.signOut(), pgAuth.getUser(), pgAuth.getAccessToken(),
 *     pgAuth.ensureFreshToken(), pgAuth.onChange().
 *
 * Local development falls back to localStorage when the cookie can't be set on a real parent domain.
 */
(function (global) {
  'use strict';

  var CLIENT_ID = '67400975308-p53sdautjffekbun985l2ct08osjapp2.apps.googleusercontent.com';
  var SCOPE = [
    'https://www.googleapis.com/auth/drive.appdata',
    'openid',
    'email',
    'profile'
  ].join(' ');
  var COOKIE_NAME = 'pgauth';
  var GIS_SRC = 'https://accounts.google.com/gsi/client';
  var LOCAL_KEY = 'pgauth_local';

  function isPkmnguideDomain() {
    return /(^|\.)pkmnguide\.com$/i.test(location.hostname);
  }
  function cookieDomain() {
    return isPkmnguideDomain() ? '.pkmnguide.com' : null;
  }

  function readCookie() {
    try {
      var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
      if (!m) return null;
      return JSON.parse(decodeURIComponent(m[1]));
    } catch (e) {
      return null;
    }
  }
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch (e) { return null; }
  }
  function writeStore(obj) {
    var domain = cookieDomain();
    var secure = location.protocol === 'https:';
    if (!obj) {
      var clear = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax' +
        (domain ? '; domain=' + domain : '') + (secure ? '; Secure' : '');
      document.cookie = clear;
      try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
      return;
    }
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(obj)); } catch (e) {}
    if (domain) {
      var exp = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
      var val = encodeURIComponent(JSON.stringify(obj));
      document.cookie = COOKIE_NAME + '=' + val + '; expires=' + exp + '; path=/; SameSite=Lax' +
        '; domain=' + domain + (secure ? '; Secure' : '');
    }
  }
  function loadStored() {
    return readCookie() || readLocal();
  }

  var listeners = [];
  var cachedUser = loadStored();

  function fire() {
    cachedUser = loadStored();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](cachedUser); } catch (e) {}
    }
    try { document.dispatchEvent(new CustomEvent('pgauth:change', { detail: cachedUser })); } catch (e) {}
  }

  var gisPromise = null;
  function loadGIS() {
    if (gisPromise) return gisPromise;
    gisPromise = new Promise(function (resolve, reject) {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        return resolve();
      }
      var existing = document.querySelector('script[src="' + GIS_SRC + '"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(); }, { once: true });
        existing.addEventListener('error', function () { reject(new Error('GIS script failed to load')); }, { once: true });
        return;
      }
      var s = document.createElement('script');
      s.src = GIS_SRC;
      s.async = true;
      s.defer = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { gisPromise = null; reject(new Error('GIS script failed to load')); };
      document.head.appendChild(s);
    });
    return gisPromise;
  }

  var tokenClient = null;
  function ensureTokenClient() {
    return loadGIS().then(function () {
      if (tokenClient) return tokenClient;
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: function () {}
      });
      return tokenClient;
    });
  }

  function requestAccessToken(opts) {
    opts = opts || {};
    return ensureTokenClient().then(function (client) {
      return new Promise(function (resolve, reject) {
        client.callback = function (resp) {
          if (resp && resp.error) return reject(new Error(resp.error_description || resp.error));
          resolve(resp);
        };
        var params = { prompt: opts.silent ? 'none' : '' };
        if (opts.hint && opts.silent) params.hint = opts.hint;
        try { client.requestAccessToken(params); } catch (e) { reject(e); }
      });
    });
  }

  function fetchUserinfo(accessToken) {
    return fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer ' + accessToken }
    }).then(function (r) {
      if (!r.ok) throw new Error('userinfo HTTP ' + r.status);
      return r.json();
    });
  }

  function tokenAlive(user, marginMs) {
    if (!user || !user.accessToken || !user.expiresAt) return false;
    return user.expiresAt > Date.now() + (marginMs || 0);
  }

  var api = {
    CLIENT_ID: CLIENT_ID,
    SCOPE: SCOPE,

    getUser: function () { return cachedUser || loadStored(); },

    isSignedIn: function () {
      var u = api.getUser();
      return !!(u && u.email);
    },

    hasValidToken: function () {
      return tokenAlive(api.getUser(), 30 * 1000);
    },

    getAccessToken: function () {
      var u = api.getUser();
      return tokenAlive(u, 30 * 1000) ? u.accessToken : null;
    },

    onChange: function (fn) {
      listeners.push(fn);
      try { fn(api.getUser()); } catch (e) {}
      return function () {
        var i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    },

    signIn: function () {
      return requestAccessToken({ silent: false }).then(function (resp) {
        return fetchUserinfo(resp.access_token).then(function (info) {
          var user = {
            email: info.email,
            name: info.name,
            picture: info.picture,
            sub: info.sub,
            accessToken: resp.access_token,
            expiresAt: Date.now() + (Number(resp.expires_in) || 3600) * 1000
          };
          writeStore(user);
          fire();
          return user;
        });
      });
    },

    signOut: function () {
      var u = api.getUser();
      if (u && u.accessToken && window.google && google.accounts && google.accounts.oauth2) {
        try { google.accounts.oauth2.revoke(u.accessToken, function () {}); } catch (e) {}
      }
      writeStore(null);
      fire();
    },

    /**
     * Ensures a usable access token. Returns Promise<string|null>.
     * If profile cookie exists but token expired, performs silent re-auth.
     * Returns null when the user hasn't signed in or silent auth failed.
     */
    ensureFreshToken: function () {
      var u = api.getUser();
      if (!u) return Promise.resolve(null);
      if (tokenAlive(u, 60 * 1000)) return Promise.resolve(u.accessToken);
      return requestAccessToken({ silent: true, hint: u.email }).then(function (resp) {
        var merged = Object.assign({}, u, {
          accessToken: resp.access_token,
          expiresAt: Date.now() + (Number(resp.expires_in) || 3600) * 1000
        });
        writeStore(merged);
        fire();
        return resp.access_token;
      }).catch(function () {
        return null;
      });
    }
  };

  global.pgAuth = api;

  // ----- Auto-mounted header chip (YouTube-style) -------------------------
  // Any element with [data-pgauth-chip] becomes a Sign-in pill (signed-out)
  // or a circular avatar (signed-in). Clicking the avatar opens a small menu
  // with the user's name/email and a Sign out option.

  var CHIP_CSS = '\
  .pgauth-chip-btn{appearance:none;-webkit-appearance:none;background:transparent;border:0;padding:0;margin:0;cursor:pointer;font-family:inherit;line-height:1;color:inherit;}\
  .pgauth-chip-btn:focus{outline:none;}\
  .pgauth-chip-btn:focus-visible{outline:2px solid #4d90fe;outline-offset:2px;}\
  .pgauth-chip-btn[data-state="out"]{display:inline-flex;align-items:center;gap:6px;padding:7px 12px 7px 10px;border:1px solid rgba(255,255,255,0.16);border-radius:18px;font-size:12px;font-weight:600;color:#8ab4f8;background:rgba(138,180,248,0.06);transition:background .15s, border-color .15s;}\
  .pgauth-chip-btn[data-state="out"]:hover{background:rgba(138,180,248,0.14);border-color:rgba(138,180,248,0.4);}\
  .pgauth-chip-btn[data-state="in"]{width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;background:#3c4043;color:#fff;font-weight:700;font-size:13px;transition:box-shadow .15s, transform .12s;}\
  .pgauth-chip-btn[data-state="in"]:hover{box-shadow:0 0 0 2px rgba(255,255,255,0.18);}\
  .pgauth-chip-btn[data-state="in"] img{width:100%;height:100%;object-fit:cover;display:block;}\
  .pgauth-chip-svg{width:14px;height:14px;display:block;flex-shrink:0;}\
  .pgauth-menu{position:absolute;z-index:9999;min-width:260px;background:#1f1f1f;color:#e8eaed;border:1px solid rgba(255,255,255,0.08);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3);padding:14px 0 6px;font-family:inherit;font-size:13px;line-height:1.3;}\
  .pgauth-menu-header{display:flex;align-items:center;gap:12px;padding:4px 18px 14px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:6px;}\
  .pgauth-menu-avatar{width:40px;height:40px;border-radius:50%;background:#3c4043;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;overflow:hidden;flex-shrink:0;}\
  .pgauth-menu-avatar img{width:100%;height:100%;object-fit:cover;display:block;}\
  .pgauth-menu-name{font-weight:600;font-size:14px;color:#fff;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
  .pgauth-menu-email{color:#9aa0a6;font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
  .pgauth-menu-item{display:flex;align-items:center;gap:14px;padding:10px 18px;font-size:13px;color:#e8eaed;background:transparent;border:0;width:100%;text-align:left;cursor:pointer;font-family:inherit;}\
  .pgauth-menu-item:hover{background:rgba(255,255,255,0.06);}\
  .pgauth-menu-item .pgauth-menu-icon{font-size:15px;width:18px;text-align:center;}\
  body.light-theme .pgauth-chip-btn[data-state="out"]{border-color:rgba(0,0,0,0.18);color:#1a73e8;background:rgba(26,115,232,0.06);}\
  body.light-theme .pgauth-chip-btn[data-state="out"]:hover{background:rgba(26,115,232,0.12);border-color:rgba(26,115,232,0.4);}\
  body.light-theme .pgauth-menu{background:#fff;color:#202124;border-color:rgba(0,0,0,0.1);box-shadow:0 8px 28px rgba(0,0,0,0.18);}\
  body.light-theme .pgauth-menu-header{border-bottom-color:rgba(0,0,0,0.08);}\
  body.light-theme .pgauth-menu-name{color:#202124;}\
  body.light-theme .pgauth-menu-email{color:#5f6368;}\
  body.light-theme .pgauth-menu-item{color:#202124;}\
  body.light-theme .pgauth-menu-item:hover{background:rgba(0,0,0,0.05);}\
  @media(max-width:600px){\
    .pgauth-chip-btn[data-state="out"]{padding:6px 8px;font-size:0;gap:0;}\
    .pgauth-chip-btn[data-state="out"] .pgauth-chip-svg{width:18px;height:18px;}\
    .pgauth-chip-btn[data-state="in"]{width:28px;height:28px;font-size:12px;}\
    .pgauth-menu{max-width:calc(100vw - 16px);min-width:240px;}\
    .pgauth-menu-name,.pgauth-menu-email{max-width:calc(100vw - 100px);}\
  }';

  function injectCss() {
    if (document.getElementById('pgauth-chip-css')) return;
    var s = document.createElement('style');
    s.id = 'pgauth-chip-css';
    s.textContent = CHIP_CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function initialsFromUser(u) {
    if (!u) return '?';
    var src = (u.name || u.email || '').trim();
    if (!src) return '?';
    var parts = src.split(/[\s@.]+/).filter(Boolean);
    var s = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
    return (s || src[0]).toUpperCase();
  }

  function renderChip(el) {
    injectCss();
    el.classList.add('pgauth-chip-btn');
    el.setAttribute('type', 'button');
    el.innerHTML = '';
    var user = api.getUser();
    if (user && user.email) {
      el.setAttribute('data-state', 'in');
      el.setAttribute('aria-label', 'Account: ' + user.email);
      el.title = user.email;
      if (user.picture) {
        var img = document.createElement('img');
        img.src = user.picture;
        img.alt = '';
        img.referrerPolicy = 'no-referrer';
        el.appendChild(img);
      } else {
        var letters = document.createElement('span');
        letters.textContent = initialsFromUser(user);
        el.appendChild(letters);
      }
    } else {
      el.setAttribute('data-state', 'out');
      el.setAttribute('aria-label', 'Sign in with Google');
      el.title = 'Sign in with Google';
      // Inline SVG person icon — matches YouTube's "Sign in" button style.
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('class', 'pgauth-chip-svg');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z');
      svg.appendChild(path);
      el.appendChild(svg);
      var label = document.createElement('span');
      label.textContent = 'Sign in';
      el.appendChild(label);
    }
  }

  var openMenuEl = null;
  var justClosedAt = 0;
  function closeMenu() {
    if (openMenuEl) {
      openMenuEl.remove();
      openMenuEl = null;
      document.removeEventListener('mousedown', onDocMouseDown, true);
      document.removeEventListener('keydown', onDocKey, true);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    }
  }
  function onDocMouseDown(ev) {
    if (!openMenuEl) return;
    if (openMenuEl.contains(ev.target)) return;
    // If the user clicked the chip that opened this menu, close here and mark a debounce
    // window so the chip's own click handler doesn't immediately reopen the menu.
    var chip = ev.target && ev.target.closest ? ev.target.closest('[data-pgauth-chip]') : null;
    if (chip) justClosedAt = Date.now();
    closeMenu();
  }
  function onDocKey(ev) {
    if (ev.key === 'Escape') closeMenu();
  }

  function openMenu(anchorEl) {
    closeMenu();
    var user = api.getUser();
    if (!user) return;
    var menu = document.createElement('div');
    menu.className = 'pgauth-menu';
    menu.setAttribute('role', 'menu');

    var header = document.createElement('div');
    header.className = 'pgauth-menu-header';
    var avatar = document.createElement('div');
    avatar.className = 'pgauth-menu-avatar';
    if (user.picture) {
      var img = document.createElement('img');
      img.src = user.picture;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      avatar.appendChild(img);
    } else {
      avatar.textContent = initialsFromUser(user);
    }
    header.appendChild(avatar);

    var info = document.createElement('div');
    var name = document.createElement('div');
    name.className = 'pgauth-menu-name';
    name.textContent = user.name || user.email.split('@')[0];
    var email = document.createElement('div');
    email.className = 'pgauth-menu-email';
    email.textContent = user.email;
    info.appendChild(name); info.appendChild(email);
    header.appendChild(info);
    menu.appendChild(header);

    function addItem(icon, label, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pgauth-menu-item';
      btn.setAttribute('role', 'menuitem');
      var ic = document.createElement('span'); ic.className = 'pgauth-menu-icon'; ic.textContent = icon;
      var tx = document.createElement('span'); tx.textContent = label;
      btn.appendChild(ic); btn.appendChild(tx);
      btn.addEventListener('click', function () { closeMenu(); onClick(); });
      menu.appendChild(btn);
    }
    addItem('↪', 'Sign out', function () { api.signOut(); });

    document.body.appendChild(menu);
    var rect = anchorEl.getBoundingClientRect();
    var mw = menu.offsetWidth;
    var left = Math.min(rect.right - mw, window.innerWidth - mw - 8);
    left = Math.max(8, left);
    menu.style.left = left + 'px';
    menu.style.top = (rect.bottom + 8) + 'px';

    openMenuEl = menu;
    // Defer listener attach so the click that opened the menu doesn't immediately close it.
    setTimeout(function () {
      document.addEventListener('mousedown', onDocMouseDown, true);
      document.addEventListener('keydown', onDocKey, true);
      window.addEventListener('resize', closeMenu);
      window.addEventListener('scroll', closeMenu, true);
    }, 0);
  }

  function chipClickHandler(ev) {
    if (!api) return;
    var el = ev.currentTarget;
    if (api.isSignedIn()) {
      // If the outside-click handler just closed the menu because the user clicked the
      // chip again, swallow this click — the menu is now closed, that's the desired state.
      if (Date.now() - justClosedAt < 300) return;
      if (openMenuEl) { closeMenu(); return; }
      openMenu(el);
    } else {
      api.signIn().catch(function (err) {
        var msg = err && err.message ? err.message : 'unknown error';
        alert('Sign-in failed: ' + msg);
      });
    }
  }

  function mountChips() {
    var nodes = document.querySelectorAll('[data-pgauth-chip]');
    if (!nodes.length) return;
    nodes.forEach(function (el) {
      if (el.__pgauthMounted) { renderChip(el); return; }
      el.__pgauthMounted = true;
      el.addEventListener('click', chipClickHandler);
      renderChip(el);
    });
  }

  function whenDOMReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }
  whenDOMReady(mountChips);
  api.onChange(function () { closeMenu(); mountChips(); });

  // Cross-tab sync: when another tab updates the local fallback, refresh state here.
  try {
    window.addEventListener('storage', function (ev) {
      if (ev.key === LOCAL_KEY) fire();
    });
  } catch (e) {}

  // Best-effort silent refresh on load if we already have a profile.
  if (cachedUser && cachedUser.email && !tokenAlive(cachedUser, 60 * 1000)) {
    setTimeout(function () { api.ensureFreshToken(); }, 300);
  }
})(window);
