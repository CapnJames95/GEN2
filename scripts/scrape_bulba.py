#!/usr/bin/env python3
"""Scrape Bulbapedia walkthroughs for Pokémon Gold/Silver and Crystal.
Uses curl (which has working UA negotiation with Bulbapedia) rather than urllib.
"""
import json, os, sys, time, subprocess, urllib.parse, re

OUT_DIR = '/Users/andrewlamb/Documents/Github/GEN2/assets/data'
CACHE_FILE = '/tmp/bulba_cache_gen2.json'

WALKTHROUGHS = {
    'gs': {
        'page': 'Walkthrough:Pok%C3%A9mon_Gold_and_Silver',
        'parts': 29,
        'outfile': 'bulba-data-gs.js',
    },
    'c': {
        'page': 'Walkthrough:Pok%C3%A9mon_Crystal',
        'parts': 29,
        'outfile': 'bulba-data-c.js',
    },
}

API = 'https://bulbapedia.bulbagarden.net/w/api.php'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36'

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}

def save_cache(c):
    with open(CACHE_FILE, 'w') as f:
        json.dump(c, f)

def fetch(page_title):
    params = {'action':'parse','page':page_title,'format':'json','prop':'text'}
    url = API + '?' + urllib.parse.urlencode(params)
    try:
        out = subprocess.run(
            ['curl','-s','-A',UA,'--max-time','30',url],
            capture_output=True, text=True, check=True
        )
        return json.loads(out.stdout)
    except subprocess.CalledProcessError as e:
        return {'error':{'code':'curl-error','info':str(e)}}
    except json.JSONDecodeError as e:
        return {'error':{'code':'json-error','info':str(e)}}

def strip_html(html):
    """Light cleanup. The MediaWiki API returns just the content body.
    We remove a few standard elements that won't render correctly offline
    (edit links, inline scripts, the top-of-page navigation infobox table,
    and the bottom navigation footer)."""
    # Remove edit-section links
    html = re.sub(r'<span class="mw-editsection".*?</span>', '', html, flags=re.DOTALL)
    # Remove inline scripts
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    # Remove the top "Walkthrough infobox" — Bulbapedia walkthrough parts start
    # with a navigation infobox showing badges/parts. Style="float:right" table.
    # Easier: remove the FIRST <table class="infobox"...> ... </table> if present
    html = re.sub(
        r'^\s*<table class="infobox"[^>]*>.*?</table>\s*',
        '', html, count=1, flags=re.DOTALL
    )
    # Remove the bottom Part navigator (the "← Part N | Part N+1 →" footer)
    # — recognizable as a div containing "Walkthrough" + "Part N" + "Part N+1"
    # Simpler: strip the last <div class="WTName"> block to the end.
    # The standard pattern is: <div ...><div ...>← Part N</div>...<div ...>Part N+1 →</div></div>
    # MediaWiki output usually has these at the very end before category links.
    # We'll trim everything after the last `<div class="WTName">` parent.
    # Actually safest: leave as-is and rewrite Part_N links to use our handler.
    return html

def fix_links(html, walkthrough_key):
    """Rewrite same-walkthrough part links to use our bulbaLoadPart() handler."""
    page_path = WALKTHROUGHS[walkthrough_key]['page']
    pattern = re.compile(r'href="/wiki/' + page_path + r'/Part_(\d+)"')
    def repl(m):
        return f'href="javascript:void(0)" onclick="bulbaLoadPart({m.group(1)})"'
    html = pattern.sub(repl, html)
    # Also rewrite the same-but-with-actual-é form
    page_path_decoded = page_path.replace('%C3%A9','é')
    pattern2 = re.compile(r'href="/wiki/' + re.escape(page_path_decoded) + r'/Part_(\d+)"')
    html = pattern2.sub(repl, html)
    return html

def wrap_body(html):
    return (
        '<div class="bulbapediamonobook-body" id="bodyContent">\n\n'
        '<div class="mw-body-content" id="mw-content-text">'
        + html +
        '</div>\n</div>'
    )

def scrape_walkthrough(key, info, cache):
    print(f'\n=== Scraping {key} ({info["page"]}) ===')
    parts = {}
    for p in range(0, info['parts'] + 1):
        page_title = info['page'].replace('%C3%A9','é') + f'/Part_{p}'
        cache_key = f'{key}:{p}'
        if cache_key in cache:
            parts[str(p)] = cache[cache_key]
            print(f'  Part {p}: cached ({len(cache[cache_key])} chars)')
            continue
        resp = fetch(page_title)
        if 'error' in resp:
            err = resp['error'].get('code','?')
            if err == 'missingtitle':
                print(f'  Part {p}: missing (404)')
            else:
                print(f'  Part {p}: API error {err}')
            continue
        html = resp.get('parse',{}).get('text',{}).get('*','')
        if not html:
            print(f'  Part {p}: empty')
            continue
        stripped = strip_html(html)
        stripped = fix_links(stripped, key)
        wrapped = wrap_body(stripped)
        parts[str(p)] = wrapped
        cache[cache_key] = wrapped
        save_cache(cache)
        print(f'  Part {p}: {len(wrapped):,} chars')
        time.sleep(0.4)
    return parts

def write_out(key, info, parts):
    out_path = os.path.join(OUT_DIR, info['outfile'])
    json_blob = json.dumps(parts, ensure_ascii=False)
    json_blob = json_blob.replace('</script>', '<\\/script>')
    js = f'window.BULBA_STATIC_{key.upper()} = {json_blob};\n'
    with open(out_path, 'w') as f:
        f.write(js)
    print(f'Wrote {out_path}: {len(parts)} parts, {len(js):,} bytes')

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    cache = load_cache()
    for key, info in WALKTHROUGHS.items():
        parts = scrape_walkthrough(key, info, cache)
        if parts:
            write_out(key, info, parts)
    print('\nDone.')

if __name__ == '__main__':
    main()
