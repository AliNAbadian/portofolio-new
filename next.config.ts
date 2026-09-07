import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  process.env.BASE_PATH ??
  (isGithubPages && repoName ? `/${repoName}` : "");

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : "standalone",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isGithubPages
    ? {
        basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);
