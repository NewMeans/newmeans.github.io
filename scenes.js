/* Home scenes and the Dopamine University pieces, choreographed with GSAP ScrollTrigger.
 * Typer: a portal splits open, a ball rolls out, bounces across five keycaps (x linear, y quadratic = gravity)
 *        typing T Y P E R, bounces off the last one and drops into a second portal. Scrubbed by scroll; "replay"
 *        plays it in time with a random ball from the game. Dopamine: two wordless cards; a sparkle hops across the
 *        tests and settles on one, then a report writes itself. Reveals happen once; progress never rewinds (ratchet).
 * Studio: two rabbits running while obstacles fly in from the right; scrolling speeds them up. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var P = window.NewMeansProduct, sound = P && P.sound, G = window.gsap, ST = window.ScrollTrigger;
  if (!G || !ST) return;
  G.registerPlugin(ST);
  var touched = false; addEventListener('pointerdown', function () { touched = true; }, { once: true });
  function debounce(fn, ms) { var id; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }

  // ================================================================ Typer
  var U = {
    W: 760, H: 320, R: 17, CAPTOP: 108,
    CAPX: [140, 260, 380, 500, 620],
    IN: { x: 140, y: 16 }, OUT: { x: 716, y: 284 },
    APEX: [70, 61, 53, 46], LAST: 60
  };
  // five caps, five things Typer is made of. One family: solid, rounded, bold,
  // and the last one is the word itself.
  var CAP_ICONS = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M3.4 5.8h17.2A2.4 2.4 0 0 1 23 8.2v7.6a2.4 2.4 0 0 1-2.4 2.4H3.4A2.4 2.4 0 0 1 1 15.8V8.2a2.4 2.4 0 0 1 2.4-2.4zm.9 2.9v2.2h2.6V8.7H4.3zm4.1 0v2.2H11V8.7H8.4zm4.2 0v2.2h2.6V8.7h-2.6zm4.2 0v2.2h2.9V8.7h-2.9zM7 12.7v2.6h10v-2.6H7z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M8 6.2h8a6 6 0 0 1 5.9 7.1l-.5 3a3.2 3.2 0 0 1-5.6 1.5L14.4 16H9.6l-1.8 1.8a3.2 3.2 0 0 1-5.6-1.5l-.5-3A6 6 0 0 1 8 6.2zM6 9.3v1.6H4.4v2.1H6v1.6h2.1V13h1.6v-2.1H8.1V9.3H6zm10.7.8a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7zm2.3 3.5a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.2 9.2 0 0 0-9.2 9.2v1.4h2.9V12a6.3 6.3 0 0 1 12.6 0v1.4h2.9V12A9.2 9.2 0 0 0 12 2.8z"/><path d="M4 12.7h1.7a1.7 1.7 0 0 1 1.7 1.7v4.1a1.7 1.7 0 0 1-1.7 1.7H4a1.7 1.7 0 0 1-1.7-1.7v-4.1A1.7 1.7 0 0 1 4 12.7z"/><path d="M18.3 12.7H20a1.7 1.7 0 0 1 1.7 1.7v4.1a1.7 1.7 0 0 1-1.7 1.7h-1.7a1.7 1.7 0 0 1-1.7-1.7v-4.1a1.7 1.7 0 0 1 1.7-1.7z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.1 12.3h1.8V8.1h-1.8z"/><path d="M12.7 12.3c-.5-3.3 1.4-5.6 5.2-6.2.6 3.5-1.4 5.7-5.2 6.2z"/><path d="M11.3 12.3c.5-2.9-1.1-4.9-4.3-5.4-.5 3.1 1.2 5.1 4.3 5.4z"/><path d="M5.3 12.6h13.4a1 1 0 0 1 1 1.1l-.2 1.5H4.5l-.2-1.5a1 1 0 0 1 1-1.1z"/><path d="M5.1 16.4h13.8l-.8 3.9a1.9 1.9 0 0 1-1.9 1.5H7.8a1.9 1.9 0 0 1-1.9-1.5z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="15.9" text-anchor="middle">Lo-Fi</text></svg>'
  ];
  var SPIN = 360 / (2 * Math.PI * U.R) * .55;  // degrees per stage unit, rolled lazily
  function mountTyper(root) {
    var stage = root.querySelector('.stage'), ball = stage.querySelector('.ball');
    var caps = [].slice.call(stage.querySelectorAll('.cap')), letters = caps.map(function (c) { return c.querySelector('b'); });
    var pIn = [stage.querySelector('.portal--in'), stage.querySelector('.lip--in')];
    var pOut = [stage.querySelector('.portal--out'), stage.querySelector('.lip--out')];
    var logo = root.querySelector('.scene__logo'), tags = root.querySelector('.tags'), act = root.querySelector('.scene__act'), replayBtn = root.querySelector('.replay');
    letters.forEach(function (b, i) { if (b) b.innerHTML = CAP_ICONS[i] || ''; });
    var balls = [ball.getAttribute('src')];
    if (P) P.catalog().then(function (c) { if (c && c.ball) balls = c.ball.map(function (b) { return 'assets/shop/' + b.sprite; }); });
    var s = 1, tl = null, st = null, rtl = null;
    function measure() { s = stage.clientWidth / U.W || 1; }
    function build(dur, replaying) {
      measure();
      var tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
      var yRest = (U.CAPTOP - U.R) * s, rot = 0;
      tl.set(ball, { xPercent: -50, yPercent: -50, x: U.IN.x * s, y: (U.IN.y - 22) * s, scale: 1, opacity: 1, rotation: 0 }, 0);
      tl.set(pIn.concat(pOut), { opacity: 0, scale: .4 }, 0);
      tl.set(letters, { opacity: 0 }, 0);
      tl.fromTo(logo, { scale: 1.08 }, { scale: 1, duration: dur * .08 }, 0);
      tl.fromTo(tags, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * .08 }, 0);
      tl.fromTo(caps, { y: 60 * s, opacity: 0 }, { y: 0, opacity: 1, duration: dur * .06, stagger: dur * .012 }, 0);
      // the hole opens in the ceiling and the ball drops out of it: the near rim hides whatever is still inside
      tl.to(pIn, { opacity: 1, scale: 1, duration: dur * .06, ease: 'back.out(2)' }, dur * .06);
      rot += 30;
      tl.to(ball, { y: yRest, rotation: rot, duration: dur * .10, ease: 'power2.in' }, dur * .14);
      tl.to(pIn, { opacity: 0, scale: .5, duration: dur * .06 }, dur * .24);
      function forward() { return replaying || (st && st.direction === 1); }
      function press(i, at) {
        tl.to(caps[i], { y: 4 * s, duration: dur * .02 }, at).to(caps[i], { y: 0, duration: dur * .03 }, at + dur * .02);
        tl.set(letters[i], { opacity: 1 }, at);
        tl.call(function () { if (touched && sound && forward()) sound.play(); }, null, at);
      }
      press(0, dur * .24);
      for (var i = 0; i < 4; i++) {                      // four bounces between the keycaps
        var t0 = dur * (.24 + .12 * i), d = dur * .12;
        rot += (U.CAPX[i + 1] - U.CAPX[i]) * SPIN;
        tl.to(ball, { x: U.CAPX[i + 1] * s, rotation: rot, duration: d }, t0);
        tl.to(ball, { y: yRest - U.APEX[i] * s, duration: d / 2, ease: 'power1.out' }, t0).to(ball, { y: yRest, duration: d / 2, ease: 'power1.in' }, t0 + d / 2);
        press(i + 1, t0 + d);
      }
      // off the last keycap, over the floor, down into the second hole
      var t5 = dur * .72, d5 = dur * .14;
      rot += (U.OUT.x - U.CAPX[4]) * SPIN;
      tl.to(ball, { x: U.OUT.x * s, rotation: rot, duration: d5 }, t5);
      tl.to(ball, { y: yRest - U.LAST * s, duration: d5 * .4, ease: 'power1.out' }, t5).to(ball, { y: U.OUT.y * s, duration: d5 * .6, ease: 'power1.in' }, t5 + d5 * .4);
      tl.to(pOut, { opacity: 1, scale: 1, duration: dur * .05, ease: 'back.out(2)' }, dur * .74);
      tl.to(ball, { y: (U.OUT.y + 36) * s, duration: dur * .06, ease: 'power1.in' }, dur * .86);   // same size, straight into the slot
      tl.to(pOut, { opacity: 0, scale: .5, duration: dur * .06 }, dur * .89);
      tl.fromTo(act, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: dur * .1 }, dur * .86);
      tl.fromTo(replayBtn, { opacity: 0 }, { opacity: 1, duration: dur * .06 }, dur * .94);
      return tl;
    }
    var playing = false, played = false;
    function run(withSound) {                               // play it through once, at its own pace
      if (rtl) { rtl.kill(); rtl = null; }
      playing = true; played = true; replayBtn.disabled = true;
      if (withSound) touched = true;
      rtl = build(3.1, true);      // a touch quicker than it was
      rtl.eventCallback('onComplete', function () { playing = false; replayBtn.disabled = false; });
      rtl.play(0);
    }
    function setup() {
      if (rtl) { rtl.kill(); rtl = null; }
      if (st) { st.kill(); st = null; }
      if (tl) tl.kill();
      tl = build(1, false);
      if (reduce || played) { tl.progress(1); return; }     // after it has run, the stage just stays finished
      tl.progress(0);
      st = ST.create({ trigger: root, start: 'top 62%', once: true, onEnter: function () { run(false); } });
    }
    function replay() {
      var cur = ball.getAttribute('src'), pool = balls.filter(function (b) { return b !== cur; });
      ball.setAttribute('src', pool.length ? pool[(Math.random() * pool.length) | 0] : cur);
      run(true);
    }
    replayBtn.addEventListener('click', replay);
    if (sound) sound.set('4004');                           // the keycaps here sound like Chocolate
    caps.forEach(function (k) {
      k.addEventListener('pointerenter', function () { k.classList.add('is-down'); });
      k.addEventListener('pointerleave', function () { k.classList.remove('is-down'); });
      k.addEventListener('click', function () {
        touched = true; if (sound) sound.play();
        k.classList.remove('is-hit'); void k.offsetWidth; k.classList.add('is-hit');
      });
      k.addEventListener('animationend', function () { k.classList.remove('is-hit'); });
    });
    setup();
    addEventListener('resize', debounce(function () { if (!playing) setup(); }, 200));
  }

  // ================================================================ Dopamine: shapes crowding a centre
  // Four to seven at a time. Each one arrives, is pulled toward the middle, shoulders the others
  // aside, then goes. No two are the same shape or the same colour for long.
  var DOPA = ['#FF6568', '#FF8B1A', '#FAC800', '#05DF72', '#54A2FF', '#A882FF', '#FF5FA2', '#FF7849'];
  function mountBlobs(root) {
    var host = root.querySelector('[data-dopa-blobs]'); if (!host || host.__blobs) return; host.__blobs = true;
    var canvas = document.createElement('canvas'); host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1, shapes = [], want = 6, raf = 0, last = 0, seen = false, nextAt = 0;
    function layout() {
      var r = host.getBoundingClientRect(); w = r.width; h = r.height; if (!w || !h) return;
      dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      draw();
    }
    function spawn(born) {
      var R = Math.min(w, h), a = Math.random() * 6.283, d = R * (.30 + Math.random() * .16);
      var taken = shapes.map(function (o) { return o.col; }), free = DOPA.filter(function (c) { return taken.indexOf(c) < 0; });
      var col = (free.length ? free : DOPA)[(Math.random() * (free.length || DOPA.length)) | 0];
      var sides = shapes.map(function (o) { return o.n; }), n = 3 + ((Math.random() * 6) | 0), guard = 0;
      while (sides.indexOf(n) >= 0 && guard++ < 8) n = 3 + ((Math.random() * 6) | 0);   // no twins on screen
      shapes.push({
        n: n, col: col, r: R * (.135 + Math.random() * .095),
        x: w / 2 + Math.cos(a) * d, y: h / 2 + Math.sin(a) * d * .8, vx: 0, vy: 0,
        rot: Math.random() * 6.283, spin: (Math.random() - .5) * .7, k: 0,
        age: born ? .45 + Math.random() * 2.4 : 0, life: 4.2 + Math.random() * 3.4
      });
      var o = shapes[shapes.length - 1]; o.k = Math.min(1, o.age / .55) * Math.min(1, (o.life - o.age) / .7);
    }
    function step(dt) {
      var cx = w / 2, cy = h / 2, i, j, o, p;
      for (i = shapes.length - 1; i >= 0; i--) {
        o = shapes[i]; o.age += dt;
        if (o.age >= o.life) { shapes.splice(i, 1); continue; }
        o.k = Math.min(1, o.age / .55) * Math.min(1, (o.life - o.age) / .7);   // in, then out
        o.vx += (cx - o.x) * 2.4 * dt; o.vy += (cy - o.y) * 2.4 * dt;          // drawn to the middle
      }
      for (i = 0; i < shapes.length; i++) for (j = i + 1; j < shapes.length; j++) {   // but never on top of each other
        o = shapes[i]; p = shapes[j];
        var dx = p.x - o.x, dy = p.y - o.y, dd = Math.hypot(dx, dy) || .01, gap = (o.r * o.k + p.r * p.k) * .98;
        if (dd < gap) { var push = (gap - dd) / dd * 9 * dt; o.vx -= dx * push; o.vy -= dy * push; p.vx += dx * push; p.vy += dy * push; }
      }
      for (i = 0; i < shapes.length; i++) {
        o = shapes[i]; o.vx *= .9; o.vy *= .9; o.x += o.vx * dt * 60 * .06; o.y += o.vy * dt * 60 * .06; o.rot += o.spin * dt;
      }
      if (shapes.length < want && performance.now() > nextAt) { spawn(false); nextAt = performance.now() + 260 + Math.random() * 520; if (shapes.length >= want) want = 4 + ((Math.random() * 4) | 0); }
    }
    function draw() {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = 'round';
      for (var i = 0; i < shapes.length; i++) {
        var o = shapes[i], r = o.r * (o.k == null ? 1 : o.k); if (r < .6) continue;
        var round = Math.min(r * .34, 14);                               // fat round joins, like fruit
        ctx.beginPath();
        for (var k = 0; k < o.n; k++) { var a = o.rot + k / o.n * 6.283 - 1.5708, X = o.x + Math.cos(a) * (r - round), Y = o.y + Math.sin(a) * (r - round); if (k) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        ctx.closePath();
        ctx.fillStyle = o.col; ctx.strokeStyle = o.col; ctx.lineWidth = round * 2; ctx.stroke(); ctx.fill();
      }
    }
    function tick(now) {
      raf = 0; var dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
      step(dt); draw();
      if (seen) raf = requestAnimationFrame(tick); else last = 0;
    }
    layout();
    if (reduce) { for (var z = 0; z < 6; z++) spawn(true); shapes.forEach(function (o) { o.k = 1; }); for (var q = 0; q < 90; q++) step(.05); draw(); return; }
    for (var z2 = 0; z2 < 5; z2++) spawn(true);
    ST.create({ trigger: host, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { seen = self.isActive; if (seen && !raf) { last = 0; raf = requestAnimationFrame(tick); } } });
    var head = root.querySelector('.scene__head'), line = root.querySelector('.dopa-line'), act = root.querySelector('.scene__act'), sec = root.querySelector('.sec');
    var intro = [sec, head, host, line, act].filter(Boolean);
    G.set(intro, { opacity: 0, y: 18 });
    ST.create({ trigger: root, start: 'top 72%', once: true, onEnter: function () { G.to(intro, { opacity: 1, y: 0, duration: .7, stagger: .1, ease: 'power2.out' }); } });
    if (window.ResizeObserver) new ResizeObserver(debounce(layout, 120)).observe(host); else addEventListener('resize', debounce(layout, 200));
  }

  // ================================================================ the studio: two rabbits running
  // They face right, take turns leading, jump what is on the ground and swat what flies at them.
  var RP = [[1, 1673, 357, 133, 400], [2, 2401, 357, 133, 400], [3, 3383, 357, 99, 99], [4, 1415, 361, 193, 392], [5, 2142, 361, 194, 392], [7, 3501, 446, 225, 220], [8, 2846, 840, 403, 84], [9, 1217, 842, 132, 400], [10, 2644, 842, 133, 400], [11, 3291, 842, 132, 400], [12, 1477, 864, 96, 69], [13, 1936, 864, 94, 69], [14, 1659, 887, 190, 169], [15, 2127, 931, 225, 221], [16, 3518, 955, 187, 242], [17, 923, 1192, 206, 42], [18, 2379, 1192, 205, 42]];
  // only the head runs: the back curve, the trailing bracket, the tail and the sparkles sit out
  var DROP = { 3: 1, 7: 1, 8: 1, 11: 1, 16: 1 };
  var GLASSES = {
    // square horn rims for one, rounder ones with a flatter brow for the other
    ceo: '<svg viewBox="0 0 100 40" fill="none" stroke="#211E1B" stroke-width="6.6" stroke-linejoin="round"><rect x="6" y="8" width="28" height="22" rx="3.5"/><rect x="66" y="8" width="28" height="22" rx="3.5"/><path d="M34 17h32" stroke-linecap="round"/><path d="M6 13H1M94 13h5" stroke-linecap="round"/></svg>',
    cto: '<svg viewBox="0 0 100 40" fill="none" stroke="#211E1B" stroke-width="6.6" stroke-linejoin="round"><path d="M6 16c0-6.5 6-9 14-9s14 2.5 14 9c0 9-6 14-14 14S6 25 6 16z"/><path d="M66 16c0-6.5 6-9 14-9s14 2.5 14 9c0 9-6 14-14 14s-14-5-14-14z"/><path d="M34 16h32" stroke-linecap="round"/><path d="M6 13H1M94 13h5" stroke-linecap="round"/></svg>'
  };
  var CREW = {
    ceo: { role: 'CEO', name: 'Minsik Kim', nick: 'Olive', does: ['Game Client Dev', 'Web Frontend Dev', 'AI Integration Engineer', 'Design, everything at NewMeans', 'Menu Select'] },
    cto: { role: 'CTO', name: 'Minseok Chang', nick: 'Ricotta', does: ['Game Client Dev', 'Infrastructure Dev', 'AI Research Engineer', 'Swimming'] }
  };
  var FACE = { 12: 1, 13: 1, 14: 1 }, FOOT = { 17: 0, 18: 1 };
  var HX0 = 923, HY0 = 357, HW = 1854, HH = 885;
  // Whatever the day throws at you. Some of it is drawn, some of it is lifted
  // straight out of the game.
  var SHOP = 'assets/shop/';
  var GROUND_OBS = [
    { tone: 'coral', svg: '<svg viewBox="0 0 40 40"><path d="M20 3 36 33a2.4 2.4 0 0 1-2.1 3.6H6.1A2.4 2.4 0 0 1 4 33z" fill="var(--ob-a)"/><path d="M20 3 27.6 17H12.4z" fill="var(--ob-b)" opacity=".28"/><circle cx="15" cy="24" r="2.6" fill="var(--ob-b)"/><circle cx="25" cy="27" r="2.6" fill="var(--ob-b)"/><circle cx="20" cy="17" r="2.1" fill="var(--ob-b)"/></svg>' },   // pizza
    { tone: 'sand', svg: '<svg viewBox="0 0 40 40"><rect x="7" y="7" width="26" height="19" rx="2.6" fill="var(--ob-a)"/><rect x="10" y="10" width="20" height="13" rx="1.4" fill="var(--ob-b)" opacity=".5"/><path d="M3 28h34l-1.4 4.4a2 2 0 0 1-1.9 1.4H6.3a2 2 0 0 1-1.9-1.4z" fill="var(--ob-a)"/></svg>' },   // laptop
    { tone: 'sand', svg: '<svg viewBox="0 0 40 40"><rect x="8" y="5" width="24" height="30" rx="2.4" fill="var(--ob-a)" transform="rotate(-6 20 20)"/><rect x="8" y="5" width="24" height="30" rx="2.4" fill="var(--ob-a)" transform="rotate(5 20 20)"/><path d="M14 14h13M14 20h13M14 26h8" stroke="var(--ob-b)" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>' },   // paperwork
    { tone: 'gold', svg: '<svg viewBox="0 0 40 40"><rect x="5" y="11" width="30" height="19" rx="3" fill="var(--ob-a)"/><path d="M5 17h30" stroke="var(--ob-b)" stroke-width="2.6" fill="none"/><path d="M20 11v19" stroke="var(--ob-b)" stroke-width="2.6" fill="none"/><path d="M20 11c-4-6-11-4-9 1 1 2.6 5.6 2.6 9-1zM20 11c4-6 11-4 9 1-1 2.6-5.6 2.6-9-1z" fill="var(--ob-b)"/></svg>' },   // a gift, or a delivery
    { tone: 'mint', svg: '<svg viewBox="0 0 40 40"><rect x="6" y="8" width="28" height="24" rx="4" fill="var(--ob-a)"/><rect x="10" y="12" width="20" height="12" rx="2" fill="var(--ob-b)" opacity=".45"/><circle cx="14" cy="28" r="1.8" fill="var(--ob-b)"/><circle cx="20" cy="28" r="1.8" fill="var(--ob-b)"/><circle cx="26" cy="28" r="1.8" fill="var(--ob-b)"/></svg>' },   // a monitor full of tickets
    { img: SHOP + 'sculpture/1000_0.png' },   // the cactus off the desk
    { img: SHOP + 'sculpture/1001_0.png' },   // the coffee
    { img: SHOP + 'sculpture/1002_0.png' },   // the apple
    { img: SHOP + 'keycap/5000_0.png' },      // a loose keycap
    { img: SHOP + 'keycap/5011_0.png' }
  ];
  var AIR_OBS = [
    { img: SHOP + 'ball/0001_0.png' },        // the ball, out of its own game
    { img: SHOP + 'ball/0009_0.png' },
    { img: 'assets/brand/dopamine-symbol.png' },
    { tone: 'sand', svg: '<svg viewBox="0 0 40 40"><path d="M38 6 2 20l13 4z" fill="var(--ob-a)"/><path d="M15 24l3 11 5-7z" fill="var(--ob-b)"/></svg>' },
    { tone: 'gold', svg: '<svg viewBox="0 0 40 40"><path d="M24 3 9 23h9l-3 14 16-21h-9z" fill="var(--ob-a)"/></svg>' },
    { tone: 'gold', svg: '<svg viewBox="0 0 40 40"><path d="M20 4l4.6 10.2L36 15.6l-8.4 7.7 2.2 11.3L20 29l-9.8 5.6 2.2-11.3L4 15.6l11.4-1.4z" fill="var(--ob-a)"/></svg>' }
  ];

  // only the head runs: the back curve, the trailing bracket, the tail and the sparkles sit out
  var DROP = { 3: 1, 7: 1, 8: 1, 11: 1, 16: 1 };
  var GLASSES = {
    // square horn rims for one, rounder ones with a flatter brow for the other
    ceo: '<svg viewBox="0 0 100 40" fill="none" stroke="#211E1B" stroke-width="6.6" stroke-linejoin="round"><rect x="6" y="8" width="28" height="22" rx="3.5"/><rect x="66" y="8" width="28" height="22" rx="3.5"/><path d="M34 17h32" stroke-linecap="round"/><path d="M6 13H1M94 13h5" stroke-linecap="round"/></svg>',
    cto: '<svg viewBox="0 0 100 40" fill="none" stroke="#211E1B" stroke-width="6.6" stroke-linejoin="round"><path d="M6 16c0-6.5 6-9 14-9s14 2.5 14 9c0 9-6 14-14 14S6 25 6 16z"/><path d="M66 16c0-6.5 6-9 14-9s14 2.5 14 9c0 9-6 14-14 14s-14-5-14-14z"/><path d="M34 16h32" stroke-linecap="round"/><path d="M6 13H1M94 13h5" stroke-linecap="round"/></svg>'
  };
  var CREW = {
    ceo: { role: 'CEO', name: 'Minsik Kim', nick: 'Olive', does: ['Game Client Dev', 'Web Frontend Dev', 'AI Integration Engineer', 'Design, everything at NewMeans', 'Menu Select'] },
    cto: { role: 'CTO', name: 'Minseok Chang', nick: 'Ricotta', does: ['Game Client Dev', 'Infrastructure Dev', 'AI Research Engineer', 'Swimming'] }
  };
  function buildRabbit(box, who) {
    var base = 'assets/brand/logo-pieces/';
    RP.forEach(function (p) {
      if (DROP[p[0]]) return;
      var el = document.createElement('i');
      el.className = 'rb' + (FACE[p[0]] ? ' rb--face' : '') + (p[0] in FOOT ? ' rb--paw' : '');
      el.style.left = (p[1] - HX0) / HW * 100 + '%'; el.style.top = (p[2] - HY0) / HH * 100 + '%';
      el.style.width = p[3] / HW * 100 + '%'; el.style.height = p[4] / HH * 100 + '%';
      el.style.setProperty('--m', 'url("' + base + 'p' + p[0] + '.png")');
      box.appendChild(el);
    });
    if (who && GLASSES[who]) box.insertAdjacentHTML('beforeend', '<i class="rb-glass">' + GLASSES[who] + '</i>');
  }
  function mountRunner(root) {
    if (root.__run) return; root.__run = true;
    var obsLayer = root.querySelector('.run__obs'), crew = root.querySelector('.run__crew');
    var rabbits = [].slice.call(root.querySelectorAll('.runner'));
    rabbits.forEach(function (r) { buildRabbit(r.querySelector('.runner__art'), r.getAttribute('data-who')); });
    var arts = rabbits.map(function (r) { return r.querySelector('.runner__art'); });
    G.set(arts, { scaleX: -1, rotation: 3.5 });                     // face right
    var slot = [0, 0], order = [0, 1], scale = 1;                       // order[1] is the one out in front
    function measure() { var rw = rabbits[0].offsetWidth || 180; scale = rw / 182; slot = [0, rw * 1.08]; crew.style.width = (slot[1] + rw) + 'px'; }
    measure();
    rabbits.forEach(function (r, i) { G.set(r, { x: slot[i] }); });
    if (reduce) return;
    arts.forEach(function (art, i) {
      var feet = art.querySelectorAll('.rb--paw');
      G.to(art, { y: -7, duration: .32, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .15 });
      if (feet[0]) G.to(feet[0], { y: 5, duration: .17, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .15 });
      if (feet[1]) G.to(feet[1], { y: 5, duration: .17, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: .17 + i * .15 });
    });
    function jump(r) {
      if (r.__busy === 'jump') return;
      if (r.__tl) r.__tl.kill();                                    // a jump always wins over a swing
      r.__busy = 'jump';
      r.__tl = G.timeline({ onComplete: function () { r.__busy = 0; r.__tl = null; } })
        .to(r, { y: -80 * scale, rotation: -8, duration: .38, ease: 'power2.out' })
        .to(r, { y: 0, rotation: 0, duration: .36, ease: 'power2.in' });
    }
    function swat(r) {
      if (r.__busy) return; r.__busy = 'swat';
      r.__tl = G.timeline({ onComplete: function () { r.__busy = 0; r.__tl = null; } })
        .to(r, { rotation: -16, y: -10 * scale, duration: .12, ease: 'power3.out' })
        .to(r, { rotation: 0, y: 0, duration: .26, ease: 'power2.inOut' });
    }
    // they swap places so each takes a turn out front - obstacles stop coming first, and
    // the ones already on screen are allowed to run past before anybody moves
    var swapAt = 0, spawning = true, swapping = false;
    function swap(now) {
      swapping = true; order.reverse();
      order.forEach(function (ri, k) { G.to(rabbits[ri], { x: slot[k], duration: 1, ease: 'power2.inOut' }); });
      setTimeout(function () { swapping = false; spawning = true; }, 1100);
      swapAt = now + 7000 + Math.random() * 4000;
    }
    // one world speed, like the dinosaur game: obstacles never overtake each other
    var SP = 340, AIR_Y = [58, 92], GROUND_SIZE = [28, 36, 50];
    var items = [], last = 0, nextAt = 0, raf = 0, seen = false, boost = 0;
    function spawn(now) {
      var air = Math.random() < .3, pool = air ? AIR_OBS : GROUND_OBS, pick = pool[(Math.random() * pool.length) | 0];
      var el = document.createElement('div'); el.className = 'ob' + (pick.tone ? ' ob--' + pick.tone : '') + (air ? ' ob--air' : '');
      el.innerHTML = pick.img ? '<img src="' + pick.img + '" alt="" loading="lazy">' : pick.svg;
      var size = (air ? 30 + ((Math.random() * 2) | 0) * 8 : GROUND_SIZE[(Math.random() * GROUND_SIZE.length) | 0]) * scale;
      var x0 = root.clientWidth + size;
      el.style.width = size + 'px';
      el.style.marginBottom = (air ? AIR_Y[(Math.random() * AIR_Y.length) | 0] * scale : 0) + 'px';
      el.style.transform = 'translate(' + x0.toFixed(1) + 'px,0px)';   // placed before its first paint
      obsLayer.appendChild(el);
      items.push({ el: el, x: x0, y: 0, vy: 0, rot: 0, alpha: 1, size: size, air: air, dead: false, hit: 0 });
      nextAt = now + ((200 + Math.random() * 220) * scale + size * 1.2) / (SP * scale) * 1000;   // a steady gap in distance
    }
    function centre(r) { return crew.offsetLeft + r.offsetLeft + (G.getProperty(r, 'x') || 0) + r.offsetWidth * .5; }
    function tick(now) {
      raf = 0;
      var dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
      var speed = (1 + boost) * scale; boost *= .93;
      if (!swapAt) swapAt = now + 5000;
      else if (!swapping && now > swapAt) { spawning = false; if (!items.length) swap(now); }
      var sp = SP * speed;
      for (var i = items.length - 1; i >= 0; i--) {
        var o = items[i];
        if (o.dead) {
          o.x += 250 * dt; o.vy += 900 * dt; o.y += o.vy * dt; o.rot += 760 * dt; o.alpha -= dt * 1.4;
        } else {
          o.x -= sp * dt;                                        // ground pieces stay upright, like the dino game
          for (var ri = 0; ri < rabbits.length; ri++) {            // whoever it reaches first deals with it
            if (o.hit & (1 << ri)) continue;
            var tta = (o.x - centre(rabbits[ri])) / sp;
            if (tta < 0) { o.hit |= 1 << ri; continue; }
            if (tta < (o.air ? .16 : .38)) {
              o.hit |= 1 << ri;
              if (o.air) { swat(rabbits[ri]); o.dead = true; o.vy = -430; break; }
              jump(rabbits[ri]);
            }
          }
        }
        o.el.style.opacity = o.alpha < 1 ? Math.max(0, o.alpha) : '';
        o.el.style.transform = 'translate(' + o.x.toFixed(1) + 'px,' + o.y.toFixed(1) + 'px) rotate(' + o.rot.toFixed(1) + 'deg)';
        if (o.x < -o.size - 40 || o.alpha <= 0) { o.el.remove(); items.splice(i, 1); }
      }
      if (spawning && now > nextAt) spawn(now);
      if (seen) raf = requestAnimationFrame(tick); else last = 0;
    }
    // a card for whoever you tapped
    var dlg = document.getElementById('crew');
    function openCard(who) {
      var c = CREW[who]; if (!dlg || !c) return;
      dlg.setAttribute('data-who', who);
      var art = dlg.querySelector('[data-crew-art]');
      if (art && !art.children.length) buildRabbit(art, who);
      dlg.querySelector('[data-crew-role]').textContent = c.role;
      dlg.querySelector('[data-crew-name]').textContent = c.name;
      dlg.querySelector('[data-crew-nick]').textContent = '@' + c.nick;
      var list = dlg.querySelector('[data-crew-list]'); list.textContent = '';
      c.does.forEach(function (d) { var li = document.createElement('li'); li.textContent = d; list.appendChild(li); });
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }
    if (dlg) {
      var art0 = dlg.querySelector('[data-crew-art]');
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-crew-close]')) dlg.close(); });
      rabbits.forEach(function (r) {
        var who = r.getAttribute('data-who'); if (!who) return;
        r.setAttribute('role', 'button'); r.setAttribute('tabindex', '0');
        r.addEventListener('click', function () { openCard(who); });
        r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(who); } });
      });
      if (art0) art0.textContent = '';
      dlg.addEventListener('close', function () { var a = dlg.querySelector('[data-crew-art]'); if (a) a.textContent = ''; });
    }
    addEventListener('resize', debounce(function () { measure(); order.forEach(function (ri, k) { G.set(rabbits[ri], { x: slot[k] }); }); }, 200));
    ST.create({
      trigger: root, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { seen = self.isActive; if (seen && !raf) { last = 0; raf = requestAnimationFrame(tick); } },
      onUpdate: function (self) { boost = Math.min(3.2, Math.abs(self.getVelocity()) / 700); }
    });
  }

  function auto() {
    document.querySelectorAll('[data-scene="typer"]').forEach(mountTyper);
    document.querySelectorAll('[data-scene="dopa"]').forEach(mountBlobs);
    document.querySelectorAll('[data-runner]').forEach(mountRunner);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  window.NewMeansScenes = { typer: mountTyper, dopa: mountBlobs, runner: mountRunner };
})();
