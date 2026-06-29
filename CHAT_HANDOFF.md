# Revenza Knowledge Base - Chat and Project Handoff

Last updated: June 25, 2026

This document compiles the important context, decisions, implementation history,
and current state from the Codex conversation that created the Revenza Knowledge
Base. It is intended to help resume development on another computer without
needing the original chat.

> Security note: API keys, tokens, passwords, and other secret values are
> intentionally excluded.

## 1. Project Goal

Build a branded knowledge base for Revenza Shopify apps using:

- React
- Docusaurus
- GitHub Pages
- Custom domain: `docs.revenza.in`
- GitHub-managed Markdown content

The landing page showcases Revenza apps as cards. Selecting an app opens that
app's dedicated documentation. Revenza Upsell is the first app included.

The site should remain:

- Free to host
- Fast and responsive
- SEO optimized
- Easy to extend with apps, articles, screenshots, videos, FAQs, and changelogs
- Independent of a hosted documentation vendor

## 2. Repository and Deployment

- Local project path: `D:\Knowledge base`
- GitHub repository:
  `https://github.com/revenza-techies/Revenza-Apps-KB`
- Primary branch: `main`
- Live website: `https://docs.revenza.in`
- Hosting: GitHub Pages using GitHub Actions
- GitHub organization/account used for the repository: `revenza-techies`

The custom domain is verified, HTTPS is enabled, and GitHub Pages deployment was
confirmed working.

## 3. Main Product Decisions

### Landing Page Flow

1. User lands on the Revenza Help Center.
2. User sees cards for all Revenza apps.
3. Each card contains the app artwork, app name, and a short introduction.
4. Selecting the Revenza Upsell card opens its documentation at
   `/revenza-upsell`.
5. Future apps should use the same card-to-knowledge-base flow.

### Visual Direction

The selected design is based on the supplied "Generated image 3" reference:

- Warm white Day background
- Forest green typography and controls
- Pale lemon grass highlights
- Soft sage surfaces
- Clean, premium documentation layout
- Strong readability and restrained visual decoration

The design should stay intact while documentation content evolves.

### Theme Modes

Only two modes are supported:

- `Day`
- `Night`

System mode was explicitly removed. The site defaults to Day mode and does not
automatically follow the operating system theme.

Night mode is a direct translation of the Day design:

- Near-black green background
- Warm-white primary text
- Muted sage secondary text
- Lemon grass accents
- Accessible contrast

### Homepage Hero

- The supplied Revenza 3D artwork is used as a full-bleed animated background.
- It is not displayed inside a separate rectangular image card.
- Content uses a gradient overlay to remain readable.
- Motion respects reduced-motion accessibility preferences.

### App Card

- Revenza Upsell uses a vertical card.
- Blank space is intentionally minimized.
- The supplied Upsell logo is presented with depth and animation styling.
- The card remains responsive across desktop, tablet, and mobile.

## 4. Brand Assets

Original supplied assets:

- Revenza Upsell logo:
  `D:\Revenza Techies Database\04. Apps Data\01. Upsell Addons App\01. Upsell App Logos\Upsell logo-1.png`
- Revenza corporate logo:
  `D:\Revenza Techies Database\Revenza Techies\4K logo\Revenza logo_4K_3840x2160.png`

Optimized site assets are stored under:

```text
static/img/brand/
```

Important generated assets include:

- `revenza-brand-3d.webp`
- `revenza-hero-3d.webp`
- Revenza Upsell artwork used by the app card

Do not replace these casually. They are part of the approved design direction.

## 5. Technology and Commands

Current core packages:

- Docusaurus `3.10.1`
- React `19.1.1`
- Local Docusaurus search
- Phosphor Icons

Required Node version:

```text
Node.js 20 or newer
```

Install and run:

```powershell
npm install
npm start
```

Validation:

```powershell
npm test
npm run build
```

Production preview:

```powershell
npm run serve
```

## 6. Site Structure

Important routes:

- `/` - All-app landing page
- `/revenza-upsell` - Revenza Upsell knowledge-base home
- `/revenza-upsell/faq` - FAQ
- `/changelog` - Product changelog
- /contact - Support contact form
- /admin - Admin publishing workflow guidance, hidden from customer navigation

Important source locations:

```text
docusaurus.config.js
sidebars.js
src/css/custom.css
src/pages/index.js
src/pages/index.module.css
src/pages/contact.js
src/pages/contact.module.css
src/components/AppCard/
src/components/BrandScene/
src/components/ContactForm/
src/theme/ColorModeToggle/
src/data/apps.js
docs/
blog/
static/
.github/workflows/deploy.yml
```

## 7. Documentation Content

The Revenza Upsell knowledge base currently contains starter content for:

- Introduction
- Installation
- Creating the first upsell
- Offer types
- Offer rules
- Design and placement
- Text and translations
- FAQ
- Troubleshooting common issues

This content is intentionally editable Markdown. Future work should replace
placeholder or introductory copy with exact product behavior, screenshots, and
merchant-facing instructions without changing the approved visual system.

## 8. Contact Form

The contact page uses Web3Forms with inline form submission.

The access key is read during the GitHub Actions build from:

