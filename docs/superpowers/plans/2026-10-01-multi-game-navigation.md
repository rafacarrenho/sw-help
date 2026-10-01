# Multi-game navigation implementation plan

1. Add a typed game registry and localized portal/footer navigation copy.
2. Add portal and game route namespaces while retaining legacy redirect routes.
3. Build the localized portal home and move Summoners War page entrypoints below its game namespace.
4. Refactor the contextual sidebar, portal-home sidebar selector, conditional game-page topbar selector, aligned header container, Luabify-inspired footer, popover behavior, breadcrumbs, and structured data around portal and game contexts.
5. Update sitemap, `llms.txt`, tests, and navigation expectations.
6. Format, run unit tests, build all static pages, run end-to-end tests, and inspect representative desktop and mobile pages.
