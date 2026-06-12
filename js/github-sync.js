window.PortfolioGithubSync = {
  async loadProjects(path) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) throw new Error(`Projects file returned ${response.status}`);
      const payload = await response.json();
      return Array.isArray(payload) ? payload : payload.projects || [];
    } catch (error) {
      console.warn(error);
      return [];
    }
  },

  async fetchPortfolioRepositories(username, topic = "portfolio") {
    if (!username) return [];

    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repositories = await response.json();
    return repositories
      .filter((repository) => !repository.fork)
      .filter((repository) => (repository.topics || []).includes(topic))
      .map(this.normalizeRepository);
  },

  normalizeRepository(repository) {
    return {
      id: repository.id,
      name: repository.name,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      url: repository.html_url,
      homepage: repository.homepage,
      topics: repository.topics || [],
      updatedAt: repository.updated_at
    };
  }
};
