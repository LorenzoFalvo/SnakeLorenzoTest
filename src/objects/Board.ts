import { BaseGraphic, Group, Scene } from "@gamindo/thunder";
import Cell from "./Cell";


export class Board extends Group{

    public rowCount: number;
    public colCount: number;
    public cells: Cell[][];

    constructor(scene: Scene, rowCount: number, colCount: number, startX: number, startY: number, offsetCell: number){
        super(scene);

        this.rowCount = rowCount;
        this.colCount = colCount;
        this.cells = [];
        
        for(let row = 0; row < this.rowCount; row++){
            this.cells[row] = [];
            for(let col = 0; col < this.colCount; col++){
                const posX: number = startX + offsetCell * col;
                const posY: number = startY + offsetCell * row;
                const newCell: Cell = new Cell(this.scene, row, col, posX, posY, offsetCell);
                this.cells[row][col] = newCell;
                const graphic = new BaseGraphic(this.scene);
                graphic.beginDraw(0xffffff, true);
                graphic.drawRect(posX, posY, 80, 80, true);
                graphic.endDraw();
                this.add([newCell, graphic]);
            }
        }
    }

    public GetCells(): Cell[][] {
        return this.cells;
    }

    public SetCells(cells: Cell[][]): void {
        this.cells = cells;
    }
}