// Serverless proxy for the FastMoss OpenAPI (https://openapi.fastmoss.com).
//
// Keeps FASTMOSS_CLIENT_SECRET server-side — the static site (GitHub Pages)
// calls this instead of FastMoss directly, so the secret never reaches the
// browser. Deploy this on Vercel with FASTMOSS_CLIENT_SECRET set as an
// environment variable; the static index.html stays on GitHub Pages.
//
// Usage from the frontend: fetch(`${PROXY_BASE}/creator/v1/categoryInfo`, ...)
// forwards to https://openapi.fastmoss.com/creator/v1/categoryInfo

const UPSTREAM_BASE = 'https://openapi.fastmoss.com';
const ALLOWED_ORIGIN = 'https://majodelacruz-nusava.github.io';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const secret = process.env.FASTMOSS_CLIENT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'FASTMOSS_CLIENT_SECRET is not configured on this deployment.' });
    return;
  }

  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  if (segments.length === 0) {
    res.status(400).json({ error: 'Missing FastMoss endpoint path, e.g. /api/fastmoss/creator/v1/categoryInfo' });
    return;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    search.set(key, value);
  }
  const qs = search.toString();
  const upstreamUrl = `${UPSTREAM_BASE}/${segments.join('/')}${qs ? `?${qs}` : ''}`;

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body || {}),
    });

    const text = await upstreamRes.text();
    res.status(upstreamRes.status);
    res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach FastMoss API', detail: String(err) });
  }
};
