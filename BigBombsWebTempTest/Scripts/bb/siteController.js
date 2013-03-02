(function () {

    var otherPlayerPlayingHUD = "<h3>The Game has just started. The other Player is playing now. Please wait your turn</h3>";

    SiteController = function (param) {
        this.param = param;
        this.$hudContainer = $(param.hudContainer);
        this.$btnCreateGame = $(param.btnCreateGame);
        this.$btnJoinGame = $(param.btnJoinGame);
        this.$txtGameIdJoin = $(param.txtGameIdJoin);
        this.$gameWrapper = $(param.gameWrapper);
        this.$options = $(param.options);
        this.mdlWaiting = param.mdlWaiting;
        this.$btnCreateSession = $(param.btnCreateSession);
        this.$groupID = $(param.txtGroupId);

        this.$placeBomb = $(param.placeBomb);
        this.$placeMine = $(param.placeMine);
        this.$placeChicken = $(param.placeChicken);
        this.$placePig = $(param.placePig);

        this.$unitSelectionContainer = $(param.unitSelectionContainer);
        this.$buildStageWrapper = $(param.buildStageWrapper);
        this.$attackStageWrapper = $(param.attackStageWrapper);
        this.$otherPlayerPlayingWrapper = $(param.otherPlayerPlayingWrapper);
        this.$collectStageWrapper = $(param.collectStageWrapper);

        this.$btnNextStage = $(param.btnNextStage);

    };
    SiteController.prototype = {
        init: function () {
            var that = this;

            this.initOptionsInteraction();

        },

        initOptionsInteraction: function() {
            var that = this;

            this.$btnCreateGame.click(function (e) {
                e.preventDefault();

                that.initBigBombsGame();

                that.bbGame.creator = true;
                that.bbGame.createGame(true, that.$groupID.text());

                that.$options.fadeOut('slow');
                that.$gameWrapper.fadeIn('slow');
                that.generateModal("#" + that.mdlWaiting, true);

                that.$btnCreateSession.click(function () {
                    $("#" + that.mdlWaiting).append("<h2>Waiting for your friend to join...");
                });
            });

            this.$btnJoinGame.click(function (e) {
                e.preventDefault();

                if (that.$txtGameIdJoin.val() == "") {
                    that.$txtGameIdJoin.css('border', '2px solid red');
                }
                else {
                    that.initBigBombsGame();
                    that.bbGame.creator = false;
                    that.bbGame.setMyGroupID(that.$txtGameIdJoin.val());
                    that.bbGame.createGame(false, that.$txtGameIdJoin.val());
                    that.bbGame.$buildStageWrapper.hide();
                    that.bbGame.$otherPlayerPlayingWrapper.show();
                    that.$btnNextStage.hide();
                    that.$options.fadeOut('slow');
                    that.$gameWrapper.fadeIn('slow');
                }

            });
        },
        initBigBombsGame: function () {

            var bbGame = new BigBombsGame({
                hudContainer: this.$hudContainer,
                container: this.param.gameContainer,
                btnNextStage: this.param.btnNextStage,
                listStages: this.param.listStages,
                txtGroupID: this.$groupID,
                unitSelectionContainer: this.$unitSelectionContainer,
                buildStageWrapper: this.$buildStageWrapper,
                attackStageWrapper: this.$attackStageWrapper,
                collectStageWrapper: this.$collectStageWrapper,
                otherPlayerPlayingWrapper: this.$otherPlayerPlayingWrapper,
                placeMine: this.$placeMine,
                placeChicken: this.$placeChicken,
                placePig: this.$placePig,
                placeBomb: this.$placeBomb,
                addMine: $(this.param.addMine),
                addBomb: $(this.param.addBomb),
                addPig: $(this.param.addPig),
                addChicken: $(this.param.addChicken),
                removeMine: $(this.param.removeMine),
                removePig: $(this.param.removePig),
                removeBomb: $(this.param.removeBomb),
                removeChicken: $(this.param.removeChicken),
                valueChicken: $(this.param.valueChicken),
                valueMine: $(this.param.valueMine),
                valueBomb: $(this.param.valueBomb),
                valuePig: $(this.param.valuePig),
                firstPlayerMoney: $(this.param.firstPlayerMoney),
                secondPlayerMoney: $(this.param.secondPlayerMoney)
            });
            bbGame.init();
            this.bbGame = bbGame;
        },

        generateModal: function (el, noClosing) {
            nc = noClosing;
            $(el).modal({
                onOpen: function (dialog) {
                    dialog.overlay.fadeIn('slow', function () {
                        dialog.data.hide();
                        dialog.container.fadeIn('slow', function () {
                            dialog.data.slideDown('slow');
                        });
                    });
                },
                autoResize: true,
                onClose: function (dialog) {
                    //if (nc) return;
                    dialog.data.fadeOut('slow', function () {
                        dialog.container.hide('slow', function () {
                            dialog.overlay.slideUp('slow', function () {
                                $.modal.close();
                            });
                        });
                    });
                }
            })
        }
    }

    $(document).ready(
        function () {
            siteController = new SiteController({
                hudContainer: "#hud-container",
                gameContainer: "game-container",
                btnNextStage: "#next-stage",
                listStages: "#stages",
                options: "#options",
                btnCreateGame: "#btn-create-game",
                btnJoinGame: "#btn-join-game",
                txtGameIdJoin: "#game-id-join",
                gameWrapper: "#game-wrapper",
                mdlWaiting: "mdl-waiting",
                btnCreateSession: "#btn-create-session",
                txtGroupId: "#groupID",
                unitSelectionContainer: "#unit-selection",
                buildStageWrapper: "#build-stage-wrapper",
                attackStageWrapper: "#attack-stage-wrapper",
                collectStageWrapper: "#collect-stage-wrapper",
                otherPlayerPlayingWrapper: "#other-player-playing-wrapper",
                placeMine: "#place-mine",
                placeChicken: "#place-chicken",
                placePig: "#place-pig",
                placeBomb: "#place-bomb",
                addMine: "#add-mine",
                addBomb: "#add-bomb",
                addPig: "#add-pig",
                addChicken: "#add-chicken",
                removeMine: "#remove-mine",
                removeChicken: "#remove-chicken",
                removePig: "#remove-pig",
                removeBomb: "#remove-bomb",
                valueMine: "#value-mine",
                valueChicken: "#value-chicken",
                valueBomb: "#value-bomb",
                valuePig: "#value-pig",
                firstPlayerMoney: "#first-player-money",
                secondPlayerMoney: "#second-player-money"
            });
            siteController.init();
        }
    );

})(jQuery);