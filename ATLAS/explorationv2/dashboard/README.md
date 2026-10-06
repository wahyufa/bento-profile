# ATLAS learner dashboard concept

Open `atlas-dashboard.html` directly for the standalone version, or serve this folder:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Then open http://127.0.0.1:4173.

Editable source: `index.html`, `style.css`, and `app.js`. No build step or package installation is required. Google Fonts is optional; system sans-serif fallbacks work offline.

This local prototype uses a fictional learner and sample course content. It was grounded in Atlas's public branding and learner feature names; the authenticated dashboard was not accessible. The assistant uses labeled sample responses. Nothing is connected to the live account.

Interactions: course status tabs, course search, saving courses, sample lessons, communication lesson completion, weekly goal editing, five-question Smart Bites quiz, guided role-play, notifications, and mobile navigation. Goal, saved courses, quiz completion, and communication lesson progress persist in browser localStorage under `atlas-preview-v1`.

Verified in Chromium at desktop (1440 px) and mobile (390 px): no horizontal page overflow, course filtering, saved-state changes, search and empty results, lesson progress, goal persistence, quiz scoring, answer locking, and all navigation dialogs. JavaScript syntax check passed. Reduced-motion preferences are respected.
