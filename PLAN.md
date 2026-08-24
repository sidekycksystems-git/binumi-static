# PLAN: `/geo/` AI visibility grader landing page

_Round 1 revision, after Codex adversarial review._

A new marketing page on the Binumi Astro site (`binumi.com/geo/`) that sells GEO,
explains the mechanism, embeds the grader, and closes on the standard navy CTA.

The grader itself stays where it is: a separate app on a separate deploy at
`geo.binumi.com` (repo `~/Git Hub/SK_Services/binumi-lead-gen-app`). This page
embeds it. It does not reimplement it.

---

## 0. Preconditions, must be true before step 8 starts

The grader-side work this plan builds on is **uncommitted**. It lives as modified
files in a worktree at
`~/Git Hub/SK_Services/binumi-lead-gen-app/.claude/worktrees/flw-80-page-content`
on branch `sidekycksystems/flw-80-update-public-facing-page-content-and-layout`,
which currently points at the same commit as `main`.

Committed `main` therefore has **no** `PUBLIC_HEADER_HTML`, `PUBLIC_FOOTER_HTML`,
`PUBLIC_COOKIE_HTML` or `PUBLIC_CTA_HTML`, and its public score block still uses
`.island-dark`. Any agent reading `main` will correctly conclude this plan's
step 8 describes code that does not exist.

**Before step 8:** commit the FLW-80 worktree, or rewrite step 8 against `main`.
Do not start step 8 until this is resolved. One `rm -rf` of that worktree deletes
the premise of this plan.

### Two release gates, not open questions

These block the `/geo/` publish. They are decisions someone has to make, and the
page cannot ship correctly without them, so they do not belong in a risk list.

1. **Canonical ownership between `/geo/` and `geo.binumi.com`.** On the FLW-80
   branch the standalone grader self-canonicalizes to `https://geo.binumi.com/`.
   `BaseLayout` will canonicalize `/geo/` to itself. That is two indexable landing
   pages competing on the same intent, and `noindex` on the `?embed=1` response
   alone does not resolve it, because it is the *standalone* page that competes.
   Decide which URL is canonical and make the other defer to it.
2. **Privacy sign-off on the embed.** See risk 4. Needs the privacy owner, before
   release, not after.

---

## 1. Patterns found in this repo

### The scoping situation, which is the crux

Astro `<style>` blocks are **scoped by default** (Astro adds a `data-astro-cid-*`
attribute, which also raises specificity). A `<style is:global>` block is **not**
scoped and applies document-wide. This repo mixes both, and that changes the meaning of
"promote to global.css":

| File | Style block | Consequence |
| --- | --- | --- |
| `src/pages/solutions/index.astro:274` | `<style is:global>` | Its `.bento` and `.page-banner` rules are **already global** |
| `src/pages/prototype-icons.astro:70` | `<style is:global>` | Its `.bento` rules are **already global** |
| `src/pages/industries/index.astro:37` | `<style is:global>` | `.page-banner` already global |
| `src/pages/insights/index.astro:71` | `<style is:global>` | `.page-banner` already global |
| `src/pages/meet-the-team.astro:151` | `<style>` (scoped) | `.page-banner` is scoped, higher specificity |
| `src/pages/index.astro:294`, `insights/[slug].astro:162` | `<style is:global>` | |
| `src/pages/404.astro:30`, `about.astro:150`, `contact.astro:64` | `<style>` (scoped) | |

**What `is:global` does and does not mean.** It disables Astro's per-component
scoping *within the pages that include that block*. It does NOT publish the rule
site-wide: Astro emits a separate CSS chunk per page, so `solutions`' `.bento` and
`prototype-icons`' `.bento` never load into the same document. They are
**duplicated document-global rules, not a live cascade conflict.** Nothing is
broken today.

The consequence for this plan is narrower but still real: the two copies have
**drifted** (980px vs 860px), so consolidating them into one shared rule forces a
choice, and whichever breakpoint loses changes that page's behavior. See step 2.

So this is not "make a local rule global." It is "**consolidate two drifted copies
of the same rule**, and move them to the file that owns them."

### Pattern inventory

| Pattern | Defined today | Status |
| --- | --- | --- |
| `.cta-card`, `.cta-bg` | `global.css` | Reuse as-is |
| `.couplet`, `.lead-line`, `.couplet .close-line` (`global.css:559`) | `global.css` | Reuse as-is |
| `.card`, `.icon`, `.intro`, `.hero-inner`, `.stack`, `.eyebrow`, `.kicker` | `global.css` | Reuse as-is |
| `.page-banner`, `.banner-actions` | **4 duplicate definitions** | Promote, see step 1 |
| `.bento`, `.bento-card`, `.b-wide`, `.b-cell` | **2 conflicting global definitions** | Dedupe, see step 2 |

