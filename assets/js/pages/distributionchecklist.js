// Distribution checklist — Gen 2
//
// The standalone checklist UI; reuses the same Gen-2 placeholder content
// as the Distributions page until verified event data is added.

function buildDistributionChecklistPage() {
  var root = document.getElementById('distributionchecklist-content') || document.getElementById('page-distributionchecklist');
  if (!root) return;
  root.innerHTML =
    '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">DISTRIBUTION CHECKLIST — GEN 2</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;">' +
        'A trackable checklist of every Gen 2 event Pokémon and item distribution. Pending verified Gen 2 distribution data.' +
      '</div>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);line-height:1.7;">' +
        '<strong style="color:var(--text);">Coming soon.</strong> See the <em>Distributions</em> page for a summary of known Gen 2 events.' +
      '</div>' +
    '</div>';
}
