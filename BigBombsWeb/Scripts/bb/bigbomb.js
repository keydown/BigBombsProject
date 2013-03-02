(function () {
    Bomb = function (param) {
        var that = this;
        this.animations = {
            idle: [{
                x: 0,
                y: 0,
                width: 500,
                height: 500
            }],
            explode: [{
                x: 0,
                y: 0,
                width: 500,
                height: 500
            }, {
                x: 500,
                y: 0,
                width: 500,
                height: 500
            }, {
                x: 1000,
                y: 0,
                width: 500,
                height: 500
            }, {
                x: 1500,
                y: 0,
                width: 500,
                height: 500
            }, {
                x: 2000,
                y: 00,
                width: 500,
                height: 500
            }, {
                x: 2500,
                y: 00,
                width: 500,
                height: 500
            } ]
        };
        var imageObj = new Image();
        this.width = Bomb.MAX_WIDTH * (param.currentCount / Bomb.MAX_SIZE);
        // var positionY = param.currentCount; units / Bomb.MAX_SIZE
        this.explodeX = (param.x - (this.width / 2)) + BigBombsGame.CELL_SIZE / 2;
        this.explodeY = param.y + 70 - this.width;
        imageObj.src = "/images/bombanimated.png";
        this.shape = new Kinetic.Sprite({
            x: this.explodeX,
            y: 0 - this.width,
            image: imageObj,
            animation: 'idle',
            animations: this.animations,
            frameRate: 4,
            opacity: 1
        });
        this.currentCount = param.currentCount;
        this.y = param.y;
    };
    Bomb.prototype = {
        init: function () {
        },
        explode: function () {
            var that = this;
            this.shape.transitionTo({
                y: that.explodeY,
                duration: 2
            });
            setTimeout(function () {
                that.shape.setAnimation('explode');
                that.shape.afterFrame(5, function () {
                    that.shape.destroy();
                   // that.shape.setAnimation('idle');
                });
            }, 2000);
        }
    }
    Bomb.COST = 10;
    Bomb.MAX_SIZE = 4;
    Bomb.MAX_WIDTH = 500;
})(jQuery);