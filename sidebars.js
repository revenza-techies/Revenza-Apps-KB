/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  upsellSidebar: [
  {
    "type": "doc",
    "id": "intro",
    "label": "Overview"
  },
  {
    "type": "category",
    "label": "Getting Started",
    "items": [
      {
        "type": "doc",
        "id": "getting-started/upsell-product-preview",
        "label": "Upsell Product Preview"
      },
      {
        "type": "doc",
        "id": "getting-started/enable-widget-on",
        "label": "Show Widget On"
      }
    ],
    "link": {
      "type": "doc",
      "id": "getting-started"
    },
    "collapsed": true
  },
  {
    "type": "doc",
    "id": "pre-build-upsell-sets",
    "label": "Pre-Build Upsell sets"
  },
  {
    "type": "doc",
    "id": "custom-upsell-sets",
    "label": "Upsell Sets"
  },
  {
    "type": "doc",
    "id": "mapping",
    "label": "Mapping"
  },
  {
    "type": "category",
    "label": "Settings",
    "items": [
      {
        "type": "doc",
        "id": "settings/product-page",
        "label": "Product Page Settings"
      },
      {
        "type": "doc",
        "id": "settings/cart-page",
        "label": "Cart page"
      },
      {
        "type": "doc",
        "id": "settings/global-settings",
        "label": "Global Settings"
      }
    ],
    "link": {
      "type": "doc",
      "id": "settings"
    },
    "collapsed": true
  },
  {
    "type": "doc",
    "id": "integration",
    "label": "Integration"
  },
  {
    "type": "doc",
    "id": "billing",
    "label": "Billing"
  }
]
};
