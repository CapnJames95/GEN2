function buildTutorPage() {
  var TUTOR_TYPES = {
    'Body Slam':'Normal','Double-Edge':'Normal','Counter':'Fighting','Seismic Toss':'Fighting',
    'Mimic':'Normal','Metronome':'Normal','Substitute':'Normal','Swords Dance':'Normal',
    'Thunder Wave':'Electric','Explosion':'Normal','Dream Eater':'Psychic','Rock Slide':'Rock',
    'Mega Kick':'Normal','Mega Punch':'Normal','Soft-Boiled':'Normal',
    'ThunderPunch':'Electric','Fire Punch':'Fire',
    'Ice Punch':'Ice','Blast Burn':'Fire','Hydro Cannon':'Water','Frenzy Plant':'Grass',
    'Defense Curl':'Normal','Swagger':'Normal','Sleep Talk':'Normal','Snore':'Normal',
    'Swift':'Normal','Mud-Slap':'Ground','Psych Up':'Normal','Fury Cutter':'Bug',
    'Endure':'Normal','Rollout':'Rock','DynamicPunch':'Fighting','Icy Wind':'Ice'
  };
  var allMoves = {};
  for (var i = 0; i < GSC_TUTOR_LIST.length; i++) {
    var m = GSC_TUTOR_LIST[i];
    if (!allMoves[m]) allMoves[m] = {frlg:false,em:false};
    allMoves[m].frlg = true;
  }
  for (var j = 0; j < EMERALD_TUTOR_LIST.length; j++) {
    var me = EMERALD_TUTOR_LIST[j];
    if (!allMoves[me]) allMoves[me] = {frlg:false,em:false};
    allMoves[me].em = true;
  }
  var names = Object.keys(allMoves).sort();
  var tbody = document.getElementById('tutors-tbody');
  if (!tbody) return;
  var rows = '';
  for (var k = 0; k < names.length; k++) {
    var name = names[k];
    var flags = allMoves[name];
    var type = TUTOR_TYPES[name] || 'Normal';
    var typeLower = type.toLowerCase();
    rows += '<tr>'
      + '<td style="font-weight:600"><span style="cursor:pointer;transition:color 0.12s" onmouseover="this.style.color=\'var(--game-color,var(--gold))\'" onmouseout="this.style.color=\'\'" onclick="goToMoveInDex(\'' + name.replace(/'/g,"\\'") + '\')">' + name + '</span></td>'
      + '<td>' + typeSprite(typeLower) + '</td>'
      + '<td style="text-align:center">' + (flags.frlg ? '<span class="tutors-check">✓</span>' : '<span class="tutors-dash">—</span>') + '</td>'
      + '<td style="text-align:center">' + (flags.frlg ? '<span class="tutors-check">✓</span>' : '<span class="tutors-dash">—</span>') + '</td>'
      + '<td style="text-align:center">' + (flags.em ? '<span class="tutors-check">✓</span>' : '<span class="tutors-dash">—</span>') + '</td>'
      + '</tr>';
  }
  tbody.innerHTML = rows;
  window._tutorsBuilt = true;
}
