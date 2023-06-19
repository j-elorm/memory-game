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
]