# GEN2 scripts

## `scrape_bulba.py`

Scrapes the Bulbapedia walkthroughs for **Pokémon Gold/Silver** (29 parts) and
**Pokémon Crystal** (29 parts) and writes:

- `assets/data/bulba-data-gs.js` — `window.BULBA_STATIC_GS = {...}`
- `assets/data/bulba-data-c.js`  — `window.BULBA_STATIC_C = {...}`

### Why this needs a cookie

Bulbapedia sits behind Cloudflare's JavaScript challenge — `curl`/`urllib`
get a "Just a moment…" page that requires JS execution to pass. The
script can't run that JS itself, but if you already have a real browser
session that passed the challenge, we can reuse its `cf_clearance` cookie.

### One-time setup (60 seconds)

1. Open https://bulbapedia.bulbagarden.net/ in Chrome/Safari/Firefox.
   Wait for the page to actually load (challenge passed).
2. Open DevTools:
   - **Chrome:** ⌘+Opt+I → Application tab → Cookies →
     `https://bulbapedia.bulbagarden.net`
   - **Safari:** Develop menu → Show Web Inspector → Storage → Cookies
   - **Firefox:** ⌘+Opt+I → Storage → Cookies
3. Find the row named `cf_clearance`. Copy its **Value** field
   (usually a long Base64-ish string, 200+ characters).
4. Paste into `scripts/.cf_clearance` (no quotes, no whitespace).
   You can do this from the terminal:
   ```sh
   pbpaste > scripts/.cf_clearance
   ```
   (`pbpaste` reads your clipboard on macOS — works after the copy step.)
5. Run the scraper:
   ```sh
   python3 scripts/scrape_bulba.py
   ```

### Run

```sh
cd ~/Documents/Github/GEN2
python3 scripts/scrape_bulba.py
```

The script:

1. Reads the cookie from `scripts/.cf_clearance`
2. Fetches each part via Bulbapedia's MediaWiki API
3. Strips edit-link spans, inline `<script>` tags, top navigation infobox
4. Wraps in the standard `bulbapediamonobook-body` container
5. Rewrites internal Part links to call `bulbaLoadPart(N)`
6. Caches each part in `/tmp/bulba_cache_gen2.json` (re-runs are instant)
7. Writes the two `assets/data/bulba-data-*.js` files

Expected runtime: 1–3 minutes for ~60 parts on first run, instant on rerun.

If the script reports `Cloudflare block` on 3+ pages in a row, the cookie has
expired (they typically last ~30 days) — grab a fresh one and re-run.

### After running

```sh
git add assets/data/bulba-data-*.js
git commit -m "Add scraped Bulba walkthroughs for G/S + Crystal"
git push
```

The data files are ~6–10 MB each; GitHub Pages serves them gzipped.

### Security

`scripts/.cf_clearance` is in `.gitignore` — it's your personal browser
session cookie and shouldn't be shared. The scraper only uses it to GET
publicly available walkthrough pages on Bulbapedia.

### License

Bulbapedia content is CC BY-NC-SA 2.5. Attribution is provided in the
in-app Bulba viewer footer (matches GEN3 / GEN4 pattern).
