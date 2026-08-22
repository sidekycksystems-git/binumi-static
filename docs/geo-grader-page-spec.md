# geo.binumi.com, page design spec

Hand-off doc for the agent building the AI Visibility Grader. This describes how the
grader page must look, read and behave so that it is indistinguishable from
`binumi.com`. Everything below is lifted from the live Astro site
(`sidekyckservices/Binumi-Website`), not invented.

The grader logic is yours. The shell, the palette, the nav, the footer, the copy
and the legal block are specified here and should be implemented as written.

---

## 0. House rules (non negotiable)

1. **No em-dashes anywhere.** Commas, colons, full stops. Brand rule, not preference.
2. **American spelling throughout.** organization, optimization, systemize, program.
   The current grader screen says "organisation" and "generative engine optimisation".
   Both must change. Document is `lang="en-US"`.
3. **Light theme only.** No dark mode, no `data-theme`, no theme switch.
4. **Tone about 6 out of 10.** Senior, calm, declarative. Short sentences. No hype.
5. **Kill list:** growth engine, outpace, dominate, crush, supercharge, stay ahead,
   the future of, "AI-powered video creation platform", "limitless possibilities".
6. **Voice rule:** answer "what becomes possible?" before "how does it work?"
   The grader is the mechanism. Being the answer an AI gives is the unlock.

---

## 1. What the page is

| | |
|---|---|
| Host | `https://geo.binumi.com/` (separate app, separate deploy) |
| Parent | `https://binumi.com/` (Astro static site on Vercel) |
| Relationship | Reads as one more page of binumi.com. Same header, same footer, same palette, same type, same buttons. |
| Links | Because it is a subdomain, **every nav and footer link is an absolute URL to `https://binumi.com/...`**. Only the grader's own routes stay on `geo.binumi.com`. |
| States | 1. Input, 2. Grading (loading), 3. Result, 4. Error. All four use the same shell. |

---

## 2. Document shell

Copy this `<head>` exactly, changing only `title`, `description` and `canonical`.

```html
<!doctype html>
<html lang="en-US">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

  <title>Binumi · AI Visibility Grader</title>
  <meta name="description" content="See how visible your organization is to ChatGPT, Claude, Perplexity and other answer engines. Grade your site in under a minute." />
  <link rel="canonical" href="https://geo.binumi.com/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Binumi" />
  <meta property="og:title" content="Binumi · AI Visibility Grader" />
  <meta property="og:description" content="See how visible your organization is to ChatGPT, Claude, Perplexity and other answer engines." />
  <meta property="og:url" content="https://geo.binumi.com/" />
  <meta property="og:image" content="https://binumi.com/binumi-logo.png" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Binumi · AI Visibility Grader" />
  <meta name="twitter:description" content="See how visible your organization is to ChatGPT, Claude, Perplexity and other answer engines." />
  <meta name="twitter:image" content="https://binumi.com/binumi-logo.png" />

  <link rel="icon" type="image/png" href="https://binumi.com/favicon.png" sizes="32x32" />
  <link rel="apple-touch-icon" href="https://binumi.com/favicon.png" />
  <meta name="theme-color" content="#00aeef" />

  <!-- HubSpot tracking, same portal as binumi.com -->
  <script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/26490650.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Roboto:wght@400;500;700&icon_names=arrow_forward,bar_chart,check_circle,close,expand_more,link,lock,menu,search,shield,trending_up,verified_user&display=swap" rel="stylesheet" />
</head>
<body>
  <!-- header, main, footer, cookie notice -->
</body>
</html>
```

Notes:
- Fonts: **Roboto** body, **Inter** headings. Loaded once, as above.
- Icons: **Material Symbols Outlined**, subset by `icon_names`. Add any new icon
  name to that list or it will not render.
- Do **not** ship the site chat widget (`Ask Binumi`) on the grader. The page has one
  job, and the drawer reserves a 400px gutter that fights the result layout.
- Robots: allow indexing, `https://geo.binumi.com/robots.txt` mirroring the parent.

---

## 3. Design tokens

Paste verbatim. This is the whole palette and rhythm system; do not invent values.

```css
:root {
  /* Brand palette (exact hex) */
  --cyan:        #00aeef;  /* primary Binumi blue: links, dots, labels, CTAs, borders */
  --cyan-bright: #0e93c6;  /* emphasis and hover on white */
  --cyan-dark:   #0e93c6;
  --cyan-fill:   rgba(0,174,239,0.10);

  --bg:          #ffffff;
  --navy:        #0b1428;
  --panel:       #f4f6f9;
  --panel-2:     #eef1f6;
  --surface:     #e8eff2;  /* the light island fill */

  --ink:         #0b1428;  /* headings, strong text */
  --body-copy:   #2b3a52;  /* prose */
  --muted:       #5b6b86;  /* secondary text, labels */

  --border:      rgba(11,20,40,0.14);
  --border-soft: rgba(11,20,40,0.08);

  /* Type: major third, ratio 1.25, base 16px */
  --font-body: "Roboto", system-ui, sans-serif;
  --font-head: "Inter", system-ui, sans-serif;
  --t-h1: clamp(2.4rem, 1.6rem + 3.4vw, 3.815rem);
  --t-h2: clamp(2.0rem, 1.5rem + 2.2vw, 3.052rem);
  --t-h3: clamp(1.65rem, 1.4rem + 1.3vw, 2.441rem);
  --t-h4: 1.953rem;
  --t-h5: 1.5625rem;
  --t-h6: 1.25rem;

  /* Rhythm and shape */
  --container: 1280px;
  --container-sm: 64rem;
  --container-legal: 720px;
  --pad-x: clamp(24px, 5vw, 40px);
  --section-y: clamp(2.5rem, 1.5rem + 2vw, 3.5rem);
  --nav-to-hero: clamp(.875rem, .125rem + 2.5vw, 2.375rem);
  --header-h: 63px;
  --gap: clamp(1.75rem, 1.25rem + 1.5vw, 2.75rem);
  --radius: 2px;      /* every card, panel, button: sharp 2px corner */
  --radius-sm: 2px;
  --r-card: var(--radius);
  --r-panel: var(--radius);
}
```

