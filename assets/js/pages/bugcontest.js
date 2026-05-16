// Bug-Catching Contest — National Park (Gen 2)
//
// Available every Tuesday, Thursday, and Saturday at the National Park
// entrance (Route 35, north of Goldenrod). 20 trainers enter; you have
// 20 minutes to catch the strongest Bug Pokémon. Score = base stats +
// rarity + how much HP they had remaining when caught.

function buildBugContestPage() {
  var el = document.getElementById('bugcontest-content') || document.getElementById('page-bugcontest');
  if (!el) return;

  // Pokémon available — slightly different between Gold/Silver and Crystal
  var ROSTER_GS = [
    {name:'Caterpie',  prob:'20%', tier:'Common'},
    {name:'Weedle',    prob:'20%', tier:'Common'},
    {name:'Metapod',   prob:'10%', tier:'Common'},
    {name:'Kakuna',    prob:'10%', tier:'Common'},
    {name:'Paras',     prob:'10%', tier:'Uncommon'},
    {name:'Venonat',   prob:'10%', tier:'Uncommon'},
    {name:'Butterfree',prob:'5%',  tier:'Rare'},
    {name:'Beedrill',  prob:'5%',  tier:'Rare'},
    {name:'Pinsir',    prob:'5%',  tier:'Very Rare'},
    {name:'Scyther',   prob:'5%',  tier:'Very Rare'},
  ];

  var ROSTER_C = [
    {name:'Caterpie',  prob:'20%', tier:'Common'},
    {name:'Weedle',    prob:'20%', tier:'Common'},
    {name:'Metapod',   prob:'10%', tier:'Common'},
    {name:'Kakuna',    prob:'10%', tier:'Common'},
    {name:'Paras',     prob:'10%', tier:'Uncommon'},
    {name:'Venonat',   prob:'10%', tier:'Uncommon'},
    {name:'Butterfree',prob:'10%', tier:'Uncommon (Crystal: bumped)'},
    {name:'Pinsir',    prob:'5%',  tier:'Rare'},
    {name:'Scyther',   prob:'5%',  tier:'Rare'},
    {name:'Heracross', prob:'1%',  tier:'Very Rare (Crystal only)'},
  ];

  var PRIZES = [
    {place:'1st place', prize:'Sun Stone — evolves Gloom→Bellossom, Sunkern→Sunflora'},
    {place:'2nd place', prize:'Everstone — prevents evolution while held'},
    {place:'3rd place', prize:'Gold Berry — heals 30 HP when below 50%'},
    {place:'Top 5 (4th–5th)', prize:'Berry'},
    {place:'6th onwards', prize:'Berry (consolation)'},
  ];

  el.innerHTML =
    '<div style="max-width:1000px;margin:0 auto;">' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">BUG-CATCHING CONTEST</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.7;">' +
      'National Park, Tuesday / Thursday / Saturday. Speak to the gate guard to enter — you get 20 minutes and 20 Park Balls (high catch rate, contest-only). 20 trainers compete; the catch with the highest <strong style="color:var(--text);">score</strong> (base stats + HP remaining + rarity bonus) wins.' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-bottom:18px;">' +
      '<div class="panel" style="padding:0;overflow:hidden;">' +
        '<div style="padding:10px 14px;background:var(--card);font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));border-bottom:1px solid var(--border);">GOLD / SILVER ROSTER</div>' +
        '<table style="width:100%;border-collapse:collapse;">' +
          ROSTER_GS.map(function(p){
            return '<tr style="border-bottom:1px solid var(--border);">' +
              '<td style="padding:7px 10px;font-weight:700;color:var(--text);">'+p.name+'</td>' +
              '<td style="padding:7px 10px;font-size:11px;color:var(--muted);text-align:right;">'+p.prob+'</td>' +
              '<td style="padding:7px 10px;font-size:10px;color:var(--muted);">'+p.tier+'</td>' +
            '</tr>';
          }).join('') +
        '</table>' +
      '</div>' +
      '<div class="panel" style="padding:0;overflow:hidden;">' +
        '<div style="padding:10px 14px;background:var(--card);font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));border-bottom:1px solid var(--border);">CRYSTAL ROSTER</div>' +
        '<table style="width:100%;border-collapse:collapse;">' +
          ROSTER_C.map(function(p){
            return '<tr style="border-bottom:1px solid var(--border);">' +
              '<td style="padding:7px 10px;font-weight:700;color:var(--text);">'+p.name+'</td>' +
              '<td style="padding:7px 10px;font-size:11px;color:var(--muted);text-align:right;">'+p.prob+'</td>' +
              '<td style="padding:7px 10px;font-size:10px;color:var(--muted);">'+p.tier+'</td>' +
            '</tr>';
          }).join('') +
        '</table>' +
      '</div>' +
    '</div>' +

    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin-bottom:8px;">PRIZES</div>' +
    '<div class="panel" style="padding:0;overflow:hidden;margin-bottom:18px;">' +
      '<table style="width:100%;border-collapse:collapse;">' +
        PRIZES.map(function(p){
          return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:8px 10px;font-weight:700;color:var(--text);min-width:140px;">'+p.place+'</td>' +
            '<td style="padding:8px 10px;font-size:11px;color:var(--muted);">'+p.prize+'</td>' +
          '</tr>';
        }).join('') +
      '</table>' +
    '</div>' +

    '<div class="panel" style="padding:14px;font-size:11px;color:var(--muted);line-height:1.7;">' +
      '<strong style="color:var(--text);">Scoring formula:</strong> ' +
      'final score = species base-stat total + (current HP / max HP) × bonus + rarity bonus. ' +
      'A Scyther / Pinsir at full HP beats a Caterpie at full HP because base stats matter more than HP %. ' +
      'For the win, keep the catch at maximum HP using a Pokémon that has False Swipe + Status (Sleep/Para). ' +
      '<br/><br/>' +
      '<strong style="color:var(--text);">Pro tip:</strong> in Crystal, Heracross has a 1% encounter rate but enormous base stats. If you see one, it almost guarantees the win even at low HP.' +
    '</div>' +

    '</div>';
}
