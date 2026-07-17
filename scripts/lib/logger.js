const divider = "=".repeat(60);

function header(title) {
  console.log("\n");
  console.log(divider);
  console.log(title);
  console.log(divider);
}

function section(title) {
  console.log(`\n▶ ${title}`);
}

function success(message) {
  console.log(`✓ ${message}`);
}

function warning(message) {
  console.log(`⚠ ${message}`);
}

function error(message) {
  console.error(`✖ ${message}`);
}

function info(message) {
  console.log(`• ${message}`);
}

module.exports = {
  header,
  section,
  success,
  warning,
  error,
  info,
};