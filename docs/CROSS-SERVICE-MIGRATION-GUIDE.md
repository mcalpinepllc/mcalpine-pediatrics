# McAlpine Pediatrics Cross-Service Migration and Rebuild Guide

**Project:** W. Esther McAlpine, M.D., P.C.  
**Prepared by:** Manus AI  
**Baseline date:** July 22, 2026  
**Live production baseline:** `https://mcalpinepediatrics.com`  
**Published checkpoint:** `93fd03d9`  
**Repository root:** `/home/ubuntu/mcalpine-pediatrics`

## 1. Purpose and Authority

This document is a self-contained handoff for rebuilding or moving the complete McAlpine Pediatrics website to another development or hosting service. It covers the public website, authentication, patient portal, administrator notice workspace, database, asset handling, Doxy.me handoff, build pipeline, security boundaries, testing, launch, and rollback.

The **published checkpoint `93fd03d9` and the repository at that checkpoint are the source of truth**. Port literal content and behavior from the files named in this guide rather than recreating copy from screenshots. The public-site design is known as **The Open Porch**, combining Southern editorial typography, Porch Cream backgrounds, Live Oak green, restrained coral accents, rounded portrait and arch motifs, and accessible, responsive controls.

> **Clinical boundary:** This application is intentionally limited to public practice information, authenticated non-clinical practice notices, and an external Doxy.me launch. It does not collect symptoms, diagnoses, medical history, medications, insurance identifiers, medical records, or uploaded documents. Do not expand that scope during migration without a separate legal, privacy, security, vendor, and operational approval process.

## 2. Current System at a Glance

The current deployment is a single Node.js service. Express serves the compiled React application, exposes the tRPC API, handles the OAuth callback, and proxies `/manus-storage/*` requests to private object-storage URLs. MySQL stores users, non-clinical practice notices, and per-user notice-view records. Authentication is presently coupled to the Manus OAuth service, and object-storage signing is coupled to Manus Forge.

| Layer | Current implementation | Portability |
|---|---|---|
| Browser application | React 19, TypeScript, Wouter, Tailwind CSS 4, shadcn/Radix components | Highly portable |
| API contract | tRPC 11 over Express at `/api/trpc` with SuperJSON | Portable to any Node-compatible host |
| Server | Express 4, bundled with esbuild | Portable; adapter work may be needed on edge/serverless-only hosts |
| Database | MySQL through Drizzle ORM and `mysql2` | Easiest migration is MySQL-to-MySQL |
| Identity | Manus OAuth exchange plus an application JWT in a secure cookie | Manus-specific; replace or preserve through a supported connector |
| Static/public imagery | Private object storage reached through `/manus-storage/*` | Assets must be copied or the proxy contract preserved |
| Telehealth | Authenticated launch to the external Doxy.me waiting room | Portable; keep as an external handoff |
| Hosting and analytics | Manus WebDev runtime and host-provided analytics variables | Host-specific; replace on the destination platform |

### 2.1 Runtime request flow

```text
Browser
  ├─ GET /, /portal, /admin/notices ───────────────┐
  ├─ POST/GET /api/trpc/* ────────> Express+tRPC  │
  ├─ GET /api/oauth/callback ─────> OAuth handler │──> MySQL
  └─ GET /manus-storage/{key} ────> Storage proxy │──> Object storage
                                                    └──> Compiled React files

Authenticated portal ──explicit user action──> https://doxy.me/v2/check-in/drmcalpine
```

## 3. Repository Map and Sources of Truth

| Path | Responsibility | Migration treatment |
|---|---|---|
| `client/src/App.tsx` | Route registration and global providers | Port directly |
| `client/src/pages/Home.tsx` | Entire public homepage and authoritative visitor-facing content | Port literally |
| `client/src/components/SiteHeader.tsx` | Desktop/mobile navigation and portal CTA | Port literally |
| `client/src/components/InsurancePlanner.tsx` | Privacy-minimal insurance/co-pay planning aid | Port or rebuild with identical boundary |
| `client/src/components/ScheduleVisit.tsx` | Non-booking visit-preference preview and call handoff | Port or replace with approved scheduler |
| `client/src/components/McAlpineStoryCarousel.tsx` | Accessible eight-slide gallery | Port directly |
| `client/src/components/mcalpineStorySlides.ts` | Gallery manifest, captions, alt text, image positioning, links | Port literally |
| `client/src/pages/Portal.tsx` | Signed-out boundary and signed-in notice/Doxy.me experience | Port directly after auth replacement |
| `client/src/pages/AdminNotices.tsx` | Administrator-only notice composer and archive workspace | Port directly after auth replacement |
| `client/src/const.ts` | Browser-side OAuth initiation and return-path propagation | Replace for a non-Manus identity provider |
| `client/src/_core/hooks/useAuth.ts` | Client auth state and logout wrapper | Keep contract or adapt to new provider |
| `server/routers.ts` | Public, authenticated, and administrator tRPC procedures | Port directly, preserving authorization |
| `server/db.ts` | User upsert and notice read/write behavior | Port directly with the schema |
| `server/_core/oauth.ts` | OAuth callback, nonce validation, safe post-login redirect | Replace or adapt carefully |
| `server/_core/sdk.ts` | Manus OAuth exchange, JWT creation/verification, request auth, user sync | Manus-specific replacement boundary |
| `server/_core/trpc.ts` | Public/protected/admin procedure guards | Port directly |
| `server/_core/index.ts` | Express startup, route registration, static serving | Port directly on a Node host |
| `server/storage.ts` | Forge presign helpers and `/manus-storage` path convention | Replace with destination object storage |
| `server/_core/storageProxy.ts` | Redirect from site asset paths to signed object URLs | Replace or preserve contract |
| `drizzle/schema.ts` | Authoritative database schema | Port directly for MySQL |
| `drizzle/relations.ts` | Drizzle relations | Port directly |
| `package.json` and `pnpm-lock.yaml` | Scripts, dependency declarations, resolved dependency graph | Copy both; use frozen install |
| `client/src/index.css` | Brand tokens, typography, accessibility, motion | Port directly |
| `docs/PORTAL-SECURITY-BOUNDARY.md` | Existing privacy/security cautions | Carry into destination documentation |
| `squarespace/` | Optional public-site-only rebuild aids | Do not treat as a replacement for the full-stack portal |

