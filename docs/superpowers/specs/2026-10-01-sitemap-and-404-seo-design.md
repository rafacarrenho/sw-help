# Sitemap and 404 SEO Design

## Objective

Prepare SW Help for search-engine discovery by making the XML sitemap a
complete, canonical inventory of indexable pages and ensuring unknown URLs
return a useful, explicitly non-indexable 404 page.

The production origin remains
`https://sw-help.rafabcarrenho.workers.dev`. A future domain migration will
require changing only Astro's `site` setting; generated sitemap and metadata
URLs will continue to derive from it.

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
query-string variants, and all other non-canonical URLs. Every entry will use
an absolute URL based on `Astro.site`, preserve the configured trailing slash,
and provide reciprocal `en`, `pt-BR`, and English `x-default` alternatives.
The response will use the XML content type. Dates, priorities, and change
frequencies will not be invented because the project has no reliable source
for those values.

## 404 Page and Metadata

Astro's `404.astro` route will remain responsible for unknown URLs so the
server adapter can return HTTP status 404. The page will choose Portuguese for
unknown paths below `/pt/` and English otherwise.

The page will emit `noindex,follow`. The shared layout will omit canonical,
Open Graph URL, and language-alternate links whenever `noIndex` is enabled.
This prevents an unknown URL from incorrectly declaring the home page as its
canonical equivalent. Normal pages retain their current canonical and
language metadata.

The visible 404 state will retain the localized explanation and add clear
localized recovery links to the home page and monster catalog. It will remain
usable with the existing responsive shell, keyboard navigation, and text-size
requirements.

## Verification

Automated coverage will verify that:

- the sitemap is valid XML-shaped output with the expected content type;
- canonical English and Portuguese URLs are present with reciprocal language
  alternatives;
- representative dynamic and paginated URLs are included;
- aliases, API routes, query strings, and `/404/` are absent;
- an unknown English or Portuguese URL returns status 404 and `noindex,follow`;
- 404 output has no canonical or `hreflang` links and exposes localized
  recovery actions;
- a normal page still exposes canonical and alternate links.

The completed implementation will be validated with `pnpm test`, `pnpm build`,
and `pnpm test:e2e` after the build.
