using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public static class GameRules
    {
        public const int StartingGold = 200;
        public const int PlayFieldSize = 101;
        public const int MinePrice = 6;
        public const int ChickenPrice = 1;
        public const int ChickenRange = 2;
        public const int ChickenPower = 1;
        public const int PigPrice = 7;
        public const float PigRange = 1.5f;
        public const int PigPower = 2;
        public const int BombPricePerRadius = 10;
        public const int MaxBombRadius = StartingGold / BombPricePerRadius - 1;
    }
}
