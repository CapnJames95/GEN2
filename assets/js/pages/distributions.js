// Distributions / event Pokémon — Gen 2 (Gold, Silver, Crystal)
//
// Gen 2 used several distribution mechanisms:
//   - Mystery Gift (IR) — exchange items / decorations between two GBCs.
//   - Pokémon News Machine — daily download in Crystal (Mobile Adapter, JP).
//   - GS Ball / Pokémon Center NY — unlocked the Celebi shrine in Ilex Forest.
//   - Stadium 2 transfers (carry-over from Pokémon Stadium 2 unlocks).
//   - Nintendo Promotional events — Mew, Celebi distributions on cart.

window.GEN2_DISTRIBUTIONS = [
  // ── Event Pokémon ─────────────────────────────────────────
  {
    cat: 'event-pkmn',
    name: 'Celebi',
    num: 251,
    games: ['E'],
    region: 'JP / NA',
    period: '2000-2001',
    method: 'GS Ball at Ilex Forest shrine',
    detail: 'After receiving the GS Ball from the Pokémon Center NY (or via Pokémon Mobile in JP Crystal), give it to Kurt. He returns it 24 hours later; place it on the Ilex Forest shrine to encounter Celebi at Lv30.',
    held: '—'
  },
  {
    cat: 'event-pkmn',
    name: 'Mew',
    num: 151,
    games: ['FR','LG','E'],
    region: 'Worldwide',
    period: '1999-2001',
    method: 'Nintendo event distribution / Pokémon Stadium 2',
    detail: 'Distributed at official Nintendo events (Mew Mall Tour, Toys R Us, Pokémon Center NY). Could not be obtained without an event. Also transferable from Pokémon Stadium 2 unlocks.',
    held: '—'
  },
  // ── Mystery Gift items (Crystal IR + Pokémon News) ───────
  {
    cat: 'item',
    name: 'Egg / Odd Egg',
    num: null,
    games: ['E'],
    region: 'Worldwide',
    period: '2001+',
    method: 'Mr. Pokémon (Route 30) + Day Care egg system',
    detail: 'Crystal\'s Odd Egg from the Goldenrod Game Corner has a high shiny chance and hatches one of: Pichu, Cleffa, Igglybuff, Tyrogue, Smoochum, Elekid, Magby.',
    held: 'Varies'
  },
  {
    cat: 'item',
    name: 'Berries (Mystery Gift)',
    num: null,
    games: ['FR','LG','E'],
    region: 'Worldwide',
    period: 'Anytime',
    method: 'Daily Mystery Gift (IR) from a friend',
    detail: 'One Mystery Gift exchange per day per friend. Possible rewards: Berry, Gold Berry, Mystery Berry, Bitter/Mint/Burnt Berry, Pink/Surf/Big Mushroom, decorations.',
    held: '—'
  },
  {
    cat: 'item',
    name: 'Decoration: Big Doll',
    num: null,
    games: ['FR','LG','E'],
    region: 'Worldwide',
    period: 'Anytime',
    method: 'Mystery Gift / Goldenrod Dept. Store',
    detail: 'Rare Mystery Gift reward — Big Snorlax / Big Lapras / Big Onix dolls. Decorate your bedroom in the player\'s house.',
    held: '—'
  },
  // ── Pokémon News (Crystal only, JP Mobile Adapter) ───────
  {
    cat: 'news',
    name: 'Pokémon News Machine',
    num: null,
    games: ['E'],
    region: 'JP only',
    period: '2001-2002',
    method: 'Mobile Adapter GB (Crystal JP)',
    detail: 'Downloaded daily news, special battles, and Mystery Gift items from Nintendo\'s mobile service. Service ended 2002 — never localized.',
    held: '—'
  },
  // ── Stadium 2 unlocks ─────────────────────────────────────
  {
    cat: 'stadium',
    name: 'Round 2 Gift Pokémon',
    num: null,
    games: ['FR','LG','E'],
    region: 'Worldwide',
    period: 'Stadium 2 unlock',
    method: 'Win Pokémon Stadium 2 Round 2',
    detail: 'Win all cups in Round 2 to unlock GS Ball trade with Earl. Stadium 2 also lets you rent / transfer Pokémon, including obtaining the three starter lines you didn\'t pick.',
    held: '—'
  },
  {
    cat: 'stadium',
    name: 'Surfing Pikachu',
    num: 25,
    games: ['FR','LG','E'],
    region: 'Worldwide',
    period: 'Stadium 2 unlock',
    method: 'Beat Pika Cup in Stadium 2',
    detail: 'Pikachu rewarded with the move Surf, which it cannot learn through normal means. Required to access the Mystery Gift Beach mini-game.',
    held: '—'
  }
];

