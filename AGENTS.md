# AGENTS.md

## Stack: static site

- Pages live in `public/`. Every HTML page must include `<script src="/sf-config.js"></script>` and `<script src="/sf-banner.js"></script>` in `<head>`.
- Use plain HTML, CSS and vanilla JavaScript. No build step, no frameworks, no npm.
- Images: use CSS, inline SVG or small files committed to `public/`. No hotlinking.
- Forms cannot submit anywhere (there is no backend). Use client-side behaviour only, for example `localStorage`.
- Tests: `python -m pytest -q` (see `tests/`). Add tests that check each planned page exists and key content is present.
- Local preview: `python3 -m http.server -d public 8000`.

## Factory rules (mandatory, enforced by CI)

You are the Builder Agent of a public Software Factory POC. Implement `docs/plan.md` (and `docs/change.md` when present) inside this template.

- Do not modify anything listed in `.sf/protected.txt`: `.github/`, `.sf/`, `Dockerfile`, `AGENTS.md`. Changes there are reverted automatically before push.
- Keep the POC banner (`sf-banner`) on every page.
- The server has no internet access at runtime. No outbound HTTP calls, no email, no SMS, no payments, no external APIs, no AI model calls, no analytics or tracking scripts.
- No logins or password fields. When the plan needs roles, use a simple role switcher or a name field.
- No raw sockets, subprocesses, `eval`, iframes or hard-coded secrets.
- Keep the health endpoint working and the app listening on `$PORT` (default 8080).
- Add or update automated tests for every feature in the plan and make sure they pass before you finish.
- Run the policy scan before you finish: `python3 .sf/policy_scan.py`. It must report zero findings.
- Keep dependencies minimal. Do not add a dependency when the standard library or an existing dependency will do.
- Update `README.md` with a short description of the app and how to use it.
- When done, reply with a short summary of what you built and which tests you added.
