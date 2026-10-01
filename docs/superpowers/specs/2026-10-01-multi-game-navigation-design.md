# Multi-game navigation design

## Goal

Turn the current Summoners War-only shell into a scalable game portal without losing the compact sidebar, active states, responsive behavior, language switching, or SEO foundations already in place.

## Information architecture

The site has two navigation levels:

1. The portal home and complete games section are available from the brand and footer.
2. Contextual sidebar navigation belongs to the selected game and lists its home and tools.

The brand always links to the localized portal home. The portal home shows an accessible game selector inside the sidebar, where it acts as the entry point to every registered game. Once a visitor enters Summoners War, that portal selector disappears and the sidebar shows only the contextual navigation for the active game. Its home link is labeled simply “Summoners War”, without “overview” or “visão geral”. On game pages, the topbar remains a compact contextual badge until the registry contains two or more games, when it becomes an additional selector.

## Routes

The global homes remain `/` and `/pt`. Summoners War moves into a stable game namespace:

- `/summoners-war`
- `/summoners-war/siege-counter`
- `/summoners-war/monsters`
- `/summoners-war/speed-tuning`
- `/summoners-war/speed-comparison`
- `/summoners-war/speed-tick`
- localized equivalents under `/pt/summoners-war`

Existing public paths redirect permanently to their new equivalents and preserve query strings. Canonicals, hreflang links, sitemap entries, breadcrumbs, JSON-LD, internal links, and `llms.txt` use the new routes.

## Components and data

- A central game registry owns game IDs, labels, icons, home routes, and navigation items.
- `Layout.astro` renders the active game's menu, a conditional topbar selector, the portal footer, and the correct breadcrumb hierarchy.
- A new portal home presents available games. The existing home becomes the Summoners War game overview.
- When multiple games exist, the selector and language menu are independent accessible popovers. Opening one closes the other.

## Responsive behavior

On the portal home, the sidebar starts with the game selector and contains no game-specific navigation. Expanded desktop game navigation starts directly with the selected game's home and tools. Collapsed desktop navigation keeps icons, active states, selectors, and tooltips. Mobile uses the existing modal drawer and focus management. The footer always lists portal links and registered games. The topbar's inner content shares the same maximum width and horizontal alignment as the main content and footer.

## Footer

The footer uses Luabify's information architecture as a reference without copying its brand. It has a prominent brand and description area, an “Explore” group for portal navigation, a “Games” group generated from the game registry, and a separated bottom row for copyright and a game-agnostic community and trademark disclaimer. Product version labels are not displayed. It must not invent social profiles, legal pages, or institutional links that do not exist.

## SEO

The global home owns `WebSite` structured data. Game and tool pages use breadcrumbs beginning at the portal home, followed by the game hub. Tool pages retain `WebApplication` markup. Redirects prevent existing URLs from becoming dead links.

## Validation

- Unit tests cover localized route generation and the game registry.
- Existing tests are updated to canonical paths where they assert URLs or links.
- `pnpm test`, `pnpm build`, and `pnpm test:e2e` validate data, static generation, redirects, navigation, language switching, and SEO output.
