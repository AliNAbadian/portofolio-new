import { rm } from "node:fs/promises";
import path from "node:path";

const apiDir = path.join(process.cwd(), "app", "api");

if (process.env.GITHUB_PAGES === "true") {
  await rm(apiDir, { recursive: true, force: true });
}
