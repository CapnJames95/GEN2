// Gen 2 Stat Calculator
//
// Mechanics differences from Gen 3+:
//   - DVs (Determinant Values) range 0-15  (NOT IVs 0-31)
//   - Stat Experience 0-65535 per stat      (NOT EVs 0-252 capped at 510)
//   - No Natures, no Abilities
//   - Special Attack and Special Defense share one DV and one Stat Exp
//   - HP DV is derived from the LSBs of (Atk, Def, Spd, Special) DVs
//
// Gen 2 stat formulas:
//   HP    = floor( ((Base + DV) * 2 + floor(sqrt(StatExp))/4) * Level/100 ) + Level + 10
//   Other = floor( ((Base + DV) * 2 + floor(sqrt(StatExp))/4) * Level/100 ) +  5

function buildStatCalcPage() {
  var el = document.getElementById('statcalc-content');
  if (!el) return;

  var STAT_NAMES  = ['HP','Atk','Def','SpA','SpD','Spe'];
  var STAT_COLORS = ['#ef5350','#FF6B35','#9E9E9E','#64b4ff','#81C784','#FFD700'];

  // Inputs (4 DV / 4 Stat-Exp slots): Atk, Def, Spd, Special. HP DV derived; HP statExp shares idx 0 (uses Atk slot — see below).
  // Storage: dvs[0..3] = Atk, Def, Spd, Special. statExp[0..3] same order, with HP using its own dedicated value below.
  var cur = {
    num: 0,
    lvl: 100,
    dvs:     [15,15,15,15],
    statExp: [65535,65535,65535,65535],
    hpStatExp: 65535
  };

  function hpDV() {
    var atk = cur.dvs[0], def = cur.dvs[1], spd = cur.dvs[2], spc = cur.dvs[3];
    return ((atk & 1) << 3) | ((def & 1) << 2) | ((spd & 1) << 1) | (spc & 1);
  }

  function calcStat(base, dv, statExp, lvl, isHP) {
    var stExpFactor = Math.floor(Math.floor(Math.sqrt(statExp)) / 4);
    var inner = Math.floor(((base + dv) * 2 + stExpFactor) * lvl / 100);
    return isHP ? (inner + lvl + 10) : (inner + 5);
  }

  function inputsFor(i, bases) {
    // i: 0 HP, 1 Atk, 2 Def, 3 SpA, 4 SpD, 5 Spd
    if (i === 0) return { base: bases[0], dv: hpDV(),    statExp: cur.hpStatExp,   isHP: true };
    if (i === 1) return { base: bases[1], dv: cur.dvs[0],statExp: cur.statExp[0],  isHP: false };
    if (i === 2) return { base: bases[2], dv: cur.dvs[1],statExp: cur.statExp[1],  isHP: false };
    if (i === 3) return { base: bases[3], dv: cur.dvs[3],statExp: cur.statExp[3],  isHP: false };
    if (i === 4) return { base: bases[4], dv: cur.dvs[3],statExp: cur.statExp[3],  isHP: false };
    if (i === 5) return { base: bases[5], dv: cur.dvs[2],statExp: cur.statExp[2],  isHP: false };
  }

  function calcAll() {
    if (!cur.num || !BASE_STATS[cur.num]) return null;
    var bases = BASE_STATS[cur.num];
    var stats = [];
    for (var i = 0; i < 6; i++) {
      var inp = inputsFor(i, bases);
      stats.push(calcStat(inp.base, inp.dv, inp.statExp, cur.lvl, inp.isHP));
    }
    return stats;
  }

  function renderResult() {
    var stats = calcAll();
    if (!stats) return '<div style="color:var(--muted);font-size:12px;padding:12px 0;">Select a Pokémon above.</div>';
    var maxStat = Math.max.apply(null, stats);
    return stats.map(function(s,i){
      var color = STAT_COLORS[i];
      var base = BASE_STATS[cur.num][i];
      return '<div style="display:grid;grid-template-columns:40px 36px 1fr 44px;align-items:center;gap:8px;margin-bottom:6px;">'
        +'<span style="font-size:9px;font-weight:800;color:var(--muted);text-transform:uppercase;">'+STAT_NAMES[i]+'</span>'
        +'<span style="font-size:10px;color:var(--muted);text-align:right;">'+base+'</span>'
        +'<div style="height:12px;background:rgba(255,255,255,.06);border-radius:6px;overflow:hidden;">'
        +'<div style="width:'+Math.round(s/Math.max(700,maxStat*1.1)*100)+'%;height:100%;background:'+color+';border-radius:6px;transition:width .3s;"></div></div>'
        +'<span style="font-size:13px;font-weight:800;color:'+color+';text-align:right;">'+s+'</span>'
        +'</div>';
    }).join('')
    +'<div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-size:11px;">'
    +'<span style="color:var(--muted);">Total</span>'
    +'<span style="font-weight:800;color:var(--game-color,var(--gold));">'+stats.reduce(function(a,b){return a+b;},0)+'</span></div>'
    +'<div style="font-size:9px;color:var(--muted);margin-top:6px;">Derived HP DV: <strong style="color:var(--text);">'+hpDV()+'</strong></div>';
  }

  function renderDVInputs() {
    var labels = ['Atk DV','Def DV','Spd DV','Special DV (SpA + SpD)'];
    return labels.map(function(label,idx){
      return '<div style="margin-bottom:8px;">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:3px;">'
        +'<span style="font-size:10px;color:var(--muted);">'+label+'</span>'
        +'<span style="font-size:10px;font-weight:700;color:var(--text);" id="sc-dv-val-'+idx+'">'+cur.dvs[idx]+'</span></div>'
        +'<input type="range" min="0" max="15" step="1" value="'+cur.dvs[idx]+'"'
        +' style="width:100%;" oninput="scSetDV('+idx+',this.value)">'
        +'</div>';
    }).join('');
  }

  function renderStatExpInputs() {
    var rows = [
      ['HP Stat Exp','hp', cur.hpStatExp],
      ['Atk Stat Exp', 0, cur.statExp[0]],
      ['Def Stat Exp', 1, cur.statExp[1]],
      ['Spd Stat Exp', 2, cur.statExp[2]],
      ['Special Stat Exp (SpA + SpD)', 3, cur.statExp[3]],
    ];
    return rows.map(function(r){
      var label = r[0], slot = r[1], val = r[2];
      return '<div style="margin-bottom:8px;">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:3px;">'
        +'<span style="font-size:10px;color:var(--muted);">'+label+'</span>'
        +'<span style="font-size:10px;font-weight:700;color:var(--text);" id="sc-se-val-'+slot+'">'+val+'</span></div>'
        +'<input type="range" min="0" max="65535" step="1024" value="'+val+'"'
        +' style="width:100%;" oninput="scSetSE(\''+slot+'\',this.value)">'
        +'</div>';
    }).join('');
  }

  function rerender() {
    var res = document.getElementById('sc-result');
    if (res) res.innerHTML = renderResult();
    cur.dvs.forEach(function(v,idx){
      var el = document.getElementById('sc-dv-val-'+idx);
      if (el) el.textContent = v;
    });
    cur.statExp.forEach(function(v,idx){
      var el = document.getElementById('sc-se-val-'+idx);
      if (el) el.textContent = v;
    });
    var hp = document.getElementById('sc-se-val-hp');
    if (hp) hp.textContent = cur.hpStatExp;
    var lvl = document.getElementById('sc-lvl-lbl');
    if (lvl) lvl.textContent = cur.lvl;
  }

  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">'
    +'<div class="panel" style="padding:16px;">'
    +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));margin-bottom:12px;">INPUTS</div>'
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Pokémon</label>'
    +'<div style="position:relative;margin-bottom:12px;">'
    +'<input id="sc-poke-inp" type="text" placeholder="Search name or #…" autocomplete="off"'
    +' style="width:100%;padding:7px 10px;background:var(--darker);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:12px;"'
    +' oninput="scPokeSearch(this.value)">'
    +'<div id="sc-poke-dd" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--panel);border:1px solid var(--border);border-radius:4px;z-index:20;max-height:200px;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,.4);"></div>'
    +'</div>'
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Level: <span id="sc-lvl-lbl">'+cur.lvl+'</span></label>'
    +'<input type="range" min="1" max="100" value="'+cur.lvl+'" style="width:100%;margin-bottom:16px;" oninput="scSetLvl(this.value)">'
    +'<div style="font-size:10px;color:var(--muted);margin-bottom:8px;font-weight:700;">DVs (0–15 each)</div>'
    + renderDVInputs()
    +'<div style="font-size:10px;color:var(--muted);margin:14px 0 8px;font-weight:700;">Stat Experience (0–65,535 each)</div>'
    + renderStatExpInputs()
    +'<div style="font-size:9px;color:var(--muted);margin-top:10px;line-height:1.5;">'
      +'<strong>Gen 2 mechanics:</strong> DVs range 0–15. HP DV is derived from the least-significant bit of each other DV. Stat Experience is gained from KOing Pokémon (each KO grants that species\' base stat in stat-exp). Special Attack and Special Defense share one DV and one Stat Exp value. No Natures, no Abilities.'
    +'</div>'
    +'</div>'
    +'<div class="panel" style="padding:16px;">'
    +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));margin-bottom:12px;">CALCULATED STATS</div>'
    +'<div id="sc-result">'+renderResult()+'</div>'
    +'</div>'
    +'</div>';

  // Handlers
  window.scSetLvl = function(v) { cur.lvl = Math.max(1, Math.min(100, parseInt(v,10)||1)); rerender(); };
  window.scSetDV  = function(i,v) { cur.dvs[i] = Math.max(0, Math.min(15, parseInt(v,10)||0)); rerender(); };
  window.scSetSE  = function(slot,v) {
    var val = Math.max(0, Math.min(65535, parseInt(v,10)||0));
    if (slot === 'hp') cur.hpStatExp = val;
    else cur.statExp[parseInt(slot,10)] = val;
    rerender();
  };

  window.scPokeSearch = function(q) {
    var dd = document.getElementById('sc-poke-dd');
    if (!dd) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { dd.style.display = 'none'; dd.innerHTML = ''; return; }
    var matches = POKE.filter(function(p){
      return p.name.toLowerCase().indexOf(q) !== -1 || String(p.num).indexOf(q) !== -1;
    }).slice(0, 30);
    if (!matches.length) { dd.style.display = 'none'; return; }
    dd.innerHTML = matches.map(function(p){
      return '<div onclick="scSelectPoke('+p.num+')" style="padding:6px 10px;cursor:pointer;font-size:12px;border-bottom:1px solid var(--border);">'
        +'#'+String(p.num).padStart(3,'0')+' '+p.name+'</div>';
    }).join('');
    dd.style.display = 'block';
  };
  window.scSelectPoke = function(num) {
    cur.num = num;
    var inp = document.getElementById('sc-poke-inp');
    var dd  = document.getElementById('sc-poke-dd');
    var p = POKE.find(function(x){return x.num===num;});
    if (inp && p) inp.value = '#'+String(p.num).padStart(3,'0')+' '+p.name;
    if (dd) dd.style.display = 'none';
    rerender();
  };

  document.addEventListener('click', function(ev){
    var dd = document.getElementById('sc-poke-dd');
    var inp = document.getElementById('sc-poke-inp');
    if (!dd || !inp) return;
    if (ev.target === inp) return;
    if (dd.contains(ev.target)) return;
    dd.style.display = 'none';
  });
}
