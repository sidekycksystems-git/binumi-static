# HANDOFF

Session handoff for the Binumi GEO work. Two repos, two branches, **everything
uncommitted**. Read this top to bottom before touching anything.

---

## 1. The single most important fact

**Nothing is committed. In either repo.** Both branches point at the same commit
as their `main`. All the work below exists only as modified and untracked files in
two worktrees. One `rm -rf` or an absent-minded `git checkout` loses all of it.

There is also a **third** worktree, FLW-77, with its own ~471 lines of uncommitted
work touching the *same file* as repo B below. It was live in another session and
I was told to ignore it. It will conflict.

**First action in the new thread: decide whether to commit. Ask the user.**

---

## 2. What was asked, across the session

1. Start: linked Linear issue **FLW-80**, "Update public-facing page content and
   layout." Turned out to be **Canceled**, and its target page was in a different
   repo. The user chose to proceed anyway, independently of the in-flight FLW-77
   work.
2. Then: build a **`/geo/` landing page on binumi.com**, with locked copy the user
   supplied, using the existing subpage design structure. Requested workflow was
   plan subagent, then a Codex review, then implementation by an agent team.

---

## 3. Repo A: `binumi-static` (the Astro marketing site)

Worktree: `/Users/ky/orca/workspaces/binumi-static/update-public-face`
Branch: `sidekycksystems/flw-80-update-public-facing-page-content-and-layout`

```
 M src/pages/industries/index.astro
 M src/pages/insights/index.astro
 M src/pages/meet-the-team.astro
 M src/pages/prototype-icons.astro
 M src/pages/solutions/index.astro
 M src/styles/global.css
?? PLAN.md
?? PLAN-REVIEW-LOG.md
?? src/pages/geo/
```

### What was built

- **`src/pages/geo/index.astro`** (new). Hero (H1, lead, CTA to `#grader`, video
  frame), mechanism bento (1 wide + 4 cells), grader iframe section, results row
  (3 cells), honesty couplet, navy closing CTA. Page-scoped `<style>` for
  `.geo-embed` only. Inline script for the iframe height handshake.
  - **The hero eyebrow was removed after the fact**, by the user, directly on disk.
    I had built it as `<span class="eyebrow"><span class="dot"></span>AI visibility</span>`
    per the supplied copy's "Kicker: AI visibility", and had flagged at the time
    that no other subpage hero carries one. Removing it restores consistency with
    the rest of the site. Net effect: **the copy deck's kicker no longer appears on
    the page.** If that was not intended, put it back. Build still passes, 34 pages.
- **`global.css`**: promoted `.page-banner` and `.banner-actions` (they were
  character-for-character duplicates in 4 page style blocks). Consolidated the
  `.bento` family, which existed as two copies that had **drifted** on the collapse
  breakpoint. Canonical is now 980px.
- **4 pages**: duplicate `.page-banner` deleted.
- **`prototype-icons.astro`**: bento family removed; its prototype-only clipping
  (`position/overflow/z-index`, needed for the watermark variants) re-added
  `#proto`-scoped, plus a `#proto` override preserving its original 860px collapse.

### Verified, not assumed

- `npm run build` passes, 34 pages (was 33).
- Built `/geo/`: zero em-dashes, zero en-dashes, zero British spellings, exactly
  one element with a navy background.
- DOM: 4 H2s, 2 bentos, 8 bento-cards, 1 couplet, 1 cta-card, hero CTA to `#grader`.
  (Checked before the eyebrow was removed; that removal does not affect these counts,
  and the build was re-run clean afterwards.)
- **Regression check was done properly**: built pristine `HEAD` into a throwaway
  worktree and diffed the emitted CSS. Confirmed the prototype override lands
  correctly (6 cols above 980, `#proto` wins on ID specificity 861 to 980, global
  collapse below 861). Behavior preserved.
  - Caveat for whoever repeats this: my first CSS-diff parser mis-attributed
    `@media` context and made it look like 5 pages regressed. They had not. Read
    the raw emitted CSS, do not trust a naive regex over minified CSS.

