/* NewMeans — lightweight i18n (KO/EN)
 * Text lives here; markup carries data-i18n="key".
 * For attributes, add data-i18n-attr="content|aria-label" alongside data-i18n.
 * Other scripts read strings via window.i18n.t(key) and listen for the
 * "nm:langchange" event to refresh anything set dynamically. */
(function () {
  "use strict";

  var STRINGS = {
    ko: {
      "meta.title": "NewMeans — 게임과 AI를 만드는 2인 스튜디오",
      "meta.description": "감각적이고 재밌는 디지털 경험. 게임 Typer와 AI 심리테스트 도파민대학교를 만드는 2인 스튜디오 뉴민스.",
      "nav.skip": "본문으로 건너뛰기",
      "nav.works": "제품",
      "nav.studio": "스튜디오",
      "nav.backHome": "← NewMeans",
      "home.h1a1": "키보드 소리로 노는 ",
      "home.h1a2": "게임",
      "home.h1a3": ",",
      "home.h1b1": "대화를 읽는 ",
      "home.h1b2": "AI",
      "home.h1b3": ".",
      "home.sub": "기획부터 운영까지 직접 하는 2인 스튜디오, 뉴민스.",
      "home.cta1": "제품 보기",
      "home.cta2": "문의하기",
      "home.sig.hint": "글자 드래그 가능",
      "home.works.title": "제품",
      "home.typer.kind": "게임 · iOS / Android",
      "home.typer.desc": "기계식 키보드 타건음 아케이드. 공으로 키캡 블록을 부수고, 스위치로 소리를 바꾸고, 코인으로 책상을 꾸미는 게임.",
      "home.typer.proof": "다운로드 30,000+ · 평점 4.74 · 유료 마케팅 없이",
      "home.typer.more": "Typer 보기",
      "home.dopa.kind": "AI 심리테스트 · Web",
      "home.dopa.desc": "카카오톡 대화를 분석해 심리 리포트를 써주는 AI. 정해진 유형 없이, 2,000명이면 2,000개의 결과.",
      "home.dopa.more": "도파민대학교 보기",
      "home.dopa.who": "카카오톡 대화",
      "home.dopa.tag": "AI 분석 중",
      "home.dopa.m1": "나 요즘 자꾸 밤에 폰만 봐 ㅠ",
      "home.dopa.m2": "오 그거 도파민 신호일지도?",
      "home.dopa.result": "분석 완료 · 자극 추구형",
      "home.dopa.resultSub": "AI 심리 리포트 생성됨",
      "home.studio.title": "스튜디오",
      "home.studio.lead1": "한 명은 게임, 한 명은 AI.",
      "home.studio.lead2": "나머지는 반반.",
      "home.studio.p1": "둘이서 기획부터 개발·디자인·운영까지 맡는 구조. 게임 클라이언트 개발자와 AI 엔지니어의 조합.",
      "home.studio.p2": "Typer는 “벽돌깨기에 타건음을 입히면 어떨까”라는 아이디어에서 시작해, 지금은 177개국에 출시된 게임.",
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
      "typer.meta.description": "기계식 키보드 타건음, 데스크 꾸미기, 브릭브레이커를 하나로 묶은 하이브리드 캐주얼 게임. NewMeans 제작.",
      "typer.tagline": "부수고, 듣고, 꾸미는 재미.",
      "typer.lead": "기계식 키보드 타건음, 데스크 꾸미기, 브릭브레이커를 하나로 묶은 하이브리드 캐주얼 게임.",
      "typer.proof": "다운로드 30,000+ · 평점 4.74 · 177개국 출시",
      "typer.hint": "키보드 클릭 시 타건음 재생 · 우측 상단에서 소리 켜기",
      "typer.play.title": "웹에서 바로 플레이",
      "typer.play.lead": "실제 게임과 같은 규칙의 라이트 버전. 블록을 부술 때마다 장착한 스위치의 타건음.",
      "typer.play.r1": "드래그로 조준",
      "typer.play.r2": "손을 놓으면 발사",
      "typer.play.r3": "초록 불빛 수집 시 공 +1",
      "typer.custom.title": "내 책상 만들기",
      "typer.custom.lead": "게임에 들어 있는 실제 아이템으로 조합하는 데스크. 스위치를 바꾸면 위 게임의 타건음도 함께 변경.",
      "typer.custom.switch": "스위치",
      "typer.custom.switchNote": "클릭 시 실제 타건음",
      "typer.custom.keycap": "키캡",
      "typer.custom.frame": "프레임",
      "typer.custom.monitor": "모니터",
      "typer.m1": "오가닉 다운로드",
      "typer.m2": "평균 평점",
      "typer.m3": "출시 국가",
      "typer.m4": "리뷰 언어",
      "typer.pillars.title": "부수고, 듣고, 꾸미고",
      "typer.p1.k": "부수고",
      "typer.p1.d": "공으로 숫자 키캡을 부수는 한 판. 블록 체력은 생성 레벨과 동일.",
      "typer.p2.k": "듣고",
      "typer.p2.d": "스위치 7종의 서로 다른 타건음. 외형이 아니라 소리를 갈아 끼우는 스킨.",
      "typer.p3.k": "꾸미고",
      "typer.p3.d": "볼·오브제·모니터·프레임·스위치·키캡, 6개 카테고리의 데스크테리어.",
      "typer.gallery.title": "게임 화면",
      "typer.cta.title": "App Store와 Google Play에서 무료",
      "typer.cta.sub": "iOS · Android · 4개 언어 지원",
      "dopa.meta.title": "도파민대학교 — 대화를 분석하는 AI 심리테스트",
      "dopa.meta.description": "카카오톡 대화를 분석해 심리 리포트를 써주는 AI 심리테스트 플랫폼. NewMeans 제작.",
      "dopa.here": "도파민대학교",
      "dopa.hero.t1": "대화를 넣으면,",
      "dopa.hero.t2": "당신을 연구하는 AI.",
      "dopa.lead": "카카오톡 대화를 분석해 나만의 심리 리포트를 써주는 초개인화 심리테스트 플랫폼.",
      "dopa.cta": "dodae.me에서 시작하기",
      "dopa.chat.who": "카카오톡 대화",
      "dopa.chat.tag": "AI 분석 중",
      "dopa.chat.m1": "나 사실 요즘 좀 지쳤어",
      "dopa.chat.m2": "헐 무슨 일 있어?? 😥",
      "dopa.chat.m3": "아니 그냥… 다 귀찮아 ㅎㅎ",
      "dopa.report.title": "분석 완료 · 에겐 성향",
      "dopa.report.sub": "AI 심리 리포트 생성됨",
      "dopa.report.left": "에겐 74%",
      "dopa.report.right": "테토 26%",
      "dopa.what.title": "에겐-테토 테스트",
      "dopa.prof.teto.label": "테토 · TETO",
      "dopa.prof.teto.name": "테토 교수",
      "dopa.prof.teto.desc": "직진 · 주도 · 에너지",
      "dopa.prof.egen.label": "에겐 · EGEN",
      "dopa.prof.egen.name": "에겐 교수",
      "dopa.prof.egen.desc": "섬세 · 공감 · 사색",
      "dopa.what.note": "카카오톡 대화를 올리면 참여자별 성향을 분석해 만드는 연구 보고서. MBTI 같은 고정 유형 없이, 2,000명이면 2,000개의 결과.",
      "dopa.test.title": "나는 에겐? 테토?",
      "dopa.test.sub": "3문항 미리보기. 정식 테스트는 AI가 대화를 직접 분석.",
      "dopa.test.retry": "다시 하기",
      "dopa.test.full": "정식 테스트 하러 가기",
      "dopa.test.resultTeaser": "미리보기 결과. 정식 리포트는 AI가 대화를 읽고 훨씬 자세하게.",
      "dopa.platform.t1": "하나의 테스트가 아니라,",
      "dopa.platform.t2": "계속 늘어나는 플랫폼.",
      "dopa.platform.p": "에겐-테토를 시작으로 계속 추가되는 테마별 캐릭터 심리테스트. 전부 같은 AI 분석 엔진 위에서 구동.",
      "dopa.foot.title": "당신에 대한 연구, 지금 시작.",
      "dopa.foot.sub": "대화 업로드 후 나머지는 AI의 몫."
    },
    en: {
      "meta.title": "NewMeans — a two-person games & AI studio",
      "meta.description": "Sensory, playful digital experiences. NewMeans is the two-person studio behind Typer and Dopamine University.",
      "nav.skip": "Skip to content",
      "nav.works": "Products",
      "nav.studio": "Studio",
      "nav.backHome": "← NewMeans",
      "home.h1a1": "A ",
      "home.h1a2": "game",
      "home.h1a3": " played by sound,",
      "home.h1b1": "an ",
      "home.h1b2": "AI",
      "home.h1b3": " that reads your chats.",
      "home.sub": "NewMeans — a two-person studio, planning to ops, all in-house.",
      "home.cta1": "See products",
      "home.cta2": "Contact",
      "home.sig.hint": "draggable letters",
      "home.works.title": "Products",
      "home.typer.kind": "Game · iOS / Android",
      "home.typer.desc": "A mechanical-keyboard arcade. Break keycap blocks with balls, swap switches to change the sound, spend coins on your desk.",
      "home.typer.proof": "30,000+ downloads · 4.74★ · zero paid marketing",
      "home.typer.more": "See Typer",
      "home.dopa.kind": "AI psych test · Web",
      "home.dopa.desc": "An AI that reads a KakaoTalk chat and writes a psych report. No fixed types — 2,000 people, 2,000 results.",
      "home.dopa.more": "See Dopamine University",
      "home.dopa.who": "KakaoTalk chat",
      "home.dopa.tag": "AI analyzing",
      "home.dopa.m1": "i keep scrolling my phone all night ㅠ",
      "home.dopa.m2": "ooh that might be a dopamine signal?",
      "home.dopa.result": "Done · Novelty-seeker",
      "home.dopa.resultSub": "AI report generated",
      "home.studio.title": "Studio",
      "home.studio.lead1": "One builds games, one builds AI.",
      "home.studio.lead2": "Everything else, split in half.",
      "home.studio.p1": "Two people covering planning, development, design, and ops — a game-client developer and an AI engineer.",
      "home.studio.p2": "Typer began with one idea — a brick-breaker with keyboard sounds — and is now live in 177 countries.",
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
      "typer.meta.description": "Mechanical-keyboard sound, desk decorating, and a brick-breaker in one hybrid-casual game. Made by NewMeans.",
      "typer.tagline": "Break. Listen. Customize.",
      "typer.lead": "Mechanical-keyboard sound, desk decorating, and a brick-breaker in one hybrid-casual game.",
      "typer.proof": "30,000+ downloads · 4.74 rating · live in 177 countries",
      "typer.hint": "Click the keyboard for switch sounds · sound toggle at top right",
      "typer.play.title": "Play it in the browser",
      "typer.play.lead": "A light build with the real rules. Every block hit plays your equipped switch.",
      "typer.play.r1": "Drag to aim",
      "typer.play.r2": "Release to fire",
      "typer.play.r3": "Green light = +1 ball",
      "typer.custom.title": "Build your desk",
      "typer.custom.lead": "Real in-game items, combined live. Switching the switch also changes the game's sound above.",
      "typer.custom.switch": "Switch",
      "typer.custom.switchNote": "click for the real sound",
      "typer.custom.keycap": "Keycaps",
      "typer.custom.frame": "Frame",
      "typer.custom.monitor": "Monitor",
      "typer.m1": "organic downloads",
      "typer.m2": "average rating",
      "typer.m3": "countries",
      "typer.m4": "review languages",
      "typer.pillars.title": "Break, listen, customize",
      "typer.p1.k": "Break",
      "typer.p1.d": "One run of smashing numbered keycaps. Block HP equals its spawn level.",
      "typer.p2.k": "Listen",
      "typer.p2.d": "Seven switches, seven different sounds. A skin for your ears, not your eyes.",
      "typer.p3.k": "Customize",
      "typer.p3.d": "Balls, objects, monitors, frames, switches, keycaps — six categories of deskterior.",
      "typer.gallery.title": "In-game screens",
      "typer.cta.title": "Free on the App Store and Google Play",
      "typer.cta.sub": "iOS · Android · 4 languages",
      "dopa.meta.title": "Dopamine University — an AI psych test that reads your chats",
      "dopa.meta.description": "An AI psych-test platform that turns a KakaoTalk chat into a personal report. Made by NewMeans.",
      "dopa.here": "Dopamine University",
      "dopa.hero.t1": "Drop in a chat,",
      "dopa.hero.t2": "an AI that studies you.",
      "dopa.lead": "A hyper-personalized psych-test platform that reads a KakaoTalk chat and writes your report.",
      "dopa.cta": "Start at dodae.me",
      "dopa.chat.who": "KakaoTalk chat",
      "dopa.chat.tag": "AI analyzing",
      "dopa.chat.m1": "honestly i've been drained lately",
      "dopa.chat.m2": "omg what happened?? 😥",
      "dopa.chat.m3": "nah just… over everything lol",
      "dopa.report.title": "Done · Egen-leaning",
      "dopa.report.sub": "AI psych report generated",
      "dopa.report.left": "Egen 74%",
      "dopa.report.right": "Teto 26%",
      "dopa.what.title": "The Egen–Teto test",
      "dopa.prof.teto.label": "Teto · TETO",
      "dopa.prof.teto.name": "Prof. Teto",
      "dopa.prof.teto.desc": "Driven · bold · high-energy",
      "dopa.prof.egen.label": "Egen · EGEN",
      "dopa.prof.egen.name": "Prof. Egen",
      "dopa.prof.egen.desc": "Sensitive · warm · reflective",
      "dopa.what.note": "A research report built from a KakaoTalk chat, one analysis per participant. No fixed types like MBTI — 2,000 people, 2,000 results.",
      "dopa.test.title": "Egen or Teto?",
      "dopa.test.sub": "A 3-question preview. The full test has AI read your actual chats.",
      "dopa.test.retry": "Try again",
      "dopa.test.full": "Take the full test",
      "dopa.test.resultTeaser": "A preview result. The full report: AI reading your chats, in far more depth.",
      "dopa.platform.t1": "Not one test —",
      "dopa.platform.t2": "a growing platform.",
      "dopa.platform.p": "Themed character tests added over time, starting with Egen–Teto. All on the same AI analysis engine.",
      "dopa.foot.title": "The research into you, starting now.",
      "dopa.foot.sub": "One chat upload — the rest, AI's job."
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
