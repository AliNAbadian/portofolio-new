"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function usePortfolioMotion() {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero entrance
        gsap.from("[data-hero-item]", {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });

        gsap.from("[data-hero-orbit]", {
          opacity: 0,
          scale: 0.85,
          duration: 1.6,
          ease: "power2.out",
        });

        // Slow orbiting accent dot
        gsap.to("[data-hero-orbit]", {
          rotation: 360,
          duration: 50,
          ease: "none",
          repeat: -1,
        });

        // Section reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 36,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          });
        });

        // Experience timeline line draws with scroll
        const line = scopeRef.current?.querySelector("[data-timeline-line]");
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
      });
    },
    { scope: scopeRef },
  );

  return scopeRef;
}