### NOT verified

- **Desktop rendering was never seen.** Chrome refused every `resize_window` call
  and stayed pinned at a 406px viewport for the whole session. Only mobile was
  eyeballed. Desktop rests on the CSS being byte-identical to the known-good
  solutions page, which is reasoning, not observation. **Look at it at 1440px.**

### Decisions the user already made, do not re-ask

- Hero video: reuse the solutions hero CloudFront file with
  `/solutions-hero-poster.jpg`. Marked in-file as a placeholder. `public/` holds
  **no video at all**, only posters; all video is CloudFront with opaque hashed names.
- Hero CTA `See what becomes possible` scrolls to `#grader`.
- Prototype page keeps its 860px collapse via the `#proto` override.

---

## 4. Repo B: `binumi-lead-gen-app` (the grader, a separate deploy)

Worktree: `~/Git Hub/SK_Services/binumi-lead-gen-app/.claude/worktrees/flw-80-page-content`
Branch: `sidekycksystems/flw-80-update-public-facing-page-content-and-layout`

```
 M src/api/console-html.ts
 M test/api/console-html.test.ts
?? src/api/public-shell.ts
```

This is the original FLW-80 work: giving the public grader page at
`geo.binumi.com` the full binumi.com chrome (header with mega-menu, footer, cookie
notice, hero with visible form labels, navy closing CTA, legal notice repositioned).

Beyond transcription, two spec violations were fixed: the score block was navy and
so is the CTA (two navy islands, spec allows one), so the public score now uses the
light island; and the band traffic-light (`BAND_CSS`) was dropped on public.

Verified: typecheck clean, lint clean, **776/776 tests pass** (6 new). Internal
console output diffed against `main` byte for byte: **comments only**, no rule or
markup changed.

---

## 5. The plan, and the Codex review

- **`PLAN.md`** in repo A. Full implementation plan for `/geo/`.
- **`PLAN-REVIEW-LOG.md`** in repo A. The complete 3-round adversarial transcript.
  This is the valuable artifact; read it before changing the plan's decisions.

Codex session id, resumable: `01a02c15-344d-7281-8688-ad814b746394`

Outcome was **cap reached, not a clean APPROVED**. Round 3 ended on `REVISE` with
one blocker, which was verified and fixed *after* the round, so **that fix is
itself unreviewed**. No unresolved disagreements between the two models remain.

What the argument caught, all verified against the repo before acting:

1. **A latent FLW-75 information-disclosure bug.** `isPublic = opts.variant === 'public'`
   gates the POST endpoint, the per-check renderer and lead capture. Adding
   `'embed'` to the union without splitting that predicate would have served the
   **internal tier inside a public marketing page**.
2. **Clickjacking on the lead form.** `vercel.json` has no `frame-ancestors` at all.
   Then it caught the bypass in the first proposed fix: Vercel *rewrites* do not
   hide destinations, so `/api/index` stays directly frameable no matter what you
   put on `/`. The header must come from the handlers.
3. **Four factual errors in my own citations.** Two asserted the opposite of the
   truth (`.close-line` IS styled at `global.css:559`; the industries closing CTA
   already omits its lead paragraph).

One point was pushed back on and Codex conceded: retokenizing the promoted spacing
values stays deferred, because a move that also changes values makes "verify
nothing moved" unfalsifiable.

---

## 5b. Later pass: revenue-conversion fixes on `/geo/`

A follow-up brief asked for four conversion fixes. Three shipped, one is blocked.

- **Done, hero CTA label** is now "Check your score". Its `href` was **already**
  `#grader`; the brief's claim that it jumped to `#cta` was wrong.
- **Done, honesty block moved** above the grader. Order is now hero, mechanism,
  honesty, grader, results, close. Verified in the built DOM.
- **Done, next-step line** added as `.form-note` under the iframe, with `FORM_NOTE`
  in frontmatter so the rationale comment does not ship to production HTML.
- **BLOCKED, the partial-result gate.** See below. Do not implement without a
  decision from Kevin.

### Why the partial-result gate is blocked

