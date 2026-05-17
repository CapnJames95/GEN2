// Gen 2 Phone Trainer Rematches
//
// Curated from Bulbapedia's phone-trainer tables. Crystal expanded the
// system significantly — Gold/Silver had a smaller set.

(function() {
  'use strict';

  // Source: Bulbapedia "Phone (Pokégear)" + per-trainer pages.
  // route — where you battle them and register.
  // days/time — when they call.
  // calls — what they offer over time (rematch / swarm / gift / tip).
  // teams — known rematch teams (later teams unlock after badges).
  var TRAINERS = [
    // ── YOUNGSTERS / SCHOOLBOYS ──────────────────────────────
    { name:'Joey',     class:'Youngster',  route:'Route 30', games:'G/S/C',
      days:'Mon · Wed · Sat', time:'Morning',
      calls:'Rematch (his Lv5→10→18→30 Rattata — the famous "TOP PERCENTAGE" line)',
      teams:'Rattata Lv2 → Lv13 (Zephyr) → Lv24 (Plain) → Lv30 (Storm) → Lv44 (Glacier)' },
    { name:'Mikey',    class:'Youngster',  route:'Route 33', games:'G/S/C',
      days:'Sat', time:'Morning',
      calls:'Rematch (Pidgey / Sandshrew)',
      teams:'Lv7 → Lv28 (post-Hive) → Lv43 (post-Rising)' },
    { name:'Alan',     class:'Schoolboy',  route:'Route 36', games:'G/S/C',
      days:'Tue · Thu', time:'Daytime',
      calls:'Rematch + occasional Stardust gift',
      teams:'Sandshrew → Sandslash; Magnemite → Magneton at higher tiers' },
    { name:'Jack',     class:'Schoolboy',  route:'Route 35', games:'G/S/C',
      days:'Mon · Wed · Sat', time:'Morning',
      calls:'Rematch + Magnet drop',
      teams:'Voltorb / Magnemite line evolving over time' },

    // ── PICNICKERS ──────────────────────────────────────────
    { name:'Liz',      class:'Picnicker',  route:'Route 32', games:'G/S/C',
      days:'Mon', time:'Afternoon',
      calls:'Rematch + Berry gift on certain calls',
      teams:'Hoothoot / Sentret line' },
    { name:'Tiffany',  class:'Picnicker',  route:'Route 37', games:'G/S/C',
      days:'Sun', time:'Daytime',
      calls:'Rematch + Pink Bow gift',
      teams:'Clefairy / Jigglypuff line; later Wigglytuff' },
    { name:'Brenda',   class:'Picnicker',  route:'Route 38', games:'G/S/C',
      days:'Thu', time:'Daytime',
      calls:'Rematch',
      teams:'Bug-type team' },

    // ── HIKERS ──────────────────────────────────────────────
    { name:'Anthony',  class:'Hiker',      route:'Route 33', games:'G/S/C',
      days:'Tue', time:'Daytime',
      calls:'Rematch (Rock-types)',
      teams:'Geodude → Graveler line' },
    { name:'Parry',    class:'Hiker',      route:'Route 45', games:'G/S/C',
      days:'Fri', time:'Daytime',
      calls:'Rematch — strong late-game Onix / Graveler',
      teams:'Strong Rock/Ground team — useful for Stat Exp grinding' },
    { name:'Wilton',   class:'Hiker',      route:'Route 45', games:'G/S/C',
      days:'Tue · Thu', time:'Morning',
      calls:'Rematch + Hard Stone gift',
      teams:'Graveler / Geodude pair' },

    // ── FISHERS ─────────────────────────────────────────────
    { name:'Tully',    class:'Fisher',     route:'Route 42', games:'G/S/C',
      days:'Mon · Wed · Sat', time:'Daytime',
      calls:'Fishing tip + Quick Claw on first call',
      teams:'Magikarp / Goldeen line' },
    { name:'Ralph',    class:'Fisher',     route:'Route 32', games:'G/S/C',
      days:'Wed', time:'Morning',
      calls:'Rematch + Magikarp swarm tip on alt calls',
      teams:'Krabby / Goldeen' },
    { name:'Wade',     class:'Bug Catcher',route:'Route 31', games:'G/S/C',
      days:'Tue · Thu · Sat', time:'Morning',
      calls:'Rematch — also calls about Bug swarms (Yanma, Pineco, Ledyba)',
      teams:'Caterpie / Weedle line; later Pinsir' },

    // ── COOLTRAINERS ────────────────────────────────────────
    { name:'Beth',     class:'Beauty',     route:'Route 26', games:'G/S/C',
      days:'Tue · Sat', time:'Night',
      calls:'Rematch — strong, high-level Psychics',
      teams:'Espeon / Wigglytuff line' },
    { name:'Reena',    class:'Cooltrainer',route:'Route 27', games:'G/S/C',
      days:'Wed', time:'Daytime',
      calls:'Rematch — high-end',
      teams:'Slowking / Steelix-tier teams' },
    { name:'Gaven',    class:'Cooltrainer',route:'Route 26', games:'G/S/C',
      days:'Sat', time:'Daytime',
      calls:'Rematch',
      teams:'Strong Kanto trainer team' },

    // ── SPECIAL ─────────────────────────────────────────────
    { name:'Buena',    class:'Radio DJ',   route:'Goldenrod Radio Tower', games:'G/S/C',
      days:'Daily 5pm–midnight', time:'Evening',
      calls:'Daily password — match it for Blue Card points (cash in for type-boost items, dolls, etc.)',
      teams:'No battle — purely the password reward loop' },
    { name:'Mom',      class:'NPC',        route:'Player\'s house', games:'G/S/C',
      days:'Anytime', time:'Any',
      calls:'Saves your money; can buy items / mood boosts; alerts when Berry trees regrow',
      teams:'—' },
    { name:'Prof. Elm',class:'NPC',        route:'New Bark Town', games:'G/S/C',
      days:'Anytime', time:'Any',
      calls:'Story hints + Egg-hatched alerts',
      teams:'—' },
    { name:'Bill',     class:'NPC',        route:'Goldenrod PC', games:'G/S/C',
      days:'After Ecruteak', time:'Any',
      calls:'One-time reminder to claim the Eevee gift',
      teams:'—' }
  ];

  var DAY_CLR = {
    'Mon':'#FF6B35','Tue':'#E5B928','Wed':'#3DA83D','Thu':'#1B8FE8',
    'Fri':'#9966CC','Sat':'#FFB6E1','Sun':'#B0BEC5'
  };
  function colorDays(s) {
    return (s || '').split(/(\bMon|\bTue|\bWed|\bThu|\bFri|\bSat|\bSun)\b/).map(function(part) {
      if (DAY_CLR[part]) return '<span style="color:'+DAY_CLR[part]+';font-weight:700;">'+part+'</span>';
      return part;
    }).join('');
  }

  var FILTER = { class:'all', q:'' };
  function pageRoot(id) { return document.getElementById(id); }

  function render() {
    var listEl = document.getElementById('rematches-list');
    if (!listEl) return;
    var q = (FILTER.q || '').toLowerCase().trim();
    var rows = TRAINERS.filter(function(t) {
      if (FILTER.class !== 'all' && t.class !== FILTER.class) return false;
      if (q) {
        var hay = (t.name+' '+t.class+' '+t.route+' '+t.days+' '+t.calls+' '+t.teams).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (!rows.length) {
      listEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);">No trainers match the filter.</div>';
      return;
    }

    listEl.innerHTML = rows.map(function(t) {
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid var(--game-color,var(--gold));border-radius:6px;padding:12px 14px;">'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:6px;">'
        + '<strong style="color:var(--text);font-size:13px;">' + t.name + '</strong>'
        + '<span style="font-size:10px;color:var(--game-color,var(--gold));font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">' + t.class + '</span>'
        + '<span style="font-size:10px;color:var(--muted);">📍 ' + t.route + '</span>'
        + '<span style="margin-left:auto;font-size:9px;background:var(--panel);padding:2px 6px;border-radius:3px;color:var(--muted);">' + t.games + '</span>'
        + '</div>'
        + '<div style="font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:4px;">'
        + '<strong style="color:var(--text);">Calls:</strong> ' + colorDays(t.days) + ' · ' + t.time
        + '</div>'
        + '<div style="font-size:11px;color:var(--text);line-height:1.7;">' + t.calls + '</div>'
        + (t.teams && t.teams !== '—' ? '<div style="font-size:10px;color:var(--muted);margin-top:4px;font-style:italic;">' + t.teams + '</div>' : '')
        + '</div>';
    }).join('');
  }

  window._rematchUpdate = function(k, v) { FILTER[k] = v; render(); };

  function buildRematchesPage() {
    var el = pageRoot('rematches-content');
    if (!el) return;
    var classes = Array.from(new Set(TRAINERS.map(function(t){ return t.class; }))).sort();
    el.innerHTML =
      '<div class="panel" style="padding:18px;max-width:1000px;margin:0 auto;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">PHONE TRAINER REMATCHES</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Trainers whose phone numbers you can register. They call you on specific days / times to offer a rematch, item gift, or swarm tip. '
      + 'Use rematches for clean post-game Stat-Exp grinding (Parry the Hiker, Cooltrainer Beth, and Cooltrainer Reena have the strongest teams).'
      + '</div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;">'
      +   '<input id="rmt-q" placeholder="🔍 Filter trainers, routes, days…" '
      +     'style="flex:1;min-width:240px;background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;" '
      +     'oninput="_rematchUpdate(\'q\', this.value)">'
      +   '<select onchange="_rematchUpdate(\'class\', this.value)" '
      +     'style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;">'
      +     '<option value="all">All classes</option>'
      +     classes.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('')
      +   '</select>'
      + '</div>'
      + '<div id="rematches-list" style="display:flex;flex-direction:column;gap:10px;"></div>'
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:14px;">'
      + '<strong style="color:var(--text);">Pokégear cap:</strong> 15 phone slots. Mom + Prof. Elm + Bill take 3 of them. Cherry-pick gift / rematch callers for the remaining 12.'
      + '</div>'
      + '</div>';
    render();
  }

  window.buildRematchesPage = buildRematchesPage;
})();
