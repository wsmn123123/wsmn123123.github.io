
var GameInfoLayer = cc.Layer.extend({
    totalTime:0,
    singleAnimTime:0,
    totalCoinLabel:null,
    rewardsCoinLabel:null,
    gameLogic:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init firs
        this._super();
        if(cc.sys.isNative){
            this.totalCoinLabel = new cc.LabelBMFont("0",  "res/fonts/boundsTestFont.fnt");
            this.rewardsCoinLabel = new cc.LabelBMFont("0",  "res/fonts/boundsTestFont.fnt");
        }else{
            this.totalCoinLabel =  new cc.LabelTTF("0", "Arial", 36);
            this.rewardsCoinLabel = new cc.LabelTTF("0", "Arial", 36);
        }
        var spNumBg = new cc.Sprite("res/num_bg.png");
        spNumBg.setPosition(175,1180);
        this.addChild(spNumBg);

        this.totalCoinLabel.anchorX = 0.5;
        this.totalCoinLabel.anchorY = 0.5;
        this.totalCoinLabel.setPosition(175,1180);
        this.addChild(this.totalCoinLabel);


        spNumBg = new cc.Sprite("res/num_bg.png");
        spNumBg.setPosition(470,1180);
        this.addChild(spNumBg);
        this.rewardsCoinLabel.setPosition(470,1180);
        this.addChild(this.rewardsCoinLabel);

        cc.audioEngine.playMusic("res/music/abcsong.mp3",true);

        this.scheduleUpdate();
        return true;
    },

    playEffectContactStab:function(){
        cc.audioEngine.playEffect("res/music/contact.wav");
    },
    playEffectCoinOwn:function(){
        cc.audioEngine.playEffect("res/music/coin_own.wav");
    },
    playEffectCoinLoss:function(){
        cc.audioEngine.playEffect("res/music/coin_loss.wav");
    },
    playEffectFire:function(){
        cc.audioEngine.playEffect("res/music/shot.wav");
    },
    playEffectCoinIn:function(){
        cc.audioEngine.playEffect("res/music/coin_in.wav");
    },
    update:function (dt) {
        if(!this.gameLogic){
            this.gameLogic = this.getParent().getGameLogic();
        }
        this.totalCoinLabel.setString(""+this.gameLogic.getTotalCoin());
        this.rewardsCoinLabel.setString(""+this.gameLogic.getRewardsCoin());
        
    },

    
});