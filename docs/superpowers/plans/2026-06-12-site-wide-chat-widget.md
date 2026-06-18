# Site-wide Chat Widget (Visual Shell) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Salesforce-style chat launcher and right-hand drawer on every page (visual shell, no backend), with the home hero's decorative chat bar replaced by a primary CTA button.

**Architecture:** One new Astro component `ChatWidget.astro` rendered once in `BaseLayout.astro`, all behaviour in a vanilla inline script, all styling appended to `global.css` under a `.bnm-chat` namespace using existing design tokens. Spec: `docs/superpowers/specs/2026-06-12-site-wide-chat-widget-design.md`.

**Tech Stack:** Astro 5 static site, plain CSS custom properties, vanilla JS. No test framework exists in this repo; each task verifies via `npm run build` and the final task verifies behaviour in the dev server.

**House rules:** British spelling, no em-dashes anywhere (not even in comments), sharp 2px corners (`var(--radius-sm)`), brand palette tokens only.

---

### Task 1: Widget CSS in global.css

**Files:**
- Modify: `src/styles/global.css` (append at end of file, after line 471)

- [x] **Step 1: Append the `.bnm-chat` section**

Add to the very end of `src/styles/global.css`:

```css

    /* ===========================================================
       SITE-WIDE CHAT WIDGET (.bnm-chat)
       Launcher pill bottom-right on every page; right-hand drawer
       panel. Visual shell only: the send handler in ChatWidget.astro
       is the seam where a real engine lands later.
       Header z-index is 50, so launcher (80) and panel (90) sit above.
       =========================================================== */
    .bnm-chat-launcher { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 80;
      display: inline-flex; align-items: center; gap: .55rem; height: 48px; padding: 0 1.3rem;
      border: 1.5px solid transparent; border-radius: var(--radius-sm); cursor: pointer;
      font-family: var(--font-head); font-weight: 600; font-size: .95rem;
      color: #04121b; background: var(--cyan); box-shadow: 0 14px 40px -12px rgba(0,0,0,.7);
      transition: background .3s ease; }
    .bnm-chat-launcher:hover { background: var(--cyan-bright); }
    .bnm-chat-launcher svg { width: 20px; height: 20px; }
    body.bnm-chat-open .bnm-chat-launcher { visibility: hidden; }

    .bnm-chat-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 90;
      width: min(400px, 100%); display: flex; flex-direction: column;
      background: var(--panel); border-left: 1px solid var(--border);
      box-shadow: -24px 0 70px rgba(0,0,0,.5);
      transform: translateX(102%); transition: transform .28s ease; }
    .bnm-chat-panel.open { transform: translateX(0); }
    .bnm-chat-panel[hidden] { display: none; }

    .bnm-chat-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-soft); flex: 0 0 auto; }
    .bnm-chat-title { font-family: var(--font-head); font-weight: 800; font-size: 1.15rem; color: var(--ink); }
    .bnm-chat-title b { color: var(--cyan); }
    .bnm-chat-title .tag { margin-left: .55rem; font-weight: 600; font-size: .7rem;
      letter-spacing: .12em; text-transform: uppercase; color: var(--cyan); }
    .bnm-chat-close { display: grid; place-items: center; width: 36px; height: 36px;
      border-radius: var(--radius-sm); background: transparent; border: 1px solid var(--border-soft);
      color: var(--muted); cursor: pointer; transition: color .2s, border-color .2s; }
    .bnm-chat-close:hover { color: var(--ink); border-color: var(--cyan); }
    .bnm-chat-close svg { width: 16px; height: 16px; }

    .bnm-chat-body { flex: 1 1 auto; overflow-y: auto; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 1.1rem; }
    .bnm-chat-video { position: relative; aspect-ratio: 16 / 9; flex: 0 0 auto;
      border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border-soft);
      background: var(--navy); }
    .bnm-chat-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

    .bnm-chat-thread { display: flex; flex-direction: column; gap: .6rem; }
    .bnm-msg { max-width: 88%; padding: .75rem 1rem; border-radius: var(--radius);
      font-size: .95rem; line-height: 1.55; }
    .bnm-msg-bot { align-self: flex-start; background: var(--panel-2);
      border: 1px solid var(--border-soft); color: var(--body-copy); }
    .bnm-msg-user { align-self: flex-end; background: var(--cyan-fill);
      border: 1px solid var(--border); color: var(--ink); }

    .bnm-chat-suggest { display: flex; flex-direction: column; align-items: flex-start; gap: .5rem; }
    .bnm-suggest-label { font-family: var(--font-head); font-weight: 600; font-size: .72rem;
      letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
    .bnm-chip { padding: .55rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-soft);
      background: rgba(11,20,40,.5); color: var(--body-copy); font-family: var(--font-head);
      font-weight: 600; font-size: .88rem; cursor: pointer; text-align: left;
      transition: border-color .2s, color .2s; }
    .bnm-chip:hover { border-color: var(--cyan); color: var(--cyan); }

    .bnm-chat-ctas { display: flex; flex-direction: column; gap: .6rem; }
    .bnm-chat-ctas .btn { width: 100%; }

    .bnm-chat-foot { padding: 1rem 1.25rem 1.1rem; border-top: 1px solid var(--border-soft);
      display: flex; flex-direction: column; gap: .55rem; flex: 0 0 auto; }
    .bnm-chat-bar { max-width: none; }
    .bnm-chat-note { color: var(--muted); font-size: .78rem; }

    @media (max-width: 640px) {
      .bnm-chat-launcher { width: 52px; height: 52px; padding: 0; justify-content: center; }
      .bnm-chat-launcher .label { display: none; }
      body.bnm-chat-open { overflow: hidden; }
    }
    @media (prefers-reduced-motion: reduce) {
      .bnm-chat-panel { transition: none; }
    }
```

