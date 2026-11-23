# change.md

## Change summary
Add a small static footer line reading "Built by the software factory POC" to the bottom of the single landing page. This is a pure markup/style addition with no backend, network, or data changes, and does not touch the POC banner, `/health`, or CI/infra files.

## Changes

1. **Add footer line to `index.html`**
   - Add a `<footer>` element at the end of the page content (after the "What to bring" checklist section, before closing `</body>`), containing the exact text `Built by the software factory POC`.
   - Keep the existing POC banner markup unchanged and visible.
   - **Acceptance criteria:**
     - Given the page loads, When I scroll to the bottom, Then I see a footer containing the text "Built by the software factory POC".
     - The existing POC banner remains present and unchanged.
     - No network requests, remote fonts, or external assets are introduced.

2. **Style the footer in `styles.css`**
   - Add minimal styling for the new `<footer>` (spacing, centered or left-aligned text, readable contrast) consistent with the existing page styles.
   - Must reflow/remain readable on both mobile and desktop breakpoints, with no remote fonts/assets.
   - **Acceptance criteria:**
     - Given a narrow mobile viewport and a desktop viewport, When I view the footer, Then the text is readable and does not overflow or overlap other content.

## Tests to add or update
- Update the structural assertions in the existing test file (e.g. `tests/page.test.js`) to add a check that a `<footer>` element exists and its text content includes "Built by the software factory POC".
- No changes needed to checklist-persistence or FAQ-toggle tests.

## Out of scope
- Any changes to the POC banner, `/health` endpoint, `Dockerfile`, nginx config, or CI files.
- Links, contact info, social icons, or any outbound/external references in the footer.
- Dynamic/generated footer content or any backend involvement.
