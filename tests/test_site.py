import pathlib
import re
from html.parser import HTMLParser

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts, self.links = [], []
        self.stack = []
        self.steps, self.plant_cards, self.checkboxes = [], [], []
        self.faq_items = []
        self._in_step = 0
        self._in_card = 0
        self._cur_texts = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a["href"])
        cls = a.get("class", "") or ""
        id_ = a.get("id", "") or ""
        if tag == "li" and "step" in cls.split():
            self._in_step += 1
            self._cur_texts = []
        elif tag == "li" and "plant-card" in cls.split():
            self._in_card += 1
            self._cur_texts = []
        elif tag == "input" and a.get("type") == "checkbox":
            self.checkboxes.append(a.get("id"))
        elif tag == "details" and "faq-item" in cls.split():
            self.faq_items.append(id_)
        if self._in_step or self._in_card:
            if tag in ("h1", "h2", "h3", "p"):
                self._cur_texts.append("")

    def handle_data(self, data):
        if (self._in_step or self._in_card) and self._cur_texts:
            self._cur_texts[-1] += data

    def handle_endtag(self, tag):
        if self._in_step and tag == "li":
            self.steps.append(" ".join(t.strip() for t in self._cur_texts if t.strip()))
            self._in_step -= 1
            self._cur_texts = None
        if self._in_card and tag == "li":
            self.plant_cards.append(" ".join(t.strip() for t in self._cur_texts if t.strip()))
            self._in_card -= 1
            self._cur_texts = None
        if (self._in_step or self._in_card) and self._cur_texts and tag in ("h1", "h2", "h3", "p"):
            pass


def pages():
    return sorted(PUBLIC.rglob("*.html"))


def parse_index():
    c = Collector()
    c.feed((PUBLIC / "index.html").read_text())
    return c


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


def test_hero_shows_date_time_place():
    html = (PUBLIC / "index.html").read_text().lower()
    assert "saturday" in html
    assert "10:00" in html
    assert "community garden" in html
    assert "hero" in html


def test_exactly_three_steps():
    c = parse_index()
    assert len(c.steps) == 3, f"expected 3 steps, found {len(c.steps)}"
    for text in c.steps:
        assert text, "every step must have text content"


def test_exactly_eight_plant_cards():
    c = parse_index()
    assert len(c.plant_cards) == 8, f"expected 8 plant cards, found {len(c.plant_cards)}"
    for text in c.plant_cards:
        assert text, "every plant card must have a name/description"


def test_faq_has_details_accordion():
    c = parse_index()
    assert len(c.faq_items) >= 3, "expected several FAQ items"
    html = (PUBLIC / "index.html").read_text()
    assert "<summary>" in html


def test_checklist_has_stable_ids():
    c = parse_index()
    assert len(c.checkboxes) >= 5, "expected at least 5 checklist items"
    assert len(c.checkboxes) == len(set(c.checkboxes)), "checkbox ids must be unique/stable"
    assert all(cid for cid in c.checkboxes)


def test_no_remote_assets():
    c = parse_index()
    for src in c.scripts + c.links:
        assert src.startswith("/"), f"only local assets allowed, found {src}"


def test_app_js_no_network():
    js = (PUBLIC / "app.js").read_text()
    for banned in ("fetch(", "XMLHttpRequest", "websocket", "https://", "http://"):
        assert banned not in js.lower(), f"app.js must not reference {banned}"


def test_footer_has_poc_credit():
    c = parse_index()
    footer = (PUBLIC / "index.html").read_text()
    match = re.search(r"<footer[^>]*>([\s\S]*?)</footer>", footer)
    assert match, "index.html must have a footer element"
    assert "Built by the software factory POC" in match.group(1)
    assert "footer" in (PUBLIC / "styles.css").read_text(), "footer must be styled"


def test_no_credential_fields_or_submit_target():
    html = (PUBLIC / "index.html").read_text().lower()
    assert "password" not in html
    assert "action=" not in html
