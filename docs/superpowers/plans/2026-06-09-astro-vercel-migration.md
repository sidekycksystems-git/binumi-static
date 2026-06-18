# Astro + Vercel Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the 11-page static HTML site into an Astro static site with a shared layout/components, clean URLs, and pixel-identical output, ready for push-to-deploy on Vercel.

**Architecture:** Astro `output: 'static'`. One `BaseLayout` owns the document shell; `Header`/`Footer` components are shared site-wide (Header takes a `current` prop for the active nav link and a `ctaHref` prop). All page CSS is consolidated into one `global.css`, with only genuine per-page deltas kept in scoped `<style>` blocks. Internal links become clean absolute paths (`/why-it-works/tech/`). Vercel auto-detects Astro and deploys `dist/` on push to the existing GitHub repo.

**Tech Stack:** Astro 5, Node 18+, npm. No UI framework, no CMS, no adapter (pure static).

**Verification model (this is a faithful conversion, not feature work):** there are no unit tests. Each task's gates are: (1) `npm run build` succeeds, (2) visual parity — the converted page screenshotted from the Astro dev server matches the original page served from the old HTML, (3) `grep` confirms no stray internal `.html` links. TDD-style red/green does not apply; the "test" is build + visual + grep.

**Branch:** `astro-vercel-migration` (already created; spec already committed here).

---

## File Structure

```
package.json                 # NEW — Astro scripts + deps
astro.config.mjs             # NEW — static config
tsconfig.json                # NEW — Astro's strict base
.gitignore                   # MODIFY — add node_modules/, dist/, .astro/
README.md                    # MODIFY — replace static-site notes with Astro dev/build/deploy
.claude/launch.json          # MODIFY — run `npm run dev` instead of python http.server
src/
  styles/global.css          # NEW — consolidated shared stylesheet
  layouts/BaseLayout.astro    # NEW — <!doctype>, <head>, <body> with Header/slot/Footer
  components/Header.astro      # NEW — site-header + nav (props: current, ctaHref)
  components/Footer.astro      # NEW — site-footer (no props)
  pages/
    index.astro                              # from index.html
    why-it-works/index.astro                 # from why-it-works.html
    why-it-works/tech.astro                  # from why-it-works/tech/index.html
    why-it-works/fintech.astro               # from why-it-works/fintech/index.html
    why-it-works/real-estate.astro           # from why-it-works/real-estate/index.html
    why-it-works/industrials.astro           # from why-it-works/industrials/index.html
    why-it-works/insurance.astro             # from why-it-works/insurance/index.html
    why-it-works/consultancy.astro           # from why-it-works/consultancy/index.html
    how-it-works/index.astro                 # from how-it-works.html
    insights/index.astro                     # from insights.html
    insights/the-static-content-crisis.astro # from insights/the-static-content-crisis/index.html
public/.gitkeep              # NEW — keep empty public dir (no local assets today)
```

Old `*.html` files are deleted in the final task, only after every page is converted and verified — git history preserves them.

### Canonical internal-link rewrite table (applies in every page conversion)

| Old (any relative form) | New clean absolute |
|---|---|
| `index.html`, `../../index.html`, `#` (brand link) | `/` |
| `index.html#how`, `../../index.html#how` | `/#how` |
| `index.html#proof`, `#proof` | `/#proof` |
| `index.html#verticals`, `#verticals` | `/#verticals` |
| `index.html#reframe`, `#reframe` | `/#reframe` |
| `why-it-works.html`, `../../why-it-works.html` | `/why-it-works/` |
| `how-it-works.html`, `../../how-it-works.html` | `/how-it-works/` |
| `insights.html`, `../../insights.html` | `/insights/` |
| `../tech/index.html` (and the other 5 verticals) | `/why-it-works/tech/` (etc.) |
| `#`-only placeholder buttons (About, Careers, social icons, etc.) | leave as `#` |
| in-page anchors already like `#cta`, `#close` | leave unchanged |

---

## Task 1: Scaffold the Astro project (no page conversion yet)

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `public/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "binumi-website",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

Default `build.format` is `'directory'`, which emits `/page/index.html` → clean URLs on Vercel. No `site` is set yet (sitemap/canonical are out of scope; add the production domain here later if needed).

```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: Create `public/.gitkeep`** (empty file — keeps the dir; no local assets today)

```
```

