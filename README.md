# NewMeans

서울의 2인 스튜디오 **NewMeans**의 공식 웹사이트 (GitHub Pages).
게임 **Typer**와 AI 심리테스트 **도파민대학교(dodae.me)**를 만들고 운영합니다.

## 구조

- `index.html` — 단일 페이지 (Hero → How we work → Works → Studio → Footer)
- `styles.css` — 디자인 시스템 ("Mono Grid": 오프화이트 + 그로테스크 타이포 + 민트 악센트)
- `main.js` — 인터랙티브 키보드/모니터, 사운드(Howler), 스크롤 리빌
- `i18n.js` — 한/영(KO·EN) 문구 사전 + 언어 토글 (localStorage 유지)
- `assets/brand/` — 로고
- `NewMeans Web Assets/` — 키 사운드·BGM 등 사이트 에셋
- `Typer/`, `insta/` — 앱스토어 / 인스타그램 리디렉트

## 로컬 미리보기

```bash
python3 -m http.server 8765
# http://localhost:8765
```

오디오는 `file://`에서 CORS로 막히므로 반드시 HTTP로 확인하세요.

## 카피 수정

문구는 `i18n.js`의 `STRINGS.ko` / `STRINGS.en`에서 관리합니다. 마크업의
`data-i18n="키"` 속성과 사전의 키가 짝을 이룹니다.
