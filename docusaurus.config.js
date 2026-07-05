const {themes: prismThemes} = require('prism-react-renderer');

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
          breadcrumbs: true,
        },
        blog: {
          routeBasePath: 'changelog',
          blogTitle: 'Revenza Changelog',
          blogDescription: 'Product improvements, fixes, and new releases from Revenza.',
          postsPerPage: 10,
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
      disableSwitch: true,
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
        {to: '/contact', label: 'Contact', position: 'left'},
        {to: '/privacy-policy', label: 'Privacy Policy', position: 'left'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'All apps', to: '/'},
            {label: 'Revenza Upsell', to: '/revenza-upsell/overview'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Changelog', to: '/changelog'},
            {label: 'Contact support', to: '/contact'},
            {label: 'Privacy Policy', to: '/privacy-policy'},
          ],
        },
        {
          title: 'Revenza',
          items: [
            {label: 'Website', href: 'https://revenza.in'},
            {label: 'Support', href: 'mailto:support@revenza.in'},
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

