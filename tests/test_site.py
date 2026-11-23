import pathlib
from html.parser import HTMLParser

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts, self.links = [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a["href"])


def pages():
    return sorted(PUBLIC.rglob("*.html"))


def test_has_index():
    assert (PUBLIC / "index.html").exists()


def test_every_page_has_banner():
    for page in pages():
        c = Collector()
        c.feed(page.read_text())
        assert "/sf-banner.js" in c.scripts, f"{page.name} is missing the POC banner"
        assert "/sf-config.js" in c.scripts, f"{page.name} is missing sf-config.js"


def test_local_links_resolve():
    for page in pages():
        c = Collector()
        c.feed(page.read_text())
        for href in c.links:
            if href.startswith("/") and not href.startswith("//") and href not in ("/",):
                target = PUBLIC / href.lstrip("/").split("#")[0].split("?")[0]
                assert target.exists() or (target / "index.html").exists(), f"{page.name}: broken link {href}"
