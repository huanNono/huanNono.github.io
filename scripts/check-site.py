#!/usr/bin/env python3
"""Check output links, navigation, search index, and deployment URLs."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "public").resolve()
expected = ["index.html", "about/index.html", "archives/index.html", "search/index.html", "categories/学习/index.html", "categories/生活/index.html", "index.json", "index.xml", "sitemap.xml", "404.html"]
errors = ["Missing: " + p for p in expected if not (root / p).is_file()]
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in ("href", "src") or not value:
                continue
            url = urlsplit(value)
            if url.scheme in ("mailto", "tel", "data", "javascript"):
                continue
            if url.netloc and url.netloc != "huannono.github.io":
                if "localhost" in url.netloc or "example.org" in url.netloc:
                    errors.append("Unexpected deployment URL: " + value)
                continue
            if not url.path:
                continue
            path = unquote(url.path)
            target = root / path.lstrip("/") if path.startswith("/") else current.parent / path
            if not target.is_file() and not (target / "index.html").is_file():
                errors.append(str(current.relative_to(root)) + " -> " + value)
for current in root.rglob("*.html"):
    Links().feed(current.read_text())
if (root / "index.json").is_file():
    entries = json.loads((root / "index.json").read_text())
    if not entries:
        errors.append("Search index is empty")
if errors:
    print("Site checks failed:\n" + "\n".join(errors))
    sys.exit(1)
print("Site checks passed: navigation, local links, assets, feeds, and search index.")
