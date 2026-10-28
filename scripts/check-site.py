#!/usr/bin/env python3
"""Check output links, navigation, search index, and deployment URLs."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "public").resolve()
expected = ["index.html", "posts/index.html", "projects/index.html", "share/index.html", "links/index.html", "works/index.html", "about/index.html", "archives/index.html", "search/index.html", "categories/学习/index.html", "categories/生活/index.html", "index.json", "index.xml", "sitemap.xml", "404.html"]
errors = ["Missing: " + p for p in expected if not (root / p).is_file()]
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reader = False
        self.reader_script = False
        self.ids = set()
        self.fragments = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.reader |= "data-reader-root" in attributes
        self.reader_script |= tag == "script" and "/js/reader.min." in attributes.get("src", "")
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        href = attributes.get("href", "")
        if href.startswith("#") and len(href) > 1:
            self.fragments.append(unquote(href[1:]))
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
    page = Links()
    page.feed(current.read_text())
    if page.reader:
        if not page.reader_script:
            errors.append(str(current.relative_to(root)) + ": missing reading interactions script")
        for fragment in page.fragments:
            if fragment not in page.ids:
                errors.append(str(current.relative_to(root)) + ": missing heading target #" + fragment)
if (root / "index.json").is_file():
    entries = json.loads((root / "index.json").read_text())
    if not entries:
        errors.append("Search index is empty")
if errors:
    print("Site checks failed:\n" + "\n".join(errors))
    sys.exit(1)
print("Site checks passed: navigation, local links, assets, feeds, search index, and article interactions.")
