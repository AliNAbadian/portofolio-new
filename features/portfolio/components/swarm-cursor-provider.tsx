"use client";

import dynamic from "next/dynamic";

const SwarmCursor = dynamic(
  () => import("@/components/SwarmCursor").then((mod) => mod.default),
  { ssr: false },
);

export function SwarmCursorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SwarmCursor
        className=" pointer-events-none! fixed inset-0 z-50"
        color="#89d7b7"
        accentColor="#fff4e1"
        count={8}
        size={5}
        speed={5}
        spread={100}
        wander={0.25}
        trail={0.75}
        scatterOnClick
      />
      {children}
    </>
  );
}
