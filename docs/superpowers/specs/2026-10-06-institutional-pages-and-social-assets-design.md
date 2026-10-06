# PlayerDojo institutional pages, consent, and social assets

**Date:** 2026-10-06

## Goal

Complete the public launch foundation for PlayerDojo with bilingual
institutional pages, privacy-aware Google Analytics loading, and a consistent
set of social and device icons. The public identity remains the PlayerDojo
brand; no individual maintainer is named.

## Chosen approach

Implement a complete launch package rather than a single combined legal page
or pages without consent controls. The package contains four focused pages in
English and Brazilian Portuguese, a reusable analytics-consent notice, footer
navigation, localized routes, sitemap entries, a branded social preview, and
raster icons derived from the approved crossed-swords mark.

## Institutional pages

Add the following canonical route pairs:

- About: `/about` and `/pt/sobre`
- Contact: `/contact` and `/pt/contato`
- Privacy: `/privacy` and `/pt/privacidade`
- Terms: `/terms` and `/pt/termos`

Each page uses the existing global layout, localized canonical and `hreflang`
metadata, breadcrumbs, responsive typography, and a shared institutional-page
component. Text remains concise and readable at the sizes required by the
project.

The About page presents PlayerDojo as an independent community project for game
tools and explains that Summoners War is its first collection. It describes the
project's purpose, data-source transparency, and independence from publishers
without naming an individual.

The Contact page publishes `contact@playerdojo.com` and provides a mail link for
support, corrections, feedback, and rights-related requests. It does not add a
form or collect submissions inside the site.

The Privacy page explains the limited browser data used by the site, Google
Analytics measurement, local-storage preferences, third-party processing, and
the user's analytics choice. It avoids promises about settings that cannot be
verified from the code and directs privacy questions to the public contact
address.

The Terms page states that tools are informational planning aids, results are
not guarantees, availability may change, users must not misuse the service,
and third-party game names and assets remain the property of their owners. It
does not claim affiliation with Com2uS or other publishers.

These pages are practical project disclosures, not customized legal advice or
a substitute for a jurisdiction-specific legal review.

## Footer and navigation

Add an `Information`/`Informações` footer section containing About, Contact,
Privacy, and Terms. Add a `Cookie settings`/`Preferências de cookies` button in
the footer so users can reopen their analytics choice at any time.

Institutional routes are part of the localized route registry and sitemap. They
remain outside the game-specific sidebar because they apply to the entire
portal.

## Analytics consent

Use the local-storage key `playerdojo:analytics-consent` with the values
`accepted` or `declined`.

- With no stored choice, Google Analytics is not requested and a non-blocking,
  accessible consent notice is shown.
- Accepting stores `accepted`, initializes Google Analytics once, and closes
  the notice.
- Declining stores `declined`, keeps Google Analytics unloaded, removes known
  first-party Google Analytics cookies where possible, and closes the notice.
- Reopening cookie settings shows the notice with the current choice available
  for change.
- The banner is localized from server-rendered text and works on every page.
- Analytics remains production-only and continues using measurement ID
  `G-QTMVTJP8FE`.

The consent UI does not block navigation or content. It uses real buttons,
visible focus states, an accessible region label, and a live status message for
the saved choice.

## Social preview and icons

Create a default `1200x630` PlayerDojo social preview with a dark game-tool
dashboard atmosphere, warm gold accents, the crossed-swords symbol, exact
`PlayerDojo` wordmark, and `Game Tools & Guides` supporting text. Generate the
visual background as a raster asset, then apply exact brand text and symbol
deterministically so generated typography cannot alter the brand name.

Reference the social preview through absolute `og:image` and `twitter:image`
URLs, add image dimensions and alt text, and use `summary_large_image` for the
Twitter card.

Derive stable raster icons from the approved SVG favicon:

- `favicon-48.png`
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png` at 180x180

Keep the SVG favicon as the primary modern browser icon and add the PNG and
Apple variants for search and device compatibility. Add an `Organization`
entity with the public PlayerDojo name, canonical URL, and 512px logo to the
home-page structured data.

## Content security policy

Retain the current Google Analytics script, image, and connection allowlists.
No new third-party runtime domains are added. Social and icon assets are hosted
from the canonical PlayerDojo origin.

## Testing

- Extend SEO E2E coverage for every institutional route pair, canonical URLs,
  `hreflang`, sitemap membership, social metadata, favicon links, and
  `Organization` data.
- Update analytics E2E coverage to prove that Google Analytics is not requested
  before consent, initializes exactly once after acceptance, stays unloaded
  after decline, and can be changed through cookie settings.
- Verify footer navigation and accessible consent controls on desktop and
  mobile.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after generating the build.
- Inspect the generated social preview and representative institutional pages
  visually on desktop and mobile.

## Implementation plan

1. Extend the localized route registry and message dictionaries.
2. Build a shared institutional-page component and add the eight route files.
3. Add the footer information links and cookie-settings control.
4. Refactor third-party script loading around stored analytics consent and add
   the localized consent component.
5. Generate the social background, compose the final preview, and derive raster
   icons from the existing SVG mark.
6. Add social, icon, and organization metadata to the global layout.
7. Add institutional routes to the sitemap and automated coverage.
8. Format, test, build, run E2E, and visually inspect the results.

## Success criteria

- Users can find complete About, Contact, Privacy, and Terms pages in both
  supported languages.
- No public page names or identifies an individual maintainer.
- Google Analytics does not load until the visitor accepts analytics cookies.
- Users can decline or later change the analytics choice.
- Shared links display a polished PlayerDojo preview with exact brand text.
- Search engines and devices can use stable PNG favicon and touch-icon assets.
- Canonical, alternate-language, sitemap, and structured-data output remain
  consistent with `https://www.playerdojo.com`.
- All required automated checks pass.

## Out of scope

- A contact form, newsletter, user accounts, advertising consent, or preference
  center for services other than Google Analytics.
- Naming an individual owner, publishing an address or telephone number, or
  creating social-media profiles.
- Per-tool social preview images; the default image covers every page in this
  implementation.
- Jurisdiction-specific legal certification.