## 4. Technology Baseline and Exact Installed Versions

The working environment used Node.js **22.13.0** and pnpm **10.18.1**. The repository declares `pnpm@10.4.1` as its package manager; the lockfile must remain authoritative when the destination environment installs dependencies. Run `pnpm install --frozen-lockfile` so a migration does not silently upgrade the dependency graph.

### 4.1 Core application dependencies

| Package | Installed version | Role |
|---|---:|---|
| `react` | 19.2.1 | Browser UI |
| `react-dom` | 19.2.1 | DOM renderer |
| `wouter` | 3.7.1 | Client routing |
| `express` | 4.21.2 | Node server |
| `@trpc/client` | 11.18.0 | Typed API client |
| `@trpc/react-query` | 11.18.0 | React Query integration |
| `@trpc/server` | 11.18.0 | Typed API server |
| `@tanstack/react-query` | 5.101.2 | Client cache and mutations |
| `superjson` | 1.13.3 | Date-safe API serialization |
| `drizzle-orm` | 0.44.7 | Database ORM |
| `mysql2` | 3.23.0 | MySQL driver |
| `jose` | 6.1.0 | JWT signing and verification |
| `cookie` | 1.1.1 | Cookie serialization |
| `dotenv` | 17.4.2 | Server environment loading |
| `zod` | 4.1.12 | Procedure input validation |
| `vite` | 7.1.9 | Frontend build |
| `typescript` | 5.9.3 | Type system |
| `tailwindcss` | 4.1.14 | Styling |
| `@tailwindcss/vite` | 4.1.14 | Vite integration |
| `esbuild` | 0.25.10 | Server bundling |
| `tsx` | 4.20.6 | Development server execution |
| `vitest` | 2.1.9 | Test runner |

### 4.2 UI, form, and utility dependencies

| Package | Version | Package | Version |
|---|---:|---|---:|
| `@hookform/resolvers` | 5.2.2 | `react-hook-form` | 7.64.0 |
| `class-variance-authority` | 0.7.1 | `clsx` | 2.1.1 |
| `tailwind-merge` | 3.3.1 | `tailwindcss-animate` | 1.0.7 |
| `tw-animate-css` | 1.4.0 | `lucide-react` | 0.453.0 |
| `framer-motion` | 12.23.22 | `next-themes` | 0.4.6 |
| `sonner` | 2.0.7 | `cmdk` | 1.1.1 |
| `vaul` | 1.1.2 | `input-otp` | 1.4.2 |
| `embla-carousel-react` | 8.6.0 | `react-resizable-panels` | 3.0.6 |
| `react-day-picker` | 9.11.1 | `recharts` | 2.15.4 |
| `date-fns` | 4.1.0 | `streamdown` | 1.4.0 |
| `axios` | 1.12.2 | `nanoid` | 5.1.6 |
| `@aws-sdk/client-s3` | 3.1090.0 | `@aws-sdk/s3-request-presigner` | 3.1090.0 |

### 4.3 Radix UI dependencies

| Package | Version | Package | Version |
|---|---:|---|---:|
| `@radix-ui/react-accordion` | 1.2.12 | `@radix-ui/react-alert-dialog` | 1.1.15 |
| `@radix-ui/react-aspect-ratio` | 1.1.7 | `@radix-ui/react-avatar` | 1.1.10 |
| `@radix-ui/react-checkbox` | 1.3.3 | `@radix-ui/react-collapsible` | 1.1.12 |
| `@radix-ui/react-context-menu` | 2.2.16 | `@radix-ui/react-dialog` | 1.1.15 |
| `@radix-ui/react-dropdown-menu` | 2.1.16 | `@radix-ui/react-hover-card` | 1.1.15 |
| `@radix-ui/react-label` | 2.1.7 | `@radix-ui/react-menubar` | 1.1.16 |
| `@radix-ui/react-navigation-menu` | 1.2.14 | `@radix-ui/react-popover` | 1.1.15 |
| `@radix-ui/react-progress` | 1.1.7 | `@radix-ui/react-radio-group` | 1.3.8 |
| `@radix-ui/react-scroll-area` | 1.2.10 | `@radix-ui/react-select` | 2.2.6 |
| `@radix-ui/react-separator` | 1.1.7 | `@radix-ui/react-slider` | 1.3.6 |
| `@radix-ui/react-slot` | 1.2.3 | `@radix-ui/react-switch` | 1.2.6 |
| `@radix-ui/react-tabs` | 1.1.13 | `@radix-ui/react-toggle` | 1.1.10 |
| `@radix-ui/react-toggle-group` | 1.1.11 | `@radix-ui/react-tooltip` | 1.2.8 |

### 4.4 Development dependencies

| Package | Version | Package | Version |
|---|---:|---|---:|
| `@builder.io/vite-plugin-jsx-loc` | 0.1.1 | `vite-plugin-manus-runtime` | 0.0.59 |
| `@vitejs/plugin-react` | 5.0.4 | `drizzle-kit` | 0.31.10 |
| `@testing-library/react` | 16.3.2 | `@testing-library/user-event` | 14.6.1 |
| `jsdom` | 29.1.1 | `prettier` | 3.6.2 |
| `postcss` | 8.5.6 | `autoprefixer` | 10.4.21 |
| `@tailwindcss/typography` | 0.5.19 | `add` | 2.0.6 |
| `@types/node` | 24.7.0 | `@types/express` | 4.17.21 |
| `@types/react` | 19.2.1 | `@types/react-dom` | 19.2.1 |
| `@types/google.maps` | 3.58.1 | `pnpm` | 10.18.1 |

## 5. Public Site Reconstruction Specification

