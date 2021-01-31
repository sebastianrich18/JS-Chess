class Board {
    board = []

    init() {
        for (let i = 0; i < 8; i++) {
            this.board.push([null, null, null, null, null, null, null, null])
        }

        let startingPos =
            [['br', 'bk', 'bb', 'bq', 'bk', 'bb', 'bk', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wk', 'wb', 'wq', 'wk', 'wb', 'wk', 'wr']]

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
        console.log(this.board)
    }

    show() {
        let ctx = document.getElementById("chess").getContext("2d");
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        ctx.fillStyle = '#FFFFFF'
                    } else {
                        ctx.fillStyle = '#000000'
                    }
                } else {
                    if (j % 2 == 0) {
                        ctx.fillStyle = '#000000'
                    } else {
                        ctx.fillStyle = '#FFFFFF'
                    }
                }
                ctx.fillRect(SPACING * i, SPACING * j, SPACING, SPACING);
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
}