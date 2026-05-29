// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project-site hosting.
// The repo is served at https://dkoenawan.github.io/codex-terra/ — so `base`
// must be set, and every internal link/asset must respect it (use
// import.meta.env.BASE_URL or the withBase() helper in src/lib/url.ts).
export default defineConfig({
  site: 'https://dkoenawan.github.io',
  base: '/codex-terra',
  trailingSlash: 'ignore',
});