### Verified citations

- Hero banner shape: `src/pages/solutions/index.astro:44-67`
- Bento markup: `src/pages/solutions/index.astro:68-120`, `.bento > .bento-card.b-wide` + four `.bento-card.b-cell`
- Bento CSS, solutions: `src/pages/solutions/index.astro:286-292`, six-column grid, collapses at **980px**
- Bento CSS, prototype: `src/pages/prototype-icons.astro:76-91`, same family, collapses at **860px**, plus `#proto[data-variant]` positioning at lines 103-110
- Couplet: `src/pages/industries/[industry].astro:56-69`
- Closing CTA with lead: `src/pages/solutions/index.astro:256-266`
- Closing CTA **without** lead: `src/pages/industries/[industry].astro:125-138`
- `.page-banner` duplicates: `insights/index.astro:75`, `meet-the-team.astro:152`, `industries/index.astro:38`, `solutions/index.astro:278`
- Eyebrow usage: `privacy-policy.astro:13`, `terms-of-use.astro:13`
- Nav contract: `src/components/Header.astro:1-8`, `current` is `'solution' | 'industries' | 'insights'` only

### Pre-existing defects this plan inherits, does not fix

- `prototype-icons.astro` contains em-dashes at lines 2, 126, 127, 137, violating
  the house rule. That page is a throwaway prototype. **Do not let this pollute
  the verification gate**: the em-dash check must run against changed files and
  `/geo/`'s built output, not the whole `dist/`.
- The 860px vs 980px bento conflict predates this work.

---

## 2. Grader embed: recommendation

**Recommended: option 2, a chrome-less `embed` variant of the grader, iframed.**

### Rejected: iframe `geo.binumi.com` as it stands

On the FLW-80 branch the public page carries a full site header, footer, cookie
notice and its own navy closing CTA. Iframing it gives `/geo/` two headers, two
footers, two closing CTAs and a second cookie modal. Not viable.

### Rejected: cross-origin `POST` to `https://geo.binumi.com/api/grade`

1. No CORS headers exist on that endpoint, so it needs a grader-repo change anyway.
2. The whole result renderer would be rebuilt in Astro: score island, band label,
   three-slot story, null-narrative teaser fallback, error and lead-recorded states.
3. FLW-75 forbids the public tier rendering a per-category breakdown, and that
   invariant is currently enforced by tests asserting the *rendering code itself*
   is absent. Duplicating the renderer duplicates that surface, in a second repo,
   with no tests.

### Chosen: option 2, with the safety work Codex flagged

Add `'embed'` to `ConsoleOptions.variant`. It is `public` minus site furniture and
minus the hero copy (the `/geo/` page supplies its own eyebrow, H1 and lead).

**The trap, and the mandatory fix.** `console-html.ts:114` reads:

```ts
const isPublic = opts.variant === 'public';
```

Every tier gate downstream hangs off that single predicate: the POST endpoint,
whether per-check rendering ships, whether name/email are collected, whether the
internal teaser and run metadata appear. Adding `'embed'` to the union **without
changing this line silently makes the embed the internal tier**: it would post to
`/internal/grade`, ship the per-check renderer, and collect no lead. That is a
straight FLW-75 information-disclosure bug served inside a public marketing page.

**But a two-way split is not enough.** On the FLW-80 branch `isPublic` gates far
more than chrome: `lang`, the viewport meta, the title, all the head metadata, the
fonts href, four design tokens, whether `BAND_CSS` ships, which island class the
score gets, the entire body markup, the story section, the legal notice, and the
result focus call. `PUBLIC_HERO_HTML` also bundles the hero copy **and** the form
into one constant, and `PUBLIC_SHELL_CSS` bundles grader layout **and** chrome CSS.

So step 8 needs three named states, not one renamed boolean:

| Concern | internal | public | embed |
| --- | --- | --- | --- |
| Endpoint, lead fields, FLW-75 gating, story, legal | internal | **publicLike** | **publicLike** |
| Site chrome: header, footer, cookie, closing CTA, hero copy, head metadata | no | yes | **no** |
| Transparent background, no autofocus, resize reporting | no | no | **yes** |

