
var SplashLayer = cc.Layer.extend({
    moonSp:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.moonSp = new cc.Sprite("res/moon_128.png");
        this.moonSp.setPosition(cc.p(360,640));
        this.moonSp.setScale(0.5);
        this.addChild(this.moonSp,1);

        this.moonSp.runAction(cc.sequence(cc.scaleTo(0.5,1.2),cc.delayTime(0.4),cc.callFunc(this.toLaunchScene)));
    },

    toLaunchScene:function(){
        cc.director.runScene(new cc.TransitionFade(1.5, new LaunchScene()));
    },

});

var SplashScene = cc.Scene.extend({
    splashLayer:null,

    onEnter:function () {
        this._super();
        
        this.splashLayer = new SplashLayer();
        this.addChild(this.splashLayer);

    },
    
});