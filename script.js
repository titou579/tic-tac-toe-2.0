let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = false;
let gameMode = "2players"; // ou "ai"
let scores = { X: 0, O: 0 };

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
    [0, 4, 8], [2, 4, 6]             // Diagonales
];

// Éléments du DOM
const cells = document.querySelectorAll('.cell');
const modeSelect = document.getElementById('mode');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const boardEl = document.getElementById('board');
const setupEl = document.getElementById('setup');
const scoreboardEl = document.getElementById('scoreboard');

startBtn.addEventListener('click', () => {
    gameMode = modeSelect.value;
    setupEl.classList.add('hidden');
    boardEl.classList.remove('hidden');
    scoreboardEl.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    resetGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);

function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[index] !== "" || !isGameActive) return;

    makeMove(index, currentPlayer);

    if (checkWin(boardState, currentPlayer)) {
        endGame(`${currentPlayer} a gagné !`, currentPlayer);
        return;
    }
    if (boardState.every(cell => cell !== "")) {
        endGame("Match nul !", null);
        return;
    }

    // Changement de tour
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (gameMode === "ai" && currentPlayer === "O" && isGameActive) {
        setTimeout(aiMove, 300); // Petit délai pour simuler la réflexion
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].innerText = player;
}

function aiMove() {
    let bestMove = minimax(boardState, "O").index;
    makeMove(bestMove, "O");

    if (checkWin(boardState, "O")) {
        endGame("L'IA a gagné !", "O");
        return;
    }
    if (boardState.every(cell => cell !== "")) {
        endGame("Match nul !", null);
        return;
    }
    currentPlayer = "X";
}

function checkWin(board, player) {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function endGame(message, winner) {
    isGameActive = false;
    alert(message);
    if (winner) {
        scores[winner]++;
        document.getElementById(`score-${winner.toLowerCase()}`).innerText = scores[winner];
    }
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    cells.forEach(cell => cell.innerText = "");
}

// Algorithme Minimax pour l'IA imbattable
function minimax(newBoard, player) {
    let availSpots = newBoard.map((val, i) => val === "" ? i : null).filter(val => val !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
