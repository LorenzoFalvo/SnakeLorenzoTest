import { Scene, PointerEvent, KEY_CODE, ThunderMath} from "@gamindo/thunder";
import { Board } from "../objects/Board";
import Cell, { CellType } from "../objects/Cell";
import SnakeBody from "../objects/SnakeBody";


export enum DIRECTION {
    UP = 1,
    RIGHT = 2,
    DOWN = -1,
    LEFT = -2,
    NONE = 0,
}


export class SnakeGame extends Scene {

    //test
    private board!: Board;

    private nextDirection!: DIRECTION;
    private snakeDirection!: DIRECTION;
    private currentPieces!: number;
    private snakeSpeed!: number;
    private timestamp!: number;

    //imported from snake code
    private snakeBodyList!: Array<SnakeBody>;
    public spaceMove!: number;

    override init(args?: any): void {
        super.init(args);
    }

    override preLoad(): void {
        super.preLoad();
    }

    override create(): void {
        super.create();
        console.log("Call create super func");

        this.nextDirection = DIRECTION.NONE;
        this.snakeDirection = DIRECTION.NONE;
        this.currentPieces = 0;
        this.snakeSpeed = 0.5;
        this.timestamp = 0;

        // this.interactive = true;
        // this.onPointerDown.subscribe(this.pointerDownLogic, this);
        this.inputManager.actPress.subscribe(this.inputPressLogic, this);

        this.createGrid();

        this.onUpdate.subscribe(this.gameLoop, this);

        console.log("Board-> " + this.snakeBodyList);

        
    }

    override shutdown(): void {
        super.shutdown();
    }

    private pointerDownLogic(data: PointerEvent):void {
        console.log("Mouse position: {" + data.position.x + "," + data.position.y);
    }

    private inputPressLogic(key: KEY_CODE | string): void {
        // WASD Movement
        if(key == KEY_CODE.KEY_W) {
            this.updateDirection(DIRECTION.UP);
        }
        if(key == KEY_CODE.KEY_A) {
            this.updateDirection(DIRECTION.LEFT);
        }
        if(key == KEY_CODE.KEY_S) {
            this.updateDirection(DIRECTION.DOWN);
        }
        if(key == KEY_CODE.KEY_D) {
            this.updateDirection(DIRECTION.RIGHT);
        }
        // Arrows movement
        if(key == KEY_CODE.ARROW_UP) {
            this.updateDirection(DIRECTION.UP);
        }
        if(key == "ArrowLeft") {
            this.updateDirection(DIRECTION.LEFT);
        }
        if(key == KEY_CODE.ARROW_DOWN) {
            this.updateDirection(DIRECTION.DOWN);
        }
        if(key == KEY_CODE.ARROW_RIGHT) {
            this.updateDirection(DIRECTION.RIGHT);
        }
    }

    private gameLoop(delta: number): void {
        
        this.timestamp += this.delta;
        // console.log(this.timestamp/1000);
        
        if(this.timestamp/1000 >= this.snakeSpeed){
            this.timestamp = 0;
            console.log("next Dir: " + this.nextDirection);

            if (this.nextDirection != DIRECTION.NONE) {
                this.snakeDirection = this.nextDirection;
                const nextCell: Cell = this.getNextCell(this.getHeadCell());
                
                console.log(nextCell);
                this.moveSnake(nextCell);
            }
        }
    }

    private moveSnake(nextCell: Cell): void{
        
        nextCell.SetCellType(CellType.HEAD, "", "");

        const head: SnakeBody = this.snakeBodyList[0];
        head.SetLastValue();
        head.SetNewValue(nextCell.posX, nextCell.posY, nextCell.GetRow(), nextCell.GetCol());
        console.log("NextCell_X: " + nextCell.posX);
        console.log("NextCell_Y: " + nextCell.posY);

        // head.posX = nextCell.posX;
        // head.posY = nextCell.posY;
        console.log("New position: " + head.position.x + " , " + head.position.y);
        this.board.cells[head.lastRow][head.lastCol].SetCellType(CellType.EMPTY, "", "");
        
        this.snakeBodyList[0].SetNewValue(nextCell.posX, nextCell.posY, nextCell.GetRow(), nextCell.GetCol());
    }

    private updateDirection(newDirection: DIRECTION): void{
        if(ThunderMath.abs(newDirection) != ThunderMath.abs(this.snakeDirection)){
            this.nextDirection = newDirection;
            console.log(this.nextDirection);
        }
    }

    private getHeadCell():Cell{
        const snakeHead: SnakeBody = this.snakeBodyList[0];
        return this.board.cells[snakeHead.row][snakeHead.col];
    }

    private getNextCell(currentCell: Cell): Cell{
        let row: number = currentCell.GetRow();
        let col: number = currentCell.GetCol();

        if (this.snakeDirection == DIRECTION.UP) {
            row--;
        } else if (this.snakeDirection == DIRECTION.DOWN) {
            row++;
        } else if (this.snakeDirection == DIRECTION.LEFT) {
            col--;
        } else if (this.snakeDirection == DIRECTION.RIGHT) {
            col++;
        }

        row = ThunderMath.clamp(row, 0, this.board.rowCount - 1);
        col = ThunderMath.clamp(col, 0, this.board.colCount - 1);

        return this.board.GetCells()[row][col];
    }

    private createGrid(): void{
        
        this.board = new Board(this, 8, 10, 80, 260, 80);

        // var initialPosX = 360 - (SnakeGame.squareSize *(this.board.rowCount/2)) + (SnakeGame.squareSize/2);
        // let initialPosY = 640 - (SnakeGame.squareSize *(this.board.colCount/2)) + (SnakeGame.squareSize/2);

        for (let row = 0; row < this.board.rowCount; row++) {
            for (let col = 0; col < this.board.colCount; col++) {
                this.add(this.board.cells[row][col]);
            }
        }

        this.createSnake(this.board.cells[4][5].posX, this.board.cells[4][5].posY, 4, 5);
    }

    private createSnake(x: number, y: number, row: number, col: number): void{
        const initSnake: SnakeBody = new SnakeBody(this, x, y, "", "", row, col, true);
        this.board.cells[row][col].SetCellType(CellType.HEAD, "", "");
        this.snakeBodyList = new Array<SnakeBody>();
        this.snakeBodyList.push(initSnake);
        this.add(initSnake);

        this.spaceMove = 80;
    }
}