- [ ] **Step 5: Append to `.gitignore`**

Add these lines (do not remove existing entries):

```
# Astro / Node
node_modules/
dist/
.astro/
.vercel/
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` written, exit code 0.

- [ ] **Step 7: Verify the toolchain builds an empty project**

Run: `npm run build`
Expected: build succeeds. It will warn "no pages found" or emit an empty `dist/` — that is fine at this stage (no `src/pages/` yet). If it errors on missing `src/pages`, that's acceptable; the next task adds pages. Note the outcome and continue.

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json public/.gitkeep .gitignore package-lock.json
git commit -m "Scaffold Astro static project"
```

---

## Task 2: Build the shared shell (global.css, BaseLayout, Header, Footer)

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Create `src/styles/global.css` from the homepage stylesheet**

The homepage carries the largest CSS block and is the superset of shared rules. Copy the **contents** of its `<style>` element (the inner lines, not the tags) into `global.css`.

Run: `sed -n '15,361p' index.html > src/styles/global.css`
(`<style>` is line 14, `</style>` is line 362, so 15–361 is the CSS body. Verify the first line of the file is the opening CSS comment and the last is a closing `}` — not `</style>`.)

- [ ] **Step 2: Create `src/components/Footer.astro`**

This is the footer from `index.html` lines 625–667 with internal links rewritten to clean absolute paths. It takes no props — identical on every page.

```astro
---
// Site footer. Identical on every page.
---
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">binumi<b>.</b></a>
        <p>Be video first. The platform is the scale. The service is the expertise.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="/how-it-works/">How it works</a></li>
          <li><a href="/#reframe">What it's for</a></li>
          <li><a href="/#proof">Client work</a></li>
          <li><a href="/#verticals">Industries</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
    </div>
  </div>
  <hr class="rule" />
  <div class="container footer-bottom">
    <p>&copy; 2026 Binumi. All rights reserved.</p>
    <div class="socials">
      <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V21H17v-5.4c0-1.29-.02-2.95-1.8-2.95s-2.07 1.4-2.07 2.85V21H9z"/></svg></a>
      <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 001.8-1.8C23 15.2 23 12 23 12zM10 15.5v-7l6 3.5z"/></svg></a>
      <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.8-8.9L1 2h7l4.8 6.3zM17.7 20h1.7L7.4 4H5.6z"/></svg></a>
    </div>
  </div>
</footer>
```

> Note: `insights.html` and the insights article footer measured 44 lines vs 43 elsewhere — a 1-line whitespace/markup difference. When converting those pages (Tasks 6 & 7), diff their footer against this component; if the difference is only whitespace, this shared Footer is correct. If there's a real markup difference, surface it rather than silently dropping it.

- [ ] **Step 3: Create `src/components/Header.astro`**

The header is shared. Only two things vary per page: which nav link is "current", and the CTA href (homepage uses `#close`, every other page uses `#cta`). The nav-toggle checkbox/label and brand are constant.

```astro
---
interface Props {
  /** Which nav section is active: 'why-it-works' | 'how-it-works' | 'insights' | undefined (home) */
  current?: 'why-it-works' | 'how-it-works' | 'insights';
  /** Header CTA target. Homepage passes '#close'; all other pages use the default '#cta'. */
  ctaHref?: string;
}
const { current, ctaHref = '#cta' } = Astro.props;
---
<header class="site-header">
  <div class="container navbar">
    <a class="brand" href="/" aria-label="Binumi home">binumi<b>.</b></a>
    <input type="checkbox" id="nav-toggle" class="nav-toggle" />
    <label for="nav-toggle" class="nav-toggle-label" aria-label="Open menu">
      <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </label>
    <nav class="nav-links" aria-label="Primary">
      <a href="/why-it-works/" class={current === 'why-it-works' ? 'current' : undefined} aria-current={current === 'why-it-works' ? 'page' : undefined}>Why it works</a>
      <a href="/how-it-works/" class={current === 'how-it-works' ? 'current' : undefined} aria-current={current === 'how-it-works' ? 'page' : undefined}>How it works</a>
      <a href="/insights/" class={current === 'insights' ? 'current' : undefined} aria-current={current === 'insights' ? 'page' : undefined}>Insights</a>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-outline btn-sm" href={ctaHref}>See what becomes possible</a>
    </div>
  </div>
</header>
```

