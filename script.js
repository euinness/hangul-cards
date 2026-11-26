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

// 가족 카드 ([기타] 탭) 처음 모습
// 사진과 새 낱말은 ⚙️ 설정에서 넣고, "이 기기 안에만" 저장돼요 (인터넷에 올라가지 않아요)
const defaultFamily = [
  { word: "엄마",     emoji: "👩", photos: [] },
  { word: "아빠",     emoji: "👨", photos: [] },
  { word: "할머니",   emoji: "👵", photos: [] },
  { word: "할아버지", emoji: "👴", photos: [] },
];
let familyCards = defaultFamily;

// 낱말 첫 글자를 자음과 모음으로 나누기  예) 엄마 → ㅇ + ㅓ = 어
const CHO  = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];

function splitFirst(word) {
  const code = word.charCodeAt(0) - 0xAC00; // 한글 글자는 '가'부터 순서대로 번호가 있어요
  if (Number.isNaN(code) || code < 0 || code > 11171) return null;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  return {
    consonant: CHO[cho],
    vowel: JUNG[jung],
    syllable: String.fromCharCode(0xAC00 + cho * 588 + jung * 28), // 받침 뺀 글자
  };
}

// 탭마다 쓸 카드 묶음 (합치기는 자음 카드를 다시 써요)
function getDeck(tab) {
  if (tab === "consonant") return consonants;
  if (tab === "vowel") return vowels;
  if (tab === "merge") return consonants;
  return familyCards.map((card) => ({ ...splitFirst(card.word), ...card }));
}

// 합치기 화면을 쓰는 탭
const mergeTabs = ["merge", "family"];

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

// 그림 넣기: 사진이 있으면 사진(작게), 없으면 이모지
function setPicture(element, item) {
  element.innerHTML = "";
  const hasPhotos = Boolean(item.photos && item.photos.length);
  element.classList.toggle("photos", hasPhotos);
  if (hasPhotos) {
    item.photos.forEach((blob) => element.append(makePhoto(blob, item.word)));
  } else {
    element.textContent = item.emoji;
  }
}

// 저장된 사진(Blob)을 화면에 보여줄 <img> 만들기
const photoUrls = new WeakMap();
function makePhoto(blob, alt) {
  if (!photoUrls.has(blob)) photoUrls.set(blob, URL.createObjectURL(blob));
  const img = document.createElement("img");
  img.src = photoUrls.get(blob);
  img.alt = alt;
  return img;
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
  const deck = getDeck(currentTab);
  if (currentIndex >= deck.length) currentIndex = 0;
  const item = deck[currentIndex];

  app.dataset.tab = currentTab;
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });
  settingsBtn.hidden = currentTab !== "family";

  if (!item) {
    // 가족 카드를 모두 지운 경우
    flipCard.hidden = true;
    mergeCard.hidden = false;
    resetWithoutAnimation(mergeCard, "merged");
    ["mergeC", "mergeV", "mergeResult"].forEach((id) => (document.getElementById(id).textContent = ""));
    document.getElementById("mergeEmoji").textContent = "⚙️";
    document.getElementById("mergeWord").textContent = "카드를 추가해 주세요";
    mergeCard.classList.add("merged");
    counter.textContent = "0 / 0";
    return;
  }

  if (mergeTabs.includes(currentTab)) {
    flipCard.hidden = true;
    mergeCard.hidden = false;
    resetWithoutAnimation(mergeCard, "merged");

    document.getElementById("mergeC").textContent = item.consonant || item.letter;
    document.getElementById("mergeV").textContent = item.vowel || "ㅏ";
    document.getElementById("mergeResult").textContent = item.syllable;
    setPicture(document.getElementById("mergeEmoji"), item);
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
  const length = getDeck(currentTab).length;
  if (length === 0) return;
  currentIndex = (currentIndex + step + length) % length;
  render();
}

document.getElementById("prevBtn").addEventListener("click", () => move(-1));
document.getElementById("nextBtn").addEventListener("click", () => move(1));

// 컴퓨터에서 확인할 때: 왼쪽/오른쪽 화살표 키, 스페이스 키
document.addEventListener("keydown", (event) => {
  if (!settings.hidden) return; // 설정 화면에서 글자를 칠 때는 무시
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
  if (event.key === " ") {
    event.preventDefault();
    (mergeTabs.includes(currentTab) ? mergeCard : flipCard).click();
  }
});

