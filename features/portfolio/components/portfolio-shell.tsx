"use client";

import { usePortfolioMotion } from "../hooks/use-portfolio-motion";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const scopeRef = usePortfolioMotion();

  return <div ref={scopeRef}>{children}</div>;
}
