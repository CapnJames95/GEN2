// Item locations — Gen 2 (Gold, Silver, Crystal)
//
// Curated index of where every notable Gen-2 item is found.

(function() {
  'use strict';

  // ── Category palette ───────────────────────────────────────────
  var CATS = {
    'Key':         { color:'#E5B928', icon:'🔑' },
    'Held Item':   { color:'#7FB8E0', icon:'💎' },
    'Evolution':   { color:'#9966CC', icon:'🌟' },
    'TM/HM':       { color:'#4CAF50', icon:'📀' },
    'Apricorn':    { color:'#FF6B35', icon:'🍎' },
    'Berry':       { color:'#E91E63', icon:'🍓' },
    'Misc':        { color:'#B0BEC5', icon:'🎒' }
  };

  var GAME_LABELS = { FR:'G', LG:'S', E:'C' };

  // ── Item dataset ──────────────────────────────────────────────
  // Each entry: {name, cat, games:['FR','LG','E'], locations:[...]}
  // Each location: {place, how, qty}
  var ITEMS = [
    // ── KEY ITEMS ─────────────────────────────────────────────
    { name:'Town Map', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'New Bark Town', how:'Mom gives it before you leave.', qty:1} ] },
    { name:'Bicycle', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Goldenrod City — Bike Shop', how:'Lend the bike from the shopkeeper. Never returned.', qty:1} ] },
    { name:'SquirtBottle', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Goldenrod City — Flower Shop', how:'Florist gift after defeating Bugsy.', qty:1} ] },
    { name:'Old Rod', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Olivine City — Pokémon Center area', how:'Given by a Fishing Guru NPC.', qty:1} ] },
    { name:'Good Rod', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Olivine City — Fishing Guru house', how:'Given after delivering SecretPotion.', qty:1} ] },
    { name:'Super Rod', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Kanto Route 12 — Fishing Brother house', how:'Given by the Fishing Brother.', qty:1} ] },
    { name:'S.S. Ticket', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Olivine City — Sailor', how:'Gift from Prof. Elm after the Goldenrod Game Corner arc.', qty:1} ] },
    { name:'Magnet Train Pass', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Saffron City — Copycat\'s house', how:'Return Copycat\'s Lost Item (from Vermilion S.S. Aqua passenger).', qty:1} ] },
    { name:'Radio Card', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Goldenrod Radio Tower', how:'Pass the multi-choice radio quiz at reception.', qty:1} ] },
    { name:'EXPN Card', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Lavender Radio Tower', how:'Given by the manager after clearing the Kanto radio plot.', qty:1} ] },
    { name:'GS Ball', cat:'Key', games:['E'],
      locations:[ {place:'Goldenrod Pokémon Center', how:'Event-only — Pokémon Center NY 2001 / JP Pokémon Mobile. Give to Kurt → Ilex Forest shrine → Celebi.', qty:1} ] },
    { name:'Silver Wing / Rainbow Wing', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'Pewter Museum (Kanto, post-E4)', how:'Crystal gives both; Gold gets only Rainbow Wing; Silver gets only Silver Wing. Trade Crystal save for both.', qty:1} ] },
    { name:'Master Ball', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'New Bark Town — Prof. Elm', how:'Given after the Mahogany Rocket arc.', qty:1} ] },
    { name:'Lost Item', cat:'Key', games:['FR','LG','E'],
      locations:[ {place:'S.S. Aqua (Vermilion → Olivine)', how:'Vacationing girl asks you to find a lost doll. Return to Copycat in Saffron.', qty:1} ] },

    // ── HELD ITEMS (wild-carried) ──────────────────────────────
    { name:'Leftovers', cat:'Held Item', games:['FR','LG','E'],
      locations:[
        {place:'Route 11 — Snorlax', how:'Always held by the static Lv50 Snorlax.', qty:1},
        {place:'Celadon Department Store', how:'Buy in some Crystal builds — otherwise Snorlax-only.', qty:'—'}
      ] },
    { name:'Lucky Egg', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Routes 13–15 — wild Chansey (~5%)', how:'Bring Thief / Covet to steal. Doubles to ×1.5 of all EXP gains.', qty:'rare hold'} ] },
    { name:'King\'s Rock', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Slowpoke Well / Surf Route 32', how:'Wild Slowpoke / Slowbro carry ~5%. Required to evolve Slowking and Politoed.', qty:'rare hold'} ] },
    { name:'Metal Coat', cat:'Held Item', games:['FR','LG','E'],
      locations:[
        {place:'Magnemite swarms / Power Plant', how:'Wild Magnemite & Magneton carry ~25%.', qty:'common hold'},
        {place:'S.S. Aqua', how:'Sailor gives one onboard.', qty:1}
      ] },
    { name:'Dragon Scale', cat:'Held Item', games:['FR','LG','E'],
      locations:[
        {place:'Dragon\'s Den — Wild Horsea / Seadra', how:'Wild carry ~5%.', qty:'rare hold'},
        {place:'Dragon\'s Den — Elder gift (Crystal)', how:'Crystal-only post-quiz gift.', qty:1}
      ] },
    { name:'Up-Grade', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Goldenrod City — scientist', how:'One-time gift after Mahogany Rocket arc. Trade Porygon holding it to evolve into Porygon2.', qty:1} ] },
    { name:'Light Ball', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Power Plant — wild Pikachu (~5%)', how:'Wild Pikachu carry rarely. Doubles Pikachu\'s Special Attack stat.', qty:'rare hold'} ] },
    { name:'Quick Claw', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Mt. Moon — hidden', how:'Hidden item. Also a small chance of held on certain wild Pokémon.', qty:1} ] },
    { name:'Scope Lens', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Celadon Department Store rooftop', how:'Sold in Crystal only. Held by some wild Pokémon.', qty:'—'} ] },

    // ── EVOLUTION STONES ──────────────────────────────────────
    { name:'Fire Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Goldenrod Dept Store rooftop', how:'Sold on the rooftop (Sundays in some games).', qty:'buy'},
        {place:'Bug-Catching Contest reward', how:'1st-place prize sometimes.', qty:1}
      ] },
    { name:'Water Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Goldenrod Dept Store rooftop', how:'Sold on the rooftop.', qty:'buy'},
        {place:'Bug-Catching Contest reward', how:'1st-place prize sometimes.', qty:1}
      ] },
    { name:'Thunder Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Goldenrod Dept Store rooftop', how:'Sold on the rooftop.', qty:'buy'},
        {place:'Bug-Catching Contest reward', how:'1st-place prize sometimes.', qty:1}
      ] },
    { name:'Leaf Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Celadon Dept Store rooftop (Kanto)', how:'Sold post-E4 in Kanto.', qty:'buy'},
        {place:'Route 38 — gift NPC', how:'Crystal-only NPC gift.', qty:1}
      ] },
    { name:'Moon Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Mt. Moon — hidden squares (Kanto)', how:'Search-Item finder zones.', qty:'~3'},
        {place:'Wild Clefairy held (~5%)', how:'Rare hold from Mt. Moon Clefairy.', qty:'rare hold'}
      ] },
    { name:'Sun Stone', cat:'Evolution', games:['FR','LG','E'],
      locations:[
        {place:'Cliff Cave — hidden item', how:'Search hidden item zones.', qty:1},
        {place:'Wild Solrock / Sunkern held (~5%)', how:'Sunkern carry rarely.', qty:'rare hold'}
      ] },

    // ── APRICORNS ─────────────────────────────────────────────
    { name:'Red Apricorn → Level Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 36, 37, 42 — Red Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'Blue Apricorn → Lure Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 32, 35, 42 — Blue Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'Yellow Apricorn → Moon Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 38, 39, 42 — Yellow Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'Green Apricorn → Friend Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 37, 43, 45 — Green Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'Pink Apricorn → Love Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 42, 43, 45 — Pink Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'White Apricorn → Fast Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 36, 42 — White Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },
    { name:'Black Apricorn → Heavy Ball', cat:'Apricorn', games:['FR','LG','E'],
      locations:[ {place:'Routes 38, 39, 42 — Black Apricorn trees', how:'Press A on a tree once per day.', qty:'1/day per tree'} ] },

    // ── BERRIES (Gen-2 set) ────────────────────────────────────
    { name:'Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Berry trees (many routes)', how:'Restore 10 HP held item. Found on Routes 26, 27, 29, 30, 38 trees.', qty:'1/day per tree'} ] },
    { name:'Gold Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Specific Berry trees', how:'Restore 30 HP held item. Found on Route 30, Cherrygrove, Mt. Mortar trees.', qty:'1/day per tree'} ] },
    { name:'Mystery Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Specific Berry trees', how:'Restores 5 PP. Found on Route 30, Goldenrod outskirts.', qty:'1/day per tree'} ] },
    { name:'Bitter Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Berry trees', how:'Cures confusion. Found on Route 33, Ice Path entrance.', qty:'1/day per tree'} ] },
    { name:'Burnt Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Berry trees', how:'Cures freeze. Found on Route 36, Mt. Mortar.', qty:'1/day per tree'} ] },
    { name:'Ice Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Berry trees', how:'Cures burn. Found near volcanic / fire-type spawn routes.', qty:'1/day per tree'} ] },
    { name:'Mint Berry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Berry trees', how:'Cures sleep. Common on Route 30 / Ilex.', qty:'1/day per tree'} ] },
    { name:'MiracleBerry', cat:'Berry', games:['FR','LG','E'],
      locations:[ {place:'Cures all status. Limited supply.', how:'Goldenrod Dept Store / event drops.', qty:'rare'} ] },

    // ── MISC ─────────────────────────────────────────────────
    { name:'Soft Sand / Sharp Beak / Magnet / etc.', cat:'Held Item', games:['FR','LG','E'],
      locations:[ {place:'Buena\'s Password (Goldenrod Radio Tower)', how:'Earn Blue Card points by listening at the right hour; cash in for type-boost items.', qty:'rotating'} ] }
  ];

  var FILTER = { cat:'all', game:'all', q:'' };

  function spriteIcon(cat) {
    return '<span style="font-size:14px;">'+(CATS[cat]||CATS.Misc).icon+'</span>';
  }

  function renderList() {
    var listEl = document.getElementById('itemlocs-list');
    if (!listEl) return;
    var q = (FILTER.q || '').toLowerCase();
    var rows = ITEMS.filter(function(it) {
      if (FILTER.cat !== 'all' && it.cat !== FILTER.cat) return false;
      if (FILTER.game !== 'all' && it.games.indexOf(FILTER.game) === -1) return false;
      if (q && it.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (!rows.length) {
      listEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);">No items match.</div>';
      return;
    }
    listEl.innerHTML = rows.map(function(it) {
      var meta = CATS[it.cat] || CATS.Misc;
      var games = it.games.map(function(g){
        var clr = ({FR:'#E5B928',LG:'#B0BEC5',E:'#7FB8E0'})[g] || '#888';
        return '<span style="display:inline-block;background:'+clr+';color:#000;font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;margin-right:2px;">'+GAME_LABELS[g]+'</span>';
      }).join('');
      var locs = it.locations.map(function(l){
        return '<div style="font-size:11px;color:var(--muted);line-height:1.6;padding-top:3px;">'
          + '<strong style="color:var(--text);">'+l.place+'</strong> — '+l.how
          + (l.qty ? ' <span style="opacity:0.6;">('+l.qty+')</span>' : '')
          + '</div>';
      }).join('');
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid '+meta.color+';border-radius:6px;padding:12px 14px;">'
        + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">'
        + spriteIcon(it.cat)
        + '<strong style="color:var(--text);font-size:13px;">'+it.name+'</strong>'
        + '<span style="font-size:9px;color:'+meta.color+';font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">'+it.cat+'</span>'
        + '<span style="margin-left:auto;">'+games+'</span>'
        + '</div>'
        + locs
        + '</div>';
    }).join('');
  }

  function buildItemLocsPage() {
    var el = document.getElementById('itemlocs-content') || document.getElementById('page-itemlocs');
    if (!el) return;
    var cats = Object.keys(CATS);
    el.innerHTML =
      '<div class="panel" style="padding:18px;max-width:1000px;margin:0 auto;">'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px;">'
      +   '<input id="il-q" placeholder="🔍 Filter items…" '
      +     'style="flex:1;min-width:220px;background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;outline:none;" '
      +     'oninput="window._ilUpdate(\'q\', this.value)">'
      +   '<select onchange="window._ilUpdate(\'cat\', this.value)" '
      +     'style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;">'
      +     '<option value="all">All Categories</option>'
      +     cats.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('')
      +   '</select>'
      +   '<select onchange="window._ilUpdate(\'game\', this.value)" '
      +     'style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;">'
      +     '<option value="all">All Games</option>'
      +     '<option value="FR">Gold</option>'
      +     '<option value="LG">Silver</option>'
      +     '<option value="E">Crystal</option>'
      +   '</select>'
      + '</div>'
      + '<div id="itemlocs-list" style="display:flex;flex-direction:column;gap:10px;"></div>'
      + '</div>';
    renderList();
  }

  window._ilUpdate = function(key, val) {
    FILTER[key] = val;
    renderList();
  };
  window.buildItemLocsPage = buildItemLocsPage;
})();