**Rules that go with the tokens**

- Spacing and size come from tokens. Never hard-code a gap, a size or a radius.
- Never define a color twice. One component, one color rule.
- **Islands.** Boxes on the white page are *light islands*: `--surface #e8eff2` fill
  with a **`--cyan` 1px border**, normal on-white text tokens. That is the grader
  form panel, the score panel, every result card.
- **Navy `#001437` is reserved** for the closing CTA card only. Inside a navy island
  the text tokens flip: `--ink #eaf1fb`, `--body-copy #cfdcef`, `--muted #8ea4c6`,
  `--cyan-bright #3fd0ff`, `--border rgba(120,165,225,0.16)`.

---

## 4. Base and layout CSS

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth;
  scroll-padding-top: calc(var(--header-h) + 1rem); }
body { margin: 0; background: var(--bg); color: var(--body-copy);
  font-family: var(--font-body); font-weight: 400; font-size: 1rem; line-height: 1.65;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; overflow-x: hidden; }

h1,h2,h3,h4,h5,h6 { font-family: var(--font-head); font-weight: 700; line-height: 1.1;
  color: var(--ink); margin: 0; letter-spacing: -0.01em; }
h1 { font-size: var(--t-h1); }
h2 { font-size: var(--t-h2); }
h3 { font-size: var(--t-h3); }
p { margin: 0; }
a { color: inherit; text-decoration: none; }
img, svg, video { display: block; max-width: 100%; }
strong { color: var(--ink); font-weight: 600; }
.hl { color: var(--cyan); }               /* the cyan word inside a headline */

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal;
  line-height: 1; font-size: 24px; letter-spacing: normal; text-transform: none;
  display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr;
  vertical-align: middle; flex: 0 0 auto;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  -webkit-font-smoothing: antialiased; user-select: none; }

.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--pad-x); }
.container.sm { max-width: var(--container-sm); }
.section { padding-block: var(--section-y); position: relative; }
.stack { display: flex; flex-direction: column; gap: var(--gap); }
.lead { font-size: 1.125rem; color: var(--muted); }
.eyebrow { display: inline-flex; align-items: center; gap: .55rem; font-family: var(--font-head);
  font-weight: 600; font-size: .8rem; letter-spacing: .14em; text-transform: uppercase;
  color: var(--cyan); padding: .5rem 1rem; border-radius: var(--radius-sm);
  background: var(--cyan-fill); border: 1px solid var(--border); }
.eyebrow .dot { width: .5rem; height: .5rem; border-radius: 999px; background: var(--cyan); }
.rule { height: 1px; border: 0; margin: 0;
  background: linear-gradient(to right, transparent 8%, rgba(11,20,40,.14) 50%, transparent 92%); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  height: 44px; padding: 0 2rem; border-radius: 2px; font-family: var(--font-head);
  font-weight: 500; font-size: 1rem; cursor: pointer; transition: all .3s ease;
  border: 1.5px solid transparent; white-space: nowrap; }
