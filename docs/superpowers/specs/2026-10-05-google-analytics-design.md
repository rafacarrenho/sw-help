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
- Configure `G-QTMVTJP8FE` as the public schema default so regular production
  builds work without separate deployment state while still allowing an
  environment override. The measurement ID is public and is not treated as a
  secret.
- Extend the existing Content Security Policy with the non-advertising Google
  Analytics script, image, and connection endpoints.

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
layout, the public environment configuration, the required CSP directives, and
automated verification of the generated production HTML.

## Out of scope

- Google Tag Manager containers.
- Custom events, conversions, consent banners, or cookie-preference UI.
- Analytics on JSON, XML, robots, or plain-text endpoints that do not render the
  shared HTML layout.
- Changes to page content, navigation, SEO metadata, or visual styling.

## Validation

- Run `pnpm test`.
- Run `pnpm build` and confirm the generated HTML contains the loader once per
  page using the configured default.
- Run `pnpm test:e2e` after generating the production build because the change
  affects the global page layout.

## Success criteria

- Every HTML page using `Layout.astro` initializes GA4 property
  `G-QTMVTJP8FE` in production.
- Development pages do not request `googletagmanager.com`.
- The loader cannot initialize twice on the same document.
- The site remains fully functional if Analytics is unavailable or not
  configured.
