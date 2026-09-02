"use client";

import { useStarfield } from "../hooks/use-starfield";

export function Starfield() {
  const canvasRef = useStarfield();

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <div className="absolute inset-0 nebula-glow" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
