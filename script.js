const STORAGE_KEY = 'cyworldEduMinihomeState_v1';

const defaultState = {
  studentName: '홍길동',
  pageTitle: '우리 반 학습 미니홈피',
  statusText: '오늘도 즐겁게 배워요!',
  speechText: '안녕! 함께 공부하자!',
  diaryTitle: '오늘의 학습 기록',
  diaryText: '배운 내용을 정리해 보세요.',
  room: 'room_pink.png',
  bubble: 'bubble_white.png',
  avatar: 'avatar_girl.png',
  pet: 'pet_cat_white.png',
  guestbook: []
};

let state = loadState();
let saveTimer = null;

const el = {
  saveStatus: document.getElementById('saveStatus'),
  resetBtn: document.getElementById('resetBtn'),
  studentName: document.getElementById('studentName'),
  pageTitle: document.getElementById('pageTitle'),
  statusText: document.getElementById('statusText'),
  speechText: document.getElementById('speechText'),
  diaryTitle: document.getElementById('diaryTitle'),
  diaryText: document.getElementById('diaryText'),
  previewStudentName: document.getElementById('previewStudentName'),
  previewPageTitle: document.getElementById('previewPageTitle'),
  previewStatusText: document.getElementById('previewStatusText'),
  bubbleText: document.getElementById('bubbleText'),
  previewDiaryTitle: document.getElementById('previewDiaryTitle'),
  previewDiary: document.getElementById('previewDiary'),
  roomBackground: document.getElementById('roomBackground'),
  bubbleImage: document.getElementById('bubbleImage'),
  profileAvatar: document.getElementById('profileAvatar'),
  roomAvatar: document.getElementById('roomAvatar'),
  petImage: document.getElementById('petImage'),
  guestAuthor: document.getElementById('guestAuthor'),
  guestMessage: document.getElementById('guestMessage'),
  addGuestBtn: document.getElementById('addGuestBtn'),
  guestbookList: document.getElementById('guestbookList'),
  guestCount: document.getElementById('guestCount'),
  todayDate: document.getElementById('todayDate')
};

initialize();

function initialize() {
  bindTabs();
  bindInputs();
  bindChoices();
  bindActions();
  applyStateToInputs();
  renderAll();
  updateTodayDate();
}

function bindTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('is-active'));
      document.querySelectorAll('.tab-section').forEach(item => item.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('is-active');
    });
  });
}

function bindInputs() {
  const pairs = [
    ['studentName', 'studentName'],
    ['pageTitle', 'pageTitle'],
    ['statusText', 'statusText'],
    ['speechText', 'speechText'],
    ['diaryTitle', 'diaryTitle'],
    ['diaryText', 'diaryText']
  ];

  pairs.forEach(([id, key]) => {
    el[id].addEventListener('input', event => {
      state[key] = event.target.value;
      renderAll();
      scheduleSave();
    });
  });

  document.querySelectorAll('input[name="avatar"]').forEach(radio => {
    radio.addEventListener('change', event => {
      state.avatar = event.target.value;
      renderAll();
      scheduleSave();
    });
  });

  document.querySelectorAll('input[name="pet"]').forEach(radio => {
    radio.addEventListener('change', event => {
      state.pet = event.target.value;
      renderAll();
      scheduleSave();
    });
  });
}

