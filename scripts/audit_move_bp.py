#!/usr/bin/env python3
"""Spot-check Gen-2 move base power / accuracy against a curated truth
table. Reports any mismatches in ALL_MOVES_DATA so we can decide if the
source needs fixing.

Truth values pulled from Bulbapedia's "List of moves (Generation II)".
"""
import json, os, re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/js/app.js')

# move name → (expected_power, expected_accuracy)  in Gen 2.
# Power 0 = variable / status. Use None to skip a check.
TRUTH = {
    # Common moves that changed BP/accuracy in later gens
    'Pound':         (40, 100),
    'Karate Chop':   (50, 100),
    'Double Slap':   (15, 85),
    'Mega Punch':    (80, 85),
    'Pay Day':       (40, 100),
    'Fire Punch':    (75, 100),
    'Ice Punch':     (75, 100),
    'ThunderPunch':  (75, 100),
    'Scratch':       (40, 100),
    'Vice Grip':     (55, 100),
    'Guillotine':    (0,  30),
    'Razor Wind':    (80, 75),     # Gen 2 acc was 75, not 100!
    'Swords Dance':  (0,  0),
    'Cut':           (50, 95),
    'Gust':          (40, 100),
    'Wing Attack':   (60, 100),    # Gen 2 power was 60 (boosted to 60 → 60 then 60)
    'Whirlwind':     (0,  100),
    'Fly':           (70, 95),
    'Bind':          (15, 75),
    'Slam':          (80, 75),
    'Vine Whip':     (35, 100),    # Gen 2 BP was 35 / Gen 6+ became 45
    'Stomp':         (65, 100),
    'Double Kick':   (30, 100),
    'Mega Kick':     (120, 75),
    'Hyper Beam':    (150, 90),    # Gen 2 unchanged from G1
    'Solarbeam':     (120, 100),
    'Thunderbolt':   (95, 100),
    'Thunder':       (120, 70),    # Gen 2 acc 70 (was 100 in Gen 5+; back to 70 in Gen 6 outside Rain)
    'Earthquake':    (100, 100),
    'Fissure':       (0,  30),
    'Horn Drill':    (0,  30),
    'Surf':          (95, 100),
    'Blizzard':      (120, 70),
    'Ice Beam':      (95, 100),
    'Psychic':       (90, 100),    # Gen 2 unchanged
    'Bite':          (60, 100),    # Gen 2 became Dark-type Physical (Gen 4)
    'Tackle':        (35, 95),     # Gen 2 BP was 35 / acc 95
    'Crunch':        (80, 100),    # Gen 2 BP 80 — same; type Dark
    'Body Slam':     (85, 100),
    'Take Down':     (90, 85),
    'Double-Edge':   (120, 100),
    'Hydro Pump':    (120, 80),
    'Mud-Slap':      (20, 100),
    'Octazooka':     (65, 85),
    'Aeroblast':     (100, 95),    # Lugia signature
    'Sacred Fire':   (100, 95),    # Ho-Oh signature
    'Cross Chop':    (100, 80),
    'Rock Smash':    (20, 100),
    'Rollout':       (30, 90),
    'Magnitude':     (0,  100),
    'DynamicPunch':  (100, 50),
    'Megahorn':      (120, 85),
    'Iron Tail':     (100, 75),
    'Steel Wing':    (70, 90),
    'Sleep Powder':  (0,  75),
    'PoisonPowder':  (0,  75),
    'Stun Spore':    (0,  75),
    'Thunder Wave':  (0,  100),
    'Hypnosis':      (0,  60),
    'Confuse Ray':   (0,  100),
    'Glare':         (0,  75),
}

def main():
    with open(APP) as f:
        src = f.read()
    m = re.search(r'const ALL_MOVES_DATA\s*=\s*(\[\[.*?\]\]);', src, re.DOTALL)
    arr = json.loads(m.group(1))
    by_name = {row[1]: row for row in arr}
    mismatches = []
    missing = []
    for name, (truth_pwr, truth_acc) in TRUTH.items():
        row = by_name.get(name)
        if not row:
            missing.append(name); continue
        cur_pwr = row[4]; cur_acc = row[5]
        if (truth_pwr is not None and cur_pwr != truth_pwr) or \
           (truth_acc is not None and cur_acc != truth_acc):
            mismatches.append((name, (cur_pwr, cur_acc), (truth_pwr, truth_acc)))
    print(f'Checked {len(TRUTH)} moves')
    if missing:
        print(f'\n{len(missing)} MISSING from ALL_MOVES_DATA:')
        for n in missing: print(f'  {n}')
    if mismatches:
        print(f'\n{len(mismatches)} MISMATCHES:')
        for name, cur, truth in mismatches:
            print(f'  {name:18s} current=(pwr={cur[0]}, acc={cur[1]})  → Gen-2 truth=(pwr={truth[0]}, acc={truth[1]})')
    else:
        print('\n✓ All checked moves match Gen-2 BP/acc.')

if __name__ == '__main__':
    main()
