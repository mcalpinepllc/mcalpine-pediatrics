# Squarespace Handoff Guide

**Project:** W. Esther McAlpine, M.D., P.C.  
**Prepared by:** Manus AI  
**Design direction:** The Open Porch — Southern editorial modernism  
**Recommended platform:** Squarespace 7.1 with Squarespace Scheduling/Acuity for live appointment booking

## What Has Been Delivered

The accompanying web project is the approved visual and interaction reference. Squarespace does not offer a conventional FTP workflow for replacing a standard Squarespace site with an entire React project. The reliable approach is to rebuild the page with native Squarespace sections and blocks, then add the supplied CSS and the portable insurance-planner code. Squarespace supports HTML in code blocks on all plans, while JavaScript and iframe rendering in code blocks require an eligible plan.[1]

| Deliverable | Purpose | Squarespace destination |
| --- | --- | --- |
| Live reference website | Ground truth for layout, pacing, content, and responsive behavior | Recreate with native sections and blocks |
| `custom.css` | Brand typography, color tokens, buttons, focus states, and anchor behavior | **Website → Pages → Custom Code → Custom CSS**, or the current **Custom CSS** panel |
| `insurance-planner.html` | Portable, accessible insurance and co-pay planning aid | A **Code** block set to **HTML** |
| Four optimized image assets | Hero, community imagery, care scene, and logo mark | Squarespace image and logo uploads |
| `PREPUBLICATION-CHECKLIST.md` | Required clinical, insurance, privacy, and content verification | Complete before making the site public |

> **Important:** The co-pay field is a planning aid. It does not verify benefits, calculate patient responsibility, collect money, or transmit health information. A payment workflow would require a separately approved processor and privacy/security review.

## Recommended Site Architecture

Keep the public experience intentionally short. Use one primary page with anchored sections and one scheduling experience.

| Navigation label | Anchor or destination | Content |
| --- | --- | --- |
| Meet Dr. McAlpine | `#about` | Concise professional biography and the practice’s historical significance |
| Care | `#care` | Newborn, well-child, sick-visit, school-age, and teen care summaries |
| Insurance & co-pay | `#insurance` | Plain-language coverage context and the supplied planner |
| Visit | `#visit` | Address, telephone, fax, directions, and appointment call to action |
| Schedule a visit | Scheduling block or booking page | Live Squarespace Scheduling/Acuity calendar |

Create a footer link for a privacy notice and any practice-required accessibility, nondiscrimination, and financial-policy notices. Do not collect symptoms, diagnoses, medication information, medical records, or other sensitive health details through a general Squarespace form.

## Brand Settings

Set **Fraunces Semibold** for display headings and **Manrope Regular/Semibold/Bold** for body copy and controls. If those fonts are unavailable in the selected Squarespace font packs, use the supplied CSS import in `custom.css` or upload properly licensed font files through Squarespace’s font/custom-file tools. Squarespace’s CSS editor accepts common image and font formats, but not SVG files.[2]

| Role | Value | Use |
| --- | --- | --- |
| McAlpine Coral | `oklch(0.69 0.155 35)` | Primary calls to action and emotional accents |
| Deep Coral | `oklch(0.55 0.145 34)` | Button hover states and high-contrast coral type |
| Live Oak | `oklch(0.31 0.06 174)` | Headings, footer, trust-bearing surfaces |
| Porch Cream | `oklch(0.985 0.018 86)` | Main page background |
| Soft Sage | `oklch(0.92 0.036 151)` | Calm section backgrounds and positive results |
| Display type | Fraunces, 600 | Editorial headlines and the wordmark |
| Body type | Manrope, 400–700 | Paragraphs, labels, navigation, and buttons |

Coral should remain precious: use it for scheduling, selected controls, the arch motif, and small leaf accents rather than as a full-page campaign color. Live Oak carries authority; Porch Cream and Soft Sage keep the experience warm and non-clinical.

## Image Asset Manifest

| File | Squarespace use | Alternative text |
| --- | --- | --- |
| `mcalpine-heart-sprout-mark.png` | Header logo mark and favicon source | Leave blank when adjacent text already names the practice |
| `mcalpine-portrait-stethoscope.png` | Circular homepage hero | “Dr. W. Esther McAlpine smiling outdoors in a pink blouse with a stethoscope” |
| `mcalpine-portrait-original.webp` | Biography portrait | “Dr. W. Esther McAlpine smiling outdoors in a pink blouse” |
| `mcalpine-open-porch-hero.jpg` | Optional supporting family image | “A mother and young daughter arriving at a bright pediatric office” |
| `mcalpine-care-scene.png` | Optional supporting care image | “Representative image of a mother and young child during a warm pediatric visit” |
| `mcalpine-community-children.png` | Community section | “A diverse group of children playing together beneath live oak trees in a Savannah square” |

The authentic portrait was supplied directly by the client. The stethoscope version is an approved derivative created from that supplied photograph; the face, expression, clothing, and setting were preserved while the stethoscope was added at the client’s request. The remaining family and community photographs are representative brand imagery and must not be described as photographs of Dr. McAlpine or her patients.

## Step-by-Step Squarespace Build

### 1. Prepare the Site Safely

Create or open the Squarespace site, keep it private or password protected, and remove demo pages and placeholder copy. Set the site title to **W. Esther McAlpine, M.D., P.C.** and upload the heart-sprout mark as the logo and browser icon. Squarespace recommends completing site title, logo, font, color, favicon, navigation, and mobile-layout review before launch.[3]

### 2. Create the Page and Anchors

