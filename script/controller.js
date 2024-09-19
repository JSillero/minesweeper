/* Init storage variable for time record ________________________________ */
if (localStorage.getItem("easy") == null) {
    localStorage.setItem("easy", "9999");
    localStorage.setItem("mid", "9999");
    localStorage.setItem("hard", "9999");
}


/* Setting variables _____________________________________________________*/
let board;
let winstate = null;
let clock;

/* Setting element chached ________________________________________________*/
const mineField = document.getElementById("minefield");

const auxGameInfo = document.getElementById("gameInfo");
const timeDisplay = document.getElementById("timer");


const winstateElement = document.getElementById("winstatescreen");
const winstateMessageElement = document.getElementById("winstatemessage");
const curentTimeSpan = document.getElementById("yourTime");
const recordTimeSpan = document.getElementById("topTime");
const newRecordMessage = document.getElementById("newrecordMessage");
const recordMessage = document.getElementById("recordMessage");

const settingButton = document.getElementById("btnSettings");
const settingsElement = document.getElementById("settings");
const settingCloseBtn = document.getElementById("closeSettings");

const mainMenuElement = document.getElementById("mainMenu");

const mainMenuButton = document.getElementById("mainMenuButton");

const playButtons = document.getElementsByClassName("start");

const radioElements = document.querySelectorAll("input[type='radio']");

const flagElement = document.getElementById("flagElement");
const flagCount = document.getElementById("flagCount");
const totalMines = document.getElementById("totalMines");


/* Setting event listeners _______________________________________________ */
mineField.addEventListener("click", clickCell);
mineField.addEventListener("contextmenu", (e) => {//disable contextual menu on right click
    e.preventDefault();
});

mainMenuButton.addEventListener("click", mainMenu);

settingButton.addEventListener("click", settingsMenu);

settingCloseBtn.addEventListener("click", closeSettings);


mineField.addEventListener("auxclick", (e) => {//put a flag item on secondary click
    let currentElement = e.target;
    if ((currentElement.classList.contains("cell") || currentElement.classList.contains("flag")) && winstate == null) {
        if (currentElement.classList.contains("flag")) {
            currentElement.classList.add("cell");
            currentElement.classList.remove("flag");

        } else {
            currentElement.classList.add("flag");
            currentElement.classList.remove("cell");
        }
    }
    let count = flagCount.innerHTML = document.querySelectorAll("#minefield .flag").length;
    if (count !== undefined) {
        flagCount.innerHTML = count;
    } else {
        flagCount.innerHTML = 0;
    }

    e.preventDefault();
});

for (const button of playButtons) {
    button.addEventListener("click", (e) => {
        gameStart();//hide or show the needed options / menus elements
        let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        winstate = null;
        switch (difficulty) {
            case "easy":
                createMineField(8, 1);
                totalMines.innerHTML = "1";

                break;
            case "mid":
                createMineField(10, 15);
                totalMines.innerHTML = "15";

                break;
            case "hard":
                createMineField(20, 75);
                totalMines.innerHTML = "75";
                break;
            default:
                break;
        }

    })

}


for (const radio of radioElements) {
    radio.addEventListener("change", (e) => {
        let target = e.target;
        let idChosen = target.id.substring(0, target.id.length - 1);
        document.getElementById(`${idChosen}1`).checked = true;
        document.getElementById(`${idChosen}2`).checked = true;
        document.getElementById(`${idChosen}3`).checked = true;

    })
}

/* PROPER CODE___________________________________________________________ */

function createMineField(size, mines) {
    mineField.innerHTML = "";//clear the element
    board = new Board(size, mines);
    board.mineField.forEach((line, indexY) => {
        let htmlLine = document.createElement("div"); //create the div elements which will countain lines of cells
        htmlLine.setAttribute("class", "line");

        line.forEach((cell, indexX) => {
            let cellElement = document.createElement("div");
            cellElement.setAttribute("class", "cell");
            cellElement.setAttribute("data-x", indexX);
            cellElement.setAttribute("data-y", indexY);
            htmlLine.appendChild(cellElement);
        });
        mineField.appendChild(htmlLine);
    });
}

