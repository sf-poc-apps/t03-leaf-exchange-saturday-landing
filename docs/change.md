## Change summary
Increase the size of the main hero heading and add a one-line subtitle directly beneath it. This is a purely presentational, static change to `index.html` and `styles.css` — no new sections, no behaviour, no network calls. Stays within the plain HTML/CSS/JS, no-backend guardrails.

## Changes
1. **Enlarge the main hero heading**
   - In `index.html`, keep the existing hero `<h1>` element (the event title); do not add a second `<h1>`.
   - In `styles.css`, increase the hero heading's `font-size` by one clear step (e.g. bump to a larger value using a responsive/relative unit), keeping it readable and not clipped at both breakpoints.
   - **Acceptance criteria:** Given the page loads, When I view the hero, Then the main heading renders visibly larger than before, remains a single `<h1>`, and does not overflow or clip on a narrow mobile viewport or a desktop viewport.

2. **Add a one-line subtitle under the heading**
   - In `index.html`, add exactly one subtitle element (e.g. a `<p class="hero-subtitle">`) immediately after the hero `<h1>`. Use short, generic, placeholder text — no personal data, no real addresses, no contact info.
   - In `styles.css`, style the subtitle to sit directly below the heading with appropriate spacing and a smaller font size than the heading.
   - **Acceptance criteria:** Given the page loads, When I view the hero, Then exactly one subtitle line appears directly beneath the main heading, is visually subordinate to the heading, and reflows legibly on mobile and desktop.

## Tests to add or update
- No change to existing automated structural assertions (3 steps, 8 plant cards), FAQ toggle, or checklist persistence tests — they must still pass.
- Optionally add a small DOM assertion to the existing test file that the hero contains exactly one `<h1>` and one subtitle element following it (purely structural; no network).

## Out of scope
- Any new sections, cards, FAQ items, or checklist items.
- Changes to the POC banner, `/health` endpoint, `Dockerfile`, nginx config, or CI files.
- Remote fonts/assets, CDN links, or any network requests.
- Content beyond a short generic placeholder subtitle (no real event details or personal data).
