class Cell {
    constructor() {
        // state defines how the cell will behave, 0 means there is not a mine in it , a number between 1 to 8 defines the number of adjacent bombs, a nevative value indicates there is a bomb here
        this.state = 0;
        //reveal defines if the tile has been revealed or not
        this.revealed = false;
    }

    mine() {
        this.state = -10;
    }

    /* This funciton will be called for surounding cells when a  bomb is placed in the  board*/
    increaseState() {
        this.state += 1;
    }

    /* Reveals the cell and returns state */
    reveal() {
        this.revealed = true;
        return this.state;
    }

}

class Board {

    constructor(size, mines) {
        this.mineField = [];
        this.revealedWincon = size * size - mines; //value chechcked against currentRevealed to check the wincon
        this.currentRevealed = 0; //value that stores currently revealted tiles 

        /* Fills the board with cells */
        for (let index = 0; index < size; index++) {
            let arrayCells = [];
            for (let index2 = 0; index2 < size; index2++) {
                arrayCells.push(new Cell());
            }
            this.mineField.push(arrayCells);
        }

        /*Put mines in the board
        generates random coordinates and puts mine there if there is not one there already
        */
        for (let index = 0; index < mines;) {
            let x = Math.floor(Math.random() * (size - 1))
            let y = Math.floor(Math.random() * (size - 1))
            if (this.mineField[x][y].state > -1) {
                this.mineField[x][y].mine();
                /* Increase the counter of surounding cells to keep track of how many mines there are */


                for (let subx = -1; subx < 2; subx++) {
                    for (let suby = -1; suby < 2; suby++) {
                        //catch the error in case we try to access an non existent array position.
                        try {
                            this.mineField[x + subx][y + suby].increaseState();
                        } catch (error) {

                        }
                    }
                }

                index++;
            }
        }

    }


    increaseRevealCount() {

        if (++this.currentRevealed == this.revealedWincon) {
            return true;
        }
        return false;
    }
}

