#!/usr/bin/env python3
"""Filter LEARNSETS and MOVE_LEARNERS in app.js so only entries for
Pokémon #1–251 remain. Removes Gen-3 (#252+) species that were left
over from the GEN3 template.
"""
import json, os, re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/js/app.js')

def main():
    with open(APP) as f:
        src = f.read()

    # ── LEARNSETS ────────────────────────────────────────────────
    m = re.search(r'(const LEARNSETS\s*=\s*)(\{.*?\})(\s*;)', src, re.DOTALL)
    if not m:
        raise SystemExit('LEARNSETS not found')
    obj = json.loads(m.group(2))
    before = len(obj)
    obj = {k: v for k, v in obj.items() if 1 <= int(k) <= 251}
    after = len(obj)
    src = src[:m.start(2)] + json.dumps(obj, ensure_ascii=False) + src[m.end(2):]
    print(f'LEARNSETS: {before} → {after} ({before-after} Gen-3+ entries removed)')

    # ── MOVE_LEARNERS ────────────────────────────────────────────
    m = re.search(r'(const MOVE_LEARNERS\s*=\s*)(\{.*?\})(\s*;)', src, re.DOTALL)
    if not m:
        raise SystemExit('MOVE_LEARNERS not found')
    ml = json.loads(m.group(2))
    cleaned = 0
    new_ml = {}
    for move_name, learners in ml.items():
        filtered = {k: v for k, v in learners.items() if 1 <= int(k) <= 251}
        if len(filtered) < len(learners):
            cleaned += len(learners) - len(filtered)
        if filtered:
            new_ml[move_name] = filtered
    src = src[:m.start(2)] + json.dumps(new_ml, ensure_ascii=False) + src[m.end(2):]
    print(f'MOVE_LEARNERS: stripped {cleaned} Gen-3+ Pokémon entries across {len(new_ml)} moves')

    with open(APP, 'w') as f:
        f.write(src)

if __name__ == '__main__':
    main()