.btn-primary { color: #04121b; background: var(--cyan); }
.btn-primary:hover { background: var(--cyan-bright); }
.btn-outline { color: var(--ink); border-color: var(--border); background: transparent; }
.btn-outline:hover { border-color: var(--cyan); color: var(--cyan); }
.btn-sm { padding: .55rem 1.1rem; font-size: .9rem; }
.btn .material-symbols-outlined { font-size: 18px; }
a:focus-visible, button:focus-visible, input:focus-visible, summary:focus-visible {
  outline: 2px solid var(--cyan); outline-offset: 4px; }

/* Cards / light islands */
.card { background: var(--surface); border: 1px solid var(--cyan); color: var(--body-copy);
  padding: 2rem; border-radius: var(--r-card);
  transition: border-color .25s, transform .25s, background .25s; }
.card:hover { transform: translateY(-3px); border-color: var(--cyan-bright);
  box-shadow: 0 18px 44px -30px rgba(11,20,40,.30); }
.card .kicker { font-family: var(--font-head); font-weight: 700; font-size: .82rem;
  letter-spacing: .1em; text-transform: uppercase; color: var(--cyan); margin-bottom: .9rem; }
.card p { color: var(--muted); font-size: 1rem; }
.icon { width: var(--chip-size, 48px); height: var(--chip-size, 48px); border-radius: var(--radius-sm);
  display: grid; place-items: center; background: var(--cyan-fill); border: 1px solid var(--border);
  color: var(--cyan); margin-bottom: 1.25rem; }
.icon .material-symbols-outlined { font-size: var(--chip-icon, 24px); }

/* Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    scroll-behavior: auto !important; transition-duration: .01ms !important; }
}
```

Static result cards should **not** hover-lift. Kill the transform on them the way the
industry couplet does: `.card { transition: none } .card:hover { transform: none;
border-color: var(--cyan); box-shadow: none }`.

---

## 5. Header (exact markup and CSS)

Sticky, white, 63px, one hairline bottom border. Logo left, nav pill center, two CTAs
right. Industries is a pure-CSS `<details>` mega-menu, five columns, hover on desktop,
native accordion on mobile. It has **no landing page of its own** as a trigger; the
`<summary>` is not a link.

The nav collapses to a hamburger using a **container query on `.navbar`**, not a
viewport media query. Keep it that way.

### 5.1 Markup

```html
<header class="site-header">
  <div class="container navbar">
    <a class="brand" href="https://binumi.com/" aria-label="Binumi home">
      <img src="https://binumi.com/binumi-logo-header.png" alt="Binumi" width="307" height="96" />
    </a>
    <input type="checkbox" id="nav-toggle" class="nav-toggle" />
    <label for="nav-toggle" class="nav-toggle-label" aria-label="Toggle menu">
      <span class="icon-menu material-symbols-outlined" aria-hidden="true">menu</span>
      <span class="icon-close material-symbols-outlined" aria-hidden="true">close</span>
    </label>

    <nav class="nav-links" aria-label="Primary">
      <a href="https://binumi.com/solutions/">Solution</a>

      <details class="nav-item has-menu nav-industries">
        <summary>
          Industries
          <span class="nav-caret material-symbols-outlined" aria-hidden="true">expand_more</span>
        </summary>
        <div class="nav-panel nav-panel--mega">
          <div class="mega-grid">
            <div class="mega-col">
              <p class="mega-heading">Financial &amp; Professional</p>
              <ul class="nav-list">
                <li><a href="https://binumi.com/industries/financial-services/">Financial Services</a></li>
                <li><a href="https://binumi.com/industries/professional-services/">Professional Services</a></li>
              </ul>
            </div>
            <div class="mega-col">
              <p class="mega-heading">Technology &amp; Communications</p>
              <ul class="nav-list">
                <li><a href="https://binumi.com/industries/technology/">Technology &amp; Software</a></li>
                <li><a href="https://binumi.com/industries/telecommunications/">Telecommunications</a></li>
              </ul>
            </div>
            <div class="mega-col">
              <p class="mega-heading">Industry &amp; Infrastructure</p>
              <ul class="nav-list">
                <li><a href="https://binumi.com/industries/industrials/">Industrials &amp; Manufacturing</a></li>
                <li><a href="https://binumi.com/industries/construction/">Construction</a></li>
                <li><a href="https://binumi.com/industries/energy-utilities/">Energy &amp; Utilities</a></li>
                <li><a href="https://binumi.com/industries/automotive/">Automotive</a></li>
              </ul>
            </div>
            <div class="mega-col">
              <p class="mega-heading">Life Sciences &amp; Healthcare</p>
              <ul class="nav-list">
                <li><a href="https://binumi.com/industries/life-sciences/">Life Sciences &amp; Pharma</a></li>
                <li><a href="https://binumi.com/industries/healthcare/">Healthcare</a></li>
              </ul>
            </div>
            <div class="mega-col">
              <p class="mega-heading">Events, Travel, Public &amp; Education</p>
              <ul class="nav-list">
                <li><a href="https://binumi.com/industries/events/">Events</a></li>
                <li><a href="https://binumi.com/industries/real-estate/">Real Estate</a></li>
                <li><a href="https://binumi.com/industries/travel-transport/">Travel, Transport &amp; Hospitality</a></li>
                <li><a href="https://binumi.com/industries/public-sector/">Public Sector</a></li>
                <li><a href="https://binumi.com/industries/education/">Education</a></li>
              </ul>
            </div>
          </div>
          <div class="mega-foot">
            <a class="mega-travels" href="https://binumi.com/solutions/">Not listed? The model travels.</a>
          </div>
        </div>
      </details>

      <a href="https://binumi.com/insights/">Insights</a>

      <div class="nav-links-cta">
        <a class="btn btn-primary btn-sm" href="https://binumi.com/contact/">Start your proof of value</a>
        <a class="btn btn-outline btn-sm" href="https://binumi.com/user/signin">Log in</a>
      </div>
    </nav>

    <div class="nav-cta">
      <a class="btn btn-primary btn-sm" href="https://binumi.com/contact/">Start your proof of value</a>
      <a class="btn btn-outline btn-sm nav-login" href="https://binumi.com/user/signin">Log in</a>
    </div>
  </div>
</header>
```

### 5.2 CSS

```css
.site-header { position: sticky; top: 0; z-index: 50; height: var(--header-h);
  display: flex; align-items: center; background: #ffffff; border-bottom: 1px solid var(--border-soft); }
.site-header > .container { width: 100%; }
.navbar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem;
  container-type: inline-size; container-name: nav; }
.navbar > .brand { justify-self: start; }
.navbar > .nav-cta { justify-self: end; }
.brand { display: inline-flex; align-items: center; }
.brand img { display: block; height: 2rem; width: auto; }

.nav-links { display: flex; align-items: center; gap: .25rem; padding: .35rem .75rem;
  border-radius: var(--radius-sm); background: #ffffff; border: 1px solid #ffffff; backdrop-filter: blur(10px); }
.nav-links a { color: var(--ink); font-size: .95rem; padding: .5rem .85rem;
  border-radius: var(--radius-sm); transition: color .2s; }
.nav-links a:hover, .nav-links a.current { color: var(--cyan); }
.nav-cta { display: flex; align-items: center; gap: .5rem; }
.nav-links-cta { display: none; }
.nav-toggle, .nav-toggle-label { display: none; }
.nav-toggle-label .icon-close { display: none; }

.nav-links summary { list-style: none; cursor: pointer; display: inline-flex; align-items: center;
  gap: .3rem; color: var(--ink); font-size: .95rem; padding: .5rem .85rem;
  border-radius: var(--radius-sm); transition: color .2s; }
.nav-links summary::-webkit-details-marker { display: none; }
.nav-item.has-menu:hover > summary, .nav-item.has-menu:focus-within > summary,
.nav-links summary:hover { color: var(--cyan); }
.nav-caret { font-size: 18px; flex: 0 0 auto; transition: transform .2s ease; }
.nav-panel { background: var(--bg); border: 1px solid var(--border-soft); border-radius: var(--radius);
  box-shadow: 0 18px 50px rgba(11,20,40,.12); padding: 1rem; }
.nav-list { list-style: none; display: flex; flex-direction: column; gap: .1rem; margin: 0; padding: 0; }
.nav-panel a { display: block; color: var(--ink); font-size: .95rem; padding: .5rem .65rem;
  border-radius: var(--radius-sm); transition: color .15s, background .15s; }
.nav-panel a:hover { color: var(--cyan); background: rgba(11,20,40,.04); }
.mega-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1.25rem 1rem; }
.mega-heading { font-family: var(--font-head); font-weight: 700; font-size: .72rem; letter-spacing: .1em;
  text-transform: uppercase; color: var(--muted); padding: 0 .65rem .4rem; min-height: 2.4rem; }
.mega-foot { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  margin-top: 1rem; padding: .9rem .65rem 0; border-top: 1px solid var(--border-soft); }
.mega-travels { color: var(--muted); font-size: .9rem; transition: color .15s; }
.mega-travels:hover { color: var(--cyan); }

@container nav (min-width: 1001px) {
  .nav-item.has-menu::details-content { content-visibility: visible; }
  .nav-item.has-menu > .nav-panel { display: block; position: absolute; top: calc(100% + .15rem);
    z-index: 60; opacity: 0; visibility: hidden; pointer-events: none;
    transition: opacity .18s ease, transform .18s ease, visibility .18s ease; }
  .nav-panel--mega { left: 50%; width: min(1080px, calc(100vw - 2rem));
    transform: translateX(-50%) translateY(4px); }
  .nav-industries:hover > .nav-panel, .nav-industries:focus-within > .nav-panel {
    opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(-50%) translateY(0); }
  .nav-item.has-menu:hover > summary .nav-caret,
  .nav-item.has-menu:focus-within > summary .nav-caret { transform: rotate(180deg); }
  /* invisible bridge so the pointer can cross from trigger to panel */
  .nav-item.has-menu > summary { position: relative; }
  .nav-item.has-menu:hover > summary::after,
  .nav-item.has-menu:focus-within > summary::after {
    content: ""; position: absolute; top: 100%; left: 0; width: 100%; height: 1rem; }
  .nav-panel--mega .nav-list a { line-height: 1.3; min-height: 3.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .nav-caret, .nav-item.has-menu > .nav-panel { transition: none; }
}

@container nav (max-width: 1000px) {
  .nav-links { position: fixed; inset: 5.2rem 1rem auto 1rem; flex-direction: column; align-items: stretch;
    max-height: calc(100dvh - 6.5rem); overflow-y: auto; padding: 1rem; border-radius: var(--radius);
    background: var(--bg); border-color: var(--border); display: none; }
  .nav-toggle:checked ~ .nav-links { display: flex; }
  .nav-toggle { display: block; position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
    overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); border: 0; white-space: nowrap; }
  .nav-toggle:focus-visible + .nav-toggle-label { outline: 2px solid var(--cyan); outline-offset: 4px; }
  .nav-toggle-label { grid-column: 3; justify-self: end; display: grid; place-items: center;
    width: 46px; height: 46px; border-radius: var(--radius-sm); background: rgba(11,20,40,.06);
    border: 1px solid var(--border-soft); color: var(--ink); cursor: pointer; }
  .nav-toggle:checked + .nav-toggle-label .icon-menu { display: none; }
  .nav-toggle:checked + .nav-toggle-label .icon-close { display: block; }
  .nav-cta { display: none; }
  .nav-links-cta { display: flex; flex-direction: column; gap: .5rem; margin-top: .5rem;
    padding-top: .7rem; border-top: 1px solid var(--border-soft); }
  .nav-links-cta .btn { width: 100%; justify-content: center; }
  .nav-item.has-menu { width: 100%; }
  .nav-links summary { display: flex; justify-content: space-between; width: 100%; padding: .7rem .25rem; }
  .nav-item[open] > summary .nav-caret { transform: rotate(180deg); }
  .nav-panel { border: none; box-shadow: none; background: transparent; padding: .1rem .25rem .6rem; }
  .nav-panel a { padding: .55rem .5rem; }
  .mega-grid { grid-template-columns: 1fr; gap: .85rem; }
  .mega-heading { padding-left: .5rem; min-height: 0; }
  .mega-foot { flex-direction: column; align-items: flex-start; gap: .5rem; margin-top: .6rem; padding: .7rem .5rem 0; }
}
```

The nav has **no "current" state** on the grader: none of the three items is this page.

---

## 6. Footer (exact markup and CSS)

Identical on every page of the site. Reproduce it exactly, with absolute URLs.

```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="https://binumi.com/" aria-label="Binumi home">
          <img src="https://binumi.com/binumi-logo-header.png" alt="Binumi" width="307" height="96" />
        </a>
        <p>Be video first. The platform is the scale. The service is the expertise.</p>
      </div>
      <div class="footer-col">
        <ul>
          <li><a href="https://binumi.com/solutions/">Solution</a></li>
          <li><a href="https://binumi.com/insights/">Insights</a></li>
          <li><a href="https://binumi.com/industries/">Industries</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <ul>
          <li><a href="https://binumi.com/about/">About Binumi</a></li>
          <li><a href="https://binumi.com/meet-the-team/">Meet the Team</a></li>
          <li><a href="https://binumi.com/contact/">Contact us</a></li>
        </ul>
      </div>
    </div>
  </div>
  <hr class="rule" />
  <div class="container footer-bottom">
    <p>&copy; 2026 Binumi. All rights reserved.</p>
    <nav class="footer-legal" aria-label="Legal">
      <a class="footer-link" href="https://binumi.com/terms-of-use/">Terms of use</a>
      <a class="footer-link" href="https://binumi.com/privacy-policy/">Privacy policy</a>
    </nav>
  </div>
