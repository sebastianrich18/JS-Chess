class Board {
    board = []

    init() {
        for (let i = 0; i < 8; i++) {
            this.board.push([null, null, null, null, null, null, null, null])
        }

        let startingPos =
            [['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'wk', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']]

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (startingPos[i][j] != '') {
                    let color = startingPos[i][j].split('')[0];
                    let type = startingPos[i][j].split('')[1]
                    switch (type) {
                        case 'p':
                            this.board[i][j] = new Pawn(color, type, i, j);
                            break;
                        case 'k':
                            this.board[i][j] = new King(color, type, i, j);
                            break;
                        case 'b':
                            this.board[i][j] = new Bishop(color, type, i, j);
                            break;
                        case 'q':
                            this.board[i][j] = new Queen(color, type, i, j);
                            break;
                        case 'r':
                            this.board[i][j] = new Rook(color, type, i, j);
                            break;
                        case 'n':
                            this.board[i][j] = new Knight(color, type, i, j);
                            break;
                    }
                }
            }
        }
    }

    show() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        fill(255)
                    } else {
                        fill(0)
                    }
                } else {
                    if (j % 2 == 0) {
                        fill(0)
                    } else {
                        fill(255)
                    }
                }
                rect(SPACING * i, SPACING * j, SPACING, SPACING);
            }
        }
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board.length; y++) {

                if (this.board[x][y] instanceof Piece) {
                    this.board[x][y].show()
                }
            }
        }
    }

    move(x1, y1, x2, y2) {
        let piece = this.board[y1][x1];
        // console.log(y1, x1)
        // console.log(piece)
        piece.matrixX = y2;
        piece.matrixY = x2;
        piece.hasMoved = true;
        this.board[y1][x1] = null;
        this.board[y2][x2] = piece;
    }

    castle(kx, ky, rx, ry, isKingSide) {
        console.log(rx, ry)
        let rook = this.board[rx][ry];
        if (isKingSide) {
            this.move(ky, kx, ky + 2, kx);
            rook.matrixX = kx;
            rook.matrixY = ky + 1;
            this.board[kx][ky + 1] = rook;
        } else {
            this.move(ky, kx, ky - 2, kx);
            rook.matrixX = kx;
            rook.matrixY = ky - 1;
            this.board[kx][ky - 1] = rook;
        }
        console.log('castles')
    }
}