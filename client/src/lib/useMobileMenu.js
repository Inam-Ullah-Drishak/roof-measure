"use client";

import { useEffect, useRef } from "react";

// Shared behavior for mobile menus while they're open:
// - Escape closes it
// - the page behind doesn't scroll
// - focus moves into the menu, and back to the menu button when it closes
export function useMobileMenu(open, close) {
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first link after the opening animation has started
    const timer = setTimeout(() => panelRef.current?.querySelector("a, button")?.focus(), 50);
    const button = buttonRef.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      clearTimeout(timer);
      button?.focus();
    };
  }, [open, close]);

  return { buttonRef, panelRef };
}

// Stagger delay for list items so they slide in one after another
export const staggerDelay = (open, index) => ({
  transitionDelay: open ? `${80 + index * 40}ms` : "0ms",
});
