# Binumi Site-Wide Light Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Invert the entire Binumi site from the dark navy brand to a white "Studio" light theme, with the homepage hero rebuilt to the chosen Variant B (white editorial hero + transformation row), as a preview-only branch pending founder review.

**Architecture:** One `[data-theme="light"]` token block plus a focused set of light overrides in `src/styles/global.css`; `BaseLayout.astro` renders `<body data-theme="light">` by default and keeps the dark tokens as the rollback path. Pages and components are almost entirely token-driven, so most of the site inherits the theme automatically. Only `global.css` and four page-scoped `<style>` blocks carry hardcoded colors that need overrides. The six vertical pages have no scoped styles and no hardcoded colors, so they invert for free (verify only).

**Tech Stack:** Astro 5 static site, plain CSS custom properties, vanilla JS. No test framework exists; every task verifies via `npm run build` plus the preview dev server (screenshots / `preview_inspect`).

---

## Decisions locked into this plan

- **Hero direction: Variant B (white editorial)**, chosen 2026-06-15 from the live prototype at `src/pages/prototype/hero.astro`. The full-bleed background film leaves the hero.
- **Design-only pass.** No copy changes. Divergent copy, CTA labels, proof figures, and the `/contact/` 404 are recorded in the "Flagged, not fixed" appendix, not changed here.
- **American spelling** (the three source docs said British; the repo and `lang="en-US"` are American). No copy is edited anyway.
- **Real routes:** the six verticals are `tech, fintech, insurance, events, consultancy, industrials` (no `real-estate`). Insights has one article, `the-static-content-crisis`.
- **`brand.md` / `product.md` doctrine is NOT touched.** Navy stays the documented brand identity; the light site is a preview-only track, founder-gated, same posture as the parked "Scale" hero change. No merge to `main`. The named-figure gate still applies before any production deploy.
- **Branch:** do all work on a new `site-light-variant` branch off `main`.

## The token map (dark to light)

This is the complete inversion. Every light override below maps to this table.

| Token | Dark (`:root`) | Light (`[data-theme="light"]`) | Notes |
|---|---|---|---|
| `--cyan` | `#00aeef` | `#00aeef` | brand constant |
| `--cyan-bright` | `#3fd0ff` | `#0e93c6` | "bright" goes darker on white for contrast |
| `--cyan-dark` | `#0e93c6` | `#0e93c6` | unchanged |
| `--bg` | `#070e1d` | `#ffffff` | pure white Studio chassis |
| `--navy` | `#0b1428` | `#0b1428` | KEPT DARK: video surfaces only (Law 1) |
| `--panel` | `#0f1d38` | `#f4f6f9` | |
| `--panel-2` | `#12244a` | `#eef1f6` | |
| `--ink` | `#eaf1fb` | `#0b1428` | |
| `--muted` | `#8ea4c6` | `#5b6b86` | darkened for white-bg contrast |
| `--body-copy` | `#cfdcef` | `#2b3a52` | |
| `--border` | `rgba(120,165,225,0.16)` | `rgba(11,20,40,0.14)` | |
| `--border-soft` | `rgba(120,165,225,0.10)` | `rgba(11,20,40,0.08)` | |
| `--cyan-fill` | `rgba(0,174,239,0.10)` | `rgba(0,174,239,0.10)` | unchanged |

**Law 1 (video stays navy):** `.video-frame` and `.thumb` use `linear-gradient(160deg, var(--panel-2), var(--navy))`, which would split half-light once `--panel-2` goes light. They get an explicit fixed-navy override. Their on-surface labels (`.video-tag`, `.duration`) keep their dark pills.

**Law 2 (cyan scarcity):** on light pages cyan is allowed only on `.btn-primary`, play buttons, the chat send/border, `.hl` spans, and link/nav/tab hovers and active states. Decorative cyan icon tiles go to `--muted`/`--ink`.

---

## Open sub-decision to confirm during plan review

**The transformation row appears in both the new hero and the existing `#verticals` section.** Variant B puts a nodes -> arrow -> video row in the hero. The live `#verticals` section ([index.astro:120-131](../../../src/pages/index.astro)) already has the identical `.transform-strip` device, and there is a standalone `.brand-film` video section right under the hero ([index.astro:42-49](../../../src/pages/index.astro)). To avoid showing the same device twice and stacking videos (a recent commit was "removing second video"), this plan's recommendation is:

