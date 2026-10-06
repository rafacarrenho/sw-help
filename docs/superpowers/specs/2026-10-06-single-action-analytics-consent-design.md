# Single-action analytics consent

## Goal

Simplify the first-visit analytics notice to one prominent action while keeping Google Analytics disabled until the visitor explicitly agrees.

## Behavior

- On a first visit, the notice shows only **Agree and continue**.
- The notice does not claim that analytics is technically required for the site.
- Google Analytics remains unloaded until agreement is stored.
- The stored `accepted` choice continues to load analytics on later page views.
- The footer keeps an analytics preferences entry. After agreement, opening it shows one action to disable analytics, preserving consent revocation.
- A previously stored `declined` choice remains respected. Opening preferences then shows the option to agree.
- On mobile the notice remains in the document flow; on desktop it remains a floating panel.

## Copy

The notice explains that analytics measures which tools are useful, that it only loads after agreement, and links to the privacy policy. It does not describe analytics cookies as essential.

## Testing

Browser tests cover the first-visit single action, delayed tag loading, one-time initialization, revocation through footer preferences, persistence of both stored states, and localized labels.
