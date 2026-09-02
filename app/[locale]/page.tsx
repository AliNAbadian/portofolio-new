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

export default function Home() {
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
