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
      "foot.note": "Made in Seoul."
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
      "foot.note": "Made in Seoul."
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
