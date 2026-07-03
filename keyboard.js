/* Typer keyboard — the in-game keyboard as a pressable web component.
 * Self-contained: injects CSS, builds the frame + keycaps from the game assets
 * (assets/desk/), and keeps keycaps filling the frame's transparent inner
 * cutout with a uniform gap. The dark bed sits BEHIND the frame; the cream
 * frame border frames it. Press = shrink from the bottom pivot (no highlight).
 * Usage: <div data-typer-keyboard></div> (width set by page). */
(function () {
  "use strict";

  var ROWS = [["n", "n", "n", "n", "n", "w"], ["w", "n", "n", "n", "n", "n"], ["n", "n", "n", "n", "n", "w"]]; // wide R/L/R
  var WR = 461 / 281;

  var CSS =
    ".tp-kb{position:relative}" +
    ".tp-kb__bed{position:absolute;inset:9% 3% 6% 3%;background:#161210;border-radius:14px;z-index:0}" +
    ".tp-kb__board{position:relative;width:100%;aspect-ratio:2125/1131;z-index:1}" +
    ".tp-kb__frame{position:relative;width:100%;height:100%;display:block}" +
    ".tp-kb__keys{position:absolute;left:50%;top:14.43%;transform:translateX(-50%);z-index:2;" +
    "display:flex;flex-direction:column;align-items:center}" +
    ".tp-kb__row{display:flex;justify-content:center}" +
    ".tp-kb__cap{flex:0 0 auto;padding:0;border:0;background:none;cursor:pointer;position:relative;" +
    "transform-origin:center bottom;transition:transform 90ms ease}" +
    ".tp-kb__cap img{width:100%;height:100%;object-fit:fill;display:block;user-select:none;-webkit-user-drag:none}" +
    ".tp-kb__cap.is-active{transform:scale(.9)}";

  function injectCSS() {
    if (document.getElementById("tp-kb-css")) return;
    var s = document.createElement("style"); s.id = "tp-kb-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mount(root, opts) {
    if (!root || root.__tpMounted) return;
    root.__tpMounted = true;
    opts = opts || {};
    var base = opts.base || root.getAttribute("data-base") || "assets/desk/";
    var onPress = typeof opts.onPress === "function" ? opts.onPress : null;
    injectCSS();
    root.classList.add("tp-kb");

    var bed = document.createElement("div"); bed.className = "tp-kb__bed"; root.appendChild(bed);
    var board = document.createElement("div"); board.className = "tp-kb__board"; root.appendChild(board);
    var frame = new Image(); frame.className = "tp-kb__frame"; frame.alt = ""; frame.src = base + "frame.png"; board.appendChild(frame);
    var keys = document.createElement("div"); keys.className = "tp-kb__keys"; board.appendChild(keys);

    var capImgs = [];
    ROWS.forEach(function (row) {
      var r = document.createElement("div"); r.className = "tp-kb__row";
      row.forEach(function (t) {
        var wide = t === "w";
        var b = document.createElement("button"); b.type = "button"; b.className = "tp-kb__cap";
        b.setAttribute("data-key", ""); b.setAttribute("aria-label", wide ? "wide key" : "key"); b.dataset.wide = wide ? "1" : "";
        var img = new Image(); img.alt = ""; img.src = base + (wide ? "keycap_1.png" : "keycap_0.png");
        img.dataset.wide = wide ? "1" : "";
        b.appendChild(img); r.appendChild(b); capImgs.push(img);
      });
      keys.appendChild(r);
    });
    // swap sprites in place — {normal, wide, frame} (any subset)
    root.__tpSkin = function (skin) {
      if (skin.frame) frame.src = skin.frame;
      capImgs.forEach(function (img) {
        if (img.dataset.wide === "1") { if (skin.wide) img.src = skin.wide; }
        else if (skin.normal) img.src = skin.normal;
      });
    };

    function layout() {
      var W = board.clientWidth; if (!W) return;
      var k = W * 0.1298, g = W * 0.0068, wide = k * WR;   // fill the cutout with a uniform gap
      var rows = keys.querySelectorAll(".tp-kb__row");
      rows.forEach(function (r, ri) {
        r.style.marginBottom = (ri < rows.length - 1 ? g : 0) + "px";
        var ks = r.querySelectorAll(".tp-kb__cap");
        ks.forEach(function (c, ci) {
          c.style.width = (c.dataset.wide === "1" ? wide : k) + "px";
          c.style.height = k + "px";
          c.style.marginRight = (ci < ks.length - 1 ? g : 0) + "px";
        });
      });
    }
    layout(); window.addEventListener("resize", layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(board);

    keys.addEventListener("pointerdown", function (e) {
      var c = e.target.closest("[data-key]"); if (!c) return; e.preventDefault();
      c.classList.add("is-active"); clearTimeout(c._t);
      c._t = setTimeout(function () { c.classList.remove("is-active"); }, 120);
      if (onPress) onPress(c);
    });
  }

  function auto() {
    var els = document.querySelectorAll("[data-typer-keyboard]");
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
  window.TyperKeyboard = {
    mount: mount,
    setSkin: function (el, skin) { if (el && el.__tpSkin) el.__tpSkin(skin); }
  };
})();
