export default class Game{
    constructor(callback_s,callback_f){
        this.canvas = document.getElementById('mycanvas')
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xffffff,
            view: this.canvas
        })
        this.startBgTextureArray = []
        this.gameset = {
            textures: {},
            container: {
                allStage: new PIXI.Container,
                startStage: new PIXI.Container,
                ruleStage: new PIXI.Container,
                gameStage: new PIXI.Container,
                resultStage: new PIXI.Container,
                failStage: new PIXI.Container,
                heartArea: new PIXI.Container,
                bar: new PIXI.Container
            },
            sprites: {},
            hearts: 3,
            loader: PIXI.Loader.shared,
            size: {
                w:960,
                h:720
            },
            bar_ticker: new PIXI.Ticker
        }
        this.callback = {
            s: callback_s,
            f: callback_f
        }
        this.status = ''
    }
    gameLoad() {
        // 執行遊戲
        this.canvas.classList.remove("d-none");
        if(Object.keys(this.gameset.textures).length===0){
            for(let i = 1; i < 11;i++){
                this.gameset.loader.add(`startBg-${i}`,`images/${i}.jpg`)
            }
            this.gameset.loader
                .add('bg','image/bg.jpg')
                .add('sprite','image/sprite.png')
                .add('heart','image/sprite2.png')
                .add('mask','image/mask.png')
                .add('back','image/back.png')
                .add('continue','image/continue.png')
                .add('rulebg','image/rulebg.png')
                .add('startbtn','image/startbtn.png')
                .load((loader, resource)=>{
                    this.gameset.textures.bg = new PIXI.Texture(resource.bg.texture)
                    this.gameset.textures.sprite = new PIXI.Texture(resource.sprite.texture)
                    this.gameset.textures.heart = new PIXI.Texture(resource.heart.texture)
                    this.gameset.textures.mask = new PIXI.Texture(resource.mask.texture)
                    this.gameset.textures.back = new PIXI.Texture(resource.back.texture)
                    this.gameset.textures.continue = new PIXI.Texture(resource.continue.texture)
                    this.gameset.textures.rulebg = new PIXI.Texture(resource.rulebg.texture)
                    this.gameset.textures.startbtn = new PIXI.Texture(resource.startbtn.texture)
                    for(let i = 1; i < 11; i++){
                        let texture = new PIXI.Texture(resource[`startBg-${i}`].texture);
                        this.startBgTextureArray.push(texture);
                    }
                });
            this.gameset.loader.onComplete.add(()=>{this.drawCanvas()});
        }
        else {
            this.drawCanvas();
        }
        window.addEventListener("resize",this.resizeCanvas.bind(this));
    }
    drawCanvas(){
        this.app.stage.addChild(this.gameset.container.allStage);
        // 開始繪製
        this.gameset.container.allStage.addChild(this.gameset.container.gameStage);
        this.canvas.classList.remove("loadering");
        this.gameset.hearts = 3;
        this.app.renderer.backgroundColor = 0xfaa0aa;
        // this.resizeCanvas();
        
        // 底層遊戲-背景
        this.gameset.sprites.bg = new PIXI.Sprite(this.gameset.textures.bg);
        this.gameset.sprites.bg.x = this.gameset.size.w / 2;
        this.gameset.sprites.bg.y = this.gameset.size.h / 2;
        this.gameset.sprites.bg.width = this.gameset.size.w;
        this.gameset.sprites.bg.height = this.gameset.size.h;
        this.gameset.sprites.bg.anchor.set(0.5);
        this.gameset.container.gameStage.addChild(this.gameset.sprites.bg);
        // 底層遊戲-中間精靈
        this.gameset.sprites.sprite = new PIXI.Sprite(this.gameset.textures.sprite);
        this.gameset.sprites.sprite.anchor.set(0.5);
        this.gameset.sprites.sprite.x = this.gameset.size.w / 2;
        this.gameset.sprites.sprite.y = this.gameset.size.h / 2;
        this.gameset.sprites.sprite.width = this.gameset.size.w*0.2;
        this.gameset.sprites.sprite.height = this.gameset.size.w*0.2;
        this.gameset.sprites.sprite.interactive = false;
        this.gameset.sprites.sprite.buttonMode = true;
        this.gameset.sprites.sprite.on('pointerdown', this.shootBar.bind(this));
        this.gameset.container.gameStage.addChild(this.gameset.sprites.sprite);
        // 底層遊戲-能量條
        this.gameset.container.allStage.addChild(this.gameset.container.bar);
        this.gameset.sprites.innerBar = new PIXI.Graphics();
        this.gameset.sprites.innerBar.beginFill(0x000000);
        this.gameset.sprites.innerBar.drawRect(0, 0, 228, 16);
        this.gameset.sprites.innerBar.endFill();
        this.gameset.container.bar.addChild(this.gameset.sprites.innerBar);
        this.gameset.sprites.pointBar = new PIXI.Graphics();
        this.gameset.sprites.pointBar.beginFill(0xFFB200);
        this.gameset.sprites.pointBar.drawRect(60, 0, 50, 16);
        this.gameset.sprites.pointBar.endFill();
        this.gameset.container.bar.addChild(this.gameset.sprites.pointBar);
        this.gameset.sprites.outerBar = new PIXI.Graphics();
        this.gameset.sprites.outerBar.beginFill(0xFF3300);
        this.gameset.sprites.outerBar.drawRect(0, 0, 228, 16);
        this.gameset.sprites.outerBar.endFill();
        this.gameset.container.bar.addChild(this.gameset.sprites.outerBar);
        this.gameset.sprites.outerBar.width = 28;
        this.gameset.sprites.outerBar.x = Math.floor(Math.random()*200);
        this.gameset.sprites.outerBar.vx = 4;
        this.gameset.container.bar.position.set(this.gameset.size.w / 2-this.gameset.container.bar.width/2, this.gameset.size.h*0.9);
        // 中層規則-背景
        this.gameset.container.allStage.addChild(this.gameset.container.ruleStage);
        this.gameset.sprites.ruleBg = new PIXI.Sprite(this.gameset.textures.rulebg);
        this.gameset.sprites.ruleBg.x = this.gameset.size.w / 2;
        this.gameset.sprites.ruleBg.y = this.gameset.size.h / 2;
        this.gameset.sprites.ruleBg.width = this.gameset.size.w;
        this.gameset.sprites.ruleBg.height = this.gameset.size.h;
        this.gameset.sprites.ruleBg.anchor.set(0.5);
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.ruleBg);
        // 中層規則-按鈕
        this.gameset.sprites.startbtn = new PIXI.Sprite(this.gameset.textures.startbtn);
        this.gameset.sprites.startbtn.anchor.set(0.5);
        this.gameset.sprites.startbtn.x = this.gameset.size.w / 2;
        this.gameset.sprites.startbtn.y = this.gameset.size.h*0.75;
        this.gameset.sprites.startbtn.interactive = true;
        this.gameset.sprites.startbtn.buttonMode = true;
        this.gameset.sprites.startbtn.on('pointerdown', this.startGame.bind(this));
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.startbtn);
        this.gameset.container.ruleStage.visible = true;
        // 上層失誤頁-文字
        this.gameset.container.allStage.addChild(this.gameset.container.failStage);
        this.gameset.sprites.failText = new PIXI.Text('未命中，請再接再厲',{
            fontSize: 50
        })
        this.gameset.sprites.failText.x = this.gameset.size.w / 2 - this.gameset.sprites.failText.width / 2;
        this.gameset.sprites.failText.y = this.gameset.size.h*0.1;
        this.gameset.container.failStage.addChild(this.gameset.sprites.failText);
        // 上層失誤頁-按鈕
        this.gameset.sprites.continuebtn = new PIXI.Sprite(this.gameset.textures.continue);
        this.gameset.sprites.continuebtn.anchor.set(0.5);
        this.gameset.sprites.continuebtn.x = this.gameset.size.w / 2;
        this.gameset.sprites.continuebtn.y = this.gameset.size.h*0.25;
        this.gameset.sprites.continuebtn.interactive = true;
        this.gameset.sprites.continuebtn.buttonMode = true;
        this.gameset.sprites.continuebtn.on('pointerdown', this.continueGame.bind(this));
        this.gameset.container.failStage.addChild(this.gameset.sprites.continuebtn);
        this.gameset.container.failStage.visible = false;
        // 上層結果頁-背景
        this.gameset.container.allStage.addChild(this.gameset.container.resultStage);
        this.gameset.sprites.resultBg = new PIXI.Graphics();
        this.gameset.sprites.resultBg.beginFill(0xffffff);
        this.gameset.sprites.resultBg.drawRect(0, 0, this.gameset.size.w, this.gameset.size.h);
        this.gameset.sprites.resultBg.endFill();
        this.gameset.container.resultStage.addChild(this.gameset.sprites.resultBg);
        // 上層結果頁-按鈕
        this.gameset.sprites.back = new PIXI.Sprite(this.gameset.textures.back);
        this.gameset.sprites.back.anchor.set(0.5);
        this.gameset.sprites.back.x = this.gameset.size.w*0.9;
        this.gameset.sprites.back.y = this.gameset.size.h*0.1;
        this.gameset.sprites.back.interactive = true;
        this.gameset.sprites.back.buttonMode = true;
        this.gameset.sprites.back.on('pointerdown', this.closeCanvas.bind(this));
        this.gameset.container.resultStage.addChild(this.gameset.sprites.back);
        this.gameset.container.resultStage.visible = false;
        // 上層開始頁-背景
        this.gameset.container.allStage.addChild(this.gameset.container.startStage);
        this.gameset.sprites.startBg = new PIXI.AnimatedSprite(this.startBgTextureArray);
        this.gameset.sprites.startBg.x = this.gameset.size.w / 2;
        this.gameset.sprites.startBg.y = this.gameset.size.h / 2;
        this.gameset.sprites.startBg.width = this.gameset.size.w;
        this.gameset.sprites.startBg.height = this.gameset.size.h;
        this.gameset.sprites.startBg.anchor.set(0.5);
        this.gameset.container.startStage.addChild(this.gameset.sprites.startBg);
        // 上層開始頁-軌道
        this.gameset.sprites.slider = this.gameset.container.startStage.addChild(
            new PIXI.Graphics()
                .beginFill(0x38404e)
                .drawRect(
                    this.gameset.size.w*0.05,
                    this.gameset.size.h*0.9,
                    this.gameset.size.w*0.9,
                    4,
                )
                .endFill(),
        );
        this.gameset.sprites.slide = this.gameset.sprites.slider.addChild(
            new PIXI.Graphics()
                .beginFill(0x38404e)
                .drawRect(
                    this.gameset.size.w*0.05,
                    this.gameset.size.h*0.9,
                    this.gameset.size.w*0.9,
                    4,
                )
                .endFill(),
        );
        this.gameset.sprites.slide.interactive = true;
        this.gameset.sprites.handle = this.gameset.sprites.slider.addChild(
            new PIXI.Graphics()
                .beginFill(0x000000)
                .drawCircle(0, 0, 8)
                .endFill(),
        );
        this.gameset.sprites.handle.position.set(this.gameset.size.w/2*0.1, this.gameset.size.h*0.9+2);
        this.gameset.sprites.handle.interactive = true;
        this.gameset.sprites.handle.buttonMode = true;
        this.gameset.sprites.handle
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove.bind(this));
        this.gameset.container.startStage.visible = true;

        this.gameset.bar_ticker.add(this.barLoop,this);
        this.gameset.bar_ticker.start();
        this.status = 'game'
        this.countHeart();
        this.resizeCanvas();
    }
    resizeCanvas(){
        this.app.renderer.resize(window.innerWidth,window.innerHeight);
        if(window.innerWidth > 960 && window.innerHeight > 720){
            this.gameset.size.w = 960
            this.gameset.size.h = 720
        }
        else if(window.innerWidth < 960 && window.innerHeight > 720){
            this.gameset.size.w = window.innerWidth
            this.gameset.size.h = window.innerWidth/4*3
        }
        else if(window.innerWidth > 960 && window.innerHeight < 720){
            this.gameset.size.w = window.innerHeight/3*4
            this.gameset.size.h = window.innerHeight
        }
        else if(window.innerWidth < 960 && window.innerHeight < 720){
            this.gameset.size.w = window.innerWidth
            this.gameset.size.h = window.innerWidth/4*3
        }
        this.initCanvas();
    }
    barLoop(){
        this.gameset.sprites.outerBar.x += this.gameset.sprites.outerBar.vx;
        if (this.gameset.sprites.outerBar.x>200 || this.gameset.sprites.outerBar.x<0){
            this.gameset.sprites.outerBar.vx = -this.gameset.sprites.outerBar.vx
        }
    }
    closeCanvas(){
        this.gameset.bar_ticker.remove(this.barLoop,this);
        this.app.stage.removeChildren();
        this.gameset.container.allStage.removeChildren();
        this.gameset.container.startStage.removeChildren();
        this.gameset.container.resultStage.removeChildren();
        this.gameset.container.gameStage.removeChildren();
        this.gameset.container.ruleStage.removeChildren();
        this.gameset.container.failStage.removeChildren();
        this.canvas.classList.add("d-none","loadering");
        if(this.status === 'success'){
            this.callback.s();
        }
        else if(this.status === 'fail'){
            this.callback.f();
        }
    }
    shootBar(){
        if (this.gameset.sprites.outerBar.x>33 && this.gameset.sprites.outerBar.x<110){
            this.gameset.bar_ticker.stop();
            this.gameset.container.resultStage.visible = true;
            this.gameset.sprites.sprite.interactive = false;
            const basicText = new PIXI.Text('成功',{
                fontSize: 50
            });
            basicText.x = this.gameset.size.w / 2 - basicText.width / 2;
            basicText.y = this.gameset.size.h / 2 - basicText.height / 2;
            this.gameset.container.resultStage.addChild(basicText);
            this.status = 'success'
        }
        else if(this.gameset.hearts>1){
            this.gameset.container.failStage.visible = true;
            this.gameset.sprites.sprite.interactive = false;
            this.gameset.hearts--;
            this.countHeart();
            this.gameset.bar_ticker.stop();
        }
        else{
            this.gameset.bar_ticker.stop();
            this.gameset.container.resultStage.visible = true;
            this.gameset.sprites.sprite.interactive = false;
            const basicText = new PIXI.Text('失敗',{
                fontSize: 50
            });
            basicText.x = this.gameset.size.w / 2 - basicText.width / 2;
            basicText.y = this.gameset.size.h / 2 - basicText.height / 2;
            this.gameset.container.resultStage.addChild(basicText);
            this.status = 'fail'
        }
    }
    startGame(){
        this.gameset.container.ruleStage.visible = false;
        this.gameset.sprites.sprite.interactive = true;
    }
    continueGame(){
        this.gameset.container.failStage.visible = false;
        this.gameset.bar_ticker.start();
        this.gameset.sprites.sprite.interactive = true;
    }
    countHeart(){
        this.gameset.container.gameStage.removeChild(this.gameset.container.heartArea);
        this.gameset.container.heartArea = new PIXI.Container();
        for (let i = 3; i > 0; i--){
            let heart = new PIXI.Sprite(this.gameset.textures.heart);
            heart.width = this.gameset.size.w*0.1;
            heart.height = this.gameset.size.w*0.1;
            heart.y = (i-1)*this.gameset.size.h*0.2;
            if(i>this.gameset.hearts){
                let mask = new PIXI.Sprite(this.gameset.textures.mask);
                mask.anchor.set(0.5)
                this.gameset.container.heartArea.addChild(mask);
                mask.x= this.gameset.size.w*0.05;
                mask.y=heart.y+ this.gameset.size.w*0.05;
                heart.mask = mask;
            }
            this.gameset.container.heartArea.addChild(heart);
            this.gameset.container.gameStage.addChild(this.gameset.container.heartArea);
        }
    }
    initCanvas(){
        this.gameset.container.allStage.width=this.gameset.size.w
        this.gameset.container.allStage.height=this.gameset.size.h
        this.gameset.container.allStage.position.set(window.innerWidth/2 - this.gameset.size.w/2,window.innerHeight/2 - this.gameset.size.h/2)
    }
    onDragStart(event) {
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }
    
    onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }
    
    onDragMove() {
        if (this.gameset.sprites.handle.dragging) {
            const newPosition = this.gameset.sprites.handle.data.getLocalPosition(this.gameset.sprites.handle.parent);
            if(newPosition.x<this.gameset.size.w/2*0.1){
                newPosition.x = this.gameset.size.w*0.05
            }
            else if(newPosition.x>this.gameset.size.w*0.95){
                newPosition.x = this.gameset.size.w*0.95;
                this.gameset.container.startStage.visible = false;
            }
            this.gameset.sprites.handle.x = newPosition.x;
            this.gameset.sprites.startBg.gotoAndStop(Math.floor(this.gameset.sprites.handle.x/this.gameset.size.w*0.95*10));
        }
    }
}