</footer>
```

```css
.site-footer { position: relative; padding-top: var(--section-y); overflow: hidden;
  border-top: 1px solid var(--border-soft); }
.footer-grid { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2.5rem; padding-bottom: 3rem; }
.footer-brand { max-width: 24rem; }
.footer-brand .brand img { height: 2.1rem; }
.footer-brand p { color: var(--muted); margin-top: 1rem; }
.footer-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .85rem; }
.footer-col a { color: var(--muted); transition: color .2s; }
.footer-col a:hover { color: var(--ink); }
.footer-bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 1rem; padding-block: 1.6rem; }
.footer-bottom p, .footer-bottom a { color: var(--muted); font-size: .9rem; }
.footer-bottom a { transition: color .2s; }
.footer-bottom a:hover { color: var(--ink); }
.footer-legal { display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem; }
```

---

## 7. Cookie notice

Same component as the site, first visit only, stored in `localStorage` under
`bnm-cookies-accepted`. Note the key differs from the site's chat key; keep this
exact key so the two domains behave consistently in future.

```html
<div class="bnm-cookie" data-bnm-cookie hidden>
  <div class="bnm-cookie-overlay"></div>
  <div class="bnm-cookie-modal" role="dialog" aria-labelledby="bnm-cookie-title">
    <button class="bnm-cookie-x" type="button" aria-label="Close">&times;</button>
    <h2 class="bnm-cookie-title" id="bnm-cookie-title">Binumi uses cookies</h2>
    <p class="bnm-cookie-copy">We use cookies to provide you with a better browsing experience. By continuing to use this website, you agree to the use of cookies.</p>
    <button class="bnm-cookie-ok btn btn-primary" type="button">Ok</button>
  </div>
