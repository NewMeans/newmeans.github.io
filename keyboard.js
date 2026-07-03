/* Typer keyboard — the in-game keyboard as a pressable web component.
 * Self-contained: injects CSS, builds frame + keycaps from the game assets.
 *
 * 실기 규격 (유니티 KeycapsData 실측):
 * - 슬롯 18개: 각 세트의 data.asset layout이 위치별 스프라이트를 지정.
 *   와이드 슬롯은 R1C5·R2C0·R3C5 — 전 세트에 진짜 와이드 아트(461px)가 있어
 *   스트레치/9-slice 불필요. 와이드 폭은 스프라이트 원본 비율로 계산.
 * - 프레임 지오메트리 2종: retro(2125×1131) / modern(2071×1031).
 * - 베드(배경판) 색은 키캡 세트의 backBoardColor.
 * Usage: <div data-typer-keyboard></div> (width는 페이지가, 비율은 모듈이). */
(function () {
  "use strict";

  var WIDE_AT = { 5: 1, 6: 1, 17: 1 };   // R1C5, R2C0, R3C5
  /* bed: 컷아웃을 완전히 덮고 베젤 밑으로 살짝 들어가는 크기(프레임이 위에서 가림).
     컷아웃 모서리 곡률은 프레임 아트가 그리므로 베드 radius는 최소로. */
  var GEO = {
    retro:  { aspect: "2125/1131", top: 0.1443, k: 0.1298, g: 0.0068, bed: "10% 2.4% 5% 2.4%" },
    modern: { aspect: "2071/1031", top: 0.0863, k: 0.1328, g: 0.0068, bed: "4.5% 2% 4.5% 2%" }
  };

  var CSS =
    ".tp-kb{position:relative}" +
    ".tp-kb__bed{position:absolute;background:#332B27;border-radius:6px;z-index:0}" +
    ".tp-kb__board{position:relative;width:100%;z-index:1}" +
    ".tp-kb__frame{position:relative;width:100%;height:100%;display:block}" +
    ".tp-kb__keys{position:absolute;left:50%;transform:translateX(-50%);z-index:2;" +
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

    // 기본 스킨 = 레트로 (assets/desk 원본: 일반 keycap_0, 와이드 keycap_1)
    var retroSlots = [];
    for (var i = 0; i < 18; i++) retroSlots.push(base + (WIDE_AT[i] ? "keycap_1.png" : "keycap_0.png"));
    var skin = { geo: "retro", frame: base + "frame.png", bed: "#332B27", slots: retroSlots };

    var bed = document.createElement("div"); bed.className = "tp-kb__bed"; root.appendChild(bed);
    var board = document.createElement("div"); board.className = "tp-kb__board"; root.appendChild(board);
    var frame = new Image(); frame.className = "tp-kb__frame"; frame.alt = ""; board.appendChild(frame);
    var keys = document.createElement("div"); keys.className = "tp-kb__keys"; board.appendChild(keys);

    var caps = [], imgs = [];
    for (var r = 0; r < 3; r++) {
      var row = document.createElement("div"); row.className = "tp-kb__row";
      for (var c = 0; c < 6; c++) {
        var idx = r * 6 + c;
        var b = document.createElement("button"); b.type = "button"; b.className = "tp-kb__cap";
        b.setAttribute("data-key", ""); b.dataset.idx = idx;
        b.setAttribute("aria-label", WIDE_AT[idx] ? "wide key" : "key");
        var img = new Image(); img.alt = "";
        img.addEventListener("load", layout);           // 와이드 비율은 원본에서
        b.appendChild(img); row.appendChild(b);
        caps.push(b); imgs.push(img);
      }
      keys.appendChild(row);
    }

    function fill() {
      frame.src = skin.frame;
      bed.style.background = skin.bed || "#332B27";
      var geo = GEO[skin.geo] || GEO.retro;
      board.style.aspectRatio = geo.aspect;
      bed.style.inset = geo.bed;
      keys.style.top = (geo.top * 100) + "%";
      imgs.forEach(function (img, i) { img.src = skin.slots[i]; });
      layout();
    }

    function layout() {
      var W = board.clientWidth; if (!W) return;
      var geo = GEO[skin.geo] || GEO.retro;
      var k = W * geo.k, g = W * geo.g;
      var rows = keys.querySelectorAll(".tp-kb__row");
      rows.forEach(function (row, ri) {
        row.style.marginBottom = (ri < rows.length - 1 ? g : 0) + "px";
        var ks = row.querySelectorAll(".tp-kb__cap");
        ks.forEach(function (cap, ci) {
          var idx = +cap.dataset.idx;
          var w = k;
          if (WIDE_AT[idx]) {
            var img = imgs[idx];
            var ratio = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 461 / 281;
            w = k * ratio;
          }
          cap.style.width = w + "px";
          cap.style.height = k + "px";
          cap.style.marginRight = (ci < ks.length - 1 ? g : 0) + "px";
        });
      });
    }
    fill();
    window.addEventListener("resize", layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(board);

    // 스킨 교체 — {geo, frame, bed, slots[18]} 부분 갱신
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
