const game = {
    player: {
        name: "Player",
        score: 0,
    },
    computer: {
        name: "Computer",
        score: 0,
    },
}

const playgame = () => {
    const gameBoard = document.querySelector(".game-board"); // Common parent element
    const buttons = Array.from(gameBoard.querySelectorAll(".button")); // Store all buttons initially
    const result = document.querySelector(".result");
    const playerScore = document.querySelector(".player-score");
    const computerScore = document.querySelector(".computer-score");
    const resetButton = document.querySelector(".reset");

    gameBoard.addEventListener('click', (event) => {
        const button = event.target;
        if (button.classList.contains('btn')) {
            if (button.classList.contains('disabled')) return;
            button.classList.add('clicked');
            button.classList.add('disabled');
            
            button.textContent = button.textContent === 'X' ? 'O' : 'X'; // Fix toggle logic
            console.log('clicked');
        }
    });
    
    };
    
    playgame();
