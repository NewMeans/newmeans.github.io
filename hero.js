/* NewMeans home hero: the living kaomoji rabbit and the word slot machine.
 * The rabbit follows the cursor, frets when a letter is taken and calms when it springs home.
 * The slot draws a word that Typer or Dopamine University gives; each word has a colour, props
 * (most of them react), floating particles you can stir with the cursor, an eye shape, an ear pose,
 * a rarity and, for product words, a way into the product. Two epic words change the whole page.
 * Usage: <div data-nm-hero data-acc="acc-id" data-back="acc-back-id" data-pts="pts-id"></div>.
 * Pieces: assets/brand/logo-pieces/pN.png (masks). */
(function () {
  'use strict';
  var PAL = {
    mint: { rabbit: '#85C6A8', text: '#3E765E' }, coral: { rabbit: '#FF6666', text: '#984645' }, gold: { rabbit: '#DAB249', text: '#7C5F00' }, amber: { rabbit: '#E2AB70', text: '#885716' },
    peach: { rabbit: '#ECA47F', text: '#90502C' }, rose: { rabbit: '#EB9DBB', text: '#8F4966' }, plum: { rabbit: '#DCA0D6', text: '#834D7E' }, lavender: { rabbit: '#C1A9EE', text: '#6C5594' },
    periwinkle: { rabbit: '#A4B3F8', text: '#535D9C' }, sky: { rabbit: '#79C0F1', text: '#1F6A96' }, teal: { rabbit: '#5DCBD1', text: '#007276' }, sage: { rabbit: '#95C78A', text: '#427138' },
    olive: { rabbit: '#B5BF73', text: '#62691B' }, cocoa: { rabbit: '#D0B198', text: '#795D46' }, indigo: { rabbit: '#AAB1F7', text: '#595C9B' }, magenta: { rabbit: '#EE95D1', text: '#8C4877' },
    lime: { rabbit: '#A9C37B', text: '#566D27' }, charcoal: { rabbit: '#706B64', text: '#3B3732' },
    apricot: { rabbit: '#F0B27A', text: '#8C5320' }, cherry: { rabbit: '#F08CA0', text: '#963B52' }, emerald: { rabbit: '#6FCB9C', text: '#2E7A50' }, violet: { rabbit: '#9B8CF0', text: '#4E43A8' },
    tangerine: { rabbit: '#F2A65A', text: '#8A4E0E' }, neon: { rabbit: '#3AF0FF', text: '#FF3AD6' }
  };
  // What the products give. Typer: keyboard sounds, a desk of your own, breaking bricks. Dopamine University:
  // seeing yourself and your friends a little differently, said sideways. weight: common 10 / uncommon 6 / rare 3 / epic 1
  // acc: props. pt: particle sets. eyes/ears: the resting face. font/theme: page-wide changes.
  var WORDS = [
    { w: 'joyful', hue: 'mint', tier: 'common', acc: [] },
    { w: 'calm', hue: 'sage', tier: 'common', acc: [], pt: [{ k: 'zzz', n: 4 }], eyes: 'line', ears: 'droop', dot: '…', product: 'typer' },
    { w: 'cozy', hue: 'peach', tier: 'common', acc: ['coffee'], product: 'typer' },
    { w: 'playful', hue: 'coral', tier: 'common', acc: ['hoop', 'ball'], product: 'typer' },
    { w: 'clicky', hue: 'teal', tier: 'common', acc: ['keyring'], product: 'typer', dot: 'key' },
    { w: 'curious', hue: 'lavender', tier: 'common', acc: ['magnifier'], product: 'dopa', dot: '?' },
    { w: 'cheerful', hue: 'gold', tier: 'common', acc: ['sun', 'pompoms'], pt: [{ k: 'sparks', n: 7 }], eyes: 'happy', idle: 'cheer' },
    { w: 'chatty', hue: 'periwinkle', tier: 'common', acc: ['bubble'], product: 'dopa', dot: '…' },
    { w: 'warm', hue: 'apricot', tier: 'common', acc: ['scarf', 'candle'], eyes: 'arc', product: 'dopa' },
    { w: 'silly', hue: 'cherry', tier: 'common', acc: ['tongue', 'propeller'], eyes: 'squeeze', dot: '!' },
    { w: 'witty', hue: 'plum', tier: 'uncommon', acc: ['monocle'], eyes: 'skeptic', product: 'dopa' },
    { w: 'surprising', hue: 'amber', tier: 'uncommon', acc: ['bang'], eyes: 'round', ears: 'perk', product: 'dopa', dot: '!' },
    { w: 'retro', hue: 'olive', tier: 'rare', acc: ['shades', 'monitor'], font: 'pixel', product: 'typer' },
    { w: 'rhythmic', hue: 'sky', tier: 'uncommon', acc: ['headphones', 'mp3'], pt: [{ k: 'notes', n: 6 }], eyes: 'happy', product: 'typer', dot: '♪' },
    { w: 'aesthetic', hue: 'cocoa', tier: 'uncommon', acc: ['cactus', 'monitor'], product: 'typer' },
    { w: 'thoughtful', hue: 'indigo', tier: 'uncommon', acc: ['mirror', 'thought'], ears: 'droop', product: 'dopa', dot: '…' },
    { w: 'satisfying', hue: 'lime', tier: 'uncommon', acc: ['tennis', 'keycaps'], pt: [{ k: 'stars', n: 6 }], eyes: 'arc', product: 'typer' },
    { w: 'dramatic', hue: 'charcoal', tier: 'uncommon', acc: ['stagelight', 'tears'], eyes: 'tear', product: 'dopa', dot: '!' },
    { w: 'connected', hue: 'rose', tier: 'uncommon', acc: ['friend'], pt: [{ k: 'hearts', n: 6 }], product: 'dopa' },
    { w: 'exciting', hue: 'coral', tier: 'rare', acc: ['partyhat', 'popper'], pt: [{ k: 'confetti', n: 18 }], eyes: 'round', ears: 'perk', dot: '!' },
    { w: 'ASMR', hue: 'teal', tier: 'rare', acc: ['headphones', 'waves'], eyes: 'line', ears: 'droop', product: 'typer', dot: '~' },
    { w: 'insightful', hue: 'lavender', tier: 'rare', acc: ['gradcap', 'glasses', 'diploma'], product: 'dopa' },
    { w: 'dopamine', hue: 'magenta', tier: 'rare', acc: [], pt: [{ k: 'bolts', n: 10 }], eyes: 'round', ears: 'perk', product: 'dopa', dot: 'bolt' },
    { w: 'sparkly', hue: 'gold', tier: 'rare', acc: [], pt: [{ k: 'stars', n: 12 }, { k: 'sparks', n: 8 }], eyes: 'star', dot: 'star' },
    { w: 'lucky', hue: 'emerald', tier: 'rare', acc: ['clover'], pt: [{ k: 'coins', n: 8 }], eyes: 'dot', dot: '!' },
    { w: 'cosmic', hue: 'violet', tier: 'rare', acc: ['saturn'], pt: [{ k: 'planets', n: 3 }, { k: 'stars', n: 8 }], eyes: 'dot', dot: 'star' },
    { w: 'smashing', hue: 'coral', tier: 'epic', acc: ['globe', 'keycaps'], pt: [{ k: 'confetti', n: 14 }], eyes: 'squeeze', ears: 'perk', product: 'typer', dot: '!' },
    { w: 'enlightened', hue: 'gold', tier: 'epic', acc: ['halo'], pt: [{ k: 'stars', n: 10 }, { k: 'sparks', n: 8 }], eyes: 'happy', ears: 'droop', product: 'dopa', dot: 'star' },
    { w: 'mint choco', hue: 'mint', tier: 'epic', acc: ['icecream', 'mintball', 'keycaps'], pt: [{ k: 'stars', n: 6 }], product: 'typer', dot: 'star' },
    { w: 'arcade', hue: 'tangerine', tier: 'epic', acc: ['wall', 'goal', 'rubber'], eyes: 'round', ears: 'perk', font: 'pixel', product: 'typer', dot: '!' },
    { w: 'cyberpunk', hue: 'neon', tier: 'epic', acc: ['visor', 'neonsign'], pt: [{ k: 'bits', n: 14 }], ears: 'perk', font: 'pixel', theme: 'cyber', dot: 'bolt' }
  ];
  var WEIGHT = { common: 10, uncommon: 6, rare: 3, epic: 1 };
  var TIERS = ['common', 'uncommon', 'rare', 'epic'];
  var PRODUCT = { typer: { key: 'home.typer.more', href: 'typer.html', icon: 'assets/brand/typer-icon.png', name: 'Typer' }, dopa: { key: 'home.dopa.more', href: 'dopamine.html', icon: 'assets/brand/dopamine-symbol.png', name: 'Dopamine University' } };
  var FALLBACK = { 'home.typer.more': '키보드 골라보기', 'home.dopa.more': '테스트 둘러보기', 'home.rabbit.action': '토끼 쓰다듬기', 'home.letter.action': '글자 {n} 튀기기', 'home.status.word': '단어: {w}', 'home.status.grab': '글자 {n} 잡음', 'home.status.letter': '글자 {n}', 'home.status.score': '골 {n}', 'home.status.clear': '키캡 전부 부숨', 'home.status.left': '키캡 {n}개 남음', 'home.words': '단어 {n}/{t}', 'home.words.title': '모은 단어', 'home.words.close': '닫기' };
  function t(key, vars) { var s = (window.i18n && window.i18n.t(key)) || FALLBACK[key] || key; if (s === key && FALLBACK[key]) s = FALLBACK[key]; return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && vars[k] != null ? vars[k] : ''; }); }

  var X0 = 467, Y0 = 357, BW = 3334, BH = 1370;
  var PARTS = [[1, 1673, 357, 133, 400], [2, 2401, 357, 133, 400], [3, 3383, 357, 99, 99], [4, 1415, 361, 193, 392], [5, 2142, 361, 194, 392], [7, 3501, 446, 225, 220], [8, 2846, 840, 403, 84], [9, 1217, 842, 132, 400], [10, 2644, 842, 133, 400], [11, 3291, 842, 132, 400], [12, 1477, 864, 96, 69], [13, 1936, 864, 94, 69], [14, 1659, 887, 190, 169], [15, 2127, 931, 225, 221], [16, 3518, 955, 187, 242], [17, 923, 1192, 206, 42], [18, 2379, 1192, 205, 42], [19, 467, 1232, 346, 495], [20, 1800, 1232, 464, 495], [21, 1233, 1331, 525, 396], [22, 3072, 1331, 356, 396], [23, 857, 1332, 339, 395], [24, 2313, 1332, 339, 395], [25, 2686, 1332, 346, 395], [26, 3481, 1332, 320, 395]];
  var NAME = { 19: 'N', 23: 'e', 21: 'w', 20: 'M', 24: 'e', 25: 'a', 22: 'n', 26: 's' };
  function role(id) { return id >= 19 ? 'word' : (id === 12 || id === 13 || id === 14) ? 'face' : (id === 1 || id === 2 || id === 4 || id === 5) ? 'ear' : (id === 3 || id === 7) ? 'spark' : (id === 17 || id === 18) ? 'feet' : id === 16 ? 'tail' : 'body'; }
  var LEAN = { face: 1.3, ear: 0.6, body: 0.45, feet: 0.45, tail: 0.45, word: 0.12, spark: 0.6 };

  // ---------- props, drawn in the logo coordinate space (the box is 3334 x 1370 at 467,357) ----------
  var TXT = 'var(--word)', RAB = 'var(--rabbit)', INK = '#3B3732', PAPER = '#FCFBF7';
  var narrowMQ = matchMedia('(max-width: 720px)');
  function fk() { return narrowMQ.matches ? 0.6 : 1; }     // floor positions shrink on narrow screens
  function fs() { return narrowMQ.matches ? 0.75 : 1; }    // and so do the props standing there
  function svg(name, x, y, w, h, inner, z, hit, back) {
    return '<svg class="ac' + (hit ? ' hit' : '') + '" data-prop="' + name + '"' + (back ? ' data-back="1"' : '') + ' style="left:' + ((x - X0) / BW * 100) + '%;top:' + ((y - Y0) / BH * 100) + '%;width:' + (w / BW * 100) + '%;height:' + (h / BH * 100) + '%;' + (z ? 'z-index:' + z : '') + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + inner + '</svg>';
  }
  function img(name, x, y, w, h, src, rot, hit) {
    return '<img class="ac' + (hit ? ' hit' : '') + '" data-prop="' + name + '" alt="" draggable="false" src="' + src + '" style="left:' + ((x - X0) / BW * 100) + '%;top:' + ((y - Y0) / BH * 100) + '%;width:' + (w / BW * 100) + '%;height:' + (h / BH * 100) + '%;' + (rot ? 'transform:rotate(' + rot + 'deg)' : '') + '">';
  }
  // things standing on the ground line (the wordmark baseline), bx measured leftwards from the N
  function floor(name, bx, w, h, inner, z, hit) { var k = fk(), q = fs(); return svg(name, X0 + bx * k, Y0 + BH - h * q, w * q, h * q, inner, z, hit); }
  function floorImg(name, bx, w, h, src, rot) { var k = fk(), q = fs(); return img(name, X0 + bx * k, Y0 + BH - h * q, w * q, h * q, src, rot, true); }
  function star(cx, cy, r, fill) { var p = []; for (var i = 0; i < 8; i++) { var a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.42 : r; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + (fill || TXT) + '"/>'; }
  // a keycap seen from a little above: the skirt in the word colour, the top in the rabbit colour, a pixel legend
  function keycapInner(letter) { return '<g class="cap"><rect x="8" y="26" width="184" height="170" rx="28" fill="' + TXT + '"/><rect x="26" y="8" width="148" height="132" rx="22" fill="' + RAB + '"/><text x="100" y="100" font-size="84" text-anchor="middle" font-family="DNFBitBit,monospace" fill="' + TXT + '">' + letter + '</text></g>'; }
  function keycapAt(name, bx, letter) { return floor(name, bx, 200, 200, keycapInner(letter), 5, true); }
  function ballSvg(inner) { return '<g class="roll" style="transform-box:fill-box;transform-origin:center">' + inner + '</g>'; }
  var BALLS = {
    basket: ballSvg('<circle cx="95" cy="95" r="90" fill="#E98A3C"/><g fill="none" stroke="#4A2C14" stroke-width="9" stroke-linecap="round"><circle cx="95" cy="95" r="90"/><path d="M95 5v180M5 95h180M32 32c26 26 26 100 0 126M158 32c-26 26-26 100 0 126"/></g>'),
    tennis: ballSvg('<circle cx="95" cy="95" r="90" fill="#D6E35A"/><g fill="none" stroke="#FCFBF7" stroke-width="10"><path d="M22 40c40 20 60 70 44 120M168 40c-40 20-60 70-44 120"/></g><circle cx="95" cy="95" r="90" fill="none" stroke="#9AA53A" stroke-width="6"/>'),
    globe: ballSvg('<circle cx="95" cy="95" r="90" fill="#79C0F1"/><g fill="#95C78A"><path d="M40 60c20-16 50-14 62 4 8 14-6 28-24 30-20 2-38 14-46 4-6-10-2-28 8-38z"/><path d="M118 100c18-6 40 2 46 20 4 14-10 30-30 28-16-2-30-16-28-30 1-8 6-14 12-18z"/><path d="M62 128c10-4 24 2 26 12 2 10-10 20-22 16-10-4-14-22-4-28z"/></g><circle cx="95" cy="95" r="90" fill="none" stroke="#3B6E9B" stroke-width="6"/>'),
    mint: ballSvg('<circle cx="95" cy="95" r="90" fill="#A8E0C5"/><g fill="#5A3E2B"><circle cx="66" cy="70" r="12"/><circle cx="120" cy="58" r="10"/><circle cx="132" cy="110" r="13"/><circle cx="84" cy="128" r="11"/><circle cx="110" cy="150" r="8"/></g><circle cx="95" cy="95" r="90" fill="none" stroke="#5FA98A" stroke-width="6"/>'),
    rubber: ballSvg('<image href="assets/game/ball.png" width="190" height="190"/>')
  };
  var HOOP = { bx: -3000, w: 700, h: 1000, rim: [420, 330], rimR: 165, board: [40, 260, 40, 300] };   // rim centre and backboard in the hoop's own viewBox
  var CAPS = 'TYPER';
  var WALL = { x: -2900, y: 300, step: 230, size: 180, rows: ['NEWMEANS', 'TYPER!?♪'] };
  var LAMP = { x: 1700, y: -760, w: 2300, h: 2160 };
  function pom(cx, cy, r) { var s = ''; for (var i = 0; i < 26; i++) { var a = i / 26 * 6.283 + (i % 2) * 0.12, rr = r * (0.72 + (i % 3) * 0.14); s += '<path d="M' + (cx + Math.cos(a) * r * 0.2).toFixed(0) + ' ' + (cy + Math.sin(a) * r * 0.2).toFixed(0) + ' L' + (cx + Math.cos(a) * rr).toFixed(0) + ' ' + (cy + Math.sin(a) * rr).toFixed(0) + '" stroke="' + (i % 3 === 2 ? RAB : TXT) + '" stroke-width="15" stroke-linecap="round"/>'; } return '<g fill="none">' + s + '</g>'; }
  var ACC = {
    pompoms: function () {
      return svg('pompomL', 700, 860, 440, 380, '<path d="M262 348 L216 210" stroke="' + INK + '" stroke-width="11" stroke-linecap="round"/>' + pom(206, 150, 112), 6).replace('data-prop="pompomL"', 'data-prop="pompomL" data-follow="17" data-origin="97.5% 93%"') +
        svg('pompomR', 2360, 900, 330, 340, '<path d="M124 300 L124 190" stroke="' + INK + '" stroke-width="11" stroke-linecap="round"/>' + pom(124, 110, 88), 6).replace('data-prop="pompomR"', 'data-prop="pompomR" data-follow="18" data-origin="67.9% 92%"');
    },
    glasses: function () { return svg('glasses', 1380, 780, 760, 250, '<g fill="none" stroke="' + TXT + '" stroke-width="22"><circle cx="150" cy="125" r="112"/><circle cx="610" cy="125" r="112"/><path d="M262 118 Q380 70 498 118"/></g>', 5); },
    monocle: function () { return svg('monocle', 1860, 780, 320, 420, '<g fill="none" stroke="' + TXT + '" stroke-width="22"><circle cx="150" cy="125" r="112"/><path d="M230 210 q60 90 30 190"/></g>', 5, true); },
    shades: function () { return svg('shades', 1370, 800, 780, 210, '<g fill="' + INK + '"><rect x="0" y="20" width="330" height="170" rx="60"/><rect x="450" y="20" width="330" height="170" rx="60"/><rect x="320" y="60" width="140" height="26" rx="13"/></g><g fill="#fff" opacity=".35"><rect x="40" y="50" width="90" height="26" rx="13"/><rect x="490" y="50" width="90" height="26" rx="13"/></g>', 5); },
    visor: function () { return svg('visor', 1330, 790, 860, 230, '<path d="M0 40 h860 v100 q-430 100 -860 0z" fill="' + INK + '"/><rect x="50" y="86" width="760" height="26" rx="13" fill="#3AF0FF" opacity=".95"/><rect x="80" y="130" width="220" height="12" rx="6" fill="#FF3AD6" opacity=".8"/>', 5); },
    headphones: function () { return svg('headphones', 1180, 600, 1220, 520, '<path d="M120 420 V330 a490 400 0 0 1 980 0 V420" fill="none" stroke="' + TXT + '" stroke-width="30" stroke-linecap="round"/><rect x="20" y="330" width="200" height="190" rx="60" fill="' + TXT + '"/><rect x="1000" y="330" width="200" height="190" rx="60" fill="' + TXT + '"/>', 5, true); },
    mp3: function () { return floor('mp3', -760, 300, 380, '<rect x="20" y="20" width="260" height="340" rx="40" fill="' + TXT + '"/><rect x="60" y="60" width="180" height="110" rx="14" fill="' + PAPER + '" opacity=".9"/><circle cx="150" cy="260" r="62" fill="' + PAPER + '" opacity=".9"/><polygon class="play" points="135,232 135,288 185,260" fill="' + TXT + '"/>', 5, true); },
    waves: function () { return svg('waves', 2900, 520, 420, 300, '<g fill="none" stroke="' + TXT + '" stroke-width="22" stroke-linecap="round"><path d="M40 150 q40 -60 80 0 t80 0"/><path d="M200 150 q60 -110 120 0 t120 0"/></g>'); },
    partyhat: function () { return svg('partyhat', 1810, 380, 320, 400, '<polygon points="150,20 290,390 10,390" fill="' + TXT + '"/><circle cx="150" cy="24" r="34" fill="' + RAB + '" stroke="' + TXT + '" stroke-width="12"/><g fill="' + RAB + '"><circle cx="150" cy="180" r="20"/><circle cx="110" cy="300" r="20"/><circle cx="200" cy="320" r="20"/></g>', 4); },
    propeller: function () { return svg('propeller', 1830, 330, 280, 340, '<path d="M20 340 a120 120 0 0 1 240 0z" fill="' + TXT + '"/><rect x="132" y="150" width="16" height="80" fill="' + TXT + '"/><g class="prop" style="transform-box:fill-box;transform-origin:center"><ellipse cx="70" cy="150" rx="70" ry="18" fill="' + RAB + '" stroke="' + TXT + '" stroke-width="8"/><ellipse cx="210" cy="150" rx="70" ry="18" fill="' + RAB + '" stroke="' + TXT + '" stroke-width="8"/><circle cx="140" cy="150" r="18" fill="' + TXT + '"/></g>', 4, true); },
    popper: function () { return svg('popper', 2620, 400, 360, 360, '<polygon points="40,320 300,60 210,300" fill="' + TXT + '"/><g fill="' + RAB + '"><circle cx="150" cy="40" r="22"/><circle cx="330" cy="110" r="18"/><circle cx="60" cy="140" r="16"/></g>', 5, true); },
    gradcap: function () { return svg('gradcap', 1790, 540, 360, 240, '<polygon points="180,10 350,80 180,150 10,80" fill="' + INK + '"/><rect x="130" y="110" width="100" height="50" rx="10" fill="' + INK + '"/><path d="M338 86 v80" stroke="' + TXT + '" stroke-width="12" stroke-linecap="round"/><circle cx="338" cy="176" r="14" fill="' + TXT + '"/>', 4); },
    halo: function () { return svg('halo', 1660, 150, 380, 150, '<ellipse class="halo" cx="200" cy="80" rx="170" ry="52" fill="none" stroke="' + TXT + '" stroke-width="26" opacity=".85"/>', 4, true); },
    scarf: function () {                 // a striped knit scarf around the neck, painted behind the face so a paw rests on it
      var band = 'M20 50 Q630 190 1240 50 L1240 150 Q630 290 20 150z', stripes = '', ribs = '';
      for (var x = 150; x < 1240; x += 200) stripes += '<rect x="' + x + '" y="0" width="76" height="340" fill="' + RAB + '" transform="skewX(-14)"/>';
      for (var r = 40; r < 1220; r += 34) { var u = r / 1260; ribs += '<path d="M' + r + ' ' + (66 + 280 * u * (1 - u)).toFixed(0) + ' l9 24 l9 -24" fill="none" stroke="' + PAPER + '" stroke-width="4" opacity=".45"/>'; }
      var tail = 'M30 130 l-6 150 l118 6 l6 -140z';
      return svg('scarf', 1360, 1010, 1260, 340,
        '<clipPath id="scarf-band"><path d="' + band + '"/></clipPath><clipPath id="scarf-tail"><path d="' + tail + '"/></clipPath>' +
        '<path d="' + band + '" fill="' + TXT + '"/><g clip-path="url(#scarf-band)">' + stripes + '</g>' + ribs +
        '<path d="' + tail + '" fill="' + TXT + '"/><g clip-path="url(#scarf-tail)"><rect x="10" y="160" width="140" height="32" fill="' + RAB + '"/><rect x="10" y="232" width="140" height="32" fill="' + RAB + '"/></g>' +
        '<g stroke="' + TXT + '" stroke-width="9" stroke-linecap="round"><path d="M34 284 v28 M58 285 v28 M82 286 v28 M106 287 v28 M130 288 v28"/></g>' +
        '<ellipse cx="82" cy="128" rx="80" ry="42" fill="' + TXT + '"/><path d="M22 120 q60 -24 120 0" fill="none" stroke="' + PAPER + '" stroke-width="5" opacity=".45"/>', 0, false, true);
    },
    candle: function () { return floor('candle', -520, 160, 330, '<ellipse class="flame" cx="80" cy="70" rx="26" ry="46" fill="#F5B54A"/><ellipse class="flame" cx="80" cy="84" rx="12" ry="24" fill="#FCE9B0"/><rect x="76" y="100" width="8" height="30" fill="' + INK + '"/><rect x="30" y="126" width="100" height="200" rx="14" fill="' + PAPER + '" stroke="' + TXT + '" stroke-width="14"/>', 5, true); },
    tongue: function () { return svg('tongue', 1710, 1038, 90, 110, '<path d="M10 0 h70 v55 a35 35 0 0 1 -70 0z" fill="#F08CA0"/><path d="M45 18 v48" stroke="#D2607A" stroke-width="8" stroke-linecap="round"/>', 6); },
    coffee: function () { return floor('coffee', -440, 260, 320, '<g class="steam" fill="none" stroke="' + TXT + '" stroke-width="12" stroke-linecap="round"><path d="M70 100 q20 -30 0 -60"/><path d="M120 100 q20 -30 0 -60"/><path d="M170 100 q20 -30 0 -60"/></g><path d="M30 150 h170 v110 a70 70 0 0 1 -70 70 h-30 a70 70 0 0 1 -70 -70z" fill="' + TXT + '"/><path d="M200 170 h20 a45 45 0 0 1 0 90 h-20" fill="none" stroke="' + TXT + '" stroke-width="18"/>', 5, true); },
    keycaps: function () { var s = ''; for (var i = 0; i < CAPS.length; i++) s += keycapAt('keycap' + i, -2200 + i * 300, CAPS[i]); return s; },
    wall: function () {
      var s = '', k = fk(), q = fs();
      WALL.rows.forEach(function (row, r) { for (var c = 0; c < row.length; c++) s += svg('brick', X0 + (WALL.x + c * WALL.step) * k, Y0 + (WALL.y + r * WALL.step) * k, WALL.size * q, WALL.size * q, keycapInner(row[c]), 5, true); });
      return s;
    },
    ball: function () { return floor('ball', -400, 190, 190, BALLS.basket, 8, true); },
    tennis: function () { return floor('ball', -400, 190, 190, BALLS.tennis, 8, true); },
    globe: function () { return floor('ball', -400, 190, 190, BALLS.globe, 8, true); },
    mintball: function () { return floor('ball', -400, 190, 190, BALLS.mint, 8, true); },
    rubber: function () { return floor('ball', -400, 190, 190, BALLS.rubber, 8, true); },
    goal: function () { return svg('goal', X0 + WALL.x * fk(), Y0 + (WALL.y - 170) * fk(), 1900 * fs(), 130 * fs(), '<text class="goal" x="0" y="104" font-size="110" font-family="DNFBitBit,monospace" fill="' + TXT + '">16 LEFT</text>', 5); },
    hoop: function () { return floor('hoop', HOOP.bx, HOOP.w, HOOP.h, '<rect x="60" y="300" width="24" height="700" fill="' + TXT + '"/><rect x="0" y="970" width="190" height="30" rx="10" fill="' + TXT + '"/><rect x="40" y="40" width="220" height="260" rx="18" fill="none" stroke="' + TXT + '" stroke-width="22"/><rect x="250" y="320" width="30" height="24" fill="' + TXT + '"/><ellipse class="rim" cx="420" cy="330" rx="165" ry="44" fill="none" stroke="' + TXT + '" stroke-width="22"/><g class="net" fill="none" stroke="' + TXT + '" stroke-width="10" opacity=".55"><path d="M265 350 l45 170 M575 350 l-45 170 M340 368 l25 152 M500 368 l-25 152 M310 520 h220"/></g><text class="score" x="420" y="250" font-size="96" text-anchor="middle" font-family="DNFBitBit,monospace" fill="' + TXT + '" opacity="0">+1</text>', 3); },
    monitor: function () { return floor('monitor', -1100, 520, 470, '<image href="assets/shop/monitor/2000.png" width="520" height="469"/><text class="screen-text" x="115" y="240" font-size="68" font-family="DNFBitBit,monospace" fill="#65cda7" opacity="0">TYPER</text>', 4, true); },
    cactus: function () { return floorImg('cactus', -1300, 150, 240, 'assets/desk/sculpture.png'); },
    bubble: function () { return svg('bubble', 2480, 380, 620, 420, '<path d="M60 40 h500 a50 50 0 0 1 50 50 v190 a50 50 0 0 1 -50 50 h-300 l-90 80 v-80 h-110 a50 50 0 0 1 -50 -50 v-190 a50 50 0 0 1 50 -50z" fill="' + TXT + '"/><text class="bubble-text" x="310" y="185" text-anchor="middle" dominant-baseline="central" font-size="150" font-weight="700" font-family="ui-monospace,monospace" fill="' + RAB + '">ㅋㅋ</text>', 5, true); },
    thought: function () { return svg('thought', 2560, 330, 560, 420, '<circle cx="90" cy="380" r="22" fill="' + TXT + '"/><circle cx="150" cy="320" r="34" fill="' + TXT + '"/><path d="M200 90 a90 90 0 0 1 150 -40 a100 100 0 0 1 170 40 a80 80 0 0 1 10 150 a90 90 0 0 1 -150 60 a100 100 0 0 1 -170 -30 a80 80 0 0 1 -10 -180z" fill="' + TXT + '"/><text x="346" y="176" text-anchor="middle" dominant-baseline="central" font-size="140" font-weight="700" font-family="ui-monospace,monospace" fill="' + RAB + '">…</text>', 5); },
    mirror: function () { return svg('mirror', 820, 780, 330, 420, '<ellipse cx="165" cy="150" rx="130" ry="130" fill="' + PAPER + '" stroke="' + TXT + '" stroke-width="24"/><rect x="150" y="270" width="30" height="130" rx="10" fill="' + TXT + '"/><text x="60" y="180" font-size="110" font-family="ui-monospace,monospace" fill="' + RAB + '" transform="scale(-1,1) translate(-330,0)">(´^`*)</text>', 5, true); },
    friend: function () { return floor('friend', -1160, 640, 400, '<g font-family="ui-monospace,monospace" font-weight="700" fill="' + TXT + '"><text x="120" y="150" font-size="160">/) /)</text><text x="40" y="330" font-size="170">(´^`*)</text></g>', 5, true); },
    magnifier: function () { return floor('magnifier', -520, 340, 340, '<circle cx="120" cy="120" r="95" fill="none" stroke="' + TXT + '" stroke-width="22"/><path d="M190 190 L320 320" stroke="' + TXT + '" stroke-width="34" stroke-linecap="round"/>', 5, true); },
    clover: function () { return floor('clover', -560, 320, 360, '<g class="leaves" style="transform-box:fill-box;transform-origin:center" fill="' + TXT + '"><circle cx="110" cy="90" r="62"/><circle cx="210" cy="90" r="62"/><circle cx="110" cy="190" r="62"/><circle cx="210" cy="190" r="62"/><circle cx="160" cy="140" r="30" fill="' + RAB + '"/></g><path d="M160 240 q-30 70 -60 110" fill="none" stroke="' + TXT + '" stroke-width="18" stroke-linecap="round"/>', 5, true); },
    saturn: function () { return svg('saturn', 2450, -430, 520, 360, '<g class="ring-tilt" style="transform-box:fill-box;transform-origin:center"><ellipse cx="260" cy="180" rx="245" ry="62" fill="none" stroke="' + TXT + '" stroke-width="20" transform="rotate(-16 260 180)"/></g><circle cx="260" cy="180" r="105" fill="' + RAB + '" stroke="' + TXT + '" stroke-width="14"/><path d="M175 150 q85 40 170 0" fill="none" stroke="' + TXT + '" stroke-width="12" opacity=".6"/>', 5, true); },
    sun: function () { return svg('sun', 2520, 380, 320, 320, '<circle cx="160" cy="160" r="70" fill="' + TXT + '"/><g class="rays" stroke="' + TXT + '" stroke-width="22" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { var r = a * Math.PI / 180; return '<path d="M' + (160 + Math.cos(r) * 100) + ' ' + (160 + Math.sin(r) * 100) + ' L' + (160 + Math.cos(r) * 145) + ' ' + (160 + Math.sin(r) * 145) + '"/>'; }).join('') + '</g>', 5, true); },
    bang: function () { return svg('bang', 2520, 420, 200, 380, '<text x="0" y="330" font-size="380" font-weight="800" font-family="ui-monospace,monospace" fill="' + TXT + '">!</text>', 5, true); },
    // a stage lamp above the head and its warm cone, painted behind the rabbit
    stagelight: function () { return svg('stagelight', LAMP.x - 1000, LAMP.y, LAMP.w, LAMP.h, '<g class="beam" style="transform-box:fill-box;transform-origin:1150px 250px"><polygon points="1010,270 1290,270 2300,2160 0,2160" fill="#F5D76E" opacity=".3"/><rect x="1060" y="0" width="180" height="60" rx="10" fill="' + INK + '"/><path d="M1040 60 h220 l40 170 h-300z" fill="' + INK + '"/><rect x="1000" y="230" width="300" height="44" rx="10" fill="#F5D76E"/></g>', 0, true, true); },
    tears: function () { return svg('tears', 1440, 930, 700, 380, '<g transform="translate(40,0) scale(1.5)"><path class="tear" d="M30 0 C30 45 0 60 0 100 a30 30 0 0 0 60 0 C60 60 30 45 30 0z" fill="#79C0F1"/></g><g transform="translate(500,0) scale(1.5)"><path class="tear t2" d="M30 0 C30 45 0 60 0 100 a30 30 0 0 0 60 0 C60 60 30 45 30 0z" fill="#79C0F1"/></g>', 6); },
    diploma: function () { return svg('diploma', 880, 1020, 300, 180, '<g class="scroll-body"><rect x="20" y="40" width="260" height="90" rx="45" fill="' + PAPER + '" stroke="' + TXT + '" stroke-width="14"/></g><rect x="120" y="30" width="60" height="110" rx="12" fill="' + TXT + '"/>', 5, true); },
    icecream: function () { return svg('icecream', 2380, 840, 260, 420, '<polygon points="130,410 30,180 230,180" fill="#E2AB70"/><path d="M50 180 l40 -90 l40 90 l40 -90 l40 90" fill="none" stroke="#C88B4A" stroke-width="8"/><circle cx="130" cy="130" r="105" fill="#A8E0C5"/><g fill="#5A3E2B"><circle cx="90" cy="110" r="14"/><circle cx="160" cy="80" r="12"/><circle cx="170" cy="150" r="13"/><circle cx="110" cy="170" r="10"/></g><g class="bite" fill="' + PAPER + '"><circle class="bite b1" cx="215" cy="70" r="46"/><circle class="bite b2" cx="60" cy="60" r="44"/><circle class="bite b3" cx="130" cy="30" r="46"/></g>', 5, true); },
    neonsign: function () { return floor('neonsign', -1000, 560, 430, '<rect x="20" y="20" width="520" height="220" rx="30" fill="none" stroke="#FF3AD6" stroke-width="12" class="neon-frame"/><text class="neon-text" x="280" y="165" font-size="104" text-anchor="middle" font-family="DNFBitBit,monospace" fill="#3AF0FF">ONLINE</text><rect x="250" y="240" width="60" height="150" fill="' + TXT + '"/><rect x="160" y="390" width="240" height="30" rx="10" fill="' + TXT + '"/>', 5, true); },
    keyring: function () { return ''; }   // lives on the slot lever, see hangKeyring()
  };
  // the keycap keyring that hangs on the lever: a ring, two chain links, the cap with a hole in its corner
  var KEYRING = '<svg class="keyring" viewBox="0 0 130 200" aria-hidden="true"><g fill="none" stroke="#706B64" stroke-width="7"><circle cx="20" cy="18" r="13"/><circle cx="30" cy="41" r="8"/><circle cx="40" cy="60" r="8"/><circle cx="48" cy="81" r="12" stroke-width="6"/></g><g transform="translate(40,84) scale(.46)">' + keycapInner('N') + '</g></svg>';

  // ---------- particles: small things that float around the rabbit and swirl when the cursor stirs them ----------
  function heart(fill) { return '<path d="M50 88 L18 56 a20 20 0 0 1 32 -26 a20 20 0 0 1 32 26z" fill="' + fill + '"/>'; }
  var PT = {
    stars: { size: [40, 90], glyph: function () { return star(50, 50, 48); } },
    sparks: { size: [26, 56], glyph: function () { return '<path d="M50 4 L58 42 L96 50 L58 58 L50 96 L42 58 L4 50 L42 42z" fill="' + TXT + '"/>'; } },
    hearts: { size: [50, 90], glyph: function () { return heart(TXT); } },
    notes: { size: [70, 120], glyph: function (i) { return '<text x="10" y="86" font-size="96" font-family="ui-monospace,monospace" fill="' + TXT + '">' + (i % 2 ? '♫' : '♪') + '</text>'; } },
    zzz: { size: [90, 160], drift: -0.35, near: true, glyph: function () { return '<text x="14" y="84" font-size="92" font-weight="700" font-family="ui-monospace,monospace" fill="' + TXT + '">z</text>'; } },
    bolts: { size: [50, 100], glyph: function () { return '<polygon points="58,2 22,54 46,54 36,98 80,42 56,42" fill="' + TXT + '"/>'; } },
    confetti: { size: [28, 50], glyph: function (i) { var cols = ['#FF6666', '#DAB249', '#79C0F1', '#C1A9EE', '#95C78A', '#EE95D1']; return '<rect x="10" y="30" width="80" height="40" rx="10" fill="' + cols[i % 6] + '"/>'; } },
    coins: { size: [70, 110], glyph: function () { return '<circle cx="50" cy="50" r="44" fill="#DAB249"/><circle cx="50" cy="50" r="30" fill="none" stroke="#7C5F00" stroke-width="7"/><rect x="45" y="32" width="10" height="36" fill="#7C5F00"/>'; } },
    bits: { size: [22, 44], glyph: function (i) { return '<rect x="20" y="20" width="60" height="60" rx="8" fill="' + (i % 3 ? '#3AF0FF' : '#FF3AD6') + '" opacity=".9"/>'; } },
    planets: { size: [90, 130], orbit: true, glyph: function (i) { var c = ['#F08CA0', '#79C0F1', '#DAB249'][i % 3]; return '<circle cx="50" cy="50" r="34" fill="' + c + '"/><path d="M22 42 q28 22 56 0" fill="none" stroke="#3B3732" stroke-width="5" opacity=".35"/>'; } }
  };
  // where particles may live: around the head and body, and the sky to the right of the copy
  function ptSpot(i, def) {
    if (def.near) return [1750 + Math.random() * 900, -320 + Math.random() * 520];
    return i % 3 === 0 ? [1100 + Math.random() * 2200, -900 + Math.random() * 760] : [-100 + Math.random() * 3500, -120 + Math.random() * 980];
  }

  // ---------- eye shapes, drawn over the eye pieces in the rabbit colour (stroke 40 = the logo's stroke) ----------
  var EYE = (function () {
    var S = ' fill="none" stroke="' + RAB + '" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"';
    var spiral = (function () { var d = 'M120 120'; for (var a = 0; a <= 4.2 * Math.PI; a += 0.3) { var r = 8 + a * 9; d += ' L' + (120 + Math.cos(a) * r).toFixed(1) + ' ' + (120 + Math.sin(a) * r).toFixed(1); } return d; })();
    var one = function (s) { return [s, s]; };
    return {
      round: one('<circle cx="120" cy="120" r="56"' + S + '/>'),
      line: one('<path d="M48 124 H192"' + S + '/>'),
      happy: one('<path d="M50 152 L120 82 L190 152"' + S + '/>'),
      arc: one('<path d="M50 92 Q120 186 190 92"' + S + '/>'),
      squeeze: ['<path d="M62 62 L172 120 L62 178"' + S + '/>', '<path d="M178 62 L68 120 L178 178"' + S + '/>'],
      star: one('<path d="M120 22 L142 88 L212 88 L156 130 L178 198 L120 156 L62 198 L84 130 L28 88 L98 88z" fill="' + RAB + '" transform="translate(120 120) scale(.8) translate(-120 -120)"/>'),
      heart: one('<path d="M120 200 L44 124 a44 44 0 0 1 76 -62 a44 44 0 0 1 76 62z" fill="' + RAB + '"/>'),
      spiral: one('<path d="' + spiral + '" fill="none" stroke="' + RAB + '" stroke-width="26" stroke-linecap="round"/>'),
      tear: one('<path d="M46 62 H194 M120 62 V196"' + S + '/>'),
      skeptic: one('<path d="M46 96 H194 V184"' + S + '/>'),
      x: one('<path d="M56 56 L184 184 M184 56 L56 184"' + S + '/>'),
      dot: one('<circle cx="120" cy="120" r="50" fill="' + RAB + '"/>')
    };
  })();
  var REACTION_EYES = { dizzy: 'spiral', wave: 'round', flap: 'squeeze', hop: 'happy' };
  var DOTS = {
    key: '<svg viewBox="0 0 40 40"><rect x="4" y="6" width="32" height="30" rx="7" fill="currentColor"/><rect x="10" y="10" width="20" height="14" rx="4" fill="#FCFBF7" opacity=".85"/></svg>',
    star: '<svg viewBox="0 0 40 40"><polygon points="20,2 24,15 38,20 24,25 20,38 16,25 2,20 16,15" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 40 40"><polygon points="24,2 8,22 19,22 14,38 32,16 21,16" fill="currentColor"/></svg>'
  };

  function mount(root) {
    if (!root || root.__nm) return; root.__nm = true;
    var base = root.getAttribute('data-base') || 'assets/brand/logo-pieces/';
    var accRoot = document.getElementById(root.getAttribute('data-acc')) || root;
    var backRoot = document.getElementById(root.getAttribute('data-back')) || accRoot;
    var ptRoot = document.getElementById(root.getAttribute('data-pts')) || accRoot;
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
      var alt = null;
      if (id === 12 || id === 13) { alt = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); alt.setAttribute('class', 'eye-alt'); alt.setAttribute('viewBox', '0 0 240 240'); el.appendChild(alt); }
      return { el: el, alt: alt, id: id, role: r, hx: (p[1] + p[3] / 2 - X0) / BW, hy: (p[2] + p[4] / 2 - Y0) / BH, phase: (i * 1.7) % 6.283, x: 0, y: 0, vx: 0, vy: 0, rot: 0, dragging: false, hover: false, gx: 0, gy: 0, big: 1 };
    });
    var letters = pieces.filter(function (p) { return p.role === 'word'; }).sort(function (a, b) { return a.hx - b.hx; });
    var byId = {}; pieces.forEach(function (p) { byId[p.id] = p; });
    var eyesNow = null;
    function setEyes(kind) {
      if (kind === eyesNow) return; eyesNow = kind;
      [byId[12], byId[13]].forEach(function (p, i) {
        if (!kind || !EYE[kind]) { p.el.classList.remove('is-alt'); return; }
        p.alt.innerHTML = EYE[kind][i]; p.el.classList.add('is-alt');
      });
    }

    // ---------- the cursor ----------
    var cur = document.getElementById('cursor'), curX = 0, curY = 0, curTX = 0, curTY = 0, curOn = false;
    function cursorState(s) { if (cur) cur.setAttribute('data-state', s); }
    var hero = root.closest('.hero') || document.body;
    if (fine && cur) {
      hero.classList.add('has-cursor');
      hero.addEventListener('pointerenter', function () { curOn = true; cur.classList.add('is-on'); });
      hero.addEventListener('pointerleave', function () { if (!dragEl) { curOn = false; cur.classList.remove('is-on'); } });
    }
    hero.addEventListener('dragstart', function (e) { e.preventDefault(); });   // never let the browser start an image drag

    // ---------- sounds (real Typer switch clips, only after a click) ----------
    var clips = null, clipAt = 0;
    function click(i) {
      if (!clips) { clips = []; for (var k = 0; k < 4; k++) clips.push(new Audio('assets/audio/switch/4000/' + k + '.m4a')); }
      var c = clips[(i != null ? i : clipAt++) % clips.length]; try { c.currentTime = 0; c.play().catch(function () { }); } catch (_) { }
    }
    var rhythm = 0;
    function playRhythm(el) {
      if (rhythm) { clearInterval(rhythm); rhythm = 0; el.classList.remove('is-playing'); ptRoot.classList.remove('is-playing'); return; }
      var pattern = [0, 1, 0, 2, 0, 1, 3, 2], i = 0; el.classList.add('is-playing'); ptRoot.classList.add('is-playing');
      rhythm = setInterval(function () { click(pattern[i % pattern.length]); i++; if (i >= 16) { clearInterval(rhythm); rhythm = 0; el.classList.remove('is-playing'); ptRoot.classList.remove('is-playing'); } }, 250);
    }

    // ---------- simulation (main branch rules) ----------
    var rect, cx, cy, reach, MAX = 6;
    function measure() { rect = root.getBoundingClientRect(); cx = rect.left + rect.width / 2; cy = rect.top + rect.height / 2; reach = Math.max(300, rect.width * 1.1); MAX = rect.width * 0.03; }
    addEventListener('resize', measure); addEventListener('scroll', measure, { passive: true });
    var nx = 0, ny = 0, tnx = 0, tny = 0, tm = 0, lastT = 0, raf = 0, agitate = 0, lastSweat = -9, away = null, dragEl = null, interacted = false;
    var pointerX = -9999, pointerY = -9999, lastMove = -9999, ppx = 0, ppy = 0, pvx = 0, pvy = 0;
    var eyeMood = null, earMood = null, moodOverride = null, spinning = false, reaction = null, waveTimer = 0, heroSeen = true, cheerUntil = 0, cheerTimer = 0, followers = [];
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { es.forEach(function (e) { heroSeen = e.isIntersecting; if (heroSeen) wake(); }); }, { threshold: 0.05 }).observe(hero);
    document.addEventListener('pointermove', function (e) {
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
      function up(e) { if (dragEl !== p) return; dragEl = null; p.dragging = false; p.el.classList.remove('drag'); cursorState(p.hover ? 'hand' : ''); if (e && e.type === 'pointerup' && performance.now() - p.downAt < 220 && Math.hypot(e.clientX - p.downX, e.clientY - p.downY) < 6) poke(p); wake(); }
      p.el.addEventListener('pointerup', up); p.el.addEventListener('pointercancel', up); p.el.addEventListener('lostpointercapture', up);
    });
    function spawnSweat() {
      var s = document.createElement('div'); s.className = 'nm-sweat'; s.textContent = ';';
      s.style.left = '57.7%'; s.style.top = '22%'; accRoot.appendChild(s); s.addEventListener('animationend', function () { s.remove(); });
    }
    function wake() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick(now) {
      raf = 0;
      var dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now; tm += dt;
      var f = Math.min(2, dt * 60);
      nx += (tnx - nx) * 0.09; ny += (tny - ny) * 0.09;
      if (dragEl) agitate += (1 - agitate) * 0.14;
      else if (away) { var d = Math.hypot(away.x, away.y); agitate += (Math.min(1, d / (rect.width * 0.14)) - agitate) * 0.1; if (d < rect.width * 0.008) away = null; }
      else agitate += (0 - agitate) * 0.08;
      if (!reduce && agitate > 0.35 && tm - lastSweat > 0.5) { spawnSweat(); lastSweat = tm; }
      var pointerActive = (now - lastMove) < 1200, moving = false, s = reduce ? 0.35 : 1;
      setEyes(moodOverride || (spinning && reaction && REACTION_EYES[reaction]) || (agitate > 0.45 ? 'round' : eyeMood));
      for (var k = 0; k < pieces.length; k++) {
        var p = pieces[k], tx, ty, rot = 0;
        if (p.dragging) {
          tx = (pointerX - rect.left - p.gx) - p.hx * rect.width; ty = (pointerY - rect.top - p.gy) - p.hy * rect.height;
          var hr = hero.getBoundingClientRect(), pw = p.el.offsetWidth, ph = p.el.offsetHeight, ox = rect.left + p.hx * rect.width, oy = rect.top + p.hy * rect.height;
          tx = Math.max(hr.left - ox + pw * 0.2, Math.min(hr.right - ox - pw * 0.2, tx)); ty = Math.max(hr.top - oy + ph * 0.2, Math.min(hr.bottom - oy - ph * 0.2, ty));
        } else if (p.role === 'spark') {
          var live = (pointerActive || agitate > 0.02 || spinning) ? 1 : 0;
          tx = nx * 0.6 * MAX * s + Math.sin(tm * 1.6 + p.phase) * MAX * 0.5 * s * live;
          ty = ny * 0.6 * MAX * s + Math.cos(tm * 1.3 + p.phase) * MAX * 0.6 * s * live;
          if (spinning && reaction === 'hop') { tx = Math.cos(tm * 7 + p.phase) * MAX * 1.6; ty = Math.sin(tm * 7 + p.phase) * MAX * 1.6; }
        } else {
          var lean = LEAN[p.role] * s; tx = nx * lean * MAX; ty = ny * lean * MAX;
          if (p.hover) { ty -= rect.width * 0.02; rot = -3; }
          var left = p.id === 4 || p.id === 1;
          if (p.role === 'ear' && earMood) rot += earMood === 'droop' ? (left ? -14 : 14) : (left ? 5 : -5);
          if (p.role === 'feet' && now < cheerUntil) { rot += Math.sin(tm * 30 + (p.id === 17 ? 0 : 1.2)) * 18; moving = true; }
          if (agitate > 0.02) {
            if (p.role === 'feet') rot = Math.abs(Math.sin(tm * 13 + (p.id === 17 ? 0 : Math.PI / 2))) * agitate * 32;
            else if (p.role === 'tail') rot = Math.sin(tm * 26) * agitate * 30;
            else if (p.role === 'face') ty += Math.sin(tm * 5) * agitate * MAX * 0.25;
          }
          if (spinning && !reduce) {                                    // the reel is turning: one of four reactions
            if (reaction === 'dizzy') { if (p.role === 'face') { ty += Math.sin(tm * 7 + p.phase) * MAX * 0.5; rot += Math.sin(tm * 9) * 6; } else if (p.role === 'ear') rot += left ? -12 : 12; }
            else if (reaction === 'flap') { if (p.role === 'ear') rot += Math.sin(tm * 20) * 24 * (left ? 1 : -1); else if (p.role === 'feet') rot = Math.abs(Math.sin(tm * 13 + (p.id === 17 ? 0 : Math.PI / 2))) * 32; else if (p.role === 'tail') rot = Math.sin(tm * 26) * 30; }
            else if (reaction === 'hop') { if (p.role !== 'word') ty -= Math.abs(Math.sin(tm * 8)) * MAX * 1.8; }
            else if (reaction === 'wave') { if (p.role !== 'word') ty += Math.sin(tm * 6 + p.hx * 5) * MAX * 0.45; }
          }
        }
        var kk = p.dragging ? 0.35 : 0.16;
        p.vx += (tx - p.x) * kk; p.vy += (ty - p.y) * kk; p.vx *= 0.74; p.vy *= 0.74; p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.05 || Math.abs(rot - p.rot) > 0.01) moving = true;
        p.rot += (rot - p.rot) * (p.role === 'word' ? 0.2 : 1);
        var eyeT = p.alt && p.big !== 1 ? ' scale(' + p.big + ')' : '';
        p.el.style.transform = 'translate(' + p.x.toFixed(2) + 'px,' + p.y.toFixed(2) + 'px)' + (Math.abs(p.rot) > 0.01 ? ' rotate(' + p.rot.toFixed(2) + 'deg)' : '') + eyeT;
      }
      stepBall(f); if (ball && !ball.rest && !ball.drag) moving = true;
      if (stepParticles(f, now)) moving = true;
      var fc = pieces[10]; accRoot.style.setProperty('--ax', fc.x.toFixed(2) + 'px'); accRoot.style.setProperty('--ay', fc.y.toFixed(2) + 'px');
      for (var q = 0; q < followers.length; q++) { var fp = followers[q].p; followers[q].el.style.transform = 'translate(' + (fp.x - fc.x).toFixed(2) + 'px,' + (fp.y - fc.y).toFixed(2) + 'px) rotate(' + fp.rot.toFixed(2) + 'deg)'; }
      if (cur && curOn) { curX += (curTX - curX) * 0.35; curY += (curTY - curY) * 0.35; cur.style.transform = 'translate(' + curX.toFixed(1) + 'px,' + curY.toFixed(1) + 'px)'; if (Math.abs(curTX - curX) + Math.abs(curTY - curY) > 0.3) moving = true; }
      if (moving || dragEl || agitate > 0.01 || spinning || pointerActive) raf = requestAnimationFrame(tick); else lastT = 0;
    }
    function poke(p, soft) {
      if (!p) p = letters[(Math.random() * letters.length) | 0];
      measure(); var sc = rect.width / 560;
      if (soft) { p.vy = -14 * sc; wake(); return; }
      p.vx = (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 5) * sc; p.vy = -(27 + Math.random() * 8) * sc; away = p;
      say(t('home.status.letter', { n: NAME[p.id] })); wake();
    }
    function hopAll() { measure(); var sc = rect.width / 560; pieces.forEach(function (p) { if (p.role !== 'word' && p.role !== 'spark') p.vy -= 9 * sc; }); wake(); }
    var moodTimer = 0;
    function mood(m, ms) { moodOverride = m; wake(); clearTimeout(moodTimer); moodTimer = setTimeout(function () { moodOverride = null; wake(); }, ms); }
    measure();
    if (!reduce) setTimeout(function () { if (!interacted) poke(); }, 1800);   // self demo: a letter jumps once to show it is loose

    // ---------- particles ----------
    var pts = [];
    function setupParticles(entry) {
      ptRoot.textContent = ''; pts = [];
      (entry.pt || []).forEach(function (spec) {
        var def = PT[spec.k], n = spec.n || 6;
        for (var i = 0; i < n; i++) {
          var size = def.size[0] + Math.random() * (def.size[1] - def.size[0]);
          var el = document.createElement('i'); el.className = 'pt pt--' + spec.k; el.style.width = size / BW * 100 + '%'; el.style.height = size / BH * 100 + '%';
          el.innerHTML = '<svg viewBox="0 0 100 100">' + def.glyph(i) + '</svg>';
          var a = Math.random() * 6.28, sp0 = 0.25 + Math.random() * 0.45;
          var pt = { el: el, x: 0, y: 0, vx: Math.cos(a) * sp0, vy: Math.sin(a) * sp0 + (def.drift || 0), rot: Math.random() * 40 - 20, spin: (Math.random() - 0.5) * 0.5, size: size, orbit: null, hx: 0, hy: 0 };
          if (def.orbit) { pt.orbit = { cx: 1750, cy: 300, rx: 900 + i * 260, ry: 340 + i * 90, a: Math.random() * 6.28, w: 0.5 - i * 0.12 }; pt.hx = pt.orbit.cx; pt.hy = pt.orbit.cy; pt.vx = pt.vy = 0; }
          else { var sp = ptSpot(i, def); pt.hx = sp[0]; pt.hy = sp[1]; }
          pt.x = pt.hx; pt.y = pt.hy;
          el.style.left = (pt.hx - size / 2) / BW * 100 + '%'; el.style.top = (pt.hy - size / 2) / BH * 100 + '%';
          ptRoot.appendChild(el); pts.push(pt);
        }
      });
      wake();
    }
    // particles float like things in space: a slow drift, a bump from the cursor sends them off, no spring home
    function stepParticles(f, now) {
      if (!pts.length || !heroSeen) return false;
      var u = BW / rect.width, px = (pointerX - rect.left) * u, py = (pointerY - rect.top) * u, hr = hero.getBoundingClientRect();
      var xmin = (hr.left - rect.left) * u, xmax = (hr.right - rect.left) * u, ymin = (hr.top - rect.top) * u, ymax = (hr.bottom - rect.top) * u;
      var live = now - lastMove < 900, R = 380, any = false;
      pvx = px - ppx; pvy = py - ppy; ppx = px; ppy = py; if (Math.abs(pvx) + Math.abs(pvy) > 600) { pvx = 0; pvy = 0; }
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (p.orbit) {                                                 // planets stay in orbit, but a bump knocks them off it for a while
          var o = p.orbit; o.a += o.w * f / 60; var hx = o.cx + Math.cos(o.a) * o.rx, hy = o.cy + Math.sin(o.a) * o.ry;
          p.vx += (hx - p.x) * 0.02 * f; p.vy += (hy - p.y) * 0.02 * f; p.vx *= 0.9; p.vy *= 0.9;
        }
        if (!reduce && live) {
          var dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
          if (d < R && d > 1) { var k = (1 - d / R) * (1 - d / R), nx1 = dx / d, ny1 = dy / d; p.vx += nx1 * 2.2 * k * f + pvx * 0.45 * k; p.vy += ny1 * 2.2 * k * f + pvy * 0.45 * k; p.spin += (pvx - pvy) * 0.01 * k; }
        }
        if (!p.orbit) {
          var v = Math.hypot(p.vx, p.vy);
          if (v > 22) { p.vx *= 22 / v; p.vy *= 22 / v; } else if (v > 1.2) { p.vx *= 0.985; p.vy *= 0.985; }   // fast ones settle back to a drift, slow ones keep drifting
          if (Math.abs(p.spin) > 3) p.spin *= 0.95;
        }
        if (reduce) { p.vx = p.vy = 0; }
        p.x += p.vx * f; p.y += p.vy * f; p.rot += p.spin * f;
        if (!p.orbit) {                                                 // off one edge of the hero, back in from the other
          var m = p.size;
          if (p.x < xmin - m) p.x = xmax + m; else if (p.x > xmax + m) p.x = xmin - m;
          if (p.y < ymin - m) p.y = ymax + m; else if (p.y > ymax + m) p.y = ymin - m;
        }
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02) any = true;
        p.el.style.transform = 'translate(' + ((p.x - p.hx) / u).toFixed(1) + 'px,' + ((p.y - p.hy) / u).toFixed(1) + 'px) rotate(' + p.rot.toFixed(1) + 'deg)';
      }
      return any;
    }

    // ---------- the ball: drag and let go to throw it. Score in the hoop, knock the keycaps over, clear the wall. ----------
    var ball = null, scoreN = 0, WALLX = -20;      // ball lives in box units (BW x BH); the ground is the wordmark baseline; it stays left of the N
    function toBox(e) { var u = BW / rect.width; return [(e.clientX - rect.left) * u, (e.clientY - rect.top) * u]; }
    function hoopGeo() { var k = fk(), q = fs(); return { rx: HOOP.bx * k + HOOP.rim[0] * q, ry: BH - HOOP.h * q + HOOP.rim[1] * q, rr: HOOP.rimR * q, bx0: HOOP.bx * k + HOOP.board[0] * q, bx1: HOOP.bx * k + HOOP.board[1] * q, by0: BH - HOOP.h * q + HOOP.board[2] * q, by1: BH - HOOP.h * q + HOOP.board[3] * q }; }
    function setupBall() {
      var el = accRoot.querySelector('[data-prop="ball"]'); ball = null; scoreN = 0; if (!el) return;
      var r = 95 * fs();
      ball = { el: el, roll: el.querySelector('.roll'), x: -400 * fk() + r, y: BH - r, r: r, vx: 0, vy: 0, ang: 0, drag: false, rest: true, trail: [], threwAt: 0, mode: 'gravity', until: 0 };
      el.addEventListener('pointerdown', function (e) {
        e.preventDefault(); e.stopPropagation(); interacted = true; measure();
        ball.drag = true; ball.rest = false; ball.vx = ball.vy = 0; ball.trail = []; cursorState('grab');
        try { el.setPointerCapture(e.pointerId); } catch (_) { }
        carry(e); wake();
      });
      el.addEventListener('pointermove', function (e) { if (ball.drag) { carry(e); wake(); } });
      function carry(e) { var b = toBox(e); ball.x = Math.min(WALLX - ball.r, b[0]); ball.y = b[1]; ball.trail.push([ball.x, ball.y, performance.now()]); if (ball.trail.length > 6) ball.trail.shift(); placeBall(); }
      function up(e) {
        if (!ball.drag) return; ball.drag = false; cursorState('');
        var tr = ball.trail, n = tr.length;
        if (e.type === 'pointerup' && n >= 2) {
          var a = tr[0], b = tr[n - 1], dt = Math.max(16, b[2] - a[2]), sp = 16 * 0.6;
          ball.vx = (b[0] - a[0]) / dt * sp; ball.vy = (b[1] - a[1]) / dt * sp;
          var v = Math.hypot(ball.vx, ball.vy); if (v > 120) { ball.vx *= 120 / v; ball.vy *= 120 / v; }
          if (v > 6) { ball.threwAt = performance.now(); if (wallLive()) arcadeOn(); }
        }
        wake();
      }
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
      placeBall();
    }
    function placeBall() {
      ball.el.style.left = (ball.x - ball.r) / BW * 100 + '%'; ball.el.style.top = (ball.y - ball.r) / BH * 100 + '%';
      ball.roll.style.transform = 'rotate(' + ball.ang.toFixed(1) + 'deg)';
    }
    function wallLive() { return !!accRoot.querySelector('[data-prop="brick"]:not(.is-gone)'); }
    function arcadeOn() { ball.mode = 'arcade'; var v = Math.hypot(ball.vx, ball.vy) || 1, want = Math.max(40, Math.min(58, v)) * fs(); ball.vx *= want / v; ball.vy *= want / v; if (Math.abs(ball.vy) < 8 * fs()) ball.vy = -14 * fs(); mood('round', 1200); }
    function shootBall() {                        // a tap: a clean arc to the rim (with a little wobble so it can rim out), or a serve at the wall
      var hoop = accRoot.querySelector('[data-prop="hoop"]'); ball.rest = false;
      if (hoop) {
        var h = hoopGeo(), T = 46, g = 2.4, j = 1 + (Math.random() - 0.5) * 0.05;
        if (ball.x < h.bx1 + ball.r) { ball.vx = 30 * fs(); ball.vy = -70 * fs(); }          // stuck behind the board: hop back over it first
        else { ball.vx = (h.rx - ball.x) / T * j; ball.vy = ((h.ry - ball.y) - 0.5 * g * T * T) / T; }
      } else if (wallLive()) { ball.vx = -34 * fs(); ball.vy = -30 * fs(); arcadeOn(); }
      else { ball.vx = (-22 - Math.random() * 6) * fk(); ball.vy = -36 * fs(); }
      mood('round', 1400); wake();
    }
    function stepBall(f) {
      if (!ball || ball.drag || ball.rest) return;
      var u = BW / rect.width, hr = hero.getBoundingClientRect(), r = ball.r, arcade = ball.mode === 'arcade';
      var xmin = (hr.left - rect.left) * u + r, xmax = Math.min(WALLX - r, (hr.right - rect.left) * u - r), ymin = (hr.top - rect.top) * u + r, ground = BH - r;
      if (arcade) ymin = Math.max(ymin, (WALL.y - 420) * fk());
      var px = ball.x, py = ball.y;
      if (arcade) {
        if (!wallLive()) { ball.mode = 'gravity'; arcade = false; }
        else { var v = Math.hypot(ball.vx, ball.vy), want = 46 * fs(); if (v < want * 0.8 || v > want * 1.5) { ball.vx *= want / v; ball.vy *= want / v; } }
      }
      if (!arcade) ball.vy += 2.4 * f;
      ball.x += ball.vx * f; ball.y += ball.vy * f;
      var bounce = arcade ? 1 : 0.55;
      if (ball.x < xmin) { ball.x = xmin; ball.vx = Math.abs(ball.vx) * bounce; } else if (ball.x > xmax) { ball.x = xmax; ball.vx = -Math.abs(ball.vx) * bounce; }
      if (ball.y < ymin) { ball.y = ymin; ball.vy = Math.abs(ball.vy) * (arcade ? 1 : 0.5); }
      if (arcade && Math.abs(ball.vy) < 6 * fs()) ball.vy += (ball.vy < 0 ? -1 : 1) * 4;          // never a flat shuttle across the court
      var hoop = accRoot.querySelector('[data-prop="hoop"]');
      if (hoop) {
        var h = hoopGeo();
        if (ball.vy > 0 && py <= h.ry && ball.y > h.ry && Math.abs(ball.x - h.rx) < h.rr - 25) score(hoop);
        else [h.rx - h.rr, h.rx + h.rr].forEach(function (ex) {          // the two ends of the rim: a point the ball bounces off
          var dx = ball.x - ex, dy = ball.y - h.ry, d = Math.hypot(dx, dy), rr = r * 0.75;
          if (d < rr && d > 0) { var nx1 = dx / d, ny1 = dy / d, dot = ball.vx * nx1 + ball.vy * ny1; if (dot < 0) { ball.vx -= 1.5 * dot * nx1; ball.vy -= 1.5 * dot * ny1; ball.vx *= 0.7; ball.vy *= 0.7; } ball.x = ex + nx1 * rr; ball.y = h.ry + ny1 * rr; }
        });
        if (ball.y > h.by0 - r && ball.x + r > h.bx0 && ball.x - r < h.bx1) {                // the board and the pole are a wall, whichever side the ball is on
          if (px >= h.bx1) { ball.x = h.bx1 + r; ball.vx = Math.abs(ball.vx) * 0.5; } else if (px <= h.bx0) { ball.x = h.bx0 - r; ball.vx = -Math.abs(ball.vx) * 0.5; }
        }
      }
      var caps = accRoot.querySelectorAll('[data-prop^="keycap"],[data-prop="brick"]'), left = 0, hit = false;
      caps.forEach(function (cap) {
        if (cap.classList.contains('is-gone')) return; left++;
        if (hit) return;
        var cx0 = parseFloat(cap.style.left) / 100 * BW, cy0 = parseFloat(cap.style.top) / 100 * BH, cw = parseFloat(cap.style.width) / 100 * BW, ch = parseFloat(cap.style.height) / 100 * BH;
        if (ball.x + r > cx0 && ball.x - r < cx0 + cw && ball.y + r > cy0 && ball.y - r < cy0 + ch) {
          var brick = cap.getAttribute('data-prop') === 'brick';
          smash(cap, brick); click(); left--; hit = true;
          if (brick) {                                                    // reflect off the side that was hit
            var ox = Math.min(ball.x + r - cx0, cx0 + cw - (ball.x - r)), oy = Math.min(ball.y + r - cy0, cy0 + ch - (ball.y - r));
            if (ox < oy) { ball.vx = -ball.vx; ball.x += ball.vx > 0 ? ox : -ox; } else { ball.vy = -ball.vy; ball.y += ball.vy > 0 ? oy : -oy; }
          } else { ball.vy = -Math.abs(ball.vy) * 0.5 - 5; ball.vx *= 0.85; }
          if (brick) goalText(left ? left + ' LEFT' : 'CLEAR!');
          if (brick && left) say(t('home.status.left', { n: left }));
          if (!left && caps.length > 1) { burst(brick ? 40 : 20); hopAll(); if (brick) clearedWall(); }
        }
      });
      if (ball.y > ground) { ball.y = ground; ball.vy = -Math.abs(ball.vy) * (arcade ? 1 : 0.5); if (!arcade) { ball.vx *= 0.94; if (Math.abs(ball.vy) < 3) ball.vy = 0; } }
      ball.ang += ball.vx * f / r * 57.3;
      if (!arcade && ball.y >= ground - 0.5 && ball.vy === 0 && Math.abs(ball.vx) < 0.35) { ball.vx = 0; ball.rest = true; }
      placeBall();
    }
    function score(hoop) {
      scoreN++; var sc = hoop.querySelector('.score'); sc.textContent = '+' + scoreN;
      hoop.classList.remove('is-scored'); void hoop.offsetWidth; hoop.classList.add('is-scored');
      ball.vx *= 0.25; mood('star', 1000); hopAll(); if (scoreN % 3 === 0) burst(24); say(t('home.status.score', { n: scoreN }));
    }
    function goalText(s) { var g = accRoot.querySelector('[data-prop="goal"] .goal'); if (g) { g.textContent = s; replay(g.parentNode, 'pop'); } }
    function clearedWall() {
      ball.mode = 'gravity'; mood('star', 2000); say(t('home.status.clear'));
      setTimeout(function () { var bricks = accRoot.querySelectorAll('[data-prop="brick"]'); bricks.forEach(function (b, i) { setTimeout(function () { b.classList.remove('is-gone'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }, i * 40); }); goalText(bricks.length + ' LEFT'); }, 2400);
    }
    // things the rabbit can be fed: drag them to its mouth
    function setupFeed() {
      accRoot.querySelectorAll('[data-prop="coffee"],[data-prop="icecream"]').forEach(function (el) {
        var home = [el.style.left, el.style.top], drag = false, gx = 0, gy = 0, moved = false; el.classList.add('carry');
        el.addEventListener('pointerdown', function (e) {
          e.preventDefault(); e.stopPropagation(); interacted = true; measure(); drag = true; moved = false; cursorState('grab');
          try { el.setPointerCapture(e.pointerId); } catch (_) { }
          var r = el.getBoundingClientRect(); gx = e.clientX - r.left; gy = e.clientY - r.top;
        });
        el.addEventListener('pointermove', function (e) {
          if (!drag) return; if (!moved) { moved = true; el.classList.add('is-carried'); }
          el.style.left = (e.clientX - gx - rect.left) / rect.width * 100 + '%'; el.style.top = (e.clientY - gy - rect.top) / rect.height * 100 + '%'; wake();
        });
        function up(e) {
          if (!drag) return; drag = false; cursorState('');
          if (moved) {
            var mx = rect.left + rect.width * 0.386, my = rect.top + rect.height * 0.45;      // the mouth
            if (e.type === 'pointerup' && Math.hypot(e.clientX - mx, e.clientY - my) < rect.width * 0.15) { REACT[el.getAttribute('data-prop')](el, true); hopAll(); }
            el.classList.remove('is-carried'); el.style.left = home[0]; el.style.top = home[1]; el.__fed = true; wake();
          }
        }
        el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
      });
    }

    // ---------- props that react ----------
    function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
    [accRoot, backRoot].forEach(function (rt) { rt.addEventListener('animationend', function (e) { if (e.animationName === 'pop') e.target.classList.remove('pop'); }); });
    var REACT = {
      keycap: function (el) { replay(el, 'is-pressed'); click(); }, brick: function (el) { REACT.keycap(el); },
      ball: function () { if (ball && performance.now() - ball.threwAt > 400 && (ball.rest || ball.y > BH - ball.r * 1.5)) shootBall(); },
      coffee: function (el, fed) { if (el.__fed && !fed) { el.__fed = false; return; } replay(el, 'is-steaming'); mood('arc', 900); },
      mp3: function (el) { playRhythm(el); },
      headphones: function (el) { playRhythm(accRoot.querySelector('[data-prop="mp3"]') || el); mood('happy', 2000); },
      monitor: function (el) { replay(el, 'is-flickering'); click(); },
      cactus: function (el) { replay(el, 'is-swaying'); },
      bubble: function (el) { var tx = el.querySelector('.bubble-text'), words = ['ㅋㅋ', '헐', '진짜?', 'ㅇㅇ', '!!']; tx.textContent = words[(words.indexOf(tx.textContent) + 1) % words.length]; replay(el, 'pop'); },
      bang: function () { hopAll(); mood('round', 700); },
      sun: function (el) { replay(el, 'is-spinning'); mood('happy', 900); },
      monocle: function (el) { replay(el, 'is-dropping'); mood('round', 900); },
      magnifier: function () { var e = byId[13]; e.big = e.big === 1 ? 1.7 : 1; e.el.classList.toggle('is-big', e.big !== 1); wake(); },
      friend: function (el) { mood('heart', 900); replay(el, 'is-hopping'); pts.forEach(function (p) { p.vy -= 12; }); wake(); },
      mirror: function () { mood('arc', 900); },
      popper: function (el) { replay(el, 'pop'); burst(28); hopAll(); pts.forEach(function (p) { p.vx += (Math.random() - 0.5) * 40; p.vy -= 20 + Math.random() * 20; }); wake(); },
      diploma: function (el) { replay(el, 'is-unrolling'); },
      halo: function (el) { replay(el, 'is-glowing'); mood('happy', 1200); },
      icecream: function (el, fed) { if (el.__fed && !fed) { el.__fed = false; return; } var b = (+el.getAttribute('data-bites') || 0) + 1; if (b > 3) { b = 0; } el.setAttribute('data-bites', b); mood('happy', 600); },
      candle: function (el) { el.classList.toggle('is-out'); mood(el.classList.contains('is-out') ? 'round' : 'arc', 800); },
      propeller: function (el) { replay(el, 'is-spinning'); mood('squeeze', 900); hopAll(); },
      clover: function (el) { replay(el, 'is-spinning'); mood('star', 900); pts.forEach(function (p) { p.vy -= 14; }); wake(); },
      saturn: function (el) { replay(el, 'is-tilting'); pts.forEach(function (p) { if (p.orbit) p.orbit.w *= -1; }); wake(); },
      stagelight: function (el) { replay(el, 'is-swinging'); mood('round', 800); },
      neonsign: function (el) { el.classList.toggle('is-off'); click(); }
    };
    function smash(cap, keep) {
      if (cap.classList.contains('is-gone')) return;
      cap.classList.add('is-gone'); cap.classList.remove('pop');
      var x = parseFloat(cap.style.left) / 100 * BW + X0 - 80, y = parseFloat(cap.style.top) / 100 * BH + Y0 - 120;
      accRoot.insertAdjacentHTML('beforeend', svg('shards', x, y, 360, 360, '<g class="shard" fill="' + TXT + '" opacity=".9"><polygon points="60,200 120,150 130,230"/><polygon points="250,120 310,160 260,210"/><polygon points="160,60 220,40 200,120"/><polygon points="220,260 280,230 290,300"/></g>', 6));
      var sh = accRoot.lastElementChild; if (!keep) mood('round', 700);
      setTimeout(function () { sh.remove(); }, 900);
      if (!keep) setTimeout(function () { cap.classList.remove('is-gone'); replay(cap, 'pop'); }, 3200);
    }
    [accRoot, backRoot].forEach(function (rt) {
      rt.addEventListener('click', function (e) { var el = e.target.closest('.ac.hit'); if (!el) return; interacted = true; var name = el.getAttribute('data-prop'), fn = REACT[name] || (name.indexOf('keycap') === 0 && REACT.keycap); if (fn) fn(el); });
      rt.addEventListener('pointerover', function (e) { if (e.target.closest('.ac.hit')) cursorState('tap'); });
      rt.addEventListener('pointerout', function (e) { if (e.target.closest('.ac.hit')) cursorState(''); });
    });

    // ---------- the slot machine ----------
    var slot = document.getElementById('slot'), reel = document.getElementById('reel'), lever = document.getElementById('lever'), tierTag = document.getElementById('tier');
    var status = document.getElementById('hero-status'), go = document.getElementById('go');
    var current = null, lastReaction = null;
    function say(m) { if (status) status.textContent = m; }
    function tint(hex, dark) { var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); var to = dark ? 24 : 250; var mix = function (c) { return Math.round(c * 0.14 + to * 0.86); }; return 'rgb(' + mix(r) + ',' + mix(g) + ',' + mix(b) + ')'; }
    function wordSpan(entry) {
      var c = PAL[entry.hue]; var sp = document.createElement('span'); sp.className = 'word'; sp.style.color = c.text;
      var w = document.createElement('span'); w.className = 'w'; w.textContent = entry.w; sp.appendChild(w);
      var d = document.createElement('span'); d.className = 'dot' + (DOTS[entry.dot] ? ' dot--icon' : ''); if (DOTS[entry.dot]) d.innerHTML = DOTS[entry.dot]; else d.textContent = entry.dot || '.'; sp.appendChild(d);
      return sp;
    }
    function fixWidth() {
      if (!slot) return;
      var probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px'; slot.appendChild(probe);
      var max = 0; WORDS.forEach(function (e) { var sp = wordSpan(e); probe.appendChild(sp); max = Math.max(max, sp.getBoundingClientRect().width); probe.removeChild(sp); });
      probe.remove(); slot.style.width = Math.ceil(max) + 'px';
    }
    function hangKeyring(on) {
      if (!lever) return; var k = lever.querySelector('.keyring'); if (k) k.remove();
      var copy = lever.closest('.copy'); if (copy) copy.classList.toggle('has-keyring', !!on);
      if (!on) return;
      lever.insertAdjacentHTML('beforeend', KEYRING); k = lever.querySelector('.keyring');
      k.addEventListener('click', function (e) { e.stopPropagation(); click(); replay(k, 'is-pressed'); mood('happy', 500); });
      k.addEventListener('pointerenter', function (e) { e.stopPropagation(); cursorState('tap'); }); k.addEventListener('pointerleave', function () { cursorState('pull'); });
    }
    function applyWord(entry, animate) {
      current = entry; var c = PAL[entry.hue], dark = entry.theme === 'cyber';
      var html = document.documentElement, faceWas = html.getAttribute('data-face') || '';
      html.style.setProperty('--word', c.text); html.style.setProperty('--rabbit', c.rabbit); html.style.setProperty('--slot-bg', tint(c.rabbit, dark));
      if (entry.theme) html.setAttribute('data-theme', entry.theme); else html.removeAttribute('data-theme');
      if (entry.font) html.setAttribute('data-face', entry.font); else html.removeAttribute('data-face');
      if ((entry.font || '') !== faceWas) fixWidth();
      eyeMood = entry.eyes || null; earMood = entry.ears || null; byId[13].big = 1; byId[13].el.classList.remove('is-big');
      if (rhythm) { clearInterval(rhythm); rhythm = 0; ptRoot.classList.remove('is-playing'); }
      accRoot.querySelectorAll('.ac').forEach(function (a) { a.remove(); }); backRoot.querySelectorAll('.ac').forEach(function (a) { a.remove(); });
      accRoot.insertAdjacentHTML('beforeend', entry.acc.map(function (k) { return ACC[k] ? ACC[k]() : ''; }).join(''));
      accRoot.querySelectorAll('[data-back]').forEach(function (a) { backRoot.appendChild(a); });
      accRoot.setAttribute('data-tier', entry.tier); if (slot) slot.setAttribute('data-tier', entry.tier);
      if (tierTag) { var rare = entry.tier === 'rare' || entry.tier === 'epic'; tierTag.hidden = !rare; tierTag.textContent = entry.tier; tierTag.setAttribute('data-tier', entry.tier); }
      hangKeyring(entry.acc.indexOf('keyring') >= 0);
      followers = []; accRoot.querySelectorAll('[data-follow]').forEach(function (el) { var p = byId[+el.getAttribute('data-follow')]; if (p) { el.style.transformOrigin = el.getAttribute('data-origin'); followers.push({ el: el, p: p }); } });
      clearInterval(cheerTimer); cheerUntil = 0; if (entry.idle === 'cheer' && !reduce) cheerTimer = setInterval(function () { if (heroSeen) { cheerUntil = performance.now() + 900; wake(); } }, 2800);
      setupParticles(entry); setupBall(); setupFeed();
      if (animate) { accRoot.querySelectorAll('.ac').forEach(function (a, i) { a.style.animationDelay = (i * 40) + 'ms'; a.classList.add('pop'); }); backRoot.querySelectorAll('.ac').forEach(function (a) { a.classList.add('pop'); }); }
      if (go) { var pr = PRODUCT[entry.product]; if (pr) { go.querySelector('.go__t').textContent = t(pr.key); go.querySelector('img').src = pr.icon; go.querySelector('img').alt = pr.name; go.href = pr.href; go.hidden = false; go.classList.remove('pop'); if (animate) { void go.offsetWidth; go.classList.add('pop'); } } else go.hidden = true; }
      try { sessionStorage.setItem('nm-word', entry.w); } catch (_) { }
      found(entry.w);
      say(t('home.status.word', { w: entry.w })); wake();
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
      var opts = ['dizzy', 'wave', 'flap', 'hop'].filter(function (r) { return r !== lastReaction; });
      reaction = lastReaction = opts[(Math.random() * opts.length) | 0];
      if (reaction === 'wave' && !reduce) { var i = 0; waveTimer = setInterval(function () { poke(letters[i++ % letters.length], true); }, 110); }
      wake();
      var seq = [current || WORDS[0]]; var n = reduce ? 4 : 18;
      for (var j = 0; j < n; j++) seq.push(WORDS[(Math.random() * WORDS.length) | 0]);
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
      clearInterval(waveTimer); spinning = false; reaction = null;
      applyWord(next, true);
      if (next.tier === 'common') poke();
      else if (next.tier === 'uncommon') { poke(); hopAll(); }
      else if (next.tier === 'rare') { burst(18); hopAll(); mood('star', 1100); poke(); }
      else { burst(40); hopAll(); mood('star', 1800); setTimeout(hopAll, 260); setTimeout(hopAll, 520); poke(); }
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

    // ---------- the collection: every word drawn so far, the rest as ??? ----------
    var foundSet = {}; try { (JSON.parse(localStorage.getItem('nm-found') || '[]')).forEach(function (w) { foundSet[w] = 1; }); } catch (_) { }
    var wordsBtn = document.getElementById('words-btn'), wordsDlg = document.getElementById('words'), wordsGrid = document.getElementById('words-grid'), wordsCount = document.getElementById('words-count');
    function foundN() { return WORDS.filter(function (e) { return foundSet[e.w]; }).length; }
    function found(w) { if (foundSet[w]) { renderWords(); return; } foundSet[w] = 1; try { localStorage.setItem('nm-found', JSON.stringify(Object.keys(foundSet))); } catch (_) { } renderWords(); }
    function renderWords() {
      var n = foundN();
      if (wordsBtn) wordsBtn.textContent = t('home.words', { n: n, t: WORDS.length });
      if (wordsCount) wordsCount.textContent = n + ' / ' + WORDS.length;
      if (!wordsGrid) return; wordsGrid.textContent = '';
      TIERS.forEach(function (tier) {
        var row = document.createElement('div'); row.className = 'words__row'; row.setAttribute('data-tier', tier);
        var h = document.createElement('p'); h.className = 'words__tier'; h.textContent = tier; row.appendChild(h);
        var ul = document.createElement('ul'); ul.className = 'words__list';
        WORDS.filter(function (e) { return e.tier === tier; }).forEach(function (e) {
          var li = document.createElement('li');
          if (foundSet[e.w]) { var b = document.createElement('button'); b.type = 'button'; b.className = 'wd' + (current === e ? ' is-now' : ''); b.style.color = PAL[e.hue].text; b.textContent = e.w; b.addEventListener('click', function () { wordsDlg.close(); if (current !== e) spin(e); }); li.appendChild(b); }
          else { li.className = 'wd wd--unknown'; li.textContent = '???'; }
          ul.appendChild(li);
        });
        row.appendChild(ul); wordsGrid.appendChild(row);
      });
    }
    if (wordsBtn && wordsDlg) {
      wordsBtn.addEventListener('click', function () { renderWords(); wordsDlg.showModal(); });
      wordsDlg.addEventListener('click', function (e) { if (e.target === wordsDlg || e.target.closest('.words__close')) wordsDlg.close(); });
    }

    var saved = null; try { saved = sessionStorage.getItem('nm-word'); } catch (_) { }
    var initial = WORDS.filter(function (e) { return e.w === saved; })[0] || WORDS[0];
    if (slot && reel) {
      fixWidth(); addEventListener('resize', fixWidth);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fixWidth);
      reel.textContent = ''; reel.appendChild(wordSpan(initial));
    }
    applyWord(initial, false);
    if (narrowMQ.addEventListener) narrowMQ.addEventListener('change', function () { if (current) applyWord(current, false); });

    // keyboard access: hidden buttons for the rabbit and each letter
    var kb = document.getElementById('hero-keys');
    function buildKeys() {
      if (!kb) return; kb.textContent = '';
      var rb = document.createElement('button'); rb.type = 'button'; rb.textContent = t('home.rabbit.action'); rb.addEventListener('click', function () { poke(); }); kb.appendChild(rb);
      letters.forEach(function (p) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t('home.letter.action', { n: NAME[p.id] }); b.addEventListener('click', function () { poke(p); }); kb.appendChild(b); });
    }
    buildKeys();
    window.addEventListener('nm:langchange', function () { buildKeys(); renderWords(); if (current && go && !go.hidden) go.querySelector('.go__t').textContent = t(PRODUCT[current.product].key); });

    root.__nm = { spin: spin, poke: poke, words: WORDS, set: function (w) { var e = WORDS.filter(function (x) { return x.w === w; })[0]; if (e) spin(e); }, setNow: function (w) { var e = WORDS.filter(function (x) { return x.w === w; })[0]; if (e) { reel.textContent = ''; reel.appendChild(wordSpan(e)); applyWord(e, true); } },
      throwBall: function (vx, vy) { if (ball) { ball.rest = false; ball.vx = vx; ball.vy = vy; if (wallLive()) arcadeOn(); wake(); } }, shoot: function () { if (ball) shootBall(); }, ball: function () { return ball ? { x: Math.round(ball.x), y: Math.round(ball.y), rest: ball.rest, score: scoreN, mode: ball.mode } : null; },
      mood: mood, eyes: function () { return eyesNow; }, particles: function () { return pts.map(function (p) { return [Math.round(p.x), Math.round(p.y)]; }); },
      cursor: function (x, y, s) { curOn = true; cur && cur.classList.add('is-on'); curX = curTX = x; curY = curTY = y; cursorState(s || ''); wake(); },
      stats: function () { return { word: current && current.w, tier: current && current.tier, agitate: +agitate.toFixed(2), spinning: spinning, reaction: reaction, away: away ? NAME[away.id] : null, rendering: !!raf, go: go ? !go.hidden : null, found: foundN() }; } };
    window.NewMeansHero = root.__nm;
  }
  function auto() { document.querySelectorAll('[data-nm-hero]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