The homepage is a single long-form page at `/`. Its exact JSX and copy live in `client/src/pages/Home.tsx`; navigation is in `SiteHeader.tsx`. Preserve heading hierarchy, landmarks, skip link, visible focus states, alternative text, reduced-motion handling, and mobile-first layout. The current page order is authoritative.

| Order | Section | Required behavior and content |
|---:|---|---|
| 1 | Header | Practice wordmark; **Meet Dr. McAlpine**, **Care**, **Insurance & Co-Pay**, **Visit**, dark-green **Patient Portal**, and coral **Schedule a visit**. The mobile menu must use the same wording and portal CTA treatment. |
| 2 | Hero | “Meet Dr. W. Esther McAlpine—the steady heart families remember.” The supporting sentence ends with “a physician honored to be Savannah’s first Black woman pediatrician.” Provide schedule and telephone actions. |
| 3 | Quick actions | Anchor shortcuts to scheduling, insurance, and office location. |
| 4 | Biography | Circular edited portrait, “50+ years in medicine,” “1974 medical degree,” and the neutral **Highly Rated / Patient reviews / WebMD | RateMD** block directly beneath those statistics. Biography text and LinkedIn profile action occupy the adjacent column. |
| 5 | Story gallery | Eight manually controlled slides, previous/next controls, direct dot controls, keyboard Left/Right operation, position status, alt text, captions, and the Medical Wings external link on the Honduras slide. Do not auto-advance. |
| 6 | Care | Four service summaries: newborn and infant care, well-child checkups, sick visits, and school-age/teen care. |
| 7 | Community | Supporting Savannah family imagery and practice philosophy. |
| 8 | Insurance | Plain-language insurance/co-pay framing and the `InsurancePlanner` widget. It may accept a carrier selection and optional co-pay planning amount, but no member ID or clinical data. |
| 9 | Scheduling | `ScheduleVisit` preference preview. It is not live booking; it offers a date/time preference and prepares a telephone handoff without collecting symptoms or history. |
| 10 | Visit | Address, telephone, fax, office hours, telehealth hours, Google Maps action, and directions framing. |
| 11 | Footer | Practice identity, contact summary, portal path, schedule action, and concise privacy boundary. |

### 5.1 Brand and responsive behavior

The design tokens are defined in `client/src/index.css`. Preserve Fraunces for display typography and Manrope for body/interface text. The principal colors are Live Oak dark green, Porch Cream, coral/deep coral, and soft sage. Buttons use a brief active press state, nonessential motion respects `prefers-reduced-motion`, and semantic backgrounds must always be paired with readable foreground colors.

At small widths, the header becomes a menu, the hero and biography grids stack, statistics remain two columns, the review block remains immediately below the statistics, gallery controls remain keyboard/touch accessible, and no section may introduce horizontal scrolling. Test at approximately **390 × 844**, **768 × 1024**, and **1440 × 1200**.

### 5.2 Authoritative practice details and outbound links

| Item | Current value |
|---|---|
| Practice | W. Esther McAlpine, M.D., P.C. |
| Address | 340 Eisenhower Drive, Building 700, Suite 740, Savannah, GA 31406 |
| Telephone | `(912) 349-3682`; link `tel:+19123493682` |
| Fax | `914.222.8923` |
| Office hours | Monday, Tuesday, and Thursday, 10:00 AM–12:00 PM and 1:00 PM–5:00 PM |
| Telehealth | Friday by appointment, 10:00 AM–12:00 PM |
| Google Maps | `https://www.google.com/maps/search/?api=1&query=340+Eisenhower+Drive+Building+700+Suite+740+Savannah+GA+31406` |
| LinkedIn | `https://www.linkedin.com/in/willie-mcalpine-7071089a/` |
| WebMD reviews | `https://doctor.webmd.com/doctor/w-mcalpine-acf8ed74-c0e9-4925-9d84-8694a6e725dc-overview` |
| RateMD reviews | `https://www.ratemds.com/doctor-ratings/424258/Dr-W-McAlpine-Savannah-GA.html/` |
| Medical Wings International | `https://www.medicalwings.org/` |
| Doxy.me waiting room | `https://doxy.me/v2/check-in/drmcalpine` |

Review-directory links must remain neutral. **Do not hardcode a star rating, review count, testimonial, or implied patient endorsement.**

## 6. Route and API Contract

### 6.1 Browser routes

| Route | Audience | Behavior |
|---|---|---|
| `/` | Public | Full homepage |
| `/portal` | Public shell; authenticated content | Signed-out users see the portal boundary and sign-in action. Signed-in users see active non-clinical notices and the Doxy.me launch card. |
| `/admin/notices` | Administrator | Role-gated notice composer, complete notice list, and archive action |
| `/404` and fallback | Public | Not-found page with safe navigation back to the site |

### 6.2 Server routes

| Path | Method/transport | Purpose |
|---|---|---|
| `/api/oauth/callback` | GET | Validates OAuth state, exchanges code, sets the session cookie, and performs a safe internal redirect |
| `/api/trpc` | tRPC over HTTP | All typed application procedures |
| `/manus-storage/{key}` | GET | Current host-specific storage proxy; returns a redirect to a signed object URL |
| All other production paths | GET | Serve the compiled SPA so Wouter can resolve client routes |

### 6.3 tRPC procedure inventory

| Procedure | Guard | Input | Result/effect |
|---|---|---|---|
| `system.health` | Public | None | Returns `{ ok: true }` through the system router |
| `auth.me` | Public | None | Returns the current user or `null` |
| `auth.logout` | Public | None | Clears the session cookie |
| `insurance.publicPlanSummary` | Public | None | Returns public plan labels/statuses only; no live eligibility |
| `insurance.eligibilityCapability` | Protected | None | Returns the disabled eligibility-adapter capability state |
| `telehealth.launch` | Protected | None | Returns the approved Doxy.me URL and a launch timestamp; logs only non-clinical handoff metadata |
| `notices.inbox` | Protected | None | Returns currently active notices with per-user `viewedAt` state |
| `notices.unreadCount` | Protected | None | Returns count of active notices without a view row |
| `notices.markRead` | Protected | `{ noticeId: positive integer }` | Creates or refreshes the caller’s notice-view timestamp |
| `notices.adminList` | Admin | None | Returns all notices, including archived/expired/future records |
| `notices.create` | Admin | Title, body, priority, optional expiry, `nonClinicalAttestation: true` | Creates a trimmed, attributed non-clinical notice |
| `notices.archive` | Admin | `{ noticeId: positive integer }` | Sets `archivedAt` |

