(function () {

    var modalWaiting = "<h4>You should give your game ID to your friend who wants to join you.</h4><h4>Your game ID is:</h4><h3 id='groupID'></h3>"
    playerJoined = false;

    SiteController = function (param) {
        this.param = param;
        this.$hudContainer = $(param.hudContainer);

        this.$btnCreateGame = $(param.btnCreateGame);
        this.$btnJoinGame = $(param.btnJoinGame);
        this.$txtGameIdJoin = $(param.txtGameIdJoin);
        this.$btnJoinRandomGame = $(param.btnJoinRandomGame)

        this.$gameWrapper = $(param.gameWrapper);
        this.$options = $(param.options);
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
                that.bbGame.createGame(true, that.$groupID.text(), false);
                $(that.param.userOnMove).text(myUserName);
                $(that.param.creatorName).text(myUserName);
                that.$options.fadeOut('slow');
                that.$gameWrapper.fadeIn('slow');
                that.generateLoading();
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
                    that.bbGame.createGame(false, that.$txtGameIdJoin.val(), false);
                    that.bbGame.$buildStageWrapper.hide();
                    that.bbGame.$otherPlayerPlayingWrapper.show();
                    that.$btnNextStage.hide();
                    $(that.param.guestName).text(myUserName);
                    that.$options.fadeOut('slow');
                    that.$gameWrapper.fadeIn('slow');
                }

            });

            this.$btnJoinRandomGame.click(function (e) {

                that.initBigBombsGame();

                that.bbGame.creator = true;
                that.bbGame.createGame(true, "", true);
                $(that.param.userOnMove).text(myUserName);
                $(that.param.creatorName).text(myUserName);
                that.$options.fadeOut('slow');
                that.$gameWrapper.fadeIn('slow');
                that.generateLoadingForRandom();
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
                bombCost: $(this.param.bombCost),
                firstPlayerMoney: $(this.param.firstPlayerMoney),
                secondPlayerMoney: $(this.param.secondPlayerMoney),
                userOnMove: $(this.param.userOnMove),
                creatorName: $(this.param.creatorName),
                guestName: $(this.param.guestName)
            });
            bbGame.init();
            this.bbGame = bbGame;
        },

        generateLoading: function () {
            $.MetroLoading(
		    {
		        title: "Waiting for other player",
		        content: "<h4>You should give your game ID to your friend who wants to join you.</h4><h4>Your game ID is:</h4><h3 id='groupID'></h3>",
                timeout: 120000, 
		        special: false,
		    }
		);
        },
        generateLoadingForRandom: function () {
            var that = this;
            $.MetroLoading(
            {
                title: "Waiting for other player",
                content: "<h4>Waiting for someone to join the game</h4>",
                timeout: 120000, 
                special: false,
            }, function () {
                if (!playerJoined)
                {
                    that.bbGame.bb.server.randomPlayerTimeout(that.bbGame.myGroupID); alert("No players available! Try again later"); window.location = "/";

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
                btnJoinRandomGame: "#btn-join-random-game",
                txtGameIdJoin: "#game-id-join",
                gameWrapper: "#game-wrapper",
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
                bombCost: "#bomb-cost",
                firstPlayerMoney: "#first-player-money",
                secondPlayerMoney: "#second-player-money",
                userOnMove: "#user-on-move",
                creatorName: "#creator-name",
                guestName: "#guest-name",
            });
            siteController.init();
        }
    );

})(jQuery);