> Behaviour note: the original `why-it-works.html` marked its own nav link `class="current"` WITHOUT `aria-current` (only `how-it-works.html` had `aria-current="page"`). This component adds `aria-current="page"` to whichever link is current, for all pages. That is an accessibility improvement with no visual change (the `.current` class drives styling). Acceptable under the faithful-conversion bar.

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

Owns the document shell: doctype, `<head>` (meta, fonts, global CSS), and `<body>` wrapping Header / `<slot/>` / Footer. The `<head>` is lifted from `index.html` lines 4–12. Per-page `title`/`description` come in as props; `current`/`ctaHref` pass through to Header.

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  current?: 'why-it-works' | 'how-it-works' | 'insights';
  ctaHref?: string;
}
const { title, description, current, ctaHref } = Astro.props;
---
<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Urbanist:wght@500;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <Header current={current} ctaHref={ctaHref} />
  <slot />
  <Footer />
</body>
</html>
```

- [ ] **Step 5: Commit** (no buildable page yet — the shell compiles only once a page uses it; that happens in Task 3)

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/components/Header.astro src/components/Footer.astro
git commit -m "Add shared Astro shell: global.css, BaseLayout, Header, Footer"
```

---

## Task 3: Convert the homepage (`index.astro`) — the reference conversion

This is the template every other page follows. The homepage `<main>` becomes the slot content; `<head>`/header/footer come from the shell.

**Files:**
- Create: `src/pages/index.astro`
- Reference: `index.html` (do not delete yet)

- [ ] **Step 1: Extract the homepage body**

The page body is the `<main>…</main>` block between `</header>` and the `<!-- FOOTER -->` comment in `index.html` (roughly lines 386–623). Copy that block.

Run to preview the range: `sed -n '386,623p' index.html | head -5` and `sed -n '386,623p' index.html | tail -5`
Confirm it starts at `<main>` and ends at `</main>`.

- [ ] **Step 2: Create `src/pages/index.astro`**

Wrap the extracted `<main>` in `BaseLayout`, passing the homepage's original `<title>`/`description` (from `index.html` lines 6–7), `ctaHref="#close"` (homepage CTA), and no `current` (home has no active nav link). Then apply the link-rewrite table to every `href` inside the body.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Binumi — Be video first (homepage wireframe)"
  description="Wireframe mockup of the Binumi homepage. Design reference only."
  ctaHref="#close"
>
  <!-- PASTE the <main>…</main> block from index.html here, -->
  <!-- with every internal href rewritten per the link table -->
  <!-- (e.g. href="why-it-works.html" -> href="/why-it-works/", -->
  <!--  href="#proof" stays, in-page anchors stay). -->
</BaseLayout>
```

- [ ] **Step 3: Reconcile homepage-specific CSS**

`global.css` WAS the homepage stylesheet, so the homepage needs no scoped `<style>`. Confirm there is no leftover `<style>` in the extracted body. If the body contained an inline `<style>`, that's unexpected — surface it.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success; `dist/index.html` exists.

- [ ] **Step 5: Visual parity check**

Start the original site and the Astro dev server, screenshot both, compare.
- Original: `python3 -m http.server 4599` (serves `index.html`) → screenshot `http://localhost:4599/`
- Astro: `npm run dev` → screenshot `http://localhost:4321/`
Use the preview tooling to capture both at desktop and mobile widths. Expected: visually identical (hero, chat bar, video, sections, footer). Note any diff and fix the body/CSS before continuing.

- [ ] **Step 6: Grep for stray links in this page**

Run: `grep -nE 'href="[^"]*\.html' src/pages/index.astro || echo "clean"`
Expected: `clean` (no `.html` internal links remain).

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro
git commit -m "Convert homepage to Astro (index.astro)"
```

---

## Task 4: Convert `why-it-works/index.astro` (section landing)

**Files:**
- Create: `src/pages/why-it-works/index.astro`
- Reference: `why-it-works.html`

- [ ] **Step 1: Extract the body** — the `<main>…</main>` block from `why-it-works.html` (between `</header>` and the footer comment). Preview with `sed -n '/<\/header>/,/<!-- ===================== FOOTER/p' why-it-works.html`.

- [ ] **Step 2: Diff the page CSS against `global.css`** to find page-specific rules.

Run:
```bash
sed -n '15,290p' why-it-works.html > /tmp/wiw.css   # <style> is 14, </style> is 291
diff /tmp/wiw.css src/styles/global.css
```
Lines present in `/tmp/wiw.css` but NOT in `global.css` are page-specific → they go into a scoped `<style>` in this page. Lines only in `global.css` are fine (other pages use them). If there are zero page-only lines, this page needs no scoped `<style>`.

- [ ] **Step 3: Create `src/pages/why-it-works/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="<copy the original <title> from why-it-works.html line 6>"
  description="<copy the original description from why-it-works.html line 7>"
  current="why-it-works"
