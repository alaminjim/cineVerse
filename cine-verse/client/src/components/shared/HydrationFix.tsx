"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Remove browser extension attributes that cause hydration mismatches
    const removeBisAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked]');
      elements.forEach((el) => {
        el.removeAttribute('bis_skin_checked');
      });
    };

    // Run immediately and multiple times to catch dynamically added elements
    removeBisAttributes();
    setTimeout(removeBisAttributes, 100);
    setTimeout(removeBisAttributes, 500);
    setTimeout(removeBisAttributes, 1000);
    
    // Also observe for DOM changes with more aggressive checking
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.hasAttribute('bis_skin_checked')) {
              element.removeAttribute('bis_skin_checked');
            }
            // Check all child elements recursively
            const allElements = element.querySelectorAll('*');
            allElements.forEach((child) => {
              if (child.hasAttribute('bis_skin_checked')) {
                child.removeAttribute('bis_skin_checked');
              }
            });
          }
        });
        
        // Check if target itself has the attribute
        if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
          const target = mutation.target as Element;
          if (target.hasAttribute('bis_skin_checked')) {
            target.removeAttribute('bis_skin_checked');
          }
          // Check all children of target
          const targetChildren = target.querySelectorAll('*');
          targetChildren.forEach((child) => {
            if (child.hasAttribute('bis_skin_checked')) {
              child.removeAttribute('bis_skin_checked');
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked']
    });

    // Also run periodic cleanup with more frequent checks
    const interval = setInterval(removeBisAttributes, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