- Move the `.transform-strip` into the hero (Task 3).
- Remove the now-duplicate `.transform-strip` from `#verticals`, leaving it as claim + industry cards.
- Remove the standalone `.brand-film` section; the hero's row video is the brand film.

Net result: one hero video, no duplicate device. If you would rather keep `#verticals` and the brand-film section untouched and give the hero a separate video, say so before execution and Task 3 changes accordingly.

---

## Task 1: Light token foundation in global.css

**Files:**
- Modify: `src/styles/global.css` (append a new section after the `:root` block, ends line 48)

- [ ] **Step 1: Add the light token block and standing-law overrides.** Append this block immediately after the `:root { ... }` close (line 48), before the RESET section:

```css
    /* ===========================================================
       LIGHT THEME  ([data-theme="light"])
       Inverts the dark :root to the white Studio chassis. The dark
       tokens above stay intact as the rollback path. Validated in
       the hero prototype, 2026-06-15.
       =========================================================== */
    body[data-theme="light"] {
      --cyan-bright: #0e93c6;
      --bg:          #ffffff;
      --navy:        #0b1428;   /* kept dark: video surfaces only (Law 1) */
      --panel:       #f4f6f9;
      --panel-2:     #eef1f6;
      --ink:         #0b1428;
      --muted:       #5b6b86;
      --body-copy:   #2b3a52;
      --border:      rgba(11,20,40,0.14);
      --border-soft: rgba(11,20,40,0.08);
    }
    body[data-theme="light"] h2 { font-weight: 600; }   /* calmer than the dark site */

    /* Law 1: video surfaces stay navy on the light page */
    body[data-theme="light"] .video-frame,
    body[data-theme="light"] .thumb {
      background: linear-gradient(160deg, #12244a, #0b1428);
      border-color: rgba(120,165,225,0.16);
    }
    body[data-theme="light"] .video-frame .video-tag,
    body[data-theme="light"] .thumb .video-tag { color: #cfe0ff; background: rgba(7,14,29,.72); border-color: rgba(120,165,225,0.14); }
    body[data-theme="light"] .video-frame { box-shadow: 0 30px 80px -42px rgba(11,20,40,.30); }
```

- [ ] **Step 2: Build.** Run: `npm run build`  — Expected: build succeeds, no errors.
- [ ] **Step 3: Commit.**

```bash
git add src/styles/global.css
git commit -m "feat(theme): add light token block and Law 1 video overrides"
```

## Task 2: Make light the default theme in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro:7-13` (Props + destructure), `:31` (`<body>`)

- [ ] **Step 1: Add a `theme` prop and render it on `<body>`.** Change the Props interface and destructure (lines 7-13) to add `theme`, defaulting to `'light'`:

```astro
interface Props {
  title: string;
  description: string;
  current?: 'why-it-works' | 'how-it-works' | 'insights';
  ctaHref?: string;
  theme?: 'light' | 'dark';
}
const { title, description, current, ctaHref, theme = 'light' } = Astro.props;
const isHome = Astro.url.pathname === '/';
```

- [ ] **Step 2: Apply it to `<body>` (line 31).** Replace the body tag:

```astro
<body data-theme={theme} class={isHome ? 'home' : undefined}>
```

- [ ] **Step 3: Build, then visually verify a token-only page.** Run `npm run build`, then with the dev server running open `/why-it-works/tech/` (a vertical with no scoped CSS). Expected: white background, navy ink text, navy video surfaces. This confirms the verticals invert for free.
- [ ] **Step 4: Commit.**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(theme): default BaseLayout to light, keep theme prop for rollback"
```

## Task 3: Rebuild the homepage hero to Variant B

**Files:**
- Modify: `src/pages/index.astro:11-49` (hero + brand-film), `:112-131` (`#verticals` strip), and the page `<style is:global>` block (append hero CSS)

- [ ] **Step 1: Replace the hero markup (lines 13-39) with the Variant B editorial hero.** Remove the `.hero-bg` film and `.hero-overlay`; restructure to a left copy block plus the transformation row. Copy text is unchanged from the live page:

