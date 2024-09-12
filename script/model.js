class Cell {
    constructor() {
        // state defines how the cell will behave, 0 means there is not a mine in it , a number between 1 to 8 defines the number of adjacent bombs, a nevative value indicates there is a bomb here
        this.state = 0;
        //reveal defines if the tile has been revealed or not
        this.reveal = false;
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
        this.reveal = true;
        return this.state;
    }

}

class Board {

    constructor(size, mines) {
        this.board = [];

        /* Fills the board with cells */
        for (let index = 0; index < size; index++) {
            let arrayCells = [];
            for (let index2 = 0; index2 < size; index2++) {
                arrayCells.push(new Cell());
            }
            this.board.push(arrayCells);
        }

        /*Put mines in the board
        generates random coordinates and puts mine there if there is not one there already
        */
        for (let index = 0; index < mines;) {
            let x = Math.floor(Math.random() * (size - 1))
            let y = Math.floor(Math.random() * (size - 1))
            if (this.board[x][y].state > -1) {
                this.board[x][y].mine();
                /* Increase the counter of surounding cells to keep track of how many mines there are */


                for (let subx = -1; subx < 2; subx++) {
                    for (let suby = -1; suby < 2; suby++) {
                        //catch the error in case we try to access an non existent array position.
                        try {
                            this.board[x + subx][y + suby].increaseState();
                        } catch (error) {

                        }
                    }
                }

                index++;
            }
        }

    }

    logBoard() {
        this.board.forEach(line => {
            console.log(...line)
        });
    }
}

console.log("aaaa");
new Board(6, 6).logBoard();
cos