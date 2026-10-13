# TinyToolbox

Static website for `https://tools.appforge.top/`.

## Contact

`service@appforge.top`

## Structure

- `index.html` — homepage
- `tools/json-formatter/index.html` — JSON formatter, minifier and validator
- `about/index.html` — about page
- `contact/index.html` — contact page
- `privacy/index.html` — privacy policy
- `404.html` — not-found page
- `robots.txt` and `sitemap.xml` — crawler instructions and URL index
- `assets/style.css` — shared styles
- `favicon.svg` — site icon

## Cloudflare Pages

Connect this repository to Cloudflare Pages. Use the `main` production branch, Framework preset `None`, leave the build command empty, and set the build output directory to `.`. Once the `pages.dev` deployment has been tested, add `tools.appforge.top` under the project's **Custom domains** page. Do not change the existing `appforge.top` root-domain site or its unrelated DNS records.

## Privacy note

The JSON tool operates client-side and does not intentionally upload the entered JSON. The privacy policy should be revised if analytics, advertising, forms, or other third-party services are added.
