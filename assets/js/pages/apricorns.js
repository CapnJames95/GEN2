// Gen 2 Apricorns / Kurt — custom Poké Balls (replaces Berry Farming from Gen 3)
//
// In Gen 2 you collect Apricorns (7 colours) from special trees scattered
// across Johto. Bring them to Kurt in Azalea Town and he'll convert each
// type into a unique Poké Ball overnight (one ball per Apricorn, one
// conversion per game day).

function buildApricornsPage() {
  var el = document.getElementById('apricorns-content') || document.getElementById('page-apricorns');
  if (!el) return;

  var APRICORNS = [
    {col:'#000', name:'Black Apricorn', ball:'Heavy Ball',
     effect:'Catch rate scales with target weight. Better for heavier Pokémon.',
     trees:'Route 42 · Route 44'},
    {col:'#1B8FE8', name:'Blue Apricorn', ball:'Lure Ball',
     effect:'4× catch rate on Pokémon caught while Fishing.',
     trees:'Route 42 · Route 44'},
    {col:'#3DA83D', name:'Green Apricorn', ball:'Friend Ball',
     effect:'Caught Pokémon starts with 200 happiness (vs. normal 70).',
     trees:'Route 37 · Route 38 · Route 42'},
    {col:'#FF1493', name:'Pink Apricorn', ball:'Love Ball',
     effect:'8× catch rate if target is the opposite gender of your active Pokémon AND same species.',
     trees:'Route 38 · Route 39'},
    {col:'#E5B928', name:'Yellow Apricorn', ball:'Moon Ball',
     effect:'4× catch rate on Pokémon that evolve via Moon Stone. (Note: bugged in G/S — fixed in Crystal.)',
     trees:'Route 42'},
    {col:'#FFFFFF', name:'White Apricorn', ball:'Fast Ball',
     effect:'4× catch rate on Pokémon with base Speed ≥100. (Bugged in G/S — only worked on 3 specific Pokémon. Fixed in Crystal.)',
     trees:'Route 36 · Route 42'},
    {col:'#FF0000', name:'Red Apricorn', ball:'Level Ball',
     effect:'2×/4×/8× catch rate scaling with your Pokémon\'s level vs target\'s.',
     trees:'Route 36 · Route 38'},
  ];

  el.innerHTML =
    '<div style="max-width:1000px;margin:0 auto;">' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">APRICORNS & KURT — GEN 2</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:18px;line-height:1.7;">' +
      'Kurt lives in <strong style="color:var(--text);">Azalea Town</strong> (top-left house, near Slowpoke Well). Bring him Apricorns from coloured trees around Johto and he\'ll convert each into a unique Poké Ball — one ball per day per Apricorn handed in. He\'ll only work on one Apricorn at a time, so prioritise Friend Balls + Heavy Balls for early-game value.' +
    '</div>' +
    '<div class="panel" style="padding:0;overflow:hidden;">' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<thead style="background:var(--card);"><tr>' +
          '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);">Apricorn</th>' +
          '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);">Ball</th>' +
          '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);">Effect</th>' +
          '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);">Trees</th>' +
        '</tr></thead><tbody>' +
        APRICORNS.map(function(a){
          return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:8px 10px;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:'+a.col+';border:1px solid #444;vertical-align:middle;margin-right:6px;"></span><strong style="color:var(--text);">'+a.name+'</strong></td>' +
            '<td style="padding:8px 10px;font-weight:700;color:var(--text);">'+a.ball+'</td>' +
            '<td style="padding:8px 10px;font-size:12px;color:var(--muted);line-height:1.6;">'+a.effect+'</td>' +
            '<td style="padding:8px 10px;font-size:11px;color:var(--muted);">'+a.trees+'</td>' +
            '</tr>';
        }).join('') +
      '</tbody></table>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-top:18px;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:6px;line-height:1.7;">' +
      '<strong style="color:var(--text);">Kurt timing:</strong> hand in Apricorns, wait one full in-game day (the GBC clock advances based on real time — change the system time if testing), then pick up the finished balls. He can only work on one batch at a time, so if you hand in more before picking up the first batch, the new ones queue and you wait further. <br/><br/>' +
      '<strong style="color:var(--text);">Trees regrow:</strong> each Apricorn tree gives one Apricorn per day. After 1–2 days the tree is ready again. There are dedicated Apricorn-only trees and a few that mix in with Headbutt trees.' +
    '</div>' +
    '</div>';
}
