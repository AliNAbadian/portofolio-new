import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { skillGroups } from "../lib/portfolio-data";

export function SkillsSection() {
  const t = useTranslations("Skills");
  const softSkills = t.raw("soft") as string[];

  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <div data-reveal>
        <SectionHeading>{t("heading")}</SectionHeading>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.key}
            className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm"
            data-reveal
          >
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
        ))}

        <div
          className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm"
          data-reveal
        >
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
      </div>
    </section>
  );
}
