# Leaf Exchange Saturday landing page

## Summary
A made-up neighbourhood plant swap needs a small one-page site telling neighbours when and where the event happens, how it works, and what to bring. Target users are neighbours who want to swap plants. The outcome is a single static page with a hero, a 3-step guide, 8 example plant cards, an expandable FAQ, and a browser-persisted "what to bring" checklist — all served as plain HTML/CSS/JS with no backend.

## Similar initiatives
- **LP-003 Autumn collection landing page (static)** — Reuses the one-page showcase + card gallery pattern; here the gallery is 8 plant cards instead of products, and there is no store-hours block.
- **LP-019 Charity fun run page (static)** — Reuses the event-details hero (date/place); differs by adding interactive FAQ and a persisted checklist rather than static event info only.
- **LP-009 Loyalty programme explainer (static)** — Reuses the FAQ accordion (expand/collapse) pattern directly; differs by adding the plant-card gallery and local-storage checklist.

## Scope
1. **Event hero**
   - As a neighbour, I want to see when and where the swap happens so I can plan to attend.
   - Given the page loads, When I view the top of the page, Then I see a hero with an event date, time and place (placeholder: Saturday, 10:00, Community Garden).
2. **How it works (3 steps)**
   - As a neighbour, I want to understand the process so I know what to do on the day.
   - Given the page loads, When I view the How it works section, Then exactly 3 numbered steps are shown.
3. **Example plant cards**
   - As a neighbour, I want to see examples of plants so I know what kinds of plants to bring.
   - Given the page loads, When I view the plants section, Then exactly 8 plant cards are displayed, each with a name and short description.
4. **FAQ accordion**
   - As a neighbour, I want answers to common questions without scrolling through dense text.
   - Given an FAQ item is collapsed, When I click its question, Then its answer expands; When I click it again, Then the answer collapses.
5. **What to bring checklist (persisted)**
   - As a neighbour, I want to tick off items I've prepared and have them remembered.
   - Given I tick an item, When I reload the page in the same browser, Then the ticked state is still shown.
   - Given I untick an item, When I reload, Then it is shown unticked.

## Out of scope
- Backend or database
- Sign-ups, RSVPs or contact forms
- Email or SMS sending
- Payments
- User accounts or authentication
- Real addresses or personal data
- External APIs, maps, or outbound HTTP

## Data model
None — static site, no database. The only persisted state is the checklist, stored client-side in `localStorage` (key/value booleans per checklist item id). No server storage.

## Pages and endpoints
| Path | Purpose | Who uses it |
|------|---------|-------------|
| `/` (`index.html`) | Single landing page: hero, how it works, plant cards, FAQ, checklist, POC banner | Neighbours |
| `/health` | Template health endpoint (unchanged) | Ops / CI |

## Test plan
**Automated (JS unit / DOM-level, runnable in browser or via a lightweight test harness such as a vanilla JS test file):**
- Checklist persistence: toggling an item writes expected `localStorage` value; on init, stored values set the correct checkbox states.
- FAQ toggle: clicking a question toggles the `open`/expanded state attribute/class on its answer.
- Structural assertions: exactly 3 step elements, exactly 8 plant-card elements render in the DOM.

**Manual UAT checklist (requester, on staging):**
- [ ] Hero shows event date, time and place.
- [ ] How it works shows exactly 3 steps.
- [ ] Exactly 8 plant cards appear.
- [ ] Each FAQ item expands and collapses on click.
- [ ] Ticking checklist items and reloading keeps the ticks.
- [ ] POC banner is visible.
- [ ] Layout is readable on a narrow mobile viewport and a desktop viewport.

## Risks and guardrails
- **No backend/database (template rule):** checklist state must use `localStorage` only — never a server call. No `fetch`/XHR to any origin.
- **No outbound HTTP / external services:** all CSS, JS and images must be local assets; no CDN links, web fonts fetched remotely, or map embeds.
- **No personal data:** keep all event details as obvious placeholders; checklist stores only boolean UI state, no names or contact info.
- **POC banner must remain:** do not remove or hide the template banner.
- **Keep it small:** plain HTML/CSS/vanilla JS, no build step or framework, to fit one <40-minute session.
- **Accessibility/responsiveness risk:** FAQ accordion and cards must be keyboard-operable and reflow on small screens; test both breakpoints.

## Builder instructions
Keep the template's POC banner, `/health` endpoint, `Dockerfile`, nginx config and CI files **unchanged**.

1. Edit `index.html` (the template's main static page). Keep the existing POC banner markup in place.
2. Add a `<header>`/hero section with the event title, placeholder date/time/place (Saturday, 10:00, Community Garden).
3. Add a **How it works** `<section>` containing exactly 3 steps (e.g. an ordered list or 3 step cards).
4. Add a **Plants** `<section>` with exactly 8 plant cards; use a repeating card markup block, each with a name and one-line description. Use local placeholder images or CSS-styled tiles (no remote image URLs).
5. Add an **FAQ** `<section>` with several question/answer pairs using a native `<details>`/`<summary>` accordion (or button-toggled divs) so each expands/collapses independently.
6. Add a **What to bring** `<section>` with a checklist of `<input type="checkbox">` items, each with a stable `id`.
7. In `styles.css` (template stylesheet), add responsive styles: a mobile-first layout, a grid for the plant cards that reflows to one column on narrow screens, and styling for hero, steps, FAQ and checklist. Do not reference any remote fonts/assets.
8. In `app.js` (template JS, or add a new local `app.js` referenced by `index.html`):
   - On load, read each checklist item's state from `localStorage` and apply it.
   - On `change`, write the item's boolean state to `localStorage` keyed by the checkbox `id`.
   - If using button-toggled FAQ instead of `<details>`, wire click handlers to toggle the expanded state and `aria-expanded`.
   - Make no network requests.
9. Add a small test file (e.g. `tests/page.test.js` or an in-browser test harness consistent with the template) covering the automated checks above.
10. Verify locally: 3 steps, 8 cards, FAQ toggles, checklist persists across reload, banner visible, and layout readable at mobile and desktop widths.
