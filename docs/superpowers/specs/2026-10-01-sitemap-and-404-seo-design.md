# Sitemap and 404 SEO Design

## Objective

Prepare SW Help for search-engine discovery by aligning it with Luabify's
static Astro delivery model, making the XML sitemap a complete canonical
inventory of indexable pages, and ensuring unknown URLs return a useful,
explicitly non-indexable 404 page.

The production origin remains
`https://sw-help.rafabcarrenho.workers.dev`. A future domain migration will
require changing only Astro's `site` setting; generated sitemap and metadata
URLs will continue to derive from it.

## Static Delivery and URL Contract

SW Help will be generated as a fully static Astro site. The Astro Cloudflare
adapter and server output will be removed, `build.format` will be `file`, and
the project will not force Astro's `trailingSlash` option. This matches
Luabify's delivery model and the project's existing frontend-only
architecture.

Canonical page paths will not end in a slash, except for the root `/`. For
example, `/monsters/` becomes `/monsters`, `/pt/` becomes `/pt`, and a defense
URL becomes `/siege/:id`. Route helpers, internal links, redirects, canonical
metadata, language alternatives, tests, and the sitemap will use the same
format.

Cloudflare Workers Static Assets will serve `dist` through a `wrangler.toml`
configuration. Its HTML handling will normalize alternate HTML paths to the
generated file URL, while `not_found_handling = "404-page"` will serve the
generated `404.html` with HTTP status 404 for unknown production URLs.

## Sitemap

Keep the existing custom `/sitemap.xml` endpoint. It already has the project
context needed to enumerate dynamic defense, monster, and catalog pagination
routes, and it supports reciprocal language alternatives without adding a new
dependency.

The sitemap will include both canonical locale variants for:

- home;
- the monster catalog and its numbered pages;
- every defense detail page;
- every monster detail page;
- speed comparison, speed tuning, and speed tick.

It will exclude redirects and legacy aliases, JSON endpoints, the 404 page,
query-string variants, trailing-slash variants, and all other non-canonical
URLs. Every entry will use an absolute URL based on `Astro.site` and provide
reciprocal `en`, `pt-BR`, and English `x-default` alternatives. The response
will use the XML content type. Dates, priorities, and change frequencies will
not be invented because the project has no reliable source for those values.

## 404 Page and Metadata

Astro's `404.astro` route will generate the static `404.html` used for unknown
URLs. Astro development and preview will display that custom page without a
trailing-slash mismatch screen, and Cloudflare Static Assets will return it
with HTTP status 404 in production. Because a single static fallback cannot
inspect the original request path, the page will use the default English
locale, matching Luabify's static fallback behavior.

The page will emit `noindex,follow`. The shared layout will omit canonical,
Open Graph URL, and language-alternate links whenever `noIndex` is enabled.
This prevents an unknown URL from incorrectly declaring the home page as its
canonical equivalent. Normal pages retain their current canonical and
language metadata.

The visible 404 state will retain the SW Help application shell, a clear error
explanation, and recovery links to the home page and monster catalog. It will
remain usable with the existing responsive shell, keyboard navigation, and
text-size requirements.

## Verification

Automated coverage will verify that:

- the sitemap is valid XML-shaped output with the expected content type;
- canonical English and Portuguese URLs without trailing slashes are present
  with reciprocal language alternatives;
- representative dynamic and paginated URLs are included;
- aliases, API routes, query strings, and the `/404` route are absent;
- an unknown URL without a trailing slash renders the custom page with status
  404 and `noindex,follow` in preview and through Workers Static Assets;
- 404 output has no canonical or `hreflang` links and exposes recovery actions
  to the English home and catalog;
- a normal page still exposes canonical and alternate links.

The completed implementation will be validated with `pnpm test`, `pnpm build`,
and `pnpm test:e2e` after the build.
