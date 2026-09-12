/* NewMeans — lightweight i18n (KO/EN)
 * Text lives here; markup carries data-i18n="key".
 * For attributes, add data-i18n-attr="content|aria-label" alongside data-i18n.
 * Other scripts read strings via window.i18n.t(key) and listen for the
 * "nm:langchange" event to refresh anything set dynamically. */
(function () {
  "use strict";

  var STRINGS = {
    ko: {
      "home.rabbit.hint": "글자를 끌거나 토끼를 눌러보세요.",
      "home.rabbit.action": "토끼 반응 보기",
      "home.keyboard.hint": "키를 눌러 Blue 스위치 소리를 들어보세요.",
      "sound.listen": "소리 듣기",
      "sound.error": "소리를 재생하지 못했습니다. 다시 눌러주세요.",
      "typer.try": "타건음 들어보기",
      "typer.custom.theme": "책상 조합",
      "typer.custom.details": "세부 설정",
      "meta.title": "NewMeans — 게임과 AI를 만드는 2인 스튜디오",
      "meta.description": "게임 Typer와 AI 심리테스트 도파민대학교를 만드는 2인 스튜디오, 뉴민스.",
      "nav.skip": "본문으로 건너뛰기",
      "nav.works": "제품",
      "nav.studio": "스튜디오",
      "nav.backHome": "← NewMeans",
      "home.tag": "게임과 AI를 만드는 2인 스튜디오",
      "home.cta1": "제품 보기",
      "home.cta2": "문의하기",
      "home.typer.kind": "게임 · iOS / Android",
      "home.typer.desc": "키캡을 부수며 타건음을 듣는 벽돌깨기 게임. 모은 코인으로 키보드와 책상을 꾸밀 수 있습니다.",
      "home.typer.more": "Typer 보기",
      "home.dopa.kind": "AI 심리테스트 · Web",
      "home.dopa.desc": "카카오톡 대화를 바탕으로 참여자별 성향을 분석하는 심리테스트.",
      "home.dopa.more": "도파민대학교 보기",
      "home.studio.title": "스튜디오",
      "home.studio.lead": "게임 개발자와 AI 엔지니어, 두 사람.",
      "home.studio.p1": "기획부터 개발, 디자인, 운영까지 직접 합니다.",
      "home.studio.p2": "Typer는 “벽돌깨기에 타건음을 입히면 어떨까”라는 아이디어에서 시작했습니다.",
      "home.role1.n": "클라이언트 · 게임",
      "home.role1.d": "기획 · 게임 개발 · 디자인 · 운영",
      "home.role2.n": "AI · 서버",
      "home.role2.d": "AI · 풀스택 · 빌드/배포 · QA 자동화",
      "foot.say": "게임과 AI를 만드는 2인 스튜디오",
      "foot.products": "제품",
      "foot.dopa": "도파민대학교",
      "foot.contact": "연락",
      "sound.enable": "소리 켜기",
      "sound.disable": "소리 끄기",
      "typer.meta.title": "Typer — 기계식 키보드 타건음 아케이드",
      "typer.meta.description": "키캡을 부수며 타건음을 듣는 벽돌깨기 게임. 스위치와 키캡을 바꾸고 책상을 꾸며보세요.",
      "typer.tagline": "키캡을 부수는 벽돌깨기.",
      "typer.lead": "공이 키캡에 부딪힐 때마다 기계식 키보드 소리가 납니다. 모은 코인으로 스위치와 키캡을 바꾸고 책상을 꾸며보세요.",
      "typer.custom.title": "키보드 바꿔보기",
      "typer.custom.lead": "게임 속 키캡과 스위치입니다. 키를 눌러 소리를 들어보세요.",
      "typer.custom.switch": "스위치",
      "typer.custom.keycap": "키캡",
      "typer.custom.frame": "프레임",
      "typer.custom.monitor": "모니터",
      "typer.gallery.title": "게임 화면",
      "typer.cta.title": "App Store와 Google Play에서 무료",
      "typer.cta.sub": "iOS · Android · 4개 언어 지원",
      "dopa.meta.title": "도파민대학교 — 대화를 분석하는 AI 심리테스트",
      "dopa.meta.description": "카카오톡 대화를 분석해 심리 리포트를 써주는 AI 심리테스트 플랫폼. NewMeans 제작.",
      "dopa.here": "도파민대학교",
      "dopa.hero.t1": "카카오톡 대화로",
      "dopa.hero.t2": "알아보는 내 성향.",
      "dopa.lead": "대화 파일을 올리면 AI가 참여자별 성향을 분석해 리포트로 정리합니다.",
      "dopa.cta": "dodae.me에서 시작하기",
      "dopa.what.title": "에겐-테토 테스트",
      "dopa.prof.teto.label": "테토 · TETO",
      "dopa.prof.teto.name": "테토 교수",
      "dopa.prof.teto.desc": "직진 · 주도 · 에너지",
      "dopa.prof.egen.label": "에겐 · EGEN",
      "dopa.prof.egen.name": "에겐 교수",
      "dopa.prof.egen.desc": "섬세 · 공감 · 사색",
      "dopa.what.note": "에겐·테토 성향을 카카오톡 대화로 알아보는 테스트. 참여자마다 다른 리포트를 제공합니다.",
      "dopa.test.title": "나는 에겐? 테토?",
      "dopa.test.sub": "세 질문에 답하는 짧은 체험입니다. 대화 파일을 분석하는 정식 테스트와는 다릅니다.",
      "dopa.test.retry": "다시 하기",
      "dopa.test.full": "정식 테스트 하러 가기",
      "dopa.test.resultTeaser": "선택한 답변으로 계산한 체험 결과입니다. 정식 테스트는 카카오톡 대화를 분석합니다.",
      "dopa.foot.title": "내 대화로 테스트하기",
      "dopa.foot.sub": "카카오톡 대화 파일을 준비해주세요."
    },
    en: {
      "home.rabbit.hint": "Drag a letter or tap the rabbit.",
      "home.rabbit.action": "Make the rabbit react",
      "home.keyboard.hint": "Press a key to hear the Blue switch.",
      "sound.listen": "Listen",
      "sound.error": "Audio could not play. Please try again.",
      "typer.try": "Try the switch sounds",
      "typer.custom.theme": "Desk presets",
      "typer.custom.details": "More options",
      "meta.title": "NewMeans — a two-person games & AI studio",
      "meta.description": "NewMeans is the two-person studio behind Typer, a keyboard-sound game, and Dopamine University, an AI psych test.",
      "nav.skip": "Skip to content",
      "nav.works": "Products",
      "nav.studio": "Studio",
      "nav.backHome": "← NewMeans",
      "home.tag": "A two-person studio making games & AI",
      "home.cta1": "See products",
      "home.cta2": "Contact",
      "home.typer.kind": "Game · iOS / Android",
      "home.typer.desc": "A brick breaker with mechanical keyboard sounds. Break keycaps and spend your coins on your keyboard and desk.",
      "home.typer.more": "See Typer",
      "home.dopa.kind": "AI psych test · Web",
      "home.dopa.desc": "A personality test that analyzes each participant’s messages in a KakaoTalk chat.",
      "home.dopa.more": "See Dopamine University",
      "home.studio.title": "Studio",
      "home.studio.lead": "A game developer and an AI engineer.",
      "home.studio.p1": "We plan, build, design, and run our products ourselves.",
      "home.studio.p2": "Typer started with a question: what would a brick breaker sound like with mechanical keyboard switches?",
      "home.role1.n": "Client · Games",
      "home.role1.d": "Product · game dev · design · ops",
      "home.role2.n": "AI · Backend",
      "home.role2.d": "AI · full-stack · build/deploy · QA automation",
      "foot.say": "A two-person studio making games & AI",
      "foot.products": "Products",
      "foot.dopa": "Dopamine University",
      "foot.contact": "Contact",
      "sound.enable": "Turn sound on",
      "sound.disable": "Turn sound off",
      "typer.meta.title": "Typer — a mechanical-keyboard arcade",
      "typer.meta.description": "Break keycaps to the sound of mechanical switches. Customize your keyboard and desk in Typer.",
      "typer.tagline": "A brick breaker made of keycaps.",
      "typer.lead": "Every hit sounds like a mechanical keyboard. Spend your coins on switches, keycaps, and decorations for your desk.",
      "typer.custom.title": "Try a different keyboard",
      "typer.custom.lead": "Keycaps and switches from the game. Press a key to hear it.",
      "typer.custom.switch": "Switch",
      "typer.custom.keycap": "Keycaps",
      "typer.custom.frame": "Frame",
      "typer.custom.monitor": "Monitor",
      "typer.gallery.title": "In-game screens",
      "typer.cta.title": "Free on the App Store and Google Play",
      "typer.cta.sub": "iOS · Android · 4 languages",
      "dopa.meta.title": "Dopamine University — an AI psych test that reads your chats",
      "dopa.meta.description": "An AI psych-test platform that turns a KakaoTalk chat into a personal report. Made by NewMeans.",
      "dopa.here": "Dopamine University",
      "dopa.hero.t1": "Your personality,",
      "dopa.hero.t2": "through your chats.",
      "dopa.lead": "Upload a KakaoTalk chat file. AI analyzes each participant’s messages and puts their traits into a report.",
      "dopa.cta": "Start at dodae.me",
      "dopa.what.title": "The Egen–Teto test",
      "dopa.prof.teto.label": "Teto · TETO",
      "dopa.prof.teto.name": "Prof. Teto",
      "dopa.prof.teto.desc": "Driven · bold · high-energy",
      "dopa.prof.egen.label": "Egen · EGEN",
      "dopa.prof.egen.name": "Prof. Egen",
      "dopa.prof.egen.desc": "Sensitive · warm · reflective",
      "dopa.what.note": "Explore Egen and Teto traits through your KakaoTalk conversations, with a separate report for each participant.",
      "dopa.test.title": "Egen or Teto?",
      "dopa.test.sub": "A short, three-question activity. The full test analyzes a chat file instead.",
      "dopa.test.retry": "Try again",
      "dopa.test.full": "Take the full test",
      "dopa.test.resultTeaser": "This result is calculated from your answers. The full test analyzes your KakaoTalk conversations.",
      "dopa.foot.title": "Try it with your chats",
      "dopa.foot.sub": "Have your KakaoTalk chat file ready."
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
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    }

    // Reflect active state on the language toggle.
    var buttons = document.querySelectorAll("[data-lang-set]");
    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      var isActive = btn.getAttribute("data-lang-set") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    // Let dynamic scripts (sound label, etc.) refresh.
    window.dispatchEvent(new CustomEvent("nm:langchange", { detail: { lang: lang } }));
  }

  function wireToggle() {
    var buttons = document.querySelectorAll("[data-lang-set]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang-set"));
      });
    }
  }

  window.i18n = { t: t, lang: function () { return current; }, set: apply };

  function init() {
    wireToggle();
    apply(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