</div>
```

```css
.bnm-cookie[hidden] { display: none; }
.bnm-cookie { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center;
  justify-content: center; padding: 1.5rem; }
.bnm-cookie-overlay { position: absolute; inset: 0; background: rgba(11, 20, 40, 0.5); }
.bnm-cookie-modal { position: relative; background: var(--surface); border: 1px solid var(--cyan);
  border-radius: var(--radius); max-width: 480px; width: 100%; padding: 2.25rem 2rem; text-align: center;
  box-shadow: 0 24px 60px rgba(11, 20, 40, 0.28); }
.bnm-cookie-x { position: absolute; top: .5rem; right: .5rem; border: 0; background: none;
  color: var(--muted); font-size: 1.6rem; line-height: 1; cursor: pointer; width: 44px; height: 44px;
  display: grid; place-items: center; padding: 0; }
.bnm-cookie-title { margin: 0 0 1rem; font-size: var(--t-h6); color: var(--ink); }
.bnm-cookie-copy { margin: 0 0 1.75rem; color: var(--body-copy); line-height: 1.6; }
```

Behavior: hidden by default, revealed by inline script when no consent is recorded
(no flash for returning visitors). Accept on button, on the x, and on Escape.

---

## 8. The grader page

### 8.1 Structure (top to bottom)

```
header (section 5)
main
  section.section.geo-hero        eyebrow, h1, deck, form island
  section.section.geo-result      (rendered only after grading)
  section.section.geo-cta         navy closing CTA card
  section.section.geo-legal       the assessment notice
footer (section 6)
cookie notice
```

The whole page sits in one `.container` at `--container` (1280px) with the hero copy
and the form constrained to a narrower measure. Content is **left aligned**, matching
`.hero-inner` on every subpage. The current screenshot is already left aligned: keep it.

### 8.2 Hero and form markup

```html
<main>
  <section class="section geo-hero">
    <div class="container geo-shell">
      <span class="eyebrow"><span class="dot"></span>AI visibility</span>
      <h1>Find out what AI says <span class="hl">about you</span>.</h1>
      <p class="lead">Buyers ask ChatGPT, Claude and Perplexity before they ask you. Grade your site and see how legible your expertise is to the engines that answer them.</p>

      <form class="geo-form" id="geo-form" novalidate>
        <div class="geo-row">
          <div class="geo-field geo-field--wide">
            <label for="geo-site">Website</label>
            <input id="geo-site" name="site" type="url" inputmode="url"
                   autocomplete="url" placeholder="example.com" required />
            <p class="geo-error" data-for="geo-site" hidden>Enter a website address, for example example.com</p>
          </div>
          <div class="geo-field">
            <label for="geo-name">Your name</label>
            <input id="geo-name" name="name" type="text" autocomplete="name" placeholder="Your name" required />
            <p class="geo-error" data-for="geo-name" hidden>Enter your name</p>
          </div>
        </div>
        <div class="geo-row">
          <div class="geo-field geo-field--wide">
            <label for="geo-email">Work email</label>
            <input id="geo-email" name="email" type="email" autocomplete="email" placeholder="Work email" required />
            <p class="geo-error" data-for="geo-email" hidden>Enter your work email</p>
          </div>
          <button class="btn btn-primary geo-submit" type="submit">
            Grade my site
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
        <p class="geo-consent">We will email your report and may follow up about Binumi. See our <a href="https://binumi.com/privacy-policy/">privacy policy</a>.</p>
        <p class="geo-status" role="status" aria-live="polite" hidden></p>
      </form>
    </div>
  </section>