```astro
    <!-- ===================== HERO (Variant B: white editorial + transformation row) ===================== -->
    <section class="hero hero-home hero-editorial">
      <div class="container hero-inner">
        <div class="hero-copy">
          <h1>Scale Expertise. <span class="hl">Grow Revenue</span>.</h1>
          <p class="lead">
            Revenue is limited by how many people your experts can reach. Binumi helps organizations
            transform complex knowledge into precision video communications that support every sales
            opportunity, educate every workforce, and enable their most valuable people to influence
            thousands rather than dozens.
          </p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="/contact/">Contact us
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
        <div class="transform-strip reveal">
          <div class="inputs">
            <span class="node">Decks</span>
            <span class="node">Reports</span>
            <span class="node">Posts</span>
            <span class="node">Knowledge</span>
          </div>
          <span class="strip-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
          </span>
          <VideoFrame
            class="strip-video"
            videoSrc={"https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__687920e2ac137e260ee44adb71408e8d_h169.mp4"}
            tag="On-brand. On message. Finished."
            title="Binumi brand film"
          />
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Delete the standalone brand-film section (lines 42-49).** Its video now lives in the hero row. Remove the entire `<section class="section brand-film"> ... </section>`.

- [ ] **Step 3: Remove the duplicate transform-strip from `#verticals` (lines 120-131).** Delete the `<div class="transform-strip reveal"> ... </div>` block inside `#verticals`, leaving the intro claim and the industry cards.

- [ ] **Step 4: Add the hero CSS to the page `<style is:global>` block** (after the existing `#proof` rule near line 325). This generalises the validated prototype CSS:

```css
  /* Hero (Variant B): white editorial copy block + transformation row */
  .hero-editorial { background: var(--bg); padding-top: clamp(3rem, 1.5rem + 6vw, 5.5rem); padding-bottom: var(--section-y); }
  .hero-editorial .hero-inner { display: flex; flex-direction: column; align-items: flex-start; text-align: left;
    gap: clamp(2rem, 1rem + 3vw, 3.25rem); }
  .hero-editorial .hero-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 1.4rem; }
  .hero-editorial h1 { letter-spacing: -0.02em; line-height: 1.08; max-width: 20ch; }
  .hero-editorial .lead { max-width: 58ch; line-height: 1.7; color: var(--body-copy); }
  .hero-editorial .transform-strip { width: 100%; justify-content: flex-start; }
  .hero-editorial .strip-video { flex: 1 1 520px; max-width: 760px; }
```

- [ ] **Step 5: Build and visually verify.** Run `npm run build`. With the dev server running, open `/`. Expected: white editorial hero, navy-ink headline with cyan "Grow Revenue", one cyan "Contact us" button, transformation row (nodes -> cyan arrow -> navy video). No full-bleed film. `#verticals` shows claim + cards only. Screenshot it.
- [ ] **Step 6: Commit.**

```bash
git add src/pages/index.astro
git commit -m "feat(home): rebuild hero to white editorial Variant B, de-dupe transform strip"
```

## Task 4: Homepage scoped style block, light overrides

**Files:**
- Modify: `src/pages/index.astro` `<style is:global>` (lines 322-416) — append a light-override group at the end of the block

The homepage scoped block has dark-only values that break on white: the value-tab hover (`rgba(255,255,255,.03)` — invisible on white), the value-panel dark gradient, and the cyan value-glyph (Law 2).

- [ ] **Step 1: Append these overrides at the end of the `<style is:global>` block (before `</style>` at line 416):**

```css
  /* ---- light theme overrides for the homepage scoped styles ---- */
  body[data-theme="light"] #value .value-tab:hover { background: rgba(11,20,40,.04); }
  body[data-theme="light"] #value .value-panel { background: var(--panel); border-color: var(--border-soft); }
  body[data-theme="light"] #value .value-glyph { background: var(--panel-2); border-color: var(--border); color: var(--muted); }
  body[data-theme="light"] #how .acc-glyph { background: var(--panel); border-color: var(--border-soft); }
  @media (max-width: 860px) {
    body[data-theme="light"] #value .value-tab:hover { background: rgba(11,20,40,.04); }
  }
```

(`#value .value-tab.active` and `#how .acc-item.open` keep their `--cyan-fill` wash; an active/open affordance is allowed cyan under Law 2.)

- [ ] **Step 2: Build and verify.** `npm run build`; open `/`, click through the "Where Binumi creates value" tabs and the "How Binumi works" accordion. Expected: readable panels, visible hover, ink (not cyan) glyph tiles on inactive items. Screenshot.
- [ ] **Step 3: Commit.**

```bash
git add src/pages/index.astro
git commit -m "feat(home): light overrides for value tabs and how accordion"
```

## Task 5: Global shared-component light overrides

