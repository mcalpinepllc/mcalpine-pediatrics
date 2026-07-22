# Portrait-Led Revision

- [x] Create a likeness-preserving portrait edit with a natural stethoscope beneath Dr. McAlpine’s collar and its earpieces on her left upper chest, appearing on the right side of the image.
- [x] Replace the existing hero photograph and overlapping “A Savannah First” card with an unobstructed circular portrait composition.
- [x] Change the introductory copy to begin “Meet Dr. W. Esther McAlpine…” and preserve the warm, concise brand voice.
- [x] Reuse authentic portrait imagery thoughtfully in the biography without presenting duplicates or obstructing Dr. McAlpine’s face.
- [x] Verify desktop and mobile hierarchy, image cropping, alternative text, focus states, and appointment actions.
- [x] Run type checks and a production build, then save a revised checkpoint.

## Family Hero and Portrait Relocation

- [x] Expand the original office-arrival scene with a white mother and sandy-blonde little boy while preserving the existing mother, child, setting, and editorial lighting.
- [x] Replace the ambiguous emblem with a broad, unmistakable heart silhouette containing a small upward sprout, with no phallic resemblance.
- [x] Restore the exact approved landing copy: “Relationship-centered pediatric care for infants, children, and adolescents, led by Dr. W. Esther McAlpine—Savannah’s first Black woman pediatrician.”
- [x] Restore the office-arrival scene as the homepage hero image without reintroducing an obstructive overlay.
- [x] Move the circular stethoscope portrait to the Meet Dr. McAlpine section.
- [x] Remove the non-stethoscope portrait from the page and image manifest.
- [x] Verify responsive crops, alternative text, heading hierarchy, and all appointment actions.
- [x] Run final checks, save a checkpoint, and deliver the revised site.

## Hours, Telehealth, Slideshow, and Patient Portal

- [x] Document the portal security boundary and avoid claiming HIPAA compliance before legal, hosting, encryption, audit, retention, and business-associate requirements are validated.
- [x] Upgrade the project for authenticated users, protected server routes, database records, and private file storage.
- [x] Upload the five client-supplied Dr. McAlpine photographs and add an accessible, keyboard-operable slideshow in the Meet section’s second image space.
- [x] Publish office hours as Monday, Tuesday, and Thursday, 10:00 AM–12:00 PM and 1:00 PM–5:00 PM.
- [x] Publish Friday telehealth availability by appointment from 10:00 AM–12:00 PM and label the supplied check-in URL accurately as Doxy.me.
- [x] Add OAuth-based sign-in and role-aware patient/clinician portal navigation.
- [x] Scope superseded by user clarification: do not build document upload, download, medical-record, or clinical-message features in this website.
- [x] Add a direct telehealth check-in handoff to `https://doxy.me/v2/check-in/drmcalpine` without collecting symptoms or medical history on the public site.
- [x] Replace the initial document schema with clinician-authored, non-clinical practice notices and notice-view audit records.
- [x] Build an administrator notice composer and an authenticated patient notice feed with explicit prohibitions on clinical content.
- [x] Add Amerigroup to the insurance planner and distinguish directory participation from real-time eligibility.
- [x] Prepare a server-side eligibility-adapter boundary for a future approved X12 270/271 clearinghouse or payer API; do not collect eligibility data until credentials and agreements exist.
- [x] Verify the client-supplied professional biography claims against accessible primary or authoritative public sources before publication; document unsupported items and keep them explicitly attributed rather than independently asserted.
- [x] Verify and add a concise global-health blurb describing the client-confirmed 30+ years of Medical Wings International service in Thailand, India, Senegal, and other mission locations, with careful source attribution.
- [x] Verify authorization behavior, notice privacy boundaries, accessibility, responsive layout, and production build.
- [x] Update the Squarespace handoff and prepublication checklist, then save and deliver a checkpoint.
- [x] Keep the final project update within 600 tokens and limit it to essential outcomes, caveats, and next steps.
- [x] Independently verify or explicitly attribute the “Savannah’s first Black woman pediatrician” claim before publication.
- [x] Attribute residency and teaching details to Dr. McAlpine’s publicly indexed professional profile unless an accessible institutional source is obtained.
- [x] Limit published biography copy to verified facts or explicit practice/profile attribution and disclose where the accessible public record does not confirm the full client-supplied history.

## Picture Roll Revision

