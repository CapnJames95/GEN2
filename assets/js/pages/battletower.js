// Battle Tower — Crystal-exclusive post-game challenge
//
// The Battle Tower replaces Pokémon Stadium 2 as the endgame challenge in
// Pokémon Crystal. It's accessed via the Magnet Train terminal in Olivine
// after defeating the Elite Four and obtaining all 16 badges. Located on
// a small spit of land east of Cianwood, accessible after Surf.
//
// Format: 7 consecutive battles, choose 3 Pokémon. Level caps:
//   - Lv. 30, 50, 70, or 100 brackets
//   - All chosen Pokémon are scaled to the bracket's cap
// Rules:
//   - No held items
//   - No duplicate species
//   - No duplicate held items (held items are stripped anyway)
//   - Each battle uses random opponent teams
// Reward: clearing 7 in a row earns a TM prize and a Pokémon's Battle
// Tower record entry.

function buildBattleTowerPage() {
  var el = document.getElementById('battletower-content') || document.getElementById('page-battletower');
  if (!el) return;
  el.innerHTML =
    '<div style="max-width:900px;margin:0 auto;">' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">BATTLE TOWER — CRYSTAL ONLY</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.7;">' +
      'The Battle Tower is <strong style="color:var(--text);">exclusive to Pokémon Crystal</strong> (Gold and Silver don\'t have it). Located east of Cianwood via Surf. Open after defeating the Elite Four and clearing all 16 Gym badges.' +
    '</div>' +
    '<div class="panel" style="padding:18px;margin-bottom:16px;">' +
      '<div style="font-weight:700;color:var(--text);margin-bottom:8px;">Format</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;">' +
        '<li><strong>7 consecutive battles</strong> with no healing between</li>' +
        '<li>Choose <strong>3 Pokémon</strong> from your boxes</li>' +
        '<li>Level cap brackets: <strong>Lv. 30, Lv. 50, Lv. 70, or Lv. 100</strong></li>' +
        '<li>All your Pokémon scale to the bracket\'s cap (under-leveled → leveled up; over-leveled → temporarily reduced)</li>' +
        '<li>Held items <strong>stripped</strong> for the duration</li>' +
        '<li>No duplicate species in your team</li>' +
      '</ul>' +
    '</div>' +
    '<div class="panel" style="padding:18px;margin-bottom:16px;">' +
      '<div style="font-weight:700;color:var(--text);margin-bottom:8px;">Rewards</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;">' +
        '<li>Clear 7 consecutive battles → <strong>TM prize</strong></li>' +
        '<li>Win streaks tracked separately per bracket (Lv.30 / 50 / 70 / 100)</li>' +
        '<li>Lance gives bonus prizes for completing all 4 brackets</li>' +
      '</ul>' +
    '</div>' +
    '<div class="panel" style="padding:18px;">' +
      '<div style="font-weight:700;color:var(--text);margin-bottom:8px;">Strategy notes</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;">' +
        '<li><strong>Sleep-talking Snorlax</strong>: Rest + Sleep Talk + Body Slam + Earthquake/Curse — the safest meta-defining set</li>' +
        '<li><strong>Counter / Mirror Coat</strong>: predict big damage and return it, excellent vs random AI</li>' +
        '<li><strong>Ground-immune Pokémon</strong>: most opponents pack Earthquake — Flying/Levitate types are valuable</li>' +
        '<li><strong>Avoid 4× weaknesses</strong>: AI exploits them aggressively in Lv.100 bracket</li>' +
        '<li>The Battle Tower uses <strong>fully EV/StatExp-maxed</strong> opponents — your own Pokémon should also be max stat-exp</li>' +
      '</ul>' +
    '</div>' +
    '</div>';
}
