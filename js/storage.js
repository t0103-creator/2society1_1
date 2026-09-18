window.StorageManager = (() => {
  function load(){
    try{
      const raw = localStorage.getItem(APP_CONFIG.storageKey);
      return raw ? JSON.parse(raw) : null;
    }catch(err){
      console.warn('저장 데이터 읽기 실패', err);
      return null;
    }
  }

  function save(data){
    try{
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(data));
      return true;
    }catch(err){
      console.warn('저장 실패', err);
      return false;
    }
  }

  function clear(){
    localStorage.removeItem(APP_CONFIG.storageKey);
  }

  return { load, save, clear };
})();
