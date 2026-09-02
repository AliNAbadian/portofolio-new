"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NavOptionWheel } from "./nav-option-wheel";

export function SiteNav() {
  const t = useTranslations("Nav");
  const tHero = useTranslations("Hero");
  const locale = useLocale();
  const otherLocale = locale === "fa" ? "en" : "fa";

  return (
    <>
      <header className="fixed start-4 top-4 z-50">
        <nav className="flex items-center gap-2 rounded-full border border-border bg-card/70 p-1.5 pe-3 backdrop-blur-md">
          <a
            href="#top"
            className="block shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30 transition-[box-shadow] hover:ring-primary/60"
            aria-label={tHero("name")}
          >
            <Image
              src="/profile.jpg"
              alt={tHero("name")}
              width={40}
              height={40}
              className="size-10 object-cover"
              priority
            />
          </a>
          <Link
            href="/"
            locale={otherLocale}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 text-sm text-foreground transition-colors duration-200 hover:bg-secondary/60"
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
