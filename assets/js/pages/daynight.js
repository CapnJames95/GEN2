// Day / Night cycle — Gen 2 (Gold, Silver, Crystal)
//
// Pokémon Gold introduced a real-time clock — the in-game world reflects
// the actual time on the Game Boy Color's internal clock. Many features
// depend on the time of day, making this one of the defining Gen 2
// mechanics.

function buildDayNightPage() {
  var el = document.getElementById('daynight-content') || document.getElementById('page-daynight');
  if (!el) return;

  var TIME_WINDOWS = [
    {label:'Morning', time:'04:00 – 09:59', icon:'🌅', sky:'#FFE082',
     notes:[
       'Pidgey / Hoothoot evening swap (Hoothoot stops at 04:00)',
       'Sunkern available on Routes 36/37 in morning slot',
       'Bug Pokémon (Caterpie, Weedle) more common in National Park morning',
       'Magikarp slightly more common in morning fishing slots',
     ]},
    {label:'Day', time:'10:00 – 17:59', icon:'☀️', sky:'#64B4FF',
     notes:[
       'Most Pokémon use the "Day" encounter slot — the default',
       'Daytime swarms and rare Pokémon on phone trainer alerts',
       'Some NPCs only appear during the day (Goldenrod Bike Path)',
       'Mom\'s allowance + savings — checked during day visits',
     ]},
    {label:'Night', time:'18:00 – 03:59', icon:'🌙', sky:'#5C6BC0',
     notes:[
       'Hoothoot / Noctowl replace daytime birds on most routes',
       'Ghost Pokémon (Gastly, Misdreavus) only appear at night',
       'Wooper / Quagsire more common at night',
       'Some Pokémon only evolve at night (Chansey → ... wait — Chansey evolves by happiness regardless of time)',
       'Eevee can evolve into Umbreon at night (high happiness)',
       'Houndour spawns in Route 37 night slot only',
     ]},
  ];

  var TIME_DEPENDENT_EVOLUTIONS = [
    {pre:'Eevee', post:'Espeon',  cond:'Level up during the day with high happiness (≥220)'},
    {pre:'Eevee', post:'Umbreon', cond:'Level up at night with high happiness (≥220)'},
  ];

  var TIME_DEPENDENT_EVENTS = [
    {when:'Mon morning', event:'Apricorn tree behind Cherrygrove (Pink) refreshes daily'},
    {when:'Tue / Thu / Sat (day)', event:'Bug-Catching Contest at National Park'},
    {when:'Sunday (any time)', event:'Slowpoke at Slowpoke Well respond — they\'re always asleep otherwise'},
    {when:'Daily', event:'Mom\'s savings deposit (visit her after every Gym to bank money)'},
    {when:'Daily', event:'Apricorn trees regrow (1–2 day cycle)'},
    {when:'Daily', event:'Berry trees regrow (1–2 day cycle)'},
    {when:'Daily', event:'Phone trainers may call for rematches at fixed days/times'},
    {when:'Friday', event:'Lapras appears in Union Cave B2F (Gold/Silver/Crystal)'},
    {when:'Weekdays', event:'Goldenrod Department Store roof gift (different each day of the week)'},
  ];

  el.innerHTML =
    '<div style="max-width:1000px;margin:0 auto;">' +
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:9px;color:var(--game-color,var(--gold));margin-bottom:6px;letter-spacing:1px;">DAY / NIGHT — GEN 2</div>' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;line-height:1.7;">' +
      'Gen 2 introduced a <strong style="color:var(--text);">real-time clock</strong> that reflects the actual time on your Game Boy Color. Many encounters, evolutions, and weekly events depend on this.' +
    '</div>' +

    // Time windows
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-bottom:24px;">' +
    TIME_WINDOWS.map(function(w){
      return '<div class="panel" style="padding:16px;border-left:4px solid '+w.sky+';">' +
        '<div style="font-size:20px;margin-bottom:4px;">'+w.icon+' <strong style="color:var(--text);">'+w.label+'</strong></div>' +
        '<div style="font-size:11px;color:var(--muted);margin-bottom:10px;">'+w.time+'</div>' +
        '<ul style="font-size:11px;color:var(--muted);line-height:1.7;margin-left:16px;">' +
          w.notes.map(function(n){return '<li>'+n+'</li>';}).join('') +
        '</ul>' +
      '</div>';
    }).join('') +
    '</div>' +

    // Time-dependent evolutions
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin-bottom:8px;">TIME-DEPENDENT EVOLUTIONS</div>' +
    '<div class="panel" style="padding:0;overflow:hidden;margin-bottom:20px;">' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<thead style="background:var(--card);"><tr>' +
          '<th style="padding:8px;text-align:left;font-size:10px;color:var(--muted);">From</th>' +
          '<th style="padding:8px;text-align:left;font-size:10px;color:var(--muted);">Into</th>' +
          '<th style="padding:8px;text-align:left;font-size:10px;color:var(--muted);">Condition</th>' +
        '</tr></thead><tbody>' +
        TIME_DEPENDENT_EVOLUTIONS.map(function(e){
          return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:8px;font-weight:700;color:var(--text);">'+e.pre+'</td>' +
            '<td style="padding:8px;font-weight:700;color:var(--game-color,var(--gold));">'+e.post+'</td>' +
            '<td style="padding:8px;font-size:11px;color:var(--muted);">'+e.cond+'</td>' +
            '</tr>';
        }).join('') +
      '</tbody></table>' +
    '</div>' +

    // Weekly / daily events
    '<div style="font-family:\'Press Start 2P\',monospace;font-size:8px;color:var(--game-color,var(--gold));margin-bottom:8px;">WEEKLY & DAILY EVENTS</div>' +
    '<div class="panel" style="padding:0;overflow:hidden;">' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<thead style="background:var(--card);"><tr>' +
          '<th style="padding:8px;text-align:left;font-size:10px;color:var(--muted);">When</th>' +
          '<th style="padding:8px;text-align:left;font-size:10px;color:var(--muted);">Event</th>' +
        '</tr></thead><tbody>' +
        TIME_DEPENDENT_EVENTS.map(function(e){
          return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:8px;font-weight:700;color:var(--text);">'+e.when+'</td>' +
            '<td style="padding:8px;font-size:11px;color:var(--muted);line-height:1.5;">'+e.event+'</td>' +
            '</tr>';
        }).join('') +
      '</tbody></table>' +
    '</div>' +

    '<div style="font-size:11px;color:var(--muted);margin-top:18px;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:6px;line-height:1.7;">' +
      '<strong style="color:var(--text);">Tip:</strong> If you\'re playing on real hardware and the clock battery is dead, time-of-day mechanics break. On Crystal you can reset the time in Goldenrod via a man in the trade-center building. On emulators, just set your system clock.' +
    '</div>' +

    '</div>';
}
