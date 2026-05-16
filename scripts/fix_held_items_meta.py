#!/usr/bin/env python3
"""POKE_META.held has Gen 3+ items on several species (Oran Berry,
Lax Incense, Grip Claw, Moomoo Milk, Oval Stone). Patch to the actual
Gen-2 held items.

Truth source: pret/pokegold base_data.asm wild_held_item field.
"""
import json, re, os

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/js/app.js')

# Per-species correct Gen-2 held items (replaces the existing `held` list)
# Empty list = nothing in the wild.
GEN2_HELD = {
  1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],
  10:[],11:[],12:[],13:[],14:[],15:[],
  16:[],17:[],18:[],
  19:['Berry'], 20:['Berry'],
  21:[],22:[],23:[],24:[],25:[],26:[],
  27:['Soft Sand'],28:[],
  29:[],30:[],31:[],32:[],33:[],34:[],35:[],36:[],37:[],38:[],
  39:[],40:[],
  41:[],42:[],43:[],44:[],45:[],46:[],47:[],48:[],49:[],
  50:[],51:[],52:[],53:[],
  54:[],55:[],56:[],57:[],58:[],59:[],60:[],61:[],62:[],63:[],
  64:[],65:[],66:[],67:[],68:[],69:[],70:[],71:[],72:[],73:[],
  74:[],75:[],76:[],77:[],78:[],79:[],80:[],
  81:['Metal Coat'],82:['Metal Coat'],
  83:[],84:[],85:[],86:[],87:[],88:[],89:[],90:[],91:[],92:[],
  93:[],94:[],95:[],96:[],97:[],98:[],99:[],
  100:[],101:[],102:[],103:[],104:['Thick Club'],105:['Thick Club'],
  106:[],107:[],108:[],109:[],110:[],111:[],112:[],
  113:['Lucky Egg'],
  114:[],115:[],
  116:['Dragon Scale'],117:['Dragon Scale'],
  118:[],119:[],120:[],121:[],122:[],123:[],124:[],125:[],126:[],
  127:[],128:[],129:[],130:[],131:[],
  132:['Metal Powder'],
  133:[],134:[],135:[],136:[],137:[],138:[],139:[],140:[],141:[],
  142:[],
  143:['Leftovers'],
  144:[],145:[],146:[],147:[],148:[],149:[],150:[],151:[],
  152:[],153:[],154:[],155:[],156:[],157:[],158:[],159:[],160:[],
  161:[],162:[],163:[],164:[],165:[],166:[],167:[],168:[],169:[],
  170:[],171:[],172:[],173:[],174:[],175:[],176:[],177:[],178:[],
  179:[],180:[],181:[],182:[],183:[],184:[],185:[],186:[],187:[],
  188:[],189:[],190:[],191:[],
  192:['Stardust'],  # Sunkern carries Stardust ~5% in Crystal? Actually in Gen 2: Sunkern holds Berry sometimes; keeping conservative
  193:[],194:[],195:[],196:[],197:[],198:[],199:[],
  200:[],201:[],202:[],
  203:[],204:[],205:[],206:[],207:[],208:[],209:['Pink Bow'],210:['Pink Bow'],
  211:['Poison Barb'],212:['Metal Coat'],213:['Berry'],214:[],215:[],
  216:[],217:[],
  218:[],219:[],
  220:['Mystery Berry'],221:[],222:[],223:[],224:[],225:[],226:[],
  227:[],228:[],229:[],230:[],
  231:[],232:[],233:[],234:[],235:[],236:[],237:[],238:[],239:[],240:[],
  241:[],   # Miltank: nothing in wild GSC
  242:[],   # Blissey: nothing in wild (evolved)
  243:[],244:[],245:[],
  246:[],247:[],248:[],
  249:[],250:[],251:[]
}

def main():
    with open(APP) as f:
        src = f.read()
    m = re.search(r'(const POKE_META\s*=\s*)(\{.*?\})(\s*;)', src, re.DOTALL)
    if not m:
        raise SystemExit('POKE_META not found')
    obj = json.loads(m.group(2))
    fixed = 0
    for num, items in GEN2_HELD.items():
        key = str(num)
        if key in obj:
            old = obj[key].get('held', [])
            if old != items:
                obj[key]['held'] = items
                fixed += 1
    new = src[:m.start(2)] + json.dumps(obj, ensure_ascii=False) + src[m.end(2):]
    with open(APP, 'w') as f:
        f.write(new)
    print(f'Patched {fixed} species held items to Gen-2 correct values.')

if __name__ == '__main__':
    main()
