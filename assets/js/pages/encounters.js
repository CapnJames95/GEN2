// Wild encounters page — Gen 2 (Gold, Silver, Crystal)
//
// Reads window.ENCOUNTERS_GEN2 (loaded from assets/data/encounters-gen2.js)
// and renders per-location encounter tables grouped by game.

(function() {
  'use strict';

  var GAMES = [
    { key:'gold',    slot:'FR', label:'Gold',    color:'#E5B928' },
    { key:'silver',  slot:'LG', label:'Silver',  color:'#B0BEC5' },
    { key:'crystal', slot:'E',  label:'Crystal', color:'#7FB8E0' }
  ];

  var METHOD_COLORS = {
    'Wild':'#9E9E9E', 'Surf':'#1B8FE8', 'Old Rod':'#64b4ff',
    'Good Rod':'#5599FF', 'Super Rod':'#2266EE',
    'Rock Smash':'#807840', 'Headbutt':'#78A810',
    'Gift':'#E5B928', 'Static':'#9966CC', 'Egg':'#FFB6C1',
    'PokéFlute':'#D01868', 'SquirtBottle':'#3DA83D'
  };

  var ENC_FILTER = { game:'all', method:'all', time:'all', search:'' };

  var TIME_ICONS = { morning:'🌅', day:'☀️', night:'🌙', any:'' };
  var TIME_LABEL = { morning:'Morning', day:'Day', night:'Night', any:'Anytime' };

  function spriteImg(n) {
    return '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+n+'.png" '
      + 'width="24" height="24" style="image-rendering:pixelated;vertical-align:middle;flex-shrink:0;" onerror="this.style.display=\'none\'">';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function buildEncountersPage() {
    var el = document.getElementById('encounters-content') || document.getElementById('page-encounters');
    if (!el) return;
    var data = window.ENCOUNTERS_GEN2 || {};
    var locNames = Object.keys(data);

    if (!locNames.length) {
      el.innerHTML = '<div class="panel" style="padding:22px;max-width:900px;margin:0 auto;color:var(--muted);">No encounter data loaded.</div>';
      return;
    }

    var allMethods = new Set();
    locNames.forEach(function(loc){
      GAMES.forEach(function(g){
        (data[loc][g.key] || []).forEach(function(e){ allMethods.add(e.method); });
      });
    });
    var methodList = Array.from(allMethods).sort();

    var html = '<div class="panel" style="padding:18px;max-width:1100px;margin:0 auto;">'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px;">'
      +   '<input id="enc-search" type="text" placeholder="🔍 Filter by location or Pokémon name…" '
      +     'style="flex:1;min-width:220px;background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;outline:none;" '
      +     'oninput="window._encUpdate(\'search\', this.value)">'
      +   '<select id="enc-game" style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;" '
      +     'onchange="window._encUpdate(\'game\', this.value)">'
      +     '<option value="all">All Games</option>'
      +     GAMES.map(function(g){ return '<option value="'+g.key+'">'+g.label+'</option>'; }).join('')
      +   '</select>'
      +   '<select id="enc-method" style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;" '
      +     'onchange="window._encUpdate(\'method\', this.value)">'
      +     '<option value="all">All Methods</option>'
      +     methodList.map(function(m){ return '<option value="'+m+'">'+m+'</option>'; }).join('')
      +   '</select>'
      +   '<select id="enc-time" style="background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 10px;color:var(--text);font-size:12px;" '
      +     'onchange="window._encUpdate(\'time\', this.value)">'
      +     '<option value="all">All Times</option>'
      +     '<option value="morning">🌅 Morning</option>'
      +     '<option value="day">☀️ Day</option>'
      +     '<option value="night">🌙 Night</option>'
      +     '<option value="any">⊘ Any-time only</option>'
      +   '</select>'
      + '</div>'
      + '<div id="enc-list" style="display:flex;flex-direction:column;gap:14px;"></div>'
      + '</div>';
    el.innerHTML = html;
    renderEncList();
  }

  function renderEncList() {
    var listEl = document.getElementById('enc-list');
    if (!listEl) return;
    var data = window.ENCOUNTERS_GEN2 || {};
    var q = (ENC_FILTER.search || '').toLowerCase().trim();
    var gameFilter = ENC_FILTER.game;
    var methodFilter = ENC_FILTER.method;
    var html = '';
    var anyShown = 0;

    Object.keys(data).forEach(function(loc) {
      var byGame = {};
      var locHasMatch = false;
      var locNameMatch = !q || loc.toLowerCase().indexOf(q) !== -1;
      GAMES.forEach(function(g) {
        if (gameFilter !== 'all' && gameFilter !== g.key) return;
        var timeFilter = ENC_FILTER.time;
        var rows = (data[loc][g.key] || []).filter(function(e) {
          if (methodFilter !== 'all' && e.method !== methodFilter) return false;
          if (timeFilter !== 'all') {
            var t = e.time || 'any';
            if (timeFilter === 'any') {
              if (t !== 'any') return false;
            } else {
              // Match the specific time-of-day OR any-time entries (which are
              // available in every window).
              if (t !== timeFilter && t !== 'any') return false;
            }
          }
          if (q && !locNameMatch && e.name.toLowerCase().indexOf(q) === -1) return false;
          return true;
        });
        if (rows.length) {
          byGame[g.key] = rows;
          locHasMatch = true;
        }
      });
      if (!locHasMatch) return;
      anyShown++;

      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px;">';
      html += '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));letter-spacing:0.5px;margin-bottom:10px;">'+escapeHtml(loc)+'</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">';
      GAMES.forEach(function(g) {
        var rows = byGame[g.key];
        if (!rows) return;
        html += '<div style="border-left:3px solid '+g.color+';padding-left:10px;">';
        html += '<div style="font-size:10px;font-weight:700;color:'+g.color+';margin-bottom:6px;">'+g.label.toUpperCase()+'</div>';
        rows.forEach(function(e) {
          var mcolor = METHOD_COLORS[e.method] || '#888';
          var lvl = (e.min === e.max) ? ('Lv'+e.min) : ('Lv'+e.min+'-'+e.max);
          var pokeName = '<span class="guide-poke-link" onclick="guideDex(\''+e.name.replace(/'/g,"\\'")+'\')">'+e.name+'</span>';
          var timeBadge = (e.time && e.time !== 'any')
            ? '<span title="'+(TIME_LABEL[e.time]||'')+'" style="font-size:11px;">'+TIME_ICONS[e.time]+'</span>'
            : '';
          var swarmBadge = e.swarm
            ? '<span title="Swarm only" style="font-size:9px;font-weight:800;color:#FF6B35;">SWARM</span>'
            : '';
          html += '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:11px;color:var(--text);">'
            + spriteImg(e.n)
            + '<span style="font-size:9px;font-weight:700;color:'+mcolor+';min-width:64px;">'+e.method+'</span>'
            + '<span style="flex:1;">'+pokeName+' '+timeBadge+' '+swarmBadge+'</span>'
            + '<span style="font-size:10px;color:var(--muted);">'+lvl+'</span>'
            + '<span style="font-size:10px;color:var(--muted);min-width:36px;text-align:right;">'+e.chance+'%</span>'
            + '</div>';
        });
        html += '</div>';
      });
      html += '</div></div>';
    });

    if (!anyShown) {
      html = '<div style="text-align:center;padding:40px 16px;color:var(--muted);font-size:13px;">No encounters match your filters.</div>';
    }
    listEl.innerHTML = html;
  }

  window._encUpdate = function(key, val) {
    ENC_FILTER[key] = val;
    renderEncList();
  };

  window.buildEncountersPage = buildEncountersPage;
})();
