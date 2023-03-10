const colourDarkGrey = "rgba(135, 136, 143, 1)";
const colourLightGrey = "rgba(192, 192, 192, 1)";
const colourWhite = "rgba(255, 255, 255, 1)";
const colourDefBtn = "rgba(233, 233, 237, 1)";
const colourGreen = "rgba(80, 140, 80, 1)";
const colourRed = "rgba(255, 0, 0, 1)";

const Spilleplade = [];
const gridX = 10;
const gridY = 10;
const antalBomber = 18;
const flagPath = "/files/flag32px.png";
const flagAltPath = "/files/flagalt32px.png";
const minePath = "/files/mine32px.png";
const guessedMinePath = "/files/guessedmine32px.png";
const facePath = "/files/face36px.png";
const faceWinPath = "/files/win36px.png";
const faceLosePath = "/files/lose36px.png";
const onePath = "/files/one32px.png";
const twoPath = "/files/two32px.png";
const threePath = "/files/three32px.png";
const fourPath = "/files/four32px.png";
const fivePath = "/files/five32px.png";
const sixPath = "/files/six32px.png";
const sevenPath = "/files/seven32px.png";
const eightPath = "/files/eight32px.png";

let startX = 0;
let startY = 0;
let spilIGang = true;
let bomberGenereret = false;
let bombeFlag = 0;
let klikTilstand;

let startTidspunkt = 0;
let tagTid = false;
let minutter = 0;
let sekunder = 0;

class SpilFelt {
    Bombe = false;
    Flag = false;
    Åbnet = false;
    NaboBomber = 0;
    X;
    Y;

    constructor (x, y) {
        this.X = x;
        this.Y = y;
    }

    FindNaboer() {
        let tjekN = true;
        let tjekNØ = true;
        let tjekØ = true;
        let tjekSØ = true;
        let tjekS = true;
        let tjekSV = true;
        let tjekV = true;
        let tjekNV = true;

        if (this.X === 0) {
            tjekSV = false;
            tjekV = false;
            tjekNV = false;
        }

        if (this.X === gridX - 1) {
            tjekNØ = false;
            tjekØ = false;
            tjekSØ = false;
        }

        if (this.Y === 0) {
            tjekN = false;
            tjekNØ = false;
            tjekNV = false;
        }

        if (this.Y === gridY - 1) {
            tjekSØ = false;
            tjekS = false;
            tjekSV = false;
        }      

        if (tjekN)
            this.TjekNabo(Spilleplade[this.X][this.Y-1]);
        if (tjekNØ)
            this.TjekNabo(Spilleplade[this.X+1][this.Y-1]);
        if (tjekØ)
            this.TjekNabo(Spilleplade[this.X+1][this.Y]);
        if (tjekSØ)
            this.TjekNabo(Spilleplade[this.X+1][this.Y+1]);
        if (tjekS)
            this.TjekNabo(Spilleplade[this.X][this.Y+1]);
        if (tjekSV)
            this.TjekNabo(Spilleplade[this.X-1][this.Y+1]);
        if (tjekV)
            this.TjekNabo(Spilleplade[this.X-1][this.Y]);
        if (tjekNV)
            this.TjekNabo(Spilleplade[this.X-1][this.Y-1]);

        document.getElementById("knap" + this.X + "-" + this.Y).style.background = colourLightGrey;
        document.getElementById("knap" + this.X + "-" + this.Y).style.border = ("1px solid") + " " + colourDarkGrey;
        let talBil = "";
        if (this.NaboBomber !== 0) {
            switch(this.NaboBomber) {
                case 1:
                    talBil = onePath;
                    break;
                case 2:
                    talBil = twoPath;
                    break;
                case 3:
                    talBil = threePath;
                    break;
                case 4:
                    talBil = fourPath;
                    break;
                case 5:
                    talBil = fivePath;
                    break;
                case 6:
                    talBil = sixPath;
                    break;
                case 7:
                    talBil = sevenPath;
                    break;
                case 8:
                    talBil = eightPath;
                    break;
                default: 
                    document.getElementById("knap" + this.X + "-" + this.Y).innerText = this.NaboBomber;
                    break;
            }
            document.getElementById("knap" + this.X + "-" + this.Y).style.backgroundImage = `url(".${talBil}")`;
        }
        this.Åbnet = true;
    }

    TjekNabo(nabo) {
        if (nabo.Bombe === true) {
            this.NaboBomber++;
        }
    }
}

setInterval(Timer, 1000);

function Timer() {
    if (tagTid) {
        if (sekunder < 59) {
            sekunder++;
        }
        else {
            minutter++;
            sekunder = 0;
        }
    }
    if (sekunder < 10)
        document.getElementById("spilTimer").innerText = `${minutter}:0${sekunder}`;
    else
        document.getElementById("spilTimer").innerText = `${minutter}:${sekunder}`;
}

function OpdaterBombeTæller() {
    document.getElementById("minerTilbage").innerText = antalBomber - bombeFlag;
}

function StartSpil() {
    LavGitter();
    SkiftKlikTilstand(0);
    SkiftBilledeTilstand(0);
}

