// Item locations — Gen 2 (Gold, Silver, Crystal)
//
// Stub: full item location data for every Pokéball, TM, evolution stone,
// rare candy, and hold-item pickup across Johto + Kanto will be added in a
// dedicated data pass.

function buildItemLocsPage() {
  var el = document.getElementById('itemlocs-content') || document.getElementById('page-itemlocs');
  if (!el) return;
  el.innerHTML =
    '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">ITEM LOCATIONS — GEN 2</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;">' +
        'Gen 2 introduced <strong>held items</strong> — a Pokémon can carry one held item that affects battle (e.g. Berry, Quick Claw, Leftovers). Wild Pokémon also carry items at small probabilities.' +
      '</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;margin-bottom:14px;">' +
        '<li>Apricorns: 7 colours, traded with Kurt in Azalea Town for custom Poké Balls (Heavy Ball, Lure Ball, Friend Ball, Love Ball, Level Ball, Moon Ball, Fast Ball)</li>' +
        '<li>Evolution stones: most found via Mt. Mortar, Bill\'s grandfather, or the Bug-Catching Contest</li>' +
        '<li>TMs: 50 total across Johto + Kanto Gym prizes, Game Corner exchanges, and hidden pickups</li>' +
        '<li>Wild-held: Leftovers (Snorlax 5%), Lucky Egg (Chansey 5%), Pink Bow (Clefairy), Black Belt (Hitmons), etc.</li>' +
        '<li>The GS Ball event (Crystal Mobile) and post-game items in the Ruins of Alph</li>' +
      '</ul>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);line-height:1.7;">' +
        '<strong style="color:var(--text);">Coming soon:</strong> the full Gen 2 item location index with map references and route notes.' +
      '</div>' +
    '</div>';
}
