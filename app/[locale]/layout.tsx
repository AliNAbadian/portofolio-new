import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SwarmCursorProvider } from "@/features/portfolio/components/swarm-cursor-provider";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const rokh = localFont({
  src: "../../public/RokhVFGX.ttf",
  variable: "--font-rokh",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const direction = locale === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${spaceGrotesk.variable} ${rokh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <SwarmCursorProvider>{children}</SwarmCursorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
