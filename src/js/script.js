// Encapsulate the game logic and UI in an IIFE to avoid polluting global scope
(() => {
    // Game board state: 3x3 array of strings: '', 'X', or 'O'
    const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let currentPlayer = 'X';
    let gameOver = false;
    let winner = null;

    const boardElement = document.querySelector('.board');
    const messageElement = document.querySelector('.message');
    const resetButton = document.getElementById('reset');
    const cells = Array.from(document.querySelectorAll('.cell'));

    // Initialize the game UI and event listeners
    function init() {
        cells.forEach((cell, index) => {
            cell.textContent = '';
            cell.disabled = false;
            cell.removeEventListener('click', onCellClick);
            cell.addEventListener('click', onCellClick);
            cell.setAttribute('tabindex', '0');
        });
        messageElement.textContent = '';
        messageElement.classList.add('d-none');
        currentPlayer = 'X';
        gameOver = false;
        winner = null;
        updateMessage(`Current Player: ${currentPlayer}`);
    }

    // Handle cell click event
    function onCellClick(event) {
        if (gameOver) return;

        const index = cells.indexOf(event.target);
        const row = Math.floor(index / 3);
        const col = index % 3;

        if (board[row][col] !== '') return;

        makeMove(row, col, currentPlayer);
        render();

        const winPlayer = checkWinner();
        if (winPlayer) {
            winner = winPlayer;
            gameOver = true;
            announceWinner();
            return;
        }

        if (isDraw()) {
            gameOver = true;
            winner = null;
            announceWinner();
            return;
        }

        switchPlayer();

        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }

    // Make a move on the board
    function makeMove(row, col, player) {
        board[row][col] = player;
    }

    // Switch current player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateMessage(`Current Player: ${currentPlayer}`);
    }

    // Render the board UI
    function render() {
        for (let i = 0; i < cells.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            cells[i].textContent = board[row][col];
            cells[i].disabled = board[row][col] !== '' || gameOver;
        }
    }

    // Check for a winner and return the winning player ('X' or 'O') or null if no winner
    function checkWinner() {
        // Check rows, columns, diagonals
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0] !== '' &&
                board[i][0] === board[i][1] &&
                board[i][1] === board[i][2]
            ) {
                return board[i][0];
            }
            if (
                board[0][i] !== '' &&
                board[0][i] === board[1][i] &&
                board[1][i] === board[2][i]
            ) {
                return board[0][i];
            }
        }
        if (
            board[0][0] !== '' &&
            board[0][0] === board[1][1] &&
            board[1][1] === board[2][2]
        ) {
            return board[0][0];
        }
        if (
            board[0][2] !== '' &&
            board[0][2] === board[1][1] &&
            board[1][1] === board[2][0]
        ) {
            return board[0][2];
        }
        return null;
    }

    // Check if the game is a draw (no empty cells)
    function isDraw() {
        return board.flat().every(cell => cell !== '');
    }

    // Announce the winner or draw
    function announceWinner() {
        messageElement.classList.remove('d-none');
        if (winner === 'X') {
            messageElement.textContent = "You win!";
        } else if (winner === 'O') {
            messageElement.textContent = "Computer wins!";
        } else {
            messageElement.textContent = "It's a draw!";
        }
    }

    // Update the message element text
    function updateMessage(text) {
        messageElement.textContent = text;
        messageElement.classList.remove('d-none');
    }

    // Simple AI for computer move (O)
    function computerMove() {
        if (gameOver) return;

        // Try to win
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    if (checkWinner() === 'O') {
                        winner = 'O';
                        gameOver = true;
                        render();
                        announceWinner();
                        return;
                    }
                    board[i][j] = '';
                }
            }
        }

        // Try to block X
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    if (checkWinner() === 'X') {
                        board[i][j] = 'O';
                        render();
                        switchPlayer();
                        return;
                    }
                    board[i][j] = '';
                }
            }
        }

        // Otherwise, pick first empty cell
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    render();
                    switchPlayer();
                    return;
                }
            }
        }
    }

    // Reset game handler
    resetButton.addEventListener('click', () => {
        // Clear board state
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
            }
        }
        gameOver = false;
        winner = null;
        currentPlayer = 'X';
        messageElement.textContent = '';
        messageElement.classList.add('d-none');
        render();
        updateMessage(`Current Player: ${currentPlayer}`);
    });

    // Initialize game on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        init();
        render();
    });
})();
