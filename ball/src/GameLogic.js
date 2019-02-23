
var GameLogicLayer = cc.Layer.extend({
    totalTime:0,
    singleAnimTime:0,
    playTimes:0, //玩了多少次
    rewardsCoin:0,
    totalCoin:10,
    sensorIndicator:[],
    gameView:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.scheduleUpdate();
        
        for (var i = 0; i < 7; i++) {
            this.sensorIndicator[i] = 0;
        }

        return true;
    },

    subCoin:function(){
        if(this.totalCoin > 0){
            this.totalCoin --;
            return true;
        }

        return false;
    },
    getTotalCoin:function(){
        return this.totalCoin;
    },

    randomSensor:function(){
        cc.log("randomSensor()");
        this.rewardsCoin = Math.floor(Math.random() * 3 + 2);

        this.resetRandomSensor();
        var randomNum = 0;

        for (var i = 0; i < this.sensorIndicator.length; i++) {
            var flag = Math.random() > 0.6 ? 1 : 0;
            if(flag == 1){
                randomNum++;
            }
            this.sensorIndicator[i] = flag;
            if(randomNum == 3){
                break;
            }
        }

        if(randomNum == 0){
            this.randomSensor();
        }
    },

    resetRandomSensor:function(){
        cc.log("resetRandomSensor()");
        for (var i = 0; i < this.sensorIndicator.length; i++) {
            this.sensorIndicator[i] = 0;
        }
    },

    getRandomSensor:function(){
        return this.sensorIndicator;
    },

    getRewardsCoin:function(){
        return this.rewardsCoin;
    },

    setGameView:function(pGameView){
        this.gameView = pGameView;
    },

    update:function (dt) {
        this.totalTime += dt;
        this.singleAnimTime += dt;


    },

    onSensorContact:function(index){
        if(this.sensorIndicator[index] == 1){
            this.totalCoin += this.rewardsCoin;
            this.gameView.onCoinOwn();
        }else{
            this.gameView.onCoinLoss();
        }
    },

    
});