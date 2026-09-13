/* NewMeans — lightweight i18n (KO/EN)
 * Text lives here; markup carries data-i18n="key".
 * For attributes, add data-i18n-attr="content|aria-label|alt" alongside data-i18n.
 * Other scripts read strings via window.i18n.t(key) and listen for the
 * "nm:langchange" event to refresh anything set dynamically. */
(function () {
  "use strict";

  var STRINGS = {
    ko: {
      "meta.title": "NewMeans: 게임과 AI 서비스",
      "meta.description": "게임 Typer와 AI 심리테스트 도파민대학교를 만드는 2인 스튜디오, 뉴민스.",
      "nav.skip": "본문으로 건너뛰기",
      "nav.works": "제품",
      "nav.studio": "스튜디오",
      "nav.backHome": "← NewMeans",
      "home.mail": "메일 보내기",
      "home.lever": "단어 다시 뽑기",
      "home.cta1": "제품 보기",
      "home.cta2": "문의하기",
      "home.tag": "독립 게임과 AI 서비스",
      "home.rabbit.action": "토끼 쓰다듬기",
      "home.letter.action": "글자 {n} 튀기기",
      "home.status.word": "단어: {w}",
      "home.status.grab": "글자 {n} 잡음",
      "home.status.letter": "글자 {n}",
      "home.status.score": "골 {n}",
      "home.typer.kind": "게임 · iOS / Android",
      "home.typer.desc": "키캡을 부수는\n손맛과 타건음",
      "home.typer.sub": "공이 키캡을 부술 때마다 장착한 스위치의 타건음. 옆의 키보드를 눌러 스위치 7종을 들어볼 수 있다.",
      "home.typer.more": "키보드 골라보기",
      "home.dopa.kind": "카카오톡 대화로 하는 AI 심리테스트",
      "home.dopa.desc": "내 카톡으로 보는\n나의 다른 모습",
      "home.dopa.sub": "정해진 유형이 없는 AI 분석. 2,000명이 하면 2,000개의 결과.",
      "home.dopa.more": "테스트 둘러보기",
      "home.studio.title": "만드는 사람들",
      "home.studio.lead": "게임 개발자 한 명. AI 엔지니어 한 명.",
      "home.studio.p1": "Typer와 도파민대학교를 직접 만들고 운영하는 2인 스튜디오",
      "home.keyboard.hint": "키를 눌러 Blue 스위치 소리를 들어보세요.",
      "foot.say": "독립 게임과 AI 서비스",
      "foot.products": "제품",
      "foot.dopa": "도파민대학교",
      "foot.contact": "연락",
      "foot.privacy": "개인정보 처리방침",
      "foot.sleep": "잠든 토끼",
      "sound.ready": "키를 눌러보세요",
      "sound.on": "소리 켜짐",
      "sound.muted": "음소거",
      "sound.listen": "소리 듣기",
      "sound.enable": "소리 켜기",
      "sound.disable": "소리 끄기",
      "sound.error": "소리를 재생하지 못했습니다. 다시 눌러주세요.",
      "typer.meta.title": "Typer: 기계식 키보드 타건음 아케이드",
      "typer.meta.description": "키캡을 부수며 타건음을 듣는 벽돌깨기 게임. 스위치와 키캡을 바꾸고 책상을 꾸며보세요.",
      "typer.tagline": "키캡을 부수는\n손맛과 타건음",
      "typer.lead": "키캡에 부딪히는 공, 기계식 키보드 타건음. 모은 코인으로 바꾸는 스위치와 책상.",
      "typer.try": "타건음 들어보기",
      "typer.custom.title": "키보드 바꿔보기",
      "typer.custom.theme": "조합",
      "typer.custom.sound": "소리",
      "typer.custom.switch": "스위치",
      "typer.custom.keycap": "키캡",
      "typer.custom.frame": "프레임",
      "typer.custom.monitor": "모니터",
      "typer.gallery.title": "게임 화면",
      "typer.cta.title": "App Store와 Google Play에서 무료",
      "typer.cta.sub": "iOS · Android · 4개 언어 지원",
      "dopa.meta.title": "도파민대학교: AI 심리테스트 플랫폼",
      "dopa.meta.description": "에겐 테토부터 캠퍼스 리크루팅까지. 카카오톡 대화로 나와 우리를 알아보는 AI 심리테스트 플랫폼.",
      "dopa.here": "도파민대학교",
      "dopa.kind": "내 카톡에는\n어떤 내가 있을까?",
      "dopa.hero.t1": "AI 심리테스트",
      "dopa.hero.t2": "플랫폼.",
      "dopa.lead": "카카오톡 대화 속 나와 우리. 에겐·테토부터 캠퍼스 리크루팅까지.",
      "dopa.cta": "테스트 시작하기",
      "dopa.foot.sub": "카카오톡 대화 파일을 준비해주세요.",
      "dopa.test1.title": "AI 캠퍼스 리크루팅 테스트",
      "dopa.test1.label": "캠퍼스 리크루팅",
      "dopa.test2.title": "AI 에겐 테토 테스트",
      "dopa.test2.label": "테토박사와 에겐조교"
    },
    en: {
      "meta.title": "NewMeans: games and AI",
      "meta.description": "NewMeans is the two-person studio behind Typer, a keyboard-sound game, and Dopamine University, an AI personality test.",
      "nav.skip": "Skip to content",
      "nav.works": "Products",
      "nav.studio": "Studio",
      "nav.backHome": "← NewMeans",
      "home.mail": "Email us",
      "home.lever": "Spin the word",
      "home.cta1": "See products",
      "home.cta2": "Contact",
      "home.tag": "Independent games & AI",
      "home.rabbit.action": "Pet the rabbit",
      "home.letter.action": "Bounce the letter {n}",
      "home.status.word": "Word: {w}",
      "home.status.grab": "Holding the letter {n}",
      "home.status.letter": "Letter {n}",
      "home.status.score": "Score {n}",
      "home.typer.kind": "Game · iOS / Android",
      "home.typer.desc": "Smash keycaps.\nHear every hit.",
      "home.typer.sub": "Every keycap the ball breaks plays the switch you picked. Press the keyboard to hear all seven switches.",
      "home.typer.more": "Find your keyboard",
      "home.dopa.kind": "AI personality tests from your chats",
      "home.dopa.desc": "Your chats.\nAnother side of you.",
      "home.dopa.sub": "No fixed types. 2,000 people, 2,000 different results.",
      "home.dopa.more": "Explore the tests",
      "home.studio.title": "Behind NewMeans",
      "home.studio.lead": "One game developer. One AI engineer.",
      "home.studio.p1": "A two-person studio that builds and runs Typer and Dopamine University",
      "home.keyboard.hint": "Press a key to hear the Blue switch.",
      "foot.say": "Independent games & AI",
      "foot.products": "Products",
      "foot.dopa": "Dopamine University",
      "foot.contact": "Contact",
      "foot.privacy": "Privacy",
      "foot.sleep": "Sleeping rabbit",
      "sound.ready": "Press a key",
      "sound.on": "Sound on",
      "sound.muted": "Muted",
      "sound.listen": "Listen",
      "sound.enable": "Turn sound on",
      "sound.disable": "Turn sound off",
      "sound.error": "Audio could not play. Please try again.",
      "typer.meta.title": "Typer: a mechanical-keyboard arcade",
      "typer.meta.description": "Break keycaps to the sound of mechanical switches. Customize your keyboard and desk in Typer.",
      "typer.tagline": "Smash keycaps. Hear every hit.",
      "typer.lead": "Bouncing balls. Mechanical switches. Spend your coins on the keyboard and desk you want.",
      "typer.try": "Try the switch sounds",
      "typer.custom.title": "Try a different keyboard",
      "typer.custom.theme": "Presets",
      "typer.custom.sound": "Sound",
      "typer.custom.switch": "Switch",
      "typer.custom.keycap": "Keycaps",
      "typer.custom.frame": "Frame",
      "typer.custom.monitor": "Monitor",
      "typer.gallery.title": "In-game screens",
      "typer.cta.title": "Free on the App Store and Google Play",
      "typer.cta.sub": "iOS · Android · 4 languages",
      "dopa.meta.title": "Dopamine University: AI personality tests",
      "dopa.meta.description": "AI personality tests based on your KakaoTalk chats. From Egen–Teto traits to campus recruiting.",
      "dopa.here": "Dopamine University",
      "dopa.kind": "What do your chats\nsay about you?",
      "dopa.hero.t1": "AI personality",
      "dopa.hero.t2": "tests.",
      "dopa.lead": "You and your friends, through your KakaoTalk chats. From Egen–Teto to campus recruiting.",
      "dopa.cta": "Visit Dopamine University",
      "dopa.foot.sub": "Have your KakaoTalk chat file ready.",
      "dopa.test1.title": "AI campus recruiting test",
      "dopa.test1.label": "Campus recruiting",
      "dopa.test2.title": "AI Egen–Teto test",
      "dopa.test2.label": "The Egen–Teto lab"
    }
  };

  var STORAGE_KEY = "nm-lang";
  var SUPPORTED = ["ko", "en"];

  function detectLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("ko") === 0 ? "ko" : "en";
  }

  var current = detectLang();

  function t(key) {
    var table = STRINGS[current] || STRINGS.en;
    return table[key] != null ? table[key] : (STRINGS.en[key] != null ? STRINGS.en[key] : key);
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    current = lang;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    document.documentElement.setAttribute("lang", lang);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = t(el.getAttribute("data-i18n"));
      var attr = el.getAttribute("data-i18n-attr");
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    }
    var buttons = document.querySelectorAll("[data-lang-set]");
    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      var isActive = btn.getAttribute("data-lang-set") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
    window.dispatchEvent(new CustomEvent("nm:langchange", { detail: { lang: lang } }));
  }

  function wireToggle() {
    var buttons = document.querySelectorAll("[data-lang-set]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () { apply(this.getAttribute("data-lang-set")); });
    }
  }

  window.i18n = { t: t, lang: function () { return current; }, set: apply };

  function init() { wireToggle(); apply(current); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
