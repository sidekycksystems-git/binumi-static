# Astro + Vercel migration — design spec

**Date:** 2026-06-09
**Status:** Design approved (pending user spec review)

## Goal

Convert the existing static HTML site to an Astro static site, hosted on Vercel, so that
content updates become easy: edit a file → `git push` → Vercel auto-deploys. The rendered
site must remain **pixel-identical** to today — the client likes the current design. This is
a re-plumbing, not a redesign.

## Decisions (locked)

| Decision | Choice | Notes |
|---|---|---|
| Editing model | Agency edits files, pushes to Git, Vercel auto-deploys | No CMS. |
| Insights posts | Stay as `.astro` pages | Migratable to a Markdown content collection later with **zero SEO cost** (both compile to identical HTML). |
| URL style | Clean URLs (`/why-it-works/tech/`) | Drops the old `file://` double-click review in favour of `npm run dev`. |
| Fidelity | Faithful 1:1 — pixel-identical output | No design changes. |
| Rendering | Static (`output: 'static'`) | No SSR, no Astro adapter needed; Vercel auto-detects Astro. |
| Assets | Fonts (Google) + images (Binumi CDN) stay hotlinked | Unchanged from today. Astro image pipeline is out of scope (YAGNI). |

## Current state (baseline)

- 11 hand-written static HTML pages, ~6,350 lines total, **zero build tooling**.
- Each page carries its own inline `<style>` block (244–348 lines); the blocks are ~95%
  identical with small per-page additions.
- A shared `site-header` + nav and `site-footer` repeat on every page, differing only by
  which nav link carries `class="current"` / `aria-current="page"`.
- Internal links are relative with explicit `.html` (e.g. `../../index.html#proof`) — a
  legacy of the `file://` double-click review workflow, which is now being retired.
- Git remote already exists: `https://github.com/sidekyckservices/Binumi-Website.git`.

### Page → route map

| Current file | Astro source | Route |
|---|---|---|
| `index.html` | `src/pages/index.astro` | `/` |
| `why-it-works.html` | `src/pages/why-it-works/index.astro` | `/why-it-works/` |
| `how-it-works.html` | `src/pages/how-it-works/index.astro` | `/how-it-works/` |
| `insights.html` | `src/pages/insights/index.astro` | `/insights/` |
| `insights/the-static-content-crisis/index.html` | `src/pages/insights/the-static-content-crisis.astro` | `/insights/the-static-content-crisis/` |
| `why-it-works/tech/index.html` | `src/pages/why-it-works/tech.astro` | `/why-it-works/tech/` |
| `why-it-works/fintech/index.html` | `src/pages/why-it-works/fintech.astro` | `/why-it-works/fintech/` |
| `why-it-works/real-estate/index.html` | `src/pages/why-it-works/real-estate.astro` | `/why-it-works/real-estate/` |
| `why-it-works/industrials/index.html` | `src/pages/why-it-works/industrials.astro` | `/why-it-works/industrials/` |
| `why-it-works/insurance/index.html` | `src/pages/why-it-works/insurance.astro` | `/why-it-works/insurance/` |
| `why-it-works/consultancy/index.html` | `src/pages/why-it-works/consultancy.astro` | `/why-it-works/consultancy/` |

## Architecture

```
src/
  layouts/
    BaseLayout.astro        # <!doctype>, <head> (meta, fonts, global CSS), <body> wrapping
                            #   <Header/>, <slot/>, <Footer/>. Props: title, description, current.
  components/
    Header.astro            # site-header + primary nav. Prop `current` sets the active link
                            #   (class="current" + aria-current="page").
    Footer.astro            # site-footer, identical on every page.
  pages/
    index.astro
    why-it-works/index.astro
    why-it-works/tech.astro
    why-it-works/fintech.astro
    why-it-works/real-estate.astro
    why-it-works/industrials.astro
    why-it-works/insurance.astro
    why-it-works/consultancy.astro
    how-it-works/index.astro
    insights/index.astro
    insights/the-static-content-crisis.astro
  styles/
    global.css              # the single consolidated stylesheet (shared base rules)
public/
    # favicon and any other static files served at root
astro.config.mjs
package.json
```

### Components & interfaces

- **BaseLayout.astro** — owns the document shell. Inputs: `title`, `description`, and a
  `current` key naming the active nav section. Renders page body via `<slot/>`. Imports
  `global.css` once.
- **Header.astro** — renders the nav; `current` prop drives the active-link styling. Single
  source of truth for nav links, so adding/renaming a nav item is a one-file change.
- **Footer.astro** — static, no props.
- **Each page `.astro`** — wraps its body content in `<BaseLayout>`, passing page metadata.
  Page-unique CSS (the small per-page deltas) lives in a scoped `<style>` block on the page.

## The two delicate work items

1. **CSS consolidation.** Diff the 11 `<style>` blocks. Shared rules → `src/styles/global.css`
   (imported once by BaseLayout). Genuinely page-specific rules → a scoped `<style>` on that
   page. Acceptance: rendered pages are visually unchanged from the originals.
2. **Link rewrite.** Convert every internal link from relative `.html` to clean absolute:
   - `index.html` / `../../index.html` → `/`
   - `…index.html#proof` → `/#proof` (hash anchors preserved)
   - `why-it-works.html` → `/why-it-works/`
   - `how-it-works.html` → `/how-it-works/`
   - `insights.html` → `/insights/`
   - `../tech/index.html` etc. → `/why-it-works/tech/`
   - `#`-only placeholder links left as-is.
   - Acceptance: `grep` for `.html"` in `src/` returns zero internal links.

## Deployment & the "easy updates" loop

- Vercel connects to the existing GitHub repo (`sidekyckservices/Binumi-Website`) via the
  dashboard. Vercel auto-detects Astro: build command `astro build`, output `dist/`.
- Push to `main` → production deploy. Pull requests → preview deploys.
- Connecting Vercel and choosing the production domain happens in the Vercel dashboard (a
  manual, one-time step by the user); everything in the repo will be ready for it.

## Verification

- `npm run dev` and compare each page side-by-side against the original static files
  (visual parity check).
- `npm run build` completes with no errors and emits `dist/` with the expected clean-URL
  structure.
- `grep` confirms no leftover internal `.html` links.
- Spot-check that fonts load and Binumi CDN images render.

## Out of scope (YAGNI)

- Any CMS or visual editor.
- Markdown/MDX content collection for Insights (deferred; trivial to add later).
- Astro image optimisation pipeline (images stay hotlinked from the CDN).
- Any design, copy, or layout change.

## Risks

- **CSS drift during consolidation** — mitigated by side-by-side visual verification before
  declaring done.
- **Missed internal link** — mitigated by exhaustive grep as an acceptance gate.
- **Vercel hookup is a manual dashboard step** — out of the repo's control; the repo will be
  fully build-ready so this is a couple of clicks for the user.
