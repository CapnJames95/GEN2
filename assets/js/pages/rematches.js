function buildRematchesPage() {
  var el = document.getElementById('rematches-content');
  if (!el) return;

  var GAMES_LIST = ['FR/LG','Crystal'];

  var REMATCHES = {
    'FR/LG': [
      {loc:'Route 1', class:'Youngster', name:'Ben', note:'x2 Rattata L4 — Easy Spd EVs at start of game', ev:'Spd', money:false},
      {loc:'Route 3', class:'Lass', name:'Shannon', note:'Clefairy L14 → SpA EV farming', ev:'SpA', money:false},
      {loc:'Route 4', class:'Twins', name:'Miu & Yuta', note:'2× Clefairy L14 → double SpA EVs per battle', ev:'SpA', money:false},
      {loc:'Route 6', class:'Picnicker', name:'Carol', note:'Meowth L18 → Spd EVs; useful mid-game', ev:'Spd', money:false},
      {loc:'Route 9', class:'Bird Keeper',name:'Benny', note:'Rematch: Fearow L41 → 2 Spd EVs; great Spd farmer', ev:'Spd', money:false},
      {loc:'Route 10', class:'Cooltrainer',name:'Victor', note:'High-level team; good EXP grind late-game', ev:'mixed', money:false},
      {loc:'Route 11', class:'Youngster', name:'Joey', note:'Ekans/Arbok → Atk EVs, easy access', ev:'Atk', money:false},
      {loc:'Route 12', class:'Lady', name:'Jacki', note:'Very high prize money rematch — best money farmer in GSC', ev:null, money:true},
      {loc:'Route 16', class:'Cue Ball', name:'Luke', note:'Primeape L45 → 1 Atk + 1 Spd EV; efficient combo', ev:'Atk+Spd', money:false},
      {loc:'Route 19', class:'Swimmer', name:'Diana', note:'Goldeen → SpA EVs; useful aqua-route grind', ev:'SpA', money:false},
      {loc:'Kindle Road',class:'Scientist',name:'Gideon', note:'Electrode L40 → 2 Spd EVs + high EXP; best Spd farmer on Island 1', ev:'Spd', money:false},
      {loc:'Route 25', class:'Bird Keeper',name:'Marlon', note:'Pidgey line → Spd EVs; rematch chain north of Cerulean', ev:'Spd', money:false},
      {loc:'Cerulean City',class:'Picnicker',name:'Alicia',note:'Jigglypuff → SpA EVs; early-game option', ev:'SpA', money:false},
    ],
    'Crystal': [
      {loc:'Route 103',class:'Youngster', name:'Murphy', note:'x2 Zigzagoon L3 — best early Spd EV location; easy chain', ev:'Spd', money:false},
      {loc:'Route 110',class:'Cooltrainer',name:'Abby', note:'Higher-level team; good EXP for mid-game', ev:'mixed', money:false},
      {loc:'Route 117',class:'Aroma Lady',name:'Rose', note:'Roselia → 1 SpA + 1 SpD EV per battle; very efficient', ev:'SpA+SpD', money:false},
      {loc:'Route 118',class:'Fisherman', name:'Andre', note:'Carvanha → Atk EVs; aquatic route option', ev:'Atk', money:false},
      {loc:'Route 119',class:'Expert', name:'Shelby', note:'Machoke → Atk EVs; reliable mid-to-late farmer', ev:'Atk', money:false},
      {loc:'Route 120',class:'Bug Maniac',name:'Jeffrey', note:'Full bug team; mixed EVs; high money payout for class', ev:'mixed', money:false},
      {loc:'Route 128',class:'Dragon Tamer',name:'Nicolas',note:'Dragonair → Atk EVs; late-game high EXP grind', ev:'Atk', money:false},
      {loc:'Route 111',class:'Ruin Maniac',name:'Dusty', note:'Trapinch → Atk EVs; good for Attack EV training early on', ev:'Atk', money:false},
      {loc:'Route 115',class:'Expert', name:'Timothy', note:'Machoke → Atk EVs; north of Rustboro', ev:'Atk', money:false},
      {loc:'Victory Road',class:'Cooltrainer',name:'Vito', note:'High-level Pokémon; best EXP per battle late-game on route', ev:'mixed', money:false},
      {loc:'Battle Frontier',class:'Lady',name:'Multiple', note:'Rich Ladies in resort area — top money farmers in Crystal', ev:null, money:true},
    ]
  };

  var EV_COLORS = {Spd:'#FFD700',Atk:'#FF6B35',SpA:'#64b4ff','SpA+SpD':'#81C784','Atk+Spd':'#FFA040',mixed:'var(--muted)',HP:'#ef5350',Def:'#9E9E9E',SpD:'#4CAF50'};

  var _rmGameMap = {FR:'FR/LG', LG:'FR/LG', R:'FR/LG', S:'FR/LG', E:'Crystal'};
  var selGame = (typeof GAME !== 'undefined' && GAME !== 'all' && _rmGameMap[GAME]) ? _rmGameMap[GAME] : 'FR/LG';
  var searchQ = '';

  var _rmPokeNames = POKE.map(function(p){ return p.name; }).sort(function(a,b){ return b.length-a.length; });
  function _rmLinkPoke(text) {
    _rmPokeNames.forEach(function(name) {
      var re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'g');
      text = text.replace(re, '<span class="guide-poke-link" onclick="guideDex(\''+name.replace(/'/g,"\\'")+'\')">'+name+'</span>');
    });
    return text;
  }

  function renderTable() {
    var rows = REMATCHES[selGame].filter(function(r){
      if (!searchQ) return true;
      var q = searchQ.toLowerCase();
      return r.loc.toLowerCase().indexOf(q)!==-1 || r.class.toLowerCase().indexOf(q)!==-1 || r.name.toLowerCase().indexOf(q)!==-1 || (r.note||'').toLowerCase().indexOf(q)!==-1;
    });
    if (!rows.length) return '<div style="color:var(--muted);font-size:12px;padding:24px;text-align:center;">No results.</div>';
    return '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">'
      +'<thead><tr style="border-bottom:2px solid var(--border);">'
      +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:var(--game-color,var(--gold));">Location</th>'
      +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:var(--game-color,var(--gold));">Trainer</th>'
      +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:var(--game-color,var(--gold));">EV Yield</th>'
      +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:800;text-transform:uppercase;color:var(--game-color,var(--gold));">Notes</th>'
      +'</tr></thead><tbody>'
      + rows.map(function(r){
          var evColor = r.ev ? (EV_COLORS[r.ev]||'var(--text)') : 'var(--gold)';
          var evLabel = r.money ? '💰 Money' : (r.ev||'—');
          return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);" onmouseover="this.style.background=\'rgba(255,255,255,.03)\'" onmouseout="this.style.background=\'\'">'
            +'<td style="padding:8px 10px;color:var(--muted);white-space:nowrap;">'+r.loc+'</td>'
            +'<td style="padding:8px 10px;"><div style="font-weight:700;">'+r.name+'</div><div style="font-size:10px;color:var(--muted);">'+r.class+'</div></td>'
            +'<td style="padding:8px 10px;"><span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:3px;background:rgba(255,255,255,.05);color:'+evColor+';">'+evLabel+'</span></td>'
            +'<td style="padding:8px 10px;color:var(--muted);font-size:11px;">'+_rmLinkPoke(r.note)+'</td>'
            +'</tr>';
        }).join('')
      +'</tbody></table></div>';
  }

  function render() {
    el.innerHTML = '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;align-items:center;">'
      +'<div id="rm-game-btns" style="display:contents;">'
      + GAMES_LIST.map(function(g){
          var active=g===selGame;
          var color = g==='FR/LG'?'var(--fire)':'#44DD88';
          return '<button onclick="rmSetGame(\''+g+'\')" style="padding:6px 14px;font-size:11px;font-weight:700;background:'+(active?color:'var(--panel)')+';color:'+(active?'#000':'var(--text)')+';border:1px solid '+(active?color:'var(--border)')+';border-radius:5px;cursor:pointer;">'+g+'</button>';
        }).join('')
      +'</div>'
      +'<input id="rm-search" type="text" placeholder="Search location, trainer…" oninput="rmSearch(this.value)"'
      +' style="flex:1;min-width:160px;max-width:280px;padding:6px 10px;background:var(--card);border:1px solid var(--border);border-radius:5px;color:var(--text);font-size:12px;font-family:\'Nunito\',sans-serif;"'
      +' value="'+searchQ.replace(/"/g,'&quot;')+'">'
      +'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-bottom:12px;line-height:1.7;">'
      +(selGame==='FR/LG'?'<strong style="color:var(--game-color,var(--gold));">VS Seeker</strong> — re-challenge trainers anywhere in Kanto after obtaining it in Route 5. Trainers must be in sight range. Levels increase with your Badge count.'
        :'<strong style="color:var(--game-color,var(--gold));">VS Seeker + Trainer\'s Eye</strong> — Crystal\'s PokéNav Trainer\'s Eye lets you rematch registered trainers. Many have notably stronger rematches.')
      +'</div>'
      + renderTable();
  }

  window.rmSetGame = function(g) { selGame=g; searchQ=''; render(); };
  window.rmSearch  = function(q) { searchQ=q; render(); };
  render();
}
