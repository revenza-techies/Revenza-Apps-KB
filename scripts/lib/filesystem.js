const fs = require("fs");
const path = require("path");

function ensureDirectory(directory) {
  fs.mkdirSync(directory, {
    recursive: true,
  });
}

function removeDirectory(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }

  fs.rmSync(directory, {
    recursive: true,
    force: true,
  });
}

function copyDirectory(source, destination) {
  ensureDirectory(destination);

  const entries = fs.readdirSync(source, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

module.exports = {
  ensureDirectory,
  removeDirectory,
  copyDirectory,
};