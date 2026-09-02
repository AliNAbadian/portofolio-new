import { useTranslations } from "next-intl";
import { ArrowDown, MapPin } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[34rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20 max-md:size-80"
        data-hero-orbit
      >
        <span className="absolute -top-1.5 left-1/2 size-3 rounded-full bg-primary glow-accent" />
      </div>

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

      <h1
        className="mt-2 text-5xl font-bold tracking-tight text-glow md:text-7xl"
        data-hero-item
      >
        {t("name")}
      </h1>

      <p
        className="mt-4 text-2xl font-medium text-primary md:text-3xl"
        data-hero-item
      >
        {t("role")}
      </p>

      <p
        className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
        data-hero-item
      >
        {t("tagline")}
      </p>

      <div
        className="mt-10 flex flex-col gap-4 sm:flex-row"
        data-hero-item
      >
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