Preserve the guard semantics in `server/_core/trpc.ts`: public procedures may run without a user; protected procedures require a resolved user; administrator procedures additionally require `user.role === "admin"`. Do not rely only on hidden navigation for authorization.

## 7. Database Schema and Data Semantics

The current schema is MySQL. Maintaining MySQL on the destination platform minimizes migration risk because it preserves Drizzle table definitions, timestamp behavior, enum values, indexes, and query expressions. A PostgreSQL conversion is possible but is a schema/query migration, not a simple connection-string change.

### 7.1 `users`

| Column | Type/constraint | Meaning |
|---|---|---|
| `id` | Integer, auto-increment, primary key | Internal user identifier |
| `openId` | `varchar(64)`, unique, not null | External identity subject identifier |
| `name` | Text, nullable | Provider-supplied display name |
| `email` | `varchar(320)`, nullable | Provider-supplied email |
| `loginMethod` | `varchar(64)`, nullable | Provider login method |
| `role` | Enum `user` or `admin`, default `user`, not null | Authorization role |
| `createdAt` | Timestamp, default current timestamp | Creation audit field |
| `updatedAt` | Timestamp, default/current-on-update | Modification audit field |
| `lastSignedIn` | Timestamp, default current timestamp | Most recent login sync |

The login flow upserts by `openId`. If the incoming `openId` equals `OWNER_OPEN_ID`, the helper promotes that account to `admin`. On a new identity provider, map its stable immutable subject claim to `openId`; do not map by mutable email alone.

### 7.2 `practiceNotices`

| Column | Type/constraint | Meaning |
|---|---|---|
| `id` | Integer, auto-increment, primary key | Notice identifier |
| `title` | `varchar(160)`, not null | Notice heading |
| `body` | Text, not null | Non-clinical notice body |
| `priority` | Enum `routine`, `important`, or `urgent`; default `routine` | Display priority, not a clinical triage level |
| `publishedAt` | Timestamp, default current timestamp, not null | Visibility start |
| `expiresAt` | Timestamp, nullable | Optional visibility end |
| `createdByUserId` | Integer, not null, foreign key to `users.id` | Administrator author |
| `createdAt` | Timestamp, default current timestamp | Creation audit field |
| `updatedAt` | Timestamp, default/current-on-update | Modification audit field |
| `archivedAt` | Timestamp, nullable | Soft-archive marker |

An active patient notice satisfies all three conditions: `archivedAt IS NULL`, `publishedAt <= now`, and `expiresAt IS NULL OR expiresAt > now`. The patient inbox is newest first.

### 7.3 `noticeViews`

| Column | Type/constraint | Meaning |
|---|---|---|
| `id` | Integer, auto-increment, primary key | View record identifier |
| `noticeId` | Integer, not null, foreign key to `practiceNotices.id` | Viewed notice |
| `userId` | Integer, not null, foreign key to `users.id` | Viewing user |
| `viewedAt` | Timestamp, default current timestamp, not null | Latest explicit mark-read time |
| `createdAt` | Timestamp, default current timestamp | Record creation time |
| Unique key | `(noticeId, userId)` | One view-state row per user and notice |

`markRead` updates the existing timestamp when a row exists or inserts a new row otherwise. The unread count left-joins active notices against the current user’s view rows and counts missing joins.

### 7.4 Migration procedure

1. Export the source database immediately before cutover using a consistent snapshot. Encrypt the dump at rest and in transit.
2. Create a destination MySQL database with UTC defaults and a least-privileged application account.
3. Copy `drizzle/schema.ts`, `drizzle/relations.ts`, `drizzle.config.ts`, and the migrations directory.
4. Set the destination `DATABASE_URL`, then run `pnpm db:push` in a controlled staging environment. Review generated SQL before production execution.
5. Import production rows only after schema verification. Preserve numeric primary keys, timestamps, enums, unique keys, and foreign-key relationships.
6. Compare row counts per table and sample the notice/view joins. Confirm the designated administrator account resolves correctly after the first destination login.
7. Keep the source database read-only during final delta transfer. Do not use destructive reset commands.

## 8. Authentication and Session Behavior

### 8.1 Current Manus flow

The portal sign-in button calls `startLogin("/portal")`. The browser creates a one-time nonce, stores it in a `__Host-oauth_state` cookie, and encodes a state object containing the OAuth callback URI, the nonce, and the intended internal destination. The callback compares the cookie nonce with the state nonce, exchanges the authorization code through the Manus OAuth service, creates an application JWT, stores it in the `app_session_id` cookie, upserts the user, and redirects through a strict allowlist.

The only accepted post-login paths are exactly:

| Allowed path | Purpose |
|---|---|
| `/` | Public homepage |
| `/portal` | Patient portal |
| `/admin/notices` | Administrator notice workspace |

Missing, query-modified, protocol-relative, or external destinations fall back to `/`. This rule fixed the prior defect in which a user who started sign-in from the portal landed on the homepage after approving email access.

The session token uses HS256 with `JWT_SECRET` and currently has a one-year expiry. The cookie is HTTP-only, path `/`, SameSite `None`, and Secure when the request is recognized as HTTPS. The `__Host-` prefix requires Secure, path `/`, and no Domain attribute; retain those semantics if the nonce cookie is preserved.[1] OAuth security guidance recommends exact redirect-URI matching, CSRF binding through state or an equivalent mechanism, and protection against open redirects.[2]

### 8.2 Recommended replacement on another service

