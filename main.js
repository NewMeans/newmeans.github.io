/* NewMeans — homepage interactions
 * - Interactive keyboard + retro monitor (the studio signature)
 * - Optional key/BGM sound via Howler
 * - Scroll reveal, reduced-motion aware
 * Copy/translation lives in i18n.js; this file only reads window.i18n.t(). */
(function () {
  "use strict";

  var KEY_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", { value: "Enter", label: "↵", wide: true }],
    [{ value: "Backspace", label: "⌫", wide: true }, "Z", "X", "C", "V", "B", "N", "M"],
    [{ value: "Space", label: "space", block: true }]
  ];

  var AUDIO_CONFIG = {
    bgm: "NewMeans Web Assets/BGMs/Vintage Needle.mp3",
    keySounds: Array.from({ length: 10 }, function (_, i) {
      return "NewMeans Web Assets/KeySounds/" + i + ".wav";
    }),
    bgmVolume: 0.22,
    keyVolume: 0.46
  };

  var TERMINAL = {
    initial: [
      "newmeans@seoul:~$ ls",
      "typer   dopamine-univ",
      "newmeans@seoul:~$ "
    ],
    maxLines: 16,
    desktopVisible: 5,
    mobileVisible: 4
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("has-js");

  ready(function () {
    initReveals();
    initHero();
  });

  /* ---------- hero: keyboard + monitor + audio ---------- */
  function initHero() {
    var keyboardRoot = document.querySelector("[data-keyboard]");
    var monitorOut = document.querySelector("[data-monitor-output]");
    var vizRoot = document.querySelector("[data-visualizer]");
    var soundToggle = document.querySelector("[data-sound-toggle]");
    var copyrightBtn = document.querySelector("[data-copyright-trigger]");
    if (!keyboardRoot || !monitorOut || !soundToggle) return;

    var keyMap = buildKeyboard(keyboardRoot);
    var randomPool = Array.from(keyMap.keys()).filter(function (v) {
      return v.length === 1;
    });
    var vizBars = vizRoot ? buildVisualizer(vizRoot, 22) : [];
    var audio = createAudio(soundToggle, copyrightBtn);

    var buffer = TERMINAL.initial.slice();
    var vizTimer = 0;
    var heroVisible = true;

    renderMonitor();
    window.addEventListener("resize", renderMonitor);

    var hero = document.querySelector(".hero");
    if (hero && typeof window.IntersectionObserver === "function") {
      var io = new IntersectionObserver(function (entries) {
        var e = entries[0];
        heroVisible = !!e && e.isIntersecting && e.intersectionRatio > 0.25;
      }, { threshold: [0, 0.25, 0.6] });
      io.observe(hero);
    }

    // Pointer input on the on-screen keyboard.
    keyboardRoot.addEventListener("pointerdown", function (event) {
      var btn = event.target.closest("[data-key]");
      if (!btn) return;
      event.preventDefault();
      var value = btn.getAttribute("data-key-value");
      pressKey(value, keyMap);
      applyValue(value);
      pulseViz();
      audio.playKey();
    });

    // Physical keyboard input (only while the hero is on screen).
    window.addEventListener("keydown", function (event) {
      if (!heroVisible || isEditable(event.target) || event.isComposing ||
          event.metaKey || event.ctrlKey || event.altKey) return;

      var action = classifyKey(event.key);
      if (!action) return;
      event.preventDefault();

      if (action.type === "char") insertChar(action.value);
      else if (action.type === "enter") insertNewLine();
      else if (action.type === "back") removeChar();

      pressRandomKey();
      pulseViz();
      audio.playKey();
    });

    function applyValue(value) {
      if (value === "Backspace") return removeChar();
      if (value === "Enter") return insertNewLine();
      if (value === "Space") return insertChar(" ");
      insertChar(value.toLowerCase());
    }

    function insertChar(ch) {
      buffer[buffer.length - 1] += ch;
      trim();
      renderMonitor();
    }
    function insertNewLine() {
      buffer.push("");
      trim();
      renderMonitor();
    }
    function removeChar() {
      var i = buffer.length - 1;
      if (buffer[i].length > 0) buffer[i] = buffer[i].slice(0, -1);
      else if (buffer.length > 1) buffer.pop();
      renderMonitor();
    }
    function trim() {
      while (buffer.length > TERMINAL.maxLines) buffer.shift();
    }

    function renderMonitor() {
      var visibleCount = window.matchMedia("(max-width: 720px)").matches
        ? TERMINAL.mobileVisible : TERMINAL.desktopVisible;
      var lines = buffer.slice(-visibleCount);
      monitorOut.innerHTML = "";
      lines.forEach(function (line, idx) {
        var p = document.createElement("p");
        p.className = "monitor__line";
        p.textContent = line;
        if (idx === lines.length - 1) {
          var caret = document.createElement("span");
          caret.className = "monitor__caret";
          caret.setAttribute("aria-hidden", "true");
          p.appendChild(caret);
        }
        monitorOut.appendChild(p);
      });
    }

    function pressRandomKey() {
      if (!randomPool.length) return;
      pressKey(randomPool[(Math.random() * randomPool.length) | 0], keyMap);
    }

    function pulseViz() {
      if (!vizBars.length || reduceMotion) return;
      window.clearTimeout(vizTimer);
      vizBars.forEach(function (bar) {
        bar.style.setProperty("--h", randInt(20, 90) + "%");
        bar.style.opacity = "1";
      });
      vizTimer = window.setTimeout(function () { resetViz(vizBars); }, 150);
    }
  }

  /* ---------- keyboard rendering ---------- */
  function buildKeyboard(root) {
    var map = new Map();
    root.innerHTML = "";
    KEY_ROWS.forEach(function (row) {
      var rowEl = document.createElement("div");
      rowEl.className = "keyboard__row";
      row.forEach(function (spec) {
        var value = typeof spec === "string" ? spec : spec.value;
        var label = typeof spec === "string" ? spec : spec.label;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "key";
        if (spec.wide) btn.classList.add("key--wide");
        if (spec.block) btn.classList.add("key--block");
        btn.setAttribute("data-key", "");
        btn.setAttribute("data-key-value", value);
        btn.setAttribute("aria-label", humanize(value));
        var cap = document.createElement("span");
        cap.className = "key__label";
        cap.textContent = label;
        btn.appendChild(cap);
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

  /* ---------- visualizer ---------- */
  function buildVisualizer(root, count) {
    var bars = [];
    root.innerHTML = "";
    for (var i = 0; i < count; i++) {
      var bar = document.createElement("span");
      bar.className = "viz__bar";
      bar.style.setProperty("--h", randInt(12, 24) + "%");
      root.appendChild(bar);
      bars.push(bar);
    }
    return bars;
  }
  function resetViz(bars) {
    bars.forEach(function (bar, i) {
      bar.style.setProperty("--h", (i % 5 === 0 ? randInt(16, 30) : randInt(10, 20)) + "%");
      bar.style.opacity = "0.85";
    });
  }

  /* ---------- audio (Howler, optional) ---------- */
  function createAudio(toggleBtn, copyrightBtn) {
    var enabled = false;
    var bgm = null;
    var keySounds = [];
    var available = typeof window.Howl === "function" && typeof window.Howler === "object";

    if (available) {
      bgm = new window.Howl({ src: [encodeURI(AUDIO_CONFIG.bgm)], loop: true, volume: AUDIO_CONFIG.bgmVolume, html5: true });
      keySounds = AUDIO_CONFIG.keySounds.map(function (s) {
        return new window.Howl({ src: [encodeURI(s)], volume: AUDIO_CONFIG.keyVolume, preload: true, pool: 8 });
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
      if (enabled) { if (!bgm.playing()) bgm.play(); }
      else { bgm.stop(); }
      refresh();
    });

    if (copyrightBtn) copyrightBtn.addEventListener("click", playKey);

    // Keep the aria-label in the active language.
    window.addEventListener("nm:langchange", refresh);
    refresh();

    return { playKey: playKey };
  }

  /* ---------- scroll reveal ---------- */
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

  /* ---------- helpers ---------- */
  function classifyKey(key) {
    if (key === "Backspace") return { type: "back" };
    if (key === "Enter") return { type: "enter" };
    if (key.length === 1) return { type: "char", value: key };
    return null;
  }
  function humanize(value) {
    if (value === "Space") return "Space";
    if (value === "Enter") return "Enter";
    if (value === "Backspace") return "Backspace";
    return value;
  }
  function isEditable(target) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    var tag = target.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select";
  }
  function randInt(min, max) { return ((Math.random() * (max - min + 1)) | 0) + min; }
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
})();
