# AGENTS.md, working in the Binumi repo

This file orients Codex (and any contributor) on how this repo works and how
to write content in it. Read `brand.md` and `product.md` before writing any copy.

## Two house rules, never broken
1. **No em-dashes anywhere.** Use commas, colons, or full stops. This is a brand rule, not a preference.
2. **American spelling throughout** (organization, systemize, program, optimize). The site is `lang="en-US"`.

## Responses
- Be concise in your responses and sacrifice grammar for conciseness.

## Code style
- Solve only what was asked. Don't add features, options, or config I didn't request.
- Prefer the simplest approach that works. No premature abstraction — don't add layers, wrappers, or helpers until there are at least two real callers.
- Don't add error handling, logging, or comments for hypothetical cases. Handle the cases that actually occur.
- If you're unsure whether something is needed, ask before building it.
- Match the patterns already in this codebase rather than introducing new ones.

## What this repo is
An **Astro static site** with a build step. Pages are `.astro` files under `src/pages/`.
The shared document shell is `src/layouts/BaseLayout.astro` (wraps `<Header/>`, `<slot/>`, `<Footer/>`);
components live in `src/components/`. Internal links use clean absolute paths (e.g. `/why-it-works/`).

- **Fonts:** Roboto (body), Inter (headings). Loaded once in `BaseLayout.astro`.
- **One site, one theme.** The site is **light only**. There is no theme switch, no `data-theme`
  attribute, no dark mode. The light palette below is the single source of truth.

## How styling is organized (read before changing any CSS)
The whole point of this structure is that a change lands in **one** place. Two tiers, nothing
in between:

1. **Global, shared rules live in `src/styles/global.css`.** Tokens, palette, buttons, grid,
   cards, sections, header, footer, the video frame, the chat widget. If a pattern shows up on
   more than one page, it belongs here.
2. **Page-specific, one-off rules live in that page's own `<style>` block**, scoped by a section
   ID or a page-unique class (e.g. `#how`, `#value`, `.hero-editorial`) so they cannot leak to
   other pages.

Four rules keep it manageable:
- **Spacing and size come from tokens, never hard-coded.** Change `--section-y`, `--gap`,
  `--pad-x`, the type scale, or the radii once in `:root` and every page follows. Reuse the
  tokens below, do not invent new ones.
- **Never define a color in two places.** One component, one color rule. If you catch yourself
  overriding a color you already set elsewhere, the base rule is wrong: fix that instead.
- **Promote what repeats, co-locate what does not.** A widget used on a single page (the home
  accordion, the value tabs) stays in that page's `<style>`. The moment it is reused, lift it into
  `global.css` or its own component in `src/components/`.
- **When a page `<style>` block grows large, that is a signal**, either a one-off widget that
  should become a component, or shared rules that should move to `global.css`.

### Palette (light only, single source of truth in `:root`)
Defined as CSS custom properties in `src/styles/global.css`. Exact brand hex.

**Page chrome (on white):**
- `--bg #ffffff` (page background)
- `--ink #0b1428` (headings and primary text)
- `--body-copy #2b3a52` (prose)
- `--muted #5b6b86` (secondary text, labels)
- `--panel #f4f6f9`, `--panel-2 #eef1f6` (light surface tints: nav pill, credential band, chat panel)
- `--surface #e8eff2` (the light island fill: cards, value panel, how-it-works accordion, testimonial. Outlined with a `--cyan` border. This is the default island, see the navy note below)
- `--border rgba(11,20,40,0.14)`, `--border-soft rgba(11,20,40,0.08)`

**Brand accent (cyan, constant):**
- `--cyan #00aeef` (primary Binumi blue: links, dots, eyebrows, labels, CTAs, borders)
- `--cyan-bright #0e93c6` (emphasis and hover on white; brighter on navy islands, see below)
- `--cyan-dark #0e93c6` (gradient base)
- `--cyan-fill rgba(0,174,239,0.10)` (cyan-tinted fill: ribbons, pills, icon chips)

**Islands: light by default, navy only where it earns it.**
Most boxes on the white page are **light islands**: a `--surface #e8eff2` fill outlined with a
`--cyan` (CTA-color) hairline border, keeping the normal on-white text tokens. This is the default
for `.card`, the bento/feature/wiw/faq blocks, post cards, the value-tab panel, the
how-it-works accordion, and the testimonial. The single global island rule lives in
`src/styles/global.css` (`:root body :is(...)`).

**Navy accent (deliberate dark islands, not a theme):**
Dark navy is now reserved for the few moments where it is visually important, so the page does not
drown in dark blue:
- `#001437` is the dark island background for the closing CTA card (`.cta-card`), the named-client
  proof cards (`.proof`), and the homepage "drive revenue" video block (`.drive-island`).
- `--navy #0b1428` with `#12244a` is the video-surface gradient. **Law 1: video frames always
  stay navy**, on every page.
- Inside any navy island the text tokens flip to the on-dark set: `--ink #eaf1fb`,
  `--body-copy #cfdcef`, `--muted #8ea4c6`, `--cyan-bright #3fd0ff`,
  `--border rgba(120,165,225,0.16)`. This is the only place those on-dark values appear.

