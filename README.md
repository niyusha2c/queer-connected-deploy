# Queer Connected — temp preview site

Two static pages, ready to deploy as-is (no build step needed):

- `index.html` — Home
- `events.html` — Events

The "Home" and "Events" nav items (and the logo) now link between the two pages, so the founder can click around like a real site. "About", "FAQs", "Contact" are left as plain text since those pages don't exist yet.

## Deploy to Vercel

**Easiest — no install needed:**
1. Go to https://vercel.com/new and sign in.
2. Drag this folder (or a zip of it) onto the "Import" screen — Vercel auto-detects it as a static site.
3. Click Deploy. You'll get a `*.vercel.app` URL in about 10 seconds.

**Or with the CLI**, from inside this folder:
```
npx vercel deploy
```
Follow the prompts (link or create a project); it prints the preview URL when done.

## About the console warnings you saw

Those "[bundle] resource failed to load" warnings only showed up in the in-app file preview panel, which renders the file inside a sandboxed iframe that intercepts blob: requests. That sandbox isn't how a real hosted page loads. Tested here in a standalone browser (and this is exactly what a Vercel URL gives you), both pages load with zero console warnings or errors — nothing to fix.
