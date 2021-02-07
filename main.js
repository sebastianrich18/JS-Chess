const WIDTH = 600
const SPACING = WIDTH / 8;
const BOARD = new Board();
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
    if (locked) {
        BOARD.board[holdingPieceY][holdingPieceX].show() // make holding piece be drawn on top of everything else
    }
}

function mousePressed() {
    if (mouseX < WIDTH && mouseY < WIDTH) {
        let mouseMatrixX = Math.floor(mouseX / SPACING);
        let mouseMatrixY = Math.floor(mouseY / SPACING)

        // console.log(mouseMatrixX, mouseMatrixY)

        if (BOARD.board[mouseMatrixY][mouseMatrixX] != null && !locked) {
            // console.log(mouseMatrixX, mouseMatrixY)
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

}

function mouseDragged(e) {
    if (locked) {
        BOARD.board[holdingPieceY][holdingPieceX].absX = mouseY - (SPACING / 2);
        BOARD.board[holdingPieceY][holdingPieceX].absY = mouseX - (SPACING / 2);

    }
}

function mouseReleased() {
    if (locked) {
        locked = false;
        landingX = Math.floor(mouseX / SPACING);
        landingY = Math.floor(mouseY / SPACING);

        let canmove = BOARD.board[holdingPieceY][holdingPieceX].canMove(BOARD.board, landingY, landingX);
        console.log(holdingPieceX, holdingPieceY)
        if (canmove == "kingside") {
            console.log('castles kingside')
            BOARD.castle(holdingPieceY, holdingPieceX, holdingPieceY, holdingPieceX + 3, true)

        } else if (canmove == 'queenside') {
            console.log('castles queenside')
            BOARD.castle(holdingPieceY, holdingPieceX, holdingPieceY, holdingPieceX - 4, false)

        } else if (canmove === true) {
            console.log('can move')
            BOARD.move(holdingPieceX, holdingPieceY, landingX, landingY)

        } else {
            console.log('cant move')
        }
        holdingPieceX = -1;
        holdingPieceY = -1;
    }

}