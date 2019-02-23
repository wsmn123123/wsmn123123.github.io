/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    openItem:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // // create and initialize a label
        // var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // // position the label on the center of the screen
        // helloLabel.x = size.width / 2;
        // helloLabel.y = size.height / 2 + 200;
        // // add the label as a child to this layer
        // this.addChild(helloLabel, 5);

        // // add "HelloWorld" splash screen"
        // this.sprite = new cc.Sprite(res.HelloWorld_png);
        // this.sprite.attr({
        //     x: size.width / 2,
        //     y: size.height / 2
        // });
        // this.addChild(this.sprite, 0);
        
        var layer = new cc.LayerColor(cc.color(	128,128,128, 255));
		this.addChild(layer, 0);

       
       

        var b2Vec2 = Box2D.Common.Math.b2Vec2;
       
       
        

        this.openItem = new cc.MenuItemImage("res/btn-play-normal.png", "res/btn-play-selected.png", "res/btn-play-selected.png", this.onOpen, this);
        this.openItem.setPosition(360,300);
        var close = new cc.MenuItemFont("Close", this.onClose, this);
        close.setPosition(420,100);
        close.setVisible(false);

        var menu = new cc.Menu( this.openItem,close);
        menu.setPosition(0,0);
        this.addChild(menu);

        return true;
    },
    setCanOpen:function(canOpen){
        this.openItem.setEnabled(canOpen);
    },

    onOpen: function(sender){
        // this.parent.test(0, false);
        this.parent.openSwitch();
    },
    onClose:function(){
        this.parent.closeSwitch();
    }
});

var HelloWorldScene = cc.Scene.extend({
    operateLayer:null,
    gameLogic:null,
    gameInfoLayer:null,
    physicLayer:null,
    animElementLayer:null,
    onEnter:function () {
        this._super();



        this.operateLayer = new HelloWorldLayer();
        this.addChild(this.operateLayer);

        this.gameLogic = new GameLogicLayer();
        this.addChild(this.gameLogic);
        this.gameLogic.setGameView(this);


        this.physicLayer = new Box2DTestLayer();
        this.addChild(this.physicLayer,1, 1);

        this.animElementLayer = new AnimElmentLayer();
        this.addChild(this.animElementLayer,2);

        this.gameInfoLayer = new GameInfoLayer();
        this.addChild(this.gameInfoLayer,3);

    },
    getGameLogic:function(){
        return this.gameLogic;
    },
    closeSwitch:function(){
        this.physicLayer.setSwitchClose();
    },
    onSensorContact:function(index){
        this.operateLayer.setCanOpen(true);
        this.gameLogic.onSensorContact(index);
    },
    onStabContact:function(stabSp){
        stabSp.runAction(cc.sequence(cc.scaleTo(0.1, 0.6), cc.scaleTo(0.1, 1)).repeat(2));
        this.gameInfoLayer.playEffectContactStab();
    },
    onCoinOwn:function(){
        this.gameInfoLayer.playEffectCoinOwn();
        this.physicLayer.onCoinOwn();
    },
    onCoinLoss:function(){
        this.gameInfoLayer.playEffectCoinLoss();
        this.physicLayer.onCoinLoss();
    },
    onFire:function(){
        this.gameInfoLayer.playEffectFire();
    },

    openSwitch:function(){
        cc.log("openSwitch()");
        if(!this.gameLogic.subCoin()){
            cc.log("show message of buy coin");
            return;
        }
        this.operateLayer.setCanOpen(false);
        this.gameInfoLayer.playEffectCoinIn();

        this.gameLogic.randomSensor();
        this.physicLayer.setSensorIndicate(this.gameLogic.getRandomSensor());

        this.physicLayer.setSwitchOpen();
    }
});

