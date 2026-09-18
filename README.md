# 교육용 미니홈피 웹앱 — GitHub Pages 최종 배포본

이 폴더의 내용을 GitHub 저장소 최상위에 그대로 업로드하면 됩니다.

## 최종 구조
```text
/
├─ index.html
├─ style.css
├─ script.js
├─ .nojekyll
├─ README.md
├─ DEPLOY_CHECKLIST.md
└─ assets/
   ├─ original/
   └─ derived/
```

## GitHub Pages 배포
1. GitHub에 새 저장소를 생성합니다.
2. 이 폴더 안의 모든 파일과 `assets` 폴더를 저장소 루트에 업로드합니다.
3. 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch를 `main`, Folder를 `/ (root)`로 지정합니다.
6. 저장 후 생성되는 Pages 주소로 접속합니다.

## 포함 기능
- 미니홈피형 교육용 UI
- 학생 이름, 제목, 상태메모 입력
- 학생이 직접 작성하는 말풍선 문구
- 방/말풍선 테마 선택
- 아바타 및 반려동물 선택
- 다이어리
- 방명록
- 입력 내용 자동 저장 및 새로고침 후 복원

## 자동 저장 방식
브라우저의 `localStorage`를 사용합니다. 따라서 같은 기기와 같은 브라우저에서는 저장 상태가 유지됩니다.


## 2026-09-18 수정
- 상단 미니홈피 배너의 TODAY / TOTAL / 일촌 / 방명록 / 사랑해요 영역을 실제 클릭 가능한 기능으로 변경했습니다.
- 방명록 배너 버튼은 방명록 탭으로 이동합니다.
- 일촌 및 사랑해요 상태는 자동 저장됩니다.
- 캐릭터, 반려동물, 가구의 불필요한 흰 배경을 제거했습니다.
- 미니룸의 레이어 순서와 위치를 재조정하여 이미지 겹침 현상을 수정했습니다.
