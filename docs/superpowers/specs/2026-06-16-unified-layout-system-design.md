# Unified layout system, applied design (reconciled)

- Date: 2026-06-16
- Branch: `unified-layout-system`
- Source: the handed-over "Binumi unified layout system" spec, reconciled against the
  shipped, founder-approved light site.

## Decisions (confirmed before build)
- **Chat: keep the existing floating overlay drawer** (`ChatWidget.astro`). Do NOT build the
  spec's section 4 `.layout-dock` grid column. Only retune the width tokens.
- **Cyan: keep approved tints** (eyebrow pills, icon chips, value-glyph, value-tab active wash,
  trust "creds" panel). Do NOT enforce the section 7 / 11 cyan-scarcity purge this pass.
- **Prose width: narrow measure (720px) applies to legal + privacy only**, via a new
  `--container-legal` token. `--container-sm` (64rem) is left unchanged so the insights article
  keeps its current measure.
- **Rollout: homepage first**, verify against the section 10 / 12 acceptance checks, then
  propagate the shared token changes to the other pages.

## Doctrine overrides (spec said otherwise; repo doctrine wins)
- **American spelling throughout.** The spec's "British spelling" house-law line is rejected
  (CLAUDE.md house rule #2; the brief's British spelling was already reconciled to American).
- **No header re-casing.** The spec's "sentence-case headers" is not an established Binumi rule
  and contradicts the spec's own "structure only, no copy changes" scope.
- **No blanket max-width purge.** `rem` / `ch` readability measures are kept. Only the redundant
  transformation-strip pixel caps are removed.

## Phase 1 changes (homepage + shared tokens)
`src/styles/global.css` `:root`:
- `--container` 1322px -> 1280px
- `--pad-x` 2rem -> `clamp(24px, 5vw, 40px)`
- `--section-y` -> `clamp(3rem, 2rem + 4vw, 5.5rem)`
- `--chat-w` 400px -> 340px; add `--chat-w-min: 320px`; add `@media (max-width:1200px){ :root{ --chat-w: var(--chat-w-min) } }`
- add `--gutter`, `--strip-cards-w`, `--strip-arrow-w`, `--container-legal`

`src/styles/global.css` rules:
- `.transform-strip` -> 3-column grid (cards band | arrow | film); 640px stack.
- `.legal-page` head/body -> `var(--container-legal)` (720px).

`src/pages/index.astro`:
- `.inputs` -> `.strip-cards` (markup), remove the redundant hero strip px caps
  (`.strip-video` flex/max-width, strip `justify-content`/`align-items`).
- replace the legacy `VideoFrame label="Be video first"` with an on-message label.

## Deferred to rollout (phase 2)
- Audit the other pages (why-it-works, how-it-works, insights index + article) under the new
  1280 container / clamp pad-x / section rhythm.
- `.stack` / `--gap` internal section rhythm left as-is (preserve the approved look).
