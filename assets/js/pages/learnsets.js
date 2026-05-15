var _lsCurrentNum = null;

function buildLearnsetsPage() {
  document.addEventListener('click', function(e) {
    var dd = document.getElementById('ls-dropdown');
    if (dd && !dd.contains(e.target) && e.target.id !== 'ls-search') dd.style.display = 'none';
  });
  window._learnsetsBuilt = true;
}

function lsSearchInput(val) {
  var q = _norm(val);
  var dd = document.getElementById('ls-dropdown');
  if (q.length < 1) { dd.style.display = 'none'; return; }
  var matches = POKE.filter(function(p) {
    return _norm(p.name).includes(q) || String(p.num) === q;
  }).slice(0, 10);
  if (!matches.length) { dd.style.display = 'none'; return; }
  dd.innerHTML = matches.map(function(p) {
    return '<div onclick="lsSelectPokemon('+p.num+')" style="display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border);" onmouseover="this.style.background=\'var(--panel)\'" onmouseout="this.style.background=\'\';">'
      +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png" style="width:28px;height:28px;image-rendering:pixelated;">'
      +'<span style="font-size:12px;color:var(--muted);min-width:40px;">#'+String(p.num).padStart(3,'0')+'</span>'
      +'<span style="font-size:13px;color:var(--text);">'+p.name+'</span>'
      +'</div>';
  }).join('');
  dd.style.display = 'block';
}

function lsSelectPokemon(num) {
  _lsCurrentNum = num;
  if (typeof setPageHash === 'function') setPageHash('learnsets', { pokemon: num });
  var p = POKE.find(function(p) { return p.num === num; });
  var inp = document.getElementById('ls-search');
  if (inp && p) inp.value = p.name;
  var dd = document.getElementById('ls-dropdown');
  if (dd) dd.style.display = 'none';
  lsRender(num);
}

