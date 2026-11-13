# NewMeans

2인 스튜디오 **NewMeans**의 공식 웹사이트 (GitHub Pages).
게임 **Typer**와 AI 심리테스트 **도파민대학교(dodae.me)**를 만들고 운영합니다.

## 구조

- `index.html` — 홈. 살아 있는 토끼 로고와 단어 슬롯머신(히어로), Typer 장면(포털에서 나온 공이 키캡 다섯을 튀며 TYPER를 치고 다시 포털로), 도파민대학교 장면(글자 없는 테스트 타일과 보고서), 스튜디오(CEO·CTO 토끼가 장애물을 넘으며 달린다), 푸터 한 줄
- `typer.html`, `dopamine.html` — 제품 원페이지. Typer는 커스터마이저(게임 상점 부품 60개) → 보드 → 숫자 → 후기 → 화면 → 하단 섹션, 도파민대학교는 도형이 쓰는 헤드라인 → 세 단계 → 테스트 → 하단 섹션. 하단 섹션은 그 페이지의 행동과 다른 제품으로 가는 카드
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
- `assets/fonts/` — SUIT(한글·UI·본문, OFL), Pally(헤더 전용, Fontshare ITF 무료 라이선스), DNF BitBit(워드마크·Typer 픽셀 숫자). 전부 자체 호스팅. GSAP는 jsDelivr CDN
- `assets/shop/` — 게임 상점 스프라이트와 `catalog.json` (Typer 프로젝트에서 읽기 전용으로 복사)
- `Typer/`, `insta/` — 앱스토어 / 인스타그램 리디렉트
- `MagicalDove/` — 게임 「매지컬 비둘기」의 약관, 처리방침, 환불, 확률, 공지, 문의 페이지와 그 영어판(`MagicalDove/en/`). 아래 '매지컬 비둘기 스토어 페이지'
- `_magical-dove/` — 위 페이지를 만드는 도구, 설정, 원문 사본과 영어 번역, 공지 원고(이름이 `_`로 시작해 게시되지 않음)

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

## 매지컬 비둘기 스토어 페이지

게임과 스토어 등록 정보가 직접 가리키는 주소. 기준 주소 `{사이트}`는 `https://newmeans.dev/MagicalDove`이고, 게임 빌드의
`VITE_SITE_URL`에 같은 값을 넣는다(https, 끝에 `/` 없이, 대소문자 그대로: GitHub Pages는 경로의 대소문자를 가림).

| 주소 | 내용 | 파일 |
|---|---|---|
| `{사이트}/terms` | 이용약관 | `MagicalDove/terms.html` (생성) |
| `{사이트}/privacy` | 개인정보 처리방침 | `MagicalDove/privacy.html` (생성) |
| `{사이트}/refund` | 유료 상품 및 환불 안내 | `MagicalDove/refund.html` (생성) |
| `{사이트}/probability` | 확률형 아이템 정보 | `MagicalDove/probability.html` (생성) |
| `{사이트}/notices` | 공지(게임 설정의 `공지` 버튼이 기기 브라우저로 엶) | `MagicalDove/notices.html` (생성) |
| `{사이트}/support` | 문의(App Store 지원 URL): 문의 메일과 위 네 문서 링크 | `MagicalDove/support.html` (생성) |
| `{사이트}/archive/<문서>-<버전>.html` | 개정 전 버전 | `MagicalDove/archive/` (생성) |
| `{사이트}/en/…` | 위 페이지마다 영어판(같은 이름, 예: `{사이트}/en/privacy`). App Store 영어 현지화의 개인정보 처리방침 URL과 지원 URL에 씀 | `MagicalDove/en/` (생성) |
| `https://newmeans.dev/app-ads.txt` | AdMob 인증 줄. 도메인 루트의 기존 파일에 줄을 더함 | `app-ads.txt` |

(생성)은 `_magical-dove/pages.mjs`가 만드는 파일이라 직접 고치지 않는다. 쪽 모양은 `MagicalDove/doc.css`.
모든 페이지 머리에 다른 언어로 가는 링크(`English` / `한국어`)가 있다. Google Play는 처리방침 URL이 하나라 한국어 주소를 넣고, 영어는 그 링크로 간다.

