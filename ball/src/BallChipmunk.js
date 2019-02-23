

var ChipmunkLayer = cc.Layer.extend({
    sprite:null,
    space:null,
	_debugNode:null,
    

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var winSize = cc.winSize;

		// Create the initial space
        this.space = new cp.Space();

        this.setupDebugNode();

        this.initPhysics();

        var sprite2 = this.createPhysicsSprite( cc.p(winSize.width/2, winSize.height - 64), "res/ball_s.png", 2);
 		this.addChild( sprite2 );

        return true;
    },

	initPhysics : function() {
        var space = this.space ;
        var staticBody = space.staticBody;
		var winSize = cc.winSize;
        var wallWidth = 10;
        // Walls
        var walls = [ 
            new cp.SegmentShape( staticBody, cp.v(0,winSize.height / 2 - 200), cp.v(winSize.width,winSize.height / 2 - 300), wallWidth ),// bottom
            // new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), wallWidth),             // left
            new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), wallWidth)  // right
        ];
        var r = 200;
        var seg = 20;
        var dx = r / seg;
        var centreX  = winSize.width - r;
        var centreY  = winSize.height - r;
        var startX = winSize.width - r;
        var startY = winSize.height;

        //right Corner
        for(var i = 0; i <= seg; i ++){
            var x = dx * i;
            var y  = Math.sqrt(r*r- x*x);
            var toX = centreX + x;
            var toY = centreY + y;
            walls[walls.length] = new cp.SegmentShape( staticBody, cp.v(startX, startY), cp.v(toX, toY), wallWidth);
            startX = toX;
            startY = toY;
        }

        //left Corner
        centreX  = r;
        centreY  = winSize.height - r;
        startX = 0;
        startY = winSize.height - r;
        for(var i = 0; i <= seg; i++){
            var x = dx * i;
            var y  = Math.sqrt(r*r - (x-r)*(x-r));
            var toX = x;
            var toY = centreY + y;
            walls[walls.length] = new cp.SegmentShape( staticBody, cp.v(startX, startY), cp.v(toX, toY), wallWidth);
            startX = toX;
            startY = toY;
        }
        //top
        walls[walls.length] = new cp.SegmentShape( staticBody, cp.v(r, winSize.height), cp.v(winSize.width - r, winSize.height), wallWidth);

        var scrollWidth = 68;
        //滑道左边
        walls[walls.length] = new cp.SegmentShape( staticBody, cp.v(winSize.width - scrollWidth, winSize.height - r - 50), cp.v(winSize.width - scrollWidth, winSize.height / 2 - r ), 5);


        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        var pointStabs=[];
        // 3个弯的桩带
         // var num = (winSize.width -68) / 60;
         // r = winSize.width * 2;
         // centreX  = winSize.width / 2;
         // centreY  = winSize.height - 100 + r - 100;
         // startX = 0;
         // startY = winSize.height - r;
         // for (var i = 0; i < num; i++) {
         //    var x = i*60;
         //    var y =  winSize.height - 100;
         //    var shape = new cp.CircleShape(staticBody, 8, cp.v(x, y));
         //    pointStabs[i] = shape;
         // }
         var stabPos=[
            cp.v(39,1920-270),
            cp.v(75,1920-297),
            cp.v(113,1920-313),
            cp.v(239,1920-353),
            cp.v(352,1920-372),
            cp.v(446,1920-382),
            cp.v(549,1920-387),
            cp.v(642,1920-375),
            cp.v(734,1920-352),
            cp.v(836,1920-316),
            cp.v(866,1920-301),
            cp.v(901,1920-281),

            cp.v(39,1920-577),
            cp.v(151,1920-606),
            cp.v(264,1920-624),
            cp.v(377,1920-633),
            cp.v(494,1920-637),
            cp.v(619,1920-627),
            cp.v(724,1920-614),
            cp.v(826,1920-594),
            cp.v(899,1920-569),

            cp.v(84,1920-733),
            cp.v(201,1920-803),
            cp.v(326,1920-821),
            cp.v(440,1920-829),
            cp.v(567,1920-826),
            cp.v(688,1920-813),
            cp.v(795,1920-791),
            cp.v(903,1920-760),

         ];

         
        //three  circle
         for (var i = 0; i < stabPos.length; i++) {
            var shape = new cp.CircleShape(staticBody, 14, stabPos[i]);
            pointStabs[i] = shape;
         }

        for( var i=0; i < pointStabs.length; i++ ) {
            var shape = pointStabs[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }


        // line stab
        var num = (winSize.width - scrollWidth - 128) / 48;
        dx = (winSize.width - scrollWidth) / num;
        for (var i = 1; i < num; i++) {
            var shape = new cp.CircleShape(staticBody, 10, cp.v( dx * i, 1920 - 973));
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );

            var lineShape = new cp.SegmentShape( staticBody, cp.v(dx * i + 20, 1920 - 1050), cp.v(dx * i + 20, 1920 - 1100 ), 1); 
            lineShape.setElasticity(1);
            lineShape.setFriction(1);
            space.addStaticShape( lineShape );
        }
         



        

        // Gravity
        space.gravity = cp.v(0, -500);
    },

    createPhysicsSprite : function( pos, file, collision_type ) {
        var radius = 16;
        var body  = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.v(0,0)) );
        body.setPos(pos);
        this.space.addBody(body);
         
        var shape = new cp.CircleShape(body, radius, cp.v(0,0))
        shape.setElasticity( 0.1 );
        shape.setFriction( 0.5 );
        shape.setCollisionType( collision_type );
        this.space.addShape( shape );

        sprite = new cc.PhysicsSprite(file);
        sprite.setBody( body );
        return sprite;
    },

	onEnter : function () {
        cc.Layer.prototype.onEnter.call(this);
        //cc.base(this, 'onEnter');
		cc.sys.garbageCollect();
        this.scheduleUpdate();

        if( 'touches' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded: function(touches, event){
                    var l = touches.length, target = event.getCurrentTarget();
                    for( var i=0; i < l; i++) {
                        // target.addSprite( touches[i].getLocation() );
                        cc.log("touch :"+touches[i].getLocation().x);
                        var body = sprite.getBody();

                        body.applyImpulse(cp.v(0, cc.winSize.height/2 ), cp.v(0, 0));
                    }
                }
            }, this);
        } else if( 'mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    // event.getCurrentTarget().addSprite(event.getLocation());
                    cc.log("mouse :"+touches[i].getLocation().x);
                }
            }, this);
    },
    onExit : function() {
        // this.space.removeCollisionHandler( 1, 2 );
        cc.Layer.prototype.onExit.call(this);
    },
	update: function(dt) {
        var steps = 6;
        dt /= steps;
        for (var i = 0; i < steps; i++)
        {
            this.space.step(dt);
        }
    },
    setupDebugNode : function()
    {
        // debug only
        this._debugNode = new cc.PhysicsDebugNode(this.space );
        this._debugNode.visible = true ;
        this._debugNode.setSpace(this.space);
        this.addChild( this._debugNode ,2);
    }

});
