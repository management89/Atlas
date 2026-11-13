"""Build the public website (site/index.html) from the shared app (stuco-hub.html).

stuco-hub.html is the single source for both versions:
  - published as-is, it is the claude.ai artifact;
  - wrapped by this script with Firebase, it is the website on Codeberg Pages.

Run from the repo root:  python3 tools/build_site.py
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://alexanderhuang.codeberg.page/Atlas/"
FIREBASE = "10.12.2"
TITLE = "Avenues Student Hub"
DESCRIPTION = ("Events, sign-ups, the weekly bulletin, opportunities and Student Council news "
               "for students at Avenues The World School.")

app = (ROOT / "stuco-hub.html").read_text(encoding="utf-8")
# The artifact sets its own title and a viewer hint; the website head below replaces both.
app = re.sub(r"<title>.*?</title>\s*", "", app, count=1)
app = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\s*', "", app, count=1)

def ver(name):
    """Short content hash, so browsers fetch a file again whenever it changes."""
    return hashlib.sha1((ROOT / "site" / name).read_bytes()).hexdigest()[:8]

head = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE}</title>
<meta name="description" content="{DESCRIPTION}">
<link rel="canonical" href="{SITE_URL}">
<meta property="og:type" content="website">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESCRIPTION}">
<meta property="og:url" content="{SITE_URL}">
<meta name="theme-color" content="#F4B400">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%23F4B400'/%3E%3Ctext x='32' y='44' font-family='Arial' font-weight='800' font-size='30' text-anchor='middle' fill='%2314202E'%3ESH%3C/text%3E%3C/svg%3E">
<style>:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0;font:14px system-ui,sans-serif}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
<script src="https://www.gstatic.com/firebasejs/{FIREBASE}/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FIREBASE}/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FIREBASE}/firebase-firestore-compat.js"></script>
<script src="firebase-config.js?v={ver('firebase-config.js')}"></script>
<script src="firebase-adapter.js?v={ver('firebase-adapter.js')}"></script>
</head>
<body>
<noscript><p style="padding:16px">Avenues Student Hub needs JavaScript. It lists events, sign-ups, the weekly bulletin, opportunities and Student Council news for Avenues The World School.</p></noscript>
"""

out = head + app.strip() + "\n</body>\n</html>\n"
(ROOT / "site" / "index.html").write_text(out, encoding="utf-8")
(ROOT / "site" / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}sitemap.xml\n", encoding="utf-8")
(ROOT / "site" / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f"  <url><loc>{SITE_URL}</loc></url>\n</urlset>\n", encoding="utf-8")
print("Built site/index.html", len(out), "bytes")
