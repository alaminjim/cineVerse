"use client";

import { useEffect } from "react";

export default function BrowserExtensionFix() {
  useEffect(() => {
    // Add CSS to hide browser extension attributes
    const style = document.createElement('style');
    style.textContent = `
      [bis_skin_checked] {
        visibility: visible !important;
      }
      [bis_skin_checked="1"] {
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);

    // Remove all bis_skin_checked attributes
    const removeAllBisAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked]');
      elements.forEach((el) => {
        el.removeAttribute('bis_skin_checked');
      });
    };

    // Run cleanup multiple times
    const cleanupTimes = [0, 100, 500, 1000, 2000];
    cleanupTimes.forEach(time => {
      setTimeout(removeAllBisAttributes, time);
    });

    // Set up continuous monitoring
    const observer = new MutationObserver(() => {
      removeAllBisAttributes();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked']
    });

    return () => {
      observer.disconnect();
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
}
