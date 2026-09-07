import { writeFileSync } from "node:fs";
import { join } from "node:path";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath =
  process.env.BASE_PATH ?? (repoName ? `/${repoName}` : "");
const target = `${basePath}/en/`;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <link rel="canonical" href="${target}" />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="${target}">${target}</a>…</p>
  </body>
</html>
`;

writeFileSync(join(process.cwd(), "out", "index.html"), html);
console.log(`Wrote out/index.html → ${target}`);
