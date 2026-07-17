export function openFreshchat() {
  console.log("Contact Support clicked");

  if (
    typeof window !== "undefined" &&
    window.fcWidget &&
    typeof window.fcWidget.open === "function"
  ) {
    console.log("Freshchat found");
    window.fcWidget.open();
  } else {
    console.log("Freshchat NOT loaded");
  }
}