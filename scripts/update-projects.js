#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");

const root = process.cwd();
const userFile = path.join(root, "data", "user.json");
const outputFile = path.join(root, "data", "projects.json");

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function normalize(repository) {
  return {
    id: repository.id,
    name: repository.name,
    description: repository.description,
    language: repository.language,
    stars: repository.stargazers_count,
    url: repository.html_url,
    homepage: repository.homepage || "",
    topics: repository.topics || [],
    updatedAt: repository.updated_at
  };
}

async function fetchRepositories(username, token) {
  const repositories = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${await response.text()}`);
    }

    const batch = await response.json();
    repositories.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repositories;
}

async function main() {
  const config = await readJson(userFile);
  const username = process.env.GITHUB_USERNAME || config.githubUsername;
  const topic = process.env.PORTFOLIO_TOPIC || config.portfolioTopic || "portfolio";
  const includeForks = process.env.INCLUDE_FORKS === "true";

  if (!username) {
    throw new Error("Ajoute githubUsername dans data/user.json ou definis GITHUB_USERNAME.");
  }

  const repositories = await fetchRepositories(username, process.env.GITHUB_TOKEN);
  const projects = repositories
    .filter((repository) => includeForks || !repository.fork)
    .filter((repository) => (repository.topics || []).includes(topic))
    .map(normalize);

  await fs.writeFile(outputFile, `${JSON.stringify({ generatedAt: new Date().toISOString(), topic, projects }, null, 2)}\n`);
  console.log(`Updated ${projects.length} project(s) in ${path.relative(root, outputFile)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
