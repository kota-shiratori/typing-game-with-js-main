const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/yup.mp3");
const correctSound = new Audio("./audio/iPhone.mp3");

/* input合っているかどうかの判定 */
typeInput.addEventListener("input", () => {

  /* タイプ音を付ける */
  typeSound.play();
  typeSound.currentTime = 0;

  const sentenceArray = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");
  let correct = true;
  sentenceArray.forEach((characterSpan, index) => {
    if ((arrayValue[index] == null)) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;

      correct = false;
    }
  });

  if(correct == true) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

/* sample.json からランダムな文章を取得する */
function GetRandomLorem() {
  return fetch("./sample.json")
    .then((response) => response.json())
    .then((data) => {
      // sample.json の paragraphs 配列からランダムな文章を取得
      const randomIndex = Math.floor(Math.random() * data.paragraphs.length);
      return data.paragraphs[randomIndex];
    });
}

/* ランダムな文章を取得して表示する */
async function RenderNextSentence() {
  const sentence = await GetRandomLorem();

  typeDisplay.innerText = "";
  /* 文章を1文字ずつ分解して、spanタグを生成する */
  let oneText = sentence.split("");
  oneText.forEach(character => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplay.appendChild(characterSpan);
  });

  /* テキストボックスの中身を消す */
  typeInput.value = "";

  StartTimer();
}

let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  RenderNextSentence();
}

RenderNextSentence();
