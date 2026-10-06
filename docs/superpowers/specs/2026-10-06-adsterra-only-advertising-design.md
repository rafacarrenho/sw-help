# Adsterra-only advertising design

Date: 2026-10-06

## Objective

Monetize PlayerDojo using Adsterra as the only advertising provider. Every
public HTML page must reserve at least one advertising placement. Google
AdSense and other ad networks are outside this scope.

The implementation must distinguish an advertising placement from a delivered
impression: PlayerDojo can guarantee that every page contains an Adsterra slot
and requests an ad when permitted, but cannot guarantee delivery when the
network has no fill, is unavailable, or is blocked by the visitor.

## Product decisions

- Adsterra is the sole advertising provider.
- The initial format is an in-content Native Banner or standard display banner.
- Popunder, forced redirects, direct links, and similarly disruptive formats
  are excluded from the first release.
- At least one ad slot is rendered by the shared layout on every public HTML
  route, including tools and institutional pages.
- No competing network or house-ad fallback is rendered when Adsterra fails.
- Failure to deliver an impression must not erase page content or break a tool.
  The reserved area may collapse after a bounded timeout.
- The site must label delivered inventory as advertising.

## Compliance boundary

The site will not describe a forced acceptance wall as valid consent. Under the
strict European design, personalized advertising and non-essential device
storage require a freely given choice. Refusing personalized advertising must
not prevent access to site content.

Adsterra must confirm whether its publisher tag supports a contextual or
non-personalized mode that does not use non-essential cookies, local storage,
fingerprinting, or equivalent identifiers. It must also disclose whether it
supports IAB Europe TCF 2.3 or another consent signal that its tag actually
reads.

Until Adsterra provides that confirmation, the safe behavior for a visitor who
has not consented is to keep the third-party tag unloaded. This means the slot
exists but an impression is not requested. If Adsterra confirms a compliant
contextual mode, that mode becomes the default for visitors who do not grant
personalization.

This is a technical design, not a legal opinion. The privacy and advertising
disclosures must be reviewed again after the exact Adsterra tag, contracts, and
data-processing documentation are available.

## Consent model

Consent is stored as a versioned first-party preference rather than a single
boolean:

```ts
type PrivacyPreferences = {
  version: 1;
  analytics: boolean;
  personalizedAds: boolean;
  updatedAt: string;
};
```

Advertising and analytics are separate purposes. The first layer offers two
equally accessible actions:

- `Accept personalized ads`
- `Use contextual ads`

A preferences view controls analytics separately and explains that advertising
funds PlayerDojo. The footer keeps a permanent privacy-settings entry so the
choice can be changed or withdrawn.

If Adsterra does not support the contextual mode described above, selecting
contextual advertising leaves the Adsterra script unloaded. The interface must
not promise a contextual Adsterra impression that the provider cannot supply.

## Architecture

### Privacy preference controller

Owns preference parsing, migration, persistence, and change events. Invalid or
unknown stored values fail closed: analytics is disabled and personalized
advertising is not loaded.

### Adsterra loader

The only component authorized to inject Adsterra scripts. It receives a mode:

- `blocked`: do not contact Adsterra;
- `contextual`: use only the provider-documented non-personalized tag or
  parameters;
- `personalized`: load the approved personalized advertising tag after consent.

Each script is injected once, even during client-side events or repeated consent
updates. Revoking consent prevents future personalized loads and clears only
provider storage that Adsterra documents as safe for the publisher to remove.
Already executed third-party JavaScript cannot be unexecuted; the page may be
reloaded after revocation when required to apply the new mode reliably.

### Ad slot

A shared, responsive component renders the container, advertising label, stable
dimensions, provider placement identifier, loading state, timeout, and failure
state. The slot must not contain page-specific business logic.

The global layout supplies one default placement. A page may opt into additional
placements later, but the first release has a conservative density and never
places an ad where it can be mistaken for a tool action or result.

### Configuration

Placement identifiers, allowed formats, script URLs, timeouts, and feature flags
live in one typed configuration module. The real Adsterra code is added only
after the publisher account provides it. No tag or domain is inferred from
examples found online.

## Data flow

