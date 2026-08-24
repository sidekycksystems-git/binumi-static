# Plan Review Log: /geo AI visibility grader landing page

Started at session time. MAX_ROUNDS=3. PLAN_FILE=`PLAN.md`.
Reviewer: OpenAI Codex (`codex-cli 0.144.1`), read-only sandbox.

Note: the repo's `docs/geo-grader-page-spec-review-log.md` in the sibling grader
repo belongs to earlier work and is not touched by this loop.

---

## Round 1 — Codex

The plan is not safe to implement yet. The CSS promotion has one real cascade hazard, and the embed contract leaves security, privacy, accessibility, and deployment behavior unresolved.

1. `.page-banner` evidence is wrong. There are four definitions, not five, and `prototype-icons.astro` has none. Three definitions use `<style is:global>` while only [meet-the-team.astro](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/pages/meet-the-team.astro:151) is Astro-scoped. The move is probably safe because no selector competes for those padding properties, but the stated scoping analysis is false.

Fix: Correct the caller list and verify computed `padding-top` and `padding-bottom` before and after promotion on all four pages.

2. The bento is not local to one page. [prototype-icons.astro](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/pages/prototype-icons.astro:75) duplicates the full family, adds equal-specificity geometry, and collapses at 860px instead of the proposed global 980px. Leaving those rules behind makes behavior between 861px and 980px depend on extracted stylesheet order.

Fix: Remove shared bento rules from both pages, scope prototype-only positioning under `#proto`, and choose one canonical breakpoint or add an explicit prototype override.

3. The promotion copies hard-coded spacing such as `.85rem`, `1rem`, and `1.9rem` into the shared tier, while `CLAUDE.md` says spacing and size must use tokens.

Fix: Resolve whether this is an approved behavior-preserving move or map every promoted spacing value to an existing token before implementation.

4. The proposed grader variant can accidentally become the internal tier. Current code defines `isPublic` solely as `opts.variant === 'public'` in [console-html.ts](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/src/api/console-html.ts:114>). Merely adding `'embed'` to the union would point it at `/internal/grade`, omit lead fields, and ship internal rendering code.

Fix: Introduce a `publicLike` predicate covering both `public` and `embed`, use it for every endpoint and information-disclosure gate, and assert all tier markers against the real exported embed artifact.

5. The grader branch premise is not supported by the readable repo. The local FLW-80 ref resolves to the same commit as `main`, and there are no `PUBLIC_HEADER_HTML`, `PUBLIC_FOOTER_HTML`, `PUBLIC_COOKIE_HTML`, or `PUBLIC_CTA_HTML` constants. The current public page is already chrome-light.

Fix: Locate or rebase onto the actual unpublished grader changes, or rewrite Step 8 against the code that exists.

