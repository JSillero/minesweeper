
/* Setting element chached */
const mineField = document.getElementById("minefield")

/* Setting variables */
let board;
let winstate = null;

/* Setting event listeners  */
mineField.addEventListener("click", clickCell);
mineField.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
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
    e.preventDefault();
});

function createMineField() {
    mineField.innerHTML = "";//clear the element
    board = new Board(6, 1);
    board.mineField.forEach((line, indexY) => {
        let htmlLine = `<div class='line' >`;
        line.forEach((cell, indexX) => {
            htmlLine += `<div class='cell' data-x='${indexX}' data-y='${indexY}'></div>`
        });
        mineField.innerHTML += htmlLine + "</div>";
    });
}

createMineField();

function clickCell(e) {
    let mouseclickType = e.buttons;
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
                        document.querySelector(`div[data-x="${(Number(coordX) + Number(subx))}"][data-y="${(Number(coordY) + Number(suby))}"]`).click();
                    } catch (error) {

                    }
                }
            }
            currentElement.innerHTML = result;
        } else if (result > 0) {
            currentElement.innerHTML = result;
        } else {
            currentElement.innerHTML = "M";
            //TODO ADD LOOSE FUNCTION
        }
        //increases reveal count and checks for the wincon
        if (board.increaseRevealCount()) {
            winstate = true;
            console.log("YOU WIN;");
        };
    }
}