>
  <!-- PASTE the <main>…</main> block, links rewritten per the table -->
</BaseLayout>

<!-- Only if Step 2 found page-specific rules: -->
<style>
  /* paste ONLY the lines that were unique to why-it-works.html */
</style>
```

- [ ] **Step 4: Build** — `npm run build`. Expected: success; `dist/why-it-works/index.html` exists.

- [ ] **Step 5: Visual parity** — compare `http://localhost:4599/why-it-works.html` (original) vs `http://localhost:4321/why-it-works/` (Astro) via screenshots, desktop + mobile. Fix diffs before continuing.

- [ ] **Step 6: Grep** — `grep -nE 'href="[^"]*\.html' src/pages/why-it-works/index.astro || echo "clean"` → expect `clean`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/why-it-works/index.astro
git commit -m "Convert Why it works landing to Astro"
```

---

## Task 5: Convert `how-it-works/index.astro`

**Files:**
- Create: `src/pages/how-it-works/index.astro`
- Reference: `how-it-works.html`

- [ ] **Step 1: Extract** the `<main>…</main>` body from `how-it-works.html`.

- [ ] **Step 2: Diff CSS** — `<style>` is line 14, `</style>` is 331.
```bash
sed -n '15,330p' how-it-works.html > /tmp/hiw.css
diff /tmp/hiw.css src/styles/global.css
```
Unique lines → scoped `<style>`.

- [ ] **Step 3: Create `src/pages/how-it-works/index.astro`** — same shape as Task 4 Step 3, but `current="how-it-works"`, title/description copied from `how-it-works.html` lines 6–7, body links rewritten, page-specific CSS (if any) in a scoped `<style>`.

- [ ] **Step 4: Build** — expect `dist/how-it-works/index.html`.

- [ ] **Step 5: Visual parity** — `…/how-it-works.html` vs `…/how-it-works/`. Fix diffs.

- [ ] **Step 6: Grep** — expect `clean`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/how-it-works/index.astro
git commit -m "Convert How it works to Astro"
```

---

## Task 6: Convert `insights/index.astro`

**Files:**
- Create: `src/pages/insights/index.astro`
- Reference: `insights.html`

- [ ] **Step 1: Extract** the `<main>…</main>` body from `insights.html`. Rewrite the link to the article: `insights/the-static-content-crisis/index.html` → `/insights/the-static-content-crisis/`.

- [ ] **Step 2: Diff CSS** — `<style>` is line 14, `</style>` is 258.
```bash
sed -n '15,257p' insights.html > /tmp/ins.css
diff /tmp/ins.css src/styles/global.css
```
Unique lines → scoped `<style>`.

- [ ] **Step 3: Check the footer diff** — this page measured 44 footer lines vs 43. Diff its footer against `Footer.astro`'s markup; confirm the difference is only whitespace. If it's a real markup change, surface it before proceeding.

- [ ] **Step 4: Create `src/pages/insights/index.astro`** — `current="insights"`, title/description from `insights.html` lines 6–7, body links rewritten, page-specific CSS in scoped `<style>` if any.

- [ ] **Step 5: Build** — expect `dist/insights/index.html`.

- [ ] **Step 6: Visual parity** — `…/insights.html` vs `…/insights/`. Fix diffs.

- [ ] **Step 7: Grep** — expect `clean`.

- [ ] **Step 8: Commit**

```bash
git add src/pages/insights/index.astro
git commit -m "Convert Insights landing to Astro"
```

---

## Task 7: Convert the Insights article (`insights/the-static-content-crisis.astro`)

**Files:**
- Create: `src/pages/insights/the-static-content-crisis.astro`
- Reference: `insights/the-static-content-crisis/index.html`

