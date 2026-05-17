#!/usr/bin/env python3
"""Replace Gen-3 TM list with the actual Gen-2 TMs and strip remaining
Gen-3+ items from ALL_ITEMS.

Gen-2 TMs 01-50 list comes from the Gold/Silver/Crystal disassembly.
"""
import re, os

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/js/app.js')

GEN2_TM_MOVES = [
    'DynamicPunch','Headbutt','Curse','Rollout','Roar',
    'Toxic','Zap Cannon','Rock Smash','Psych Up','Hidden Power',
    'Sunny Day','Sweet Scent','Snore','Blizzard','Hyper Beam',
    'Icy Wind','Protect','Rain Dance','Giga Drain','Endure',
    'Frustration','SolarBeam','Iron Tail','DragonBreath','Thunder',
    'Earthquake','Return','Dig','Psychic','Shadow Ball',
    'Mud-Slap','Double Team','Ice Punch','Swagger','Sleep Talk',
    'Sludge Bomb','Sandstorm','Fire Blast','Swift','Defense Curl',
    'ThunderPunch','Dream Eater','Detect','Rest','Attract',
    'Thief','Steel Wing','Fire Punch','Fury Cutter','Nightmare'
]

# Items to remove entirely (Gen 3+ only)
GEN3_ITEMS_TO_REMOVE = [
    'Soul Dew', 'White Flute', 'Yellow Flute', 'Red Flute', 'Blue Flute', 'Black Flute',
    'Red Shard', 'Blue Shard', 'Yellow Shard', 'Green Shard',
    'Red Scarf', 'Blue Scarf', 'Pink Scarf', 'Green Scarf', 'Yellow Scarf',
    'Tri-Pass', 'Rainbow Pass', 'Tea', 'Teachy TV', 'VS Seeker', 'Powder Jar',
    'Mystic Ticket', 'Aurora Ticket', 'Old Sea Map', 'Eon Ticket',
    'Mach Bike', 'Acro Bike', 'Pokéblock Case', 'Wailmer Pail',
    'Go-Goggles', 'Devon Parts', 'Devon Scope', 'Letter', 'Basement Key',
    'Storage Key', 'Root Fossil', 'Claw Fossil', 'Contest Pass',
    'Magma Emblem', 'Red Orb', 'Blue Orb', 'Meteorite', 'Gold Teeth',
    'Bike Voucher', 'Fame Checker', 'Oak\'s Parcel',
    'Persim Berry', 'Pomeg Berry', 'Kelpsy Berry', 'Qualot Berry', 'Hondew Berry',
    'Grepa Berry', 'Tamato Berry', 'Cornn Berry', 'Magost Berry', 'Rabuta Berry',
    'Nomel Berry', 'Spelon Berry', 'Pamtre Berry', 'Watmel Berry', 'Durin Berry',
    'Belue Berry', 'Liechi Berry', 'Ganlon Berry', 'Salac Berry', 'Petaya Berry',
    'Apicot Berry', 'Lansat Berry', 'Starf Berry', 'Enigma Berry',
    'Oran Berry', 'Sitrus Berry', 'Lum Berry', 'Cheri Berry', 'Chesto Berry',
    'Pecha Berry', 'Rawst Berry', 'Aspear Berry', 'Leppa Berry', 'Figy Berry',
    'Wiki Berry', 'Mago Berry', 'Aguav Berry', 'Iapapa Berry', 'Razz Berry',
    'Bluk Berry', 'Nanab Berry', 'Wepear Berry', 'Pinap Berry',
    'Lava Cookie', 'Berry Juice', 'Sacred Ash', 'Moomoo Milk',
    'Shell Bell', 'Choice Specs', 'Choice Scarf',
    'Bright Powder',  # Gen 3+; Gen 2 has BrightPowder spelled differently
    'Sea Incense', 'Lax Incense', 'Soothe Bell',
    'Heart Scale',  # Gen 3+
]

def main():
    with open(APP) as f:
        src = f.read()
    m = re.search(r'(const ALL_ITEMS\s*=\s*\[)(.*?)(\n\];)', src, re.DOTALL)
    block = m.group(2)
    lines = block.split('\n')
    kept = []
    removed_count = 0
    tm_replaced = 0
    for L in lines:
        # Identify TM lines: [N,"TM01 ...",...
        tm_match = re.match(r'^(\s*\[\d+,)"TM(\d+) ([^"]+)"(.*)$', L)
        if tm_match:
            prefix, n_str, _old_move, suffix = tm_match.groups()
            n = int(n_str)
            if 1 <= n <= 50:
                new_move = GEN2_TM_MOVES[n - 1]
                new_name = f'TM{n_str.zfill(2)} {new_move}'
                L = f'{prefix}"{new_name}"{suffix}'
                tm_replaced += 1
        # Hide HM08 line — Gen 2 only has HM01-HM07
        hm_match = re.match(r'^(\s*\[\d+,)"HM(\d+) ([^"]+)"(.*)$', L)
        if hm_match:
            prefix, n_str, _move, suffix = hm_match.groups()
            n = int(n_str)
            if n > 7:
                removed_count += 1
                continue
        # Drop Gen-3-only items
        drop = False
        for nm in GEN3_ITEMS_TO_REMOVE:
            if f'"{nm}"' in L and L.strip().startswith('['):
                drop = True
                removed_count += 1
                break
        if not drop:
            kept.append(L)
    new_block = '\n'.join(kept)
    src2 = src[:m.start(2)] + new_block + src[m.end(2):]
    with open(APP, 'w') as f:
        f.write(src2)
    print(f'TMs renamed to Gen-2 moves: {tm_replaced}')
    print(f'Gen-3+ items removed:        {removed_count}')

if __name__ == '__main__':
    main()
