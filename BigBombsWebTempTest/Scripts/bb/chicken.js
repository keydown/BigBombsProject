(function () {
    Chicken = function (param) {
        var that = this;
        this.animations = {
            idle: [{
                x: 0,
                y: 0,
                width: 70,
                height: 70
            }, {
                x: 70,
                y: 0,
                width: 70,
                height: 70
            }, ],
            die: [{
                x: 0,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 70,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 140,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 210,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 280,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 350,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 420,
                y: 70,
                width: 70,
                height: 70
            }, {
                x: 490,
                y: 70,
                width: 70,
                height: 70
            }, ],
            attack: [{
                x: 0,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 70,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 140,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 210,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 280,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 350,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 420,
                y: 140,
                width: 70,
                height: 70
            }, {
                x: 490,
                y: 140,
                width: 70,
                height: 70
            }, ]
        };
        var imageObj = new Image();
        imageObj.src = "/images/chicken.png";
        this.shape = new Kinetic.Sprite({
            x: param.x,
            y: param.y,
            image: imageObj,
            animation: 'idle',
            animations: this.animations,
            frameRate: 4,
            opacity: 0
        });
        this.text = new Kinetic.Text({
            x: param.x,
            y: param.y,
            text: '0',
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: '#880',
            opacity: 0
        });
        this.currentCount = 0;
    };
    Chicken.prototype = {
        init: function () {
        },
        die: function () {
            var that = this;
            this.shape.setAnimation('die');
            this.shape.afterFrame(7, function () {
                that.shape.setOpacity(0);
                that.shape.setAnimation('idle');
                that.text.setText('0');
                that.text.setOpacity(0);
            });
            
        },
        attack: function () {
            var that = this;
            this.shape.setAnimation('attack');
            this.shape.afterFrame(7, function () {
                that.shape.setAnimation('idle');
            });
        }

    }
    Chicken.COST = 1;
})(jQuery);