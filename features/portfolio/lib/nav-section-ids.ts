import { sectionIds } from "./portfolio-data";

export const navSectionIds = ["top", ...sectionIds] as const;

export type NavSectionId = (typeof navSectionIds)[number];
