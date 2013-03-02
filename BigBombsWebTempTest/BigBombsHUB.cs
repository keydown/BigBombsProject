using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace BigBombsWebTempTest
{
    [HubName("bigbombs")]
    public class BigBombsHUB : Hub
    {
        private static readonly ConcurrentDictionary<string, object> _connections = new ConcurrentDictionary<string, object>();
        private static Dictionary<string, int> groupsCount = new Dictionary<string, int>();
        private static Dictionary<string, int> groupStageCount = new Dictionary<string, int>();

        private static List<BigBombsGame> currentGames = new List<BigBombsGame>();

        public void NotifyOtherPlayerJoined(string groupName)
        {
            Clients.OthersInGroup(groupName).removeModal();
        }

        public void OnNextStage(string groupName)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
            {
                currentGame.StageCount++;
                Clients.Group(groupName).moveNextStage();
            }
            else return;
        }

        public void AddMine(string groupName, int i, int j)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
            {
                if (currentGame.StageCount % 5 < 2)
                {
                    if (currentGame.FirstPlayerMoney - BigBombsGame.mineCost >= 0)
                    {
                        currentGame.FirstPlayerMoney -= BigBombsGame.mineCost;
                        currentGame.MatrixUnits[i, j] = 'm';
                        currentGame.MatrixUnitsCount[i, j] = 1;
                        Clients.Group(groupName).addMine(i, j, 1, 1);
                    }
                    else
                    {
                        return;
                    }
                }
                else
                {
                    if (currentGame.SecondPlayerMoney - BigBombsGame.mineCost >= 0)
                    {
                        currentGame.SecondPlayerMoney -= BigBombsGame.mineCost;
                        currentGame.MatrixUnits[i, j] = 'm';
                        currentGame.MatrixUnitsCount[i, j] = 1;
                        Clients.Group(groupName).addMine(i, j, 1, 2);
                    }
                    else
                    {
                        return;
                    }
                }
            }
            else return;
        }

        public void AddChicken(string groupName, int i, int j, int unitCount)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
            {
                if (currentGame.StageCount % 5 < 2)
                {
                    if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.chickenCost) >= 0)
                    {
                        currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.chickenCost);
                        currentGame.MatrixUnits[i, j] = 'c';
                        currentGame.MatrixUnitsCount[i, j] = unitCount;
                        Clients.Group(groupName).addChicken(i, j, unitCount, 1);
                    }
                    else
                    {
                        return;
                    }
                }
                else
                {
                    if (currentGame.SecondPlayerMoney - (unitCount * BigBombsGame.chickenCost) >= 0)
                    {
                        currentGame.SecondPlayerMoney -= (unitCount * BigBombsGame.chickenCost);
                        currentGame.MatrixUnits[i, j] = 'c';
                        currentGame.MatrixUnitsCount[i, j] = unitCount;
                        Clients.Group(groupName).addChicken(i, j, unitCount, 2);
                    }
                    else
                    {
                        return;
                    }
                }
            }
            else return;
        }

        public void AddPig(string groupName, int i, int j, int unitCount)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
            {
                if (currentGame.StageCount % 5 < 2)
                {
                    if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.pigCost) >= 0)
                    {
                        currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.pigCost);
                    }
                    else
                    {
                        return;
                    }
                    Clients.Group(groupName).addPig(i, j, unitCount, 1);
                    int secondPlayerDefencePoints = currentGame.DefensePointsSecondPlayer(i, j);

                    if (secondPlayerDefencePoints > unitCount)
                    {
                        Clients.Group(groupName).pigFailAttack(i, j);
                    }
                    else
                    {
                        currentGame.ClearArea(i, j);
                        int winner = currentGame.CheckGameEnd();
                        Clients.Group(groupName).pigSuccessAttack(i, j, winner);
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
                        return;
                    }
                    Clients.Group(groupName).addPig(i, j, unitCount, 2);
                    int firstPlayerDefencePoints = currentGame.DefensePointsFirstPlayer(i, j);

                    if (firstPlayerDefencePoints > unitCount)
                    {
                        Clients.Group(groupName).pigFailAttack(i, j, unitCount);
                    }
                    else
                    {
                        currentGame.ClearArea(i, j);
                        int winner = currentGame.CheckGameEnd();
                        Clients.Group(groupName).pigSuccessAttack(i, j, unitCount, winner);
                    }
                }
            }
            else return;
        }

        public void AddBomb(string groupName, int i, int j, int unitCount)
        {
            BigBombsGame currentGame = currentGames.Single(x => x.GroupName == groupName);
            if (currentGame.IsPlayerOnTurn(Context.ConnectionId))
            {
                if (currentGame.StageCount % 5 < 2)
                {
                    if (currentGame.FirstPlayerMoney - (unitCount * BigBombsGame.bombCost) >= 0)
                    {
                        currentGame.FirstPlayerMoney -= (unitCount * BigBombsGame.bombCost);
                    }
                    else
                    {
                        return;
                    }
                    currentGame.ClearBombArea(i, j, unitCount);
                    int winner = currentGame.CheckGameEnd();
                    Clients.Group(groupName).addBomb(i, j, unitCount, 1, winner);
                }
                else
                {
                    if (currentGame.SecondPlayerMoney - (unitCount * BigBombsGame.pigCost) >= 0)
                    {
                        currentGame.SecondPlayerMoney -= (unitCount * BigBombsGame.pigCost);
                    }
                    else
                    {
                        return;
                    }
                    currentGame.ClearBombArea(i, j, unitCount);
                    int winner = currentGame.CheckGameEnd();
                    Clients.Group(groupName).addBomb(i, j, unitCount, 2, winner);
                }
            }
            else return;
        }
       
        public void CollectStage(string groupName)
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

        public override Task OnConnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.Caller.displayGroupID(Context.ConnectionId);
        }

        public override Task OnDisconnected()
        {
            object value;
            _connections.TryRemove(Context.ConnectionId, out value);
            return Clients.All.displayCount(_connections.Count);
        }

        public override Task OnReconnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.All.displayCount(_connections.Count);
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

        public void AddConnection(string groupName)
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
                        currentGame.JoinedPlayers++;
                    }
                    else
                    {
                        return;
                    }
                }
                //if (groupsCount.ContainsKey(groupName))
                //{
                //    if (groupsCount[groupName] < 2)
                //    {
                //        groupsCount[groupName]++;
                //    }
                //    else
                //    {
                //        return;
                //    }
                //}
                //else
                //{
                //    currentGames.Add(new BigBombsGame(groupName));
                //    //groupsCount.Add(groupName, 1);
                //}
                context.Groups.Add(Context.ConnectionId, groupName);
                Clients.Caller.setMyGroupID(groupName);
            }
            else
            {
             //   groupsCount.Add(Context.ConnectionId, 1);
                currentGames.Add(new BigBombsGame(Context.ConnectionId));
                context.Groups.Add(Context.ConnectionId, Context.ConnectionId);
               // groupStageCount.Add(Context.ConnectionId, 0);
                Clients.Caller.setMyGroupID(Context.ConnectionId);
            }
        }
    }
}