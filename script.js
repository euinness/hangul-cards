// =============================================
// 1. 카드 내용 (낱말을 바꾸고 싶으면 여기만 고치면 돼요)
// =============================================

// 자음 14장: 글자, 이름, 자음+ㅏ 글자, 예시 낱말, 이모지
const consonants = [
  { letter: "ㄱ", name: "기역", syllable: "가", word: "가방",       emoji: "🎒" },
  { letter: "ㄴ", name: "니은", syllable: "나", word: "나비",       emoji: "🦋" },
  { letter: "ㄷ", name: "디귿", syllable: "다", word: "다람쥐",     emoji: "🐿️" },
  { letter: "ㄹ", name: "리을", syllable: "라", word: "라면",       emoji: "🍜" },
  { letter: "ㅁ", name: "미음", syllable: "마", word: "마이크",     emoji: "🎤" },
  { letter: "ㅂ", name: "비읍", syllable: "바", word: "바나나",     emoji: "🍌" },
  { letter: "ㅅ", name: "시옷", syllable: "사", word: "사과",       emoji: "🍎" },
  { letter: "ㅇ", name: "이응", syllable: "아", word: "아이스크림", emoji: "🍦",
    note: "맨 앞의 ㅇ은 소리가 나지 않아요" },
  { letter: "ㅈ", name: "지읒", syllable: "자", word: "자전거",     emoji: "🚲" },
  { letter: "ㅊ", name: "치읓", syllable: "차", word: "차례",       emoji: "🙋",
    note: "“내 차례!” 하고 손을 들어 봐요" },
  { letter: "ㅋ", name: "키읔", syllable: "카", word: "카메라",     emoji: "📷" },
  { letter: "ㅌ", name: "티읕", syllable: "타", word: "타조",       emoji: "🐦" },
  { letter: "ㅍ", name: "피읖", syllable: "파", word: "파인애플",   emoji: "🍍" },
  { letter: "ㅎ", name: "히읗", syllable: "하", word: "하마",       emoji: "🦛" },
];

// 모음 10장: 글자, 이름, 예시 낱말, 이모지
const vowels = [
  { letter: "ㅏ", name: "아", word: "아기",   emoji: "👶" },
  { letter: "ㅑ", name: "야", word: "야구",   emoji: "⚾" },
  { letter: "ㅓ", name: "어", word: "엄마",   emoji: "👩" },
  { letter: "ㅕ", name: "여", word: "여우",   emoji: "🦊" },
  { letter: "ㅗ", name: "오", word: "오리",   emoji: "🦆" },
  { letter: "ㅛ", name: "요", word: "요리",   emoji: "🍳" },
  { letter: "ㅜ", name: "우", word: "우유",   emoji: "🥛" },
  { letter: "ㅠ", name: "유", word: "유치원", emoji: "🏫" },
  { letter: "ㅡ", name: "으", word: "음악",   emoji: "🎵" },
  { letter: "ㅣ", name: "이", word: "이불",   emoji: "🛏️" },
];

// 탭마다 쓸 카드 묶음 (합치기는 자음 카드를 다시 써요)
const decks = {
  consonant: consonants,
  vowel: vowels,
  merge: consonants,
};

// =============================================
// 2. 지금 상태 기억하기
// =============================================
let currentTab = "consonant"; // 지금 보고 있는 탭
let currentIndex = 0;         // 지금 몇 번째 카드인지 (0부터 시작)

// =============================================
// 3. 화면 요소 찾아두기
// =============================================
const app        = document.querySelector(".app");
const tabButtons = document.querySelectorAll(".tab");
const flipCard   = document.getElementById("flipCard");
const mergeCard  = document.getElementById("mergeCard");
const counter    = document.getElementById("counter");

// =============================================
// 4. 낱말의 첫 글자에 색 칠하기  예) 가방 → [가]방
// =============================================
function setWord(element, word) {
  element.innerHTML = "";
  const first = document.createElement("span");
  first.className = "first";
  first.textContent = word[0];
  element.append(first, word.slice(1));
}

// 움직임 없이 카드를 처음 상태로 되돌리기 (다음 카드 뒷면이 잠깐 보이는 걸 막아요)
function resetWithoutAnimation(card, className) {
  card.classList.add("no-anim");
  card.classList.remove(className);
  void card.offsetWidth; // 브라우저가 바뀐 상태를 바로 반영하게 함
  card.classList.remove("no-anim");
}

// =============================================
// 5. 지금 카드를 화면에 그리기
// =============================================
function render() {
  const deck = decks[currentTab];
  const item = deck[currentIndex];

  app.dataset.tab = currentTab;
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });

  if (currentTab === "merge") {
    flipCard.hidden = true;
    mergeCard.hidden = false;
    resetWithoutAnimation(mergeCard, "merged");

    document.getElementById("mergeC").textContent = item.letter;
    document.getElementById("mergeV").textContent = "ㅏ";
    document.getElementById("mergeResult").textContent = item.syllable;
    document.getElementById("mergeEmoji").textContent = item.emoji;
    setWord(document.getElementById("mergeWord"), item.word);
  } else {
    mergeCard.hidden = true;
    flipCard.hidden = false;
    resetWithoutAnimation(flipCard, "flipped");

    document.getElementById("bigLetter").textContent = item.letter;
    document.getElementById("backEmoji").textContent = item.emoji;
    document.getElementById("backName").textContent = item.name;
    setWord(document.getElementById("backWord"), item.word);
    document.getElementById("backNote").textContent = item.note || "";
  }

  counter.textContent = `${currentIndex + 1} / ${deck.length}`;
}

// =============================================
// 6. 누르면 일어나는 일
// =============================================

// 탭 누르기 → 그 탭의 첫 카드부터
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    currentIndex = 0;
    render();
  });
});

// 카드 누르기 → 뒤집기
flipCard.addEventListener("click", () => {
  flipCard.classList.toggle("flipped");
});

// 합치기 카드 누르기 → 합치기 / 다시 처음으로
mergeCard.addEventListener("click", () => {
  mergeCard.classList.toggle("merged");
});

// 이전 / 다음 (끝에서 넘기면 처음으로 돌아가요)
function move(step) {
  const length = decks[currentTab].length;
  currentIndex = (currentIndex + step + length) % length;
  render();
}

document.getElementById("prevBtn").addEventListener("click", () => move(-1));
document.getElementById("nextBtn").addEventListener("click", () => move(1));

// 컴퓨터에서 확인할 때: 왼쪽/오른쪽 화살표 키, 스페이스 키
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
  if (event.key === " ") {
    event.preventDefault();
    (currentTab === "merge" ? mergeCard : flipCard).click();
  }
});

// 처음 화면 그리기
render();
