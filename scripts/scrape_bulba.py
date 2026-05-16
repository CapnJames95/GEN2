#!/usr/bin/env python3
"""Scrape Bulbapedia walkthroughs for Pokémon Gold/Silver and Crystal.

Bulbapedia sits behind Cloudflare's JS challenge. Plain curl/urllib gets the
"Just a moment..." page. To pass it, this script needs the `cf_clearance`
cookie from a real browser session that has already passed the challenge.

How to get the cookie (one-time, takes 60 seconds):
  1. Open https://bulbapedia.bulbagarden.net/ in Chrome/Safari/Firefox.
  2. Once the page actually loads (challenge passed), open DevTools:
       - Chrome:  Application > Cookies > https://bulbapedia.bulbagarden.net
       - Safari:  Develop > Show Web Inspector > Storage > Cookies
       - Firefox: Storage > Cookies
  3. Find the `cf_clearance` cookie. Copy its Value field.
  4. Paste into scripts/.cf_clearance (no quotes, no whitespace).
  5. Re-run this script.

The cf_clearance cookie is valid for ~30 days. If the scraper starts hitting
the challenge again, re-grab the cookie.
"""

import json, os, sys, time, subprocess, urllib.parse, re

OUT_DIR     = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets/data'))
CACHE_FILE  = '/tmp/bulba_cache_gen2.json'
COOKIE_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '.cf_clearance'))

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
UA_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '.user_agent'))
DEFAULT_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

def load_user_agent():
    """Cloudflare's cf_clearance cookie is bound to the User-Agent string
    that received it. Read the user's actual browser UA from .user_agent
    if present; otherwise warn and fall back to a default that probably
    won't match."""
    if os.path.exists(UA_FILE):
        val = open(UA_FILE).read().strip().strip('"').strip("'")
        if val and len(val) >= 30:
            return val
    print(f'\n⚠️  No {UA_FILE} found.')
    print('   The cf_clearance cookie is bound to your browser\'s User-Agent.')
    print('   Without matching it exactly, Cloudflare will reject the cookie.')
    print('   In Bulbapedia\'s tab, open the JS console (⌥⌘J / Develop > Show JS Console)')
    print('   and run:    navigator.userAgent')
    print('   then paste the result into:')
    print(f'      pbpaste > {UA_FILE}')
    print('   ...and re-run this script.\n')
    print('   Trying with a default UA anyway (will likely fail)...\n')
    return DEFAULT_UA

def load_cookie():
    if not os.path.exists(COOKIE_FILE):
        print(f'\n❌ Cookie file missing: {COOKIE_FILE}')
        print('   Open https://bulbapedia.bulbagarden.net/ in a browser, pass the')
        print('   Cloudflare challenge, then copy the `cf_clearance` cookie value into')
        print(f'   that file. See the docstring at the top of this script.\n')
        sys.exit(1)
    val = open(COOKIE_FILE).read().strip().strip('"').strip("'")
    if not val or len(val) < 50:
        print(f'❌ Cookie value in {COOKIE_FILE} looks empty / too short.')
        sys.exit(1)
    return val

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}

def save_cache(c):
    with open(CACHE_FILE, 'w') as f:
        json.dump(c, f)

def fetch(page_title, cookie, ua):
    params = {'action':'parse','page':page_title,'format':'json','prop':'text'}
    url = API + '?' + urllib.parse.urlencode(params)
    cmd = [
        'curl','-s','--max-time','30','--compressed',
        '-H', f'User-Agent: {ua}',
        '-H', 'Accept: application/json',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        '-H', f'Cookie: cf_clearance={cookie}',
        '-H', 'Referer: https://bulbapedia.bulbagarden.net/',
        url
    ]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, check=True)
        raw = out.stdout
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            head = raw.strip()[:200]
            return {'error':{'code':'cloudflare-block','info':head}}
    except subprocess.CalledProcessError as e:
        return {'error':{'code':'curl-error','info':str(e)}}

def strip_html(html):
    html = re.sub(r'<span class="mw-editsection".*?</span>', '', html, flags=re.DOTALL)
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(
        r'^\s*<table class="infobox"[^>]*>.*?</table>\s*',
        '', html, count=1, flags=re.DOTALL
    )
    return html

def fix_links(html, walkthrough_key):
    page_path = WALKTHROUGHS[walkthrough_key]['page']
    pattern = re.compile(r'href="/wiki/' + page_path + r'/Part_(\d+)"')
    def repl(m):
        return f'href="javascript:void(0)" onclick="bulbaLoadPart({m.group(1)})"'
    html = pattern.sub(repl, html)
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

def scrape_walkthrough(key, info, cookie, ua, cache):
    print(f'\n=== Scraping {key} ({info["page"]}) ===')
    parts = {}
    cf_block_count = 0
    for p in range(0, info['parts'] + 1):
        page_title = info['page'].replace('%C3%A9','é') + f'/Part_{p}'
        cache_key = f'{key}:{p}'
        if cache_key in cache:
            parts[str(p)] = cache[cache_key]
            print(f'  Part {p}: cached ({len(cache[cache_key])} chars)')
            continue
        resp = fetch(page_title, cookie, ua)
        if 'error' in resp:
            err = resp['error'].get('code','?')
            if err == 'missingtitle':
                print(f'  Part {p}: missing (404)')
            elif err == 'cloudflare-block':
                cf_block_count += 1
                preview = resp['error'].get('info','')[:80]
                print(f'  Part {p}: Cloudflare block — {preview}')
                if cf_block_count >= 3:
                    print('\n❌ Cookie is rejected or expired — Cloudflare keeps blocking.')
                    print('   Visit Bulbapedia in your browser, grab a fresh cf_clearance,')
                    print(f'   paste it into {COOKIE_FILE}, and re-run.\n')
                    sys.exit(1)
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
        time.sleep(0.5)
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
    cookie = load_cookie()
    ua = load_user_agent()
    print(f'Using cf_clearance cookie ({len(cookie)} chars)')
    print(f'Using User-Agent: {ua[:80]}...')
    cache = load_cache()
    for key, info in WALKTHROUGHS.items():
        parts = scrape_walkthrough(key, info, cookie, ua, cache)
        if parts:
            write_out(key, info, parts)
    print('\nDone.')

if __name__ == '__main__':
    main()
