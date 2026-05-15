window.getDistributionEntries = window.getDistributionEntries || function() {
  var projectWonder = [
    {
      title: 'Aurora Ticket',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Event Item',
      obtains: ['Aurora Ticket'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Unlocks the Deoxys trip event path. Built from the JoySpot update patch set.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Mystic Ticket',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Event Item',
      obtains: ['Mystic Ticket'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Unlocks the Lugia/Ho-Oh island travel event path on compatible saves.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Eon Ticket',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Event Item',
      obtains: ['Eon Ticket'],
      targets: ['Crystal only'],
      details: 'Marked by the repo as Crystal-exclusive and will not send to Gold/Silver.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Old Sea Map',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Event Item',
      obtains: ['Old Sea Map'],
      targets: ['Crystal only'],
      details: 'Crystal-exclusive event patch for the Faraway Island access item.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Decoration Set',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Custom Event',
      obtains: ['Decoration Set'],
      targets: ['Crystal only'],
      details: 'Custom event added by the repo. Explicitly called out as Crystal-only in the README.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Mystery Gift',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Custom Item Event',
      obtains: ['Potion', 'Poké Ball', 'Rare item pool'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Delivery-guy event. README notes a Potion/Poké Ball common pool with a rare-item outcome at low odds.',
      mechanics: [
        'Potion odds: values 0-494 out of 1000',
        'Poké Ball odds: values 495-990 out of 1000',
        'Rare item odds: values 991-999 out of 1000'
      ],
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Altering Cave',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Custom Event',
      obtains: ['Altering Cave event state'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Patch-based custom distribution intended to enable the Altering Cave style event content.',
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Pokémon Egg (PCNY)',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Egg Distribution',
      obtains: ['Chansey', 'Drowzee', 'Exeggcute', 'Farfetch’d', 'Kangaskhan', 'Lickitung'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Random egg pool with button-combo overrides documented in the patch README.',
      mechanics: [
        'A: Chansey',
        'B: Drowzee',
        'A + B: Exeggcute',
        'R: Farfetch’d',
        'R + A: Kangaskhan',
        'R + B: Lickitung'
      ],
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Pokémon Egg (PCJP)',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Egg Distribution',
      obtains: ['Bellsprout', 'Meowth', 'Oddish', 'Poliwag'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'Random egg pool with button-combo overrides documented in the patch README.',
      mechanics: [
        'A: Bellsprout',
        'B: Meowth',
        'A + B: Oddish',
        'R: Poliwag'
      ],
      repo: 'Gen2DistributionRoms'
    },
    {
      title: 'Pokémon Egg (PARK)',
      source: 'Project Wonder',
      language: 'Multi-language',
      kind: 'Egg Distribution',
      obtains: ['Cacnea', 'Corphish', 'Corsola', 'Igglybuff', 'Minun', 'Pichu', 'Plusle', 'Psyduck', 'Skitty', 'Spinda', 'Spoink', 'Surskit', 'Taillow', 'Whismur', 'Wynaut'],
      targets: ['Gold', 'Silver', 'Crystal'],
      details: 'PokéPark-style randomized egg pool with 15 possible species and documented button overrides.',
      mechanics: [
        'A: Cacnea',
        'B: Corphish',
        'A + B: Corsola',
        'R: Igglybuff',
        'R + A: Minun',
        'R + B: Pichu',
        'R + A + B: Plusle',
        'L: Psyduck',
        'L + A: Skitty',
        'L + B: Spinda',
        'L + A + B: Spoink',
        'L + R: Surskit',
        'L + R + A: Taillow',
        'L + R + B: Whismur',
        'L + R + A + B: Wynaut'
      ],
      repo: 'Gen2DistributionRoms'
    }
  ];

  var classicEnglish = [
    ['Berry Fix Glitch Zigzagoon', 'English', 'Single Pokémon', ['Zigzagoon'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Berry-fix gift Zigzagoon distribution ROM.', 'Shiny-locked per English README.'],
    ['Channel Jirachi', 'English', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire'], 'GameCube Channel distribution recreation.', 'One of the English repo exceptions that is not shiny-locked.'],
    ['DOEL Deoxys', 'English', 'Single Pokémon', ['Deoxys'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Named after the DOEL event distribution.', 'Shiny-locked per English README.'],
    ['JAA Celebi', 'English', 'Single Pokémon', ['Celebi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Celebi event multiboot ROM.', 'Shiny-locked per English README.'],
    ['JAA Top 20 - Part 1', 'English', 'Multi Pokémon Campaign', ['Bulbasaur', 'Charizard', 'Blastoise', 'Pikachu', 'Alakazam', 'Articuno', 'Zapdos', 'Moltres', 'Dragonite', 'Typhlosion'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Part 1 of the JAA Top 20 campaign loader.', 'Species split is inferred from Bulbapedia’s 20-Pokémon Journey Across America list and the repo’s Part 1 / Part 2 filenames.'],
    ['JAA Top 20 - Part 2', 'English', 'Multi Pokémon Campaign', ['Espeon', 'Umbreon', 'Raikou', 'Entei', 'Suicune', 'Tyranitar', 'Blaziken', 'Absol', 'Latias', 'Latios'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Part 2 of the JAA Top 20 campaign loader.', 'Species split is inferred from Bulbapedia’s 20-Pokémon Journey Across America list and the repo’s Part 1 / Part 2 filenames.'],
    ['MYSTRY Mew', 'English', 'Single Pokémon', ['Mew'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Classic MYSTRY Mew-style multiboot ROM.', 'Shiny-locked per English README.'],
    ['POTD Top 20 - Part 1', 'English', 'Multi Pokémon Campaign', ['Top 20 campaign set'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Part 1 of the Pokémon of the Day Top 20 campaign.', 'Repo notes this uses the TOP 10 loader shell with Aura Mew-based multiboot.'],
    ['POTD Top 20 - Part 2', 'English', 'Multi Pokémon Campaign', ['Top 20 campaign set'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Part 2 of the Pokémon of the Day Top 20 campaign.', 'Repo notes this uses the TOP 10 loader shell with Aura Mew-based multiboot.'],
    ['Pokemon Box Eggs', 'English', 'Egg Distribution', ['Pokémon Box egg pool'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'English Pokémon Box egg distribution ROM.', 'English README lists Pokémon Box Eggs as one of the non-shiny-locked exceptions.'],
    ['ROCKS Metang', 'English', 'Single Pokémon', ['Metang'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'ROCKS Metang event recreation.', 'Shiny-locked per English README.'],
    ['SPACE C Deoxys', 'English', 'Single Pokémon', ['Deoxys'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'SPACE C Deoxys event recreation.', 'Shiny-locked per English README.'],
    ['Trade and Battle Day', 'English', 'Campaign Pokémon', ['Ekans', 'Sandshrew', 'Vulpix', 'Oddish', 'Psyduck', 'Growlithe', 'Machoke', 'Slowpoke', 'Shellder', 'Haunter', 'Staryu', 'Tauros'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Theme/event-day distribution ROM.', 'Species list comes from Bulbapedia’s Trade and Battle Day event distribution page.'],
    ['Wishmkr Jirachi', 'English', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire'], 'Bonus Disc / WISHMKR-style Jirachi distribution.', 'English README lists Wishmkr Jirachi as not shiny-locked.']
  ].map(function(row) {
    return { title: row[0], language: row[1], kind: row[2], obtains: row[3], targets: row[4], details: row[5], notes: row[6], source: 'Classic Distribution ROM' };
  });

  var pcnyCampaigns = [
    ['Ancient and Aliens C', ['Armaldo', 'Sableye', 'Mawile', 'Cradily'], 'Matches Bulbapedia\'s PCNY Ancient & Aliens Week list.'],
    ['Ancient and Aliens D', ['Armaldo', 'Sableye', 'Mawile', 'Cradily'], 'Matches Bulbapedia\'s PCNY Ancient & Aliens Week list.'],
    ['Baby and Trade C', ['Azurill', 'Wynaut', 'Gorebyss', 'Huntail'], 'Matches Bulbapedia\'s PCNY Baby & Trade Week list.'],
    ['Baby and Trade D', ['Azurill', 'Wynaut', 'Gorebyss', 'Huntail'], 'Matches Bulbapedia\'s PCNY Baby & Trade Week list.'],
    ['Box Campaign C', ['Flygon', 'Seviper', 'Spite Absol', 'Wish Absol'], 'Mapped to Bulbapedia\'s Pokémon Box Ruby & Sapphire promotion list; filename match is inferential.'],
    ['Box Campaign D', ['Flygon', 'Seviper', 'Spite Absol', 'Wish Absol'], 'Mapped to Bulbapedia\'s Pokémon Box Ruby & Sapphire promotion list; filename match is inferential.'],
    ['Dragon Week C', ['Ice Beam Seadra', 'Leer Seadra', 'Flygon', 'Flamethrower Altaria', 'Ice Beam Altaria', 'Salamence'], 'Matches Bulbapedia\'s PCNY Dragon Week list.'],
    ['Dragon Week D', ['Ice Beam Seadra', 'Leer Seadra', 'Flygon', 'Flamethrower Altaria', 'Ice Beam Altaria', 'Salamence'], 'Matches Bulbapedia\'s PCNY Dragon Week list.'],
    ['Evolution Stones B', ['Pikachu', 'Gloom', 'Staryu'], 'Matches Bulbapedia\'s PCNY Evolution Stone Promotion list.'],
    ['Evolution Stones C', ['Pikachu', 'Gloom', 'Staryu'], 'Matches Bulbapedia\'s PCNY Evolution Stone Promotion list.'],
    ['EX Dragon B', ['Altaria', 'Flygon', 'Seadra', 'Salamence'], 'Matches Bulbapedia\'s PCNY EX-Dragon TCG Prerelease list.'],
    ['EX Dragon C', ['Altaria', 'Flygon', 'Seadra', 'Salamence'], 'Matches Bulbapedia\'s PCNY EX-Dragon TCG Prerelease list.'],
    ['Halloween Bash B', ['Level 50 Exploud', 'Level 100 Exploud', 'Level 50 Aggron', 'Level 100 Aggron', 'Level 50 Wailord', 'Level 100 Wailord', 'Level 50 Crawdaunt', 'Level 100 Crawdaunt'], 'Matches Bulbapedia\'s PCNY Halloween Bash Monster list.'],
    ['Halloween Bash C', ['Level 50 Exploud', 'Level 100 Exploud', 'Level 50 Aggron', 'Level 100 Aggron', 'Level 50 Wailord', 'Level 100 Wailord', 'Level 50 Crawdaunt', 'Level 100 Crawdaunt'], 'Matches Bulbapedia\'s PCNY Halloween Bash Monster list.'],
    ['Monster Week B', ['Shedinja', 'Cacturne', 'Shuppet', 'Duskull'], 'Mapped to Bulbapedia\'s PCNY Monster Week 1 list; filename match is inferential.'],
    ['Monster Week C', ['Shedinja', 'Cacturne', 'Shuppet', 'Duskull'], 'Mapped to Bulbapedia\'s PCNY Monster Week 1 list; filename match is inferential.'],
    ['Sheep and Wolf C', ['Houndour', 'Mareep'], 'Mapped to Bulbapedia\'s PCNY Colosseum Tournament Promotion list; filename match is inferential.'],
    ['Sheep and Wolf D', ['Houndour', 'Mareep'], 'Mapped to Bulbapedia\'s PCNY Colosseum Tournament Promotion list; filename match is inferential.'],
    ['Slither and Swim C', ['Zangoose', 'Seviper', 'Milotic', 'Kingdra'], 'Matches Bulbapedia\'s PCNY Slither & Swim Week list.'],
    ['Slither and Swim D', ['Zangoose', 'Seviper', 'Milotic', 'Kingdra'], 'Matches Bulbapedia\'s PCNY Slither & Swim Week list.'],
    ['Spring Campaign C', ['Gardevoir', 'Tropius', 'Salamence'], 'Mapped to Bulbapedia\'s Unknown Spring Pokémon list; filename match is inferential.'],
    ['Spring Campaign D', ['Gardevoir', 'Tropius', 'Salamence'], 'Mapped to Bulbapedia\'s Unknown Spring Pokémon list; filename match is inferential.'],
    ['Trade and Nature C', ['Machamp', 'Ludicolo', 'Shiftry', 'Golem'], 'Mapped to Bulbapedia\'s Campaign 6 Pokémon list; filename match is inferential.'],
    ['Trade and Nature D', ['Machamp', 'Ludicolo', 'Shiftry', 'Golem'], 'Mapped to Bulbapedia\'s Campaign 6 Pokémon list; filename match is inferential.']
  ].map(function(row) {
    return {
      title: row[0],
      language: 'English',
      kind: 'PCNY Campaign Pokémon',
      obtains: row[1],
      targets: ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'],
      details: 'Pokémon Center New York machine campaign ROM. Machine letter variants generally represent station-specific copies of the same themed campaign.',
      notes: row[2],
      source: 'Classic Distribution ROM'
    };
  });

  var classicJapanese = [
    ['5thAnnivPCJP Eggs', 'Egg Distribution', ['Bellsprout', 'Meowth', 'Oddish', 'Poliwag'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], '5th anniversary PCJP egg distribution.', 'Japanese README notes this egg line has special shiny behavior when traded and hatched cross-game, except Pichu odds note in the README.'],
    ['Ageto Celebi', 'Single Pokémon', ['Celebi'], ['Ruby', 'Sapphire'], 'AGETO Celebi distribution recreation.', 'Shiny-locked per Japanese README.'],
    ['ANA Pikachu', 'Single Pokémon', ['Pikachu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'ANA Pikachu event recreation.', 'Shiny-locked per Japanese README.'],
    ['Berry Fix Glitch Zigzagoon', 'Single Pokémon', ['Zigzagoon'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Japanese berry-fix Zigzagoon.', 'Shiny-locked per Japanese README.'],
    ['Colos Pikachu', 'Single Pokémon', ['Pikachu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Colosseum-themed Pikachu distribution.', 'Shiny-locked per Japanese README.'],
    ['Festa Metang', 'Single Pokémon', ['Metang'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Festa Metang event recreation.', 'Shiny-locked per Japanese README.'],
    ['GW Pikachu', 'Single Pokémon', ['Pikachu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Golden Week Pikachu event.', 'Shiny-locked per Japanese README.'],
    ['Hadou Mew', 'Single Pokémon', ['Mew'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Aura/Hadou Mew event recreation.', 'Shiny-locked per Japanese README.'],
    ['Hadou Regice', 'Single Pokémon', ['Regice'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Hadou Regice event recreation.', 'Shiny-locked per Japanese README.'],
    ['Hadou Regirock', 'Single Pokémon', ['Regirock'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Hadou Regirock event recreation.', 'Shiny-locked per Japanese README.'],
    ['Hadou Registeel', 'Single Pokémon', ['Registeel'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Hadou Registeel event recreation.', 'Shiny-locked per Japanese README.'],
    ['Mitsurin Celebi', 'Single Pokémon', ['Celebi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Mitsurin Celebi event recreation.', 'Shiny-locked per Japanese README.'],
    ['Negaiboshi Jirachi - Restricted', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire'], 'Restricted version of the Negaiboshi Jirachi ROM.', 'Shiny-locked per Japanese README.'],
    ['Negaiboshi Jirachi - Unrestricted', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire'], 'Unrestricted version of the Negaiboshi Jirachi ROM.', 'Shiny-locked per Japanese README.'],
    ['PokePark Celebi', 'Single Pokémon', ['Celebi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'PokéPark Celebi recreation.', 'Shiny-locked per Japanese README.'],
    ['PokePark Eggs', 'Egg Distribution', ['Cacnea', 'Corphish', 'Corsola', 'Igglybuff', 'Minun', 'Pichu', 'Plusle', 'Psyduck', 'Skitty', 'Spinda', 'Spoink', 'Surskit', 'Taillow', 'Whismur', 'Wynaut'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'PokéPark egg pool distribution.', 'Japanese README lists PokéPark Eggs as one of the non-shiny-locked exceptions.'],
    ['PokePark Jirachi - 60731', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'PokéPark Jirachi dated/variant ROM.', 'Shiny-locked per Japanese README.'],
    ['PokePark Jirachi - 60830', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Second PokéPark Jirachi dated/variant ROM.', 'Shiny-locked per Japanese README.'],
    ['PokePark Meowth', 'Single Pokémon', ['Meowth'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'PokéPark Meowth recreation.', 'Shiny-locked per Japanese README.'],
    ['PokePark Mew', 'Single Pokémon', ['Mew'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'PokéPark Mew recreation.', 'Shiny-locked per Japanese README.'],
    ['Pokemon Box Eggs', 'Egg Distribution', ['Pokémon Box egg pool'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Japanese Pokémon Box egg distribution ROM.', 'Japanese README lists Pokémon Box Eggs as not shiny-locked.'],
    ['Sapporo Pikachu', 'Single Pokémon', ['Pikachu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Sapporo store/event Pikachu.', 'Shiny-locked per Japanese README.'],
    ['STAMP Absol', 'Single Pokémon', ['Absol'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'STAMP Absol event recreation.', 'Shiny-locked per Japanese README.'],
    ['STAMP Pichu', 'Single Pokémon', ['Pichu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'STAMP Pichu event recreation.', 'Shiny-locked per Japanese README.'],
    ['Sunday Wobbuffet', 'Single Pokémon', ['Wobbuffet'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Sunday Wobbuffet event recreation.', 'Shiny-locked per Japanese README.'],
    ['Tanabata 2004 Jirachi', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], '2004 Tanabata Jirachi.', 'Shiny-locked per Japanese README.'],
    ['Tanabata 2005 Jirachi', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], '2005 Tanabata Jirachi.', 'Shiny-locked per Japanese README.'],
    ['Tanabata 2006 Jirachi', 'Single Pokémon', ['Jirachi'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], '2006 Tanabata Jirachi.', 'Shiny-locked per Japanese README.'],
    ['Yokohama Pikachu', 'Single Pokémon', ['Pikachu'], ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'], 'Yokohama Pikachu event recreation.', 'Shiny-locked per Japanese README.']
  ].map(function(row) {
    return { title: row[0], language: 'Japanese', kind: row[1], obtains: row[2], targets: row[3], details: row[4], notes: row[5], source: 'Classic Distribution ROM' };
  });

  var gatheringMore = [
    [1, ['Treecko', 'Torchic', 'Mudkip']],
    [2, ['Chikorita', 'Cyndaquil', 'Totodile']],
    [3, ['Ekans', 'Pikachu', 'Meowth', 'Growlithe', 'Bellsprout', 'Slowpoke', 'Shellder', 'Chansey', 'Kangaskhan', 'Scyther', 'Electabuzz', 'Magmar', 'Tauros', 'Murkrow', 'Misdreavus', 'Qwilfish', 'Sneasel', 'Delibird', 'Mantine']],
    [4, ['Bulbasaur', 'Charmander', 'Squirtle']],
    [5, ['Pikachu', 'Lotad', 'Seedot', 'Surskit', 'Skitty', 'Sableye', 'Mawile', 'Meditite', 'Plusle', 'Minun', 'Roselia', 'Zangoose', 'Seviper', 'Lunatone', 'Solrock', 'Chimecho']],
    [6, ['Pikachu', 'Hoothoot', 'Mareep', 'Aipom', 'Sunkern', 'Wobbuffet', 'Pineco', 'Gligar', 'Snubbull', 'Shuckle', 'Teddiursa', 'Houndour', 'Stantler', 'Smeargle']]
  ].map(function(row) {
    return {
      title: 'Gathering More Campaign ' + row[0],
      language: 'Japanese',
      kind: 'Campaign Pokémon',
      obtains: row[1],
      targets: ['Ruby', 'Sapphire', 'Crystal', 'Gold', 'Silver'],
      details: 'Japanese Gather More Pokémon! Campaign distribution ROM from the dedicated repo folder.',
      notes: 'Species list comes from Bulbapedia\'s Gather More campaign article for Campaign ' + row[0] + '.',
      source: 'Classic Distribution ROM'
    };
  });

  return projectWonder.concat(classicEnglish, pcnyCampaigns, classicJapanese, gatheringMore);
};


function buildDistributionsPage() {
  var root = document.getElementById('distributions-content');
  if (!root) return;

  // ── helpers ──────────────────────────────────────────────────────────────
  function escHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(value) {
    return escHtml(value).replace(/'/g, '&#39;');
  }

  function norm(s) { return String(s || '').toLowerCase(); }

  // ── checklist storage ────────────────────────────────────────────────────
  var STORAGE_KEY = 'g3-distribution-checklist-v2';
  var allEntries = window.getDistributionEntries();
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (e) { saved = {}; }

  function currentGameKey() {
    return (typeof GAME !== 'undefined' && GAME) ? GAME : 'all';
  }

  function currentGameLabel() {
    return ({ all: 'All Games', FR: 'Gold', LG: 'Silver', R: 'Ruby', S: 'Sapphire', E: 'Crystal' }[currentGameKey()]) || currentGameKey();
  }

  function entryKey(entry) {
    return entry.source + '::' + entry.language + '::' + entry.title;
  }

  function rewardList(entry) {
    return (entry.obtains || []).map(function(obtain, idx) {
      return { id: entryKey(entry) + '::' + idx, label: obtain };
    });
  }

  function rewardChecked(entry, rewardId) {
    var byGame = saved[currentGameKey()] || {};
    var entryState = byGame[entryKey(entry)] || {};
    return !!entryState[rewardId];
  }

  function setRewardChecked(entry, rewardId, checked) {
    var game = currentGameKey();
    saved[game] = saved[game] || {};
    saved[game][entryKey(entry)] = saved[game][entryKey(entry)] || {};
    if (checked) {
      saved[game][entryKey(entry)][rewardId] = true;
    } else {
      delete saved[game][entryKey(entry)][rewardId];
      if (!Object.keys(saved[game][entryKey(entry)]).length) delete saved[game][entryKey(entry)];
      if (!Object.keys(saved[game]).length) delete saved[game];
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) {}
  }

  function allRewardsChecked(entry) {
    var rewards = rewardList(entry);
    return rewards.length > 0 && rewards.every(function(r) { return rewardChecked(entry, r.id); });
  }

  function anyRewardChecked(entry) {
    return rewardList(entry).some(function(r) { return rewardChecked(entry, r.id); });
  }

  // ── page-level state ─────────────────────────────────────────────────────
  var state = window._distributionsPageState || { source: 'all', language: 'all', query: '', onlyUnchecked: false };
  window._distributionsPageState = state;

  // ── filter helpers ───────────────────────────────────────────────────────
  function gameMatches(entry) {
    var g = currentGameKey();
    if (!g || g === 'all') return true;
    return (entry.targets || []).some(function(target) {
      var t = norm(target);
      if (g === 'FR') return t.indexOf('firered') !== -1 || t === 'fr';
      if (g === 'LG') return t.indexOf('leafgreen') !== -1 || t === 'lg';
      if (g === 'R')  return t.indexOf('ruby') !== -1 || t === 'r';
      if (g === 'S')  return t.indexOf('sapphire') !== -1 || t === 's';
      if (g === 'E')  return t.indexOf('emerald') !== -1 || t === 'e';
      return true;
    });
  }

  function matches(entry) {
    if (!gameMatches(entry)) return false;
    if (state.source !== 'all' && norm(entry.source) !== state.source) return false;
    if (state.language !== 'all') {
      var lang = norm(entry.language);
      if (lang !== state.language && lang !== 'multi-language') return false;
    }
    if (state.onlyUnchecked && allRewardsChecked(entry)) return false;
    if (!state.query) return true;
    var hay = [
      entry.title, entry.language, entry.kind, entry.source,
      (entry.obtains || []).join(' '),
      (entry.targets || []).join(' '),
      entry.details, entry.notes,
      (entry.mechanics || []).join(' ')
    ].join(' ').toLowerCase();
    return hay.indexOf(norm(state.query)) !== -1;
  }

  // ── shiny text helper ────────────────────────────────────────────────────
  function shinyText(entry) {
    if (entry.source === 'Project Wonder' && entry.kind.indexOf('Egg') === -1) return '';
    if (entry.kind.indexOf('Item') !== -1 && entry.kind.indexOf('Egg') === -1 && entry.kind.indexOf('mon') === -1) return '';
    var note = norm(entry.notes || '');
    if (note.indexOf('not shiny-locked') !== -1 || note.indexOf('can be shiny') !== -1) {
      return ' · <span style="color:#7fe39c;">✶ Shiny Possible</span>';
    }
    if (note.indexOf('shiny-locked') !== -1) {
      return ' · <span style="color:var(--muted);">Shiny Locked</span>';
    }
    return '';
  }

  // ── filter button style (matches game-selector buttons) ──────────────────
  function filterBtnCss(active) {
    return 'font-family:\'Press Start 2P\',monospace;font-size:7px;padding:5px 10px;border-radius:4px;'
      + 'border:2px solid ' + (active ? 'var(--game-color,var(--gold))' : 'var(--border)') + ';'
      + 'background:transparent;cursor:pointer;'
      + 'color:' + (active ? 'var(--game-color,var(--gold))' : 'var(--muted)') + ';';
  }

  // ── main render ──────────────────────────────────────────────────────────
  function render() {
    var filtered = allEntries.filter(matches);
    var allForGame = allEntries.filter(gameMatches);
    var gameRewards = allForGame.reduce(function(n, e) { return n + rewardList(e).length; }, 0);
    var gameChecked = allForGame.reduce(function(n, e) {
      return n + rewardList(e).filter(function(r) { return rewardChecked(e, r.id); }).length;
    }, 0);

    var activeEl = document.activeElement;
    var searchFocused = activeEl && activeEl.id === 'dist-search';
    var selStart = searchFocused ? activeEl.selectionStart : null;
    var selEnd   = searchFocused ? activeEl.selectionEnd   : null;

    root.innerHTML = ''
      + '<div style="position:relative;display:flex;align-items:center;margin-bottom:12px;">'
      + '<input id="dist-search" type="text" placeholder="Search distributions..." style="flex:1;padding:8px 12px;padding-right:28px;background:var(--card);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;outline:none;">'
      + '<button id="dist-search-clear" class="search-bar-clear" title="Clear" style="display:' + (state.query ? 'flex' : 'none') + ';" type="button">&#x2715;</button>'
      + '</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;" id="dist-source-btns"></div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;" id="dist-lang-btns"></div>'
      + '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">'
      + '<div style="font-size:11px;color:var(--muted);">Showing <strong style="color:var(--text)">' + filtered.length + '</strong> of <strong style="color:var(--text)">' + allEntries.length + '</strong> &mdash; <strong style="color:var(--text)">' + currentGameLabel() + '</strong>: <strong style="color:var(--text)">' + gameChecked + '</strong> / <strong style="color:var(--text)">' + gameRewards + '</strong> checked</div>'
      + '<div style="font-size:11px;color:var(--muted);"><a href="https://github.com/Goppier/GEN2PokemonDistributions" target="_blank" rel="noopener" style="color:var(--game-color,var(--gold));text-decoration:none;">Classic repo</a> &amp; <a href="https://github.com/Goppier/Gen2DistributionRoms" target="_blank" rel="noopener" style="color:var(--game-color,var(--gold));text-decoration:none;">Project Wonder repo</a></div>'
      + '</div>'
      + '<div id="dist-list"></div>';

    var search = document.getElementById('dist-search');
    var clearBtn = document.getElementById('dist-search-clear');
    if (search) {
      search.value = state.query;
      search.oninput = function() { state.query = this.value || ''; render(); };
      if (clearBtn) clearBtn.onclick = function() { state.query = ''; render(); };
      if (searchFocused) {
        search.focus();
        if (selStart !== null) try { search.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }

    var srcBtns = document.getElementById('dist-source-btns');
    [
      { key: 'all',                     label: 'All Sources' },
      { key: 'classic distribution rom', label: 'Classic ROMs' },
      { key: 'project wonder',          label: 'Project Wonder' }
    ].forEach(function(opt) {
      var btn = document.createElement('button');
      btn.style.cssText = filterBtnCss(state.source === opt.key);
      btn.textContent = opt.label;
      btn.onclick = function() { state.source = opt.key; render(); };
      srcBtns.appendChild(btn);
    });

    var langBtns = document.getElementById('dist-lang-btns');
    [
      { key: 'all',      label: 'All Languages' },
      { key: 'english',  label: 'English' },
      { key: 'japanese', label: 'Japanese' }
    ].forEach(function(opt) {
      var btn = document.createElement('button');
      btn.style.cssText = filterBtnCss(state.language === opt.key);
      btn.textContent = opt.label;
      btn.onclick = function() { state.language = opt.key; render(); };
      langBtns.appendChild(btn);
    });
    var unchBtn = document.createElement('button');
    unchBtn.style.cssText = filterBtnCss(state.onlyUnchecked);
    unchBtn.textContent = 'Unchecked Only';
    unchBtn.onclick = function() { state.onlyUnchecked = !state.onlyUnchecked; render(); };
    langBtns.appendChild(unchBtn);

    var list = document.getElementById('dist-list');
    if (!filtered.length) {
      list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:12px;">No distribution entries match the current filters.</div>';
      return;
    }

    list.innerHTML = filtered.map(function(entry) {
      var rewards = rewardList(entry);
      var checkedCount = rewards.filter(function(r) { return rewardChecked(entry, r.id); }).length;
      var fullyChecked = rewards.length > 0 && checkedCount === rewards.length;
      var partiallyChecked = !fullyChecked && checkedCount > 0;
      var borderColor = fullyChecked ? 'rgba(127,227,156,0.35)' : partiallyChecked ? 'rgba(255,209,102,0.35)' : 'var(--border)';
      var sourceLabel = entry.source === 'Project Wonder' ? 'Project Wonder' : 'Classic ROM';

      var checkboxesHtml = rewards.map(function(reward) {
        var checked = rewardChecked(entry, reward.id);
        return '<label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;">'
          + '<input data-dist-entry="' + escAttr(entryKey(entry)) + '" data-dist-reward="' + escAttr(reward.id) + '" type="checkbox" ' + (checked ? 'checked' : '') + ' style="width:14px;height:14px;accent-color:var(--game-color,var(--gold));flex:0 0 auto;">'
          + '<span style="font-size:12px;color:' + (checked ? 'var(--muted)' : 'var(--text)') + ';text-decoration:' + (checked ? 'line-through' : 'none') + ';">' + escHtml(reward.label) + '</span>'
          + '</label>';
      }).join('');

      var mechanicsHtml = (entry.mechanics && entry.mechanics.length)
        ? '<div style="margin-top:8px;font-size:10px;color:var(--muted);line-height:1.8;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05);">'
          + '<span style="font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));margin-right:6px;letter-spacing:0.5px;">COMBOS</span>'
          + entry.mechanics.map(escHtml).join(' &middot; ')
          + '</div>'
        : '';

      var notesHtml = entry.notes
        ? '<div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.7;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05);">' + escHtml(entry.notes) + '</div>'
        : '';

      return '<div style="background:var(--card);border:1px solid ' + borderColor + ';border-radius:8px;margin-bottom:10px;overflow:hidden;">'
        + '<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--panel);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
        + '<span style="color:' + (fullyChecked ? 'var(--muted)' : 'var(--text)') + ';">' + escHtml(entry.title.toUpperCase()) + '</span>'
        + '<span style="font-size:6px;color:var(--muted);">' + checkedCount + ' / ' + rewards.length + '</span>'
        + '</div>'
        + '<div style="padding:10px 14px;">'
        + '<div style="font-size:10px;color:var(--muted);margin-bottom:6px;">' + escHtml(sourceLabel) + ' &middot; ' + escHtml(entry.kind) + ' &middot; ' + escHtml(entry.language) + shinyText(entry) + '</div>'
        + '<div style="font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:8px;">' + escHtml(entry.details || '') + '</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-bottom:' + (rewards.length ? '8' : '0') + 'px;"><span style="font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--game-color,var(--gold));margin-right:6px;">TARGETS</span>' + escHtml((entry.targets || []).join(', ')) + '</div>'
        + checkboxesHtml
        + mechanicsHtml
        + notesHtml
        + '</div>'
        + '</div>';
    }).join('');

    Array.prototype.forEach.call(root.querySelectorAll('input[data-dist-reward]'), function(box) {
      box.onchange = function() {
        var entryId  = this.getAttribute('data-dist-entry');
        var rewardId = this.getAttribute('data-dist-reward');
        var entry = allEntries.filter(function(e) { return entryKey(e) === entryId; })[0];
        if (!entry) return;
        setRewardChecked(entry, rewardId, this.checked);
        render();
      };
    });
  }

  render();
}

// Legacy stub — the checklist is now fully integrated into buildDistributionsPage.
function buildDistributionChecklistPage() {}
