# The Snow Collective — Dev Notes

## On Session Start
At the beginning of every session, check if a local dev server is running on port 3001.
If not, start one in the background:

```bash
lsof -ti:3001 || python3 -m http.server 3001 --directory /Users/stephenrosenfeld/Claude/websites/snow-collective
```

Tell the user the server is running at http://localhost:3001.

## Project
- Stack: Plain HTML + CSS + vanilla JS (no build step)
- GitHub: https://github.com/rs-studio-code/snow-collective
- Deploy: push to `main` → GitHub Pages auto-deploys

## Site Structure
- `index.html` — Home / profile page (bio, about, social links)
- `catalog.html` — Portfolio / inventory page (dynamic, filterable grid)
- `style.css` — Shared scrapbook theme
- `catalog.js` — Fetches inventory from Google Apps Script (or falls back to inventory.json)
- `inventory.json` — Fallback inventory data (used if Apps Script URL not configured)
- `google-apps-script.js` — Reference copy of the Apps Script to deploy in Google
- `images/site/` — Site-level images (hero collage, logo, about section)

## Image Catalog — Google Drive Integration
Images are hosted in Google Drive and loaded dynamically via a Google Apps Script web app.

**Google Drive folder:** https://drive.google.com/drive/folders/1ytUvRa2GK9M9NeHw1LAwS03y43sB-t3K

### Setup (one-time)
1. Go to https://script.google.com and create a new project
2. Paste the contents of `google-apps-script.js` into the editor
3. Click Deploy > New deployment
4. Type = "Web app", Execute as = "Me", Who has access = "Anyone"
5. Authorize when prompted, copy the web app URL
6. Paste the URL into `catalog.js` as the `APPS_SCRIPT_URL` value

### Adding Inventory
1. Upload image to the Google Drive folder
2. Name it: `category - Item Name.jpg` (e.g. `drawings - Monocle Bunny.jpg`)
3. Optionally right-click > File information > add a Description
4. Done — the site picks it up automatically, no code changes needed

### Valid Categories
`buttons`, `paintings`, `drawings`, `other`

## Design
- Scrapbook / collage aesthetic matching Snow's Squarespace style
- Fonts: Kalam (handwritten), Lora (serif), Inter (body)
- Paper-texture background, polaroid-style photo borders, washi tape accents
- Slightly rotated cards for scattered collage feel
- Social links: Instagram, Facebook, Little Blue Market