```text
WEB3FORMS_ACCESS_KEY
```

Configure it in:

```text
GitHub repository
→ Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

Never place the real access key in Markdown, source code, `.env` files committed
to Git, or this handoff document.

The form includes validation tests and preserves relevant merchant/store
context in the Web3Forms payload.

## 9. Search and Content Editing

The original concerns were:

- Markdown editing requires Git commits.
- Search must be added manually.

Implemented response:

- Content is maintained directly as Markdown in GitHub.
- Docusaurus local search is installed and indexes pages, docs, and changelog
  posts.
- Customer-facing GitHub edit links are hidden; admins use `/admin` and GitHub directly for content publishing.
- This avoids a hosted documentation vendor and keeps content portable.

## 10. SEO and Accessibility

Implemented SEO and platform features include:

- Custom title and description metadata
- Social sharing image
- Sitemap
- `robots.txt`
- Web manifest
- Custom favicon
- Semantic page structure
- Canonical production URL
- Responsive layouts
- Readable Day/Night contrast
- Reduced-motion support
- Accessible labels for the theme toggle and form controls

## 11. Tests and Verification

At completion:

- Six automated tests passed.
- Docusaurus production build passed.
- Desktop, tablet, and mobile Day screenshots were generated for QA.
- Day and Night theme logic was tested.
- Unknown/system theme values fall back to Day.
- GitHub Actions build and deployment passed.
- `https://docs.revenza.in` returned HTTP 200.
- Deployed JavaScript assets returned HTTP 200.
- The Git working tree was clean after push.

## 12. Important Commits

Key commits from the implementation:

```text
41e7ac1 chore: connect knowledge base repository
8da8ba5 feat: add Revenza 3D brand assets
126d3e5 feat: add animated Revenza hero scene
e0afa3b feat: redesign app cards with 3D artwork
cf9269c test: add contact form validation
846814b feat: add Web3Forms contact page
26ee9b2 chore: finish brand and contact deployment setup
abedcb6 docs: approve Day and Night lemon grass design
dabce0d docs: add Day and Night implementation plan
c328572 feat: add Day and Night lemon grass experience
```

Use `git log --oneline` on the new computer to see any commits made after this
handoff was created.

## 13. Moving to Another Computer

Clone the repository:

```powershell
git clone https://github.com/revenza-techies/Revenza-Apps-KB.git
cd Revenza-Apps-KB
npm install
npm test
npm run build
npm start
```

Also restore any private local environment values separately. Do not transfer
secrets through the repository.

The original source images are outside the Git repository. Copy them separately
only if future image regeneration is required. The optimized website versions
are already committed.

## 14. Development Guardrails

When continuing development:

1. Preserve the approved Day/Night lemon grass design.
2. Do not restore System theme mode.
3. Keep the homepage 3D scene full bleed.
4. Keep app cards vertical and compact.
5. Add future apps through the existing app-card data pattern.
6. Keep all layouts responsive.
7. Maintain accessible text contrast in both themes.
8. Run `npm test` and `npm run build` before committing.
9. Never commit credentials or Web3Forms keys.
10. Push to `main` only after local validation.

## 15. Suggested Next Work

- Replace starter Revenza Upsell documentation with final app-specific content.
- Add accurate screenshots and tutorial videos.
- Add more Revenza app cards as products become available.
- Add release entries to the changelog.
- Confirm Web3Forms secret configuration and submit a production test message.
- Periodically audit broken links, mobile layout, accessibility, and search
  results.

## 16. Resume Prompt for Codex

Paste the following into a new Codex chat after opening the cloned project:

```text
Read CHAT_HANDOFF.md completely before making changes.

This repository is the Revenza Help Center built with React and Docusaurus.
Preserve the approved Day/Night lemon grass design, full-bleed animated 3D
homepage hero, vertical app cards, responsive behavior, SEO setup, local search,
GitHub Pages deployment, and Web3Forms integration.

Inspect the current Git status and recent commits because the repository may
have changed after the handoff was written. Never expose or commit secret values.
Run npm test and npm run build before declaring implementation complete.

My next request is:
[WRITE THE NEW TASK HERE]
```

## 17. Original Request Summary

The conversation progressed through these main requests:

1. Create a free React/Docusaurus knowledge base on GitHub Pages.
2. Add a landing page containing cards for all Revenza apps.
3. Route each app card to its app-specific knowledge base.
4. Preserve the selected third design.
5. Add Revenza branding and animated 3D visuals.
6. Redesign the Revenza Upsell card vertically with its supplied logo.
7. Add a contact page using Web3Forms inline integration.
8. Remove System theme mode.
9. Initially consider dark variants, then correct the requirement to Day and
   Night modes.
10. Match the lemon grass colors and layout from the supplied reference image.
11. Make the homepage artwork a full 3D animated background.
12. Improve font visibility in both themes.
13. Keep token usage economical while still showing and verifying visuals.
14. Authenticate GitHub, commit locally, push the repository, enable GitHub
   Pages, and connect `docs.revenza.in`.

This file is a compiled operational record, not a word-for-word transcript. It
contains the context needed to continue the project effectively.