### Design tokens
Type scale, spacing rhythm, and radii are carried from the Automark Astro theme and defined in
`:root` in `src/styles/global.css`. Reuse them, do not invent new ones.

## Local preview
```bash
npm install
npm run dev
# then open http://localhost:4321/
```
(There is a launch config `binumi-astro` in `.Codex/launch.json` for the same thing.)

## Deploy (Vercel)
Vercel auto-detects **Astro** (framework preset "Astro", build command `astro build`,
output directory `dist/`). Connect the GitHub repo `sidekyckservices/Binumi-Website`.
Push to `main` triggers a production deploy; pull requests get preview deploys automatically.

## Pages
| Source file | Route |
| --- | --- |
| `src/pages/index.astro` | `/` (Home) |
| `src/pages/why-it-works/index.astro` | `/why-it-works/` (overview) |
| `src/pages/why-it-works/[industry].astro` + `src/data/industries.ts` | `/why-it-works/<slug>/` (one module + one data record per industry: fintech, insurance, events, tech, consultancy, industrials) |
| `src/pages/how-it-works/index.astro` | `/how-it-works/` |
| `src/pages/insights/index.astro` | `/insights/` (blog hub, derived from the collection) |
| `src/content/insights/<slug>.mdx` + `src/pages/insights/[slug].astro` | `/insights/<slug>/` (article: MDX content collection rendered by one template) |

---

## How to author a new insights post

Posts are an **Astro content collection** (`src/content/insights/`), not standalone
pages. One template, `src/pages/insights/[slug].astro`, renders every post; the
listing hub and every card are generated from the collection. Do not clone a page.

### Steps
1. Add `src/content/insights/<slug>.mdx`. Use a clean kebab-case slug; it serves at `/insights/<slug>/`.
2. Fill the frontmatter (schema in `src/content.config.ts`): `category`, `heading` (the `<h1>` and card title), `deck` (one or two sentence standfirst, used on the article and its card), `date` (ISO, e.g. `2026-06-08`), `watch` ("N min watch"), `cardTag` + `cardDuration` (the grid card's video label and time), and for a published post `title`, `description`, `heroVideoTag`, `heroVideoDuration` ("Watch · M:SS"). Set `featured: true` on the one lead post.
3. Write the body in **Markdown**: `## ` sections, plain paragraphs, `- ` lists with `**bold**`. MDX gotcha: do NOT wrap prose in raw multi-line `<p>...</p>`, MDX silently drops the text. Plain markdown paragraphs become `<p>` correctly.
4. For the rich pieces, import VideoFrame at the top (`import VideoFrame from '../../components/VideoFrame.astro';`) and use, in the body: one `<p class="pullquote">...</p>` (keep it on a single line), **at least one in-body** `<figure class="video-figure">` wrapping a `<VideoFrame/>`, and a `<div class="stat-callout">` for figures. Every post carries video in the body, not just the hero.
5. Keep a `What becomes possible` section near the end (brand convention, the Magician beat). The prose closes on a question.
6. **Coming-soon posts:** add the `.mdx` with `status: planned` and frontmatter only (no body). It shows as a coming-soon card in the listing and gets no page.
7. The listing card and the closing article CTA ("Find the video hiding in your business") are rendered by the template, not authored per post. The CTA is the one place a post does not close on a question; the prose body still should.
8. Article-specific CSS lives in `src/pages/insights/[slug].astro`; the card styles live in `src/components/PostCard.astro`. Shared rules are in `src/styles/global.css`.

### Voice checklist (every post)
- Opens on what becomes possible, before any mechanism.
- One named-client proof point, confirmed against `product.md` and latest approved figures. Never a borrowed third-party statistic.
- Proof is woven into a scene that shows what became possible, not a comma-stacked list of stats. Binumi is the agent of change ("Binumi turned X into Y"), not the customer.
- No Hero words (see the kill list in `brand.md`).
- The prose closes on a question.
- American spelling, no em-dashes.
- Tone about 6 out of 10. Senior, calm, declarative.

### Video policy for posts
- The hero and in-body videos are the master, up to **90 seconds**.
- The LinkedIn cut derived from the same idea is a separate asset, **45 seconds maximum, hard cap**.
- Use realistic durations in the `.duration` labels.

---

## Where the strategy lives
- `content/content-system.md`, the editorial engine: one idea many channels, cadence, categories, the LinkedIn and email model, the persona and pillar matrix.
- `content/calendar-june.md`, a worked month showing the system in motion, with mock posts and two ready-to-shoot 60 to 90 second video beat sheets.
- `content/copy-direction-capture.md`, the working copy-audit reference: the shipped homepage captured as the site-wide standard, with the per-page audit checklist and the figure gate. Use it when auditing any non-homepage page for tone, altitude, proof, and CTA. Note: its section 6 doctrine changes to `brand.md`/`product.md` (the "Scale" hero verb, the payroll lead device) are FOUNDER-GATED and not yet applied, so `brand.md` stays the doctrine of record until Anthony and Nils sign off.

When asked to "write the next blog," pick the next item from
`content/calendar-june.md` (or the system in `content/content-system.md`), draft it
to the checklist above, clone the template, and add the listing card.
