const { execSync } = require("child_process");

try {
  console.log("Synchronizing documentation...");
  execSync("node scripts/sync.js", { stdio: "inherit" });

  console.log("\nBuilding Docusaurus...");
  execSync("npx docusaurus build", { stdio: "inherit" });

  console.log("\nBuild completed successfully.");
} catch (error) {
  console.error("\nBuild failed.");
  process.exit(1);
}