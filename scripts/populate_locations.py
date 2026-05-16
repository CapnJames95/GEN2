#!/usr/bin/env python3
"""Populate per-game catch locations for all 251 Gen-2 Pokémon.

Game slots map to:  FR=Gold, LG=Silver, E=Crystal.

For each Pokémon we write a primary catch-location string per game. Strings are
intentionally short ("Route 35 (Day)", "Evolve Pichu", "Headbutt trees") so they
fit in the dex grid without wrapping. When a Pokémon is unavailable in the wild
in a game, we provide the canonical alternative (evolve/trade/breed/event).

Sources used while compiling: Bulbapedia Gen-2 location pages, the canonical
GS/Crystal version-exclusive lists, the Time Capsule rules (only Gen-1 mons can
be traded back, and only after the Pokédex is full), and the Crystal-specific
additions (Suicune events, etc.).
"""
import json, re, sys

POKEDATA = 'assets/data/pokedata.js'

# Per Pokémon: (gold, silver, crystal). Use '' to mean "same as gold".
# (Most Gen-1 mons have identical availability across all 3 — short-form list
# below uses '' to inherit gold for silver/crystal where appropriate.)
LOC = {
  # ── Kanto starters (only via Prof. Oak after E4 in Kanto, or Time Capsule trade)
  1:   ('Prof. Oak gift (Kanto)',           '', ''),
  2:   ('Evolve Bulbasaur (Lv16)',          '', ''),
  3:   ('Evolve Ivysaur (Lv32)',            '', ''),
  4:   ('Prof. Oak gift (Kanto)',           '', ''),
  5:   ('Evolve Charmander (Lv16)',         '', ''),
  6:   ('Evolve Charmeleon (Lv36)',         '', ''),
  7:   ('Prof. Oak gift (Kanto)',           '', ''),
  8:   ('Evolve Squirtle (Lv16)',           '', ''),
  9:   ('Evolve Wartortle (Lv36)',          '', ''),

  # ── Common bug/early-route
  10:  ('Route 2 / Viridian Forest',        '', ''),
  11:  ('Evolve Caterpie (Lv7)',            '', ''),
  12:  ('Evolve Metapod (Lv10)',            '', ''),
  13:  ('Route 2 / Viridian Forest',        '', ''),
  14:  ('Evolve Weedle (Lv7)',              '', ''),
  15:  ('Evolve Kakuna (Lv10)',             '', ''),

  # ── Common Johto early
  16:  ('Routes 29–37 / Kanto',             '', ''),
  17:  ('Evolve Pidgey (Lv18)',             '', ''),
  18:  ('Evolve Pidgeotto (Lv36)',          '', ''),
  19:  ('Routes 29–38 / Kanto routes',      '', ''),
  20:  ('Evolve Rattata (Lv20)',            '', ''),
  21:  ('Routes 29–38 / Kanto',             '', ''),
  22:  ('Evolve Spearow (Lv20)',            '', ''),
  23:  ('Routes 31/32 / Dark Cave',         '', ''),
  24:  ('Evolve Ekans (Lv22)',              '', ''),

  # ── Pikachu line
  25:  ('Route 2 / Power Plant / Headbutt', '', ''),
  26:  ('Thunderstone on Pikachu',          '', ''),

  # ── Sandshrew (Silver/Crystal common, Gold rare)
  27:  ('Route 3 / Rock Tunnel (Kanto)',    '', ''),
  28:  ('Evolve Sandshrew (Lv22)',          '', ''),

  # ── Nidorans
  29:  ('Routes 35/36 / Kanto',             '', ''),
  30:  ('Evolve Nidoran♀ (Lv16)',           '', ''),
  31:  ('Moon Stone on Nidorina',           '', ''),
  32:  ('Routes 35/36 / Kanto',             '', ''),
  33:  ('Evolve Nidoran♂ (Lv16)',           '', ''),
  34:  ('Moon Stone on Nidorino',           '', ''),

  # ── Clefairy line
  35:  ('Mt. Moon (Kanto)',                 '', ''),
  36:  ('Moon Stone on Clefairy',           '', ''),

  # ── Vulpix (Silver/Crystal exclusive)
  37:  ('Trade from Silver/Crystal',
        'Route 7 / 8 (Kanto)',
        'Route 7 / 8 (Kanto)'),
  38:  ('Fire Stone on Vulpix',             '', ''),

  # ── Jigglypuff
  39:  ('Route 3 / 46 (Kanto)',             '', ''),
  40:  ('Moon Stone on Jigglypuff',         '', ''),

  # ── Zubat line
  41:  ('Cave encounters (most caves)',     '', ''),
  42:  ('Evolve Zubat (Lv22)',              '', ''),

  # ── Oddish (silver-side common)
  43:  ('Routes 5/24/25 (Kanto) / Headbutt','', ''),
  44:  ('Evolve Oddish (Lv21)',             '', ''),
  45:  ('Leaf Stone on Gloom',              '', ''),

  # ── Paras
  46:  ('Mt. Moon / Headbutt',              '', ''),
  47:  ('Evolve Paras (Lv24)',              '', ''),

  # ── Venonat
  48:  ('Headbutt trees / Route 24',        '', ''),
  49:  ('Evolve Venonat (Lv31)',            '', ''),

  # ── Diglett line (Kanto post-E4)
  50:  ('Diglett\'s Cave (Kanto)',          '', ''),
  51:  ('Evolve Diglett (Lv26)',            '', ''),

  # ── Meowth (Silver/Crystal exclusive)
  52:  ('Trade from Silver/Crystal',
        'Route 5 / 6 / 7 (night)',
        'Route 5 / 6 / 7 (night)'),
  53:  ('Evolve Meowth (Lv28)',             '', ''),

  # ── Psyduck
  54:  ('Surf — Routes 6/35 / Ilex Forest', '', ''),
  55:  ('Evolve Psyduck (Lv33)',            '', ''),

  # ── Mankey (Gold exclusive)
  56:  ('Route 42 / Mt. Mortar',
        'Trade from Gold/Crystal',
        'Route 42 / Mt. Mortar'),
  57:  ('Evolve Mankey (Lv28)',             '', ''),

  # ── Growlithe (Gold exclusive)
  58:  ('Routes 36/37 / Burned Tower',
        'Trade from Gold/Crystal',
        'Routes 36/37 / Burned Tower'),
  59:  ('Fire Stone on Growlithe',          '', ''),

  # ── Poliwag
  60:  ('Surf — many routes',               '', ''),
  61:  ('Evolve Poliwag (Lv25)',            '', ''),
  62:  ('Water Stone on Poliwhirl',         '', ''),

  # ── Abra
  63:  ('Routes 5/24/25/34 (rare)',         '', ''),
  64:  ('Evolve Abra (Lv16)',               '', ''),
  65:  ('Trade Kadabra',                    '', ''),

  # ── Machop (Headbutt + Rock Tunnel)
  66:  ('Mt. Mortar / Rock Tunnel',         '', ''),
  67:  ('Evolve Machop (Lv28)',             '', ''),
  68:  ('Trade Machoke',                    '', ''),

  # ── Bellsprout
  69:  ('Routes 24/25/31 (Headbutt)',       '', ''),
  70:  ('Evolve Bellsprout (Lv21)',         '', ''),
  71:  ('Leaf Stone on Weepinbell',         '', ''),

  # ── Tentacool
  72:  ('Surf — coastal routes',            '', ''),
  73:  ('Evolve Tentacool (Lv30)',          '', ''),

  # ── Geodude line
  74:  ('Most caves / Rock Smash',          '', ''),
  75:  ('Evolve Geodude (Lv25)',            '', ''),
  76:  ('Trade Graveler',                   '', ''),

  # ── Ponyta
  77:  ('Route 26 / Mt. Silver',            '', ''),
  78:  ('Evolve Ponyta (Lv40)',             '', ''),

  # ── Slowpoke
  79:  ('Slowpoke Well / Surf Route 32',    '', ''),
  80:  ('Evolve Slowpoke (Lv37)',           '', ''),

  # ── Magnemite
  81:  ('Route 38 / Power Plant',           '', ''),
  82:  ('Evolve Magnemite (Lv30)',          '', ''),

  # ── Farfetch'd (NPC trade only)
  83:  ('Trade in Goldenrod (Spearow→)',    '', ''),

  # ── Doduo
  84:  ('Routes 26/27',                     '', ''),
  85:  ('Evolve Doduo (Lv31)',              '', ''),

  # ── Seel
  86:  ('Whirl Islands (Surf)',             '', ''),
  87:  ('Evolve Seel (Lv34)',               '', ''),

  # ── Grimer (Silver/Crystal exclusive in Gen 2; in Power Plant)
  88:  ('Trade from Silver/Crystal',
        'Power Plant (Kanto)',
        'Power Plant (Kanto)'),
  89:  ('Evolve Grimer (Lv38)',             '', ''),

  # ── Shellder
  90:  ('Surf — Route 19 / Whirl Islands',  '', ''),
  91:  ('Water Stone on Shellder',          '', ''),

  # ── Gastly line
  92:  ('Sprout Tower (night) / Pkmn Tower','', ''),
  93:  ('Evolve Gastly (Lv25)',             '', ''),
  94:  ('Trade Haunter',                    '', ''),

  # ── Onix
  95:  ('Union Cave / Dark Cave',           '', ''),

  # ── Drowzee
  96:  ('Route 11 (Kanto)',                 '', ''),
  97:  ('Evolve Drowzee (Lv26)',            '', ''),

  # ── Krabby
  98:  ('Surf / Fish — Route 34',           '', ''),
  99:  ('Evolve Krabby (Lv28)',             '', ''),

  # ── Voltorb
  100: ('Route 10 / Power Plant',           '', ''),
  101: ('Evolve Voltorb (Lv30)',            '', ''),

  # ── Exeggcute
  102: ('Headbutt trees (rare)',            '', ''),
  103: ('Leaf Stone on Exeggcute',          '', ''),

  # ── Cubone
  104: ('Rock Tunnel (Kanto)',              '', ''),
  105: ('Evolve Cubone (Lv28)',             '', ''),

  # ── Hitmons (Karate King gift in Mt. Mortar)
  106: ('Mt. Mortar (Karate King choice)',  '', ''),
  107: ('Mt. Mortar (Karate King choice)',  '', ''),

  # ── Lickitung
  108: ('NPC trade in Blackthorn',          '', ''),

  # ── Koffing
  109: ('Burned Tower / Rocket HQ',         '', ''),
  110: ('Evolve Koffing (Lv35)',            '', ''),

  # ── Rhyhorn
  111: ('Victory Road / Mt. Silver',        '', ''),
  112: ('Evolve Rhyhorn (Lv42)',            '', ''),

  # ── Chansey
  113: ('Routes 13/14/15 (rare)',           '', ''),

  # ── Tangela
  114: ('Route 44',                         '', ''),

  # ── Kangaskhan
  115: ('Rock Tunnel / Safari (Kanto)',     '', ''),

  # ── Horsea
  116: ('Surf — Route 12/13 (Kanto)',       '', ''),
  117: ('Evolve Horsea (Lv32)',             '', ''),

  # ── Goldeen
  118: ('Fish — most water routes',         '', ''),
  119: ('Evolve Goldeen (Lv33)',            '', ''),

  # ── Staryu
  120: ('Fish — Routes 19/34',              '', ''),
  121: ('Water Stone on Staryu',            '', ''),

  # ── Mr. Mime (NPC trade)
  122: ('NPC trade in Route 2 (Abra→)',     '', ''),

  # ── Scyther
  123: ('Bug Catching Contest / Rt 2',      '', ''),

  # ── Jynx
  124: ('NPC trade in Pkmn Center (Poliw→)','', ''),

  # ── Electabuzz
  125: ('Power Plant (Kanto)',              '', ''),

  # ── Magmar
  126: ('Burned Tower / Mt. Silver',        '', ''),

  # ── Pinsir
  127: ('Bug Catching Contest',             '', ''),

  # ── Tauros
  128: ('Safari Zone? — Rock Tunnel area',  '', ''),

  # ── Magikarp
  129: ('Fish — almost any water',          '', ''),
  130: ('Evolve Magikarp (Lv20)',           '', ''),

  # ── Lapras
  131: ('Union Cave B2F (Fridays only)',    '', ''),

  # ── Ditto
  132: ('Route 35 / 47 (Kanto)',            '', ''),

  # ── Eevee + evolutions
  133: ('Bill\'s gift (Goldenrod)',         '', ''),
  134: ('Water Stone on Eevee',             '', ''),
  135: ('Thunderstone on Eevee',            '', ''),
  136: ('Fire Stone on Eevee',              '', ''),

  # ── Porygon
  137: ('Game Corner prize (Celadon)',      '', ''),

  # ── Omanyte / Kabuto (revive in Kanto Pewter)
  138: ('Revive Helix Fossil (Pewter)',     '', ''),
  139: ('Evolve Omanyte (Lv40)',            '', ''),
  140: ('Revive Dome Fossil (Pewter)',      '', ''),
  141: ('Evolve Kabuto (Lv40)',             '', ''),

  # ── Aerodactyl
  142: ('Revive Old Amber (Pewter)',        '', ''),

  # ── Snorlax (static, Route 11)
  143: ('Route 11 (Kanto) — Pokéflute',     '', ''),

  # ── Articuno / Zapdos / Moltres (Kanto static)
  144: ('Seafoam Islands (static)',         '', ''),
  145: ('Power Plant (static)',             '', ''),
  146: ('Mt. Silver (static)',              '', ''),

  # ── Dratini line
  147: ('Dragon\'s Den / Surf',             '', ''),
  148: ('Evolve Dratini (Lv30)',            '', ''),
  149: ('Evolve Dragonair (Lv55)',          '', ''),

  # ── Mewtwo / Mew (event)
  150: ('Event / Trade only',               '', ''),
  151: ('Event distribution only',          '', ''),

  # ══ JOHTO STARTERS (Prof. Elm) ══
  152: ('Prof. Elm starter (New Bark)',     '', ''),
  153: ('Evolve Chikorita (Lv16)',          '', ''),
  154: ('Evolve Bayleef (Lv32)',            '', ''),
  155: ('Prof. Elm starter (New Bark)',     '', ''),
  156: ('Evolve Cyndaquil (Lv14)',          '', ''),
  157: ('Evolve Quilava (Lv36)',            '', ''),
  158: ('Prof. Elm starter (New Bark)',     '', ''),
  159: ('Evolve Totodile (Lv18)',           '', ''),
  160: ('Evolve Croconaw (Lv30)',           '', ''),

  # ── Sentret/Furret
  161: ('Routes 29/30/31',                  '', ''),
  162: ('Evolve Sentret (Lv15)',            '', ''),

  # ── Hoothoot/Noctowl
  163: ('Routes 29–32 (night)',             '', ''),
  164: ('Evolve Hoothoot (Lv20)',           '', ''),

  # ── Ledyba (Gold only)
  165: ('Routes 30/31/37 (morning)',
        'Trade from Gold/Crystal',
        'Routes 30/31/37 (morning)'),
  166: ('Evolve Ledyba (Lv18)',             '', ''),

  # ── Spinarak (Silver only)
  167: ('Trade from Silver/Crystal',
        'Routes 30/31/37 (night)',
        'Routes 30/31/37 (night)'),
  168: ('Evolve Spinarak (Lv22)',           '', ''),

  # ── Crobat
  169: ('Friendship-evolve Golbat',         '', ''),

  # ── Chinchou
  170: ('Fish — Route 41 / Whirl Islands',  '', ''),
  171: ('Evolve Chinchou (Lv27)',           '', ''),

  # ── Pichu / Cleffa / Igglybuff (breed)
  172: ('Breed Pikachu w/ Light Ball',      '', ''),
  173: ('Breed Clefairy',                   '', ''),
  174: ('Breed Jigglypuff',                 '', ''),

  # ── Togepi/Togetic (egg from Mr. Pokémon)
  175: ('Egg from Mr. Pokémon',             '', ''),
  176: ('Friendship-evolve Togepi',         '', ''),

  # ── Natu/Xatu
  177: ('Ruins of Alph',                    '', ''),
  178: ('Evolve Natu (Lv25)',               '', ''),

  # ── Mareep line
  179: ('Route 32 / 42',                    '', ''),
  180: ('Evolve Mareep (Lv15)',             '', ''),
  181: ('Evolve Flaaffy (Lv30)',            '', ''),

  # ── Bellossom
  182: ('Sun Stone on Gloom',               '', ''),

  # ── Marill/Azumarill
  183: ('Mt. Mortar / Fish Route 42',       '', ''),
  184: ('Evolve Marill (Lv18)',             '', ''),

  # ── Sudowoodo (static, Route 36)
  185: ('Route 36 (Squirtbottle)',          '', ''),

  # ── Politoed
  186: ('Trade Poliwhirl w/ King\'s Rock',  '', ''),

  # ── Hoppip line
  187: ('Routes 32/33 (morning/day)',       '', ''),
  188: ('Evolve Hoppip (Lv18)',             '', ''),
  189: ('Evolve Skiploom (Lv27)',           '', ''),

  # ── Aipom
  190: ('Headbutt — Routes 42/43',          '', ''),

  # ── Sunkern/Sunflora
  191: ('Routes 37/38 (morning)',           '', ''),
  192: ('Sun Stone on Sunkern',             '', ''),

  # ── Yanma
  193: ('Headbutt — Route 35',              '', ''),

  # ── Wooper/Quagsire
  194: ('Union Cave (Surf) / Ruins',        '', ''),
  195: ('Evolve Wooper (Lv20)',             '', ''),

  # ── Espeon/Umbreon
  196: ('Friendship-evolve Eevee (day)',    '', ''),
  197: ('Friendship-evolve Eevee (night)',  '', ''),

  # ── Murkrow
  198: ('Routes 7/9/16 (Kanto, night)',     '', ''),

  # ── Slowking
  199: ('Trade Slowpoke w/ King\'s Rock',   '', ''),

  # ── Misdreavus
  200: ('Mt. Silver (night)',               '', ''),

  # ── Unown
  201: ('Ruins of Alph',                    '', ''),

  # ── Wobbuffet
  202: ('Dark Cave / Lake of Rage',         '', ''),

  # ── Girafarig
  203: ('Route 43',                         '', ''),

  # ── Pineco/Forretress
  204: ('Headbutt — Routes 36/37',          '', ''),
  205: ('Evolve Pineco (Lv31)',             '', ''),

  # ── Dunsparce
  206: ('Dark Cave (Rock Smash)',           '', ''),

  # ── Gligar (Gold only)
  207: ('Route 45 / Cliff Cave',
        'Trade from Gold/Crystal',
        'Route 45 / Cliff Cave'),

  # ── Steelix
  208: ('Trade Onix w/ Metal Coat',         '', ''),

  # ── Snubbull/Granbull
  209: ('Routes 38/39 / Headbutt',          '', ''),
  210: ('Evolve Snubbull (Lv23)',           '', ''),

  # ── Qwilfish (Silver/Crystal exclusive in GS, both in Crystal)
  211: ('Fish — Route 32 (Trade from S/C)',
        'Fish — Route 32',
        'Fish — Route 32'),

  # ── Scizor
  212: ('Trade Scyther w/ Metal Coat',      '', ''),

  # ── Shuckle
  213: ('Cianwood / Berry man gift',        '', ''),

  # ── Heracross
  214: ('Headbutt — Routes 46/Azalea',      '', ''),

  # ── Sneasel (Silver/Crystal exclusive)
  215: ('Trade from Silver/Crystal',
        'Ice Path (night)',
        'Ice Path (night)'),

  # ── Teddiursa (Gold only)
  216: ('Route 45 / Mt. Silver',
        'Trade from Gold/Crystal',
        'Route 45 / Mt. Silver'),
  217: ('Evolve Teddiursa (Lv30)',          '', ''),

  # ── Slugma (Silver only)
  218: ('Trade from Silver/Crystal',
        'Route 16/17 (Kanto, day)',
        'Route 16/17 (Kanto, day)'),
  219: ('Evolve Slugma (Lv38)',             '', ''),

  # ── Swinub/Piloswine
  220: ('Ice Path / Mt. Silver',            '', ''),
  221: ('Evolve Swinub (Lv33)',             '', ''),

  # ── Corsola
  222: ('Surf — Route 41',                  '', ''),

  # ── Remoraid/Octillery
  223: ('Fish — Route 41',                  '', ''),
  224: ('Evolve Remoraid (Lv25)',           '', ''),

  # ── Delibird
  225: ('Ice Path / Mt. Silver',            '', ''),

  # ── Mantine
  226: ('Surf — Route 41',                  '', ''),

  # ── Skarmory (Silver only)
  227: ('Trade from Silver/Crystal',
        'Route 45',
        'Route 45'),

  # ── Houndour (Crystal-side common)
  228: ('Route 7 (Kanto, night)',           '', ''),
  229: ('Evolve Houndour (Lv24)',           '', ''),

  # ── Kingdra
  230: ('Trade Seadra w/ Dragon Scale',     '', ''),

  # ── Phanpy (Gold only)
  231: ('Route 45/46',
        'Trade from Gold/Crystal',
        'Route 45/46'),
  232: ('Evolve Phanpy (Lv25)',             '', ''),

  # ── Porygon2
  233: ('Trade Porygon w/ Up-Grade',        '', ''),

  # ── Stantler
  234: ('Route 36/37 (morning/night)',      '', ''),

  # ── Smeargle
  235: ('Ruins of Alph',                    '', ''),

  # ── Tyrogue/Hitmontop (egg of Hitmonlee/chan)
  236: ('Mt. Mortar (Karate King)',         '', ''),
  237: ('Evolve Tyrogue (Lv20, atk=def)',   '', ''),

  # ── Smoochum/Elekid/Magby (breed pre-evos)
  238: ('Breed Jynx',                       '', ''),
  239: ('Breed Electabuzz',                 '', ''),
  240: ('Breed Magmar',                     '', ''),

  # ── Miltank
  241: ('Route 39 (Moomoo Farm)',           '', ''),

  # ── Blissey
  242: ('Friendship-evolve Chansey',        '', ''),

  # ── Legendary beasts
  243: ('Roaming Johto (after Brass Tower)','', 'Crystal: encounter in Tin Tower'),
  244: ('Roaming Johto (after Brass Tower)','', 'Crystal: encounter in Tin Tower'),
  245: ('Roaming Johto (after Brass Tower)',
        'Roaming Johto (after Brass Tower)',
        'Static — multiple Crystal events'),

  # ── Larvitar line
  246: ('Mt. Silver (post-E4)',             '', ''),
  247: ('Evolve Larvitar (Lv30)',           '', ''),
  248: ('Evolve Pupitar (Lv55)',            '', ''),

  # ── Tower trio
  249: ('Whirl Islands (Silver/Crystal)',
        'Whirl Islands B5F (Silver Wing)',
        'Whirl Islands (post-event)'),
  250: ('Tin Tower (Gold/Crystal, Rainbow Wing)',
        'Trade from Gold/Crystal',
        'Tin Tower (post-event)'),

  # ── Celebi (event)
  251: ('Event distribution / GS Ball',     '', ''),
}


def main():
    with open(POKEDATA) as f:
        s = f.read()
    m = re.search(r'(window\.POKE\s*=\s*)(\[.*\])(.*)$', s, re.DOTALL)
    if not m:
        sys.exit('could not parse pokedata.js')
    data = json.loads(m.group(2))
    missing = []
    for p in data:
        n = p['num']
        if n not in LOC:
            missing.append(n)
            continue
        g, s2, c = LOC[n]
        p['games'] = {
            'FR': g,
            'LG': s2 or g,
            'E':  c  or g,
        }
    if missing:
        print('WARN: no location for #', missing)
    new = m.group(1) + json.dumps(data, ensure_ascii=False) + m.group(3)
    with open(POKEDATA, 'w') as f:
        f.write(new)
    print(f'Wrote {len(data)} Pokémon with per-game locations.')

if __name__ == '__main__':
    main()
