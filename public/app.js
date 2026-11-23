(function () {
  var STORAGE_KEY = "leaf-exchange-bring";

  function readState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function writeState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* localStorage unavailable; ignore */
    }
  }

  function initChecklist() {
    var form = document.getElementById("checklist");
    if (!form) return;
    var boxes = Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]'));
    var state = readState();
    boxes.forEach(function (box) {
      var stored = state[box.id];
      if (typeof stored === "boolean") box.checked = stored;
      box.addEventListener("change", function () {
        var s = readState();
        s[box.id] = box.checked;
        writeState(s);
      });
    });
    var reset = document.getElementById("reset-checklist");
    if (reset) {
      reset.addEventListener("click", function () {
        boxes.forEach(function (box) { box.checked = false; });
        writeState({});
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initChecklist);
})();
