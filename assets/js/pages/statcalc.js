function buildStatCalcPage() {
  var el = document.getElementById('statcalc-content');
  if (!el) return;

  var STAT_NAMES = ['HP','Atk','Def','SpA','SpD','Spe'];
  var STAT_COLORS = ['#ef5350','#FF6B35','#9E9E9E','#64b4ff','#81C784','#FFD700'];
  var NATS = [
    {n:'Hardy',b:-1,l:-1},{n:'Docile',b:-1,l:-1},{n:'Serious',b:-1,l:-1},{n:'Bashful',b:-1,l:-1},{n:'Quirky',b:-1,l:-1},
    {n:'Lonely',b:0,l:1},{n:'Brave',b:0,l:4},{n:'Adamant',b:0,l:2},{n:'Naughty',b:0,l:3},
    {n:'Bold',b:1,l:0},{n:'Relaxed',b:1,l:4},{n:'Impish',b:1,l:2},{n:'Lax',b:1,l:3},
    {n:'Modest',b:2,l:0},{n:'Mild',b:2,l:1},{n:'Quiet',b:2,l:4},{n:'Rash',b:2,l:3},
    {n:'Calm',b:3,l:0},{n:'Gentle',b:3,l:1},{n:'Sassy',b:3,l:4},{n:'Careful',b:3,l:2},
    {n:'Timid',b:4,l:0},{n:'Hasty',b:4,l:1},{n:'Jolly',b:4,l:2},{n:'Naive',b:4,l:3}
  ];

  var cur = { num:0, lvl:50, nat:0, ivs:[31,31,31,31,31,31], evs:[0,0,0,0,0,0] };

  function calcStat(base, iv, ev, lvl, i, natIdx) {
    var nat = NATS[natIdx];
    var inner = Math.floor((2*base + iv + Math.floor(ev/4)) * lvl / 100);
    if (i === 0) return inner + lvl + 10;
    var mult = nat.b === (i-1) ? 1.1 : nat.l === (i-1) ? 0.9 : 1.0;
    return Math.floor((inner + 5) * mult);
  }

  function calcAll() {
    if (!cur.num || !BASE_STATS[cur.num]) return null;
    var bases = BASE_STATS[cur.num];
    var stats = bases.map(function(b,i){ return calcStat(b, cur.ivs[i], cur.evs[i], cur.lvl, i, cur.nat); });
    if (cur.num === 292) stats[0] = 1; // Shedinja: HP is always 1
    return stats;
  }

  function totalEV() { return cur.evs.reduce(function(a,b){return a+b;},0); }

  function renderResult() {
    var stats = calcAll();
    if (!stats) return '<div style="color:var(--muted);font-size:12px;padding:12px 0;">Select a Pokémon above.</div>';
    var maxStat = Math.max.apply(null, stats);
    var nat = NATS[cur.nat];
    return stats.map(function(s,i){
      var color = STAT_COLORS[i];
      var natLabel = (i>0 && nat.b===(i-1)) ? ' <span style="color:#FF6B35;font-size:9px;">▲</span>'
                   : (i>0 && nat.l===(i-1)) ? ' <span style="color:#64b4ff;font-size:9px;">▼</span>' : '';
      var base = BASE_STATS[cur.num][i];
      return '<div style="display:grid;grid-template-columns:40px 36px 1fr 44px;align-items:center;gap:8px;margin-bottom:6px;">'
        +'<span style="font-size:9px;font-weight:800;color:var(--muted);text-transform:uppercase;">'+STAT_NAMES[i]+'</span>'
        +'<span style="font-size:10px;color:var(--muted);text-align:right;">'+base+'</span>'
        +'<div style="height:12px;background:rgba(255,255,255,.06);border-radius:6px;overflow:hidden;">'
        +'<div style="width:'+Math.round(s/Math.max(700,maxStat*1.1)*100)+'%;height:100%;background:'+color+';border-radius:6px;transition:width .3s;"></div></div>'
        +'<span style="font-size:13px;font-weight:800;color:'+color+';text-align:right;">'+s+natLabel+'</span>'
        +'</div>';
    }).join('')
    +'<div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-size:11px;">'
    +'<span style="color:var(--muted);">Total</span>'
    +'<span style="font-weight:800;color:var(--game-color,var(--gold));">'+stats.reduce(function(a,b){return a+b;},0)+'</span></div>';
  }

  function renderEVInputs() {
    var total = totalEV();
    var remaining = 510 - total;
    return STAT_NAMES.map(function(name,i){
      return '<div style="margin-bottom:10px;">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:3px;">'
        +'<span style="font-size:10px;color:var(--muted);">'+name+' EV</span>'
        +'<span style="font-size:10px;font-weight:700;color:'+STAT_COLORS[i]+';" id="sc-ev-val-'+i+'">'+cur.evs[i]+'</span></div>'
        +'<input type="range" min="0" max="252" step="4" value="'+cur.evs[i]+'"'
        +' style="width:100%;accent-color:'+STAT_COLORS[i]+';"'
        +' oninput="scSetEV('+i+',this.value)">'
        +'</div>';
    }).join('')
    +'<div style="font-size:10px;color:'+(remaining<0?'#F44336':'var(--muted)')+';">EV total: '+total+' / 510 &nbsp;('+Math.max(0,remaining)+' remaining)</div>';
  }

  function rerender() {
    var res = document.getElementById('sc-result');
    if (res) res.innerHTML = renderResult();
    STAT_NAMES.forEach(function(_,i){
      var v = document.getElementById('sc-ev-val-'+i);
      if(v) v.textContent = cur.evs[i];
    });
    var tot = document.getElementById('sc-ev-total');
    if(tot) tot.textContent = 'EV total: '+totalEV()+' / 510';
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
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px;">Level: <span id="sc-lvl-lbl">50</span></label>'
    +'<input type="range" min="1" max="100" value="50" style="width:100%;margin-bottom:12px;" oninput="scSetLvl(this.value)">'
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:5px;">Nature</label>'
    +'<select id="sc-nat-sel" style="width:100%;padding:6px 8px;background:var(--darker);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:12px;margin-bottom:12px;" onchange="scSetNat(this.value)">'
    + NATS.map(function(n,i){
        var label = n.b===-1 ? n.n+' (neutral)' : n.n+' (+'+['Atk','Def','SpA','SpD','Spe'][n.b]+' −'+['Atk','Def','SpA','SpD','Spe'][n.l]+')';
        return '<option value="'+i+'">'+label+'</option>';
      }).join('')
    +'</select>'
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:8px;">IVs (per stat)</label>'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">'
    + STAT_NAMES.map(function(name,i){
        return '<div><div style="font-size:9px;color:'+STAT_COLORS[i]+';margin-bottom:2px;">'+name+'</div>'
          +'<input type="number" min="0" max="31" value="31"'
          +' style="width:100%;padding:4px 6px;background:var(--darker);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:12px;text-align:center;"'
          +' oninput="scSetIV('+i+',this.value)"></div>';
      }).join('')
    +'</div>'
    +'<label style="font-size:11px;color:var(--muted);display:block;margin-bottom:8px;">EVs (0–252 each, 510 total)</label>'
    +'<div id="sc-ev-inputs">'+ renderEVInputs() +'</div>'
    +'</div>'
    +'<div class="panel" style="padding:16px;">'
    +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));margin-bottom:12px;">FINAL STATS</div>'
    +'<div id="sc-result">'+renderResult()+'</div>'
    +'</div></div>';

  window.scPokeSearch = function(q) {
    var dd = document.getElementById('sc-poke-dd');
    q = q.trim().toLowerCase();
    if (!q) { dd.style.display='none'; return; }
    var hits = POKE.filter(function(p){ return p.name.toLowerCase().indexOf(q)!==-1||String(p.num).indexOf(q)!==-1; }).slice(0,10);
    if (!hits.length) { dd.style.display='none'; return; }
    dd.innerHTML = hits.map(function(p){
      return '<div onmousedown="scSelectPoke('+p.num+',\''+p.name.replace(/'/g,"\\'")+'\')"'
        +' style="padding:7px 10px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:8px;">'
        +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png" width="24" height="24" style="image-rendering:pixelated;">'
        +p.name+'<span style="margin-left:auto;font-size:10px;color:var(--muted);">#'+String(p.num).padStart(3,'0')+'</span></div>';
    }).join('');
    dd.style.display = 'block';
  };
  window.scSelectPoke = function(num,name) {
    cur.num=num;
    var inp=document.getElementById('sc-poke-inp'); if(inp) inp.value=name;
    var dd=document.getElementById('sc-poke-dd'); if(dd) dd.style.display='none';
    rerender();
  };
  window.scSetLvl = function(v) {
    cur.lvl=parseInt(v);
    var lbl=document.getElementById('sc-lvl-lbl'); if(lbl) lbl.textContent=v;
    rerender();
  };
  window.scSetNat = function(v) { cur.nat=parseInt(v); rerender(); };
  window.scSetIV  = function(i,v) { cur.ivs[i]=Math.max(0,Math.min(31,parseInt(v)||0)); rerender(); };
  window.scSetEV  = function(i,v) {
    var val = Math.max(0,Math.min(252,parseInt(v)||0));
    var tot = totalEV() - cur.evs[i] + val;
    if (tot > 510) val = Math.max(0, cur.evs[i] - (tot - 510));
    cur.evs[i]=val;
    var slider = el.querySelectorAll('input[type=range]')[i+1];
    if(slider) slider.value=val;
    rerender();
    var evDiv = document.getElementById('sc-ev-inputs'); if(evDiv) evDiv.innerHTML = renderEVInputs();
  };
}