### 원문과 값

- 원문: 게임 저장소 `NewMeans/Magical-Dove`의 `docs/store/`(비공개). 이 저장소에는 게시할 본문만 `_magical-dove/source/<문서>/<버전>.md`로
  옮겨 둔다. 맨 위 `>` 인용 블록과 처리방침의 `---` 뒤('분석 도구를 붙일 때')는 내부 메모라 옮기지 않는다. 어느 커밋에서 가져왔는지는 `source/source.json`.
- 가져오기: `git -C ../Magical-Dove fetch origin` 뒤 `node _magical-dove/pages.mjs sync --ref origin/main`(병합 전이면 `--ref origin/dev/store-docs`).
  각 문서의 최신 버전 사본에 덮어쓰고, 바뀐 문서와 뺀 메모를 알려 준다. 본문은 고치지 않는다(확률 수치와 약관 조항은 게임 코드와 테스트로 묶여 있음. 틀리면 게임 저장소에서 고침).
- 값: `_magical-dove/config.json`의 `values` 한 곳. `{{상호}}`처럼 자리 이름을 그대로 키로 쓰고, 모르는 값은 `null`.
  `{{웹사이트}}`는 `siteUrl`에서 정해진다. `{{확인: …}}`과 빈 `{{ }}`는 확인한 뒤에만 채운다.
  영어판은 같은 값을 쓰고, 영어로 다르게 적을 값만 `en.values`에 둔다(지금은 상호와 보호책임자의 직책).
- 글자는 그대로 옮긴다: 조항 번호도 글자, 표는 HTML 표, 맨 주소는 링크로만 바꾼다. 저장소 안을 가리키는 링크는 글자만 남는다.

### 영어판

- 번역: 원문 사본 옆 `_magical-dove/source/<문서>/<버전>.en.md`. 이 저장소에만 있다(게임은 한국어뿐이라 게임 저장소에는 없음).
  영어판 맨 위에는 한국어 원문의 번역이며 둘이 다르면 한국어가 우선한다는 줄과 한국어 페이지 링크가 붙는다.
- 번역 첫 줄 `<!-- 원문: 1.0.md sha256:… -->`은 어느 한국어 본문을 옮겼는지 적은 것. `sync`로 한국어가 바뀌면 `check`가 실패하며
  바꿔 적을 줄을 알려 준다. 바뀐 곳(`git diff _magical-dove/source`)을 번역에 옮긴 뒤 그 줄로 바꾼다.
- `check`는 번역을 한국어와 조각마다(제목, 문단, 목록 줄, 표 칸) 맞춰 본다: 구조(문단 수, 목록 줄 수와 번호, 표 크기), 숫자,
  링크(이 사이트의 페이지는 영어판 `{사이트}/en/…`로), 메일 주소, 자리표시. 다르면 어느 제목 아래 어느 줄인지 알려 준다.
  숫자는 글자로 풀지 않고 숫자로 쓴다(`7일` → `7 days`). 한국어에만 숫자가 있는 `제3자`는 빼고 센다.
- 게임 화면의 이름(메뉴, 상품, 조커)은 영어 뒤 괄호에 한국어를 그대로 둔다(`Settings (설정) > Restore Purchases (구매 복원)`). 괄호 속 한국어의 숫자는 세지 않는다.
- 번역은 뜻을 옮길 뿐 조항을 더하거나 빼지 않는다. 확률 수치와 조항은 한국어 원문(게임 저장소)에서만 바뀐다.

### 만들기와 검사

```bash
node _magical-dove/pages.mjs check        # 남은 자리표시(파일:줄), 다시 만들어야 하는 페이지, 본문의 끊긴 링크, 공지 파일 형식, 번역
node _magical-dove/pages.mjs build        # 자리표시가 하나도 없을 때만 MagicalDove/에 씀. 남아 있으면 아무것도 쓰지 않고 실패
node _magical-dove/pages.mjs serve --draft   # http://localhost:8765/MagicalDove/support. 남은 자리표시를 빨갛게 표시한 미리보기(디스크에 쓰지 않음)
node _magical-dove/pages.mjs serve        # 디스크의 파일을 GitHub Pages처럼(확장자 없는 주소, _ 폴더 숨김) 내줌
```

