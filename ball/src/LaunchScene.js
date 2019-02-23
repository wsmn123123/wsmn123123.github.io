
var LaunchLayer = cc.Layer.extend({
    moonSp1:null,
    openItem:null,
    closeSoundItem:null,
    closeMusicItem:null,
    soundNormalSp:null,
    soundCloseSp:null,
    musicNormalSp:null,
    musicCloseSp:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        
  
        this.openItem = new cc.MenuItemImage("res/btn-play-normal.png", 
            "res/btn-play-selected.png", this.toGame, this);
        this.openItem.setPosition(360,640);
        this.openItem.runAction(cc.sequence(cc.scaleTo(0.5,1.3),
            cc.delayTime(0.2),
            cc.scaleTo(0.5,1.0),
            cc.delayTime(0.2)).repeatForever());

        this.closeSoundItem = new cc.MenuItemImage("res/ic_action_volume_up.png",null, this.switchSound, this);
        this.closeSoundItem.setPosition(720 - 40 - 50,640);

        this.closeMusicItem = new cc.MenuItemImage("res/ic_action_music_1.png", null,this.switchMusic, this);
        this.closeMusicItem.setPosition(720 - 40 - 50,540);

        var menu = new cc.Menu( this.openItem,this.closeSoundItem,this.closeMusicItem);
        menu.setPosition(0,0);
        this.addChild(menu);

        soundNormalSp = new cc.Sprite("res/ic_action_volume_up.png");
        soundCloseSp = new cc.Sprite("res/ic_action_volume_mute.png");
        musicNormalSp = new cc.Sprite("res/ic_action_music_1.png");
        musicCloseSp = new cc.Sprite("res/ic_action_music_0.png");
    },

    toGame:function(){
        cc.director.pushScene(new cc.TransitionFade(1, new HelloWorldScene()));
    },

    switchSound:function(){
        var sound = cc.sys.localStorage.getItem("enablesound");
        if(sound == "1"){
            sound = 0;
        }else{
            sound = 1;
        }
        cc.sys.localStorage.setItem("enablesound", sound);
        if(sound){
            this.closeSoundItem.setNormalImage(soundNormalSp);
        }else{
            this.closeSoundItem.setNormalImage(soundCloseSp);
        }

    },

    switchMusic:function(){
        var music = cc.sys.localStorage.getItem("enableMusic");
        if(music == "1"){
            music = 0;
        }else{
            music = 1;
        }
        cc.sys.localStorage.setItem("enableMusic", music);
        if(music){
            this.closeMusicItem.setNormalImage(musicNormalSp);
        }else{
            this.closeMusicItem.setNormalImage(musicCloseSp);
        }
    },



});

var LaunchScene = cc.Scene.extend({
    launchLayer:null,

    onEnter:function () {
        this._super();
        
        this.launchLayer = new LaunchLayer();
        this.addChild(this.launchLayer);

    },
    
});