// =============================================
// 7. 가족 카드 저장하기 (이 기기의 브라우저 안에만 저장)
// =============================================
const DB_NAME = "hangul-cards";
const STORE = "family";
let storageWorks = true;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadFamily() {
  try {
    const db = await openDB();
    const saved = await new Promise((resolve, reject) => {
      const request = db.transaction(STORE).objectStore(STORE).get("cards");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (Array.isArray(saved)) familyCards = saved;
  } catch (error) {
    storageWorks = false;
  }
}

async function saveFamily() {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(familyCards, "cards");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    // 기기가 저장 공간이 부족할 때도 지우지 말아 달라고 부탁하기
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  } catch (error) {
    storageWorks = false;
  }
  storageWarning.hidden = storageWorks;
}

// 고른 사진을 긴 쪽 480픽셀로 줄이기 (용량을 줄여서 빠르게)
async function shrinkImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const scale = Math.min(1, 480 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}

// =============================================
// 8. ⚙️ 설정 화면
// =============================================
const settingsBtn    = document.getElementById("settingsBtn");
const settings       = document.getElementById("settings");
const familyList     = document.getElementById("familyList");
const addForm        = document.getElementById("addForm");
const newWord        = document.getElementById("newWord");
const storageWarning = document.getElementById("storageWarning");

function renderSettings() {
  familyList.innerHTML = "";
  familyCards.forEach((card, cardIndex) => {
    const parts = splitFirst(card.word);
    const row = document.createElement("div");
    row.className = "family-row";

    // 윗줄: 낱말, ㅇ + ㅓ = 어, 카드 지우기
    const top = document.createElement("div");
    top.className = "row-top";
    const title = document.createElement("strong");
    title.textContent = card.word;
    const split = document.createElement("span");
    split.className = "row-split";
    split.textContent = `${parts.consonant} + ${parts.vowel} = ${parts.syllable}`;
    const delCard = document.createElement("button");
    delCard.className = "small-btn danger";
    delCard.textContent = "카드 지우기";
    delCard.addEventListener("click", async () => {
      if (!confirm(`'${card.word}' 카드를 지울까요?`)) return;
      familyCards.splice(cardIndex, 1);
      await saveFamily();
      renderSettings();
    });
    top.append(title, split, delCard);

    // 아랫줄: 사진들 (✕로 지우기) + 사진 넣기 버튼
    const photos = document.createElement("div");
    photos.className = "row-photos";
    (card.photos || []).forEach((blob, photoIndex) => {
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      const remove = document.createElement("button");
      remove.className = "thumb-remove";
      remove.textContent = "✕";
      remove.setAttribute("aria-label", "사진 지우기");
      remove.addEventListener("click", async () => {
        card.photos.splice(photoIndex, 1);
        await saveFamily();
        renderSettings();
      });
      thumb.append(makePhoto(blob, card.word), remove);
      photos.append(thumb);
    });

    const addPhoto = document.createElement("label");
    addPhoto.className = "add-photo";
    addPhoto.textContent = "＋ 사진";
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.addEventListener("change", async () => {
      for (const file of input.files) {
        const small = await shrinkImage(file);
        if (small) card.photos = [...(card.photos || []), small];
      }
      await saveFamily();
      renderSettings();
    });
    addPhoto.append(input);
    photos.append(addPhoto);

    row.append(top, photos);
    familyList.append(row);
  });
  storageWarning.hidden = storageWorks;
}

settingsBtn.addEventListener("click", () => {
  renderSettings();
  settings.hidden = false;
});

document.getElementById("settingsDone").addEventListener("click", () => {
  settings.hidden = true;
  render();
});

// 새 낱말 카드 추가 (예: 이모)
addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const word = newWord.value.trim();
  if (!word) return;
  if (!splitFirst(word)) {
    alert("한글 낱말로 써 주세요. 예: 이모");
    return;
  }
  familyCards.push({ word, emoji: "🙂", photos: [] });
  newWord.value = "";
  await saveFamily();
  renderSettings();
});

// 처음 화면 그리기 → 저장된 가족 카드 불러오기
render();
loadFamily().then(() => {
  if (currentTab === "family") render();
});