`check`는 PR과 main 푸시 때 GitHub Actions(`.github/workflows/magical-dove-pages.yml`)에서도 돈다. 실패하면 병합하지 않는다.
main에 병합하면 바로 배포되므로, `check`가 통과한 뒤에 병합한다.

### 개정(버전)

1. `config.json`에서 그 문서의 `versions` 끝에 `{ "version": "1.1", "values": { "시행일": "2027-02-05" } }`처럼 새 버전을 더한다.
   이전 버전에 쓰인 값(시행일, 주소 등)이 달라지면 이전 버전의 `values`에 그때 값을 적어 고정한다.
2. `sync`로 새 원문을 가져온다. 원문 버전 표의 마지막 줄이 `config.json`의 최신 버전과 다르면 쓰지 않고 알려 준다.
3. 새 버전의 번역 `<버전>.en.md`를 만든다(이전 버전 번역을 복사해 바뀐 곳을 고치고 첫 줄을 `check`가 알려 주는 줄로).
4. `build`: 새 버전은 `{사이트}/<문서>`, 이전 버전은 `{사이트}/archive/<문서>-<버전>.html`(검색 제외, '현재 버전 보기' 링크)로 가고, 버전 표의 이전 버전 번호가 그 페이지로 이어진다. 영어판도 `{사이트}/en/` 아래에 같은 모양으로.
5. 약관 제4조, 제12조, 제13조의 기간(7일 전, 불리하면 30일 전, 종료는 30일 전)에 맞춰 공지를 올린다.

### 공지 올리는 법

`_magical-dove/notices/`에 공지 하나마다 한국어 파일과 영어 파일을 한 쌍으로 더하고 `build`한 뒤 main에 병합한다.
`{사이트}/notices`와 `{사이트}/en/notices`에 새 날짜가 위로 쌓인다. 공지가 없으면 '공지 없음'('No notices')이 보인다.

- 파일 이름: `올린 날-영문 소문자와 숫자.md` (예: `2027-01-05-terms.md`), 영어는 끝만 `.en.md` (`2027-01-05-terms.en.md`). 이름의 날짜가 페이지에 '올린 날'로 나오고, 이름이 그 공지의 주소 조각(`{사이트}/notices#2027-01-05-terms`)이 된다.
  짝이 없으면 `check`가 실패하고, 영어는 문서 번역과 같은 방식으로 한국어와 맞춰 본다(영어 공지의 링크는 `{{웹사이트}}/en/terms`처럼 영어판으로).
- 첫 줄 `# 제목`, 그 아래가 본문. 본문은 문서와 같은 마크다운(문단, 목록, 표, 링크)이고 `{{웹사이트}}` 같은 자리표시도 쓸 수 있다.

```markdown
# 이용약관 변경 안내

적용일: 2027-02-05

바꾼 내용: 제16조 제4항, 유료 재화와 무료 재화를 함께 가진 경우 쓰는 순서

바꾼 이유: …

적용일까지 거부한다는 뜻을 밝히지 않으면 바뀐 약관에 동의한 것으로 봅니다. 전문: {{웹사이트}}/terms
```

```markdown
# Changes to the Terms of Service

Effective date: 2027-02-05

What changed: Article 16, Paragraph 4, the order in which Paid Currency and Free Currency are used

Why: …

If you do not express your refusal by the effective date, you are deemed to have agreed to the amended Terms. Full text: {{웹사이트}}/en/terms
```

올릴 것: 이용약관 변경(적용일, 바꾼 내용, 바꾼 이유, 거부하지 않으면 동의로 본다는 점), 확률이나 상품 구성 변경, 개인정보 처리방침 변경, 서비스 종료 안내.
기간은 위 '개정' 4번. 지난 공지는 지우지 않고 남겨 둔다.

## 저장소 규칙

공개 저장소입니다. 외부 디자인 레퍼런스의 캡처·소스·사이트명은 `_local/`(무시됨)에만 두고
코드 주석, 에셋명, 커밋, PR에 쓰지 않습니다.
