import { useTranslations } from "next-intl";
import { ArrowDown, MapPin } from "lucide-react";
import { HeroBackground } from "./hero-background";
import MorphText from "@/components/ui/morph-text";

export function HeroSection() {
  const t = useTranslations("Hero");
  const morphWords = t.raw("morphWords") as string[];

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <HeroBackground />

      <p
        className="mb-4 flex items-center gap-2 text-sm tracking-widest text-primary uppercase"
        data-hero-item
      >
        <MapPin className="size-4" aria-hidden />
        {t("location")}
      </p>

      <p className="text-lg text-muted-foreground" data-hero-item>
        {t("greeting")}
      </p>

      <h1 className="mt-2" data-hero-item>
        <MorphText
          words={morphWords}
          interval={3200}
          textClassName="text-4xl font-bold  text-glow sm:text-5xl md:text-6xl lg:text-7xl"
        />
      </h1>

      <p
        className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
        data-hero-item
      >
        {t("tagline")}
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row" data-hero-item>
        <a
          href="#projects"
          className="cursor-pointer rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 glow-accent"
        >
          {t("ctaProjects")}
        </a>
        <a
          href="#contact"
          className="cursor-pointer rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
        >
          {t("ctaContact")}
        </a>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 flex cursor-pointer flex-col items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary"
        data-hero-item
      >
        {t("scroll")}
        <ArrowDown className="size-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
