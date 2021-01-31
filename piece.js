class Piece {

    static imgs = {};
    constructor(color, type, x, y) {
        this.color = color;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    static async loadImgs() {
        let names = ['bb', 'bk', 'bn', 'bp', 'bq', 'br', 'wb', 'wk', 'wn', 'wp', 'wq', 'wr']
        let numLoaded = 0;
        names.forEach(n => {
            let img = new Image();
            img.onload = () => {
                Piece.imgs[n] = img;
                //console.log("Loaded " + n);
                numLoaded++;
            };
            img.src = `img/${n}.png`;
        })

        while (numLoaded != 12) {
            await sleep(10)
        }
        console.log("all imgs loaded")
        // console.log(Piece.imgs)
        initBoard()
    }

    show() {
        let ctx = document.getElementById("chess").getContext("2d");
        ctx.drawImage(Piece.imgs[`${this.color}${this.type}`], this.y * SPACING, this.x * SPACING, SPACING, SPACING)
    }
}

class Pawn extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);

    }
}
class King extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        
    }
}class Queen extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        
    }
}class Bishop extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        
    }
}class Knight extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        
    }
}class Rook extends Piece {
    constructor(color, type, x, y) {
        super(color, type, x, y);
        
    }
}

function sleep(ms) {
    console.log("waiting")
    return new Promise(resolve => setTimeout(resolve, ms));
}