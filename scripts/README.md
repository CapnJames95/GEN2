# GEN2 scripts

## `scrape_bulba.py`

Scrapes the Bulbapedia walkthroughs for **Pokémon Gold/Silver** (29 parts) and
**Pokémon Crystal** (29 parts) and writes:

- `assets/data/bulba-data-gs.js` — `window.BULBA_STATIC_GS = {...}`
- `assets/data/bulba-data-c.js`  — `window.BULBA_STATIC_C = {...}`

### Why this isn't run by Claude / CI

Bulbapedia sits behind Cloudflare's bot challenge. `curl`/`urllib` get a
"Just a moment…" page that requires JavaScript to pass. A real browser
session (your local Mac) gets through without trouble.

### Run locally

```sh
cd /Users/andrewlamb/Documents/Github/GEN2
python3 scripts/scrape_bulba.py
```

This:

1. Fetches each part page via Bulbapedia's MediaWiki API (`action=parse`)
2. Strips edit-link spans and inline `<script>` tags
3. Wraps the parsed HTML in the standard `bulbapediamonobook-body` container
4. Rewrites same-walkthrough Part links to call `bulbaLoadPart(N)` instead
   of navigating away
5. Caches each part in `/tmp/bulba_cache_gen2.json` so reruns are fast
6. Writes the two output files

Expected runtime: 1–3 minutes for ~60 parts on first run, instant on rerun
(cache).

### After running

Commit the two `assets/data/bulba-data-*.js` files. They're ~6–10 MB each
but compress well; GitHub Pages serves them gzipped.

### License

Bulbapedia content is CC BY-NC-SA 2.5. Attribution is provided in the
in-app Bulba viewer footer (matches the pattern used by GEN3 / GEN4).