Concretely: extract `PUBLIC_FORM_HTML` out of `PUBLIC_HERO_HTML`, and split
`PUBLIC_SHELL_CSS` into a public-tool half (form, result island, story, legal) and
a chrome half (header, footer, cookie, CTA). `publicLike` drives the tool half;
full-public drives the chrome half; `embed` adds only the framing behavior.

Then assert the tier markers against the **real exported embed artifact**, not a
separately constructed one.

Why the approach is still right:

- The variant branch exists and is tested. This is one more arm.
- The form posts **same-origin inside the frame** to `/api/grade`. No CORS, no
  duplicated HubSpot wiring.
- FLW-75's gate stays in one place.

---

## 3. Implementation steps

**Ordering is serialized, not parallel.** Steps 1 and 2 both edit `global.css` and
must run in order, by one agent. Steps 3 to 7 all edit the same new page file and
depend on 1 and 2. Step 8 is a different repo and may be *developed* concurrently,
but only after the message contract in step 5 is locked, and **deployment and
verification cannot be parallel**: grader deploys first, then `/geo/` publishes.

### Step 1: promote `.page-banner` and `.banner-actions` to `global.css`

- Add to `global.css` near `.hero-inner`:
  ```css
  .page-banner { padding-top: var(--nav-to-hero); padding-bottom: var(--section-y); }
  .banner-actions { display: flex; gap: .85rem; flex-wrap: wrap; justify-content: flex-start; }
  ```
- Delete the duplicate `.page-banner` from **four** files: `solutions/index.astro:278`,
  `insights/index.astro:75`, `meet-the-team.astro:152`, `industries/index.astro:38`.
  `prototype-icons.astro` has none; do not go looking for one.
- Delete `.banner-actions` from `solutions/index.astro`.
- **Keep** page-specific modifiers where they are: `.page-banner .hero-inner { gap: ... }`
  in insights, `.page-banner .hl { white-space: nowrap; }` in industries.
- **Specificity note:** `meet-the-team.astro`'s block is Astro-**scoped**, so its
  `.page-banner` currently carries the extra `data-astro-cid` attribute and
  therefore higher specificity than the new global rule. Nothing else declares
  those two padding properties for `.page-banner`, so the move is
  behavior-preserving, but this is the one page to check first.
- **This move is behavior-preserving by design.** The values `.85rem` etc. are
  copied verbatim and NOT retokenized. See "Deferred work" below.
- Verify: compare computed `padding-top` / `padding-bottom` on `.page-banner`
  before and after on all four pages.

### Step 2: dedupe the bento family into `global.css`

Two pages define the same selectors with **drifted** breakpoints (980px vs 860px).
They do not currently collide, because Astro chunks CSS per page, but consolidating
them forces a choice. Do not add a third definition.

- Add the canonical family to `global.css`: `.bento`, `.bento-card`,
  `.bento-card h3`, `.bento-card p`, `.b-wide`, `.b-cell`, plus one canonical
  collapse breakpoint.
- **Choose 980px** as canonical (the site's existing responsive step, used by
  `.svc-grid` and `.faq-grid`).
- Delete the family from `solutions/index.astro:286-292` and its bento arm of the
  980px media query. Leave `.svc-grid` and `.faq-grid` in that query.
- Delete the family from `prototype-icons.astro:76-91`, **including** its 860px query.
- **This changes the prototype page between 861px and 980px**, where it currently
  stays six columns and would now collapse. That contradicts "visually unchanged."
  Preserve it with an explicit page-scoped override so the claim stays honest:
  ```css
  /* prototype only: it kept a tighter collapse than the site standard */
  @media (max-width: 980px) and (min-width: 861px) { #proto .bento { grid-template-columns: repeat(6, 1fr); } #proto .b-wide { grid-column: span 4; } #proto .b-cell { grid-column: span 2; } }
  ```
  Alternatively, get the user to say the prototype may follow the site standard,
  and drop the override. It is a throwaway page, so this is a cheap decision, but
  it must be a decision and not an accident.
