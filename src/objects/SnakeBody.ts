import { Sprite, Scene, BaseGraphic, ThunderMath, Point, AnimatedSprite } from "@gamindo/thunder";
import { DIRECTION } from "../Scene/SnakeGame";


export default class SnakeBody extends Sprite {
    public posX: number;
    public posY: number;
    public lastPosX: number;
    public lastPosY: number;
    public row: number;
    public col: number;
    public lastRow: number;
    public lastCol: number;
    public lastDir: DIRECTION;
    public currentDir: DIRECTION;

    // private bodyFrames: string[];
    private idleAnim: string = "test/Lollo_idle_";
    private upAnim: string = "test/Lollo_down_";
    private downAnim: string = "test/Lollo_down_";
    private leftAnim: string = "test/Lollo_left_";
    private rightAnim: string = "test/Lollo_left_";
    private currentAnim: string;
    private currentIndexAnim: number = 0;
    


    constructor(scene: Scene, x: number, y: number, texture: string, initialFrame: number, row: number, col: number, size: number, isHead: boolean, direction: DIRECTION) {
        super(scene, texture+initialFrame);

        this.posX = x;
        this.posY = y;
        this.lastPosX = x;
        this.lastPosY = y;
        this.position.set(x, y);
        this.scale.set(0.23, 0.23);
        this.row = row;
        this.col = col;
        this.lastRow = row;
        this.lastCol = col;
        // this.idleAnim = idleAnim;
        this.lastDir = direction;
        this.currentDir = direction;
        
        // this.fps = 3;
        // this.isPaused = true;
        this.currentAnim = this.idleAnim;
        this.updateAnim(direction);

        // this.setOrigin(0.5, 0.5);
        // this.beginDraw(0xfffff, false);
        // this.drawRect(0, 0, size, size, true);
        // this.endDraw();
        
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

    public SetNewValue(x: number, y: number, row: number, col: number, dir: DIRECTION) {
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
        this.lastDir = this.currentDir;
        this.currentDir = dir;

        if(this.currentDir != this.lastDir)
        {
            this.updateAnim(dir);
        } else{
            if(this.currentIndexAnim == 0){
                this.currentIndexAnim++;
            }else{
                this.currentIndexAnim = 0;
            }
            const nextFrame: string = this.currentAnim + this.currentIndexAnim;
            this.texture = nextFrame;
        }

    }

    private updateAnim(newDir: DIRECTION): void{
        switch(newDir){
            case 1:
                // this.updateFrames({frames: this.downAnim});
                this.currentAnim = this.upAnim;
                this.scale.set(ThunderMath.abs(this.scale.x), this.scale.y * -1)
                break;

            case -1:
                // this.updateFrames({frames: this.downAnim});
                this.currentAnim = this.downAnim;
                this.scale.set(ThunderMath.abs(this.scale.x), ThunderMath.abs(this.scale.y))
                break;

            case 2:
                // this.updateFrames({frames: this.rightAnim});
                this.currentAnim = this.rightAnim;
                this.scale.set(this.scale.x * -1, ThunderMath.abs(this.scale.y))
                break;

            case -2:
                // this.updateFrames({frames: this.leftAnim});
                this.currentAnim = this.leftAnim;
                this.scale.set(ThunderMath.abs(this.scale.x), ThunderMath.abs(this.scale.y))
                break;

            default:
                // this.updateFrames({frames: this.idleAnim});
                this.currentAnim = this.idleAnim;
                this.scale.set(ThunderMath.abs(this.scale.x), ThunderMath.abs(this.scale.y))
                break;
        }
        this.texture = this.currentAnim + this.currentIndexAnim;
    }
}
