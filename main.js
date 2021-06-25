const WIDTH = 600
const SPACING = WIDTH / 8;
let BOARD;
let isHoldingPiece = false
let overPiece = false;
let holdingPieceRow;
let holdingPieceCol;
let gotMoves = false
let possableMoves = []
let holdingPiece;

function preload() {
    let names = ['bb', 'bk', 'bn', 'bp', 'bq', 'br', 'wb', 'wk', 'wn', 'wp', 'wq', 'wr']
    names.forEach(n => {
        Piece.imgs[n] = loadImage(`img/${n}.png`);
    })
}

function setup() {
    BOARD = new Board(true);
    createCanvas(WIDTH, WIDTH)
    noStroke()
    ellipseMode(CENTER)
    BOARD.init();

}

function draw() {
    BOARD.show();
}

function mousePressed() {
    if (mouseX < WIDTH && mouseY < WIDTH) {
        let mouseMatrixRow = Math.floor(mouseY / SPACING);
        let mouseMatrixCol = Math.floor(mouseX / SPACING)


        if (BOARD.matrix[mouseMatrixRow][mouseMatrixCol] != null && !isHoldingPiece) {
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
    if (isHoldingPiece) {
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

        } else if (canmove === false){
            console.log('cant move')
        } else {
            console.log('something went horibly wrong')
        }
        holdingPieceRow = -1;
        holdingPieceCol = -1;
    }
}

class Board {
    constructor(matrix) {
        this.matrix = []
        if (matrix instanceof Array) {
            for (let row=0; row<matrix.length; row++) {
                let arr = []
                for (let col=0; col<matrix.length; col++) {
                    let piece = matrix[row][col];
                    if (piece == null) {
                        arr.push(null)
                    } else {
                        arr.push(Object.assign(Object.create(Object.getPrototypeOf(piece)), piece)) // clones object insted of getting a refrence
                    }
                }
                this.matrix.push(arr)
            }
            this.isMain = false
        }
        if (typeof matrix === "boolean") {
            this.isMain = matrix;
        }
    }

    init() {
        for (let i = 0; i < 8; i++) {
            this.matrix.push([null, null, null, null, null, null, null, null])
        }

        let startingPos =
            [['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']]

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (startingPos[row][col] != '') {
                    let color = startingPos[row][col].split('')[0];
                    let type = startingPos[row][col].split('')[1]
                    switch (type) {
                        case 'p':
                            this.matrix[row][col] = new Pawn(color, type, row, col);
                            break;
                        case 'k':
                            this.matrix[row][col] = new King(color, type, row, col);
                            break;
                        case 'b':
                            this.matrix[row][col] = new Bishop(color, type, row, col);
                            break;
                        case 'q':
                            this.matrix[row][col] = new Queen(color, type, row, col);
                            break;
                        case 'r':
                            this.matrix[row][col] = new Rook(color, type, row, col);
                            break;
                        case 'n':
                            this.matrix[row][col] = new Knight(color, type, row, col);
                            break;
                    }
                }
            }
        }
    }

    show() {

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 == 0) {
                    fill(255)
                } else {
                    fill(117, 150, 84)
                }
                rect(SPACING * row, SPACING * col, SPACING, SPACING);
            }
        }

        if (isHoldingPiece) {

        
            if(!gotMoves) {
                holdingPiece = BOARD.matrix[holdingPieceRow][holdingPieceCol]
                possableMoves = holdingPiece.getMoves(BOARD.matrix);
                gotMoves = true;
            }
            fill(0, 50)
            for (let move of possableMoves) {
                circle(move[1]*SPACING+(SPACING/2), move[0]*SPACING+(SPACING/2), SPACING*.69)
            }
        } else {
            gotMoves = false;
        }

        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix.length; col++) {
                if (this.matrix[row][col] instanceof Piece) {
                    this.matrix[row][col].show()
                }
            }
        }
    }


    findKing(color) {
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix.length; col++) {
                if (this.matrix[row][col] != null && this.matrix[row][col].color == color && this.matrix[row][col].type == 'k') {
                    return [row, col]
                }
            }
        }
    }

    movePutsKingInCheck(piece, landingRow, landingCol) {
        console.log('checking for check')
        // console.log(piece, landingRow, landingCol)
        this.move(piece.matrixRow, piece.matrixCol, landingRow, landingCol)
        // console.log("in movePuts... ", true, JSON.stringify(BOARD.matrix))
        let oppMoves = this.getOpponentMoves(piece.color);
        let kingLocation = this.findKing(piece.color)
        // console.log(kingLocation)
        for (let i = 0; i < oppMoves.length; i++) {
            if (oppMoves[i][0] == kingLocation[0] && oppMoves[i][1] == kingLocation[1]) {
                console.log("opponent can play " + oppMoves[i] + " and take your king")
                return true
            }
        }
        return false;
    }

    getOpponentMoves(color) {
        console.log('checking oppponent moves')
        let moves = [];
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix.length; col++) {
                let piece = this.matrix[row][col];
                if (piece != null && piece.color != color) {
                    for(let m of piece.getMoves(this.matrix)) { // get all moves for every piece
                        console.log(piece, m)
                        moves.push(m);
                    }
                }
            }
        }
        console.log(moves)
        return moves
    }

    canCastle(color, isKingSide) {
        let moves = this.getOpponentMoves(color);
        let squares = [] // holds squares the king must move thru in order to castle
        if (color == 'w') {
            squares.push([7, 4]);
            if (isKingSide) {
                squares.push([7, 5]);
                squares.push([7, 6]);
            } else {
                squares.push([7, 3]);
                squares.push([7, 2]);
            }
        } else {
            squares.push([0, 4])
            if (isKingSide) {
                squares.push([0, 5]);
                squares.push([0, 6]);
            } else {
                squares.push([0, 3]);
                squares.push([0, 2]);
            }
        }
        for (let i = 0; i < moves.length; i++) {
            for (let j = 0; j < squares.length; j++) {
                if (moves[i][0] == squares[j][0] && moves[i][1] == squares[j][1]) {
                    return false
                }
            }
        }
        return true;
    }

    move(startingRow, startingCol, landingRow, landingCol) {
        // console.log('moveing from ', startingRow, startingCol, " to ", landingRow, landingCol)
        // console.log(JSON.stringify(this.matrix))
        // console.log("before move", this.isMain, JSON.stringify(this.matrix))
        let piece = this.matrix[startingRow][startingCol]
        console.log("moveing ", piece, ' to ', landingRow, landingCol, ' on board ', this.isMain)
        piece.matrixRow = landingRow;
        piece.matrixCol = landingCol;
        piece.hasMoved = true;
        this.matrix[startingRow][startingCol] = null;
        this.matrix[landingRow][landingCol] = piece;
        // console.log("after move", this.isMain, JSON.stringify(this.matrix))

    }

    castle(kx, ky, rx, ry, isKingSide) {
        // console.log(rx, ry)
        // console.log(kx, ky)
        if (isKingSide) {
            BOARD.move(kx, ky, kx, ky + 2);
            BOARD.move(rx, ry, rx, ry - 2)
        } else {
            BOARD.move(kx, ky, kx, ky - 2);
            BOARD.move(rx, ry, rx, ry + 3)
        }
        console.log('castles')
    }
}

