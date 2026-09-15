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
      "home.status.clear": "키캡 전부 부숨",
      "home.status.left": "키캡 {n}개 남음",
      "home.words": "단어 {n}/{t}",
      "home.words.title": "모은 단어",
      "home.words.close": "닫기",
      "home.typer.kind": "게임 · iOS / Android",
      "home.typer.desc": "키캡을 부수는\n손맛과 타건음",
      "home.typer.sub": "아무 키나 누르면 시작되는 한 판. 키캡이 부서질 때마다 타건음.",
      "typer.desk.hint": "아무 키나 누르기, 또는 화면을 끌어서 조준",
      "typer.desk.broken": "부순 키캡 {n}",
      "typer.desk.over": "게임 오버",
      "typer.item.bomb": "Bomb", "typer.item.bomb.d": "범위 폭파",
      "typer.item.drill": "Drill", "typer.item.drill.d": "관통",
      "typer.item.cat": "Cat Hand", "typer.item.cat.d": "고양이 손이 공을 쳐줌",
      "typer.item.aim": "Aim Line", "typer.item.aim.d": "반사 예측 조준선 3턴",
      "typer.loop.title": "드래그로 조준, 손 떼면 발사",
      "typer.loop.1": "드래그로 조준", "typer.loop.1.d": "손 떼면 공 발사",
      "typer.loop.2": "키캡 파괴", "typer.loop.2.d": "숫자만큼 맞히면 부서지고, 닿을 때마다 타건음",
      "typer.loop.3": "한 칸씩 내려오는 줄", "typer.loop.3.d": "턴이 끝나면 새 줄. 바닥선에 닿으면 게임오버",
      "typer.items.title": "아이템 4종",
      "typer.custom.sub": "능력치가 아니라 감각을 바꾸는 아이템. 스위치마다 타건음이 다르다.",
      "typer.num.dl": "다운로드", "typer.num.rating": "평균 평점", "typer.num.countries": "출시 국가", "typer.num.langs": "리뷰 언어",
      "typer.num.note": "전부 오가닉, 유료 마케팅 0원",
      "typer.story": "\"이 벽돌깨기에 타건음을 입히면 어떨까?\"라는 농담에서 시작해 지금은 전 세계 스토어에 있는 게임",
      "home.dopa.lab": "말풍선을 짚거나 한 줄 써보기",
      "dopa.how.title": "카톡 대화 하나로 시작",
      "dopa.how.1": "카카오톡에서 대화 내보내기", "dopa.how.1.d": "채팅방 메뉴의 대화 내보내기",
      "dopa.how.2": "dodae.me에 올리기", "dopa.how.2.d": "파일 하나면 준비 끝",
      "dopa.how.3": "AI 연구 보고서", "dopa.how.3.d": "말투와 성향을 읽은 웃긴 보고서",
      "dopa.unique.title": "정해진 유형 없음",
      "dopa.unique.sub": "2,000명이 하면 2,000개의 결과. 아래 2,000개 도형도 같은 것이 없다.",
      "dopa.tests.title": "지금 할 수 있는 테스트",
      "dopa.tests.more": "같은 AI 분석 엔진 위에 새 테마의 테스트가 계속 추가되는 중",
      "dopa.open": "dodae.me에서 열기",
      "home.typer.more": "키보드 골라보기",
      "home.dopa.kind": "카카오톡 대화로 하는 AI 심리테스트",
      "home.dopa.desc": "내 카톡으로 보는\n나의 다른 모습",
      "home.dopa.sub": "말풍선을 짚으면 읽히는 대화. 2,000명이 하면 2,000개의 결과.",
      "home.dopa.more": "테스트 둘러보기",
      "home.studio.lead": "게임 하나와 AI 서비스 하나를 직접 만들고 운영하는 2인 스튜디오",
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
      "home.status.clear": "All keycaps smashed",
      "home.status.left": "{n} keycaps left",
      "home.words": "Words {n}/{t}",
      "home.words.title": "Words found",
      "home.words.close": "Close",
      "home.typer.kind": "Game · iOS / Android",
      "home.typer.desc": "Smash keycaps.\nHear every hit.",
      "home.typer.sub": "Press any key to start a round. Every keycap that breaks plays a switch.",
      "typer.desk.hint": "Press any key, or drag on the screen to aim",
      "typer.desk.broken": "{n} keycaps smashed",
      "typer.desk.over": "Game over",
      "typer.item.bomb": "Bomb", "typer.item.bomb.d": "Blast the area",
      "typer.item.drill": "Drill", "typer.item.drill.d": "Pierce through",
      "typer.item.cat": "Cat Hand", "typer.item.cat.d": "A paw bats the ball back",
      "typer.item.aim": "Aim Line", "typer.item.aim.d": "Bounce prediction for 3 turns",
      "typer.loop.title": "Drag to aim, release to fire",
      "typer.loop.1": "Drag to aim", "typer.loop.1.d": "Release to launch the balls",
      "typer.loop.2": "Break keycaps", "typer.loop.2.d": "As many hits as the number. Every hit plays a switch",
      "typer.loop.3": "Rows come down", "typer.loop.3.d": "A new row each turn. Touch the line and it's over",
      "typer.items.title": "Four items",
      "typer.custom.sub": "Items that change the feel, not the stats. Every switch sounds different.",
      "typer.num.dl": "Downloads", "typer.num.rating": "Average rating", "typer.num.countries": "Countries", "typer.num.langs": "Review languages",
      "typer.num.note": "All organic, zero paid marketing",
      "typer.story": "A game that started as a joke, \"what if this brick breaker made keyboard sounds?\", and is now on stores worldwide",
      "home.dopa.lab": "Point at a bubble, or write a line",
      "dopa.how.title": "One chat export is all it takes",
      "dopa.how.1": "Export a KakaoTalk chat", "dopa.how.1.d": "From the chat room menu",
      "dopa.how.2": "Upload it at dodae.me", "dopa.how.2.d": "One file and you are set",
      "dopa.how.3": "An AI research report", "dopa.how.3.d": "A funny report on how you talk and who you are",
      "dopa.unique.title": "No fixed types",
      "dopa.unique.sub": "2,000 people, 2,000 different results. None of the 2,000 shapes below repeat either.",
      "dopa.tests.title": "Tests you can take now",
      "dopa.tests.more": "New themed tests keep arriving on the same AI engine",
      "dopa.open": "Open at dodae.me",
      "home.typer.more": "Find your keyboard",
      "home.dopa.kind": "AI personality tests from your chats",
      "home.dopa.desc": "Your chats.\nAnother side of you.",
      "home.dopa.sub": "Point at a bubble and it gets read. 2,000 people, 2,000 different results.",
      "home.dopa.more": "Explore the tests",
      "home.studio.lead": "A two-person studio that builds and runs one game and one AI service",
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
