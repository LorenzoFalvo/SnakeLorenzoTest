import { Sprite, Scene, BaseGraphic, ThunderMath, Point } from "@gamindo/thunder";


export default class SnakeBody extends BaseGraphic {
    public posX: number;
    public posY: number;
    public lastPosX: number;
    public lastPosY: number;
    public row: number;
    public col: number;
    public lastRow: number;
    public lastCol: number;
    private bodyFrames: string[];

    constructor(scene: Scene, x: number, y: number, texture: string, frame: string, row: number, col: number, size: number, isHead: boolean) {
        super(scene);

        this.posX = x;
        this.posY = y;
        this.lastPosX = x;
        this.lastPosY = y;
        this.position.set(x, y);

        this.row = row;
        this.col = col;
        this.lastRow = row;
        this.lastCol = col;

        if (isHead) {
            this.bodyFrames = ["torreFronte", "torreRetro", "torreDxSx"];
        } else {
            this.bodyFrames = ["pedoneFronte", "pedoneRetro", "pedoneDxSx"];
        }

        // this.setOrigin(0.5, 0.5);
        this.beginDraw(0xfffff, false);
        this.drawRect(0, 0, size, size, true);
        this.endDraw();
        
    }

    public SetLastValue() {
        this.lastRow = this.row;
        this.lastCol = this.col;
        this.lastPosX = this.posX;
        this.lastPosY = this.posY;
    }

    // public SetNewValue(x: number, y: number){
    //     this.posX = x;
    //     this.posY = y;

    //     this.position.set(this.posX, this.posY);
    // }

    public SetNewValue(x: number, y: number, row: number, col: number) {
        // const oldPos: Point = new Point(this.posX, this.posY);
        // const newPos: Point = new Point(x, y);
        // var dir: Point = newPos.subtract(oldPos);
        // var dirNormalized: Point = dir.normalize();
        // console.log("dir: " + dirNormalized.x + ", " + dirNormalized.y);

        // if (dirNormalized.x == -1) {
        //     this.setFlip(true, false);
        //     this.setFrame(this.bodyFrames[2]);
        // } else if (dirNormalized.x == 1) {
        //     this.setFlip(false, false);
        //     this.setFrame(this.bodyFrames[2]);
        // }

        // if (dirNormalized.y == -1) {
        //     this.setFlip(false, false);
        //     this.setFrame(this.bodyFrames[1]);
        // } else if (dirNormalized.y == 1) {
        //     this.setFlip(false, false);
        //     this.setFrame(this.bodyFrames[0]);
        // }

        this.posX = x;
        this.posY = y;
        this.row = row;
        this.col = col;
    }
}
