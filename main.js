// General in-game settings
const curGameSettings = {};

// Cache DOM queries
const startScreen = document.querySelector('.start-screen');
const gameScreen = document.querySelector('.game-screen');

const startButton = document.getElementById('startBtn');
const newGameButton = document.getElementById('newGame');
const restartGameButton = document.getElementById('restartGame');
const newGameButtonMobi = document.getElementById('newGameMobi');
const restartGameButtonMobi = document.getElementById('restartGameMobi');
const resumeGameButtonMobi = document.getElementById('resumeGameMobi');
const menuModalButtonMobi = document.getElementById('menuBtnMobi');
const menuModalMobi = document.getElementById('menuModal');
const soloModal = document.getElementById('soloScoreModal');
const newGameSoloModal = document.getElementById('newGameSoloScoreModal');
const restartSoloModal = document.getElementById('restartSoloScoreModal');
const multiModal = document.getElementById('multiScoreModal');
const newGameMultiModal = document.getElementById('newGameMultiScoreModal');
const restartMultiModal = document.getElementById('restartMultiScoreModal');

const gridContain = document.querySelector('.board-holder');

const timerRef = document.getElementById('soloTimer');
const scoreRef = document.getElementById('soloScore');

// Global variables
let flippedCards = 0;
let moves = 0;
let matchedCards = 0;

let [sec, min] = [0, 0];
let intervalRef;

//Required in-game objects
const inGamePlayers = {
    p1: {
        id: 1,
        active: true,
        matches: 0,
        moves: 0,
    },
    
    p2: {
        id: 2,
        active: false,
        matches: 0,
        moves: 0,
    },
    
    p3: {
        id: 3,
        active: false,
        matches: 0,
        moves: 0,
    },
    
    p4: {
        id: 4,
        active: false,
        matches: 0,
        moves: 0,
    },
};

const gameState = {
    gameActive: false,
    strTime: '',
    isRestart: false,
    hasMatched: false
};

const multiScore = {
    score1: document.getElementById('score-p1'),
    score2: document.getElementById('score-p2'),
    score3: document.getElementById('score-p3'),
    score4: document.getElementById('score-p4'),
};

const themeSelection = {
    numButton: document.getElementById('optNumbers'),
    iconButton: document.getElementById('optIcons'),
};

const playerSelection = {
    playerButton1: document.getElementById('gPlay1'),
    playerButton2: document.getElementById('gPlay2'),
    playerButton3: document.getElementById('gPlay3'),
    playerButton4: document.getElementById('gPlay4'),
};

const gridSelection = {
    gridButton4: document.getElementById('gBoard4'),
    gridButton6: document.getElementById('gBoard6'),
};

const iconsArr = [
    'fa-futbol', 'fa-futbol', 'fa-anchor', 'fa-anchor',
    'fa-flask', 'fa-flask', 'fa-sun', 'fa-sun',
    'fa-hand-spock', 'fa-hand-spock', 'fa-bug', 'fa-bug',
    'fa-moon', 'fa-moon', 'fa-snowflake', 'fa-snowflake',
    'fa-turkish-lira-sign', 'fa-turkish-lira-sign', 'fa-car', 'fa-car',
    'fa-scale-balanced', 'fa-scale-balanced', 'fa-coins', 'fa-coins',
    'fa-crosshairs', 'fa-crosshairs', 'fa-fire', 'fa-fire',
    'fa-shield', 'fa-shield', 'fa-magnifying-glass', 'fa-magnifying-glass',
    'fa-cube', 'fa-cube', 'fa-bolt', 'fa-bolt'
];

const numArr = [
    1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
    11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18
];

