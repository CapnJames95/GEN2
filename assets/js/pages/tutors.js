// Gen 2 Move Tutors + Move Teachers
//
// Includes the actual tutors (NPCs that teach a move directly),
// the Move Reminder + Move Deleter, the Goldenrod & Celadon
// Game Corner TM purchases, and the Mt. Mortar Karate King Tyrogue
// gift. All wrapped in a single sortable / filterable table.

(function() {
  'use strict';

  var TYPE_COLORS = {
    Normal:'#9E9E9E',Fire:'#E8501A',Water:'#1B8FE8',Grass:'#3DA83D',
    Electric:'#D4A800',Ice:'#60C8C8',Fighting:'#B83020',Poison:'#8B3099',
    Ground:'#8B6840',Flying:'#6850C0',Psychic:'#D01868',Bug:'#78A810',
    Rock:'#807840',Ghost:'#4030A0',Dragon:'#5038E8',Dark:'#403030',
    Steel:'#9898A8','—':'#666'
  };

  // cat: 'tutor' / 'reminder' / 'gamecorner' / 'special'
  var TUTORS = [
    // ── Direct move tutors ──
    { cat:'tutor', move:'Headbutt',     type:'Normal',  loc:'Ilex Forest cabin (boy near Charcoal Kiln)', games:'G/S/C', cost:'Free',
      note:'Required to find Pokémon hiding in Headbutt trees. Compatible: most Pokémon learn it (Pidgey, Heracross, Aipom lines, etc.).' },
    { cat:'tutor', move:'Dragon Breath',type:'Dragon',  loc:'Mt. Mortar B1F (old man)',                   games:'Crystal only', cost:'Free',
      note:'Only Dragon-type and a few Water-types qualify (Dratini line, Charizard, Gyarados, Kingdra).' },
    { cat:'tutor', move:'Pain Split',   type:'Normal',  loc:'Goldenrod City house, west of Bike Shop',    games:'G/S/C', cost:'Free, one use',
      note:'Niche utility move — splits user/target current HP.' },
    { cat:'tutor', move:'Sweet Scent',  type:'Normal',  loc:'National Park (gate guard, NE)',             games:'G/S/C', cost:'Free, one use',
      note:'Triggers a wild encounter. Useful for chaining Bug-Catching prep.' },
    { cat:'tutor', move:'Mimic',        type:'Normal',  loc:'Goldenrod City Pokémon Center area',         games:'G/S/C', cost:'Free, one use',
      note:'Hard-to-justify niche move; copies the foe\'s last move for the rest of battle.' },

    // ── Move Reminder + Move Deleter ──
    { cat:'reminder', move:'Move Reminder',  type:'—', loc:'Blackthorn City house', games:'G/S/C', cost:'Free (Gen 2 only!)',
      note:'Re-teaches any move the Pokémon learned through level-up. Once per visit per Pokémon. Becomes Heart-Scale-gated in Gen 3+.' },
    { cat:'reminder', move:'Move Deleter',   type:'—', loc:'Blackthorn City (separate house)',  games:'G/S/C', cost:'Free',
      note:'Forgets any move including HMs. Use to drop Cut/Fly/etc. before final-team builds.' },

    // ── Game Corner TM purchases ──
    { cat:'gamecorner', move:'TM05 — Roar',       type:'Normal',  loc:'Goldenrod Game Corner', games:'G/S/C', cost:'1000 coins',
      note:'Cheapest TM at Goldenrod. Useful for force-ending wild encounters.' },
    { cat:'gamecorner', move:'TM23 — Iron Tail',  type:'Steel',   loc:'Goldenrod Game Corner', games:'G/S/C', cost:'2000 coins',
      note:'Strongest Steel attack accessible mid-game.' },
    { cat:'gamecorner', move:'TM13 — Snore',      type:'Normal',  loc:'Goldenrod Game Corner', games:'G/S/C', cost:'1000 coins',
      note:'Only usable while asleep. Rest+Snore is a Gen-2 staple.' },
    { cat:'gamecorner', move:'TM01 — DynamicPunch',type:'Fighting',loc:'Goldenrod Game Corner', games:'G/S/C', cost:'2000 coins',
      note:'Always confuses on hit; 50% accuracy hurts. Free copy from Mahogany after Rocket arc.' },
    { cat:'gamecorner', move:'TM35 — Sleep Talk', type:'Normal',  loc:'Celadon Game Corner',   games:'G/S/C', cost:'1000 coins',
      note:'Pairs with Rest. The other half of the classic RestTalk loop.' },
    { cat:'gamecorner', move:'TM38 — Fire Blast', type:'Fire',    loc:'Celadon Game Corner',   games:'G/S/C', cost:'5500 coins',
      note:'Top-tier Fire attack. Worth grinding coins for.' },
    { cat:'gamecorner', move:'TM25 — Thunder',    type:'Electric',loc:'Celadon Game Corner',   games:'G/S/C', cost:'5500 coins',
      note:'120 BP, 70% accuracy. Pair with Rain Dance for 100% accuracy + 1.5×.' },
    { cat:'gamecorner', move:'TM14 — Blizzard',   type:'Ice',     loc:'Celadon Game Corner',   games:'G/S/C', cost:'5500 coins',
      note:'120 BP, 70% accuracy. 10% freeze chance — devastating in Gen 2 where freeze is permanent.' },

    // ── Karate King / Mt. Mortar special ──
    { cat:'special', move:'Tyrogue (Lv10 gift)', type:'Fighting', loc:'Mt. Mortar 2F (Karate King)',  games:'G/S/C', cost:'Free',
      note:'Beat the Karate King to receive a Lv10 Tyrogue. Atk vs Def DVs at Lv20 decide its evolution (Hitmonlee / Hitmonchan / Hitmontop).' },
    { cat:'special', move:'TM Move Rebuy',       type:'—',        loc:'Mart 2F shopkeeper (various)', games:'G/S/C', cost:'TM-dependent',
      note:'A handful of TMs are sold at Marts (Bide, Mega Punch, Mega Kick at Celadon — see TM/HM Locator for the full set).' }
  ];

  var CAT_META = {
    tutor:     { label:'Direct Tutors',          icon:'🎓', color:'#7FB8E0' },
    reminder:  { label:'Move Reminder / Deleter',icon:'🧠', color:'#E5B928' },
    gamecorner:{ label:'Game Corner Purchases',  icon:'🎰', color:'#FF6B35' },
    special:   { label:'Special / Gifts',        icon:'⭐', color:'#9966CC' }
  };

  function pill(t) {
    return '<span style="display:inline-block;font-size:8px;font-weight:800;padding:2px 6px;border-radius:3px;text-transform:uppercase;background:'+(TYPE_COLORS[t]||'#666')+';color:#fff;">'+t+'</span>';
  }

  function buildTutorPage() {
    var el = document.getElementById('tutors-content');
    if (!el) return;

    var byCat = {};
    TUTORS.forEach(function(t){ (byCat[t.cat] = byCat[t.cat] || []).push(t); });

    var sections = Object.keys(CAT_META).map(function(catKey) {
      var rows = byCat[catKey] || [];
      if (!rows.length) return '';
      var meta = CAT_META[catKey];
      var body = '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
        + '<thead><tr style="border-bottom:1px solid var(--border);background:var(--card);">'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Move / Gift</th>'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Type</th>'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Location</th>'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Games</th>'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Cost</th>'
        + '<th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Notes</th>'
        + '</tr></thead><tbody>'
        + rows.map(function(t) {
            return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);">'
              + '<td style="padding:8px 10px;font-weight:700;color:var(--text);font-size:12px;">'+t.move+'</td>'
              + '<td style="padding:8px 10px;">'+pill(t.type)+'</td>'
              + '<td style="padding:8px 10px;font-size:11px;color:var(--text);">'+t.loc+'</td>'
              + '<td style="padding:8px 10px;font-size:11px;color:var(--muted);white-space:nowrap;">'+t.games+'</td>'
              + '<td style="padding:8px 10px;font-size:11px;color:var(--muted);white-space:nowrap;">'+t.cost+'</td>'
              + '<td style="padding:8px 10px;font-size:11px;color:var(--muted);line-height:1.6;">'+t.note+'</td>'
              + '</tr>';
        }).join('')
        + '</tbody></table>';
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid '+meta.color+';border-radius:6px;margin-bottom:14px;overflow:hidden;">'
        + '<div style="padding:10px 14px;font-family:\'Press Start 2P\',monospace;font-size:8px;color:'+meta.color+';letter-spacing:0.5px;border-bottom:1px solid var(--border);">'
        + meta.icon + ' ' + meta.label.toUpperCase()
        + '</div>'
        + body
        + '</div>';
    }).join('');

    el.innerHTML =
      '<div style="max-width:1080px;margin:0 auto;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">TUTORS &amp; MOVE TEACHERS — GEN 2</div>'
      + '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.7;">'
      + 'Every NPC who teaches or sells a move in Gold / Silver / Crystal. Includes the four direct tutors, the free Blackthorn Move Reminder + Deleter, the Goldenrod and Celadon Game Corner TM purchases (coin counts vary), and the Mt. Mortar Karate King Tyrogue gift.'
      + '</div>'
      + sections
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:8px;">'
      + '<strong style="color:var(--text);">Coin grinding:</strong> Goldenrod\'s Game Corner pays out faster than Celadon\'s (slots have better odds in some rolls). Buy a Coin Case from the Goldenrod Underground first. For the 5,500-coin Celadon TMs, expect ~30–60 minutes of slot grinding per TM.'
      + '</div>'
      + '</div>';
  }

  window.buildTutorPage = buildTutorPage;
})();
