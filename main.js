const WIDTH = 600
const SPACING = WIDTH / 8;
const BOARD = new Board();
let holdingPiece = false
let overPiece = false;
let holdingPieceRow;
let holdingPieceCol;

function preload() {
    let names = ['bb', 'bk', 'bn', 'bp', 'bq', 'br', 'wb', 'wk', 'wn', 'wp', 'wq', 'wr']
    names.forEach(n => {
        Piece.imgs[n] = loadImage(`img/${n}.png`);
    })
}

function setup() {
    createCanvas(WIDTH, WIDTH)
    BOARD.init();

}

function draw() {
    BOARD.show();
}

function mousePressed() {
    if (mouseX < WIDTH && mouseY < WIDTH) {
        let mouseMatrixRow = Math.floor(mouseY / SPACING);
        let mouseMatrixCol = Math.floor(mouseX / SPACING)


        if (BOARD.matrix[mouseMatrixRow][mouseMatrixCol] != null && !holdingPiece) {
            // console.log(mouseMatrixX, mouseMatrixY)
            overPiece = true;
            holdingPieceRow = mouseMatrixRow;
            holdingPieceCol = mouseMatrixCol

        } else {
            overPiece = false;
        }
        if (overPiece) {
            holdingPiece = true;
            holdingPieceRow = mouseMatrixRow;
            holdingPieceCol = mouseMatrixCol;

        } else {
            holdingPiece = false;
        }
    }
}

function mouseDragged() {
    if (holdingPiece) {
        BOARD.matrix[holdingPieceRow][holdingPieceCol].absX = mouseX - (SPACING / 2);
        BOARD.matrix[holdingPieceRow][holdingPieceCol].absY = mouseY - (SPACING / 2);
        BOARD.matrix[holdingPieceRow][holdingPieceCol].show()
    }
}

function mouseReleased() {
    if (holdingPiece) {
        holdingPiece = false;
        let landingCol = Math.floor(mouseX / SPACING);
        let landingRow = Math.floor(mouseY / SPACING);
        // console.log(BOARD.matrix)

        let canmove = BOARD.matrix[holdingPieceRow][holdingPieceCol].canMove(BOARD.matrix, landingRow, landingCol);

        if (canmove == "kingside") {
            console.log('castles kingside')
            BOARD.castle(holdingPieceRow, holdingPieceCol, holdingPieceRow, holdingPieceCol + 3, true)

        } else if (canmove == 'queenside') {
            console.log('castles queenside')
            BOARD.castle(holdingPieceRow, holdingPieceCol, holdingPieceRow, holdingPieceCol - 4, false)

        // } else if (canmove === false) {
        //     console.log('can move on real board')
        //     // console.log('holding piece row: ' + holdingPieceRow)
        //     // console.log('holding piece col: ' + holdingPieceCol)

        //     // console.log('landing row: ' + landingRow)
        //     // console.log('landing col: ' + landingCol)
        //     // console.log(JSON.stringify(BOARD.matrix))
        //     BOARD.move(holdingPieceRow, holdingPieceCol, landingRow, landingCol)

        } else {
            console.log('cant move')
        }
        holdingPieceRow = -1;
        holdingPieceCol = -1;
    }
}