class Piece {
    static imgs = {};

    constructor(color, type, matrixRow, matrixCol) {
        this.color = color;
        this.type = type;
        this.matrixRow = matrixRow;
        this.matrixCol = matrixCol;
        this.absX = matrixRow * SPACING;
        this.absY = matrixCol * SPACING;
    }

    show() {
        if (!isHoldingPiece) {
            this.absY = this.matrixRow * SPACING;
            this.absX = this.matrixCol * SPACING;
        }
        image(Piece.imgs[`${this.color}${this.type}`], this.absX, this.absY, SPACING, SPACING)

    }

    canMove(matrix, landingRow, landingCol) {
        console.log("checking move from ", this.matrixRow, this.matrixCol, " to ", landingRow, landingCol)
        let newBoard = new Board(matrix)
        // console.log(JSON.stringify(newBoard.matrix))
        let moves = this.getMoves(newBoard.matrix);
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] == landingRow && moves[i][1] == landingCol) { // move is reachable

                if (moves[i][2] != undefined && moves[i][2] === true) { // if move is castle king side
                    console.log('castles kingside')
                    return "kingside"

                } else if (moves[i][2] != undefined && moves[i][2] === false) { // if move is castle queen side
                    console.log('castles queenside')
                    return 'queenside'
                }
                if (!newBoard.movePutsKingInCheck(this, landingRow, landingCol)) {
                    console.log('move doesnt put king in check')
                    return true;

                } else {
                    console.log('move puts king in check')
                    return false
                }
            }
        }
        return false;
    }
}