Use a standards-based OAuth 2.0/OpenID Connect provider such as Auth0, AWS Cognito, Clerk, Supabase Auth, Microsoft Entra External ID, or another practice-approved identity service. Provider selection is a business, privacy, security, contract, and support decision; it is not determined by this codebase.

| Current contract | Destination requirement |
|---|---|
| `VITE_APP_ID` and Manus authorize portal | Destination OAuth/OIDC client ID and authorization endpoint |
| Manus code exchange RPC | Server-side token exchange using a client secret or PKCE-supported confidential flow |
| `openId` | Immutable provider subject claim (`sub`) |
| Provider user-info payload | Name, email, login method, and verified-email status as approved |
| App JWT in `app_session_id` | Either preserve application JWT sessions or use the provider’s secure server session |
| `OWNER_OPEN_ID` bootstrap | Explicit immutable subject-to-admin mapping or a controlled role-management process |
| `postLoginPath` allowlist | Preserve exact same-origin allowlist validation |

The callback URI on the destination must be `https://<destination-domain>/api/oauth/callback` unless the auth implementation is deliberately redesigned. Register every staging and production callback URI exactly with the provider. Never place a client secret in a `VITE_*` variable because Vite exposes such variables to browser bundles.[3]

### 8.3 Authentication acceptance tests

The rebuilt flow is not complete until all of these scenarios pass:

| Scenario | Expected result |
|---|---|
| Begin sign-in from `/portal` | After consent, return to `/portal`, not `/` |
| Begin sign-in from `/admin/notices` as admin | Return to `/admin/notices` |
| Unauthenticated portal API call | Rejected by protected procedure |
| Authenticated normal user calls admin API | Rejected with forbidden error |
| Tampered state nonce | Callback rejects without setting a session |
| `postLoginPath=https://attacker.example` | Falls back to `/` |
| `postLoginPath=//attacker.example` | Falls back to `/` |
| `postLoginPath=/portal?next=...` | Falls back to `/` unless explicitly and safely redesigned |
| Logout | Session cookie cleared; protected content unavailable |
| Forwarded HTTPS through proxy | Cookies remain Secure and callback works |

## 9. Environment Variable Inventory

Do not copy secret values into source control, issue trackers, logs, or this guide. Add them through the destination platform’s encrypted secret manager. Separate staging and production values.

### 9.1 Variables required by the current implementation

| Variable | Exposure | Required | Purpose |
|---|---|---:|---|
| `DATABASE_URL` | Server secret | Yes | MySQL connection string |
| `JWT_SECRET` | Server secret | Yes | Application session JWT signing/verification |
| `OAUTH_SERVER_URL` | Server configuration | Yes for Manus auth | Manus OAuth RPC base URL |
| `VITE_APP_ID` | Browser-visible | Yes for Manus auth | OAuth application identifier; also read server-side |
| `VITE_OAUTH_PORTAL_URL` | Browser-visible | Yes for Manus auth | Authorization portal base URL |
| `OWNER_OPEN_ID` | Server configuration | Yes for automatic owner-admin bootstrap | Immutable owner subject |
| `BUILT_IN_FORGE_API_URL` | Server configuration | Yes for current storage | Forge presign API base URL |
| `BUILT_IN_FORGE_API_KEY` | Server secret | Yes for current storage | Forge presign authorization |
| `NODE_ENV` | Server configuration | Yes in production | Selects Vite development mode versus static production serving |
| `PORT` | Server configuration | Host-provided | Listening port; defaults to `3000` locally |

### 9.2 Host/template variables that may be present

| Variable | Current relevance |
|---|---|
| `OWNER_NAME` | Host metadata; not part of the core portal authorization decision |
| `VITE_APP_TITLE` | Host/application metadata |
| `VITE_APP_LOGO` | Host/application metadata |
| `VITE_ANALYTICS_ENDPOINT` | Manus analytics integration; replace or omit after privacy review |
| `VITE_ANALYTICS_WEBSITE_ID` | Manus analytics site identifier |
| `VITE_FRONTEND_FORGE_API_URL` | Referenced by the prebuilt `Map.tsx`; not required by current routes unless that component is enabled |
| `VITE_FRONTEND_FORGE_API_KEY` | Browser-visible key for prebuilt Forge features; not required by current routes unless enabled |

### 9.3 Suggested destination variable set

Exact names may differ by provider, but a clean non-Manus deployment should define an explicit contract similar to this:

| Suggested variable | Purpose |
|---|---|
| `DATABASE_URL` | Destination MySQL connection |
| `SESSION_SECRET` | High-entropy session signing/encryption secret |
| `OIDC_ISSUER_URL` | Identity-provider issuer |
| `OIDC_CLIENT_ID` | OAuth/OIDC client ID |
| `OIDC_CLIENT_SECRET` | Confidential server-side client secret, if required |
| `OIDC_CALLBACK_URL` | Exact HTTPS callback URI |
| `ADMIN_SUBJECT_ID` | Immutable administrator subject |
| `S3_BUCKET` | Object-storage bucket |
| `S3_REGION` | Bucket region |
| `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` | Server-side credentials, preferably replaced by workload identity |
| `ASSET_BASE_URL` | Public CDN or application asset prefix |
| `PORT` and `NODE_ENV` | Runtime configuration |

## 10. Asset Migration

All public imagery is currently referenced through relative `/manus-storage/*` paths. The destination has two viable approaches:

1. **Copy and re-address:** Download the original bytes, upload them to the destination object store/CDN, preserve filenames when practical, and replace source paths with a stable `ASSET_BASE_URL` or destination URLs.
2. **Preserve the path contract:** Keep `/manus-storage/{key}` as an application route that returns a short-lived signed GET URL. This minimizes frontend changes but requires a compatible server route and private bucket.

Amazon S3 and comparable object stores support presigned URLs for time-limited access without making an object public.[4] Public marketing images may instead be served through a public CDN if the practice approves that configuration. Never depend on local ephemeral server folders in an autoscaled deployment.

### 10.1 Non-gallery public assets