// Declare functions
function getGameSettings () {
    let gameTheme = document.getElementById('themeBtn');
    let gamePlayers = document.getElementById('gPlayBtn');
    let gameGrid = document.getElementById('gridBtn');

    for (let theme of gameTheme.children) {
        if (theme.classList.contains('btn-active')) {
            curGameSettings['selectedTheme'] = theme.id;
        }
    }

    for (let gPlayer of gamePlayers.children) {
        if (gPlayer.classList.contains('btn-active')) {
            curGameSettings['numOfPlayers'] = gPlayer.id;
        }
    }

    for (let grid of gameGrid.children) {
        if (grid.classList.contains('btn-active')) {
            curGameSettings['selectedGrid'] = grid.id;
        }
    }
}

function setClickedButton(clickedBtn, otherBtns) {
    if (clickedBtn.classList.contains('btn-idle')) {
        clickedBtn.classList.remove('btn-idle');
        clickedBtn.classList.add('btn-active');
    }

    for (let key in otherBtns) {
        if (otherBtns[key] === clickedBtn) continue;
        if (otherBtns[key].classList.contains('btn-active')) {
            otherBtns[key].classList.remove('btn-active');
            otherBtns[key].classList.add('btn-idle');
        }
    }
}

function generateCards(size) {
    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        row.classList.add('row', `row-${size}`);
        document.querySelector(`.board-${size}`).appendChild(row);
        
        for (j = 0; j < size; j++) {
            let card = document.createElement('div');
            card.classList.add('card', `card-${size}`);
            document.querySelectorAll(`.row-${size}`)[i].appendChild(card);
        }
    }
}

function generateRandomContent(size, theme) {
    let cards = document.querySelectorAll(`.card-${size}`);
    let gameContentArr = [];
    if (theme === 'optNumbers') {
        gameContentArr = numArr.slice(0);
    } else {
        gameContentArr = iconsArr.slice(0);
    }

    gameContentArr = size === 4 ? gameContentArr.slice(0, 16) : gameContentArr.slice(0, 36);

    cards.forEach((card) => {
        let randNum = Math.floor(Math.random() * gameContentArr.length);

        if (theme === 'optNumbers') {
            const span = document.createElement("span");
            span.classList.add("__hide");
            span.textContent = gameContentArr[randNum];
            gameContentArr.splice(randNum, 1);
            card.appendChild(span);
        } else {
            const i = document.createElement("i");
            i.classList.add("fa-solid", `${gameContentArr[randNum]}`, "__hide");
            gameContentArr.splice(randNum, 1);
            card.appendChild(i); 
        }   
    })
}

function initGame(gridSize, curTheme) {
    generateCards(gridSize);
    generateRandomContent(gridSize, curTheme);
    attachEventListeners(gridSize);
}

function gameStartInit() {

    if (startScreen.classList.contains('hide-screen') === false) {
        startScreen.classList.add('hide-screen');
    }

    if (gameScreen.classList.contains('hide-screen') === true) {
        gameScreen.classList.remove('hide-screen');
    }

    getGameSettings();

    let curTheme = curGameSettings.selectedTheme;
    let numPlayers = parseInt(curGameSettings.numOfPlayers.slice(-1));
    let gridSize = parseInt(curGameSettings.selectedGrid.slice(-1));

    if (gridSize === 4) {
        document.querySelector('.board-4').classList.remove('__hide');
        document.querySelector('.board-6').classList.add('__hide');
    } else {
        document.querySelector('.board-6').classList.remove('__hide');
        document.querySelector('.board-4').classList.add('__hide');
    }

    if (numPlayers === 1) {
        document.querySelector('.board-end-solo').classList.remove('__hide');
        document.querySelector('.player-turn').classList.add('__hide');
        curGameSettings['multiMode'] = false;
    } else {
        document.querySelector('.player-turn').classList.remove('__hide');
        document.querySelector('.board-end-solo').classList.add('__hide');
        curGameSettings['multiMode'] = true;
    }

    initGame(gridSize, curTheme);
}

function timer() {
    sec++;

    if (sec === 60) {
        min++;
        sec = 0;
    }

    gameState.strTime = `${min}:${sec <= 9 ? '0' + sec : sec}`;

    timerRef.innerHTML = gameState.strTime;
}

