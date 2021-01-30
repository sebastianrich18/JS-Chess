class Board {
    board = []

    init() {
        for (let i = 0; i < 8; i++) {
                this.board.push([null, null, null, null, null, null, null, null])
        }

        let pos = [['br', 'bk', 'bb', 'bq', 'bk', 'bb', 'bk', 'br'],
                   ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
                   ['', '', '', '', '', '', '', ''],
                   ['', '', '', '', '', '', '', ''],
                   ['', '', '', '', '', '', '', ''],
                   ['', '', '', '', '', '', '', ''],
                   ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp']
                   ['wr', 'wk', 'wb', 'wq', 'wk', 'wb', 'wk', 'wr']]

        for (let i = 0; i < 8; i++) {
           for(let j = 0; j < 8; j++) {
               if(pos[i][j] != '') {
                    console.log(this.board[i][j])
                    console.log(pos[i][j].split('')[0], pos[i][j].split('')[1], i, j)
                    this.board[i][j] = new Piece(pos[i][j].split('')[0], pos[i][j].split('')[1], i, j)
                    console.log(this.board[i][j])
               }
           }
        }
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
                ctx.fillRect(SPACING * j, SPACING * i, SPACING, SPACING);
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