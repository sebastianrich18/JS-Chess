const WIDTH = 600
const SPACING = WIDTH / 8;
let BOARD;
let isHoldingPiece = false
let overPiece = false;
let holdingPieceRow;
let holdingPieceCol;
let turn;


function preload() {
    BOARD = new Board(true);
    let names = ['bb', 'bk', 'bn', 'bp', 'bq', 'br', 'wb', 'wk', 'wn', 'wp', 'wq', 'wr']
    names.forEach(n => {
        Piece.imgs[n] = loadImage(`img/${n}.png`);
    })
}

function setup() {
    createCanvas(WIDTH, WIDTH)
    noStroke()
    ellipseMode(CENTER)
    BOARD.init();
    turn = 'w'
}

function draw() {
    BOARD.show();
}

function mousePressed() {
    if (mouseX < WIDTH && mouseY < WIDTH) {
        let mouseMatrixRow = Math.floor(mouseY / SPACING);
        let mouseMatrixCol = Math.floor(mouseX / SPACING)


        if (BOARD.matrix[mouseMatrixRow][mouseMatrixCol] != null && !isHoldingPiece && turn == BOARD.matrix[mouseMatrixRow][mouseMatrixCol].color) {
            // console.log(mouseMatrixX, mouseMatrixY)
            overPiece = true;
            holdingPieceRow = mouseMatrixRow;
            holdingPieceCol = mouseMatrixCol

        } else {
            overPiece = false;
        }
        if (overPiece) {
            isHoldingPiece = true;
            holdingPieceRow = mouseMatrixRow;
            holdingPieceCol = mouseMatrixCol;
        } else {
            isHoldingPiece = false;
        }
    }
}

function mouseDragged() {
    if (isHoldingPiece && turn == BOARD.matrix[holdingPieceRow][holdingPieceCol].color) {
        BOARD.matrix[holdingPieceRow][holdingPieceCol].absX = mouseX - (SPACING / 2);
        BOARD.matrix[holdingPieceRow][holdingPieceCol].absY = mouseY - (SPACING / 2);
        BOARD.matrix[holdingPieceRow][holdingPieceCol].show()
    }
}

function mouseReleased() {
    if (isHoldingPiece) {
        isHoldingPiece = false;
        let landingCol = Math.floor(mouseX / SPACING);
        let landingRow = Math.floor(mouseY / SPACING);



        // console.log(BOARD.matrix)

        let canmove = BOARD.matrix[holdingPieceRow][holdingPieceCol].canMove(BOARD.matrix, landingRow, landingCol);

        if (canmove) {
            console.log('next turn')
            if (turn == 'w') {
                turn = 'b';
            } else if (turn == 'b') {
                turn = 'w';
            }
        }

        if (canmove == "kingside") {
            console.log('castles kingside')
            BOARD.castle(holdingPieceRow, holdingPieceCol, holdingPieceRow, holdingPieceCol + 3, true)

        } else if (canmove == 'queenside') {
            console.log('castles queenside')
            BOARD.castle(holdingPieceRow, holdingPieceCol, holdingPieceRow, holdingPieceCol - 4, false)

        } else if (canmove === true) {
            console.log('moving on main board')
            // console.log('holding piece row: ' + holdingPieceRow)
            // console.log('holding piece col: ' + holdingPieceCol)

            // console.log('landing row: ' + landingRow)
            // console.log('landing col: ' + landingCol)
            // console.log(JSON.stringify(BOARD.matrix))
            BOARD.move(holdingPieceRow, holdingPieceCol, landingRow, landingCol)

        } else if (canmove === false) {
            console.log('cant move')
        } else {
            console.log('something went horibly wrong')
        }
        holdingPieceRow = -1;
        holdingPieceCol = -1;
        if (BOARD.matrix[landingRow][landingCol] && BOARD.matrix[landingRow][landingCol].type == 'k') {
            gameOver(BOARD.matrix[landingRow][landingCol].color);
            return;
        }
    }

}

function gameOver(winner) {
    if (winner == 'w') {
        winner == 'white'
    } else {
        winner == 'black'
    }
    if (confirm(winner + " Wins!\nWould you like to play again?")) {
        reset()
    }
}
