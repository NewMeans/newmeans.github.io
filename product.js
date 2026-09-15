/* NewMeans product pieces, shared by the home and the product pages.
 * Scene: a pinned viewport on the home; scroll progress becomes one number (--p) and CSS choreographs it.
 * Board: Typer's loop on a screen. Drag to aim, release to fire, every keycap hit plays the switch, rows come down.
 * Play: the board with its own switch sounds, a switch row and the real keyboard as a controller.
 * Report: Dopamine University's research report; the needle follows the pointer.
 * Tilt: cards that lean toward the cursor. Field: 2,000 shapes, no two alike, stirred by the cursor. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function t(key, vars) { var s = (window.i18n && window.i18n.t(key)) || key; return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; }); }
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function h(tag, cls, parent, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; }

  // ======================================================================
  // Switch sounds: the game's own clips
  // ======================================================================
  var CLIPS = { 4000: 4, 4001: 5, 4002: 5, 4003: 5, 4004: 5, 4005: 5, 4006: 5 };
  var SWITCHES = [['4000', 'Blue'], ['4001', 'Brown'], ['4002', 'Red'], ['4003', 'Chocolate'], ['4004', 'Capacitive'], ['4005', 'Low Profile'], ['4006', 'White']];
  function Sound() {
    var pools = {}, id = '4000', i = 0;
    return {
      set: function (sw) { id = sw; },
      play: function () {
        if (!pools[id]) { pools[id] = []; for (var k = 0; k < CLIPS[id]; k++) pools[id].push(new Audio('assets/audio/switch/' + id + '/' + k + '.m4a')); }
        var c = pools[id][i++ % pools[id].length]; try { c.currentTime = 0; c.play().catch(function () { }); } catch (_) { }
      }
    };
  }
  var sound = Sound();
  var touched = false; document.addEventListener('pointerdown', function () { touched = true; }, { once: true });

  // ======================================================================
  // Scenes on the home
  // ======================================================================
  var PATH = [[0.18, 60, -40], [0.34, 184, 239], [0.44, 308, 110], [0.54, 432, 239], [0.62, 494, 166], [0.69, 556, 239], [0.88, 820, -70]];   // [progress, x, y] in stage units
  function ballAt(p) {
    if (p <= PATH[0][0]) return [PATH[0][1], PATH[0][2]];
    for (var i = 1; i < PATH.length; i++) { if (p <= PATH[i][0]) { var a = PATH[i - 1], b = PATH[i], k = (p - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; } }
    var e = PATH[PATH.length - 1]; return [e[1], e[2]];
  }
  function mountScene(root) {
    if (!root || root.__scene) return; root.__scene = true;
    var pin = root.querySelector('.scene__pin'), narrow = matchMedia('(max-width: 720px)'), raf = 0, seen = true, last = -1, kind = root.getAttribute('data-scene');
    var ball = root.querySelector('.ball'), reveal = root.querySelector('.trail rect'), hits = [0.34, 0.54, 0.69], heard = {};
    function apply(p) {
      root.style.setProperty('--p', p);
      if (ball) { var b = ballAt(p); root.style.setProperty('--bx', b[0].toFixed(1)); root.style.setProperty('--by', b[1].toFixed(1)); if (reveal) reveal.setAttribute('width', Math.max(0, b[0] + 8).toFixed(0)); }
    }
    function update() {
      raf = 0;
      if (reduce || narrow.matches) { root.classList.add('is-static'); apply(1); return; }
      root.classList.remove('is-static');
      var r = root.getBoundingClientRect(), total = root.offsetHeight - pin.offsetHeight, p = total > 0 ? Math.min(1, Math.max(0, (64 - r.top) / total)) : 1;
      p = Math.round(p * 1000) / 1000; if (p === last) return;
      if (kind === 'typer' && touched) hits.forEach(function (hp, i) { if (last < hp && p >= hp && !heard[i]) { heard[i] = 1; sound.play(); setTimeout(function () { heard[i] = 0; }, 800); } });
      last = p; apply(p);
    }
    function ask() { if (!raf && seen) raf = requestAnimationFrame(update); }
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask);
    if (narrow.addEventListener) narrow.addEventListener('change', ask);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; if (seen) ask(); }); }, { rootMargin: '30% 0px' }).observe(root);
    // the pointer: keycaps press and play the switch; the report leans toward the cursor
    root.querySelectorAll('.cap').forEach(function (k) {
      k.addEventListener('pointerenter', function () { k.classList.add('is-down'); });
      k.addEventListener('pointerleave', function () { k.classList.remove('is-down'); });
      k.addEventListener('click', function () { sound.play(); });
    });
    var rep = root.querySelector('.report'); if (rep) mountReport(rep);
    update();
  }

  // ======================================================================
  // The research report: leans toward the cursor, the needle follows it
  // ======================================================================
  function mountReport(card) {
    if (!card || card.__rep || reduce) return; card.__rep = true;
    var needle = card.querySelector('.report__needle');
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      if (needle && card.classList.contains('is-done')) needle.style.left = (18 + x * 64).toFixed(1) + '%';
    });
    card.addEventListener('pointerleave', function () { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); });
  }

  // ======================================================================
  // Typer board
  // ======================================================================
  var W = 700, H = 640, COLS = 7, CW = W / COLS, RH = 100, TOP = 10, LINE = H - 80, R = 10, SPD = 10;
  function mountBoard(root, opts) {
    if (!root || root.__tb) return root && root.__tb;
    opts = opts || {};
    var play = opts.play || function () { };
    var svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tb', preserveAspectRatio: 'xMidYMid meet' }, root);
    var gBricks = mk('g', { class: 'tb__bricks' }, svg), gFx = mk('g', { class: 'tb__fx' }, svg), gBalls = mk('g', { class: 'tb__balls' }, svg);
    mk('line', { x1: 0, y1: LINE, x2: W, y2: LINE, class: 'tb__line' }, svg);
    var aim = mk('path', { class: 'tb__aim', d: '' }, svg);
    mk('circle', { cx: W / 2, cy: H - 34, r: 11, class: 'tb__launcher' }, svg);
    var flash = mk('text', { x: W / 2, y: H / 2 + 14, class: 'tb__flash', 'text-anchor': 'middle', 'font-size': 52 }, svg);
    var bricks = [], balls = [], turn = 0, inTurn = false, raf = 0, lastT = 0, broken = 0, over = false, timers = [], pending = 0;
    function emit(name, detail) { root.dispatchEvent(new CustomEvent('tb:' + name, { bubbles: true, detail: detail || {} })); }
    function addBrick(c, r, hp) {
      var g = mk('g', { class: 'tb__brick', transform: 'translate(' + (c * CW) + ',' + (TOP + r * RH) + ')' }, gBricks);
      mk('image', { href: 'assets/shop/keycap/5000_0.png', x: 6, y: 6, width: CW - 12, height: RH - 12 }, g);
      var tx = mk('text', { x: CW / 2, y: RH / 2 + 8, 'text-anchor': 'middle', 'font-size': 34 }, g); tx.textContent = hp;
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
      for (var i = 0; i < 5; i++) { var a = i / 5 * 6.28; mk('rect', { x: -6, y: -6, width: 12, height: 12, rx: 3, style: '--dx:' + (Math.cos(a) * 34).toFixed(0) + 'px;--dy:' + (Math.sin(a) * 34 - 10).toFixed(0) + 'px' }, g); }
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
        ball.el.setAttribute('cx', ball.x.toFixed(1)); ball.el.setAttribute('cy', ball.y.toFixed(1));
      }
    }
    function tick(now) {
      raf = 0; var dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
      step(Math.min(2, dt * 60));
      if (balls.length) raf = requestAnimationFrame(tick); else { lastT = 0; if (inTurn && !pending) endTurn(); }
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }
    function launch(dx, dy) { if (over || balls.length >= 8) return; var el = mk('circle', { r: R, cx: W / 2, cy: H - 30, class: 'tb__ball' }, gBalls); balls.push({ x: W / 2, y: H - 30, vx: dx * SPD, vy: dy * SPD, el: el }); inTurn = true; wake(); }
    function fire(dir, n) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      for (var i = 0; i < n; i++) { pending++; timers.push(setTimeout((function (dx, dy) { return function () { pending--; launch(dx, dy); }; })(dx, dy), i * 110)); }
      emit('fire', { n: n });
    }
    function fireKey() {
      if (over) return; var target = null, best = -1;
      bricks.forEach(function (b) { var s = b.r * 10 - Math.abs(b.c - 3); if (s > best) { best = s; target = b; } });
      var dx = target ? (target.c * CW + CW / 2 - W / 2) + (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 120, dy = target ? (TOP + target.r * RH + RH / 2) - (H - 30) : -400;
      fire([dx, dy], 1);
    }
    var aiming = false, aimFrom = null, aimDir = null;
    function toSvg(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
    function drawAim(dir) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      var x = W / 2, y = H - 30, tx = dx > 0 ? (W - R - x) / dx : dx < 0 ? (R - x) / dx : 1e9, ty = (R - y) / dy, tt = Math.min(tx, ty, 520);
      aim.setAttribute('d', 'M' + x + ' ' + y + ' L' + (x + dx * tt).toFixed(0) + ' ' + (y + dy * tt).toFixed(0));
    }
    svg.addEventListener('pointerdown', function (e) { if (over) return; e.preventDefault(); aiming = true; aimFrom = toSvg(e); aimDir = null; svg.classList.add('is-aiming'); try { svg.setPointerCapture(e.pointerId); } catch (_) { } });
    svg.addEventListener('pointermove', function (e) { if (!aiming) return; var p = toSvg(e); if (Math.hypot(p.x - aimFrom.x, p.y - aimFrom.y) < 6) return; aimDir = [p.x - W / 2, p.y - (H - 30)]; drawAim(aimDir); });
    function aimEnd(e) { if (!aiming) return; aiming = false; svg.classList.remove('is-aiming'); aim.setAttribute('d', ''); if (e.type !== 'pointerup') return; if (aimDir) fire(aimDir, 3); else fire([(Math.random() - 0.5) * 0.3, -1], 3); }
    svg.addEventListener('pointerup', aimEnd); svg.addEventListener('pointercancel', aimEnd); svg.addEventListener('lostpointercapture', aimEnd);
    reset();
    root.__tb = { key: fireKey, fire: fire, reset: reset, stats: function () { return { bricks: bricks.length, balls: balls.length, turn: turn, broken: broken, over: over }; } };
    return root.__tb;
  }

  // ======================================================================
  // Play: the board in a frame, a switch row, the real keyboard as a controller
  // ======================================================================
  function mountPlay(root) {
    if (!root || root.__play) return; root.__play = true;
    var boardEl = root.querySelector('[data-typer-board]'), swRow = root.querySelector('[data-switches]'), status = root.querySelector('[data-play-status]'), swName = root.querySelector('[data-switch-name]');
    if (!boardEl) return;
    var board = mountBoard(boardEl, { play: function () { sound.play(); } }), broken = 0, seen = false;
    function setSwitch(id) { sound.set(id); var n = SWITCHES.filter(function (s) { return s[0] === id; })[0]; if (swName) swName.textContent = n ? n[1] : id; if (swRow) swRow.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); }); }
    if (swRow) SWITCHES.forEach(function (s, i) { var b = h('button', '', swRow, s[1]); b.type = 'button'; b.dataset.id = s[0]; b.setAttribute('aria-pressed', i === 0); b.addEventListener('click', function () { setSwitch(s[0]); sound.play(); }); });
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
    setSwitch('4000'); label();
    root.__playApi = { board: board, setSwitch: setSwitch };
  }

  // ======================================================================
  // Tilt cards
  // ======================================================================
  function mountTilt(card) {
    if (card.__tilt || reduce) return; card.__tilt = true;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); card.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', function () { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); card.classList.remove('is-tilting'); });
  }

  // ======================================================================
  // 2,000 results, no two alike
  // ======================================================================
  function mountField(root) {
    if (!root || root.__uf) return; root.__uf = true;
    var canvas = document.createElement('canvas'); root.appendChild(canvas); var ctx = canvas.getContext('2d');
    var N = +root.getAttribute('data-n') || 2000, dots = [], w = 0, hgt = 0, dpr = 1, px = -9999, py = -9999, lastMove = 0, raf = 0;
    var cols = ['#FF6666', '#F26A68', '#CE5151', '#FFBEBA', '#AF3B3D', '#FF8A80'];
    function seed(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
    function layout() {
      var r = root.getBoundingClientRect(); w = r.width; hgt = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = w * dpr; canvas.height = hgt * dpr; canvas.style.width = w + 'px'; canvas.style.height = hgt + 'px';
      var cols_ = Math.ceil(Math.sqrt(N * w / hgt)), rows = Math.ceil(N / cols_), cw = w / cols_, ch = hgt / rows;
      dots = [];
      for (var i = 0; i < N; i++) {
        var c = i % cols_, r_ = (i / cols_) | 0, s1 = seed(i), s2 = seed(i + 7), s3 = seed(i + 99);
        var hx = c * cw + cw / 2 + (s1 - 0.5) * cw * 0.6, hy = r_ * ch + ch / 2 + (s2 - 0.5) * ch * 0.6;
        dots.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0, n: 3 + ((s3 * 5) | 0), rot: s1 * 6.28, size: Math.min(cw, ch) * (0.16 + s2 * 0.2), col: cols[(s3 * cols.length) | 0] });
      }
      draw(1);
    }
    function draw(f) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, hgt);
      var live = performance.now() - lastMove < 1500, any = false, near = null, nd = 1e9;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.vx += (d.hx - d.x) * 0.06 * f; d.vy += (d.hy - d.y) * 0.06 * f;
        if (live) { var dx = d.x - px, dy = d.y - py, dist = Math.hypot(dx, dy); if (dist < 110 && dist > 0.1) { var k = (1 - dist / 110); d.vx += dx / dist * k * 6 * f; d.vy += dy / dist * k * 6 * f; d.rot += k * 0.3 * f; } if (dist < nd) { nd = dist; near = d; } }
        d.vx *= 0.82; d.vy *= 0.82; d.x += d.vx * f; d.y += d.vy * f;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.05) any = true;
        var s = d.size; ctx.beginPath();
        for (var k2 = 0; k2 < d.n; k2++) { var a = d.rot + k2 / d.n * 6.283; var X = d.x + Math.cos(a) * s, Y = d.y + Math.sin(a) * s; if (k2) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        ctx.closePath(); ctx.fillStyle = d.col; ctx.globalAlpha = 0.85; ctx.fill();
      }
      if (near && nd < 60) { ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(near.x, near.y, near.size * 2.6, 0, 6.283); ctx.strokeStyle = '#3B3732'; ctx.lineWidth = 1.5; ctx.stroke(); }
      ctx.globalAlpha = 1;
      return any || live;
    }
    function tick() { raf = 0; if (draw(1)) raf = requestAnimationFrame(tick); }
    root.addEventListener('pointermove', function (e) { var r = root.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now(); if (!raf) raf = requestAnimationFrame(tick); });
    root.addEventListener('pointerleave', function () { px = py = -9999; lastMove = performance.now(); if (!raf) raf = requestAnimationFrame(tick); });
    layout(); if (window.ResizeObserver) new ResizeObserver(layout).observe(root); else addEventListener('resize', layout);
  }

  // ======================================================================
  // The sleeping rabbit in the end card: the logo's rabbit pieces, eyes closed, wakes on hover
  // ======================================================================
  var RP = [[1, 1673, 357, 133, 400], [2, 2401, 357, 133, 400], [3, 3383, 357, 99, 99], [4, 1415, 361, 193, 392], [5, 2142, 361, 194, 392], [7, 3501, 446, 225, 220], [8, 2846, 840, 403, 84], [9, 1217, 842, 132, 400], [10, 2644, 842, 133, 400], [11, 3291, 842, 132, 400], [12, 1477, 864, 96, 69], [13, 1936, 864, 94, 69], [14, 1659, 887, 190, 169], [15, 2127, 931, 225, 221], [16, 3518, 955, 187, 242], [17, 923, 1192, 206, 42], [18, 2379, 1192, 205, 42]];
  function mountSleep(box) {
    if (!box || box.__sleep) return; box.__sleep = true;
    var X0 = 880, Y0 = 300, W0 = 2900, H0 = 1000, base = box.getAttribute('data-base') || 'assets/brand/logo-pieces/';
    RP.forEach(function (p) {
      var el = h('div', 'pc' + (p[0] === 12 || p[0] === 13 ? ' eye' : ''), box);
      el.style.left = (p[1] - X0) / W0 * 100 + '%'; el.style.top = (p[2] - Y0) / H0 * 100 + '%'; el.style.width = p[3] / W0 * 100 + '%'; el.style.height = p[4] / H0 * 100 + '%';
      el.style.setProperty('--m', 'url("' + base + 'p' + p[0] + '.png")');
    });
    box.addEventListener('pointerenter', function () { box.classList.add('is-awake'); }); box.addEventListener('pointerleave', function () { box.classList.remove('is-awake'); });
  }

  function auto() {
    document.querySelectorAll('[data-sleep]').forEach(mountSleep);
    document.querySelectorAll('[data-scene]').forEach(mountScene);
    document.querySelectorAll('[data-typer-play]').forEach(mountPlay);
    document.querySelectorAll('[data-report]').forEach(function (r) { if (!r.closest('[data-scene]')) mountReport(r); });
    document.querySelectorAll('[data-tilt]').forEach(mountTilt);
    document.querySelectorAll('[data-unique-field]').forEach(mountField);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  window.NewMeansProduct = { sleep: mountSleep, scene: mountScene, board: mountBoard, play: mountPlay, report: mountReport, tilt: mountTilt, field: mountField, sound: sound, switches: SWITCHES };
})();
