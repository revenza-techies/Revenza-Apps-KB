// @ts-check

import { themes as prismThemes } from "prism-react-renderer";

const siteDescription =
  "Official Revenza Apps help center for Shopify merchants. Find Revenza Upsell setup, integration, billing, customization, and troubleshooting guides.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.revenza.in/#organization",
      name: "Revenza Techies",
      url: "https://www.revenza.in/",
      logo: {
        "@type": "ImageObject",
        url: "https://docs.revenza.in/img/favicon.png",
        width: 144,
        height: 144,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@revenza.in",
        url: "https://www.revenza.in/contact",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://docs.revenza.in/#website",
      url: "https://docs.revenza.in/",
      name: "Revenza Knowledge Base",
      alternateName: "Revenza Apps Help Center",
      description: siteDescription,
      publisher: { "@id": "https://www.revenza.in/#organization" },
      inLanguage: "en",
    },
  ],
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Revenza Knowledge Base",
  tagline: siteDescription,
  favicon: "img/favicon.png",
  url: "https://docs.revenza.in",
  baseUrl: "/",
  organizationName: "Revenza",
  projectName: "revenza-kb",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "144x144",
        href: "/img/favicon.png",
      },
    },
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify(structuredData),
    },
  ],
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
      {
        docs: {
          routeBasePath: "docs",
          sidebarPath: "./sidebars.js",
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.7,
          lastmod: "date",
          ignorePatterns: ["/search"],
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
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
      image: "img/brand/revenza-logo.png",
      metadata: [
        {
          name: "keywords",
          content:
            "Revenza Apps, Revenza Upsell, Shopify upsell app, Shopify app documentation, ecommerce help center",
        },
        { name: "author", content: "Revenza Techies" },
        { name: "theme-color", content: "#0F766E" },
      ],
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
        copyright:
          "\u00A9 " + new Date().getFullYear() + " Revenza. All rights reserved.",
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