- [x] Rephrase the gallery introduction to “A lifetime of care and caring at home and abroad.”
- [x] Remove the camera icon and “Client-Supplied Photographs” attribution row from the gallery.
- [x] Make the newly supplied red-coat patient-care photograph the first slide with “A tradition of health care with heart.” and “Patient service in Savannah, Ga.”
- [x] Add the newly supplied brown-jacket portrait to the “Through the Years” sequence with “Serving since 1974.”
- [x] Crop the supplied Thailand and Senegal scans so their photographed wording does not appear in the carousel.
- [x] Update Photo 1 to “International Service” with the requested Honduras copy and a Medical Wings International link.
- [x] Update Photo 2 to “Serving Across Borders” with the requested India copy.
- [x] Zoom out Photo 3 to show the top of Dr. McAlpine’s hair and below the USA pin, and caption it “Volunteering for votes in Chatham County.”
- [x] Remove Photo 4 from the picture roll.
- [x] Update “Across the Years” to “Serving Savannah since 1974.”
- [x] Add “African Outreach” for Dakar, Senegal with Wings using an available client-supplied image.
- [x] Add “Tsunami Relief” for Phuket with Wings using an available client-supplied image.
- [x] Validate carousel links, controls, image crops, accessibility, responsive layout, tests, and production build.
- [x] Exercise the Medical Wings external link and confirm its secure target and destination.
- [x] Test previous, next, and keyboard left/right carousel navigation after the latest slide changes.
- [x] Verify visible keyboard focus states for carousel controls at desktop and mobile breakpoints.
- [x] Make the carousel region focusable so its documented left/right keyboard controls work from the gallery itself.
- [x] Save and publish a checkpoint, then deliver the revised picture roll within the user’s brief update budget.

## Biography and Telemedicine Revision

- [x] Replace the homepage historical-distinction sentence with “a physician honored to be Savannah’s first Black woman pediatrician.”
- [x] Replace the physician-directory sentence with the user-approved visitor-facing wording.
- [x] Present “Patient Portal” as a dark-green, white-text call-to-action in desktop and mobile navigation.
- [x] Keep portal sign-in as the access boundary for existing patients and add an explicit Doxy.me launch modal inside the authenticated portal.
- [x] Ensure the Doxy.me modal explains the external handoff, avoids collecting clinical details, and provides a clear continue action.
- [x] Validate portal authentication states, modal keyboard behavior, external launch, responsive styling, tests, and production build.
- [x] Verify final unauthenticated and authenticated portal render states, including sign-in boundary messaging, notice area, Doxy.me entry, and dark-green Patient Portal navigation CTAs.
- [x] Save and publish the combined biography, portal, and picture-roll checkpoint, then deliver within the 500-token update budget.

## Cross-Service Migration Guide

- [ ] Create a self-contained Markdown guide for porting the complete website to another development or hosting service.
- [ ] Inventory the stack, routes, page sections, database schema, authentication, portal, Doxy.me handoff, assets, environment variables, tests, and deployment commands.
- [ ] Distinguish portable application code from Manus-specific authentication, storage, APIs, analytics, and hosting behavior.
- [ ] Provide a practical migration sequence, replacement options, security/privacy requirements, acceptance tests, and launch checklist.
- [ ] Validate all project paths and references, then attach the finished Markdown file directly to the user.

## Focused Final Site Edits

- [x] Use the exact approved hero sentence ending “a physician honored to be Savannah's first Black woman pediatrician.”
- [x] Use the approved physician-directory sentence, remove the editorial global-service paragraph, and add the LinkedIn call-to-action.
- [x] Add neutral WebMD and RateMD patient-review links without embedding a fixed rating.
- [x] Enlarge gallery photos 1 and 4 by 50% while preserving their requested subjects.
- [x] Link the office address to Google Maps, update the fax to 914.222.8923, and add the LinkedIn icon and profile link in Contact & Directories.
- [x] Style Patient Portal as a dark-green, white-text call-to-action and add the authenticated Doxy.me launch modal.
- [x] Remove the man in the background of the circular Dr. McAlpine portrait while preserving Dr. McAlpine’s appearance, clothing, stethoscope, lighting, and outdoor setting.
- [x] Upload the edited portrait to permanent project storage and replace the circular portrait asset reference.
- [x] Perform only targeted checks on the edited copy, links, image crops, portrait, portal modal, tests, and build.

## Final Header and Portal Redirect Fix

- [x] Change the header labels exactly to “Insurance & Co-Pay” and “Patient Portal” in desktop and mobile navigation.
- [x] Preserve `/portal` as the intended post-authentication destination when Patient Portal sign-in begins.
- [x] Update the OAuth callback to return authenticated users to the validated portal destination instead of the homepage.
- [x] Add regression coverage for safe portal return routing and rejection of unsafe external return destinations.
- [x] Verify the authenticated notice area, Doxy.me entry, and portal-responsive layout after the redirect fix.
- [x] Open the authenticated Doxy.me modal and verify focus behavior plus cancel and continue controls.
- [x] Verify visible previous, next, and dot-control focus states at desktop and mobile carousel breakpoints.

## Patient Review Placement

- [x] Move the “Highly Rated / Patient reviews / WebMD | RateMD” block directly below the “50+ years in medicine / 1974 medical degree” statistics.
- [x] Remove the former full-width review block below the gallery without changing either external review URL or adding a fixed rating.
- [x] Verify the biography column and review block at desktop and mobile widths.
- [x] Run the Vitest suite and production build for the revised layout.
- [ ] Save and auto-publish a checkpoint containing the patient-review placement change.
