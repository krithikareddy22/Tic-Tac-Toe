const selectBox = document.querySelector(".game-start-menu"),
  selectPlayerX = document.querySelector(".icon-x"),
  selectPlayerCircle = document.querySelector(".icon-circle"),
  gameBoard = document.querySelector("#game-board"),
  players = document.querySelector(".pick-players"),
  playerButton = document.querySelectorAll(".pick-player-button"),
  cellElements = document.querySelectorAll("#game-board-grid section span"),
  gameEndMessage = document.querySelector("#game-end-message"),
  restartGameMessage = document.querySelector(".restart-game-message"),
  gameTiedMessage = document.querySelector("#game-tied-message"),
  backButton = document.querySelector(".back-button"),
  restartButton = document.querySelector(".restart-button"),
  quitButton = document.querySelector(".quit-button"),
  quitTiedButton = document.querySelector(".quit-tied-button"),
  cancelRestartButton = document.querySelector(".cancel-restart-button"),
  confirmRestartButton = document.querySelector(".confirm-restart-button"),
  nextRoundButton = document.querySelector(".next-round-button"),
  nextRoundTiedButton = document.querySelector(".next-round-tied-button"),
  playerDisplay = document.querySelector("#playerDisplay"),
  newGameButton = document.querySelector("#new-game-solo"),
  headerLarge = document.querySelector(".game-end-header-large"),
  headerSmall = document.querySelector(".game-end-header-small"),
  turnButton = document.querySelector(".turn-button");

let playerXScore = 0,
  playerCircleScore = 0,
  tiesScore = 0,
  playerButtonClicked = false,
  runAi = true,
  playerSign = "";

const iconX = new Image();
iconX.src = "./images/icon-x.svg";
iconX.alt = "X";
iconX.style.marginRight = "10px";

const iconCircle = new Image();
iconCircle.src = "./images/icon-o.svg";
iconCircle.alt = "O";
iconCircle.style.marginRight = "10px";

window.onload = () => {
  cellElements.forEach((cell) => {
    cell.addEventListener("click", function () {
      clickedBox(this);
    });
  });
  playerDisplay.style.display = "none";
};

newGameButton.addEventListener("click", () => {
  if (!playerButtonClicked) {
    alert("Please choose X or O to start!");
  } else {
    selectBox.classList.add("hide");
    gameBoard.classList.remove("hide");
  }
});

selectPlayerX.addEventListener("click", () => {
  playerSign = "x-humanPlayer";
  playerDisplay.innerHTML = "You chose X.";
  playerDisplay.style.display = "block";
  selectPlayerX.classList.add("light-background");
  selectPlayerCircle.classList.remove("light-background");
  updateTurnButton("x");
  document.getElementById("player-one").innerHTML = "X (You)";
  document.getElementById("player-two").innerHTML = "O (CPU)";
  playerButtonClicked = true;
});

selectPlayerCircle.addEventListener("click", () => {
  playerSign = "circle-humanPlayer";
  playerDisplay.innerHTML = "You chose O.";
  playerDisplay.style.display = "block";
  selectPlayerCircle.classList.add("light-background");
  selectPlayerX.classList.remove("light-background");
  updateTurnButton("o");
  document.getElementById("player-one").innerHTML = "X (CPU)";
  document.getElementById("player-two").innerHTML = "O (You)";
  playerButtonClicked = true;
  aiPlayer(); // CPU starts
});
restartButton.addEventListener("click", () => {
  restartGameMessage.classList.add("show");
});
cancelRestartButton.addEventListener("click", () => {
  restartGameMessage.classList.remove("show");
});
confirmRestartButton.addEventListener("click", () => {
  restartGameMessage.classList.remove("show");
  playerXScore = 0;
  playerCircleScore = 0;
  tiesScore = 0;
  updateScoresDisplay();
  nextRound();
});
quitButton.addEventListener("click", () => location.reload());
quitTiedButton.addEventListener("click", () => location.reload());
nextRoundButton.addEventListener("click", nextRound);
nextRoundTiedButton.addEventListener("click", nextRound);
function clickedBox(element) {
  if (element.id) return;
  element.classList.add(playerSign.includes("x") ? "x" : "circle");
  element.setAttribute("id", playerSign);
  element.style.pointerEvents = "none";
  handleTurnButton();
  if (!selectWinner()) {
    gameBoard.style.pointerEvents = "none";
    setTimeout(() => {
      aiPlayer();
    }, Math.floor(Math.random() * 100 + 200));
  }
}
function aiPlayer() {
  if (!runAi) return;
  let emptyBoxes = [];
  cellElements.forEach((cell, index) => {
    if (!cell.id) emptyBoxes.push(index);
  });
  if (emptyBoxes.length === 0) return;
  let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  let cell = cellElements[randomIndex];

  let aiSign = playerSign.includes("x") ? "circle-aiPlayer" : "x-aiPlayer";
  cell.classList.add(aiSign.includes("x") ? "x" : "circle");
  cell.setAttribute("id", aiSign);
  cell.style.pointerEvents = "none";
  handleTurnButton(aiSign);
  selectWinner(aiSign);
  gameBoard.style.pointerEvents = "auto";
}
function selectWinner(currentSign = playerSign) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of winCombos) {
    if (
      cellElements[a].id === currentSign &&
      cellElements[b].id === currentSign &&
      cellElements[c].id === currentSign
    ) {
      showWinner(currentSign);
      return true;
    }
  }

  if ([...cellElements].every((cell) => cell.id)) {
    tiesScore++;
    updateScoresDisplay();
    headerLarge.textContent = "ROUND TIED";
    headerLarge.style.color = "#A8BFC9";
    gameTiedMessage.classList.add("show");
    return true;
  }
  return false;
}
function showWinner(sign) {
  runAi = false;
  updateScores(sign);
  headerSmall.textContent = sign.includes("aiPlayer") ? "You lost..." : "You won!";
  const icon = sign.includes("x") ? iconX : iconCircle;
  headerLarge.innerHTML = "";
  headerLarge.appendChild(icon.cloneNode());
  headerLarge.innerHTML += " takes the round";
  headerLarge.style.color = sign.includes("x") ? "#31c3bd" : "#f2b137";
  gameEndMessage.classList.add("show");
}
function updateTurnButton(mark) {
  turnButton.innerHTML = "";
  if (mark === "x") {
    turnButton.appendChild(iconX.cloneNode());
  } else {
    turnButton.appendChild(iconCircle.cloneNode());
  }
  turnButton.innerHTML += " Turn";
  turnButton.style.color = "#a8bfc9";
}
function handleTurnButton(current = playerSign) {
  updateTurnButton(current.includes("x") ? "o" : "x");
}

function updateScores(sign) {
  if (sign.includes("x")) playerXScore++;
  else playerCircleScore++;
  updateScoresDisplay();
}
function updateScoresDisplay() {
  document.getElementById("playerXScore").textContent = playerXScore;
  document.getElementById("playerCircleScore").textContent = playerCircleScore;
  document.getElementById("tiesScore").textContent = tiesScore;
}
function nextRound() {
  runAi = true;
  gameEndMessage.classList.remove("show");
  gameTiedMessage.classList.remove("show");
  cellElements.forEach((cell) => {
    cell.removeAttribute("id");
    cell.classList.remove("x", "circle");
    cell.style.pointerEvents = "auto";
  });
  if (playerSign.includes("circle")) aiPlayer(); // If user is O, CPU plays first
}
