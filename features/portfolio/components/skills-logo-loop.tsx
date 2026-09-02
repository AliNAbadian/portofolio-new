"use client";

import { useTranslations } from "next-intl";
import { LogoLoop } from "./logo-loop";
import { skillLogos } from "../lib/skill-logo-items";

export function SkillsLogoLoop() {
  const t = useTranslations("Skills");

  return (
    <div className="mt-24 w-full" data-reveal dir="ltr">
      <LogoLoop
        logos={skillLogos}
        speed={120}
        direction="left"
        width="100%"
        logoHeight={100}
        gap={48}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#0d1a16"
        ariaLabel={t("logoLoopLabel")}
        className="h-fit w-full"
      />
    </div>
  );
}
