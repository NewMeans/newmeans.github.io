/* NewMeans i18n (KO/EN). Text lives here; markup carries data-i18n="key" (data-i18n-attr for attributes).
 * Scripts read strings via window.i18n.t(key) and listen for "nm:langchange". */
(function () {
  "use strict";
  var STRINGS = {
    ko: {
      "meta.title": "NewMeans: 게임과 AI 서비스",
      "meta.description": "게임 Typer와 AI 심리테스트 도파민대학교를 만드는 2인 스튜디오, 뉴민스.",
      "nav.skip": "본문으로 건너뛰기",
      "nav.works": "제품",
      "nav.studio": "스튜디오",
      "home.mail": "메일 보내기",
      "home.lever": "단어 다시 뽑기",
      "home.cta1": "제품 보기",
      "home.rabbit.action": "토끼 쓰다듬기",
      "home.letter.action": "글자 {n} 튀기기",
      "home.status.word": "단어: {w}",
      "home.status.grab": "글자 {n} 잡음",
      "home.status.letter": "글자 {n}",
      "home.status.score": "골 {n}",
      "home.status.clear": "키캡 전부 부숨",
      "home.status.left": "키캡 {n}개 남음",
      "home.words": "단어 {n}/{t}",
      "home.words.title": "모은 단어",
      "home.words.close": "닫기",

      "tag.game": "Game", "tag.mobile": "Mobile", "tag.aitest": "AI 심리테스트", "tag.web": "Web",
      "cta.more": "자세히 보기", "cta.download": "다운로드", "cta.start": "테스트 시작하기", "cta.replay": "다시 보기",
      "scene.typer": "공이 키캡을 튀며 Typer를 친다",
      "scene.dopa": "테스트 하나를 고르면 써지는 보고서",
      "studio.line": "게임 클라이언트 개발자 한 명, AI 엔지니어 한 명",
      "foot.privacy": "개인정보 처리방침",

      "typer.meta.title": "Typer: 기계식 키보드 타건음 아케이드",
      "typer.meta.description": "키캡을 부수며 타건음을 듣는 벽돌깨기 게임. 스위치와 키캡을 바꾸고 책상을 꾸며보세요.",
      "typer.nav.play": "플레이", "typer.nav.get": "다운로드",
      "typer.group.keycap": "키캡", "typer.group.frame": "프레임", "typer.group.monitor": "모니터", "typer.group.switch": "스위치", "typer.group.sculpture": "오브제", "typer.group.ball": "볼",
      "typer.sound.on": "소리 끄기", "typer.sound.off": "소리 켜기",
      "typer.desk.hint": "아무 키나 누르기, 또는 화면을 끌어서 조준",
      "typer.desk.broken": "부순 키캡 {n}",
      "typer.desk.over": "게임 오버",
      "typer.num.dl": "다운로드", "typer.num.rating": "평균 평점", "typer.num.countries": "출시 국가", "typer.num.langs": "리뷰 언어",
      "typer.review.1": "There's cute music and the keyboard sounds are really satisfying.", "typer.review.1.meta": "App Store · English", "typer.review.1.ko": "음악이 귀엽고 키보드 소리가 정말 만족스러워요",
      "typer.review.2": "종료해도 이어서할 수 있어서 시간날때 계속하게 됨", "typer.review.2.meta": "Google Play · 한국어",
      "typer.review.3": "キーボード好きには最高に至高のゲーム。", "typer.review.3.meta": "Google Play · 日本語", "typer.review.3.ko": "키보드 좋아하는 사람에게는 최고의 게임",
      "typer.review.4": "super relaxant mieux que mon apex pro tkl", "typer.review.4.meta": "App Store · Français", "typer.review.4.ko": "정말 편안하고, 내 Apex Pro TKL보다 낫다",
      "typer.review.5": "기계식 키보드의 키캡을 교체하고 축을 바꾸는 게임이라니!", "typer.review.5.meta": "Google Play · 한국어",
      "typer.review.6": "Relaxing, challenging, an extremely addictive.", "typer.review.6.meta": "App Store · English", "typer.review.6.ko": "편안하고, 도전적이고, 엄청나게 중독적",
      "typer.review.7": "очень помогло мне во время панической атаки.", "typer.review.7.meta": "Google Play · Русский", "typer.review.7.ko": "공황 발작이 왔을 때 큰 도움이 됐어요",
      "typer.review.8": "色々な軸を集めるのが楽しかったです。", "typer.review.8.meta": "App Store · 日本語", "typer.review.8.ko": "여러 축을 모으는 게 즐거웠어요",

      "dopa.meta.title": "도파민대학교: AI 심리테스트 플랫폼",
      "dopa.meta.description": "테마별 AI 심리테스트. 카카오톡 대화 하나로 AI가 쓰는 나만의 연구 보고서.",
      "dopa.here": "도파민대학교",
      "dopa.nav.how": "방법", "dopa.nav.tests": "테스트",
      "dopa.count.a": "명의 사람", "dopa.count.b": "개의 결과", "dopa.count.sr": "사람 수만큼의 결과",
      "dopa.fact": "테스트를 고르고 카카오톡 대화를 올리면 AI가 쓰는 연구 보고서",
      "dopa.how.1": "테스트 고르기", "dopa.how.2": "카카오톡 대화 올리기", "dopa.how.3": "AI 연구 보고서",
      "dopa.test.egen": "AI 에겐 테토 테스트", "dopa.test.campus": "AI 캠퍼스 리크루팅 테스트",
      "dopa.unique": "2,000명이면 2,000개의 결과. 이 도형 2,000개도 같은 것이 없음."
    },
    en: {
      "meta.title": "NewMeans: games and AI",
      "meta.description": "NewMeans is the two-person studio behind Typer, a keyboard-sound game, and Dopamine University, an AI personality test.",
      "nav.skip": "Skip to content",
      "nav.works": "Products",
      "nav.studio": "Studio",
      "home.mail": "Email us",
      "home.lever": "Spin the word",
      "home.cta1": "See products",
      "home.rabbit.action": "Pet the rabbit",
      "home.letter.action": "Bounce the letter {n}",
      "home.status.word": "Word: {w}",
      "home.status.grab": "Holding the letter {n}",
      "home.status.letter": "Letter {n}",
      "home.status.score": "Score {n}",
      "home.status.clear": "All keycaps smashed",
      "home.status.left": "{n} keycaps left",
      "home.words": "Words {n}/{t}",
      "home.words.title": "Words found",
      "home.words.close": "Close",

      "tag.game": "Game", "tag.mobile": "Mobile", "tag.aitest": "AI personality test", "tag.web": "Web",
      "cta.more": "Learn more", "cta.download": "Download", "cta.start": "Start a test", "cta.replay": "Replay",
      "scene.typer": "A ball bounces across keycaps and types Typer",
      "scene.dopa": "One test gets picked and a report writes itself",
      "studio.line": "One game client developer, one AI engineer",
      "foot.privacy": "Privacy",

      "typer.meta.title": "Typer: a mechanical-keyboard arcade",
      "typer.meta.description": "Break keycaps to the sound of mechanical switches. Customize your keyboard and desk in Typer.",
      "typer.nav.play": "Play", "typer.nav.get": "Download",
      "typer.group.keycap": "Keycaps", "typer.group.frame": "Frame", "typer.group.monitor": "Monitor", "typer.group.switch": "Switch", "typer.group.sculpture": "Object", "typer.group.ball": "Ball",
      "typer.sound.on": "Turn sound off", "typer.sound.off": "Turn sound on",
      "typer.desk.hint": "Press any key, or drag on the screen to aim",
      "typer.desk.broken": "{n} keycaps smashed",
      "typer.desk.over": "Game over",
      "typer.num.dl": "Downloads", "typer.num.rating": "Average rating", "typer.num.countries": "Countries", "typer.num.langs": "Review languages",
      "typer.review.1": "There's cute music and the keyboard sounds are really satisfying.", "typer.review.1.meta": "App Store · English",
      "typer.review.2": "종료해도 이어서할 수 있어서 시간날때 계속하게 됨", "typer.review.2.meta": "Google Play · Korean", "typer.review.2.ko": "You can pick up where you left off, so I keep coming back",
      "typer.review.3": "キーボード好きには最高に至高のゲーム。", "typer.review.3.meta": "Google Play · Japanese", "typer.review.3.ko": "The ultimate game for keyboard lovers",
      "typer.review.4": "super relaxant mieux que mon apex pro tkl", "typer.review.4.meta": "App Store · French", "typer.review.4.ko": "Super relaxing, better than my Apex Pro TKL",
      "typer.review.5": "기계식 키보드의 키캡을 교체하고 축을 바꾸는 게임이라니!", "typer.review.5.meta": "Google Play · Korean", "typer.review.5.ko": "A game about swapping keycaps and switches on a mechanical keyboard!",
      "typer.review.6": "Relaxing, challenging, an extremely addictive.", "typer.review.6.meta": "App Store · English",
      "typer.review.7": "очень помогло мне во время панической атаки.", "typer.review.7.meta": "Google Play · Russian", "typer.review.7.ko": "It helped me a lot during a panic attack",
      "typer.review.8": "色々な軸を集めるのが楽しかったです。", "typer.review.8.meta": "App Store · Japanese", "typer.review.8.ko": "Collecting all the different switches was fun",

      "dopa.meta.title": "Dopamine University: AI personality tests",
      "dopa.meta.description": "Themed AI personality tests. One chat export, one AI-written research report.",
      "dopa.here": "Dopamine University",
      "dopa.nav.how": "How", "dopa.nav.tests": "Tests",
      "dopa.count.a": "people", "dopa.count.b": "results", "dopa.count.sr": "As many results as there are people",
      "dopa.fact": "Pick a test, upload a KakaoTalk chat, and the AI writes a research report",
      "dopa.how.1": "Pick a test", "dopa.how.2": "Upload a KakaoTalk chat", "dopa.how.3": "AI research report",
      "dopa.test.egen": "AI Egen-Teto test", "dopa.test.campus": "AI campus recruiting test",
      "dopa.unique": "2,000 people, 2,000 results. None of these 2,000 shapes repeat either."
    }
  };

  var STORAGE_KEY = "nm-lang", SUPPORTED = ["ko", "en"];
  function detectLang() {
    try { var saved = window.localStorage.getItem(STORAGE_KEY); if (saved && SUPPORTED.indexOf(saved) !== -1) return saved; } catch (e) { }
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("ko") === 0 ? "ko" : "en";
  }
  var current = detectLang();
  function has(key) { var table = STRINGS[current] || STRINGS.en; return table[key] != null || STRINGS.en[key] != null; }
  function t(key) { var table = STRINGS[current] || STRINGS.en; return table[key] != null ? table[key] : (STRINGS.en[key] != null ? STRINGS.en[key] : key); }
  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    current = lang;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { }
    document.documentElement.setAttribute("lang", lang);
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], key = el.getAttribute("data-i18n"), attr = el.getAttribute("data-i18n-attr");
      if (el.hasAttribute("data-i18n-optional")) { if (!has(key)) { el.hidden = true; continue; } el.hidden = false; }
      var value = t(key);
      if (attr) el.setAttribute(attr, value); else el.textContent = value;
    }
    var buttons = document.querySelectorAll("[data-lang-set]");
    for (var j = 0; j < buttons.length; j++) { var btn = buttons[j], on = btn.getAttribute("data-lang-set") === lang; btn.classList.toggle("is-active", on); btn.setAttribute("aria-pressed", on ? "true" : "false"); }
    window.dispatchEvent(new CustomEvent("nm:langchange", { detail: { lang: lang } }));
  }
  function wireToggle() { var buttons = document.querySelectorAll("[data-lang-set]"); for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", function () { apply(this.getAttribute("data-lang-set")); }); }
  window.i18n = { t: t, has: has, lang: function () { return current; }, set: apply };
  function init() { wireToggle(); apply(current); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
