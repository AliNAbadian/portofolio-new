"use client";

import { usePortfolioMotion } from "../hooks/use-portfolio-motion";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const { wrapperRef, contentRef } = usePortfolioMotion();

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