function startTimer() {
    gameState.gameActive = true;
    
    intervalRef = setInterval(timer, 1000);
}

function resetStartScreen(setting) {
    for (let i = 0; i < setting.children.length; i++) {
        if (setting.children[i].classList.contains('btn-active')) {
            setting.children[i].classList.remove('btn-active');
            setting.children[i].classList.add('btn-idle');
        }
    }
    setting.children[0].classList.remove('btn-idle');
    setting.children[0].classList.add('btn-active');
}

function resetValues() {
    [sec, min] = [0, 0];
    flippedCards = 0;
    moves = 0;
    matchedCards = 0;
    gameState.gameActive = false;

    if (gameState.isRestart === false) {

        let gameTheme = document.getElementById('themeBtn');
        let gamePlayers = document.getElementById('gPlayBtn');
        let gameGrid = document.getElementById('gridBtn');

        resetStartScreen(gameTheme);
        resetStartScreen(gamePlayers);
        resetStartScreen(gameGrid);

        curGameSettings.numOfPlayers = 'gPlay1';
        curGameSettings.selectedGrid = 'gBoard4';
        curGameSettings.selectedTheme = 'optNumbers';


    }

    if (curGameSettings.multiMode) {
        let pTurn = document.querySelectorAll('.turn');
        let cTurn = document.querySelectorAll('.cur-turn');
    
        for (let p in inGamePlayers) {
            
            if (p === 'p1') {
                inGamePlayers[p].active = true;
            } else {
                inGamePlayers[p].active = false;
            }
            
            inGamePlayers[p].matches = 0;
            inGamePlayers[p].moves = 0;  
        }
    
        for (let score in multiScore) {
            multiScore[score].textContent = 0;
        }
    
        for (let i = 0; i < pTurn.length; i++) {
            if (pTurn[i].classList.contains('turn-active')) {
                pTurn[i].classList.remove('turn-active');
            }

            if (!cTurn[i].classList.contains('hidden')) {
                cTurn[i].classList.add('hidden');
            }
        }
        pTurn[0].classList.add('turn-active');
        cTurn[0].classList.remove('hidden');

        gameState.isRestart = false;

        curGameSettings.multiMode = false;
    }
    clearInterval(intervalRef);

    gameState.strTime = `${min}:${sec <= 9 ? '0' + sec : sec}`;

    timerRef.innerHTML = gameState.strTime;
    scoreRef.innerHTML = moves;
}

function resetBoard() {
    const rows = document.querySelectorAll(".row");
    rows.forEach((row) => {
      row.remove();
    });

    resetValues();
}

