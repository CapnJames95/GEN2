#!/usr/bin/env python3
"""Invert the PokéAPI per-Pokémon encounter data into a per-location
table for the Encounters page.

Reads /tmp/pokeapi_gen2_encounters.json (populated by scrape_pokeapi_locations.py)
plus the POKE list from pokedata.js. Writes a Gen-2 encounter table to
assets/data/encounters-gen2.js as:

  window.ENCOUNTERS_GEN2 = {
    "Johto Route 29": {
      "gold":   [{n:16,name:"Pidgey",method:"Wild",min:2,max:4,chance:100}, ...],
      "silver": [...],
      "crystal":[...]
    },
    ...
  };
"""
import json, os, re, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = '/tmp/pokeapi_gen2_encounters.json'
POKEDATA = os.path.join(ROOT, 'assets/data/pokedata.js')
OUT = os.path.join(ROOT, 'assets/data/encounters-gen2.js')

VER_TO_KEY = {'gold':'gold', 'silver':'silver', 'crystal':'crystal'}

METHOD_LABEL = {
    'walk':'Wild',
    'surf':'Surf',
    'old-rod':'Old Rod',
    'good-rod':'Good Rod',
    'super-rod':'Super Rod',
    'rock-smash':'Rock Smash',
    'headbutt':'Headbutt',
    'headbutt-low':'Headbutt',
    'headbutt-normal':'Headbutt',
    'headbutt-high':'Headbutt',
    'gift':'Gift',
    'gift-egg':'Egg',
    'only-one':'Static',
    'always':'Static',
    'fishing':'Fish',
    'pokeflute':'PokéFlute',
    'squirt-bottle':'SquirtBottle',
}

def prettify_location(s):
    s = s.replace('-area','')
    m = re.match(r'^route-(\d+)$', s)
    if m: return f'Route {m.group(1)}'
    parts = s.replace('-', ' ').split()
    out = []
    for p in parts:
        if re.match(r'^\d+f$', p) or p.upper() in ('B1F','B2F','B3F','B4F','B5F'):
            out.append(p.upper())
        else:
            out.append(p.capitalize())
    res = ' '.join(out)
    res = res.replace('Mt ','Mt. ')
    res = res.replace('Pokemon','Pokémon')
    res = res.replace('Bell Tower','Tin Tower')
    return res

def main():
    if not os.path.exists(CACHE):
        sys.exit(f'no cache at {CACHE} — run scrape_pokeapi_locations.py first')
    with open(CACHE) as f:
        cache = json.load(f)
    with open(POKEDATA) as f:
        src = f.read()
    m = re.search(r'window\.POKE\s*=\s*(\[.*\])\s*;?\s*$', src, re.DOTALL)
    poke_list = json.loads(m.group(1))
    name_of = {p['num']: p['name'] for p in poke_list}

    # locations[name][game] -> list of dicts
    locations = defaultdict(lambda: {'gold':[], 'silver':[], 'crystal':[]})

    for num_str, areas in cache.items():
        num = int(num_str)
        if num > 251 or num not in name_of:
            continue
        name = name_of[num]
        for area in areas:
            loc_slug = area.get('location_area', {}).get('name', '')
            pretty = prettify_location(loc_slug)
            for v in area.get('version_details', []):
                game = v.get('version', {}).get('name')
                if game not in VER_TO_KEY:
                    continue
                # collapse encounter_details by (method, time-of-day)
                by_key = {}
                for ed in v.get('encounter_details', []):
                    mlabel = METHOD_LABEL.get(ed.get('method', {}).get('name','walk'), 'Wild')
                    # Extract time-of-day from condition_values if present.
                    tod = 'any'
                    swarm = False
                    extra_notes = []
                    for cv in ed.get('condition_values', []):
                        cn = cv.get('name', '')
                        if cn == 'time-morning': tod = 'morning'
                        elif cn == 'time-day': tod = 'day'
                        elif cn == 'time-night': tod = 'night'
                        elif cn == 'swarm-yes': swarm = True
                        elif cn == 'weekday-friday': extra_notes.append('Fri only')
                        elif cn.startswith('item-'): extra_notes.append('needs ' + cn[5:].replace('-',' ').title())
                    key = (mlabel, tod, swarm)
                    info = by_key.setdefault(key, {'min':99,'max':0,'chance':0,'notes':set()})
                    info['min'] = min(info['min'], ed.get('min_level', 0))
                    info['max'] = max(info['max'], ed.get('max_level', 0))
                    info['chance'] += ed.get('chance', 0)
                    for en in extra_notes: info['notes'].add(en)
                for (method, tod, swarm), info in by_key.items():
                    locations[pretty][game].append({
                        'n': num, 'name': name, 'method': method,
                        'time': tod,
                        'swarm': swarm,
                        'min': info['min'], 'max': info['max'],
                        'chance': min(100, info['chance']),
                        'notes': ' · '.join(sorted(info['notes'])) if info['notes'] else ''
                    })

    # Sort each game-list by method preference then by chance descending
    METHOD_ORDER = {'Wild':0,'Surf':1,'Old Rod':2,'Good Rod':3,'Super Rod':4,'Rock Smash':5,'Headbutt':6,'Gift':7,'Static':8,'Egg':9,'PokéFlute':10,'SquirtBottle':11}
    for loc, by_game in locations.items():
        for game in by_game:
            by_game[game].sort(key=lambda e: (METHOD_ORDER.get(e['method'], 99), -e['chance'], e['n']))

    # Sort locations alphabetically with a sensible top-down ordering
    out_obj = dict(sorted(locations.items()))

    # Write file
    js = 'window.ENCOUNTERS_GEN2 = ' + json.dumps(out_obj, ensure_ascii=False) + ';\n'
    with open(OUT, 'w') as f:
        f.write(js)
    total_entries = sum(len(g) for byg in out_obj.values() for g in byg.values())
    print(f'Wrote {len(out_obj)} locations / {total_entries} encounter rows to {OUT}')

if __name__ == '__main__':
    main()
