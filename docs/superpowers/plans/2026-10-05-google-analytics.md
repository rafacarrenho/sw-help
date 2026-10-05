# Google Analytics implementation plan

1. Register `PUBLIC_GOOGLE_ANALYTICS_ID` in Astro's public environment schema,
   using `G-QTMVTJP8FE` as the deployable default while allowing overrides.
2. Add a production-only `ThirdPartyScripts` component based on Luabify's
   duplicate-safe Google tag loader and mount it in the shared layout head.
3. Permit the non-advertising Google Analytics endpoints in the site's Content
   Security Policy.
4. Add automated checks for the CSP and browser initialization behavior.
5. Run unit tests, build the static site, and run the navigation E2E suite.
