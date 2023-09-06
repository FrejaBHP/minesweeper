window.oncontextmenu = function () {
    return false;     // cancel default menu
}

const GameBoard = [];
const gridX = 10; //default 10
const gridY = 10; //default 10
const numberOfBombs = 18; //default 18

const squareSize = 32;

const colourDarkGrey = "rgba(135, 136, 143, 1)";
const colourLightGrey = "rgba(192, 192, 192, 1)";
const colourWhite = "rgba(255, 255, 255, 1)";
const colourDefBtn = "rgba(233, 233, 237, 1)";
const colourGreen = "rgba(80, 140, 80, 1)";
const colourRed = "rgba(255, 0, 0, 1)";

const flagPath = "files/flag32px.png";
const flagAltPath = "files/flagalt32px.png";
const minePath = "files/mine32px.png";
const guessedMinePath = "files/guessedmine32px.png";
const facePath = "files/face36px.png";
const faceWinPath = "files/win36px.png";
const faceLosePath = "files/lose36px.png";

const numberPath = [
    "files/one32px.png",
    "files/two32px.png",
    "files/three32px.png",
    "files/four32px.png",
    "files/five32px.png",
    "files/six32px.png",
    "files/seven32px.png",
    "files/eight32px.png"
];

const digitPath = [
    "files/digit0.png",
    "files/digit1.png",
    "files/digit2.png",
    "files/digit3.png",
    "files/digit4.png",
    "files/digit5.png",
    "files/digit6.png",
    "files/digit7.png",
    "files/digit8.png",
    "files/digit9.png"
];

let startX = 0;
let startY = 0;
let gameRunning = true;
let bombsGenerated = false;
let bombFlags = 0;

let startingTime = 0;
let measureTime = false;
let seconds = 0;
let timerHundreds = 0;
let timerTens = 0;
let timerOnes = 0;
let bombsHundreds = 0;
let bombsTens = 0;
let bombsOnes = 0;

class BoardSquare {
    HasBomb = false;
    IsFlagged = false;
    IsOpened = false;
    NoOfNeighbouringBombs = 0;
    X;
    Y;
    IsHeld = false;
    IsLongClicked = false;

    constructor (x, y) {
        this.X = x;
        this.Y = y;
    }

    FindNeighbours() {
        let checkN = true;
        let checkNE = true;
        let checkE = true;
        let checkSE = true;
        let checkS = true;
        let checkSW = true;
        let checkW = true;
        let checkNW = true;

        if (this.X === 0) {
            checkSW = false;
            checkW = false;
            checkNW = false;
        }

        if (this.X === gridX - 1) {
            checkNE = false;
            checkE = false;
            checkSE = false;
        }

        if (this.Y === 0) {
            checkN = false;
            checkNE = false;
            checkNW = false;
        }

        if (this.Y === gridY - 1) {
            checkSE = false;
            checkS = false;
            checkSW = false;
        }      

        if (checkN)
            this.CheckNeighbour(GameBoard[this.X][this.Y-1]);
        if (checkNE)
            this.CheckNeighbour(GameBoard[this.X+1][this.Y-1]);
        if (checkE)
            this.CheckNeighbour(GameBoard[this.X+1][this.Y]);
        if (checkSE)
            this.CheckNeighbour(GameBoard[this.X+1][this.Y+1]);
        if (checkS)
            this.CheckNeighbour(GameBoard[this.X][this.Y+1]);
        if (checkSW)
            this.CheckNeighbour(GameBoard[this.X-1][this.Y+1]);
        if (checkW)
            this.CheckNeighbour(GameBoard[this.X-1][this.Y]);
        if (checkNW)
            this.CheckNeighbour(GameBoard[this.X-1][this.Y-1]);

        document.getElementById("button" + this.X + "-" + this.Y).style.background = colourLightGrey;
        document.getElementById("button" + this.X + "-" + this.Y).style.border = ("1px solid") + " " + colourDarkGrey;
        if (this.NoOfNeighbouringBombs !== 0) {
            document.getElementById("button" + this.X + "-" + this.Y).style.backgroundImage = `url("${numberPath[this.NoOfNeighbouringBombs - 1]}")`;
        }
        this.IsOpened = true;
    }

    CheckNeighbour(neighbour) {
        if (neighbour.HasBomb === true) {
            this.NoOfNeighbouringBombs++;
        }
    }
}

