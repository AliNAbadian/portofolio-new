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
    <PortfolioShell>
      <Starfield />
      <SiteNav />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </PortfolioShell>
  );
}
