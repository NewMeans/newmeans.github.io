/* NewMeans — lightweight i18n (KO/EN)
 * Text lives here; markup carries data-i18n="key".
 * For attributes, add data-i18n-attr="content|aria-label" alongside data-i18n.
 * Other scripts read strings via window.i18n.t(key) and listen for the
 * "nm:langchange" event to refresh anything set dynamically. */
(function () {
  "use strict";

  var STRINGS = {
    ko: {
      "meta.title": "NewMeans — 서울의 2인 스튜디오",
      "meta.description": "NewMeans는 게임과 AI 서비스를 직접 만들고 운영하는 서울의 2인 스튜디오입니다.",
      "nav.skip": "본문으로 건너뛰기",
      "nav.works": "제품",
      "nav.studio": "스튜디오",
      "sound.enable": "소리 켜기",
      "sound.disable": "소리 끄기",
      "hero.eyebrow": "서울의 2인 스튜디오",
      "hero.title": "우리가 만들고 싶은 건, 사람들이 즐겁게 쓰는 제품입니다.",
      "hero.lead": "서울의 두 사람이 게임과 AI 서비스를 직접 만들고 운영합니다.",
      "hero.ctaWorks": "제품 보기",
      "hero.ctaStudio": "스튜디오",
      "hero.signature": "Signature · 눌러보세요",
      "hero.hint": "화면의 키보드를 눌러보세요. 소리는 오른쪽 위에서 켤 수 있어요.",
      "how.kicker": "우리가 일하는 방식",
      "how.title": "작은 팀이 할 수 있는 걸, 끝까지 합니다.",
      "how.p1": "두 사람이 기획하고, 개발하고, 디자인하고, 운영합니다. 만들고 싶은 걸 직접 만들어 세상에 내놓고, 사용자 반응을 보며 고쳐 나갑니다.",
      "how.p2": "게임이든 AI 서비스든, 결은 달라도 목표는 같습니다. 사람들이 즐겁게 쓰는 것.",
      "how.p3": "Typer는 5년 전 나눈 농담 하나에서 시작했어요. “이 벽돌깨기에 타건음을 입히면 어떨까?” 그 농담이 지금은 전 세계 스토어에 있습니다.",
      "works.kicker": "제품 / 01",
      "works.title": "지금 만들고 운영하는 것들",
      "works.typer.chip": "게임 · iOS / Android",
      "works.typer.desc": "기계식 키보드 소리로 즐기는 타건음 게임. 부수고, 듣고, 꾸미는 재미.",
      "works.dopa.chip": "AI · Web",
      "works.dopa.name": "도파민대학교",
      "works.dopa.desc": "세상의 모든 즐거움을 연구하는 AI 심리테스트. 대화를 넣으면 AI가 분석 보고서를 써줍니다.",
      "works.metricsCap": "Typer · 유료 마케팅 없이",
      "works.m1": "오가닉 다운로드",
      "works.m2": "평균 평점",
      "works.m3": "출시 국가",
      "works.m4": "리뷰 언어권",
      "studio.kicker": "스튜디오 / 02",
      "studio.title": "두 사람이 만듭니다",
      "studio.lead": "게임 클라이언트 개발자와 AI 엔지니어. 기획·개발·디자인·운영을 나눠 맡아, 작은 팀이 낼 수 있는 최대 속도로 만듭니다.",
      "studio.role1": "기획 · 클라이언트 개발 · 디자인 · 운영",
      "studio.role2": "AI · 풀스택 · 빌드/배포 · QA 자동화",
      "foot.note": "Made in Seoul.",
      "nav.backHome": "← NewMeans",
      "crumb.works": "제품",
      "works.more": "자세히",
      "typer.meta.title": "Typer — NewMeans",
      "typer.meta.description": "Typer는 기계식 키보드 소리를 중심에 둔 감각형 캐주얼 게임입니다. NewMeans 제작.",
      "typer.eyebrow": "게임 · iOS / Android",
      "typer.tagline": "부수고, 듣고, 꾸미는 재미.",
      "typer.lead": "기계식 키보드 소리를 중심에 둔 감각형 캐주얼 게임. 화면 속 키보드를 눌러보세요.",
      "typer.hint": "키보드를 눌러보세요. 오른쪽 위에서 소리를 켤 수 있어요.",
      "typer.metricsCap": "유료 마케팅 없이",
      "typer.m1": "오가닉 다운로드",
      "typer.m2": "평균 평점",
      "typer.m3": "출시 국가",
      "typer.m4": "리뷰 언어권",
      "typer.pillars.title": "부수고, 듣고, 꾸미고",
      "typer.p1.k": "부수고",
      "typer.p1.d": "숫자가 적힌 키캡 블록을 공으로 부숩니다. 짧고 부드러운 반복.",
      "typer.p2.k": "듣고",
      "typer.p2.d": "스위치마다 다른 타건음. 스위치는 외형이 아니라 ‘청각적 스킨’입니다.",
      "typer.p3.k": "꾸미고",
      "typer.p3.d": "키캡·프레임·모니터를 모아 나만의 책상을 만듭니다. 10만 가지가 넘는 조합.",
      "typer.gallery.title": "게임 속 풍경",
      "typer.foot.title": "설치하고, 스위치를 고르고, 나머지는 책상에 맡기세요.",
      "dopa.meta.title": "도파민대학교 — NewMeans",
      "dopa.meta.description": "도파민대학교는 대화를 분석해 연구 보고서를 써주는 AI 심리테스트 플랫폼입니다. NewMeans 제작.",
      "dopa.eyebrow": "AI · Web",
      "dopa.tagline": "세상의 모든 즐거움을 연구합니다.",
      "dopa.lead": "AI 초개인화 심리테스트 플랫폼. 대화를 넣으면 AI가 당신에 대한 연구 보고서를 써줍니다.",
      "dopa.cta": "dodae.me 에서 시작하기",
      "dopa.what.title": "무엇을 하나요",
      "dopa.what.p1": "대표 콘텐츠는 ‘에겐-테토 테스트’. 카카오톡 대화를 올리면 참여자 각자의 성향을 분석해 웃긴 연구 보고서를 만들어 줍니다.",
      "dopa.what.p2": "MBTI처럼 정해진 유형이 아니라, 참여한 사람 수만큼 다른 결과가 나옵니다. 2,000명이 하면 2,000개의 결과.",
      "dopa.what.p3": "체인소맨 같은 IP 테스트로 연구 범위를 계속 넓혀 가고 있어요.",
      "dopa.foot.title": "당신에 대한 연구가 지금 시작됩니다."
    },
    en: {
      "meta.title": "NewMeans — a two-person studio in Seoul",
      "meta.description": "NewMeans is a two-person studio in Seoul building and running our own games and AI services.",
      "nav.skip": "Skip to content",
      "nav.works": "Works",
      "nav.studio": "Studio",
      "sound.enable": "Turn sound on",
      "sound.disable": "Turn sound off",
      "hero.eyebrow": "A two-person studio in Seoul",
      "hero.title": "What we want to make are products people enjoy using.",
      "hero.lead": "Two people in Seoul, building and running our own games and AI services.",
      "hero.ctaWorks": "See our work",
      "hero.ctaStudio": "About the studio",
      "hero.signature": "Signature · type it",
      "hero.hint": "Tap the keyboard on screen. Turn sound on at the top right.",
      "how.kicker": "How we work",
      "how.title": "A small team that takes things all the way.",
      "how.p1": "The two of us plan, build, design, and run everything. We make what we want to make, ship it, and keep fixing it as people use it.",
      "how.p2": "A game or an AI service — different on the surface, same goal underneath: something people enjoy using.",
      "how.p3": "Typer began as a joke five years ago: “what if this brick-breaker made mechanical-keyboard sounds?” That joke is now on stores worldwide.",
      "works.kicker": "Works / 01",
      "works.title": "What we're building and running",
      "works.typer.chip": "Game · iOS / Android",
      "works.typer.desc": "A tactile game built on mechanical-keyboard sound. Break, listen, customize.",
      "works.dopa.chip": "AI · Web",
      "works.dopa.name": "Dopamine University",
      "works.dopa.desc": "An AI personality-test service. Feed it a chat and the AI writes you a report.",
      "works.metricsCap": "Typer · with zero paid marketing",
      "works.m1": "organic downloads",
      "works.m2": "average rating",
      "works.m3": "countries",
      "works.m4": "review languages",
      "studio.kicker": "Studio / 02",
      "studio.title": "Made by two people",
      "studio.lead": "A game-client developer and an AI engineer. We split planning, code, design, and operations, and move as fast as two people can.",
      "studio.role1": "Product · client dev · design · operations",
      "studio.role2": "AI · full-stack · build/deploy · QA automation",
      "foot.note": "Made in Seoul.",
      "nav.backHome": "← NewMeans",
      "crumb.works": "Works",
      "works.more": "Details",
      "typer.meta.title": "Typer — NewMeans",
      "typer.meta.description": "Typer is a tactile casual game built around mechanical-keyboard sound. Made by NewMeans.",
      "typer.eyebrow": "Game · iOS / Android",
      "typer.tagline": "Break. Listen. Customize.",
      "typer.lead": "A tactile casual game built around mechanical-keyboard sound. Tap the keyboard on screen.",
      "typer.hint": "Tap the keyboard. Turn sound on at the top right.",
      "typer.metricsCap": "with zero paid marketing",
      "typer.m1": "organic downloads",
      "typer.m2": "average rating",
      "typer.m3": "countries",
      "typer.m4": "review languages",
      "typer.pillars.title": "Break, listen, customize",
      "typer.p1.k": "Break",
      "typer.p1.d": "Smash numbered keycap blocks with a bounce of balls. Short, smooth loops.",
      "typer.p2.k": "Listen",
      "typer.p2.d": "Every switch sounds different. A switch isn't a look, it's an audio skin.",
      "typer.p3.k": "Customize",
      "typer.p3.d": "Collect keycaps, frames, and monitors to build your own desk. 100,000+ combinations.",
      "typer.gallery.title": "Inside the game",
      "typer.foot.title": "Install it, pick a switch, and let the desk do the rest.",
      "dopa.meta.title": "Dopamine University — NewMeans",
      "dopa.meta.description": "Dopamine University is an AI personality-test platform that turns a chat into a research report. Made by NewMeans.",
      "dopa.eyebrow": "AI · Web",
      "dopa.tagline": "We study every kind of fun.",
      "dopa.lead": "An AI hyper-personalized personality-test platform. Feed it a chat and the AI writes a research report about you.",
      "dopa.cta": "Start at dodae.me",
      "dopa.what.title": "What it does",
      "dopa.what.p1": "The flagship is the egen–teto test. Upload a KakaoTalk chat and it analyzes each participant and writes a comedic research report.",
      "dopa.what.p2": "No fixed types like MBTI — you get as many results as there are people. 2,000 players, 2,000 results.",
      "dopa.what.p3": "It keeps expanding its research with IP tests like Chainsaw Man.",
      "dopa.foot.title": "The research into you starts now."
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
