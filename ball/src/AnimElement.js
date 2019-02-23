
var AnimElmentLayer = cc.Layer.extend({
    totalTime:0,
    singleAnimTime:10,
    edgeRightLights:[],
    edgeLeftLights:[],
    edgeTopLights:[],
    colors:[],
    curColorIndex:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.colors[0] = cc.color(237,5,21);
        this.colors[1] = cc.color(239,8,106);
        this.colors[2] = cc.color(242,8,179);
        this.colors[3] = cc.color(224,7,243);
        this.colors[4] = cc.color(118,7,243);
        this.colors[5] = cc.color(29,8,243);
        this.colors[6] = cc.color(7,118,243);
        this.colors[7] = cc.color(7,224,243);
        this.colors[8] = cc.color(7,243,118);
        this.colors[9] = cc.color(132,243,7);
        this.colors[10] = cc.color(243,201,7);
        this.colors[11] = cc.color(243,85,7);

        for (var i = 0; i < 1260/40; i++) {
            var spLight = new cc.Sprite("res/game_light.png");
            spLight.setPosition(20, 20+i*40);
            this.addChild(spLight);
            this.edgeLeftLights[this.edgeLeftLights.length] = spLight;
            spLight.setColor(this.colors[i % this.colors.length]);
      
            spLight = new cc.Sprite("res/game_light.png");
            spLight.setPosition(700, 20+i*40);
            this.addChild(spLight);
            this.edgeRightLights[this.edgeRightLights.length] = spLight;
             spLight.setColor(this.colors[i % this.colors.length]);
        }

        for (var i = 0; i < 650 / 40; i++) {
            var spLight = new cc.Sprite("res/game_light.png");
            spLight.setPosition(60+i*40, 1260);
            this.addChild(spLight);
            this.edgeTopLights[this.edgeTopLights.length] = spLight;
            spLight.setColor(this.colors[i % this.colors.length]);
        }

        this.scheduleUpdate();

     
        return true;
    },

    changeLight:function (pSender) {
        pSender.setColor(cc.color(128,128,0));
    },
    resetLight:function (pSender) {
        pSender.setColor(cc.color(255,255,255));
    },

    sequenceAnim:function(){
        cc.log("sequenceAnim()");
        this.unschedule(this.stepBlink);
        this.schedule(this.stepSequence, Math.random() * 0.5 + 0.5);
    },
    blinkAnim:function(){
        cc.log("blinkAnim()");
        this.unschedule(this.stepSequence);
        this.schedule(this.stepBlink, Math.random() * 0.5 + 0.5);
    },

    update:function (dt) {
        this.totalTime += dt;
        this.singleAnimTime += dt;
        if(this.singleAnimTime > 10){
            this.singleAnimTime = 0;
            var type = Math.random() * 2;
            if(type > 1){
                this.sequenceAnim();
            }else{
                this.blinkAnim();
            }
        }
    },

    stepSequence:function(){
        this.curColorIndex ++;
        this.curColorIndex  %= this.colors.length;

        for (var i = 0; i < this.edgeRightLights.length; i++) {
            var index = (i+this.curColorIndex) % this.colors.length;
            this.edgeRightLights[i].setColor(this.colors[index]);
            this.edgeLeftLights[i].setColor(this.colors[index]);
        }
        for (var i = 0; i < this.edgeTopLights.length; i++) {
             var index = (i+this.curColorIndex) % this.colors.length;
            this.edgeTopLights[i].setColor(this.colors[index]);
        }

    },

    stepBlink:function(){
        for (var i = 0; i < this.edgeRightLights.length; i++) {
            var index = Math.floor(Math.random() * this.colors.length);
            this.edgeRightLights[i].setColor(this.colors[index]);
            index = Math.floor(Math.random() * this.colors.length);
            this.edgeLeftLights[i].setColor(this.colors[index]);
        }
        for (var i = 0; i < this.edgeTopLights.length; i++) {
            var index = Math.floor(Math.random() * this.colors.length);
            this.edgeTopLights[i].setColor(this.colors[index]);
        }
    },
});
