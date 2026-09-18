# MY MINI ROOM

GitHub Pages에서 별도 서버나 빌드 없이 실행되는 미니룸 꾸미기 웹앱입니다.

## 주요 기능

- 접속 즉시 큰 미니룸 편집 화면 표시
- 가구 추가 및 자유로운 드래그 이동
- 미니미 추가 및 자유로운 드래그 이동
- 말풍선 추가, 이동, 더블클릭/설정창 내용 수정
- X/Y 좌표 직접 입력을 통한 정밀 위치 조정
- 확대/축소, 좌우 반전, 앞으로/뒤로, 삭제
- 배경 변경
- Pointer Events 기반 마우스/터치 공통 조작
- LocalStorage 자동 저장 및 새로고침 후 자동 복원
- Ctrl+Z / Ctrl+Shift+Z 실행 취소/다시 실행
- PC, Chromebook, 태블릿, 스마트폰 대응

## 프로젝트 구조

```text
my-learning-room/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── room.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── assets.js
│   ├── room.js
│   ├── drag.js
│   ├── storage.js
│   └── speech.js
└── assets/
    ├── backgrounds/
    ├── furniture/
    ├── characters/
    ├── decorations/
    └── icons/
```

## GitHub Pages 배포

1. GitHub에 로그인합니다.
2. `my-learning-room` 저장소를 만듭니다.
3. 이 폴더 안의 파일과 폴더를 저장소 최상위에 업로드합니다. `index.html`이 반드시 저장소 루트에 있어야 합니다.
4. 저장소의 **Settings → Pages**로 이동합니다.
5. **Deploy from a branch**를 선택합니다.
6. Branch는 `main`, 폴더는 `/(root)`를 선택한 뒤 **Save**를 누릅니다.
7. 잠시 후 표시되는 `https://사용자명.github.io/my-learning-room/` 주소를 학생에게 공유합니다.

## 아이템 추가 방법

새 SVG 또는 PNG 파일을 `assets/furniture`, `assets/characters`, `assets/decorations` 중 알맞은 폴더에 넣고 `js/assets.js` 배열에 등록합니다.

예시:

```js
{ id: "table02", name: "큰 책상", image: "assets/furniture/table02.svg", width: 180, height: 130, layer: "floor" }
```

경로는 `/assets/...`가 아닌 `assets/...` 같은 상대경로를 사용해야 GitHub Pages 하위 경로에서 정상 작동합니다.

## 저장 방식

현재 미니룸 한 개를 브라우저의 LocalStorage에 자동 저장합니다. 같은 기기와 같은 브라우저에서 새로고침하거나 다시 접속하면 마지막 작업 상태가 자동으로 복원됩니다. 서버나 데이터베이스에는 전송하지 않습니다.
