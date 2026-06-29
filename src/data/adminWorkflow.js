const adminWorkflow = {
  title: 'Admin publishing workflow',
  repositoryUrl: 'https://github.com/revenza-techies/Revenza-Apps-KB',
  docsPath: 'docs/',
  changelogPath: 'blog/',
  imageUploadPath: 'images/',
  securityNotes: [
    'Do not collect GitHub passwords on this website.',
    'Use GitHub authentication directly on github.com for repository access.',
    'Never commit secrets, API keys, Web3Forms keys, or private tokens.',
  ],
  editingSteps: [
    'Sign in to GitHub with an account that has access to the Revenza Apps KB repository.',
    'Edit Markdown articles inside docs/ for Revenza Upsell help content.',
    'Add changelog entries inside blog/ when product updates are released.',
    'Open a pull request or commit directly to main only after reviewing the change.',
    'Let GitHub Actions build and publish the updated site to docs.revenza.in.',
  ],
  imageSteps: [
    'Upload article images to images/ in the GitBook content repo.',
    'Use optimized WebP, PNG, or SVG files with descriptive lowercase names.',
    'Reference uploaded images in Markdown with /img/content/example-image.webp.',
    'Keep screenshots free from customer data, private tokens, and store secrets.',
  ],
};

module.exports = {adminWorkflow};