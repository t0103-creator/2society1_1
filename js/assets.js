window.ASSETS = {
  backgrounds: [
    { id: "room01", name: "밝은 교실", image: "assets/backgrounds/room01.svg", width: 1280, height: 720 },
    { id: "room02", name: "도시 연구실", image: "assets/backgrounds/room02.svg", width: 1280, height: 720 },
    { id: "room03", name: "저녁 스튜디오", image: "assets/backgrounds/room03.svg", width: 1280, height: 720 }
  ],
  furniture: [
    { id: "desk01", name: "책상", image: "assets/furniture/desk01.svg", width: 160, height: 120, layer: "floor" },
    { id: "chair01", name: "의자", image: "assets/furniture/chair01.svg", width: 100, height: 110, layer: "floor" },
    { id: "sofa01", name: "소파", image: "assets/furniture/sofa01.svg", width: 220, height: 130, layer: "floor" },
    { id: "shelf01", name: "책장", image: "assets/furniture/shelf01.svg", width: 150, height: 210, layer: "floor" },
    { id: "board01", name: "칠판", image: "assets/furniture/board01.svg", width: 230, height: 150, layer: "wall" }
  ],
  characters: [
    { id: "student01", name: "학생", image: "assets/characters/student01.svg", width: 96, height: 128, layer: "character" },
    { id: "friend01", name: "친구", image: "assets/characters/friend01.svg", width: 96, height: 128, layer: "character" },
    { id: "teacher01", name: "교사", image: "assets/characters/teacher01.svg", width: 96, height: 128, layer: "character" },
    { id: "citizen01", name: "시민", image: "assets/characters/citizen01.svg", width: 96, height: 128, layer: "character" },
    { id: "researcher01", name: "연구원", image: "assets/characters/researcher01.svg", width: 96, height: 128, layer: "character" }
  ],
  education: [
    { id: "keyword01", name: "키워드 카드", type: "keyword", width: 180, height: 86, defaultText: "핵심 키워드" },
    { id: "note01", name: "포스트잇", type: "note", width: 190, height: 160, defaultText: "근거를 적어 보세요." },
    { id: "data01", name: "자료 카드", type: "data", width: 240, height: 170, defaultText: "자료의 핵심 내용을 정리하세요." },
    { id: "graph01", name: "그래프 카드", type: "graph", width: 260, height: 190, defaultText: "그래프가 보여 주는 변화는?" },
    { id: "map01", name: "지도 카드", type: "map", width: 250, height: 180, defaultText: "지역의 특징을 적어 보세요." },
    { id: "photo01", name: "사진 메모", type: "photo", width: 230, height: 180, defaultText: "사진을 보고 알 수 있는 점" },
    { id: "explain01", name: "설명 카드", type: "explain", width: 260, height: 160, defaultText: "원인과 결과를 연결해 설명하세요." }
  ],
  speech: [
    { id: "speech-normal", name: "일반 말풍선", type: "normal", width: 250, height: 110 },
    { id: "speech-thought", name: "생각 말풍선", type: "thought", width: 250, height: 120 },
    { id: "speech-question", name: "질문 말풍선", type: "question", width: 250, height: 110 },
    { id: "speech-emphasis", name: "강조 말풍선", type: "emphasis", width: 250, height: 110 }
  ],
  decorations: [
    { id: "plant01", name: "화분", image: "assets/decorations/plant01.svg", width: 84, height: 112, layer: "floor" },
    { id: "lamp01", name: "스탠드", image: "assets/decorations/lamp01.svg", width: 72, height: 128, layer: "floor" },
    { id: "poster01", name: "벽 포스터", image: "assets/decorations/poster01.svg", width: 120, height: 150, layer: "wall" },
    { id: "rug01", name: "러그", image: "assets/decorations/rug01.svg", width: 240, height: 110, layer: "floor" }
  ]
};
