// Pokémon learnsets — Gen 2 (Gold, Silver, Crystal)
//
// Stub: full Gen-2 level-up + TM/HM + egg-move learnsets for all 251
// Pokémon will be added in a dedicated data pass. Gen 2 learnsets differ
// substantially from later generations — many Pokémon learned moves at
// different levels in Gen 2 than in Gen 3+. Egg moves were introduced in
// Gen 2 (alongside breeding) and the move set is unique to this gen.

function buildLearnsetsPage() {
  var el = document.getElementById('learnsets-content') || document.getElementById('page-learnsets');
  if (!el) return;
  el.innerHTML =
    '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">LEARNSETS — GEN 2</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;">' +
        'Gen 2 was the first generation to feature <strong>breeding</strong>, which introduced <strong>egg moves</strong> — moves a baby can be hatched with by chaining specific male parent moves. Egg moves can\'t be learned any other way and many are highly competitive.' +
      '</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;margin-bottom:14px;">' +
        '<li>Level-up moves (different from Gen 1 and later gens for most Pokémon)</li>' +
        '<li>50 TMs + 7 HMs (different list from Gen 3)</li>' +
        '<li>Egg moves — chained via Egg Groups</li>' +
        '<li>Move Tutors (see <em>Tutors</em> page)</li>' +
        '<li>Move Reminder (Blackthorn City) — free re-learn of any previously known level-up move' +
      '</ul>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);line-height:1.7;">' +
        '<strong style="color:var(--text);">Coming soon:</strong> full per-Pokémon learnsets including level-up moves, TM/HM compatibility, and egg-move chains.' +
      '</div>' +
    '</div>';
}
