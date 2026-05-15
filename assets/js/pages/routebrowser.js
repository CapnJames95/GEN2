function buildRouteBrowserPage() {
  var _rbMap = {FR:'FR',LG:'LG',R:'R',S:'S',E:'E'};
  var RB_GAME = (typeof GAME !== 'undefined' && GAME !== 'all' && _rbMap[GAME]) ? _rbMap[GAME] : 'FR';
  var RB_GAMES = ['FR','LG','R','S','E'];
  var RB_GAME_LABELS = {FR:'🔥 Gold',LG:'🌿 Silver',R:'💎 Ruby',S:'🔷 Sapphire',E:'💚 Crystal'};
  var RB_GAME_COLORS = {FR:'var(--fire)',LG:'var(--leaf)',R:'#FF5555',S:'#5599FF',E:'#44DD88'};

  var rbIndex = null;
  var rbSelectedArea = null;
  var rbFilterQ = '';
  var rbGroupOpen = window._rbGroupOpen || {
    Special: true,
    Fossil: true,
    Routes: true,
    Safari: true,
    Towers: true,
    Caves: true,
    Islands: true,
    Forests: true,
    Water: true,
    Facilities: true,
    Towns: true,
    Other: true
  };
  window._rbGroupOpen = rbGroupOpen;

  function buildIndex(game) {
    var idx = {};

    function expandRouteLoc(loc) {
      var rangeMatch = loc.match(/^Route\s+(\d+)\s*-\s*(\d+)$/i);
      if (rangeMatch) {
        var start = parseInt(rangeMatch[1], 10);
        var end = parseInt(rangeMatch[2], 10);
        if (end >= start) {
          var routes = [];
          for (var n = start; n <= end; n++) routes.push('Route ' + n);
          return routes;
        }
      }
      var pairMatch = loc.match(/^Route\s+(\d+)\s*&\s*(\d+)$/i);
      if (pairMatch) {
        return ['Route ' + parseInt(pairMatch[1], 10), 'Route ' + parseInt(pairMatch[2], 10)];
      }
      var safariPairMatch = loc.match(/^Safari Zone\s+(Area\s+\d+)\s*&\s*(Area\s+\d+)$/i);
      if (safariPairMatch) {
        return ['Safari Zone ' + safariPairMatch[1], 'Safari Zone ' + safariPairMatch[2]];
      }
      var safariRangeMatch = loc.match(/^Safari Zone\s+Area\s+(\d+)\s*-\s*(\d+)$/i);
      if (safariRangeMatch) {
        var safariStart = parseInt(safariRangeMatch[1], 10);
        var safariEnd = parseInt(safariRangeMatch[2], 10);
        if (safariEnd >= safariStart) {
          var safariAreas = [];
          for (var s = safariStart; s <= safariEnd; s++) safariAreas.push('Safari Zone Area ' + s);
          return safariAreas;
        }
      }
      var genericPairMatch = loc.match(/^(.+?)\s*&\s*(.+)$/);
      if (genericPairMatch) {
        var left = genericPairMatch[1].trim();
        var right = genericPairMatch[2].trim();
        var prefixMatch = left.match(/^(.*\b)(\d+)$/);
        if (prefixMatch && /^\d+$/.test(right)) {
          return [left, prefixMatch[1] + right];
        }
      }
      return [loc];
    }

    POKE.forEach(function(p) {
      var text = (p.games && p.games[game]) || '';
      if (!text) return;
      var lines = text.split('\n');
      lines.forEach(function(line) {
        line = line.trim();
        if (!line) return;
        if (/^Event\b/i.test(line)) {
          if (!idx['Event']) idx['Event'] = [];
          idx['Event'].push({num:p.num, name:p.name, types:p.types, line:line});
          return;
        }
        if (/^Fossil\b/i.test(line)) {
          if (!idx['Fossil']) idx['Fossil'] = [];
          idx['Fossil'].push({num:p.num, name:p.name, types:p.types, line:line});
          return;
        }
        if (/\bTrade\b/i.test(line)) {
          if (!idx['Trade']) idx['Trade'] = [];
          idx['Trade'].push({num:p.num, name:p.name, types:p.types, line:line});
          return;
        }
        if (/^Evolve\b/i.test(line)) {
          if (!idx['Evolve']) idx['Evolve'] = [];
          idx['Evolve'].push({num:p.num, name:p.name, types:p.types, line:line});
          return;
        }
        var locMatch = line.match(/\(([^,)]+)/);
        if (!locMatch) return;
        var loc = locMatch[1].trim();
        if (!loc || loc.length < 3) return;
        expandRouteLoc(loc).forEach(function(areaName) {
          if (!idx[areaName]) idx[areaName] = [];
          idx[areaName].push({num:p.num, name:p.name, types:p.types, line:line});
        });
      });
    });
    return idx;
  }

  function sortedAreas(idx) {
    return Object.keys(idx).sort(function(a,b){
      if (a === 'Evolve') return 1;
      if (b === 'Evolve') return -1;
      if (a === 'Event') return 1;
      if (b === 'Event') return -1;
      if (a === 'Trade') return 1;
      if (b === 'Trade') return -1;
      var aR = a.match(/Route (\d+)/), bR = b.match(/Route (\d+)/);
      if (aR && bR) return parseInt(aR[1]) - parseInt(bR[1]);
      if (aR) return -1;
      if (bR) return 1;
      return a.localeCompare(b);
    }).filter(function(k){
      if (!rbFilterQ) return true;
      return k.toLowerCase().indexOf(rbFilterQ.toLowerCase()) !== -1;
    });
  }

  function renderAreaList(idx) {
    var areas = sortedAreas(idx);
    var list = document.getElementById('rb-area-list');
    var cnt = document.getElementById('rb-area-count');
    if (!list) return;
    if (cnt) cnt.textContent = areas.length + ' areas';

    function areaGroup(area) {
      if (area === 'Trade' || area === 'Event' || area === 'Evolve') return 'Special';
      if (area === 'Fossil') return 'Fossil';
      if (/^Route\s+\d+/i.test(area)) return 'Routes';
      if (/^Safari Zone/i.test(area) || /\bSafari\b/i.test(area) || /^(Area\s+\d+|Center)$/i.test(area)) return 'Safari';
      if (/Tower/i.test(area)) return 'Towers';
      if (/Cave|Tunnel|Mt\.|Mt |Mansion|Road|Ruins|Chamber/i.test(area) || /\b[1-9]F\b/i.test(area) || /\bB[1-9]F\b/i.test(area)) return 'Caves';
      if (/Island|Isle|Sevault|Kindle|Ember|Cape|Berry Forest|Bond Bridge|Water Path|Ruin Valley|Canyon Entrance/i.test(area)) return 'Islands';
      if (/Forest|Woods|Bush/i.test(area)) return 'Forests';
      if (/Sea|Shoal|Dive|Underwater|Ocean|Pond|Lake|River|Harbor|Port|Falls|Surf/i.test(area)) return 'Water';
      if (/Game Corner|Power Plant|Victory Road|Battle|Frontier|Day Care/i.test(area)) return 'Facilities';
      if (/Town|City|Village/i.test(area)) return 'Towns';
      return 'Other';
    }

    function areaSort(a, b) {
      var aR = a.match(/Route (\d+)/), bR = b.match(/Route (\d+)/);
      if (aR && bR) return parseInt(aR[1], 10) - parseInt(bR[1], 10);
      return a.localeCompare(b);
    }

    var groupOrder = ['Special','Fossil','Routes','Safari','Towers','Caves','Islands','Forests','Water','Facilities','Towns','Other'];
    var grouped = {};
    areas.forEach(function(area) {
      var group = areaGroup(area);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(area);
    });

    list.innerHTML = groupOrder.filter(function(group) {
      return grouped[group] && grouped[group].length;
    }).map(function(group) {
      grouped[group].sort(areaSort);
      var isOpen = rbGroupOpen[group] !== false;
      var areaHtml = isOpen ? grouped[group].map(function(a) {
        var active = a === rbSelectedArea;
        return '<div onclick="rbSelectArea(\''+a.replace(/'/g,"\\'")+'\')"'
          +' style="padding:8px 14px 8px 22px;cursor:pointer;font-size:12px;font-weight:'+(active?'700':'400')+';'
          +'color:'+(active?'var(--game-color,var(--gold))':'var(--text)')+';'
          +'background:'+(active?'color-mix(in srgb,var(--game-color,var(--gold)) 8%,transparent)':'transparent')+';'
          +'border-left:3px solid '+(active?'var(--game-color,var(--gold))':'transparent')+';"'
          +' onmouseover="if(this.style.borderLeftColor===\'transparent\')this.style.background=\'rgba(255,255,255,.04)\'"'
          +' onmouseout="if(\''+a+'\'!==window._rbSel)this.style.background=\'\'">'
          +a+'<span style="float:right;font-size:10px;color:var(--muted);">'+idx[a].length+'</span>'
          +'</div>';
      }).join('') : '';
      return '<div style="border-bottom:1px solid rgba(255,255,255,.04);">'
        + '<div onclick="rbToggleGroup(\''+group+'\')" style="padding:9px 12px;cursor:pointer;font-size:11px;font-weight:800;color:var(--game-color,var(--gold));background:rgba(255,255,255,.03);letter-spacing:.2px;">'
        + (isOpen ? '▾ ' : '▸ ') + group
        + '<span style="float:right;font-size:10px;color:var(--muted);">' + grouped[group].length + '</span>'
        + '</div>'
        + areaHtml
        + '</div>';
    }).join('');
    window._rbSel = rbSelectedArea;
  }

  // Magazine-style type badge helper
  var TYPE_BG = {normal:'#9E9E9E',fire:'#E8501A',water:'#1B8FE8',grass:'#3DA83D',electric:'#D4A800',ice:'#60C8C8',fighting:'#B83020',poison:'#8B3099',ground:'#8B6840',flying:'#6850C0',psychic:'#D01868',bug:'#78A810',rock:'#807840',ghost:'#4030A0',dragon:'#5038E8',dark:'#403030',steel:'#9898A8'};

  function renderDetail(idx) {
    var detail = document.getElementById('rb-detail');
    if (!detail) return;
    if (!rbSelectedArea || !idx[rbSelectedArea]) {
      detail.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:24px;text-align:center;">Select an area from the list to see available Pokémon.</div>';
      return;
    }
    var entries = idx[rbSelectedArea];
    var isTradeArea = rbSelectedArea === 'Trade';
    var isEventArea = rbSelectedArea === 'Event';
    var isEvolveArea = rbSelectedArea === 'Evolve';
    var isFossilArea = rbSelectedArea === 'Fossil';

    // ── Magazine spread header ───────────────────────────────────
    var areaIcon = isTradeArea ? '🔄' : isEventArea ? '🎪' : isFossilArea ? '🦴' : isEvolveArea ? '🔄' : '📍';
    var areaGroup2 = (function(a) {
      if (/route|road|path/i.test(a)) return 'ROUTES';
      if (/cave|tunnel|dungeon|underground/i.test(a)) return 'CAVES & DUNGEONS';
      if (/safari/i.test(a)) return 'SAFARI ZONE';
      if (/tower|mansion|gym|lab/i.test(a)) return 'FACILITIES';
      if (/city|town|village/i.test(a)) return 'TOWNS & CITIES';
      if (/island/i.test(a)) return 'ISLANDS';
      if (/sea|ocean|water|lake|river/i.test(a)) return 'WATER ROUTES';
      if (/forest|woods/i.test(a)) return 'FORESTS';
      return 'LOCATIONS';
    })(rbSelectedArea);

    // Pick a representative sprite for the splash (first Pokémon)
    var splashSprite = entries.length ? ('<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+entries[0].num+'.png" style="width:64px;height:64px;image-rendering:pixelated;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5));position:absolute;right:20px;bottom:0;" alt="" onerror="this.style.display=\'none\'">') : '';

    var spreadHtml = '<div class="rb-detail-spread">'
      + '<div class="rb-area-splash" style="position:relative;overflow:hidden;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));letter-spacing:1px;margin-bottom:6px;">'+areaGroup2+'</div>'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:clamp(10px,2vw,15px);color:var(--text);line-height:1.4;padding-right:80px;">'+areaIcon+' '+rbSelectedArea.toUpperCase()+'</div>'
      + '<div style="margin-top:6px;font-size:10px;color:var(--muted);">'+entries.length+' Pokémon available</div>'
      + splashSprite
      + '</div>'
      + '<div class="rb-poke-grid">'
      + entries.map(function(e){
          var isTrade = /\bTrade\b/i.test(e.line);
          var isEvent = /^Event\b/i.test(e.line);
          var isEvolve = /^Evolve\b/i.test(e.line);
          var isFossil = /^Fossil\b/i.test(e.line);
          var tradeNote = '';
          var tradeDetail = '';
          var eventNote = '';
          var eventDetail = '';
          var evolveNote = '';
          var evolveDetail = '';
          var fossilNote = '';
          var fossilDetail = '';
          var displayLine = e.line;
          var types = (e.types||[]).map(function(t){
            return '<span style="font-size:8px;font-weight:800;padding:1px 4px;border-radius:2px;text-transform:uppercase;background:'+({normal:'#9E9E9E',fire:'#E8501A',water:'#1B8FE8',grass:'#3DA83D',electric:'#D4A800',ice:'#60C8C8',fighting:'#B83020',poison:'#8B3099',ground:'#8B6840',flying:'#6850C0',psychic:'#D01868',bug:'#78A810',rock:'#807840',ghost:'#4030A0',dragon:'#5038E8',dark:'#403030',steel:'#9898A8'}[t]||'#666')+';color:#fff;">'+t+'</span>';
          }).join('');
          if (isTrade) {
            tradeDetail = e.line;
            tradeDetail = tradeDetail.replace(/^Evolve\s+.+?\s*\(/i, '');
            tradeDetail = tradeDetail.replace(/^Trade\b[\s(]*/i, '');
            tradeDetail = tradeDetail.replace(/\)\s*$/, '');
            tradeDetail = tradeDetail.trim();
            if (tradeDetail) {
              tradeDetail = tradeDetail.replace(/^holding\s+/i, 'Holding ');
              tradeDetail = tradeDetail.replace(/^with\s+/i, 'With ');
              tradeDetail = tradeDetail.replace(/^for\s+/i, 'For ');
            }
            tradeNote = '<div style="margin:3px 0 1px 0;"><span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:999px;background:color-mix(in srgb,var(--game-color,var(--gold)) 12%,transparent);border:1px solid color-mix(in srgb,var(--game-color,var(--gold)) 35%,transparent);color:var(--game-color,var(--gold));">TRADE</span></div>'
              + '<div style="font-size:9px;color:var(--game-color,var(--gold));'
              + (isTradeArea ? 'white-space:normal;overflow:visible;max-width:none;' : 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;')
              + '">'
              + (tradeDetail ? tradeDetail : 'Available here via in-game trade')
              + '</div>';
          }
          if (isEvent) {
            eventDetail = e.line.replace(/^Event\s+Only\b\s*[—-]?\s*/i, '').replace(/^Event\b\s*[—-]?\s*/i, '').trim();
            eventNote = '<div style="margin:3px 0 1px 0;"><span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:999px;background:rgba(100,180,255,.12);border:1px solid rgba(100,180,255,.35);color:#8fc8ff;">EVENT</span></div>'
              + '<div style="font-size:9px;color:#8fc8ff;'
              + (isEventArea ? 'white-space:normal;overflow:visible;max-width:none;' : 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;')
              + '">'
              + (eventDetail ? eventDetail : 'Event-only distribution or unlock')
              + '</div>';
          }
          if (isEvolve) {
            evolveDetail = e.line.replace(/^Evolve\s+.+?\(/i, '').replace(/\)\s*$/, '').trim();
            evolveNote = '<div style="margin:3px 0 1px 0;"><span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:999px;background:rgba(154,210,122,.12);border:1px solid rgba(154,210,122,.35);color:#9ad27a;">EVOLVE</span></div>'
              + '<div style="font-size:9px;color:#9ad27a;'
              + (isEvolveArea ? 'white-space:normal;overflow:visible;max-width:none;' : 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;')
              + '">'
              + (evolveDetail ? evolveDetail : 'Evolution-only obtain method')
              + '</div>';
          }
          if (isFossil) {
            fossilDetail = e.line.replace(/^Fossil\b[\s(]*/i, '').replace(/\)\s*$/, '').trim();
            fossilNote = '<div style="margin:3px 0 1px 0;"><span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:999px;background:rgba(205,170,106,.12);border:1px solid rgba(205,170,106,.35);color:#d7b36c;">FOSSIL</span></div>'
              + '<div style="font-size:9px;color:#d7b36c;'
              + (isFossilArea ? 'white-space:normal;overflow:visible;max-width:none;' : 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;')
              + '">'
              + (fossilDetail ? fossilDetail : 'Fossil restoration method')
              + '</div>';
          }
          displayLine = displayLine.replace(/Special\s*\(Celadon Game Corner,\s*Purchase for\s*\d+C/i, 'Game Corner');
          // Magazine-style card
          var typeBadgeHtml = (e.types||[]).map(function(t){
            return '<span style="font-size:7px;font-weight:800;padding:1px 5px;border-radius:2px;text-transform:uppercase;background:'+(TYPE_BG[t]||'#666')+';color:#fff;">'+t+'</span>';
          }).join(' ');
          var methodBadge = isTrade ? '<span style="font-size:7px;padding:1px 5px;border-radius:99px;background:color-mix(in srgb,var(--game-color,var(--gold)) 15%,transparent);border:1px solid color-mix(in srgb,var(--game-color,var(--gold)) 40%,transparent);color:var(--game-color,var(--gold));">TRADE</span>'
            : isEvent  ? '<span style="font-size:7px;padding:1px 5px;border-radius:99px;background:rgba(100,180,255,.15);border:1px solid rgba(100,180,255,.4);color:#8fc8ff;">EVENT</span>'
            : isFossil ? '<span style="font-size:7px;padding:1px 5px;border-radius:99px;background:rgba(205,170,106,.15);border:1px solid rgba(205,170,106,.4);color:#d7b36c;">FOSSIL</span>'
            : isEvolve ? '<span style="font-size:7px;padding:1px 5px;border-radius:99px;background:rgba(154,210,122,.15);border:1px solid rgba(154,210,122,.4);color:#9ad27a;">EVOLVE</span>'
            : '';
          var shortLine = displayLine.length > 36 ? displayLine.slice(0,36)+'…' : displayLine;
          return '<div class="rb-poke-card" onclick="_openDexSearch(\''+e.name+'\','+e.num+')" title="'+displayLine.replace(/"/g,'&quot;')+'">'
            + '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+e.num+'.png" class="rb-poke-sprite" alt="'+e.name+'" onerror="this.style.opacity=\'0.2\'">'
            + '<div class="rb-poke-info">'
            + '<div class="rb-poke-name">'+e.name+'</div>'
            + '<div class="rb-poke-types">'+typeBadgeHtml+'</div>'
            + (methodBadge ? '<div style="margin-top:3px;">'+methodBadge+'</div>' : '')
            + '<div class="rb-poke-line" title="'+displayLine.replace(/"/g,'&quot;')+'">'+shortLine+'</div>'
            + '</div>'
            + '</div>';
        }).join('')
      + '</div></div>';
    detail.innerHTML = spreadHtml;
  }

  function rbRender() {
    if (!rbIndex) rbIndex = buildIndex(RB_GAME);
    renderAreaList(rbIndex);
    renderDetail(rbIndex);
  }

  var gameBtns = document.getElementById('rb-game-btns');
  if (gameBtns) {
    gameBtns.innerHTML = RB_GAMES.map(function(g){
      var active = g===RB_GAME;
      return '<button onclick="rbSetGame(\''+g+'\')" id="rb-gbtn-'+g+'"'
        +' style="font-size:10px;font-weight:700;padding:4px 9px;border-radius:4px;cursor:pointer;font-family:\'Nunito\',sans-serif;'
        +'background:'+(active?RB_GAME_COLORS[g]:'var(--panel)')+';color:'+(active?'#000':'var(--text)')+';border:1px solid '+(active?RB_GAME_COLORS[g]:'var(--border)')+';">'
        +RB_GAME_LABELS[g]+'</button>';
    }).join('');
  }

  function rbUpdateTitleColor(g) {
    var t = document.getElementById('rb-page-title');
    if (t) t.style.setProperty('color', RB_GAME_COLORS[g] || 'var(--gold)');
  }

  window.rbSetGame = function(g) {
    RB_GAME=g;
    rbIndex=buildIndex(g);
    rbSelectedArea=null;
    RB_GAMES.forEach(function(x){
      var b=document.getElementById('rb-gbtn-'+x);
      if(!b) return;
      var active=x===g;
      b.style.background=active?RB_GAME_COLORS[x]:'var(--panel)';
      b.style.color=active?'#000':'var(--text)';
      b.style.borderColor=active?RB_GAME_COLORS[x]:'var(--border)';
    });
    rbUpdateTitleColor(g);
    rbRender();
  };
  window.rbSelectArea = function(a) { rbSelectedArea=a; window._rbSel=a; if(rbIndex) { renderAreaList(rbIndex); renderDetail(rbIndex); } };
  window.rbToggleGroup = function(group) {
    rbGroupOpen[group] = rbGroupOpen[group] === false;
    window._rbGroupOpen = rbGroupOpen;
    if (rbIndex) renderAreaList(rbIndex);
  };
  window.rbFilter = function() {
    var inp=document.getElementById('rb-search');
    rbFilterQ=inp?inp.value:'';
    if(rbIndex) renderAreaList(rbIndex);
  };

  rbUpdateTitleColor(RB_GAME);
  rbRender();
}