function revealCardValue(card) {
    flippedCards++;
    let eventChild = card.children[0];
    let numPlayers = parseInt(curGameSettings.numOfPlayers.slice(-1));
    let shownCards;

    if (flippedCards <= 2) {
        eventChild.classList.remove('__hide')
        card.classList.add('card-clicked')
    }

    if (curGameSettings.multiMode === false) {
        if (flippedCards === 2) {
            shownCards = gridContain.querySelectorAll('.card-clicked:not(.card-matched)');
            moves++;

            checkMatch(shownCards);

        setTimeout(() => {
            hideCardValue()
        }, 600)

            scoreRef.innerHTML = moves;
        }
    } else {
        if (flippedCards === 2) {
            shownCards = gridContain.querySelectorAll('.card-clicked:not(.card-matched)');
            let pTurn = document.querySelectorAll('.turn');
            let cTurn = document.querySelectorAll('.cur-turn')

            if (inGamePlayers.p1.active) {
                inGamePlayers.p1.moves++;

                checkMatch(shownCards, multiScore.score1, inGamePlayers.p1);

                inGamePlayers.p1.active = false;
                inGamePlayers.p2.active = true;
                renderTurn(pTurn, cTurn, 0, 1);
            } else if (inGamePlayers.p2.active) {
                inGamePlayers.p2.moves++;

                checkMatch(shownCards, multiScore.score2, inGamePlayers.p2);

                if (numPlayers === 2) {
                    inGamePlayers.p2.active = false;
                    inGamePlayers.p1.active = true;
                    renderTurn(pTurn, cTurn, 1, 0);
                } else {
                    inGamePlayers.p2.active = false;
                    inGamePlayers.p3.active = true;
                    renderTurn(pTurn, cTurn, 1, 2);
                }
            } else if (inGamePlayers.p3.active) {
                inGamePlayers.p3.moves++;

                checkMatch(shownCards, multiScore.score3, inGamePlayers.p3);

                if (numPlayers === 3) {
                    inGamePlayers.p3.active = false;
                    inGamePlayers.p1.active = true;
                    renderTurn(pTurn, cTurn, 2, 0);
                } else {
                    inGamePlayers.p3.active = false;
                    inGamePlayers.p4.active = true;
                    renderTurn(pTurn, cTurn, 2, 3);
                }
            } else {
                inGamePlayers.p4.moves++;

                checkMatch(shownCards, multiScore.score4, inGamePlayers.p4);

                inGamePlayers.p4.active = false;
                inGamePlayers.p1.active = true;
                renderTurn(pTurn, cTurn, 3, 0);
            }

            gameState.hasMatched = false;

            setTimeout(() => {
                hideCardValue()
            }, 600);
        }
    }
}

function checkMatch(shownCards, ...args) {
    if (shownCards[0].innerHTML === shownCards[1].innerHTML) {
        shownCards[0].classList.add('card-matched');
        shownCards[1].classList.add('card-matched');

        if (curGameSettings.multiMode === true) {
            args[0].textContent = ++args[1].matches;
            matchedCards++;
            gameState.hasMatched = true;
        } else {
            matchedCards++;
        }
    }
}

function renderTurn(pTurn, cTurn, idx1, idx2) {
    pTurn[idx1].classList.remove('turn-active');
    pTurn[idx2].classList.add('turn-active');
    cTurn[idx1].classList.add('hidden');
    cTurn[idx2].classList.remove('hidden');
}

function hideCardValue() {
    gridContain.querySelectorAll('.card:not(.card-matched)').forEach(card => {
        card.classList.remove('card-clicked')
        card.children[0].classList.add('__hide')
    })

    flippedCards = 0
}

function determineWinner() {
    let playersArr = Object.values(inGamePlayers);
    playersArr.sort((a, b) => b.matches - a.matches);

    let hasTie = false;
    let tieValues = [];
    let countScore = {};
    let gameOverviewTitle = document.querySelector('.game-overview-title');
    let gameOverviewResults = document.querySelector('.game-overview-results');


    for (const num of playersArr) {
        if (num.matches === 0) continue;
        countScore[num.matches] = countScore[num.matches] ? countScore[num.matches] + 1 : 1;

        if (countScore[num.matches] > 1) {
            hasTie = true;
            tieValues.push(num.matches);
        }
    }
    let strTitle = (hasTie && (tieValues[0] === playersArr[0].matches)) ? `It's a tie!` : `Player ${playersArr[0].id} Wins!`;

    gameOverviewTitle.textContent = strTitle;

    const multiModalContent = `
            ${
                playersArr.map( obj => `
                <div class="game-overview-result">
                    <p class="game-result-label">Player ${obj.id}</p>
                    <p class="game-result-value">${obj.matches} Pairs</p>
                </div>
                `).join('')
            }
    `;

    gameOverviewResults.innerHTML = multiModalContent;

    for (let i = 0; i < 4; i++) {
        let winEl = document.querySelectorAll('.game-overview-result')[i].children[0];
        if (playersArr[i].matches === playersArr[0].matches) {
            document.querySelectorAll('.game-overview-result')[i].classList.add('game-overview-winner');
            winEl.textContent = winEl.textContent + ' (Winner!)';
        }
    }
}

