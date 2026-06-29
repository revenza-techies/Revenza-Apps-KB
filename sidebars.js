/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  upsellSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started',
      },
      items: [
        'getting-started/install',
        'getting-started/activate',
        'getting-started/pre-build-sets',
      ],
      collapsed: true,
    },
    {
      type: 'doc',
      id: 'custom-upsell-sets',
      label: 'Custom Upsell Sets',
    },
    {
      type: 'doc',
      id: 'mapping',
      label: 'Mapping',
    },
    {
      type: 'doc',
      id: 'billing',
      label: 'Billing',
    },
  ],
};