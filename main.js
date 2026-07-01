/* NewMeans — shared interactions
 * - initReveals(): scroll reveal on every page (reduced-motion aware)
 * - initDesk(): the in-game Typer desk (monitor + keycap keyboard + sound),
 *   only runs when a [data-desk] element is present (Typer page).
 * Copy/translation lives in i18n.js; audio uses Howler when available. */
(function () {
  "use strict";

  // In-game keyboard layout (see NewMeans Web Assets/Screenshots/IMG_3496).
  // Each row is 5 normal keycaps + 1 wide keycap; wide side alternates.
  var DESK_ROWS = [
    ["Q", "W", "E", "R", "T", { v: "Backspace", wide: true }],
    [{ v: "Space", wide: true }, "A", "S", "D", "F", "G"],
    ["Z", "X", "C", "V", "B", { v: "Enter", wide: true }]
  ];

  var ASSET = {
    keyNormal: "NewMeans Web Assets/DeskImages/keycap_0.png",
    keyWide: "NewMeans Web Assets/DeskImages/keycap_1.png",
    bgm: "NewMeans Web Assets/BGMs/Vintage Needle.mp3",
    keySounds: Array.from({ length: 10 }, function (_, i) {
      return "NewMeans Web Assets/KeySounds/" + i + ".wav";
    })
  };

  var TERMINAL = {
    initial: [
      "Typer ver0.1.0",
      "",
      "int main(void) {",
      "  printf(\"by NewMeans\");",
      "  return (0);",
      "}"
    ],
    maxLines: 16,
    desktopVisible: 8,
    mobileVisible: 6
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("has-js");

  ready(function () {
    initReveals();
    initDesk();
  });

  /* ---------- scroll reveal (all pages) ---------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    if (reduceMotion || typeof window.IntersectionObserver !== "function") {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -10% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- the Typer desk (Typer page only) ---------- */
  function initDesk() {
    var desk = document.querySelector("[data-desk]");
    if (!desk) return;

    var keyboardRoot = desk.querySelector("[data-keyboard]");
    var monitorOut = desk.querySelector("[data-monitor-output]");
    var soundToggle = document.querySelector("[data-sound-toggle]");
    var copyrightBtn = document.querySelector("[data-copyright-trigger]");
    if (!keyboardRoot || !monitorOut) return;

    var keyMap = buildKeyboard(keyboardRoot);
    var randomPool = Array.from(keyMap.keys()).filter(function (v) { return v.length === 1; });
    var audio = soundToggle ? createAudio(soundToggle, copyrightBtn) : { playKey: function () {} };

    var buffer = TERMINAL.initial.slice();
    render();

    window.addEventListener("resize", render);

    keyboardRoot.addEventListener("pointerdown", function (event) {
      var btn = event.target.closest("[data-key]");
      if (!btn) return;
      event.preventDefault();
      var value = btn.getAttribute("data-key-value");
      pressKey(value, keyMap);
      applyValue(value);
      audio.playKey();
    });

    var deskVisible = true;
    if (typeof window.IntersectionObserver === "function") {
      var io = new IntersectionObserver(function (entries) {
        var e = entries[0];
        deskVisible = !!e && e.isIntersecting && e.intersectionRatio > 0.2;
      }, { threshold: [0, 0.2, 0.6] });
      io.observe(desk);
    }

    window.addEventListener("keydown", function (event) {
      if (!deskVisible || isEditable(event.target) || event.isComposing ||
          event.metaKey || event.ctrlKey || event.altKey) return;
      var action = classifyKey(event.key);
      if (!action) return;
      event.preventDefault();
      if (action.type === "char") insertChar(action.value);
      else if (action.type === "enter") insertNewLine();
      else if (action.type === "back") removeChar();
      pressRandom();
      audio.playKey();
    });

    function applyValue(value) {
      if (value === "Backspace") return removeChar();
      if (value === "Enter") return insertNewLine();
      if (value === "Space") return insertChar(" ");
      insertChar(value.toLowerCase());
    }
    function insertChar(ch) { buffer[buffer.length - 1] += ch; trim(); render(); }
    function insertNewLine() { buffer.push(""); trim(); render(); }
    function removeChar() {
      var i = buffer.length - 1;
      if (buffer[i].length > 0) buffer[i] = buffer[i].slice(0, -1);
      else if (buffer.length > 1) buffer.pop();
      render();
    }
    function trim() { while (buffer.length > TERMINAL.maxLines) buffer.shift(); }

    function render() {
      var count = window.matchMedia("(max-width: 720px)").matches
        ? TERMINAL.mobileVisible : TERMINAL.desktopVisible;
      var lines = buffer.slice(-count);
      monitorOut.innerHTML = "";
      lines.forEach(function (line, idx) {
        var p = document.createElement("p");
        p.className = "screen__line";
        p.textContent = line;
        if (idx === lines.length - 1) {
          var caret = document.createElement("span");
          caret.className = "screen__caret";
          caret.setAttribute("aria-hidden", "true");
          p.appendChild(caret);
        }
        monitorOut.appendChild(p);
      });
    }
    function pressRandom() {
      if (randomPool.length) pressKey(randomPool[(Math.random() * randomPool.length) | 0], keyMap);
    }
  }

  function buildKeyboard(root) {
    var map = new Map();
    root.innerHTML = "";
    DESK_ROWS.forEach(function (row) {
      var rowEl = document.createElement("div");
      rowEl.className = "kbrow";
      row.forEach(function (spec) {
        var value = typeof spec === "string" ? spec : spec.v;
        var wide = typeof spec === "object" && spec.wide;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kcap" + (wide ? " kcap--wide" : "");
        btn.setAttribute("data-key", "");
        btn.setAttribute("data-key-value", value);
        btn.setAttribute("aria-label", humanize(value));
        var img = document.createElement("img");
        img.className = "kcap__img";
        img.alt = "";
        img.src = encodeURI(wide ? ASSET.keyWide : ASSET.keyNormal);
        btn.appendChild(img);
        rowEl.appendChild(btn);
        map.set(value, btn);
      });
      root.appendChild(rowEl);
    });
    return map;
  }

  function pressKey(value, map) {
    var btn = map.get(value);
    if (!btn) return;
    btn.classList.add("is-active");
    window.clearTimeout(btn._t);
    btn._t = window.setTimeout(function () { btn.classList.remove("is-active"); }, 110);
  }

  /* ---------- audio (Howler, optional) ---------- */
  function createAudio(toggleBtn, copyrightBtn) {
    var enabled = false;
    var bgm = null;
    var keySounds = [];
    var available = typeof window.Howl === "function" && typeof window.Howler === "object";

    if (available) {
      bgm = new window.Howl({ src: [encodeURI(ASSET.bgm)], loop: true, volume: 0.22, html5: true });
      keySounds = ASSET.keySounds.map(function (s) {
        return new window.Howl({ src: [encodeURI(s)], volume: 0.46, preload: true, pool: 4 });
      });
      window.Howler.mute(true);
    } else {
      toggleBtn.disabled = true;
    }

    function label() {
      var key = enabled ? "sound.disable" : "sound.enable";
      return (window.i18n && window.i18n.t) ? window.i18n.t(key) : (enabled ? "Turn sound off" : "Turn sound on");
    }
    function refresh() {
      toggleBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
      toggleBtn.setAttribute("aria-label", label());
    }
    function playKey() {
      if (!available || !enabled || !keySounds.length) return;
      keySounds[(Math.random() * keySounds.length) | 0].play();
    }

    toggleBtn.addEventListener("click", function () {
      if (!available) return;
      enabled = !enabled;
      window.Howler.mute(!enabled);
      if (enabled) { if (!bgm.playing()) bgm.play(); } else { bgm.stop(); }
      refresh();
    });
    if (copyrightBtn) copyrightBtn.addEventListener("click", playKey);
    window.addEventListener("nm:langchange", refresh);
    refresh();
    return { playKey: playKey };
  }

  /* ---------- helpers ---------- */
  function classifyKey(key) {
    if (key === "Backspace") return { type: "back" };
    if (key === "Enter") return { type: "enter" };
    if (key.length === 1) return { type: "char", value: key };
    return null;
  }
  function humanize(v) {
    if (v === "Space") return "Space";
    if (v === "Enter") return "Enter";
    if (v === "Backspace") return "Backspace";
    return v;
  }
  function isEditable(t) {
    if (!(t instanceof HTMLElement)) return false;
    if (t.isContentEditable) return true;
    var tag = t.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select";
  }
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
})();
