# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the remaining Docusaurus page and docs rendering responsibilities with Astro while preserving GitBook-synced Revenza Upsell content and the existing public-site behavior.

**Architecture:** Astro will own the site shell, standalone routes, and a dedicated Upsell docs route. GitBook sync will continue to sanitize source content, but it will emit Astro-friendly MDX content and neutral sidebar data that the Astro docs layout can render consistently.

**Tech Stack:** Astro 7, Astro MDX, Astro React integration for interactive components, existing CSS modules, Node content-sync scripts, GitBook-synced Markdown/MDX.

---

### Task 1: Establish the Astro docs architecture

**Files:**
- Modify: `README.md`
- Modify: `scripts/sync-content.mjs`
- Modify: `scripts/content-sync-utils.mjs`
- Create: `src/content.config.ts`
- Create: `src/utils/docs.ts`
- Create: `docs/superpowers/plans/2026-07-08-astro-migration.md`

- [ ] Audit the current GitBook sync outputs and confirm which files contain MDX-style content.
- [ ] Move the Astro migration design into repo documentation so future changes do not depend on chat history.
- [ ] Define a single source of truth for Upsell docs content under Astro-friendly content collections.
- [ ] Keep `docs/` preserved for now, but stop making the runtime depend on Docusaurus-specific assumptions.

### Task 2: Migrate Revenza Upsell docs rendering into Astro

**Files:**
- Create: `src/layouts/DocsLayout.astro`
- Create: `src/components/docs/DocsSidebar.astro`
- Create: `src/components/docs/DocsToc.astro`
- Create: `src/components/docs/DocsPager.astro`
- Create: `src/pages/revenza-upsell/[...slug].astro`
- Modify: `src/styles/global.css`
- Modify: `src/data/apps.js`
- Modify: `scripts/sync-content.mjs`
- Modify: `scripts/content-sync-utils.mjs`

- [ ] Render GitBook-synced Upsell docs through an Astro route instead of Docusaurus docs pages.
- [ ] Preserve GitBook block output such as steppers, tabs, button cards, hints, cards, and expandable sections.
- [ ] Use the synced sidebar JSON as the navigation model for the Astro docs sidebar.
- [ ] Preserve the Overview special-case flow while letting all other Upsell pages render from synced content.
- [ ] Generate previous/next navigation and table-of-contents data inside Astro.

### Task 3: Migrate standalone public pages into Astro

**Files:**
- Create: `src/pages/contact.astro`
- Create: `src/pages/privacy-policy.astro`
- Create: `src/pages/admin.astro`
- Modify: `src/components/ContactForm/index.jsx`
- Modify: `src/utils/contactForm.js`
- Modify: `src/layouts/BaseLayout.astro`
- Reuse: `src/pages/contact.module.css`
- Reuse: `src/pages/privacy-policy.module.css`
- Reuse: `src/pages/admin.module.css`

- [ ] Recreate the existing contact page in Astro and keep the Web3Forms behavior intact.
- [ ] Recreate the privacy policy route in Astro without changing the content payload shape.
- [ ] Recreate the admin workflow page in Astro and keep it out of customer navigation.
- [ ] Keep the public-site header/footer shell stable while these pages move off Docusaurus.

### Task 4: Verification, cleanup, and branch stabilization

**Files:**
- Modify: `src/utils/contentSync.test.js`
- Modify: `src/utils/contactForm.test.js`
- Modify: `README.md`
- Modify: any newly created Astro docs helpers if verification exposes gaps

- [ ] Extend sync tests for Astro-targeted MDX output and Upsell route expectations.
- [ ] Run `npm test` and `npm run build`.
- [ ] Re-run the content sync script against the current repo state and verify the Astro route still builds.
- [ ] Review the diff for leftover Docusaurus runtime assumptions.
- [ ] Commit the stable migration checkpoint on `astro-migration`.
