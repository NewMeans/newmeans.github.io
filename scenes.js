/* Home scenes and the Dopamine University pieces, choreographed with GSAP ScrollTrigger.
 * Typer: a portal splits open, a ball rolls out, bounces across five keycaps (x linear, y quadratic = gravity)
 *        typing T Y P E R, bounces off the last one and drops into a second portal. Scrubbed by scroll; "replay"
 *        plays it in time with a random ball from the game. Dopamine: two wordless cards; a sparkle hops across the
 *        tests and settles on one, then a report writes itself. Reveals happen once; progress never rewinds (ratchet).
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
  var U = {
    W: 760, H: 420, R: 17, CAPTOP: 286,
    CAPX: [92, 212, 332, 452, 572],
    IN: { x: 92, y: 40 }, OUT: { x: 700, y: 392 },
    APEX: [176, 152, 132, 115], LAST: 150,
    GAP: 20                                   // how far each portal half slides apart
  };
  var SPIN = 360 / (2 * Math.PI * U.R);        // degrees per stage unit rolled
  function mountTyper(root) {
    var pin = root.querySelector('.scene__pin'), stage = root.querySelector('.stage'), ball = stage.querySelector('.ball');
    var caps = [].slice.call(stage.querySelectorAll('.cap')), letters = caps.map(function (c) { return c.querySelector('b'); });
    var pIn = stage.querySelector('.portal--in'), pOut = stage.querySelector('.portal--out');
    var halves = function (p) { return [p.querySelector('.portal__t'), p.querySelector('.portal__b')]; };
    var logo = root.querySelector('.scene__logo'), tags = root.querySelector('.tags'), act = root.querySelector('.scene__act'), replayBtn = root.querySelector('.replay');
    'TYPER'.split('').forEach(function (ch, i) { if (letters[i]) letters[i].textContent = ch; });
    var balls = [ball.getAttribute('src')];
    if (P) P.catalog().then(function (c) { if (c && c.ball) balls = c.ball.map(function (b) { return 'assets/shop/' + b.sprite; }); });
    var s = 1, tl = null, st = null, rtl = null;
    function measure() { s = stage.clientWidth / U.W || 1; }
    function build(dur, replaying) {
      measure();
      var tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
      var yRest = (U.CAPTOP - U.R) * s, gap = U.GAP * s, rot = 0;
      var hi = halves(pIn), ho = halves(pOut);
      tl.set(ball, { xPercent: -50, yPercent: -50, x: U.IN.x * s, y: U.IN.y * s, scale: .25, opacity: 0, rotation: 0 }, 0);
      tl.set(hi.concat(ho), { y: 0 }, 0);
      tl.set([pIn, pOut], { opacity: 0 }, 0);
      tl.set(letters, { opacity: 0 }, 0);
      tl.fromTo(logo, { scale: 1.08 }, { scale: 1, duration: dur * .08 }, 0);
      tl.fromTo(tags, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * .08 }, 0);
      tl.fromTo(caps, { y: 60 * s, opacity: 0 }, { y: 0, opacity: 1, duration: dur * .06, stagger: dur * .012 }, 0);
      // the portal fades in, splits open, and the ball rolls out from between the halves
      tl.to(pIn, { opacity: 1, duration: dur * .03 }, dur * .05);
      tl.to(hi[0], { y: -gap, duration: dur * .06, ease: 'power2.out' }, dur * .08).to(hi[1], { y: gap, duration: dur * .06, ease: 'power2.out' }, dur * .08);
      tl.to(ball, { scale: 1, opacity: 1, duration: dur * .04 }, dur * .11);
      rot += 30;
      tl.to(ball, { y: yRest, rotation: rot, duration: dur * .10, ease: 'power2.in' }, dur * .14);
      tl.to(hi[0], { y: 0, duration: dur * .06, ease: 'power2.in' }, dur * .18).to(hi[1], { y: 0, duration: dur * .06, ease: 'power2.in' }, dur * .18);
      tl.to(pIn, { opacity: 0, duration: dur * .04 }, dur * .25);
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
      // off the last keycap, over the floor, down into the second portal
      var t5 = dur * .72, d5 = dur * .14;
      rot += (U.OUT.x - U.CAPX[4]) * SPIN;
      tl.to(ball, { x: U.OUT.x * s, rotation: rot, duration: d5 }, t5);
      tl.to(ball, { y: yRest - U.LAST * s, duration: d5 * .4, ease: 'power1.out' }, t5).to(ball, { y: U.OUT.y * s, duration: d5 * .6, ease: 'power1.in' }, t5 + d5 * .4);
      tl.to(pOut, { opacity: 1, duration: dur * .03 }, dur * .73);
      tl.to(ho[0], { y: -gap, duration: dur * .05, ease: 'power2.out' }, dur * .76).to(ho[1], { y: gap, duration: dur * .05, ease: 'power2.out' }, dur * .76);
      tl.to(ball, { scale: .25, opacity: 0, duration: dur * .04 }, dur * .855);
      tl.to(ho[0], { y: 0, duration: dur * .06, ease: 'power2.in' }, dur * .87).to(ho[1], { y: 0, duration: dur * .06, ease: 'power2.in' }, dur * .87);
      tl.to(pOut, { opacity: 0, duration: dur * .04 }, dur * .94);
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
    var c1 = cards.querySelector('.card--tests'), c2 = cards.querySelector('.card--report');
    var tiles = [].slice.call(c1.querySelectorAll('.tile')), bean = c1.querySelector('.bean');
    var lines = [].slice.call(c2.querySelectorAll('.ln')), track = c2.querySelector('.track'), needle = c2.querySelector('.needle'), stamp = c2.querySelector('.stamp');
    var head = root.querySelector('.scene__head'), act = root.querySelector('.scene__act');
    var hops = [0, 1, 2, 4], BR = 14;
    function spot(i) { var b = tiles[i].getBoundingClientRect(), c = c1.getBoundingClientRect(); return { x: b.left - c.left + b.width / 2, y: b.top - c.top - BR + 4 }; }
    function pick(i) { tiles.forEach(function (t, k) { t.classList.toggle('is-picked', k === i); }); }
    function beanTL() {
      var tl = G.timeline({ paused: true, defaults: { ease: 'none' } });
      var start = { x: -26, y: -30 }, apex = [120, 96, 78], prev = start, seg = 1 / (hops.length - .2);
      tl.set(bean, { xPercent: -50, yPercent: -50, x: start.x, y: start.y, opacity: 0, rotation: 0 }, 0);
      tl.set(bean, { opacity: 1 }, .02);
      tl.set(tiles, { y: 0 }, 0);
      tl.call(function () { tiles.forEach(function (t) { t.classList.remove('is-hit', 'is-picked'); }); }, null, 0);
      hops.forEach(function (ti, k) {
        var p = spot(ti), t0 = seg * k, d = seg, last = k === hops.length - 1;
        tl.to(bean, { x: p.x, rotation: 90 * (k + 1), duration: d }, t0);
        tl.to(bean, { y: Math.min(prev.y, p.y) - (apex[k] || 60), duration: d / 2, ease: 'power1.out' }, t0).to(bean, { y: p.y, duration: d / 2, ease: 'power1.in' }, t0 + d / 2);
        var th = t0 + d;
        tl.to(tiles[ti], { y: 3, duration: .03 }, th).to(tiles[ti], { y: 0, duration: .05 }, th + .03);
        tl.call(function (el, isLast, idx) {
          if (isLast) pick(idx); else { el.classList.add('is-hit'); setTimeout(function () { el.classList.remove('is-hit'); }, 420); }
        }, [tiles[ti], last, ti], th);
        prev = p;
      });
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
    tiles.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (bp < .999) return;
        var p = spot(i); G.to(bean, { x: p.x, y: p.y, rotation: '+=180', duration: .45, ease: 'power2.out' });
        pick(i);
        var tw = track ? track.clientWidth : 200; G.to(needle, { x: (i / (tiles.length - 1) - .5) * tw * .7, duration: .5, ease: 'power2.inOut' });
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
