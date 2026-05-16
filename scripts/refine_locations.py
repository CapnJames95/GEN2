#!/usr/bin/env python3
"""Refine placeholder location strings in pokedata.js — replace vague
short labels with detailed, Gen-3/4-style specifics. Runs after
scrape_pokeapi_locations.py.

Only touches entries that DON'T already have a "Level" or "Lv" PokéAPI-style
encounter line (those are already detailed). Replaces curated placeholders
with longer descriptions including location, method, and level.

FR = Gold, LG = Silver, E = Crystal.
"""
import json, re, sys, os

POKEDATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       'assets/data/pokedata.js')

# Map: short placeholder → detailed replacement (per game, or shared across all 3)
# Use {G} / {S} / {C} placeholders if needed. None means "leave alone".
REFINE = {
  # ── Kanto starters (in Crystal you can pick one from Prof. Oak after E4
  #     at his Pallet Town lab. In Gold/Silver they're not obtainable in-game
  #     — you can only trade them in or transfer from Gen 1 Time Capsule.)
  'Prof. Oak gift (Kanto)': 'Special (Prof. Oak gift, Pallet Town Lab, Lv5) — post-E4. In Gold/Silver: trade from Crystal or import via Time Capsule from R/B/Y.',
  # ── Vulpix in Crystal lives on a specific pair of routes
  'Route 7 / 8 (Kanto)': 'Wild (Kanto Route 7, Level 15-18) - 65%\nWild (Kanto Route 8, Level 15-18) - 35%',
  # ── Bug Catching Contest entries
  'Bug Catching Contest': 'Special (National Park Bug Catching Contest, Lv7-18) — Tue/Thu/Sat only. Catch with the single Park Ball you\'re given.',
  'Bug Catching Contest / Rt 2': 'Special (National Park Bug Catching Contest, Lv7-18) — Tue/Thu/Sat only.\nWild (Kanto Route 2, Level 10-15) - 5%',
  # ── Static legendaries — add levels
  'Seafoam Islands (static)': 'Static (Seafoam Islands B4F, Level 50) - 100% — one-time wild encounter.',
  'Power Plant (static)':     'Static (Kanto Power Plant, Level 50) - 100% — one-time, after Team Rocket\'s Mahogany arc.',
  'Mt. Silver (static)':      'Static (Mt. Silver cave, Level 50) - 100% — one-time, post-E4 only.',
  # ── Fossil revives
  'Revive Helix Fossil (Pewter)': 'Special (Pewter Museum revival, Lv5) — give the Helix Fossil to the scientist. The Helix Fossil is found in Union Cave (Smash a rock on B2F).',
  'Revive Dome Fossil (Pewter)':  'Special (Pewter Museum revival, Lv5) — give the Dome Fossil to the scientist. The Dome Fossil is found in Union Cave (Smash a rock on B2F).',
  # ── Aerodactyl
  'Revive Old Amber (Pewter)':    'Special (Pewter Museum revival, Lv5) — give the Old Amber to the scientist. The Old Amber is a gift from the scientist in the Museum after delivering Mr. Pokémon\'s package.',
  # ── Friendship evos
  'Friendship-evolve Golbat':    'Evolve Golbat (Friendship ≥220 + Level Up)',
  'Friendship-evolve Togepi':    'Evolve Togepi (Friendship ≥220 + Level Up)',
  'Friendship-evolve Chansey':   'Evolve Chansey (Friendship ≥220 + Level Up) — only in Crystal; in Gold/Silver you must trade a Blissey in.',
  # ── Events
  'Event / Trade only':          'Event-only — distributed at Nintendo events (Mew Mall Tour, Toys R Us). Otherwise trade from Gen 1 (R/B/Y) via Time Capsule.',
  'Event distribution only':     'Event-only — distributed via the GS Ball event (Pokémon Center NY 2001 / JP Pokémon Mobile). Give GS Ball to Kurt, then place on the Ilex Forest shrine.',
  # ── Trade evos — be more explicit
  'Trade Kadabra':               'Evolve Kadabra (any link-cable trade, no held item)',
  'Trade Machoke':               'Evolve Machoke (any link-cable trade, no held item)',
  'Trade Graveler':              'Evolve Graveler (any link-cable trade, no held item)',
  'Trade Haunter':               'Evolve Haunter (any link-cable trade, no held item)',
  # ── Slowking / Politoed / Kingdra / Steelix / Scizor / Porygon2
  "Trade Slowpoke w/ King's Rock": 'Evolve Slowpoke (link-cable trade holding King\'s Rock). Wild Slowpoke/Slowbro carry King\'s Rock at ~5%.',
  "Trade Poliwhirl w/ King's Rock":'Evolve Poliwhirl (link-cable trade holding King\'s Rock). King\'s Rock from wild Slowpoke (~5%) or held-item farm.',
  'Trade Seadra w/ Dragon Scale':  'Evolve Seadra (link-cable trade holding Dragon Scale). Wild Horsea/Seadra carry a Dragon Scale at ~5%.',
  'Trade Onix w/ Metal Coat':      'Evolve Onix (link-cable trade holding Metal Coat). Metal Coat from wild Magnemite/Magneton (~25%) or one-off from the S.S. Aqua sailor.',
  'Trade Scyther w/ Metal Coat':   'Evolve Scyther (link-cable trade holding Metal Coat). Metal Coat from wild Magnemite/Magneton (~25%).',
  'Trade Porygon w/ Up-Grade':     'Evolve Porygon (link-cable trade holding Up-Grade). Up-Grade is a one-time gift from a scientist in Goldenrod after the Mahogany Rocket arc.',
  # ── Static encounters with no level info
  'Route 36 (Squirtbottle)':       'Static (Route 36 Sudowoodo, Level 20) - 100% — use the SquirtBottle on the blocking tree.',
  'Route 11 (Kanto) — Pokéflute':  'Static (Kanto Route 11 Snorlax, Level 50) - 100% — wake with the Pokéflute station on the Lavender Radio Tower.',
  'Cianwood / Berry man gift':     'Special (Cianwood Berry man gift, Lv15) — keep talking to the man on Cianwood Beach to keep the Shuckle. Comes holding a Berry.',
  'Union Cave B2F (Fridays only)': 'Static (Union Cave B2F, Level 20) - 100% — only on Fridays. Despawns and respawns next Friday after caught/KO\'d.',
  'Mt. Mortar (Karate King choice)':'Special (Mt. Mortar 2F Karate King gift, Lv10) — beat the Karate King, then choose either his Hitmonlee or Hitmonchan as your reward (Tyrogue is gifted separately).',
  # ── NPC trades
  'NPC trade in Goldenrod (Spearow→)':'Special (Goldenrod City NPC trade, Lv5+) — trade a Spearow; the Farfetch\'d holds nothing in particular.',
  'NPC trade in Blackthorn':       'Special (Blackthorn City NPC trade, Lv5+) — trade a Dragonair; the Lickitung is OT "Tim".',
  'NPC trade in Pkmn Center (Poliw→)':'Special (Pokémon Center NPC trade — most likely Saffron, Lv5+) — trade a Poliwhirl for a Jynx, OT "Luvey".',
  'NPC trade in Route 2 (Abra→)':  'Special (Kanto Route 2 house NPC trade, Lv5+) — trade an Abra. The Mr. Mime is OT "Mitch".',
  # ── Tower trio
  'Tin Tower (Gold/Crystal, Rainbow Wing)':
      'Static (Tin Tower roof, Level 40 in Gold/Crystal, 70 in Silver) - 100% — requires Rainbow Wing (Pewter Museum Elder, Gold/Crystal only; trade from Crystal in Silver).',
  'Whirl Islands (Silver/Crystal)':
      'Static (Whirl Islands B5F, Level 40 in Silver/Crystal, 70 in Gold) - 100% — requires Silver Wing (Pewter Museum Elder, Silver/Crystal only; trade from Crystal in Gold).',
  'Whirl Islands B5F (Silver Wing)':
      'Static (Whirl Islands B5F, Level 40) - 100% — requires Silver Wing.',
  'Whirl Islands (post-event)':
      'Static (Whirl Islands B5F, Level 40) - 100% — requires Silver Wing (gift from Pewter Museum Elder, Crystal only).',
  'Tin Tower (post-event)':
      'Static (Tin Tower roof, Level 60) - 100% — requires Rainbow Wing (gift from Pewter Museum Elder, Crystal only).',
  # ── Roaming beasts
  'Roaming Johto (after Brass Tower)':
      'Roaming (any Johto/Kanto grass route, Level 40) - encounter triggered after disturbing the three legendary statues at the Brass Tower in Ecruteak.',
  # ── Eevee / Bill gifts
  'Bill\'s gift (Goldenrod)':
      'Special (Goldenrod Pokémon Center, Bill\'s grandfather, Lv5) — gift one-time after meeting Bill in Ecruteak.',
  # ── Stones (already short but OK — add minor detail)
  'Thunderstone on Pikachu':       'Use a Thunder Stone on Pikachu. Stones sold at the Goldenrod Department Store rooftop.',
  'Fire Stone on Vulpix':          'Use a Fire Stone on Vulpix. Stones sold at the Goldenrod Department Store rooftop.',
  'Fire Stone on Growlithe':       'Use a Fire Stone on Growlithe. Stones sold at the Goldenrod Department Store rooftop.',
  'Water Stone on Poliwhirl':      'Use a Water Stone on Poliwhirl. Stones sold at the Goldenrod Department Store rooftop.',
  'Water Stone on Shellder':       'Use a Water Stone on Shellder. Stones sold at the Goldenrod Department Store rooftop.',
  'Water Stone on Staryu':         'Use a Water Stone on Staryu. Stones sold at the Goldenrod Department Store rooftop.',
  'Water Stone on Eevee':          'Use a Water Stone on Eevee (gift from Bill\'s grandfather, Goldenrod PC). Stones sold at the Goldenrod Dept Store rooftop.',
  'Thunderstone on Eevee':         'Use a Thunder Stone on Eevee (gift from Bill\'s grandfather, Goldenrod PC). Stones sold at the Goldenrod Dept Store rooftop.',
  'Fire Stone on Eevee':           'Use a Fire Stone on Eevee (gift from Bill\'s grandfather, Goldenrod PC). Stones sold at the Goldenrod Dept Store rooftop.',
  'Moon Stone on Nidorina':        'Use a Moon Stone on Nidorina. Moon Stones from Mt. Moon hidden items or as a held item on wild Clefairy (~5%).',
  'Moon Stone on Nidorino':        'Use a Moon Stone on Nidorino. Moon Stones from Mt. Moon or wild Clefairy held items.',
  'Moon Stone on Clefairy':        'Use a Moon Stone on Clefairy. Moon Stones from Mt. Moon or wild Clefairy held items.',
  'Moon Stone on Jigglypuff':      'Use a Moon Stone on Jigglypuff. Moon Stones from Mt. Moon or wild Clefairy held items.',
  'Leaf Stone on Gloom':           'Use a Leaf Stone on Gloom. Sold at Celadon Dept Store rooftop in Kanto.',
  'Leaf Stone on Weepinbell':      'Use a Leaf Stone on Weepinbell. Sold at Celadon Dept Store rooftop.',
  'Leaf Stone on Exeggcute':       'Use a Leaf Stone on Exeggcute. Sold at Celadon Dept Store rooftop.',
  'Sun Stone on Gloom':            'Use a Sun Stone on Gloom. Sun Stones are very rare — held by wild Sunkern (~5%) or hidden item at Cliff Cave.',
  'Sun Stone on Sunkern':          'Use a Sun Stone on Sunkern. Sun Stones held by wild Sunkern (~5%) or hidden at Cliff Cave.',
  # ── Crystal/Tin
  'Crystal: encounter in Tin Tower':'Static (Tin Tower 1F encounter post-Brass-Tower in Crystal, Level 40) - 100%.',
  'Static — multiple Crystal events':'Static (multiple Crystal-only set events — Tin Tower 1F, Cianwood Lighthouse, Routes 36/42 ambushes, Level 40) - 100%.',
}