window.getDistributionEntries = function() { return window.GEN2_DISTRIBUTIONS; };

var DIST_CATS = {
  'event-pkmn': { label: 'Event Pokémon', color: '#E5B928', icon: '⭐' },
  'item':       { label: 'Mystery Gift Items', color: '#7FB8E0', icon: '🎁' },
  'news':       { label: 'Pokémon News (JP Mobile)', color: '#B0BEC5', icon: '📡' },
  'stadium':    { label: 'Stadium 2 Unlocks', color: '#9966CC', icon: '🏆' }
};

var DIST_GAME_LABELS = { FR: 'Gold', LG: 'Silver', E: 'Crystal' };
var DIST_GAME_COLORS = { FR: '#E5B928', LG: '#B0BEC5', E: '#7FB8E0' };

function buildDistributionsPage() {
  var el = document.getElementById('distributions-content') || document.getElementById('page-distributions');
  if (!el) return;
  var entries = window.GEN2_DISTRIBUTIONS;
  var byCat = {};
  entries.forEach(function(e) { (byCat[e.cat] = byCat[e.cat] || []).push(e); });

  var out = '<div class="panel" style="padding:22px;max-width:980px;margin:0 auto;">'
    + '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">EVENT DISTRIBUTIONS — GEN 2</div>'
    + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:18px;">'
    + 'Gen 2 distributed special Pokémon and items through Mystery Gift (Infrared), the Pokémon News Machine (Crystal Mobile, Japan only), Stadium 2 unlocks, and live Nintendo events. '
    + 'Far fewer events than later generations, but Celebi and Mew were both legitimate cart distributions.'
    + '</div>';

  Object.keys(DIST_CATS).forEach(function(catKey) {
    var rows = byCat[catKey] || [];
    if (!rows.length) return;
    var meta = DIST_CATS[catKey];
    out += '<div style="margin-bottom:22px;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:' + meta.color + ';letter-spacing:0.5px;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px;">'
      + meta.icon + ' ' + meta.label.toUpperCase() + '</div>';
    rows.forEach(function(r) {
      var gameBadges = r.games.map(function(g) {
        return '<span style="display:inline-block;background:' + DIST_GAME_COLORS[g] + ';color:#000;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;margin-right:3px;">' + DIST_GAME_LABELS[g] + '</span>';
      }).join('');
      var sprite = r.num
        ? '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + r.num + '.png" width="48" height="48" style="image-rendering:pixelated;flex-shrink:0;" onerror="this.style.display=\'none\'">'
        : '<div style="font-size:32px;flex-shrink:0;line-height:1;">' + meta.icon + '</div>';
      out += '<div class="dist-card" style="background:var(--card);border:1px solid var(--border);border-left:3px solid ' + meta.color + ';border-radius:6px;padding:12px 14px;margin-bottom:10px;display:flex;gap:14px;align-items:flex-start;">'
        + sprite
        + '<div style="flex:1;min-width:0;">'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:4px;">'
        + '<strong style="color:var(--text);font-size:13px;">' + r.name + '</strong>'
        + gameBadges
        + '<span style="font-size:10px;color:var(--muted);margin-left:auto;">' + r.region + ' · ' + r.period + '</span>'
        + '</div>'
        + '<div style="font-size:11px;color:var(--game-color,var(--gold));font-weight:700;margin-bottom:4px;">' + r.method + '</div>'
        + '<div style="font-size:11px;color:var(--muted);line-height:1.7;">' + r.detail + '</div>'
        + (r.held && r.held !== '—' ? '<div style="font-size:10px;color:var(--muted);margin-top:4px;">Held item: <strong style="color:var(--text);">' + r.held + '</strong></div>' : '')
        + '</div>'
        + '</div>';
    });
    out += '</div>';
  });

  out += '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:8px;">'
    + '<strong style="color:var(--text);">Note on later remakes:</strong> Several Gen-2 event Pokémon (Celebi, Mew, the Spiky-Eared Pichu) were re-distributed for HeartGold/SoulSilver. Those distributions only apply to HGSS, not original GSC.'
    + '</div>'
    + '</div>';

  el.innerHTML = out;
}

function buildDistributionChecklistPage() {
  buildDistributionsPage();
}
