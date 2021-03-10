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
        if (!holdingPiece) {
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

    isInBounds(x, y) {
        return (x < 8 && x >= 0 && y < 8 && y >= 0);
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
        // console.log(row, col)
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
        // console.log('checking king moves')
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;

        if (this.isInBounds(x, y + 1) && (board[x][y + 1] == null || board[x][y + 1].color != this.color)) { // right
            moves.push([x, y + 1])
        }
        if (this.isInBounds(x, y - 1) && (board[x][y - 1] == null || board[x][y].color != this.color)) { // left
            moves.push([x, y - 1])
        }
        if (this.isInBounds(x + 1, y) && (board[x + 1][y] == null || board[x + 1][y].color != this.color)) { // down
            moves.push([x + 1, y])
        }
        if (this.isInBounds(x - 1, y) && (board[x - 1][y] == null || board[x - 1][y].color != this.color)) { // up
            moves.push([x - 1, y])
        }
        if (this.isInBounds(x - 1, y - 1) && (board[x - 1][y - 1] == null || board[x - 1][y - 1].color != this.color)) { // front left
            moves.push([x - 1, y - 1])
        }
        if (this.isInBounds(x - 1, y + 1) && (board[x - 1][y + 1] == null || board[x - 1][y + 1].color != this.color)) { // front right
            moves.push([x - 1, y + 1])
        }
        if (this.isInBounds(x + 1, y + 1) && (board[x + 1][y + 1] == null || board[x + 1][y + 1].color != this.color)) { // back right
            moves.push([x + 1, y + 1])
        }
        if (this.isInBounds(x + 1, y - 1) && (board[x + 1][y - 1] == null || board[x + 1][y - 1].color != this.color)) { // back left
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

        // console.log(moves)
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
            if (!this.isInBounds(x - i, y - i)) {
                break;
            }
            if (matrix[x - i][y - i] == null) {
                moves.push([x - i, y - i]);
            } else {
                if (matrix[x - i][y - i].color != this.color) {
                    moves.push([x - i, y - i]);
                    break;
                }
            }
        }
        for (let i = 1; i < matrix.length; i++) { // front right
            if (!this.isInBounds(x - i, y + i)) {
                break;
            }
            if (matrix[x - i][y + i] == null) {
                moves.push([x - i, y + i]);
            } else {
                if (matrix[x - i][y + i].color != this.color) {
                    moves.push([x - i, y + i]);
                    break;
                }
            }
        }
        for (let i = 1; i < matrix.length; i++) { // back left
            if (!this.isInBounds(x + i, y - i)) {
                break;
            }
            if (matrix[x + i][y - i] == null) {
                moves.push([x + i, y - i]);
            } else {
                if (matrix[x + i][y - i].color != this.color) {
                    moves.push([x + i, y - i]);
                    break;
                }
            }
        }
        for (let i = 1; i < matrix.length; i++) { // back right
            if (!this.isInBounds(x + i, y + i)) {
                break;
            }
            if (matrix[x + i][y + i] == null) {
                moves.push([x + i, y + i]);
            } else {
                if (matrix[x + i][y + i].color != this.color) {
                    moves.push([x + i, y + i]);
                    break;
                }
            }
        }

        for (let i = x - 1; i >= 0; i--) { // forward
            if (matrix[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (matrix[i][y].color != this.color) {
                    moves.push([i, y]);
                    break
                }
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
                if (matrix[x][i].color != this.color);
                moves.push([x, i]);
                break;
            }
        }
        for (let i = y + 1; i < matrix.length; i++) { // right

            if (matrix[x][i] == null) {
                moves.push([x, i]);
            } else {
                (matrix[x][i].color != this.color);
                moves.push([x, i]);
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
            if (!this.isInBounds(x - i, y - i)) {
                break;
            }
            if (board[x - i][y - i] == null) {
                moves.push([x - i, y - i]);
            } else {
                if (board[x - i][y - i].color != this.color) {
                    moves.push([x - i, y - i]);
                    break;
                }
            }
        }
        for (let i = 1; i < board.length; i++) { // front right
            if (!this.isInBounds(x - i, y + i)) {
                break;
            }
            if (board[x - i][y + i] == null) {
                moves.push([x - i, y + i]);
            } else {
                if (board[x - i][y + i].color != this.color) {
                    moves.push([x - i, y + i]);
                    break;
                }
            }
        }
        for (let i = 1; i < board.length; i++) { // back left
            if (!this.isInBounds(x + i, y - i)) {
                break;
            }
            if (board[x + i][y - i] == null) {
                moves.push([x + i, y - i]);
            } else {
                if (board[x + i][y - i].color != this.color) {
                    moves.push([x + i, y - i]);
                    break;
                }
            }
        }
        for (let i = 1; i < board.length; i++) { // back right
            if (!this.isInBounds(x + i, y + i)) {
                break;
            }
            if (board[x + i][y + i] == null) {
                moves.push([x + i, y + i]);
            } else {
                if (board[x + i][y + i].color != this.color) {
                    moves.push([x + i, y + i]);
                    break;
                }
            }
        }
        return moves;
    }
}

class Knight extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixRow;
        let y = this.matrixCol;
        moves.push([x + 1, y + 2]);
        moves.push([x - 1, y + 2]);
        moves.push([x + 1, y - 2]);
        moves.push([x - 1, y - 2]);
        moves.push([x + 2, y + 1]);
        moves.push([x - 2, y + 1]);
        moves.push([x + 2, y - 1]);
        moves.push([x - 2, y - 1]);
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
                    break
                }
            }
        }
        for (let i = x + 1; i < board.length; i++) { // backward
            if (board[i][y] == null) {
                moves.push([i, y]);
            } else {
                if (board[i][y].color != this.color);
                moves.push([i, y]);
                break;
            }
        }
        for (let i = y - 1; i >= 0; i--) { // left
            if (board[x][i] == null) {
                moves.push([x, i]);
            } else {
                if (board[x][i].color != this.color);
                moves.push([x, i]);
                break;
            }
        }
        for (let i = y + 1; i < board.length; i++) { // right
            if (board[x][i] == null) {
                moves.push([x, i]);
            } else {
                (board[x][i].color != this.color);
                moves.push([x, i]);
                break;
            }
        }
        return moves;
    }
}