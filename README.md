# Nusava Content Intelligence

TikTok Shop Content Intelligence prototype for Nusava.

## Local development

```bash
npm install
npm start
# Open http://localhost:3000
```

## Deployment

Deployed on GitHub Pages: https://majodelacruz-nusava.github.io/nusava-content-intel/

Auto-deploys on push to `main` (Settings → Pages → Deploy from branch: `main` / root).

## Live FastMoss data (optional)

The "Live Data" tab queries the real [FastMoss OpenAPI](https://developers.fastmoss.com/home.html) through the serverless proxy in `api/fastmoss/[...path].js`, which keeps your `client_secret` off this public page. GitHub Pages can't run that proxy (static only), so it deploys separately:

1. Get a `client_secret` at [developers.fastmoss.com](https://developers.fastmoss.com/home.html) → Console (a free trial gives initial test quota).
2. On [Vercel](https://vercel.com): New Project → Import this GitHub repo → Deploy.
3. In the Vercel project: Settings → Environment Variables → add `FASTMOSS_CLIENT_SECRET` → Redeploy.
4. Copy the deployment URL (e.g. `https://your-project.vercel.app`) and paste `<that>/api/fastmoss` into the Live Data tab's "Proxy connection" field on the GitHub Pages site.

The proxy only accepts requests from `https://majodelacruz-nusava.github.io` (CORS-restricted).
