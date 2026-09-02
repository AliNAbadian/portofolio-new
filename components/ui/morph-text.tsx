"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface MorphTextProps {
  words?: string[];
  interval?: number;
  subtext?: string;
  fontSize?: string;
  fontFamily?: string;
  className?: string;
  textClassName?: string;
  subtextClassName?: string;
}

export function MorphText({
  words = ["CREATE", "DESIGN", "DEVELOP"],
  interval = 3000,
  subtext,
  fontSize,
  fontFamily = "var(--font-sans)",
  className,
  textClassName,
  subtextClassName,
}: MorphTextProps) {
  const uid = useId().replace(/:/g, "");

  const totalDuration = (interval / 1000) * words.length;
  const wordDuration = interval / 1000;
  const rotatorMinWidth = `${Math.max(...words.map((word) => word.length), 14) + 2}ch`;

  const wordStyles = words.map((_, i) => ({
    animationDelay: `${i * wordDuration}s`,
    animationDuration: `${totalDuration}s`,
  }));

  return (
    <div className={cn("morph-text-root relative flex flex-col items-center", className)}>
      <div
        className={cn(
          "morph-text-container relative isolate select-none antialiased",
          textClassName,
        )}
        style={{
          ...(fontSize ? { fontSize } : {}),
          fontWeight: 700,
          fontFamily,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        <div
          className="morph-word-rotator relative flex items-center justify-center"
          style={{ height: "1.2em", minWidth: rotatorMinWidth }}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="morph-word absolute backface-hidden"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate3d(-50%, -50%, 0)",
                opacity: 0,
                whiteSpace: "nowrap",
                animationName: `morph-word-rotate-${uid}`,
                animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                animationIterationCount: "infinite",
                animationFillMode: "both",
                willChange: "opacity, transform",
                ...wordStyles[i],
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-8 uppercase tracking-[0.2em] text-[#888] antialiased",
            subtextClassName,
          )}
          style={{
            fontSize: "1.2rem",
            opacity: 0,
            animation: "morph-fade-up 1s ease-out 1s forwards",
            fontFamily,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {subtext}
        </p>
      )}

      <style>{`
        @keyframes morph-word-rotate-${uid} {
          0%, 100% {
            opacity: 0;
            transform: translate3d(-50%, calc(-50% + 0.35em), 0) scale(0.985);
          }
          6% {
            opacity: 0.4;
            transform: translate3d(-50%, calc(-50% + 0.12em), 0) scale(0.995);
          }
          12%, 38% {
            opacity: 1;
            transform: translate3d(-50%, -50%, 0) scale(1);
          }
          44% {
            opacity: 0.4;
            transform: translate3d(-50%, calc(-50% - 0.12em), 0) scale(1.005);
          }
          50% {
            opacity: 0;
            transform: translate3d(-50%, calc(-50% - 0.35em), 0) scale(1.01);
          }
        }

        @keyframes morph-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MorphText;
