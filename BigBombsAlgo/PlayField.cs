using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public class PlayField
    {
        int goldAvailableForAttack;
        int goldSpentForDefense;
        int resultScore = 0;
        int minesCount = 0;
        const int PlayFieldSize = GameRules.PlayFieldSize;
        const int MaxBombRadius = GameRules.MaxBombRadius;
        DefenseUnit[,] playField = new DefenseUnit[PlayFieldSize, PlayFieldSize];

        float[,] playFieldPigsScores = new float[PlayFieldSize, PlayFieldSize];
        int[,] playFieldPigsNeededForDetonation = new int[PlayFieldSize, PlayFieldSize];
        int[, ,] playFieldBombsScores = new int[PlayFieldSize, PlayFieldSize, MaxBombRadius + 1];

        int[,] integralSumsStagingArray = new int[PlayFieldSize, PlayFieldSize];

        StringBuilder performedActions = new StringBuilder();

        public StringBuilder PerformedActions
        {
            get
            {
                return this.performedActions;
            }
            set
            {
                this.performedActions = value;
            }
        }

        public int MinesCount
        {
            get
            {
                return this.minesCount;
            }
            set
            {
                this.minesCount = value;
            }
        }

        public int GoldAvailableForAttack
        {
            get
            {
                return goldAvailableForAttack;
            }
            set
            {
                this.goldAvailableForAttack = value;
            }
        }

        public int GoldSpentForDefense
        {
            get
            {
                return goldSpentForDefense;
            }
            set
            {
                this.goldSpentForDefense = value;
            }
        }

        public int ResultScore
        {
            get
            {
                return resultScore;
            }
            set
            {
                this.resultScore = value;
            }
        }

        public int Size
        {
            get
            {
                return PlayFieldSize;
            }
        }

        public DefenseUnit this[int x, int y]
        {
            get
            {
                return playField[(PlayFieldSize - 1) - y, x];
            }
            set
            {
                playField[(PlayFieldSize - 1) - y, x] = value;
            }
        }

        public PlayField(int gold = GameRules.StartingGold)
        {
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    this[x, y] = new DefenseUnit(DefenseUnitTypes.Empty);
                }
            }

            this.GoldAvailableForAttack = gold;
            this.goldSpentForDefense = 0;
        }

        public PlayField(PlayField playField)
        {
            this.GoldAvailableForAttack = playField.GoldAvailableForAttack;
            this.GoldSpentForDefense = playField.GoldSpentForDefense;
            this.ResultScore = playField.ResultScore;
            this.MinesCount = playField.MinesCount;

            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    this[x, y] = new DefenseUnit(playField[x, y].Type, playField[x, y].Count);
                }
            }

            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    for (int z = 0; z <= MaxBombRadius; z++)
                    {
                        this.playFieldBombsScores[y, x, z] = playField.playFieldBombsScores[y, x, z];
                    }
                }
            }
        }

        public void InsertDefenseUnit(int x, int y, DefenseUnitTypes unitType, int count = 1)
        {
            this[x, y] = new DefenseUnit(unitType, count);
            this.GoldSpentForDefense += this[x, y].Count * this[x, y].Price;
            if (unitType == DefenseUnitTypes.Mine)
            {
                this.MinesCount += count;
            }
        }

        public void InsertMine(int x, int y)
        {
            this[x, y] = new DefenseUnit(DefenseUnitTypes.Mine);
            this.GoldSpentForDefense += this[x, y].Count * this[x, y].Price;
            this.MinesCount++;
        }

        public void InsertChicken(int x, int y, int count = 1)
        {
            this[x, y] = new DefenseUnit(DefenseUnitTypes.Chicken, count);
            this.GoldSpentForDefense += this[x, y].Count * this[x, y].Price;
        }

        private void RemoveUnitAt(int x, int y)
        {
            this.ResultScore += this[x, y].Price * this[x, y].Count;
            if (this[x, y].Type == DefenseUnitTypes.Mine)
            {
                this.MinesCount--;
            }
            this[x, y] = new DefenseUnit(DefenseUnitTypes.Empty);
        }

        public void AttackWithPigsAndEvaluate(int x, int y, int count = 1)
        {
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            int chickensInRangeCount = 0;

            this.GoldAvailableForAttack -= count * GameRules.PigPrice;
            this.PerformedActions.AppendLine(String.Format("pigs {0} {1} {2}", count, x, y));

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            if (chickensInRangeCount * GameRules.ChickenPower <= count * GameRules.PigPower)
            {
                foreach (int[] unit in unitsInPigRange)
                {
                    RemoveUnitAt(unit[0], unit[1]);
                }
            }

            EvaluatePlayFieldForPigsPartial(x, y);
        }

        //Pricey chicken.
        public void AttackWithPigsAndEvaluatePC(int x, int y, int count = 1)
        {
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            int chickensInRangeCount = 0;

            this.GoldAvailableForAttack -= count * GameRules.PigPrice;
            this.PerformedActions.AppendLine(String.Format("pigs {0} {1} {2}", count, x, y));

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            if (chickensInRangeCount * GameRules.ChickenPower <= count * GameRules.PigPower)
            {
                foreach (int[] unit in unitsInPigRange)
                {
                    RemoveUnitAt(unit[0], unit[1]);
                }
            }

            EvaluatePlayFieldForPigsPartialPC(x, y);
        }

        //More pricey chicken.
        public void AttackWithPigsAndEvaluateMPC(int x, int y, int count = 1)
        {
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            int chickensInRangeCount = 0;

            this.GoldAvailableForAttack -= count * GameRules.PigPrice;
            this.PerformedActions.AppendLine(String.Format("pigs {0} {1} {2}", count, x, y));

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            if (chickensInRangeCount * GameRules.ChickenPower <= count * GameRules.PigPower)
            {
                foreach (int[] unit in unitsInPigRange)
                {
                    RemoveUnitAt(unit[0], unit[1]);
                }
            }

            EvaluatePlayFieldForPigsPartialMPC(x, y);
        }

        public void AttackWithBomb(int x, int y, int radius = 0)
        {

            this.GoldAvailableForAttack -= (radius + 1) * GameRules.BombPricePerRadius;
            this.PerformedActions.AppendLine(String.Format("bomb {0} {1} {2}", radius, x, y));

            List<int[]> unitsInBombRadius = GetUnitsInRange(x, y, radius);

            foreach (int[] unit in unitsInBombRadius)
            {
                RemoveUnitAt(unit[0], unit[1]);
            }
        }

        private float GetPigsScore(int x, int y)
        {
            return playFieldPigsScores[(PlayFieldSize - 1) - y, x];
        }

        private void SetPigsScore(int x, int y, float score)
        {
            playFieldPigsScores[(PlayFieldSize - 1) - y, x] = score;
        }

        public int GetPigsNeededForDetonation(int x, int y)
        {
            return playFieldPigsNeededForDetonation[(PlayFieldSize - 1) - y, x];
        }

        private void SetPigsNeededForDetonation(int x, int y, int count)
        {
            playFieldPigsNeededForDetonation[(PlayFieldSize - 1) - y, x] = count;
        }

        private int GetIntegralStagedValue(int x, int y)
        {
            return integralSumsStagingArray[(PlayFieldSize - 1) - y, x];
        }

        private void SetIntegralStagedValue(int x, int y, int sum)
        {
            integralSumsStagingArray[(PlayFieldSize - 1) - y, x] = sum;
        }

        public void EvaluatePlayFieldForPigs()
        {
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    EvaluatePointForPigs(x, y);
                }
            }
        }

        private void EvaluatePlayFieldForPigsPartial(int centerX, int centerY)
        {
            for (int x = centerX - 3; x <= centerX + 3; x++)
            {
                for (int y = centerY - 3; y <= centerY + 3; y++)
                {
                    if (IsValidPoint(x, y))
                    {
                        EvaluatePointForPigs(x, y);
                    }
                }
            }
        }

        private void EvaluatePointForPigs(int x, int y)
        {
            const int PigPrice = GameRules.PigPrice;
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            int lostUnitsInGold = 0;
            int chickensInRangeCount = 0;
            int pigsNeededToDetonate = 0;
            int goldNeededToDetonate = 0;
            float score = 0;

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            pigsNeededToDetonate = (int)Math.Ceiling(((chickensInRangeCount * GameRules.ChickenPower) / (float)GameRules.PigPower));

            if (pigsNeededToDetonate == 0)
            {
                pigsNeededToDetonate = 1;
            }

            SetPigsNeededForDetonation(x, y, pigsNeededToDetonate);

            foreach (int[] unit in unitsInPigRange)
            {
                lostUnitsInGold += (this[unit[0], unit[1]].Price * this[unit[0], unit[1]].Count);
            }

            goldNeededToDetonate = pigsNeededToDetonate * PigPrice;

            score = lostUnitsInGold / (float)goldNeededToDetonate;

            SetPigsScore(x, y, score);
        }

        //Pricey chicken.
        public void EvaluatePlayFieldForPigsPC()
        {
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    EvaluatePointForPigsPC(x, y);
                }
            }
        }

        //Pricey chicken.
        private void EvaluatePlayFieldForPigsPartialPC(int centerX, int centerY)
        {
            for (int x = centerX - 3; x <= centerX + 3; x++)
            {
                for (int y = centerY - 3; y <= centerY + 3; y++)
                {
                    if (IsValidPoint(x, y))
                    {
                        EvaluatePointForPigsPC(x, y);
                    }
                }
            }
        }

        //Pricey chicken.
        private void EvaluatePointForPigsPC(int x, int y)
        {
            const int PigPrice = GameRules.PigPrice;
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            float lostUnitsInGold = 0;
            int chickensInRangeCount = 0;
            int pigsNeededToDetonate = 0;
            int goldNeededToDetonate = 0;
            float score = 0;

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            pigsNeededToDetonate = (int)Math.Ceiling(((chickensInRangeCount * GameRules.ChickenPower) / (float)GameRules.PigPower));

            if (pigsNeededToDetonate == 0)
            {
                pigsNeededToDetonate = 1;
            }

            SetPigsNeededForDetonation(x, y, pigsNeededToDetonate);

            foreach (int[] unit in unitsInPigRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    lostUnitsInGold += ((this[unit[0], unit[1]].Price * 2.001f) * this[unit[0], unit[1]].Count);
                }
                else
                {
                    lostUnitsInGold += (this[unit[0], unit[1]].Price * this[unit[0], unit[1]].Count);
                }
            }

            goldNeededToDetonate = pigsNeededToDetonate * PigPrice;

            score = lostUnitsInGold / (float)goldNeededToDetonate;

            SetPigsScore(x, y, score);
        }

        //More pricey chicken.
        public void EvaluatePlayFieldForPigsMPC()
        {
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    EvaluatePointForPigsMPC(x, y);
                }
            }
        }

        //More pricey chicken.
        private void EvaluatePlayFieldForPigsPartialMPC(int centerX, int centerY)
        {
            for (int x = centerX - 3; x <= centerX + 3; x++)
            {
                for (int y = centerY - 3; y <= centerY + 3; y++)
                {
                    if (IsValidPoint(x, y))
                    {
                        EvaluatePointForPigsMPC(x, y);
                    }
                }
            }
        }

        //More pricey chicken.
        private void EvaluatePointForPigsMPC(int x, int y)
        {
            const int PigPrice = GameRules.PigPrice;
            const float PigAttackRange = GameRules.PigRange;
            const float ChickenAttackRange = GameRules.ChickenRange;
            float lostUnitsInGold = 0;
            int chickensInRangeCount = 0;
            int pigsNeededToDetonate = 0;
            int goldNeededToDetonate = 0;
            float score = 0;

            List<int[]> unitsInChickenRange = GetUnitsInRange(x, y, ChickenAttackRange);
            List<int[]> unitsInPigRange = GetUnitsInRange(x, y, PigAttackRange);

            foreach (int[] unit in unitsInChickenRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    chickensInRangeCount += this[unit[0], unit[1]].Count;
                }
            }

            pigsNeededToDetonate = (int)Math.Ceiling(((chickensInRangeCount * GameRules.ChickenPower) / (float)GameRules.PigPower));

            if (pigsNeededToDetonate == 0)
            {
                pigsNeededToDetonate = 1;
            }

            SetPigsNeededForDetonation(x, y, pigsNeededToDetonate);

            foreach (int[] unit in unitsInPigRange)
            {
                if (this[unit[0], unit[1]].Type == DefenseUnitTypes.Chicken)
                {
                    lostUnitsInGold += ((this[unit[0], unit[1]].Price * 3) * this[unit[0], unit[1]].Count);
                }
                else
                {
                    lostUnitsInGold += (this[unit[0], unit[1]].Price * this[unit[0], unit[1]].Count);
                }
            }

            goldNeededToDetonate = pigsNeededToDetonate * PigPrice;

            score = lostUnitsInGold / (float)goldNeededToDetonate;

            SetPigsScore(x, y, score);
        }

        public void EvaluatePlayFieldForBomb()
        {
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    SetIntegralStagedValue(x, y, this[x, y].Count * this[x, y].Price);
                }
            }

            MatrixPartialSumsFinder finder = new MatrixPartialSumsFinder(integralSumsStagingArray);

            //Brute force way - very slow.
            //for (int x = 0; x < PlayFieldSize; x++)
            //{
            //    for (int y = 0; y < PlayFieldSize; y++)
            //    {
            //        for (int z = 0; z <= maxBombRadius; z++)
            //        {
            //            for (int i = x - z; i <= x + z; i++)
            //            {
            //                for (int j = y - z; j <= y + z; j++)
            //                {
            //                    if (IsValidPoint(i, j) && IsPointInRange(i, j, x, y, z))
            //                    {
            //                        playFieldBombsScores[x, y, z] += playField[i, j].Count * playField[i, j].Price;
            //                    }
            //                }
            //            }
            //        }
            //    }
            //}

            //Rough approximation - fast.
            //for (int x = 0; x < PlayFieldSize; x++)
            //{
            //    for (int y = 0; y < PlayFieldSize; y++)
            //    {
            //        for (int z = 0; z <= maxBombRadius; z++)
            //        {
            //            playFieldBombsScores[x, y, z] = finder.GetSum(x - z, y - z, x + z, y + z);
            //        }
            //    }
            //}

            //Mix between the two.
            for (int x = 0; x < PlayFieldSize; x++)
            {
                for (int y = 0; y < PlayFieldSize; y++)
                {
                    for (int z = 0; z <= MaxBombRadius; z++)
                    {
                        for (int i = y - z; i <= y + z; i++)
                        {
                            playFieldBombsScores[y, x, z] += finder.GetSum(i, x - (int)Math.Sqrt(z * z - (i - y) * (i - y)), i, x + (int)Math.Sqrt(z * z - (i - y) * (i - y)));
                        }
                    }
                }
            }
        }

        public Bomb GetMostEffectiveBombGreedy()
        {
            float score;
            float maxScore = -1;
            int x = 0;
            int y = 0;
            int radius = 0;
            Bomb bomb;

            for (int r = MaxBombRadius; r >= 0; r--)
            {
                for (int i = 0; i < PlayFieldSize; i++)
                {
                    for (int j = 0; j < PlayFieldSize; j++)
                    {
                        //Score = lost units in gold / gold needed for bomb.
                        score = playFieldBombsScores[i, j, r] / (float)((r + 1) * GameRules.BombPricePerRadius);

                        if (maxScore < score)
                        {
                            maxScore = score;
                            x = j;
                            y = (PlayFieldSize - 1) - i;
                            radius = r;
                        }
                    }
                }
            }

            bomb = new Bomb(x, y, radius);

            return bomb;
        }

        public Bomb GetMostEffectiveBombRelative()
        {
            double score;
            double maxScore = -1;
            int x = 0;
            int y = 0;
            int radius = 0;
            Bomb bomb;

            for (int r = MaxBombRadius; r >= 0; r--)
            {
                for (int i = 0; i < PlayFieldSize; i++)
                {
                    for (int j = 0; j < PlayFieldSize; j++)
                    {
                        //Score = lost units in gold^(1 + lost units in gold / total units in gold) / gold needed for bomb.
                        score = Math.Pow(playFieldBombsScores[i, j, r], (1 + playFieldBombsScores[i, j, r] / (double)this.GoldSpentForDefense)) / (double)((r + 1) * GameRules.BombPricePerRadius);

                        if (maxScore < score)
                        {
                            maxScore = score;
                            x = j;
                            y = (PlayFieldSize - 1) - i;
                            radius = r;
                        }
                    }
                }
            }

            bomb = new Bomb(x, y, radius);

            return bomb;
        }

        public Point GetMostEffectivePigPoint()
        {
            float score;
            float maxScore = -1;
            int x = 0;
            int y = 0;
            Point pigPoint;

            for (int i = 0; i < PlayFieldSize; i++)
            {
                for (int j = 0; j < PlayFieldSize; j++)
                {
                    score = playFieldPigsScores[i, j];

                    if (maxScore < score && playFieldPigsNeededForDetonation[i, j] * GameRules.PigPrice <= this.GoldAvailableForAttack)
                    {
                        maxScore = score;
                        x = j;
                        y = (PlayFieldSize - 1) - i;
                    }
                }
            }

            pigPoint = new Point(x, y);

            return pigPoint;
        }

        //private List<int[]> GetUnitsInRange(int centerX, int centerY, float range)
        //{
        //    List<int[]> unitsInRange = new List<int[]>();

        //    for (int x = centerX - (int)range; x <= centerX + (int)range; x++)
        //    {
        //        for (int y = centerY - (int)range; y <= centerY + (int)range; y++)
        //        {
        //            if (IsValidPoint(x, y) && IsPointInRange(x, y, centerX, centerY, range) &&
        //                    (this[x, y].Type == DefenseUnitTypes.Mine || this[x, y].Type == DefenseUnitTypes.Chicken))
        //            {
        //                unitsInRange.Add(new int[] { x, y });
        //            }
        //        }
        //    }

        //    return unitsInRange;
        //}

        //Faster method.

        private List<int[]> GetUnitsInRange(int centerX, int centerY, float range)
        {
            List<int[]> unitsInRange = new List<int[]>();

            for (int x = centerX - (int)range; x <= centerX + (int)range; x++)
            {
                for (int y = centerY - (int)Math.Sqrt(range * range - (x - centerX) * (x - centerX)); y <= centerY + (int)Math.Sqrt(range * range - (x - centerX) * (x - centerX)); y++)
                {
                    if (IsValidPoint(x, y) && (this[x, y].Type == DefenseUnitTypes.Mine || this[x, y].Type == DefenseUnitTypes.Chicken))
                    {
                        unitsInRange.Add(new int[] { x, y });
                    }
                }
            }

            return unitsInRange;
        }

        private bool IsValidPoint(int x, int y)
        {
            if (x < 0 || x > GameRules.PlayFieldSize - 1 || y < 0 || y > GameRules.PlayFieldSize - 1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        private bool IsPointInRange(int x, int y, int centerX, int centerY, float range)
        {
            int sideA = centerX - x;
            int sideB = centerY - y;
            int squaredDistance = sideA * sideA + sideB * sideB;
            float squaredRange = range * range;

            if (squaredDistance > squaredRange)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public override string ToString()
        {
            StringBuilder output = new StringBuilder(PlayFieldSize * (PlayFieldSize + Environment.NewLine.Length) * 3);

            for (int i = 0; i < PlayFieldSize; i++)
            {
                for (int j = 0; j < PlayFieldSize; j++)
                {
                    output.AppendFormat("{0}{1,2:00}", playField[i, j].Type.ToString()[0], playField[i, j].Count);
                }
                output.Append(Environment.NewLine);
            }

            return output.ToString();
        }

        public string GetPigsScores()
        {
            StringBuilder output = new StringBuilder(PlayFieldSize * (PlayFieldSize + Environment.NewLine.Length) * 5);

            for (int i = 0; i < PlayFieldSize; i++)
            {
                for (int j = 0; j < PlayFieldSize; j++)
                {
                    output.AppendFormat("{0,4:0.00} ", playFieldPigsScores[i, j]);
                }
                output.Append(Environment.NewLine);
            }

            return output.ToString();
        }

        public string GetBombsScores(int radius)
        {
            StringBuilder output = new StringBuilder(PlayFieldSize * (PlayFieldSize + Environment.NewLine.Length) * 5);

            for (int i = 0; i < PlayFieldSize; i++)
            {
                for (int j = 0; j < PlayFieldSize; j++)
                {
                    //output.AppendFormat("{0,4:0.00} ", playFieldBombsScores[i, j, radius]);
                    output.AppendFormat("{0,4:0.00} ", playFieldBombsScores[i, j, radius] / (float)((radius + 1) * 10));
                }
                output.Append(Environment.NewLine);
            }

            return output.ToString();
        }
    }
}