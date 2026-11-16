# Sourasis Karak · personal site

A small, deliberately quiet personal site: one centered reading column, honest notes about machine learning work, and a full-viewport ASCII neural network that leans toward the cursor. Built with the Next.js App Router, TypeScript, Tailwind CSS 4, and Canvas 2D. No animation library, WebGL, or images.

## Run locally

Requires Node.js 20.9+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To preview production, run `npm run build` then `npm run start`.

## Pages

- `/` — hero with icon links (GitHub, Gmail, X, résumé), `now`, `things i believe`, `things i like`, `selected work`, and `skills`.
- `/blog` — a minimal "coming soon" page linked from the header and the hero.

## What is where

- `src/data/site.ts`: typed profile copy, beliefs, likes, work, skills, and the things he cares about. Facts come from the older `src/data/projects.ts` and `github.com/thekarak`.
- `src/app/page.tsx`, `src/app/layout.tsx`: server-rendered page, metadata, Person JSON-LD, self-hosted Newsreader + JetBrains Mono fonts, inline theme script (`sk-theme`), and the boot overlay.
- `src/app/globals.css`: light/dark tokens, the column-sized paper wash, skills grid, boot glitch, responsive/print rules.
- `src/components/ascii-scenes.ts`: glyph framebuffer and the nine-layer deep network scene, including cursor-driven lean, receptive field, and pulse bending.
- `src/components/ascii-background.tsx`: canvas lifecycle, 12fps loop, theme palette, passive pointer listeners, reduced-motion handling.
- `src/components/hero-links.tsx`, `skills.tsx`, `site-header.tsx`, `theme-toggle.tsx`, `boot-screen.tsx`: the small interactive pieces.
- `src/data/skill-icons.ts`: official Simple Icons (CC0) path data embedded at build time, so no runtime icon requests.

## The background

One continuous animation, no controls. A nine-layer multilayer perceptron (`4 → 6 → 8 → 10 → 10 → 10 → 8 → 6 → 3`) with dense weighted connections, a layer-by-layer activation wave, three-signal forward batches, a loss trace, and error signals flowing back on an eleven-second loop. The mesh leans toward the cursor; glyphs near the pointer brighten, then melt back when it leaves.

Everything is drawn with real monospace glyphs into a character framebuffer sized from the window, so no layer is cropped. Theme colors come from `--ascii` / `--ascii-strong`, tuned for warm paper and charcoal. Rendering is capped at 12fps with a 1.5× DPR, stops in hidden tabs, and draws one static frame under reduced motion. The canvas is decorative and never intercepts input.

## Boot screen

On the first load of a browser session, a fixed overlay reveals "Sourasis Karak" with a neural-glyph glitch and a progress line, then slides away (~2s). Reduced-motion visitors skip it. It sets a sessionStorage flag so reloads stay immediate.

## Verify

```sh
npm run typecheck
npm run build
```

Lighthouse (local production): accessibility 100, best practices 100, SEO 100.

## Deploy to Vercel

Import the repository with **Next.js** as the framework and repository root as Root Directory. Keep the default output directory and `vercel.json` build command. Set `NEXT_PUBLIC_SITE_URL` to the production origin without a trailing slash. No database or API keys required.