def main():
    with open(POKEDATA) as f:
        s = f.read()
    m = re.search(r'(window\.POKE\s*=\s*)(\[.*?\])(\s*;?\s*)$', s, re.DOTALL)
    data = json.loads(m.group(2))
    changes = 0
    for p in data:
        for slot in ('FR','LG','E'):
            v = p['games'].get(slot, '')
            if not v:
                continue
            # If the string already contains a real encounter line ("Level"
            # or "Lv") AND is multi-line, leave it.
            if '\nLevel' in v or 'Level ' in v:
                # but the first line itself might still be a vague placeholder
                # — only refine if it's wholly the placeholder
                pass
            stripped = v.strip()
            if stripped in REFINE:
                new = REFINE[stripped]
                if new and new != v:
                    p['games'][slot] = new
                    changes += 1
    # Strip the leftover "NPC Trade (Kanto Power Plant…)" noise from PokéAPI
    # for Pokémon that aren't actually obtainable that way (evolution-only mons).
    npctrade_re = re.compile(r'^Npc Trade .*\n?', re.MULTILINE)
    for p in data:
        for slot in ('FR','LG','E'):
            v = p['games'].get(slot, '')
            if 'Npc Trade' in v:
                cleaned = npctrade_re.sub('', v).strip()
                if cleaned and cleaned != v:
                    p['games'][slot] = cleaned
                    changes += 1
                elif not cleaned:
                    # Was only NPC trade noise — clear so the species shows
                    # the curated evolution/event string instead (kept elsewhere)
                    p['games'][slot] = ''
                    changes += 1

    new_blob = json.dumps(data, ensure_ascii=False)
    out = s[:m.start(2)] + new_blob + s[m.end(2):]
    with open(POKEDATA, 'w') as f:
        f.write(out)
    print(f'Refined {changes} placeholder entries.')

if __name__ == '__main__':
    main()
