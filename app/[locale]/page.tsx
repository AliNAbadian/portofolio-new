import { setRequestLocale } from "next-intl/server";
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  HeroSection,
  PortfolioShell,
  ProjectsSection,
  SiteNav,
  SkillsSection,
  Starfield,
} from "@/features/portfolio";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Starfield />
      <SiteNav />
      <PortfolioShell>
        <main>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </main>
      </PortfolioShell>
    </>
  );
}