Create a blank page named **Home** and set it as the homepage. Build sections in this order: header, hero, quick actions, biography, care, community, insurance, scheduling, contact/directions, and footer. At the top of each anchored section, insert a Code block set to HTML with one of the following markers:

```html
<div id="about" class="mcalpine-anchor" aria-hidden="true"></div>
<div id="care" class="mcalpine-anchor" aria-hidden="true"></div>
<div id="insurance" class="mcalpine-anchor" aria-hidden="true"></div>
<div id="visit" class="mcalpine-anchor" aria-hidden="true"></div>
```

Use only one marker per section. Set navigation links to `/#about`, `/#care`, `/#insurance`, and `/#visit`. Link every primary **Schedule a visit** button to the live scheduler section or booking page.

### 3. Recreate the Hero

Use a two-column Fluid Engine section. Place the text on the left and Dr. McAlpine’s circular portrait on the right. Keep all caption text below the photograph so nothing covers her face, clothing, stethoscope, or supporting copy. Preserve the left-aligned headline:

> Care that knows your child—*and remembers* your family.

Replace that earlier reference line with the approved portrait-led copy:

> Meet Dr. W. Esther McAlpine—*the steady heart* families remember.

Use **Schedule a visit** as the primary coral button and **Call (912) 349-3682** as the secondary outlined button. On mobile, stack the copy above the image and keep both actions visible without horizontal scrolling.

### 4. Build the Biography and Care Sections

Use an asymmetric two-column biography layout with the representative care image, the “50+ years in medicine” inset, and the approved biography. Follow it with the deep Live Oak care section containing four service columns. Use headings, not decorative text blocks, so screen-reader users receive a logical document outline.

### 5. Add the Insurance Planner

Add a **Code** block in the insurance section, choose **HTML**, turn **Display Source** off, and paste the entire contents of `insurance-planner.html`. JavaScript in code blocks requires an eligible Squarespace plan; if the site’s plan does not support it, replace the planner with a short insurance note and a call button.[1]

The planner intentionally distinguishes between “listed in public provider directories” and “please confirm.” It never promises coverage. Before launch, the practice must review every carrier status and remove any carrier that cannot be substantiated.

### 6. Connect Real Appointment Booking

Create the practice’s calendars, appointment types, intake boundaries, availability, cancellation policy, and confirmation messages in Squarespace Scheduling/Acuity. Then add a native **Scheduling block** to the appointment section. Acuity’s official guidance identifies the Scheduling block as the preferred embedding method for Squarespace sites; a booking button can also point to the scheduling page.[4]

Do not request diagnosis, symptoms, medical history, medications, insurance ID photographs, or other sensitive medical details in a general website form. Configure any intake workflow only after the practice confirms its privacy and security requirements.

### 7. Add Contact and Directions

Publish these details only after final practice confirmation:

| Field | Draft value |
| --- | --- |
| Practice | W. Esther McAlpine, M.D., P.C. |
| Address | 340 Eisenhower Drive, Building 700, Suite 740, Savannah, GA 31406 |
| Telephone | (912) 349-3682 |
| Fax | (912) 349-3683 |
| Directions URL | `https://www.google.com/maps/search/?api=1&query=340+Eisenhower+Drive+Building+700+Suite+740+Savannah+GA+31406` |

Use a plain directions button rather than a heavy map embed if page speed is a priority. If a map is added, retain the address in text so it remains accessible and copyable.

### 8. Apply the Custom CSS

Open Squarespace’s Custom CSS panel, paste `custom.css`, and save. Squarespace recommends using CSS mainly for fonts, colors, and backgrounds and warns that extensive custom selectors may be affected by future platform updates.[2] Recheck the site after major Squarespace platform changes.

### 9. Perform Mobile and Accessibility Review

In Fluid Engine mobile view, confirm that the hero stacks correctly, headings do not crop, controls are at least comfortably tappable, no section scrolls sideways, and the sticky header does not cover anchored headings. Test keyboard navigation, visible focus indicators, image alternative text, form labels, button names, color contrast, and reduced-motion behavior.

### 10. Launch

Complete `PREPUBLICATION-CHECKLIST.md`, test every telephone, directions, navigation, insurance, and scheduling link, submit a real test booking, review on at least one iPhone-sized and one Android-sized device, connect the primary domain, and then make the site public. Squarespace’s current launch checklist also calls for checking page slugs, mobile layouts, image quality, integrations, custom code, SEO descriptions, forms, and post-publication behavior.[3]

## Current Interactive Behavior

| Feature | Delivered behavior | Production dependency |
| --- | --- | --- |
| Insurance selector | Shows a cautious public-directory status and entered co-pay amount | Practice must verify all carrier listings |
| Co-pay entry | Formats a user-entered planning amount | Does not calculate benefits or accept payment |
| Scheduling preview | Lets a parent choose a weekday and part of day, then prepares a telephone handoff | Replace with live Squarespace Scheduling/Acuity availability |
| Telephone actions | Opens the device dialer | Confirm telephone number |
| Directions | Opens Google Maps search | Confirm address and suite |

## References

[1]: https://support.squarespace.com/hc/en-us/articles/206543167-Code-blocks "Squarespace Help Center — Code blocks"
[2]: https://support.squarespace.com/hc/en-us/articles/206545567-Using-the-CSS-Editor "Squarespace Help Center — Using the CSS Editor"
[3]: https://support.squarespace.com/hc/en-us/articles/360022518252-Site-launch-checklist "Squarespace Help Center — Site launch checklist"
[4]: https://help.acuityscheduling.com/hc/en-us/articles/16676884389133-Adding-Acuity-Scheduling-to-your-website "Acuity Scheduling Help — Adding Acuity Scheduling to your website"
