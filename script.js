import words from "./word.js";

const wordText = document.querySelector(".word");
const hintText = document.querySelector(".hint");
const Refresh = document.querySelector(".Refresh");
const checkword = document.querySelector(".checkword");
const inputField = document.querySelector("input");
const Timertext = document.querySelector(".time span b");
const levelText = document.querySelector(".level span b");
const levelSelect = document.getElementById("level");
const accuracyText = document.querySelector(".accuracy span b");

let popup, closePopup;
let selectedword, timer;
let level = 1;
let baseTime = 30;
let difficulty = "medium";

// For accuracy tracking
let totalAttempts = 0;
let correctAttempts = 0;

// Initialize popup elements once DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  popup = document.getElementById("popup");
  closePopup = document.getElementById("closePopup");

  if (closePopup) {
    closePopup.addEventListener("click", () => {
      popup.style.display = "none";
      initGame();
    });
  }

  initGame();
});

// Get time limit based on difficulty level
const getBaseTime = (levelType) => {
  switch (levelType) {
    case "easy": return 40;
    case "medium": return 30;
    case "hard": return 20;
    default: return 30;
  }
};

// When level (difficulty) changes
levelSelect.addEventListener("change", () => {
  difficulty = levelSelect.value;
  baseTime = getBaseTime(difficulty);
  level = 1;
  totalAttempts = 0;
  correctAttempts = 0;
  updateAccuracy();
  initGame();
});

// Update accuracy percentage
const updateAccuracy = () => {
  const accuracy = totalAttempts === 0 ? 0 : ((correctAttempts / totalAttempts) * 100).toFixed(1);
  accuracyText.innerText = `${accuracy}%`;
};

// Timer countdown
const initTime = (maxtime) => {
  clearInterval(timer);
  timer = setInterval(() => {
    if (maxtime > 0) {
      maxtime--;
      Timertext.innerText = maxtime;
    } else {
      clearInterval(timer);
      alert(`⏰ Time's up! The correct word was: ${selectedword}`);
      totalAttempts++;
      level = 1;
      updateAccuracy();
      levelText.innerText = level;
      initGame();
    }
  }, 1000);
};

// Start game round
const initGame = () => {
  baseTime = getBaseTime(difficulty);
  const currentTime = Math.max(10, baseTime - (level - 1) * 2);
  initTime(currentTime);

  const randomobj = words[Math.floor(Math.random() * words.length)];
  selectedword = randomobj.word;
  const hint = randomobj.hint;

  // Shuffle word
  const wordArray = selectedword.split("");
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }

  wordText.innerText = wordArray.join("");
  hintText.innerText = hint;
  inputField.value = "";

  Timertext.innerText = currentTime;
  levelText.innerText = level;
};

// Check if user's input is correct
const checkWord = () => {
  const userWord = inputField.value.trim().toLowerCase();

  if (!userWord) {
    return alert("Please enter a word");
  }

  totalAttempts++;

  if (userWord !== selectedword) {
    updateAccuracy();
    return alert("Oops! It's incorrect");
  }

  correctAttempts++;
  level++;
  updateAccuracy();

  if (popup) popup.style.display = "flex";
};

// Event listeners
checkword.addEventListener("click", checkWord);
Refresh.addEventListener("click", initGame);
