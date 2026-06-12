#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");

const root = process.cwd();

function minifyCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .trim();
}

function minifyJs(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\n)\s*\/\/.*(?=\n)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function writeMinified(input, output, minifier) {
  const source = await fs.readFile(path.join(root, input), "utf8");
  await fs.writeFile(path.join(root, output), `${minifier(source)}\n`);
  console.log(`Generated ${output}`);
}

async function main() {
  await writeMinified("css/main.css", "css/main.min.css", minifyCss);
  await writeMinified("js/github-sync.js", "js/github-sync.min.js", minifyJs);
  await writeMinified("js/main.js", "js/main.min.js", minifyJs);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
