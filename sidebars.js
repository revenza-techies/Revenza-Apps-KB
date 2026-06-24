/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  upsellSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/install', 'getting-started/create-first-upsell'],
    },
    {
      type: 'category',
      label: 'Create an upsell',
      collapsed: false,
      items: ['offers/offer-types', 'offers/offer-rules'],
    },
    {
      type: 'category',
      label: 'Customization',
      items: ['customization/design-placement', 'customization/text-translations'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['troubleshooting/common-issues'],
    },
    'faq',
  ],
};
