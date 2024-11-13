const boardElement = document.getElementById('board');
const winnerElement = document.getElementById('winner');
const resetButton = document.getElementById('reset');
const playerModeButton = document.getElementById('playerMode');
const aiModeButton = document.getElementById('aiMode');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let isVsAI = false;

// Score tracking
let xWins = 0;
let oWins = 0;
let draws = 0;

function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.textContent = cell;

    if (cell) {
      cellElement.classList.add('clicked');
    }

    cellElement.addEventListener('click', () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(index) {
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  if (checkWinner()) {
    winnerElement.textContent = `${currentPlayer} Wins!`;
    updateScore(currentPlayer);
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    winnerElement.textContent = "It's a draw!";
    draws++;
    scoreDraw.textContent = draws;
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  renderBoard();

  if (isVsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (gameOver) return;

  const bestMove = findBestMove();
  board[bestMove] = 'O';

  if (checkWinner()) {
    winnerElement.textContent = "AI Wins!";
    oWins++;
    scoreO.textContent = oWins;
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    winnerElement.textContent = "It's a draw!";
    draws++;
    scoreDraw.textContent = draws;
    gameOver = true;
    return;
  }

  currentPlayer = 'X';
  renderBoard();
}

function findBestMove() {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);
  return availableMoves[0];  // AI just picks the first available move
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function updateScore(winner) {
  if (winner === 'X') {
    xWins++;
    scoreX.textContent = xWins;
  } else {
    oWins++;
    scoreO.textContent = oWins;
  }
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winnerElement.textContent = '';
  renderBoard();
}

function startGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winnerElement.textContent = '';
  boardElement.style.display = 'grid';
  resetButton.style.display = 'inline-block';
  renderBoard();
}

playerModeButton.addEventListener('click', () => {
  isVsAI = false;
  startGame();
});

aiModeButton.addEventListener('click', () => {
  isVsAI = true;
  startGame();
});

resetButton.addEventListener('click', resetGame);
