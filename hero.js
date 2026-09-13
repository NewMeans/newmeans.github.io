/* NewMeans home hero: the living kaomoji rabbit and the word slot machine.
 * The rabbit follows the cursor, frets when a letter is taken and calms when it springs home.
 * The slot draws a word that Typer or Dopamine University gives; each word has a colour, props
 * (some of them react to clicks), an eye mood, a rarity and, for product words, a way into the product.
 * Usage: <div data-nm-hero data-acc="acc-id"></div>. Pieces: assets/brand/logo-pieces/pN.png (masks). */
(function () {
  'use strict';
  var PAL = { mint: { rabbit: '#85C6A8', text: '#3E765E' }, coral: { rabbit: '#FF6666', text: '#984645' }, gold: { rabbit: '#DAB249', text: '#7C5F00' }, amber: { rabbit: '#E2AB70', text: '#885716' }, peach: { rabbit: '#ECA47F', text: '#90502C' }, rose: { rabbit: '#EB9DBB', text: '#8F4966' }, plum: { rabbit: '#DCA0D6', text: '#834D7E' }, lavender: { rabbit: '#C1A9EE', text: '#6C5594' }, periwinkle: { rabbit: '#A4B3F8', text: '#535D9C' }, sky: { rabbit: '#79C0F1', text: '#1F6A96' }, teal: { rabbit: '#5DCBD1', text: '#007276' }, sage: { rabbit: '#95C78A', text: '#427138' }, olive: { rabbit: '#B5BF73', text: '#62691B' }, cocoa: { rabbit: '#D0B198', text: '#795D46' }, indigo: { rabbit: '#AAB1F7', text: '#595C9B' }, magenta: { rabbit: '#EE95D1', text: '#8C4877' }, lime: { rabbit: '#A9C37B', text: '#566D27' }, charcoal: { rabbit: '#706B64', text: '#3B3732' } };
  // What the products give. Typer: keyboard sounds, a desk of your own, breaking bricks. Dopamine University:
  // seeing yourself and your friends a little differently, said sideways. weight: common 10 / uncommon 6 / rare 3 / epic 1
  var WORDS = [
    { w: 'joyful', hue: 'mint', tier: 'common', acc: [] },
    { w: 'calm', hue: 'sage', tier: 'common', acc: ['zzz'], eyes: 'closed', ears: 'droop', dot: '…', product: 'typer' },
    { w: 'cozy', hue: 'peach', tier: 'common', acc: ['coffee'], product: 'typer' },
    { w: 'playful', hue: 'coral', tier: 'common', acc: ['hoop', 'ball'], product: 'typer' },
    { w: 'clicky', hue: 'teal', tier: 'common', acc: ['keycap'], product: 'typer', dot: 'key' },
    { w: 'curious', hue: 'lavender', tier: 'common', acc: ['magnifier'], product: 'dopa', dot: '?' },
    { w: 'cheerful', hue: 'gold', tier: 'common', acc: ['sun'] },
    { w: 'chatty', hue: 'periwinkle', tier: 'common', acc: ['bubble'], product: 'dopa', dot: '…' },
    { w: 'witty', hue: 'plum', tier: 'uncommon', acc: ['monocle'], product: 'dopa' },
    { w: 'surprising', hue: 'amber', tier: 'uncommon', acc: ['bang'], eyes: 'round', ears: 'perk', product: 'dopa', dot: '!' },
    { w: 'retro', hue: 'olive', tier: 'uncommon', acc: ['shades', 'monitor'], product: 'typer' },
    { w: 'rhythmic', hue: 'sky', tier: 'uncommon', acc: ['headphones', 'notes', 'mp3'], product: 'typer', dot: '♪' },
    { w: 'aesthetic', hue: 'cocoa', tier: 'uncommon', acc: ['cactus', 'monitor'], product: 'typer' },
    { w: 'thoughtful', hue: 'indigo', tier: 'uncommon', acc: ['mirror', 'thought'], ears: 'droop', product: 'dopa', dot: '…' },
    { w: 'satisfying', hue: 'lime', tier: 'uncommon', acc: ['keycap', 'stars'], product: 'typer' },
    { w: 'dramatic', hue: 'charcoal', tier: 'uncommon', acc: ['spotlight', 'tear'], product: 'dopa', dot: '!' },
    { w: 'connected', hue: 'rose', tier: 'uncommon', acc: ['friend', 'hearts'], product: 'dopa' },
    { w: 'exciting', hue: 'coral', tier: 'rare', acc: ['partyhat', 'popper', 'confetti'], eyes: 'round', ears: 'perk', dot: '!' },
    { w: 'ASMR', hue: 'teal', tier: 'rare', acc: ['headphones', 'waves'], eyes: 'closed', ears: 'droop', product: 'typer', dot: '~' },
    { w: 'insightful', hue: 'lavender', tier: 'rare', acc: ['gradcap', 'glasses', 'diploma'], product: 'dopa' },
    { w: 'dopamine', hue: 'magenta', tier: 'rare', acc: ['bolts', 'confetti'], eyes: 'round', ears: 'perk', product: 'dopa', dot: 'bolt' },
    { w: 'sparkly', hue: 'gold', tier: 'rare', acc: ['stars', 'stars2'], dot: 'star' },
    { w: 'smashing', hue: 'coral', tier: 'epic', acc: ['ball', 'keycap', 'keycap2', 'confetti'], eyes: 'round', ears: 'perk', product: 'typer', dot: '!' },
    { w: 'enlightened', hue: 'gold', tier: 'epic', acc: ['halo', 'stars', 'stars2', 'confetti'], eyes: 'closed', ears: 'droop', product: 'dopa', dot: 'star' },
    { w: 'mint choco', hue: 'mint', tier: 'epic', acc: ['icecream', 'keycap', 'keycap2', 'stars'], product: 'typer', dot: 'star' }
  ];
  var WEIGHT = { common: 10, uncommon: 6, rare: 3, epic: 1 };
  var PRODUCT = { typer: { key: 'home.typer.more', href: 'typer.html', icon: 'assets/brand/typer-icon.png', name: 'Typer' }, dopa: { key: 'home.dopa.more', href: 'dopamine.html', icon: 'assets/brand/dopamine-symbol.png', name: 'Dopamine University' } };
  var FALLBACK = { 'home.typer.more': '키보드 골라보기', 'home.dopa.more': '테스트 둘러보기', 'home.rabbit.action': '토끼 쓰다듬기', 'home.letter.action': '글자 {n} 튀기기', 'home.status.word': '단어: {w}', 'home.status.grab': '글자 {n} 잡음', 'home.status.letter': '글자 {n}' };
  function t(key, vars) { var s = (window.i18n && window.i18n.t(key)) || FALLBACK[key] || key; if (s === key && FALLBACK[key]) s = FALLBACK[key]; return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; }); }

  var X0 = 467, Y0 = 357, BW = 3334, BH = 1370;
  var PARTS = [[1, 1673, 357, 133, 400], [2, 2401, 357, 133, 400], [3, 3383, 357, 99, 99], [4, 1415, 361, 193, 392], [5, 2142, 361, 194, 392], [7, 3501, 446, 225, 220], [8, 2846, 840, 403, 84], [9, 1217, 842, 132, 400], [10, 2644, 842, 133, 400], [11, 3291, 842, 132, 400], [12, 1477, 864, 96, 69], [13, 1936, 864, 94, 69], [14, 1659, 887, 190, 169], [15, 2127, 931, 225, 221], [16, 3518, 955, 187, 242], [17, 923, 1192, 206, 42], [18, 2379, 1192, 205, 42], [19, 467, 1232, 346, 495], [20, 1800, 1232, 464, 495], [21, 1233, 1331, 525, 396], [22, 3072, 1331, 356, 396], [23, 857, 1332, 339, 395], [24, 2313, 1332, 339, 395], [25, 2686, 1332, 346, 395], [26, 3481, 1332, 320, 395]];
  var NAME = { 19: 'N', 23: 'e', 21: 'w', 20: 'M', 24: 'e', 25: 'a', 22: 'n', 26: 's' };
  function role(id) { return id >= 19 ? 'word' : (id === 12 || id === 13 || id === 14) ? 'face' : (id === 1 || id === 2 || id === 4 || id === 5) ? 'ear' : (id === 3 || id === 7) ? 'spark' : (id === 17 || id === 18) ? 'feet' : id === 16 ? 'tail' : 'body'; }
  var LEAN = { face: 1.3, ear: 0.6, body: 0.45, feet: 0.45, tail: 0.45, word: 0.12, spark: 0.6 };

  // ---------- props, drawn in the logo box coordinate space (3334 x 1370) ----------
  var TXT = 'var(--word)', RAB = 'var(--rabbit)', INK = '#3B3732', PAPER = '#FCFBF7';
  function svg(name, x, y, w, h, inner, z, hit) {
    return '<svg class="ac' + (hit ? ' hit' : '') + '" data-prop="' + name + '" style="left:' + ((x - X0) / BW * 100) + '%;top:' + ((y - Y0) / BH * 100) + '%;width:' + (w / BW * 100) + '%;height:' + (h / BH * 100) + '%;' + (z ? 'z-index:' + z : '') + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + inner + '</svg>';
  }
  function img(name, x, y, w, h, src, rot, hit) {
    return '<img class="ac' + (hit ? ' hit' : '') + '" data-prop="' + name + '" alt="" src="' + src + '" style="left:' + ((x - X0) / BW * 100) + '%;top:' + ((y - Y0) / BH * 100) + '%;width:' + (w / BW * 100) + '%;height:' + (h / BH * 100) + '%;' + (rot ? 'transform:rotate(' + rot + 'deg)' : '') + '">';
  }
  function star(cx, cy, r) { var p = []; for (var i = 0; i < 8; i++) { var a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.42 : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + TXT + '"/>'; }
  var ACC = {
    glasses: function () { return svg('glasses', 1380, 780, 760, 250, '<g fill="none" stroke="' + TXT + '" stroke-width="22"><circle cx="150" cy="125" r="112"/><circle cx="610" cy="125" r="112"/><path d="M262 118 Q380 70 498 118"/></g>', 5); },
    monocle: function () { return svg('monocle', 1860, 780, 320, 420, '<g fill="none" stroke="' + TXT + '" stroke-width="22"><circle cx="150" cy="125" r="112"/><path d="M230 210 q60 90 30 190"/></g>', 5, true); },
    shades: function () { return svg('shades', 1370, 800, 780, 210, '<g fill="' + INK + '"><rect x="0" y="20" width="330" height="170" rx="60"/><rect x="450" y="20" width="330" height="170" rx="60"/><rect x="320" y="60" width="140" height="26" rx="13"/></g><g fill="#fff" opacity=".35"><rect x="40" y="50" width="90" height="26" rx="13"/><rect x="490" y="50" width="90" height="26" rx="13"/></g>', 5); },
    headphones: function () { return svg('headphones', 1180, 600, 1220, 520, '<path d="M120 420 V330 a490 400 0 0 1 980 0 V420" fill="none" stroke="' + TXT + '" stroke-width="30" stroke-linecap="round"/><rect x="20" y="330" width="200" height="190" rx="60" fill="' + TXT + '"/><rect x="1000" y="330" width="200" height="190" rx="60" fill="' + TXT + '"/>', 5, true); },
    notes: function () { return svg('notes', 2520, 560, 360, 260, '<text class="note" x="0" y="200" font-size="230" font-family="ui-monospace,monospace" fill="' + TXT + '">♪</text><text class="note" x="180" y="150" font-size="170" font-family="ui-monospace,monospace" fill="' + TXT + '" style="animation-delay:.15s">♫</text>'); },
    mp3: function () { return svg('mp3', 640, 720, 300, 380, '<rect x="20" y="20" width="260" height="340" rx="40" fill="' + TXT + '"/><rect x="60" y="60" width="180" height="110" rx="14" fill="' + PAPER + '" opacity=".9"/><circle cx="150" cy="260" r="62" fill="' + PAPER + '" opacity=".9"/><polygon class="play" points="135,232 135,288 185,260" fill="' + TXT + '"/>', 5, true); },
    waves: function () { return svg('waves', 2900, 520, 420, 300, '<g fill="none" stroke="' + TXT + '" stroke-width="22" stroke-linecap="round"><path d="M40 150 q40 -60 80 0 t80 0"/><path d="M200 150 q60 -110 120 0 t120 0"/></g>'); },
    partyhat: function () { return svg('partyhat', 1810, 380, 320, 400, '<polygon points="150,20 290,390 10,390" fill="' + TXT + '"/><circle cx="150" cy="24" r="34" fill="' + RAB + '" stroke="' + TXT + '" stroke-width="12"/><g fill="' + RAB + '"><circle cx="150" cy="180" r="20"/><circle cx="110" cy="300" r="20"/><circle cx="200" cy="320" r="20"/></g>', 4); },
    popper: function () { return svg('popper', 2620, 400, 360, 360, '<polygon points="40,320 300,60 210,300" fill="' + TXT + '"/><g fill="' + RAB + '"><circle cx="150" cy="40" r="22"/><circle cx="330" cy="110" r="18"/><circle cx="60" cy="140" r="16"/></g>', 5, true); },
    gradcap: function () { return svg('gradcap', 1790, 540, 360, 240, '<polygon points="180,10 350,80 180,150 10,80" fill="' + INK + '"/><rect x="130" y="110" width="100" height="50" rx="10" fill="' + INK + '"/><path d="M338 86 v80" stroke="' + TXT + '" stroke-width="12" stroke-linecap="round"/><circle cx="338" cy="176" r="14" fill="' + TXT + '"/>', 4); },
    halo: function () { return svg('halo', 1660, 150, 380, 150, '<ellipse class="halo" cx="200" cy="80" rx="170" ry="52" fill="none" stroke="' + TXT + '" stroke-width="26" opacity=".85"/>', 4, true); },
    coffee: function () { return svg('coffee', 900, 860, 260, 320, '<g class="steam" fill="none" stroke="' + TXT + '" stroke-width="12" stroke-linecap="round"><path d="M70 100 q20 -30 0 -60"/><path d="M120 100 q20 -30 0 -60"/><path d="M170 100 q20 -30 0 -60"/></g><path d="M30 150 h170 v110 a70 70 0 0 1 -70 70 h-30 a70 70 0 0 1 -70 -70z" fill="' + TXT + '"/><path d="M200 170 h20 a45 45 0 0 1 0 90 h-20" fill="none" stroke="' + TXT + '" stroke-width="18"/>', 5, true); },
    keycap: function () { return img('keycap', 2380, 990, 200, 200, 'assets/desk/keycap_0.png', -12, true); },
    keycap2: function () { return img('keycap2', 2560, 1030, 170, 170, 'assets/desk/keycap_0.png', 14, true); },
    ball: function () { return img('ball', 880, 1000, 190, 190, 'assets/game/ball.png', 0, true); },
    hoop: function () { return svg('hoop', 2620, 260, 560, 560, '<rect x="380" y="20" width="160" height="200" rx="14" fill="none" stroke="' + TXT + '" stroke-width="20"/><rect x="380" y="220" width="20" height="300" fill="' + TXT + '"/><ellipse cx="300" cy="230" rx="130" ry="40" fill="none" stroke="' + TXT + '" stroke-width="22"/><path d="M180 240 l30 150 M420 240 l-30 150 M240 250 l20 140 M360 250 l-20 140 M210 390 h180" fill="none" stroke="' + TXT + '" stroke-width="10" opacity=".6"/>', 3); },
    monitor: function () { return svg('monitor', 560, 640, 520, 470, '<image href="assets/shop/monitor/2000.png" width="520" height="469"/><text class="screen-text" x="115" y="240" font-size="68" font-family="DNFBitBit,monospace" fill="#65cda7" opacity="0">TYPER</text>', 4, true); },
    cactus: function () { return img('cactus', 900, 420, 150, 240, 'assets/desk/sculpture.png', 0, true); },
    bubble: function () { return svg('bubble', 2480, 380, 620, 420, '<path d="M60 40 h500 a50 50 0 0 1 50 50 v190 a50 50 0 0 1 -50 50 h-300 l-90 80 v-80 h-110 a50 50 0 0 1 -50 -50 v-190 a50 50 0 0 1 50 -50z" fill="' + TXT + '"/><text class="bubble-text" x="120" y="230" font-size="150" font-weight="700" font-family="ui-monospace,monospace" fill="' + RAB + '">ㅋㅋ</text>', 5, true); },
    thought: function () { return svg('thought', 2560, 330, 560, 420, '<circle cx="90" cy="380" r="22" fill="' + TXT + '"/><circle cx="150" cy="320" r="34" fill="' + TXT + '"/><path d="M200 90 a90 90 0 0 1 150 -40 a100 100 0 0 1 170 40 a80 80 0 0 1 10 150 a90 90 0 0 1 -150 60 a100 100 0 0 1 -170 -30 a80 80 0 0 1 -10 -180z" fill="' + TXT + '"/><text x="290" y="200" font-size="140" font-weight="700" font-family="ui-monospace,monospace" fill="' + RAB + '">…</text>', 5); },
    mirror: function () { return svg('mirror', 820, 780, 330, 420, '<ellipse cx="165" cy="150" rx="130" ry="130" fill="' + PAPER + '" stroke="' + TXT + '" stroke-width="24"/><rect x="150" y="270" width="30" height="130" rx="10" fill="' + TXT + '"/><text x="60" y="180" font-size="110" font-family="ui-monospace,monospace" fill="' + RAB + '" transform="scale(-1,1) translate(-330,0)">(´^`*)</text>', 5, true); },
    friend: function () { return svg('friend', 300, 700, 640, 400, '<g font-family="ui-monospace,monospace" font-weight="700" fill="' + TXT + '"><text x="120" y="150" font-size="160">/) /)</text><text x="40" y="330" font-size="170">(´^`*)</text></g>', 5, true); },
    hearts: function () { return svg('hearts', 960, 540, 300, 220, '<g fill="' + TXT + '"><path d="M60 80 a30 30 0 0 1 60 0 a30 30 0 0 1 60 0 q0 40 -60 90 q-60 -50 -60 -90z"/><path d="M180 30 a20 20 0 0 1 40 0 a20 20 0 0 1 40 0 q0 30 -40 60 q-40 -30 -40 -60z" opacity=".7"/></g>'); },
    magnifier: function () { return svg('magnifier', 2380, 900, 340, 340, '<circle cx="120" cy="120" r="95" fill="none" stroke="' + TXT + '" stroke-width="22"/><path d="M190 190 L320 320" stroke="' + TXT + '" stroke-width="34" stroke-linecap="round"/>', 5, true); },
    zzz: function () { return svg('zzz', 2560, 420, 420, 320, '<g fill="' + TXT + '" font-family="ui-monospace,monospace" font-weight="700"><text x="0" y="300" font-size="120">z</text><text x="120" y="210" font-size="150">z</text><text x="270" y="110" font-size="190">z</text></g>', 5, true); },
    sun: function () { return svg('sun', 2520, 380, 320, 320, '<circle cx="160" cy="160" r="70" fill="' + TXT + '"/><g class="rays" stroke="' + TXT + '" stroke-width="22" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { var r = a * Math.PI / 180; return '<path d="M' + (160 + Math.cos(r) * 100) + ' ' + (160 + Math.sin(r) * 100) + ' L' + (160 + Math.cos(r) * 145) + ' ' + (160 + Math.sin(r) * 145) + '"/>'; }).join('') + '</g>', 5, true); },
    bang: function () { return svg('bang', 2520, 420, 200, 380, '<text x="0" y="330" font-size="380" font-weight="800" font-family="ui-monospace,monospace" fill="' + TXT + '">!</text>', 5, true); },
    stars: function () { return svg('stars', 700, 380, 2900, 1000, star(180, 250, 60) + star(1300, 120, 45) + star(2550, 250, 70) + star(2760, 820, 50) + star(150, 820, 40), 0, true); },
    stars2: function () { return svg('stars2', 700, 380, 2900, 1000, star(600, 60, 36) + star(2050, 40, 40) + star(2880, 480, 44) + star(420, 560, 30) + star(1950, 300, 34), 0, true); },
    confetti: function () { var s = '', cols = ['#FF6666', '#DAB249', '#79C0F1', '#C1A9EE', '#95C78A', '#EE95D1']; for (var i = 0; i < 26; i++) { var x = 60 + ((i * 631) % 3200), y = 40 + ((i * 397) % 1250), r = (i * 47) % 90; s += '<rect x="' + x + '" y="' + y + '" width="46" height="22" rx="6" fill="' + cols[i % cols.length] + '" transform="rotate(' + r + ' ' + (x + 23) + ' ' + (y + 11) + ')"/>'; } return svg('confetti', 467, 357, 3334, 1370, s, 6); },
    bolts: function () { var b = function (x, y, s) { return '<polygon points="' + [60, 0, 20, 110, 55, 110, 30, 200, 100, 80, 62, 80, 90, 0].map(function (v, i) { return (i % 2 ? y + v * s : x + v * s).toFixed(0); }).join(',') + '" fill="' + TXT + '"/>'; }; return svg('bolts', 467, 357, 3334, 1370, b(650, 120, 1) + b(2000, 60, 0.8) + b(2300, 180, 0.7) + b(300, 600, 0.6), 0, true); },
    spotlight: function () { return svg('spotlight', 900, 0, 1700, 1400, '<polygon points="850,0 1700,1400 0,1400" fill="' + RAB + '" opacity=".22"/>', 0); },
    tear: function () { return svg('tear', 1980, 900, 120, 200, '<path d="M60 10 Q120 110 60 170 Q0 110 60 10z" fill="#79C0F1"/>', 5); },
    diploma: function () { return svg('diploma', 880, 1020, 300, 180, '<g class="scroll-body"><rect x="20" y="40" width="260" height="90" rx="45" fill="' + PAPER + '" stroke="' + TXT + '" stroke-width="14"/></g><rect x="120" y="30" width="60" height="110" rx="12" fill="' + TXT + '"/>', 5, true); },
    icecream: function () { return svg('icecream', 2380, 840, 260, 420, '<polygon points="130,410 30,180 230,180" fill="#E2AB70"/><path d="M50 180 l40 -90 l40 90 l40 -90 l40 90" fill="none" stroke="#C88B4A" stroke-width="8"/><circle cx="130" cy="130" r="105" fill="#A8E0C5"/><g fill="#5A3E2B"><circle cx="90" cy="110" r="14"/><circle cx="160" cy="80" r="12"/><circle cx="170" cy="150" r="13"/><circle cx="110" cy="170" r="10"/></g><g class="bite" fill="' + PAPER + '"><circle class="bite b1" cx="215" cy="70" r="46"/><circle class="bite b2" cx="60" cy="60" r="44"/><circle class="bite b3" cx="130" cy="30" r="46"/></g>', 5, true); }
  };
  var DOTS = {
    key: '<svg viewBox="0 0 40 40"><rect x="4" y="6" width="32" height="30" rx="7" fill="currentColor"/><rect x="10" y="10" width="20" height="14" rx="4" fill="#FCFBF7" opacity=".55"/></svg>',
    star: '<svg viewBox="0 0 40 40"><polygon points="20,2 24,15 38,20 24,25 20,38 16,25 2,20 16,15" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 40 40"><polygon points="24,2 8,22 19,22 14,38 32,16 21,16" fill="currentColor"/></svg>'
  };

  function mount(root) {
    if (!root || root.__nm) return; root.__nm = true;
    var base = root.getAttribute('data-base') || 'assets/brand/logo-pieces/';
    var accRoot = document.getElementById(root.getAttribute('data-acc')) || root;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var pieces = PARTS.map(function (p, i) {
      var id = p[0], r = role(id);
      var el = document.createElement('div');
      el.className = 'pc ' + (r === 'word' ? 'word' : 'rab') + ' r-' + r;
      el.style.left = (p[1] - X0) / BW * 100 + '%'; el.style.top = (p[2] - Y0) / BH * 100 + '%';
      el.style.width = p[3] / BW * 100 + '%'; el.style.height = p[4] / BH * 100 + '%';
      el.style.setProperty('--m', 'url("' + base + 'p' + id + '.png")');
      if (r === 'feet') el.style.transformOrigin = '100% 50%';
      if (r === 'ear') el.style.transformOrigin = '50% 100%';
      root.appendChild(el);
      var ring = null;
      if (id === 12 || id === 13) { ring = document.createElement('i'); ring.className = 'eye-ring'; el.appendChild(ring); }
      return { el: el, ring: ring, id: id, role: r, hx: (p[1] + p[3] / 2 - X0) / BW, hy: (p[2] + p[4] / 2 - Y0) / BH, phase: (i * 1.7) % 6.283, x: 0, y: 0, vx: 0, vy: 0, rot: 0, dragging: false, hover: false, gx: 0, gy: 0, big: 1 };
    });
    var letters = pieces.filter(function (p) { return p.role === 'word'; }).sort(function (a, b) { return a.hx - b.hx; });
    var byId = {}; pieces.forEach(function (p) { byId[p.id] = p; });

    // ---------- the cursor ----------
    var cur = document.getElementById('cursor'), curX = 0, curY = 0, curTX = 0, curTY = 0, curOn = false;
    function cursorState(s) { if (cur) cur.setAttribute('data-state', s); }
    var hero = root.closest('.hero') || document.body;
    if (fine && cur) {
      hero.classList.add('has-cursor');
      hero.addEventListener('pointerenter', function () { curOn = true; cur.classList.add('is-on'); });
      hero.addEventListener('pointerleave', function () { if (!dragEl) { curOn = false; cur.classList.remove('is-on'); } });
    }

    // ---------- sounds (real Typer switch clips, only after a click) ----------
    var clips = null, clipAt = 0;
    function click(i) {
      if (!clips) { clips = []; for (var k = 0; k < 4; k++) clips.push(new Audio('assets/audio/switch/4000/' + k + '.m4a')); }
      var c = clips[(i != null ? i : clipAt++) % clips.length]; try { c.currentTime = 0; c.play().catch(function () { }); } catch (_) { }
    }
    var rhythm = 0;
    function playRhythm(el) {
      if (rhythm) { clearInterval(rhythm); rhythm = 0; el.classList.remove('is-playing'); return; }
      var pattern = [0, 1, 0, 2, 0, 1, 3, 2], i = 0; el.classList.add('is-playing');
      rhythm = setInterval(function () { click(pattern[i % pattern.length]); i++; if (i >= 16) { clearInterval(rhythm); rhythm = 0; el.classList.remove('is-playing'); } }, 250);
    }

    // ---------- simulation (main branch rules) ----------
    var rect, cx, cy, reach, MAX = 6;
    function measure() { rect = root.getBoundingClientRect(); cx = rect.left + rect.width / 2; cy = rect.top + rect.height / 2; reach = Math.max(300, rect.width * 1.1); MAX = rect.width * 0.03; }
    addEventListener('resize', measure); addEventListener('scroll', measure, { passive: true });
    var tnx = 0, tny = 0, nx = 0, ny = 0, pointerX = 0, pointerY = 0, dragEl = null, away = null, agitate = 0, excite = 0, lastSweat = 0, lastMove = 0, raf = 0, tm = 0, lastT = 0, interacted = false;
    var eyeMood = null, moodOverride = null, earMood = null, hop = 0;
    addEventListener('pointermove', function (e) {
      if (!rect) return;
      pointerX = e.clientX; pointerY = e.clientY; lastMove = performance.now(); curTX = e.clientX; curTY = e.clientY;
      tnx = Math.max(-1, Math.min(1, (e.clientX - cx) / reach)); tny = Math.max(-1, Math.min(1, (e.clientY - cy) / reach));
      if (dragEl) e.preventDefault();
      wake();
    }, { passive: false });
    document.addEventListener('pointerleave', function () { tnx = 0; tny = 0; wake(); });
    letters.forEach(function (p) {
      p.el.addEventListener('pointerenter', function () { p.hover = true; if (!dragEl) cursorState('hand'); wake(); });
      p.el.addEventListener('pointerleave', function () { p.hover = false; if (!dragEl) cursorState(''); wake(); });
      p.el.addEventListener('pointerdown', function (e) {
        e.preventDefault(); interacted = true; dragEl = p; away = p; p.dragging = true; p.el.classList.add('drag'); cursorState('grab');
        try { p.el.setPointerCapture(e.pointerId); } catch (_) { }
        var r = p.el.getBoundingClientRect(); p.gx = e.clientX - (r.left + r.width / 2); p.gy = e.clientY - (r.top + r.height / 2);
        p.downAt = performance.now(); p.downX = e.clientX; p.downY = e.clientY; say(t('home.status.grab', { n: NAME[p.id] })); wake();
      });
      function up(e) { if (dragEl !== p) return; dragEl = null; p.dragging = false; p.el.classList.remove('drag'); cursorState(p.hover ? 'hand' : ''); if (e && performance.now() - p.downAt < 220 && Math.hypot(e.clientX - p.downX, e.clientY - p.downY) < 6) poke(p); wake(); }
      p.el.addEventListener('pointerup', up); p.el.addEventListener('pointercancel', up);
    });
    function spawnSweat() {
      var s = document.createElement('div'); s.className = 'nm-sweat'; s.textContent = ';';
      s.style.left = '57.7%'; s.style.top = '22%'; accRoot.appendChild(s); s.addEventListener('animationend', function () { s.remove(); });
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick(now) {
      raf = 0;
      var dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now; tm += dt;
      nx += (tnx - nx) * 0.09; ny += (tny - ny) * 0.09;
      if (dragEl || excite > 0) agitate += (1 - agitate) * 0.14;
      else if (away) { var d = Math.hypot(away.x, away.y); agitate += (Math.min(1, d / (rect.width * 0.14)) - agitate) * 0.1; if (d < rect.width * 0.008) away = null; }
      else agitate += (0 - agitate) * 0.08;
      if (!reduce && agitate > 0.35 && tm - lastSweat > 0.5) { spawnSweat(); lastSweat = tm; }
      var pointerActive = (now - lastMove) < 1200, moving = false, s = reduce ? 0.35 : 1;
      var mood = moodOverride !== null ? moodOverride : eyeMood;
      for (var k = 0; k < pieces.length; k++) {
        var p = pieces[k], tx, ty, rot = 0;
        if (p.dragging) {
          tx = (pointerX - rect.left - p.gx) - p.hx * rect.width; ty = (pointerY - rect.top - p.gy) - p.hy * rect.height;
          tx = Math.max(-rect.width * 0.75, Math.min(rect.width * 0.75, tx)); ty = Math.max(-rect.height * 1.1, Math.min(rect.height * 1.6, ty));
        } else if (p.role === 'spark') {
          var live = (pointerActive || agitate > 0.02) ? 1 : 0;
          tx = nx * 0.6 * MAX * s + Math.sin(tm * 1.6 + p.phase) * MAX * 0.5 * s * live;
          ty = ny * 0.6 * MAX * s + Math.cos(tm * 1.3 + p.phase) * MAX * 0.6 * s * live;
        } else {
          var lean = LEAN[p.role] * s; tx = nx * lean * MAX; ty = ny * lean * MAX;
          if (p.hover) { ty -= rect.width * 0.02; rot = -3; }
          if (p.role === 'ear' && earMood) { var left = p.id === 4 || p.id === 1; rot += earMood === 'droop' ? (left ? -14 : 14) : (left ? 5 : -5); }
          if (agitate > 0.02) {
            if (p.role === 'feet') rot = Math.abs(Math.sin(tm * 13 + (p.id === 17 ? 0 : Math.PI / 2))) * agitate * 32;
            else if (p.role === 'tail') rot = Math.sin(tm * 26) * agitate * 30;
            else if (p.role === 'face') ty += Math.sin(tm * 5) * agitate * MAX * 0.25;
          }
        }
        var kk = p.dragging ? 0.35 : 0.16;
        p.vx += (tx - p.x) * kk; p.vy += (ty - p.y) * kk; p.vx *= 0.74; p.vy *= 0.74; p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.05 || Math.abs(rot - p.rot) > 0.01) moving = true;
        p.rot += (rot - p.rot) * (p.role === 'word' ? 0.2 : 1);
        var eyeT = '';
        if (p.ring) { var round = agitate > 0.45 || mood === 'round'; p.el.classList.toggle('is-round', round); if (mood === 'closed' && !round) eyeT = ' scaleY(.3)'; else if (p.big !== 1) eyeT = ' scale(' + p.big + ')'; }
        p.el.style.transform = 'translate(' + p.x.toFixed(2) + 'px,' + p.y.toFixed(2) + 'px)' + (Math.abs(p.rot) > 0.01 ? ' rotate(' + p.rot.toFixed(2) + 'deg)' : '') + eyeT;
      }
      var f = pieces[10]; accRoot.style.setProperty('--ax', f.x.toFixed(2) + 'px'); accRoot.style.setProperty('--ay', f.y.toFixed(2) + 'px');
      if (cur && curOn) { curX += (curTX - curX) * 0.35; curY += (curTY - curY) * 0.35; cur.style.transform = 'translate(' + curX.toFixed(1) + 'px,' + curY.toFixed(1) + 'px)'; if (Math.abs(curTX - curX) + Math.abs(curTY - curY) > 0.3) moving = true; }
      if (moving || dragEl || agitate > 0.01 || excite > 0 || pointerActive) raf = requestAnimationFrame(tick); else lastT = 0;
    }
    function poke(p) {
      if (!p) p = letters[(Math.random() * letters.length) | 0];
      measure(); var sc = rect.width / 560;
      p.vx = (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 5) * sc; p.vy = -(27 + Math.random() * 8) * sc; away = p;
      say(t('home.status.letter', { n: NAME[p.id] })); wake();
    }
    function hopAll() { measure(); var sc = rect.width / 560; pieces.forEach(function (p) { if (p.role !== 'word' && p.role !== 'spark') p.vy -= 9 * sc; }); wake(); }
    function mood(m, ms) { moodOverride = m; wake(); setTimeout(function () { moodOverride = null; wake(); }, ms); }
    measure();
    if (!reduce) setTimeout(function () { if (!interacted) poke(); }, 1800);   // self demo: a letter jumps once to show it is loose

    // ---------- props that react ----------
    var REACT = {
      keycap: function (el) { el.classList.add('is-pressed'); setTimeout(function () { el.classList.remove('is-pressed'); }, 110); click(); if (current && current.w === 'satisfying') smash(el); },
      keycap2: function (el) { REACT.keycap(el); },
      ball: function (el) { var hoop = accRoot.querySelector('[data-prop="hoop"]'); if (hoop) shoot(el, hoop); else { var cap = accRoot.querySelector('[data-prop="keycap"]'); if (cap) { shoot(el, cap); setTimeout(function () { smash(cap); click(); }, 700); } } },
      coffee: function (el) { el.classList.remove('is-steaming'); void el.offsetWidth; el.classList.add('is-steaming'); mood('closed', 700); },
      mp3: function (el) { playRhythm(accRoot.querySelector('[data-prop="notes"]') || el); },
      headphones: function (el) { playRhythm(accRoot.querySelector('[data-prop="notes"]') || el); mood('closed', 2000); },
      monitor: function (el) { el.classList.remove('is-flickering'); void el.offsetWidth; el.classList.add('is-flickering'); click(); },
      cactus: function (el) { el.classList.remove('is-swaying'); void el.offsetWidth; el.classList.add('is-swaying'); },
      bubble: function (el) { var txt = el.querySelector('.bubble-text'), seq = ['ㅋㅋ', '??', '♥', 'ㅠㅠ', '!!']; txt.textContent = seq[(seq.indexOf(txt.textContent) + 1) % seq.length]; mood('round', 500); },
      bang: function () { hopAll(); mood('round', 800); },
      bolts: function (el) { hopAll(); el.classList.remove('is-twinkling'); void el.offsetWidth; el.classList.add('is-twinkling'); },
      zzz: function () { mood(null, 900); hopAll(); },
      sun: function (el) { el.classList.remove('is-spinning'); void el.offsetWidth; el.classList.add('is-spinning'); },
      monocle: function (el) { el.classList.remove('is-dropping'); void el.offsetWidth; el.classList.add('is-dropping'); mood('round', 900); },
      magnifier: function () { var e = byId[13]; e.big = e.big === 1 ? 1.7 : 1; e.el.classList.toggle('is-big', e.big !== 1); wake(); },
      friend: function () { mood('closed', 450); },
      mirror: function () { mood('closed', 900); },
      popper: function () { burst(28); hopAll(); },
      stars: function (el) { el.classList.remove('is-twinkling'); void el.offsetWidth; el.classList.add('is-twinkling'); },
      stars2: function (el) { REACT.stars(el); },
      diploma: function (el) { el.classList.remove('is-unrolling'); void el.offsetWidth; el.classList.add('is-unrolling'); },
      halo: function (el) { el.classList.remove('is-glowing'); void el.offsetWidth; el.classList.add('is-glowing'); },
      icecream: function (el) { var b = (+el.getAttribute('data-bites') || 0) + 1; if (b > 3) { b = 0; } el.setAttribute('data-bites', b); mood('closed', 400); }
    };
    function shoot(ball, target) {
      var b = ball.getBoundingClientRect(), tr = target.getBoundingClientRect();
      ball.style.setProperty('--sx', (tr.left + tr.width * 0.5 - (b.left + b.width / 2)) + 'px'); ball.style.setProperty('--sy', (tr.top + tr.height * 0.4 - (b.top + b.height / 2)) + 'px');
      ball.classList.remove('is-flying'); void ball.offsetWidth; ball.classList.add('is-flying'); mood('round', 1200);
      setTimeout(function () { ball.classList.remove('is-flying'); ball.style.opacity = ''; }, 1400);
    }
    function smash(cap) {
      cap.style.visibility = 'hidden';
      accRoot.insertAdjacentHTML('beforeend', svg('shards', 467, 357, 3334, 1370, '<g fill="' + TXT + '" opacity=".9"><polygon points="2200,1030 2260,1000 2250,1070"/><polygon points="2700,980 2760,1010 2710,1050"/><polygon points="2330,860 2380,850 2365,910"/><polygon points="2600,1150 2650,1120 2660,1180"/></g>', 6));
      var sh = accRoot.querySelector('[data-prop="shards"]'); sh.classList.add('pop'); mood('round', 900); hopAll();
      setTimeout(function () { sh.remove(); cap.style.visibility = ''; cap.classList.add('pop'); }, 1200);
    }
    accRoot.addEventListener('click', function (e) { var el = e.target.closest('.ac.hit'); if (!el) return; interacted = true; var fn = REACT[el.getAttribute('data-prop')]; if (fn) fn(el); });
    accRoot.addEventListener('pointerover', function (e) { if (e.target.closest('.ac.hit')) cursorState('tap'); });
    accRoot.addEventListener('pointerout', function (e) { if (e.target.closest('.ac.hit')) cursorState(''); });

    // ---------- the slot machine ----------
    var slot = document.getElementById('slot'), reel = document.getElementById('reel'), lever = document.getElementById('lever');
    var status = document.getElementById('hero-status'), go = document.getElementById('go');
    var current = null, spinning = false;
    function say(m) { if (status) status.textContent = m; }
    function tint(hex) { var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); var mix = function (c) { return Math.round(c * 0.14 + 250 * 0.86); }; return 'rgb(' + mix(r) + ',' + mix(g) + ',' + mix(b) + ')'; }
    function wordSpan(entry) {
      var c = PAL[entry.hue]; var sp = document.createElement('span'); sp.className = 'word'; sp.style.color = c.text;
      var w = document.createElement('span'); w.className = 'w'; w.textContent = entry.w; sp.appendChild(w);
      var d = document.createElement('span'); d.className = 'dot' + (DOTS[entry.dot] ? ' dot--icon' : ''); if (DOTS[entry.dot]) d.innerHTML = DOTS[entry.dot]; else d.textContent = entry.dot || '.'; sp.appendChild(d);
      return sp;
    }
    function fixWidth() {
      var probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px'; slot.appendChild(probe);
      var max = 0; WORDS.forEach(function (e) { var sp = wordSpan(e); probe.appendChild(sp); max = Math.max(max, sp.getBoundingClientRect().width); probe.removeChild(sp); });
      probe.remove(); slot.style.width = Math.ceil(max) + 'px';
    }
    function applyWord(entry, animate) {
      current = entry; var c = PAL[entry.hue];
      document.documentElement.style.setProperty('--word', c.text);
      document.documentElement.style.setProperty('--rabbit', c.rabbit);
      document.documentElement.style.setProperty('--slot-bg', tint(c.rabbit));
      eyeMood = entry.eyes || null; earMood = entry.ears || null; byId[13].big = 1; byId[13].el.classList.remove('is-big');
      if (rhythm) { clearInterval(rhythm); rhythm = 0; }
      accRoot.querySelectorAll('.ac').forEach(function (a) { a.remove(); });
      accRoot.insertAdjacentHTML('beforeend', entry.acc.map(function (k) { return ACC[k] ? ACC[k]() : ''; }).join(''));
      accRoot.setAttribute('data-tier', entry.tier);
      if (animate) accRoot.querySelectorAll('.ac').forEach(function (a, i) { a.style.animationDelay = (i * 60) + 'ms'; a.classList.add('pop'); });
      if (go) { var pr = PRODUCT[entry.product]; if (pr) { go.querySelector('.go__t').textContent = t(pr.key); go.querySelector('img').src = pr.icon; go.querySelector('img').alt = pr.name; go.href = pr.href; go.hidden = false; go.classList.remove('pop'); if (animate) { void go.offsetWidth; go.classList.add('pop'); } } else go.hidden = true; }
      try { sessionStorage.setItem('nm-word', entry.w); } catch (_) { }
      say(t('home.status.word', { w: entry.w + (entry.tier === 'common' ? '' : ' (' + entry.tier + ')') }));
      wake();
    }
    function pick() {
      var pool = WORDS.filter(function (e) { return e !== current; }), total = 0;
      pool.forEach(function (e) { total += WEIGHT[e.tier]; });
      var r = Math.random() * total;
      for (var i = 0; i < pool.length; i++) { r -= WEIGHT[pool[i].tier]; if (r <= 0) return pool[i]; }
      return pool[pool.length - 1];
    }
    function spin(forced) {
      if (spinning) return; spinning = true; interacted = true;
      var next = forced || pick();
      lever.classList.remove('is-pulled'); void lever.offsetWidth; lever.classList.add('is-pulled');
      excite = 1; wake();
      var seq = [current || WORDS[0]]; var n = reduce ? 4 : 18;
      for (var i = 0; i < n; i++) seq.push(WORDS[(Math.random() * WORDS.length) | 0]);
      seq.push(next);
      reel.textContent = ''; seq.forEach(function (e) { reel.appendChild(wordSpan(e)); });
      var h = slot.getBoundingClientRect().height, total = (seq.length - 1) * h, dur = reduce ? 500 : 1700, t0 = performance.now();
      function step(now) {
        var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3.2);
        reel.style.transform = 'translateY(' + (-total * e).toFixed(2) + 'px)';
        reel.style.filter = k < 0.75 ? 'blur(' + (1.6 * (1 - k)).toFixed(2) + 'px)' : '';
        if (k < 1) requestAnimationFrame(step); else land(next);
      }
      requestAnimationFrame(step);
    }
    function land(next) {
      slot.classList.add('is-landed'); setTimeout(function () { slot.classList.remove('is-landed'); }, 500);
      reel.textContent = ''; reel.appendChild(wordSpan(next)); reel.style.transform = ''; reel.style.filter = '';
      applyWord(next, true);
      excite = 0; spinning = false;
      if (next.tier === 'rare' || next.tier === 'epic') burst(next.tier === 'epic' ? 36 : 18);
      poke();
    }
    function burst(n) {
      var cols = ['#FF6666', '#DAB249', '#79C0F1', '#C1A9EE', '#95C78A', '#EE95D1'];
      for (var i = 0; i < n; i++) {
        var c = document.createElement('i'); c.className = 'confetti'; c.style.background = cols[i % cols.length];
        c.style.left = (35 + Math.random() * 40) + '%'; c.style.top = (30 + Math.random() * 20) + '%';
        c.style.setProperty('--dx', ((Math.random() - 0.5) * 60) + 'vw'); c.style.setProperty('--dy', (-20 - Math.random() * 40) + 'vh'); c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
        c.style.animationDelay = (Math.random() * 120) + 'ms';
        document.body.appendChild(c); c.addEventListener('animationend', function () { this.remove(); });
      }
    }
    if (lever) {
      lever.addEventListener('click', function () { spin(); });
      lever.addEventListener('pointerenter', function () { cursorState('pull'); }); lever.addEventListener('pointerleave', function () { cursorState(''); });
    }
    var reroll = document.getElementById('reroll'); if (reroll) reroll.addEventListener('click', function () { spin(); });
    var saved = null; try { saved = sessionStorage.getItem('nm-word'); } catch (_) { }
    var initial = WORDS.filter(function (e) { return e.w === saved; })[0] || WORDS[0];
    if (slot && reel) {
      fixWidth(); addEventListener('resize', fixWidth);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fixWidth);
      reel.textContent = ''; reel.appendChild(wordSpan(initial));
    }
    applyWord(initial, false);

    // keyboard access: hidden buttons for the rabbit and each letter
    var kb = document.getElementById('hero-keys');
    function buildKeys() {
      if (!kb) return; kb.textContent = '';
      var rb = document.createElement('button'); rb.type = 'button'; rb.textContent = t('home.rabbit.action'); rb.addEventListener('click', function () { poke(); }); kb.appendChild(rb);
      letters.forEach(function (p) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t('home.letter.action', { n: NAME[p.id] }); b.addEventListener('click', function () { poke(p); }); kb.appendChild(b); });
    }
    buildKeys();
    window.addEventListener('nm:langchange', function () { buildKeys(); if (current && go && !go.hidden) go.querySelector('.go__t').textContent = t(PRODUCT[current.product].key); });

    root.__nm = { spin: spin, poke: poke, words: WORDS, set: function (w) { var e = WORDS.filter(function (x) { return x.w === w; })[0]; if (e) spin(e); }, setNow: function (w) { var e = WORDS.filter(function (x) { return x.w === w; })[0]; if (e) { reel.textContent = ''; reel.appendChild(wordSpan(e)); applyWord(e, true); } },
      cursor: function (x, y, s) { curOn = true; cur && cur.classList.add('is-on'); curX = curTX = x; curY = curTY = y; cursorState(s || ''); wake(); },
      stats: function () { return { word: current && current.w, tier: current && current.tier, agitate: +agitate.toFixed(2), spinning: spinning, away: away ? NAME[away.id] : null, rendering: !!raf, go: go ? !go.hidden : null }; } };
    window.NewMeansHero = root.__nm;
  }
  function auto() { document.querySelectorAll('[data-nm-hero]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
