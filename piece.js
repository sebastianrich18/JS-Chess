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

    move(board, x, y) {
        if (this.matrixX == x && this.matrixX + 1 == y && board[x][y] == null) {
            console.log('can move')
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