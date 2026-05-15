var _ilocGame = null;

function buildItemLocsPage() {
  var g = (typeof GAME !== 'undefined' && GAME !== 'all') ? GAME : 'FR';
  _ilocGame = g;
  var games = [
    { id:'FR', label:'🔥 FR', color:'var(--fire)' },
    { id:'LG', label:'🌿 LG', color:'var(--leaf)' },
    { id:'R', label:'🔴 R', color:'#FF5555' },
    { id:'S', label:'🔷 S', color:'#5599FF' },
    { id:'E', label:'🟢 E', color:'var(--emerald)' }
  ];
  var btns = document.getElementById('iloc-game-btns');
  btns.innerHTML = games.map(function(gm) {
    var active = gm.id === g ? 'border-color:'+gm.color+';color:'+gm.color+';' : '';
    return '<button onclick="ilocSetGame(\''+gm.id+'\',this)" data-game="'+gm.id+'" style="font-family:\'Press Start 2P\',monospace;font-size:7px;padding:5px 10px;border-radius:4px;border:2px solid var(--border);background:transparent;cursor:pointer;color:var(--muted);'+active+'">'+gm.label+'</button>';
  }).join('');
  ilocRender();
  window._itemlocsBuilt = true;
}

function ilocSetGame(g) {
  _ilocGame = g;
  var colors = { FR:'var(--fire)', LG:'var(--leaf)', R:'#FF5555', S:'#5599FF', E:'var(--emerald)' };
  document.querySelectorAll('#iloc-game-btns button').forEach(function(b) {
    var bg = b.getAttribute('data-game');
    if (bg === g) { b.style.borderColor = colors[g]; b.style.color = colors[g]; }
    else { b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)'; }
  });
  ilocRender();
}

function ilocRender() {
  var g = _ilocGame || 'FR';
  var isRSE = (g === 'R' || g === 'S' || g === 'E');
  var rawItem = (document.getElementById('iloc-search') || {}).value || '';
  var q = _norm(rawItem);
  var _ilocPage = document.getElementById('page-itemlocs');
  if (typeof setPageHash === 'function' && _ilocPage && _ilocPage.classList.contains('active')) {
    setPageHash('itemlocs', { item: rawItem, game: g });
  }
  var sections = [];

  Object.keys(GUIDE_DATA).forEach(function(sectionId) {
    var isRseSection = sectionId.startsWith('rse_');
    if (isRSE !== isRseSection) return;
    var secData = GUIDE_DATA[sectionId] || {};
    var items = (secData.items || []).filter(function(it) {
      var ver = it.version || 'both';
      if (ver === 'both') return true;
      return ver.split('/').some(function(v) { return v.trim() === g; });
    });
    if (q) {
      items = items.filter(function(it) {
        return _norm(it.name).includes(q) || _norm(it.loc).includes(q);
      });
    }
    if (!items.length) return;
    var meta = _sectionMetaById ? _sectionMetaById(sectionId) : null;
    var label = (meta && meta.toc) ? meta.toc : sectionId.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
    sections.push({ label: label, items: items });
  });

  if (!sections.length) {
    document.getElementById('iloc-list').innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:12px;">No items found.</div>';
    return;
  }

  var html = sections.map(function(sec) {
    var rows = sec.items.map(function(it) {
      var noteHtml = it.note ? '<span style="color:var(--muted);font-size:10px;"> · '+it.note+'</span>' : '';
      return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">'
        +'<td style="padding:6px 12px;font-size:12px;font-weight:600;color:var(--text);"><div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="openItemByName(this.dataset.item)" data-item="'+it.name.replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'">'+itemSprite(it.name, 20)+it.name+'</div></td>'
        +'<td style="padding:6px 12px;font-size:12px;color:var(--muted);line-height:1.5;">'+it.loc+noteHtml+'</td>'
        +'</tr>';
    }).join('');
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;margin-bottom:12px;overflow:hidden;">'
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));padding:10px 14px;border-bottom:1px solid var(--border);background:var(--panel);">'+sec.label+'</div>'
      +'<table style="width:100%;border-collapse:collapse;">'
      +'<thead><tr style="border-bottom:1px solid var(--border);">'
      +'<th style="padding:5px 12px;font-size:9px;color:var(--game-color,var(--gold));text-align:left;width:35%;">Item</th>'
      +'<th style="padding:5px 12px;font-size:9px;color:var(--game-color,var(--gold));text-align:left;">Location</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>';
  }).join('');

  document.getElementById('iloc-list').innerHTML = html;
}

function _openItemLocs(itemName, game) {
  closeSearch();
  if (typeof setPageHash === 'function') setPageHash('itemlocs', { item: itemName || '', game: game || '' });
  var btn = document.getElementById('navItemLocs');
  closeNavDropdown('navPokeDropdown');
  showPage('itemlocs', btn);
  if (!window._itemlocsBuilt) { buildItemLocsPage(); }
  if (game) {
    setTimeout(function() {
      ilocSetGame(game, document.querySelector('#iloc-game-btns button[data-game="'+game+'"]'));
    }, 80);
  }
  if (itemName) {
    setTimeout(function() {
      var inp = document.getElementById('iloc-search');
      if (inp) { inp.value = itemName; ilocRender(); }
    }, 120);
  }
}
