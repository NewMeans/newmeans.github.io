/* NewMeans interactive logo — a living kaomoji rabbit.
 * Self-contained module: injects its own CSS, rebuilds the real logo from 25
 * image slices (assets/brand/logo-pieces/), and animates it.
 * Usage: <div data-newmeans-logo></div> (width set by page; aspect handled here).
 * Behavior: the face (^ ^ ^) watches the cursor (ears/body follow less); grab a
 * "NewMeans" letter and the rabbit frets — feet stamp, tail wags, eyes go round,
 * sweat drips; release and the letter springs home, then it calms. */
(function () {
  "use strict";

  var W = 4268, H = 2134;
  var PARTS = [
    { id: 1, x: 1673, y: 357, w: 133, h: 400 }, { id: 2, x: 2401, y: 357, w: 133, h: 400 },
    { id: 3, x: 3383, y: 357, w: 99, h: 99 }, { id: 4, x: 1415, y: 361, w: 193, h: 392 },
    { id: 5, x: 2142, y: 361, w: 194, h: 392 }, { id: 7, x: 3501, y: 446, w: 225, h: 220 },
    { id: 8, x: 2846, y: 840, w: 403, h: 84 }, { id: 9, x: 1217, y: 842, w: 132, h: 400 },
    { id: 10, x: 2644, y: 842, w: 133, h: 400 }, { id: 11, x: 3291, y: 842, w: 132, h: 400 },
    { id: 12, x: 1477, y: 864, w: 96, h: 69 }, { id: 13, x: 1936, y: 864, w: 94, h: 69 },
    { id: 14, x: 1659, y: 887, w: 190, h: 169 }, { id: 15, x: 2127, y: 931, w: 225, h: 221 },
    { id: 16, x: 3518, y: 955, w: 187, h: 242 }, { id: 17, x: 923, y: 1192, w: 206, h: 42 },
    { id: 18, x: 2379, y: 1192, w: 205, h: 42 }, { id: 19, x: 467, y: 1232, w: 346, h: 495 },
    { id: 20, x: 1800, y: 1232, w: 464, h: 495 }, { id: 21, x: 1233, y: 1331, w: 525, h: 396 },
    { id: 22, x: 3072, y: 1331, w: 356, h: 396 }, { id: 23, x: 857, y: 1332, w: 339, h: 395 },
    { id: 24, x: 2313, y: 1332, w: 339, h: 395 }, { id: 25, x: 2686, y: 1332, w: 346, h: 395 },
    { id: 26, x: 3481, y: 1332, w: 320, h: 395 }
  ];
  var WORD = { 19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1 };
  var EYE = { 12: 1, 13: 1 };
  var FACE = { 12: 1, 13: 1, 14: 1 };
  var EAR = { 1: 1, 2: 1, 4: 1, 5: 1 };
  var FEET = { 17: 1, 18: 1 };
  var SPARK = { 3: 1, 7: 1 };
  var TAILID = 16;

  var CSS =
    ".nmlogo{position:relative;aspect-ratio:4268/2134;touch-action:none}" +
    ".nmlogo .pc{position:absolute;will-change:transform}" +
    ".nmlogo .pc.word{cursor:grab}.nmlogo .pc.word.drag{cursor:grabbing;z-index:6}" +
    ".nmlogo .pc img{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}" +
    ".nmlogo .pc .eye{position:absolute;left:50%;top:46%;width:126%;aspect-ratio:1;border-radius:50%;" +
    "background:transparent;border:clamp(2.6px,0.68vw,4.3px) solid #85C6A8;box-sizing:border-box;" +
    "transform:translate(-50%,-50%);opacity:0;pointer-events:none}" +
    ".nmlogo .nm-sweat{position:absolute;color:#85C6A8;font:700 clamp(21px,4.6vw,34px) ui-monospace,monospace;" +
    "pointer-events:none;z-index:7;animation:nm-sweatdrop 1.95s ease-out forwards}" +
    "@keyframes nm-sweatdrop{0%{opacity:0;transform:translate(0,0) scale(.6)}" +
    "14%{opacity:.95;transform:translate(4px,-3px) scale(1)}100%{opacity:0;transform:translate(34px,-16px) scale(1.05)}}";

  function injectCSS() {
    if (document.getElementById("nm-logo-css")) return;
    var s = document.createElement("style"); s.id = "nm-logo-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mount(root, opts) {
    if (!root || root.__nmMounted) return;
    root.__nmMounted = true;
    opts = opts || {};
    var base = opts.base || root.getAttribute("data-base") || "assets/brand/logo-pieces/";
    injectCSS();
    root.classList.add("nmlogo");
    root.setAttribute("aria-label", "NewMeans");

    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pieces = PARTS.map(function (p, i) {
      var el = document.createElement("div");
      el.className = "pc" + (WORD[p.id] ? " word" : "");
      el.style.left = (p.x / W * 100) + "%"; el.style.top = (p.y / H * 100) + "%";
      el.style.width = (p.w / W * 100) + "%"; el.style.height = (p.h / H * 100) + "%";
      var img = new Image(); img.src = base + "p" + p.id + ".png"; img.alt = ""; el.appendChild(img);
      root.appendChild(el);
      if (FEET[p.id]) el.style.transformOrigin = "100% 50%";
      var eye = null;
      if (EYE[p.id]) { eye = document.createElement("div"); eye.className = "eye"; el.appendChild(eye); }
      return {
        el: el, eye: eye, img: img, id: p.id, i: i,
        hx: (p.x + p.w / 2) / W, hy: (p.y + p.h / 2) / H, phase: (i * 1.7) % 6.283,
        word: !!WORD[p.id], face: !!FACE[p.id], ear: !!EAR[p.id], feet: !!FEET[p.id],
        spark: !!SPARK[p.id], tail: p.id === TAILID,
        x: 0, y: 0, vx: 0, vy: 0, dragging: false, gx: 0, gy: 0
      };
    });
    if (reduce) return;

    var rect, cx, cy, reach;
    function measure() { rect = root.getBoundingClientRect(); cx = rect.left + rect.width / 2; cy = rect.top + rect.height / 2; reach = Math.max(300, rect.width * 1.1); }
    window.addEventListener("resize", measure); window.addEventListener("scroll", measure, { passive: true });

    var tnx = 0, tny = 0, nx = 0, ny = 0, pointerX = 0, pointerY = 0, dragEl = null, away = null;
    window.addEventListener("pointermove", function (e) {
      pointerX = e.clientX; pointerY = e.clientY;
      tnx = Math.max(-1, Math.min(1, (e.clientX - cx) / reach));
      tny = Math.max(-1, Math.min(1, (e.clientY - cy) / reach));
      if (dragEl) e.preventDefault();
    }, { passive: false });
    window.addEventListener("pointerleave", function () { tnx = 0; tny = 0; });

    pieces.forEach(function (p) {
      if (!p.word) return;
      p.el.addEventListener("pointerdown", function (e) {
        e.preventDefault(); dragEl = p; away = p; p.dragging = true; p.el.classList.add("drag");
        try { p.el.setPointerCapture(e.pointerId); } catch (_) {}
        var r = p.el.getBoundingClientRect(); p.gx = e.clientX - (r.left + r.width / 2); p.gy = e.clientY - (r.top + r.height / 2);
      });
      function up() { if (dragEl !== p) return; dragEl = null; p.dragging = false; p.el.classList.remove("drag"); }
      p.el.addEventListener("pointerup", up); p.el.addEventListener("pointercancel", up);
    });

    var MAX = 6; function updMax() { MAX = rect.width * 0.03; } window.addEventListener("resize", updMax);

    var lastSweat = 0;
    function spawnSweat() {
      var s = document.createElement("div"); s.className = "nm-sweat"; s.textContent = ";";
      s.style.left = "56%"; s.style.top = "31%";
      root.appendChild(s); s.addEventListener("animationend", function () { s.remove(); });
    }

    var t = 0, agitate = 0;
    function tick() {
      t += 0.016;
      nx += (tnx - nx) * 0.09; ny += (tny - ny) * 0.09;

      if (dragEl) { agitate += (1 - agitate) * 0.14; }
      else if (away) {
        var d = Math.hypot(away.x, away.y);
        agitate += (Math.min(1, d / (rect.width * 0.14)) - agitate) * 0.1;
        if (d < rect.width * 0.008) away = null;
      } else { agitate += (0 - agitate) * 0.08; }

      if (agitate > 0.35 && t - lastSweat > 0.5) { spawnSweat(); lastSweat = t; }

      for (var k = 0; k < pieces.length; k++) {
        var p = pieces[k], tx, ty, rot = 0;
        if (p.dragging) {
          tx = (pointerX - rect.left - p.gx) - p.hx * rect.width;
          ty = (pointerY - rect.top - p.gy) - p.hy * rect.height;
          tx = Math.max(-rect.width * 0.75, Math.min(rect.width * 0.75, tx));
          ty = Math.max(-rect.height * 1.1, Math.min(rect.height * 1.6, ty));
        } else if (p.spark) {
          tx = nx * 0.6 * MAX + Math.sin(t * 1.6 + p.phase) * MAX * 0.5;
          ty = ny * 0.6 * MAX + Math.cos(t * 1.3 + p.phase) * MAX * 0.6;
        } else {
          var lean = p.face ? 1.3 : p.ear ? 0.6 : p.word ? 0.12 : 0.45;
          tx = nx * lean * MAX; ty = ny * lean * MAX;
          if (agitate > 0.02) {
            if (p.feet) rot = Math.abs(Math.sin(t * 13 + (p.id === 17 ? 0 : Math.PI / 2))) * agitate * 32;
            else if (p.tail) rot = Math.sin(t * 26) * agitate * 30;
            else if (p.face) ty += Math.sin(t * 5) * agitate * MAX * 0.25;
          }
        }
        var kk = p.dragging ? 0.35 : 0.16;
        p.vx += (tx - p.x) * kk; p.vy += (ty - p.y) * kk; p.vx *= 0.74; p.vy *= 0.74; p.x += p.vx; p.y += p.vy;
        p.el.style.transform = "translate(" + p.x.toFixed(2) + "px," + p.y.toFixed(2) + "px)" + (rot ? " rotate(" + rot.toFixed(2) + "deg)" : "");
        if (p.eye) { var on = agitate > 0.45; p.eye.style.opacity = on ? "1" : "0"; p.img.style.opacity = on ? "0" : "1"; }
      }
      requestAnimationFrame(tick);
    }
    measure(); updMax(); requestAnimationFrame(tick);
  }

  function auto() {
    var els = document.querySelectorAll("[data-newmeans-logo]");
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
  window.NewMeansLogo = { mount: mount };
})();
