"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { navSectionIds, type NavSectionId } from "../lib/nav-section-ids";

gsap.registerPlugin(ScrollSmoother, useGSAP);

const NAV_OFFSET = "top 96px";

export function useNavOptionWheel() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const opensFromRight = locale === "fa";
  const hiddenXPercent = opensFromRight ? 100 : -100;
  const [isMounted, setIsMounted] = useState(false);
  const isClosingRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => navSectionIds.map((id) => t(id)),
    [t],
  );

  const scrollToSection = useCallback((id: NavSectionId) => {
    const href = `#${id}`;
    const smoother = ScrollSmoother.get();

    if (smoother) {
      smoother.scrollTo(href, true, NAV_OFFSET);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const close = useCallback(() => {
    if (!isMounted || isClosingRef.current) return;

    const backdrop = backdropRef.current;
    const content = contentRef.current;

    if (!backdrop || !content) {
      setIsMounted(false);
      return;
    }

    isClosingRef.current = true;

    gsap
      .timeline({
        onComplete: () => {
          setIsMounted(false);
          isClosingRef.current = false;
        },
      })
      .to(content, {
        xPercent: hiddenXPercent,
        opacity: 0,
        duration: 0.38,
        ease: "power2.in",
      })
      .to(
        backdrop,
        { opacity: 0, duration: 0.28, ease: "power2.in" },
        "-=0.18",
      );
  }, [hiddenXPercent, isMounted]);

  const open = useCallback(() => {
    if (isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  const handleSelect = useCallback(
    (index: number) => {
      const id = navSectionIds[index];
      if (!id) return;
      scrollToSection(id);
      close();
    },
    [close, scrollToSection],
  );

  useGSAP(
    () => {
      if (!isMounted) return;

      const backdrop = backdropRef.current;
      const content = contentRef.current;
      if (!backdrop || !content) return;

      gsap.set(backdrop, { opacity: 0 });
      gsap.set(content, { xPercent: hiddenXPercent, opacity: 0 });

      gsap
        .timeline()
        .to(backdrop, {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          content,
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.52,
            ease: "power3.out",
          },
          "-=0.12",
        );
    },
    { dependencies: [hiddenXPercent, isMounted], scope: overlayRef },
  );

  useEffect(() => {
    if (!isMounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, isMounted]);

  useEffect(() => {
    document.body.style.overflow = isMounted ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMounted]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setIsMobile(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const wheelConfig = useMemo(
    () => ({
      fontSize: isMobile ? 3.75 : 8,
      inset: isMobile ? 24 : 56,
      spacing: 1.35,
      tilt: isMobile ? 8 : 9,
    }),
    [isMobile],
  );

  return {
    isMounted,
    items,
    open,
    close,
    handleSelect,
    overlayRef,
    backdropRef,
    contentRef,
    opensFromRight,
    wheelSide: opensFromRight ? ("right" as const) : ("left" as const),
    wheelConfig,
    labels: {
      openMenu: t("openMenu"),
      closeMenu: t("closeMenu"),
      wheelLabel: t("wheelLabel"),
    },
  };
}
