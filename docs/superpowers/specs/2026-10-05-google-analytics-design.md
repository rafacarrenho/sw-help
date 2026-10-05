# Google Analytics integration

**Date:** 2026-10-05

## Goal

Add the Google Analytics 4 property `G-QTMVTJP8FE` to every HTML page of SW
Help, following the production-only loading pattern already used by Luabify.

## Architecture

- Add a global `ThirdPartyScripts` Astro component responsible for optional
  third-party scripts.
- Render the component once in the shared `Layout.astro` `<head>` so all pages
  using the layout receive the same integration.
- Read the measurement ID from the public build-time environment variable
  `PUBLIC_GOOGLE_ANALYTICS_ID`.
- Configure the production environment with `G-QTMVTJP8FE`; the measurement ID
  is public and is not treated as a secret.

## Runtime behavior

- Do not load Google Analytics while Astro is running in development mode.
- In production, do nothing when the measurement ID is absent.
- Before loading Analytics, check for an existing script marked for SW Help to
  prevent duplicate initialization.
- Create the Google tag script asynchronously and initialize `dataLayer` and
  `window.gtag` with the configured measurement ID.
- Enable `anonymize_ip`, matching the existing Luabify integration.
- Analytics failure must not block rendering or other site scripts.

## Scope

The change covers the shared Analytics loader, its inclusion in the global
layout, the public environment configuration, and automated verification of the
generated production HTML.

## Out of scope

- Google Tag Manager containers.
- Custom events, conversions, consent banners, or cookie-preference UI.
- Analytics on JSON, XML, robots, or plain-text endpoints that do not render the
  shared HTML layout.
- Changes to page content, navigation, SEO metadata, or visual styling.

## Validation

- Run `pnpm test`.
- Run a production build with `PUBLIC_GOOGLE_ANALYTICS_ID=G-QTMVTJP8FE` and
  confirm the generated HTML contains the loader once per page.
- Run `pnpm build` to verify the normal build remains valid when the environment
  variable is absent.
- Run `pnpm test:e2e` after generating the production build because the change
  affects the global page layout.

## Success criteria

- Every HTML page using `Layout.astro` initializes GA4 property
  `G-QTMVTJP8FE` in production.
- Development pages do not request `googletagmanager.com`.
- The loader cannot initialize twice on the same document.
- The site remains fully functional if Analytics is unavailable or not
  configured.
