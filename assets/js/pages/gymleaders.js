// Gen 2 Gym Leaders — Johto (8) + Kanto post-game (8) + Lance (Champion) + Red (Mt. Silver)
//
// Teams are identical across Gold, Silver, and Crystal. Level scaling for
// Kanto Gym Leaders in Crystal is rebalanced (~50s instead of 30s-40s).

function buildGymLeadersPage() {
  var el = document.getElementById('gymleaders-content') || document.getElementById('page-gymleaders');
  if (!el) return;

  var TYPE_COLORS = {normal:'#9E9E9E',fire:'#E8501A',water:'#1B8FE8',grass:'#3DA83D',electric:'#D4A800',ice:'#60C8C8',fighting:'#B83020',poison:'#8B3099',ground:'#8B6840',flying:'#6850C0',psychic:'#D01868',bug:'#78A810',rock:'#807840',ghost:'#4030A0',dragon:'#5038E8',dark:'#403030',steel:'#9898A8'};

  function typePill(t) {
    return '<span style="display:inline-block;font-size:8px;font-weight:800;padding:1px 5px;border-radius:3px;text-transform:uppercase;background:'+TYPE_COLORS[t]+';color:#fff;margin:1px;">'+t+'</span>';
  }

  function pokeChip(p) {
    var types = (p.types||[]).map(typePill).join('');
    return '<div onclick="_openDexSearch(\''+p.name.replace(/\'/g,"\\'")+'\','+p.num+')" style="display:inline-flex;flex-direction:column;align-items:center;padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;min-width:72px;text-align:center;transition:border-color .12s;" onmouseover="this.style.borderColor=\'var(--gold)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
      +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+p.num+'.png" width="48" height="48" style="image-rendering:pixelated;">'
      +'<div style="font-size:10px;font-weight:800;color:var(--text);white-space:nowrap;">'+p.name+'</div>'
      +'<div style="font-size:9px;color:var(--gold);">Lv '+p.lv+'</div>'
      +'<div style="margin-top:2px;">'+types+'</div>'
      +'</div>';
  }

  function leaderCard(L) {
    var accent = {Flying:'#6850C0',Bug:'#78A810',Normal:'#9E9E9E',Ghost:'#4030A0',Steel:'#9898A8',Fighting:'#B83020',Ice:'#60C8C8',Dragon:'#5038E8',Water:'#1B8FE8',Electric:'#D4A800',Grass:'#3DA83D',Poison:'#8B3099',Psychic:'#D01868',Rock:'#807840',Fire:'#E8501A',Mixed:'var(--gold)'}[L.type] || 'var(--gold)';
    return '<div class="panel" style="padding:16px;margin-bottom:14px;border-left:4px solid '+accent+';">'
      +'<div style="display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:10px;">'
      +'<div style="flex:1;min-width:240px;">'
      +'<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--text);">'+L.name+'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-top:3px;">'+L.city+' · <strong style="color:'+accent+';">'+L.type+'</strong> · '+L.badge+'</div>'
      +(L.reward?'<div style="font-size:10px;color:var(--muted);margin-top:2px;">TM reward: <strong style="color:var(--text);">'+L.reward+'</strong></div>':'')
      +'</div>'
      +'<div style="text-align:right;">'
      +'<div style="font-size:9px;color:var(--muted);text-transform:uppercase;">Weak vs</div>'
      +'<div>'+L.weak.map(typePill).join('')+'</div>'
      +'</div>'
      +'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:8px;">'+L.team.map(pokeChip).join('')+'</div>'
      +(L.tip?'<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.6;padding-top:10px;border-top:1px solid var(--border);"><strong style="color:var(--text);">Tip:</strong> '+L.tip+'</div>':'')
      +'</div>';
  }

  // Johto Gym Leaders (G/S/C teams identical)
  var JOHTO = [
    {name:'Falkner',  city:'Violet City',   type:'Flying',  badge:'Zephyr Badge',  reward:'TM45 Attract', weak:['electric','ice','rock'],
     tip:'Pidgey + Pidgeotto both vulnerable to Geodude\'s Rock-type moves. Both also have Mud-Slap which lowers accuracy — don\'t let them stall.',
     team:[{num:16,name:'Pidgey',lv:7,types:['normal','flying']},{num:17,name:'Pidgeotto',lv:9,types:['normal','flying']}]},

    {name:'Bugsy',    city:'Azalea Town',   type:'Bug',     badge:'Hive Badge',    reward:'TM49 Fury Cutter', weak:['flying','fire','rock'],
     tip:'Scyther is dangerous with Quick Attack — bring a Flying type (Pidgey/Hoothoot) or just out-level. Metapod/Kakuna can stall via Harden.',
     team:[{num:11,name:'Metapod',lv:14,types:['bug']},{num:14,name:'Kakuna',lv:14,types:['bug','poison']},{num:123,name:'Scyther',lv:16,types:['bug','flying']}]},

    {name:'Whitney',  city:'Goldenrod City',type:'Normal',  badge:'Plain Badge',   reward:'TM45 Attract', weak:['fighting'],
     tip:'Miltank with Rollout + Stomp + Attract is famously brutal. Bring a Machop (Fighting), and ideally a male Pokémon to avoid Attract\'s infatuation. Defense Curl + Rollout means every turn it stays in compounds damage — KO it fast.',
     team:[{num:35,name:'Clefairy',lv:18,types:['normal']},{num:241,name:'Miltank',lv:20,types:['normal']}]},

    {name:'Morty',    city:'Ecruteak City', type:'Ghost',   badge:'Fog Badge',     reward:'TM30 Shadow Ball', weak:['dark','ghost'],
     tip:'All Gengar with Hypnosis + Dream Eater is the threat. Bring a Pokémon with Sleep Talk or an Insomnia-line, or just a Dark type (Houndour from Route 37 at night).',
     team:[{num:92,name:'Gastly',lv:21,types:['ghost','poison']},{num:93,name:'Haunter',lv:21,types:['ghost','poison']},{num:94,name:'Gengar',lv:25,types:['ghost','poison']},{num:93,name:'Haunter',lv:23,types:['ghost','poison']}]},

    {name:'Chuck',    city:'Cianwood City', type:'Fighting',badge:'Storm Badge',   reward:'TM01 DynamicPunch', weak:['psychic','flying'],
     tip:'Poliwrath has Surf — pack a Grass type. Primeape\'s Karate Chop + Focus Energy means a guaranteed crit chain. Psychic types (Abra/Drowzee) wreck both.',
     team:[{num:57,name:'Primeape',lv:29,types:['fighting']},{num:62,name:'Poliwrath',lv:31,types:['water','fighting']}]},

    {name:'Jasmine',  city:'Olivine City',  type:'Steel',   badge:'Mineral Badge', reward:'TM23 Iron Tail', weak:['fire','fighting','ground'],
     tip:'Steelix has HUGE Defense — special attacks (Fire / Water) are the way. Bring a Fire type or Magnemite line. The two Magnemite use Sonic Boom (fixed 20 damage) — easy to chip down with anything.',
     team:[{num:81,name:'Magnemite',lv:30,types:['electric','steel']},{num:81,name:'Magnemite',lv:30,types:['electric','steel']},{num:208,name:'Steelix',lv:35,types:['steel','ground']}]},

    {name:'Pryce',    city:'Mahogany Town', type:'Ice',     badge:'Glacier Badge', reward:'TM16 Icy Wind', weak:['fire','fighting','rock','steel'],
     tip:'Piloswine resists Ice with Ground typing — Surf or Fire-type moves are most reliable. Dewgong has Rest and may stall if not killed quickly.',
     team:[{num:86,name:'Seel',lv:27,types:['water']},{num:87,name:'Dewgong',lv:29,types:['water','ice']},{num:221,name:'Piloswine',lv:31,types:['ice','ground']}]},

    {name:'Clair',    city:'Blackthorn City',type:'Dragon', badge:'Rising Badge',  reward:'TM24 DragonBreath', weak:['ice','dragon'],
     tip:'Three Dragonair + Kingdra. Ice-type moves are devastating (Ice Punch, Blizzard, Icy Wind). Kingdra has no weakness — bring an Ice or Dragon type to dent it. After the battle, she insists on a Dragon\'s Den test.',
     team:[{num:148,name:'Dragonair',lv:38,types:['dragon']},{num:148,name:'Dragonair',lv:38,types:['dragon']},{num:148,name:'Dragonair',lv:38,types:['dragon']},{num:230,name:'Kingdra',lv:41,types:['water','dragon']}]},
  ];

  // Kanto Gym Leaders (post-game). Levels for Crystal version listed; G/S are mostly the same.
  var KANTO = [
    {name:'Misty',    city:'Cerulean City',  type:'Water',   badge:'Cascade Badge', weak:['electric','grass'],
     tip:'Starmie\'s Recover + Rapid Spin combo can stall — bring an Electric type with high SpA.',
     team:[{num:120,name:'Staryu',lv:42,types:['water']},{num:121,name:'Starmie',lv:47,types:['water','psychic']},{num:54,name:'Psyduck',lv:42,types:['water']},{num:55,name:'Golduck',lv:47,types:['water']}]},

    {name:'Lt. Surge',city:'Vermilion City', type:'Electric',badge:'Thunder Badge', weak:['ground'],
     tip:'Raichu with Mega Punch + Brick Break covers Ground-type counters. Bring something with Earthquake or a fast Ground type.',
     team:[{num:25,name:'Pikachu',lv:44,types:['electric']},{num:101,name:'Electrode',lv:40,types:['electric']},{num:100,name:'Voltorb',lv:40,types:['electric']},{num:26,name:'Raichu',lv:46,types:['electric']},{num:101,name:'Electrode',lv:42,types:['electric']}]},

    {name:'Erika',    city:'Celadon City',   type:'Grass',   badge:'Rainbow Badge', weak:['fire','ice','flying','bug','poison'],
     tip:'Tangela has Reflect — physical attackers stall out. Bring Fire / Flying / Bug type. Victreebel has Acid Armor.',
     team:[{num:114,name:'Tangela',lv:42,types:['grass']},{num:71,name:'Victreebel',lv:46,types:['grass','poison']},{num:45,name:'Vileplume',lv:46,types:['grass','poison']},{num:188,name:'Skiploom',lv:41,types:['grass','flying']},{num:189,name:'Jumpluff',lv:46,types:['grass','flying']}]},

    {name:'Janine',   city:'Fuchsia City',   type:'Poison',  badge:'Soul Badge',    weak:['psychic','ground'],
     tip:'Crobat is incredibly fast. Psychic types (Espeon, Slowking) wreck the whole team; Ground works on Weezing/Muk.',
     team:[{num:48,name:'Venonat',lv:36,types:['bug','poison']},{num:88,name:'Grimer',lv:36,types:['poison']},{num:88,name:'Grimer',lv:36,types:['poison']},{num:88,name:'Grimer',lv:36,types:['poison']},{num:169,name:'Crobat',lv:39,types:['poison','flying']},{num:49,name:'Venomoth',lv:39,types:['bug','poison']}]},

    {name:'Sabrina',  city:'Saffron City',   type:'Psychic', badge:'Marsh Badge',   weak:['dark','bug','ghost'],
     tip:'Alakazam is glass-cannon — one hit from anything will KO it. Espeon hits back hard but is fragile. Crobat/Houndoom dunk on this team.',
     team:[{num:64,name:'Kadabra',lv:46,types:['psychic']},{num:122,name:'Mr. Mime',lv:46,types:['psychic']},{num:65,name:'Alakazam',lv:48,types:['psychic']},{num:96,name:'Drowzee',lv:46,types:['psychic']},{num:97,name:'Hypno',lv:48,types:['psychic']},{num:201,name:'Espeon',lv:50,types:['psychic']}]},

    {name:'Brock',    city:'Pewter City',    type:'Rock',    badge:'Boulder Badge', weak:['water','grass','fighting','ground','steel'],
     tip:'Hardest-hitting Rock team — Onix, Rhydon. Surf or Hydro Pump wipes most of it in one shot.',
     team:[{num:74,name:'Graveler',lv:51,types:['rock','ground']},{num:75,name:'Graveler',lv:51,types:['rock','ground']},{num:76,name:'Golem',lv:54,types:['rock','ground']},{num:111,name:'Rhyhorn',lv:51,types:['rock','ground']},{num:112,name:'Rhydon',lv:56,types:['rock','ground']},{num:185,name:'Sudowoodo',lv:54,types:['rock']}]},

    {name:'Blaine',   city:'Seafoam Islands',type:'Fire',    badge:'Volcano Badge', weak:['water','rock','ground'],
     tip:'Cinnabar erupted before Gen 2 — Blaine moved to Seafoam Islands B4F. Magcargo is Rock too so Water + Ground covers everything.',
     team:[{num:78,name:'Rapidash',lv:48,types:['fire']},{num:59,name:'Arcanine',lv:54,types:['fire']},{num:219,name:'Magcargo',lv:50,types:['fire','rock']}]},

    {name:'Blue',     city:'Viridian City',  type:'Mixed',   badge:'Earth Badge',   weak:['varies'],
     tip:'Final Kanto Gym Leader — full champion-tier team. Plan for varied types. After defeating him, Mt. Silver opens up.',
     team:[{num:18,name:'Pidgeot',lv:56,types:['normal','flying']},{num:65,name:'Alakazam',lv:54,types:['psychic']},{num:112,name:'Rhydon',lv:56,types:['rock','ground']},{num:130,name:'Gyarados',lv:58,types:['water','flying']},{num:59,name:'Arcanine',lv:58,types:['fire']},{num:103,name:'Exeggutor',lv:58,types:['grass','psychic']}]},
  ];

  // Red (Mt. Silver) — the secret final battle
  var RED = {
    name:'Red',
    city:'Mt. Silver',
    type:'Mixed',
    badge:'Champion of Champions',
    weak:['varies'],
    tip:'The hardest battle in the game. Espeon hits 70+ SpA, Snorlax is a wall, Charizard / Venusaur / Blastoise round out the team. Pikachu has Thunder. Bring max stat-exp Pokémon Lv. 75+; type coverage matters more than levels at this point.',
    team:[
      {num:25,name:'Pikachu',  lv:81, types:['electric']},
      {num:143,name:'Snorlax', lv:73, types:['normal']},
      {num:201,name:'Espeon',  lv:75, types:['psychic']},
      {num:6,  name:'Charizard',lv:77, types:['fire','flying']},
      {num:9,  name:'Blastoise',lv:77, types:['water']},
      {num:3,  name:'Venusaur', lv:77, types:['grass','poison']},
    ]
  };

  el.innerHTML =
    '<div style="max-width:1000px;margin:0 auto;">' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">GYM LEADERS — GEN 2</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:18px;line-height:1.7;">' +
      '16 Gym Leaders total: 8 in Johto, 8 more in Kanto post-game. Teams are <strong style="color:var(--text);">identical across Gold, Silver, and Crystal</strong>. After all 16 badges, Mt. Silver opens for the secret final battle with Red.' +
    '</div>' +

    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin:18px 0 8px;">JOHTO (BADGES 1–8)</div>' +
    JOHTO.map(leaderCard).join('') +

    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin:28px 0 8px;">KANTO (POST-GAME, BADGES 9–16)</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:14px;line-height:1.7;">' +
      'After clearing the Indigo Elite Four, take the S.S. Aqua from Olivine to Vermilion to enter Kanto. Levels here are scaled for Crystal post-game; Gold/Silver are slightly lower. Each leader can be challenged in any order after reaching their gym.' +
    '</div>' +
    KANTO.map(leaderCard).join('') +

    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:#FF5555;margin:32px 0 8px;">MT. SILVER — RED 🏔️</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:14px;line-height:1.7;">' +
      'After all 16 badges and clearing Tohjo Falls, Mt. Silver opens. At the summit cave: Red, the original Pokémon League Champion. This is the hardest battle in the entire Gen 1/2 era and Game Freak\'s secret tribute to the player from Gen 1.' +
    '</div>' +
    leaderCard(RED) +
    '</div>';
}
