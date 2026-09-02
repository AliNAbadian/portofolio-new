import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { PortfolioCard } from "./portfolio-card";
import { SkillsLogoLoop } from "./skills-logo-loop";
import { skillGroups } from "../lib/portfolio-data";

export function SkillsSection() {
  const t = useTranslations("Skills");
  const softSkills = t.raw("soft") as string[];

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div data-reveal>
          <SectionHeading>{t("heading")}</SectionHeading>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.key} data-reveal>
              <PortfolioCard>
                <div className="p-5">
                  <h3 className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">
                    {t(`groups.${group.key}`)}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-secondary/50 bg-secondary/15 px-3 py-1 text-xs text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </PortfolioCard>
            </div>
          ))}

          <div data-reveal>
            <PortfolioCard>
              <div className="p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">
                  {t("groups.soft")}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {softSkills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-secondary/50 bg-secondary/15 px-3 py-1 text-xs text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </PortfolioCard>
          </div>
        </div>
      </div>

      <SkillsLogoLoop />
    </section>
  );
}
