import { Scene, PointerEvent, KEY_CODE, ThunderMath} from "@gamindo/thunder";
import { Board } from "../objects/Board";
import { CellType } from "../objects/Cell";
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
    private board: Board | undefined;

    private nextDirection: DIRECTION = DIRECTION.DOWN;
    private snakeDirection: DIRECTION = DIRECTION.DOWN;
    private currentPieces: number = 0;
    private snakeSpeed: number = 5;
    private timestamp: number = 0;

    //imported from snake code
    private snakeBodyList: Array<SnakeBody> = new Array<SnakeBody>();
    public spaceMove: number = 10;

    override init(args?: any): void {
        super.init(args);
    }

    override preLoad(): void {
        super.preLoad();
    }

    override create(): void {
        super.create();
        console.log("Call create super func");

        this.interactive = true;
        this.onPointerDown.subscribe(this.pointerDownLogic, this);
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
        if(key == KEY_CODE.KEY_A) {
            console.log("A is pressed");
        }
    }

    private gameLoop(delta: number): void {
        //Set gameplay flow
        //TODO: Create Snake movement
        this.timestamp += this.delta;
        // console.log(this.timestamp/1000);
        
        if(this.timestamp/1000 >= this.snakeSpeed){
            this.timestamp = 0;
            console.log("move snake!");
            this.moveSnake();
        }
        // if(delta - this.timestamp >= this.snakeSpeed){
        //     this.timestamp = delta;

        //     this.snakeBodyList[0].posX += 100;
        // }
    }

    private moveSnake(): void{
        
        this.snakeBodyList[0].SetNewValue(10, 0);
    }

    private updateDirection(newDirection: DIRECTION): void{
        if(ThunderMath.abs(newDirection) != ThunderMath.abs(this.snakeDirection)){
            this.nextDirection = newDirection;
        }
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
        this.board?.cells[row][col].SetCellType(CellType.HEAD, "", "");
        this.snakeBodyList = new Array<SnakeBody>();
        this.snakeBodyList.push(initSnake);
        this.add(initSnake);

        this.spaceMove = 80;
        this.nextDirection = DIRECTION.DOWN;
        this.snakeDirection = DIRECTION.DOWN;
    }
}
