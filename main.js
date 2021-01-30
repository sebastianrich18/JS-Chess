const SPACING = (document.getElementById("chess").width) / 8;
const BOARD = new Board;
Piece.loadImgs()

function initBoard() {
    BOARD.init();
    BOARD.show();
}
