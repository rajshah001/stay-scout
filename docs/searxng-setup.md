# SearXNG setup (free, reliable auto-discovery)

StayScout's 💎 Hidden-gem hunt can run fully automated via self-hosted SearXNG — no API keys, no billing.

## One-time setup (verified working)

```bash
# 1. Config dir with JSON format enabled (required for the API)
mkdir -p ~/stayscout-searxng
cat > ~/stayscout-searxng/settings.yml <<'YML'
use_default_settings: true
server:
  secret_key: "change-me-to-something-random"
  limiter: false        # local single-user use
search:
  formats:
    - html
    - json              # <-- required by StayScout's discover API
YML

# 2. Run (survives reboots)
docker run -d --name stayscout-searxng --restart unless-stopped \
  -p 8080:8080 -v ~/stayscout-searxng:/etc/searxng searxng/searxng:latest

# 3. Point StayScout at it (.env.local)
#    SEARXNG_BASE_URL=http://localhost:8080
```

Test: `curl "http://localhost:8080/search?q=test&format=json"` → JSON results.

## Notes
- **Aggregates** Google, Bing, DuckDuckGo, Brave, Mojeek etc. — better coverage than any single engine, and each upstream only sees occasional queries from you.
- `limiter: false` is fine for local single-user; keep it on if exposed publicly.
- Without SearXNG, auto-discovery falls back to keyless DuckDuckGo-lite/Mojeek scraping (flaky — per-IP throttles) and OSM Overpass (best-effort), so the 💎 manual hunt kit always works.
