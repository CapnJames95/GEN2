// ══ Extra Gen-2 feature pages ══════════════════════════════════
// Bundles: Ribbon Tracker, Radio Tower, Headbutt trees, Ruins of Alph,
// Mt. Mortar, Time Capsule, Mystery Gift.
//
// Each builder is idempotent — checks dataset.built before rendering.

(function() {
  'use strict';

  function panel(html) {
    return '<div class="panel" style="padding:22px;max-width:980px;margin:0 auto;">' + html + '</div>';
  }
  function section(title, body) {
    return '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));letter-spacing:0.5px;margin:18px 0 8px;border-bottom:1px solid var(--border);padding-bottom:6px;">' + title + '</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.8;margin-bottom:6px;">' + body + '</div>';
  }
  function table(headers, rows, opts) {
    opts = opts || {};
    var thStyle = 'text-align:left;padding:8px 10px;font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));letter-spacing:0.5px;border-bottom:2px solid var(--border);';
    var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">'
      + '<thead><tr>'
      + headers.map(function(h){ return '<th style="'+thStyle+'">'+h+'</th>'; }).join('')
      + '</tr></thead><tbody>'
      + rows.map(function(r, i){
        var bg = i % 2 ? 'background:rgba(255,255,255,.02);' : '';
        return '<tr style="' + bg + 'border-bottom:1px solid rgba(255,255,255,.04);">'
          + r.map(function(c){ return '<td style="padding:8px 10px;color:var(--text);vertical-align:top;">'+c+'</td>'; }).join('')
          + '</tr>';
      }).join('')
      + '</tbody></table></div>';
    return html;
  }
  function pkmnLink(name) {
    return '<span class="guide-poke-link" onclick="guideDex(\''+name.replace(/'/g,"\\'")+'\')">'+name+'</span>';
  }
  function itemLink(name) {
    return '<span class="guide-item-link" onclick="openItemByName(\''+name.replace(/'/g,"\\'")+'\')">'+name+'</span>';
  }
  // Return the element if it exists AND it either hasn't been built yet
  // OR its content has been wiped. This allows re-rendering after the
  // built-in recovery system clears innerHTML on a page-switch.
  function pageRoot(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    if (el.dataset.built === '1' && el.innerHTML.trim().length > 0) return null;
    el.dataset.built = '1';
    return el;
  }

  // ──────────────────────────────────────────────────────────────
  //  RIBBON TRACKER (Gen 2)
  // ──────────────────────────────────────────────────────────────
  // GSC has a very limited ribbon system. Crystal added a single
  // Battle Tower "Crystal Tier" series of ribbons; Stadium 2 carried
  // over the Hall of Fame / Champion ribbons via transfer.
  var GEN2_RIBBONS = [
    { name:'Champion Ribbon',     icon:'🏆', games:['FR','LG','E'], how:'Beat the Indigo Plateau Elite Four & Champion Lance — awarded automatically and persists across save resets.' },
    { name:'Hall of Fame Ribbon', icon:'🎖', games:['FR','LG','E'], how:'Awarded to every Pokémon you enter into the Hall of Fame. Persists when transferred to Pokémon Stadium 2.' },
    { name:'Battle Tower (Lv30) Ribbon', icon:'🗼', games:['E'], how:'Crystal only. Sweep 7 consecutive battles in the Lv30 Tower with the same team — single ribbon awarded once per team.' },
    { name:'Battle Tower (Lv50) Ribbon', icon:'🗼', games:['E'], how:'Crystal only. Sweep 7 in the Lv50 Tower.' },
    { name:'Battle Tower (Lv70) Ribbon', icon:'🗼', games:['E'], how:'Crystal only. Sweep 7 in the Lv70 Tower.' },
    { name:'Battle Tower (Lv100) Ribbon', icon:'🗼', games:['E'], how:'Crystal only. Sweep 7 in the Lv100 Tower — the hardest.' },
    { name:'Mobile Tower Ribbon', icon:'📡', games:['E'], how:'JP Crystal Mobile only. Cleared specific Mobile Adapter GB battle tower runs. Never localised.' }
  ];
  var RIB_GAME_LABELS = { FR:'Gold', LG:'Silver', E:'Crystal' };
  var RIB_GAME_COLORS = { FR:'#E5B928', LG:'#B0BEC5', E:'#7FB8E0' };

  window.buildRibbonPage = function() {
    var el = pageRoot('ribbon-content');
    if (!el) return;
    var rows = GEN2_RIBBONS.map(function(r) {
      var games = r.games.map(function(g) {
        return '<span style="display:inline-block;background:'+RIB_GAME_COLORS[g]+';color:#000;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;margin-right:3px;">'+RIB_GAME_LABELS[g]+'</span>';
      }).join('');
      return [
        '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">'+r.icon+'</span><strong style="color:var(--text);">'+r.name+'</strong></div>',
        games,
        '<span style="color:var(--muted);line-height:1.7;">'+r.how+'</span>'
      ];
    });
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">RIBBONS — GEN 2</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Gen 2 has a very small ribbon set. Crystal adds the Battle-Tower-tier ribbons; everything else came from beating the Elite Four and from Stadium 2 carry-over. There are <strong>no</strong> Contest, Effort, or Hoenn-style ribbons in original GSC.'
      + '</div>'
      + table(['Ribbon','Games','How'], rows)
    );
    window._ribbonsBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  RADIO TOWER
  // ──────────────────────────────────────────────────────────────
  window.buildRadioPage = function() {
    var el = pageRoot('radio-content');
    if (!el) return;
    var johtoStations = [
      ['🎵 Pokémon March',       'Mood music for trainers — also wakes nearby wild Pokémon (slight encounter boost on grass).'],
      ['🎶 Pokémon Lullaby',     'Lulls wild Pokémon to sleep (slight catch-rate aid in tall grass).'],
      ['📞 Buena\'s Password',   'Goldenrod nightly password puzzle. Match the password at Buena (Goldenrod Radio) for a Blue Card point. Cash points in for items (Soft Sand, Sharp Beak, Magnet, etc.).'],
      ['📰 Pokémon Talk',        'DJ Mary + DJ Ben. Mentions a daily location with a swarm of a specific Pokémon (e.g. Dunsparce on Dark Cave, Yanma on Route 35).'],
      ['📻 Oak\'s Pokémon Talk', 'Same swarm-of-the-day audio in Kanto. Lists where a particular Pokémon is plentiful for today.'],
      ['🎚 Lucky Channel',       'Lucky Number Show — match the lottery number to your Trainer ID for an item (Master Ball if all 5 digits match).'],
      ['🔇 Variety Channel',     'Plays one of several rotating shows.']
    ];
    var kantoStations = [
      ['📻 Pokéflute Channel',   'Tune to it while standing next to the Route 11 Snorlax — wakes it for the encounter.'],
      ['🎵 Place Music',         'Plays the local town\'s music theme.'],
      ['🎤 Lavender Town Music', 'Required to clear the Radio Tower for the EXPN Card.']
    ];
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">RADIO TOWER</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Two radio towers are open in Gen 2: <strong>Goldenrod</strong> (Johto, with the Radio Card) and <strong>Lavender</strong> (Kanto, with the EXPN Card). Stations affect wild encounters, give daily items, and unlock plot beats.'
      + '</div>'
      + section('Get the Cards', '• <strong>Radio Card</strong> — Goldenrod Radio Tower quiz. Pass and you can listen to all Johto stations on your Pokégear.<br>'
        + '• <strong>EXPN Card</strong> — Lavender Radio Tower manager after clearing the Kanto Radio plot. Required for Kanto stations including Pokéflute.')
      + section('Johto Stations (Goldenrod)', table(['Station','What it does'], johtoStations))
      + section('Kanto Stations (Lavender)', table(['Station','What it does'], kantoStations))
      + section('Daily Swarms (Pokémon Talk)', 'Each day, "Pokémon Talk" highlights a different swarm location. Common rotations include: <strong>Dunsparce</strong> (Dark Cave), <strong>Yanma</strong> (Route 35), <strong>Snubbull</strong> (Route 38), <strong>Qwilfish</strong> (Route 32 fishing), <strong>Marill</strong> (Mt. Mortar). The swarm Pokémon\'s encounter rate spikes for that day only.')
      + section('Lucky Number Show', 'Each week, a 5-digit number is drawn. Match your active Pokémon\'s OT ID to the drawn number:<br>'
        + '• <strong>All 5 digits</strong> → <strong>Master Ball</strong><br>'
        + '• <strong>Last 3 digits</strong> → Exp. Share<br>'
        + '• <strong>Last 2 digits</strong> → PP Up<br>'
        + 'Switch your party member to test every owned Pokémon — only the active leader counts.')
    );
    window._radioBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  HEADBUTT TREES
  // ──────────────────────────────────────────────────────────────
  window.buildHeadbuttPage = function() {
    var el = pageRoot('headbutt-content');
    if (!el) return;
    var spawns = [
      ['Route 26 / 27 / 28', '<strong>Heracross</strong>, Aipom, Hoothoot, Noctowl, Spearow', 'Best Heracross route in the game.'],
      ['Route 35 / 36 / 37 / 38 / 39', 'Aipom, Hoothoot, Pineco, Ledyba (morning), Spinarak (night)', 'Time-of-day matters for the Bug-type spawns.'],
      ['Route 42 / 43 / 44 / 45', 'Aipom, Pineco, Hoothoot, ' + pkmnLink('Heracross'), 'Heracross again on a couple of these trees.'],
      ['Route 29 / 30 / 31', 'Hoothoot, Pineco, ' + pkmnLink('Ledyba') + ' / ' + pkmnLink('Spinarak'), 'Early routes — easy access right out of the gate.'],
      ['Ilex Forest', 'Aipom, Pineco, ' + pkmnLink('Heracross'), 'Trees are dense here — combined with Bug Catching Contest area.'],
      ['Azalea Town', 'Aipom, Hoothoot', '1-2 small trees near the Slowpoke Well.']
    ];
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">HEADBUTT TREES</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Headbutt-able trees in Johto/Kanto host their own encounter pool. ~50% of trees are empty when slammed; the rest roll the local Headbutt table. Heracross, Aipom, and Pineco are <strong>only</strong> obtainable this way (no grass encounter).'
      + '</div>'
      + section('Where to get Headbutt', '<strong>Ilex Forest</strong> — the man inside the southern cabin teaches it to any Pokémon for free.')
      + section('Headbutt encounter pools', table(['Area','Common spawns','Notes'], spawns))
      + section('Tips', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Each tree has a <strong>fixed RNG seed</strong> based on its location — some trees in the same area will <em>never</em> give certain species.</li>'
        + '<li>If you Headbutt a tree and it\'s empty, walk away and back to reset its state.</li>'
        + '<li>For <strong>Heracross</strong>: hit every tree on Routes 26, 27, 28, 42, 43 — Heracross only spawns on a small set of trees per route.</li>'
        + '<li>For <strong>Pineco</strong>: best on Ilex / Route 36–37. Note that wild Pineco may use Selfdestruct — switch to a Ghost or low-priority lead.</li>'
        + '</ul>')
    );
    window._headbuttBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  RUINS OF ALPH
  // ──────────────────────────────────────────────────────────────
  window.buildRuinsPage = function() {
    var el = pageRoot('ruins-content');
    if (!el) return;
    var puzzles = [
      ['Kabuto', 'Ho-Oh Chamber',   'Arrange the tiles to form a Kabuto silhouette. Unlocks the Kabuto Chamber and adds those Unown letters to your encounter pool.'],
      ['Aerodactyl', 'Aerodactyl Chamber','Aerodactyl silhouette puzzle.'],
      ['Omanyte', 'Omanyte Chamber', 'Omanyte silhouette.'],
      ['Ho-Oh', 'Final Chamber',    'Ho-Oh silhouette. Crystal opens this last after the previous three.']
    ];
    var crystalRooms = [
      ['! (exclamation)', 'Tanoby Chambers — Crystal-only addition. Drop into the unmarked Unown room after solving the first three puzzles to add the ! form to the encounter pool.'],
      ['? (question)',    'Crystal-only. Solve the radio puzzle in the Ruins research center (use the Pokégear radio while standing on the central pad).']
    ];
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">RUINS OF ALPH</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'A small dungeon north of Violet City that houses the <strong>' + pkmnLink('Unown') + '</strong>. Each puzzle solved adds more Unown letters to the wild encounter pool.'
      + '</div>'
      + section('Puzzle Chambers', table(['Silhouette','Chamber','Description'], puzzles))
      + section('Crystal-only Unown Forms', table(['Form','How to unlock'], crystalRooms))
      + section('Items Inside', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>' + itemLink('Energy Powder') + ' (puzzle reward)</li>'
        + '<li>' + itemLink('Heal Powder')   + ' (puzzle reward)</li>'
        + '<li>Various ' + itemLink('Berry') + ' / ' + itemLink('Gold Berry') + ' on the chamber floors</li>'
        + '<li><strong>Unown Report</strong> — the Ruins researcher gives you the Unown Dex once you\'ve seen all 26 (28 in Crystal). Each Unown caught also fills out the report.</li>'
        + '</ul>')
      + section('Tips', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Unown letter is rolled from the four DVs — see the <strong>RNG Guide</strong> for the exact mapping.</li>'
        + '<li>You can\'t get all letters in one save without all four puzzles solved. Solve them in any order.</li>'
        + '<li>Bring repels — random Geodude / Natu / Smeargle encounters in the connecting tunnels slow the hunt.</li>'
        + '</ul>')
    );
    window._ruinsBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  MT. MORTAR
  // ──────────────────────────────────────────────────────────────
  window.buildMtMortarPage = function() {
    var el = pageRoot('mtmortar-content');
    if (!el) return;
    var floors = [
      ['1F',  'Geodude, Zubat, Marill (Surf), Goldeen (Fish)',  'Two entrances — Route 42 (east side) and Route 42 (west, behind waterfall).'],
      ['B1F', 'Machop, Geodude, Krabby (Surf)',                  'Crystal only: Dragon Breath Move Tutor (talk to Move Maniac).'],
      ['2F',  'Machoke, Graveler, ' + pkmnLink('Tyrogue'),       'Karate King\'s room. Beat him to receive a Lv10 Tyrogue.'],
      ['B2F (Crystal)', 'Marill, Quagsire (Surf)',               'Crystal-only added depth + Suicune cameo (post-Brass Tower).']
    ];
    var items = [
      ['Iron',           '1F — visible boulder push area'],
      ['HP Up',          'B1F — back corner'],
      ['Max Potion',     '2F — near Karate King'],
      ['Tyrogue (gift)', '2F — Karate King reward, Lv10'],
      ['TM01 — Dynamic Punch (Crystal)', 'B2F — after beating the Crystal-extra trainer']
    ];
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">MT. MORTAR</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'A multi-floor cave between <strong>Ecruteak</strong> and <strong>Mahogany</strong>, home to the <strong>Karate King</strong> and his Tyrogue gift. Crystal adds a deeper B2F and the Dragon Breath tutor.'
      + '</div>'
      + section('Floors & Encounters', table(['Floor','Wild encounters','Notes'], floors))
      + section('Items & Gifts', table(['Item','Where'], items))
      + section('Tips', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Bring <strong>HM03 Surf</strong> and <strong>HM07 Waterfall</strong> to reach every floor.</li>'
        + '<li><strong>Tyrogue\'s evolution</strong> at Lv20 depends on Atk vs Def DVs — Hitmonlee (Atk&gt;Def), Hitmonchan (Atk&lt;Def), Hitmontop (Atk=Def).</li>'
        + '<li>Crystal players: don\'t forget the <strong>Dragon Breath</strong> Tutor — one-shot teach to any Pokémon that learns Dragon moves.</li>'
        + '</ul>')
    );
    window._mtMortarBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  TIME CAPSULE
  // ──────────────────────────────────────────────────────────────
  window.buildTimeCapsulePage = function() {
    var el = pageRoot('timecapsule-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">TIME CAPSULE</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'The Time Capsule is a special trade machine in every Pokémon Center that lets you trade with <strong>Generation 1</strong> (Red, Blue, Yellow). It\'s how you import Kanto-only Pokémon that aren\'t obtainable wild in Gen 2.'
      + '</div>'
      + section('Unlocking the Time Capsule', '<ol style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Beat at least the first Johto Gym (Falkner in Violet).</li>'
        + '<li>Talk to the Pokémon Center receptionist — the upstairs machine activates.</li>'
        + '<li>Wait <strong>24 hours of real time</strong> after first activation. The Time Capsule then becomes available.</li>'
        + '</ol>')
      + section('Strict Rules', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Only the original 151 Pokémon (#1–#151)</strong> can pass through.</li>'
        + '<li>No Gen-2 species. No Gen-2 moves. No held items.</li>'
        + '<li>If the Pokémon knows any move added in Gen 2 (e.g. Steel Wing, Crunch, Iron Tail), the trade is <strong>refused</strong> until that move is overwritten with a Gen-1 move.</li>'
        + '<li>Once traded back to Gen 1, the Pokémon cannot use Gen-2 moves or held items there.</li>'
        + '</ul>')
      + section('What to Trade Across', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Mew</strong> — only legitimate way to bring a Mew into Gen 2 (until Stadium 2 unlocks).</li>'
        + '<li><strong>Articuno / Zapdos / Moltres / Mewtwo</strong> if you don\'t want to grind them in Kanto post-game.</li>'
        + '<li>Kanto starters if you don\'t have Stadium 2.</li>'
        + '<li>Pokémon with Gen-1-only event movesets (Surfing Pikachu, etc.).</li>'
        + '</ul>')
      + section('After Trading', 'When a Gen-1 Pokémon arrives in Gen 2 it instantly inherits a <strong>type matchup</strong> for the two new types (Dark, Steel) and gains access to TM/HM moves added in Gen 2. Magnemite gains the Steel type; Gengar becomes immune to Normal/Fighting via Ghost; etc.')
    );
    window._tcBuilt = true;
  };

  // ──────────────────────────────────────────────────────────────
  //  HELD-ITEM FARM TABLE
  // ──────────────────────────────────────────────────────────────
  // Sortable matrix of every wild Pokémon that carries an item and
  // the held-rate. Data is hand-curated from the Gen-2 disassembly
  // (held_item field per species).
  var GEN2_HELD_FARM = [
    // [pokemon name, item, %, where to find]
    ['Snorlax',    'Leftovers',     100, 'Route 11 static (Pokéflute)'],
    ['Chansey',    'Lucky Egg',     5,   'Routes 13–15 (Kanto)'],
    ['Slowpoke',   "King's Rock",   5,   'Slowpoke Well / Surf Route 32'],
    ['Slowbro',    "King's Rock",   5,   'Surf Route 32'],
    ['Magnemite',  'Metal Coat',    25,  'Routes 38/39 / Power Plant'],
    ['Magneton',   'Metal Coat',    25,  'Power Plant'],
    ['Pikachu',    'Light Ball',    5,   'Power Plant / Headbutt Route 2'],
    ['Ditto',      'Metal Powder',  50,  'Route 35 / 47 (Kanto)'],
    ['Cubone',     'Thick Club',    50,  'Rock Tunnel (Kanto)'],
    ['Marowak',    'Thick Club',    5,   'Rock Tunnel post-game'],
    ['Farfetch\'d','Stick',         100, 'Wild Farfetch\'d (Route 38 swarm)'],
    ['Smeargle',   'Bright Powder', 5,   'Ruins of Alph'],
    ['Spearow',    'Sharp Beak',    5,   'Routes 7/9/22 (Kanto)'],
    ['Fearow',     'Sharp Beak',    5,   'Routes 7/9/22 (Kanto)'],
    ['Sunkern',    'Gold Berry',    100, 'Routes 37/38'],
    ['Sunkern',    'Sun Stone',     50,  'Routes 37/38 (rare second slot)'],
    ['Granbull',   'Quick Claw',    50,  'Route 38'],
    ['Snubbull',   'Quick Claw',    5,   'Route 38'],
    ['Koffing',    'Smoke Ball',    100, 'Burned Tower / Rocket HQ'],
    ['Weezing',    'Smoke Ball',    100, 'Rocket HQ Mahogany'],
    ['Diglett',    'Soft Sand',     5,   'Diglett\'s Cave (Kanto)'],
    ['Dugtrio',    'Soft Sand',     5,   'Diglett\'s Cave (Kanto)'],
    ['Onix',       'Hard Stone',    5,   'Union Cave / Dark Cave'],
    ['Butterfree', 'SilverPowder',  5,   'Bug Contest / Headbutt'],
    ['Venonat',    'SilverPowder',  5,   'Headbutt trees'],
    ['Venomoth',   'SilverPowder',  5,   'Headbutt trees'],
    ['Gastly',     'Spell Tag',     5,   'Sprout Tower (night) / Pkmn Tower'],
    ['Haunter',    'Spell Tag',     5,   'Pkmn Tower (Kanto)'],
    ['Dratini',    'DragonFang',    5,   'Dragon\'s Den / Surf'],
    ['Dragonair',  'DragonFang',    5,   'Dragon\'s Den'],
    ['Horsea',     'Dragon Scale',  5,   'Fish — Whirl Islands / Route 12'],
    ['Seadra',     'Dragon Scale',  5,   'Fish — Whirl Islands'],
    ['Goldeen',    'Mystic Water',  5,   'Fish — many routes'],
    ['Seaking',    'Mystic Water',  5,   'Fish — many routes'],
    ['Shellder',   'NeverMeltIce',  5,   'Surf — Route 19 / Whirl Islands'],
    ['Cloyster',   'NeverMeltIce',  5,   'Surf — Whirl Islands'],
    ['Bellsprout', 'MiracleSeed',   5,   'Routes 24/25/31 (Headbutt)'],
    ['Weepinbell', 'MiracleSeed',   5,   'Routes 24/25/31 (Headbutt)'],
    ['Abra',       'TwistedSpoon',  50,  'Routes 5/24/25/34'],
    ['Beedrill',   'Poison Barb',   5,   'Bug Contest / Route 2'],
    ['Hitmonlee',  'Black Belt',    5,   'Mt. Mortar (Karate King choice)'],
    ['Hitmonchan', 'Black Belt',    5,   'Mt. Mortar (Karate King choice)'],
    ['Machop',     'Focus Band',    5,   'Mt. Mortar / Rock Tunnel'],
    ['Machoke',    'Focus Band',    5,   'Mt. Mortar / Rock Tunnel'],
    ['Misdreavus', 'Cleanse Tag',   5,   'Mt. Silver (night)'],
    ['Jigglypuff', 'Polkadot Bow',  5,   'Route 3 / 46 (Kanto)'],
    ['Granbull',   'Pink Bow',      5,   'Route 38 (alt slot)'],
    ['Clefairy',   'Moon Stone',    5,   'Mt. Moon'],
    ['Clefable',   'Moon Stone',    25,  'Mt. Moon (rare second slot)']
  ];

  window.buildHeldFarmPage = function() {
    var el = pageRoot('heldfarm-content');
    if (!el) return;

    // Group by item for easier scanning
    var byItem = {};
    GEN2_HELD_FARM.forEach(function(r) {
      var item = r[1];
      (byItem[item] = byItem[item] || []).push(r);
    });

    var items = Object.keys(byItem).sort();
    var sections = items.map(function(item) {
      var rows = byItem[item].sort(function(a,b){ return b[2] - a[2]; });
      var pctMax = Math.max.apply(null, rows.map(function(r){ return r[2]; }));
      var rateLabel = pctMax === 100 ? 'GUARANTEED' : (pctMax >= 50 ? 'COMMON' : 'RARE');
      var rateColor = pctMax === 100 ? '#44DD88' : pctMax >= 50 ? '#E5B928' : '#FF6B35';
      var body = '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
        + '<thead><tr style="border-bottom:1px solid var(--border);">'
        + '<th style="text-align:left;padding:6px 10px;color:var(--muted);font-weight:700;font-size:10px;text-transform:uppercase;">Pokémon</th>'
        + '<th style="text-align:right;padding:6px 10px;color:var(--muted);font-weight:700;font-size:10px;text-transform:uppercase;">Hold %</th>'
        + '<th style="text-align:left;padding:6px 10px;color:var(--muted);font-weight:700;font-size:10px;text-transform:uppercase;">Where</th>'
        + '</tr></thead><tbody>'
        + rows.map(function(r) {
            var rateClr = r[2] === 100 ? '#44DD88' : r[2] >= 50 ? '#E5B928' : 'var(--muted)';
            return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);">'
              + '<td style="padding:6px 10px;">' + pkmnLink(r[0]) + '</td>'
              + '<td style="padding:6px 10px;text-align:right;color:'+rateClr+';font-weight:800;">' + r[2] + '%</td>'
              + '<td style="padding:6px 10px;color:var(--muted);font-size:11px;">' + r[3] + '</td>'
              + '</tr>';
        }).join('')
        + '</tbody></table>';
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid '+rateColor+';border-radius:6px;padding:12px 14px;margin-bottom:12px;">'
        + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">'
        + '<strong style="color:var(--text);font-size:13px;">' + itemLink(item) + '</strong>'
        + '<span style="font-size:9px;color:'+rateColor+';font-weight:800;letter-spacing:0.5px;">' + rateLabel + '</span>'
        + '<span style="margin-left:auto;font-size:10px;color:var(--muted);">' + rows.length + ' carrier' + (rows.length===1?'':'s') + '</span>'
        + '</div>'
        + body
        + '</div>';
    }).join('');

    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">HELD-ITEM FARM</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Wild Pokémon in Gen 2 carry held items at fixed probabilities. Bring a Pokémon with <strong>Thief</strong> or <strong>Covet</strong>, find a carrier, knock it to red HP, then have the thief swap into the item. This page lists every farmable held item in GSC + every species that carries it.'
      + '</div>'
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px;font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + '<strong style="color:var(--text);">Legend:</strong> '
      + '<span style="color:#44DD88;font-weight:800;">GUARANTEED</span> = 100% hold rate · '
      + '<span style="color:#E5B928;font-weight:800;">COMMON</span> = ≥50% · '
      + '<span style="color:#FF6B35;font-weight:800;">RARE</span> = ≤25%. '
      + 'Set up a "Thief monkey" team early: a Linoone-equivalent for catching, a Bug-type with Silver Wind / Cut for raw kills.'
      + '</div>'
      + sections
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  BUG-CATCHING CONTEST tracker (personal best per game)
  // ──────────────────────────────────────────────────────────────
  var BCC_PRIZES = [
    { rank:'1st', range:'250+', prize:'Sun Stone' },
    { rank:'2nd', range:'200–249', prize:'Everstone' },
    { rank:'3rd', range:'150–199', prize:'Gold Berry' },
    { rank:'4th', range:'100–149', prize:'Berry' },
    { rank:'5th', range:'0–99',   prize:'Berry' }
  ];
  var BCC_SPECIES = [
    'Caterpie','Metapod','Butterfree','Weedle','Kakuna','Beedrill',
    'Paras','Venonat','Pinsir','Scyther','Ledyba (G/S morning)','Spinarak (G/S night)','Heracross (rare)'
  ];

  window.buildBccPage = function() {
    var el = pageRoot('bcc-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">BUG-CATCHING CONTEST</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Held in the <strong>National Park</strong> on <strong>Tuesdays, Thursdays, and Saturdays</strong>. Pay 100 ₽, you\'re given 20 Park Balls and 20 in-game minutes to catch the best bug. Only one Pokémon can be submitted — pick the highest-scoring catch.'
      + '</div>'
      + section('Score Formula', '<code style="background:var(--panel);padding:4px 6px;border-radius:3px;">Score = Base × Stat Modifier + Type Bonus + HP Bonus + Status Bonus</code><br>'
        + '<strong>Quick tiers:</strong> Pinsir / Scyther (best base species), Heracross (only via Headbutt — not in contest pool), Butterfree (mid-tier), Beedrill (mid-tier), Caterpie/Weedle (low).<br>'
        + '<strong>Stat boost</strong>: higher DVs = higher score. <strong>HP %</strong>: catching at high HP scores higher than catching at low HP (counter-intuitive — don\'t waste turns weakening!).')
      + section('Prizes', table(['Rank','Score','Prize'], BCC_PRIZES.map(function(p){ return [p.rank, p.range, p.prize]; })))
      + section('Catchable species', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + BCC_SPECIES.map(function(s){ return '<li>' + s + '</li>'; }).join('')
        + '</ul>')
      + section('Strategy', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Hunt for <strong>Pinsir</strong> or <strong>Scyther</strong> first — they\'re rare but score highest.</li>'
        + '<li>Catch at near-full HP. Don\'t use moves that lower HP.</li>'
        + '<li>Save before entering — re-roll on losses.</li>'
        + '<li>Sun Stone prize is otherwise extremely rare (only at Cliff Cave hidden item) — Bug Contest is the reliable source.</li>'
        + '</ul>')
      + section('🏆 Personal best (per game)', renderBccBest())
    );
  };
  function bccLoad() {
    try { return JSON.parse(localStorage.getItem('gen2-bcc-best') || '{}'); }
    catch(_){ return {}; }
  }
  function bccSave(o) {
    try { localStorage.setItem('gen2-bcc-best', JSON.stringify(o)); } catch(_){}
  }
  window.bccSaveBest = function(game) {
    var inp = document.getElementById('bcc-score-' + game);
    var sp  = document.getElementById('bcc-poke-' + game);
    if (!inp || !sp) return;
    var score = parseInt(inp.value, 10);
    if (!score || score < 0) return;
    var data = bccLoad();
    data[game] = { score: score, poke: sp.value || '—', when: new Date().toISOString().slice(0,10) };
    bccSave(data);
    window.buildBccPage();
  };
  window.bccClearBest = function(game) {
    var data = bccLoad();
    delete data[game];
    bccSave(data);
    window.buildBccPage();
  };
  function renderBccBest() {
    var data = bccLoad();
    var games = [['FR','🌕 Gold'],['LG','🪙 Silver'],['E','💎 Crystal']];
    return games.map(function(g) {
      var key = g[0], label = g[1];
      var d = data[key] || null;
      var current = d ? (d.score + ' pts · ' + d.poke + ' · ' + d.when) : 'No score saved';
      return '<div style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:10px 12px;margin-bottom:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'
        + '<strong style="color:var(--text);min-width:90px;">' + label + '</strong>'
        + '<span style="font-size:11px;color:var(--muted);flex:1;">' + current + '</span>'
        + '<input id="bcc-score-' + key + '" type="number" min="0" max="370" placeholder="Score"'
        + ' style="width:80px;background:var(--panel);border:1px solid var(--border);border-radius:4px;padding:4px 8px;color:var(--text);font-size:11px;">'
        + '<input id="bcc-poke-' + key + '" type="text" placeholder="Pokémon"'
        + ' style="width:110px;background:var(--panel);border:1px solid var(--border);border-radius:4px;padding:4px 8px;color:var(--text);font-size:11px;">'
        + '<button onclick="bccSaveBest(\'' + key + '\')" style="font-size:10px;padding:4px 10px;background:var(--game-color,var(--gold));color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:700;">Save</button>'
        + (d ? '<button onclick="bccClearBest(\'' + key + '\')" style="font-size:10px;padding:4px 8px;background:var(--panel);color:var(--muted);border:1px solid var(--border);border-radius:4px;cursor:pointer;">×</button>' : '')
        + '</div>';
    }).join('');
  }

  // ──────────────────────────────────────────────────────────────
  //  APRICORN tree tracker (daily check-off, localStorage)
  // ──────────────────────────────────────────────────────────────
  var APRICORN_TREES = [
    { color:'Red',    ball:'Level Ball',  hex:'#FF5555', routes:['Route 36','Route 37','Route 42'] },
    { color:'Blue',   ball:'Lure Ball',   hex:'#5599FF', routes:['Route 32','Route 35','Route 42'] },
    { color:'Yellow', ball:'Moon Ball',   hex:'#FFD700', routes:['Route 38','Route 39','Route 42'] },
    { color:'Green',  ball:'Friend Ball', hex:'#44DD88', routes:['Route 37','Route 43','Route 45'] },
    { color:'Pink',   ball:'Love Ball',   hex:'#FFB6E1', routes:['Route 42','Route 43','Route 45'] },
    { color:'White',  ball:'Fast Ball',   hex:'#EEEEEE', routes:['Route 36','Route 42'] },
    { color:'Black',  ball:'Heavy Ball',  hex:'#666666', routes:['Route 38','Route 39','Route 42'] }
  ];

  function apriKey(date, color, route) {
    return 'gen2-apri-' + date + '-' + color + '-' + route.replace(/\s+/g,'');
  }
  function apriToday() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  window.apriToggleTree = function(color, route) {
    var today = apriToday();
    var k = apriKey(today, color, route);
    if (localStorage.getItem(k) === '1') localStorage.removeItem(k);
    else localStorage.setItem(k, '1');
    window.buildApricornPage();
  };

  window.apriResetDay = function() {
    var today = apriToday();
    APRICORN_TREES.forEach(function(tree) {
      tree.routes.forEach(function(route) {
        localStorage.removeItem(apriKey(today, tree.color, route));
      });
    });
    window.buildApricornPage();
  };

  window.buildApricornPage = function() {
    // Re-render every call (no pageRoot guard) — page is state-driven.
    var el = document.getElementById('apricorn-tracker-content');
    if (!el) return;
    var today = apriToday();
    var totalTrees = APRICORN_TREES.reduce(function(s, t){ return s + t.routes.length; }, 0);
    var doneCount = 0;
    APRICORN_TREES.forEach(function(tree) {
      tree.routes.forEach(function(route) {
        if (localStorage.getItem(apriKey(today, tree.color, route)) === '1') doneCount++;
      });
    });

    var sections = APRICORN_TREES.map(function(tree) {
      var rows = tree.routes.map(function(route) {
        var k = apriKey(today, tree.color, route);
        var done = localStorage.getItem(k) === '1';
        return '<button onclick="apriToggleTree(\''+tree.color+'\',\''+route+'\')" '
          + 'style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:'+(done?'color-mix(in srgb,'+tree.hex+' 25%,var(--card))':'var(--card)')+';border:1px solid '+(done?tree.hex:'var(--border)')+';border-radius:4px;cursor:pointer;color:var(--text);font-size:11px;width:100%;text-align:left;">'
          + '<span style="font-size:16px;">'+(done?'✓':'○')+'</span>'
          + '<span style="flex:1;">'+route+'</span>'
          + (done ? '<span style="font-size:9px;color:'+tree.hex+';font-weight:800;">PICKED</span>' : '')
          + '</button>';
      }).join('');
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:4px solid '+tree.hex+';border-radius:6px;padding:12px 14px;">'
        + '<div style="font-weight:700;color:'+tree.hex+';margin-bottom:8px;">'+tree.color+' Apricorn → '+tree.ball+'</div>'
        + '<div style="display:flex;flex-direction:column;gap:6px;">'+rows+'</div>'
        + '</div>';
    }).join('');

    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">APRICORN TREE TRACKER</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Apricorn trees regrow <strong>once per day</strong>. Click each tree as you pick it. State is saved per day in your browser — resets at midnight.<br>'
      + '<strong>Today (' + today + '):</strong> ' + doneCount + ' / ' + totalTrees + ' picked.'
      + '</div>'
      + '<div style="display:flex;gap:8px;margin-bottom:14px;">'
      + '<button onclick="apriResetDay()" style="font-size:11px;padding:6px 12px;background:var(--panel);border:1px solid var(--border);color:var(--muted);border-radius:4px;cursor:pointer;">Reset today</button>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">'+sections+'</div>'
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;margin-top:18px;font-size:11px;color:var(--muted);line-height:1.7;">'
      + '<strong style="color:var(--text);">Give Apricorns to Kurt</strong> in Azalea Town. He takes 24 in-game hours to convert them into balls. Each Apricorn = 1 ball. To get a full set of 7 ball types, you need at least 7 of each colour.'
      + '</div>'
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  BERRY tree map (where every berry grows)
  // ──────────────────────────────────────────────────────────────
  var BERRY_TREES = [
    { berry:'Berry',         color:'#F08030', effect:'Holder restores 10 HP at 50%',  routes:['Route 30 (×3)','Route 38','Cherrygrove outskirts','Route 26','Route 27','Pewter outskirts'] },
    { berry:'Gold Berry',    color:'#FFD700', effect:'Holder restores 30 HP at 50%',  routes:['Route 30 (rare drop on tree)','Mt. Mortar','Cherrygrove'] },
    { berry:'Mystery Berry', color:'#9966CC', effect:'Restores 5 PP to a depleted move',routes:['Route 30','Goldenrod outskirts','Route 32'] },
    { berry:'Bitter Berry',  color:'#3DA83D', effect:'Cures confusion',                routes:['Route 33','Ice Path entrance','Cliff Cave'] },
    { berry:'Burnt Berry',   color:'#FF6B35', effect:'Cures freeze',                   routes:['Route 36','Mt. Mortar entrance'] },
    { berry:'Ice Berry',     color:'#60C8C8', effect:'Cures burn',                     routes:['Route 32 (south)','Route 35'] },
    { berry:'Mint Berry',    color:'#88DD88', effect:'Cures sleep',                    routes:['Route 30','Ilex Forest','Route 31'] },
    { berry:'PSN Cure Berry',color:'#AA44AA', effect:'Cures poison',                   routes:['Route 32','Slowpoke Well outskirts'] },
    { berry:'PRZ Cure Berry',color:'#FFD700', effect:'Cures paralysis',                routes:['Route 32','Cherrygrove'] },
    { berry:'MiracleBerry',  color:'#E91E63', effect:'Cures any status — single use',  routes:['One-time event item from Goldenrod Pharmacy (Crystal)'] }
  ];

  window.buildBerryMapPage = function() {
    var el = pageRoot('berrymap-content');
    if (!el) return;
    var grid = BERRY_TREES.map(function(b) {
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:4px solid '+b.color+';border-radius:6px;padding:12px 14px;">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
        + '<strong style="color:'+b.color+';font-size:13px;">' + itemLink(b.berry) + '</strong>'
        + '</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-style:italic;">' + b.effect + '</div>'
        + '<div style="font-size:11px;color:var(--text);line-height:1.7;">'
        + '<strong style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Found on:</strong><br>'
        + b.routes.map(function(r){ return '• ' + r; }).join('<br>')
        + '</div>'
        + '</div>';
    }).join('');

    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">BERRY TREES — GEN 2</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'All Berry trees in Gold/Silver/Crystal. Each tree regrows once per real-world day. Berries are held items that trigger automatically in battle (HP/PP/status restore).'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">'+grid+'</div>'
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;margin-top:18px;font-size:11px;color:var(--muted);line-height:1.7;">'
      + '<strong style="color:var(--text);">Note:</strong> The "Berry-blender Pokéblock" system from Gen 3 RSE does NOT exist in Gen 2. Berries are single-effect held items only. Each tree drops 1 berry per real day — don\'t miss the daily cycle.'
      + '</div>'
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  BATTLE TOWER opponents (Crystal)
  // ──────────────────────────────────────────────────────────────
  var BT_TIERS = [
    { tier:'Lv30',  notes:'Easiest tier — Pokémon capped at Lv30. Common opponents: Sandshrew, Spinda (sub Yanma), Voltorb, Geodude.' },
    { tier:'Lv50',  notes:'Mid-tier — opponents fully evolved with strong move pools. Tauros, Snorlax, Machamp, Magneton common.' },
    { tier:'Lv70',  notes:'High-end — pseudo-legendaries appear: Dragonite, Tyranitar, Kingdra. Expect Hyper Beam abuse.' },
    { tier:'Lv100', notes:'Endgame — perfect-stat boss teams. Includes nearly all Gen-1/2 fully-evolved threats. Ho-Oh/Lugia are not allowed but Mewtwo is.' }
  ];

  window.buildBattleTowerOppPage = function() {
    var el = pageRoot('btopp-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">BATTLE TOWER OPPONENTS — CRYSTAL</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'The Crystal-exclusive Battle Tower (Cianwood, after E4) pits you against 7 trainers in a row using 3 of your Pokémon. Win all 7 to earn a tier-specific Ribbon. Opponents are drawn from a fixed pool per tier.'
      + '</div>'
      + section('Tier rules + opponent flavour',
          BT_TIERS.map(function(t) {
            return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid var(--game-color,var(--gold));padding:10px 14px;margin-bottom:8px;border-radius:6px;">'
              + '<strong style="color:var(--text);font-size:13px;">' + t.tier + '</strong><br>'
              + '<span style="font-size:11px;color:var(--muted);line-height:1.7;">' + t.notes + '</span>'
              + '</div>';
          }).join(''))
      + section('Banned species (all tiers)',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>' + pkmnLink('Mew') + ', ' + pkmnLink('Celebi') + ' — event-only Pokémon banned.</li>'
        + '<li>' + pkmnLink('Ho-Oh') + ', ' + pkmnLink('Lugia') + ' — legendary box mascots banned.</li>'
        + '<li>' + pkmnLink('Articuno') + ' / ' + pkmnLink('Zapdos') + ' / ' + pkmnLink('Moltres') + ' — Kanto legendary birds banned.</li>'
        + '<li>' + pkmnLink('Mewtwo') + ' — allowed only at Lv70 / Lv100.</li>'
        + '<li>Same species twice on your team — not allowed.</li>'
        + '<li>Identical held items on two team members — not allowed.</li>'
        + '</ul>')
      + section('Strategy',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Cover 3 types:</strong> a Physical sweeper, a Special sweeper, and a Status-spreader (Curse / Toxic / Thunder Wave).</li>'
        + '<li><strong>Sleep Talk + Rest</strong> is the most reliable tank set in Gen 2.</li>'
        + '<li><strong>Quick Claw</strong> on a slow tank lets you Curse turn 1 against fast opponents.</li>'
        + '<li>Save before entering — losing wipes the streak.</li>'
        + '</ul>')
      + section('Rewards',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Battle Tower (Lv30) Ribbon — 7 consecutive wins.</li>'
        + '<li>Battle Tower (Lv50) Ribbon — 7 wins on Lv50 tier.</li>'
        + '<li>Battle Tower (Lv70) Ribbon — 7 wins on Lv70.</li>'
        + '<li>Battle Tower (Lv100) Ribbon — 7 wins on Lv100.</li>'
        + '<li><strong>No item rewards</strong> — Crystal\'s Battle Tower is pure prestige.</li>'
        + '</ul>')
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  CRYSTAL EXCLUSIVES — landing page
  // ──────────────────────────────────────────────────────────────
  window.buildCrystalExclusivesPage = function() {
    var el = pageRoot('crystalex-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:#7FB8E0;margin-bottom:8px;letter-spacing:1px;">CRYSTAL EXCLUSIVE FEATURES</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Pokémon Crystal added these features over Gold/Silver. If you\'re running Crystal, you have access to <em>everything</em> here on top of all G/S features.'
      + '</div>'

      + section('🎬 Animations & gender',
          'Every Pokémon now has an entry animation when it enters battle, and the player can choose a <strong>female protagonist (Kris)</strong> for the first time in the series.')
      + section('🏛 Battle Tower (Cianwood)',
          'Brand-new endgame challenge — 7 consecutive battles per streak, 4 tiers (Lv30/50/70/100). Earn tier-specific Ribbons. <em>See <strong>Battle Tower (Crystal)</strong> page.</em>')
      + section('🐉 Dragon\'s Den expansion',
          'Post-E4 Dragon Den is reopened with a quiz/elders sequence. <strong>Pass the quiz</strong> for a Dratini with the egg move <strong>Extreme Speed</strong> — otherwise impossible to get.')
      + section('🌟 Suicune plot',
          'Crystal makes <strong>' + pkmnLink('Suicune') + '</strong> a fixed encounter (not roaming). Following the trainer <strong>Eusine</strong>\'s arc, you eventually meet Suicune at the Tin Tower for a one-time Lv40 catchable battle.')
      + section('🥚 Odd Egg',
          'Receive a free Egg at the Goldenrod Daycare with an extremely high <strong>shiny chance</strong> (~14%). Hatches into Pichu / Cleffa / Igglybuff / Tyrogue / Smoochum / Elekid / Magby.')
      + section('🔢 Unown ! and ? forms',
          'Two extra Unown letter forms unlock after solving additional Ruins of Alph puzzles + radio interaction. <em>See <strong>Ruins of Alph</strong> page.</em>')
      + section('📡 Mobile Adapter (JP only)',
          'Crystal supported the GBC Mobile Adapter for Pokémon News, Mobile Battle Tower, and Mystery Gift over phone-network connection. Service ended 2002 — never localised.')
      + section('🥋 Mt. Mortar Move Tutor',
          'Crystal adds a Dragon-type Move Tutor in Mt. Mortar B1F who teaches <strong>Dragon Breath</strong> to compatible species. <em>See <strong>Mt. Mortar</strong> page.</em>')
      + section('🏆 Eusine event',
          'New rival NPC who chases Suicune throughout the game and battles you in Cianwood at one point. Drops backstory + leads to the Suicune fixed encounter.')
      + section('🎰 Slower Game Corner',
          'Crystal slows the slot machine reels — making 7-7-7 jackpots noticeably easier to time.')
      + section('🏠 More post-game NPCs',
          'Several new buildings open across Johto + Kanto with side dialogue, in-game trades, and extra item gifts not present in G/S.')
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  GOLDENROD SALON (haircut + name rater)
  // ──────────────────────────────────────────────────────────────
  window.buildSalonPage = function() {
    var el = pageRoot('salon-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">GOLDENROD UNDERGROUND</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Two services in the Goldenrod City Underground that touch a Pokémon\'s friendship + identity. Both are free, but the salon is day-limited.'
      + '</div>'

      + section('💇 Hair Salon (Sun + Mon only)',
          '<strong>Location:</strong> Goldenrod Underground, west end, between the Item Shops.<br>'
        + '<strong>Days open:</strong> Sunday + Monday only. Closed every other day.<br>'
        + '<strong>Older brother:</strong> 500 ₽ — small friendship boost (~+5 to +1).<br>'
        + '<strong>Younger brother:</strong> 300 ₽ — moderate friendship boost (~+10 to +1).<br>'
        + 'The exact amount scales <strong style="color:var(--text);">inversely with current friendship</strong>: a near-fresh catch gets ~+10 from the younger brother, a 200+ Pokémon barely gets +1.<br><br>'
        + '<strong style="color:var(--text);">Strategy:</strong> Use the haircut <em>early</em> in a happiness-evolution grind to skip the slowest part of the friendship climb. Combine with a Friend Ball catch and you can hit 220 friendship in &lt;30 in-game minutes.')

      + section('📝 Name Rater (any day)',
          '<strong>Location:</strong> Goldenrod City, the house south of the Pokémon Center.<br>'
        + '<strong>Cost:</strong> Free.<br>'
        + 'Rename any Pokémon you originally caught (OT = your trainer ID). <strong style="color:var(--text);">Cannot rename traded Pokémon</strong> — that\'s by design.<br><br>'
        + '<strong>Why it matters:</strong> The "Surfing Pikachu" event Pokémon, the GS-Ball Celebi, and the Mystery Egg Togepi all benefit from getting a proper nickname before they\'re evolved/traded. Once traded their nickname is locked forever.')

      + section('Other Underground shops worth visiting',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Coin Case:</strong> Buy from the Bookseller in Goldenrod (south block) — required for the Game Corner.</li>'
        + '<li><strong>Herb Shop:</strong> Sells Energy Powder / Heal Powder / Energy Root / Revival Herb. Cheap but they <em>lower friendship</em>.</li>'
        + '<li><strong>Tuesday/Thursday/Saturday shop:</strong> Underground shop sells useful TMs (TM27 Return on certain days).</li>'
        + '<li><strong>Madam:</strong> Buys Slowpoke Tails for big cash — but you must obtain one ethically (gift from Slowpoke Well event).</li>'
        + '</ul>')
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  DAY-CARE (Route 34)
  // ──────────────────────────────────────────────────────────────
  window.buildDaycarePage = function() {
    var el = pageRoot('daycare-content');
    if (!el) return;
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">DAY-CARE — ROUTE 34</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'The Day-Care couple in Route 34 (just north of Goldenrod) introduces breeding in Gen 2. They\'ll level your Pokémon while you\'re elsewhere AND, if compatible pair is left, produce Eggs.'
      + '</div>'

      + section('Basic services',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Day-care man (front of house):</strong> Holds <strong>one</strong> Pokémon for leveling. Costs 100 ₽ + 100 per level gained.</li>'
        + '<li><strong>Day-care lady (back of house):</strong> Holds the <strong>second</strong> Pokémon. Same cost rules.</li>'
        + '<li>Talk to either to retrieve a Pokémon — you pay the bill on collection.</li>'
        + '<li>The Pokémon does NOT evolve while in the Day-Care, even if it hits the evolution level. Take it out and level up once more to trigger.</li>'
        + '</ul>')

      + section('Breeding',
          '<strong>Requirements:</strong>'
        + '<ul style="margin:6px 0 6px 22px;line-height:2;">'
        + '<li>Two Pokémon left at the Day-Care.</li>'
        + '<li>Same <strong>Egg Group</strong> (e.g. Field, Water 1, Dragon).</li>'
        + '<li>Opposite genders <strong>OR</strong> one of them is <strong>Ditto</strong>.</li>'
        + '<li>Neither is in the Undiscovered group (Legendaries, baby Pokémon).</li>'
        + '</ul>'
        + 'Every <strong>256 steps</strong> the game rolls a small chance to lay an Egg. The Day-Care man will stand outside the fence looking forward when one is ready.<br><br>'
        + '<strong style="color:var(--text);">Egg moves:</strong> Only the <strong>father</strong> can pass moves. Pick a male in the same Egg Group that learns the target move via level-up or TM.')

      + section('Egg Hatching',
          '<strong>Hatch counter:</strong> 5,120 – 30,720 steps depending on species.<br>'
        + '<strong>Speed-up tricks:</strong>'
        + '<ul style="margin:6px 0 6px 22px;line-height:2;">'
        + '<li>Bike on long stretches (Route 38, Route 35) — each pedal counts as one step.</li>'
        + '<li>No Flame Body / Magma Armor exists in Gen 2 — those abilities are Gen 3+.</li>'
        + '<li>Wait — that\'s the only speed trick. Walking simulation.</li>'
        + '</ul>')

      + section('Gen-2 baby Pokémon (breed via Day-Care)',
          '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:6px;">'
        + '<thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:6px 8px;color:var(--muted);">Baby</th><th style="text-align:left;padding:6px 8px;color:var(--muted);">Parent</th><th style="text-align:left;padding:6px 8px;color:var(--muted);">How</th></tr></thead>'
        + '<tbody>'
        + ['Pichu','Cleffa','Igglybuff','Tyrogue','Smoochum','Elekid','Magby'].map(function(name, i) {
            var parents = { Pichu:'Pikachu', Cleffa:'Clefairy', Igglybuff:'Jigglypuff', Tyrogue:'Hitmonlee / Hitmonchan', Smoochum:'Jynx', Elekid:'Electabuzz', Magby:'Magmar' };
            var nums   = { Pichu:172, Cleffa:173, Igglybuff:174, Tyrogue:236, Smoochum:238, Elekid:239, Magby:240 };
            return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);">'
              + '<td style="padding:6px 8px;display:flex;align-items:center;gap:6px;">'
              +   '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+nums[name]+'.png" width="28" height="28" style="image-rendering:pixelated;" onerror="this.style.display=\'none\'">'
              +   pkmnLink(name)
              + '</td>'
              + '<td style="padding:6px 8px;color:var(--text);">' + parents[name] + '</td>'
              + '<td style="padding:6px 8px;color:var(--muted);font-size:11px;">Breed the parent with a compatible mate (Ditto works).</td>'
              + '</tr>';
        }).join('')
        + '</tbody></table>')

      + section('Notes',
          '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li><strong>Light Ball + Pikachu = Pichu</strong>: this trick is Gen 4+. In original GSC, breeding a Pikachu always gives a Pichu regardless of held item.</li>'
        + '<li><strong>Incense babies</strong> (Wynaut, Bonsly, Mime Jr., Munchlax, Mantyke, Happiny) all require Incense items — those don\'t exist in Gen 2.</li>'
        + '<li>Egg hatches at Lv 5 with the species\' base moves + any compatible egg moves from the father.</li>'
        + '<li>Shiny breeding trick: breed a shiny Ditto → ~1/64 odds of shiny baby. Most starting points trace back to the Lake of Rage Red Gyarados.</li>'
        + '</ul>')
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  POKÉGEAR — Phone callers, rematches, daily gifts
  // ──────────────────────────────────────────────────────────────
  // Each entry = phone-eligible trainer. Days/hours from the Gen-2 disassembly.
  var PG_CALLERS = [
    // ── Gift callers ─────────────────────────────────────────
    { cat:'gift', name:'Tully (Fisher)',  location:'Route 42',
      when:'Mon · Wed · Sat — daytime',
      reward:'Says where to fish today; gives a Quick Claw on first call.',
      note:'Get his number before Mt. Mortar so the Quick Claw call is available early.' },
    { cat:'gift', name:'Wilton (Hiker)',  location:'Route 45',
      when:'Tue · Thu — morning',
      reward:'Gives Pink Bow / Hard Stone on rematch days.',
      note:'Strong source of free type-boost items.' },
    { cat:'gift', name:'Liz (Picnicker)', location:'Route 32',
      when:'Mon — afternoon',
      reward:'Hands over a single Berry.',
      note:'' },
    { cat:'gift', name:'Beverly (Lass)',  location:'Route 38',
      when:'Wed · Sat — daytime',
      reward:'Gives a TwistedSpoon.',
      note:'Long-form daily gift — repeat callers refresh the bonus on different days.' },
    { cat:'gift', name:'Jose (Camper)',   location:'Route 27',
      when:'Sun — daytime',
      reward:'Gives a Pink Bow.',
      note:'Best reached after Kanto post-game.' },

    // ── Rematch callers ──────────────────────────────────────
    { cat:'rematch', name:'Joey (Youngster)',   location:'Route 30',
      when:'Mon · Wed · Sat — morning',
      reward:'Rematch (Lv5 → Lv10 → Lv30 Rattata). The famous "Top Percentage Rattata" call.',
      note:'Frequent caller — keep on Pokégear for easy rematch grinding.' },
    { cat:'rematch', name:'Liz (Picnicker)',    location:'Route 32',
      when:'Mon — afternoon',
      reward:'Rematch with Marill / Hoothoot teams.',
      note:'Same caller as gift entry — gift swaps with rematch over time.' },
    { cat:'rematch', name:'Ralph (Fisher)',     location:'Route 32',
      when:'Wed — morning',
      reward:'Rematch — Magikarp swarm tip on alternate calls.',
      note:'' },
    { cat:'rematch', name:'Jack (Schoolboy)',   location:'Route 35',
      when:'Tue · Thu — daytime',
      reward:'Rematch (Sandshrew / Ekans line in his post-E4 team).',
      note:'' },
    { cat:'rematch', name:'Tiffany (Picnicker)',location:'Route 37',
      when:'Sun — daytime',
      reward:'Rematch + gives a Pink Bow on certain calls.',
      note:'Dual gift + rematch caller.' },
    { cat:'rematch', name:'Anthony (Hiker)',    location:'Route 33',
      when:'Tue — daytime',
      reward:'Rematch with rock-types.',
      note:'' },

    // ── Special callers ──────────────────────────────────────
    { cat:'special', name:'Mom',          location:'New Bark Town',
      when:'Anytime',
      reward:'Spends your saved-up money on items / dolls / mood boosts.',
      note:'Activate the savings account at home; Mom will buy useful items or stash cash for later.' },
    { cat:'special', name:'Prof. Elm',    location:'New Bark Town',
      when:'Anytime',
      reward:'Story progression hints; alerts you when an Egg hatches.',
      note:'Stays available throughout the game.' },
    { cat:'special', name:'Buena (DJ)',   location:'Goldenrod Radio Tower',
      when:'Daily — different password 5pm–midnight',
      reward:'Tells you that day\'s password. Match it to earn Blue Card points → trade for items.',
      note:'Set the Pokégear radio to Buena\'s Password and stand still to hear it. Saturday/Sunday she stays on longer.' },
    { cat:'special', name:'Bill',         location:'Goldenrod PC',
      when:'After Ecruteak meet',
      reward:'Reminds you to pick up the Eevee gift at his grandfather\'s in Goldenrod.',
      note:'One-time prompt — make the trip after you meet him in Ecruteak.' }
  ];

  var PG_CAT_META = {
    gift:    { label:'Gift Callers',    color:'#E5B928', icon:'🎁' },
    rematch: { label:'Rematch Callers', color:'#FF6B35', icon:'⚔️' },
    special: { label:'Special / Story', color:'#7FB8E0', icon:'⭐' }
  };

  window.buildPokegearPage = function() {
    var el = pageRoot('pokegear-content');
    if (!el) return;
    var byCat = {};
    PG_CALLERS.forEach(function(c){ (byCat[c.cat] = byCat[c.cat] || []).push(c); });
    var html = '';
    Object.keys(PG_CAT_META).forEach(function(catKey) {
      var rows = byCat[catKey] || [];
      if (!rows.length) return;
      var meta = PG_CAT_META[catKey];
      html += '<div style="margin-bottom:18px;">'
        + '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:'+meta.color+';letter-spacing:0.5px;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px;">'
        + meta.icon + ' ' + meta.label.toUpperCase() + '</div>';
      rows.forEach(function(r) {
        html += '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid '+meta.color+';border-radius:6px;padding:12px 14px;margin-bottom:10px;">'
          + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:4px;">'
          + '<strong style="color:var(--text);font-size:13px;">' + r.name + '</strong>'
          + '<span style="font-size:10px;color:var(--muted);">📍 ' + r.location + '</span>'
          + '<span style="margin-left:auto;font-size:10px;color:'+meta.color+';font-weight:700;">' + r.when + '</span>'
          + '</div>'
          + '<div style="font-size:11px;color:var(--text);line-height:1.7;">' + r.reward + '</div>'
          + (r.note ? '<div style="font-size:10px;color:var(--muted);margin-top:4px;font-style:italic;">' + r.note + '</div>' : '')
          + '</div>';
      });
      html += '</div>';
    });

    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">POKÉGEAR — PHONE CALLERS</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Trainers and NPCs whose phone numbers can be registered on your Pokégear. Most call you on specific days / times to offer a <strong>rematch</strong>, <strong>gift item</strong>, swarm tip, or password.'
      + ' Save phone slots for the highest-value callers — gift NPCs first, then rematch trainers, then Mom / Elm.'
      + '</div>'
      + html
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:8px;">'
      + '<strong style="color:var(--text);">Pokégear slots:</strong> Maximum <strong>15 numbers</strong> can be saved. Mom + Elm + Prof. Oak (auto) + Bill (after Ecruteak) take 4 slots, leaving 11 for trainers. Pick wisely — there is no way to delete a saved number in original GSC.'
      + '</div>'
    );
  };

  // ──────────────────────────────────────────────────────────────
  //  MYSTERY GIFT
  // ──────────────────────────────────────────────────────────────
  window.buildMysteryGiftPage = function() {
    var el = pageRoot('mysterygift-content');
    if (!el) return;
    var rewards = [
      ['Berries',     itemLink('Berry') + ', ' + itemLink('Gold Berry') + ', ' + itemLink('Mystery Berry') + ', PRZ/Bitter/Mint/Burnt/Ice/PSN Berries', 'Most common reward — useful held items.'],
      ['Mushrooms',   'Pink Mushroom, Big Mushroom, Tiny Mushroom', 'Sell for cash (Big = ₽5000).'],
      ['Decorations', 'Big Snorlax doll, Big Lapras doll, Big Onix doll, posters', 'Single-use room decorations.'],
      ['Special',    'Various rare items including the GS Ball event hint (JP only)', 'Region-locked rewards.']
    ];
    el.innerHTML = panel(
      '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">MYSTERY GIFT</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Gen 2\'s daily reward system. Uses the GBC Infrared port to exchange one gift per friend per real-world day. No friend nearby? You won\'t be able to use it — there\'s no internet fallback in original GSC.'
      + '</div>'
      + section('Unlocking', '<ol style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Visit the Goldenrod Mart 4F.</li>'
        + '<li>Talk to the Mystery Gift attendant and pick "Receive Gift".</li>'
        + '<li>Have a second GBC (or emulator instance) running Gen 2 in IR range.</li>'
        + '<li>Both players pick "Mystery Gift" → "Send Gift" / "Receive Gift" on Mart 4F.</li>'
        + '</ol>')
      + section('Daily Limit', 'Only <strong>one gift exchange per friend per real-world day</strong>. Mystery Gift uses a clock check, so resetting the system clock doesn\'t bypass it — it actually breaks Berry tree growth and Bug Contest schedules if you try.')
      + section('Reward Pool', table(['Category','Examples','Notes'], rewards))
      + section('Tips', '<ul style="margin:0 0 0 22px;line-height:2;">'
        + '<li>Daily Mystery Gift + the daily lottery + the daily Bug Contest = a solid <strong>"daily login"</strong> reward loop.</li>'
        + '<li>Mystery Gift rewards are best for chasing Berry-holding Pokémon for OU competitive Gen 2 sets (Lickilung, Heracross, Chansey often want Gold Berry / Leftovers).</li>'
        + '<li>Decorations only matter cosmetically — purely flavour items for your bedroom.</li>'
        + '</ul>')
    );
    window._mgBuilt = true;
  };

})();
