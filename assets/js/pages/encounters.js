// Wild encounters page — Gen 2 (Gold, Silver, Crystal)
//
// Stub: full Gen 2 encounter tables for every route + time-of-day slot
// (morning / day / night) across all three games will be added in a
// dedicated data pass. Gen 2's day/night system adds significant variation
// — many Pokémon are exclusive to morning, day, or night encounters.

function buildEncountersPage() {
  var el = document.getElementById('encounters-content') || document.getElementById('page-encounters');
  if (!el) return;
  el.innerHTML =
    '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">WILD ENCOUNTERS — GEN 2</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;">' +
        'Gen 2 introduced a <strong>time-of-day</strong> system that varies wild encounters by morning, day, and night across every route. Each game (Gold, Silver, Crystal) has its own slight variations on availability — and Crystal adds the <strong>Bug-Catching Contest</strong> and the <strong>Headbutt-tree</strong> mechanic on top.' +
      '</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;margin-bottom:14px;">' +
        '<li>Grass: 4 slots × 3 time-of-day windows = 12 possible encounters per route</li>' +
        '<li>Surf: 1 slot regardless of time</li>' +
        '<li>Fishing: Old / Good / Super Rod slots</li>' +
        '<li>Headbutt trees: Bug-types, sometimes rarer (e.g. Aipom, Heracross)</li>' +
        '<li>Rock Smash: Geodude usually, occasionally Shuckle (Cianwood)</li>' +
        '<li>Swarms: dynamic phone-call notifications swap a route\'s rare slot</li>' +
      '</ul>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);line-height:1.7;">' +
        '<strong style="color:var(--text);">Coming soon:</strong> per-route × per-game × per-time-of-day encounter tables, with level ranges, rarity percentages, swarm notes, and Bug-Catching-Contest pools.' +
      '</div>' +
    '</div>';
}
