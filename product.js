/* NewMeans product pieces, shared by the home and the product pages.
 * TyperBoard: the game's loop on a monitor screen. A key press fires a ball, dragging aims a stream,
 *   every keycap the ball hits plays the switch you chose, rows come down each turn.
 * ChatLab: how Dopamine University reads a chat. Point at a line and the report changes; write your own.
 * Tilt: cards that lean toward the cursor. UniqueField: 2,000 shapes, no two alike, stirred by the cursor.
 * Plates: the home's two product plates in one fixed scene, swapped by scrolling. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function t(key, vars) { var s = (window.i18n && window.i18n.t(key)) || key; return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; }); }
  function lang() { return (window.i18n && window.i18n.lang()) || (document.documentElement.lang === 'ko' ? 'ko' : 'en'); }
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function h(tag, cls, parent, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; }

  // ======================================================================
  // Typer board
  // ======================================================================
  var W = 700, H = 520, COLS = 7, CW = W / COLS, RH = 60, TOP = 12, LINE = H - 66, R = 9, SPD = 9;
  function mountBoard(root, opts) {
    if (!root || root.__tb) return root && root.__tb;
    opts = opts || {};
    var play = opts.play || function () { };
    var svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tb', preserveAspectRatio: 'xMidYMid meet' }, root);
    var gBricks = mk('g', { class: 'tb__bricks' }, svg), gFx = mk('g', { class: 'tb__fx' }, svg), gBalls = mk('g', { class: 'tb__balls' }, svg);
    mk('line', { x1: 0, y1: LINE, x2: W, y2: LINE, class: 'tb__line' }, svg);
    var aim = mk('path', { class: 'tb__aim', d: '' }, svg);
    mk('circle', { cx: W / 2, cy: H - 30, r: 11, class: 'tb__launcher' }, svg);
    var paw = mk('text', { x: W / 2 + 40, y: H - 6, class: 'tb__paw', 'text-anchor': 'middle', 'font-size': 44 }, svg); paw.textContent = 'ฅ';
    var flash = mk('text', { x: W / 2, y: H / 2 + 14, class: 'tb__flash', 'text-anchor': 'middle', 'font-size': 52 }, svg);
    var bricks = [], balls = [], turn = 0, inTurn = false, armed = {}, aimTurns = 0, catUsed = false, raf = 0, lastT = 0, broken = 0, over = false, timers = [];
    var stats = { hits: 0, broken: 0, turns: 0, best: 0 };
    function emit(name, detail) { root.dispatchEvent(new CustomEvent('tb:' + name, { bubbles: true, detail: detail || {} })); }

    function addBrick(c, r, hp) {
      var g = mk('g', { class: 'tb__brick', transform: 'translate(' + (c * CW) + ',' + (TOP + r * RH) + ')' }, gBricks);
      mk('rect', { x: 5, y: 5, width: CW - 10, height: RH - 10, rx: 9 }, g);
      var tx = mk('text', { x: CW / 2, y: RH / 2 + 10, 'text-anchor': 'middle', 'font-size': 28 }, g); tx.textContent = hp;
      var b = { c: c, r: r, hp: hp, g: g, tx: tx }; bricks.push(b); return b;
    }
    function spawnRow(r, hp) { var n = 0; for (var c = 0; c < COLS; c++) if (Math.random() < 0.58) { addBrick(c, r, hp); n++; } while (n < 2) { var c2 = (Math.random() * COLS) | 0; if (!bricks.some(function (b) { return b.r === r && b.c === c2; })) { addBrick(c2, r, hp); n++; } } }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      bricks.forEach(function (b) { b.g.remove(); }); bricks = []; balls.forEach(function (b) { b.el.remove(); }); balls = [];
      turn = 0; inTurn = false; over = false; aimTurns = 0; armed = {}; catUsed = false; broken = 0;
      spawnRow(0, 3); spawnRow(1, 2); spawnRow(2, 1);
      flash.textContent = ''; flash.classList.remove('is-on'); emit('reset');
    }
    function endTurn() {
      inTurn = false; turn++; stats.turns++; if (aimTurns > 0) aimTurns--; catUsed = false; armed.bomb = false; armed.drill = false;
      bricks.forEach(function (b) { b.r++; b.g.setAttribute('transform', 'translate(' + (b.c * CW) + ',' + (TOP + b.r * RH) + ')'); });
      spawnRow(0, Math.min(9, turn + 3));
      emit('turn', { turn: turn, armed: armed, aimTurns: aimTurns });
      if (bricks.some(function (b) { return TOP + (b.r + 1) * RH > LINE; })) gameOver();
    }
    function gameOver() {
      over = true; flash.textContent = 'GAME OVER'; flash.classList.add('is-on'); stats.best = Math.max(stats.best, broken); emit('over', { broken: broken });
      timers.push(setTimeout(reset, 1500));
    }
    function shards(x, y) {
      var g = mk('g', { class: 'tb__shards', transform: 'translate(' + x + ',' + y + ')' }, gFx);
      for (var i = 0; i < 5; i++) { var a = i / 5 * 6.28; mk('rect', { x: -4, y: -4, width: 8, height: 8, rx: 2, style: '--dx:' + (Math.cos(a) * 34).toFixed(0) + 'px;--dy:' + (Math.sin(a) * 34 - 10).toFixed(0) + 'px' }, g); }
      timers.push(setTimeout(function () { g.remove(); }, 600));
    }
    function damage(b, n) {
      b.hp -= n; stats.hits++;
      if (b.hp <= 0) { var i = bricks.indexOf(b); if (i >= 0) bricks.splice(i, 1); shards(b.c * CW + CW / 2, TOP + b.r * RH + RH / 2); b.g.remove(); broken++; stats.broken++; emit('break', { broken: broken }); }
      else { b.tx.textContent = b.hp; b.g.classList.remove('is-hit'); void b.g.getBBox(); b.g.classList.add('is-hit'); }
    }
    function hit(b, ball) {
      play();
      if (armed.bomb) {
        armed.bomb = false; var c = b.c, r = b.r;
        bricks.slice().forEach(function (o) { if (Math.abs(o.c - c) <= 1 && Math.abs(o.r - r) <= 1) damage(o, 3); });
        emit('bomb');
      } else damage(b, 1);
      emit('hit', { hp: b.hp });
    }
    function step(f) {
      for (var i = balls.length - 1; i >= 0; i--) {
        var ball = balls[i];
        ball.x += ball.vx * f; ball.y += ball.vy * f;
        if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx); } else if (ball.x > W - R) { ball.x = W - R; ball.vx = -Math.abs(ball.vx); }
        if (ball.y < R) { ball.y = R; ball.vy = Math.abs(ball.vy); }
        if (ball.y > H - 40 && ball.vy > 0 && armed.cat && !catUsed) { catUsed = true; ball.vy = -Math.abs(ball.vy); ball.vx += (Math.random() - 0.5) * 3; paw.classList.remove('is-on'); void paw.getBBox(); paw.classList.add('is-on'); emit('cat'); }
        if (ball.y > H + R) { ball.el.remove(); balls.splice(i, 1); continue; }
        for (var k = 0; k < bricks.length; k++) {
          var b = bricks[k], bx = b.c * CW + 5, by = TOP + b.r * RH + 5, bw = CW - 10, bh = RH - 10;
          var nx = Math.max(bx, Math.min(bx + bw, ball.x)), ny = Math.max(by, Math.min(by + bh, ball.y)), dx = ball.x - nx, dy = ball.y - ny;
          if (dx * dx + dy * dy < R * R) {
            if (armed.drill) { if (ball.last !== b) { ball.last = b; hit(b, ball); } continue; }
            var ox = Math.min(ball.x + R - bx, bx + bw - (ball.x - R)), oy = Math.min(ball.y + R - by, by + bh - (ball.y - R));
            if (ox < oy) { ball.vx = ball.x < bx + bw / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx); ball.x += ball.vx > 0 ? ox : -ox; }
            else { ball.vy = ball.y < by + bh / 2 ? -Math.abs(ball.vy) : Math.abs(ball.vy); ball.y += ball.vy > 0 ? oy : -oy; }
            hit(b, ball); break;
          }
        }
        ball.el.setAttribute('cx', ball.x.toFixed(1)); ball.el.setAttribute('cy', ball.y.toFixed(1));
      }
    }
    function tick(now) {
      raf = 0; var dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
      step(Math.min(2, dt * 60));
      if (balls.length) raf = requestAnimationFrame(tick);
      else { lastT = 0; if (inTurn && !pending) endTurn(); }
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }
    var pending = 0;
    function launch(dx, dy) {
      if (over || balls.length >= 8) return;
      var el = mk('circle', { r: R, cx: W / 2, cy: H - 30, class: 'tb__ball' }, gBalls);
      balls.push({ x: W / 2, y: H - 30, vx: dx * SPD, vy: dy * SPD, el: el, last: null }); inTurn = true; wake();
    }
    function fire(dir, n) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      for (var i = 0; i < n; i++) { pending++; timers.push(setTimeout((function (dx, dy) { return function () { pending--; launch(dx, dy); }; })(dx, dy), i * 110)); }
      emit('fire', { n: n });
    }
    function fireKey() {                                    // a key press: one ball at the lowest keycap near the middle
      if (over) return;
      var target = null, best = -1;
      bricks.forEach(function (b) { var s = b.r * 10 - Math.abs(b.c - 3); if (s > best) { best = s; target = b; } });
      var dx = target ? (target.c * CW + CW / 2 - W / 2) + (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 120, dy = target ? (TOP + target.r * RH + RH / 2) - (H - 30) : -400;
      fire([dx, dy], 1);
    }
    // aiming: drag anywhere on the board
    var aiming = false, aimFrom = null, aimDir = null;
    function toSvg(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
    function drawAim(dir) {
      var len = Math.hypot(dir[0], dir[1]) || 1, dx = dir[0] / len, dy = dir[1] / len;
      if (dy > -0.18) { dy = -0.18; dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy); }
      var x = W / 2, y = H - 30, d = 'M' + x + ' ' + y, segs = aimTurns > 0 ? 3 : 1, total = 0;
      for (var s = 0; s < segs; s++) {
        var tx = dx > 0 ? (W - R - x) / dx : dx < 0 ? (R - x) / dx : 1e9, ty = (R - y) / dy, tt = Math.min(tx, ty, 520 - total);
        x += dx * tt; y += dy * tt; total += tt; d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0);
        if (tt === tx) dx = -dx; else break;
      }
      aim.setAttribute('d', d);
    }
    svg.addEventListener('pointerdown', function (e) {
      if (over) return; e.preventDefault(); aiming = true; aimFrom = toSvg(e); aimDir = null; svg.classList.add('is-aiming');
      try { svg.setPointerCapture(e.pointerId); } catch (_) { }
    });
    svg.addEventListener('pointermove', function (e) {
      if (!aiming) return; var p = toSvg(e); var dir = [p.x - W / 2, p.y - (H - 30)];
      if (Math.hypot(p.x - aimFrom.x, p.y - aimFrom.y) < 6) return;
      aimDir = dir; drawAim(dir);
    });
    function aimEnd(e) {
      if (!aiming) return; aiming = false; svg.classList.remove('is-aiming'); aim.setAttribute('d', '');
      if (e.type !== 'pointerup') return;
      if (aimDir) fire(aimDir, 3); else fire([(Math.random() - 0.5) * 0.3, -1], 3);
    }
    svg.addEventListener('pointerup', aimEnd); svg.addEventListener('pointercancel', aimEnd); svg.addEventListener('lostpointercapture', aimEnd);

    reset();
    root.__tb = {
      key: fireKey, fire: fire, reset: reset,
      arm: function (item) { if (item === 'aim') aimTurns = 3; else if (item === 'cat') { armed.cat = !armed.cat; } else armed[item] = !armed[item]; emit('arm', { armed: armed, aimTurns: aimTurns }); return armed[item] || (item === 'aim' && aimTurns > 0); },
      armed: function () { return { bomb: !!armed.bomb, drill: !!armed.drill, cat: !!armed.cat, aim: aimTurns }; },
      stats: function () { return { bricks: bricks.length, balls: balls.length, turn: turn, broken: broken, over: over, hits: stats.hits }; }
    };
    return root.__tb;
  }

  // ======================================================================
  // Chat lab
  // ======================================================================
  var CHAT = {
    ko: { me: '나', you: '친구', lines: [[1, '오늘 뭐해?'], [0, '나 지금 카페 ㅋㅋㅋ'], [1, '헐 나도 갈래 어디야'], [0, '바로 와 ㄱㄱ'], [1, 'ㅠㅠ 나 과제 아직 안 끝났어'], [0, '괜찮아 천천히 와 기다릴게'], [1, '고마워 ㅎㅎ 30분!']],
      tags: { teto: '직진', egen: '공감', lol: 'ㅋㅋ', q: '질문' }, placeholder: '한 줄 써보기', lean: ['테토 쪽', '반반', '에겐 쪽'], prof: ['테토 교수', '에겐 교수'], report: '연구 보고서 · 데모', read: '읽은 문장 {n}', send: '보내기', hint: '말풍선을 짚으면 읽는다' },
    en: { me: 'me', you: 'friend', lines: [[1, 'what are you up to?'], [0, 'at a cafe lol'], [1, 'omg which one'], [0, 'just come, now'], [1, 'ugh still stuck on homework :('], [0, 'no rush, I will wait'], [1, 'thanks!! 30 min']],
      tags: { teto: 'direct', egen: 'empathy', lol: 'lol', q: 'question' }, placeholder: 'Write a line', lean: ['Leaning Teto', 'Even', 'Leaning Egen'], prof: ['Prof. Teto', 'Prof. Egen'], report: 'Research report · demo', read: '{n} lines read', send: 'Send', hint: 'Point at a bubble to read it' }
  };
  var RX = { teto: /ㄱㄱ|바로|당장|가자|콜|!|\bnow\b|\bjust\b|let's|\bgo\b|come/i, egen: /ㅠ|ㅜ|괜찮|미안|고마|기다|천천|힘내|:\(|sorry|thank|no rush|wait|hope|okay/i, lol: /ㅋㅋ|ㅎㅎ|lol|haha/i, q: /\?/ };
  function tagsOf(text) { var out = []; for (var k in RX) if (RX[k].test(text)) out.push(k); return out; }
  function mountChat(root) {
    if (!root || root.__cl) return;
    root.__cl = true;
    var L = CHAT[lang()] || CHAT.en, counts, readN, interacted = false, timers = [], compact = root.getAttribute('data-chat-lab') === 'compact';
    if (compact) root.classList.add('cl--compact');
    function build() {
      timers.forEach(clearTimeout); timers = []; root.textContent = ''; counts = { teto: 0, egen: 0, lol: 0, q: 0 }; readN = 0;
      L = CHAT[lang()] || CHAT.en;
      var phone = h('div', 'cl__phone', root);
      h('div', 'cl__bar', phone, L.you);
      var log = h('ol', 'cl__log', phone);
      var form = h('form', 'cl__form', phone); var input = h('input', 'cl__input', form); input.placeholder = L.placeholder; input.maxLength = 60; input.setAttribute('aria-label', L.placeholder);
      var send = h('button', 'cl__send', form, '↑'); send.type = 'submit'; send.setAttribute('aria-label', L.send);
      var report = h('div', 'cl__report', root);
      h('p', 'cl__title', report, L.report);
      var meter = h('div', 'cl__meter', report);
      var pt = h('figure', 'cl__prof cl__prof--teto', meter); var it = h('img', '', pt); it.src = 'assets/screens/dopamine/DrTeto.png'; it.alt = ''; h('figcaption', '', pt, L.prof[0]);
      var track = h('div', 'cl__track', meter); var needle = h('i', 'cl__needle', track);
      var pe = h('figure', 'cl__prof cl__prof--egen', meter); var ie = h('img', '', pe); ie.src = 'assets/screens/dopamine/AsEgen.png'; ie.alt = ''; h('figcaption', '', pe, L.prof[1]);
      var lean = h('p', 'cl__lean', report, L.lean[1]);
      var tags = h('ul', 'cl__tags', report);
      var count = h('p', 'cl__count', report, t2(L.read, 0));
      function t2(s, n) { return s.replace('{n}', n); }
      function update() {
        var te = counts.teto, eg = counts.egen, tot = Math.max(1, te + eg), pos = 50 + (eg - te) / tot * 40;
        needle.style.left = pos + '%';
        lean.textContent = L.lean[te > eg ? 0 : eg > te ? 2 : 1];
        pt.classList.toggle('is-up', te > eg); pe.classList.toggle('is-up', eg > te);
        tags.textContent = ''; ['teto', 'egen', 'lol', 'q'].forEach(function (k) { var li = h('li', 'cl__tag cl__tag--' + k + (counts[k] ? ' is-on' : ''), tags); h('span', '', li, L.tags[k]); h('b', '', li, counts[k]); });
        count.textContent = t2(L.read, readN);
        report.classList.remove('is-updated'); void report.offsetWidth; report.classList.add('is-updated');
      }
      function addLine(who, text, auto) {
        var li = h('li', 'cl__msg cl__msg--' + (who ? 'you' : 'me'), log); li.setAttribute('data-read', '0');
        h('span', 'cl__bubble', li, text); var chips = h('span', 'cl__chips', li);
        function read() {
          if (li.getAttribute('data-read') === '1') return; li.setAttribute('data-read', '1'); readN++;
          tagsOf(text).forEach(function (k) { counts[k]++; h('i', 'cl__chip cl__chip--' + k, chips, L.tags[k]); });
          update();
        }
        li.addEventListener('pointerenter', function () { interacted = true; read(); });
        li.addEventListener('click', function () { interacted = true; read(); });
        if (auto) li.classList.add('is-new');
        return read;
      }
      var readers = L.lines.map(function (l) { return addLine(l[0], l[1]); });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = '';
        var read = addLine(0, v, true); read(); log.scrollTop = log.scrollHeight; interacted = true;
      });
      update();
      if (!reduce) { timers.push(setTimeout(function () { if (!interacted) readers[0](); }, 900)); timers.push(setTimeout(function () { if (!interacted) readers[1](); }, 1700)); }
    }
    build();
    window.addEventListener('nm:langchange', build);
  }

  // ======================================================================
  // Tilt cards
  // ======================================================================
  function mountTilt(card) {
    if (card.__tilt || reduce) return; card.__tilt = true;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
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
        dots.push({ hx: hx, hy: hy, x: hx, y: hy, vx: 0, vy: 0, n: 3 + ((s3 * 5) | 0), rot: s1 * 6.28, size: Math.min(cw, ch) * (0.16 + s2 * 0.2), col: cols[(s3 * cols.length) | 0], spin: (s1 - 0.5) * 0.04 });
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
  // A desk: keyboard + monitor board wired together, physical keys included
  // ======================================================================
  var SWITCHES = [['4000', 'Blue'], ['4001', 'Brown'], ['4002', 'Red'], ['4003', 'Chocolate'], ['4004', 'Capacitive'], ['4005', 'Low Profile'], ['4006', 'White']];
  var ITEMS = ['bomb', 'drill', 'cat', 'aim'];
  function mountDesk(root) {
    if (!root || root.__desk || !window.TyperKeyboard) return;
    root.__desk = true;
    var kb = root.querySelector('[data-typer-keyboard]'), boardEl = root.querySelector('[data-typer-board]');
    var swName = root.querySelector('[data-switch-name]'), status = root.querySelector('[data-screen-status]'), swRow = root.querySelector('[data-switches]'), itemRow = root.querySelector('[data-items]');
    if (!kb || !boardEl) return;
    TyperKeyboard.mount(kb);
    var board = mountBoard(boardEl, { play: function () { TyperKeyboard.play(kb); } });
    var sw = '4000', error = false, broken = 0, seen = false;
    function setSwitch(id) { sw = id; TyperKeyboard.setSwitch(kb, id); var n = SWITCHES.filter(function (s) { return s[0] === id; })[0]; if (swName) swName.textContent = n ? n[1] : id; if (swRow) swRow.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); }); root.dispatchEvent(new CustomEvent('desk:switch', { bubbles: true, detail: { id: id } })); }
    if (swRow) SWITCHES.forEach(function (s, i) { var b = h('button', '', swRow, s[1]); b.type = 'button'; b.dataset.id = s[0]; b.setAttribute('aria-pressed', i === 0); b.addEventListener('click', function () { setSwitch(s[0]); TyperKeyboard.setSound(kb, true); }); });
    if (itemRow) ITEMS.forEach(function (it) {
      var b = h('button', 'item item--' + it, itemRow); b.type = 'button'; b.dataset.item = it; b.setAttribute('aria-pressed', 'false');
      h('b', '', b, t('typer.item.' + it)); h('span', '', b, t('typer.item.' + it + '.d'));
      b.addEventListener('click', function () { var on = board.arm(it); b.setAttribute('aria-pressed', !!on); });
      itemRow.__label = function () { itemRow.querySelectorAll('button').forEach(function (x) { x.querySelector('b').textContent = t('typer.item.' + x.dataset.item); x.querySelector('span').textContent = t('typer.item.' + x.dataset.item + '.d'); }); };
    });
    function label() {
      if (!status) return;
      if (error) status.textContent = t('sound.error');
      else if (board.stats().over) status.textContent = t('typer.desk.over');
      else if (!seen) status.textContent = t('typer.desk.hint');
      else status.textContent = t('typer.desk.broken', { n: broken });
    }
    kb.addEventListener('tp:soundstate', function (e) { error = !!e.detail.error; label(); });
    kb.addEventListener('tp:key', function () { seen = true; board.key(); label(); });
    boardEl.addEventListener('tb:break', function (e) { broken = e.detail.broken; label(); });
    boardEl.addEventListener('tb:fire', function () { seen = true; label(); });
    boardEl.addEventListener('tb:over', label); boardEl.addEventListener('tb:reset', function () { broken = 0; label(); });
    boardEl.addEventListener('tb:turn', function (e) { if (itemRow) itemRow.querySelectorAll('button').forEach(function (b) { var a = board.armed(); b.setAttribute('aria-pressed', b.dataset.item === 'aim' ? a.aim > 0 : !!a[b.dataset.item]); }); });
    // the real keyboard plays too, while the desk is on screen and nothing is being typed
    var inView = false;
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; }); }, { threshold: 0.35 }).observe(root); else inView = true;
    document.addEventListener('keydown', function (e) {
      if (!inView || e.metaKey || e.ctrlKey || e.altKey) return;
      var tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable || tg.tagName === 'BUTTON' || tg.tagName === 'A')) return;
      if (e.key.length !== 1 && e.key !== 'Enter' && e.key !== ' ') return;
      if (e.key === ' ') e.preventDefault();
      var code = e.key.charCodeAt(0); TyperKeyboard.press(kb, (code * 7 + (e.key === ' ' ? 6 : 0)) % 18);
    });
    window.addEventListener('nm:langchange', function () { label(); if (itemRow && itemRow.__label) itemRow.__label(); });
    setSwitch('4000'); label();
    root.__deskApi = { board: board, keyboard: kb, setSwitch: setSwitch };
    return root.__deskApi;
  }

  // ======================================================================
  // Two plates: one fixed scene, the product swaps as you scroll through it
  // ======================================================================
  function lerpColor(a, b, t) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; }
  function mountPlates(root) {
    if (!root || root.__plates) return; root.__plates = true;
    var stage = root.querySelector('.plates__stage'), plates = root.querySelectorAll('.plate'), objs = root.querySelectorAll('.obj'), dots = root.querySelectorAll('.plates__dots li');
    var narrow = matchMedia('(max-width: 720px)');
    function isStatic() { return reduce || narrow.matches; }
    var C0 = [0xDA, 0xF7, 0xE8], C1 = [0xFE, 0xE9, 0xE7], raf = 0, seen = true, last = -1;   // m-100 to c-100
    function update() {
      raf = 0;
      if (isStatic()) { root.classList.add('is-static'); root.style.removeProperty('--plate-bg'); return; }
      root.classList.remove('is-static');
      var r = root.getBoundingClientRect(), total = root.offsetHeight - stage.offsetHeight, p = total > 0 ? Math.min(1, Math.max(0, (64 - r.top) / total)) : 0;
      var t = Math.min(1, Math.max(0, (p - 0.36) / 0.28)); t = t * t * (3 - 2 * t);
      if (t === last) return; last = t;
      var c = function (v) { return Math.min(1, Math.max(0, v)); };
      // the outgoing copy is gone before the incoming copy arrives; the objects cross in the middle
      var sets = [[plates[0], 1 - c(t / 0.45), -14 * t], [plates[1], c((t - 0.55) / 0.45), 14 * (1 - t)], [objs[0], 1 - c((t - 0.3) / 0.4), -10 * t], [objs[1], c((t - 0.3) / 0.4), 10 * (1 - t)]];
      sets.forEach(function (s) { s[0].style.setProperty('--o', s[1].toFixed(3)); s[0].style.setProperty('--y', s[2].toFixed(1) + 'px'); s[0].style.setProperty('--v', s[1] < 0.02 ? 'hidden' : 'visible'); });
      root.style.setProperty('--plate-bg', lerpColor(C0, C1, t));
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === (t < 0.5 ? 0 : 1)); });
    }
    function ask() { if (!raf && seen) raf = requestAnimationFrame(update); }
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask);
    if (narrow.addEventListener) narrow.addEventListener('change', ask);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; if (seen) ask(); }); }, { rootMargin: '20% 0px' }).observe(root);
    dots.forEach(function (d, i) { d.addEventListener('click', function () { var total = root.offsetHeight - stage.offsetHeight; window.scrollTo({ top: root.offsetTop - 64 + (i ? total : 0), behavior: reduce ? 'auto' : 'smooth' }); }); });
    update();
  }

  function auto() {
    document.querySelectorAll('[data-plates]').forEach(mountPlates);
    document.querySelectorAll('[data-typer-desk]').forEach(mountDesk);
    document.querySelectorAll('[data-chat-lab]').forEach(mountChat);
    document.querySelectorAll('[data-tilt]').forEach(mountTilt);
    document.querySelectorAll('[data-unique-field]').forEach(mountField);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  window.NewMeansProduct = { board: mountBoard, desk: mountDesk, chat: mountChat, tilt: mountTilt, field: mountField, plates: mountPlates, switches: SWITCHES };
})();
