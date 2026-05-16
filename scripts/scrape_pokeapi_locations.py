#!/usr/bin/env python3
"""Pull detailed Gen-2 catch locations from PokéAPI and write them into
assets/data/pokedata.js, replacing the current short placeholder strings.

Output format mirrors the GEN3/GEN4 pokedata format:
    Wild (Route 30, Level 2 - 4) - 35%
    Surf (Route 35, Level 10 - 15) - 20%
    Headbutt (Route 38, Level 10) - 50%

One line per encounter, joined with \n. Per game slot:
    FR = Gold, LG = Silver, E = Crystal.

For Pokémon with NO wild encounters in a game (starters, trade evolutions,
event Pokémon, etc.) we keep the curated evolution/event string already in
the data — they're not in PokéAPI's encounters list.

Run: python3 scripts/scrape_pokeapi_locations.py
"""
import json, os, re, sys, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POKEDATA = os.path.join(ROOT, 'assets/data/pokedata.js')
CACHE = '/tmp/pokeapi_gen2_encounters.json'

# PokéAPI version names for Gen 2 (FR slot → Gold, LG → Silver, E → Crystal)
VER_TO_SLOT = {'gold': 'FR', 'silver': 'LG', 'crystal': 'E'}

# Method labels — convert PokéAPI's slug to a short, human-readable tag
METHOD_LABEL = {
    'walk':              'Wild',
    'surf':              'Surf',
    'old-rod':           'Fish (Old Rod)',
    'good-rod':          'Fish (Good Rod)',
    'super-rod':         'Fish (Super Rod)',
    'rock-smash':        'Rock Smash',
    'headbutt':          'Headbutt',
    'headbutt-low':      'Headbutt',
    'headbutt-normal':   'Headbutt',
    'headbutt-high':     'Headbutt',
    'gift':              'Gift',
    'gift-egg':          'Egg',
    'only-one':          'Static',
    'always':            'Static',
    'fishing':           'Fish',
    'seaweed':           'Seaweed',
    'dark-grass':        'Dark Grass',
    'pokeflute':         'Static (PokéFlute)',
    'squirt-bottle':     'Static (SquirtBottle)',
    'wailmer-pail':      'Static',
    'devon-scope':       'Static',
}

# Friendly location names — convert PokéAPI location-area slugs to nice labels
def prettify_location(area_slug, location_slug):
    """Given e.g. ('route-30-area', 'route-30') return 'Route 30'.
    Falls back to title-casing the location slug."""
    s = location_slug or area_slug.replace('-area', '')
    s = s.replace('-area', '')
    # Common patterns
    m = re.match(r'^route-(\d+)$', s)
    if m: return f'Route {m.group(1)}'
    s = s.replace('-', ' ')
    # Title-case but keep small words lower
    parts = s.split()
    out = []
    for i, p in enumerate(parts):
        if p in ('s','b','f','b1f','b2f','b3f','b4f','b5f'):
            out.append(p.upper())
        elif p.isdigit() or re.match(r'^\d+f$', p):
            out.append(p.upper())
        elif i == 0 or p not in ('of','the','to','in','at'):
            out.append(p[:1].upper() + p[1:])
        else:
            out.append(p)
    res = ' '.join(out)
    # Special cases / corrections
    res = res.replace('Mt ', 'Mt. ')
    res = res.replace("Pokemon", 'Pokémon')
    res = res.replace("Bell Tower", 'Tin Tower')   # JP/EN name swap
    return res


def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'GEN2-eGuide/1.0 (catch-locations scraper)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode('utf-8'))


def load_cache():
    if os.path.exists(CACHE):
        try:
            with open(CACHE) as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cache(c):
    with open(CACHE, 'w') as f:
        json.dump(c, f)


def fetch_encounters(num, cache):
    key = str(num)
    if key in cache:
        return cache[key]
    url = f'https://pokeapi.co/api/v2/pokemon/{num}/encounters'
    try:
        data = fetch_json(url)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            data = []
        else:
            raise
    cache[key] = data
    return data


def format_levels(min_lv, max_lv):
    return f'Level {min_lv}' if min_lv == max_lv else f'Level {min_lv} - {max_lv}'


def collapse_encounters_for_game(encounters, game_slug):
    """Take the raw /encounters/ response, return a list of strings for the
    given game slug. Each string is `Method (Location, Level X) - YY%`."""
    rows = []
    for area in encounters:
        loc_name = area.get('location_area', {}).get('name', '')
        # Pretty location: prefer the parent location name when present
        # PokéAPI doesn't ship the parent in this endpoint, so just clean
        # the area slug.
        pretty = prettify_location(loc_name, loc_name)
        for v in area.get('version_details', []):
            if v.get('version', {}).get('name') != game_slug:
                continue
            # Group encounter_details by method and merge level ranges + chances
            by_method = {}
            for ed in v.get('encounter_details', []):
                m_slug = ed.get('method', {}).get('name', 'walk')
                label = METHOD_LABEL.get(m_slug, m_slug.replace('-', ' ').title())
                min_lv = ed.get('min_level')
                max_lv = ed.get('max_level')
                chance = ed.get('chance', 0)
                bucket = by_method.setdefault(label, {'min': min_lv, 'max': max_lv, 'chance': 0})
                bucket['min'] = min(bucket['min'], min_lv)
                bucket['max'] = max(bucket['max'], max_lv)
                bucket['chance'] += chance
            for label, info in by_method.items():
                lv = format_levels(info['min'], info['max'])
                ch = info['chance']
                # cap to 100% just in case of overlapping condition multi-counts
                ch = min(ch, 100)
                rows.append((ch, f'{label} ({pretty}, {lv}) - {ch}%'))
    # Sort highest-chance first so the most likely catch source is on top
    rows.sort(key=lambda r: -r[0])
    return [r[1] for r in rows]


def main():
    print('Loading pokedata.js …')
    with open(POKEDATA) as f:
        src = f.read()
    m = re.search(r'(window\.POKE\s*=\s*)(\[.*?\])(\s*;?\s*)$', src, re.DOTALL)
    if not m:
        sys.exit('could not parse pokedata.js')
    data = json.loads(m.group(2))
    cache = load_cache()
    print(f'{len(cache)} cached, fetching the rest …')

    updated = 0
    for i, p in enumerate(data):
        num = p['num']
        try:
            raw = fetch_encounters(num, cache)
        except Exception as e:
            print(f'  #{num} {p["name"]:14s} fetch failed: {e}')
            continue
        new_games = dict(p.get('games', {}))
        any_wild = False
        for ver_slug, slot in VER_TO_SLOT.items():
            rows = collapse_encounters_for_game(raw, ver_slug)
            if rows:
                any_wild = True
                new_games[slot] = '\n'.join(rows)
        if any_wild:
            p['games'] = new_games
            updated += 1
        # progress + courtesy delay (skip when fully cached)
        if str(num) not in cache or (i % 25 == 0):
            print(f'  #{num:3d} {p["name"]:14s} → {sum(1 for s in VER_TO_SLOT.values() if new_games.get(s) and "\\n" in new_games[s])} wild source(s)')
        if str(num) not in cache:
            save_cache(cache)
            time.sleep(0.05)

    save_cache(cache)

    # Write back
    new_blob = json.dumps(data, ensure_ascii=False)
    out = src[:m.start(2)] + new_blob + src[m.end(2):]
    with open(POKEDATA, 'w') as f:
        f.write(out)
    print(f'\nWrote {updated} Pokémon with wild encounter data to {POKEDATA}.')


if __name__ == '__main__':
    main()
