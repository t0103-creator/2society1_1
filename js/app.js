(() => {
  const $ = selector => document.querySelector(selector);
  const els = {};
  let currentCategory = 'furniture';
  let toastTimer = null;

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    Object.assign(els, {
      stage: $('#stage'), stageViewport: $('#stageViewport'),
      assetPanel: $('#assetPanel'), assetPanelTitle: $('#assetPanelTitle'), assetGrid: $('#assetGrid'),
      closeAssetPanelBtn: $('#closeAssetPanelBtn'), objectPanel: $('#objectPanel'), closeObjectPanelBtn: $('#closeObjectPanelBtn'),
      selectedName: $('#selectedName'), posX: $('#posX'), posY: $('#posY'), applyPositionBtn: $('#applyPositionBtn'),
      textEditor: $('#textEditor'), objectText: $('#objectText'), applyTextBtn: $('#applyTextBtn'),
      scaleDownBtn: $('#scaleDownBtn'), scaleUpBtn: $('#scaleUpBtn'), flipBtn: $('#flipBtn'), frontBtn: $('#frontBtn'), backBtn: $('#backBtn'), deleteBtn: $('#deleteBtn'),
      undoBtn: $('#undoBtn'), redoBtn: $('#redoBtn'), resetBtn: $('#resetBtn'), saveStatus: $('#saveStatus'), toast: $('#toast')
    });

    document.title = APP_CONFIG.title;

    RoomManager.init(els.stage, {
      onSaving: () => setSaveStatus(false),
      onSaved: () => setSaveStatus(true),
      onSelection: renderObjectPanel,
      onLivePosition: updatePositionInputs,
      onHistory: updateHistoryButtons
    });

    bindEvents();
    renderAssetGrid(currentCategory);
    resizeStage();
    updateHistoryButtons();

    window.addEventListener('resize', resizeStage);
    window.addEventListener('beforeunload', () => RoomManager.saveNow());
  }

  function bindEvents(){
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => selectCategory(btn.dataset.category, btn));
    });

    els.assetGrid.addEventListener('click', e => {
      const card = e.target.closest('.asset-card');
      if(!card) return;
      RoomManager.addAsset(card.dataset.category, card.dataset.assetId);
      if(window.innerWidth <= 760) els.assetPanel.classList.remove('open');
    });

    els.closeAssetPanelBtn.addEventListener('click', () => els.assetPanel.classList.remove('open'));
    els.closeObjectPanelBtn.addEventListener('click', () => RoomManager.selectObject(null));

    els.applyPositionBtn.addEventListener('click', () => RoomManager.setSelectedPosition(els.posX.value, els.posY.value));
    els.applyTextBtn.addEventListener('click', () => RoomManager.setSelectedText(els.objectText.value));
    els.scaleDownBtn.addEventListener('click', () => RoomManager.scaleSelected(0.88));
    els.scaleUpBtn.addEventListener('click', () => RoomManager.scaleSelected(1.14));
    els.flipBtn.addEventListener('click', () => RoomManager.flipSelected());
    els.frontBtn.addEventListener('click', () => RoomManager.bringFront());
    els.backBtn.addEventListener('click', () => RoomManager.sendBack());
    els.deleteBtn.addEventListener('click', () => RoomManager.deleteSelected());

    els.undoBtn.addEventListener('click', () => RoomManager.undo());
    els.redoBtn.addEventListener('click', () => RoomManager.redo());
    els.resetBtn.addEventListener('click', () => {
      if(confirm('현재 미니룸의 모든 아이템을 지우고 처음 상태로 되돌릴까요?')){
        RoomManager.resetRoom();
        toast('미니룸을 초기화했습니다.');
      }
    });

    document.addEventListener('keydown', e => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing){
        e.preventDefault();
        e.shiftKey ? RoomManager.redo() : RoomManager.undo();
      }
      if((e.key === 'Delete' || e.key === 'Backspace') && !typing && RoomManager.getSelected()){
        e.preventDefault();
        RoomManager.deleteSelected();
      }
    });
  }

  function selectCategory(category, btn){
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(item => item.classList.toggle('active', item === btn));
    renderAssetGrid(category);
    els.assetPanel.classList.add('open');
  }

  function renderAssetGrid(category){
    const labels = {
      furniture: '가구', characters: '미니미', speech: '말풍선', decorations: '꾸미기', backgrounds: '배경'
    };
    els.assetPanelTitle.textContent = labels[category] || category;
    const list = ASSETS[category] || [];
    els.assetGrid.innerHTML = list.map(asset => {
      const visual = asset.image
        ? `<img src="${escapeHtml(asset.image)}" alt="">`
        : `<div class="asset-speech speech-bubble speech-${escapeHtml(asset.type || 'normal')}">Aa</div>`;
      return `<button class="asset-card" data-category="${escapeHtml(category)}" data-asset-id="${escapeHtml(asset.id)}">${visual}<span>${escapeHtml(asset.name)}</span></button>`;
    }).join('');
  }

  function renderObjectPanel(obj){
    const hasObject = !!obj;
    els.objectPanel.classList.toggle('hidden', !hasObject);
    if(!hasObject) return;

    const asset = (ASSETS[obj.category] || []).find(item => item.id === obj.assetId);
    els.selectedName.textContent = asset?.name || '선택 아이템';
    updatePositionInputs(obj);

    const isSpeech = obj.category === 'speech';
    els.textEditor.classList.toggle('hidden', !isSpeech);
    if(isSpeech) els.objectText.value = obj.text || '';
    els.flipBtn.disabled = isSpeech;
  }

  function updatePositionInputs(obj){
    if(!obj || !RoomManager.getSelected() || obj.uid !== RoomManager.getSelected().uid) return;
    els.posX.value = Math.round(obj.x);
    els.posY.value = Math.round(obj.y);
  }

  function resizeStage(){
    const rect = els.stageViewport.getBoundingClientRect();
    const scale = Math.min(rect.width / APP_CONFIG.stage.width, rect.height / APP_CONFIG.stage.height);
    const safeScale = Math.max(0.05, scale);
    RoomManager.setStageScale(safeScale);
    els.stage.style.transform = `scale(${safeScale})`;
    els.stageViewport.style.setProperty('--stage-width', `${APP_CONFIG.stage.width * safeScale}px`);
    els.stageViewport.style.setProperty('--stage-height', `${APP_CONFIG.stage.height * safeScale}px`);
  }

  function updateHistoryButtons(){
    els.undoBtn.disabled = !RoomManager.canUndo();
    els.redoBtn.disabled = !RoomManager.canRedo();
  }

  function setSaveStatus(saved){
    els.saveStatus.textContent = saved ? '✓ 자동 저장됨' : '저장 중...';
    els.saveStatus.classList.toggle('saving', !saved);
  }

  function toast(message){
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800);
  }

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
})();
