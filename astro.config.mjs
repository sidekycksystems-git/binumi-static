// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://binumi.com',
  // Legacy /why-it-works/* and /how-it-works/ URLs 301 to the new /industries/
  // and /solutions/ routes via vercel.json (the deploy target is Vercel).
  // Keep the throwaway prototype route out of the sitemap (it is also noindex).
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/prototype-icons') })],
});
