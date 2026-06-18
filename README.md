# Binumi Website

Astro static site. Pixel-faithful conversion of the original hand-built HTML, restructured for easy updates and Vercel hosting.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # outputs the static site to dist/
npm run preview  # serve the built dist/ locally
```

## Structure

- `src/layouts/BaseLayout.astro` — document shell (head, fonts, global CSS) wrapping Header / slot / Footer
- `src/components/Header.astro` — nav; `current` prop sets the active link, `ctaHref` sets the header CTA
- `src/components/Footer.astro` — shared footer
- `src/pages/**` — one file per route (clean URLs)
- `src/styles/global.css` — shared stylesheet; page-specific rules live in scoped `<style is:global>` blocks

## Deploy (Vercel)

Connect the GitHub repo (`sidekyckservices/Binumi-Website`) in the Vercel dashboard. Vercel auto-detects Astro (build `astro build`, output `dist/`). Push to `main` → production deploy; pull requests → preview deploys.
