function buildSafariZonePage() {
  var el = document.getElementById('safari-content');
  if (!el) return;

  var SAFARI_GAMES = {
    frlg: {
      label: '🔥 FR / 🌿 LG — Fuchsia City',
      color: 'var(--fire)',
      steps: 500,
      balls: 30,
      areas: [
        { name:'Area 1', pokemon:[
          {num:29,name:'Nidoran♀',cr:235,flee:70,rate:'25%'},{num:32,name:'Nidoran♂',cr:235,flee:70,rate:'25%'},
          {num:30,name:'Nidorina',cr:120,flee:50,rate:'10%'},{num:33,name:'Nidorino',cr:120,flee:50,rate:'10%'},
          {num:102,name:'Exeggcute',cr:90,flee:60,rate:'20%'},{num:46,name:'Paras',cr:190,flee:80,rate:'5%'},
          {num:115,name:'Kangaskhan',cr:45,flee:30,rate:'4%'},{num:128,name:'Tauros',cr:45,flee:30,rate:'1%'}]},
        { name:'Area 2', pokemon:[
          {num:29,name:'Nidoran♀',cr:235,flee:70,rate:'15%'},{num:32,name:'Nidoran♂',cr:235,flee:70,rate:'15%'},
          {num:102,name:'Exeggcute',cr:90,flee:60,rate:'20%'},{num:113,name:'Chansey',cr:30,flee:25,rate:'4%'},
          {num:115,name:'Kangaskhan',cr:45,flee:30,rate:'4%'},{num:128,name:'Tauros',cr:45,flee:30,rate:'4%'},
          {num:123,name:'Scyther [FR]',cr:45,flee:50,rate:'4%'},{num:127,name:'Pinsir [LG]',cr:45,flee:50,rate:'4%'}]},
        { name:'Area 3', pokemon:[
          {num:29,name:'Nidoran♀',cr:235,flee:70,rate:'15%'},{num:32,name:'Nidoran♂',cr:235,flee:70,rate:'15%'},
          {num:30,name:'Nidorina',cr:120,flee:50,rate:'10%'},{num:33,name:'Nidorino',cr:120,flee:50,rate:'10%'},
          {num:102,name:'Exeggcute',cr:90,flee:60,rate:'15%'},{num:113,name:'Chansey',cr:30,flee:25,rate:'4%'},
          {num:49,name:'Venomoth',cr:75,flee:60,rate:'5%'},{num:123,name:'Scyther [FR]',cr:45,flee:50,rate:'5%'},
          {num:127,name:'Pinsir [LG]',cr:45,flee:50,rate:'5%'}]},
        { name:'Area 4', pokemon:[
          {num:29,name:'Nidoran♀',cr:235,flee:70,rate:'20%'},{num:32,name:'Nidoran♂',cr:235,flee:70,rate:'20%'},
          {num:111,name:'Rhyhorn',cr:120,flee:30,rate:'20%'},{num:113,name:'Chansey',cr:30,flee:25,rate:'6%'},
          {num:128,name:'Tauros',cr:45,flee:30,rate:'5%'},{num:115,name:'Kangaskhan',cr:45,flee:30,rate:'5%'}]}
      ]
    },
    rse: {
      label: '🔴 R/S / 💚 E — Lilycove City (Route 121)',
      color: '#44DD88',
      steps: 500,
      balls: 30,
      areas: [
        { name:'Area 1', pokemon:[
          {num:43,name:'Oddish [R/S]',cr:255,flee:80,rate:'30%'},{num:84,name:'Doduo',cr:190,flee:75,rate:'20%'},
          {num:111,name:'Rhyhorn',cr:120,flee:40,rate:'20%'},{num:203,name:'Girafarig',cr:60,flee:50,rate:'15%'},
          {num:202,name:'Wobbuffet',cr:45,flee:25,rate:'5%'},{num:25,name:'Pikachu',cr:190,flee:90,rate:'10%'}]},
        { name:'Area 2 (Exp. Pack 1)', pokemon:[
          {num:177,name:'Natu',cr:190,flee:70,rate:'20%'},{num:203,name:'Girafarig',cr:60,flee:50,rate:'15%'},
          {num:231,name:'Phanpy [R]',cr:120,flee:50,rate:'15%'},{num:84,name:'Doduo',cr:190,flee:75,rate:'20%'},
          {num:202,name:'Wobbuffet',cr:45,flee:25,rate:'10%'},{num:214,name:'Heracross [E]',cr:45,flee:40,rate:'5%'}]},
        { name:'Area 3 (Exp. Pack 2)', pokemon:[
          {num:44,name:'Gloom',cr:120,flee:60,rate:'20%'},{num:203,name:'Girafarig',cr:60,flee:50,rate:'15%'},
          {num:111,name:'Rhyhorn',cr:120,flee:40,rate:'15%'},{num:214,name:'Heracross [E]',cr:45,flee:40,rate:'10%'},
          {num:202,name:'Wobbuffet',cr:45,flee:25,rate:'10%'},{num:25,name:'Pikachu',cr:190,flee:90,rate:'10%'}]}
      ]
    }
  };

  var _szGameMap = {FR:'frlg', LG:'frlg', R:'rse', S:'rse', E:'rse'};
  var curGame = (typeof GAME !== 'undefined' && GAME !== 'all' && _szGameMap[GAME]) ? _szGameMap[GAME] : 'frlg';
  var steps = 500, balls = 30;
  var selectedPoke = null;

  function safariCatchProb(cr, mult) {
    var a = Math.min(255, Math.floor((cr * 1.5 * mult * (255/255))));
    a = Math.max(1, a);
    var b = Math.floor(65536 / Math.pow(255 / a, 0.1875));
    return Math.min(100, Math.pow(b / 65536, 4) * 100);
  }

  function pctStr(p) { return p >= 99.9 ? '100%' : p.toFixed(1) + '%'; }

  function bar(pct, color) {
    return '<div style="display:flex;align-items:center;gap:8px;">'
      +'<div style="flex:1;height:10px;background:rgba(255,255,255,.08);border-radius:5px;overflow:hidden;">'
      +'<div style="width:'+Math.round(Math.min(100,pct))+'%;height:100%;background:'+color+';border-radius:5px;"></div></div>'
      +'<span style="font-size:11px;font-weight:700;color:'+color+';width:42px;text-align:right;">'+pctStr(pct)+'</span>'
      +'</div>';
  }

  function renderCalc() {
    if (!selectedPoke) return '<div style="color:var(--muted);font-size:12px;">Select a Pokémon from the area list below.</div>';
    var p = selectedPoke;
    var baseP  = safariCatchProb(p.cr, 1);
    var rockP  = safariCatchProb(p.cr, 2);
    var baitP  = safariCatchProb(p.cr, 0.5);
    var baseF  = (p.flee / 255 * 100);
    var rockF  = Math.min(100, p.flee * 2 / 255 * 100);
    var baitF  = (p.flee * 0.5 / 255 * 100);
    var strategies = [
      {label:'Throw Ball (no modifier)', catchP:baseP, fleeP:baseF, color:'#64b4ff'},
      {label:'Throw Rock → Ball',        catchP:rockP, fleeP:rockF, color:'#FF6B35', note:'Rock doubles catch rate but doubles flee chance this turn'},
      {label:'Throw Bait → Ball',        catchP:baitP, fleeP:baitF, color:'#4CAF50', note:'Bait halves flee chance next turn, but also halves catch rate'},
    ];
    return '<div class="panel" style="padding:14px 16px;margin-bottom:14px;">'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'
      +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png" width="40" height="40" style="image-rendering:pixelated;">'
      +'<div><div style="font-size:13px;font-weight:800;">'+p.name+'</div>'
      +'<div style="font-size:10px;color:var(--muted);">Catch Rate: '+p.cr+' &nbsp;|&nbsp; Base Flee: '+pctStr(baseF)+'</div></div></div>'
      + strategies.map(function(s){
          return '<div style="margin-bottom:10px;">'
            +'<div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:3px;">'+s.label+'</div>'
            +(s.note?'<div style="font-size:9px;color:var(--muted);margin-bottom:4px;">'+s.note+'</div>':'')
            +'<div style="display:grid;grid-template-columns:80px 1fr;gap:4px;align-items:center;">'
            +'<span style="font-size:10px;color:var(--muted);">Catch:</span>'+bar(s.catchP, s.color)
            +'<span style="font-size:10px;color:var(--muted);">Flee:</span>'+bar(s.fleeP, '#9E9E9E')
            +'</div></div>';
        }).join('')
      +'<div style="font-size:10px;color:var(--muted);margin-top:8px;line-height:1.6;">Formula assumes full HP (can\'t damage in Safari Zone). Safari Ball has a 1.5× catch modifier built in.</div>'
      +'</div>';
  }

  function renderAreas() {
    var game = SAFARI_GAMES[curGame];
    return game.areas.map(function(area){
      return '<div style="margin-bottom:16px;">'
        +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));letter-spacing:0.5px;margin-bottom:8px;">'+area.name+'</div>'
        +'<div style="display:flex;flex-wrap:wrap;gap:6px;">'
        + area.pokemon.map(function(p){
            var isSelected = selectedPoke && selectedPoke.num === p.num && selectedPoke.name === p.name;
            return '<div onclick="szSelectPoke('+p.num+',\''+p.name.replace(/'/g,"\\'")
              +'\','+p.cr+','+p.flee+')" style="display:flex;align-items:center;gap:6px;'
              +'padding:5px 10px;background:var(--card);border:1px solid '+(isSelected?'var(--game-color,var(--gold))':'var(--border)')
              +';border-radius:6px;cursor:pointer;transition:border-color .12s;">'
              +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png"'
              +' width="28" height="28" style="image-rendering:pixelated;">'
              +'<div><div style="font-size:11px;font-weight:800;color:'+(isSelected?'var(--game-color,var(--gold))':'var(--text)')+'">'+p.name+'</div>'
              +'<div style="font-size:9px;color:var(--muted);">CR '+p.cr+' &nbsp; '+p.rate+'</div></div></div>';
          }).join('')
        +'</div></div>';
    }).join('');
  }

  function renderTracker() {
    var game = SAFARI_GAMES[curGame];
    var stepPct = steps / game.steps * 100;
    var ballPct = balls / game.balls * 100;
    return '<div class="panel" style="padding:14px 16px;margin-bottom:14px;">'
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--game-color,var(--gold));letter-spacing:0.5px;margin-bottom:12px;">SESSION TRACKER</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
      +'<div><div style="font-size:10px;color:var(--muted);margin-bottom:4px;">STEPS REMAINING</div>'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
      +'<span style="font-size:20px;font-weight:800;color:'+(steps<100?'#F44336':steps<200?'#FFC107':'var(--text)')+'">'+steps+'</span>'
      +'<span style="font-size:11px;color:var(--muted);">/ '+game.steps+'</span></div>'
      +'<div style="height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;"><div style="width:'+stepPct+'%;height:100%;background:'+(steps<100?'#F44336':'#4CAF50')+';border-radius:4px;transition:width .2s;"></div></div>'
      +'<div style="display:flex;gap:6px;margin-top:8px;">'
      +'<button onclick="szAdjStep(-50)" style="padding:4px 8px;font-size:11px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer;">−50</button>'
      +'<button onclick="szAdjStep(-10)" style="padding:4px 8px;font-size:11px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer;">−10</button>'
      +'<button onclick="szReset()" style="padding:4px 8px;font-size:11px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--muted);cursor:pointer;">Reset</button>'
      +'</div></div>'
      +'<div><div style="font-size:10px;color:var(--muted);margin-bottom:4px;">SAFARI BALLS</div>'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
      +'<span style="font-size:20px;font-weight:800;color:'+(balls<=5?'#F44336':balls<=10?'#FFC107':'var(--text)')+'">'+balls+'</span>'
      +'<span style="font-size:11px;color:var(--muted);">/ '+game.balls+'</span></div>'
      +'<div style="height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;"><div style="width:'+ballPct+'%;height:100%;background:'+(balls<=5?'#F44336':'var(--sapphire)')+';border-radius:4px;transition:width .2s;"></div></div>'
      +'<div style="display:flex;gap:6px;margin-top:8px;">'
      +'<button onclick="szAdjBall(-1)" style="padding:4px 8px;font-size:11px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer;">−1 Ball</button>'
      +'<button onclick="szAdjBall(-3)" style="padding:4px 8px;font-size:11px;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer;">−3 Balls</button>'
      +'</div></div>'
      +'</div></div>';
  }

  function render() {
    var game = SAFARI_GAMES[curGame];
    el.innerHTML = ''
      +'<div id="sz-game-btns" style="display:flex;gap:6px;margin-bottom:14px;">'
      +Object.keys(SAFARI_GAMES).map(function(k){
        var g=SAFARI_GAMES[k];
        var active=k===curGame;
        return '<button onclick="szSetGame(\''+k+'\')" style="padding:6px 14px;font-size:11px;font-weight:700;'
          +'background:'+(active?g.color:'var(--panel)')+';color:'+(active?'#000':'var(--text)')+';'
          +'border:1px solid '+(active?g.color:'var(--border)')+';border-radius:5px;cursor:pointer;">'+g.label+'</button>';
      }).join('')+'</div>'
      + renderTracker()
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--muted);letter-spacing:0.5px;margin:16px 0 10px;">CATCH PROBABILITY</div>'
      + renderCalc()
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:var(--muted);letter-spacing:0.5px;margin:16px 0 10px;">POKÉMON BY AREA — click to select</div>'
      + renderAreas();
  }

  window.szSetGame = function(k) { curGame=k; steps=SAFARI_GAMES[k].steps; balls=SAFARI_GAMES[k].balls; render(); };
  window.szSelectPoke = function(num,name,cr,flee) { selectedPoke={num:num,name:name,cr:cr,flee:flee}; render(); };
  window.szAdjStep = function(n) { steps=Math.max(0,steps+n); document.getElementById('safari-content').innerHTML=''; render(); };
  window.szAdjBall = function(n) { balls=Math.max(0,balls+n); document.getElementById('safari-content').innerHTML=''; render(); };
  window.szReset   = function()  { var g=SAFARI_GAMES[curGame]; steps=g.steps; balls=g.balls; render(); };

  render();
}
