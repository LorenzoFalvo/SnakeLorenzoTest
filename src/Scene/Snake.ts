import { AnimationTrack, BaseGraphic, BitmapText, Log, Scene, Sprite, PointerEvent, KEY_CODE} from "@gamindo/thunder";

export class Snake extends Scene {
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


        const logo = new BaseGraphic(this);
        logo.position.set(360, 640);
        
        logo.beginDraw(0x2d4263, false);
        logo.drawRect(0, 0, 150, 100, true);
        logo.endDraw();

        this.add(logo);
        
        this.onUpdate.subscribe(this.loop, this);
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

    private loop(delta: number): void {
        
    }
}