- Scope the prototype's extra geometry under `#proto`: the `position: relative;
  overflow: hidden` on `.b-cell` and the `z-index` on `h3`/`p` are prototype-only
  (they exist to clip the watermark icons at lines 103-110) and must not become
  site-wide.
- **Leave in solutions**: `.input-flow`, `.input-stack`, `.input-node`,
  `.flow-arrow`, `.input-video` and their 560px query. One caller.
- Verify: `/solutions/` and `/prototype-icons/` bento visually unchanged, and
  explicitly compare at **860px, 900px and 980px**, the band where the conflict lives.

### Step 3: create `src/pages/geo/index.astro`, shell and hero

- `BaseLayout` with `title="Binumi · AI visibility grader"`, description from the lead.
- Pass **no** `current` prop. `/geo/` is not one of the three nav sections.
- Import `VideoFrame`.
- Hero, following `solutions/index.astro:44-67` plus an eyebrow:
  ```astro
  <section class="page-banner">
    <div class="container hero-inner">
      <span class="eyebrow"><span class="dot"></span>AI visibility</span>
      <h1>Buyers are asking ChatGPT before they ask you</h1>
      <p class="lead">Board conversations now start with what AI recommends, not just what shows up in search. If the engines can't read your expertise, they can't recommend it, and the deal never reaches your pipeline. Most visibility checkers stop at the score. We built the team that fixes what the score finds.</p>
      <div class="banner-actions">
        <a class="btn btn-primary" href="#grader">See what becomes possible
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </a>
      </div>
      <VideoFrame videoSrc="..." poster="..." label="..." autoplay muted loop />
    </div>
  </section>
  ```
- **Genuine deviation:** no other subpage hero carries an eyebrow. The user asked
  for a kicker, so this is deliberate, but it sets a precedent.
- Use a **scoped** `<style>` block for this page unless a rule must be global. Do
  not reach for `is:global` by habit.

### Step 4: mechanism block, the bento

`<section class="section">` > `.container.stack` > `.intro` (h2 + `p.subtitle`) > `.bento.reveal`:

- h2 `Video helps AI visibility, or it actively hurts it`
- `p.subtitle` as supplied
- `.bento-card.b-wide`, copy only, h3 `We build the fix, not just the score`
- Four `.bento-card.b-cell`, each `.icon` + h3 + p:
  `Video, built to be read` / `Transcription done properly` / `Metadata, corrected` / `Run across every property`
- **Every Material Symbols icon name used must already be in the `icon_names`
  subset in `BaseLayout.astro`.** Check, and extend the list if not, or the glyph
  renders as literal ligature text.

### Step 5: the grader section, and the message contract

```astro
<section class="section" id="grader">
  <div class="container stack">
    <div class="intro">
      <h2>Check what AI can currently see</h2>
      <p class="subtitle">Enter a URL. The grader reads it the way ChatGPT, Perplexity and Google AI do.</p>
    </div>
    <div class="geo-embed">
      <iframe
        src="https://geo.binumi.com/?embed=1"
        title="Binumi AI visibility grader"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation-by-user-activation"></iframe>
      <noscript><p>The grader needs JavaScript. <a href="https://geo.binumi.com/">Open it directly</a>.</p></noscript>
      <p class="geo-embed-fallback">Trouble loading? <a href="https://geo.binumi.com/">Open the grader directly</a>, or <a href="/contact/">talk to us instead</a>.</p>
    </div>
  </div>
</section>
```

- `.geo-embed` is page-scoped CSS: `--surface` fill, `1px solid var(--cyan)`,
  `border-radius: var(--r-card)`, padding, iframe at `width:100%`, `border:0`,
  generous `min-height`.
- **`loading="lazy"` plus `autofocus` inside the frame is a bug.** The embed
  variant must NOT carry `autofocus` on its first input, or a lazy frame
  initializing mid-scroll yanks the page. Remove it in step 8.
- **The sandbox will trap the embed's own outbound links.** The retained consent
  line and legal notice link to `binumi.com/privacy-policy/`. Under a sandbox with
  no top-navigation permission, clicking one replaces the grader *inside the frame*
  and kills the height handshake. Hence
  `allow-top-navigation-by-user-activation` above, plus `target="_top"` on those
  trusted links in the embed variant. Test it; do not assume it.
- **Height handshake**, all four conditions required:
  1. namespaced message, e.g. `{ type: 'binumi:geo:height', height: <number> }`
  2. receiver checks `event.origin === 'https://geo.binumi.com'` **and**
     `event.source === iframe.contentWindow`
  3. validate the payload is a finite number and **clamp** it to a sane range
  4. sender reports via `ResizeObserver` on `document.body`, not just on load and
     after `render()`. Errors, network failures, late font reflow and responsive
     wrapping all change height too.
- `ponytail:` if the handshake proves fiddly, ship a fixed `min-height: 620px`
  first. A scrollbar inside the frame is survivable; two headers are not.

### Step 6: results block and honesty couplet

Results, three `.bento-card.b-cell` in a `.bento` (three cells at span 2 fill one
six-column row exactly): `Where you stand today`, `What's missing`, `What to fix first`.

