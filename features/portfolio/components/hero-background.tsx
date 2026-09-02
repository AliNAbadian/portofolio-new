"use client";

import { AeroShards } from "./aero-shards";

export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 overflow-hidden"
      data-hero-shards
      data-speed="clamp(0.85)"
    >
      <AeroShards
        backgroundColor="#0D1A16"
        shardColor="#428475"
        accentColor="#89D7B7"
        placement="full"
        flow="stream"
        material="pearl"
        detail="balanced"
        effect="none"
        scale={1}
        spread={1}
        depth={1}
        speed={0.85}
        spin={0.9}
        interaction="repel"
        density={1.4}
        shardSize={1.1}
        stretch={1}
        turbulence={0.9}
        glow={1.1}
        edgeSoftness={2}
        bloom={0.55}
        grain={0.04}
        chromaticAberration={0.006}
        transitionDuration={1}
        interactionRadius={1.5}
        interactionStrength={0.45}
        rippleIntensity={1}
        holdToGather
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/15 via-background/35 to-background" />
      <div className="pointer-events-none absolute inset-0 nebula-glow opacity-50" />
    </div>
  );
}
