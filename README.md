# NewMeans

2인 스튜디오 **NewMeans**의 공식 웹사이트 (GitHub Pages).
게임 **Typer**와 AI 심리테스트 **도파민대학교(dodae.me)**를 만들고 운영합니다.

## 구조

- `index.html` — 홈. 살아 있는 토끼 로고와 단어 슬롯머신(히어로), Typer 데스크, 도파민대학교 테스트, 스튜디오, 푸터
- `typer.html`, `dopamine.html` — 제품 페이지
- `404.html` — 없는 페이지
- `base.css` — 디자인 시스템 토큰과 공용 컴포넌트 (`DESIGN_SYSTEM.md`)
- `home.css` — 홈 전용 스타일
- `hero.js` — 토끼(포인터 추종, 글자 끌기, 안절부절)와 단어 슬롯머신, 단어별 소품
- `keyboard.js` — Typer 키보드 컴포넌트와 타건음
- `i18n.js` — 한/영 문구 사전과 언어 토글 (localStorage 유지)
- `experience.js` — 스토어 배지 언어 처리
- `assets/brand/logo-pieces/` — 로고 조각 25개 (마스크로 칠해 어떤 색으로도 바뀜)
- `assets/fonts/` — Bricolage Grotesque(OFL, 자체 호스팅), DNF BitBit. Wanted Sans는 CDN
- `Typer/`, `insta/` — 앱스토어 / 인스타그램 리디렉트

## 계획 문서

- `DESIGN_PLAN.md` — 요구사항과 디자인 결정
- `DESIGN_SYSTEM.md` — 색·서체·형태·컴포넌트 토큰과 규칙
- `WORK_PLAN.md` — 작업 순서와 산출물

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