Honesty block, reusing `industries/[industry].astro:56-69`:

```astro
<div class="couplet">
  <p class="lead-line">Worth being straight about what this traffic actually is.</p>
  <div class="couplet-grid reveal">
    <div class="card"><span class="kicker">Smaller, but pre-qualified</span><p>...</p></div>
    <div class="card"><span class="kicker">The nearer risk is silence</span><p>...</p></div>
  </div>
</div>
```

`.close-line` **is** styled (`global.css:559`, as `.couplet .close-line`). The
supplied copy has no close line, so omit the element. It is available if wanted.

### Step 7: closing CTA and nav

- `.cta-card` exactly as `industries/[industry].astro:125-138`, which is the
  **no-lead-paragraph** variant and matches this copy exactly. Reuse the existing
  shared background video
  `https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__e9fd886d8dacac140457e375d606c8a0_h169.mp4`.
  No new asset needed, and **this is an established pattern, not a deviation.**
- h2 `What would it change if AI recommended you first?`, button
  `Start your proof of value` to `/contact/`.
- Nav: `current` has no slot for `/geo/`, and adding a fourth top-level item is a
  navigation decision. **Do not add it to the nav here.** But the page must not
  ship orphaned: add at least one internal link to `/geo/` from `/solutions/`, and
  add the page to `public/llms.txt`, which is manually curated.

### Step 8: grader repo, the `embed` variant (SEPARATE REPO, SEPARATE COMMIT)

Blocked on section 0. Then:

- Extend `variant` to `'internal' | 'public' | 'embed'`.
- **Introduce `publicLike` and route every endpoint and disclosure gate through
  it.** `isPublic` keeps only the "render site chrome" meaning. This is the
  step's whole risk; do it first.
- `embed` renders form + result island + story + legal; omits header, footer,
  cookie notice, closing CTA and the hero eyebrow/H1/lead. Transparent background.
- Remove `autofocus` in the embed variant.
- Ensure the result region is announced: a live region or focus management, since
  the result appears without navigation.
- `api/index.ts`: export **two** precomputed artifacts, `publicPageHtml` and
  `embedPageHtml`, and pick between them by parsing the query for exactly
  `embed=1`. Compute `content-length` per response rather than once at module
  load, and apply `X-Robots-Tag: noindex` only on the embed response. Test both
  through the real handler, not through `consoleHtml` in isolation.
  (Do **not** reach for `Vary`: it varies caches by request *header*, not by query
  string. Distinct query strings are already distinct cache keys.)
- **`Content-Security-Policy: frame-ancestors`, emitted from the HANDLERS, not
  from `vercel.json` routes.** There is currently no frame-ancestors at all, so
  the lead form is frameable by anyone: a clickjacking and impersonation surface.

  Two traps, both of which a route-based header walks into:
  1. Putting the allowlist on the existing global `/(.*)` matcher would newly
     permit `binumi.com` to frame the password-gated `/internal` console.
  2. Scoping it to `/` and `/internal` is **bypassable**. `vercel.json` only
     *rewrites* `/` to `/api/index` and `/internal` to `/api/internal`; Vercel
     still serves those functions at their own paths, so `/api/index` and
     `/api/internal` remain directly reachable and would carry no CSP. A rewrite
     hides nothing.

  So set the header inside the handler's own `res.writeHead`, where it applies on
  every path that reaches that function: approved Binumi origins in `api/index.ts`,
  and `frame-ancestors 'none'` in `api/internal.ts`. **Test all four URLs**: `/`,
  `/api/index`, `/internal`, `/api/internal`.
- Add the `ResizeObserver` height reporter, posting only to the `binumi.com` origin.
- Tests mirroring the public-variant ones: embed carries no chrome, still posts to
  `/api/grade`, still ships no per-check rendering code (FLW-75), still emits no
  em-dash, and **asserts the tier via the real exported artifact**.

---

## 4. Open questions and risks

1. **Hero video asset.** `public/` contains **no video files**, only poster JPGs.
   All video is CloudFront under opaque hashed names, and there is no GEO video.
   Reuse the solutions hero (`1__79e216f079172a5949cf8e11095f67a5_h169.mp4` +
   `/solutions-hero-poster.jpg`) as a flagged placeholder, or the user supplies a
   new URL and poster. **Needs a decision.**
