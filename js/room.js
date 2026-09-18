window.RoomManager = (() => {
  let state = null;
  let selectedUid = null;
  let stage = null;
  let stageScale = 1;
  let autosaveTimer = null;
  let undoStack = [];
  let redoStack = [];
  let callbacks = {};

  const deepCopy = value => JSON.parse(JSON.stringify(value));
  const uid = () => 'o_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function defaultState(){
    return {
      version: APP_CONFIG.version,
      background: ASSETS.backgrounds[0].id,
      objects: [],
      updatedAt: new Date().toISOString()
    };
  }

  function assetFor(obj){
    return (ASSETS[obj.category] || []).find(item => item.id === obj.assetId) || null;
  }

  function snapshot(){ return deepCopy(state); }
  function getObject(id){ return state?.objects?.find(obj => obj.uid === id) || null; }

  function layerBase(obj){
    if(obj.category === 'speech') return 6000;
    if(obj.category === 'characters') return 3000;
    if(obj.layer === 'wall') return 500;
    return 1500;
  }

  function zIndex(obj){
    return layerBase(obj) + Math.round(obj.y) + (obj.orderOffset || 0);
  }

  function init(stageEl, cb = {}){
    stage = stageEl;
    callbacks = cb;
    DragManager.init(stage, api);

    stage.addEventListener('click', e => {
      if(!e.target.closest('.room-object')) selectObject(null);
    });

    stage.addEventListener('dblclick', e => {
      const el = e.target.closest('.room-object');
      if(!el) return;
      const obj = getObject(el.dataset.uid);
      if(!obj || obj.category !== 'speech') return;
      const text = window.prompt('말풍선 내용을 입력하세요.', obj.text || '');
      if(text !== null) setObjectText(obj.uid, text);
    });

    state = StorageManager.load() || defaultState();
    normalizeState();
    render();
  }

  function normalizeState(){
    if(!state || !Array.isArray(state.objects)) state = defaultState();
    if(!ASSETS.backgrounds.some(bg => bg.id === state.background)) state.background = ASSETS.backgrounds[0].id;
    state.objects.forEach(obj => {
      obj.scale = Number.isFinite(obj.scale) ? obj.scale : 1;
      obj.flip = !!obj.flip;
      obj.orderOffset = Number.isFinite(obj.orderOffset) ? obj.orderOffset : 0;
      obj.x = Number.isFinite(obj.x) ? obj.x : 100;
      obj.y = Number.isFinite(obj.y) ? obj.y : 100;
    });
  }

  function addAsset(category, assetId){
    const asset = (ASSETS[category] || []).find(item => item.id === assetId);
    if(!asset) return;

    if(category === 'backgrounds'){
      mutate(() => { state.background = asset.id; });
      return;
    }

    mutate(() => {
      const obj = {
        uid: uid(),
        category,
        assetId,
        type: asset.type || null,
        layer: asset.layer || null,
        x: Math.max(20, APP_CONFIG.stage.width / 2 - (asset.width || 160) / 2 + Math.random() * 70 - 35),
        y: Math.max(20, APP_CONFIG.stage.height / 2 - (asset.height || 120) / 2 + Math.random() * 60 - 30),
        width: asset.width || 160,
        height: asset.height || 120,
        scale: 1,
        flip: false,
        orderOffset: 0,
        text: category === 'speech' ? SpeechManager.defaultText(asset.type) : ''
      };
      state.objects.push(obj);
      selectedUid = obj.uid;
    });
  }

  function mutate(fn){
    const before = snapshot();
    fn();
    commitExternalMutation(before);
  }

  function commitExternalMutation(before){
    undoStack.push(before);
    if(undoStack.length > APP_CONFIG.historyLimit) undoStack.shift();
    redoStack = [];
    render();
    queueSave();
    callbacks.onHistory?.();
  }

  function undo(){
    if(!undoStack.length) return;
    redoStack.push(snapshot());
    state = undoStack.pop();
    selectedUid = null;
    render();
    queueSave();
    callbacks.onHistory?.();
  }

  function redo(){
    if(!redoStack.length) return;
    undoStack.push(snapshot());
    state = redoStack.pop();
    selectedUid = null;
    render();
    queueSave();
    callbacks.onHistory?.();
  }

  function canUndo(){ return undoStack.length > 0; }
  function canRedo(){ return redoStack.length > 0; }

  function selectObject(id){
    selectedUid = id;
    renderSelection();
    callbacks.onSelection?.(getObject(id));
  }

  function renderSelection(){
    if(!stage) return;
    stage.querySelectorAll('.room-object').forEach(el => {
      el.classList.toggle('selected', !!selectedUid && el.dataset.uid === selectedUid);
    });
  }

  function objectElement(obj){
    const el = document.createElement('div');
    el.className = 'room-object';
    el.dataset.uid = obj.uid;

    if(obj.category === 'speech'){
      el.classList.add('text-object', 'speech-bubble', 'speech-' + (obj.type || 'normal'));
      const text = document.createElement('div');
      text.className = 'editable-text';
      text.textContent = obj.text || '';
      el.appendChild(text);
    }else{
      const asset = assetFor(obj);
      const wrap = document.createElement('div');
      wrap.className = 'flip-wrap';
      const img = document.createElement('img');
      img.src = asset?.image || '';
      img.alt = asset?.name || '미니룸 아이템';
      img.draggable = false;
      wrap.appendChild(img);
      el.appendChild(wrap);
    }

    updateObjectElement(obj, el);
    return el;
  }

  function updateObjectElement(obj, el){
    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
    el.style.width = obj.width + 'px';
    el.style.height = obj.height + 'px';
    el.style.transform = `scale(${obj.scale})`;
    el.style.zIndex = zIndex(obj);
    const wrap = el.querySelector('.flip-wrap');
    if(wrap) wrap.style.transform = `scaleX(${obj.flip ? -1 : 1})`;
    const text = el.querySelector('.editable-text');
    if(text) text.textContent = obj.text || '';
  }

  function render(){
    if(!stage || !state) return;
    const bg = ASSETS.backgrounds.find(item => item.id === state.background) || ASSETS.backgrounds[0];
    stage.style.backgroundImage = `url("${bg.image}")`;
    stage.innerHTML = '';
    state.objects.forEach(obj => stage.appendChild(objectElement(obj)));
    renderSelection();
    callbacks.onSelection?.(getObject(selectedUid));
  }

  function queueSave(){
    callbacks.onSaving?.();
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveNow, APP_CONFIG.autosaveDelay);
  }

  function saveNow(){
    if(!state) return;
    state.updatedAt = new Date().toISOString();
    StorageManager.save(deepCopy(state));
    callbacks.onSaved?.();
  }

  function changeSelected(action){
    const obj = getObject(selectedUid);
    if(!obj) return;
    mutate(() => action(obj));
  }

  function deleteSelected(){
    if(!selectedUid) return;
    mutate(() => {
      state.objects = state.objects.filter(obj => obj.uid !== selectedUid);
      selectedUid = null;
    });
  }

  function scaleSelected(multiplier){
    changeSelected(obj => {
      obj.scale = Math.max(0.35, Math.min(2.5, +(obj.scale * multiplier).toFixed(2)));
      obj.x = Math.min(obj.x, APP_CONFIG.stage.width - obj.width * obj.scale);
      obj.y = Math.min(obj.y, APP_CONFIG.stage.height - obj.height * obj.scale);
      obj.x = Math.max(0, obj.x);
      obj.y = Math.max(0, obj.y);
    });
  }

  function flipSelected(){ changeSelected(obj => { obj.flip = !obj.flip; }); }
  function bringFront(){ changeSelected(obj => { obj.orderOffset = (obj.orderOffset || 0) + 200; }); }
  function sendBack(){ changeSelected(obj => { obj.orderOffset = (obj.orderOffset || 0) - 200; }); }

  function setSelectedPosition(x, y){
    const obj = getObject(selectedUid);
    if(!obj) return;
    mutate(() => {
      const maxX = APP_CONFIG.stage.width - obj.width * obj.scale;
      const maxY = APP_CONFIG.stage.height - obj.height * obj.scale;
      obj.x = Math.max(0, Math.min(maxX, Number(x) || 0));
      obj.y = Math.max(0, Math.min(maxY, Number(y) || 0));
    });
  }

  function setObjectText(id, value){
    const obj = getObject(id);
    if(!obj || obj.category !== 'speech') return;
    mutate(() => {
      obj.text = String(value).trim() || SpeechManager.defaultText(obj.type);
      const lines = Math.max(1, Math.ceil(obj.text.length / 15));
      obj.height = Math.max(100, Math.min(220, 72 + lines * 24));
    });
  }

  function setSelectedText(value){
    if(selectedUid) setObjectText(selectedUid, value);
  }

  function notifyLivePosition(obj){ callbacks.onLivePosition?.(obj); }
  function setStageScale(value){ stageScale = value; }
  function getStageScale(){ return stageScale; }
  function getSelected(){ return getObject(selectedUid); }

  function resetRoom(){
    const before = snapshot();
    state = defaultState();
    selectedUid = null;
    undoStack.push(before);
    if(undoStack.length > APP_CONFIG.historyLimit) undoStack.shift();
    redoStack = [];
    render();
    saveNow();
    callbacks.onHistory?.();
  }

  const api = {
    init, addAsset, getObject, getSelected, selectObject, snapshot,
    commitExternalMutation, updateObjectElement, notifyLivePosition,
    undo, redo, canUndo, canRedo, deleteSelected, scaleSelected,
    flipSelected, bringFront, sendBack, setSelectedPosition,
    setSelectedText, setStageScale, getStageScale, saveNow, resetRoom
  };

  return api;
})();
