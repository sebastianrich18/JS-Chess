

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
                console.log("Loaded " + n);
                numLoaded++;
            };
            img.src = `img/${n}.png`;
        })

        while (numLoaded != 12) {
            await sleep(0)
        }
        console.log("all imgs loaded")
        initBoard()
    }

    show() {
        let ctx = document.getElementById("chess").getContext("2d");
        ctx.drawImage(Piece.imgs[`${this.type}${this.color}`], this.x * SPACING, this.y * SPACING, SPACING, SPACING)
    }
}

function sleep(ms) {
    console.log("waiting")
    return new Promise(resolve => setTimeout(resolve, ms));
  }