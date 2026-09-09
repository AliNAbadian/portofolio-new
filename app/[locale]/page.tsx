import { setRequestLocale } from "next-intl/server";
import { AboutMeChatLauncher } from "@/features/about-me-chat";
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
      <AboutMeChatLauncher />
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
