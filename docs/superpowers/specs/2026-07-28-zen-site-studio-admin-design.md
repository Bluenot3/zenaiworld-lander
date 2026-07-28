# ZEN Site Studio Admin Design

**Date:** July 28, 2026  
**Repository:** `Bluenot3/zenaiworld-lander`  
**Base:** `codex/zenaiworld-launch-center`  
**Working branch:** `agent/zen-site-studio-admin`

## Goal

Add a protected Site Studio to the new `zenai.world` gateway so authorized ZEN administrators can create pages, add and reorder sections, edit content, preview changes, publish or unpublish pages, archive content, and restore prior published versions without using AI or editing source code.

## Non-negotiable constraints

- Reuse Arsenal's existing Supabase project and Supabase Auth identity.
- Reuse the existing `public.is_platform_admin()` authorization contract.
- Do not create a second login, admin-role system, billing system, enrollment system, or customer database.
- Keep `arsenal.world` authoritative for authenticated Arsenal product functionality.
- Keep the current code-built homepage operational if the CMS or Notion connection is unavailable.
- Do not expose Supabase service-role credentials, Notion credentials, or connector credentials to the browser.
- Do not publish to `zenai.world`, change DNS, or remove Wix rollback during this feature branch.
- Arbitrary HTML must never execute in the main application DOM.

## Approaches considered

### 1. Recommended: Arsenal Supabase authorization + Notion-backed Site Studio

The editor uses the same Supabase project and authenticated user identity as Arsenal. Both client and server verify `public.is_platform_admin()`. Structured page and section records are stored in a CMS subset of the existing `ZEN WORLD UPGRADE` Notion database, leaving its migration inventory intact.

**Advantages**

- Reuses current identity and admin authorization.
- Reuses the Notion workspace where ZEN's legacy page code, URLs, embeds, and migration material already live.
- Avoids another operational database or duplicate auth system.
- Allows nontechnical editing through the new Site Studio and direct Notion inspection when necessary.

**Trade-offs**

- Notion writes are slower than direct database writes.
- Publishing must display connector failures truthfully.
- Large HTML experiences require chunking and sandboxed rendering.

### 2. Supabase-native CMS

Store pages, sections, revisions, and redirects in new Supabase tables.

**Reason not selected now:** it would require new operational schema and migration work when the current direction is to reuse the existing Arsenal database without creating another site-specific data system.

### 3. Git-backed page editor

Write content files to GitHub and trigger a deployment for each edit.

**Reason not selected:** it adds GitHub credentials, deploy latency, merge risk, and a code-release workflow to routine content edits.

## Architecture

### Authentication and authorization

1. The site initializes Supabase with the same project URL and publishable key used by Arsenal.
2. The login flow uses Supabase PKCE and the existing Arsenal account.
3. Because `arsenal.world` and `zenai.world` are different root domains, the administrator may need to sign in separately on `zenai.world`; the identity and authorization source remain the same Supabase project.
4. `/studio` requires a current authenticated session.
5. The browser calls `rpc('is_platform_admin')` before displaying admin controls.
6. Every server mutation independently validates the access token and calls `public.is_platform_admin()` before reading or writing Notion.
7. Client-provided email, `user_metadata`, route state, or local storage must never grant admin access.
8. Unauthorized users receive a neutral access-denied screen and no CMS data.

### Content source

Use the existing `ZEN WORLD UPGRADE` Notion database as both:

- the preserved Wix/legacy migration inventory, and
- a filtered Site Studio content collection.

Add CMS-specific properties without changing or deleting existing migration rows:

- `CMS Record Type`: `Page`, `Section`, `Revision`, `Redirect`, or blank for legacy inventory
- `CMS ID`: stable UUID text
- `Parent CMS ID`: parent page UUID for sections and revisions
- `Slug`: lowercase public slug
- `Status`: `Draft`, `Published`, `Archived`
- `Section Type`: section renderer identifier
- `Sort Order`: integer
- `Content JSON`: validated structured payload
- `SEO Title`
- `SEO Description`
- `Show in Navigation`: boolean
- `Navigation Label`
- `Published At`
- `Published By`
- `Updated At`

