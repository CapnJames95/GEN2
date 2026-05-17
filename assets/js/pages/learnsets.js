// Pokémon learnsets — Gen 2 (Gold, Silver, Crystal)
//
// Reads the global LEARNSETS object (loaded from app.js) and the Gen-2
// TM list. Renders a searchable per-Pokémon view showing level-up moves,
// TM/HM compatibility, and egg moves.

(function() {
  'use strict';

  // Gen-2 TM order — index 0 = TM01
  var GEN2_TM_MOVES = [
    'DynamicPunch','Headbutt','Curse','Rollout','Roar',
    'Toxic','Zap Cannon','Rock Smash','Psych Up','Hidden Power',
    'Sunny Day','Sweet Scent','Snore','Blizzard','Hyper Beam',
    'Icy Wind','Protect','Rain Dance','Giga Drain','Endure',
    'Frustration','SolarBeam','Iron Tail','DragonBreath','Thunder',
    'Earthquake','Return','Dig','Psychic','Shadow Ball',
    'Mud-Slap','Double Team','Ice Punch','Swagger','Sleep Talk',
    'Sludge Bomb','Sandstorm','Fire Blast','Swift','Defense Curl',
    'ThunderPunch','Dream Eater','Detect','Rest','Attract',
    'Thief','Steel Wing','Fire Punch','Fury Cutter','Nightmare'
  ];
  // Gen-2 HM order — index 0 = HM01
  var GEN2_HM_MOVES = ['Cut','Fly','Surf','Strength','Flash','Whirlpool','Waterfall'];

  var TYPE_OF = {}; // populated from ALL_MOVES_DATA below at first build

  function buildTypeIndex() {
    if (Object.keys(TYPE_OF).length) return;
    if (typeof ALL_MOVES_DATA === 'undefined') return;
    ALL_MOVES_DATA.forEach(function(row) {
      // row = [id, name, type, cat, power, acc, pp, desc]
      TYPE_OF[row[1]] = { type: row[2], cat: row[3], power: row[4], acc: row[5], pp: row[6] };
    });
  }

  var TYPE_COLORS = {
    Normal:'#9E9E9E',Fire:'#E8501A',Water:'#1B8FE8',Grass:'#3DA83D',
    Electric:'#D4A800',Ice:'#60C8C8',Fighting:'#B83020',Poison:'#8B3099',
    Ground:'#8B6840',Flying:'#6850C0',Psychic:'#D01868',Bug:'#78A810',
    Rock:'#807840',Ghost:'#4030A0',Dragon:'#5038E8',Dark:'#403030',Steel:'#9898A8'
  };
  function typePill(t) {
    var c = TYPE_COLORS[t] || '#666';
    return '<span style="display:inline-block;font-size:8px;font-weight:800;padding:2px 6px;border-radius:3px;text-transform:uppercase;background:'+c+';color:#fff;">'+t+'</span>';
  }
  function catGlyph(c) {
    if (c === 'P') return '<span title="Physical" style="color:var(--fire);">⚔</span>';
    if (c === 'S') return '<span title="Special" style="color:#64b4ff;">✨</span>';
    if (c === 'O') return '<span title="Status"   style="color:var(--muted);">●</span>';
    return '';
  }

  var SELECTED_NUM = null;

  function buildLearnsetsPage() {
    var el = document.getElementById('learnsets-content') || document.getElementById('page-learnsets');
    if (!el) return;
    buildTypeIndex();

    var pokeList = (typeof POKE !== 'undefined' ? POKE : []).filter(function(p){ return p.num <= 251; });
    var datalist = '<datalist id="ls-pokelist">'
      + pokeList.map(function(p){ return '<option value="'+p.name+'">#'+String(p.num).padStart(3,'0')+'</option>'; }).join('')
      + '</datalist>';

    el.innerHTML =
      '<div class="panel" style="padding:18px;max-width:1000px;margin:0 auto;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">LEARNSETS — GEN 2</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Per-Pokémon level-up moves, TM/HM compatibility, and egg moves for all 251 Gen-2 species. Pick a Pokémon to see the full set.'
      + '</div>'
      + '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">'
      +   '<input id="ls-poke-search" list="ls-pokelist" placeholder="🔍 Pick a Pokémon…" '
      +     'style="flex:1;min-width:240px;background:var(--card);border:1px solid var(--border);border-radius:5px;padding:9px 12px;color:var(--text);font-size:13px;outline:none;" '
      +     'oninput="window._lsPick(this.value)">'
      +   datalist
      + '</div>'
      + '<div id="ls-detail"></div>'
      + '</div>';
    if (SELECTED_NUM) renderDetail(SELECTED_NUM);
  }

  function pokeByName(name) {
    if (!name) return null;
    var pl = (typeof POKE !== 'undefined' ? POKE : []);
    var lower = name.toLowerCase().trim();
    return pl.find(function(p){ return p.name.toLowerCase() === lower; }) || null;
  }

  window._lsPick = function(name) {
    var p = pokeByName(name);
    if (!p) return;
    SELECTED_NUM = p.num;
    renderDetail(p.num);
  };

  function moveRow(name, label) {
    var info = TYPE_OF[name] || {};
    var nm = '<span class="guide-move-link" onclick="_openMoveDex && _openMoveDex(\''+(name.replace(/'/g,"\\'"))+'\')">'+name+'</span>';
    return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);">'
      + '<td style="padding:6px 8px;color:var(--muted);font-size:11px;white-space:nowrap;">'+label+'</td>'
      + '<td style="padding:6px 8px;font-weight:700;color:var(--text);">'+nm+'</td>'
      + '<td style="padding:6px 8px;">'+(info.type ? typePill(info.type) : '—')+'</td>'
      + '<td style="padding:6px 8px;text-align:center;">'+catGlyph(info.cat)+'</td>'
      + '<td style="padding:6px 8px;text-align:right;color:var(--muted);font-size:11px;">'+(info.power || '—')+'</td>'
      + '<td style="padding:6px 8px;text-align:right;color:var(--muted);font-size:11px;">'+(info.acc ? info.acc+'%' : '—')+'</td>'
      + '<td style="padding:6px 8px;text-align:right;color:var(--muted);font-size:11px;">'+(info.pp || '—')+'</td>'
      + '</tr>';
  }

  function section(title, rowsHtml) {
    return '<div style="margin-bottom:18px;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));letter-spacing:0.5px;margin-bottom:6px;border-bottom:1px solid var(--border);padding-bottom:5px;">'+title+'</div>'
      + '<div class="panel" style="padding:0;overflow:hidden;">'
      + '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
      + '<thead><tr style="background:var(--card);">'
      +   '<th style="text-align:left;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">When</th>'
      +   '<th style="text-align:left;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">Move</th>'
      +   '<th style="text-align:left;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">Type</th>'
      +   '<th style="text-align:center;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">Cat</th>'
      +   '<th style="text-align:right;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">Pwr</th>'
      +   '<th style="text-align:right;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">Acc</th>'
      +   '<th style="text-align:right;padding:6px 8px;font-size:9px;color:var(--muted);text-transform:uppercase;">PP</th>'
      + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div></div>';
  }

  function renderDetail(num) {
    var el = document.getElementById('ls-detail');
    if (!el) return;
    var ls = (typeof LEARNSETS !== 'undefined') ? LEARNSETS[String(num)] : null;
    var p  = (typeof POKE !== 'undefined') ? POKE.find(function(x){ return x.num === num; }) : null;
    if (!ls || !p) {
      el.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);">No learnset data for this species.</div>';
      return;
    }

    var sprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + num + '.png';
    var hdr = '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">'
      + '<img src="'+sprite+'" width="64" height="64" style="image-rendering:pixelated;flex-shrink:0;" onerror="this.style.display=\'none\'">'
      + '<div>'
      + '<div style="font-size:18px;font-weight:800;color:var(--text);">#'+String(num).padStart(3,'0')+' '+p.name+'</div>'
      + '<div style="margin-top:4px;display:flex;gap:4px;">'+(p.types||[]).map(function(t){ return typePill(t[0].toUpperCase()+t.slice(1)); }).join('')+'</div>'
      + '</div>'
      + '</div>';

    // Level-up
    var lvRows = (ls.level || []).map(function(entry) {
      var lv = entry[0], move = entry[1];
      return moveRow(move, (lv === 1 || lv === 0) ? 'Start' : 'Lv '+lv);
    }).join('');
    var sectionsHtml = lvRows ? section('Level-Up Moves', lvRows) : '';

    // TMs
    var tmList = (ls.tm || []).map(function(n) {
      var move = GEN2_TM_MOVES[n - 1] || ('TM'+n);
      return moveRow(move, 'TM'+String(n).padStart(2,'0'));
    }).join('');
    if (tmList) sectionsHtml += section('TM Moves (' + (ls.tm || []).length + ')', tmList);

    // HMs
    var hmList = (ls.hm || []).map(function(n) {
      var move = GEN2_HM_MOVES[n - 1] || ('HM'+n);
      return moveRow(move, 'HM'+String(n).padStart(2,'0'));
    }).join('');
    if (hmList) sectionsHtml += section('HM Moves (' + (ls.hm || []).length + ')', hmList);

    // Egg moves
    var eggList = (ls.egg || []).map(function(move) {
      return moveRow(move, 'Egg');
    }).join('');
    if (eggList) sectionsHtml += section('Egg Moves (' + (ls.egg || []).length + ')', eggList);
    else if ((ls.egg || []).length === 0) {
      // Surface that breeding is irrelevant for some species (Undiscovered group)
      sectionsHtml += '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
        + 'No egg moves recorded. Likely either (a) the species is in the Undiscovered egg group (legendaries, baby Pokémon) or (b) all parents pass only level-up moves.'
        + '</div>';
    }

    el.innerHTML = hdr + sectionsHtml
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:8px;">'
      + '<strong style="color:var(--text);">Move Reminder (Blackthorn City)</strong> re-teaches any level-up move from the list above — free in Gen 2.'
      + '</div>';
  }

  window.buildLearnsetsPage = buildLearnsetsPage;
})();
