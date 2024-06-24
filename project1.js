const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.querySelector('.status-message');
const restartButton = document.getElementById('restartButton');
const winnerPopup = document.getElementById('winnerPopup');
const winnerMessage = document.getElementById('winnerMessage');
const closePopup = document.getElementById('closePopup');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    makeMove(cellIndex, currentPlayer);
    if (!gameActive) return;

    currentPlayer = 'O';
    statusMessage.textContent = "Computer's turn";
    setTimeout(() => {
        computerMove();
        if (gameActive) {
            currentPlayer = 'X';
            statusMessage.textContent = "Player X's turn";
        }
    }, 500);
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    checkResult();
}

function computerMove() {
    const bestMove = findBestMove();
    makeMove(bestMove, 'O');
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scores = {
    'O': 1,
    'X': -1,
    'tie': 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkResult() {
    let roundWon = false;
    let winner = null;

    for (let i = 0; i < winningCombinations.length; i++) {
        const winCombo = winningCombinations[i];
        const a = board[winCombo[0]];
        const b = board[winCombo[1]];
        const c = board[winCombo[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winner = a;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        showPopup(`Player ${winner} wins!`);
        return;
    }

    if (!board.includes('')) {
        gameActive = false;
        showPopup("It's a draw!");
        return;
    }
}

function checkWinner() {
    for (const winCombo of winningCombinations) {
        const [a, b, c] = winCombo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes('') ? null : 'tie';
}

function showPopup(message) {
    winnerMessage.textContent = message;
    winnerPopup.style.display = 'block';
}

function hidePopup() {
    winnerPopup.style.display = 'none';
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];	
    currentPlayer = 'X';
    gameActive = true;
    statusMessage.textContent = "Player X's turn";
    cells.forEach(cell => cell.textContent = '');
    hidePopup();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
closePopup.addEventListener('click', hidePopup);