function lsRender(num) {
  var p = POKE.find(function(p) { return p.num === num; });
  if (!p) return;
  var ls = LEARNSETS[String(num)] || {};
  var container = document.getElementById('ls-content');
  var moveTypeMap = {};
  ALL_MOVES_DATA.forEach(function(m) { moveTypeMap[m[1]] = { type: m[2], cat: m[3], power: m[4], acc: m[5] }; });

  function moveRow(moveName, extra) {
    var md = moveTypeMap[moveName] || {};
    return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">'
      +(extra !== undefined ? '<td style="padding:5px 10px;font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));text-align:center;">'+extra+'</td>' : '')
      +'<td style="padding:5px 10px;font-size:12px;font-weight:600;"><span class="guide-move-link" onclick="_openMoveDex(\''+moveName.replace(/'/g,"\\'")+'\')">'+moveName+'</span></td>'
      +(md.type ? '<td style="padding:5px 8px;">'+typeSprite(md.type.toLowerCase())+'</td>' : '<td></td>')
      +'<td style="padding:5px 8px;font-size:11px;color:var(--muted);">'+(md.cat === 'P' ? '⚔' : md.cat === 'S' ? '✨' : md.cat ? '●' : '')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px;color:var(--muted);text-align:right;">'+(md.power || '—')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px;color:var(--muted);text-align:right;">'+(md.acc || '—')+'</td>'
      +'</tr>';
  }

  function tableWrap(headExtra, rows) {
    return '<div style="overflow-x:auto;margin-bottom:20px;"><table style="width:100%;border-collapse:collapse;">'
      +'<thead><tr style="border-bottom:2px solid var(--border);">'
      +(headExtra ? '<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));text-align:center;">'+headExtra+'</th>' : '')
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));text-align:left;">MOVE</th>'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));">TYPE</th>'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));">CAT</th>'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));text-align:right;">PWR</th>'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));text-align:right;">ACC</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>';
  }

  function section(title, html) {
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;margin-bottom:16px;overflow:hidden;">'
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));letter-spacing:1px;padding:9px 14px;border-bottom:1px solid var(--border);background:var(--panel);">'+title+'</div>'
      +'<div style="padding:14px 16px;">'+html+'</div></div>';
  }

  var levelRows = (ls.level || []).map(function(e) { return moveRow(e[1], e[0] === 0 ? 'Evo' : e[0]); }).join('');
  var levelHtml = levelRows ? tableWrap('LV', levelRows) : '<div style="color:var(--muted);font-size:11px;">—</div>';

  var TM_NAMES = {};
  ALL_ITEMS.forEach(function(it) {
    if (!Array.isArray(it) || it[2] !== 'TM/HM') return;
    var match = it[1].match(/^(TM|HM)(\d+)\s+(.+)/);
    if (match) TM_NAMES[parseInt(match[2]) + (match[1] === 'HM' ? 100 : 0)] = it[1];
  });
  var tmRows = (ls.tm || []).map(function(id) {
    var label = TM_NAMES[id] || ('TM'+String(id).padStart(2,'0'));
    var moveName = label.replace(/^(TM|HM)\d+\s*/, '');
    return moveRow(moveName, label.match(/^(TM|HM)\d+/)[0]);
  }).join('');
  var hmRows = (ls.hm || []).map(function(id) {
    var label = TM_NAMES[id + 100] || ('HM'+String(id).padStart(2,'0'));
    var moveName = label.replace(/^(TM|HM)\d+\s*/, '');
    return moveRow(moveName, label.match(/^(TM|HM)\d+/)[0]);
  }).join('');
  var tmHtml = (tmRows || hmRows) ? tableWrap('TM/HM', tmRows + hmRows) : '<div style="color:var(--muted);font-size:11px;">—</div>';

  var myGroups = EGG_GROUPS_DATA[String(num)] || [];
  var eggRows = (ls.egg || []).map(function(moveName) {
    var parents = POKE.filter(function(pp) {
      if (pp.num === num) return false;
      var ppGroups = EGG_GROUPS_DATA[String(pp.num)] || [];
      var sharesGroup = myGroups.some(function(g) { return g !== 'Undiscovered' && g !== 'Ditto' && ppGroups.includes(g); });
      if (!sharesGroup) return false;
      var ppLs = LEARNSETS[String(pp.num)] || {};
      var inLevel = (ppLs.level || []).some(function(e) { return e[1] === moveName; });
      var inTutor = (ppLs.tutor || []).includes(moveName);
      var inTM = false;
      if (!inLevel && !inTutor) {
        (ppLs.tm || []).concat(ppLs.hm || []).forEach(function(id) {
          var label = TM_NAMES[id] || TM_NAMES[id + 100] || '';
          if (label.replace(/^(TM|HM)\d+\s*/, '') === moveName) inTM = true;
        });
      }
      return inLevel || inTutor || inTM;
    }).slice(0, 6);

    var md = moveTypeMap[moveName] || {};
    var parentChips = parents.map(function(pp) {
      return '<span onclick="_openDexSearch(\''+pp.name+'\','+pp.num+')" style="display:inline-flex;align-items:center;gap:3px;background:var(--panel);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:10px;cursor:pointer;margin:1px;" onmouseover="this.style.borderColor=gameColor()" onmouseout="this.style.borderColor=\'var(--border)\'">'
        +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pp.num+'.png" style="width:16px;height:16px;image-rendering:pixelated;">'+pp.name+'</span>';
    }).join('');

    return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top;">'
      +'<td style="padding:6px 10px;font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;">'+moveName+'</td>'
      +(md.type ? '<td style="padding:6px 8px;white-space:nowrap;">'+typeSprite(md.type.toLowerCase())+'</td>' : '<td></td>')
      +'<td style="padding:6px 8px;font-size:11px;color:var(--muted);white-space:nowrap;">'+(md.cat === 'P' ? '⚔' : md.cat === 'S' ? '✨' : md.cat ? '●' : '')+'</td>'
      +'<td style="padding:6px 8px;font-size:11px;color:var(--muted);text-align:right;white-space:nowrap;">'+(md.power || '—')+'</td>'
      +'<td style="padding:6px 10px;">'+(parentChips || '<span style="font-size:10px;color:var(--muted);">No compatible parents found</span>')+'</td>'
      +'</tr>';
  }).join('');
  var eggHtml = eggRows
    ? '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="border-bottom:2px solid var(--border);">'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--muted);text-align:left;">MOVE</th>'
      +'<th style="padding:6px 8px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--muted);">TYPE</th>'
      +'<th style="padding:6px 8px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--muted);">CAT</th>'
      +'<th style="padding:6px 8px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--muted);text-align:right;">PWR</th>'
      +'<th style="padding:6px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--muted);">COMPATIBLE PARENTS (same egg group, know the move)</th>'
      +'</tr></thead><tbody>'+eggRows+'</tbody></table></div>'
    : '<div style="color:var(--muted);font-size:11px;">No egg moves.</div>';

  var tutorRows = (ls.tutor || []).map(function(moveName) { return moveRow(moveName); }).join('');
  var tutorHtml = tutorRows ? tableWrap(null, tutorRows) : '<div style="color:var(--muted);font-size:11px;">—</div>';

  var sprite = '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+num+'.png" style="width:64px;height:64px;image-rendering:pixelated;">';
  var typeHtml = typeBadges(p.types);

  container.innerHTML = '<div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 18px;">'
    +sprite
    +'<div>'
    +'<div style="font-family:\'Press Start 2P\',monospace;font-size:11px;color:var(--text);margin-bottom:6px;">#'+String(num).padStart(3,'0')+' '+p.name+'</div>'
    +'<div style="display:flex;gap:6px;">'+typeHtml+'</div>'
    +(myGroups.length ? '<div style="font-size:11px;color:var(--muted);margin-top:5px;">Egg groups: '+myGroups.join(', ')+'</div>' : '')
    +'</div></div>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px;font-size:11px;color:var(--muted);">'
    +'<span><span style="color:var(--text);margin-right:4px;">⚔</span>Physical</span>'
    +'<span><span style="color:var(--text);margin-right:4px;">✨</span>Special</span>'
    +'<span><span style="color:var(--text);margin-right:4px;">●</span>Status</span>'
    +'</div>'
    +section('LEVEL-UP MOVES', levelHtml)
    +section('TM / HM', tmHtml)
    +section('EGG MOVES', eggHtml)
    +section('TUTOR MOVES', tutorHtml);
}

function _openLearnsets(num) {
  closeSearch();
  if (typeof setPageHash === 'function') setPageHash('learnsets', num ? { pokemon: num } : null);
  var btn = document.getElementById('navLearnsets');
  closeNavDropdown('navPokeDropdown');
  showPage('learnsets', btn);
  if (!window._learnsetsBuilt) { buildLearnsetsPage(); }
  if (num) {
    setTimeout(function() { lsSelectPokemon(num); }, 80);
  }
}
