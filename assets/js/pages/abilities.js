function buildAbilitiesPage() {
  abRender();
  window._abilitiesBuilt = true;
}

function abRender() {
  var q = (_norm||function(s){return s.toLowerCase().trim();})(document.getElementById('ab-search').value || '');
  if (typeof setPageHash === 'function') setPageHash('abilities', q ? { ability: document.getElementById('ab-search').value || '' } : null);
  var abilityIndex = {};
  Object.keys(ABILITIES_DATA).forEach(function(num) {
    var ab = ABILITIES_DATA[num];
    [ab.a1, ab.a2].forEach(function(name) {
      if (!name) return;
      if (!abilityIndex[name]) abilityIndex[name] = [];
      abilityIndex[name].push(Number(num));
    });
  });

  var names = Object.keys(abilityIndex).sort();
  if (q) {
    names = names.filter(function(name) {
      if (_norm(name).includes(q)) return true;
      return abilityIndex[name].some(function(n) {
        var p = POKE.find(function(p) { return p.num === n; });
        return p && _norm(p.name).includes(q);
      });
    });
  }

  if (!names.length) {
    document.getElementById('ab-list').innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:12px;">No abilities found.</div>';
    return;
  }

  var typeColors = {Normal:'#A8A878',Fire:'#F08030',Water:'#6890F0',Grass:'#78C850',Electric:'#F8D030',Ice:'#98D8D8',Fighting:'#C03028',Poison:'#A040A0',Ground:'#E0C068',Flying:'#A890F0',Psychic:'#F85888',Bug:'#A8B820',Rock:'#B8A038',Ghost:'#705898',Dragon:'#7038F8',Dark:'#705848',Steel:'#B8B8D0'};

  var html = names.map(function(name) {
    var desc = ABILITY_DESCS[name] || '';
    var pokeNums = abilityIndex[name];
    var chips = pokeNums.map(function(n) {
      var p = POKE.find(function(p) { return p.num === n; });
      if (!p) return '';
      var typeColor = typeColors[(p.types[0]||'').charAt(0).toUpperCase()+(p.types[0]||'').slice(1)] || '#888';
      return '<span onclick="_openDexSearch(\''+p.name+'\','+n+')" style="display:inline-flex;align-items:center;gap:4px;background:var(--card);border:1px solid var(--border);border-radius:4px;padding:3px 7px;font-size:11px;cursor:pointer;margin:2px;transition:border-color 0.12s;" onmouseover="this.style.borderColor=gameColor()" onmouseout="this.style.borderColor=\'var(--border)\'">'
        +'<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+n+'.png" style="width:20px;height:20px;image-rendering:pixelated;">'
        +'<span style="color:var(--muted);font-size:10px;">#'+String(n).padStart(3,'0')+'</span>'
        +p.name+'</span>';
    }).join('');

    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:12px;">'
      +'<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px;">'
      +'<span style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));">'+name+'</span>'
      +'<span style="font-size:10px;color:var(--muted);">'+pokeNums.length+' Pokémon</span>'
      +'</div>'
      +(desc ? '<div style="font-size:12px;color:var(--text);margin-bottom:10px;line-height:1.6;">'+desc+'</div>' : '')
      +'<div style="display:flex;flex-wrap:wrap;gap:2px;">'+chips+'</div>'
      +'</div>';
  }).join('');

  document.getElementById('ab-list').innerHTML = html;
}

function _openAbilities(abilityName) {
  closeSearch();
  if (typeof setPageHash === 'function') setPageHash('abilities', abilityName ? { ability: abilityName } : null);
  var btn = document.getElementById('navAbilities');
  closeNavDropdown('navPokeDropdown');
  showPage('abilities', btn);
  if (!window._abilitiesBuilt) { buildAbilitiesPage(); }
  if (abilityName) {
    setTimeout(function() {
      var inp = document.getElementById('ab-search');
      if (inp) { inp.value = abilityName; abRender(); }
    }, 80);
  }
}
