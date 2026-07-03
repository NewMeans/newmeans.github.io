/* Typer keyboard — the in-game keyboard as a pressable web component.
 * Self-contained: injects CSS, builds frame + keycaps from the game assets.
 *
 * 실기 규격 (비버롹스 월페이퍼 + 게임 에셋 실측):
 * - 슬롯: R1=[악센트,1u,1u,1u,1u,와이드] R2=[와이드,1u×5] R3=[1u×5,와이드]
 * - 프레임 지오메트리 2종: retro(2125×1131, 컷아웃 1931×884+97+149)
 *                       modern(2071×1031, 컷아웃 1930×889+70+71)
 * - 키캡 세트: 0.png=기본 1u. 1.png는 세트에 따라 와이드(461/469px) 또는
 *   1u 악센트(281px). 악센트 세트의 와이드 슬롯은 9-slice(border-image)로
 *   코너를 보존한 채 늘린다 — 이미지 강제 스트레치 금지.
 * Usage: <div data-typer-keyboard></div> (width는 페이지가, 비율은 모듈이). */
(function () {
  "use strict";

  var SLOTS = [["a", "n", "n", "n", "n", "w"], ["w", "n", "n", "n", "n", "n"], ["n", "n", "n", "n", "n", "w"]];
  var GEO = {
    retro:  { aspect: "2125/1131", top: 0.1443, k: 0.1298, g: 0.0068, bed: "9% 3% 6% 3%" },
    modern: { aspect: "2071/1031", top: 0.0863, k: 0.1328, g: 0.0068, bed: "7.2% 3.6% 7.2% 3.6%" }
  };

  var CSS =
    ".tp-kb{position:relative}" +
    ".tp-kb__bed{position:absolute;background:#161210;border-radius:14px;z-index:0}" +
    ".tp-kb__board{position:relative;width:100%;z-index:1}" +
    ".tp-kb__frame{position:relative;width:100%;height:100%;display:block}" +
    ".tp-kb__keys{position:absolute;left:50%;transform:translateX(-50%);z-index:2;" +
    "display:flex;flex-direction:column;align-items:center}" +
    ".tp-kb__row{display:flex;justify-content:center}" +
    ".tp-kb__cap{flex:0 0 auto;padding:0;border:0;background:none;cursor:pointer;position:relative;" +
    "transform-origin:center bottom;transition:transform 90ms ease}" +
    ".tp-kb__cap img{width:100%;height:100%;object-fit:fill;display:block;user-select:none;-webkit-user-drag:none}" +
    ".tp-kb__cap .nine{width:100%;height:100%;display:block;border-style:solid;border-width:0;" +
    "border-image-repeat:stretch}" +
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

    // 기본 스킨 = 레트로 (assets/desk 원본과 동일)
    var skin = {
      geo: "retro",
      frame: base + "frame.png",
      normal: base + "keycap_0.png",
      accent: null,                    // 레트로엔 1u 악센트 없음 → normal 사용
      wide: base + "keycap_1.png",     // 실제 와이드 아트
      wideRatio: 461 / 281
    };

    var bed = document.createElement("div"); bed.className = "tp-kb__bed"; root.appendChild(bed);
    var board = document.createElement("div"); board.className = "tp-kb__board"; root.appendChild(board);
    var frame = new Image(); frame.className = "tp-kb__frame"; frame.alt = ""; board.appendChild(frame);
    var keys = document.createElement("div"); keys.className = "tp-kb__keys"; board.appendChild(keys);

    var caps = [];
    SLOTS.forEach(function (row) {
      var r = document.createElement("div"); r.className = "tp-kb__row";
      row.forEach(function (t) {
        var b = document.createElement("button"); b.type = "button"; b.className = "tp-kb__cap";
        b.setAttribute("data-key", ""); b.dataset.slot = t;
        b.setAttribute("aria-label", t === "w" ? "wide key" : "key");
        r.appendChild(b); caps.push(b);
      });
      keys.appendChild(r);
    });

    // 슬롯 채우기: n=기본 / a=악센트(없으면 기본) / w=와이드 아트 or 악센트 9-slice
    function fill() {
      frame.src = skin.frame;
      var geo = GEO[skin.geo] || GEO.retro;
      board.style.aspectRatio = geo.aspect;
      bed.style.inset = geo.bed;
      keys.style.top = (geo.top * 100) + "%";
      caps.forEach(function (b) {
        while (b.firstChild) b.removeChild(b.firstChild);
        var t = b.dataset.slot;
        if (t === "w" && !skin.wide) {
          var d = document.createElement("span"); d.className = "nine";
          d.dataset.src = skin.accent || skin.normal;
          b.appendChild(d);
        } else {
          var img = new Image(); img.alt = "";
          img.src = t === "w" ? skin.wide : (t === "a" && skin.accent) ? skin.accent : skin.normal;
          b.appendChild(img);
        }
      });
      layout();
    }

    function layout() {
      var W = board.clientWidth; if (!W) return;
      var geo = GEO[skin.geo] || GEO.retro;
      var k = W * geo.k, g = W * geo.g, wide = k * (skin.wide ? skin.wideRatio : 1.64);
      var rows = keys.querySelectorAll(".tp-kb__row");
      rows.forEach(function (r, ri) {
        r.style.marginBottom = (ri < rows.length - 1 ? g : 0) + "px";
        var ks = r.querySelectorAll(".tp-kb__cap");
        ks.forEach(function (c, ci) {
          c.style.width = (c.dataset.slot === "w" ? wide : k) + "px";
          c.style.height = k + "px";
          c.style.marginRight = (ci < ks.length - 1 ? g : 0) + "px";
          var nine = c.querySelector(".nine");
          if (nine) {
            // 9-slice: 코너(96/281)를 보존하고 중앙만 늘림
            var bw = k * 96 / 281;
            nine.style.borderImageSource = "url(" + nine.dataset.src + ")";
            nine.style.borderImageSlice = "96 fill";
            nine.style.borderImageWidth = bw + "px";
          }
        });
      });
    }
    fill();
    window.addEventListener("resize", layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(board);

    // 스킨 교체 — {geo, frame, normal, accent, wide, wideRatio} 부분 갱신
    root.__tpSkin = function (next) {
      for (var key in next) if (next[key] !== undefined) skin[key] = next[key];
      fill();
    };

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
