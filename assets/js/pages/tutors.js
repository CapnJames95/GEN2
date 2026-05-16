// Gen 2 Move Tutors
//
// Gen 2 (Gold, Silver, Crystal) features a small set of move tutors found across Johto:
//   - Headbutt Tutor (Ilex Forest cabin / Charcoal Kiln area) — teaches Headbutt to any
//     compatible Pokémon. Required to find hidden Pokémon in Headbutt trees.
//   - Cut Tutor / HM Friend (Ilex Forest) — gives HM Cut once Charcoal is delivered.
//   - Dragon Breath Tutor (Mt. Mortar B1F, Crystal only) — old man teaches Dragon
//     Breath to compatible Pokémon.
//   - Move Reminder (Blackthorn City) — re-teaches any level-up move the Pokémon
//     learned earlier. Free in Gen 2 (becomes Heart Scales in later gens).
//   - Various NPCs around Goldenrod teach Frustration, Return, and Pain Split.

function buildTutorPage() {
  var el = document.getElementById('tutors-content');
  if (!el) {
    var tbody = document.getElementById('tutors-tbody');
    if (tbody) el = tbody.parentElement;
  }
  if (!el) return;

  var TYPE_COLORS = {Normal:'#9E9E9E',Fire:'#E8501A',Water:'#1B8FE8',Grass:'#3DA83D',Electric:'#D4A800',Ice:'#60C8C8',Fighting:'#B83020',Poison:'#8B3099',Ground:'#8B6840',Flying:'#6850C0',Psychic:'#D01868',Bug:'#78A810',Rock:'#807840',Ghost:'#4030A0',Dragon:'#5038E8',Dark:'#403030',Steel:'#9898A8'};

  var TUTORS = [
    {move:'Headbutt', type:'Normal', loc:'Ilex Forest (Boy near Charcoal Kiln)', games:'Gold, Silver, Crystal', note:'Required to find Headbutt-tree Pokémon. Teach to compatible Pokémon (not all species can learn it).'},
    {move:'Cut',      type:'Normal', loc:'Ilex Forest (after rescuing the Charcoal Kiln Farfetch\'d)', games:'Gold, Silver, Crystal', note:'HM01 given as reward — not strictly a tutor but commonly grouped here.'},
    {move:'Dragon Breath', type:'Dragon', loc:'Mt. Mortar B1F (old man)', games:'Crystal only', note:'Teaches Dragon Breath to any compatible Pokémon. Crystal-exclusive.'},
    {move:'Pain Split', type:'Normal', loc:'Goldenrod City house (right of Bike Shop)', games:'Gold, Silver, Crystal', note:'Single, free use.'},
    {move:'Sweet Scent', type:'Normal', loc:'National Park (gate guard)', games:'Gold, Silver, Crystal', note:'Causes wild Pokémon encounter.'},
    {move:'Frustration / Return', type:'Normal', loc:'Goldenrod City (two siblings)', games:'Gold, Silver, Crystal', note:'Free, can be re-taught.'},
    {move:'Move Reminder', type:'Normal', loc:'Blackthorn City (old man)', games:'Gold, Silver, Crystal', note:'Re-teaches any level-up move the Pokémon learned. Free in Gen 2 (Heart Scales in Gen 3+).'},
    {move:'Move Deleter', type:'Normal', loc:'Blackthorn City (old man, separate house)', games:'Gold, Silver, Crystal', note:'Forgets any move including HMs.'},
  ];

  var pill = function(t) { return '<span style="display:inline-block;font-size:8px;font-weight:800;padding:2px 6px;border-radius:3px;text-transform:uppercase;background:'+(TYPE_COLORS[t]||'#666')+';color:#fff;">'+t+'</span>'; };

  var rows = TUTORS.map(function(t){
    return '<tr style="border-bottom:1px solid var(--border);">'
      +'<td style="padding:8px 10px;font-size:12px;font-weight:700;color:var(--text);">'+t.move+'</td>'
      +'<td style="padding:8px 10px;">'+pill(t.type)+'</td>'
      +'<td style="padding:8px 10px;font-size:11px;color:var(--text);">'+t.loc+'</td>'
      +'<td style="padding:8px 10px;font-size:11px;color:var(--muted);">'+t.games+'</td>'
      +'<td style="padding:8px 10px;font-size:11px;color:var(--muted);line-height:1.5;">'+t.note+'</td>'
      +'</tr>';
  }).join('');

  el.innerHTML =
    '<div style="max-width:1000px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">MOVE TUTORS — GEN 2</div>' +
      '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.6;">' +
        'Tutors and special move-teaching NPCs across Johto and Kanto. Gen 2 also features the <strong style="color:var(--text);">Move Reminder</strong> in Blackthorn — a free service that re-teaches any level-up move the Pokémon already learned.' +
      '</div>' +
      '<div class="panel" style="padding:0;overflow:hidden;">' +
        '<table style="width:100%;border-collapse:collapse;">' +
          '<thead style="background:var(--card);">' +
            '<tr>' +
              '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Move</th>' +
              '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Type</th>' +
              '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Location</th>' +
              '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Games</th>' +
              '<th style="padding:10px;text-align:left;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Notes</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>'+rows+'</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
}