</main>
```

Labels are visible, not placeholder-only. The current build hides them, which fails
accessibility once a field is filled. Keep the placeholders as extra hinting.

### 8.3 Hero and form CSS

```css
.geo-hero { padding-top: var(--nav-to-hero); padding-bottom: var(--section-y); }
.geo-shell { display: flex; flex-direction: column; align-items: flex-start;
  gap: clamp(1.25rem, 1rem + 1.2vw, 1.9rem); max-width: 74rem; }
.geo-hero h1 { max-width: 20ch; text-wrap: balance; }
.geo-hero .lead { max-width: 56ch; }

.geo-form { width: 100%; max-width: 52rem; background: var(--surface); border: 1px solid var(--cyan);
  border-radius: var(--r-card); padding: clamp(1.5rem, 1rem + 1.5vw, 2rem);
  display: flex; flex-direction: column; gap: 1rem; }
.geo-row { display: grid; grid-template-columns: 1fr minmax(0, 18rem); gap: 1rem; align-items: end; }
.geo-field { display: flex; flex-direction: column; gap: .4rem; min-width: 0; }
.geo-field label { font-family: var(--font-head); font-weight: 600; font-size: .82rem;
  letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.geo-field input { height: 48px; width: 100%; padding: 0 .9rem; background: #ffffff;
  border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--ink);
  font-family: var(--font-body); font-size: 1rem; transition: border-color .2s; }