The brief wants: URL alone returns a partial score, then email unlocks "the ranked
fix list / full breakdown". Two hard conflicts, both verified in the grader repo:

1. **FLW-75 forbids it.** The public tier never returns the six-category breakdown,
   with or without an email. `grader-gate.ts:815` states the reason: "the
   six-category breakdown IS the brief, and the brief is what the business sells."
   `toPublicSummary` does not even carry `categoryScores`, and tests assert the
   rendering code is absent from the page. So there is no "full breakdown" for an
   email to unlock. Building one reverses a signed-off product decision.
2. **The email gate is cost control, not friction by accident.** `api/grade.ts:154`:
   "Every submission is a named lead with an email, so a paid run is worth its cost:
   no daily cap needed." Grading on URL alone exposes a paid endpoint (OpenAI plus
   PageSpeed plus crawl) to anonymous traffic. Removing the gate means adding a rate
   limit and a per-day cap, which is why `full-cap.ts` exists.

The engine itself *can* run on URL alone (`src/cli.ts` does exactly that), so this
is a product and pricing decision, not a technical blocker.

### Why the next-step line does not mention email

**The grader sends no email. At all.** No mail dependency, no SMTP, no transactional
provider anywhere in the repo. It renders the score in place and files the lead into
HubSpot; the breakdown is a human follow-up. The brief's placeholder, "Full breakdown
sent to your inbox in minutes", would have been false on both the mechanism and the
timing. The brief authorised replacing it if the flow differed, so it was replaced
with a line that is true. If an automated send is later built, update `FORM_NOTE`.

### Spelling: resolved, with one carve-out still open

A brief asked for British spelling; `CLAUDE.md` rule 2 mandates American and the site
is `lang="en-US"`. Kevin ruled: **American**, and specifically "the grader's legal
notice only" for the legal text.

Worth knowing before anyone re-runs this audit: a first pass over-reported, because
the regex matched **"specialist"**, which is spelled identically in both. Marketing
copy across the whole site has **zero** British spellings and always did.

Actioned:

- `global.css`: 5 instances in **code comments** Americanized (`colour` x2,
  `centres`/`centred`/`centring` x3). Invisible to users.
- Grader's `PUBLIC_LEGAL_HTML`: `optimisation` to `optimization`, `organisation` to
  `organization`, per `geo-grader-page-spec.md` section 11. The doc comment that
  previously said "not ours to respell" was rewritten to record the reversal, and the
  test that pinned the British spelling now asserts **both directions**, so neither a
  silent revert nor a fresh paste of the original can pass. 776/776 still green.
  Verified against the real exported `publicPageHtml`, not a rebuilt string.

**Still open, deliberately not touched:** the site's own legal pages.
`terms-of-use.astro` has **61** instances, mostly `Licence`, and is governed by
English law ("United Kingdom" at :89, "England"/"jurisdiction" at :510-512).
`privacy-policy.astro` has **6** and carries GDPR "supervisory authority" language.
In UK English `licence` is the correct noun form. Americanizing a UK entity's legal
documents is a legal decision, not a copy pass. Needs whoever owns that copy.

**Also needs recording:** the grader notice is the client's supplied legal text. A
respelling is not a rewrite, but it is an edit to client legal copy and should get
the client's sign-off on the record before launch.

---

## 6. What is NOT done: step 8

**The `embed` variant of the grader does not exist.** `/geo/` iframes
`https://geo.binumi.com/?embed=1`, and that query param is currently ignored.

`geo.binumi.com` **is live today** and the iframe does load. It serves the
pre-FLW-80 bare page, so there is no double-header right now, by accident. **The
moment repo B's chrome deploys, `/geo/` gets two headers and two footers until step
8 lands. Those two deploys are coupled.**

Step 8 is fully specified in `PLAN.md`. The essentials:

- Three states, not a renamed boolean. `publicLike` (public + embed) drives the
  endpoint, lead fields, FLW-75 gating, story and legal. Full-public drives chrome.
  `embed` adds only framing behavior.