setInterval(Timer, 1000);

function Timer() {
    if (measureTime) {
        if (seconds < 999) {
            seconds++;
            let digits = seconds.toString().split('');
            let realDigits = digits.map(Number);

            if (realDigits[2] != null) {
                document.getElementById("timerDigit100").src = digitPath[realDigits[0]];
                document.getElementById("timerDigit10").src = digitPath[realDigits[1]];
                document.getElementById("timerDigit1").src = digitPath[realDigits[2]];
            }

            else if (realDigits[1] != null) {
                document.getElementById("timerDigit10").src = digitPath[realDigits[0]];
                document.getElementById("timerDigit1").src = digitPath[realDigits[1]];
            }

            else {
                document.getElementById("timerDigit1").src = digitPath[realDigits[0]];
            }
        }
    }
}

function UpdateBombCounter() {
    let bombsLeft = numberOfBombs - bombFlags;

    let digits = bombsLeft.toString().split('');
    let realDigits = digits.map(Number);

    if (realDigits[2] != null) {
        document.getElementById("bombsDigit100").src = digitPath[realDigits[0]];
        document.getElementById("bombsDigit10").src = digitPath[realDigits[1]];
        document.getElementById("bombsDigit1").src = digitPath[realDigits[2]];
    }

    else if (realDigits[1] != null) {
        if (bombsLeft === 99) {
            document.getElementById("bombsDigit100").src = digitPath[0];
        }
        document.getElementById("bombsDigit10").src = digitPath[realDigits[0]];
        document.getElementById("bombsDigit1").src = digitPath[realDigits[1]];
    }

    else {
        if (bombsLeft === 9) {
            document.getElementById("bombsDigit10").src = digitPath[0];
        }
        document.getElementById("bombsDigit1").src = digitPath[realDigits[0]];
    }
}

function StartGame() {
    CreateGrid();
    ChangePictureState(0);
}

function CreateGrid() {
    document.getElementById("gameGrid").style.gridTemplateColumns = `repeat(${gridY}, ${squareSize}px)`;
    document.getElementById("gameGrid").style.gridTemplateRows = `repeat(${gridX}, ${squareSize}px)`;
    for (let y = 0; y < gridY; y++) {
        let boardY = [];

        for (let x = 0; x < gridX; x++) {
            let boardSquare = document.createElement("div");
            boardSquare.classList.add("Square");
            boardSquare.id = "square" + x + "-" + y;
            boardSquare.style.gridRow = y+1;
            boardSquare.style.gridColumn = x+1;

            let boardSquareButton = document.createElement("button");
            boardSquareButton.classList.add("SquareButton");
            boardSquareButton.type = "button";
            boardSquareButton.id = "button" + x + "-" + y;
            boardSquareButton.style.borderWidth = (squareSize / 8) + "px";
            boardSquareButton.style.backgroundColor = colourLightGrey;

            boardSquareButton.onmousedown = function(e) {
                HoldSquare(x, y);
            }
            boardSquareButton.onmouseup = function(e) {
                ClickSquare(x, y, e.button);
            }
			
            boardSquare.appendChild(boardSquareButton);

            document.getElementById("gameGrid").append(boardSquare);

            let boardX = new BoardSquare(y, x);
            boardY.push(boardX);
        }
        GameBoard.push(boardY);
    }

    document.getElementById("gameInterface").style.width = (squareSize * gridX) + "px";
    document.getElementById("playerStatus").style.width = (squareSize + 4) + "px";
    
    var digits = document.getElementsByClassName("DigiDigit");
    for (let index = 0; index < digits.length; index++) {
        digits[index].style.height = (squareSize + 4) + "px";
    }
}

function GenerateBombs() {
    let bomberXY = new Set();
    let newNum = 0;
    
    for (let bombs = 0; bombs < numberOfBombs;) {
        let repeat = true;
        while (repeat) {
            newNum = Math.floor(Math.random() * ((gridX * gridY) - 1) + 0);
            if (!bomberXY.has(newNum)) {
                let x = newNum % gridX;
                let y = Math.floor(newNum / gridY);
                if (x != startX || y != startY) {
                    bomberXY.add(newNum);
                    PlaceBomb(x, y);
                    repeat = false;
                }
            }
        }
        bombs++;
    }
}

function PlaceBomb(x, y) {
    GameBoard[x][y].HasBomb = true;
}

