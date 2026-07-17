const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const config = require("./sync-config");

async function ensureWorkspace() {
  if (fs.existsSync(config.workspace)) {
    fs.rmSync(config.workspace, {
      recursive: true,
      force: true,
    });
  }

  fs.mkdirSync(config.workspace, {
    recursive: true,
  });
}

async function cloneRepository(repo) {
  const destination = path.join(config.workspace, repo.name);

  console.log(`\n📦 ${repo.name}`);

  const git = simpleGit();

  await git.clone(
    repo.git,
    destination,
    [
      "--branch",
      repo.branch,
      "--single-branch",
    ]
  );

  console.log("✓ cloned");
}

async function synchronizeRepositories() {
  console.log("\n=================================");
  console.log("Revenza Synchronization");
  console.log("=================================\n");

  await ensureWorkspace();

  for (const repository of config.repositories) {
    await cloneRepository(repository);
  }

  console.log("\nSynchronization completed.\n");
}

synchronizeRepositories().catch((error) => {
  console.error(error);
  process.exit(1);
});