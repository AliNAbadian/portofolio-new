import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { projectItems } from "../lib/portfolio-data";

export function ProjectsSection() {
  const t = useTranslations("Projects");

  return (
    <section
      id="projects"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24"
    >
      <div data-reveal>
        <SectionHeading>{t("heading")}</SectionHeading>
        <p className="-mt-6 mb-10 text-base text-muted-foreground">
          {t("subheading")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projectItems.map((project) => (
          <article
            key={project.key}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/60"
            data-reveal
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -end-16 size-40 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />

            <h3 className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
              {t(`items.${project.key}.name`)}
            </h3>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t(`items.${project.key}.description`)}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-secondary/50 bg-secondary/15 px-3 py-1 text-xs text-primary"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
