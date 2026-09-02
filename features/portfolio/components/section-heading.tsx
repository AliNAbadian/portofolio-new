export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-10 flex items-center gap-4 text-3xl font-bold tracking-tight md:text-4xl">
      <span aria-hidden className="h-px w-10 bg-primary/60" />
      <span className="text-glow">{children}</span>
    </h2>
  );
}
