window.DragManager = (() => {
  let active = null;

  function init(stage, room){
    stage.addEventListener('pointerdown', e => {
      const el = e.target.closest('.room-object');
      if(!el) return;
      const obj = room.getObject(el.dataset.uid);
      if(!obj) return;

      room.selectObject(obj.uid);
      const scale = room.getStageScale() || 1;
      active = {
        uid: obj.uid,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        objX: obj.x,
        objY: obj.y,
        scale,
        before: room.snapshot(),
        moved: false
      };
      el.setPointerCapture?.(e.pointerId);
      el.classList.add('dragging');
      e.preventDefault();
    });

    stage.addEventListener('pointermove', e => {
      if(!active || e.pointerId !== active.pointerId) return;
      const obj = room.getObject(active.uid);
      const el = stage.querySelector(`[data-uid="${CSS.escape(active.uid)}"]`);
      if(!obj || !el) return;

      const dx = (e.clientX - active.startX) / active.scale;
      const dy = (e.clientY - active.startY) / active.scale;
      if(Math.abs(dx) + Math.abs(dy) > 1) active.moved = true;

      const maxX = APP_CONFIG.stage.width - obj.width * obj.scale;
      const maxY = APP_CONFIG.stage.height - obj.height * obj.scale;
      obj.x = Math.max(0, Math.min(maxX, active.objX + dx));
      obj.y = Math.max(0, Math.min(maxY, active.objY + dy));
      room.updateObjectElement(obj, el);
      room.notifyLivePosition(obj);
      e.preventDefault();
    });

    function end(e){
      if(!active || e.pointerId !== active.pointerId) return;
      const el = stage.querySelector(`[data-uid="${CSS.escape(active.uid)}"]`);
      el?.classList.remove('dragging');
      if(active.moved) room.commitExternalMutation(active.before);
      active = null;
    }

    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
  }

  return { init };
})();
