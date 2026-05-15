// REGION: PAGE REGISTRY
window.PAGE_REGISTRY = window.PAGE_REGISTRY || {
  tutors: {
    script: 'assets/js/pages/tutors.js',
    init: function() { if (!window._tutorsBuilt) { buildTutorPage(); window._tutorsBuilt = true; } }
  },
  abilities: {
    script: 'assets/js/pages/abilities.js',
    init: function() { if (!window._abilitiesBuilt) { buildAbilitiesPage(); window._abilitiesBuilt = true; } }
  },
  learnsets: {
    script: 'assets/js/pages/learnsets.js',
    init: function() { if (!window._learnsetsBuilt) { buildLearnsetsPage(); window._learnsetsBuilt = true; } }
  },
  encounters: {
    script: 'assets/js/pages/encounters.js',
    init: function() { if (!window._encountersBuilt) { buildEncountersPage(); window._encountersBuilt = true; } }
  },
  itemlocs: {
    script: 'assets/js/pages/itemlocs.js',
    init: function() { if (!window._itemlocsBuilt) { buildItemLocsPage(); window._itemlocsBuilt = true; } }
  },
  safarizone: {
    script: 'assets/js/pages/safarizone.js',
    init: function() { if (!window._safariZoneBuilt) { buildSafariZonePage(); window._safariZoneBuilt = true; } }
  },
  statcalc: {
    script: 'assets/js/pages/statcalc.js',
    init: function() { if (!window._statCalcBuilt) { buildStatCalcPage(); window._statCalcBuilt = true; } }
  },
  pokeblock: {
    script: 'assets/js/pages/pokeblock.js',
    init: function() { if (!window._pokeblockBuilt) { buildPokeblockPage(); window._pokeblockBuilt = true; } }
  },
  e4ref: {
    script: 'assets/js/pages/e4ref.js',
    init: function() { if (!window._e4refBuilt) { buildE4RefPage(); window._e4refBuilt = true; } }
  },
  rematches: {
    script: 'assets/js/pages/rematches.js',
    init: function() { if (!window._rematchesBuilt) { buildRematchesPage(); window._rematchesBuilt = true; } }
  },
  routebrowser: {
    script: 'assets/js/pages/routebrowser.js',
    init: function() { buildRouteBrowserPage(); window._routeBrowserBuilt = true; }
  },
  distributions: {
    script: 'assets/js/pages/distributions.js',
    init: function() { if (!window._distributionsBuilt) { buildDistributionsPage(); window._distributionsBuilt = true; } }
  },
  distributionchecklist: {
    script: 'assets/js/pages/distributionchecklist.js',
    init: function() { if (!window._distributionChecklistBuilt) { buildDistributionChecklistPage(); window._distributionChecklistBuilt = true; } else { buildDistributionChecklistPage(); } }
  }
};

window._pageScriptPromises = window._pageScriptPromises || {};

window.loadPageScript = function(id) {
  var entry = window.PAGE_REGISTRY && window.PAGE_REGISTRY[id];
  if (!entry || !entry.script) return Promise.resolve();
  if (window._pageScriptPromises[id]) return window._pageScriptPromises[id];
  if (document.querySelector('script[data-page-script="' + id + '"]')) {
    window._pageScriptPromises[id] = Promise.resolve();
    return window._pageScriptPromises[id];
  }
  window._pageScriptPromises[id] = new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = entry.script;
    script.async = false;
    script.dataset.pageScript = id;
    script.onload = resolve;
    script.onerror = function() { reject(new Error('Failed to load ' + entry.script)); };
    document.body.appendChild(script);
  });
  return window._pageScriptPromises[id];
};

window.ensurePageReady = function(id) {
  var entry = window.PAGE_REGISTRY && window.PAGE_REGISTRY[id];
  if (!entry) return Promise.resolve();
  return window.loadPageScript(id).then(function() {
    if (entry.init) entry.init();
  }).catch(function(err) {
    console.error(err);
  });
};

window.openPage = function(id, navId, dropdownId) {
  if (dropdownId && typeof closeNavDropdown === 'function') closeNavDropdown(dropdownId);
  var btn = navId ? document.getElementById(navId) : null;
  if (typeof showPage === 'function') showPage(id, btn);
  if (typeof ensurePageReady === 'function') ensurePageReady(id);
  return false;
};