- Extract `PUBLIC_FORM_HTML` out of `PUBLIC_HERO_HTML`; split `PUBLIC_SHELL_CSS`
  into a tool half and a chrome half.
- `api/index.ts`: two precomputed artifacts, parse exactly `embed=1`, per-response
  `content-length`, conditional `X-Robots-Tag: noindex`. Do not reach for `Vary`.
- CSP `frame-ancestors` **from the handlers**, not from `vercel.json` routes. Test
  all four URLs: `/`, `/api/index`, `/internal`, `/api/internal`.
- Remove `autofocus` in the embed (it fights the parent's `loading="lazy"`).
- The sandbox will trap the embed's own outbound links to binumi.com. Needs
  `allow-top-navigation-by-user-activation` (already on the parent iframe) plus
  `target="_top"` on those links.
- `ResizeObserver` height reporter posting `{ type: 'binumi:geo:height', height }`
  to the binumi.com origin. The parent listener is already written and validates
  origin, `event.source`, type, finiteness and clamps to 460-4000px.

---

## 7. Release gates and open questions

Blocking the `/geo/` publish:

1. **Canonical ownership.** The standalone grader self-canonicalizes to
   `geo.binumi.com`; `BaseLayout` canonicalizes `/geo/` to itself. Two indexable
   pages competing on one intent. `noindex` on `?embed=1` does not fix it.
2. **Privacy sign-off.** `CookieConsent.astro:37` stores consent in the parent
   origin only; the iframe cannot read it, so parent consent does not cover the
   embed. Keep the embed free of non-essential storage.
3. **Deploy order.** Grader first, smoke-test, then publish `/geo/`.

Other open items:

- **`/geo/` has no nav entry** and is currently orphaned. `Header.astro`'s `current`
  prop is a union of `'solution' | 'industries' | 'insights'` only; adding a fourth
  top-level item is a navigation decision nobody has taken. Needs at least one
  internal link plus an entry in the manually curated `public/llms.txt`.
- **Two copy claims overstate the product**, flagged and deliberately NOT changed
  because the copy is locked: "reads it the way ChatGPT, Perplexity and Google AI
  do" (it uses Binumi's own crawler and rubric plus an OpenAI adapter), and the
  absolute "AI systems don't watch your videos."
- **The embed renders British spellings.** The grader's legal notice is the
  client's verbatim copy and is pinned by a test. So `/geo/` will display
  `organisation` and `optimisation`, and any compliance claim must say so.
- **Headings do not end in a full stop**, unlike the rest of the site. Copy is
  locked; shipped as given.
- Pre-existing, not caused here: `prototype-icons.astro` contains 4 em-dashes
  (lines 2, 126, 127, 137). Keep the em-dash gate scoped to changed files, or
  `dist/` will always fail it.

---

## 8. Environment notes that cost time

- **Agent spawning is broken in this session.** Every `Agent` call failed with
  "Could not determine current tmux pane/window". The intended 3-agent fan-out was
  abandoned and the work done directly. Retry in the new thread; it may be fine.
- **A `Plan` subagent has no Write tool.** It ran 29 minutes producing nothing
  because it was asked to write `PLAN.md`. It was killed. If you use that agent
  type, have it return text.
- **Chrome will not resize.** Pinned at 406px all session.
- The grader worktree's `.env` pins `PORT=3000` / `HOST=0.0.0.0`, and 3000 was
  already taken. Override both.

### Background processes still running

Both were stopped at the end of the session. Nothing is left running.

To bring them back:

| What | Command | Where |
| --- | --- | --- |
| Astro dev server | `npm run dev` | repo A, serves http://localhost:4321/ |
| Grader dev server | `PORT=8788 HOST=127.0.0.1 npm run dev:public` | repo B worktree |

---

## 9. Suggested first moves

1. Ask the user whether to commit both branches. Nothing is safe until then.
2. Look at `/geo/` at 1440px, which nobody has done.
3. Decide the FLW-77 collision: it rewrites the same `console-html.ts`.
4. Then step 8, working from `PLAN.md`.
