/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;
var DESIGN_WIDTH = 720;
var DESIGN_HEIGHT = 1280;
var DESIGN_WIDTH_HALF = DESIGN_WIDTH / 2;
var DESIGN_HEIGHT_HALF = DESIGN_HEIGHT / 2;

var Box2DTestLayer = cc.LayerColor.extend({
    world:null,
    _debugDraw:null,
    ballSp:null,
    ballBody:null,
    switchBody:null,
    chongganBody:null,
    chongganJoint:null,
    mouseJoint:null,
    bottomTrash:null,
    touchBeginPos:null,
    stabsBody:[],
    sensorsBody:[],
    isBallContactChonggan:false,
    ctor:function () {

        if(window.sideIndexBar){
            window.sideIndexBar.changeTest(0, 2);
        }
        //----start0----ctor
        this._super(cc.color(0, 0, 0, 0));

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE, //TOUCH_ALL_AT_ONCE  TOUCH_ONE_BY_ONE
            onTouchesBegan:function(touches,event){
                var touch = touches[0];
                var location = touch.getLocation();
                event.getCurrentTarget().addMouseJoint(location);
            },
            onTouchesMoved:function(touches,event){
                var touch = touches[0];
                var location = touch.getLocation();
                event.getCurrentTarget().moveMouseJoint(location);
            },
            onTouchesEnded: function(touches, event){
                //Add a new body/atlas sprite at the touched location
                var touch = touches[0];
                var location = touch.getLocation();
                // event.getCurrentTarget().addImpluse(location);
                event.getCurrentTarget().endMouseJoint(location);
                

                // event.getCurrentTarget().addNewSpriteWithCoords(location);
                // event.getCurrentTarget().addImpluse(touches.getLocation());
            }
        }), this);

        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2ContactListener = Box2D.Dynamics.b2ContactListener
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var screenSize = cc.director.getWinSize();
        //UXLog(L"Screen width %0.2f screen height %0.2f",screenSize.width,screenSize.height);

        // Construct a world object, which will hold and simulate the rigid bodies.
        this.world = new b2World(new b2Vec2(0, -10), true);
        this.world.SetContinuousPhysics(true);

        // this.m_debugDraw = new b2DebugDraw();
        // this.m_debugDraw.SetSprite(document.getElementById("testgameCanvas").getContext("2d"));
        // this.m_debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
        // this.m_debugDraw.SetFlags(b2DebugDraw.e_jointBit);
        // this.m_debugDraw.SetFillAlpha(0.3);
        // this.m_debugDraw.SetLineThickness(1.0);
        // this.m_debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        // this.m_debugDraw.SetDrawScale(PTM_RATIO/2);
        // this.world.SetDebugDraw(this.m_debugDraw);

        var contactListener = new b2ContactListener();
        contactListener.gameWorld = this;
        contactListener.BeginContact = this.beginContact;
        contactListener.EndContact   = this.endContact;
        contactListener.PreSolve     = this.preSolve;
        contactListener.PostSolve    = this.postSolve;
        this.world.SetContactListener(contactListener);


        // Define the ground body.
        //var groundBodyDef = new b2BodyDef(); // TODO
        //groundBodyDef.position.Set(screenSize.width / 2 / PTM_RATIO, screenSize.height / 2 / PTM_RATIO); // bottom-left corner

        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        //var groundBody = this.world.CreateBody(groundBodyDef);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var boxTick = 20;

        var bodyDef = new b2BodyDef;

        
        
        

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(DESIGN_WIDTH_HALF / PTM_RATIO, boxTick*2 / PTM_RATIO);
        // upper
        bodyDef.position.Set((DESIGN_WIDTH_HALF / PTM_RATIO), (DESIGN_HEIGHT - boxTick) / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        var wallTop = new cc.Sprite("res/wall_top.png");
        wallTop.setPosition(DESIGN_WIDTH_HALF, DESIGN_HEIGHT - boxTick);
        this.addChild(wallTop);
        // bottom
        fixDef.shape.SetAsBox(DESIGN_WIDTH_HALF / PTM_RATIO, boxTick/2 / PTM_RATIO);
        bodyDef.position.Set(250 / PTM_RATIO, 430/PTM_RATIO);  //360,410
        bodyDef.angle = -10 * Math.PI / 180;
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        var wallBottom = new cc.Sprite("res/wall_bottom.png");
        wallBottom.setPosition(250, 430);
        wallBottom.setRotation(10);
        this.addChild(wallBottom);

        fixDef.shape.SetAsBox(boxTick / PTM_RATIO, DESIGN_HEIGHT_HALF / PTM_RATIO);
        // left
        bodyDef.position.Set(boxTick / PTM_RATIO, DESIGN_HEIGHT_HALF / PTM_RATIO);
        bodyDef.angle = 0;
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        var wallLeft = new cc.Sprite("res/wall_protrait.png");
        wallLeft.setPosition(boxTick, DESIGN_HEIGHT_HALF);
        this.addChild(wallLeft);

        // right
        bodyDef.position.Set((DESIGN_WIDTH-boxTick) / PTM_RATIO, DESIGN_HEIGHT_HALF / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        var wallRight = new cc.Sprite("res/wall_protrait.png");
        wallRight.setPosition(DESIGN_WIDTH - boxTick, DESIGN_HEIGHT_HALF);
        this.addChild(wallRight);

        //滑道栏杆
        fixDef.shape.SetAsBox(2 / PTM_RATIO, 320 / PTM_RATIO);
        bodyDef.position.Set(605 / PTM_RATIO, 800 / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        var slideSp = new cc.Sprite("res/slide_s.png");
        slideSp.setPosition(605, 800);
        this.addChild(slideSp);
        
        //滑道栏杆底部
        fixDef.shape.SetAsBox(2 / PTM_RATIO, 100 / PTM_RATIO);
        bodyDef.position.Set(605 / PTM_RATIO, 270 / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        slideSp = new cc.Sprite("res/slide_s_bottom.png");
        slideSp.setPosition(605, 270);
        this.addChild(slideSp);

        //开关档杆
        var gearLeverSp = new cc.Sprite("res/gear_lever.png");
        gearLeverSp.setPosition(605, DESIGN_HEIGHT - 861);
        this.addChild(gearLeverSp);

        fixDef.shape.SetAsBox(2 / PTM_RATIO, 17 / PTM_RATIO);
        fixDef.userData=gearLeverSp;
        // fixDef.isSensor = true;
        bodyDef.position.Set(605 / PTM_RATIO, (DESIGN_HEIGHT- 861) / PTM_RATIO);
        this.switchBody = this.world.CreateBody(bodyDef);
        this.switchBody.SetUserData(gearLeverSp);
        this.switchBody.CreateFixture(fixDef);



        //Set up sprite
        var mgr = new cc.SpriteBatchNode("res/blocks.png", 150);
        this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

            
        // this.addNewSpriteWithCoords(cc.p(screenSize.width / 2, screenSize.height / 2));

        var label = new cc.LabelTTF("Tap screen", "Marker Felt", 32);
        this.addChild(label, 0);
        label.color = cc.color(0, 0, 255);
        label.x = screenSize.width / 2;
        label.y = screenSize.height - 50;

        //冲杆托盘
        fixDef.isSensor = true;
        fixDef.shape.SetAsBox(48 / PTM_RATIO, 10 / PTM_RATIO);
        bodyDef.position.Set(646 / PTM_RATIO, 324 / PTM_RATIO);
        bodyDef.type = b2Body.b2_kinematicBody; 
        
        this.bottomTrash = this.world.CreateBody(bodyDef)
        this.bottomTrash.CreateFixture(fixDef);

        //chong gan
        var chongganSp = new cc.Sprite("res/chonggan.png");
        chongganSp.setPosition(648, 264);
        this.addChild(chongganSp);

        bodyDef.type = b2Body.b2_dynamicBody; //b2_dynamicBody  b2_kinematicBody
        bodyDef.userData = chongganSp;
        // bodyDef.mass = 0;
        bodyDef.friction = 0.8;
        bodyDef.density = 2;
        fixDef.isSensor = false;
        fixDef.shape.SetAsBox(32 / PTM_RATIO, 75 / PTM_RATIO);
        bodyDef.position.Set(644 / PTM_RATIO, 264 / PTM_RATIO);//294
        this.chongganBody = this.world.CreateBody(bodyDef);
        this.chongganBody.SetUserData(chongganSp);
        this.chongganBody.CreateFixture(fixDef);

        var chongganJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
        chongganJointDef.lowerTranslation = -0.1;
        chongganJointDef.upperTranslation = 6;
        chongganJointDef.enableLimit = true;
        chongganJointDef.enableMotor = true;
        chongganJointDef.maxMotorForce = 200;
        // bottomJointDef.motorSpeed = -100;

        chongganJointDef.Initialize(this.chongganBody, this.bottomTrash, this.chongganBody.GetWorldCenter(),new Box2D.Common.Math.b2Vec2(0,1));
        this.chongganJoint = this.world.CreateJoint(chongganJointDef);

        this.initHalfCircle();

        this.initStabs();
        this.initLineStabs();
        this.initHoleSensor();

        this.addBall();

        this.scheduleUpdate();
        //----end0----
    },

    //刚刚碰撞开始的时候会触发这个函数
    beginContact:function(contact){
        // cc.log("beginContact()");
         var tmp,index,sensorContact;
        if(contact.GetFixtureA().GetBody() == this.gameWorld.ballBody){
            tmp = contact.GetFixtureB().GetBody();
        }else{
            tmp = contact.GetFixtureA().GetBody();
        }
        

        for (var i = 0; i < this.gameWorld.sensorsBody.length; i++) {
            if(this.gameWorld.sensorsBody[i] == tmp){
                sensorContact = tmp;
                index = i;
                break;
            }
        }
        if(sensorContact){
            cc.log("beginContact(): sensorContact:"+index );

            var singalSp = sensorContact.GetUserData();
            singalSp.runAction(cc.sequence(cc.delayTime(0.4), cc.blink(0.8, 4)));
            this.gameWorld.getParent().onSensorContact(index);
        }

        if(this.gameWorld.chongganBody == tmp){
            cc.log("beginContact(): chongganBody ");
            this.gameWorld.isBallContactChonggan = true;
        }
    },
    //碰撞结束的时候会触发这个函数
    endContact:function(contact){
        // cc.log("endContact()");
         var tmp,index,sensorContact;
        if(contact.GetFixtureA().GetBody() == this.gameWorld.ballBody){
            tmp = contact.GetFixtureB().GetBody();
        }else{
            tmp = contact.GetFixtureA().GetBody();
        }
        
       
    },
    //碰撞前即将碰撞的时候 
    preSolve:function(contact, oldManifold){
        // cc.log("preSolve()");
    },
    //碰撞后会处理这个函数
    postSolve:function(contact, impulse){
         var tmp,stabContactBody,sensorContact;
        if(contact.GetFixtureA().GetBody() == this.gameWorld.ballBody){
            tmp = contact.GetFixtureB().GetBody();
        }else{
            tmp = contact.GetFixtureA().GetBody();
        }

        for (var i = 0; i < this.gameWorld.stabsBody.length; i++) {
            if(this.gameWorld.stabsBody[i] == tmp){
                stabContactBody = tmp;
                break;
            }
        }

        if(stabContactBody){
            for(var i = 0; i < impulse.normalImpulses.length; i++){
                if(impulse.normalImpulses[i] == 0){
                    continue;
                }else{
                   
                   if(impulse.normalImpulses[i] > 1){
                        cc.log("postSolve(): stabContactBody:" + impulse.normalImpulses[i]);
                        var spStab = stabContactBody.GetUserData();
                        this.gameWorld.getParent().onStabContact(spStab);
                   }
                }
            }
        }else{
            for (var i = 0; i < this.gameWorld.sensorsBody.length; i++) {
                if(this.gameWorld.sensorsBody[i] == tmp){
                    sensorContact = tmp;
                    break;
                }
            }
        }

        if(sensorContact){
            cc.log("postSolve(): sensorContact" );
        }

        
        
    },

    setSwitchOpen:function(){
        cc.log("setSwitchOpen()");
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        this.switchBody.SetPosition(new b2Vec2(605 / PTM_RATIO, (DESIGN_HEIGHT- 861 + 68) / PTM_RATIO));
        this.ballBody.SetAwake(true);

    },

    setSwitchClose:function(){
        cc.log("setSwitchClose()");
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        this.switchBody.SetPosition(new b2Vec2(605 / PTM_RATIO, (DESIGN_HEIGHT- 861) / PTM_RATIO));
        // this.ballBody.SetAwake(true);
        this.ballSp.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("ic_action_emo_cool.png"));
    },

    initStabs:function(){
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2CircleShape;
        fixDef.shape.SetRadius(10/PTM_RATIO);
        var positions = [
                    new b2Vec2((592 / PTM_RATIO), (DESIGN_HEIGHT- 188) / PTM_RATIO),
                    new b2Vec2((576 / PTM_RATIO), (DESIGN_HEIGHT- 203) / PTM_RATIO),
                    new b2Vec2((558 / PTM_RATIO), (DESIGN_HEIGHT- 217) / PTM_RATIO),
                    new b2Vec2((473 / PTM_RATIO), (DESIGN_HEIGHT- 266) / PTM_RATIO),
                    new b2Vec2((366 / PTM_RATIO), (DESIGN_HEIGHT- 292) / PTM_RATIO),
                    new b2Vec2((265 / PTM_RATIO), (DESIGN_HEIGHT- 289) / PTM_RATIO),
                    new b2Vec2((168 / PTM_RATIO), (DESIGN_HEIGHT- 265) / PTM_RATIO),
                    new b2Vec2((79 / PTM_RATIO), (DESIGN_HEIGHT- 216) / PTM_RATIO),
                    new b2Vec2((64 / PTM_RATIO), (DESIGN_HEIGHT- 205) / PTM_RATIO),
                    new b2Vec2((49 / PTM_RATIO), (DESIGN_HEIGHT- 190) / PTM_RATIO),
                      //第二排
                    new b2Vec2((508 / PTM_RATIO), (DESIGN_HEIGHT- 394) / PTM_RATIO),
                    new b2Vec2((416 / PTM_RATIO), (DESIGN_HEIGHT- 417) / PTM_RATIO),
                    new b2Vec2((320 / PTM_RATIO), (DESIGN_HEIGHT- 427) / PTM_RATIO),
                    new b2Vec2((220 / PTM_RATIO), (DESIGN_HEIGHT- 420) / PTM_RATIO),
                    new b2Vec2((126 / PTM_RATIO), (DESIGN_HEIGHT- 399) / PTM_RATIO),
                    //最低排
                    new b2Vec2((596 / PTM_RATIO), (DESIGN_HEIGHT- 486) / PTM_RATIO),
                    new b2Vec2((486 / PTM_RATIO), (DESIGN_HEIGHT- 515) / PTM_RATIO),
                    new b2Vec2((380 / PTM_RATIO), (DESIGN_HEIGHT- 529) / PTM_RATIO), 
                    new b2Vec2((270 / PTM_RATIO), (DESIGN_HEIGHT- 529) / PTM_RATIO), 
                    new b2Vec2((158 / PTM_RATIO), (DESIGN_HEIGHT- 518) / PTM_RATIO), 
                    new b2Vec2((49 / PTM_RATIO), (DESIGN_HEIGHT- 493) / PTM_RATIO) ];

        for (var i = 0; i < positions.length; i++) {
            var spStab = new cc.Sprite("res/stab.png");
            spStab.setPosition(positions[i].x * PTM_RATIO,positions[i].y * PTM_RATIO);
            this.addChild(spStab);

            bodyDef.position.Set(positions[i].x,positions[i].y);
            bodyDef.userData = spStab;
            body = this.world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);
            spStab.setUserData(body);
            this.stabsBody[this.stabsBody.length] = body; 
        }

    },

    initLineStabs:function(){
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(2 / PTM_RATIO, 40 / PTM_RATIO);

        var
        positions = [
            new b2Vec2(126, (DESIGN_HEIGHT - 660)),
            new b2Vec2(200, (DESIGN_HEIGHT - 660)),
            new b2Vec2(278, (DESIGN_HEIGHT - 660)),
            new b2Vec2(356, (DESIGN_HEIGHT - 660)),
            new b2Vec2(436, (DESIGN_HEIGHT - 660)),
            new b2Vec2(518, (DESIGN_HEIGHT - 660)),

        ]
        for (var i = 0; i < positions.length; i++) {
            var spStab = new cc.Sprite("res/short_slide.png");
            spStab.setPosition(positions[i].x,positions[i].y);
            this.addChild(spStab);

            bodyDef.position.Set((positions[i].x / PTM_RATIO), positions[i].y / PTM_RATIO);
            bodyDef.userData = spStab; 
            var bodyLineStab = this.world.CreateBody(bodyDef);
            spStab.setUserData(bodyLineStab);
            bodyLineStab.CreateFixture(fixDef);

        }   
    },

    initHoleSensor:function(){
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2CircleShape;
        fixDef.shape.SetRadius(10/PTM_RATIO);
        fixDef.isSensor = true;

        var positions = [
                    new b2Vec2(86, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(162, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(240, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(320, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(396, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(476, (DESIGN_HEIGHT- 666)),
                    new b2Vec2(560, (DESIGN_HEIGHT- 666))];

        for (var i = 0; i < positions.length; i++) {
            var spSignal = new cc.Sprite("res/signal_light.png");
            spSignal.setPosition(positions[i].x,positions[i].y);
            spSignal.setColor(cc.color(0,0,0));
            this.addChild(spSignal);

            bodyDef.userData = spSignal;
            bodyDef.position.Set(positions[i].x / PTM_RATIO,positions[i].y / PTM_RATIO);
            body = this.world.CreateBody(bodyDef);
            spSignal.setUserData(body);
            body.CreateFixture(fixDef);
            this.sensorsBody[this.sensorsBody.length] = body; 
        }
    },

    setSensorIndicate:function(indictors){
        cc.log("setSensorIndicate()");
        for (var i = 0; i < indictors.length; i++) {
            this.sensorsBody[i].GetUserData().setColor(cc.color(0,0,0));
            if(indictors[i] == 1){
                this.sensorsBody[i].GetUserData().setColor(cc.color(255,0,0));
            }
        }
    },

    initHalfCircle:function(){
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2Body = Box2D.Dynamics.b2Body
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Segment = Box2D.Collision.b2Segment;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        
        var r = 80,  seg = 10;
        var dx = r / seg;
        var centreX  = DESIGN_WIDTH - 40 - r, centreY  = DESIGN_HEIGHT - 60 - r;
        var startX = centreX,startY = centreY + r;

        var spRight = new cc.Sprite("res/right_circle.png");
        spRight.setPosition(centreX + r/2, centreY + r/2);
        this.addChild(spRight);




        var rightCircleSeg = [];
        // rightCircleSeg[0] = ccp(startX, startY);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        var shapeBoxShape = new b2PolygonShape();
        shapeBoxShape.SetAsOrientedBox(32 /PTM_RATIO, 75/PTM_RATIO,
            new b2Vec2(0 / PTM_RATIO, r / PTM_RATIO),Math.PI);
        fixDef.shape = shapeBoxShape;
        bodyDef.position.Set(centreX / PTM_RATIO, centreY / PTM_RATIO);

        // fixDef.shape.SetAsBox(32 / PTM_RATIO, 75 / PTM_RATIO);
        var rightCircleBody = this.world.CreateBody(bodyDef);
        // rightCircleBody.CreateFixture(fixDef);

        // //right Corner
        for(var i = 0; i <= seg; i ++){ 
            var x = dx * i;
            var y  = Math.sqrt(r*r - x*x);
            var angle = -(i / seg * Math.PI)/2;

            shapeBoxShape.SetAsOrientedBox(20 /PTM_RATIO, 2/PTM_RATIO,
                new b2Vec2(x/PTM_RATIO,y/PTM_RATIO), angle);
            fixDef.shape = shapeBoxShape;
            rightCircleBody.CreateFixture(fixDef);

        }

        
        centreX  = 40 + r;
        startX = centreX;
        bodyDef.position.Set(centreX / PTM_RATIO, centreY / PTM_RATIO);
        var leftCircleBody = this.world.CreateBody(bodyDef);
        
        var spLeft = new cc.Sprite("res/left_circle.png");
        spLeft.setPosition(centreX - r/2, centreY + r/2);
        this.addChild(spLeft);

        //left Corner
        for(var i = 0; i <= seg; i ++){
            var x = -dx * i;
            var y  = Math.sqrt(r*r - x*x);
            var angle = (i / seg * Math.PI)/2;

            shapeBoxShape.SetAsOrientedBox(20 /PTM_RATIO, 2/PTM_RATIO,
                new b2Vec2(x/PTM_RATIO,y/PTM_RATIO), angle);
            fixDef.shape = shapeBoxShape;
            leftCircleBody.CreateFixture(fixDef);

        }
        

    },


    addBottomJoint:function(){
        var bottomJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
        bottomJointDef.Initialize();
    },

    addMouseJoint:function(pos){
        cc.log("addMouseJoint()");
        this.touchBeginPos = pos;

        var b2MouseJointDef = new Box2D.Dynamics.Joints.b2MouseJointDef();
        b2MouseJointDef.bodyA = this.bottomTrash;
        b2MouseJointDef.bodyB = this.chongganBody;
        // b2MouseJointDef.bodyB = this.ballBody;

        b2MouseJointDef.maxForce = 100.0*this.chongganBody.GetMass();  // 拖动的力
        b2MouseJointDef.target = new Box2D.Common.Math.b2Vec2(pos.x / PTM_RATIO ,pos.y / PTM_RATIO);
        this.mouseJoint = this.world.CreateJoint(b2MouseJointDef);

    },
    moveMouseJoint:function(pos){
        // cc.log("moveMouseJoint()");

        this.mouseJoint.SetTarget(new Box2D.Common.Math.b2Vec2(pos.x / PTM_RATIO,pos.y / PTM_RATIO));
    },
    endMouseJoint:function(pos){
        cc.log("endMouseJoint()");
        var distance = cc.pDistance(this.touchBeginPos,pos);
        distance = distance / PTM_RATIO;
         cc.log("endMouseJoint() " + distance);
        // var maxForce = 100 * distance;
        // if(maxForce < 100){
        //     maxForce = 100;
        // }
        // if(maxForce > 2000){
        //     maxForce = 2000;
        // }
        // cc.log("endMouseJoint():"+maxForce);

        // this.chongganJoint.SetMaxMotorForce(8000);
        this.world.DestroyJoint(this.mouseJoint);

         var impulse = new Box2D.Common.Math.b2Vec2(0,distance * 100);
         var point = this.chongganBody.GetWorldCenter();
        this.chongganBody.ApplyImpulse(impulse,point);
        this.getParent().onFire();

    },

    addBall:function(){
        if(this.ballSp != undefined){
            return;
        }

        var framecool = new cc.SpriteFrame(cc.textureCache.addImage("res/ic_action_emo_cool.png"), cc.rect( 0, 0, 96, 96));
        cc.spriteFrameCache.addSpriteFrame(framecool,"ic_action_emo_cool.png");
        var framecry = new cc.SpriteFrame(cc.textureCache.addImage("res/ic_action_emo_cry.png"), cc.rect( 0, 0, 96, 96));
        cc.spriteFrameCache.addSpriteFrame(framecry,"ic_action_emo_cry.png");
        var framelaugh = new cc.SpriteFrame(cc.textureCache.addImage("res/ic_action_emo_laugh.png"), cc.rect( 0, 0, 96, 96));
        cc.spriteFrameCache.addSpriteFrame(framelaugh,"ic_action_emo_laugh.png");
        var framekiss = new cc.SpriteFrame(cc.textureCache.addImage("res/ic_action_emo_kiss.png"), cc.rect( 0, 0, 96, 96));
        cc.spriteFrameCache.addSpriteFrame(framekiss,"ic_action_emo_kiss.png");

        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);
        this.ballSp = new cc.Sprite("res/ic_action_emo_cool.png");

        this.addChild(this.ballSp);
        this.ballSp.x = DESIGN_WIDTH / 2;
        this.ballSp.y = 480;
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.Set(this.ballSp.x / PTM_RATIO, this.ballSp.y / PTM_RATIO);
        bodyDef.userData = this.ballSp;
        this.ballBody = this.world.CreateBody(bodyDef);
        this.ballSp.setUserData(this.ballBody);
        var ballShap = new Box2D.Collision.Shapes.b2CircleShape();
        ballShap.SetRadius(1);//These are mid points for our 1m box
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = ballShap;
        fixtureDef.density = 0.1;
        fixtureDef.friction = 0.3;
        this.ballBody.CreateFixture(fixtureDef);
      

    },

    addImpluse:function(p){
        cc.log("impluse:"+(new Date()).valueOf());
       // var body = this.ballSp.getUserData();
       // body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0,400), body.GetWorldCenter());
       this.chongganBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0,40000), this.chongganBody.GetWorldCenter());
    },

    addNewSpriteWithCoords:function (p) {
        //----start0----addNewSpriteWithCoords
        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);
        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (Math.random() > .5 ? 0 : 1);
        var idy = (Math.random() > .5 ? 0 : 1);
        var sprite = new cc.Sprite(batch.texture, cc.rect(32 * idx, 32 * idy, 32, 32));
        batch.addChild(sprite);

        sprite.x = p.x;
        sprite.y = p.y;

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = this.world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();

        dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;
        body.CreateFixture(fixtureDef);
        //----end0----
    },

    onCoinOwn:function(){
        this.ballSp.setSpriteFrame( Math.random()>0.5 
            ? cc.spriteFrameCache.getSpriteFrame("ic_action_emo_laugh.png")
            : cc.spriteFrameCache.getSpriteFrame("ic_action_emo_kiss.png"));
    },
    onCoinLoss:function(){
        this.ballSp.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("ic_action_emo_cry.png"));
    },
   
    update:function (dt) {
        //----start0----update
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/

        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);
        
        // this.world.DrawDebugData();//绘制调试数据

        if(this.isBallContactChonggan){
            this.isBallContactChonggan = false;
            this.setSwitchClose();
        }

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.x = b.GetPosition().x * PTM_RATIO;
                myActor.y = b.GetPosition().y * PTM_RATIO;
                myActor.rotation = -1 * cc.radiansToDegrees(b.GetAngle());
            }
        }
        //----end0----
    }
    //CREATE_NODE(Box2DTestLayer);
});

// var Box2DTestScene = TestScene.extend({
//     runThisTest:function () {
//         var layer = new Box2DTestLayer();
//         this.addChild(layer);

//         cc.director.runScene(this);
//     }
// });

var arrayOfBox2DTest = [
    Box2DTestLayer
];
