import {
  SiAnthropic,
  SiCursor,
  SiGo,
  SiGreensock,
  SiMaplibre,
  SiModelcontextprotocol,
  SiNextdotjs,
  SiNx,
  SiReact,
  SiReactquery,
  SiShadcnui,
  SiTypescript,
  SiVercel,
  SiWebgl,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { FsdIcon, GenUiIcon, MfeIcon } from "./skill-brand-icons";
import type { LogoItem } from "../model/logo-loop.types";

export const skillLogos: LogoItem[] = [
  {
    node: <SiReact />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiGo />,
    title: "Go",
    href: "https://go.dev",
  },
  {
    node: <FsdIcon />,
    title: "Feature-Sliced Design",
    href: "https://feature-sliced.design",
  },
  {
    node: <MfeIcon />,
    title: "Micro-frontends",
  },
  {
    node: <SiNx />,
    title: "Nx Monorepo",
    href: "https://nx.dev",
  },
  // {
  //   src: "/skills/rspack.svg",
  //   alt: "Rspack",
  //   title: "Rspack Module Federation",
  //   href: "https://rspack.dev",
  // },
  {
    node: <SiReactquery />,
    title: "TanStack Query",
    href: "https://tanstack.com/query",
  },
  // {
  //   src: "/skills/zustand.jpg",
  //   alt: "Zustand",
  //   title: "Zustand",
  //   href: "https://zustand.docs.pmnd.rs",
  // },
  {
    node: <SiMaplibre />,
    title: "MapLibre",
    href: "https://maplibre.org",
  },
  {
    node: <SiWebgl />,
    title: "WebGL",
    href: "https://www.khronos.org/webgl/",
  },
  {
    node: <SiGreensock />,
    title: "GSAP",
    href: "https://gsap.com",
  },
  {
    node: <SiShadcnui />,
    title: "Shadcn",
    href: "https://ui.shadcn.com",
  },
  {
    node: <GenUiIcon />,
    title: "Generative UI",
  },
  {
    node: <SiModelcontextprotocol />,
    title: "MCP Tools",
    href: "https://modelcontextprotocol.io",
  },
  {
    node: <SiCursor />,
    title: "Cursor",
    href: "https://cursor.com",
  },
  {
    node: <SiAnthropic />,
    title: "Claude",
    href: "https://anthropic.com",
  },
  {
    node: <SiVercel />,
    title: "Vercel AI SDK",
    href: "https://sdk.vercel.ai",
  },
  {
    node: <TbBrandOpenai />,
    title: "OpenAI",
    href: "https://openai.com",
  },
];
