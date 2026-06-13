#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const root = process.cwd();
  const siteUrl = process.env.SITE_URL || "https://ngoumouelie-code.github.io/Mon-Portfolio";
  const now = new Date().toISOString();
  const urls = ["/"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl.replace(/\/$/, "")}${url}</loc><lastmod>${now}</lastmod></url>`).join("\n")}
</urlset>
`;

  await fs.writeFile(path.join(root, "sitemap.xml"), xml);
  console.log("Generated sitemap.xml");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