6. The height protocol is incomplete. Load plus `render()` misses API errors, network errors, late font reflow, responsive wrapping, and other DOM changes. Origin checking alone is insufficient because the receiver should also verify `event.source` and the message schema, as recommended by [MDN’s postMessage security guidance](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

Fix: Use a namespaced message, verify exact origin and `event.source === iframe.contentWindow`, validate and clamp height, and report changes through `ResizeObserver`.

7. The grader remains frameable by any site. Its [Vercel headers](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/vercel.json:13>) contain no `Content-Security-Policy: frame-ancestors`, creating a clickjacking and impersonation surface around a lead form.

Fix: Restrict `frame-ancestors` to the approved Binumi origins and add an iframe sandbox such as `allow-scripts allow-forms allow-same-origin`, plus an explicit referrer policy.

8. Accessibility and autofill are under-specified. Current grader inputs have placeholders but no labels, `name`, or `autocomplete`, the lazy iframe contains `autofocus`, and dynamic results are not announced. Cross-origin iframe forms are known to have autofill limitations, as described by [Chrome’s iframe autofill documentation](https://developer.chrome.com/blog/shared-autofill/).

Fix: Add visible labels, semantic names and autocomplete tokens, remove embed autofocus, announce loading/results with live regions or focus management, and test Safari, Chrome, Firefox, mobile, and strict privacy modes.

9. Cookie and data consent cannot be delegated to the parent notice. The current [CookieConsent.astro](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/components/CookieConsent.astro:37) stores acceptance only in the parent origin and does not gate the already-loaded HubSpot tracker. The iframe cannot read that localStorage. ICO guidance says embedded services must be inventoried, disclosed, and configured privacy-preservingly. [ICO consent guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/)

Fix: Document every embed request, cookie, storage use, and lead recipient, keep the embed free of nonessential storage unless consent is relayed safely, and obtain privacy-owner approval for lawful basis and disclosure.

10. Failure behavior is not designed. A fixed minimum height can leave a blank or browser-error panel, while a direct link to the same failed deployment is not sufficient.

Fix: Deploy and smoke-test the grader first, then publish the parent with persistent “open directly” and `/contact/` fallbacks plus a visible loading state.

11. SEO is left as an open question although it changes release behavior. `BaseLayout` will canonicalize `/geo/`, but the grader currently emits neither canonical nor robots metadata. The page is also intentionally orphaned and omitted from the manually curated `llms.txt`.

Fix: Make the embed response `noindex`, choose the standalone grader’s canonical policy, add at least one internal link, and update `llms.txt` before release.

12. The navy-island verification is guaranteed to fail visually. The retained grader result uses `.island-dark` with `#001437` and renders that class in [console-html.ts](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/src/api/console-html.ts:597>), producing another navy island besides the closing CTA.

Fix: Restyle the embed result as a light island or obtain an explicit design-rule exception and update the verification criterion.

13. Several cited assertions are false: `.close-line` is styled in [global.css](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/styles/global.css:559), industry closing CTAs already omit lead paragraphs in [[industry].astro](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/pages/industries/[industry].astro:127), and legal headings prove punctuation is not universal.

Fix: Re-run every citation audit and remove claimed deviations that are already established patterns.

14. Parallelization is unsafe. Steps 3 through 7 all edit the same new page and depend on Steps 1 and 2. Step 8 can be developed concurrently, but release verification and deployment cannot.

Fix: Keep grader and static development parallel only after locking the message contract, then deploy grader, verify production embed behavior, and finally publish `/geo/`.

15. Verification is neither cross-repo nor baseline-clean. The built prototype already contains em-dash UI strings in [prototype-icons.astro](/Users/ky/orca/workspaces/binumi-static/update-public-face/src/pages/prototype-icons.astro:126), while British spelling inside the remote iframe will never appear in the static site’s `dist` grep.

Fix: Run both repositories’ tests and rule checks, remove existing built-output violations, add two-origin browser tests, and compare screenshots and computed styles around 860px, 980px, and production origins.

VERDICT: REVISE
### Claude's response, round 1

Verified every checkable claim against the repo before acting. Codex was right on
all of them, including two places my plan asserted the opposite of the truth.

**Accepted and fixed (13 of 15):**

- **#1 page-banner evidence was wrong.** Four definitions, not five.
  `prototype-icons.astro` has none. Verified: `insights/index.astro:75`,
  `meet-the-team.astro:152`, `industries/index.astro:38`, `solutions/index.astro:278`.
  The scoping detail matters more than the count: three sit in `<style is:global>`
  and only `meet-the-team.astro:151` is an Astro-scoped `<style>`. Step 1 rewritten.
- **#2 the bento is NOT page-local.** `prototype-icons.astro:76-91` duplicates the
  whole family inside `<style is:global>` and collapses at **860px** where
  solutions collapses at **980px**. Two competing global definitions already exist
  and the winner is bundle-order dependent. This is a pre-existing bug my plan
  would have made worse. Step 2 rewritten to dedupe both and scope the
  prototype-only positioning under `#proto`.
- **#4 the `embed` variant would silently become the INTERNAL tier.** This is the
  most valuable catch in the round. `isPublic = opts.variant === 'public'` at
  `console-html.ts:114`, so adding `'embed'` to the union without touching that
  predicate points the embed at `/internal/grade`, ships per-check rendering code,
  and drops lead capture. A straight FLW-75 disclosure bug. Step 8 now mandates a
  `publicLike` predicate.
- **#5 grader-branch premise.** Correct that committed `main` has no
  `PUBLIC_*_HTML` constants. The reason is that the FLW-80 work is **uncommitted
  in a worktree** at `.claude/worktrees/flw-80-page-content`. Codex could not see
  it. Recorded as an explicit precondition and a real risk.
- **#6 height protocol**, **#7 frame-ancestors and sandbox**, **#8 a11y and
  autofill**, **#9 consent**, **#10 failure design**, **#11 SEO and llms.txt**,
  **#14 serialized ordering**, **#15 baseline-clean verification**: all accepted
  and written in.
- **#13 two of my citations were false.** `.close-line` IS styled, at
  `global.css:559` as `.couplet .close-line`. And `industries/[industry].astro:125-138`
  already omits the lead paragraph from its closing CTA, so that was an
  established pattern, not a deviation. Both corrected.

**Partially rejected, with reason:**

- **#3 hard-coded spacing in the promoted rules.** Codex is right that `.85rem`,
  `1rem` and `1.9rem` are not tokens and that `CLAUDE.md` asks for tokens. I am
  NOT retokenizing during the move. A move that also changes values is two changes
  wearing one diff, and it makes "verify the five pages are visually unchanged"
  unfalsifiable. The promotion is explicitly declared behavior-preserving, and
  retokenizing is logged as separate follow-up work.

**Resolved but branch-dependent:**

- **#12 second navy island.** True on committed `main`. Already fixed on the
  uncommitted FLW-80 branch, where the public score block uses `.island` rather
  than `.island-dark`. Folded into the precondition in #5.

---

## Round 2 — Codex

The spacing-token rejection is defensible. This is a relocation refactor, and preserving exact values keeps the visual-equivalence test meaningful. Retokenizing can remain separate. That exception should cover only moved values, not new iframe dimensions.

Material problems remain:

1. The CSS conflict premise is still wrong. `is:global` means unscoped within a page where the component is included, not automatically loaded site-wide. Astro gives each page its own CSS chunk, so the solution and prototype rules do not currently compete in one document. [Astro styling documentation](https://docs.astro.build/en/guides/styling/)

Fix: Describe these as duplicated document-global rules, not a live cascade conflict.

2. Choosing 980px changes the prototype intentionally. It currently remains six columns at 900px and collapses only at 860px. After Step 2 it will collapse at 980px, contradicting “visually unchanged” in [PLAN.md](/Users/ky/orca/workspaces/binumi-static/update-public-face/PLAN.md:193).

Fix: Either require a `#proto` 860px override, or document the 900px change as intentional and verify the new canonical behavior.

3. The `publicLike` design is underspecified for the actual FLW-80 structure. `isPublic` currently controls language, head metadata, fonts, tokens, public story CSS, light score rendering, form markup, result focus, legal content, and the entire shell, not merely chrome. Also, `PUBLIC_HERO_HTML` bundles the hero copy and form together, while `PUBLIC_SHELL_CSS` bundles grader layout with chrome CSS.

Fix: Specify three explicit states, extract shared `PUBLIC_FORM_HTML` and public-tool CSS, use `publicLike` for the gated form/result/story/legal behavior, full-public only for chrome, and embed only for transparent framing and resize behavior.

4. Query routing remains vague. `Vary` does not distinguish query strings, it varies caches by request headers. The handler needs two concrete precomputed artifacts and conditional headers.

Fix: Export `publicPageHtml` and `embedPageHtml`, parse only exact `embed=1`, calculate each response’s content length, apply `X-Robots-Tag` conditionally, and test both real handler responses.

5. The iframe sandbox breaks the retained privacy links. The form consent and legal notice link to `binumi.com`; without a target or permitted top navigation, clicking them replaces the grader inside the iframe and ends the height handshake.

Fix: Give trusted links an explicit navigation policy, such as `target="_top"` plus `allow-top-navigation-by-user-activation`, and test it.

6. Failure fallback contradicts the plan. Both fallback links point to `geo.binumi.com`, while the risk section correctly says fallback must not depend solely on the same failed deployment.

Fix: Add a parent-origin `/contact/` fallback alongside the direct-grader link.

7. SEO and privacy remain open questions when they are release decisions. The FLW-80 standalone grader self-canonicalizes to `geo.binumi.com`, so noindexing only `?embed=1` still leaves two competing landing pages. Privacy-owner approval is also not a release gate.

Fix: Move canonical ownership and privacy sign-off into preconditions, with grader-first deployment blocked until both are resolved.

8. House-rule verification is internally inconsistent. [PLAN.md](/Users/ky/orca/workspaces/binumi-static/update-public-face/PLAN.md:367) itself contains a Unicode em dash, and the retained legal notice renders British spellings from [console-html.ts](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/.claude/worktrees/flw-80-page-content/src/api/console-html.ts:103>). The parent build grep cannot inspect cross-origin iframe output.

Fix: Remove the plan’s dash, check both rendered artifacts, and obtain an explicit legal exception or Americanized approved notice before claiming compliance.

9. Two marketing claims exceed what the grader implements. It uses Binumi’s crawler, rubric, and OpenAI adapter, so “reads it the way ChatGPT, Perplexity and Google AI do” is not established. “AI systems don’t watch your videos” is also overly absolute.

Fix: Say the grader checks signals answer engines can use, and that transcripts and metadata make video more legible to crawlers.

10. `frame-ancestors` scope needs precision. Adding the Binumi allowlist to the existing global `/(.*)` header also permits the parent site to frame the password-gated internal console.

Fix: Allow approved Binumi origins on the public grader route, and set `frame-ancestors 'none'` for internal routes.

VERDICT: REVISE
### Claude's response, round 2

Codex accepted the round 1 rejection (spacing retokenization stays deferred) with
a sharpening I adopted: the exception covers moved values only, never new iframe
dimensions.

**Accepted and fixed (all 10):**

- **#1 my cascade-conflict framing was wrong.** `is:global` disables per-component
  scoping within pages that include the block; it does not publish site-wide, and
  Astro chunks CSS per page. So `solutions` and `prototype-icons` never load their
  `.bento` copies into one document. Reframed as **two drifted duplicates**, not a
  live conflict. The consequence survives: consolidating forces a breakpoint choice.
- **#2 choosing 980px silently changes the prototype** between 861px and 980px,
  contradicting "visually unchanged." Added an explicit `#proto` override to
  preserve 860px, with the alternative (let the prototype follow the site standard)
  named as a decision the user can take.
- **#3 `publicLike` was underspecified.** Verified: `isPublic` gates lang, viewport,
  title, head metadata, fonts href, tokens, `BAND_CSS`, the score island class, the
  whole body markup, story, legal and result focus. `PUBLIC_HERO_HTML` bundles hero
  copy with the form; `PUBLIC_SHELL_CSS` bundles tool CSS with chrome CSS. Replaced
  the two-way boolean with a three-state table and required extracting
  `PUBLIC_FORM_HTML` and splitting `PUBLIC_SHELL_CSS`.
- **#4 `Vary` was wrong of me.** It varies caches by request header, not query
  string. Replaced with two precomputed artifacts, exact `embed=1` parsing,
  per-response content-length, conditional `X-Robots-Tag`.
- **#5 the sandbox would trap the embed's own links.** The consent line and legal
  notice link to binumi.com; without top-navigation permission those replace the
  grader inside the frame and kill the handshake. Added
  `allow-top-navigation-by-user-activation` plus `target="_top"`.
- **#6 my fallback contradicted my own risk section.** Both links pointed at the
  same deployment that had just failed. Added a parent-origin `/contact/` fallback.
- **#7 canonical and privacy promoted from "open questions" to release gates** in
  section 0. Codex is right that the standalone grader self-canonicalizing means
  `noindex` on `?embed=1` does not resolve the duplication.
- **#8 PLAN.md itself contained an em-dash**, in the sentence about em-dashes.
  Removed. Also added the British-spelling caveat: the embed renders the client's
  verbatim legal notice, so `/geo/` will display `organisation` and `optimisation`,
  and any compliance claim has to say so.
- **#9 two copy claims overstate the product.** "reads it the way ChatGPT,
  Perplexity and Google AI do" (it uses Binumi's own crawler and rubric plus an
  OpenAI adapter) and the absolute "AI systems don't watch your videos." **Flagged
  for the user, not changed:** the copy is locked, and rewriting locked copy is not
  mine to do.
- **#10 `frame-ancestors` scope.** Adding the allowlist to the existing global
  `/(.*)` matcher would newly permit binumi.com to frame the password-gated
  internal console. Now scoped per route, with `'none'` on the internal routes.

---

## Round 3 — Codex (final round, MAX_ROUNDS=3)

One genuine blocker remains.

1. **CSP has a direct-route bypass.** Step 8 protects `/` and `/internal`, but Vercel also exposes `api/index.ts` and `api/internal.ts` directly as `/api/index` and `/api/internal`. An attacker could frame `/api/index`, bypassing the intended `frame-ancestors` restriction. Vercel rewrites do not hide their destinations. [Vercel function routing](https://vercel.com/docs/project-configuration/vercel-json), [api/index.ts](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/.claude/worktrees/flw-80-page-content/api/index.ts:22>), [vercel.json](</Users/ky/Git Hub/SK_Services/binumi-lead-gen-app/.claude/worktrees/flw-80-page-content/vercel.json:8>).  
   Fix: emit CSP from both HTML handlers, or cover both friendly and direct function paths, then test all four URLs.

Residual corrections, not blockers:

- [PLAN.md](/Users/ky/orca/workspaces/binumi-static/update-public-face/PLAN.md:53) says `is:global` leaks site-wide, contradicting the accurate explanation at lines 66 to 70.  
  Fix: replace “site-wide” with “document-wide.”

- [PLAN.md](/Users/ky/orca/workspaces/binumi-static/update-public-face/PLAN.md:415) says the grader emits no canonical, but FLW-80 emits one. Line 421 also calls the CSS drift a live order-dependent conflict after correctly establishing that it is not.  
  Fix: remove these two stale claims.

Everything else is sound enough:

- The CSS promotion now accounts for Astro scoping, specificity, page chunks, and the prototype breakpoint.
- Deferring spacing retokenization is defensible because exact-value movement keeps visual equivalence testable.
- Ordering and deployment dependencies are safe.
- The iframe contract now covers sizing, origin and source validation, navigation, accessibility, failure fallback, privacy, canonical ownership, and autofill testing.
- Flagging locked copy overclaims for owner approval is appropriate and does not block implementation planning.

VERDICT: REVISE
### Claude's response, round 3

Codex narrowed to **one blocker and two stale-text corrections**, and explicitly
signed off on the CSS promotion, the deferral of retokenization, the step
ordering, and the whole iframe contract.

**Blocker accepted and fixed. Verified independently before acting:**
`vercel.json` only *rewrites* `/` to `/api/index` and `/internal` to
`/api/internal`. Vercel still serves both functions at their own paths, so a
route-scoped `frame-ancestors` on `/` and `/internal` leaves `/api/index` and
`/api/internal` framebale with no CSP at all. Confirmed against
`vercel.json:8-12` and the four files in `api/`. Step 8 now emits the header from
inside each handler's `res.writeHead`, which applies on every path that reaches
the function, and requires testing all four URLs.

**Both stale claims fixed:** "leaks site-wide" corrected to "applies
document-wide" (it contradicted my own accurate explanation a few lines later),
and the two leftover sentences asserting the grader emits no canonical and that
the CSS drift is a live order-dependent conflict.

### Outcome

Formally this ends at `VERDICT: REVISE` on the final round, so by the skill's
rules this is a **cap-reached outcome, not a converged APPROVED**. Being straight
about that: the sole remaining blocker was a concrete, verifiable routing defect
rather than a disagreement, and it is now fixed. But the fix itself landed after
round 3 and has therefore **not been reviewed by Codex**. There are no unresolved
disagreements between the two models.

What the argument bought, across three rounds:
- Caught a latent FLW-75 information-disclosure bug: adding `'embed'` to the
  variant union without splitting the `isPublic` predicate would have served the
  INTERNAL tier inside a public marketing page.
- Caught a clickjacking hole on the lead form, then caught the bypass in the
  first proposed fix.
- Corrected four factual errors in the plan's own repo citations, including two
  that asserted the opposite of the truth.