.geo-field input::placeholder { color: var(--muted); }
.geo-field input:hover { border-color: rgba(11,20,40,.28); }
.geo-field input:focus { border-color: var(--cyan); outline: 2px solid var(--cyan); outline-offset: 2px; }
.geo-field input[aria-invalid="true"] { border-color: #9a5b00; }
.geo-error { color: #9a5b00; font-size: .85rem; }
.geo-submit { height: 48px; width: 100%; }
.geo-submit[disabled] { opacity: .6; cursor: progress; }
.geo-consent { color: var(--muted); font-size: .85rem; }
.geo-consent a { color: var(--cyan); }
.geo-status { color: var(--body-copy); font-size: .95rem; }

@media (max-width: 720px) {
  .geo-row { grid-template-columns: 1fr; }
}
```

The second row puts the button in the narrow column so it lines up under "Your name",
which is what the current build does. The button must be **`#00aeef`**, not the lighter
blue in the screenshot, with `#04121b` label text.

### 8.4 States

| State | Behavior |
|---|---|
| **Idle** | Form as above. Submit enabled. |
| **Validating** | On submit, check all three fields. First invalid field gets `aria-invalid="true"`, its `.geo-error` unhides, focus moves to it. No native browser bubbles (`novalidate` is set). |
| **Grading** | Button disabled, label becomes `Grading…`, `.geo-status` reads `Reading your site. This takes about 30 seconds.` Show a thin cyan indeterminate bar across the top of the form island (2px, `--cyan`). Respect `prefers-reduced-motion`: static bar, no animation. |
| **Result** | Form island stays, collapsed to a one-line summary with a `Grade another site` `.btn-outline`. Result section renders below and receives focus. |
| **Error** | `.geo-status` reads `We could not reach that site. Check the address and try again.` Button re-enabled. Never a JavaScript `alert()`. |

URL handling: accept `example.com`, `www.example.com`, `https://example.com/path`.
Normalize to an origin before grading. Reject anything that is not a resolvable host
with the copy above.

Lead capture: post `{site, name, email, score, timestamp}` to HubSpot portal
**26490650** (region `eu1`), the same portal the site uses, so grader leads land in the
same CRM. Use a HubSpot Forms API submission from your backend, not the iframe embed.

---

## 9. Result view

Only the shape is specified here; the metrics come from your module. Everything is a
light island with a cyan hairline. **One navy element on the page: the closing CTA.**

```html
<section class="section geo-result" id="result" tabindex="-1">
  <div class="container stack">
    <div class="geo-scorecard">
      <div class="geo-score">
        <p class="kicker">AI visibility score</p>
        <p class="geo-score-value">68<span>/100</span></p>
        <p class="geo-score-band">Legible, not yet quotable</p>
      </div>
      <div class="geo-score-copy">
        <h2>What this means.</h2>
        <p>Answer engines can read example.com, but they rarely have enough structured, attributable substance to quote it. Three fixes move the number most.</p>
      </div>
    </div>

    <div class="geo-grid">
      <article class="card geo-metric">
        <p class="kicker">Crawlability</p>
        <p class="geo-metric-value">82<span>/100</span></p>
        <p>Your pages are reachable and render without JavaScript. Nothing blocks the engines.</p>
      </article>
      <!-- one per metric -->
    </div>

    <div class="geo-actions">
      <h2>What to fix first.</h2>
      <ol class="geo-list">
        <li><b>Publish an llms.txt.</b> One file telling answer engines what you do and which pages matter.</li>
        <li><b>Add FAQ schema to your solution pages.</b> Questions and answers are the unit engines quote.</li>
        <li><b>Attribute your claims.</b> Named clients and specific figures get cited; adjectives do not.</li>
      </ol>
    </div>
  </div>
</section>
```

```css
.geo-scorecard { display: grid; grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 1rem + 2vw, 3rem); align-items: center; background: var(--surface);
  border: 1px solid var(--cyan); border-radius: var(--r-card); padding: clamp(1.75rem, 1.25rem + 2vw, 2.75rem); }
.geo-score-value { font-family: var(--font-head); font-weight: 800; font-size: clamp(3.5rem, 2rem + 8vw, 5.5rem);
  line-height: 1; color: var(--cyan); }
.geo-score-value span { font-size: .3em; color: var(--muted); font-weight: 600; margin-left: .2em; }
.geo-score-band { font-family: var(--font-head); font-weight: 700; color: var(--ink); margin-top: .5rem; }
.geo-score-copy h2 { font-size: var(--t-h4); margin-bottom: .75rem; }
.geo-score-copy p { color: var(--body-copy); max-width: 54ch; }

.geo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.geo-metric { padding: 1.9rem; transition: none; }
.geo-metric:hover { transform: none; border-color: var(--cyan); box-shadow: none; }
.geo-metric-value { font-family: var(--font-head); font-weight: 800; font-size: 2.4rem; line-height: 1;
  color: var(--cyan); margin-bottom: .6rem; }
.geo-metric-value span { font-size: .38em; color: var(--muted); font-weight: 600; }

.geo-list { margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: .7rem;
  color: var(--body-copy); max-width: 70ch; }
.geo-list li::marker { color: var(--cyan); font-weight: 700; }
.geo-list b { color: var(--ink); font-weight: 600; }

@media (max-width: 980px) {
  .geo-scorecard { grid-template-columns: 1fr; }
  .geo-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 620px) { .geo-grid { grid-template-columns: 1fr; } }
```

**Score color rule.** All numbers are `--cyan`. Do not introduce a red / amber / green
traffic-light system; the palette has no such colors and a red score reads as a
telling-off, which is the wrong archetype. Communicate weakness in the band label and
the prose ("Legible, not yet quotable"), not in color. The one warning color that
exists in the system is `#9a5b00` on `rgba(255,180,84,.14)`, reserved for field errors
and pending flags.

Suggested band labels, low to high: `Invisible to answer engines`, `Findable, not
readable`, `Legible, not yet quotable`, `Quotable`, `Cited by name`.

---

## 10. Closing CTA (the one navy island)

```html
<section class="section">
  <div class="container">
    <div class="cta-card">
      <div class="inner">
        <h2>Now make your expertise <span class="hl">worth quoting</span>.</h2>
        <p class="lead">A score tells you where you stand. Binumi turns what your business knows into precise, on-brand video and content that people, and engines, actually cite.</p>
        <a class="btn btn-primary" href="https://binumi.com/contact/">Start your proof of value
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>
</section>
```

```css
.cta-card { position: relative; background: #001437; border: 1px solid rgba(120,165,225,0.16);
  border-radius: var(--r-panel); padding: clamp(2.5rem, 1.5rem + 5vw, 5.5rem) 1.5rem;
  text-align: center; overflow: hidden;
  --ink: #eaf1fb; --body-copy: #cfdcef; --muted: #8ea4c6; --cyan-bright: #3fd0ff;
  color: var(--body-copy); }
.cta-card .inner { position: relative; z-index: 1; display: flex; flex-direction: column;
  align-items: center; gap: 1.4rem; }
.cta-card h2 { color: var(--ink); }
.cta-card .lead { color: var(--body-copy); max-width: 60ch; }
```

`Start your proof of value` is the site's single primary CTA. Use that exact string.

---

## 11. Legal notice

Rewritten to house rules: American spelling, no em-dashes. Sits last in `<main>`,
above the footer, at the legal reading measure, separated by the `.rule` hairline.

```html
<section class="section geo-legal">
  <hr class="rule" />
  <div class="container geo-legal-body">
    <p class="kicker">AI visibility assessment notice</p>
    <p>The Binumi AI Visibility Score and associated GEO analysis use a proprietary assessment methodology developed by Binumi Ltd and are provided for informational and diagnostic purposes.</p>
    <p>The assessment evaluates observable factors relevant to AI visibility and generative engine optimization (GEO) at the time of analysis. It does not guarantee that any organization, webpage or content will be cited, surfaced, ranked or recommended by any particular AI system.</p>
    <p>The Binumi assessment methodology, scoring framework, analysis and associated intellectual property remain the property of Binumi Ltd. Results may change as websites, content, competitors and AI systems evolve.</p>
    <p>By submitting your details, you acknowledge that Binumi may contact you regarding your assessment and relevant Binumi services. Please refer to our <a href="https://binumi.com/privacy-policy/">privacy policy</a> for information about how we process personal data.</p>
  </div>
</section>
```

```css
.geo-legal .rule { margin-bottom: var(--section-y); }
.geo-legal-body { max-width: var(--container-legal); margin-inline: 0; display: flex;
  flex-direction: column; gap: 1.15rem; }
.geo-legal-body p { color: var(--body-copy); font-size: .95rem; line-height: 1.7; }
.geo-legal-body .kicker { font-family: var(--font-head); font-weight: 700; font-size: .82rem;
  letter-spacing: .1em; text-transform: uppercase; color: var(--cyan); }
.geo-legal-body a { color: var(--cyan); }
```

Changes from the current build, all required: `optimisation` to `optimization`,
`organisation` to `organization`, `Privacy Policy` to `privacy policy` in the link
text (sentence case, matching the footer).

---

## 12. Copy deck (locked strings)

| Slot | Copy |
|---|---|
| Page title | `Binumi · AI Visibility Grader` |
| Meta description | `See how visible your organization is to ChatGPT, Claude, Perplexity and other answer engines. Grade your site in under a minute.` |
| Eyebrow | `AI visibility` |
| H1 | `Find out what AI says about you.` (`about you` in `.hl` cyan) |
| Deck | `Buyers ask ChatGPT, Claude and Perplexity before they ask you. Grade your site and see how legible your expertise is to the engines that answer them.` |
| Field labels | `Website` / `Your name` / `Work email` |
| Placeholders | `example.com` / `Your name` / `Work email` |
| Submit | `Grade my site` |
| Consent line | `We will email your report and may follow up about Binumi. See our privacy policy.` |
| Loading | `Reading your site. This takes about 30 seconds.` |
| Error | `We could not reach that site. Check the address and try again.` |
| Reset | `Grade another site` |
| Result H2 | `What this means.` |
| Actions H2 | `What to fix first.` |
| CTA H2 | `Now make your expertise worth quoting.` (`worth quoting` in `.hl`) |
| CTA deck | `A score tells you where you stand. Binumi turns what your business knows into precise, on-brand video and content that people, and engines, actually cite.` |
| CTA button | `Start your proof of value` |
| Legal kicker | `AI visibility assessment notice` |

Punctuation convention: **headings end in a full stop.** That is the site standard
(`See what becomes possible.`, `A platform, with a team behind it.`).

If the product name `AI Visibility Grader` must appear as the H1 for recognition,
use it as the eyebrow instead and keep the outcome headline. Leading on the tool
breaks the voice rule in section 0.6.

---

## 13. Responsive and accessibility

- Breakpoints in use: `980px` (grids drop to 2 up, splits stack), `720px` (form rows
  stack), `620px` (grids to 1 up). Nav collapse is a **container query at 1000px** on
  `.navbar`, not a media query.
- Tap targets 44px minimum. Inputs and the submit button are 48px.
- Focus ring everywhere: `2px solid var(--cyan)`, `4px` offset (`2px` on inputs).
- Every input has a real `<label>`. Errors are wired with `aria-invalid` and sit
  adjacent to the field; the status line is `role="status" aria-live="polite"`.
- The result section is `tabindex="-1"` and receives focus after grading, so keyboard
  and screen-reader users land on the answer.
- No `alert()`, `confirm()` or modal dialogs anywhere except the cookie notice.
- Contrast: `--muted #5b6b86` on `--surface #e8eff2` passes AA for body sizes. Do not
  use `--muted` below 14px on `--surface`.
- Respect `prefers-reduced-motion` for the loading bar, the caret rotation and any
  score count-up. If you animate the score, gate it behind the same query.

---

## 14. Assets

| Asset | URL |
|---|---|
| Header and footer logo | `https://binumi.com/binumi-logo-header.png` (307x96, render at 2rem / 2.1rem height) |
| Social and schema logo | `https://binumi.com/binumi-logo.png` |
| Favicon | `https://binumi.com/favicon.png` |
| Fonts | Google Fonts, the single `<link>` in section 2 |
| Icons | Material Symbols Outlined, subset via `icon_names` in that same link |

Do not re-host or recolor the logo. No logo lockup with "GEO" or any sub-brand.

---

## 15. Acceptance checklist

- [ ] Header renders identically to binumi.com at 1440px, 1100px, 900px and 390px, including the five column Industries mega-menu on hover and as an accordion in the hamburger.
- [ ] Footer matches exactly, all links absolute to `binumi.com`.
- [ ] Every color on the page traces to a token in section 3. No stray blues.
- [ ] Exactly one navy island on the page (the closing CTA). No traffic-light colors.
- [ ] Every corner is 2px. No rounded pills except the eyebrow dot.
- [ ] Headings are Inter 700, body is Roboto 400.
- [ ] No em-dashes anywhere in the rendered page, including the legal notice.
- [ ] No British spellings anywhere in the rendered page.
- [ ] Cookie notice appears on first visit only and is dismissible by button, x and Escape.
- [ ] HubSpot tracking script present; a submitted grade creates a contact in portal 26490650.
- [ ] Keyboard only: tab from logo to submit, grade a site, land on the result.
- [ ] Lighthouse accessibility 95+, and no console errors.

---

## 16. Source of truth

If anything here conflicts with the live site, the site wins. Files in
`sidekyckservices/Binumi-Website`:

| What | Where |
|---|---|
| Tokens, buttons, header, footer, cards, islands, cookie, chat | `src/styles/global.css` |
| Document shell, meta, fonts, schema | `src/layouts/BaseLayout.astro` |
| Header markup and the industries data | `src/components/Header.astro` |
| Footer markup | `src/components/Footer.astro` |
| Cookie notice | `src/components/CookieConsent.astro` |
| Page banner and form island reference | `src/pages/solutions/index.astro`, `src/pages/contact.astro` |
| Voice, archetype, kill list | `brand.md` |
| Product facts and named-client proof | `product.md` |
| Repo conventions and house rules | `CLAUDE.md` |