The existing `Link or code` property stores large HTML, iframe markup, or external URLs. `Content JSON` stores normal structured section data. This avoids forcing large HTML payloads into the structured configuration field.

A one-time, admin-only CMS setup operation verifies that these properties exist and adds only missing properties. It never edits, deletes, or reclassifies legacy inventory rows. Public page requests never run schema setup.

Existing columns such as `Page URL`, `Section / Subpage`, `Type`, `Link or code`, `Action`, and migration notes remain intact.

### Page model

```ts
interface SitePage {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  showInNavigation: boolean;
  navigationLabel: string;
  sections: SiteSection[];
  publishedAt: string | null;
  updatedAt: string;
}
```

### Section model

Every section has a stable ID, type, sort order, visibility state, layout variant, and type-specific validated content.

Initial section types:

1. `hero`
2. `rich_text`
3. `image`
4. `gallery`
5. `feature_grid`
6. `stats`
7. `cta`
8. `faq`
9. `url_embed`
10. `iframe_embed`
11. `html_experience`
12. `video`
13. `arsenal_handoff`
14. `divider`

Each type is represented by a discriminated Zod schema. Invalid section data cannot be saved or published.

### Site Studio routes

- `/studio` — page dashboard
- `/studio/pages/new` — create page
- `/studio/pages/$pageId` — page and section editor
- `/studio/preview/$pageId` — authenticated draft preview

The dashboard supports:

- search and status filters
- create page
- duplicate page
- open editor
- preview
- publish/unpublish
- archive/restore
- view public page

### Editor behavior

The editor uses three regions:

1. **Page settings:** title, slug, navigation, SEO, and status.
2. **Section outline:** add, select, move up/down, duplicate, hide, and archive sections.
3. **Live preview:** responsive desktop/tablet/mobile rendering using the same section renderer as the public page.

The first implementation uses deterministic move-up/move-down controls rather than adding a drag-and-drop dependency. Drag-and-drop can be added later without changing the content model.

Autosave is not enabled initially. Administrators use an explicit **Save draft** action so an incomplete field edit cannot silently overwrite a valid page.

### Public rendering

- Published managed pages render at `/p/$slug` in the first release.
- Reserved slugs include `studio`, `wiki`, `arsenal`, `learn`, `register`, `work-with-us`, `privacy`, `terms`, `sitemap.xml`, and `robots.txt`.
- Existing static routes and the code-built homepage remain unchanged.
- The homepage receives a controlled Site Studio slot before its final CTA/footer so admins can add supplemental published sections without rewriting the current homepage.
- Draft or archived pages never render publicly.
- Public pages use the same treasury-grade design tokens and reusable section renderer as the editor preview.
- Notion failure returns a graceful unavailable or not-found state for managed pages and does not break the homepage.

### Publishing and revision history

- **Save draft** updates page and section draft records.
- **Publish** validates the full page, creates a revision snapshot, then changes the page status to Published.
- **Unpublish** changes the public status without deleting content.
- **Archive** is the default delete action.
- **Restore revision** copies a prior snapshot into the current draft; it does not destroy later revisions.
- Revision records include actor ID, timestamp, page metadata, and all sections.

### Embed handling

#### URL embed

A normal URL can render as a ZEN-branded preview card or approved inline embed.

#### Iframe embed

Iframes receive an explicit sandbox policy, lazy loading, title, fallback link, aspect ratio, and fullscreen control. The editor never claims that a third-party iframe is natively integrated.

#### HTML experience

Full HTML is rendered only through an isolated `iframe` using `srcDoc` and a restrictive sandbox. Scripts may run inside the sandbox, but the frame does not receive `allow-same-origin` when scripts are enabled. HTML never enters the parent DOM through `dangerouslySetInnerHTML`.

#### Trusted providers

Provider helpers may normalize Hugging Face Spaces, Gradio, YouTube, Vimeo, and approved ZEN-owned apps. Unknown domains default to a link card until an administrator explicitly selects sandbox behavior.

