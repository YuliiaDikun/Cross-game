const boxEl = document.querySelector(".content");
const containerEl = document.querySelector(".game-container");

const formEl = document.querySelector(".user-form");
const playersDiv = document.querySelector(".players");

let formValue = {};

function onformEl(e) {
  e.preventDefault();
  formValue = {};
  formValue = {
    user1: formEl.elements.user1.value,
    user2: formEl.elements.user2.value,
  };
  containerEl.classList.remove("hidden");
  formEl.classList.add("hidden");
  localStorage.setItem("formValue", JSON.stringify(formValue));
  createUsers(formValue);
}

const prevPlayer = localStorage.getItem("lastPlayer");
let player = prevPlayer === "X" ? "O" : "X";
console.log("next player is ", player);
let marcUp = "";

const winer = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function createCrossMarkup() {
  for (let i = 1; i <= 9; i += 1) {
    marcUp += `<div class="item" data-id="${i}"></div>`;
  }

  boxEl.insertAdjacentHTML("beforeend", marcUp);
}
createCrossMarkup();

function createUsers(data) {
  playersDiv.innerHTML = "";
  const markUp = `  
  <div class="users"><p class="first active" data-x>${data.user1} </p><p>used X</p></div>
  <div class="users"><p class="second" data-o>${data.user2} </p><p>used O</p></div>
   <button class="btn-cross fill" type="button">Restart</button>
  `;
  playersDiv.innerHTML = markUp;
}

let playerX = JSON.parse(localStorage.getItem("playerX")) || [];
let playerO = JSON.parse(localStorage.getItem("playerO")) || [];

if (playerX.length) {
  const usersFromLocalStorage = JSON.parse(localStorage.getItem("formValue"));
  createUsers(usersFromLocalStorage);
  containerEl.classList.remove("hidden");
  formEl.classList.add("hidden");

  const children = [...boxEl.children].forEach((child) => {
    if (playerX.includes(Number(child.dataset.id))) {
      child.textContent = "X";
    } else if (playerO.includes(Number(child.dataset.id))) {
      child.textContent = "O";
    }
  });
}

const onBoxElClick = (e) => {
  if (e.target.textContent) {
    return;
  }
  const resetBtnEl = document.querySelector(".btn-cross");
  e.target.textContent = player;

  const position = e.target.dataset.id;

  let first = document.querySelector(".first");
  let second = document.querySelector(".second");

  if (player === "X") {
    second.classList.remove("active");
    first.classList.add("active");

    playerX.push(Number(position));
    localStorage.setItem("playerX", JSON.stringify(playerX));
    const finish = playerX.length < 3 ? false : isWiner(playerX);
    setTimeout(() => {
      if (finish) {
        resetGame(first);
      }
      player = "O";
      localStorage.setItem("lastPlayer", "X");
    });
  } else {
    first.classList.remove("active");
    second.classList.add("active");
    playerO.push(Number(position));
    localStorage.setItem("playerO", JSON.stringify(playerO));
    const finish = playerO.length < 3 ? false : isWiner(playerO);
    setTimeout(() => {
      if (finish) {
        resetGame(second);
      }
      player = "X";
      localStorage.setItem("lastPlayer", "O");
    });
  }
  if (playerX.length + playerO.length === 9) {
    setTimeout(() => {
      resetGame();
    }, 500);
  }
  resetBtnEl.addEventListener("click", onResetBtnClick);
};

function isWiner(arr) {
  return winer.some((el) => el.every((item) => arr.includes(item)));
}
function resetGame(selector) {
  selector
    ? alert(`Player ${selector.innerText.toUpperCase()} Win!`)
    : alert("Try again!");
  setTimeout(() => {
    onResetBtnClick();
    localStorage.clear();
    return;
  }, 500);
}

function onResetBtnClick() {
  localStorage.clear();
  containerEl.classList.add("hidden");
  formEl.classList.remove("hidden");
  formEl.elements.user1.value = "";
  formEl.elements.user2.value = "";
  boxEl.innerHTML = marcUp;
  player = "X";
  playerX = [];
  playerO = [];
}

boxEl.addEventListener("click", onBoxElClick);

formEl.addEventListener("submit", onformEl);
