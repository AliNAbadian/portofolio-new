"use client";

import type { ReactNode } from "react";
import { BorderGlow, type BorderGlowProps } from "./border-glow";

const PORTFOLIO_CARD_THEME = {
  backgroundColor: "#1A312C",
  glowColor: "158 47 69",
  colors: ["#428475", "#89D7B7", "#FFF4E1"],
  borderRadius: 16,
  glowRadius: 28,
  edgeSensitivity: 28,
  glowIntensity: 0.95,
  coneSpread: 22,
  fillOpacity: 0.38,
} as const satisfies Partial<BorderGlowProps>;

type PortfolioCardProps = {
  children: ReactNode;
  className?: string;
  animated?: boolean;
};

export function PortfolioCard({
  children,
  className = "",
  animated = false,
}: PortfolioCardProps) {
  return (
    <BorderGlow
      {...PORTFOLIO_CARD_THEME}
      animated={animated}
      className={`h-full backdrop-blur-sm ${className}`.trim()}
    >
      {children}
    </BorderGlow>
  );
}
