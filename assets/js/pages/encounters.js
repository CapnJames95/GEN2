var _encGame = null;

function buildEncountersPage() {
  var g = (typeof GAME !== 'undefined' && GAME !== 'all') ? GAME : 'FR';
  _encGame = g;
  var games = [
    { id:'FR', label:'🔥 FR', color:'var(--fire)' },
    { id:'LG', label:'🌿 LG', color:'var(--leaf)' },
    { id:'R', label:'🔴 R', color:'#FF5555' },
    { id:'S', label:'🔷 S', color:'#5599FF' },
    { id:'E', label:'🟢 E', color:'var(--emerald)' }
  ];
  var btns = document.getElementById('enc-game-btns');
  btns.innerHTML = games.map(function(gm) {
    var active = gm.id === g ? 'border-color:'+gm.color+';color:'+gm.color+';' : '';
    return '<button onclick="encSetGame(\''+gm.id+'\',this)" data-game="'+gm.id+'" style="font-family:\'Press Start 2P\',monospace;font-size:7px;padding:5px 10px;border-radius:4px;border:2px solid var(--border);background:transparent;cursor:pointer;color:var(--muted);'+active+'">'+gm.label+'</button>';
  }).join('');
  encRender();
  window._encountersBuilt = true;
}

function encSetGame(g) {
  _encGame = g;
  var games = { FR:'var(--fire)', LG:'var(--leaf)', R:'#FF5555', S:'#5599FF', E:'var(--emerald)' };
  document.querySelectorAll('#enc-game-btns button').forEach(function(b) {
    var bg = b.getAttribute('data-game');
    if (bg === g) { b.style.borderColor = games[g]; b.style.color = games[g]; }
    else { b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)'; }
  });
  encRender();
}

function encRender() {
  var g = _encGame || 'FR';
  var isRSE = (g === 'R' || g === 'S' || g === 'E');
  var rawLoc = (document.getElementById('enc-loc-search') || {}).value || '';
  var locQ = _norm(rawLoc);
  var _encPage = document.getElementById('page-encounters');
  if (typeof setPageHash === 'function' && _encPage && _encPage.classList.contains('active')) {
    setPageHash('encounters', { route: rawLoc, game: g });
  }
  var methodLabels = {
    grass:'🌿 Grass', cave:'🕳 Cave', surf:'🏄 Surf', water:'🏄 Surf',
    'old rod':'🎣 Old Rod', 'good rod':'🎣 Good Rod', 'super rod':'🎣 Super Rod',
    fish:'🎣 Fishing', dive:'🤿 Dive', rock:'🪨 Rock Smash', headbutt:'🌳 Headbutt',
    sky:'🌤 Sky', summit:'🏔 Summit', revive:'🦴 Fossil Revival'
  };
  var methodOrder = ['grass','cave','surf','water','old rod','good rod','super rod','fish','dive','rock','headbutt','sky','summit','revive'];
  var routeMap = {};

  Object.keys(GUIDE_DATA).forEach(function(sectionId) {
    var isRseSection = sectionId.startsWith('rse_');
    if (isRSE !== isRseSection) return;
    var secData = GUIDE_DATA[sectionId] || {};
    Object.keys(secData.wild || {}).forEach(function(routeName) {
      var entries = secData.wild[routeName] || [];
      var filtered = entries.filter(function(e) {
        if (!e.version) return true;
        var v = e.version;
        if (v === 'both') return true;
        return v.split('/').some(function(part) { return part.trim() === g; });
      });
      if (!filtered.length) return;
      if (!routeMap[routeName]) routeMap[routeName] = {};
      filtered.forEach(function(e) {
        var method = (e.method || 'grass').toLowerCase();
        if (!routeMap[routeName][method]) routeMap[routeName][method] = [];
        routeMap[routeName][method].push(e);
      });
    });
  });

  var routeNames = Object.keys(routeMap).sort();
  if (locQ) routeNames = routeNames.filter(function(r) { return _norm(r).includes(locQ); });
  if (!routeNames.length) {
    document.getElementById('enc-list').innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:12px;">No encounter data found.</div>';
    return;
  }

  var html = routeNames.map(function(routeName) {
    var methods = routeMap[routeName];
    var methodHtml = methodOrder.filter(function(m) { return methods[m]; }).map(function(m) {
      var label = methodLabels[m] || m;
      var rows = methods[m].map(function(e) {
        var noteHtml = e.note ? '<span style="color:var(--muted);font-size:10px;margin-left:6px;">· '+e.note+'</span>' : '';
        var pokeObj = POKE.find(function(p) { return p.name === e.name; });
        var sprite = pokeObj ? '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokeObj.num+'.png" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle;margin-right:4px;">' : '';
        var nameHtml = pokeObj
          ? '<span style="cursor:pointer;color:var(--text);" onclick="_openDexSearch(\''+e.name+'\','+pokeObj.num+')" onmouseover="this.style.color=gameColor()" onmouseout="this.style.color=\'var(--text)\'">'+sprite+e.name+'</span>'
          : e.name;
        return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">'
          +'<td style="padding:5px 10px;">'+nameHtml+noteHtml+'</td>'
          +'<td style="padding:5px 10px;font-size:11px;color:var(--game-color,var(--gold));">'+e.levels+'</td>'
          +'<td style="padding:5px 10px;font-size:11px;color:var(--game-color,var(--gold));text-align:right;font-weight:700;">'+e.rate+'</td>'
          +'</tr>';
      }).join('');
      return '<div style="margin-bottom:10px;">'
        +'<div style="font-size:10px;font-weight:700;color:var(--game-color,var(--gold));margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">'+label+'</div>'
        +'<table style="width:100%;border-collapse:collapse;">'
        +'<thead><tr style="border-bottom:1px solid var(--border);">'
        +'<th style="padding:4px 10px;font-size:9px;color:var(--game-color,var(--gold));text-align:left;">Pokémon</th>'
        +'<th style="padding:4px 10px;font-size:9px;color:var(--game-color,var(--gold));text-align:left;">Levels</th>'
        +'<th style="padding:4px 10px;font-size:9px;color:var(--game-color,var(--gold));text-align:right;">Rate</th>'
        +'</tr></thead><tbody>'+rows+'</tbody></table></div>';
    }).join('');

    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:12px;">'
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin-bottom:10px;">'+routeName+'</div>'
      +methodHtml+'</div>';
  }).join('');

  document.getElementById('enc-list').innerHTML = html;
}

function _openEncounters(routeName, game) {
  closeSearch();
  if (typeof setPageHash === 'function') setPageHash('encounters', { route: routeName || '', game: game || '' });
  var btn = document.getElementById('navEncounters');
  closeNavDropdown('navPokeDropdown');
  showPage('encounters', btn);
  if (!window._encountersBuilt) { buildEncountersPage(); }
  if (game) {
    setTimeout(function() {
      encSetGame(game, document.querySelector('#enc-game-btns button[data-game="'+game+'"]'));
    }, 80);
  }
  if (routeName) {
    setTimeout(function() {
      var inp = document.getElementById('enc-loc-search');
      if (inp) { inp.value = routeName; encRender(); }
    }, 120);
  }
}
