export default class Game{
    constructor(callback_s,callback_f){
        this.canvas = document.getElementById('mycanvas')
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha:0.7,
            view: this.canvas
        })
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
                w:window.innerWidth,
                h:window.innerHeight
            },
            bar_ticker: new PIXI.Ticker,
            videos:{}
        }
        this.callback = {
            s: callback_s,
            f: callback_f
        }
        this.status = ''
        this.videoStart = document.createElement("video");
        this.videoS = document.createElement("video");
        this.videoF = document.createElement("video");
        this.sound = ''
    }
    gameLoad() {
        // 執行遊戲
        this.canvas.classList.remove("d-none");
        if(Object.keys(this.gameset.textures).length===0){
            this.videoStart.src = "videos/start.mp4";
            this.videoStart.muted = true;
            this.videoStart.setAttribute("playsinline", "");
            this.videoS.src = "videos/resultS.mp4";
            this.videoS.muted = true;
            this.videoS.setAttribute("playsinline", "");
            this.videoF.src = "videos/resultF.mp4";
            this.videoF.muted = true;
            this.videoF.setAttribute("playsinline", "");
            this.gameset.loader
                .add('bg','image/game.jpg')
                .add('sprite','image/ice2.png')
                .add('heart','image/ice.png')
                .add('mask','image/mask.png')
                .add('exit','image/exit.png')
                .add('continue','image/continue.png')
                .add('rulebg','image/rulebg.png')
                .add('startbtn','image/startbtn.png')
                .add('nice','image/nice.png')
                .add('startbg','videos/start.jpg')
                .add('music', 'sound/sword.mp3')
                .load((loader, resource)=>{
                    this.gameset.textures.bg = new PIXI.Texture(resource.bg.texture)
                    this.gameset.textures.sprite = new PIXI.Texture(resource.sprite.texture)
                    this.gameset.textures.heart = new PIXI.Texture(resource.heart.texture)
                    this.gameset.textures.mask = new PIXI.Texture(resource.mask.texture)
                    this.gameset.textures.exit = new PIXI.Texture(resource.exit.texture)
                    this.gameset.textures.continue = new PIXI.Texture(resource.continue.texture)
                    this.gameset.textures.rulebg = new PIXI.Texture(resource.rulebg.texture)
                    this.gameset.textures.startbtn = new PIXI.Texture(resource.startbtn.texture)
                    this.gameset.textures.nice = new PIXI.Texture(resource.nice.texture)
                    this.gameset.textures.startbg = new PIXI.Texture(resource.startbg.texture)
                    this.gameset.textures.videoStart = PIXI.Texture.from(this.videoStart);
                    this.gameset.textures.videoS = PIXI.Texture.from(this.videoS);
                    this.gameset.textures.videoF = PIXI.Texture.from(this.videoF);
                    this.sound = PIXI.sound.Sound.from(resource.music.sound);
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
        this.resizeCanvas();
        // 底層遊戲-背景
        this.gameset.sprites.bg = new PIXI.Sprite(this.gameset.textures.bg);
        this.gameset.sprites.bg.x = this.gameset.size.w / 2;
        this.gameset.sprites.bg.y = this.gameset.size.h / 2;
        this.gameset.sprites.bg.width = this.gameset.size.w;
        this.gameset.sprites.bg.height = this.gameset.size.h;
        this.gameset.sprites.bg.anchor.set(0.5);
        this.gameset.container.gameStage.addChild(this.gameset.sprites.bg);
        // 底層遊戲-能量條
        this.gameset.container.allStage.addChild(this.gameset.container.bar);
        this.gameset.sprites.innerBar = new PIXI.Graphics();
        this.gameset.sprites.innerBar.beginFill(0x650a30);
        this.gameset.sprites.innerBar.drawRect(0, 0, this.gameset.size.w*0.9, 4);
        this.gameset.sprites.innerBar.endFill();
        this.gameset.container.bar.addChild(this.gameset.sprites.innerBar);
        this.gameset.sprites.pointBar = new PIXI.Graphics();
        this.gameset.sprites.pointBar.beginFill(0x650a30);
        this.gameset.sprites.pointBar.drawRect(0, -4, this.gameset.size.w*0.3, 12);
        this.gameset.sprites.pointBar.endFill();
        this.gameset.sprites.pointBar.x = Math.floor(Math.random()*this.gameset.size.w*0.6);
        this.gameset.container.bar.addChild(this.gameset.sprites.pointBar);
        this.gameset.sprites.nice = new PIXI.Sprite(this.gameset.textures.nice);
        this.gameset.sprites.nice.anchor.set(0.5);
        this.gameset.sprites.nice.scale.set(this.gameset.size.w*0.12/65)
        this.gameset.sprites.nice.x = this.gameset.sprites.pointBar.x + this.gameset.sprites.pointBar.width/2;
        this.gameset.sprites.nice.y = -30;
        this.gameset.container.bar.addChild(this.gameset.sprites.nice);
        this.gameset.sprites.outerBar = new PIXI.Sprite(this.gameset.textures.sprite);
        this.gameset.sprites.outerBar.anchor.set(0.5);
        this.gameset.sprites.outerBar.width = this.gameset.size.w*0.05;
        this.gameset.sprites.outerBar.height = this.gameset.size.w*0.05;
        this.gameset.container.bar.addChild(this.gameset.sprites.outerBar);
        this.gameset.sprites.outerBar.x = Math.floor(Math.random()*this.gameset.size.w*0.7);
        this.gameset.sprites.outerBar.vx = 5;
        this.gameset.container.bar.position.set(this.gameset.size.w / 2-this.gameset.container.bar.width/2, this.gameset.size.h*0.9);
        this.gameset.container.gameStage.addChild(this.gameset.container.heartArea);
        // 點擊區
        this.gameset.sprites.sprite = new PIXI.Sprite;
        this.gameset.sprites.sprite.width = this.gameset.size.w;
        this.gameset.sprites.sprite.height = this.gameset.size.h;
        this.gameset.sprites.sprite.interactive = false;
        this.gameset.sprites.sprite.buttonMode = true;
        this.gameset.sprites.sprite.on('pointerdown', this.shootBar.bind(this));
        this.gameset.container.gameStage.addChild(this.gameset.sprites.sprite);
        // 中層規則-背景
        this.gameset.container.allStage.addChild(this.gameset.container.ruleStage);
        this.gameset.sprites.ruleBg = new PIXI.Sprite(this.gameset.textures.bg);
        this.gameset.sprites.ruleBg.width = this.gameset.size.w;
        this.gameset.sprites.ruleBg.height = this.gameset.size.h;
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.ruleBg);
        this.gameset.sprites.ruleText = new PIXI.Text('看準時機，點擊螢幕，\n挖出「極致一球」哈根達斯',{
            fontSize: this.gameset.sprites.ruleBg.width*0.4/12,
            fill: ['#ffffff'],
            align: 'center'
        });
        this.gameset.sprites.ruleText.x = this.gameset.sprites.ruleBg.width/2 - this.gameset.sprites.ruleText.width/2;
        this.gameset.sprites.ruleText.y = this.gameset.sprites.ruleBg.height/2 - this.gameset.sprites.ruleText.height/2;
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.ruleText);
        // 中層規則-按鈕
        this.gameset.sprites.startgraphics = new PIXI.Graphics();
        this.gameset.sprites.startgraphics.lineStyle(2, 0xffffff, 1);
        this.gameset.sprites.startgraphics.beginFill(0xffffff, 0.25);
        this.gameset.sprites.startgraphics.drawRoundedRect(0, 0, this.gameset.size.w*0.15, this.gameset.size.h*0.1, 30);
        this.gameset.sprites.startgraphics.endFill();
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.startgraphics);
        this.gameset.sprites.startbtn = new PIXI.Text('開始',{
            fontSize: this.gameset.sprites.ruleBg.width*0.4/16,
            fill: ['#ffffff'],
            align: 'center'
        });
        this.gameset.sprites.startbtn.x = this.gameset.sprites.ruleBg.width/2 -this.gameset.sprites.startbtn.width/2;
        this.gameset.sprites.startbtn.y = this.gameset.sprites.ruleBg.height*0.75 -this.gameset.sprites.startbtn.height/2;
        this.gameset.sprites.startgraphics.x = this.gameset.sprites.ruleBg.width/2 - this.gameset.sprites.startgraphics.width/2
        this.gameset.sprites.startgraphics.y = this.gameset.sprites.ruleBg.height*0.75 - this.gameset.sprites.startgraphics.height/2
        this.gameset.sprites.startgraphics.interactive = true;
        this.gameset.sprites.startgraphics.buttonMode = true;
        this.gameset.sprites.startgraphics.on('pointerdown', this.startGame.bind(this));
        this.gameset.container.ruleStage.addChild(this.gameset.sprites.startbtn);
        this.gameset.container.ruleStage.visible = true;
        // 上層失誤頁-文字
        this.gameset.container.allStage.addChild(this.gameset.container.failStage);
        // 上層失誤頁-按鈕
        this.gameset.videos.videoF = new PIXI.Sprite(this.gameset.textures.videoF);
        this.gameset.videos.videoF.width = this.gameset.size.w;
        this.gameset.videos.videoF.height = this.gameset.size.h;
        this.gameset.container.failStage.addChild(this.gameset.videos.videoF);

        this.gameset.sprites.continuegraphics = new PIXI.Graphics();
        this.gameset.sprites.continuegraphics.lineStyle(2, 0xffffff, 1);
        this.gameset.sprites.continuegraphics.beginFill(0xffffff, 0.25);
        this.gameset.sprites.continuegraphics.drawRoundedRect(0, 0, this.gameset.size.w*0.15, this.gameset.size.h*0.1, 30);
        this.gameset.sprites.continuegraphics.endFill();
        this.gameset.container.failStage.addChild(this.gameset.sprites.continuegraphics);
        this.gameset.sprites.continuebtn = new PIXI.Text('再來一次',{
            fontSize: this.gameset.container.failStage.width*0.4/16,
            fill: ['#ffffff'],
            align: 'center'
        });
        this.gameset.sprites.continuebtn.x = this.gameset.size.w/2 -this.gameset.sprites.continuebtn.width/2;
        this.gameset.sprites.continuebtn.y = this.gameset.size.h*0.75 -this.gameset.sprites.continuebtn.height/2;
        this.gameset.sprites.continuegraphics.x = this.gameset.size.w/2 - this.gameset.sprites.continuegraphics.width/2
        this.gameset.sprites.continuegraphics.y = this.gameset.size.h*0.75 - this.gameset.sprites.continuegraphics.height/2
        this.gameset.sprites.continuegraphics.interactive = true;
        this.gameset.sprites.continuegraphics.buttonMode = true;
        this.gameset.sprites.continuegraphics.on('pointerdown', this.continueGame.bind(this));
        this.gameset.container.failStage.addChild(this.gameset.sprites.continuebtn);
        this.gameset.container.failStage.visible = false;
        // 上層結果頁-背景
        this.gameset.container.allStage.addChild(this.gameset.container.resultStage);
        this.gameset.sprites.resultBg = new PIXI.Graphics();
        this.gameset.sprites.resultBg.beginFill(0x000000);
        this.gameset.sprites.resultBg.drawRect(0, 0, this.gameset.size.w, this.gameset.size.h);
        this.gameset.sprites.resultBg.endFill();
        this.gameset.container.resultStage.addChild(this.gameset.sprites.resultBg);
        this.gameset.container.resultStage.visible = false;
        // 上層開始頁-背景
        this.gameset.container.allStage.addChild(this.gameset.container.startStage);
        this.gameset.sprites.startbg = new PIXI.Sprite(this.gameset.textures.startbg);
        this.gameset.sprites.startbg.width = this.gameset.size.w;
        this.gameset.sprites.startbg.height = this.gameset.size.h;
        this.gameset.container.startStage.addChild(this.gameset.sprites.startbg);
        this.gameset.videos.videoStart = new PIXI.Sprite(this.gameset.textures.videoStart);
        this.gameset.videos.videoStart.width = this.gameset.size.w;
        this.gameset.videos.videoStart.height = this.gameset.size.h;
        // 上層開始頁-軌道
        this.gameset.sprites.slider = this.gameset.container.startStage.addChild(
            new PIXI.Graphics()
                .beginFill(0x38404e)
                .drawRect(
                    this.gameset.size.w*0.05,
                    this.gameset.size.h*0.8,
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
                    this.gameset.size.h*0.8,
                    this.gameset.size.w*0.9,
                    4,
                )
                .endFill(),
        );
        this.gameset.sprites.slide.interactive = true;
        this.gameset.sprites.handle = new PIXI.Sprite(this.gameset.textures.sprite);
        this.gameset.sprites.slider.addChild(this.gameset.sprites.handle);
        this.gameset.sprites.handle.x = this.gameset.size.w/2*0.1
        this.gameset.sprites.handle.y = this.gameset.size.h*0.8+2 - this.gameset.sprites.handle.height/2;
        this.gameset.sprites.handle.anchor.set(0.5);
        this.gameset.sprites.handle.width = this.gameset.size.w*0.05;
        this.gameset.sprites.handle.height = this.gameset.size.w*0.05;
        this.gameset.sprites.handle.interactive = true;
        this.gameset.sprites.handle.buttonMode = true;
        this.gameset.sprites.handle
            .on('pointerdown', this.onDragStart.bind(this))
            .on('pointerup', this.onDragEnd.bind(this))
            .on('pointerupoutside', this.onDragEnd.bind(this))
            .on('pointermove', this.onDragMove.bind(this));
        this.gameset.container.startStage.visible = true;
        // 上層結果頁-按鈕
        this.gameset.sprites.exit = new PIXI.Sprite(this.gameset.textures.exit);
        this.gameset.sprites.exit.anchor.set(0.5);
        this.gameset.sprites.exit.scale.set(this.gameset.size.w*0.05/14);
        this.gameset.sprites.exit.x = this.gameset.size.w*0.95
        this.gameset.sprites.exit.y = this.gameset.size.h*0.1
        this.gameset.sprites.exit.interactive = true;
        this.gameset.sprites.exit.buttonMode = true;
        this.gameset.sprites.exit.on('pointerdown', this.closeCanvas.bind(this));
        this.gameset.container.allStage.addChild(this.gameset.sprites.exit);
        this.gameset.bar_ticker.add(this.barLoop,this);
        this.gameset.bar_ticker.start();
        this.status = 'game';
        this.countHeart();
        this.resizeCanvas();
    }
    barLoop(){
        this.gameset.sprites.outerBar.x += this.gameset.sprites.outerBar.vx;
        if (this.gameset.sprites.outerBar.x>this.gameset.sprites.innerBar.width || this.gameset.sprites.outerBar.x<0){
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
        this.gameset.container.bar.removeChildren();
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
        this.sound.play()
        if (this.gameset.sprites.outerBar.x>this.gameset.sprites.pointBar.x && this.gameset.sprites.outerBar.x<this.gameset.sprites.pointBar.x+this.gameset.sprites.pointBar.width){
            this.gameset.bar_ticker.stop();
            this.gameset.container.resultStage.visible = true;
            this.gameset.sprites.sprite.interactive = false;
            this.gameset.videos.videoS = new PIXI.Sprite(this.gameset.textures.videoS);
            this.gameset.videos.videoS.width = this.gameset.sprites.resultBg.width;
            this.gameset.videos.videoS.height = this.gameset.sprites.resultBg.height;
            this.gameset.container.resultStage.addChild(this.gameset.videos.videoS);
            this.videoS.currentTime = 0;
            this.videoS.play();
            const basicText = new PIXI.Text('完美達成，\n果然是極致玩家！',{
                fontSize: this.gameset.sprites.resultBg.width*0.4/12,
                fill: ['#ffffff'],
                align: 'center',
                fontWeight: 'bold'
            });
            basicText.x = this.gameset.sprites.resultBg.width/2 - basicText.width/2;
            basicText.y = this.gameset.sprites.resultBg.height/2 - basicText.height/2;
            this.videoS.onended = ()=>{
                this.gameset.container.resultStage.addChild(basicText);
            }
            
            this.status = 'success'
        }
        else if(this.gameset.sprites.outerBar.x<this.gameset.sprites.pointBar.x && this.gameset.hearts>1){
            this.gameset.container.failStage.removeChild(this.gameset.sprites.failText);
            this.gameset.sprites.failText = new PIXI.Text('差一點就近乎極致了，\n再接再厲！',{
                fontSize: this.gameset.sprites.bg.width*0.4/12,
                fill: ['#ffffff'],
                align: 'center',
                fontWeight: 'bold'
            });
            this.gameset.sprites.failText.x = this.gameset.sprites.bg.width / 2 - this.gameset.sprites.failText.width / 2;
            this.gameset.sprites.failText.y = this.gameset.sprites.bg.height*0.3;
            this.gameset.container.failStage.visible = true;
            this.gameset.sprites.continuebtn.visible = false;
            this.gameset.sprites.continuegraphics.visible = false;
            this.gameset.sprites.sprite.interactive = false;
            this.videoF.currentTime = 0;
            this.videoF.play();
            this.gameset.hearts--;
            this.countHeart();
            this.gameset.bar_ticker.stop();
            this.videoF.onended = ()=>{
                this.gameset.container.failStage.addChild(this.gameset.sprites.failText);
                this.gameset.sprites.continuebtn.visible = true;
                this.gameset.sprites.continuegraphics.visible = true;
            }
        }
        else if(this.gameset.sprites.outerBar.x>this.gameset.sprites.pointBar.x+this.gameset.sprites.pointBar.width && this.gameset.hearts>1){
            this.gameset.container.failStage.removeChild(this.gameset.sprites.failText);
            this.gameset.sprites.failText = new PIXI.Text('差一點就近乎極致了，\n再接再厲！',{
                fontSize: this.gameset.sprites.bg.width*0.4/12,
                fill: ['#ffffff'],
                align: 'center',
                fontWeight: 'bold'
            });
            this.gameset.sprites.failText.x = this.gameset.sprites.bg.width/2 - this.gameset.sprites.failText.width / 2;
            this.gameset.sprites.failText.y = this.gameset.sprites.bg.height*0.3;
            this.gameset.container.failStage.visible = true;
            this.gameset.sprites.continuebtn.visible = false;
            this.gameset.sprites.continuegraphics.visible = false;
            this.gameset.sprites.sprite.interactive = false;
            this.videoF.currentTime = 0;
            this.videoF.play();
            this.gameset.hearts--;
            this.countHeart();
            this.gameset.bar_ticker.stop();
            this.videoF.onended = ()=>{
                this.gameset.container.failStage.addChild(this.gameset.sprites.failText);
                this.gameset.sprites.continuebtn.visible = true;
                this.gameset.sprites.continuegraphics.visible = true;
            }
        }
        else{
            this.gameset.bar_ticker.stop();
            this.gameset.container.resultStage.visible = true;
            this.gameset.sprites.sprite.interactive = false;
            this.gameset.videos.videoF = new PIXI.Sprite(this.gameset.textures.videoF);
            this.gameset.videos.videoF.width = this.gameset.sprites.resultBg.width;
            this.gameset.videos.videoF.height = this.gameset.sprites.resultBg.height;
            this.gameset.container.resultStage.addChild(this.gameset.videos.videoF);
            this.videoF.currentTime = 0;
            this.videoF.play();
            const basicText = new PIXI.Text('別氣餒！\n相信你在前往極致的路上。',{
                fontSize: this.gameset.sprites.resultBg.width*0.4/12,
                fill: ['#ffffff'],
                align: 'center',
                fontWeight: 'bold'
            });
            basicText.x = this.gameset.sprites.resultBg.width/2 - basicText.width/2;
            basicText.y = this.gameset.sprites.resultBg.height/2 - basicText.height/2;
            this.status = 'fail';
            this.videoF.onended = ()=>{
                this.gameset.container.resultStage.addChild(basicText);
                this.gameset.sprites.continuebtn.visible = true;
                this.gameset.sprites.continuegraphics.visible = true;
            }
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
        this.gameset.container.heartArea.removeChildren();
        for (let i = 3; i > 0; i--){
            let heart = new PIXI.Sprite(this.gameset.textures.heart);
            heart.width = this.gameset.sprites.bg.width*0.1;
            heart.height = this.gameset.sprites.bg.width*0.1;
            heart.y = (i-1)*this.gameset.sprites.bg.height*0.2;
            if(i>this.gameset.hearts){
                let mask = new PIXI.Sprite(this.gameset.textures.mask);
                mask.anchor.set(0.5)
                this.gameset.container.heartArea.addChild(mask);
                mask.x= this.gameset.sprites.bg.width*0.05;
                mask.y=heart.y+ this.gameset.sprites.bg.width*0.05;
                heart.mask = mask;
            }
            this.gameset.container.heartArea.addChild(heart);
        }
    }
    resizeCanvas(){
        this.app.renderer.resize(window.innerWidth,window.innerHeight);
        if(window.innerWidth > 1280 && window.innerHeight > 720){
            this.gameset.size.w = 1280
            this.gameset.size.h = 720
        }
        else if(window.innerWidth < 1280 && window.innerHeight > 720){
            this.gameset.size.w = window.innerWidth
            this.gameset.size.h = window.innerWidth/16*9
        }
        else if(window.innerWidth > 1280 && window.innerHeight < 720){
            this.gameset.size.w = window.innerHeight/9*16
            this.gameset.size.h = window.innerHeight
        }
        else if(window.innerWidth < 1280 && window.innerHeight < 720){
            if(window.innerWidth<window.innerHeight){
                this.gameset.size.w = window.innerWidth
                this.gameset.size.h = window.innerWidth/16*9
            }
            else{
                this.gameset.size.w = window.innerHeight/9*16
                this.gameset.size.h = window.innerHeight
            }
        }
        this.initCanvas();
    }
    initCanvas(){
        this.gameset.container.allStage.width = this.gameset.size.w;
        this.gameset.container.allStage.height = this.gameset.size.h;
        this.gameset.container.allStage.position.set(window.innerWidth/2 - this.gameset.size.w/2,window.innerHeight/2 - this.gameset.size.h/2)
    }
    onDragStart(event) {
        this.gameset.sprites.handle.data = event.data
        this.videoStart.currentTime = 0;
        this.gameset.sprites.handle.alpha = 0.5;
        this.gameset.sprites.handle.dragging = true;
    }
    
    onDragEnd() {
        gsap.to(this.gameset.sprites.handle, {duration: 1, x: this.gameset.sprites.slide.width/0.9*0.05});
        this.gameset.sprites.handle.alpha = 1;
        this.gameset.sprites.handle.dragging = false;
        this.gameset.sprites.handle.data = null;
    }
    
    onDragMove() {
        if (this.gameset.sprites.handle.dragging) {
            const newPosition = this.gameset.sprites.handle.data.getLocalPosition(this.gameset.sprites.handle.parent);
            if(newPosition.x<this.gameset.sprites.slide.width/0.9*0.05){
                newPosition.x = this.gameset.sprites.slide.width/0.9*0.05
            }
            else if(newPosition.x>=this.gameset.sprites.slide.width/0.9*0.95){
                newPosition.x=this.gameset.sprites.slide.width/0.9*0.95
                this.gameset.container.startStage.addChild(this.gameset.videos.videoStart);
                this.videoStart.play();
                this.videoStart.onended = ()=>{
                    this.gameset.container.startStage.visible = false
                }
                
            }
            this.gameset.sprites.handle.x = newPosition.x;
        }
    }
}
