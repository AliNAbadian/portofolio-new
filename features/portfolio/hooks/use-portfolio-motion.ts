"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const NAV_OFFSET = "top 96px";

export function usePortfolioMotion() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;

      if (!wrapper || !content) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
          // normalizeScroll locks position:fixed overlays (e.g. SwarmCursor) during smooth catch-up
          normalizeScroll: false,
        });

        const handleAnchorClick = (event: MouseEvent) => {
          const anchor = (event.target as HTMLElement | null)?.closest(
            "a[href^='#']",
          ) as HTMLAnchorElement | null;

          if (!anchor) {
            return;
          }

          const href = anchor.getAttribute("href");

          if (!href || href === "#" || !content.querySelector(href)) {
            return;
          }

          event.preventDefault();
          smoother.scrollTo(href, true, NAV_OFFSET);
        };

        document.addEventListener("click", handleAnchorClick);

        gsap.from("[data-hero-item]", {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });

        gsap.from("[data-hero-shards]", {
          opacity: 0,
          duration: 1.8,
          ease: "power2.out",
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 48,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 55%",
              scrub: 0.8,
            },
          });
        });

        const line = content.querySelector("[data-timeline-line]");

        if (line) {
          gsap.from(line, {
            scaleY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#experience",
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          });
        }

        return () => {
          document.removeEventListener("click", handleAnchorClick);
          smoother.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-item], [data-hero-shards], [data-reveal]", {
          clearProps: "all",
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  return { wrapperRef, contentRef };
}
