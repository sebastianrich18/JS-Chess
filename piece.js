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
}

class Pawn extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        this.hasMoved = false;
    }

    canMove(board, x, y) {
        console.log('checking move to ', x, y, " from ", this.matrixX, this.matrixY)
        if (this.color == "w") {
            if (this.matrixX - 1 == x && this.matrixY == y && board[x][y] == null) {
                this.hasMoved = true;
                return true

            } else if (this.matrixX - 2 == x && this.matrixY == y && board[x][y] == null && !this.hasMoved && board[x + 1][y] == null) {
                this.hasMoved = true
                return true

            } else if (((this.matrixX - 1 == x && this.matrixY + 1 == y) || (this.matrixX - 1 == x && this.matrixY - 1 == y)) && board[x][y] != null & board[x][y].color == 'b'){
                // console.log('takes')
                this.hasMoved = true
                return true;

            } else {
                return false;

            }
        } else {
            if (this.matrixX + 1 == x && this.matrixY == y && board[x][y] == null) {
                this.hasMoved = true
                return true

            } else if (this.matrixX + 2 == x && this.matrixY == y && board[x][y] == null && !this.hasMoved && board[x - 1][y] == null) {
                this.hasMoved = true
                return true
            } else if (((this.matrixX + 1 == x && this.matrixY - 1 == y) || (this.matrixX + 1 == x && this.matrixY + 1 == y)) && board[x][y] != null & board[x][y].color == 'w'){
                // console.log('takes')
                this.hasMoved = true
                return true;

            } else {
                return false;
            }
        }
    }
}
class King extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        this.hasMoved = false
    }
}
class Queen extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);

    }
}
class Bishop extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);

    }
}
class Knight extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);

    }
}
class Rook extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);

    }
}