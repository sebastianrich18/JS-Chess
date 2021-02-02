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
        // console.log('checking move to ', x, y, " from ", this.matrixX, this.matrixY)
        if (this.color == "w") {
            if (this.matrixX - 1 == x && this.matrixY == y && board[x][y] == null) {
                this.hasMoved = true;
                return true

            } else if (this.matrixX - 2 == x && this.matrixY == y && board[x][y] == null && !this.hasMoved && board[x + 1][y] == null) {
                this.hasMoved = true
                return true

            } else if (((this.matrixX - 1 == x && this.matrixY + 1 == y) || (this.matrixX - 1 == x && this.matrixY - 1 == y)) && board[x][y] != null & board[x][y].color == 'b') {
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
            } else if (((this.matrixX + 1 == x && this.matrixY - 1 == y) || (this.matrixX + 1 == x && this.matrixY + 1 == y)) && board[x][y] != null & board[x][y].color == 'w') {
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
    canMove(board, x, y) {
        let xDif = x - this.matrixX;
        let yDif = y - this.matrixY;
        if ((Math.abs(xDif) <= 1 && Math.abs(yDif) <= 1) && (board[x][y] == null || board[x][y].color != this.color)) {
            this.hasMoved = true;
            return true;
        }
    }
}
class Queen extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    canMove(board, x, y) {
        let xDif = x - this.matrixX;
        let yDif = y - this.matrixY;
        let xDirection, yDirection;

        (xDif > 0) ? xDirection = 1 : xDirection = -1;
        (yDif > 0) ? yDirection = 1 : yDirection = -1;

        if (Math.abs(xDif) == Math.abs(yDif) && (board[x][y] == null || board[x][y].color != this.color)) {
            // console.log('moveing diag')
            let tempX = this.matrixX + xDirection;
            let tempY = this.matrixY + yDirection;
            while (tempX != x && tempY != y) { // check if path to landing square is open
                if (board[tempX][tempY] != null) {
                    return false
                } else {
                    tempX += xDirection;
                    tempY += yDirection;
                }
            }
            return true
        } else if ((x == this.matrixX || y == this.matrixY) && (board[x][y] == null || board[x][y].color != this.color)) {
            if (this.matrixX == x) {
                // console.log('moveing sideways')
                let yDir = (this.matrixY - y < 0) ? 1 : -1;
                let tempY = this.matrixY + yDir;
                while (tempY != y) {
                    console.log(x, tempY, yDir)
                    if (board[x][tempY] != null) {
                        return false;
                    }
                    tempY += yDir;
                }
                return true;
            } else if (this.matrixY == y) {
                // console.log('moveing forward')
                let xDir = (this.matrixX - x < 0) ? 1 : -1;
                let tempX = this.matrixX + xDir;
                while (tempX != x) {
                    console.log(tempX, y, xDir)
                    if (board[tempX][y] != null) {
                        return false;
                    }
                    tempX += xDir;
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
class Bishop extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    canMove(board, x, y) {
        // console.log('checking move to ', x, y, " from ", this.matrixX, this.matrixY);
        let xDif = x - this.matrixX;
        let yDif = y - this.matrixY;
        let xDirection, yDirection;

        (xDif > 0) ? xDirection = 1 : xDirection = -1;
        (yDif > 0) ? yDirection = 1 : yDirection = -1;

        if (Math.abs(xDif) == Math.abs(yDif) && (board[x][y] == null || board[x][y].color != this.color)) {
            let tempX = this.matrixX + xDirection;
            let tempY = this.matrixY + yDirection;
            while (tempX != x && tempY != y) { // check if path to landing square is open
                // console.log(tempX, tempY)
                if (board[tempX][tempY] != null) {
                    return false
                } else {
                    tempX += xDirection;
                    tempY += yDirection;
                }
            }
            return true
        }
    }
}
class Knight extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }

    canMove(board, x, y) {
        let xDist = this.matrixX - x;
        let yDist = this.matrixY - y;
        if (((Math.abs(xDist) == 2 && Math.abs(yDist) == 1) || (Math.abs(xDist) == 1 && Math.abs(yDist) == 2)) && (board[x][y] == null || board[x][y].color != this.color)) {
            return true;
        } else {
            return false;
        }
    }
}
class Rook extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
    }
    canMove(board, x, y) {
        console.log('checking move to ', x, y, " from ", this.matrixX, this.matrixY)
        if ((x == this.matrixX || y == this.matrixY) && (board[x][y] == null || board[x][y].color != this.color)) {
            if (this.matrixX == x) {
                // console.log('moveing sideways')
                let yDir = (this.matrixY - y < 0) ? 1 : -1;
                let tempY = this.matrixY + yDir;
                while (tempY != y) {
                    console.log(x, tempY, yDir)
                    if (board[x][tempY] != null) {
                        return false;
                    }
                    tempY += yDir;
                }
                return true;
            } else if (this.matrixY == y) {
                // console.log('moveing forward')
                let xDir = (this.matrixX - x < 0) ? 1 : -1;
                let tempX = this.matrixX + xDir;
                while (tempX != x) {
                    console.log(tempX, y, xDir)
                    if (board[tempX][y] != null) {
                        return false;
                    }
                    tempX += xDir;
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}