using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using BigBombsWeb.DAL;
using BigBombsWeb.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using BigBombsWeb.DAL;

namespace BigBombsWebTempTest
{
    [HubName("bigbombs")]
    public class BigBombsHUB : Hub
    {
        private static readonly ConcurrentDictionary<string, object> _connections = new ConcurrentDictionary<string, object>();
        private static Dictionary<string, int> groupsCount = new Dictionary<string, int>();
        private static Dictionary<string, int> groupStageCount = new Dictionary<string, int>();
        private static int currentPlayersWaiting = 0;
        private static string currentGameNameWaiting = "";
        private static List<BigBombsGame> currentGames = new List<BigBombsGame>();

        public void NotifyOtherPlayerJoined(string groupName)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            Clients.Group(groupName).notifyGuestJoined(currentGame.CreatorUsername, currentGame.GuestUsername);
        }

        public void OnNextStage(string groupName)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);

                if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
                {
                    currentGame.StageCount++;
                    Clients.Group(groupName).moveNextStage();
                }
                else Clients.Caller.notify("It is not your turn!");
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }

        public void AddMine(string groupName, int i, int j)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
                {
                    if (currentGame.StageCount % 5 == 0)
                    {
                        if (!currentGame.IsValidFirstPlayerBuildPosition(i, j))
                        {
                            Clients.Caller.notify("Invalid mine position!");
                            return;
                        }
                        if (currentGame.FirstPlayerMoney - BigBombsGame.mineCost >= 0)
                        {
                            currentGame.FirstPlayerMoney -= BigBombsGame.mineCost;
                            currentGame.MatrixUnits[i, j] = 'm';
                            currentGame.MatrixUnitsCount[i, j] = 1;
                            Clients.Group(groupName).addMine(i, j, 1, 1);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                    }
                    else
                    {
                        if (!currentGame.IsValidSecondPlayerBuildPosition(i, j))
                        {
                            Clients.Caller.notify("Invalid mine position!");
                            return;
                        }
                        if (currentGame.SecondPlayerMoney - BigBombsGame.mineCost >= 0)
                        {
                            currentGame.SecondPlayerMoney -= BigBombsGame.mineCost;
                            currentGame.MatrixUnits[i, j] = 'm';
                            currentGame.MatrixUnitsCount[i, j] = 1;
                            Clients.Group(groupName).addMine(i, j, 1, 2);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                    }
                }
                else Clients.Caller.notify("It is not your turn!");
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }

        public void AddChicken(string groupName, int i, int j, int unitCount)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
                {
                    if (currentGame.StageCount % 5 == 0)
                    {
                        if (!currentGame.IsValidFirstPlayerBuildPosition(i, j))
                        {
                            Clients.Caller.notify("Invalid chicken position!");
                            return;
                        }
                        if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.chickenCost) >= 0)
                        {
                            currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.chickenCost);
                            currentGame.MatrixUnits[i, j] = 'c';
                            currentGame.MatrixUnitsCount[i, j] += unitCount;
                            Clients.Group(groupName).addChicken(i, j, unitCount, currentGame.MatrixUnitsCount[i, j], 1);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                    }
                    else
                    {
                        if (!currentGame.IsValidSecondPlayerBuildPosition(i, j))
                        {
                            Clients.Caller.notify("Invalid chicken position!");
                            return;
                        }
                        if (currentGame.SecondPlayerMoney - (unitCount * BigBombsGame.chickenCost) >= 0)
                        {
                            currentGame.SecondPlayerMoney -= (unitCount * BigBombsGame.chickenCost);
                            currentGame.MatrixUnits[i, j] = 'c';
                            currentGame.MatrixUnitsCount[i, j] += unitCount;
                            Clients.Group(groupName).addChicken(i, j, unitCount, currentGame.MatrixUnitsCount[i, j], 2);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                    }
                }
                else return;
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }

        public void AddPig(string groupName, int i, int j, int unitCount)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
                {
                    if (currentGame.StageCount % 5 == 2)
                    {
                        if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.pigCost) >= 0)
                        {
                            currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.pigCost);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                        if (!currentGame.IsValidFirstPlayerPigAttackCell(i, j))
                        {
                            Clients.Caller.notify("Invalid attack position!");
                            return;
                        }
                        Clients.Group(groupName).addPig(i, j, unitCount, 1);
                        int secondPlayerDefencePoints = currentGame.DefensePointsSecondPlayer(i, j);

                        if (secondPlayerDefencePoints * BigBombsGame.chickenPower > unitCount * BigBombsGame.pigPower)
                        {
                            Clients.Group(groupName).pigFailAttack(i, j);
                        }
                        else
                        {
                            currentGame.ClearArea(i, j);
                            int winner = currentGame.CheckGameEnd();
                            Clients.Group(groupName).pigSuccessAttack(i, j, winner);
                            if (winner > 0)
                            {
                                currentGame.EndGame(winner);
                                currentGames.Remove(currentGame);
                            }
                        }
                    }
                    else
                    {
                        if (currentGame.SecondPlayerMoney - (unitCount * BigBombsGame.pigCost) >= 0)
                        {
                            currentGame.SecondPlayerMoney -= (unitCount * BigBombsGame.pigCost);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                        if (!currentGame.IsValidSecondPlayerPigAttackCell(i, j))
                        {
                            Clients.Caller.notify("Invalid attack position!");
                            return;
                        }
                        Clients.Group(groupName).addPig(i, j, unitCount, 2);
                        int firstPlayerDefencePoints = currentGame.DefensePointsFirstPlayer(i, j);

                        if (firstPlayerDefencePoints * BigBombsGame.chickenPower > unitCount * BigBombsGame.pigPower)
                        {
                            Clients.Group(groupName).pigFailAttack(i, j);
                        }
                        else
                        {
                            currentGame.ClearArea(i, j);
                            int winner = currentGame.CheckGameEnd();
                            Clients.Group(groupName).pigSuccessAttack(i, j, winner);
                            if (winner > 0)
                            {
                                currentGame.EndGame(winner);
                                currentGames.Remove(currentGame);
                            }
                        }
                    }
                }
                else Clients.Caller.notify("It is not your turn!");
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }

        public void AddBomb(string groupName, int i, int j, int unitCount)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
                {
                    if (currentGame.StageCount % 5 == 2)
                    {
                        if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.bombCost) >= 0)
                        {
                            currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.bombCost);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                        currentGame.ClearBombArea(i, j, unitCount);
                        int winner = currentGame.CheckGameEnd();
                        Clients.Group(groupName).addBomb(i, j, unitCount, 1, winner);
                        if (winner > 0)
                        {
                            currentGame.EndGame(winner);
                            currentGames.Remove(currentGame);
                        }
                    }
                    else
                    {
                        if (currentGame.SecondPlayerMoney - (unitCount * BigBombsGame.pigCost) >= 0)
                        {
                            currentGame.SecondPlayerMoney -= (unitCount * BigBombsGame.pigCost);
                        }
                        else
                        {
                            Clients.Caller.notify("Not enough money!");
                            return;
                        }
                        currentGame.ClearBombArea(i, j, unitCount);
                        int winner = currentGame.CheckGameEnd();
                        Clients.Group(groupName).addBomb(i, j, unitCount, 2, winner);
                        if (winner > 0)
                        {
                            currentGame.EndGame(winner);
                            currentGames.Remove(currentGame);
                        }
                    }
                }
                else Clients.Caller.notify("It is not your turn!");
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }
       
        public void CollectStage(string groupName)
        {
            try
            {
                BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                if (currentGame.StageCount % 5 == 4)
                {
                    int firstPlayerCollects = currentGame.FirstPlayerCollects();
                    int secondPlayerCollects = currentGame.SecondPlayerCollects();
                    currentGame.FirstPlayerMoney += firstPlayerCollects;
                    currentGame.SecondPlayerMoney += secondPlayerCollects;
                    Clients.Group(groupName).updateMoney(firstPlayerCollects, secondPlayerCollects);
                }
                else return;
            }
            catch (Exception ex)
            {
                Clients.Caller.notify(ex.Message);
            }
        }

        public override Task OnConnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.Caller.displayGroupID(Context.ConnectionId);
        }

        public override Task OnDisconnected()
        {
            try
            {
                BigBombsGame currentGame = currentGames.SingleOrDefault(x => x.GroupName == Context.ConnectionId);
                if (currentGame != null)
                {
                    Clients.OthersInGroup(currentGame.GroupName).notifyPlayerDisconnected("The other player has left the game! You will be redirected automatically!");
                    currentGames.Remove(currentGame);
                }
                else
                {
                    currentGame = currentGames.SingleOrDefault(x => x.GuestName == Context.ConnectionId);
                    if (currentGame != null)
                    {
                        Clients.OthersInGroup(currentGame.GroupName).notifyPlayerDisconnected("The other player has left the game! You will be redirected automatically!");
                        currentGames.Remove(currentGame);
                    }
                }
                object value;
                _connections.TryRemove(Context.ConnectionId, out value);
                return Clients.OthersInGroup(currentGame.GroupName).notify("The game was aborted by the user!");
            }
            catch (Exception ex)
            {
                return Clients.Caller.notify("The game was aborted by the user!");
            }
        }

        private bool GameExists(string groupName)
        {
            foreach (var game in currentGames)
            {
                if (game.GroupName == groupName)
                {
                    return true;
                }
            }
            return false;
        }

        public void RandomPlayerTimeout(string groupName)
        {
            currentPlayersWaiting = 0;
            currentGameNameWaiting = "";
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            currentGames.Remove(currentGame);
        }

        public void AddConnection(string groupName, bool creator, string username, bool random)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<BigBombsHUB>();
            if (groupName != "")
            {
                bool gameExist = GameExists(groupName);
                if (gameExist)
                {
                    BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
                    if (currentGame.JoinedPlayers++ < 2)
                    {
                        currentGame.GuestName = Context.ConnectionId.ToString();
                        currentGame.GuestUsername = username;
                        context.Groups.Add(Context.ConnectionId, groupName);
                        Clients.Caller.setMyGroupID(groupName);
                        currentGame.JoinedPlayers++;
                    }
                    else
                    {
                        return;
                    }
                }
                else
                {
                    Clients.Caller.notifyPlayerWrongGameID();
                }
            }
            else
            {
                if (random)
                {
                    if (currentPlayersWaiting == 0)
                    {
                        currentGames.Add(new BigBombsGame(Context.ConnectionId, username));
                        context.Groups.Add(Context.ConnectionId, Context.ConnectionId);
                        currentGameNameWaiting = Context.ConnectionId;
                        Clients.Caller.setMyGroupID(Context.ConnectionId);
                        currentPlayersWaiting++;
                    }
                    else
                    {
                        BigBombsGame currentGame = currentGames.Single(x => x.GroupName == currentGameNameWaiting);
                        currentGame.GuestName = Context.ConnectionId.ToString();
                        currentGame.GuestUsername = username;
                        context.Groups.Add(Context.ConnectionId, currentGameNameWaiting);
                        Clients.Caller.setMyGroupIDAndRole(currentGameNameWaiting);
                        currentGame.JoinedPlayers++;
                        currentPlayersWaiting = 0;
                        currentGameNameWaiting = "";
                    }
                }
                else
                {
                    if (creator)
                    {
                        currentGames.Add(new BigBombsGame(Context.ConnectionId, username));
                        context.Groups.Add(Context.ConnectionId, Context.ConnectionId);
                        Clients.Caller.setMyGroupID(Context.ConnectionId);
                    }
                    else
                    {
                        Clients.Caller.notifyPlayerWrongGameID();
                    }
                }
            }
        }
    }
}