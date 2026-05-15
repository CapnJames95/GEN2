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
    var badgeColor = {'Ice':'#60C8C8','Fighting':'#B83020','Ghost':'#4030A0','Dragon':'#5038E8','Dark':'#403030','Steel':'#9898A8','Water':'#1B8FE8','Normal':'#9E9E9E','Champion':'var(--gold)'}[t.type] || 'var(--gold)';
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

  var GAMES = {
    frlg: {
      label:'🔥 Gold / 🌿 Silver', color:'var(--fire)',
      trainers:[
        {name:'Lorelei',class:'Elite Four',type:'Ice',weak:['rock','fire','fighting','steel'],
         team:[{num:87,name:'Dewgong',lv:54,types:['water','ice']},{num:91,name:'Cloyster',lv:53,types:['water','ice']},
               {num:80,name:'Slowbro',lv:54,types:['water','psychic']},{num:124,name:'Jynx',lv:56,types:['ice','psychic']},
               {num:131,name:'Lapras',lv:60,types:['water','ice']}]},
        {name:'Bruno',class:'Elite Four',type:'Fighting',weak:['flying','psychic','fire','fairy'],
         team:[{num:95,name:'Onix',lv:53,types:['rock','ground']},{num:107,name:'Hitmonchan',lv:55,types:['fighting']},
               {num:106,name:'Hitmonlee',lv:55,types:['fighting']},{num:95,name:'Onix',lv:56,types:['rock','ground']},
               {num:68,name:'Machamp',lv:58,types:['fighting']}]},
        {name:'Agatha',class:'Elite Four',type:'Ghost',weak:['ghost','dark','psychic'],
         team:[{num:94,name:'Gengar',lv:54,types:['ghost','poison']},{num:93,name:'Haunter',lv:53,types:['ghost','poison']},
               {num:94,name:'Gengar',lv:58,types:['ghost','poison']},{num:24,name:'Arbok',lv:58,types:['poison']},
               {num:94,name:'Gengar',lv:60,types:['ghost','poison']}]},
        {name:'Lance',class:'Elite Four',type:'Dragon',weak:['ice','dragon','fairy'],
         team:[{num:130,name:'Gyarados',lv:58,types:['water','flying']},{num:148,name:'Dragonair',lv:56,types:['dragon']},
               {num:148,name:'Dragonair',lv:56,types:['dragon']},{num:142,name:'Aerodactyl',lv:60,types:['rock','flying']},
               {num:149,name:'Dragonite',lv:60,types:['dragon','flying']}]},
        {name:'Blue',class:'Champion',type:'Champion',note:'Has Blastoise in Gold, Charizard in Silver',
         weak:['varies'],
         team:[{num:18,name:'Pidgeot',lv:59,types:['normal','flying']},{num:65,name:'Alakazam',lv:59,types:['psychic']},
               {num:112,name:'Rhydon',lv:61,types:['ground','rock']},{num:103,name:'Exeggutor',lv:61,types:['grass','psychic']},
               {num:59,name:'Arcanine',lv:63,types:['fire'],held:'',note:'FR only'},{num:9,name:'Blastoise',lv:65,types:['water'],note:'FR only'}]},
      ]
    },
    rse: {
      label:'🔴 Ruby / 🔷 Sapphire', color:'#5599FF',
      trainers:[
        {name:'Sidney',class:'Elite Four',type:'Dark',weak:['fighting','bug','fairy'],
         team:[{num:262,name:'Mightyena',lv:46,types:['dark']},{num:275,name:'Shiftry',lv:48,types:['grass','dark']},
               {num:332,name:'Cacturne',lv:46,types:['grass','dark']},{num:342,name:'Crawdaunt',lv:48,types:['water','dark']},
               {num:359,name:'Absol',lv:49,types:['dark']}]},
        {name:'Phoebe',class:'Elite Four',type:'Ghost',weak:['ghost','dark'],
         team:[{num:356,name:'Dusclops',lv:48,types:['ghost']},{num:354,name:'Banette',lv:49,types:['ghost']},
               {num:353,name:'Shuppet',lv:49,types:['ghost']},{num:356,name:'Dusclops',lv:51,types:['ghost']},
               {num:354,name:'Banette',lv:50,types:['ghost']}]},
        {name:'Glacia',class:'Elite Four',type:'Ice',weak:['fire','fighting','rock','steel'],
         team:[{num:364,name:'Sealeo',lv:50,types:['ice','water']},{num:364,name:'Sealeo',lv:50,types:['ice','water']},
               {num:362,name:'Glalie',lv:52,types:['ice']},{num:365,name:'Walrein',lv:52,types:['ice','water']},
               {num:362,name:'Glalie',lv:53,types:['ice']}]},
        {name:'Drake',class:'Elite Four',type:'Dragon',weak:['ice','dragon','fairy'],
         team:[{num:372,name:'Shelgon',lv:52,types:['dragon']},{num:334,name:'Altaria',lv:54,types:['dragon','flying']},
               {num:330,name:'Flygon',lv:53,types:['ground','dragon']},{num:330,name:'Flygon',lv:53,types:['ground','dragon']},
               {num:373,name:'Salamence',lv:55,types:['dragon','flying']}]},
        {name:'Steven',class:'Champion',type:'Steel',weak:['fire','fighting','ground'],
         team:[{num:227,name:'Skarmory',lv:57,types:['steel','flying']},{num:344,name:'Claydol',lv:55,types:['ground','psychic']},
               {num:306,name:'Aggron',lv:56,types:['steel','rock']},{num:346,name:'Cradily',lv:56,types:['rock','grass']},
               {num:348,name:'Armaldo',lv:56,types:['rock','bug']},{num:376,name:'Metagross',lv:58,types:['steel','psychic'],held:'Sitrus Berry'}]},
      ]
    },
    emerald: {
      label:'💚 Crystal', color:'#44DD88',
      trainers:[
        {name:'Sidney',class:'Elite Four',type:'Dark',weak:['fighting','bug','fairy'],
         team:[{num:262,name:'Mightyena',lv:48,types:['dark']},{num:275,name:'Shiftry',lv:50,types:['grass','dark']},
               {num:332,name:'Cacturne',lv:48,types:['grass','dark']},{num:342,name:'Crawdaunt',lv:51,types:['water','dark']},
               {num:359,name:'Absol',lv:52,types:['dark']}]},
        {name:'Phoebe',class:'Elite Four',type:'Ghost',weak:['ghost','dark'],
         team:[{num:356,name:'Dusclops',lv:51,types:['ghost']},{num:354,name:'Banette',lv:52,types:['ghost']},
               {num:302,name:'Sableye',lv:50,types:['ghost','dark']},{num:356,name:'Dusclops',lv:53,types:['ghost']},
               {num:354,name:'Banette',lv:53,types:['ghost']}]},
        {name:'Glacia',class:'Elite Four',type:'Ice',weak:['fire','fighting','rock','steel'],
         team:[{num:362,name:'Glalie',lv:52,types:['ice']},{num:364,name:'Sealeo',lv:53,types:['ice','water']},
               {num:364,name:'Sealeo',lv:53,types:['ice','water']},{num:362,name:'Glalie',lv:54,types:['ice']},
               {num:365,name:'Walrein',lv:58,types:['ice','water'],held:'Sitrus Berry'}]},
        {name:'Drake',class:'Elite Four',type:'Dragon',weak:['ice','dragon','fairy'],
         team:[{num:372,name:'Shelgon',lv:52,types:['dragon']},{num:334,name:'Altaria',lv:54,types:['dragon','flying']},
               {num:330,name:'Flygon',lv:53,types:['ground','dragon']},{num:330,name:'Flygon',lv:53,types:['ground','dragon']},
               {num:373,name:'Salamence',lv:55,types:['dragon','flying']}]},
        {name:'Wallace',class:'Champion',type:'Water',weak:['grass','electric'],note:'Replaces Steven as Champion in Crystal',
         team:[{num:321,name:'Wailord',lv:57,types:['water']},{num:73,name:'Tentacruel',lv:55,types:['water','poison']},
               {num:272,name:'Ludicolo',lv:56,types:['water','grass']},{num:340,name:'Whiscash',lv:56,types:['water','ground']},
               {num:130,name:'Gyarados',lv:56,types:['water','flying']},{num:350,name:'Milotic',lv:58,types:['water'],held:'Sitrus Berry'}]},
      ]
    }
  };

  var _e4GameMap = {FR:'frlg', LG:'frlg', R:'rse', S:'rse', E:'emerald'};
  var selGame = (typeof GAME !== 'undefined' && GAME !== 'all' && _e4GameMap[GAME]) ? _e4GameMap[GAME] : 'frlg';

  function render() {
    var game = GAMES[selGame];
    el.innerHTML = '<div id="e4-game-btns" style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">'
      + Object.keys(GAMES).map(function(k){
          var g=GAMES[k]; var active=k===selGame;
          return '<button onclick="e4SetGame(\''+k+'\')" style="padding:7px 16px;font-size:11px;font-weight:700;background:'+(active?g.color:'var(--panel)')+';color:'+(active?'#000':'var(--text)')+';border:1px solid '+(active?g.color:'var(--border)')+';border-radius:5px;cursor:pointer;">'+g.label+'</button>';
        }).join('')
      +'</div>'
      +'<div style="background:color-mix(in srgb,var(--game-color,var(--gold)) 6%,transparent);border:1px solid color-mix(in srgb,var(--game-color,var(--gold)) 20%,transparent);border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:11px;color:var(--muted);line-height:1.7;">'
      +'Levels shown are for the <strong style="color:var(--game-color,var(--gold));">first challenge</strong>. Click any Pokémon to jump to its Pokédex entry.'
      +'</div>'
      + game.trainers.map(trainerCard).join('');
  }

  window.e4SetGame = function(k) { selGame=k; render(); };
  render();
}
