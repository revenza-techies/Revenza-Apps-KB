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
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: false,
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
      label: "Home",
      position: "left",
      to: "/",
    },
    {
      label: "Revenza Upsell",
      position: "left",
      to: "/docs/revenza-upsell/",
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
                to: "/",
              },
            ],
          },

          {
            title: "Support",
            items: [
              {
                label: "Contact Us",
                href: "https://www.revenza.in/contact",
              },
            ],
          },

          {
            title: "Company",
            items: [
              {
                label: "Privacy",
                href: "https://www.revenza.in/privacy",
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
