# Prepublication Checklist

**Project:** W. Esther McAlpine, M.D., P.C.  
**Purpose:** Final practice, legal, privacy, security, accessibility, and technical review before public launch.

This checklist records launch decisions; it is not a representation that the website, portal, or any external vendor is legally compliant. The practice should retain completed evidence and obtain professional review where required.

## Practice Facts and Editorial Approval

| Status | Required review | Evidence or owner |
| --- | --- | --- |
| [ ] | Confirm the practice name, address, suite, telephone, fax, and directions link. | Practice owner |
| [ ] | Confirm office hours: Monday, Tuesday, and Thursday, 10:00 AM–12:00 PM and 1:00 PM–5:00 PM. | Practice owner |
| [ ] | Confirm Friday telehealth is by appointment from 10:00 AM–12:00 PM. | Practice owner |
| [ ] | Approve the published phrasing “a physician honored to be Savannah’s first Black woman pediatrician.” | Practice owner / counsel |
| [ ] | Approve the residency and teaching details as attributed to Dr. McAlpine’s publicly indexed professional profile. | Dr. McAlpine / practice owner |
| [ ] | Approve the practice-supplied international-service history and the accompanying public-record limitation. | Dr. McAlpine / practice owner |
| [ ] | Confirm that every client-supplied slideshow photograph may be published and that each caption and alternative text is accurate. | Rights holder / practice owner |

## Insurance and Scheduling

| Status | Required review | Evidence or owner |
| --- | --- | --- |
| [ ] | Recheck every carrier label and directory status, including Amerigroup / Wellpoint Georgia, against a current source. | Billing lead |
| [ ] | Confirm the planner never states or implies that directory participation is real-time member eligibility or a coverage guarantee. | Billing lead / counsel |
| [ ] | Keep the eligibility adapter disabled until an approved X12 270/271 clearinghouse or payer API, credentials, agreements, data map, retention rule, and security review are in place. | Privacy/security owner |
| [ ] | Configure and test the live scheduling system with the approved office and Friday telehealth windows. | Scheduling administrator |
| [ ] | Ensure public forms do not request symptoms, diagnoses, medication details, medical history, insurance identifiers, or uploaded records. | Privacy owner |

## Portal, Telehealth, and Privacy Boundary

| Status | Required review | Evidence or owner |
| --- | --- | --- |
| [ ] | Confirm the Squarespace site links to the separately hosted portal rather than attempting to reproduce server-side auth or database behavior in a Code block. | Technical owner |
| [ ] | Validate OAuth sign-in, role assignment, administrator offboarding, account recovery, notice authorization, and periodic access review. | Technical and privacy owners |
| [ ] | Confirm notices remain non-clinical and that administrators must attest they contain no patient-specific, diagnosis, treatment, prescription, test-result, billing-account, or other sensitive content. | Practice administrator |
| [ ] | Approve the privacy notice, cookie and analytics disclosures, retention schedule, audit-review procedure, incident-response plan, and vendor agreements. | Counsel / privacy owner |
| [ ] | Confirm `https://doxy.me/v2/check-in/drmcalpine` is the practice-controlled destination and review Doxy.me privacy, consent, account, and business-associate settings. | Practice and privacy owners |
| [ ] | Confirm all Doxy.me links identify the external service, open in a new tab, and collect no medical details before handoff. | Technical owner |

## Accessibility, Quality, and Launch

| Status | Required review | Evidence or owner |
| --- | --- | --- |
| [ ] | Test keyboard order, visible focus, heading hierarchy, labels, alternative text, contrast, reduced motion, and slideshow controls. | Accessibility reviewer |
| [ ] | Test the homepage, portal, clinician workspace, insurance planner, scheduling flow, telephone links, directions, and Doxy.me handoff on desktop, iPhone-sized, and Android-sized screens. | QA owner |
| [ ] | Submit a real test booking through the chosen production scheduler, then remove the test record according to the approved procedure. | Scheduling administrator |
| [ ] | Verify page titles, descriptions, canonical domain, favicon, robots settings, custom code, analytics, and error pages. | Technical owner |
| [ ] | Capture launch approval, responsible owner, date, and rollback contact before changing site visibility or the primary domain. | Practice owner |
