

(function () {
    var i, j, rj, ri, tempRect, tempChicken, tempPig, tempMine, tempBomb, decreaseMoneyBy, pigI = 0, pigJ = 0;

    BigBombsGame = function (param) {

        this.$hudContainer = param.hudContainer;

        this.$btnNextStage = $(param.btnNextStage);
        this.$listStages = $(param.listStages);
        this.$groupID = param.txtGroupID;

        this.$unitSelectionContainer = param.unitSelectionContainer;
        this.$buildStageWrapper = param.buildStageWrapper;
        this.$attackStageWrapper = param.attackStageWrapper;
        this.$collectStageWrapper = param.collectStageWrapper;
        this.$otherPlayerPlayingWrapper = param.otherPlayerPlayingWrapper;

        this.bb = $.connection.bigbombs;
        this.myGroupID = "";
        this.stageCount = 0;

        this.currentSelectedUnit = "";
        this.currentSelectedUnitCount = 0;
        this.bombedThisTurn = false;

        this.$placeMine = param.placeMine;
        this.$placeChicken = param.placeChicken;
        this.$placeBomb = param.placeBomb;
        this.$placePig = param.placePig;

        this.$addMine = param.addMine;
        this.$addChicken = param.addChicken;
        this.$addPig = param.addPig;
        this.$addBomb = param.addBomb;
        this.$removeMine = param.removeMine;
        this.$removePig = param.removePig;
        this.$removeBomb = param.removeBomb;
        this.$removeChicken = param.removeChicken;
        this.$valuePig = param.valuePig;
        this.$valueMine = param.valueMine;
        this.$valueChicken = param.valueChicken;
        this.$valueBomb = param.valueBomb;

        this.creator = false;

        this.stage = new Kinetic.Stage({
            container: param.container,
            width: BigBombsGame.FIELD_WIDTH,
            height: BigBombsGame.FIELD_HEIGHT
        });

        this.$firstPlayerMoney = param.firstPlayerMoney;
        this.$secondPlayerMoney = param.secondPlayerMoney;
        this.firstPlayerMoney = 100;
        this.secondPlayerMoney = 100;

        this.hoverRectMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        this.unitsMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        this.minesMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        this.chickensMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        this.pigsMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        this.tempRectMatrix = new Array(BigBombsGame.FIELD_STATIC_Y);
        for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
            this.hoverRectMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            this.unitsMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            this.minesMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            this.chickensMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            this.pigsMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            this.tempRectMatrix[i] = new Array(BigBombsGame.FIELD_STATIC_X);
            for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {
                this.hoverRectMatrix[i][j] = '0';
                this.unitsMatrix[i][j] = '0';
                this.minesMatrix[i][j] = '0';
                this.chickensMatrix[i][j] = '0';
                this.pigsMatrix[i][j] = '0';
                this.tempRectMatrix[i][j] = '0';
            }
        }

        this.gameLayers = [];

    };

    BigBombsGame.prototype = {
        init: function () {

            var that = this;

            this.chickensLayer = new Kinetic.Layer();
            this.pigsLayer = new Kinetic.Layer();
            this.minesLayer = new Kinetic.Layer();
            this.hoverLayer = new Kinetic.Layer();
            this.bombsLayer = new Kinetic.Layer();

            this.generateChickensLayer();
            this.generatePigsLayer();
            this.generateMinesLayer();
            this.generateHoverLayer();

            this.stage.add(this.chickensLayer);
            this.stage.add(this.minesLayer);
            this.stage.add(this.pigsLayer);
            this.stage.add(this.hoverLayer);
            this.stage.add(this.bombsLayer);
            this.addInteraction();

        },
        nextStage: function () {
            var that = this;
            this.stageCount++;
            var currentStage = this.stageCount % BigBombsGame.STAGES_NUM;
            $('.current-stage').first().removeClass('current-stage');

            if (this.stageCount == 1 && this.creator) {
                this.bb.server.onNextStage(this.myGroupID);
            }
            if (this.stageCount == 3 && !this.creator) {
                this.bb.server.onNextStage(this.myGroupID);
            }

            switch(currentStage)
            {
                case 0:
                    $('#firstplayer-build').addClass('current-stage');
                    if (!this.creator) {
                        this.$collectStageWrapper.hide();
                        this.$otherPlayerPlayingWrapper.show();
                        this.$btnNextStage.hide();
                        this.disableLayerInteraction();
                    }
                    else {
                        this.enableLayerInteraction();
                        this.$collectStageWrapper.hide();
                        this.$btnNextStage.show();
                        this.buildStage();
                    }
                    break;
                case 1:
                    this.bombedThisTurn = false;
                    $('#firstplayer-attack').addClass('current-stage');
                    if (!this.creator) {
                        this.$collectStageWrapper.hide();
                        this.$otherPlayerPlayingWrapper.show();
                        this.$btnNextStage.hide();
                        this.disableLayerInteraction();
                    }
                    else {
                        this.enableLayerInteraction();
                        this.$buildStageWrapper.hide();
                        this.$btnNextStage.show();
                        this.attackStage();
                    }
                    break;
                case 2:
                    $('#secondplayer-build').addClass('current-stage');
                    if (this.creator) {
                        this.$otherPlayerPlayingWrapper.show();
                        this.$attackStageWrapper.hide();
                        this.$btnNextStage.hide();
                        this.disableLayerInteraction();
                    }
                    else {
                        this.enableLayerInteraction();
                        this.$otherPlayerPlayingWrapper.hide();
                        this.$btnNextStage.show();
                        this.buildStage();
                    }
                    break;
                case 3:
                    this.bombedThisTurn = false;
                    $('#secondplayer-attack').addClass('current-stage');
                    if (this.creator) {
                        this.$otherPlayerPlayingWrapper.show();
                        this.$attackStageWrapper.hide();
                        this.$btnNextStage.hide();
                        this.disableLayerInteraction();
                    }
                    else {
                        this.enableLayerInteraction();
                        this.$buildStageWrapper.hide();
                        this.$btnNextStage.show();
                        this.attackStage();
                    }
                    break;
                case 4:
                    $('#collect').addClass('current-stage');
                    this.$btnNextStage.hide();
                    this.disableLayerInteraction();
                    this.$otherPlayerPlayingWrapper.hide();
                    this.$attackStageWrapper.hide();
                    this.collectStage();
                    break;
                default:
            }
        },

        buildStage: function () {
            this.$buildStageWrapper.show();
            this.currentSelectedUnit = "mine";
        },
        
        attackStage: function () {
            this.$attackStageWrapper.show();
            that.currentSelectedUnit = "pig";
        },

        collectStage: function () {
            var that = this;
            this.$collectStageWrapper.show();
            if (this.creator) {
                this.bb.server.collectStage(this.myGroupID);
                
            }
            if (!this.creator) {
                setTimeout(function () {
                    that.bb.server.onNextStage(that.myGroupID);
                }, 2000);
            }
            for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
                for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {
                    if (this.unitsMatrix[i][j] == '1') {
                        this.minesMatrix[i][j].collect();
                    }
                }
            }
        },

        generateHoverLayer: function () {
            var that = this;
            for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
                for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {

                    tempRect = new Kinetic.Rect({
                        x: j * BigBombsGame.CELL_SIZE,
                        y: i * BigBombsGame.CELL_SIZE,
                        width: BigBombsGame.CELL_SIZE,
                        height: BigBombsGame.CELL_SIZE,
                        fill: "rgba(0,0,0,0.1)"
                    });

                    tempRect.on("mouseover", function (e) {
                        
                        ri = Math.floor(e.layerY / BigBombsGame.CELL_SIZE);
                        rj = Math.floor(e.layerX / BigBombsGame.CELL_SIZE);
                        if ((that.creator && rj > 6) || (!that.creator && rj < 7)) {
                            if (that.currentSelectedUnit == 'pig'){
                                that.pigsMatrix[ri][rj].text.setText(parseInt(that.currentSelectedUnitCount));
                                that.pigsMatrix[ri][rj].shape.setOpacity(0.8);
                                that.pigsMatrix[ri][rj].text.setOpacity(0.8);
                                that.markPigAttackArea(ri, rj);
                            }
                            else if (that.currentSelectedUnit == 'bomb') {
                                switch (parseInt(that.currentSelectedUnitCount)) {
                                    case 1:
                                        that.markBombRange1(ri, rj);
                                        break;
                                    case 2:
                                        that.markBombRange2(ri, rj);
                                        break;
                                    case 3:
                                        that.markBombRange3(ri, rj);
                                        break;
                                    case 4:
                                        that.markBombRange4(ri, rj);
                                        break;
                                    default:
                                }
                            }
                            else {
                                return;
                            }
                        }
                        else {
                            switch (that.currentSelectedUnit) {
                                case "mine":
                                    if (that.unitsMatrix[ri][rj] == '1')
                                        return;
                                    else {
                                        that.minesMatrix[ri][rj].shape.setOpacity(0.5);
                                        that.minesMatrix[ri][rj].text.setOpacity(0.5);
                                    }
                                    break;
                                case "chicken":
                                    if (that.unitsMatrix[ri][rj] == '1')
                                        return;
                                    else {
                                        that.chickensMatrix[ri][rj].text.setText(parseInt(that.currentSelectedUnitCount) + that.chickensMatrix[ri][rj].currentCount);
                                        that.chickensMatrix[ri][rj].shape.setOpacity(0.5);
                                        that.chickensMatrix[ri][rj].text.setOpacity(0.5);
                                        that.markChickenDefenseArea(ri, rj);
                                    }
                                    break;
                                default:

                            }
                        }
                    });

                    tempRect.on("mouseout", function (e) {
                        if ((that.creator && rj > 6) || (!that.creator && rj < 7))
                            if (that.currentSelectedUnit == 'pig') {
                                if (that.pigsMatrix[ri][rj].visible == true) {
                                    return;
                                }
                                else {
                                    that.pigsMatrix[ri][rj].shape.setOpacity(0);
                                    that.pigsMatrix[ri][rj].text.setOpacity(0);
                                    that.pigsMatrix[ri][rj].text.setText(0);
                                    that.removeMarkPigAttackArea(ri, rj);
                                }
                            }
                            else if(that.currentSelectedUnit == 'bomb'){
                                switch (parseInt(that.currentSelectedUnitCount)) {
                                    case 1:
                                        that.removeMarkBombRange1(ri, rj);
                                        break;
                                    case 2:
                                        that.removeMarkBombRange2(ri, rj);
                                        break;
                                    case 3:
                                        that.removeMarkBombRange3(ri, rj);
                                        break;
                                    case 4:
                                        that.removeMarkBombRange4(ri, rj);
                                        break;
                                    default:
                                }
                            }
                            else {
                                return;
                            }
                        else {
                            switch (that.currentSelectedUnit) {
                                case "mine":
                                    if (that.unitsMatrix[ri][rj] == '1')
                                        return;
                                    else {
                                        that.minesMatrix[ri][rj].shape.setOpacity(0);
                                        that.minesMatrix[ri][rj].text.setOpacity(0);
                                    }
                                    break;
                                case "chicken":
                                    if (that.unitsMatrix[ri][rj] == '1')
                                        return;
                                    if (that.unitsMatrix[ri][rj] == 'c') {
                                        that.chickensMatrix[ri][rj].shape.setOpacity(1);
                                        that.chickensMatrix[ri][rj].text.setOpacity(1);
                                        that.chickensMatrix[ri][rj].text.setText(that.chickensMatrix[ri][rj].currentCount);
                                        that.removeMarkChickenDefenseArea(ri, rj);
                                    }
                                    else {
                                        that.chickensMatrix[ri][rj].shape.setOpacity(0);
                                        that.chickensMatrix[ri][rj].text.setOpacity(0);
                                        that.chickensMatrix[ri][rj].text.setText(that.chickensMatrix[ri][rj].currentCount);
                                        that.removeMarkChickenDefenseArea(ri, rj);
                                    }
                                    break;
                                default:
                            }
                        }
                    });
                    tempRect.on("click", function (e) {
                        if (that.currentSelectedUnit == 'pig' || that.currentSelectedUnit == 'bomb') {
                            if ((that.creator && rj < 7) || (!that.creator && rj > 6)) {
                                return;
                            }
                        }
                        else {
                            if ((that.creator && rj > 6) || (!that.creator && rj < 7)) {
                                return;
                            }
                        }
                        
                        switch (that.currentSelectedUnit) {
                            case "mine":
                                that.bb.server.addMine(that.myGroupID, ri, rj);
                                break;
                            case "chicken":
                                that.bb.server.addChicken(that.myGroupID, ri, rj, parseInt(that.currentSelectedUnitCount) + parseInt(that.chickensMatrix[ri][rj].currentCount));
                                break;
                            case "pig":
                                that.bb.server.addPig(that.myGroupID, ri, rj, parseInt(that.currentSelectedUnitCount));
                                break;
                            case "bomb":
                                if (!this.bombedThisTurn) {
                                    that.bb.server.addBomb(that.myGroupID, ri, rj, parseInt(that.currentSelectedUnitCount));
                                    this.bombedThisTurn = true;
                                }
                                break;
                            default:
                        }
                    });
                    this.hoverLayer.add(tempRect);
                    this.tempRectMatrix[i][j] = tempRect;
                }
            }

            this.gameLayers.push(this.hoverLayer);
        },
        generateMinesLayer: function () {
            var that = this;
            for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
                for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {

                    tempMine = new Mine({ x: j * BigBombsGame.CELL_SIZE, y: i * BigBombsGame.CELL_SIZE });
                    this.minesLayer.add(tempMine.shape);
                    this.minesLayer.add(tempMine.text);
                    this.minesMatrix[i][j] = tempMine;
                    tempMine.shape.start();
                }
            }
            this.gameLayers.push(this.minesLayer);
        },
        generateChickensLayer: function () {
            var that = this;
            for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
                for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {
                    tempChicken = new Chicken({ x: j * BigBombsGame.CELL_SIZE, y: i * BigBombsGame.CELL_SIZE });
                    this.chickensLayer.add(tempChicken.shape);
                    this.chickensLayer.add(tempChicken.text);
                    this.chickensMatrix[i][j] = tempChicken;
                    tempChicken.shape.start();
                }
            }
            this.gameLayers.push(this.minesLayer);
        },
        generatePigsLayer: function () {
            var that = this;
            for (i = 0; i < BigBombsGame.FIELD_STATIC_Y; i++) {
                for (j = 0; j < BigBombsGame.FIELD_STATIC_X; j++) {
                    tempPig = new Pig({ x: j * BigBombsGame.CELL_SIZE, y: i * BigBombsGame.CELL_SIZE });
                    this.pigsLayer.add(tempPig.shape);
                    this.pigsLayer.add(tempPig.text);
                    this.pigsMatrix[i][j] = tempPig;
                    tempPig.shape.start();
                }
            }
            this.gameLayers.push(this.pigsLayer);
        },
        
        createGame: function (creator, groupName) {
            var that = this;
            var gn = groupName;
            $.connection.hub.start().done(function () {
                that.bb.server.addConnection(gn).done(function () {
                    if (!creator) {
                        that.notifyOtherPlayerJoined();
                    }
                });
            });
            if (creator) {
                that.bb.client.displayGroupID = function (groupID) {
                    that.$groupID.text(groupID);
                };
            }

            that.bb.client.setMyGroupID = function (groupID) {
                that.myGroupID = groupID;
            };
            that.bb.client.removeModal = function () {
                $.modal.close();
            };
            that.bb.client.moveNextStage = function () {
                that.nextStage();
            };
            that.bb.client.addMine = function (i, j, unitCount, player) {
                that.minesMatrix[i][j].shape.setOpacity(1);
                that.minesMatrix[i][j].text.setOpacity(1);
                that.unitsMatrix[i][j] = '1';
                that.decreaseMoney('m', unitCount, player);
            };
            that.bb.client.addChicken = function (i, j, unitCount, player) {
                that.chickensMatrix[i][j].currentCount = unitCount;
                that.chickensMatrix[i][j].shape.setOpacity(1);
                that.chickensMatrix[i][j].text.setText(unitCount);
                that.chickensMatrix[i][j].text.setOpacity(1);
                that.unitsMatrix[i][j] = 'c';
                that.removeMarkChickenDefenseArea(i, j);
                that.decreaseMoney('c', unitCount, player);
            };
            that.bb.client.addPig = function (i, j, unitCount, player) {
                that.pigsMatrix[i][j].currentCount = unitCount;
                that.pigsMatrix[i][j].shape.setOpacity(1);
                that.pigsMatrix[i][j].text.setText(unitCount);
                that.pigsMatrix[i][j].text.setOpacity(1);
                that.pigsMatrix[i][j].visible = true;
                that.decreaseMoney('p', unitCount, player);
            };
            that.bb.client.pigSuccessAttack = function (i, j, winner) {
                that.removeMarkPigAttackArea(i, j);
                that.explodePig(i, j);
                that.explodeMinesArea(i, j);
                that.explodeChickensArea(i, j);
                if (winner > 0) {
                    setTimeout(function () { alert(winner);}, 2000);
                }
            };
            that.bb.client.pigFailAttack = function (i, j) {
                that.removeMarkPigAttackArea(i, j);
                that.diePig(i, j);
                that.attackChickensInArea(i, j);
            };
            that.bb.client.addBomb = function (i, j, units, player, winner) {
                tempBomb = new Bomb({ x: j * BigBombsGame.CELL_SIZE, y: i * BigBombsGame.CELL_SIZE, currentCount: units });
                tempBomb.shape.setScale(units / Bomb.MAX_SIZE, units / Bomb.MAX_SIZE);
                that.bombsLayer.add(tempBomb.shape);
                tempBomb.shape.start();
                tempBomb.explode();
                switch (units) {
                    case 1:
                        that.removeMarkBombRange1(i, j);
                        break;
                    case 2:
                        that.removeMarkBombRange2(i, j);
                        break;
                    case 3:
                        that.removeMarkBombRange3(i, j);
                        break;
                    case 4:
                        that.removeMarkBombRange4(i, j);
                        break;
                    default:
                }
                that.decreaseMoney('b', units, player);
                that.bombExplodeArea(i, j, units);
                if (winner > 0) {
                    setTimeout(function () { alert(winner); }, 2000);
                }
            };
            that.bb.client.updateMoney = function (fpMoney, spMoney) {
                that.firstPlayerMoney += fpMoney;
                that.secondPlayerMoney += spMoney;
                that.$firstPlayerMoney.text(that.firstPlayerMoney);
                that.$secondPlayerMoney.text(that.secondPlayerMoney);
            };
            that.$btnNextStage.click(function () {
                that.bb.server.onNextStage(that.myGroupID);
            });
        },
        setMyGroupID: function (groupID) {
            this.myGroupID = groupID;
        },
        notifyOtherPlayerJoined: function () {
            var that = this;
            that.bb.server.notifyOtherPlayerJoined(this.myGroupID);
        },

        decreaseMoney: function (unit, unitsCount, player) {
            
            var that = this;
            switch (unit) {
                case 'c':
                    decreaseMoneyBy = Chicken.COST * unitsCount;
                    break;
                case 'p':
                    decreaseMoneyBy = Pig.COST * unitsCount;
                    break;
                case 'm':
                    decreaseMoneyBy = Mine.COST * unitsCount;
                    break;
                case 'b':
                    decreaseMoneyBy = Bomb.COST * unitsCount;
                    break;
                default:

            }
            if (player == 1) {
                that.firstPlayerMoney -= decreaseMoneyBy;
                that.$firstPlayerMoney.text(that.firstPlayerMoney);
            }
            else {
                that.secondPlayerMoney -= decreaseMoneyBy;
                that.$secondPlayerMoney.text(that.secondPlayerMoney);
            }
        },
        increaseMoney: function (firstPlayerCollects, secondPlayerCollects) {
            var that = this;
            
        },

        markChickenDefenseArea: function (i, j) {
            if (this.isValidChickenDefenseAreaCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(255,255,100,0.2)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(255,255,100,0.2)');
            }
            this.hoverLayer.draw();
        },
        removeMarkChickenDefenseArea: function (i, j) {
            if (this.isValidChickenDefenseAreaCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidChickenDefenseAreaCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        markPigAttackArea: function (i, j) {
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(255,0,0,0.2)');
            }
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(255,0,0,0.2)');
            }
            this.hoverLayer.draw();
        },
        removeMarkPigAttackArea: function (i, j) {
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        markBombRange1: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.7)');
            }
            this.hoverLayer.draw();
        },
        removeMarkBombRange1: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        markBombRange2: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            this.hoverLayer.draw();
        },
        removeMarkBombRange2: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        markBombRange3: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(0,0,0,0.7)');
            }
            this.hoverLayer.draw();
        },
        removeMarkBombRange3: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        markBombRange4: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 3, j)) {
                this.tempRectMatrix[i - 3][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 3, j)) {
                this.tempRectMatrix[i + 3][j].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j + 3)) {
                this.tempRectMatrix[i][j + 3].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i, j - 3)) {
                this.tempRectMatrix[i][j - 3].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j - 2)) {
                this.tempRectMatrix[i - 1][j - 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 2, j - 1)) {
                this.tempRectMatrix[i - 2][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 2, j + 1)) {
                this.tempRectMatrix[i - 2][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j + 2)) {
                this.tempRectMatrix[i - 1][j + 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i - 1, j - 2)) {
                this.tempRectMatrix[i - 1][j - 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j + 2)) {
                this.tempRectMatrix[i + 1][j + 2].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 2, j + 1)) {
                this.tempRectMatrix[i + 2][j + 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 2, j - 1)) {
                this.tempRectMatrix[i + 2][j - 1].setFill('rgba(0,0,0,0.7)');
            }
            if (this.isValidCell(i + 1, j - 2)) {
                this.tempRectMatrix[i + 1][j - 2].setFill('rgba(0,0,0,0.7)');
            }
            this.hoverLayer.draw();
        },
        removeMarkBombRange4: function (i, j) {
            if (this.isValidCell(i, j)) {
                this.tempRectMatrix[i][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j - 1)) {
                this.tempRectMatrix[i - 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j)) {
                this.tempRectMatrix[i - 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j + 1)) {
                this.tempRectMatrix[i - 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 1)) {
                this.tempRectMatrix[i][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j + 1)) {
                this.tempRectMatrix[i + 1][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j)) {
                this.tempRectMatrix[i + 1][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j - 1)) {
                this.tempRectMatrix[i + 1][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 1)) {
                this.tempRectMatrix[i][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 2, j)) {
                this.tempRectMatrix[i - 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 2)) {
                this.tempRectMatrix[i][j + 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 2, j)) {
                this.tempRectMatrix[i + 2][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 2)) {
                this.tempRectMatrix[i][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 3, j)) {
                this.tempRectMatrix[i - 3][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 3, j)) {
                this.tempRectMatrix[i + 3][j].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j + 3)) {
                this.tempRectMatrix[i][j + 3].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i, j - 3)) {
                this.tempRectMatrix[i][j - 3].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j - 2)) {
                this.tempRectMatrix[i - 1][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 2, j - 1)) {
                this.tempRectMatrix[i - 2][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 2, j + 1)) {
                this.tempRectMatrix[i - 2][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j + 2)) {
                this.tempRectMatrix[i - 1][j + 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i - 1, j - 2)) {
                this.tempRectMatrix[i - 1][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j + 2)) {
                this.tempRectMatrix[i + 1][j + 2].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 2, j + 1)) {
                this.tempRectMatrix[i + 2][j + 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 2, j - 1)) {
                this.tempRectMatrix[i + 2][j - 1].setFill('rgba(0,0,0,0.1)');
            }
            if (this.isValidCell(i + 1, j - 2)) {
                this.tempRectMatrix[i + 1][j - 2].setFill('rgba(0,0,0,0.1)');
            }
            this.hoverLayer.draw();
        },

        explodePig: function (i, j) {
            this.pigsMatrix[i][j].explode();
        },
        explodeChickensArea: function(i, j) {
            if (this.isValidCell(i - 1, j - 1) && this.unitsMatrix[i - 1][j - 1] == 'c') {
                this.chickensMatrix[i - 1][j - 1].die();
                this.unitsMatrix[i - 1][j - 1] = '0';
            }
            if (this.isValidCell(i - 1, j) && this.unitsMatrix[i - 1][j] == 'c') {
                this.chickensMatrix[i - 1][j].die();
                this.unitsMatrix[i - 1][j] = '0';
            }
            if (this.isValidCell(i - 1, j + 1) && this.unitsMatrix[i - 1][j + 1] == 'c') {
                this.chickensMatrix[i - 1][j + 1].die();
                this.unitsMatrix[i - 1][j + 1] = '0';
            }
            if (this.isValidCell(i, j + 1) && this.unitsMatrix[i][j + 1] == 'c') {
                this.chickensMatrix[i][j + 1].die();
                this.unitsMatrix[i][j + 1] = '0';
            }
            if (this.isValidCell(i + 1, j + 1) && this.unitsMatrix[i + 1][j + 1] == 'c') {
                this.chickensMatrix[i + 1][j + 1].die();
                this.unitsMatrix[i + 1][j + 1] = '0';
            }
            if (this.isValidCell(i + 1, j) && this.unitsMatrix[i + 1][j] == 'c') {
                this.chickensMatrix[i + 1][j].die();
                this.unitsMatrix[i + 1][j] = '0';
            }
            if (this.isValidCell(i + 1, j - 1) && this.unitsMatrix[i + 1][j - 1] == 'c') {
                this.chickensMatrix[i + 1][j - 1].die();
                this.unitsMatrix[i + 1][j - 1] = '0';
            }
            if (this.isValidCell(i, j - 1) && this.unitsMatrix[i][j - 1] == 'c') {
                this.chickensMatrix[i][j - 1].die();
                this.unitsMatrix[i][j - 1] = '0';
            }
            if (this.isValidCell(i, j) && this.unitsMatrix[i][j] == 'c') {
                this.chickensMatrix[i][j].die();
                this.unitsMatrix[i][j] = '0';
            }
        },
        explodeMinesArea: function (i, j) {
            if (this.isValidCell(i - 1, j - 1) && this.unitsMatrix[i - 1][j - 1] == '1') {
                this.minesMatrix[i - 1][j - 1].explode();
                this.unitsMatrix[i - 1][j - 1] = '0';
            }
            if (this.isValidCell(i - 1, j) && this.unitsMatrix[i - 1][j] == '1') {
                this.minesMatrix[i - 1][j].explode();
                this.unitsMatrix[i - 1][j] = '0';
            }
            if (this.isValidCell(i - 1, j + 1) && this.unitsMatrix[i - 1][j + 1] == '1') {
                this.minesMatrix[i - 1][j + 1].explode();
                this.unitsMatrix[i - 1][j + 1] = '0';
            }
            if (this.isValidCell(i, j + 1) && this.unitsMatrix[i][j + 1] == '1') {
                this.minesMatrix[i][j + 1].explode();
                this.unitsMatrix[i][j + 1] = '0';
            }
            if (this.isValidCell(i + 1, j + 1) && this.unitsMatrix[i + 1][j + 1] == '1') {
                this.minesMatrix[i + 1][j + 1].explode();
                this.unitsMatrix[i + 1][j + 1] = '0';
            }
            if (this.isValidCell(i + 1, j) && this.unitsMatrix[i + 1][j] == '1') {
                this.minesMatrix[i + 1][j].explode();
                this.unitsMatrix[i + 1][j] = '0';
            }
            if (this.isValidCell(i + 1, j - 1) && this.unitsMatrix[i + 1][j - 1] == '1') {
                this.minesMatrix[i + 1][j - 1].explode();
                this.unitsMatrix[i + 1][j - 1] = '0';
            }
            if (this.isValidCell(i, j - 1) && this.unitsMatrix[i][j - 1] == '1') {
                this.minesMatrix[i][j - 1].explode();
                this.unitsMatrix[i][j - 1] = '0';
            }
            if (this.isValidCell(i, j) && this.unitsMatrix[i][j] == '1') {
                this.minesMatrix[i][j].explode();
                this.unitsMatrix[i][j] = '0';
            }
        },
        diePig: function(i, j) {
            this.pigsMatrix[i][j].die();
        },
        attackChickensInArea: function(i, j) {
            if (this.isValidCell(i - 1, j - 1) && this.unitsMatrix[i - 1][j - 1] == 'c') {
                this.chickensMatrix[i - 1][j - 1].attack();
            }
            if (this.isValidCell(i - 1, j) && this.unitsMatrix[i - 1][j] == 'c') {
                this.chickensMatrix[i - 1][j].attack();
            }
            if (this.isValidCell(i - 1, j + 1) && this.unitsMatrix[i - 1][j + 1] == 'c') {
                this.chickensMatrix[i - 1][j + 1].attack();
            }
            if (this.isValidCell(i, j + 1) && this.unitsMatrix[i][j + 1] == 'c') {
                this.chickensMatrix[i][j + 1].attack();
            }
            if (this.isValidCell(i + 1, j + 1) && this.unitsMatrix[i + 1][j + 1] == 'c') {
                this.chickensMatrix[i + 1][j + 1].attack();
            }
            if (this.isValidCell(i + 1, j) && this.unitsMatrix[i + 1][j] == 'c') {
                this.chickensMatrix[i + 1][j].attack();
            }
            if (this.isValidCell(i + 1, j - 1) && this.unitsMatrix[i + 1][j - 1] == 'c') {
                this.chickensMatrix[i + 1][j - 1].attack();
            }
            if (this.isValidCell(i, j - 1) && this.unitsMatrix[i][j - 1] == 'c') {
                this.chickensMatrix[i][j - 1].attack();
            }
            if (this.isValidCell(i, j) && this.unitsMatrix[i][j] == 'c') {
                this.chickensMatrix[i][j].attack();
            }
            if (this.isValidCell(i, j - 2) && this.unitsMatrix[i][j - 2] == 'c') {
                this.chickensMatrix[i][j - 2].attack();
            }
            if (this.isValidCell(i, j + 2) && this.unitsMatrix[i][j + 2] == 'c') {
                this.chickensMatrix[i][j + 2].attack();
            }
            if (this.isValidCell(i - 2, j) && this.unitsMatrix[i - 2][j] == 'c') {
                this.chickensMatrix[i - 2][j].attack();
            }
            if (this.isValidCell(i + 2, j) && this.unitsMatrix[i + 2][j] == 'c') {
                this.chickensMatrix[i + 2][j].attack();
            }
        },
        bombExplodeArea: function (i, j, unitCount)
        {
            if (unitCount > 0) {
                if (this.isValidCell(i, j) && (this.unitsMatrix[i][j] == 'c' || this.unitsMatrix[i][j] == '1')) {
                    this.minesMatrix[i][j].explode();
                    this.chickensMatrix[i][j].die();
                    this.unitsMatrix[i][j] = '0';
                }
            }
            if (unitCount > 1) {
                if (this.isValidCell(i - 1, j) && (this.unitsMatrix[i - 1][j] == 'c' || this.unitsMatrix[i - 1][j] == '1')) {
                    this.minesMatrix[i - 1][j].explode();
                    this.chickensMatrix[i - 1][j].die();
                    this.unitsMatrix[i - 1][j] = '0';
                }
                if (this.isValidCell(i, j + 1) && (this.unitsMatrix[i][j + 1] == 'c' || this.unitsMatrix[i][j + 1] == '1')) {
                    this.minesMatrix[i][j + 1].explode();
                    this.chickensMatrix[i][j + 1].die();
                    this.unitsMatrix[i][j + 1] = '0';
                }
                if (this.isValidCell(i + 1, j) && (this.unitsMatrix[i + 1][j] == 'c' || this.unitsMatrix[i + 1][j] == '1')) {
                    this.minesMatrix[i + 1][j].explode();
                    this.chickensMatrix[i + 1][j].die();
                    this.unitsMatrix[i + 1][j] = '0';
                }
                if (this.isValidCell(i, j - 1) && (this.unitsMatrix[i][j - 1] == 'c' || this.unitsMatrix[i][j - 1] == '1')) {
                    this.minesMatrix[i][j - 1].explode();
                    this.chickensMatrix[i][j - 1].die();
                    this.unitsMatrix[i][j - 1] = '0';
                }
            }
            if (unitCount > 2) {
                if (this.isValidCell(i - 1, j - 1) && (this.unitsMatrix[i - 1][j - 1] == 'c' || this.unitsMatrix[i - 1][j - 1] == '1')) {
                    this.minesMatrix[i - 1][j - 1].explode();
                    this.chickensMatrix[i - 1][j - 1].die();
                    this.unitsMatrix[i - 1][j - 1] = '0';
                }
                if (this.isValidCell(i - 2, j) && (this.unitsMatrix[i - 2][j] == 'c' || this.unitsMatrix[i - 2][j] == '1')) {
                    this.minesMatrix[i - 2][j].explode();
                    this.chickensMatrix[i - 2][j].die();
                    this.unitsMatrix[i - 2][j] = '0';
                }
                if (this.isValidCell(i - 1, j + 1) && (this.unitsMatrix[i - 1][j + 1] == 'c' || this.unitsMatrix[i - 1][j + 1] == '1')) {
                    this.minesMatrix[i - 1][j + 1].explode();
                    this.chickensMatrix[i - 1][j + 1].die();
                    this.unitsMatrix[i - 1][j + 1] = '0';
                }
                if (this.isValidCell(i, j + 2) && (this.unitsMatrix[i][j + 2] == 'c' || this.unitsMatrix[i][j + 2] == '1')) {
                    this.minesMatrix[i][j + 2].explode();
                    this.chickensMatrix[i][j + 2].die();
                    this.unitsMatrix[i][j + 2] = '0';
                }
                if (this.isValidCell(i + 1, j + 1) && (this.unitsMatrix[i + 1][j + 1] == 'c' || this.unitsMatrix[i + 1][j + 1] == '1')) {
                    this.minesMatrix[i + 1][j + 1].explode();
                    this.chickensMatrix[i + 1][j + 1].die();
                    this.unitsMatrix[i + 1][j + 1] = '0';
                }
                if (this.isValidCell(i + 2, j) && (this.unitsMatrix[i + 2][j] == 'c' || this.unitsMatrix[i + 2][j] == '1')) {
                    this.minesMatrix[i + 2][j].explode();
                    this.chickensMatrix[i + 2][j].die();
                    this.unitsMatrix[i + 2][j] = '0';
                }
                if (this.isValidCell(i + 1, j - 1) && (this.unitsMatrix[i + 1][j - 1] == 'c' || this.unitsMatrix[i + 1][j - 1] == '1')) {
                    this.minesMatrix[i + 1][j - 1].explode();
                    this.chickensMatrix[i + 1][j - 1].die();
                    this.unitsMatrix[i + 1][j - 1] = '0';
                }
                if (this.isValidCell(i, j - 2) && (this.unitsMatrix[i][j - 2] == 'c' || this.unitsMatrix[i][j - 2] == '1')) {
                    this.minesMatrix[i][j - 2].explode();
                    this.chickensMatrix[i][j - 2].die();
                    this.unitsMatrix[i][j - 2] = '0';
                }
            }
            if (unitCount > 3) {
                if (this.isValidCell(i - 1, j - 2) && (this.unitsMatrix[i - 1][j - 2] == 'c' || this.unitsMatrix[i - 1][j - 2] == '1')) {
                    this.minesMatrix[i - 1][j - 2].explode();
                    this.chickensMatrix[i - 1][j - 2].die();
                    this.unitsMatrix[i - 1][j - 2] = '0';
                }
                if (this.isValidCell(i - 2, j - 1) && (this.unitsMatrix[i - 2][j - 1] == 'c' || this.unitsMatrix[i - 2][j - 1] == '1')) {
                    this.minesMatrix[i - 2][j - 1].explode();
                    this.chickensMatrix[i - 2][j - 1].die();
                    this.unitsMatrix[i - 2][j - 1] = '0';
                }
                if (this.isValidCell(i - 3, j) && (this.unitsMatrix[i - 3][j] == 'c' || this.unitsMatrix[i - 3][j] == '1')) {
                    this.minesMatrix[i - 3][j].explode();
                    this.chickensMatrix[i - 3][j].die();
                    this.unitsMatrix[i - 3][j] = '0';
                }
                if (this.isValidCell(i - 2, j + 1) && (this.unitsMatrix[i - 2][j + 1] == 'c' || this.unitsMatrix[i - 2][j + 1] == '1')) {
                    this.minesMatrix[i - 2][j + 1].explode();
                    this.chickensMatrix[i - 2][j + 1].die();
                    this.unitsMatrix[i - 2][j + 1] = '0';
                }
                if (this.isValidCell(i - 1, j + 2) && (this.unitsMatrix[i - 1][j + 2] == 'c' || this.unitsMatrix[i - 1][j + 2] == '1')) {
                    this.minesMatrix[i - 1][j + 2].explode();
                    this.chickensMatrix[i - 1][j + 2].die();
                    this.unitsMatrix[i - 1][j + 2] = '0';
                }
                if (this.isValidCell(i, j + 3) && (this.unitsMatrix[i][j + 3] == 'c' || this.unitsMatrix[i][j + 3] == '1')) {
                    this.minesMatrix[i][j + 3].explode();
                    this.chickensMatrix[i][j + 3].die();
                    this.unitsMatrix[i][j + 3] = '0';
                }
                if (this.isValidCell(i + 1, j + 2) && (this.unitsMatrix[i + 1][j + 2] == 'c' || this.unitsMatrix[i + 1][j + 2] == '1')) {
                    this.minesMatrix[i + 1][j + 2].explode();
                    this.chickensMatrix[i + 1][j + 2].die();
                    this.unitsMatrix[i + 1][j + 2] = '0';
                }
                if (this.isValidCell(i + 2, j + 1) && (this.unitsMatrix[i + 2][j + 1] == 'c' || this.unitsMatrix[i + 2][j + 1] == '1')) {
                    this.minesMatrix[i + 2][j + 1].explode();
                    this.chickensMatrix[i + 2][j + 1].die();
                    this.unitsMatrix[i + 2][j + 1] = '0';
                }
                if (this.isValidCell(i + 3, j) && (this.unitsMatrix[i + 3][j] == 'c' || this.unitsMatrix[i + 3][j] == '1')) {
                    this.minesMatrix[i + 3][j].explode();
                    this.chickensMatrix[i + 3][j].die();
                    this.unitsMatrix[i + 3][j] = '0';
                }
                if (this.isValidCell(i + 2, j - 1) && (this.unitsMatrix[i + 2][j - 1] == 'c' || this.unitsMatrix[i + 2][j - 1] == '1')) {
                    this.minesMatrix[i + 2][j - 1].explode();
                    this.chickensMatrix[i + 2][j - 1].die();
                    this.unitsMatrix[i + 2][j - 1] = '0';
                }
                if (this.isValidCell(i + 1, j - 2) && (this.unitsMatrix[i + 1][j - 2] == 'c' || this.unitsMatrix[i + 1][j - 2] == '1')) {
                    this.minesMatrix[i + 1][j - 2].explode();
                    this.chickensMatrix[i + 1][j - 2].die();
                    this.unitsMatrix[i + 1][j - 2] = '0';
                }
                if (this.isValidCell(i, j - 3) && (this.unitsMatrix[i][j - 3] == 'c' || this.unitsMatrix[i][j - 3] == '1')) {
                    this.minesMatrix[i][j - 3].explode();
                    this.chickensMatrix[i][j - 3].die();
                    this.unitsMatrix[i][j - 3] = '0';
                }
            }
        },

        addInteraction: function() {
            var that = this;

            this.$addChicken.click(function () {
                if (that.creator) {
                    if ((parseInt(that.$firstPlayerMoney.text())) - ((parseInt(that.$valueChicken.val()) + 1) * Chicken.COST) < 0) {
                        return;
                    }
                    else {
                        that.$valueChicken.val((parseInt(that.$valueChicken.val()) + 1));
                        that.currentSelectedUnit = "chicken";
                        that.currentSelectedUnitCount = that.$valueChicken.val();
                    }
                }
                else {
                    if ((parseInt(that.$secondPlayerMoney.text())) - ((parseInt(that.$valueChicken.val()) + 1) * Chicken.COST) < 0) {
                        return;
                    }
                    else {
                        that.$valueChicken.val((parseInt(that.$valueChicken.val()) + 1));
                        that.currentSelectedUnit = "chicken";
                        that.currentSelectedUnitCount = that.$valueChicken.val();
                    }
                }
                
            });
            this.$removeChicken.click(function () {
                if ((parseInt(that.$valueChicken.val()) - 1) < 1)
                    return;
                else {
                    that.$valueChicken.val((parseInt(that.$valueChicken.val()) - 1));
                    that.currentSelectedUnit = "chicken";
                    that.currentSelectedUnitCount = that.$valueChicken.val();
                }
            });

            this.$addPig.click(function () {
                if (that.creator) {
                    if ((parseInt(that.$firstPlayerMoney.text())) - ((parseInt(that.$valuePig.val()) + 1) * Pig.COST) < 0) {
                        return;
                    }
                    else {
                        that.$valuePig.val((parseInt(that.$valuePig.val()) + 1));
                        that.currentSelectedUnit = "pig";
                        that.currentSelectedUnitCount = that.$valuePig.val();
                    }
                }
                else {
                    if ((parseInt(that.$secondPlayerMoney.text())) - ((parseInt(that.$valuePig.val()) + 1) * Pig.COST) < 0) {
                        return;
                    }
                    else {
                        that.$valuePig.val((parseInt(that.$valuePig.val()) + 1));
                        that.currentSelectedUnit = "pig";
                        that.currentSelectedUnitCount = that.$valuePig.val();
                    }
                }
                
            });
            this.$removePig.click(function () {
                if ((parseInt(that.$valuePig.val()) - 1) < 1)
                    return;
                else {
                    that.$valuePig.val((parseInt(that.$valuePig.val()) - 1));
                    that.currentSelectedUnit = "pig";
                    that.currentSelectedUnitCount = that.$valuePig.val();
                }
            });

            this.$addBomb.click(function () {
                if (that.creator) {
                    if ((parseInt(that.$firstPlayerMoney.text())) - ((parseInt(that.$valueBomb.val()) + 1) * Bomb.COST) < 0 ||
                                    (parseInt(that.$valueBomb.val()) + 1) > Bomb.MAX_SIZE) {
                        return;
                    }
                    else {
                        that.$valueBomb.val((parseInt(that.$valueBomb.val()) + 1));
                        that.currentSelectedUnit = "bomb";
                        that.currentSelectedUnitCount = that.$valueBomb.val();
                    }
                }
                else {
                    if ((parseInt(that.$secondPlayerMoney.text())) - ((parseInt(that.$valueBomb.val()) + 1) * Bomb.COST) < 0 ||
                                    (parseInt(that.$valueBomb.val()) + 1) > Bomb.MAX_SIZE) {
                        return;
                    }
                    else {
                        that.$valueBomb.val((parseInt(that.$valueBomb.val()) + 1));
                        that.currentSelectedUnit = "bomb";
                        that.currentSelectedUnitCount = that.$valueBomb.val();
                    }
                }
            });
            this.$removeBomb.click(function () {
                if ((parseInt(that.$valueBomb.val()) - 1) < 1)
                    return;
                else {
                    that.$valueBomb.val((parseInt(that.$valueBomb.val()) - 1));
                    that.currentSelectedUnit = "bomb";
                    that.currentSelectedUnitCount = that.$valueBomb.val();
                }
            });

            this.$placeMine.click(function () {
                that.currentSelectedUnit = "mine";
            });
            this.$placeChicken.click(function () {
                that.currentSelectedUnit = "chicken";
                that.currentSelectedUnitCount = that.$valueChicken.val();
            });
            this.$placePig.click(function () {
                that.currentSelectedUnit = "pig";
                that.currentSelectedUnitCount = that.$valuePig.val();
            });
            this.$placeBomb.click(function () {
                that.currentSelectedUnit = "bomb";
                that.currentSelectedUnitCount = that.$valueBomb.val();
            });
        },
        disableLayerInteraction: function() {
            this.hoverLayer.setListening(false);
            this.hoverLayer.drawHit();
        },
        enableLayerInteraction: function() {
            this.hoverLayer.setListening(true);
            this.hoverLayer.drawHit();
        },
        enableHover: function (layer) {
            layer.setListening(true);
            layer.drawHit();
        },   
        disableHover: function (layer) {
            layer.setListening(false);
            layer.drawHit();
        },
        isValidCell: function (i, j) {
            if (i < 0 || i >= BigBombsGame.FIELD_STATIC_Y || j < 0 || j >= BigBombsGame.FIELD_STATIC_X) {
                return false;
            }
            else return true;
        },
        isValidChickenDefenseAreaCell: function (i, j) {
            if (this.creator) {
                if (i < 0 || i >= BigBombsGame.FIELD_STATIC_Y || j < 0 || j >= BigBombsGame.FIELD_STATIC_X / 2) {
                    return false;
                }
                else return true;
            }
            else {
                if (i < 0 || i >= BigBombsGame.FIELD_STATIC_Y || j < BigBombsGame.FIELD_STATIC_X / 2 || j >= BigBombsGame.FIELD_STATIC_X) {
                    return false;
                }
                else return true;
            }
        }
    }
    BigBombsGame.FIELD_STATIC_X = 14;
    BigBombsGame.FIELD_STATIC_Y = 10;

    BigBombsGame.CELL_SIZE = 70;

    BigBombsGame.STAGES_NUM = 5;

    BigBombsGame.FIELD_WIDTH = BigBombsGame.CELL_SIZE * BigBombsGame.FIELD_STATIC_X;
    BigBombsGame.FIELD_HEIGHT = BigBombsGame.CELL_SIZE * BigBombsGame.FIELD_STATIC_Y;


    
})(jQuery);