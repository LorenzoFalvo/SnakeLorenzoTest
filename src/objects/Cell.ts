import { BaseGraphic, Scene} from "@gamindo/thunder";


export enum CellType {
    HEAD = 0,
    BODY = 1,
    BONUS = 2,
    MALUS = 3,
    PATH = 4,

    EMPTY = -1,
}

export default class Cell extends BaseGraphic{
    private row: number = 0;
    private col: number = 0;
    public posX: number = 0;
    public posY: number = 0;
    public lastRow: number = 0;
    public lastCol: number = 0;
    public lastXPos: number;
    public lastYPos: number;
    private cellType: CellType;

    constructor(scene: Scene, row: number, col: number, posX: number, posY: number, size: number = 64) {
        super(scene);

        this.row = row;
        this.col = col;
        this.posX = posX;
        this.posY = posY;
        this.lastXPos = posX;
        this.lastYPos = posY;
        this.visible = true;
        this.cellType = CellType.EMPTY;

        // const graphic = new BaseGraphic(scene);
        this.beginDraw(0xffffff, true);
        this.drawRect(posX, posY, size, size, true);
        this.endDraw();
    }

    public SetLastValue() {
        this.lastRow = this.row;
        this.lastCol = this.col;
        this.lastXPos = this.posX;
        this.lastYPos = this.posY;
    }

    public SetNewValue(row: number, col: number, x: number, y: number) {
        this.row = row;
        this.col = col;
        this.posX = x;
        this.posY = y;
    }

    public GetCellType(): CellType {
        return this.cellType;
    }

    public SetCellType(cellType: CellType, key: string, frame: string): void {
        this.SetOnlyType(cellType);
        // this.SetOnlyFrame(key, frame);
    }

    public SetOnlyType(cellType: CellType): void {
        this.cellType = cellType;
    }

    public SetOnlyFrame(key: string, frame: string): void {
        if (frame != "") {
            this.SetOnlyFrame(key, frame);
            this.visible = true;
            this.alpha = 0;
            // this.scene.tweens.add(TweenAnimations.PopIn(this, 1, 250));
        } else {
            this.SetOnlyFrame("", "empty");
            // this.scale = 1;
            this.alpha = 1;
            // this.scene.tweens.add({
            //     ...TweenAnimations.PopOut(this, 0, 250),
            //     onComplete: () => {
            //         this.setTexture("empty");
            //         this.setScale(1);
            //         this.setAlpha(1);
            //     },
            //     onCompleteScope: this,
            // });
        }
    }

    public GetRow(): number {
        return this.row;
    }

    public GetCol(): number {
        return this.col;
    }

    public SetRow(row: number): void {
        this.row = row;
    }

    public SetCol(col: number): void {
        this.col = col;
    }
}