**Files:**
- Modify: `src/styles/global.css` — append to the LIGHT THEME section from Task 1

These cover every shared selector with a hardcoded dark or white-alpha value (from the inventory): the sticky header scrim, nav, cards, the hairline rule, name chips, the credential band, subnav, socials, the mobile nav panel, and the interim-proof amber badge.

- [ ] **Step 1: Append this override group to the LIGHT THEME section in `global.css`:**

```css
    /* ---- shared components in light ---- */
    /* sticky header: light translucent scrim instead of navy (the doc's known failure point) */
    body[data-theme="light"] .site-header { background: linear-gradient(to bottom, rgba(255,255,255,.92), rgba(255,255,255,0)); }
    body[data-theme="light"] .nav-links { background: rgba(11,20,40,.05); }
    body[data-theme="light"] .nav-toggle-label { background: rgba(11,20,40,.06); border-color: var(--border-soft); color: var(--ink); }
    body[data-theme="light"] .nav-links.is-open,                      /* desktop selector no-op; mobile rule below */
    body[data-theme="light"] .nav-links { /* placeholder kept minimal */ }

    /* cards: white-alpha fills -> light panel */
    body[data-theme="light"] .card { background: var(--panel); }
    body[data-theme="light"] .card:hover { background: var(--cyan-fill); }

    /* hairline rule: light-blue -> dark-ink */
    body[data-theme="light"] .rule { background: linear-gradient(to right, transparent 8%, rgba(11,20,40,.14) 50%, transparent 92%); }

    /* navy-alpha chips/bands -> light panel + ink */
    body[data-theme="light"] .name { background: var(--panel-2); color: var(--ink); }
    body[data-theme="light"] .credential { background: var(--panel); }
    body[data-theme="light"] .subnav { background: var(--panel); }

    /* footer socials */
    body[data-theme="light"] .socials a { background: rgba(11,20,40,.05); color: var(--ink); }
    body[data-theme="light"] .socials a:hover { background: var(--cyan-fill); }

    /* mobile nav dropdown panel (line 374): dark -> light */
    body[data-theme="light"] .nav-links[data-open],
    @media (max-width: 880px) {
      body[data-theme="light"] .nav-links { background: var(--bg); border: 1px solid var(--border); }
    }

    /* interim-proof amber badge: darken text for white contrast */
    body[data-theme="light"] .pending { color: #9a5b00; border-color: rgba(154,91,0,.5); background: rgba(255,180,84,.14); }

    /* chat bar shadow softened on white */
    body[data-theme="light"] .chatbar { box-shadow: 0 18px 50px -30px rgba(11,20,40,.20); }
```

> Note for the executor: the `.nav-links[data-open]` selector and the stray rule in the header group are belt-and-braces; when you reach this task, open `global.css:373-377` to confirm the exact mobile-nav selector and class names, and keep only the rule that matches. Do not invent a new class.

- [ ] **Step 2: Build and verify header + footer.** `npm run build`; open `/` and `/insights/`, scroll so the sticky header overlaps content, and check the footer. Expected: header reads as light/translucent (not a navy bar), nav legible, footer on light panel, socials visible, "Be video first" footer line intact. Screenshot scrolled + unscrolled.
- [ ] **Step 3: Commit.**

```bash
git add src/styles/global.css
git commit -m "feat(theme): light overrides for header, nav, cards, footer, badges"
```

## Task 6: Header CTA to btn-primary site-wide

**Files:**
- Modify: `src/components/Header.astro:24`

Site-wide rule from the docs: the header CTA is cyan (`btn-primary`) everywhere, per the cyan-CTA test. It is currently `btn-outline`. (Label stays "See what becomes possible" — design-only; the label divergence from "Start your proof of value" is logged in the appendix.)

- [ ] **Step 1: Change the header CTA class (line 24):**

```astro
      <a class="btn btn-primary btn-sm" href={ctaHref}>See what becomes possible</a>
```

- [ ] **Step 2: Build and verify.** `npm run build`; open two pages. Expected: header CTA is a cyan filled button on every page. Screenshot.
- [ ] **Step 3: Commit.**

```bash
git add src/components/Header.astro
git commit -m "feat(theme): header CTA to btn-primary site-wide"
```

## Task 7: why-it-works landing page overrides

**Files:**
- Modify: `src/pages/why-it-works/index.astro` `<style>` block — append light overrides

