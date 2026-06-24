# Revenza Knowledge Base

A Docusaurus documentation site for Revenza Shopify apps, designed for GitHub Pages and `docs.revenza.in`.

## Local development

```bash
npm install
npm start
```

## Add another app

1. Add the app to `src/data/apps.js` so it appears on the landing page.
2. Add a Docusaurus docs plugin instance for the app in `docusaurus.config.js`.
3. Create the app's docs folder and sidebar.

## Edit content

Knowledge-base articles live in `docs/`. Every article exposes an **Edit this page** link that opens the matching source file on GitHub.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it through GitHub Pages. Configure the repository's Pages source as **GitHub Actions**, then point the `docs.revenza.in` DNS record to GitHub Pages.

## Web3Forms

1. Create a Web3Forms access key for `support@revenza.in`.
2. Add `WEB3FORMS_ACCESS_KEY` as a GitHub Actions repository secret.
3. For local testing, set `$env:WEB3FORMS_ACCESS_KEY='your-key'` in PowerShell before building.
4. Never commit the real access key.

## Brand assets

The original supplied Revenza and Revenza Upsell logos are preserved under `static/img/brand` and `static/img/apps`. Optimized 3D derivatives are stored as WebP files and animated with reduced-motion-safe CSS transforms.
