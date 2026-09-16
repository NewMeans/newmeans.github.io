/* Home scenes and the Dopamine University pieces, choreographed with GSAP ScrollTrigger.
 * Typer: a ball drops out of a ceiling hole, bounces across five keycaps (x linear, y quadratic = gravity),
 *        types T Y P E R, breaks the last cap and falls into a floor hole. Scrubbed by scroll; "replay" plays it in time
 *        with a random ball from the game. Dopamine: two wordless cards; a sparkle bean bounces over message bars,
 *        then a report writes itself. Reveals happen once; progress inside a card never goes backwards (ratchet).
 * Count: the big number that keeps scrambling (Dopamine page). */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, narrow = matchMedia('(max-width: 720px)');
  var P = window.NewMeansProduct, sound = P && P.sound, G = window.gsap, ST = window.ScrollTrigger;
  if (!G || !ST) return;
  G.registerPlugin(ST);
  var touched = false; addEventListener('pointerdown', function () { touched = true; }, { once: true });
  function debounce(fn, ms) { var id; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }

  // ================================================================ Typer
  var U = { W: 760, H: 420, BAND: 28, CAPTOP: 288, R: 17, CAPX: [100, 240, 380, 520, 660], APEX: [200, 172, 148, 127], SHARD: [[-90, -90], [-30, -140], [40, -130], [100, -80]] };
  function mountTyper(root) {
    var pin = root.querySelector('.scene__pin'), stage = root.querySelector('.stage'), ball = stage.querySelector('.ball');
    var caps = [].slice.call(stage.querySelectorAll('.cap')), letters = caps.map(function (c) { return c.querySelector('b'); });
    var shards = [].slice.call(stage.querySelectorAll('.shards i')), holeT = stage.querySelector('.hole--top'), holeB = stage.querySelector('.hole--bottom');
    var logo = root.querySelector('.scene__logo'), tags = root.querySelector('.tags'), act = root.querySelector('.scene__act'), replayBtn = root.querySelector('.replay');
    'TYPER'.split('').forEach(function (ch, i) { if (letters[i]) letters[i].textContent = ch; });
    var balls = [ball.getAttribute('src')];
    if (P) P.catalog().then(function (c) { if (c && c.ball) balls = c.ball.map(function (b) { return 'assets/shop/' + b.sprite; }); });
    var s = 1, tl = null, st = null, rtl = null;
    function measure() { s = stage.clientWidth / U.W || 1; }
    function build(dur, replaying) {
      measure();
      var tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
      var yRest = (U.CAPTOP - U.R) * s, yTop = (U.BAND - U.R - 8) * s, yOut = (U.H + U.R + 8) * s;
      tl.set(ball, { xPercent: -50, yPercent: -50, x: U.CAPX[0] * s, y: yTop, opacity: 1 }, 0);
      tl.set(holeT, { xPercent: -50, yPercent: 50, scale: 0 }, 0); tl.set(holeB, { xPercent: -50, yPercent: -50, scale: 0 }, 0);
      tl.set(letters, { opacity: 0 }, 0); tl.set(shards, { x: 0, y: 0, rotation: 0, opacity: 0 }, 0); tl.set(caps[4], { opacity: 1, scale: 1 }, 0);
      tl.fromTo(logo, { scale: 1.08 }, { scale: 1, duration: dur * .08 }, 0);
      tl.fromTo(tags, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * .08 }, 0);
      tl.fromTo(caps, { y: 60 * s, opacity: 0 }, { y: 0, opacity: 1, duration: dur * .06, stagger: dur * .012 }, 0);
      tl.to(holeT, { scale: 1, duration: dur * .05 }, dur * .08);
      tl.to(ball, { y: yRest, duration: dur * .11, ease: 'power2.in' }, dur * .13);
      tl.to(holeT, { scale: 0, duration: dur * .06 }, dur * .16);
      function forward() { return replaying || (st && st.direction === 1); }
      for (var i = 0; i < 5; i++) {
        var th = dur * (.24 + .12 * i);
        tl.to(caps[i], { y: 4 * s, duration: dur * .02 }, th).to(caps[i], { y: 0, duration: dur * .03 }, th + dur * .02);
        tl.set(letters[i], { opacity: 1 }, th);
        tl.call(function () { if (touched && sound && forward()) sound.play(); }, null, th);
        if (i < 4) {
          var d = dur * .12;
          tl.to(ball, { x: U.CAPX[i + 1] * s, duration: d }, th);
          tl.to(ball, { y: yRest - U.APEX[i] * s, duration: d / 2, ease: 'power1.out' }, th).to(ball, { y: yRest, duration: d / 2, ease: 'power1.in' }, th + d / 2);
        }
      }
      var t5 = dur * .72;
      tl.to(caps[4], { opacity: 0, scale: .72, duration: dur * .04 }, t5);
      shards.forEach(function (sh, i) { tl.fromTo(sh, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: U.SHARD[i][0] * s, y: (U.SHARD[i][1] + 110) * s, rotation: 220, opacity: 0, duration: dur * .12, ease: 'power1.out' }, t5); });
      tl.to(ball, { y: yOut, duration: dur * .12, ease: 'power2.in' }, t5);
      tl.to(holeB, { scale: 1, duration: dur * .04 }, dur * .76).to(holeB, { scale: 0, duration: dur * .04 }, dur * .85);
      tl.fromTo(act, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: dur * .1 }, dur * .86);
      tl.fromTo(replayBtn, { opacity: 0 }, { opacity: 1, duration: dur * .06 }, dur * .94);
      return tl;
    }
    function setup() {
      if (rtl) { rtl.kill(); rtl = null; }
      if (st) { st.kill(); st = null; }
      if (tl) tl.kill();
      var isStatic = reduce || narrow.matches;
      root.classList.toggle('is-static', isStatic);
      tl = build(1, false);
      if (isStatic) { tl.progress(1); return; }
      st = ST.create({ trigger: root, start: 'top 64px', end: 'bottom bottom', pin: pin, pinSpacing: false, scrub: .6, animation: tl, invalidateOnRefresh: true });
    }
    var playing = false;
    function replay() {
      if (playing && rtl) rtl.kill();
      playing = true; replayBtn.disabled = true;
      var cur = ball.getAttribute('src'), pool = balls.filter(function (b) { return b !== cur; });
      ball.setAttribute('src', pool.length ? pool[(Math.random() * pool.length) | 0] : cur);
      if (st) st.disable(false);
      touched = true;
      rtl = build(3.4, true);
      rtl.eventCallback('onComplete', function () {
        if (rtl) rtl.kill(); rtl = null; playing = false; replayBtn.disabled = false;
        tl.progress(0).progress(1); if (st) st.enable();
      });
      rtl.play(0);
    }
    replayBtn.addEventListener('click', replay);
    caps.forEach(function (k) {
      k.addEventListener('pointerenter', function () { k.classList.add('is-down'); });
      k.addEventListener('pointerleave', function () { k.classList.remove('is-down'); });
      k.addEventListener('click', function () { if (sound) sound.play(); });
    });
    setup();
    addEventListener('resize', debounce(function () { if (!playing) setup(); }, 200));
    if (narrow.addEventListener) narrow.addEventListener('change', function () { if (!playing) setup(); });
  }

  // ================================================================ Dopamine cards (home scene and dopamine.html hero)
  function mountDopa(root) {
    var cards = root.querySelector('[data-dopa-cards]'); if (!cards) return;
    var c1 = cards.querySelector('.card--chat'), c2 = cards.querySelector('.card--report');
    var bars = [].slice.call(c1.querySelectorAll('.bar')), bean = c1.querySelector('.bean');
    var lines = [].slice.call(c2.querySelectorAll('.ln')), track = c2.querySelector('.track'), needle = c2.querySelector('.needle'), stamp = c2.querySelector('.stamp');
    var head = root.querySelector('.scene__head'), act = root.querySelector('.scene__act');
    var stops = [0, 2, 4], BR = 14;
    function spot(i) { var b = bars[i].getBoundingClientRect(), c = c1.getBoundingClientRect(); return { x: b.right - c.left - 24, y: b.top - c.top - BR + 2 }; }
    function beanTL() {
      var tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
      var start = { x: -30, y: -40 }, apex = [130, 100, 80], prev = start, seg = 1 / 3.2;
      tl.set(bean, { xPercent: -50, yPercent: -50, x: start.x, y: start.y, opacity: 0 }, 0);
      tl.set(bean, { opacity: 1 }, 0.02);
      tl.set(bars, { y: 0 }, 0); tl.set(bars.map(function (b) { return b.querySelector('i'); }), { opacity: 0 }, 0);
      stops.forEach(function (bi, k) {
        var p = spot(bi), t0 = seg * k, d = seg;
        tl.to(bean, { x: p.x, duration: d }, t0);
        tl.to(bean, { y: Math.min(prev.y, p.y) - apex[k], duration: d / 2, ease: 'power1.out' }, t0).to(bean, { y: p.y, duration: d / 2, ease: 'power1.in' }, t0 + d / 2);
        var th = t0 + d;
        tl.to(bars[bi], { y: 3, duration: .03 }, th).to(bars[bi], { y: 0, duration: .05 }, th + .03);
        tl.set(bars[bi].querySelector('i'), { opacity: 1 }, th);
        tl.call(function (el) { el.classList.add('is-read'); }, [bars[bi]], th);
        prev = p;
      });
      tl.to(bean, { rotation: 90, duration: .18, ease: 'power1.out' }, seg * 3);
      return tl;
    }
    function repTL() {
      var tl = G.timeline({ paused: true });
      tl.fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: .5, stagger: .1, ease: 'power2.out' }, 0);
      var tw = track ? track.clientWidth : 200;
      tl.fromTo(needle, { xPercent: -50, yPercent: -50, x: 0 }, { x: -tw * .18, duration: .5, ease: 'power2.inOut' }, .45);
      tl.fromTo(stamp, { opacity: 0, scale: 1.8, rotation: -14 }, { opacity: .95, scale: 1, rotation: -14, duration: .3, ease: 'power3.out' }, .75);
      return tl;
    }
    var btl = beanTL(), rp = repTL();
    if (reduce) { btl.progress(1); rp.progress(1); return; }
    G.set([c1, c2], { opacity: 0, y: 40 }); G.set(act, { opacity: 0, y: 12 }); if (head) G.set(head, { opacity: 0, y: 8 });
    var c2shown = false;
    function showC2() { if (c2shown) return; c2shown = true; G.to(c2, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }); G.to(act, { opacity: 1, y: 0, duration: .6, delay: .3 }); }
    if (head) ST.create({ trigger: root, start: 'top 75%', once: true, onEnter: function () { G.to(head, { opacity: 1, y: 0, duration: .6 }); } });
    ST.create({ trigger: c1, start: 'top 78%', once: true, onEnter: function () { G.to(c1, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }); } });
    var bp = 0, rpp = 0;
    ST.create({ trigger: c1, start: 'top 78%', end: 'top 28%', onUpdate: function (self) { bp = Math.max(bp, self.progress); btl.progress(bp); if (bp > .999) showC2(); } });
    ST.create({ trigger: c2, start: 'top 82%', end: 'top 32%', onUpdate: function (self) { rpp = Math.max(rpp, self.progress); rp.progress(rpp); } });
    bars.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (bp < .999) return;
        var p = spot(i); G.to(bean, { x: p.x, y: p.y, duration: .45, ease: 'power2.out' });
        b.classList.add('is-read'); G.set(b.querySelector('i'), { opacity: 1 });
        var tw = track ? track.clientWidth : 200; G.to(needle, { x: (i / (bars.length - 1) - .5) * tw * .7, duration: .5, ease: 'power2.inOut' });
      });
    });
    addEventListener('resize', debounce(function () { var p = bp; btl.kill(); btl = beanTL(); btl.progress(p); }, 200));
  }

  // ================================================================ the scrambling number
  function mountCount(root) {
    var digits = [].slice.call(root.querySelectorAll('[data-digits] span')); if (!digits.length) return;
    function show(v) { for (var i = 0; i < digits.length; i++) digits[i].textContent = v[i] || '0'; }
    if (reduce) { show('2000'); return; }
    var visible = true, first = true, timer = null;
    function rnd(i) { return String(i === 0 ? 1 + ((Math.random() * 9) | 0) : (Math.random() * 10) | 0); }
    function next() { if (first) { first = false; return '2000'; } return String(1000 + ((Math.random() * 9000) | 0)); }
    function scramble(ticks, done) { var n = 0; (function step() { if (!visible) { timer = setTimeout(step, 300); return; } for (var i = 0; i < digits.length; i++) digits[i].textContent = rnd(i); if (++n < ticks) timer = setTimeout(step, 70); else done(); })(); }
    function settle(target, done) { var i = 0; (function step() { digits[i].textContent = target[i]; for (var k = i + 1; k < digits.length; k++) digits[k].textContent = rnd(k); if (++i < digits.length) timer = setTimeout(step, 150); else done(); })(); }
    function cycle() { scramble(24, function () { settle(next(), function () { timer = setTimeout(cycle, 1400); }); }); }
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting && !document.hidden; }); }, { threshold: 0.2 }).observe(root);
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
    cycle();
  }

  function auto() {
    document.querySelectorAll('[data-scene="typer"]').forEach(mountTyper);
    document.querySelectorAll('[data-scene="dopa"]').forEach(mountDopa);
    document.querySelectorAll('[data-count]').forEach(mountCount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  window.NewMeansScenes = { typer: mountTyper, dopa: mountDopa, count: mountCount };
})();
