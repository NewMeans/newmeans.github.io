# NewMeans

2인 스튜디오 **NewMeans**의 공식 웹사이트 (GitHub Pages).
게임 **Typer**와 AI 심리테스트 **도파민대학교(dodae.me)**를 만들고 운영합니다.

## 구조

- `index.html` — 홈. 살아 있는 토끼 로고와 단어 슬롯머신(히어로), Typer 장면(포털에서 나온 공이 키캡 다섯을 튀며 TYPER를 치고 다시 포털로), 도파민대학교 장면(글자 없는 테스트 타일과 보고서), 스튜디오 한 줄, 푸터 한 줄
- `typer.html`, `dopamine.html` — 제품 원페이지. Typer는 커스터마이저(게임 상점 부품 60개) → 보드 → 숫자 → 후기 → 화면 → 배지, 도파민대학교는 숫자 헤드라인 → 세 단계 → 테스트 → 도형 필드 → CTA
- `404.html` — 없는 페이지
- `base.css` — 디자인 시스템 토큰과 공용 컴포넌트 (`DESIGN_SYSTEM.md`)
- `home.css` — 홈 전용 스타일
- `hero.js` — 토끼(포인터 추종, 글자 끌기, 안절부절)와 단어 슬롯머신, 단어별 소품
- `keyboard.js` — Typer 키보드 컴포넌트와 타건음
- `scenes.js` — 홈 장면 둘과 도파민대학교 조각(GSAP ScrollTrigger: 고정 장면은 scrub, 카드 등장은 once, 카드 안 연출은 되감기지 않는 래칫), 숫자 뒤섞기
- `configurator.js` — Typer 커스터마이저. `assets/shop/catalog.json`(게임 상점 데이터에서 생성)만 읽는다
- `product.js`, `product.css` — 상점 카탈로그 로더, 스위치 소리, Typer 보드(키캡 블록 벽돌깨기, 드래그 조준), 기울어지는 카드, 2,000개 도형 필드. 홈과 제품 페이지가 같이 쓴다
- `i18n.js` — 한/영 문구 사전과 언어 토글 (localStorage 유지)
- `experience.js` — 스토어 배지 언어 처리
- `assets/brand/logo-pieces/` — 로고 조각 25개 (마스크로 칠해 어떤 색으로도 바뀜)
- `assets/fonts/` — SUIT(한글·UI·본문, OFL), Pally(헤더 전용, Fontshare ITF 무료 라이선스), Hahmlet 800 부분집합(도파민대학교 `개의 결과` 한 줄), DNF BitBit(워드마크·Typer 픽셀 숫자). 전부 자체 호스팅. GSAP는 jsDelivr CDN
- `assets/shop/` — 게임 상점 스프라이트와 `catalog.json` (Typer 프로젝트에서 읽기 전용으로 복사)
- `Typer/`, `insta/` — 앱스토어 / 인스타그램 리디렉트

## 계획 문서

- `DESIGN_PLAN.md` — 요구사항과 디자인 결정
- `DESIGN_SYSTEM.md` — 색·서체·형태·컴포넌트 토큰과 규칙
- `WORK_PLAN.md` — 작업 순서와 산출물
- `REFACTOR_PLAN.md` — 2026-09-15 히어로 아래 전면 리팩토링 계획 (홈 장면 2개, 푸터, Typer·도파민대학교 원페이지, GSAP 도입)

## 로컬 미리보기

```bash
python3 -m http.server 8765
# http://localhost:8765
```

오디오는 `file://`에서 CORS로 막히므로 반드시 HTTP로 확인하세요.

## 카피 수정

문구는 `i18n.js`의 `STRINGS.ko` / `STRINGS.en`에서 관리합니다. 마크업의
`data-i18n="키"` 속성과 사전의 키가 짝을 이룹니다. 홈 히어로의 영문 카피와
슬롯 단어는 `index.html`과 `hero.js`에 있습니다.

## 저장소 규칙

공개 저장소입니다. 외부 디자인 레퍼런스의 캡처·소스·사이트명은 `_local/`(무시됨)에만 두고
코드 주석, 에셋명, 커밋, PR에 쓰지 않습니다.
