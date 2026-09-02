import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { experienceRoleKeys } from "../lib/portfolio-data";

export function ExperienceSection() {
  const t = useTranslations("Experience");

  return (
    <section
      id="experience"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24"
    >
      <div data-reveal>
        <SectionHeading>{t("heading")}</SectionHeading>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute top-0 bottom-0 start-[7px] w-px origin-top bg-gradient-to-b from-primary/70 via-secondary/50 to-transparent"
          data-timeline-line
        />

        <ol className="flex flex-col gap-14">
          {experienceRoleKeys.map((roleKey) => {
            const highlights = t.raw(
              `roles.${roleKey}.highlights`,
            ) as string[];

            return (
              <li key={roleKey} className="relative ps-10" data-reveal>
                <span
                  aria-hidden
                  className="absolute start-0 top-1.5 size-[15px] rounded-full border-2 border-primary bg-background glow-accent"
                />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    {t(`roles.${roleKey}.title`)}
                  </h3>
                  <span className="text-lg font-medium text-primary">
                    {t(`roles.${roleKey}.company`)}
                  </span>
                </div>

                <p className="mt-1 text-sm tracking-wide text-muted-foreground">
                  {t(`roles.${roleKey}.period`)}
                </p>

                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {t(`roles.${roleKey}.summary`)}
                </p>

                <ul className="mt-4 flex flex-col gap-2.5">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative ps-5 text-sm leading-7 text-muted-foreground before:absolute before:start-0 before:top-2.5 before:size-1.5 before:rounded-full before:bg-secondary"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
