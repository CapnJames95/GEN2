function buildDistributionChecklistPage() {
  var root = document.getElementById('distributionchecklist-content');
  if (!root) return;

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

  function summaryBox(label, value, accent) {
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:7px;color:' + accent + ';letter-spacing:1px;margin-bottom:8px;">' + label + '</div>'
      + '<div style="font-size:18px;color:var(--text);font-weight:700;">' + value + '</div>'
      + '</div>';
  }

  function pill(text, color, bg) {
    return '<span style="display:inline-block;padding:4px 8px;border-radius:999px;font-size:10px;border:1px solid ' + color + ';color:' + color + ';background:' + bg + ';">' + text + '</span>';
  }

  function miniBlock(label, value, rawHtml) {
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px;">'
      + '<div style="font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--gold);letter-spacing:1px;margin-bottom:8px;">' + label + '</div>'
      + '<div style="font-size:11px;color:var(--text);line-height:1.8;">' + (rawHtml ? value : escHtml(value || '')) + '</div>'
      + '</div>';
  }

  function renderChecklist() {
    if (typeof window.getDistributionEntries !== 'function') {
      root.innerHTML = '<div style="background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:18px;font-size:12px;color:var(--muted);line-height:1.7;">Distribution data is still loading. Try opening the page again in a moment.</div>';
      return;
    }

    var STORAGE_KEY = 'g3-distribution-checklist-v2';
    var entries = window.getDistributionEntries();
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (e) {
      saved = {};
    }

    var state = window._distributionChecklistState || { query: '', onlyUnchecked: false };
    window._distributionChecklistState = state;

    function norm(value) {
      return String(value || '').toLowerCase();
    }

    function currentGameKey() {
      return typeof GAME !== 'undefined' && GAME ? GAME : 'all';
    }

    function currentGameLabel() {
      var game = currentGameKey();
      return ({ all: 'All Games', FR: 'Gold', LG: 'Silver', R: 'Ruby', S: 'Sapphire', E: 'Crystal' }[game]) || game;
    }

    function gameMatches(entry) {
      var selectedGame = currentGameKey();
      if (!selectedGame || selectedGame === 'all') return true;
      return (entry.targets || []).some(function(target) {
        var t = norm(target);
        if (selectedGame === 'FR') return t.indexOf('firered') !== -1 || t === 'fr';
        if (selectedGame === 'LG') return t.indexOf('leafgreen') !== -1 || t === 'lg';
        if (selectedGame === 'R') return t.indexOf('ruby') !== -1 || t === 'r';
        if (selectedGame === 'S') return t.indexOf('sapphire') !== -1 || t === 's';
        if (selectedGame === 'E') return t.indexOf('emerald') !== -1 || t === 'e';
        return true;
      });
    }

    function entryKey(entry) {
      return entry.source + '::' + entry.language + '::' + entry.title;
    }

    function rewardList(entry) {
      return (entry.obtains || []).map(function(obtain, idx) {
        return {
          id: entryKey(entry) + '::' + idx,
          label: obtain
        };
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
      if (!rewards.length) return false;
      return rewards.every(function(reward) { return rewardChecked(entry, reward.id); });
    }

    function anyRewardChecked(entry) {
      return rewardList(entry).some(function(reward) { return rewardChecked(entry, reward.id); });
    }

    function matches(entry) {
      if (!gameMatches(entry)) return false;
      if (state.onlyUnchecked && allRewardsChecked(entry)) return false;
      if (!state.query) return true;
      var hay = [
        entry.title,
        entry.source,
        entry.language,
        entry.kind,
        (entry.obtains || []).join(' '),
        (entry.targets || []).join(' '),
        entry.details,
        entry.notes,
        (entry.mechanics || []).join(' ')
      ].join(' ').toLowerCase();
      return hay.indexOf(norm(state.query)) !== -1;
    }

    function groupOrder(entry) {
      if (entry.source === 'Project Wonder') return 0;
      if (entry.language === 'English') return 1;
      if (entry.language === 'Japanese') return 2;
      return 3;
    }

    var filtered = entries.filter(matches).sort(function(a, b) {
      var groupDiff = groupOrder(a) - groupOrder(b);
      if (groupDiff) return groupDiff;
      return a.title.localeCompare(b.title);
    });

    var visibleRewards = filtered.reduce(function(total, entry) { return total + rewardList(entry).length; }, 0);
    var visibleChecked = filtered.reduce(function(total, entry) {
      return total + rewardList(entry).filter(function(reward) { return rewardChecked(entry, reward.id); }).length;
    }, 0);
    var allForGame = entries.filter(gameMatches);
    var gameRewards = allForGame.reduce(function(total, entry) { return total + rewardList(entry).length; }, 0);
    var gameChecked = allForGame.reduce(function(total, entry) {
      return total + rewardList(entry).filter(function(reward) { return rewardChecked(entry, reward.id); }).length;
    }, 0);
    var searchFocused = document.activeElement && document.activeElement.id === 'distribution-checklist-search';
    var selStart = searchFocused ? document.activeElement.selectionStart : null;
    var selEnd = searchFocused ? document.activeElement.selectionEnd : null;

    root.innerHTML = ''
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:18px;">'
      + summaryBox('VISIBLE REWARDS', visibleRewards, 'var(--gold)')
      + summaryBox('CHECKED', visibleChecked, '#7fe39c')
      + summaryBox('REMAINING', Math.max(visibleRewards - visibleChecked, 0), '#ff9d6c')
      + summaryBox('TOTAL FOR GAME', gameRewards, '#64b4ff')
      + '</div>'
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">'
      + '<div style="position:relative;display:flex;align-items:center;flex:1;min-width:240px;">'
      + '<input id="distribution-checklist-search" type="text" placeholder="Search distributions, Pokémon, items, notes…" style="flex:1;padding:8px 12px;padding-right:28px;background:var(--card);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;outline:none;">'
      + '<button id="distribution-checklist-clear" class="search-bar-clear" title="Clear search" style="display:none;" type="button">✕</button>'
      + '</div>'
      + '<button id="distribution-checklist-unchecked" type="button" style="font-size:10px;padding:6px 10px;border:1px solid var(--border);border-radius:999px;cursor:pointer;background:' + (state.onlyUnchecked ? 'var(--gold)' : 'var(--card)') + ';color:' + (state.onlyUnchecked ? '#000' : 'var(--text)') + ';">Unchecked Only</button>'
      + '</div>'
      + '<div style="font-size:11px;color:var(--muted);margin-bottom:12px;">Tracking progress for <strong style="color:var(--text)">' + currentGameLabel() + '</strong>. Checked <strong style="color:var(--text)">' + gameChecked + '</strong> of <strong style="color:var(--text)">' + gameRewards + '</strong> obtainable rewards for this game selection.</div>'
      + '<div id="distribution-checklist-list" style="display:flex;flex-direction:column;gap:10px;"></div>';

    var list = document.getElementById('distribution-checklist-list');
    if (!filtered.length) {
      list.innerHTML = '<div style="background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:18px;font-size:12px;color:var(--muted);line-height:1.7;">No distribution entries match the current game and search filters.</div>';
    } else {
      list.innerHTML = filtered.map(function(entry) {
        var rewards = rewardList(entry);
        var checkedCount = rewards.filter(function(reward) { return rewardChecked(entry, reward.id); }).length;
        var fullyChecked = rewards.length > 0 && checkedCount === rewards.length;
        return '<div style="background:var(--panel);border:1px solid ' + (fullyChecked ? 'rgba(127,227,156,0.35)' : anyRewardChecked(entry) ? 'rgba(255,209,102,0.35)' : 'var(--border)') + ';border-radius:10px;padding:14px;">'
          + '<div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;margin-bottom:8px;">'
          + '<div style="min-width:0;">'
          + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">'
          + '<div style="font-size:13px;font-weight:700;color:' + (fullyChecked ? 'var(--muted)' : 'var(--text)') + ';">' + escHtml(entry.title) + '</div>'
          + pill(entry.source === 'Project Wonder' ? 'Patch-based' : 'Classic ROM', entry.source === 'Project Wonder' ? '#64b4ff' : '#ffd166', entry.source === 'Project Wonder' ? 'rgba(100,180,255,0.1)' : 'rgba(255,209,102,0.08)')
          + pill(entry.language, '#9ad27a', 'rgba(154,210,122,0.08)')
          + pill(entry.kind, '#c7a6ff', 'rgba(199,166,255,0.08)')
          + '</div>'
          + '<div style="font-size:11px;color:var(--muted);line-height:1.75;">' + escHtml(entry.details || '') + '</div>'
          + '</div>'
          + '<div style="font-size:11px;color:var(--muted);white-space:nowrap;">' + checkedCount + ' / ' + rewards.length + ' checked</div>'
          + '</div>'
          + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:10px;">'
          + miniBlock('TARGET GAMES', (entry.targets || []).join(', '))
          + ((entry.mechanics && entry.mechanics.length) ? miniBlock('TECHNICAL DETAILS', entry.mechanics.map(escHtml).join('<br>'), true) : '')
          + '</div>'
          + '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px;">'
          + '<div style="font-family:\'Press Start 2P\',monospace;font-size:6px;color:var(--gold);letter-spacing:1px;margin-bottom:10px;">CHECK OFF EACH OBTAINABLE</div>'
          + rewards.map(function(reward) {
            var checked = rewardChecked(entry, reward.id);
            return '<label style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;cursor:pointer;">'
              + '<input data-distribution-entry="' + escAttr(entryKey(entry)) + '" data-distribution-reward="' + escAttr(reward.id) + '" type="checkbox" ' + (checked ? 'checked' : '') + ' style="margin-top:2px;width:16px;height:16px;accent-color:var(--gold);flex:0 0 auto;">'
              + '<span style="font-size:11px;line-height:1.7;color:' + (checked ? 'var(--muted)' : 'var(--text)') + ';text-decoration:' + (checked ? 'line-through' : 'none') + ';">' + escHtml(reward.label) + '</span>'
              + '</label>';
          }).join('')
          + '</div>'
          + (entry.notes ? '<div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.7;"><strong style="color:var(--text)">Notes:</strong> ' + escHtml(entry.notes) + '</div>' : '')
          + '</div>';
      }).join('');
    }

    var search = document.getElementById('distribution-checklist-search');
    var clear = document.getElementById('distribution-checklist-clear');
    var unchecked = document.getElementById('distribution-checklist-unchecked');

    if (search) {
      search.value = state.query;
      search.oninput = function() {
        state.query = this.value || '';
        renderChecklist();
      };
      if (clear) {
        clear.style.display = state.query ? 'flex' : 'none';
        clear.onclick = function() {
          state.query = '';
          renderChecklist();
        };
      }
      if (searchFocused) {
        search.focus();
        if (selStart !== null && selEnd !== null) {
          try { search.setSelectionRange(selStart, selEnd); } catch (e) {}
        }
      }
    }

    if (unchecked) {
      unchecked.onclick = function() {
        state.onlyUnchecked = !state.onlyUnchecked;
        renderChecklist();
      };
    }

    Array.prototype.forEach.call(root.querySelectorAll('input[data-distribution-reward]'), function(box) {
      box.onchange = function() {
        var entryId = this.getAttribute('data-distribution-entry');
        var rewardId = this.getAttribute('data-distribution-reward');
        var entry = entries.find(function(candidate) { return entryKey(candidate) === entryId; });
        if (!entry) return;
        setRewardChecked(entry, rewardId, this.checked);
        renderChecklist();
      };
    });
  }

  if (typeof window.getDistributionEntries === 'function') {
    renderChecklist();
    return;
  }

  if (typeof window.loadPageScript === 'function') {
    window.loadPageScript('distributions').then(renderChecklist).catch(function() {
      root.innerHTML = '<div style="background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:18px;font-size:12px;color:var(--muted);line-height:1.7;">Could not load the distribution catalog data for the checklist.</div>';
    });
    return;
  }

  renderChecklist();
}
