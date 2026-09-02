"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { sectionIds } from "../lib/portfolio-data";
import { NavOptionWheel } from "./nav-option-wheel";

export function SiteNav() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const otherLocale = locale === "fa" ? "en" : "fa";

  return (
    <>
      <header className="fixed top-4 inset-x-4 z-50 flex justify-center">
        <nav className="flex items-center gap-1 rounded-full border border-border bg-card/70 px-3 py-2 backdrop-blur-md">
          <a
            href="#top"
            className="px-3 py-1 text-sm font-semibold text-primary transition-colors hover:text-foreground"
          >
            {"<A/>"}
          </a>
          <div className="flex items-center lg:hidden">
            {sectionIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary/30 hover:text-foreground"
              >
                {t(id)}
              </a>
            ))}
          </div>
          <Link
            href="/"
            locale={otherLocale}
            className="ms-1 flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 text-sm text-foreground transition-colors duration-200 hover:bg-secondary/60"
          >
            <Languages className="size-3.5" aria-hidden />
            {t("switchLocale")}
          </Link>
        </nav>
      </header>
      <NavOptionWheel />
    </>
  );
}