function endGame() {
    let soloEndModalMove = document.querySelector('.soloModalMoves');
    let soloEndModalTime = document.querySelector('.soloModalTime');
    let numPlayers = parseInt(curGameSettings.numOfPlayers.slice(-1));

    soloEndModalMove.textContent = moves;
    soloEndModalTime.textContent = gameState.strTime;
    if (numPlayers === 1) {
        soloModal.classList.remove('__hide');
    } else {
        determineWinner();
        multiModal.classList.remove('__hide');
    }
}

// Event activites

startButton.addEventListener('click', () => {
    gameStartInit();
});

newGameButton.addEventListener('click', () => {
    resetBoard();
    gameScreen.classList.add('hide-screen');
    startScreen.classList.remove('hide-screen');
});

restartGameButton.addEventListener('click', () => {
    gameState.isRestart = true;
    resetBoard();
    gameStartInit();
});

newGameButtonMobi.addEventListener('click', () => {
    resetBoard();
    gameScreen.classList.add('hide-screen');
    startScreen.classList.remove('hide-screen');
    menuModalMobi.classList.add('__hide');
});

restartGameButtonMobi.addEventListener('click', () => {
    gameState.isRestart = true;
    resetBoard();
    gameStartInit();
    menuModalMobi.classList.add('__hide');
});

resumeGameButtonMobi.addEventListener('click', () => {
    startTimer();
    menuModalMobi.classList.add('__hide');
});

menuModalButtonMobi.addEventListener('click', () => {
    clearInterval(intervalRef);
    document.getElementById('menuModal').classList.remove('__hide');
});

newGameSoloModal.addEventListener('click', () => {
    resetBoard();
    gameScreen.classList.add('hide-screen');
    startScreen.classList.remove('hide-screen');
    soloModal.classList.add('__hide');
});

restartSoloModal.addEventListener('click', () => {
    gameState.isRestart = true;
    resetBoard();
    gameStartInit();
    soloModal.classList.add('__hide');
});

newGameMultiModal.addEventListener('click', () => {
    resetBoard();
    gameScreen.classList.add('hide-screen');
    startScreen.classList.remove('hide-screen');
    multiModal.classList.add('__hide');
});

restartMultiModal.addEventListener('click', () => {
    gameState.isRestart = true;
    resetBoard();
    gameStartInit();
    multiModal.classList.add('__hide');
});

function attachEventListeners() {
    gridContain.addEventListener('click', clickCardEvent)
}

function clickCardEvent(event) {
    const eventTarget = event.target;
    const eventChild = eventTarget.children[0];
    const gSize = parseInt(curGameSettings.selectedGrid.slice(-1));

    if (eventTarget.classList.contains('card') && !eventChild.classList.contains('card-clicked')) {
        revealCardValue(eventTarget)
    } 

    if (gameState.gameActive === false && curGameSettings.multiMode === false) {
        startTimer();
    }

    if (gSize === 4 && matchedCards === 8) {
        clearInterval(intervalRef);
        endGame();
    } else if (matchedCards === 18) {
        clearInterval (intervalRef);
        endGame();
    }
}

function attachSettingEventListener(domEl, obj) {
    domEl.addEventListener('click', () => setClickedButton(domEl, obj));
}

attachSettingEventListener(themeSelection.iconButton, themeSelection);
attachSettingEventListener(themeSelection.numButton, themeSelection);
attachSettingEventListener(playerSelection.playerButton1, playerSelection);
attachSettingEventListener(playerSelection.playerButton2, playerSelection);
attachSettingEventListener(playerSelection.playerButton3, playerSelection);
attachSettingEventListener(playerSelection.playerButton4, playerSelection);
attachSettingEventListener(gridSelection.gridButton4, gridSelection);
attachSettingEventListener(gridSelection.gridButton6, gridSelection);