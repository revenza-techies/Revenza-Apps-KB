# Revenza Knowledge Base

A Docusaurus documentation site for Revenza Shopify apps, designed for GitHub Pages and `docs.revenza.in`.

## Repository roles

This repository owns the website design, Docusaurus structure, deployment workflow, contact form, theme, and build pipeline.

GitBook content is split into separate content repositories:

- `revenza-techies/revenza-home` - landing page copy, app cards, home images, optional changelog.
- `revenza-techies/revenza-upsell` - Revenza Upsell articles and app-specific images.

## Local development

```bash
npm install
npm start
```

To test with local GitBook content repos:

```powershell
$env:HOME_CONTENT_REPO_PATH='D:\revenza-home'
$env:REVENZA_UPSELL_CONTENT_REPO_PATH='D:\revenza-upsell'
npm run sync:content
npm run build
```

If the content repo paths are missing, the site uses committed fallback content in this repository.

## GitBook content repo structures

Home repo:

```text
revenza-home/
  README.md
  all-apps.md
  apps.json
  images/
    all-apps/
  changelog/
```

Revenza Upsell repo:

```text
revenza-upsell/
  README.md
  intro.md
  faq.md
  getting-started/
  offers/
  customization/
  troubleshooting/
  images/
    getting-started/
    offers/
    customization/
    troubleshooting/
```

Images uploaded in GitBook should sync under `images/` and be referenced in Markdown with the final Docusaurus URL:

```md
![Install Revenza Upsell app](/img/content/revenza-upsell/getting-started/install-app.webp)
```

During build, home images copy to `static/img/content/`, and Revenza Upsell images copy to `static/img/content/revenza-upsell/`.

## Add another app

1. Add the app card to `apps.json` in `revenza-home`.
2. Create a separate GitBook/GitHub repo for that app's Markdown content.
3. Add a matching checkout + sync mapping in this website repo when the new app needs its own Docusaurus docs section.

## Edit content

Customer-facing pages do not expose GitHub edit links. Admins should use `/admin` for workflow guidance and edit content through GitBook/GitHub directly.

Safe GitBook-managed content:

- `revenza-upsell/sidebar.json` - controls the Revenza Upsell Docusaurus sidebar structure
- `revenza-home/all-apps.md`
- `revenza-home/apps.json`
- `revenza-home/changelog/**/*.md`
- `revenza-home/images/**/*`
- `revenza-upsell/**/*.md`
- `revenza-upsell/images/**/*`

Do not edit Docusaurus source code, package files, workflows, or config from GitBook.

## Deploy

In this Docusaurus repo, add these repository variables:

```text
GITBOOK_HOME_REPO=revenza-techies/revenza-home
GITBOOK_UPSELL_REPO=revenza-techies/revenza-upsell
```

Because both content repositories are public, `CONTENT_REPO_TOKEN` is not required. If either content repository becomes private later, add a `CONTENT_REPO_TOKEN` secret with read access.

Push to `main` or run the workflow manually. The workflow checks out the website repo, home content repo, and Revenza Upsell content repo, then syncs content, runs tests, builds Docusaurus, and publishes through GitHub Pages.

## Web3Forms

1. Create a Web3Forms access key for `support@revenza.in`.
2. Add `WEB3FORMS_ACCESS_KEY` as a GitHub Actions repository secret.
3. For local testing, set `$env:WEB3FORMS_ACCESS_KEY='your-key'` in PowerShell before building.
4. Never commit the real access key.

## Brand assets

The original supplied Revenza and Revenza Upsell logos are preserved under `static/img/brand` and `static/img/apps`. Optimized 3D derivatives are stored as WebP files and animated with reduced-motion-safe CSS transforms.
## GitBook sidebar structure

The Revenza Upsell GitBook repo can control the Docusaurus sidebar by adding `sidebar.json` at the repo root. The sync script converts it into `sidebars.js` during build, so GitBook controls page order while Docusaurus keeps the visual design.