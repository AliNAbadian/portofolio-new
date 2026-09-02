import { Boxes, Layers, Sparkles } from "lucide-react";

const iconClassName = "h-[1em] w-[1em] stroke-[1.75]";

export function FsdIcon() {
  return <Layers className={iconClassName} aria-hidden />;
}

export function MfeIcon() {
  return <Boxes className={iconClassName} aria-hidden />;
}

export function GenUiIcon() {
  return <Sparkles className={iconClassName} aria-hidden />;
}
