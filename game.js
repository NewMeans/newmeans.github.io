/* Typer — playable web port of the mobile game's core loop, built from the
 * real game assets. Faithful to the in-game look: peach room + CRT monitor
 * HUD (DNF BitBit), dark playfield, keycap blocks, red balls, green +ball
 * pickups, hidden coins. Every block hit plays a real switch sound clip.
 *
 * Usage: <div data-typer-game></div>  (page sets width; aspect handled here)
 * API:   TyperGame.mount(el, opts)
 *        TyperGame.setSwitch(el, "4002")   — swap the switch sound bank
 *        TyperGame.setKeycap(el, src)      — swap the block keycap sprite
 *        opts.isSoundOn: () => bool        — page-level sound gate
 * Source references: BeginnerInitialBoardFactory.cs (seed board),
 * doc: 7 cols, block HP = spawn level, every row has a +ball pickup. */
(function () {
  "use strict";

  var COLS = 7, START_BALLS = 5, START_LEVEL = 5;
  var SPEED = 0.0165;      // ball speed · fraction of field height per frame
  var STAGGER = 5;         // frames between balls in a burst
  var MIN_UP = 0.26;       // aim clamp: keep shots off the horizontal
  var SWITCH_CLIPS = { 4000: 4, 4001: 5, 4002: 5, 4003: 5, 4004: 5, 4005: 5, 4006: 5 };

  // Beginner seed board (0 empty · n block HP · 'g' green +ball pickup)
  var SEED = [
    [0, 1, 0, 1, 0, 1, 0],
    [5, 0, "g", 0, 1, 0, 1],
    [0, 2, 0, 2, 0, 2, 0]
  ];

  var CSS =
    ".tg{position:relative;width:100%;aspect-ratio:10/16;border-radius:18px;overflow:hidden;" +
    "background:#FFE8C0;touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".tg canvas{display:block;width:100%;height:100%}";

  function injectCSS() {
    if (document.getElementById("tg-css")) return;
    var s = document.createElement("style"); s.id = "tg-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- shared audio (context + decodes deferred to first gesture) ---------- */
  var actx = null, gestured = false, pendingDecodes = [];
  function audio() {
    if (!gestured) return null;
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }
  function gesture() {
    gestured = true;
    var a = audio(); if (!a) return;
    var q = pendingDecodes; pendingDecodes = [];
    q.forEach(function (p) { a.decodeAudioData(p.ab.slice(0), p.set); });
  }
  function decode(ab, set) {
    var a = audio();
    if (a) a.decodeAudioData(ab.slice(0), set);
    else pendingDecodes.push({ ab: ab, set: set });
  }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function mount(root, opts) {
    if (!root || root.__tgMounted) return;
    root.__tgMounted = true;
    opts = opts || {};
    var base = opts.base || root.getAttribute("data-base") || "assets/";
    var isSoundOn = typeof opts.isSoundOn === "function" ? opts.isSoundOn : function () { return true; };
    injectCSS();
    root.classList.add("tg");

    var canvas = document.createElement("canvas"); root.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    /* ---------- assets ---------- */
    function img(src) { var i = new Image(); i.src = src; return i; }
    var monitorImg = img(base + "desk/moniter.png");
    var cactusImg = img(base + "desk/sculpture.png");
    var ballImg = img(base + "game/ball.png");
    var greenImg = img(base + "game/collectable.png");
    var coinImg = img(base + "game/coin.png");
    var capImg = img(base + "desk/keycap_0.png");

    var fontReady = false;
    try {
      var f = new FontFace("DNFBitBit", "url(" + base + "fonts/DNFBitBitv2.ttf)");
      f.load().then(function (ff) { document.fonts.add(ff); fontReady = true; });
    } catch (e) { fontReady = true; }
    function px(n) { return Math.round(n) + "px " + (fontReady ? "'DNFBitBit'," : "") + "sans-serif"; }

    /* ---------- switch sound bank ---------- */
    var bank = [], bankId = null, lastHitAt = 0;
    var sndCache = {};
    function loadBank(id) {
      bankId = id; bank = [];
      var n = SWITCH_CLIPS[id] || 5;
      for (var i = 0; i < n; i++) (function (i) {
        var url = base + "audio/switch/" + id + "/" + i + ".m4a";
        if (sndCache[url]) { bank[i] = sndCache[url]; return; }
        fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
          decode(ab, function (buf) { sndCache[url] = buf; if (bankId === id) bank[i] = buf; });
        }).catch(function () {});
      })(i);
    }
    function playClip(buf, vol) {
      var a = audio(); if (!a || !buf || !isSoundOn()) return;
      var s = a.createBufferSource(); s.buffer = buf;
      var g = a.createGain(); g.gain.value = vol || 0.9;
      s.connect(g); g.connect(a.destination); s.start();
    }
    function thock() {
      var now = performance.now();
      if (now - lastHitAt < 26) return;          // rate-limit hit sounds
      lastHitAt = now;
      var ready = bank.filter(Boolean);
      if (ready.length) playClip(ready[(Math.random() * ready.length) | 0], 0.9);
    }
    var fxCoin = null, fxPop = null;
    function loadFx(url, set) {
      fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
        decode(ab, set);
      }).catch(function () {});
    }
    loadBank(opts.switchId || "4000");
    loadFx(base + "audio/coin.mp3", function (b) { fxCoin = b; });
    loadFx(base + "audio/collect.mp3", function (b) { fxPop = b; });

    /* ---------- layout ---------- */
    var W = 0, H = 0, room = {}, field = {}, cell = 0, ballR = 0;
    function resize() {
      var r = root.getBoundingClientRect(); if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      room = { h: H * 0.215 };
      field = { x: W * 0.03, y: room.h + H * 0.008, w: W * 0.94, h: H * 0.685 };
      field.bottom = field.y + field.h;
      cell = field.w / COLS;
      ballR = cell * 0.16;
    }
    resize();
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(root);

    /* ---------- state ---------- */
    var blocks = [], greens = [], balls = [], fxParts = [], coinsFalling = [];
    var level = START_LEVEL, ballCount = START_BALLS, coins = 0;
    var best = 0; try { best = parseInt(localStorage.getItem("tg-best") || "0", 10) || 0; } catch (e) {}
    var phase = "idle";                  // idle | aiming | firing | over
    var aim = { x: 0, y: -1 }, dragging = false;
    var fireQueue = 0, fireTimer = 0, firstLandX = null, launchX = null;
    var flightStart = 0, turbo = false, pendingBalls = 0;

    function saveBest() {
      if (level > best) { best = level; try { localStorage.setItem("tg-best", String(best)); } catch (e) {} }
    }

    function reset() {
      blocks = []; greens = []; balls = []; fxParts = []; coinsFalling = [];
      level = START_LEVEL; ballCount = START_BALLS; coins = 0;
      launchX = null; firstLandX = null; turbo = false; pendingBalls = 0;
      for (var r = 0; r < SEED.length; r++) for (var c = 0; c < COLS; c++) {
        var v = SEED[r][c];
        if (v === "g") greens.push({ col: c, row: r, t: Math.random() * 6 });
        else if (v > 0) blocks.push({ col: c, row: r, hp: v, max: v, coin: false, flash: 0 });
      }
      phase = "idle";
    }

    function bx(c) { return field.x + c * cell; }
    function by(r) { return field.y + cell * 0.24 + r * cell; }

    function advance() {
      var i;
      for (i = 0; i < blocks.length; i++) blocks[i].row++;
      for (i = 0; i < greens.length; i++) greens[i].row++;
      level++; saveBest();
      // new top row: 2–4 blocks + one +ball pickup (per the game doc)
      var slots = [0, 1, 2, 3, 4, 5, 6].sort(function () { return Math.random() - 0.5; });
      var nBlocks = 2 + ((Math.random() * 3) | 0);
      for (i = 0; i < nBlocks; i++)
        blocks.push({ col: slots[i], row: 0, hp: level, max: level, coin: Math.random() < 0.28, flash: 0 });
      greens.push({ col: slots[nBlocks], row: 0, t: Math.random() * 6 });
      // game over when a live block reaches the launcher line
      for (i = 0; i < blocks.length; i++)
        if (by(blocks[i].row) + cell * 0.92 >= field.bottom - ballR * 2.4) { phase = "over"; saveBest(); return; }
      // collect stray pickups that reached the floor row
      greens = greens.filter(function (g) {
        if (by(g.row) + cell * 0.9 >= field.bottom - ballR * 2.4) { pendingBalls++; playClip(fxPop, .7); return false; }
        return true;
      });
    }

    /* ---------- input ---------- */
    function local(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function clampAim(dx, dy) {
      var len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      if (dy > -MIN_UP) { dy = -MIN_UP; var nx = Math.sqrt(Math.max(0, 1 - dy * dy)); dx = dx < 0 ? -nx : nx; }
      return { x: dx, y: dy };
    }
    root.addEventListener("pointerdown", function (e) {
      e.preventDefault(); gesture();
      if (phase === "over") { reset(); return; }
      if (phase !== "idle") return;
      dragging = true; try { root.setPointerCapture(e.pointerId); } catch (_) {}
      var p = local(e); aim = clampAim(p.x - lx(), p.y - (field.bottom - ballR * 1.4));
    });
    root.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var p = local(e); aim = clampAim(p.x - lx(), p.y - (field.bottom - ballR * 1.4));
    });
    function release() {
      if (!dragging) return; dragging = false;
      if (phase !== "idle") return;
      phase = "firing"; fireQueue = ballCount; fireTimer = 0; firstLandX = null;
      flightStart = performance.now(); turbo = false;
    }
    root.addEventListener("pointerup", release);
    root.addEventListener("pointercancel", release);

    function lx() { return launchX === null ? field.x + field.w / 2 : launchX; }

    /* ---------- physics ---------- */
    function hitBlocks(b) {
      for (var i = 0; i < blocks.length; i++) {
        var bl = blocks[i];
        var x = bx(bl.col) + cell * 0.04, y = by(bl.row), s = cell * 0.92;
        var cx = Math.max(x, Math.min(b.x, x + s)), cy = Math.max(y, Math.min(b.y, y + s));
        var dx = b.x - cx, dy = b.y - cy;
        if (dx * dx + dy * dy > ballR * ballR) continue;
        var oL = b.x - x, oR = x + s - b.x, oT = b.y - y, oB = y + s - b.y;
        if (Math.min(oL, oR) < Math.min(oT, oB)) { b.vx = -b.vx; b.x += (oL < oR ? -1 : 1) * (ballR - Math.abs(dx) + .5); }
        else { b.vy = -b.vy; b.y += (oT < oB ? -1 : 1) * (ballR - Math.abs(dy) + .5); }
        bl.flash = 1; thock();
        if (--bl.hp <= 0) {
          blocks.splice(i, 1);
          fxParts.push({ x: x + s / 2, y: y + s / 2, vx: (Math.random() - .5) * 6, vy: -4 - Math.random() * 3, rot: 0, vr: (Math.random() - .5) * .3, life: 1, s: s });
          if (bl.coin) { coinsFalling.push({ x: x + s / 2, y: y + s / 2, vy: 2 }); }
        }
        return;
      }
      for (var k = 0; k < greens.length; k++) {
        var g = greens[k], gx = bx(g.col) + cell / 2, gy = by(g.row) + cell * 0.45;
        if (Math.hypot(b.x - gx, b.y - gy) < ballR + cell * 0.2) {
          greens.splice(k, 1); pendingBalls++; playClip(fxPop, .7); return;
        }
      }
    }

    function step() {
      if (phase !== "firing") return;
      var loops = turbo ? 2 : 1;
      if (!turbo && performance.now() - flightStart > 6000 && fireQueue === 0) turbo = true;
      for (var l = 0; l < loops; l++) {
        if (fireQueue > 0 && --fireTimer <= 0) {
          balls.push({ x: lx(), y: field.bottom - ballR * 1.4, vx: aim.x * SPEED * field.h, vy: aim.y * SPEED * field.h, trail: [] });
          fireQueue--; fireTimer = STAGGER;
        }
        for (var i = balls.length - 1; i >= 0; i--) {
          var b = balls[i];
          b.x += b.vx; b.y += b.vy;
          if (b.x < field.x + ballR) { b.x = field.x + ballR; b.vx = -b.vx; }
          if (b.x > field.x + field.w - ballR) { b.x = field.x + field.w - ballR; b.vx = -b.vx; }
          if (b.y < field.y + ballR) { b.y = field.y + ballR; b.vy = Math.abs(b.vy); }
          hitBlocks(b);
          b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 5) b.trail.shift();
          if (b.y - ballR > field.bottom) {
            if (firstLandX === null) firstLandX = Math.max(field.x + ballR, Math.min(field.x + field.w - ballR, b.x));
            balls.splice(i, 1);
          }
        }
      }
      // falling coins
      for (var c = coinsFalling.length - 1; c >= 0; c--) {
        var co = coinsFalling[c]; co.y += co.vy; co.vy += 0.25;
        if (co.y > field.bottom - ballR) { coinsFalling.splice(c, 1); coins += 3 + ((Math.random() * 4) | 0); playClip(fxCoin, .6); }
      }
      if (fireQueue === 0 && balls.length === 0 && coinsFalling.length === 0) {
        if (firstLandX !== null) launchX = firstLandX;
        ballCount += pendingBalls; pendingBalls = 0; turbo = false;
        advance();
        if (phase !== "over") phase = "idle";
      }
    }

    /* ---------- render ---------- */
    function drawRoom() {
      ctx.fillStyle = "#FFE8C0"; ctx.fillRect(0, 0, W, H);
      // desk strip under the monitor
      ctx.fillStyle = "#FFF3DC"; ctx.fillRect(0, room.h - H * 0.012, W, H * 0.012);
      // monitor
      var mh = room.h * 0.86, mw = mh * 1354 / 1222, mx = W / 2 - mw / 2, my = room.h - H * 0.012 - mh;
      if (monitorImg.complete) ctx.drawImage(monitorImg, mx, my, mw, mh);
      // screen HUD
      var sx = mx + mw * 0.072, sw = mw * 0.856, sy = my + mh * 0.085, sh = mh * 0.65;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#EDEBE4"; ctx.font = px(sh * 0.17);
      ctx.fillText("BEST " + best, sx + sw / 2, sy + sh * 0.22);
      ctx.fillStyle = "#65CDA7"; ctx.font = px(sh * 0.4);
      ctx.fillText(level, sx + sw / 2, sy + sh * 0.52);
      ctx.fillStyle = "#F5B93E"; ctx.font = px(sh * 0.16);
      ctx.fillText("COIN " + coins, sx + sw / 2, sy + sh * 0.82);
      // cactus
      var ch = room.h * 0.42, cw2 = ch * 0.86;
      if (cactusImg.complete) ctx.drawImage(cactusImg, W * 0.07, room.h - H * 0.012 - ch, cw2, ch);
    }

    function drawField() {
      ctx.fillStyle = "#332B27";
      rr(ctx, field.x, field.y, field.w, field.h, 14); ctx.fill();
    }

    var hpColor = "#6B564E";
    function drawBlock(bl) {
      var x = bx(bl.col) + cell * 0.04, y = by(bl.row), s = cell * 0.92;
      var sc = bl.flash > 0 ? 1 - bl.flash * 0.08 : 1;
      if (bl.flash > 0) bl.flash = Math.max(0, bl.flash - 0.12);
      var cxp = x + s / 2, cyp = y + s / 2, ss = s * sc;
      if (capImg.complete) ctx.drawImage(capImg, cxp - ss / 2, cyp - ss / 2, ss, ss);
      ctx.fillStyle = hpColor;
      ctx.font = px(s * 0.34); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(bl.hp, cxp, cyp - s * 0.04);
    }

    function drawGreen(g) {
      g.t += 0.05;
      var gx = bx(g.col) + cell / 2, gy = by(g.row) + cell * 0.45;
      var r = cell * 0.15 * (1 + Math.sin(g.t) * 0.12);
      if (greenImg.complete) {
        ctx.globalAlpha = 0.85; ctx.drawImage(greenImg, gx - r * 2.4, gy - r * 2.4, r * 4.8, r * 4.8); ctx.globalAlpha = 1;
      }
      ctx.beginPath(); ctx.arc(gx, gy, r, 0, 6.2832);
      ctx.fillStyle = "#5FBF7E"; ctx.fill();
      ctx.strokeStyle = "#3E9C5F"; ctx.lineWidth = 2; ctx.stroke();
    }

    function drawBalls() {
      for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        for (var t = 0; t < b.trail.length; t++) {
          ctx.globalAlpha = (t / b.trail.length) * 0.3;
          ctx.beginPath(); ctx.arc(b.trail[t].x, b.trail[t].y, ballR * 0.85, 0, 6.2832);
          ctx.fillStyle = "#E4574F"; ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (ballImg.complete) ctx.drawImage(ballImg, b.x - ballR, b.y - ballR, ballR * 2, ballR * 2);
      }
    }

    function drawFx() {
      for (var i = fxParts.length - 1; i >= 0; i--) {
        var p = fxParts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.rot += p.vr; p.life -= 0.03;
        if (p.life <= 0 || p.y > H) { fxParts.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, p.life);
        if (capImg.complete) ctx.drawImage(capImg, -p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore(); ctx.globalAlpha = 1;
      }
      for (var c = 0; c < coinsFalling.length; c++) {
        var co = coinsFalling[c];
        if (coinImg.complete) ctx.drawImage(coinImg, co.x - ballR, co.y - ballR, ballR * 2, ballR * 2);
      }
    }

    function drawLauncher() {
      var x = lx(), y = field.bottom - ballR * 1.4;
      if (phase === "idle" && dragging) {
        // dashed aim line, one wall-bounce preview
        ctx.strokeStyle = "#E4574F"; ctx.lineWidth = Math.max(3, ballR * 0.4);
        ctx.setLineDash([ballR * 0.7, ballR * 0.9]); ctx.lineCap = "round";
        var px1 = x, py1 = y, dx = aim.x, dy = aim.y, remain = field.h * 0.85, bounced = false;
        ctx.beginPath(); ctx.moveTo(px1, py1);
        while (remain > 0) {
          var tWall = dx > 0 ? (field.x + field.w - ballR - px1) / dx : dx < 0 ? (field.x + ballR - px1) / dx : 1e9;
          var tTop = dy < 0 ? (field.y + ballR - py1) / dy : 1e9;
          var t = Math.min(tWall, tTop, remain);
          px1 += dx * t; py1 += dy * t; ctx.lineTo(px1, py1); remain -= t;
          if (t === tTop || bounced) break;
          dx = -dx; bounced = true;
        }
        ctx.stroke(); ctx.setLineDash([]);
      }
      if (phase !== "over") {
        if (ballImg.complete) ctx.drawImage(ballImg, x - ballR, y - ballR, ballR * 2, ballR * 2);
        var n = phase === "firing" ? fireQueue : ballCount;
        if (n > 0) {
          ctx.fillStyle = "#E4574F"; ctx.font = px(ballR * 1.5);
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText("x " + n, x + ballR * 1.6, y);
        }
      }
      if (turbo) {
        ctx.fillStyle = "#65CDA7"; ctx.font = px(ballR * 1.6);
        ctx.textAlign = "right"; ctx.fillText(">>", field.x + field.w - 10, field.y + ballR * 2);
      }
    }

    function drawHint() {
      ctx.fillStyle = "#8A6E52"; ctx.font = px(H * 0.02);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(phase === "idle" ? "드래그로 조준 · 놓으면 발사" : "", W / 2, field.bottom + (H - field.bottom) / 2);
    }

    function drawOver() {
      ctx.fillStyle = "rgba(38,30,26,.82)"; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFE8C0"; ctx.font = px(W * 0.09); ctx.textBaseline = "alphabetic";
      ctx.fillText("GAME OVER", W / 2, H * 0.46);
      ctx.fillStyle = "#65CDA7"; ctx.font = px(W * 0.045);
      ctx.fillText("SCORE " + level + " · BEST " + best, W / 2, H * 0.52);
      ctx.fillStyle = "#F5B93E"; ctx.font = px(W * 0.04);
      ctx.fillText("탭하여 다시하기", W / 2, H * 0.58);
    }

    function frame() {
      step();
      ctx.clearRect(0, 0, W, H);
      drawRoom(); drawField();
      var i;
      for (i = 0; i < greens.length; i++) drawGreen(greens[i]);
      for (i = 0; i < blocks.length; i++) drawBlock(blocks[i]);
      drawFx(); drawBalls(); drawLauncher(); drawHint();
      if (phase === "over") drawOver();
      requestAnimationFrame(frame);
    }

    reset();
    requestAnimationFrame(frame);
    root.__tg = {
      reset: reset,
      setSwitch: function (id) { loadBank(String(id)); },
      setKeycap: function (src, textColor) { capImg = img(src); if (textColor) hpColor = textColor; },
      setSounds: function (fn) { isSoundOn = fn; }
    };
  }

  function auto() {
    var els = document.querySelectorAll("[data-typer-game]");
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();

  window.TyperGame = {
    mount: mount,
    setSwitch: function (el, id) { if (el && el.__tg) el.__tg.setSwitch(id); },
    setKeycap: function (el, src, textColor) { if (el && el.__tg) el.__tg.setKeycap(src, textColor); },
    setSounds: function (el, fn) { if (el && el.__tg) el.__tg.setSounds(fn); }
  };
})();
