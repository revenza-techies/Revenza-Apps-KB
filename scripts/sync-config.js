/**
 * Revenza Knowledge Base
 * Synchronization Configuration
 *
 * This file is the single source of truth for all GitBook repositories.
 *
 * Every repository defined here will automatically participate in:
 *
 * - Repository synchronization
 * - Markdown synchronization
 * - Asset synchronization
 * - Sidebar generation
 * - Validation
 * - Deployment
 *
 * Adding a new application should only require adding one object below.
 */

const path = require("path");

const ROOT = process.cwd();

module.exports = {
  /**
   * Temporary directory used for cloning repositories.
   * This directory is recreated during every synchronization.
   */
  workspace: path.join(ROOT, ".sync"),

  /**
   * Destination for synchronized documentation.
   */
  docsRoot: path.join(ROOT, "docs"),

  /**
   * Destination for synchronized GitBook assets.
   */
  assetsRoot: path.join(ROOT, "static", "gitbook"),

  /**
   * GitBook repositories.
   */
  repositories: [
    {
      id: "homepage",

      name: "revenza-home",
      git: "https://github.com/revenza-techies/revenza-home.git",
      branch: "main",
      docsDestination: "homepage",
      summary: "SUMMARY.md",
      markdownRoot: ".",
      assets: ".gitbook/assets",
    },

    {
      id: "upsell",
      name: "revenza-upsell",
      git: "https://github.com/revenza-techies/revenza-upsell.git",
      branch: "main",
      docsDestination: "revenza-upsell",
      summary: "SUMMARY.md",
      markdownRoot: ".",
      assets: ".gitbook/assets",
    },

    /**
     * Future applications
     *
     * Uncomment and complete when available.
     */

    /*
    {
      id: "rv-vario",
      name: "rv-vario",
      git: "https://github.com/revenza-techies/rv-vario.git",
      branch: "main",
      docsDestination: "rv-vario",
      summary: "SUMMARY.md",
      markdownRoot: ".",
      assets: ".gitbook/assets",
    },
    */
  ],
};