function HoldSquare(x, y) {
    if (gameRunning) {
        let twentieths = 0;
        GameBoard[x][y].IsHeld = true;
    
        let holdTimer = setInterval(function() {
            if (GameBoard[x][y].IsHeld && twentieths < 20) {
                twentieths++;
    
                if (twentieths >= 20) {
                    clearInterval(holdTimer);
                    GameBoard[x][y].IsLongClicked = true;
                    FlagSquare(x, y);
                }
            }
        }, 50);
    }
}

function ClickSquare(x, y, mbtn) {
    if (gameRunning) {
        GameBoard[x][y].IsHeld = false;
        if (!GameBoard[x][y].IsLongClicked) {
            if (mbtn === 0) {
                RevealSquare(x, y);
            }
        
            else if (mbtn === 2) {
                FlagSquare(x, y);
            }
        }
    }
}

function RevealSquare(x, y) {
    if (!bombsGenerated) {
        startX = x;
        startY = y;
        GenerateBombs();
        bombsGenerated = true;
        UpdateBombCounter();
        measureTime = true;
    }

    if (!GameBoard[x][y].HasBomb && !GameBoard[x][y].IsOpened && !GameBoard[x][y].IsFlagged) {
        GameBoard[x][y].FindNeighbours();
        if (numberOfBombs - bombFlags === 0) {
            CheckBoard();
        }
    }
    else if (GameBoard[x][y].HasBomb && !GameBoard[x][y].IsFlagged) {
        HitBomb();
        document.getElementById("button" + x + "-" + y).style.backgroundColor = colourRed;
        document.getElementById("button" + x + "-" + y).style.backgroundImage = `url("${minePath}")`;
        document.getElementById("button" + x + "-" + y).style.border = ("1px solid") + " " + colourDarkGrey;
    }
}

function FlagSquare(x, y) {
    if (!GameBoard[x][y].IsOpened && !GameBoard[x][y].IsFlagged) { 
        document.getElementById("button" + x + "-" + y).style.backgroundImage = `url("${flagAltPath}")`;
        GameBoard[x][y].IsFlagged = true;
        bombFlags++;
        if (numberOfBombs - bombFlags === 0) {
            CheckBoard();
        }
    }

    else if (!GameBoard[x][y].IsOpened && GameBoard[x][y].IsFlagged) {
        document.getElementById("button" + x + "-" + y).style.backgroundImage = "";
        GameBoard[x][y].IsFlagged = false;
        bombFlags--;
    }
    UpdateBombCounter();
}

function CheckBoard() {
    let counter = 0;
    let canWin = true;

    GameBoard.forEach(row => {
        if (canWin) {
            row.forEach(square => {
                if (!square.IsOpened && !square.HasBomb) {
                    canWin = false;
                }
                else if (square.HasBomb && !square.IsFlagged) {
                    canWin = false;
                }
                else if (!square.HasBomb && square.IsFlagged) {
                    canWin = false;
                }
                else if (square.HasBomb && square.IsFlagged) {
                    counter++;
                }    
            });
        }
    });

    if (canWin && counter === numberOfBombs) {
        WinGame();
    }
    factCheck.clear();
}

function ChangePictureState(state) {
    let picture = document.getElementById("playerStatus");
    if (state === 0) {
        picture.src = facePath;
    }
    else if (state === 1) {
        picture.src = faceLosePath;
    }
    else if (state === 2) {
        picture.src = faceWinPath;
    }
}

function HitBomb() {
    measureTime = false;
    gameRunning = false;
    ChangePictureState(1);

    GameBoard.forEach(row => {
        row.forEach(square => {
            if (square.HasBomb && !square.IsFlagged) {
                document.getElementById("button" + square.X + "-" + square.Y).style.backgroundImage = `url("${minePath}")`;
                document.getElementById("button" + square.X + "-" + square.Y).style.border = ("1px solid") + " " + colourDarkGrey;
            }
            else if (square.HasBomb && square.IsFlagged) {
                document.getElementById("button" + square.X + "-" + square.Y).style.backgroundImage = `url("${guessedMinePath}")`;
                document.getElementById("button" + square.X + "-" + square.Y).style.border = ("1px solid") + " " + colourDarkGrey;
            }    
        });
    });
}

function WinGame() {
    measureTime = false;
    gameRunning = false;
    ChangePictureState(2);
}

window.onload = StartGame;