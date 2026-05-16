// Gen 2 Phone Trainer Rematches
//
// In Gen 2 (Gold, Silver, Crystal), registered phone trainers call the
// player periodically to offer a rematch. Crystal expanded the system
// to about 30 trainers, each calling for rematches at specific times of
// day or after certain Gym Badges are earned. Some give items or
// notify the player about Swarm events instead.
//
// This page is a placeholder — the full Gen 2 phone-trainer roster
// will be added once verified against authoritative sources
// (Bulbapedia phone-trainer tables for Gold/Silver/Crystal).

function buildRematchesPage() {
  var el = document.getElementById('rematches-content');
  if (!el) return;
  el.innerHTML =
    '<div class="panel" style="padding:22px;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">PHONE TRAINER REMATCHES</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:12px;">' +
        'In Gen 2 Crystal (and to a lesser extent Gold/Silver) trainers you battle along routes can register their phone number. Once registered, they call you periodically to:' +
      '</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;margin-bottom:14px;">' +
        '<li>Offer a <strong style="color:var(--text);">rematch</strong> — usually at fixed days/times of the week</li>' +
        '<li>Notify of a <strong style="color:var(--text);">swarm</strong> — a rare wild Pokémon appearing on a route</li>' +
        '<li>Offer a <strong style="color:var(--text);">gift item</strong> (apricorn berries, healing items, etc.)</li>' +
        '<li>Hand out the occasional <strong style="color:var(--text);">happiness boost</strong> or <strong style="color:var(--text);">battle tip</strong></li>' +
      '</ul>' +
      '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">' +
        'Each phone trainer requires being battled at a specific location and saying yes when they ask to register their number. Some trainers (e.g. Schoolboy Alan, Picnicker Liz) only register after a particular badge is earned.' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);">' +
        '<strong style="color:var(--text);">Coming soon:</strong> the full Crystal phone-trainer roster with locations, rematch days/times, and battle teams.' +
      '</div>' +
    '</div>';
}
