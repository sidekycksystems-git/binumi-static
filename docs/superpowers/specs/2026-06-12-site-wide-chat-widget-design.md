# Site-wide chat widget (visual shell), design

Date: 2026-06-12
Status: approved by KY (visual shell now, real engine later; hero chat bar removed)

## Purpose

Give every page a Salesforce-style chat entry point: a floating launcher that opens
a right-hand panel, in place of the decorative chat bar that currently sits only in
the home page hero. The widget is a polished visual shell with no backend. It must
route visitors to real destinations today and be ready to wire to a real engine
(guided flow or AI) later.

## Decisions taken

1. **Engine: none yet.** The panel is a visual shell. The send action produces one
   honest canned reply; an "Early preview" note sets expectations.
2. **Hero chat bar: removed.** The home hero's single bold action becomes a primary
   "Start your proof of value" button linking to `/how-it-works/`.
3. **Implementation: plain Astro component.** No framework island, no third-party
   embed, no new dependencies.

## Architecture

- New component `src/components/ChatWidget.astro`, rendered once in
  `src/layouts/BaseLayout.astro` after `<Footer />`, so it appears on every page.
- All behaviour is vanilla inline JS inside the component (matching the repo's
  existing inline-script pattern in `BaseLayout.astro`).
- Styles live in `src/styles/global.css` under a `.bnm-chat` namespace, reusing the
  existing design tokens (palette custom properties, radii, type scale). The widget
  is shared, so its CSS is shared; nothing page-scoped.

## Component anatomy

**Launcher** (`.bnm-chat-launcher`): fixed bottom-right pill on every page. Cyan
brand treatment, sparkle icon (same glyph as the old chat bar), label "Ask Binumi".
Collapses to a round icon-only button on narrow screens. Hidden while the panel is
open. `aria-expanded` and `aria-controls` wired to the panel.

**Panel** (`.bnm-chat-panel`): fixed right-hand drawer, about 400px wide and full
height on desktop, full-screen on mobile. `--panel` background, brand border and
shadow, slides in from the right. Contents, top to bottom:

1. Header row: "binumi." wordmark styling plus the label "Video assistant", and a
   close button. (Not "AI-powered" anything: kill list.)
2. Video frame: the assistant's face is video, using the hero background film embed
   (muted, looping, no controls). The iframe `src` is applied only on first open
   (lazy), so closed-panel pages load nothing extra.
3. Greeting bubble, brand voice, closes on a question:
   "Hello. The best video is already inside your business. Curious what Binumi
   could make from what you already have?"
4. "Ask me things like:" with three suggestion chips that pre-fill the input:
   - "What could Binumi make for us?"
   - "How does the proof of value work?"
   - "How fast can we turn what we have into video?"
5. Two CTA buttons to real destinations: primary "Start your proof of value" →
   `/how-it-works/`; secondary "See why it works" → `/why-it-works/`.
6. Input bar (reusing the `.chatbar` look) with a send button. On send, the
   visitor's message renders as a bubble, followed by one canned reply:
   "Thanks. Our assistant is still in preview, so it cannot answer in full here
   yet. The fastest way to see what Binumi could make for you is a proof of value:
   our team shows you, using what your business already has. Shall we start one?"
7. Microcopy under the input: "Early preview. Replies are limited for now."

## Behaviour

- Closed by default on every page load; no persistence of open state.
- Open: launcher click. Close: close button, Esc key.
- Focus moves to the panel's close button on open and returns to the launcher on
  close. The panel is `aria-hidden` and inert to tabbing while closed.
- Animations (slide, fade) respect `prefers-reduced-motion`.
- Body scroll locks while the panel is open on mobile widths.
- No network calls, no analytics, no data leaves the page.

## Home hero change

In `src/pages/index.astro`, remove the `.chatbar` block and `.chatbar-note` from
`.hero-cta`. Replace with a primary button "Start your proof of value" (arrow icon,
same pattern as the closing CTA card) linking to `/how-it-works/`, plus the quiet
microcopy line "No sign-up. See what Binumi could make for you." The `.chatbar` CSS
remains in `global.css` because the panel's input bar reuses it.

## Copy rules (binding)

British spelling, no em-dashes, no kill-list words (no "AI-powered", no "growth
engine", no "solution"). The greeting opens on what becomes possible and closes on
a question. Tone about 6 out of 10.

## Verification

`npm run dev`, then check home, why-it-works, how-it-works and an insights article:
launcher present and panel opens on each; suggestion chips fill the input; send
produces the canned exchange; CTAs navigate; Esc closes; mobile width (about
380px) gets the full-screen panel and scroll lock; console clean; hero shows the
new button and no chat bar.

## Out of scope

Real chat engine (guided flow or AI via serverless function), open-state
persistence across pages, chat history, analytics events. The shell's DOM and JS
are structured so a later engine only replaces the send handler.
