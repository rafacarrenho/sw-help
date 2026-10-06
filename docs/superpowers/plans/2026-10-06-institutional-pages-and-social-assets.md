# Institutional pages and social assets implementation plan

1. Extend the localized route registry with About, Contact, Privacy, and Terms
   routes for English and Brazilian Portuguese, then add the routes to the
   sitemap.
2. Add localized institutional content to the message dictionaries and render
   it through a shared accessible page component.
3. Create all eight static page entry points and add localized information links
   plus a cookie-settings control to the global footer.
4. Refactor Google Analytics initialization so it remains production-only,
   duplicate-safe, and gated by the persisted analytics choice.
5. Add a bilingual, non-blocking consent notice that can accept, decline, and
   reopen preferences without preventing access to the site.
6. Generate a text-free gaming-tools social background, compose the exact
   PlayerDojo mark and copy into a 1200x630 preview, and derive PNG/touch icons
   from the existing SVG favicon.
7. Extend the shared layout with Open Graph image metadata, a large Twitter
   card, raster icon links, and home-page Organization structured data.
8. Add E2E coverage for institutional routes, footer navigation, sitemap and
   metadata output, and analytics consent behavior.
9. Format changed files, run `pnpm test`, `pnpm build`, and `pnpm test:e2e`, then
   inspect representative desktop/mobile pages and the final social preview.
