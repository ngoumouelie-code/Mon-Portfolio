# Portfolio GitHub synchronise

Site statique en HTML, CSS et JavaScript vanilla. Le contenu vient de `data/user.json` et les projets peuvent etre synchronises automatiquement depuis l'API publique GitHub.

## Demarrage

1. Copie `data/user.example.json` vers `data/user.json`.
2. Remplis ton profil, tes liens, tes competences et `githubUsername`.
3. Sur GitHub, ajoute le topic `portfolio` aux depots que tu veux afficher.
4. Lance la synchronisation :

```bash
npm run sync
```

5. Lance un petit serveur local. C'est necessaire parce que le site charge les fichiers JSON avec `fetch()` :

```bash
npm run serve
```

## Configuration GitHub Pages

1. Pousse ce dossier dans un depot GitHub.
2. Va dans `Settings > Pages`.
3. Choisis la branche principale et le dossier racine.
4. Ajoute une variable de repository `SITE_URL` avec l'URL publique du site, par exemple `https://ton-compte.github.io/ton-repo`.

## Automatisation

Le workflow `.github/workflows/update-portfolio.yml` s'execute chaque nuit et peut aussi etre lance manuellement. Il :

- recupere tes depots GitHub ;
- filtre ceux qui ont le topic `portfolio` ;
- met a jour `data/projects.json` ;
- regenere `sitemap.xml` ;
- commit les changements si necessaire.

Tu peux changer le topic avec la variable d'environnement `PORTFOLIO_TOPIC`.

## Production

```bash
npm run build
```

Cette commande cree `css/main.min.css`, `js/main.min.js`, `js/github-sync.min.js` et `sitemap.xml`. Les fichiers non minifies restent utilises par defaut pour garder le projet simple a modifier.