Hardcoded values (from inventory): bento-card fills `rgba(30,192,238,.04/.06)`, feature-block `rgba(255,255,255,.04)`, lighter wiw-card `rgba(255,255,255,.02)`, faq-item `rgba(255,255,255,.03)`.

- [ ] **Step 1: Read the block (lines ~250-310) to confirm selectors, then append:**

```css
  body[data-theme="light"] .bento-card { background: var(--cyan-fill); }
  body[data-theme="light"] .bento-card:hover { background: rgba(0,174,239,.16); }
  body[data-theme="light"] .feature-block { background: var(--panel); }
  body[data-theme="light"] .wiw-card.lighter { background: var(--panel); }
  body[data-theme="light"] .faq-item { background: var(--panel); }
```

- [ ] **Step 2: Build and verify** `/why-it-works/`: white page, readable bento/feature/faq cards, the `#cta` section legible. Report the `#cta` anchor content found. Screenshot.
- [ ] **Step 3: Commit.** `git commit -m "feat(theme): light overrides for why-it-works landing"`

## Task 8: how-it-works page overrides

**Files:**
- Modify: `src/pages/how-it-works/index.astro` `<style>` block

Hardcoded values: tile-icon `rgba(142,164,198,.08)`, bento-tile `rgba(30,192,238,.04/.06)`, the io-media video tile gradient (line 313, keep navy per Law 1), io-play `#04121b` on cyan (keep), the statement/couplet band gradient `rgba(30,192,238,.08), var(--navy)` (line 331).

- [ ] **Step 1: Read the block (lines ~230-335), then append:**

```css
  body[data-theme="light"] .tile-icon { background: var(--panel-2); border-color: var(--border-soft); color: var(--muted); }
  body[data-theme="light"] .bento-tile { background: var(--cyan-fill); }
  body[data-theme="light"] .bento-tile:hover { background: rgba(0,174,239,.16); }
  /* the statement / couplet-payoff band: make it a light panel band with ink text, keep full-width feel */
  body[data-theme="light"] .statement-band,
  body[data-theme="light"] .couplet-payoff { background: var(--panel); color: var(--ink); }
```

(The `.io-media` video tile keeps its navy gradient under Law 1 — confirm it is caught by the global `.video-frame`/`.thumb` rule or add `body[data-theme="light"] .io-media { background: linear-gradient(160deg,#12244a,#0b1428); }` if it uses its own class.)

- [ ] **Step 2: Build and verify** `/how-it-works/`: white page, the couplet band reads as a light panel (not dark), icon tiles ink not cyan, the io video tile stays navy. Screenshot.
- [ ] **Step 3: Commit.** `git commit -m "feat(theme): light overrides for how-it-works"`

## Task 9: insights hub overrides

**Files:**
- Modify: `src/pages/insights/index.astro` `<style>` block

Hardcoded values: featured/post-card fills `rgba(255,255,255,.04)`, hovers `rgba(30,192,238,.05)`, planned-card `rgba(255,255,255,.04)`. Card thumbs stay navy (Law 1, already handled globally).

- [ ] **Step 1: Read the block (lines ~155-185), then append:**

```css
  body[data-theme="light"] .featured { background: var(--panel); }
  body[data-theme="light"] .featured:hover { background: var(--cyan-fill); }
  body[data-theme="light"] .post-card { background: var(--panel); }
  body[data-theme="light"] .post-card:hover { background: var(--cyan-fill); }
  body[data-theme="light"] .post-card--planned:hover { background: var(--panel); }
```

- [ ] **Step 2: Build and verify** `/insights/`: white page, card thumbs stay navy, category/meta lines legible (`--muted`). Screenshot.
- [ ] **Step 3: Commit.** `git commit -m "feat(theme): light overrides for insights hub"`

## Task 10: insights article overrides

**Files:**
- Modify: `src/pages/insights/the-static-content-crisis.astro` `<style>` block

Hardcoded values: post-card fill/hover (the related-posts strip), share-row socials `rgba(255,255,255,.05)` and hover `rgba(30,192,238,.2)`.

- [ ] **Step 1: Read the block (lines ~245-295), then append:**

```css
  body[data-theme="light"] .post-card { background: var(--panel); }
  body[data-theme="light"] .post-card:hover { background: var(--cyan-fill); }
  body[data-theme="light"] .share-row .socials a { background: rgba(11,20,40,.05); color: var(--ink); }
  body[data-theme="light"] .share-row .socials a:hover { background: var(--cyan-fill); }
```

