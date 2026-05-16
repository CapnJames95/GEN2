// Gen 2 Elite Four reference — Johto (Gold, Silver, Crystal)
//
// Levels are identical across Gold, Silver, and Crystal for the Johto Elite Four.
// Post-game Kanto only features 8 Gym Leaders (no Kanto Elite Four rematch in Gen 2);
// Blue is the Viridian Gym Leader (NOT a Champion in Gen 2).

function buildE4RefPage() {
  var el = document.getElementById('e4ref-content');
  if (!el) return;

  var TYPE_COLORS = {normal:'#9E9E9E',fire:'#E8501A',water:'#1B8FE8',grass:'#3DA83D',electric:'#D4A800',ice:'#60C8C8',fighting:'#B83020',poison:'#8B3099',ground:'#8B6840',flying:'#6850C0',psychic:'#D01868',bug:'#78A810',rock:'#807840',ghost:'#4030A0',dragon:'#5038E8',dark:'#403030',steel:'#9898A8'};

  function typePill(t) {
    return '<span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:3px;text-transform:uppercase;background:'+TYPE_COLORS[t]+';color:#fff;margin:1px;">'+t+'</span>';
  }

  function pokeChip(p) {
    var types = (p.types||[]).map(typePill).join('');
    return '<div onclick="_openDexSearch(\''+p.name+'\','+p.num+')" style="display:inline-flex;flex-direction:column;align-items:center;padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;min-width:72px;text-align:center;transition:border-color .12s;" onmouseover="this.style.borderColor=\'var(--gold)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
      +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png" width="48" height="48" style="image-rendering:pixelated;">'
      +'<div style="font-size:10px;font-weight:800;color:var(--text);white-space:nowrap;">'+p.name+'</div>'
      +'<div style="font-size:9px;color:var(--gold);">Lv '+p.lv+'</div>'
      +(p.held?'<div style="font-size:8px;color:var(--muted);">@'+p.held+'</div>':'')
      +'<div style="margin-top:2px;">'+types+'</div>'
      +'</div>';
  }

  function trainerCard(t) {
    var badgeColor = {'Psychic':'#D01868','Poison':'#8B3099','Fighting':'#B83020','Dark':'#403030','Dragon':'#5038E8'}[t.type] || 'var(--gold)';
    return '<div class="panel" style="padding:16px;margin-bottom:16px;border-left:4px solid '+badgeColor+';">'
      +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">'
      +'<div><div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--text);">'+t.name+'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-top:3px;">'+t.class+' &nbsp;·&nbsp; Specialises in <span style="color:'+badgeColor+'">'+t.type+'</span></div>'
      +(t.note?'<div style="font-size:10px;color:var(--muted);margin-top:2px;font-style:italic;">'+t.note+'</div>':'')
      +'</div>'
      +'<div style="margin-left:auto;text-align:right;">'
      +'<div style="font-size:10px;color:var(--muted);">Weaknesses</div>'
      +'<div>'+t.weak.map(typePill).join('')+'</div>'
      +'</div></div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:8px;">'
      + t.team.map(pokeChip).join('')
      +'</div></div>';
  }

  // Johto Elite Four — same teams across Gold, Silver, Crystal.
  var JOHTO_E4 = [
    {name:'Will', class:'Elite Four #1', type:'Psychic',
     weak:['bug','ghost','dark'],
     note:'First member of the Indigo Plateau Elite Four.',
     team:[
       {num:178, name:'Xatu',      lv:40, types:['psychic','flying']},
       {num:124, name:'Jynx',      lv:41, types:['ice','psychic']},
       {num:080, name:'Slowbro',   lv:41, types:['water','psychic']},
       {num:178, name:'Xatu',      lv:42, types:['psychic','flying']},
       {num:103, name:'Exeggutor', lv:42, types:['grass','psychic']},
     ]},
    {name:'Koga', class:'Elite Four #2', type:'Poison',
     weak:['psychic','ground'],
     note:'Former Fuchsia City Gym Leader, now Elite Four.',
     team:[
       {num:168, name:'Ariados',    lv:40, types:['bug','poison']},
       {num:049, name:'Venomoth',   lv:41, types:['bug','poison']},
       {num:205, name:'Forretress', lv:43, types:['bug','steel']},
       {num:169, name:'Crobat',     lv:44, types:['poison','flying']},
       {num:089, name:'Muk',        lv:42, types:['poison']},
     ]},
    {name:'Bruno', class:'Elite Four #3', type:'Fighting',
     weak:['psychic','flying'],
     note:'Same Bruno as the original Indigo Elite Four (Gen 1).',
     team:[
       {num:237, name:'Hitmontop',  lv:42, types:['fighting']},
       {num:106, name:'Hitmonlee',  lv:42, types:['fighting']},
       {num:107, name:'Hitmonchan', lv:42, types:['fighting']},
       {num:095, name:'Onix',       lv:43, types:['rock','ground']},
       {num:068, name:'Machamp',    lv:46, types:['fighting']},
     ]},
    {name:'Karen', class:'Elite Four #4', type:'Dark',
     weak:['fighting','bug'],
     note:'"Strong Pokémon. Weak Pokémon. That is only the selfish perception of people…"',
     team:[
       {num:197, name:'Umbreon',  lv:42, types:['dark']},
       {num:045, name:'Vileplume',lv:42, types:['grass','poison']},
       {num:094, name:'Gengar',   lv:45, types:['ghost','poison']},
       {num:198, name:'Murkrow',  lv:44, types:['dark','flying']},
       {num:229, name:'Houndoom', lv:47, types:['dark','fire']},
     ]},
    {name:'Lance', class:'Champion', type:'Dragon',
     weak:['ice','dragon'],
     note:'Promoted from Elite Four to Champion. Crystal version uses the same team.',
     team:[
       {num:130, name:'Gyarados',  lv:44, types:['water','flying']},
       {num:149, name:'Dragonite', lv:47, types:['dragon','flying']},
       {num:149, name:'Dragonite', lv:47, types:['dragon','flying']},
       {num:142, name:'Aerodactyl',lv:46, types:['rock','flying']},
       {num:006, name:'Charizard', lv:46, types:['fire','flying']},
       {num:149, name:'Dragonite', lv:50, types:['dragon','flying']},
     ]},
  ];

  // Kanto post-game Gym Leaders (Crystal-era teams). Levels rise to ~50s. Trimmed list.
  // (Full Kanto rematch data — including level scaling — will be added in the Trainers / Gym Leaders page.)

  el.innerHTML =
    '<div style="max-width:980px;margin:0 auto;">' +
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">INDIGO PLATEAU ELITE FOUR</div>' +
      '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;">Johto Elite Four — identical teams across Gold, Silver, and Crystal. Defeat all five to become Champion and unlock the Kanto region.</div>' +
      JOHTO_E4.map(trainerCard).join('') +
      '<div style="font-size:11px;color:var(--muted);margin-top:20px;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:6px;line-height:1.7;">' +
        '<strong style="color:var(--text);">Note on Gen 2 vs other gens:</strong> there is no Kanto Elite Four rematch in Gold/Silver/Crystal. The post-game in Kanto features only the 8 Kanto Gym Leaders. Blue is the Viridian City Gym Leader — not a Champion. ' +
        'Red can be challenged at the summit of Mt. Silver after all 16 badges are collected, as the games\' true secret final battle.' +
      '</div>' +
    '</div>';
}
