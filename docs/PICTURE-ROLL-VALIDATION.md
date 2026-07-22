# Picture Roll Validation

Validated July 22, 2026 after the client-directed gallery revision.

- Desktop and mobile full-page captures show the new red-coat patient-care photograph as the first slide.
- The title reads “A lifetime of care and caring at home and abroad.” and the former camera attribution row is absent.
- The first slide remains fully visible within the gallery frame, with readable copy and unobstructed previous/next controls.
- The eight-position indicator fits at both tested breakpoints without colliding with controls or captions.
- Vitest: 10 tests passed across four files, including three focused carousel-data tests.
- Production build completed successfully; the only build notice is the existing large-chunk advisory.

The live preview exposes all eight direct-slide controls with descriptive accessible names. The gallery frame shows the complete red-coat patient-care scene, requested Savannah copy, revised title, keyboard guidance, and unobstructed navigation at the desktop breakpoint.

Direct slide inspection confirms the Chatham County photograph now shows the top of Dr. McAlpine’s hair and the shirt area below the USA pin. The Thailand scan renders as an outreach scene without the photographed “Phuket, Thailand - Tsunami” wording below it; its new on-site caption remains readable.

The Senegal scan likewise displays the outreach group without the photographed “Dakar, Senegal” wording below the image. The brown-jacket portrait appears as a second “Through the Years” entry with the requested “Serving since 1974.” caption and complete portrait framing.

The post-interaction browser-console and network scans contain no current errors or failed requests. Dev-server matches are stale startup failures from July 19 and an earlier July 22 process event; current TypeScript and preview health checks report no errors.

The reopened live preview retains all eight descriptive direct-slide buttons plus visible previous and next arrow controls. The gallery is fully visible at `#about`, with the current slide position announced in text and the requested non-autoplay keyboard guidance present.

Clicking the visible next arrow advanced the gallery from photo 6 to photo 7, and clicking the previous arrow returned it from photo 7 to photo 6. Both controls retained their visible focus ring after activation.

The first browser-level ArrowRight attempt did not change the slide because clicking the broad carousel region did not place keyboard focus on its focusable root. Focus targeting will be inspected and the keyboard handler retested before release.

After adding an explicit `tabIndex` and focus-visible ring to the carousel region, the refreshed preview rendered the updated gallery without layout regressions. The current Through the Years slide, arrow controls, direct-slide controls, and position indicator remain visible and aligned.

Programmatic inspection confirmed the carousel is now the active focused element, retains its `region` role and accessible label, and renders a coral focus ring with contrasting offset. Pressing ArrowRight from that focused region advanced photo 6 to photo 7 successfully.

Pressing ArrowLeft from the same focused region returned photo 7 to photo 6. The direct photo-2 control then opened the Honduras slide, exposing the linked Medical Wings caption and confirming the direct-slide controls still select the intended story after the keyboard fix.

Activating the visible Honduras caption link opened the official Medical Wings International homepage at `https://www.medicalwings.org/` successfully over HTTPS. The destination rendered the organization’s navigation and mission statement without redirect or certificate failure.

Final targeted UI coverage verifies the Doxy.me modal’s focus entry, Escape return, cancel action, and approved launch mutation; authenticated and unauthenticated portal states; dark-green Patient Portal CTAs in desktop and mobile navigation; and carousel focus-ring contracts at 390px and 1280px. The complete suite passes **15 tests across 7 files**, followed by a successful production build.

After the OAuth return-path fix, the running authenticated `/portal` view was captured directly at desktop and mobile widths. Both views show the signed-in greeting, notice inbox, unread state, and Doxy.me telehealth card without layout regression. The final regression suite passes **17 tests across 8 files**, followed by a successful production build.
