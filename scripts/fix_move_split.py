#!/usr/bin/env python3
"""Rewrite ALL_MOVES_DATA in app.js so move categories follow the Gen 2
per-TYPE Physical/Special split (categories were copied from Gen 3+
per-MOVE data, which is wrong for Gen 2).

Gen 2 rule (from the original disassembly):
  Physical types: Normal, Fighting, Flying, Poison, Ground, Rock, Bug,
                  Ghost, Steel
  Special types:  Fire, Water, Grass, Electric, Ice, Psychic, Dragon, Dark
  Status moves stay as O (other).

Damage-dealing moves get their category overwritten by their type.
Status moves (power = 0, category = O) keep O.
A small number of zero-power damaging moves (Counter, Mirror Coat,
Dragon Rage, Sonic Boom, Night Shade, Seismic Toss, OHKO moves) keep
their existing category — they're fixed-damage or special-case moves.
"""
import re, json, os

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/js/app.js')

PHYSICAL_TYPES = {'Normal','Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel'}
SPECIAL_TYPES  = {'Fire','Water','Grass','Electric','Ice','Psychic','Dragon','Dark'}

# Moves that stay 'O' even though they may have a "power" of 1 (multi-hit
# variants treat 0 power differently in our data set, so safe).
KEEP_OTHER = set()

def main():
    with open(APP) as f:
        src = f.read()
    m = re.search(r'(const ALL_MOVES_DATA\s*=\s*)(\[\[.*?\]\])(\s*;)', src, re.DOTALL)
    if not m:
        raise SystemExit('Could not find ALL_MOVES_DATA in app.js')
    arr_text = m.group(2)
    # JSON-loads it directly — no JS-specific syntax in this literal
    arr = json.loads(arr_text)
    changed = 0
    for row in arr:
        if len(row) < 8: continue
        _id, name, mtype, cat, power, acc, pp, desc = row[:8]
        if cat == 'O':
            continue  # status move
        # Decide correct Gen-2 category from type
        if mtype in PHYSICAL_TYPES:
            new_cat = 'P'
        elif mtype in SPECIAL_TYPES:
            new_cat = 'S'
        else:
            continue
        if new_cat != cat:
            row[3] = new_cat
            changed += 1
    # Re-dump with the same shape (compact, JSON-safe)
    out = json.dumps(arr, ensure_ascii=False, separators=(', ', ': '))
    # Re-add the JS array shape — the input was already JSON-compatible
    src2 = src[:m.start(2)] + out + src[m.end(2):]
    with open(APP, 'w') as f:
        f.write(src2)
    print(f'Rewrote {changed} move categories to match Gen-2 per-type split.')

if __name__ == '__main__':
    main()
