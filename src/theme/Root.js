import React, { useEffect } from "react";
import FreshchatCloseButton from "../components/FreshchatCloseButton";
import { openFreshchat } from "../utils/freshchat";

export default function Root({ children }) {
  useEffect(() => {
    function handleClick(event) {
      const link = event.target.closest("a.freshchat-trigger");

      if (!link) return;

      event.preventDefault();
      openFreshchat();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div id="contact">
      {children}
      <FreshchatCloseButton />
    </div>
  );
}
