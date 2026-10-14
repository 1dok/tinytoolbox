# TinyToolbox

Static multilingual website for `https://tools.appforge.top/`.

## Languages and layout

- English: `/`
- Simplified Chinese: `/zh-cn/`
- Japanese: `/ja/`
- Shared responsive styles: `assets/style.css`
- Privacy-preserving, anonymous client ID statistics: `assets/analytics.js`

The typography has been tightened across all languages: smaller hero headings, more compact section spacing, and consistent card and content heading sizes.

## Visitor statistics setup (required before numbers appear)

The website uses Cloudflare Pages Functions backed by Cloudflare D1. The homepage displays today's and all-time PV (page views) and UV (unique browser IDs). The reporting day uses China Standard Time (`Asia/Shanghai`).

1. In Cloudflare Dashboard, open **Workers & Pages** and select the Pages project connected to this repository.
2. Create a D1 database from **Storage & databases → D1 SQL database**. Give it a name such as `tinytoolbox-stats`.
3. Open the database's **Console** and execute all SQL in `schema.sql`.
4. Open the Pages project **Settings → Bindings** (or **Functions → D1 database bindings**, depending on dashboard UI), add a D1 binding with variable name exactly `STATS_DB`, and select the database you created.
5. Save the binding and trigger a new production deployment. Pages Functions require the `functions/` directory at the project root; do not set a build command, and keep the static output directory as `.`.
6. After deployment, open `https://tools.appforge.top/api/stats`. When the binding and schema are ready, it should return JSON with `ok: true` and four counts.
7. Open the homepage and check the statistics at the bottom. The first page load after setup should begin recording. Historical counts start at zero from the date you enable this counter; Cloudflare's earlier traffic is not retroactively imported.

### Counting and privacy notes

- PV counts each successful visit-recording request, including refreshes and visits to any HTML page.
- UV is an approximate unique browser count based on a random ID stored in that browser's local storage. Clearing browser storage, using another browser/device, or blocking local storage can affect UV accuracy.
- No IP address or user-agent is intentionally stored by this implementation.
- Daily counts use `Asia/Shanghai` time.
- If D1 is not bound or the schema has not been applied, the stats API will not return counts; the site itself remains usable.
- Update the privacy policy to disclose this anonymous analytics storage before enabling the feature in production.

## Cloudflare Pages

Use the `main` production branch, Framework preset `None`, no build command, and output directory `.`. Preserve the existing custom domain `tools.appforge.top` and unrelated DNS records.

## Contact

`service@appforge.top`