- [x] **Step 2: Verify the build still passes**

Run: `cd "/Users/ky/Git Hub/SK_Services/binumi" && npm run build`
Expected: exit 0, pages built into `dist/`.

- [x] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: chat widget launcher and drawer panel rules"
```

---

### Task 2: ChatWidget.astro component

**Files:**
- Create: `src/components/ChatWidget.astro`

- [x] **Step 1: Create the component**

Full contents of `src/components/ChatWidget.astro`:

```astro
---
/* Site-wide chat shell: launcher pill plus right-hand drawer. Visual shell,
   no backend. The submit handler below is the single seam where a real
   engine (guided flow or AI) lands later. Styles: .bnm-chat in global.css. */
---
<div data-bnm-chat>
  <button class="bnm-chat-launcher" type="button" aria-haspopup="dialog"
    aria-expanded="false" aria-controls="bnm-chat-panel">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/></svg>
    <span class="label">Ask Binumi</span>
  </button>

  <section class="bnm-chat-panel" id="bnm-chat-panel" role="dialog"
    aria-label="Binumi video assistant" hidden>
    <header class="bnm-chat-head">
      <p class="bnm-chat-title">binumi<b>.</b><span class="tag">Video assistant</span></p>
      <button class="bnm-chat-close" type="button" aria-label="Close chat">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M4.2 2.8 10 8.6l5.8-5.8 1.4 1.4-5.8 5.8 5.8 5.8-1.4 1.4-5.8-5.8-5.8 5.8-1.4-1.4L8.6 10 2.8 4.2z"/></svg>
      </button>
    </header>

    <div class="bnm-chat-body">
      <!-- The assistant's face is video. src applied on first open (lazy). -->
      <div class="bnm-chat-video">
        <iframe
          data-src="https://www.binumi.com/resource/index/video?loop=true&poster=true&autoplay=true&stretching=fill&controls=false&typeShare=bin&id=1726856"
          title="Binumi assistant film"
          frameborder="0" scrolling="no" allow="autoplay" tabindex="-1"></iframe>
      </div>

      <div class="bnm-chat-thread" aria-live="polite">
        <p class="bnm-msg bnm-msg-bot">Hello. The best video is already inside your business. Curious what Binumi could make from what you already have?</p>
      </div>

      <div class="bnm-chat-suggest">
        <p class="bnm-suggest-label">Ask me things like:</p>
        <button class="bnm-chip" type="button">What could Binumi make for us?</button>
        <button class="bnm-chip" type="button">How does the proof of value work?</button>
        <button class="bnm-chip" type="button">How fast can we turn what we have into video?</button>
      </div>

      <div class="bnm-chat-ctas">
        <a class="btn btn-primary" href="/how-it-works/">Start your proof of value
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a class="btn btn-outline" href="/why-it-works/">See why it works</a>
      </div>
    </div>

    <footer class="bnm-chat-foot">
      <form class="chatbar bnm-chat-bar">
        <span class="ai" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/></svg></span>
        <input type="text" aria-label="Ask Binumi a question" placeholder="Ask Binumi a question..." />
        <button class="btn btn-primary btn-sm" type="submit">Send</button>
      </form>
      <p class="bnm-chat-note">Early preview. Replies are limited for now.</p>
    </footer>
  </section>
</div>

