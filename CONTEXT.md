# CONTEXT, Binumi domain glossary

A living glossary of the project's domain concepts. The architecture vocabulary
(module, interface, seam, depth, leverage, locality) describes *how* the code is
shaped; this file names *what* the site is about. Add a term when a refactor names
a module after a concept that is not yet defined here.

## Industry

A vertical Binumi sells into: FinTech, Insurance, Events, Tech, Consultancy,
Industrials. Each serves at `/why-it-works/<slug>/`. Every industry page is the
same seven-section shape (hero, couplet, problem-proof, use-cases, trust, CTA),
so the structure lives once in the **industry-page module**
(`src/pages/why-it-works/[industry].astro`) and the per-industry content lives in
one **Industry record** (`src/data/industries.ts`). The order of records drives
the **industry switcher**. Events and FinTech are the two interim-proof
industries (no fabricated figures); see `brand.md`/`product.md` for the figure gate.

## Industry switcher

The sub-nav row on every industry page listing all industries, the current one
marked active. Derived from the Industry list and the current slug, not
hand-maintained per page.

## How Binumi works accordion

The five-stage numbered accordion shown on the homepage (`#how`) and the
how-it-works page (`.spine-section`): one stage open at a time, with a nested
Service/Platform bracket rail (cyan Service wraps all five, muted Platform wraps
the middle three). One module, `src/components/HowAccordion.astro`, renders both;
each page passes its own five Stages and an id prefix. The module is
surface-agnostic: the homepage wraps it in a navy `#001437` island (and sets
`--acc-glyph-bg` for the glyph chip), how-it-works renders it on the white page.

## Stage

One step of the How Binumi works accordion: a label, a glyph (inline SVG), and a
body sentence. Homepage stages are Identify, Configure, Deliver, Enable, Scale;
how-it-works stages are Configure, Create, Control, Scale, Partner.

## Insights post

An article in the `insights` content collection (`src/content/insights/*.mdx`):
frontmatter (the head fields) plus an MDX body. One template,
`src/pages/insights/[slug].astro`, renders every published post; the hub and each
card derive from the collection. A post is either `published` (has a body, gets a
page) or `planned` (frontmatter only, shows as a coming-soon card, no page). One
post carries `featured: true` and leads the hub.

## Insight card

The card that represents a post in a listing, rendered by
`src/components/PostCard.astro` in three variants: featured (the hub lead), grid
(a published post, linked), and planned (a coming-soon post, not linked). Takes a
collection entry and reads its data; the navy island background comes from the
shared card rule in `global.css`, the card carries only its own structure.