function bindChoices() {
  document.querySelectorAll('[data-room]').forEach(button => {
    button.addEventListener('click', () => {
      state.room = button.dataset.room;
      document.querySelectorAll('[data-room]').forEach(item => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      renderAll();
      scheduleSave();
    });
  });

  document.querySelectorAll('[data-bubble]').forEach(button => {
    button.addEventListener('click', () => {
      state.bubble = button.dataset.bubble;
      document.querySelectorAll('[data-bubble]').forEach(item => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      renderAll();
      scheduleSave();
    });
  });
}

function bindActions() {
  el.addGuestBtn.addEventListener('click', addGuestEntry);
  el.resetBtn.addEventListener('click', resetAll);
}

function applyStateToInputs() {
  el.studentName.value = state.studentName;
  el.pageTitle.value = state.pageTitle;
  el.statusText.value = state.statusText;
  el.speechText.value = state.speechText;
  el.diaryTitle.value = state.diaryTitle;
  el.diaryText.value = state.diaryText;

  const avatarRadio = document.querySelector(`input[name="avatar"][value="${state.avatar}"]`);
  if (avatarRadio) avatarRadio.checked = true;
  const petRadio = document.querySelector(`input[name="pet"][value="${state.pet}"]`);
  if (petRadio) petRadio.checked = true;

  document.querySelectorAll('[data-room]').forEach(item => item.classList.toggle('is-selected', item.dataset.room === state.room));
  document.querySelectorAll('[data-bubble]').forEach(item => item.classList.toggle('is-selected', item.dataset.bubble === state.bubble));
}

function renderAll() {
  el.previewStudentName.textContent = state.studentName || '이름 없음';
  el.previewPageTitle.textContent = state.pageTitle || '제목 없음';
  el.previewStatusText.textContent = state.statusText || '상태 메모 없음';
  el.bubbleText.textContent = state.speechText || '문구를 입력하세요';
  el.previewDiaryTitle.textContent = state.diaryTitle || '오늘의 학습 기록';
  el.previewDiary.textContent = state.diaryText || '배운 내용을 정리해 보세요.';

  el.profileAvatar.src = `./assets/derived/${state.avatar}`;
  el.roomAvatar.src = `./assets/derived/${state.avatar}`;
  el.petImage.src = `./assets/derived/${state.pet}`;
  el.roomBackground.src = `./assets/derived/${state.room}`;
  el.bubbleImage.src = `./assets/derived/${state.bubble}`;

  renderGuestbook();
}

function addGuestEntry() {
  const author = el.guestAuthor.value.trim();
  const message = el.guestMessage.value.trim();
  if (!author || !message) {
    alert('작성자와 문구를 모두 입력하세요.');
    return;
  }
  state.guestbook.unshift({ id: Date.now(), author, message, createdAt: new Date().toLocaleString('ko-KR') });
  el.guestAuthor.value = '';
  el.guestMessage.value = '';
  renderGuestbook();
  scheduleSave();
}

function renderGuestbook() {
  el.guestbookList.innerHTML = '';
  if (state.guestbook.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'guestbook-item';
    empty.innerHTML = '<div><strong>안내</strong><span>등록된 방명록이 없습니다.</span></div>';
    el.guestbookList.appendChild(empty);
  } else {
    state.guestbook.forEach(entry => {
      const li = document.createElement('li');
      li.className = 'guestbook-item';
      li.innerHTML = `
        <div>
          <strong>${escapeHtml(entry.author)}</strong>
          <div>${escapeHtml(entry.message)}</div>
          <small>${escapeHtml(entry.createdAt)}</small>
        </div>
        <button class="delete-btn" type="button" data-id="${entry.id}">삭제</button>
      `;
      el.guestbookList.appendChild(li);
    });
  }

  el.guestCount.textContent = String(state.guestbook.length);
  document.querySelectorAll('.delete-btn[data-id]').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      state.guestbook = state.guestbook.filter(entry => entry.id !== id);
      renderGuestbook();
      scheduleSave();
    });
  });
}

function scheduleSave() {
  el.saveStatus.textContent = '자동 저장 중...';
  el.saveStatus.classList.add('is-saving');
  el.saveStatus.classList.remove('is-saved');
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const now = new Date();
    const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    el.saveStatus.textContent = `자동 저장 완료 · ${time}`;
    el.saveStatus.classList.remove('is-saving');
    el.saveStatus.classList.add('is-saved');
  }, 300);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch (error) {
    console.error('저장 데이터 로드 실패:', error);
    return structuredClone(defaultState);
  }
}

function resetAll() {
  const confirmed = confirm('저장된 내용을 초기 상태로 되돌리시겠습니까?');
  if (!confirmed) return;
  state = structuredClone(defaultState);
  localStorage.removeItem(STORAGE_KEY);
  applyStateToInputs();
  renderAll();
  el.saveStatus.textContent = '초기화 완료';
  el.saveStatus.classList.remove('is-saving');
  el.saveStatus.classList.add('is-saved');
}

function updateTodayDate() {
  const date = new Date();
  el.todayDate.textContent = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