<script is:inline>
  (function () {
    var root = document.querySelector('[data-bnm-chat]');
    if (!root) return;
    var launcher = root.querySelector('.bnm-chat-launcher');
    var panel = root.querySelector('.bnm-chat-panel');
    var closeBtn = root.querySelector('.bnm-chat-close');
    var video = root.querySelector('.bnm-chat-video iframe');
    var thread = root.querySelector('.bnm-chat-thread');
    var body = root.querySelector('.bnm-chat-body');
    var form = root.querySelector('.bnm-chat-bar');
    var input = form.querySelector('input');
    var replied = false;
    var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function open() {
      panel.hidden = false;
      if (video.dataset.src) { video.src = video.dataset.src; video.removeAttribute('data-src'); }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { panel.classList.add('open'); });
      });
      launcher.setAttribute('aria-expanded', 'true');
      document.body.classList.add('bnm-chat-open');
      closeBtn.focus();
    }
    function close() {
      panel.classList.remove('open');
      launcher.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('bnm-chat-open');
      window.setTimeout(function () { panel.hidden = true; launcher.focus(); }, motion ? 300 : 0);
    }
    launcher.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) close();
    });

    root.querySelectorAll('.bnm-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.textContent.trim();
        input.focus();
      });
    });

    function say(text, who) {
      var el = document.createElement('p');
      el.className = 'bnm-msg bnm-msg-' + who;
      el.textContent = text;
      thread.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      say(text, 'user');
      input.value = '';
      var reply = replied
        ? 'Our team can take it from there. The proof of value is the fastest route.'
        : 'Thanks. Our assistant is still in preview, so it cannot answer in full here yet. The fastest way to see what Binumi could make for you is a proof of value: our team shows you, using what your business already has. Shall we start one?';
      replied = true;
      window.setTimeout(function () { say(reply, 'bot'); }, 500);
    });
  })();
</script>
```

- [x] **Step 2: Verify the build still passes**

Run: `cd "/Users/ky/Git Hub/SK_Services/binumi" && npm run build`
Expected: exit 0. (Component not yet mounted; this catches syntax errors only.)

- [x] **Step 3: Commit**

```bash
git add src/components/ChatWidget.astro
git commit -m "feat: ChatWidget drawer component (visual shell)"
```

---

### Task 3: Mount the widget in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro:1-4` (frontmatter imports) and line 33 (after `<Footer />`)

- [x] **Step 1: Import and render**

In the frontmatter, after the `Footer` import:

```astro
import ChatWidget from '../components/ChatWidget.astro';
```

In the body, directly after `<Footer />`:

```astro
  <Footer />
  <ChatWidget />
```

- [x] **Step 2: Build**

Run: `cd "/Users/ky/Git Hub/SK_Services/binumi" && npm run build`
Expected: exit 0.

- [x] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: mount chat widget on every page via BaseLayout"
```

---

### Task 4: Replace the hero chat bar with the primary CTA

**Files:**
- Modify: `src/pages/index.astro:33-43` (the `.hero-cta` block)

- [x] **Step 1: Swap the block**

Replace:

```html
        <!-- the single primary action -->
        <div class="hero-cta">
          <div class="chatbar">
            <span class="ai" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/></svg></span>
            <input type="text" aria-label="Tell us what your organisation needs to communicate" placeholder="Tell us what your organisation needs to communicate..." />
            <button class="btn btn-primary" type="button">Start
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
          <p class="chatbar-note">Answer a few questions and see what Binumi could make for you. No sign-up.</p>
        </div>
```

with:

```html
        <!-- the single primary action -->
        <div class="hero-cta">
          <a class="btn btn-primary" href="/how-it-works/">Start your proof of value
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <p class="chatbar-note">No sign-up. See what Binumi could make for you.</p>
        </div>
```

(`.chatbar` CSS stays in `global.css`: the panel's input bar reuses it.)

- [x] **Step 2: Build**

Run: `cd "/Users/ky/Git Hub/SK_Services/binumi" && npm run build`
Expected: exit 0.

- [x] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: hero CTA button replaces decorative chat bar"
```

---

### Task 5: Browser verification

**Files:** none (verification only)

- [x] **Step 1: Start the dev server** (`npm run dev`, http://localhost:4321/)

- [x] **Step 2: Desktop checks** (default width)
- Launcher pill bottom-right on `/`, `/why-it-works/`, `/how-it-works/`, `/insights/the-static-content-crisis/`.
- Click launcher: panel slides in; video frame plays; greeting visible; launcher hidden.
- Chip click fills the input. Send shows the user bubble, then the canned reply after a beat. A second send gets the short follow-up reply.
- Esc closes; focus returns to the launcher. CTAs navigate to `/how-it-works/` and `/why-it-works/`.
- Home hero shows the new button, no chat bar.
- Console: no errors on load, open, send, close.

- [x] **Step 3: Mobile checks** (about 380px wide)
- Launcher is the round icon button; panel is full-screen; page behind does not scroll while open.

- [x] **Step 4: Tick off the plan checkboxes and report**
