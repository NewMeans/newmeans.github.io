/* Typer configurator: the desk in the middle, every shop part as a round chip around it.
 * Data comes from assets/shop/catalog.json (exported from the game). Picking a frame changes the frame,
 * the cable and the page background (a circle that grows from the desk). The monitor types what you picked;
 * the keyboard types what you press. The ball you pick goes into the board below. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('[data-configurator]'); if (!root || !window.TyperKeyboard) return;
  var P = window.NewMeansProduct;
  var SHOP = 'assets/shop/';
  var MON = { '2000': { inset: '11% 9% 22% 9%', ar: '1354/1222' }, '2001': { inset: '4% 4% 24% 4%', ar: '1380/1134' }, '2002': { inset: '4% 4% 24% 4%', ar: '1381/1134' }, '2003': { inset: '6% 6% 33% 6%', ar: '1428/1208' } };
  var PLUG = { '3000': 86, '3001': 45, '3002': 80, '3003': 80, '3004': 80, '3005': 80, '3007': 59, '3008': 80, '3009': 80, '3010': 80, '3011': 80, '3012': 80 };
  var KEYS = 'qwertyasdfghzxcvbn';
  // a short row per part rather than the whole shop; monitors are few enough to keep whole
  var PICK = {
    keycap: ['5000', '5005', '5012', '5011', '5007'],
    frame: ['3000', '3005', '3003', '3008', '3007'],
    switch: ['4000', '4004', '4002', '4007', '4006'],
    sculpture: ['1000', '1005', '1007', '1001', '1002']
  };
  var CAP_FACE = { '5005': 1, '5007': 9 };            // the cap that stands for the set
  // the chip shows the part as the game draws it, not the shop's sample tile
  var SPRITE = {
    keycap: function (it) { return 'keycap/' + it.id + '_' + (CAP_FACE[it.id] || 0) + '.png'; },
    frame: function (it) { return it.frame; },
    monitor: function (it) { return it.sprite; },
    switch: function (it) { return it.sprite; },
    sculpture: function (it) { return it.sprite; },
    ball: function (it) { return it.sprite; }
  };
  var desk = root.querySelector('[data-desk]'), kb = root.querySelector('[data-typer-keyboard]'), cable = root.querySelector('[data-cable]');
  var monBox = root.querySelector('[data-monitor-box]'), monImg = root.querySelector('[data-monitor]'), screen = root.querySelector('[data-screen]'), text = root.querySelector('[data-screen-text]');
  var sculpt = root.querySelector('[data-sculpture]'), bgBase = root.querySelector('[data-bg-base]'), bgNext = root.querySelector('[data-bg-next]'), soundBtn = root.querySelector('[data-sound]');
  var cur = {}, cat = null, typed = '';
  function t(k) { return window.i18n ? window.i18n.t(k) : k; }

  // ------------------------------------------------ the monitor: type into it
  var PROMPT = 'TYPE SOMETHING', flash = '', flashT = 0, WRAP = 22;
  function render() {
    var head = flash || PROMPT, body = typed, rows = [];
    for (var i = 0; i < body.length; i += WRAP) rows.push(body.slice(i, i + WRAP));
    if (rows.length > 3) rows = rows.slice(rows.length - 3);
    text.textContent = 'TYPER\n> ' + head + '\n\n' + rows.join('\n');
    var c = document.createElement('span'); c.className = 'caret'; text.appendChild(c);
  }
  function say(name) {                                   // a picked part flashes on the prompt line
    flash = name.toUpperCase(); render();
    clearTimeout(flashT); flashT = setTimeout(function () { flash = ''; render(); }, 1500);
  }
  // ------------------------------------------------ apply parts
  function apply(kind, item, silent) {
    cur[kind] = item.id;
    if (kind === 'keycap') TyperKeyboard.setSkin(kb, { slots: item.slots.map(function (n) { return SHOP + 'keycap/' + item.id + '_' + n + '.png'; }), bed: item.bed });
    if (kind === 'frame') {
      TyperKeyboard.setSkin(kb, { geo: item.geo, frame: SHOP + item.frame });
      cable.hidden = !item.cable; if (item.cable) { cable.src = SHOP + item.cable; cable.style.setProperty('--plug-y', (PLUG[item.id] || 80) + '%'); }
      paint(item.bg);
    }
    if (kind === 'monitor') { monImg.src = SHOP + item.sprite; var m = MON[item.id] || MON['2000']; monBox.style.setProperty('--ar', m.ar); screen.style.setProperty('--inset', m.inset); screen.style.setProperty('--fg', item.fg); }
    if (kind === 'switch') { TyperKeyboard.setSwitch(kb, item.id); if (P) P.sound.set(item.id); }
    if (kind === 'sculpture') sculpt.src = SHOP + item.sprite;
    if (kind === 'ball') { var play = document.querySelector('[data-typer-play]'); if (play && play.__playApi) play.__playApi.setBall(SHOP + item.sprite); }
    if (kind === 'keycap') { var play2 = document.querySelector('[data-typer-play]'); if (play2 && play2.__playApi) play2.__playApi.setKeycap(SHOP + 'keycap/' + item.id + '_0.png', item.text); }
    root.querySelectorAll('[data-group="' + kind + '"] .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === item.id); });
    if (!silent) { say(item.name); TyperKeyboard.play(kb); }
  }

  // ------------------------------------------------ background: a circle that grows from the desk
  var painting = false, queued = null;
  function paint(color) {
    if (!color) return;
    if (reduce || !bgNext) { bgBase.style.setProperty('--c', color); return; }
    if (painting) { queued = color; return; }
    painting = true;
    bgNext.style.transition = 'none'; bgNext.classList.remove('is-in'); bgNext.style.setProperty('--c', color); void bgNext.offsetWidth; bgNext.style.transition = '';
    bgNext.classList.add('is-in');
    setTimeout(function () {
      bgBase.style.setProperty('--c', color); bgNext.style.transition = 'none'; bgNext.classList.remove('is-in'); void bgNext.offsetWidth; bgNext.style.transition = '';
      painting = false; if (queued) { var q = queued; queued = null; paint(q); }
    }, 760);
  }

  // ------------------------------------------------ chips
  function build(kind, items) {
    var group = root.querySelector('[data-group="' + kind + '"]'), row = group.querySelector('.chips'), n = group.querySelector('.group__n');
    var only = PICK[kind]; if (only) items = only.map(function (id) { return items.filter(function (i) { return i.id === id; })[0]; }).filter(Boolean);
    if (n) n.textContent = items.length;
    items.forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip chip--' + kind; b.dataset.id = it.id; b.title = it.name; b.setAttribute('aria-label', it.name); b.setAttribute('aria-pressed', 'false');
      var im = new Image(); im.src = SHOP + SPRITE[kind](it); im.alt = ''; im.loading = 'lazy'; b.appendChild(im);
      b.addEventListener('click', function () { apply(kind, it); });
      row.appendChild(b);
    });
  }

  // ------------------------------------------------ keyboard: sound + typing into the screen
  function put(ch) { typed += ch; if (typed.length > 66) typed = typed.slice(-66); render(); }
  kb.addEventListener('tp:key', function (e) { put((KEYS[e.detail.index] || '').toUpperCase()); });
  function hitRandomKey() {
    var caps = kb.querySelectorAll('[data-key]'); if (!caps.length) return;
    var c = caps[(Math.random() * caps.length) | 0];
    c.classList.add('is-active'); clearTimeout(c._t); c._t = setTimeout(function () { c.classList.remove('is-active'); }, 110);
    TyperKeyboard.play(kb);
  }
  var live = false;
  if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { live = e.isIntersecting; }); }, { threshold: .3 }).observe(root);
  else live = true;
  document.addEventListener('keydown', function (e) {
    if (!live || e.metaKey || e.ctrlKey || e.altKey) return;
    var el = e.target; if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable || el.tagName === 'BUTTON' || el.tagName === 'A')) return;
    if (e.key === 'Backspace') { e.preventDefault(); typed = typed.slice(0, -1); render(); hitRandomKey(); return; }
    if (e.key === 'Enter') { typed = ''; render(); hitRandomKey(); return; }
    if (e.key.length !== 1) return;
    put(e.key.toUpperCase()); hitRandomKey();
  });
  if (soundBtn) soundBtn.addEventListener('click', function () {
    var on = soundBtn.getAttribute('aria-pressed') === 'true'; on = !on;
    soundBtn.setAttribute('aria-pressed', on); soundBtn.setAttribute('aria-label', t(on ? 'typer.sound.on' : 'typer.sound.off'));
    TyperKeyboard.setSound(kb, on); if (P) P.sound.mute(!on);
  });

  // a wordless cue: three keycaps press themselves, the speaker breathes twice
  function cue() {
    if (reduce) return;
    var caps = kb.querySelectorAll('[data-key]'); if (!caps.length) return;
    [7, 8, 9].forEach(function (i, k) { setTimeout(function () { var c = caps[i]; if (!c) return; c.classList.add('is-active'); setTimeout(function () { c.classList.remove('is-active'); }, 120); }, 1200 + k * 180); });
    if (soundBtn) setTimeout(function () { soundBtn.classList.add('is-cue'); setTimeout(function () { soundBtn.classList.remove('is-cue'); }, 2300); }, 1700);
  }

  // ------------------------------------------------ start
  P.catalog().then(function (c) {
    if (!c) return; cat = c;
    build('keycap', c.keycap); build('frame', c.frame); build('switch', c.switch); build('monitor', c.monitor); build('sculpture', c.sculpture);
    function first(kind, id) { return c[kind].filter(function (i) { return i.id === id; })[0] || c[kind][0]; }
    apply('keycap', first('keycap', '5000'), true); apply('frame', first('frame', '3000'), true); apply('monitor', first('monitor', '2000'), true);
    apply('switch', first('switch', '4000'), true); apply('sculpture', first('sculpture', '1000'), true);
    render();
    if (window.IntersectionObserver) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); cue(); } }); }, { threshold: 0.4 }); io.observe(root); } else cue();
  });
  window.addEventListener('nm:langchange', function () { if (soundBtn) soundBtn.setAttribute('aria-label', t(soundBtn.getAttribute('aria-pressed') === 'true' ? 'typer.sound.on' : 'typer.sound.off')); });
})();
