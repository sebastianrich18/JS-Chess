const WIDTH = 600
const SPACING = WIDTH / 8;
const BOARD = new Board;
let locked = false
let overPiece = false;
let holdingPieceX;
let holdingPieceY;

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
    let mouseMatrixX = Math.floor(mouseX / SPACING);
    let mouseMatrixY = Math.floor(mouseY / SPACING)

    console.log(mouseMatrixX, mouseMatrixY)

    if (BOARD.board[mouseMatrixY][mouseMatrixX] != null && !locked) {
        console.log(mouseMatrixX, mouseMatrixY)
        overPiece = true;
        holdingPieceX = mouseMatrixY;
        holdingPieceY = mouseMatrixX

    } else {
        overPiece = false;
    }
    if (overPiece) {
        locked = true;
        holdingPieceX = mouseMatrixX;
        holdingPieceY = mouseMatrixY;
        
    } else {
        locked = false;
    }

}

function mouseDragged(e) {
    if(locked) {
        BOARD.board[holdingPieceY][holdingPieceX].absX = mouseY - (SPACING / 2);
        BOARD.board[holdingPieceY][holdingPieceX].absY = mouseX - (SPACING / 2);

    }
}

function mouseReleased() {
    locked = false;
    holdingPieceX = -1;
    holdingPieceY = -1;
}