class Pawn extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        this.hasMoved = false;
    }

    getMoves(matrix) {
        let moves = [];
        let row = this.matrixRow;
        let col = this.matrixCol;
        if (this.color == 'w') {
            if (matrix[row - 1][col] == null) { // forward 1
                moves.push([row - 1, col]);
            }
            if (!this.hasMoved && matrix[row - 1][col] == null && matrix[row - 2][col] == null) { // forward 2
                moves.push([row - 2, col]);
            }
            if (matrix[row - 1][col - 1] != null && matrix[row - 1][col - 1].color == 'b') { // takes to the left
                moves.push([row - 1, col - 1]);
            }
            if (matrix[row - 1][col + 1] != null && matrix[row - 1][col + 1].color == 'b') { // takes to the right
                moves.push([row - 1, col + 1]);
            }
        } else {
            if (matrix[row + 1][col] == null) { // forward 1
                moves.push([row + 1, col]);
            }
            if (!this.hasMoved && matrix[row + 1][col] == null && matrix[row + 2][col] == null) { // forward 2
                moves.push([row + 2, col]);
            }
            if (matrix[row + 1][col - 1] != null && matrix[row + 1][col - 1].color == 'w') { // takes to the left
                moves.push([row + 1, col - 1]);
            }
            if (matrix[row + 1][col + 1] != null && matrix[row + 1][col + 1].color == 'w') { // takes to the right
                moves.push([row + 1, col + 1]);
            }
        }
        return moves;
    }
}

class King extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        this.hasMoved = false
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;

        if (isInBounds(x, y + 1) && (board[x][y + 1] == null || board[x][y + 1].color != this.color)) { // right
            moves.push([x, y + 1])
        }
        if (isInBounds(x, y - 1) && (board[x][y - 1] == null || board[x][y].color != this.color)) { // left
            moves.push([x, y - 1])
        }
        if (isInBounds(x + 1, y) && (board[x + 1][y] == null || board[x + 1][y].color != this.color)) { // down
            moves.push([x + 1, y])
        }
        if (isInBounds(x - 1, y) && (board[x - 1][y] == null || board[x - 1][y].color != this.color)) { // up
            moves.push([x - 1, y])
        }
        if (isInBounds(x - 1, y - 1) && (board[x - 1][y - 1] == null || board[x - 1][y - 1].color != this.color)) { // front left
            moves.push([x - 1, y - 1])
        }
        if (isInBounds(x - 1, y + 1) && (board[x - 1][y + 1] == null || board[x - 1][y + 1].color != this.color)) { // front right
            moves.push([x - 1, y + 1])
        }
        if (isInBounds(x + 1, y + 1) && (board[x + 1][y + 1] == null || board[x + 1][y + 1].color != this.color)) { // back right
            moves.push([x + 1, y + 1])
        }
        if (isInBounds(x + 1, y - 1) && (board[x + 1][y - 1] == null || board[x + 1][y - 1].color != this.color)) { // back left
            moves.push([x + 1, y - 1])
        }
        if (!this.hasMoved && board[x][y + 1] == null && board[x][y + 2] == null && board[x][y + 3].type == 'r' && !board[x][y + 3].hasMoved) { // castle king side
            if (BOARD.canCastle(this.color, true)) {
                moves.push([x, y + 2, true]);
                moves.push([x, y + 3, true]);
            }
        }
        if (!this.hasMoved && board[x][y - 1] == null && board[x][y - 2] == null && board[x][y - 3] == null && board[x][y - 4].type == 'r' && !board[x][y - 4].hasMoved) { // castle king side
            if (BOARD.canCastle(this.color, false)) {
                moves.push([x, y - 2, false]);
                moves.push([x, y - 3, false]);
                moves.push([x, y - 4, false]);
            }
        }

        return moves;
    }
}

