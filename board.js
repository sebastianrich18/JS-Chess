class Board {

    constructor(matrix) {
        if (matrix instanceof Array) {
            this.matrix = []
            matrix.forEach(arr => { this.matrix.push(arr) })
        } else {
            this.matrix = []
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
                    fill(0)
                }
                rect(SPACING * row, SPACING * col, SPACING, SPACING);
            }
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
        console.log('moveing on new board')
        this.move(piece.matrixRow, piece.matrixCol, landingRow, landingCol)
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
                    piece.getMoves(this.matrix).forEach(m => { // get all moves for every piece
                        moves.push(m);
                    });
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

    move(startingRow, startingCol, ladningRow, landingCol) {
        console.log()
        console.log('moveing from ', startingRow, startingCol, " to ", landingRow, landingCol)
        // console.log(JSON.stringify(this.matrix))
        let piece = this.matrix[startingRow][startingCol]
        piece.matrixRow = ladningRow;
        piece.matrixCol = landingCol;
        piece.hasMoved = true;
        this.matrix[startingRow][startingCol] = null;
        this.matrix[ladningRow][landingCol] = piece;
    }

    castle(kx, ky, rx, ry, isKingSide) {
        // console.log(rx, ry)
        let rook = this.matrix[rx][ry];
        if (isKingSide) {
            this.move(ky, kx, ky + 2, kx);
            rook.matrixX = kx;
            rook.matrixY = ky + 1;
            this.matrix[kx][ky + 1] = rook;
        } else {
            this.move(ky, kx, ky - 2, kx);
            rook.matrixX = kx;
            rook.matrixY = ky - 1;
            this.matrix[kx][ky - 1] = rook;
        }
        console.log('castles')
    }
}