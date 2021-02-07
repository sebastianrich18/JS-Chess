class Piece {
    static imgs = {};

    constructor(color, type, matrixX, matrixY) {
        this.color = color;
        this.type = type;
        this.matrixX = matrixX;
        this.matrixY = matrixY;
        this.absX = matrixX * SPACING;
        this.absY = matrixY * SPACING;
    }

    show() {
        if (!locked) {
            this.absX = this.matrixX * SPACING;
            this.absY = this.matrixY * SPACING;
        }
        image(Piece.imgs[`${this.color}${this.type}`], this.absY, this.absX, SPACING, SPACING)
    }

    canMove(board, x, y) {
        console.log('checking move to ', x, y, " from ", this.matrixX, this.matrixY)
        let moves = this.getMoves(board);
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] == x && moves[i][1] == y) {
                if (moves[i][2] != undefined && moves[i][2] === true) { // if move is castle king side
                    console.log('castles kingside')
                    //board.castle(this.matrixX, this.matrixY, this.matrixX, this.matrixY + 3)
                    return "kingside"
                } else if (moves[i][2] != undefined && moves[i][2] === false) { // if move is castle queen side
                    //board.castle(this.matrixX, this.matrixY, this.matrixX, this.matrixY - 4)
                    console.log('castles queenside')
                    return 'queenside'
                }
                return true;
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

    getMoves(board) {
        let moves = [];
        let x = this.matrixX;
        let y = this.matrixY;
        if (this.color == 'w') {
            if (board[x - 1][y] == null) { // forward 1
                moves.push([x - 1, y]);
            }
            if (!this.hasMoved && board[x - 1][y] == null && board[x - 2][y] == null) { // forward 2
                moves.push([x - 2, y]);
            }
            if (board[x - 1][y - 1] != null && board[x - 1][y - 1].color == 'b') { // takes to the left
                moves.push([x - 1, y - 1]);
            }
            if (board[x - 1][y + 1] != null && board[x - 1][y + 1].color == 'b') { // takes to the right
                moves.push([x - 1, y + 1]);
            }
        } else {
            if (board[x + 1][y] == null) { // forward 1
                moves.push([x + 1, y]);
            }
            if (!this.hasMoved && board[x + 1][y] == null && board[x + 2][y] == null) { // forward 2
                moves.push([x + 2, y]);
            }
            if (board[x + 1][y - 1] != null && board[x + 1][y - 1].color == 'w') { // takes to the left
                moves.push([x + 1, y - 1]);
            }
            if (board[x + 1][y + 1] != null && board[x + 1][y + 1].color == 'w') { // takes to the right
                moves.push([x + 1, y + 1]);
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
        let x = this.matrixX;
        let y = this.matrixY;

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
        if (!this.hasMoves && board[x][y + 1] == null && board[x][y + 2] == null && board[x][y + 3].type == 'r' && !board[x][y + 3].hasMoved) { // castle king side
            moves.push([x, y + 2, true]);
            moves.push([x, y + 3, true])
        }
        if (!this.hasMoves && board[x][y - 1] == null && board[x][y - 2] == null && board[x][y - 3] == null && board[x][y - 4].type == 'r' && !board[x][y - 4].hasMoved) { // castle king side
            moves.push([x, y - 2, false]);
            moves.push([x, y - 3, false]);
            moves.push([x, y - 4, false]);
        }


        console.log(moves)
        return moves;
    }
}

class Queen extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixX;
        let y = this.matrixY;
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

class Bishop extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    getMoves(board) {
        let moves = [];
        let x = this.matrixX;
        let y = this.matrixY;
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
        let x = this.matrixX;
        let y = this.matrixY;
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
        let x = this.matrixX;
        let y = this.matrixY;
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