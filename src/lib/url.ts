/**
 * Prefix an internal path with Astro's configured `base` (e.g. "/codex-terra").
 * Use for every internal link/asset so the site works under the GitHub Pages
 * sub-path. Pass-through for in-page anchors (#…) and absolute URLs (http…).
 *
 *   withBase('/arcana')  ->  '/codex-terra/arcana'
 *   withBase('#books')   ->  '#books'
 */
export function withBase(path: string): string {
  if (path.startsWith("#") || /^[a-z]+:/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
