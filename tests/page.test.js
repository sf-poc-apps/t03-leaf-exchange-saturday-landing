// Unit tests for public/app.js behaviour, run with: node tests/page.test.js
// Uses a minimal DOM shim so no framework or network access is needed.
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");

function makeElement(tag, attrs = {}) {
  return {
    tag,
    attrs,
    type: attrs.type,
    id: attrs.id,
    listeners: {},
    checked: attrs.checked || false,
    addEventListener(type, fn) {
      (this.listeners[type] = this.listeners[type] || []).push(fn);
    },
    dispatch(type) {
      (this.listeners[type] || []).forEach((fn) => fn({ target: this }));
    },
  };
}

let shimWindow, shimDocument, store;

// Run the app script against the shims and fire its DOMContentLoaded wiring.
function runApp() {
  store = store || {};
  shimWindow = {
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
  };
  const boxes = [];
  for (let i = 1; i <= 3; i++) {
    boxes.push(makeElement("input", { type: "checkbox", id: `bring-${i}` }));
  }
  const resetBtn = makeElement("button", { id: "reset-checklist" });
  const form = makeElement("form", { id: "checklist" });
  form.querySelectorAll = (sel) => (sel === 'input[type="checkbox"]' ? boxes : []);
  const byId = { checklist: form, "reset-checklist": resetBtn };
  const domListeners = [];
  shimDocument = {
    getElementById: (id) => byId[id] || null,
    addEventListener: (type, fn) => domListeners.push({ type, fn }),
  };
  const code = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  // Load the app under test via require-style module evaluation on a shim context.
  const moduleDir = path.join(__dirname, "shims");
  fs.mkdirSync(moduleDir, { recursive: true });
  const modulePath = path.join(moduleDir, "app-under-test.cjs");
  fs.writeFileSync(modulePath, `module.exports = (window, document) => {\n${code}\n};`);
  require(modulePath)(shimWindow, shimDocument);
  domListeners.filter((l) => l.type === "DOMContentLoaded").forEach((l) => l.fn());
  return { boxes, resetBtn };
}

// --- Checklist persistence ---

store = {}; // fresh browser
{
  const { boxes } = runApp();
  assert.strictEqual(boxes[0].checked, false, "checkbox starts unticked with empty storage");
  boxes[0].checked = true;
  boxes[0].dispatch("change");
  assert.strictEqual(
    JSON.parse(store["leaf-exchange-bring"])["bring-1"], true,
    "ticking an item writes true to localStorage"
  );
}

{
  const { boxes } = runApp();
  assert.strictEqual(
    boxes[0].checked, true,
    "stored true is applied to the checkbox on init"
  );
  assert.strictEqual(boxes[1].checked, false, "unstored items stay unticked");
}

{
  const { boxes } = runApp();
  boxes[0].checked = false;
  boxes[0].dispatch("change");
  assert.strictEqual(
    JSON.parse(store["leaf-exchange-bring"])["bring-1"], false,
    "unticking an item writes false to localStorage"
  );
}

{
  const { boxes } = runApp();
  assert.strictEqual(boxes[0].checked, false, "stored false keeps the checkbox unticked on init");
}

{
  const { boxes, resetBtn } = runApp();
  boxes[0].checked = true;
  boxes[0].dispatch("change");
  boxes[1].checked = true;
  boxes[1].dispatch("change");
  resetBtn.dispatch("click");
  assert.ok(boxes.every((b) => !b.checked), "reset unticks every checkbox");
  assert.deepStrictEqual(JSON.parse(store["leaf-exchange-bring"]), {}, "reset clears storage");
}

// --- Structural assertions ---

{
  const html = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  const stepCount = (html.match(/class="step"/g) || []).length;
  assert.strictEqual(stepCount, 3, "exactly 3 steps render");
  const cardCount = (html.match(/class="plant-card"/g) || []).length;
  assert.strictEqual(cardCount, 8, "exactly 8 plant cards render");
  const faqCount = (html.match(/<details class="faq-item">/g) || []).length;
  assert.ok(faqCount >= 3, "several FAQ items exist");
  assert.ok(html.includes("/sf-banner.js"), "POC banner script is referenced");
  assert.ok(html.includes("/sf-config.js"), "sf-config script is referenced");
  const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/);
  assert.ok(footerMatch, "page has a footer element");
  assert.ok(
    footerMatch[1].includes("Built by the software factory POC"),
    "footer contains the POC credit line"
  );
}

// --- FAQ toggle (details/summary semantics verified structurally) ---

{
  const html = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  assert.ok(/<details class="faq-item">[\s\S]*?<summary>/.test(html), "FAQ uses details/summary");
  assert.strictEqual(
    (html.match(/<summary>/g) || []).length,
    (html.match(/<details class="faq-item">/g) || []).length,
    "every FAQ item has one summary"
  );
}

console.log("All JS tests passed.");
