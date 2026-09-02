import { useTranslations } from "next-intl";
import { GraduationCap, Languages } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { PortfolioCard } from "./portfolio-card";

export function AboutSection() {
  const t = useTranslations("About");

  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <div data-reveal>
        <SectionHeading>{t("heading")}</SectionHeading>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <p
          className="text-lg leading-9 text-muted-foreground"
          data-reveal
        >
          {t("body")}
        </p>

        <div className="flex flex-col gap-6">
          <div data-reveal>
            <PortfolioCard>
              <div className="p-5">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                  <GraduationCap className="size-4" aria-hidden />
                  {t("education")}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("educationDetail")}
                </p>
              </div>
            </PortfolioCard>
          </div>
          <div data-reveal>
            <PortfolioCard>
              <div className="p-5">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Languages className="size-4" aria-hidden />
                  {t("languages")}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("languagesDetail")}
                </p>
              </div>
            </PortfolioCard>
          </div>
        </div>
      </div>
    </section>
  );
}
