export const contactLinks = {
  email: "nagshrizali@gmail.com",
  phone: "+98 914 649 2 649",
  phoneHref: "+989146492649",
  linkedin: "https://linkedin.com/in/alinagshriz",
  linkedinLabel: "linkedin.com/in/alinagshriz",
} as const;

export const sectionIds = [
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const experienceRoleKeys = [
  "bulut",
  "freelance",
  "primeproperty",
] as const;

export const projectItems = [
  {
    key: "routeManager",
    tags: ["MapLibre", "WebGL", "Zustand", "OSRM"],
  },
  {
    key: "goldPlatform",
    tags: ["WebSockets", "Realtime UI", "Next.js"],
  },
  {
    key: "salePlatform",
    tags: ["Nx", "Module Federation", "FSD"],
  },
  {
    key: "investisor",
    tags: ["Next.js", "SSR/SSG", "Server Actions", "CKEditor"],
  },
] as const;

export const skillGroups = [
  { key: "core", items: ["React", "Next.js", "TypeScript", "Go"] },
  {
    key: "architecture",
    items: ["FSD", "Micro-frontends", "Nx Monorepo", "Rspack Module Federation"],
  },
  { key: "state", items: ["TanStack Query", "Zustand"] },
  { key: "graphics", items: ["MapLibre", "WebGL", "GSAP", "Shadcn"] },
  {
    key: "ai",
    items: ["Generative UI", "MCP Tools", "Cursor / Claude", "Vercel AI SDK"],
  },
] as const;
