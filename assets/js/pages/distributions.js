// Distributions / event Pokémon — Gen 2 (Gold, Silver, Crystal)
//
// Gen 2 used Mystery Gift via Infrared (IR) — a small protocol that
// allowed two Game Boy Colors to exchange items, decorations, or a
// Pokémon News download. Major Gen 2 events:
//   - GS Ball (Pokémon Center Mystery Gift Mobile-only in Crystal,
//     unlocks Celebi at the Ilex Forest shrine)
//   - Crystal Pichu (notch-eared Spiky-Eared Pichu was Gen 4 — not Gen 2)
//   - Pokémon News Machine cards (decorations, special items)
//   - Mew, Celebi: event-only distributions via Nintendo events
//
// Stub: a curated Gen 2 event list will be added in a follow-up pass.

window.getDistributionEntries = window.getDistributionEntries || function() {
  return [];
};

function buildDistributionsPage() {
  var el = document.getElementById('distributions-content') || document.getElementById('page-distributions');
  if (!el) return;
  el.innerHTML =
    '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:14px;letter-spacing:1px;">EVENT DISTRIBUTIONS — GEN 2</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.7;margin-bottom:14px;">' +
        'Gen 2 used <strong>Mystery Gift</strong> over Infrared (IR) and the Pokémon News Machine to deliver special items, decorations, and event Pokémon. Distributions were rarer than in later generations and varied by region.' +
      '</div>' +
      '<ul style="font-size:12px;color:var(--muted);line-height:1.9;margin-left:18px;margin-bottom:14px;">' +
        '<li><strong style="color:var(--text);">GS Ball</strong> — Crystal Mobile only. Unlocked the Celebi event at Ilex Forest.</li>' +
        '<li><strong style="color:var(--text);">Celebi</strong> — Mystery Gift / Pokémon Mobile event distributions in Japan; rerun via Nintendo Events in later remakes.</li>' +
        '<li><strong style="color:var(--text);">Mew</strong> — distribution event Pokémon (originally a glitch in Gen 1 but distributed legitimately for Gen 2 via Stadium-2 / events).</li>' +
        '<li>Pokémon News Machine cards: assorted Berries, Decorations, Trainer cards.</li>' +
      '</ul>' +
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:var(--muted);line-height:1.7;">' +
        '<strong style="color:var(--text);">Coming soon:</strong> verified Gen 2 distribution catalogue.' +
      '</div>' +
    '</div>';
}

function buildDistributionChecklistPage() {
  // Reuse the same content for now
  buildDistributionsPage();
}
