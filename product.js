/* NewMeans product pieces shared by the pages.
 * catalog: the game's shop data (assets/shop/catalog.json), fetched once.
 * Sound: the switch clips. Board: Typer's loop on a screen (drag to aim, keys fire, rows come down).
 * Play: the board with a switch row and the keyboard as a controller. Tilt: cards that lean to the cursor.
 * Field: 2,000 shapes, no two alike, stirred by the cursor; press and the nearest one becomes the AI sparkle. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var SPARK = 'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z';
  function t(key, vars) { var s = (window.i18n && window.i18n.t(key)) || key; return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; }); }
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function h(tag, cls, parent, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; }

  // ---------------------------------------------------------------- catalog
  var catalogP = null;
  function catalog() {
    if (!catalogP) catalogP = fetch('assets/shop/catalog.json').then(function (r) { return r.json(); }).catch(function () { return null; });
    return catalogP;
  }

  // ---------------------------------------------------------------- sound
  var CLIPS = { 4000: 4, 4001: 5, 4002: 5, 4003: 5, 4004: 5, 4005: 5, 4006: 5, 4007: 4, 4008: 6 };
  var SWITCHES = [['4000', 'Standard'], ['4001', 'Brown'], ['4002', 'Red'], ['4003', 'White'], ['4004', 'Chocolate'], ['4005', 'Capacitive'], ['4006', 'Low Profile'], ['4007', 'Blue'], ['4008', 'Purple']];
  function Sound() {
    var pools = {}, id = '4000', i = 0, muted = false;
    return {
      set: function (sw) { if (CLIPS[sw]) id = sw; },
      id: function () { return id; },
      mute: function (m) { muted = !!m; },
      muted: function () { return muted; },
      play: function () {
        if (muted) return;
        if (!pools[id]) { pools[id] = []; for (var k = 0; k < CLIPS[id]; k++) pools[id].push(new Audio('assets/audio/switch/' + id + '/' + k + '.m4a')); }
        var c = pools[id][i++ % pools[id].length]; try { c.currentTime = 0; c.play().catch(function () { }); } catch (_) { }
      }
    };
  }
  var sound = Sound();

  // ---------------------------------------------------------------- board
  var W = 700, H = 640, COLS = 7, CW = W / COLS, RH = 100, TOP = 10, LINE = H - 80, R = 11, SPD = 10;
  function mountBoard(root, opts) {
    if (!root || root.__tb) return root && root.__tb;
    opts = opts || {};
    var play = opts.play || function () { }, capSrc = opts.keycap || 'assets/shop/keycap/5000_0.png', ballSrc = opts.ball || 'assets/shop/ball/0000_0.png', ink = opts.ink || '#67544F';
    var svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tb', preserveAspectRatio: 'xMidYMid meet' }, root);
    var gBricks = mk('g', { class: 'tb__bricks' }, svg), gFx = mk('g', { class: 'tb__fx' }, svg), gBalls = mk('g', { class: 'tb__balls' }, svg);
    mk('line', { x1: 0, y1: LINE, x2: W, y2: LINE, class: 'tb__line' }, svg);
    var aim = mk('path', { class: 'tb__aim', d: '' }, svg);
    var launcher = mk('image', { href: ballSrc, x: W / 2 - R, y: H - 34 - R, width: 2 * R, height: 2 * R, class: 'tb__launcher' }, svg);
    var flash = mk('text', { x: W / 2, y: H / 2 + 14, class: 'tb__flash', 'text-anchor': 'middle', 'font-size': 52 }, svg);
    var bricks = [], balls = [], turn = 0, inTurn = false, raf = 0, lastT = 0, broken = 0, over = false, timers = [], pending = 0;
    function emit(name, detail) { root.dispatchEvent(new CustomEvent('tb:' + name, { bubbles: true, detail: detail || {} })); }
    function addBrick(c, r, hp) {
      var g = mk('g', { class: 'tb__brick', transform: 'translate(' + (c * CW) + ',' + (TOP + r * RH) + ')' }, gBricks);
      mk('image', { href: capSrc, x: 6, y: 6, width: CW - 12, height: RH - 12 }, g);
      var tx = mk('text', { x: CW / 2, y: RH / 2 + 8, 'text-anchor': 'middle', 'font-size': 34, fill: ink }, g); tx.textContent = hp;
      var b = { c: c, r: r, hp: hp, g: g, tx: tx }; bricks.push(b); return b;
    }
    function spawnRow(r, hp) { var n = 0; for (var c = 0; c < COLS; c++) if (Math.random() < 0.58) { addBrick(c, r, hp); n++; } while (n < 2) { var c2 = (Math.random() * COLS) | 0; if (!bricks.some(function (b) { return b.r === r && b.c === c2; })) { addBrick(c2, r, hp); n++; } } }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      bricks.forEach(function (b) { b.g.remove(); }); bricks = []; balls.forEach(function (b) { b.el.remove(); }); balls = [];
      turn = 0; inTurn = false; over = false; broken = 0; pending = 0;
      spawnRow(0, 3); spawnRow(1, 2); spawnRow(2, 1);
      flash.textContent = ''; flash.classList.remove('is-on'); emit('reset');
    }
    function endTurn() {
      inTurn = false; turn++;
      bricks.forEach(function (b) { b.r++; b.g.setAttribute('transform', 'translate(' + (b.c * CW) + ',' + (TOP + b.r * RH) + ')'); });
      spawnRow(0, Math.min(9, turn + 3));
      emit('turn', { turn: turn });
      if (bricks.some(function (b) { return TOP + (b.r + 1) * RH > LINE; })) gameOver();
    }
    function gameOver() { over = true; flash.textContent = 'GAME OVER'; flash.classList.add('is-on'); emit('over', { broken: broken }); timers.push(setTimeout(reset, 1500)); }
    function shards(x, y) {
      var g = mk('g', { class: 'tb__shards', transform: 'translate(' + x + ',' + y + ')' }, gFx);
      for (var i = 0; i < 5; i++) { var a = i / 5 * 6.28; mk('rect', { x: -4, y: -4, width: 8, height: 8, rx: 2, style: '--dx:' + (Math.cos(a) * 34).toFixed(0) + 'px;--dy:' + (Math.sin(a) * 34 - 10).toFixed(0) + 'px' }, g); }
      timers.push(setTimeout(function () { g.remove(); }, 600));
    }
    function hit(b) {
      play(); b.hp--;
      if (b.hp <= 0) { var i = bricks.indexOf(b); if (i >= 0) bricks.splice(i, 1); shards(b.c * CW + CW / 2, TOP + b.r * RH + RH / 2); b.g.remove(); broken++; emit('break', { broken: broken }); }
      else { b.tx.textContent = b.hp; b.g.classList.remove('is-hit'); void b.g.getBBox(); b.g.classList.add('is-hit'); }
    }
    function step(f) {
      for (var i = balls.length - 1; i >= 0; i--) {
        var ball = balls[i];
        ball.x += ball.vx * f; ball.y += ball.vy * f;
        if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx); } else if (ball.x > W - R) { ball.x = W - R; ball.vx = -Math.abs(ball.vx); }
        if (ball.y < R) { ball.y = R; ball.vy = Math.abs(ball.vy); }
        if (ball.y > H + R) { ball.el.remove(); balls.splice(i, 1); continue; }
        for (var k = 0; k < bricks.length; k++) {
          var b = bricks[k], bx = b.c * CW + 6, by = TOP + b.r * RH + 6, bw = CW - 12, bh = RH - 12;
          var nx = Math.max(bx, Math.min(bx + bw, ball.x)), ny = Math.max(by, Math.min(by + bh, ball.y)), dx = ball.x - nx, dy = ball.y - ny;
          if (dx * dx + dy * dy < R * R) {
            var ox = Math.min(ball.x + R - bx, bx + bw - (ball.x - R)), oy = Math.min(ball.y + R - by, by + bh - (ball.y - R));
            if (ox < oy) { ball.vx = ball.x < bx + bw / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx); ball.x += ball.vx > 0 ? ox : -ox; }
            else { ball.vy = ball.y < by + bh / 2 ? -Math.abs(ball.vy) : Math.abs(ball.vy); ball.y += ball.vy > 0 ? oy : -oy; }
            hit(b); break;
          }
        }
        ball.el.setAttribute('x', (ball.x - R).toFixed(1)); ball.el.setAttribute('y', (ball.y - R).toFixed(1));
      }
    }
    function tick(now) {
      raf = 0; var dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
      step(Math.min(2, dt * 60));
      if (balls.length) raf = requestAnimationFrame(tick); else { lastT = 0; if (inTurn && !pending) endTurn(); }
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }
    function launch(dx, dy) { if (over || balls.length >= 8) return; var el = mk('image', { href: ballSrc, width: 2 * R, height: 2 * R, x: W / 2 - R, y: H - 34 - R, class: 'tb__ball' }, gBalls); balls.push({ x: W / 2, y: H - 34, vx: dx * SPD, vy: dy * SPD, el: el }); inTurn = true; wake(); }
    function fire(dir, n) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      for (var i = 0; i < n; i++) { pending++; timers.push(setTimeout((function (dx, dy) { return function () { pending--; launch(dx, dy); }; })(dx, dy), i * 110)); }
      emit('fire', { n: n });
    }
    function fireKey() {
      if (over) return; var target = null, best = -1;
      bricks.forEach(function (b) { var s = b.r * 10 - Math.abs(b.c - 3); if (s > best) { best = s; target = b; } });
      var dx = target ? (target.c * CW + CW / 2 - W / 2) + (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 120, dy = target ? (TOP + target.r * RH + RH / 2) - (H - 34) : -400;
      fire([dx, dy], 1);
    }
    var aiming = false, aimFrom = null, aimDir = null;
    function toSvg(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
    function drawAim(dir) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      var x = W / 2, y = H - 34, tx = dx > 0 ? (W - R - x) / dx : dx < 0 ? (R - x) / dx : 1e9, ty = (R - y) / dy, tt = Math.min(tx, ty, 520);
      aim.setAttribute('d', 'M' + x + ' ' + y + ' L' + (x + dx * tt).toFixed(0) + ' ' + (y + dy * tt).toFixed(0));
    }
    svg.addEventListener('pointerdown', function (e) { if (over) return; e.preventDefault(); aiming = true; aimFrom = toSvg(e); aimDir = null; svg.classList.add('is-aiming'); try { svg.setPointerCapture(e.pointerId); } catch (_) { } });
    svg.addEventListener('pointermove', function (e) { if (!aiming) return; var p = toSvg(e); if (Math.hypot(p.x - aimFrom.x, p.y - aimFrom.y) < 6) return; aimDir = [p.x - W / 2, p.y - (H - 34)]; drawAim(aimDir); });
    function aimEnd(e) { if (!aiming) return; aiming = false; svg.classList.remove('is-aiming'); aim.setAttribute('d', ''); if (e.type !== 'pointerup') return; if (aimDir) fire(aimDir, 3); else fire([(Math.random() - 0.5) * 0.3, -1], 3); }
    svg.addEventListener('pointerup', aimEnd); svg.addEventListener('pointercancel', aimEnd); svg.addEventListener('lostpointercapture', aimEnd);
    reset();
    root.__tb = {
      key: fireKey, fire: fire, reset: reset,
      setBall: function (src) { ballSrc = src; launcher.setAttribute('href', src); balls.forEach(function (b) { b.el.setAttribute('href', src); }); },
      setKeycap: function (src, color) { capSrc = src; ink = color || ink; bricks.forEach(function (b) { b.g.querySelector('image').setAttribute('href', src); b.tx.setAttribute('fill', ink); }); },
      stats: function () { return { bricks: bricks.length, balls: balls.length, turn: turn, broken: broken, over: over }; }
    };
    return root.__tb;
  }

  // ---------------------------------------------------------------- play: board + switch row + keyboard as controller
  function mountPlay(root, opts) {
    if (!root || root.__play) return root && root.__playApi;
    root.__play = true; opts = opts || {};
    var boardEl = root.querySelector('[data-typer-board]'), swRow = root.querySelector('[data-switches]'), status = root.querySelector('[data-play-status]');
    if (!boardEl) return;
    var board = mountBoard(boardEl, { play: function () { sound.play(); }, ball: opts.ball, keycap: opts.keycap, ink: opts.ink }), broken = 0, seen = false;
    function setSwitch(id) { sound.set(id); if (swRow) swRow.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); }); }
    if (swRow && !swRow.children.length) SWITCHES.forEach(function (s, i) { var b = h('button', '', swRow, s[1]); b.type = 'button'; b.dataset.id = s[0]; b.setAttribute('aria-pressed', i === 0); b.addEventListener('click', function () { setSwitch(s[0]); sound.play(); }); });
    function label() { if (!status) return; status.textContent = board.stats().over ? t('typer.desk.over') : !seen ? t('typer.desk.hint') : t('typer.desk.broken', { n: broken }); }
    boardEl.addEventListener('tb:break', function (e) { broken = e.detail.broken; label(); });
    boardEl.addEventListener('tb:fire', function () { seen = true; label(); });
    boardEl.addEventListener('tb:over', label); boardEl.addEventListener('tb:reset', function () { broken = 0; label(); });
    var inView = false;
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; }); }, { threshold: 0.35 }).observe(root); else inView = true;
    document.addEventListener('keydown', function (e) {
      if (!inView || e.metaKey || e.ctrlKey || e.altKey) return;
      var tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable || tg.tagName === 'BUTTON' || tg.tagName === 'A')) return;
      if (e.key.length !== 1 && e.key !== 'Enter' && e.key !== ' ') return;
      if (e.key === ' ') e.preventDefault();
      sound.play(); seen = true; board.key(); label();
    });
    window.addEventListener('nm:langchange', label);
    setSwitch(sound.id()); label();
    root.__playApi = { board: board, setSwitch: setSwitch, setBall: board.setBall, setKeycap: board.setKeycap };
    return root.__playApi;
  }

  // ---------------------------------------------------------------- tilt cards
  function mountTilt(card) {
    if (card.__tilt || reduce) return; card.__tilt = true;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); card.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', function () { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); card.classList.remove('is-tilting'); });
  }

  // ---------------------------------------------------------------- a field of shapes, no two alike.
  // With data-mask the dark shapes spell the headline: a big number, then two lines beside it.
  function mountField(root) {
    if (!root || root.__uf) return; root.__uf = true;
    var canvas = document.createElement('canvas'); root.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dots = [], w = 0, hgt = 0, dpr = 1, px = -9999, py = -9999, lastMove = 0, raf = 0, chosen = null, chosenAt = 0;
    var INK = ['#AF3B3D', '#8B2E2F', '#CE5151'], PALE = ['#FFD6D3', '#FEE9E7', '#FFBEBA'];
    var masked = root.hasAttribute('data-mask');
    function seed(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

    // the headline drawn once into an offscreen canvas; its alpha decides which shapes go dark
    function maskData() {
      if (!masked || !w || !hgt) return null;
      var c = document.createElement('canvas'); c.width = w | 0; c.height = hgt | 0;
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.textBaseline = 'middle';
      var num = root.getAttribute('data-num') || '1000', a = t('dopa.count.a'), b = t('dopa.count.b');
      var wide = w / hgt >= 1.7, numSize, lineSize;
      if (wide) { numSize = Math.min(hgt * .66, w * .3); lineSize = numSize * .30; }
      else { numSize = Math.min(hgt * .32, w * .46); lineSize = numSize * .46; }
      function fNum() { x.font = '800 ' + numSize + 'px SUIT, sans-serif'; }
      function fA() { x.font = '700 ' + lineSize + 'px SUIT, sans-serif'; }
      function fB() { x.font = '800 ' + lineSize + 'px Hahmlet, SUIT, sans-serif'; }
      fNum(); var numW = x.measureText(num).width;
      fA(); var aW = x.measureText(a).width;
      fB(); var bW = x.measureText(b).width;
      var lineW = Math.max(aW, bW), lead = lineSize * 1.14;
      if (wide) {
        var gap = numSize * .10, x0 = (w - (numW + gap + lineW)) / 2, cy = hgt / 2;
        fNum(); x.fillText(num, x0, cy);
        fA(); x.fillText(a, x0 + numW + gap, cy - lead / 2);
        fB(); x.fillText(b, x0 + numW + gap, cy + lead / 2);
      } else {
        var cy2 = hgt / 2 - lead * .55;
        fNum(); x.fillText(num, (w - numW) / 2, cy2);
        fA(); x.fillText(a, (w - aW) / 2, cy2 + numSize * .58 + lead * .3);
        fB(); x.fillText(b, (w - bW) / 2, cy2 + numSize * .58 + lead * 1.3);
      }
      return x.getImageData(0, 0, c.width, c.height).data;
    }

    function layout() {
      var r = root.getBoundingClientRect(); w = r.width; hgt = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      if (!w || !hgt) return;
      canvas.width = w * dpr; canvas.height = hgt * dpr; canvas.style.width = w + 'px'; canvas.style.height = hgt + 'px';
      var mask = maskData();
      var step = Math.max(w < 620 ? 4.8 : 6.5, Math.min(11, Math.sqrt(w * hgt / 14000)));
      dots = []; var i = 0;
      for (var gy = step * .6; gy < hgt; gy += step) {
        for (var gx = step * .6; gx < w; gx += step) {
          i++;
          var inside = false;
          if (mask) { var k = ((gy | 0) * (w | 0) + (gx | 0)) * 4 + 3; inside = mask[k] > 120; }
          if (mask && !inside && seed(i) > .30) continue;           // outside the letters, a light scatter
          var s1 = seed(i), s2 = seed(i + 7), s3 = seed(i + 99), j = inside ? .14 : .42;
          var hx = gx + (s1 - .5) * step * j, hy = gy + (s2 - .5) * step * j;
          dots.push({
            hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0,
            n: 3 + ((s3 * 6) | 0), rot: s1 * 6.28,
            size: step * (inside ? .46 : .30) * (.82 + s2 * .36),
            col: (inside ? INK : PALE)[(s3 * 3) | 0], ink: inside
          });
        }
      }
      draw(1);
    }
    function star(d, s) { ctx.beginPath(); for (var k = 0; k < 4; k++) { var a = d.rot + k * Math.PI / 2, b = a + Math.PI / 4; ctx.lineTo(d.x + Math.cos(a) * s, d.y + Math.sin(a) * s); ctx.lineTo(d.x + Math.cos(b) * s * .28, d.y + Math.sin(b) * s * .28); } ctx.closePath(); }
    function draw(f) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, hgt);
      var now = performance.now(), live = now - lastMove < 1500, any = false, glow = chosen && now - chosenAt < 1800;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.vx += (d.hx - d.x) * .06 * f; d.vy += (d.hy - d.y) * .06 * f;
        if (live) { var dx = d.x - px, dy = d.y - py, dist = Math.hypot(dx, dy); if (dist < 110 && dist > .1) { var k = (1 - dist / 110); d.vx += dx / dist * k * 6 * f; d.vy += dy / dist * k * 6 * f; d.rot += k * .3 * f; } }
        d.vx *= .82; d.vy *= .82; d.x += d.vx * f; d.y += d.vy * f;
        if (Math.abs(d.vx) + Math.abs(d.vy) > .05) any = true;
        var s = d.size;
        if (d === chosen) { var q = Math.min(1, (now - chosenAt) / 400); star(d, s * (1 + q * 2.4)); ctx.fillStyle = '#FF6666'; ctx.globalAlpha = 1; ctx.fill(); continue; }
        ctx.beginPath();
        for (var k2 = 0; k2 < d.n; k2++) { var a = d.rot + k2 / d.n * 6.283; var X = d.x + Math.cos(a) * s, Y = d.y + Math.sin(a) * s; if (k2) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        ctx.closePath(); ctx.fillStyle = d.col; ctx.globalAlpha = d.ink ? 1 : .9; ctx.fill();
      }
      ctx.globalAlpha = 1;
      return any || live || glow;
    }
    function tick() { raf = 0; if (draw(1)) raf = requestAnimationFrame(tick); }
    function pointer(e) { var r = root.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now(); if (!raf) raf = requestAnimationFrame(tick); }
    root.addEventListener('pointermove', pointer);
    root.addEventListener('pointerdown', function (e) { pointer(e); var best = null, bd = 1e9; dots.forEach(function (d) { var dd = Math.hypot(d.x - px, d.y - py); if (dd < bd) { bd = dd; best = d; } }); chosen = best; chosenAt = performance.now(); });
    root.addEventListener('pointerleave', function () { px = py = -9999; lastMove = performance.now(); if (!raf) raf = requestAnimationFrame(tick); });
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('nm:langchange', layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(root); else addEventListener('resize', layout);
  }

  function auto() {
    document.querySelectorAll('[data-typer-play]').forEach(function (r) { mountPlay(r); });
    document.querySelectorAll('[data-tilt]').forEach(mountTilt);
    document.querySelectorAll('[data-unique-field]').forEach(mountField);
    if (window.IntersectionObserver) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.14 }); document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); }); }
    else document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  window.NewMeansProduct = { catalog: catalog, sound: sound, switches: SWITCHES, clips: CLIPS, board: mountBoard, play: mountPlay, tilt: mountTilt, field: mountField, sparkPath: SPARK };
})();