| Role | Current path | Alternative text/handling |
|---|---|---|
| Sprouting-heart logo | `/manus-storage/mcalpine-sprouting-heart-a_851d8ff5.png` | Decorative when adjacent wordmark names the practice; use empty `alt` |
| Hero office-arrival image | `/manus-storage/mcalpine-open-porch-expanded_f76bed82.png` | “A Black mother and daughter arriving at a bright pediatric office alongside a white mother and her sandy-blonde son” |
| Edited circular portrait | `/manus-storage/mcalpine-portrait-stethoscope-no-man_efbbb930.png` | “Dr. W. Esther McAlpine smiling outdoors in a pink blouse with a stethoscope” |
| Community children | `/manus-storage/mcalpine-community-children_aa36a8cd.png` | “A diverse group of children playing together beneath live oak trees in a Savannah square” |

### 10.2 Authoritative eight-slide gallery manifest

The following URLs resolve through the current production domain. Copy the original bytes before decommissioning the current storage integration. Preserve the exact alt text, labels, captions, display fit, position, and optional link from `mcalpineStorySlides.ts`.

| # | Permanent source URL | Label and caption | Accessibility/display requirements |
|---:|---|---|---|
| 1 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-red-coat-care_460dcba6.jpg` | **A tradition of health care with heart** — Patient service in Savannah, Ga. | Alt: “Dr. McAlpine in a red clinical coat listening to a smiling young child with a stethoscope.” Use `contain`, scale `1.5`, centered origin. |
| 2 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-honduras_2b0e463e.jpg` | **International service** — Helping in Honduras with Medical Wings International Inc. ("Wings"). | Alt: “Dr. McAlpine smiling in blue scrubs beneath road signs in Honduras.” Centered. Caption links to `https://www.medicalwings.org/`. |
| 3 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-india_9d514676.jpg` | **Serving across borders** — With fellow physicians in India with Wings. | Alt: “Dr. McAlpine with fellow physicians in front of the Taj Mahal in India.” Centered. |
| 4 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-community-event_f4f608cf.webp` | **Close to home** — Volunteering for votes in Chatham County | Alt: “Dr. McAlpine volunteering for voters beneath a blue canopy in Chatham County.” Use `contain`, scale `1.5`, top-centered origin. |
| 5 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-historical-portrait_920b241d.jpg` | **Through the years** — Serving Savannah since 1974 | Alt: “Historical studio portrait of Dr. McAlpine in a teal jacket.” Position `center 28%`. |
| 6 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-brown-jacket-portrait_acbeb4c4.jpg` | **Through the years** — Serving since 1974. | Alt: “Earlier portrait of Dr. McAlpine smiling in a brown jacket.” Use `contain`, centered. |
| 7 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-thailand-tsunami_00e1c4e8.jpg` | **Tsunami relief** — Problem solving in Phuket with Wings. | Alt: “Medical volunteers caring for children at a tsunami-relief clinic in Phuket, Thailand.” Centered. |
| 8 | `https://mcalpinepediatrics.com/manus-storage/mcalpine-senegal-outreach_e8d9ceb9.jpg` | **African outreach** — Delivering smiles in Dakar, Senegal with Wings. | Alt: “Children and volunteers gathered during an outreach visit in Dakar, Senegal.” Centered. |

### 10.3 Asset transfer verification

For every object, record source URL, destination URL/key, byte size, MIME type, and SHA-256 checksum. Compare checksums after upload, then review actual rendered crops at desktop and mobile widths. Ensure the portrait edit and client-supplied historical photographs are treated according to the practice’s ownership and usage instructions.

## 11. Doxy.me Telehealth Handoff

The portal does not host telehealth. An authenticated user selects the telehealth card, reviews a modal explaining that Doxy.me is external and that no clinical details are collected by this website, and chooses whether to continue. The server procedure returns only the approved URL and timestamp. The client then opens the Doxy.me page in a new tab.

The verified destination is `https://doxy.me/v2/check-in/drmcalpine`, which presents Dr. McAlpine’s Doxy.me check-in page.[5] Preserve all of the following controls:

| Control | Requirement |
|---|---|
| Access boundary | Launch entry appears inside the authenticated portal |
| Explicit handoff | Modal identifies Doxy.me as an external destination |
| Data minimization | Do not ask for symptoms, diagnosis, history, medications, or records before handoff |
| User choice | Provide Cancel and Continue controls with keyboard focus management |
| New tab security | Use `target="_blank"` with `rel="noreferrer"` or equivalent |
| Destination integrity | Server returns the fixed approved URL; do not accept an arbitrary client URL |
| Operational approval | Practice must confirm Doxy.me account ownership, privacy settings, consent, and vendor agreements |

## 12. Manus-Specific Components and Replacements

| Manus-specific component | Where it appears | Replacement strategy |
|---|---|---|
| OAuth portal and RPC exchange | `client/src/const.ts`, `server/_core/oauth.ts`, `server/_core/sdk.ts` | Implement standards-based OAuth/OIDC; preserve nonce, callback, immutable subject, safe redirect, session, and user upsert contracts |
| Forge storage presign API | `server/storage.ts`, `server/_core/storageProxy.ts` | Use AWS S3 SDK, Cloudflare R2, Google Cloud Storage, Azure Blob, or host object storage; preserve private credentials server-side |
| `/manus-storage` runtime path | Source image URLs and storage proxy | Rewrite to destination CDN URLs or retain an equivalent proxy route |
| Manus runtime Vite plugin | `vite.config.ts`, `vite-plugin-manus-runtime` | Remove after confirming the target does not depend on its preview/debug behavior |
| Manus analytics variables | Host environment | Replace only after privacy/cookie review, or omit analytics |
| Preview bearer-token fallback | tRPC client/session code | Remove if unnecessary; rely on secure first-party cookies on the destination domain |
| Manus owner identity bootstrap | `OWNER_OPEN_ID` logic | Replace with a controlled immutable subject mapping and documented admin lifecycle |
| Manus auto-publish/checkpoints | Hosting workflow | Replace with Git, CI, immutable releases, deployment history, and tested rollback |