- [ ] **Step 2: Build and verify** `/insights/the-static-content-crisis/`: white article body (`--body-copy`), pullquote and in-body video frames correct (video navy), the article-foot CTA is `btn-primary`. Screenshot.
- [ ] **Step 3: Commit.** `git commit -m "feat(theme): light overrides for the static-content-crisis article"`

## Task 11: Verify the six verticals (no code, visual only)

**Files:** none (these pages have no scoped CSS and no hardcoded colors)

- [ ] **Step 1: With the dev server running, open each:** `/why-it-works/tech/`, `/fintech/`, `/insurance/`, `/events/`, `/consultancy/`, `/industrials/`. Expected on each: white background, navy ink, navy video surfaces, cyan only on CTAs/hl/hovers, the interim-proof amber badge legible on fintech and events. Screenshot each.
- [ ] **Step 2:** If any page shows an unreadable combination, trace the selector to `global.css` and fix it there (it would affect all verticals), then re-verify. Otherwise no commit needed.

## Task 12: Full verification pass

**Files:** none

- [ ] **Step 1: Build and run the mechanical checks.**

```bash
npm run build                                   # must succeed
grep -rn -- "—" src/                            # em-dashes: expect no matches
grep -rn "Start your pilot" src/                # expect no matches
grep -rnE 'href="[^"]*\.html' src/ || echo clean # expect clean (Astro clean URLs)
grep -rn "data-theme" src/layouts/              # light default visible
```

- [ ] **Step 2: Visual gates, desktop and mobile (`preview_resize` mobile preset).** For every route compare against intent: geometry unchanged from the dark site (except the homepage hero), palette inverted, video screens navy. Spot-check the sticky header scrolled and unscrolled on two pages.
- [ ] **Step 3: Confirm cyan scarcity and CTAs.** On each page, cyan appears only on the sanctioned elements (Law 2). Every primary CTA is cyan. Note any page whose CTA label is not "Start your proof of value" (expected: several; logged in the appendix, not changed).
- [ ] **Step 4: Write the report** — per-page selectors changed, every Law 2 judgement call, the `#cta` anchor content found on the why-it-works landing, and any new copy problems noticed.

## Task 13: Remove the prototype and push

**Files:**
- Delete: `src/pages/prototype/hero.astro` (and the empty `src/pages/prototype/` dir)

- [ ] **Step 1: Delete the throwaway prototype route.**

```bash
git rm src/pages/prototype/hero.astro
rmdir src/pages/prototype 2>/dev/null || true
```

- [ ] **Step 2: Build once more.** `npm run build` — Expected: success, `/prototype/hero` no longer built.
- [ ] **Step 3: Commit and push the branch for a preview deploy. DO NOT merge to `main`.**

```bash
git add -A
git commit -m "chore: remove hero prototype after Variant B chosen"
git push -u origin site-light-variant
```

---

## Flagged, not fixed (design-only pass; these are separate copy/proof decisions)

- **`/contact/` 404:** the hero "Contact us" CTA points to `/contact/`, which has no page in `src/pages/`.
- **CTA labels** diverge from the docs' mandated "Start your proof of value": hero "Contact us", header "See what becomes possible", close "See the opportunities".
- **Close headline** is "See where Binumi creates impact." (the source docs key off "Stop reading about it. Watch it happen.", which is gone).
- **Figure gate:** Fujitsu shows "£20M+ in opportunities" (product.md has £1M+ influenced); "Informa" proof is new and not in product.md or the ledger; the testimonial is an anonymous "CTO, Fujitsu" where product.md's only approved attributed quote is Hannah Rolph / Knight Frank.

---

## Self-review notes

- **Spec coverage:** light default (T2), homepage hero = Variant B (T3), per-page sweeps for every file that has hardcoded colors (T4, T7-T10), shared components incl. header/footer/CTA (T5, T6), verticals (T11), verification incl. the docs' grep gates (T12), prototype cleanup (T13). Law 1 (T1) and Law 2 (T4, T5, T8) both covered.
- **No placeholders:** the token map is complete; each per-page task lists the actual hardcoded values from the inventory and their token replacements. The one "confirm the exact selector" note (T5 mobile nav, T8 io-media) is a read-to-confirm step, not invented code.
- **Type/selector consistency:** light overrides reuse the live class names verified by grep; `theme` prop name is consistent between T2's BaseLayout and the rollback note.
