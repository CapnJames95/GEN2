// Distribution checklist — Gen 2
//
// Interactive checklist that tracks which Gen-2 event distributions you've
// obtained. State persists in localStorage. Backed by GEN2_DISTRIBUTIONS
// from distributions.js.

(function() {
  'use strict';

  var STORAGE = 'gen2-dist-checklist';
  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); }
    catch (_e) { return {}; }
  }
  function saveDone(d) {
    try { localStorage.setItem(STORAGE, JSON.stringify(d)); }
    catch (_e) {}
  }

  var DIST_GAME_LABELS = { FR: 'Gold', LG: 'Silver', E: 'Crystal' };
  var DIST_GAME_COLORS = { FR: '#E5B928', LG: '#B0BEC5', E: '#7FB8E0' };

  function keyFor(entry, idx) {
    return (entry.name || '').toLowerCase().replace(/\s+/g,'_') + '__' + idx;
  }

  window.distChecklistToggle = function(key) {
    var done = loadDone();
    if (done[key]) delete done[key]; else done[key] = 1;
    saveDone(done);
    window.buildDistributionChecklistPage();
  };

  window.distChecklistReset = function() {
    if (!confirm('Clear all distribution checklist progress?')) return;
    localStorage.removeItem(STORAGE);
    window.buildDistributionChecklistPage();
  };

  function buildDistributionChecklistPage() {
    var root = document.getElementById('distributionchecklist-content') || document.getElementById('page-distributionchecklist');
    if (!root) return;
    var entries = (window.GEN2_DISTRIBUTIONS || []).slice();
    var done = loadDone();
    var total = entries.length;
    var doneCount = entries.reduce(function(s, e, i){ return s + (done[keyFor(e, i)] ? 1 : 0); }, 0);

    var items = entries.map(function(e, i) {
      var k = keyFor(e, i);
      var isDone = !!done[k];
      var games = (e.games || []).map(function(g) {
        return '<span style="display:inline-block;background:' + (DIST_GAME_COLORS[g] || 'var(--muted)') + ';color:#000;font-size:9px;font-weight:700;padding:1px 6px;border-radius:3px;margin-right:3px;">' + (DIST_GAME_LABELS[g] || g) + '</span>';
      }).join('');
      var sprite = e.num
        ? '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + e.num + '.png" width="40" height="40" style="image-rendering:pixelated;flex-shrink:0;' + (isDone ? '' : '') + '" onerror="this.style.display=\'none\'">'
        : '<div style="font-size:24px;flex-shrink:0;line-height:1;">🎁</div>';
      return '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid ' + (isDone ? '#44DD88' : 'var(--game-color,var(--gold))') + ';border-radius:6px;padding:10px 12px;opacity:' + (isDone ? '0.6' : '1') + ';display:flex;gap:12px;align-items:flex-start;cursor:pointer;" onclick="distChecklistToggle(\'' + k + '\')">'
        + '<div style="font-size:20px;line-height:1;flex-shrink:0;color:' + (isDone ? '#44DD88' : 'var(--muted)') + ';">' + (isDone ? '✓' : '○') + '</div>'
        + sprite
        + '<div style="flex:1;min-width:0;">'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:2px;">'
        + '<strong style="color:var(--text);font-size:13px;">' + e.name + '</strong>'
        + games
        + (e.region ? '<span style="font-size:10px;color:var(--muted);margin-left:auto;">' + e.region + ' · ' + (e.period || '') + '</span>' : '')
        + '</div>'
        + '<div style="font-size:11px;color:var(--muted);line-height:1.6;">' + (e.method || '') + (e.detail ? ' · ' + e.detail : '') + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    var pct = total ? Math.round(doneCount / total * 100) : 0;
    root.innerHTML =
      '<div class="panel" style="padding:18px;max-width:980px;margin:0 auto;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:8px;letter-spacing:1px;">DISTRIBUTION CHECKLIST — GEN 2</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px;">'
      + 'Tick off each Gen-2 event Pokémon / item distribution as you obtain it. Saved per browser. ' + doneCount + ' / ' + total + ' obtained.'
      + '</div>'
      + '<div style="height:6px;background:var(--card);border-radius:3px;overflow:hidden;margin-bottom:14px;">'
      + '<div style="height:100%;background:var(--game-color,var(--gold));width:' + pct + '%;transition:width .3s;"></div>'
      + '</div>'
      + '<div style="display:flex;gap:8px;margin-bottom:14px;">'
      + '<button onclick="distChecklistReset()" style="font-size:11px;padding:6px 12px;background:var(--panel);border:1px solid var(--border);color:var(--muted);border-radius:4px;cursor:pointer;">Reset progress</button>'
      + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;">' + items + '</div>'
      + '<div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--muted);line-height:1.7;margin-top:14px;">'
      + 'Most events are <em>region-locked</em> or <em>era-locked</em> — Celebi (GS Ball), Mew, the JP-only Pokémon News, etc. were impossible to legitimately obtain after the events ended. Marking them as "got" is for completionist tracking only — the data is sourced from <em>Distributions</em>.'
      + '</div>'
      + '</div>';
  }

  window.buildDistributionChecklistPage = buildDistributionChecklistPage;
})();
