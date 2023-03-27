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
    private gameOver!: boolean;

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
        this.snakeSpeed = 0.4;
        this.timestamp = 0;
        this.gameOver = false;

        this.interactive = true;
        this.onPointerDown.subscribe(this.pointerDownLogic, this);
        this.inputManager.actPress.subscribe(this.inputPressLogic, this);

        this.createGrid();

        this.onUpdate.subscribe(this.gameLoop, this);

        console.log("Board-> " + this.snakeBodyList);

        this.generateObject(CellType.BONUS);
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
        if(!this.gameOver){

            this.timestamp += this.delta;
            // console.log(this.timestamp/1000);

            if(this.timestamp/1000 >= this.snakeSpeed){
                this.timestamp = 0;
                // console.log("next Dir: " + this.nextDirection);
    
                if (this.nextDirection != DIRECTION.NONE) {
                    this.snakeDirection = this.nextDirection;
                    const nextCell: Cell = this.getNextCell(this.getHeadCell());
                    
                    if(this.checkCrash(nextCell)){
                        this.snakeDirection = DIRECTION.NONE;
                        this.inputManager.actPress.unsubscribe(this.inputPressLogic, this);
                        //GameOver
                        console.log("GAME OVER MATE!");
                        this.gameOver = true;
                    } else {
                        //Can Move Snake
                        this.moveSnake(nextCell);
                    }
                }
            }
        }
        
    }

    private generateObject(cellType: CellType, count: number = 0): void{
        if(count > 5 && cellType === CellType.MALUS) return;

        //Random row/col 1 cell away from border
        const row: number = ThunderMath.randomInt(1, this.board.rowCount - 2);
        const col: number = ThunderMath.randomInt(1, this.board.colCount - 2);

        if(this.board.cells[row][col].GetCellType() == CellType.EMPTY){
            switch(cellType){
                case CellType.MALUS:
                    //Checks if this Malus is near our snake's head
                    if (
                        row == this.snakeBodyList[0].row + 1 ||
                        row == this.snakeBodyList[0].row - 1 ||
                        col == this.snakeBodyList[0].col + 1 ||
                        col == this.snakeBodyList[0].col - 1
                    ) {
                        this.generateObject(cellType);
                        return;
                    }

                    this.board.cells[row][col].SetCellType(CellType.MALUS, "game_2", "blokObstacle");
                    // this.tweens.add(TweenAnimations.Sine(this.board.cells[row][col], 0.05, SINE_PROPS.SCALE, 800));
                    break;

                case CellType.BONUS:
                    //Checks if we can collect this bonus with our snake or if we can't collect this bonus if created
                    if (this.board.cells[row][col - 1].GetCellType() == CellType.MALUS && this.board.cells[row][col + 1].GetCellType() == CellType.MALUS) {
                        if (this.board.cells[row - 1][col].GetCellType() == CellType.MALUS || this.board.cells[row + 1][col].GetCellType() == CellType.MALUS) {
                            this.generateObject(cellType);
                            break;
                        }
                    } else if (this.board.cells[row - 1][col].GetCellType() == CellType.MALUS && this.board.cells[row + 1][col].GetCellType() == CellType.MALUS) {
                        if (this.board.cells[row][col - 1].GetCellType() == CellType.MALUS || this.board.cells[row][col + 1].GetCellType() == CellType.MALUS) {
                            this.generateObject(cellType);
                            break;
                        }
                    }
                    this.board.cells[row][col].SetCellType(CellType.BONUS, "game_2", "pedoneFronte");
                    // this.tweens.add(TweenAnimations.Sine(this.board.cells[row][col], 0.05, SINE_PROPS.SCALE, 800));
                    break; 
            }
        } else {
            this.generateObject(cellType, count +1);
        }
    } 

    private checkCrash(nextCell: Cell): boolean{
        switch(nextCell.GetCellType()){
            case CellType.MALUS:
                console.log("Hit Malus");
                return true;
            
            case CellType.BODY:
                console.log("Hit Body");
                return true;

            case CellType.HEAD:
                console.log("Hit Head");
                return true;

            case CellType.BONUS:
                console.log("Hit Bonus");
                this.createNewBody();
                return false;
            
            default: 
                return false;
        }
    }

    private moveSnake(nextCell: Cell): void{
        
        nextCell.SetCellType(CellType.HEAD, "", "");

        const head: SnakeBody = this.snakeBodyList[0];
        head.SetLastValue();
        head.SetNewValue(nextCell.posX, nextCell.posY, nextCell.GetRow(), nextCell.GetCol(), this.snakeDirection);
        // console.log("NextCell_X: " + nextCell.posX);
        // console.log("NextCell_Y: " + nextCell.posY);
        head.position.set(nextCell.posX, nextCell.posY);
        
        // console.log("New position: " + head.position.x + " , " + head.position.y);
        this.board.cells[head.lastRow][head.lastCol].SetCellType(CellType.EMPTY, "", "");

        //Move all Snake's Body
        if(this.snakeBodyList.length > 1){
            console.log("move body too!");
            for(let i = 1; i <= this.snakeBodyList.length-1; i++){
                const previousBody: SnakeBody = this.snakeBodyList[i-1];
                const thisBody: SnakeBody = this.snakeBodyList[i];

                // console.log("Previous Last Position: " + previousBody.lastPosX + " , " + previousBody.lastPosY);
                // console.log("New Body Position: " + previousBody.lastPosX + " , " + previousBody.lastPosY);
                thisBody.SetLastValue();
                thisBody.SetNewValue(previousBody.lastPosX, previousBody.lastPosY, previousBody.lastRow, previousBody.lastCol, previousBody.lastDir);
                thisBody.position.set(previousBody.lastPosX, previousBody.lastPosY);

                this.board.cells[thisBody.row][thisBody.col].SetCellType(CellType.BODY, "", "");

                if(i == this.snakeBodyList.length-1){
                    this.board.cells[thisBody.lastRow][thisBody.lastCol].SetCellType(CellType.EMPTY, "", "");
                }
            }
        }

        
    }

    private createNewBody(): void{
        const lastBody: SnakeBody = this.getLastSnakeBody();
        const newBody: SnakeBody = new SnakeBody(this, lastBody.lastPosX, lastBody.lastPosY, ["test/Lollo_idle_0", "test/Lollo_idle_1"], lastBody.lastRow, lastBody.lastCol, 70,false, lastBody.lastDir);
        // newBody.alpha = 0;

        this.board.cells[newBody.row][newBody.col].SetCellType(CellType.BODY, "", "");
        this.snakeBodyList.push(newBody);

        this.generateObject(CellType.BONUS);
        this.add(newBody);
    }


    public getLastSnakeBody(): SnakeBody {
        return this.snakeBodyList[this.snakeBodyList.length - 1];
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

        // for (let row = 0; row < this.board.rowCount; row++) {
        //     for (let col = 0; col < this.board.colCount; col++) {
        //         this.add(this.board.cells[row][col]);
        //     }
        // }
        this.add(this.board);
        this.createSnake(this.board.cells[4][5].posX, this.board.cells[4][5].posY, 4, 5);
    }

    private createSnake(x: number, y: number, row: number, col: number): void{
        const initSnake: SnakeBody = new SnakeBody(this, x, y, ["test/Lollo_idle_0", "test/Lollo_idle_1"] ,row, col, 70, true, 0);
        this.board.cells[row][col].SetCellType(CellType.HEAD, "", "");
        this.snakeBodyList = new Array<SnakeBody>();
        this.snakeBodyList.push(initSnake);
        this.add(initSnake);

        this.spaceMove = 80;
    }
}
