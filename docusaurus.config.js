// @ts-check

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Revenza Knowledge Base",
  tagline: "Everything you need to get the most from Revenza apps",

  favicon: "img/favicon.ico",

  url: "https://docs.revenza.in",

  baseUrl: "/",

  organizationName: "Revenza",

  projectName: "revenza-kb",

  onBrokenLinks: "throw",

  onBrokenMarkdownLinks: "warn",

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      ({
        docs: {
  routeBasePath: "docs",
  sidebarPath: "./sidebars.js",
},

        blog: false,

        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],
plugins: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["en"],
      docsRouteBasePath: "/docs",
      indexDocs: true,
      indexBlog: false,
      indexPages: true,
      highlightSearchTermsOnTargetPage: true,
      searchBarPosition: "right",
      explicitSearchResultPath: true,
    },
  ],
],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.jpg",

      colorMode: {
        respectPrefersColorScheme: true,
      },

      navbar: {
  title: "",
  hideOnScroll: false,
  logo: {
    alt: "Revenza",
    src: "img/brand/revenza-logo.png",
    href: "/",
  },
  items: [
    {
      type: "docSidebar",
      sidebarId: "tutorialSidebar",
      position: "left",
      label: "Documentation",
    },
    {
      label: "Website",
      href: "https://revenza.in",
      position: "left",
    },
    {
      label: "Support",
      position: "right",
      items: [
        {
          label: "Live Chat",
          href: "#",
        },
        {
          label: "Knowledge Base",
          to: "/docs",
        },
      ],
    },
    {
      type: "search",
      position: "right",
    },
  ],
},

      footer: {
        style: "dark",

        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Home",
                to: "/docs/home",
              },
            ],
          },

          {
            title: "Support",
            items: [
              {
                label: "Contact Us",
                href: "https://revenza.in/contact",
              },
            ],
          },

          {
            title: "Company",
            items: [
              {
                label: "Website",
                href: "https://revenza.in",
              },
            ],
          },
        ],

        copyright: `© ${new Date().getFullYear()} Revenza. All rights reserved.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
     }),
     scripts: [
  {
    src: "//in.fw-cdn.com/32934803/1713602.js",
    async: true,
  },
],
    };

export default config;
