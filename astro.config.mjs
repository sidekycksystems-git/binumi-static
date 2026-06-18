// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  // Legacy /why-it-works/* and /how-it-works/ URLs 301 to the new /industries/
  // and /solutions/ routes via vercel.json (the deploy target is Vercel).
  integrations: [mdx()],
});
