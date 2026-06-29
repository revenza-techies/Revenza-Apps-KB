# Revenza Home Content

This repository is synced with the GitBook home space and stores editable landing-page content for `docs.revenza.in`.

## Safe to edit in GitBook

- `all-apps.md` - All Apps homepage copy
- `apps.json` - app cards shown on the homepage
- `changelog/**/*.md` - release notes, if you want changelog content in the home space
- `images/**/*` - landing page and shared images

## Image links

Upload images under `images/`, then reference them in Markdown using the final Docusaurus public path:

```md
![Homepage example](/img/content/all-apps/example.webp)
```

Use lowercase filenames with hyphens and avoid screenshots with customer data, secrets, or private store information.