class Queen extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(matrix) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;
        for (let i = 1; i < matrix.length; i++) { // front left
            if (!isInBounds(x - i, y - i)) {
                break;
            }
            if (matrix[x - i][y - i] == null) {
                moves.push([x - i, y - i]);
            } else {
                if (matrix[x - i][y - i].color != this.color) {
                    moves.push([x - i, y - i]);
                }
                break;
            }
        }
        for (let i = 1; i < matrix.length; i++) { // front right
            if (!isInBounds(x - i, y + i)) {
                break;
            }
            if (matrix[x - i][y + i] == null) {
                moves.push([x - i, y + i]);
            } else {
                if (matrix[x - i][y + i].color != this.color) {
                    moves.push([x - i, y + i]);
                }
                break;
            }
        }
        for (let i = 1; i < matrix.length; i++) { // back left
            if (!isInBounds(x + i, y - i)) {
                break;
            }
            if (matrix[x + i][y - i] == null) {
                moves.push([x + i, y - i]);
            } else {
                if (matrix[x + i][y - i].color != this.color) {
                    moves.push([x + i, y - i]);
                }
                break;
            }
        }
        for (let i = 1; i < matrix.length; i++) { // back right
            if (!isInBounds(x + i, y + i)) {
                break;
            }
            if (matrix[x + i][y + i] == null) {
                moves.push([x + i, y + i]);
            } else {
                if (matrix[x + i][y + i].color != this.color) {
                    moves.push([x + i, y + i]);
                }
            }
            break;
        }

        for (let i = x - 1; i >= 0; i--) { // forward
            if (matrix[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (matrix[i][y].color != this.color) {
                    moves.push([i, y]);
                }
                break;
            }
        }
        for (let i = x + 1; i < matrix.length; i++) { // backward
            if (matrix[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (matrix[i][y].color != this.color) {
                    moves.push([i, y]);
                }
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) { // left
            if (matrix[x][i] == null) {
                moves.push([x, i]);
            } else {
                if (matrix[x][i].color != this.color) {
                    moves.push([x, i]);
                }
                break;
            }
        }
        for (let i = y + 1; i < matrix.length; i++) { // right

            if (matrix[x][i] == null) {
                moves.push([x, i]);
            } else {
                if (matrix[x][i].color != this.color) {
                    moves.push([x, i]);
                }
                break;
            }
        }
        return moves;
    }
}

class Bishop extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;
        for (let i = 1; i < board.length; i++) { // front left
            if (!isInBounds(x - i, y - i)) {
                break;
            }
            if (board[x - i][y - i] == null) {
                moves.push([x - i, y - i]);
            } else {
                if (board[x - i][y - i].color != this.color) {
                    moves.push([x - i, y - i]);
                }
                break;
            }
        }
        for (let i = 1; i < board.length; i++) { // front right
            if (!isInBounds(x - i, y + i)) {
                break;
            }
            if (board[x - i][y + i] == null) {
                moves.push([x - i, y + i]);
            } else {
                if (board[x - i][y + i].color != this.color) {
                    moves.push([x - i, y + i]);
                }
                break;
            }
        }
        for (let i = 1; i < board.length; i++) { // back left
            if (!isInBounds(x + i, y - i)) {
                break;
            }
            if (board[x + i][y - i] == null) {
                moves.push([x + i, y - i]);
            } else {
                if (board[x + i][y - i].color != this.color) {
                    moves.push([x + i, y - i]);
                }
                break;
            }
        }
        for (let i = 1; i < board.length; i++) { // back right
            if (!isInBounds(x + i, y + i)) {
                break;
            }
            if (board[x + i][y + i] == null) {
                moves.push([x + i, y + i]);
            } else {
                if (board[x + i][y + i].color != this.color) {
                    moves.push([x + i, y + i]);
                }
                break;
            }
        }
        return moves;
    }
}

class Knight extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(matrix) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;

        if (isInBounds(x + 1, y + 2) && (matrix[x + 1][y + 2] == null || matrix[x + 1][y + 2].color != this.color)) {
            moves.push([x + 1, y + 2])
        }
        if (isInBounds(x + 1, y - 2) && (matrix[x + 1][y - 2] == null || matrix[x + 1][y - 2].color != this.color)) {
            moves.push([x + 1, y - 2])
        }
        if (isInBounds(x - 1, y + 2) && (matrix[x - 1][y + 2] == null || matrix[x - 1][y + 2].color != this.color)) {
            moves.push([x - 1, y + 2])
        }
        if (isInBounds(x - 1, y - 2) && (matrix[x - 1][y - 2] == null || matrix[x - 1][y - 2].color != this.color)) {
            moves.push([x - 1, y - 2])
        }

        if (isInBounds(x + 2, y + 1) && (matrix[x + 2][y + 1] == null || matrix[x + 2][y + 1].color != this.color)) {
            moves.push([x + 2, y + 1])
        }
        if (isInBounds(x + 2, y - 1) && (matrix[x + 2][y - 1] == null || matrix[x + 2][y - 1].color != this.color)) {
            moves.push([x + 2, y - 1])
        }
        if (isInBounds(x - 2, y + 1) && (matrix[x - 2][y + 1] == null || matrix[x - 2][y + 1].color != this.color)) {
            moves.push([x - 2, y + 1])
        }
        if (isInBounds(x - 2, y - 1) && (matrix[x - 2][y - 1] == null || matrix[x - 2][y - 1].color != this.color)) {
            moves.push([x - 2, y - 1])
        }


        return moves;
    }
}

class Rook extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;
        for (let i = x - 1; i >= 0; i--) { // forward
            if (board[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (board[i][y].color != this.color) {
                    moves.push([i, y]);
                }
                break
            }
        }
        for (let i = x + 1; i < board.length; i++) { // backward
            if (board[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (board[i][y].color != this.color) {
                    moves.push([i, y]);
                }
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) { // left
            if (board[x][i] == null) {
                moves.push([x, i]);
            } else {
                if (board[x][i].color != this.color) {
                    moves.push([x, i]);
                }
                break;
            }
        }
        for (let i = y + 1; i < board.length; i++) { // right
            if (board[x][i] == null) {
                moves.push([x, i]);
            } else {
                if (board[x][i].color != this.color) {
                    moves.push([x, i]);
                }
                break;
            }
        }
        return moves;
    }
}

function isInBounds(x, y) {
    return (x < 8 && x >= 0 && y < 8 && y >= 0);
}