import { useTranslations } from "next-intl";
import { Mail, Phone } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { PortfolioCard } from "./portfolio-card";
import { contactLinks } from "../lib/portfolio-data";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function ContactSection() {
  const t = useTranslations("Contact");

  const channels = [
    {
      key: "email",
      icon: Mail,
      label: t("email"),
      value: contactLinks.email,
      href: `mailto:${contactLinks.email}`,
    },
    {
      key: "phone",
      icon: Phone,
      label: t("phone"),
      value: contactLinks.phone,
      href: `tel:${contactLinks.phoneHref}`,
    },
    {
      key: "linkedin",
      icon: LinkedinIcon,
      label: t("linkedin"),
      value: contactLinks.linkedinLabel,
      href: contactLinks.linkedin,
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <div data-reveal>
        <SectionHeading>{t("heading")}</SectionHeading>
        <p className="-mt-6 mb-10 text-base text-muted-foreground">
          {t("subheading")}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        {channels.map((channel) => (
          <div key={channel.key} data-reveal>
            <PortfolioCard>
              <a
                href={channel.href}
                target={channel.key === "linkedin" ? "_blank" : undefined}
                rel={
                  channel.key === "linkedin" ? "noopener noreferrer" : undefined
                }
                className="block cursor-pointer p-6 transition-colors duration-200 hover:text-primary"
              >
                <channel.icon className="size-5 text-primary" aria-hidden />
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {channel.label}
                </p>
                <p
                  dir="ltr"
                  className="mt-1 truncate text-sm text-muted-foreground"
                >
                  {channel.value}
                </p>
              </a>
            </PortfolioCard>
          </div>
        ))}
      </div>

      <footer className="mt-24 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>
    </section>
  );
}