The business components—React pages, tRPC procedures, Drizzle schema, notice logic, Doxy.me boundary, content, styles, and tests—are not inherently Manus-specific.

## 13. Destination Architecture Options

| Option | Fit | Required changes |
|---|---|---|
| Managed Node service plus managed MySQL | **Lowest migration risk** | Copy code, replace auth/storage integrations, configure environment, deploy `dist/index.js` |
| Container platform | Good when the organization standardizes on containers | Add a minimal Node 22 image, health endpoint, secret injection, and process/port contract |
| Serverless functions plus static frontend | Moderate refactor | Adapt Express/tRPC and OAuth callback to functions; ensure cookie and cold-start behavior; use managed DB pooling |
| Edge-worker platform | Highest refactor | Replace Node/Express assumptions, MySQL driver, cookie/server adapters, and possibly ORM/runtime behavior |
| Squarespace or another site builder | Public site only | Rebuild homepage natively; keep `/portal`, `/admin/notices`, auth, API, and DB on a separate full-stack origin |

For a split public/portal architecture, place the public site at `www.mcalpinepediatrics.com` and the full-stack portal at a stable subdomain such as `portal.mcalpinepediatrics.com`. Update header links, OAuth callbacks, cookie scope, CORS, Content Security Policy, and privacy notices accordingly. Do not embed the portal as an untrusted iframe.

## 14. Build, Test, and Run Commands

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm test
pnpm build
NODE_ENV=production PORT=3000 node dist/index.js
```

The build command compiles the React application into `dist/public` and bundles the Express entrypoint into `dist/index.js`. The production service must receive the host-provided `PORT`, terminate TLS at the platform or reverse proxy, forward the original protocol correctly, and serve both the API and SPA from the same release.

The current application includes a tRPC health procedure but no dedicated unauthenticated `/healthz` HTTP route. A destination platform that requires one should add a lightweight route before auth and static fallbacks. It should report process health only and must not expose secrets, database credentials, user counts, or patient-related data.

## 15. Automated and Manual Acceptance Testing

The published baseline passes **8 Vitest files and 17 tests**. Port and run all suites:

| Test file | Coverage |
|---|---|
| `server/auth.logout.test.ts` | Session-cookie logout behavior |
| `server/carousel.test.ts` | Eight-slide manifest and required gallery metadata |
| `server/eligibility.test.ts` | Disabled eligibility-adapter boundary |
| `server/oauth.redirect.test.ts` | Safe post-login allowlist and unsafe-destination rejection |
| `server/portal.test.ts` | Telehealth auth, fixed destination, admin notice authorization, non-clinical attestation |
| `client/src/components/McAlpineStoryCarousel.test.tsx` | Gallery controls and keyboard behavior |
| `client/src/components/SiteHeader.test.tsx` | Exact navigation labels and portal CTA |
| `client/src/pages/Portal.test.tsx` | Signed-out/signed-in portal states and Doxy.me modal |

### 15.1 Functional acceptance matrix

| Area | Acceptance criteria |
|---|---|
| Homepage | All sections appear in the specified order; literal approved copy and contact details match `Home.tsx` |
| Header | Exact labels **Insurance & Co-Pay** and **Patient Portal** appear in desktop and mobile navigation; portal CTA is dark green with white text |
| Biography | Review block is directly beneath the two statistics and is not duplicated below the gallery |
| Review links | WebMD and RateMD open the correct external pages; no hardcoded rating/testimonial exists |
| Gallery | Eight slides, correct order/captions/alts, manual controls, Left/Right keys, visible focus, no auto-advance, correct 150% display treatments |
| Insurance | No member identifiers; wording distinguishes public directory information from real-time eligibility |
| Scheduling | No symptoms/history; clearly not live booking unless replaced by an approved scheduler |
| Portal redirect | Consent completed after `/portal` sign-in returns to `/portal` |
| Patient notices | Only active notices show; mark-read state and unread count are user-specific |
| Admin | Normal users cannot create/archive; admin attestation is required; archived notices leave patient inbox |
| Doxy.me | Auth required, explanatory modal works by keyboard, cancel stays in portal, continue opens the fixed HTTPS URL |
| Security | Tampered state rejected; external/protocol-relative redirects blocked; cookies secure under HTTPS |
| Responsive | No horizontal overflow; navigation, portrait, statistics, review block, gallery, forms, and footer remain usable |
| Accessibility | Skip link, landmarks, heading order, labels, alt text, focus indicators, modal focus, reduced motion, and contrast reviewed against WCAG 2.2 AA criteria.[6] |
| Build | Frozen install, tests, TypeScript/build, and production start succeed in CI and staging |

## 16. Privacy, Security, and Legal Boundaries

Application code alone does not establish HIPAA compliance. The HIPAA Security Rule requires administrative, physical, and technical safeguards and ongoing risk analysis for electronic protected health information.[7] HHS states that a cloud provider that creates, receives, maintains, or transmits ePHI is generally a business associate, including when it stores encrypted ePHI, and an appropriate business associate agreement is required.[8]

This migration should therefore keep the present **non-clinical** scope unless and until the practice completes legal and operational approval. At minimum:

| Area | Required control |
|---|---|
| Data minimization | Do not add general forms for symptoms, diagnoses, medications, records, insurance IDs, or medical messages |
| Identity | Document provider configuration, verified-email policy, account recovery, administrator assignment, and offboarding |
| Authorization | Enforce patient/admin separation on the server; periodically review admin access |
| Secrets | Use managed secrets; rotate at migration; never expose server secrets through `VITE_*` |
| Encryption | TLS in transit; database and object-store encryption at rest; encrypted backups |
| Logging | Exclude tokens, cookies, notice bodies where unnecessary, and any clinical details; define retention and access controls |
| Dependencies | Use lockfile scanning and scheduled security updates with regression testing |
| Browser security | Add appropriate CSP, Referrer-Policy, Permissions-Policy, frame restrictions, and secure headers |
| Database | Least-privileged application user, restricted network access, backups, recovery testing, and change review |
| Vendors | Complete privacy/security review and applicable agreements before any protected information is handled |
| Incident response | Define contacts, evidence retention, containment, notice assessment, and recovery steps |
| Analytics | Review tracking, consent, data destinations, and exclusions before enabling destination analytics |

> **Prohibited shortcut:** Do not describe the migrated site as “HIPAA compliant” merely because it uses HTTPS, authentication, encryption, or a well-known cloud platform.

## 17. Step-by-Step Migration Runbook

### Phase A — Freeze and inventory

1. Export or clone checkpoint `93fd03d9`, including `pnpm-lock.yaml` and all documentation.
2. Record DNS, TLS, OAuth application settings, environment-variable names, database counts, and asset checksums.
3. Download every asset listed in Section 10 before disabling the current storage integration.
4. Create separate staging and production destination environments.

### Phase B — Establish portable infrastructure

1. Provision Node 22, managed MySQL, object storage/CDN, secret management, centralized logs, and backups.
2. Import the schema and non-production test data into staging. Do not insert fabricated testimonials or reviews.
3. Configure least-privileged service identities and network restrictions.

### Phase C — Replace Manus identity

1. Select and approve the identity provider.
2. Implement authorize, callback, token validation, immutable subject mapping, session issuance, logout, and user upsert.
3. Preserve the nonce/CSRF control and exact internal redirect allowlist.
4. Register staging callback URLs and pass every authentication acceptance test before production registration.

### Phase D — Replace storage

1. Upload assets to the destination store and verify checksums/MIME types.
2. Either rewrite URLs or implement the equivalent `/manus-storage/{key}` signed redirect.
3. Review rendered crops and alternative text across breakpoints.
4. Keep bucket write credentials server-side; do not expose broad keys to the browser.

### Phase E — Port application and data

1. Port the React, tRPC, Drizzle, styling, and tests.
2. Replace Manus runtime and analytics integrations only after identifying every dependency.
3. Import the production database during a controlled write freeze.
4. Confirm user-role mapping, notice visibility, unread state, and administrator access.

### Phase F — Staging validation

1. Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build` in CI.
2. Test the production start command and platform health checks.
3. Complete the functional matrix in Section 15 on desktop and mobile.
4. Exercise OAuth consent and return routing with real staging accounts.
5. Verify external links, Doxy.me modal, telephone, and Google Maps.
6. Perform accessibility, privacy, security-header, dependency, backup, and restore reviews.