### Audit trail

Every Site Studio publish, unpublish, archive, restore, page mutation, and section mutation creates a Site Studio revision/audit record containing:

- authenticated actor UUID
- action
- page ID
- section ID when relevant
- timestamp
- before/after revision reference

The implementation also writes to Arsenal's existing `public.admin_audit_log` through the authenticated Supabase session. Because Notion and Supabase cannot share one atomic transaction, a successful Notion mutation is not rolled back when the secondary Supabase audit insert fails. The UI must surface the audit failure and retain the mandatory Site Studio revision record.

### Error handling

- Authentication failure: clear sign-in or access-denied state.
- Supabase admin-check failure: deny access; never fail open.
- Notion unavailable: preserve unsaved editor state in memory, show retry, and do not report success.
- Validation failure: identify the exact page or section field.
- Publish conflict: reject stale saves when the remote update timestamp changed since the editor loaded.
- Broken embed: show the configured fallback card and external link.
- CMS schema not initialized: admins see a single setup action; public users see no setup details.

## Security requirements

- Use only the Supabase publishable key in browser code.
- Validate the current JWT on every privileged server action.
- Verify `public.is_platform_admin()` on the server for every write.
- Do not authorize from `user_metadata` or email supplied by the browser.
- Keep Notion and Lovable connector credentials server-only.
- Cap HTML and JSON payload sizes.
- Validate URLs and prohibit `javascript:`, `data:` except controlled image cases, and unsupported protocols.
- Use Content Security Policy-compatible iframe and script behavior.
- Escape all normal text content.
- Record privileged actions and publishing events.

## Testing strategy

### Unit tests

- page and section schema validation
- slug normalization and reserved-route rejection
- URL protocol validation
- iframe sandbox policy generation
- HTML payload limits
- page ordering and section reordering
- publish-state transitions
- revision restoration

### Server tests

- missing token is rejected
- authenticated non-admin is rejected
- platform admin can read and mutate CMS records
- Notion errors never return success
- stale update conflicts are detected
- only published records are returned by public loaders
- schema setup adds only missing CMS properties
- legacy migration rows remain unchanged

### Component tests

- each section type renders valid content
- editor controls update the draft model
- preview matches public renderer
- hidden sections do not render
- archived pages cannot publish without restore

### Release validation

- `npm run build`
- `npm run lint`
- desktop and mobile visual inspection
- keyboard navigation and focus order
- admin/non-admin route tests
- create, edit, reorder, preview, publish, unpublish, archive, restore flow
- URL, iframe, HTML, video, and Arsenal handoff rendering
- homepage remains operational with Notion disabled

## Acceptance criteria

The feature is complete when a current Arsenal platform administrator can:

1. Sign into `zenai.world` with the existing Supabase identity.
2. Open `/studio` while a non-admin cannot.
3. Create a page and choose its title and slug.
4. Add multiple supported section types.
5. Edit and reorder those sections.
6. Preview the page at desktop, tablet, and mobile sizes.
7. Save a draft without publishing it.
8. Publish and view the page publicly.
9. Unpublish it without losing content.
10. Archive and restore it.
11. Restore a prior published revision.
12. Paste a URL, iframe, or HTML experience and render it safely in a branded page.
13. Add supplemental managed sections to the homepage before the final conversion area.
14. Complete all of the above without editing code or using AI.

## Deferred scope

- Rebuilding every existing homepage section as editable CMS content
- Cross-domain seamless SSO between `arsenal.world` and `zenai.world`
- Multiple non-admin editorial roles and approval workflows
- Collaborative real-time editing
- Scheduled publishing
- Media transformations or a full digital asset manager
- DNS changes, production deployment, or Wix shutdown

## Rollback

The Site Studio is additive. Existing public routes and homepage content remain code-backed. If Site Studio is disabled or its environment configuration is absent, `/studio` is unavailable and managed pages return a controlled unavailable state while the existing site continues to operate.