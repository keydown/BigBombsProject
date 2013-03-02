(function () {
    Mine = function (param) {
        var that = this;
        this.animations = {
            idle: [{
                x: 0,
                y: 0,
                width: 70,
                height: 70
            }],
            explode: [{
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
            }],
            collect: [{
                x: 0,
                y: 0,
                width: 70,
                height: 70
            }, {
                x: 70,
                y: 0,
                width: 70,
                height: 70
            }, {
                x: 140,
                y: 0,
                width: 70,
                height: 70
            }, {
                x: 210,
                y: 0,
                width: 70,
                height: 70
            }, {
                x: 280,
                y: 0,
                width: 70,
                height: 70
            }, ]
        };
        var imageObj = new Image();
        imageObj.src = "/images/saltmineanimated.png";
        this.shape = new Kinetic.Sprite({
            x: param.x,
            y: param.y,
            image: imageObj,
            animation: 'idle',
            animations: this.animations,
            frameRate: 4,
            opacity: 0
        });
        //this.text = new Kinetic.Text({
        //    x: param.x,
        //    y: param.y,
        //    text: '1',
        //    fontSize: 20,
        //    fontFamily: 'Calibri',
        //    fill: '#880',
        //    opacity: 0
        //});
        this.text = param.text;
        this.currentCount = 1;
    };
    Mine.prototype = {
        init: function () {
        },
        explode: function () {
            var that = this;
            this.shape.setAnimation('explode');
            this.shape.afterFrame(7, function () {
                that.shape.setAnimation('idle');
                that.shape.setOpacity(0);
                that.text.setText('0');
                that.text.setOpacity(0);
                that.text.parent.draw();
                that.shape.stop();
                that.shape.parent.draw();
            });
        },
        collect: function () {
            var that = this;
            this.shape.setAnimation('collect');
            this.shape.afterFrame(4, function () {
                that.shape.setAnimation('idle');
            });
        }
    }
    Mine.COST = 6;
})(jQuery);