function LavGitter() {
    document.getElementById("spilGrid").style.gridTemplateColumns = `repeat(${gridY}, 32px)`;
    document.getElementById("spilGrid").style.gridTemplateRows = `repeat(${gridX}, 32px)`;
    for (let y = 0; y < gridY; y++) {
        let pladeY = [];
        for (let x = 0; x < gridX; x++) {
            let spilFelt = document.createElement("div");
            spilFelt.classList.add("Felt");
            spilFelt.id = "felt" + x + "-" + y;
            spilFelt.style.gridRow = y+1;
            spilFelt.style.gridColumn = x+1;

            let spilFeltKnap = document.createElement("button");
            spilFeltKnap.classList.add("FeltKnap");
            spilFeltKnap.type = "button";
            spilFeltKnap.id = "knap" + x + "-" + y;
            spilFeltKnap.style.backgroundColor = colourLightGrey;

            spilFeltKnap.onclick = function() {
                KlikFelt(x, y);
            }
            spilFelt.appendChild(spilFeltKnap);

            document.getElementById("spilGrid").append(spilFelt);

            let pladeX = new SpilFelt(y, x);
            pladeY.push(pladeX);
        }
        Spilleplade.push(pladeY);
    }
}

function GenererBomber() {
    let bomberXY = new Set();
    let bomber = 0;
    let newNum = 0;
    
    for (let bomber = 0; bomber < antalBomber;) {
        let repeat = true;
        while (repeat) {
            newNum = Math.floor(Math.random() * ((gridX * gridY) - 1) + 0);
            if (!bomberXY.has(newNum)) {
                let x = newNum % gridX;
                let y = Math.floor(newNum / gridY);
                if (x != startX || y != startY) {
                    bomberXY.add(newNum);
                    PlacerBombe(x, y);
                    repeat = false;
                }
            }
        }
        bomber++;
    }
}

function PlacerBombe(x, y) {
    Spilleplade[x][y].Bombe = true;
}

function KlikFelt(x, y) {
    if (spilIGang) {
        if (klikTilstand === 0) {
            if (!bomberGenereret) {
                startX = x;
                startY = y;
                GenererBomber();
                bomberGenereret = true;
                OpdaterBombeTæller();
                tagTid = true;
            }

            if (!Spilleplade[x][y].Bombe && !Spilleplade[x][y].Åbnet && !Spilleplade[x][y].Flag) {
                Spilleplade[x][y].FindNaboer();
                if (antalBomber - bombeFlag === 0) {
                    TjekBoard();
                }
            }
            else if (Spilleplade[x][y].Bombe && !Spilleplade[x][y].Flag) {
                RamBombe();
                document.getElementById("knap" + x + "-" + y).style.backgroundColor = colourRed;
                document.getElementById("knap" + x + "-" + y).style.backgroundImage = `url(".${minePath}")`;
                document.getElementById("knap" + x + "-" + y).style.border = ("1px solid") + " " + colourDarkGrey;
                //alert("Bombe!");
            }
        }
    
        else if (klikTilstand === 1) {
            if (!Spilleplade[x][y].Åbnet && !Spilleplade[x][y].Flag) { 
                document.getElementById("knap" + x + "-" + y).style.backgroundImage = `url(".${flagAltPath}")`;
                Spilleplade[x][y].Flag = true;
                bombeFlag++;
                if (antalBomber - bombeFlag === 0) {
                    TjekBoard();
                }
            }
    
            else if (!Spilleplade[x][y].Åbnet && Spilleplade[x][y].Flag) {
                document.getElementById("knap" + x + "-" + y).style.backgroundImage = "";
                Spilleplade[x][y].Flag = false;
                bombeFlag--;
            }
            OpdaterBombeTæller();
        }
    }
}

function TjekBoard() {
    let factTjek = new Set();
    let counter = 0;
    Spilleplade.forEach(række => {
        række.forEach(felt => {
            if (felt.Bombe && !felt.Flag) {
                factTjek.add(1);
            }
            else if (!felt.Bombe && felt.Flag) {
                factTjek.add(1);
            }
            else if (felt.Bombe && felt.Flag) {
                counter++;
            }    
        });
    });

    if (!factTjek.has(1) && counter === antalBomber) {
        VindSpil();
    }
    factTjek.clear();
}

function SkiftKlikTilstand(tjek) {
    let btnTjek = document.getElementById("btnTjek");
    let btnFlag = document.getElementById("btnFlag");

    if (tjek === 0 && klikTilstand !== 0) {
        klikTilstand = 0;
        btnTjek.style.backgroundColor = colourGreen;
        btnFlag.style.backgroundColor = colourDefBtn;
    }
        
    else if (tjek === 1 && klikTilstand !== 1) {
        klikTilstand = 1;
        btnTjek.style.backgroundColor = colourDefBtn;
        btnFlag.style.backgroundColor = colourGreen;
    }
}

function SkiftBilledeTilstand(tilstand) {
    let billede = document.getElementById("spillerStatus");
    if (tilstand === 0) {
        billede.src = facePath;
    }
    else if (tilstand === 1) {
        billede.src = faceLosePath;
    }
    else if (tilstand === 2) {
        billede.src = faceWinPath;
    }
}

function RamBombe() {
    tagTid = false;
    spilIGang = false;
    SkiftBilledeTilstand(1);

    Spilleplade.forEach(række => {
        række.forEach(felt => {
            if (felt.Bombe && !felt.Flag) {
                document.getElementById("knap" + felt.X + "-" + felt.Y).style.backgroundImage = `url(".${minePath}")`;
                document.getElementById("knap" + felt.X + "-" + felt.Y).style.border = ("1px solid") + " " + colourDarkGrey;
            }
            else if (felt.Bombe && felt.Flag) {
                document.getElementById("knap" + felt.X + "-" + felt.Y).style.backgroundImage = `url(".${guessedMinePath}")`;
                document.getElementById("knap" + felt.X + "-" + felt.Y).style.border = ("1px solid") + " " + colourDarkGrey;
            }    
        });
    });
}

function VindSpil() {
    tagTid = false;
    spilIGang = false;
    SkiftBilledeTilstand(2);
}

window.onload = StartSpil;