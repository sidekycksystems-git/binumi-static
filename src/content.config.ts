import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/insights' }),
  schema: z.object({
    category: z.string(),                 // post-cat, e.g. "Strategy", "Model"
    heading: z.string(),                  // card title / article <h1>
    deck: z.string(),                     // standfirst (one source of truth, used on the article AND its cards)
    date: z.coerce.date(),                // ISO in frontmatter, e.g. 2026-06-08
    watch: z.string(),                    // "6 min watch"
    cardTag: z.string(),                  // grid-card VideoFrame tag, e.g. "Model"
    cardDuration: z.string(),             // grid-card video duration, e.g. "3:05"
    status: z.enum(['published', 'planned']).default('published'),
    featured: z.boolean().default(false),
    author: z.string().default('The Binumi team'),
    // published-only (optional so planned entries can omit):
    title: z.string().optional(),             // BaseLayout <title>
    description: z.string().optional(),       // BaseLayout meta description
    heroVideoTag: z.string().optional(),      // article hero VideoFrame tag
    heroVideoDuration: z.string().optional(), // article hero duration, "Watch · 4:12"
    heroVideoSrc: z.string().optional(),      // real hero/featured video (mp4); falls back to play-button placeholder when absent
  }),
});

export const collections = { insights };
