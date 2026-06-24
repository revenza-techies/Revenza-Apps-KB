const {themes: prismThemes} = require('prism-react-renderer');

const repositoryUrl = 'https://github.com/revenza-techies/Revenza-Apps-KB';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Revenza Help Center',
  tagline: 'Practical guides for Revenza Shopify apps',
  favicon: 'img/favicon.svg',
  url: 'https://docs.revenza.in',
  baseUrl: '/',
  organizationName: 'revenza-techies',
  projectName: 'Revenza-Apps-KB',
  trailingSlash: false,
  customFields: {
    web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY || '',
  },
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'revenza-upsell',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `${repositoryUrl}/edit/main/`,
          breadcrumbs: true,
        },
        blog: {
          routeBasePath: 'changelog',
          blogTitle: 'Revenza Changelog',
          blogDescription: 'Product improvements, fixes, and new releases from Revenza.',
          postsPerPage: 10,
          editUrl: `${repositoryUrl}/edit/main/`,
          showReadingTime: false,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: '/revenza-upsell',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 60,
      },
    ],
  ],
  headTags: [{tagName:'link',attributes:{rel:'manifest',href:'/manifest.json'}}],
  themeConfig: {
    image: 'img/revenza-social-card.svg',
    metadata: [
      {
        name: 'keywords',
        content: 'Revenza, Shopify apps, Revenza Upsell, Shopify upsell app, help center',
      },
      {name: 'theme-color', content: '#fffefb'},
      {property: 'og:type', content: 'website'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Revenza Help Center',
      logo: {
        alt: 'Revenza',
        src: 'img/brand/revenza-brand-3d.webp',
      },
      items: [
        {to: '/', label: 'All apps', position: 'left', exact: true},
        {to: '/revenza-upsell', label: 'Revenza Upsell', position: 'left'},
        {to: '/changelog', label: 'Changelog', position: 'left'},
        {to: '/revenza-upsell/faq', label: 'FAQ', position: 'left'},
        {to: '/contact', label: 'Contact', position: 'left'},
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
          'aria-label': 'Revenza documentation on GitHub',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'All apps', to: '/'},
            {label: 'Revenza Upsell', to: '/revenza-upsell'},
            {
              label: 'Troubleshooting',
              to: '/revenza-upsell/troubleshooting/common-issues',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Changelog', to: '/changelog'},
            {label: 'FAQ', to: '/revenza-upsell/faq'},
            {label: 'Suggest an update', href: `${repositoryUrl}/issues/new`},
            {label: 'Contact support', to: '/contact'},
          ],
        },
        {
          title: 'Revenza',
          items: [
            {label: 'Website', href: 'https://revenza.in'},
            {label: 'Support', href: 'mailto:support@revenza.in'},
            {label: 'GitHub', href: repositoryUrl},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Revenza. Built for Shopify merchants.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