- [ ] **Step 1: Extract** the `<main>…</main>` body. Rewrite links: `../../index.html…` → `/…`, `../../why-it-works.html` → `/why-it-works/`, etc. (Use the link table; note this file is two levels deep, so it uses `../../` prefixes.)

- [ ] **Step 2: Diff CSS** — find the `<style>`/`</style>` lines first: `grep -n '</\?style>' "insights/the-static-content-crisis/index.html"`. Then `sed -n '<start+1>,<end-1>p'` that range to `/tmp/article.css` and `diff` against `global.css`. Unique lines → scoped `<style>`.

- [ ] **Step 3: Footer diff** — same 44-vs-43 check as Task 6 Step 3.

- [ ] **Step 4: Create the page** — `current="insights"` (article lives under Insights), title/description from the article's `<head>`, body links rewritten, page-specific CSS scoped.

- [ ] **Step 5: Build** — expect `dist/insights/the-static-content-crisis/index.html`.

- [ ] **Step 6: Visual parity** — original `…/insights/the-static-content-crisis/` (served by python http.server) vs Astro `…/insights/the-static-content-crisis/`. Fix diffs.

- [ ] **Step 7: Grep** — expect `clean`.

- [ ] **Step 8: Commit**

```bash
git add src/pages/insights/the-static-content-crisis.astro
git commit -m "Convert Static Content Crisis article to Astro"
```

---

## Task 8: Convert the six vertical pages

These share one template (526–558 lines each, near-identical structure). Convert all six, but build/verify/commit each so a regression is caught per-page.

**Files (create each):**
- `src/pages/why-it-works/tech.astro` ← `why-it-works/tech/index.html`
- `src/pages/why-it-works/fintech.astro` ← `why-it-works/fintech/index.html`
- `src/pages/why-it-works/real-estate.astro` ← `why-it-works/real-estate/index.html`
- `src/pages/why-it-works/industrials.astro` ← `why-it-works/industrials/index.html`
- `src/pages/why-it-works/insurance.astro` ← `why-it-works/insurance/index.html`
- `src/pages/why-it-works/consultancy.astro` ← `why-it-works/consultancy/index.html`

For EACH vertical page, do steps 1–6:

- [ ] **Step 1: Extract** the `<main>…</main>` body from the source file.

- [ ] **Step 2: Diff CSS** — find `<style>`/`</style>` lines with `grep -n '</\?style>' <source>`, extract the inner range to `/tmp/vert.css`, `diff` against `global.css`, put unique lines in a scoped `<style>`. (Verticals share a vertical-page CSS block; if the same unique rules recur across all six, consider promoting them to `global.css` once — but only if identical. When unsure, keep them scoped per page; correctness over DRY.)

- [ ] **Step 3: Rewrite links** — these are two levels deep. Sibling vertical links `../tech/index.html` → `/why-it-works/tech/` (all six), `../../why-it-works.html` → `/why-it-works/`, `../../index.html#…` → `/#…`, `../../insights.html` → `/insights/`. In-page `#cta` stays.

- [ ] **Step 4: Create the page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="<original <title> from this vertical's source>"
  description="<original description>"
  current="why-it-works"
>
  <!-- PASTE the <main>…</main> body, links rewritten -->
</BaseLayout>

<!-- if Step 2 found page-specific rules: -->
<style>
  /* unique vertical CSS */
</style>
```

- [ ] **Step 5: Build + visual parity + grep** for THIS page:
  - `npm run build` → expect `dist/why-it-works/<slug>/index.html`
  - screenshot original `…/why-it-works/<slug>/` vs Astro `…/why-it-works/<slug>/`, fix diffs
  - `grep -nE 'href="[^"]*\.html' <the new .astro file> || echo "clean"` → expect `clean`

- [ ] **Step 6: Commit this page**

```bash
git add src/pages/why-it-works/<slug>.astro
git commit -m "Convert <Vertical> vertical page to Astro"
```

Repeat steps 1–6 for all six slugs: `tech`, `fintech`, `real-estate`, `industrials`, `insurance`, `consultancy`.

---

## Task 9: Remove old HTML, final sweep, docs, deploy readiness

**Files:**
- Delete: all original `*.html` files and now-empty subdirs
- Modify: `README.md`, `.claude/launch.json`

- [ ] **Step 1: Delete the original static files**

```bash
git rm index.html why-it-works.html how-it-works.html insights.html \
  why-it-works/tech/index.html why-it-works/fintech/index.html \
  why-it-works/real-estate/index.html why-it-works/industrials/index.html \
  why-it-works/insurance/index.html why-it-works/consultancy/index.html \
  insights/the-static-content-crisis/index.html