2. **Hero CTA target.** Assumed to scroll to `#grader`. Confirm.
3. **Is `geo.binumi.com` deployed?** If not, the iframe is an empty or
   browser-error panel in production. **Deploy and smoke-test the grader first,
   then publish `/geo/`.** The fallback link must not point at the same dead deploy.
4. **Consent and privacy, needs the privacy owner.** `CookieConsent.astro:37`
   stores acceptance in the **parent origin only**; the iframe cannot read it, so
   parent consent does not cover the embed. Keep the embed free of non-essential
   storage. Do not add the HubSpot tracker to the embed. Document every request,
   cookie and lead recipient the embed makes, and get lawful-basis sign-off.
5. **SEO duplication.** `/geo/` and `geo.binumi.com` both target AI visibility.
   On the FLW-80 branch the standalone grader emits a canonical pointing at
   itself, and no robots metadata. Decide the standalone grader's canonical
   policy and `noindex` the embed response. Tracked as release gate 1 in section 0.
6. **Cross-origin autofill.** Third-party-origin iframe forms have known autofill
   limitations, and strict privacy modes may block storage entirely. Test Chrome,
   Safari, Firefox, mobile and a strict-privacy profile.
7. **Promotion blast radius.** Steps 1 and 2 touch five existing pages and
   consolidate two drifted duplicates of the same rules. Verify visually, not just
   by build.
8. **Copy claims.** `brand.md` forbids borrowed third-party statistics. Card 1's
   "a smaller share of total traffic than the current hype suggests" carries no
   source. It reads as judgment rather than a figure, so it likely passes the
   figure gate. Confirm.

## 5. House-rules check on the supplied copy

- **Em-dashes:** the supplied card list uses an em-dash character as a title/body
  separator. In markup these become `<h3>` and `<p>`, so nothing renders. No
  violation, provided no agent transcribes the dash into the page. (This document
  deliberately contains no em-dash character, only this description of one.)
- **American spelling on `/geo/` itself:** clean. **Kill list:** clean.
- **British spelling inside the iframe:** the grader's legal notice is the
  client's verbatim copy and renders `organisation` and `optimisation`. It is
  pinned by a test in the grader repo. So a visitor on `/geo/` WILL see British
  spelling, and any claim that the page is clean must say "excluding the embedded
  grader's verbatim legal notice." Needs either an explicit legal exception or an
  Americanized approved notice from the client.
- **Two copy claims overstate what the grader does.** Flagging, not changing, the
  copy is locked. (a) "reads it the way ChatGPT, Perplexity and Google AI do": the
  grader uses Binumi's own crawler, rubric and an OpenAI adapter. It checks
  signals answer engines can use; it is not those engines. (b) "AI systems don't
  watch your videos" is absolute. Both are the user's call.
- **Headings ending in a full stop:** the site standard is a trailing full stop
  (`A platform, with a team behind it.`). None of the supplied H2s or the H1 have
  one. Copy is locked, so ship as given, but this page will read differently from
  the rest of the site. Note that `privacy-policy` and `terms-of-use` headings
  already break the convention, so it is a strong norm, not a universal rule.

## 6. Deferred work, deliberately not in this change

- Retokenizing the promoted spacing values (`.85rem`, `1rem`, `1.9rem`) to design
  tokens. Correct per `CLAUDE.md`, but a move that also changes values makes
  "verify the pages are visually unchanged" unfalsifiable. Separate change.
- Removing the pre-existing em-dashes in `prototype-icons.astro`.

## 7. Verification

- `npm run build` passes, no new warnings.
- `/geo/` at 1440, 1100, 980, 900, 860, 720, 390px.
- Five touched pages visually unchanged: `/solutions/`, `/insights/`,
  `/meet-the-team/`, `/industries/`, `/prototype-icons/`. Compare **computed
  styles**, not just screenshots, for `.page-banner` padding and `.bento` columns.
- Em-dash and British-spelling greps run against **changed files and `/geo/`'s
  built output only**, because `dist/` already fails on `prototype-icons`.
- Exactly one navy island on `/geo/` **including inside the iframe**. This needs
  the FLW-80 branch committed; on `main` the grader result is still `.island-dark`.
- Every Material Symbols name used is in `BaseLayout.astro`'s `icon_names`.
- Grader repo: `npm test`, `npm run typecheck`, `npm run lint` all pass.
- Two-origin browser test: keyboard from the logo through the iframe form to the
  closing CTA with no focus trap; result announced to a screen reader.
- Confirm `frame-ancestors` actually blocks framing from a non-Binumi origin.
