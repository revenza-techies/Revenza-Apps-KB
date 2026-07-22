import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import styles from "./styles.module.css";

const FRAME_CLOSE_WIDTH = 40;
const FRAME_CLOSE_RIGHT = 20;

export default function FreshchatCloseButton() {
  const [position, setPosition] = useState({ visible: false, top: 0, left: 0 });

  useEffect(() => {
    let boundWidget;
    let bindTimer;

    const setHidden = () => {
      setPosition((current) =>
        current.visible ? { ...current, visible: false } : current
      );
    };

    const syncPosition = () => {
      const frame = document.getElementById("fc_frame");
      const isOpen = frame?.classList.contains("fc-open");

      if (!frame || !isOpen) {
        setHidden();
        return;
      }

      const rect = frame.getBoundingClientRect();
      const next = {
        visible: true,
        top: Math.max(8, Math.round(rect.top)),
        left: Math.max(8, Math.round(rect.right - FRAME_CLOSE_RIGHT - FRAME_CLOSE_WIDTH)),
      };

      setPosition((current) =>
        current.visible === next.visible &&
        current.top === next.top &&
        current.left === next.left
          ? current
          : next
      );
    };

    const handleOpened = () => {
      window.requestAnimationFrame(syncPosition);
      window.setTimeout(syncPosition, 350);
    };

    const bindWidgetEvents = () => {
      const widget = window.fcWidget;
      if (!widget || widget === boundWidget || typeof widget.on !== "function") return false;

      boundWidget = widget;
      widget.on("widget:opened", handleOpened);
      widget.on("widget:closed", setHidden);
      syncPosition();
      return true;
    };

    const observer = new MutationObserver(() => {
      bindWidgetEvents();
      syncPosition();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", syncPosition);
    bindTimer = window.setInterval(() => {
      if (bindWidgetEvents()) window.clearInterval(bindTimer);
    }, 500);
    bindWidgetEvents();
    syncPosition();

    return () => {
      observer.disconnect();
      window.clearInterval(bindTimer);
      window.removeEventListener("resize", syncPosition);
      if (boundWidget && typeof boundWidget.off === "function") {
        boundWidget.off("widget:opened", handleOpened);
        boundWidget.off("widget:closed", setHidden);
      }
    };
  }, []);

  if (!position.visible || typeof document === "undefined") return null;

  const closeWidget = () => {
    setPosition((current) => ({ ...current, visible: false }));
    window.fcWidget?.close?.();
  };

  return createPortal(
    <button
      type="button"
      className={styles.closeButton}
      style={{ top: position.top, left: position.left }}
      onClick={closeWidget}
      aria-label="Close support chat"
      title="Close support chat"
    >
      <X size={16} weight="bold" aria-hidden="true" />
    </button>,
    document.body
  );
}