1. Astro renders the page and an empty, size-reserved Adsterra slot.
2. The preference controller reads and validates the saved preference.
3. The controller selects `blocked`, `contextual`, or `personalized`.
4. The loader injects only the tag approved for that mode.
5. The slot waits for a provider-defined success signal when one exists;
   otherwise it uses observable DOM changes plus a bounded timeout.
6. On failure or no fill, the site records only a first-party aggregate event
   that contains no advertising identifier, then collapses the empty area.
7. When preferences change, the controller reapplies the safest supported mode
   and reloads the page if provider state cannot be changed safely in place.

## Failure and blocking behavior

- Network error or no fill: collapse the empty container after the timeout.
- Ad blocker: show a small, non-blocking message in the slot; do not disable the
  tool or obscure the page.
- Malformed provider configuration: fail closed and log a development error.
- Duplicate initialization: ignore subsequent injections.
- Consent storage unavailable: treat the visitor as not having granted
  personalized ads.
- Provider script exception: isolate it so navigation and tools remain usable.

Blocking the entire site when an impression is missing is intentionally
excluded. A browser extension, DNS filter, provider outage, or zero-fill
response cannot be reliably distinguished, so such a gate would produce false
blocks and would still not guarantee a paid impression.

## Privacy and content updates

Before production activation, the privacy and cookie disclosures must name the
Adsterra contracting entity and document:

- purposes and legal bases;
- cookies, browser storage, pixels, and identifiers;
- data categories and retention;
- recipients and subprocessors;
- international transfers and safeguards;
- how consent is changed or withdrawn;
- the provider privacy-policy link and publisher contact channel.

The site must not claim that Adsterra is cookieless, contextual, TCF-compatible,
or compliant with a specific regime without written provider documentation.

## Provider launch checklist

Obtain written answers from Adsterra for:

1. contextual/non-personalized serving without non-essential device storage;
2. IAB Europe TCF 2.3 support, Global Vendor List ID, and TC String handling;
3. complete cookie, domain, identifier, retention, and subprocessor inventory;
4. international-transfer mechanism and Data Processing Agreement;
5. geolocation controls and behavior when consent is absent or withdrawn;
6. a reliable success/no-fill event for publisher integrations;
7. exact production tags and placement identifiers.

## Testing

### Unit and component tests

- preference validation and version migration;
- mode selection for unknown, contextual, personalized, and revoked states;
- single script injection;
- timeout and empty-slot collapse;
- no script injection in `blocked` mode;
- safe handling of corrupt storage and provider errors.

### End-to-end tests

- every generated HTML route contains the default ad slot;
- no personalized Adsterra request occurs before consent;
- personalized consent loads the tag once;
- contextual selection loads only the documented contextual integration;
- withdrawal stops later personalized initialization;
- an unavailable or blocked tag does not break navigation or tools;
- mobile and desktop layouts reserve space without harmful layout shift;
- the advertising label remains readable and accessible.

Provider network calls are intercepted in automated tests. Production smoke
tests verify the final tag separately after Adsterra supplies it.

## Delivery sequence

1. Obtain the exact Adsterra tag and the compliance answers above.
2. Replace the current binary analytics choice with versioned granular
   preferences.
3. Add the shared ad slot, centralized configuration, and isolated loader.
4. Integrate the verified Adsterra modes.
5. Update privacy and cookie disclosures with provider-specific facts.
6. Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` against the generated site.
7. Activate production advertising behind a feature flag and perform a smoke
   test on `www.playerdojo.com`.

## Out of scope

- Google AdSense or any second ad network;
- direct sponsorship and self-hosted house ads;
- guaranteed impressions or revenue;
- popunders, forced redirects, and access-blocking ad walls;
- server-side behavioral profiles;
- adding undocumented Adsterra parameters or attempting to circumvent consent.

## References

- [EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202005_consent_en.pdf)
- [IAB Europe TCF for publishers](https://iabeurope.eu/tcf-for-publishers-2/)
- [IAB Europe vendor list](https://iabeurope.eu/vendor-list/)
- [Adsterra publishers](https://adsterra.com/publishers/)
- [Adsterra cookies policy](https://adsterra.com/cookies/)