function gameEnd() {
    if (winstate) {
        winstateMessageElement.innerHTML = "Robbed them blind!";
        recordMessage.classList.remove("hidden");
        //set new record if there was one
        let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        let pastRecord = localStorage.getItem(difficulty);
        let currentRecord = mins + "" + seconds;
        if (currentRecord < pastRecord) {
            localStorage.setItem(difficulty, currentRecord);
            newRecordMessage.classList.remove("hidden");//if a new record is set the message is revealed
        }

        curentTimeSpan.innerHTML = ((mins.length = 1) ? mins = "0" + mins : mins) + ":" + seconds;

        let recordmins = localStorage.getItem(difficulty).substring(0, 2);
        let recordSecs = localStorage.getItem(difficulty).substring(2);

        recordTimeSpan.innerHTML = `${recordmins}:${(recordSecs.length = 1) ? recordSecs = "0" + recordSecs : recordSecs}`;



    } else {
        winstateMessageElement.innerHTML = "You joined the corpses!";
        recordMessage.classList.add("hidden");
    }
    winstateElement.classList.remove("hidden");
    resetTime();
}

function gameStart() {
    winstateElement.classList.add("hidden");
    mainMenuElement.classList.add("hidden");
    recordMessage.classList.add("hidden");
    newRecordMessage.classList.add("hidden");


    auxGameInfo.classList.remove("hidden");
    mineField.classList.remove("hidden");
    flagElement.classList.remove("hidden");
    flagCount.innerHTML = 0;

    time();
    clock = window.setInterval(time, 999);
}

function mainMenu() {
    mineField.classList.add("hidden");
    winstateElement.classList.add("hidden");
    auxGameInfo.classList.add("hidden");
    flagElement.classList.add("hidden");


    mainMenuElement.classList.remove("hidden");

}


function clickCell(e) {
    let currentElement = e.target;
    if (currentElement.classList.contains("cell") && winstate == null) {
        let coordX = currentElement.dataset.x;
        let coordY = currentElement.dataset.y;

        //class that permits click funtion is removed to 
        currentElement.classList.remove("cell");
        //check the value of the cell revealed
        let result = board.mineField[coordX][coordY].reveal();
        if (result == 0) {
            //in case its 0 it recursively fires the click emoji 
            for (let subx = -1; subx < 2; subx++) {
                for (let suby = -1; suby < 2; suby++) {
                    //catch the error in case we try to access an non existent element
                    try {
                        let nextCell = document.querySelector(`div.cell[data-x="${(Number(coordX) + Number(subx))}"][data-y="${(Number(coordY) + Number(suby))}"]`);
                        if (nextCell) {
                            nextCell.click();
                        }
                        //document.querySelector(`div.cell[data-x="${(Number(coordX) + Number(subx))}"][data-y="${(Number(coordY) + Number(suby))}"]`).click();

                    } catch (error) {

                    }
                }
            }
            currentElement.innerHTML = result;
        } else if (result > 0) {
            currentElement.innerHTML = result;
        } else {
            currentElement.innerHTML = "M";
            winstate = false;
            gameEnd();
        }
        //increases reveal count and checks for the wincon
        if (board.increaseRevealCount()) {
            winstate = true;
            gameEnd();
        };
    }
}

let seconds = 0;
let mins = 0;

/* Displays time, actualices every second,  */
function time() {
    seconds++
    if (seconds > 59) {
        seconds = 0;
        mins++;
    }
    timeDisplay.innerHTML = `${(mins < 9 || mins == 0) ? "0" + mins : mins}:${(seconds < 10 || seconds == 0) ? seconds = "0" + seconds : seconds}`;
}
/* Resetea los valores de la hora */
function resetTime() {
    seconds = 0;
    mins = 0;
    clearInterval(clock);
}

function pauseTime() {
    clearInterval(clock);
}

function resumeTime() {
    clock = window.setInterval(time, 999);
}

function settingsMenu() {
    if (winstate === null)
        pauseTime();
    settingsElement.classList.remove("hidden");
}
function closeSettings() {
    if (winstate === null)
        resumeTime();
    settingsElement.classList.add("hidden");
}