### Phase G — Cutover

1. Reduce DNS TTL in advance.
2. Put mutable source functions into a brief maintenance/read-only window if needed.
3. Take final encrypted database export and reconcile row counts after import.
4. Register the final production OAuth callback and secrets.
5. Deploy an immutable release, verify the destination directly, then switch DNS.
6. Monitor OAuth errors, HTTP 5xx, database connections, asset failures, and client errors without logging sensitive contents.

### Phase H — Stabilize and decommission

1. Keep the source deployment and database available for rollback until the practice signs off.
2. Re-run the acceptance matrix through the public domain.
3. Rotate credentials that were used during migration.
4. Decommission the old environment only after backups, retention requirements, asset custody, and rollback approval are documented.

## 18. Launch and Rollback Checklist

### 18.1 Launch gate

| Gate | Pass condition |
|---|---|
| Content | Practice confirms biography, office details, hours, fax, external links, and privacy wording |
| Identity | Portal and admin consent flows return to correct routes; account recovery and admin assignment documented |
| Data | Table counts/relationships verified; backups and restore tested |
| Assets | All images load through destination URLs; checksums and responsive crops verified |
| Authorization | Patient/admin tests pass at API and UI layers |
| Telehealth | Fixed Doxy.me destination and modal approved by practice |
| Privacy/security | No PHI intake added; risk/vendor/logging review complete for actual scope |
| Accessibility | Keyboard, focus, screen-reader basics, contrast, zoom, and reduced motion reviewed |
| Operations | Monitoring, alerts, on-call owner, deployment record, and rollback procedure ready |
| DNS/TLS | Certificates valid; canonical host and redirects correct; OAuth callback uses HTTPS |

### 18.2 Rollback triggers and action

Rollback should be considered for widespread login failure, incorrect portal redirects, authorization leakage, database corruption, missing assets on key pages, sustained server errors, or an incorrect Doxy.me destination. The rollback sequence is:

1. Stop writes or administrator notice changes on the destination.
2. Repoint DNS or traffic to the last known-good deployment.
3. Restore the compatible database snapshot only when necessary and after preserving failure evidence.
4. Rotate any potentially exposed credentials.
5. Document the incident, root cause, affected time window, data implications, and criteria for a second cutover.

## 19. Definition of Done

The migration is complete only when the destination reproduces the published public design and content, preserves the review-block placement, serves all listed assets, passes all automated and manual acceptance tests, returns users to `/portal` after sign-in, enforces administrator authorization on the server, maintains the non-clinical notice boundary, performs the explicit Doxy.me handoff, has approved operational/security documentation, and has a tested rollback path.

## 20. References

[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie "MDN Web Docs — Set-Cookie and cookie prefixes"
[2]: https://www.rfc-editor.org/rfc/rfc9700.html "RFC 9700 — Best Current Practice for OAuth 2.0 Security"
[3]: https://vite.dev/guide/env-and-mode "Vite Documentation — Env Variables and Modes"
[4]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html "Amazon S3 User Guide — Sharing objects with presigned URLs"
[5]: https://doxy.me/v2/check-in/drmcalpine "Dr. McAlpine’s Check In Page — Doxy.me"
[6]: https://www.w3.org/TR/WCAG22/ "W3C — Web Content Accessibility Guidelines (WCAG) 2.2"
[7]: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html "U.S. HHS — Summary of the HIPAA Security Rule"
[8]: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html "U.S. HHS — Guidance on HIPAA and Cloud Computing"
