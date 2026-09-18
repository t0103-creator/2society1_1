window.SpeechManager = (() => {
  const defaults = {
    normal: '안녕하세요!',
    thought: '무슨 생각을 하고 있을까?',
    question: '무엇이 궁금한가요?',
    emphasis: '중요한 한마디!'
  };
  function defaultText(type){ return defaults[type] || defaults.normal; }
  return { defaultText };
})();
