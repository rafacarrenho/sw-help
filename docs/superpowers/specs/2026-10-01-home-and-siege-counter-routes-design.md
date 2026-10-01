# Home and Siege Counter Routes Design

## Objective

Give SW Help a real landing page and make the Siege Counter a clearly named
tool beneath it. The home page becomes the recovery destination for unknown
URLs, while navigation, breadcrumbs, localized routes, and search metadata use
the same hierarchy.

## Route Contract

The canonical English routes will be:

- `/` for the SW Help home page;
- `/siege-counter` for the Siege Counter catalog;
- `/siege-counter/:id` for a defense and its registered counters.

The canonical Portuguese routes will be:

- `/pt` for the SW Help home page;
- `/pt/siege-counter` for the Siege Counter catalog;
- `/pt/siege-counter/:id` for a defense and its registered counters.

`siege-counter` remains singular because it is the product name, not the name
of a collection. The old `/siege/:id` routes will be legacy redirects to the
new detail routes so existing external links do not become dead links. The old
root URL cannot redirect because it becomes the new home page.

## Home Page

The current catalog UI will move from the root page into a dedicated,
locale-aware Siege Counter page without changing its search, filters, defense
cards, or demonstration-content notice.

The new home will use the existing application shell and visual language. It
will contain:

- a concise hero that introduces SW Help as a Summoners War toolkit;
- a primary action to open Siege Counter and a secondary action to explore the
  monster catalog;
- a tool grid linking to Siege Counter, Monster Catalog, Spd Tuning, SPD
  Comparison, and Spd Tick;
- honest status labels for tools that are not a current priority, without
  inventing usage, validation, or success metrics.

The content will be localized in English and Portuguese. It will reuse the
existing icon and card system and remain fully useful without client-side
JavaScript.

## Navigation and Breadcrumbs

The desktop and mobile SW Help brand links will continue to point to the
localized home page. The sidebar will not contain a separate Home entry because
the brand and breadcrumb already provide that path. Siege Counter will point to
its dedicated route, and the sidebar will remain focused on tools.

Breadcrumbs will express the new hierarchy:

- home: `Home`;
- a tool page: `Home > Tool name`;
- a defense or monster detail: `Home > Tool name > Detail type`.

Every breadcrumb segment that represents a page will be a link, while the
current segment will use text and `aria-current` semantics. The Home page will
not activate a sidebar item. Tool pages will retain their own active sidebar
state.

## 404 Recovery and SEO

The custom 404 page will replace its Siege Counter recovery action with a
localized `Back to home` action. The monster catalog remains available as a
secondary recovery path. Its static English fallback, `noindex,follow`, and
omission of canonical and language-alternate metadata remain unchanged.

The sitemap, canonical URLs, `hreflang` pairs, internal links, and structured
route helpers will include the home and new Siege Counter routes. Canonical
output will continue to omit trailing slashes except for `/`. Legacy redirect
routes will not appear in the sitemap.

## Verification

Automated coverage will verify that:

- both localized home pages render their localized introduction and tool
  links;
- Siege Counter catalog and detail pages use the new canonical routes;
- legacy defense URLs redirect to their new canonical counterparts;
- the brand always returns to the localized home page;
- the sidebar does not duplicate the Home link;
- breadcrumbs render the correct home, tool, and detail hierarchy;
- the 404 primary action returns to `/` and no longer labels the destination as
  Siege Counter;
- the sitemap contains the new routes and excludes legacy routes;
- canonical and alternate-language metadata match the new route contract.

The implementation will be validated with `pnpm test`, `pnpm build`, and
`pnpm test:e2e` after generating the static build.
