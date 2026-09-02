"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  layer: number;
  twinklePhase: number;
  twinkleSpeed: number;
};

const LAYER_COUNT = 3;
const STARS_PER_10K_PX = 0.14;
// Deeper layers scroll slower for parallax depth
const LAYER_PARALLAX = [0.12, 0.28, 0.5];
const LAYER_ALPHA = [0.45, 0.7, 1];

function createStars(width: number, height: number): Star[] {
  const count = Math.round(((width * height) / 10_000) * STARS_PER_10K_PX);
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const layer = i % LAYER_COUNT;
    stars.push({
      x: Math.random() * width,
      // Extra vertical range so parallax never runs out of stars
      y: Math.random() * height * 2,
      radius: 0.4 + Math.random() * (0.6 + layer * 0.55),
      layer,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.4 + Math.random() * 1.2,
    });
  }

  return stars;
}

export function useStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
      if (reducedMotion) draw(0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;

      for (const star of stars) {
        const parallaxY =
          (star.y - scrollY * LAYER_PARALLAX[star.layer]) % (height * 2);
        const y = parallaxY < 0 ? parallaxY + height * 2 : parallaxY;
        if (y > height + 4) continue;

        const twinkle = reducedMotion
          ? 1
          : 0.65 + 0.35 * Math.sin(star.twinklePhase + time * 0.001 * star.twinkleSpeed);

        ctx.beginPath();
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 215, 183, ${LAYER_ALPHA[star.layer] * twinkle * 0.9})`;
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      draw(time);
      rafId = requestAnimationFrame(loop);
    };

    const drawStatic = () => draw(0);

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      drawStatic();
      window.addEventListener("scroll", drawStatic, { passive: true });
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", drawStatic);
    };
  }, []);

  return canvasRef;
}
