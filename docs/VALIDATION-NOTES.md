# Validation Notes

## Visual checks

- Desktop captures at 1280 × 900 confirmed the homepage hierarchy, first slideshow photograph, authenticated notice inbox, Doxy.me handoff card, and clinician notice workspace render without clipping or overlap.
- Mobile captures at 390 × 844 confirmed the homepage, slideshow, scheduling controls, portal actions, privacy notice, administrator form, non-clinical confirmation, and notice-history empty state reflow into a readable single-column layout.
- The first carousel photograph is loaded eagerly; subsequent photographs remain lazy-loaded. The slideshow exposes previous/next controls, five labeled direct-navigation buttons, a visible position count, and no automatic advancement.
- Live interaction testing confirmed the next control changes the visible photograph from Honduras to India and updates the count from “Photo 1 of 5” to “Photo 2 of 5.”
- Live scheduling interaction confirmed that selecting Friday changes the visit type to telehealth and removes the afternoon office window, leaving only 10:00 AM–12:00 PM.
- The persistent Insurance navigation link reaches the planner, where the participation-versus-member-eligibility disclosure is visible alongside the plan and co-pay controls.
- The live dropdown contains eleven entries, including “Amerigroup / Wellpoint Georgia”; direct selection updates the visible control correctly while retaining the no-real-time-eligibility disclosure.
- A live schema check confirmed that the database contains `users`, `practiceNotices`, and `noticeViews`; the obsolete portal document and audit tables are no longer present.
- A targeted scan of dev-server, browser-console, and network logs after 01:09 UTC found no current errors, exceptions, failed requests, or 4xx/5xx responses. Earlier startup errors predate the clean dependency install and restart.

## Automated checks

- Final Vitest run: 3 test files and 7 tests passed.
- Final production build: completed successfully; Vite reported only a non-blocking JavaScript chunk-size advisory.
