/* Typer — playable block-breaker, a light web port of the mobile game's core loop.
 * Self-contained module: injects its own CSS, builds a canvas, and runs the game.
 * Aim by dragging, release to fire a burst of balls; they bounce and chip the
 * numbered keycap blocks. Each turn the board drops a row and a new one spawns;
 * a block reaching the launcher ends the run. Faithful to the beginner board in
 * the Unity source (7 slots, 5 balls, level 5, checkerboard rows, a coin pickup).
 * Usage: <div data-typer-game></div> (page sets width; aspect handled here). */
(function () {
  "use strict";

  var COLS = 7;                 // SlotCount from the source
  var START_BALLS = 5, START_LEVEL = 5;
  var ROW_LIMIT = 8;            // blocks may occupy rows 0..ROW_LIMIT-1; reaching the floor row = over
  var SPEED = 0.017;            // ball speed as a fraction of playfield height, per frame
  var STAGGER = 5;              // frames between balls in a burst
  var MIN_UP = 0.26;            // aim clamp: launch dir must rise at least this much (keeps it off the flat)

  // Beginner board from BeginnerInitialBoardFactory.cs (0 = empty, n = HP, 'c' = coin).
  var SEED = [
    [0, 1, 0, 1, 0, 1, 0],
    [5, 0, "c", 0, 1, 0, 1],
    [0, 2, 0, 2, 0, 2, 0]
  ];

  var CSS =
    ".tpg{position:relative;width:100%;aspect-ratio:3/4;border-radius:16px;overflow:hidden;" +
    "background:#FFE8C0;touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".tpg canvas{display:block;width:100%;height:100%}" +
    ".tpg__hint{position:absolute;left:0;right:0;bottom:10px;text-align:center;pointer-events:none;" +
    "font:600 12px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.06em;color:#8A6E52;" +
    "transition:opacity .3s}";

  function injectCSS() {
    if (document.getElementById("tp-game-css")) return;
    var s = document.createElement("style"); s.id = "tp-game-css"; s.textContent = CSS;
    document.head.appendChild(s);
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
    if (!root || root.__tpgameMounted) return;
    root.__tpgameMounted = true;
    opts = opts || {};
    var base = opts.base || root.getAttribute("data-base") || "assets/";
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    injectCSS();
    root.classList.add("tpg");

    var canvas = document.createElement("canvas"); root.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var hint = document.createElement("div"); hint.className = "tpg__hint"; root.appendChild(hint);

    var ballImg = new Image(); ballImg.src = base + "game/ball.png"; var ballReady = false;
    ballImg.onload = function () { ballReady = true; };

    // ---- layout (device-pixel accurate) ----
    var W = 0, H = 0, cell = 0, padX = 0, topPad = 0, floorY = 0, launchX = 0, ballR = 0;
    function resize() {
      var r = root.getBoundingClientRect(); if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      padX = W * 0.05;
      cell = (W - padX * 2) / COLS;
      topPad = H * 0.14;                 // HUD strip
      floorY = H - H * 0.11;             // launcher line
      launchX = launchX || W / 2;
      ballR = cell * 0.13;
    }
    resize();
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(root);

    // ---- state ----
    var blocks = [];   // {col,row,hp,max} ; coins live in a parallel list
    var coins = [];    // {col,row}
    var balls = [];    // {x,y,vx,vy,trail:[]}
    var level = START_LEVEL, ballCount = START_BALLS, best = 0;
    var phase = "idle"; // idle | aiming | firing | over
    var aim = { x: 0, y: -1 }, dragging = false;
    var fireQueue = 0, fireTimer = 0, nextLaunchX = null, firstLandX = null;

    function reset() {
      blocks = []; coins = []; balls = [];
      level = START_LEVEL; ballCount = START_BALLS; best = 0;
      for (var rI = 0; rI < SEED.length; rI++) {
        for (var c = 0; c < COLS; c++) {
          var v = SEED[rI][c];
          if (v === "c") coins.push({ col: c, row: rI });
          else if (v > 0) blocks.push({ col: c, row: rI, hp: v, max: v });
        }
      }
      phase = "idle"; nextLaunchX = null; launchX = W / 2;
    }

    function blockX(c) { return padX + c * cell; }
    function blockY(rw) { return topPad + rw * cell; }

    // spawn a fresh top row, shove everything down one row
    function advance() {
      var i;
      for (i = 0; i < blocks.length; i++) blocks[i].row++;
      for (i = 0; i < coins.length; i++) coins[i].row++;
      level++;
      var pattern = [];
      for (var c = 0; c < COLS; c++) pattern.push(Math.random() < 0.5 ? 0 : 1);
      if (pattern.indexOf(1) === -1) pattern[(Math.random() * COLS) | 0] = 1;
      for (c = 0; c < COLS; c++) {
        if (pattern[c]) {
          var hp = Math.max(1, level - ((Math.random() * 3) | 0));
          blocks.push({ col: c, row: 0, hp: hp, max: hp });
        } else if (Math.random() < 0.12) {
          coins.push({ col: c, row: 0 });
        }
      }
      // game over if anything reached the floor row
      for (i = 0; i < blocks.length; i++) {
        if (blockY(blocks[i].row) + cell >= floorY) { phase = "over"; return; }
      }
    }

    // ---- input ----
    function local(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function clampAim(dx, dy) {
      var len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      if (dy > -MIN_UP) {                 // force an upward launch
        dy = -MIN_UP;
        var nx = Math.sqrt(Math.max(0, 1 - dy * dy));
        dx = dx < 0 ? -nx : nx;
      }
      return { x: dx, y: dy };
    }
    root.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      if (phase === "over") { reset(); return; }
      if (phase !== "idle") return;
      dragging = true; try { root.setPointerCapture(e.pointerId); } catch (_) {}
      var p = local(e); aim = clampAim(p.x - launchX, p.y - floorY);
    });
    root.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var p = local(e); aim = clampAim(p.x - launchX, p.y - floorY);
    });
    function release() {
      if (!dragging) return; dragging = false;
      if (phase !== "idle") return;
      phase = "firing"; fireQueue = ballCount; fireTimer = 0;
      nextLaunchX = null; firstLandX = null;
    }
    root.addEventListener("pointerup", release);
    root.addEventListener("pointercancel", release);

    // ---- physics helpers ----
    function landBall(x) {
      if (firstLandX === null) firstLandX = Math.max(ballR + padX, Math.min(W - ballR - padX, x));
    }
    function hitBlocks(b) {
      for (var i = 0; i < blocks.length; i++) {
        var bl = blocks[i], bx = blockX(bl.col) + cell * 0.05, by = blockY(bl.row) + cell * 0.05;
        var bw = cell * 0.9, bh = cell * 0.9;
        var cxp = Math.max(bx, Math.min(b.x, bx + bw));
        var cyp = Math.max(by, Math.min(b.y, by + bh));
        var dx = b.x - cxp, dy = b.y - cyp;
        if (dx * dx + dy * dy > ballR * ballR) continue;
        // reflect on the axis of shallower penetration
        var overL = b.x - bx, overR = bx + bw - b.x, overT = b.y - by, overB = by + bh - b.y;
        var minX = Math.min(overL, overR), minY = Math.min(overT, overB);
        if (minX < minY) { b.vx = -b.vx; b.x += (overL < overR ? -1 : 1) * (ballR - Math.abs(dx) + 0.5); }
        else { b.vy = -b.vy; b.y += (overT < overB ? -1 : 1) * (ballR - Math.abs(dy) + 0.5); }
        if (--bl.hp <= 0) { blocks.splice(i, 1); best += bl.max; }
        return;
      }
      // coin pickups → +1 ball next turn
      for (var k = 0; k < coins.length; k++) {
        var co = coins[k], ccx = blockX(co.col) + cell / 2, ccy = blockY(co.row) + cell / 2;
        if (Math.hypot(b.x - ccx, b.y - ccy) < ballR + cell * 0.22) { coins.splice(k, 1); ballCount++; return; }
      }
    }

    function step() {
      if (phase === "firing") {
        if (fireQueue > 0 && --fireTimer <= 0) {
          balls.push({ x: launchX, y: floorY - ballR, vx: aim.x * SPEED * H, vy: aim.y * SPEED * H, trail: [] });
          fireQueue--; fireTimer = STAGGER;
        }
        for (var i = balls.length - 1; i >= 0; i--) {
          var b = balls[i];
          b.x += b.vx; b.y += b.vy;
          if (b.x < padX + ballR) { b.x = padX + ballR; b.vx = -b.vx; }
          if (b.x > W - padX - ballR) { b.x = W - padX - ballR; b.vx = -b.vx; }
          if (b.y < topPad + ballR) { b.y = topPad + ballR; b.vy = Math.abs(b.vy); }
          hitBlocks(b);
          if (!reduce) { b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 6) b.trail.shift(); }
          if (b.y - ballR > floorY) { landBall(b.x); balls.splice(i, 1); }
        }
        if (fireQueue === 0 && balls.length === 0) {
          if (firstLandX !== null) launchX = firstLandX;
          advance();
          if (phase !== "over") phase = "idle";
        }
      }
    }

    // ---- render ----
    function drawBlock(bl) {
      var x = blockX(bl.col) + cell * 0.05, y = blockY(bl.row) + cell * 0.05, s = cell * 0.9;
      var t = Math.min(1, bl.hp / 12);
      // warm keycap face that shifts toward mint as HP climbs
      var rr2 = Math.round(243 + (101 - 243) * t), gg = Math.round(232 + (205 - 232) * t), bb = Math.round(208 + (167 - 208) * t);
      ctx.fillStyle = "rgb(" + rr2 + "," + gg + "," + bb + ")";
      rr(ctx, x, y, s, s, s * 0.16); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.5)"; rr(ctx, x, y, s, s * 0.34, s * 0.16); ctx.fill(); // top highlight
      ctx.strokeStyle = "rgba(0,0,0,.14)"; ctx.lineWidth = 1; rr(ctx, x + .5, y + .5, s - 1, s - 1, s * 0.16); ctx.stroke();
      ctx.fillStyle = t > 0.5 ? "#F7FBF9" : "#67544F";
      ctx.font = "700 " + (s * 0.42) + "px 'Space Grotesk',system-ui,sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(bl.hp, x + s / 2, y + s / 2 + s * 0.02);
    }
    function drawCoin(co) {
      var cx = blockX(co.col) + cell / 2, cy = blockY(co.row) + cell / 2, r = cell * 0.2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832);
      ctx.fillStyle = "#65CDA7"; ctx.fill();
      ctx.strokeStyle = "#3F9E7E"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#1E5C48"; ctx.font = "700 " + (r * 1.1) + "px 'Space Grotesk',sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("+", cx, cy + 1);
    }
    function drawBall(b) {
      if (b.trail.length) {
        for (var i = 0; i < b.trail.length; i++) {
          ctx.globalAlpha = (i / b.trail.length) * 0.35;
          ctx.beginPath(); ctx.arc(b.trail[i].x, b.trail[i].y, ballR * 0.8, 0, 6.2832);
          ctx.fillStyle = "#E86E67"; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      if (ballReady) ctx.drawImage(ballImg, b.x - ballR, b.y - ballR, ballR * 2, ballR * 2);
      else { ctx.beginPath(); ctx.arc(b.x, b.y, ballR, 0, 6.2832); ctx.fillStyle = "#E86E67"; ctx.fill(); }
    }
    function drawAim() {
      var x = launchX, y = floorY - ballR, dx = aim.x * SPEED * H, dy = aim.y * SPEED * H, dots = 0;
      ctx.fillStyle = "rgba(101,205,167,.9)";
      for (var s = 0; s < 260 && dots < 22; s++) {
        x += dx; y += dy;
        if (x < padX + ballR || x > W - padX - ballR) dx = -dx;
        if (y < topPad + ballR) break;
        if (s % 12 === 0) { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.2832); ctx.fill(); dots++; }
      }
    }
    function drawHUD() {
      ctx.fillStyle = "#4A3B2E";
      ctx.font = "700 " + (topPad * 0.34) + "px 'IBM Plex Mono',monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("LV " + level, padX, topPad * 0.5);
      ctx.textAlign = "right";
      ctx.fillText("● " + ballCount, W - padX, topPad * 0.5);
      // launcher
      ctx.beginPath(); ctx.arc(launchX, floorY - ballR, ballR * 1.15, 0, 6.2832);
      ctx.fillStyle = "#332B27"; ctx.fill();
    }
    function overlay(text, sub) {
      ctx.fillStyle = "rgba(51,43,39,.72)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFE8C0"; ctx.textAlign = "center";
      ctx.font = "700 " + (W * 0.075) + "px 'Space Grotesk',sans-serif"; ctx.textBaseline = "alphabetic";
      ctx.fillText(text, W / 2, H / 2);
      ctx.fillStyle = "#65CDA7"; ctx.font = "600 " + (W * 0.036) + "px 'IBM Plex Mono',monospace";
      ctx.fillText(sub, W / 2, H / 2 + W * 0.07);
    }

    function frame() {
      step();
      ctx.clearRect(0, 0, W, H);
      // playfield
      ctx.fillStyle = "#332B27";
      rr(ctx, padX * 0.4, topPad - cell * 0.15, W - padX * 0.8, floorY - topPad + cell * 0.3, 12); ctx.fill();
      var i;
      for (i = 0; i < coins.length; i++) drawCoin(coins[i]);
      for (i = 0; i < blocks.length; i++) drawBlock(blocks[i]);
      drawHUD();
      if (phase === "idle" && dragging) drawAim();
      for (i = 0; i < balls.length; i++) drawBall(balls[i]);

      if (phase === "idle") { hint.style.opacity = "1"; hint.textContent = "드래그해서 조준 · 놓으면 발사"; }
      else hint.style.opacity = "0";
      if (phase === "over") overlay("GAME OVER", "탭하여 다시하기 · " + best);

      requestAnimationFrame(frame);
    }

    reset();
    requestAnimationFrame(frame);
    root.__tpgame = { reset: reset };
  }

  function auto() {
    var els = document.querySelectorAll("[data-typer-game]");
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
  window.TyperGame = { mount: mount };
})();