```
Then remove the now-empty top-level `why-it-works/` and `insights/` directories if git left them (only the `src/` versions should remain).

- [ ] **Step 2: Site-wide grep for stray internal `.html` links**

Run: `grep -rnE 'href="[^"]*\.html' src/ || echo "clean"`
Expected: `clean`. (Any hit is an internal link that was missed — fix it.)

- [ ] **Step 3: Full production build**

Run: `npm run build`
Expected: success. Then verify the output structure:
```bash
find dist -name '*.html' | sort
```
Expected exactly these 11 files: `dist/index.html`, `dist/why-it-works/index.html`, `dist/why-it-works/{tech,fintech,real-estate,industrials,insurance,consultancy}/index.html`, `dist/how-it-works/index.html`, `dist/insights/index.html`, `dist/insights/the-static-content-crisis/index.html`.

- [ ] **Step 4: Build-output spot check** — serve the build and screenshot two pages to confirm the production build (not just dev) renders correctly.

Run: `npm run preview` (serves `dist/`), screenshot `/` and `/why-it-works/tech/`. Expected: identical to dev.

- [ ] **Step 5: Update `.claude/launch.json`** to run the Astro dev server instead of python:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "binumi-astro",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 4321
    }
  ]
}
```

- [ ] **Step 6: Rewrite `README.md`** to document the Astro project. Replace static-site content with:

```markdown
# Binumi Website

Astro static site. Pixel-faithful conversion of the original hand-built HTML, restructured for easy updates and Vercel hosting.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # outputs static site to dist/
npm run preview  # serve the built dist/ locally
```

## Structure

- `src/layouts/BaseLayout.astro` — document shell (head, fonts, global CSS) wrapping Header/slot/Footer
- `src/components/Header.astro` — nav; `current` prop sets the active link, `ctaHref` sets the header CTA
- `src/components/Footer.astro` — shared footer
- `src/pages/**` — one file per route (clean URLs)
- `src/styles/global.css` — shared stylesheet; page-specific rules live in scoped `<style>` blocks

## Deploy (Vercel)

Connect the GitHub repo (`sidekyckservices/Binumi-Website`) in the Vercel dashboard. Vercel auto-detects Astro (build `astro build`, output `dist/`). Push to `main` → production deploy; pull requests → preview deploys.
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Remove original HTML, update README and launch config for Astro"
```

- [ ] **Step 8: Vercel hookup (manual user step — document, do not automate)**

This is done by the user in the Vercel dashboard, not by the agent:
1. Push the branch and merge to `main` (or open a PR for a preview deploy).
2. In Vercel: New Project → import `sidekyckservices/Binumi-Website` → framework preset "Astro" (auto-detected) → Deploy.
3. Set the production domain in Vercel's domain settings.

After this, `git push` to `main` auto-deploys. The agent's job ends at a green `npm run build` and a clean grep; surface the above as the handoff to the user.

---

## Self-Review (completed during planning)

- **Spec coverage:** route map (Task 1 structure + Tasks 3–8), CSS consolidation (Task 2 Step 1 + per-page diffs), link rewrite (table + per-page grep gates), shared Header/Footer/BaseLayout (Task 2), clean URLs (`astro.config` default directory format, verified in Task 9 Step 3), static output / no adapter (Task 1), fonts+CDN images unchanged (BaseLayout head, no asset tasks), Vercel deploy + easy-updates loop (Task 9 Steps 6 & 8), verification model (build + visual + grep, every page task). All spec sections map to tasks.
- **Placeholder scan:** the only intentional "paste here" markers are body-extraction points where reproducing 200–500 lines of source HTML verbatim in the plan would add transcription risk, not value; each is paired with an exact `sed` range and the link-rewrite table so the action is fully specified. Config/component code is given in full.
- **Type/name consistency:** `Header` props `current` (union: `'why-it-works'|'how-it-works'|'insights'`) and `ctaHref` are defined identically in Header.astro and BaseLayout.astro and used consistently in every page task (homepage: `ctaHref="#close"`, no `current`; verticals + insights article: `current` set, default `ctaHref`).
```
