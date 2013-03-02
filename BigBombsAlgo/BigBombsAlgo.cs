using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    class BigBombsAlgo
    {
        static void Main(string[] args)
        {
            PlayField playFieldMaster = new PlayField();

            //Read input.
            InputReader[] commands = GetInput();

            //DateTime start = DateTime.Now;

            if (commands.Length == 0)
            {
                return;
            }

            //Execute commands from input.
            for (int current = 0; current < commands.Length; current++)
            {
                playFieldMaster.InsertDefenseUnit(commands[current].X, commands[current].Y, commands[current].UnitType, commands[current].UnitCount);
            }

            //Evaluate for bomb.
            playFieldMaster.EvaluatePlayFieldForBomb();
            //Console.WriteLine("Bomb scores:");
            //Console.WriteLine(playField.GetBombsScores(2));
            //Console.WriteLine();

            //Console.WriteLine(playFieldMaster.ToString());

            PlayField playFieldBranchPc = new PlayField(playFieldMaster);
            PlayField playFieldBranchMpc = new PlayField(playFieldMaster);
            PlayField playFieldBranchRel = new PlayField(playFieldMaster);
            PlayField playFieldBranchRelPc = new PlayField(playFieldMaster);
            PlayField playFieldBranchRelMpc = new PlayField(playFieldMaster);
            PlayField playFieldBranchNb = new PlayField(playFieldMaster);
            PlayField playFieldBranchNbPc = new PlayField(playFieldMaster);
            PlayField playFieldBranchNbMpc = new PlayField(playFieldMaster);

            //Find highest score for bomb.
            Bomb bombGreedy = playFieldMaster.GetMostEffectiveBombGreedy();
            Bomb bombRelative = playFieldBranchRel.GetMostEffectiveBombRelative();

            GetOutput(playFieldMaster, bombGreedy);
            GetOutputPC(playFieldBranchPc, bombGreedy);
            GetOutputMPC(playFieldBranchMpc, bombGreedy);
            GetOutput(playFieldBranchRel, bombRelative);
            GetOutputPC(playFieldBranchRelPc, bombRelative);
            GetOutputMPC(playFieldBranchRelMpc, bombRelative);
            GetOutput(playFieldBranchNb);
            GetOutputPC(playFieldBranchNbPc);
            GetOutputMPC(playFieldBranchNbMpc);

            //Console.WriteLine(GetOutput(playFieldMaster, bombGreedy));
            //PrintStatistics(playFieldMaster);

            //Console.WriteLine(GetOutputPC(playFieldBranchPc, bombGreedy));
            //PrintStatistics(playFieldBranchPc);

            //Console.WriteLine(GetOutputMPC(playFieldBranchMpc, bombGreedy));
            //PrintStatistics(playFieldBranchMpc);

            //Console.WriteLine(GetOutput(playFieldBranchRel, bombRelative));
            //PrintStatistics(playFieldBranchRel);

            //Console.WriteLine(GetOutputPC(playFieldBranchRelPc, bombRelative));
            //PrintStatistics(playFieldBranchRelPc);

            //Console.WriteLine(GetOutputMPC(playFieldBranchRelMpc, bombRelative));
            //PrintStatistics(playFieldBranchRelMpc);

            //Console.WriteLine(GetOutput(playFieldBranchNb));
            //PrintStatistics(playFieldBranchNb);

            //Console.WriteLine(GetOutputPC(playFieldBranchNbPc));
            //PrintStatistics(playFieldBranchNbPc);

            //Console.WriteLine(GetOutputMPC(playFieldBranchNbMpc));
            //PrintStatistics(playFieldBranchNbMpc);

            Console.WriteLine(GetMaxScoreOutput(playFieldMaster, playFieldBranchPc, playFieldBranchMpc,
                                                playFieldBranchRel, playFieldBranchRelPc, playFieldBranchRelMpc,
                                                playFieldBranchNb, playFieldBranchNbPc, playFieldBranchNbMpc));

            //Console.WriteLine("Time data: {0} ms", (DateTime.Now - start).TotalMilliseconds);
        }

        static InputReader[] GetInput()
        {
            int commandsCount = int.Parse(Console.ReadLine());
            InputReader[] commands = new InputReader[commandsCount];

            for (int command = 0; command < commandsCount; command++)
            {
                commands[command] = new InputReader(Console.ReadLine().Split(' '));
            }

            return commands;
        }

        static string GetOutput(PlayField playField, Bomb bomb = null)
        {
            //Decide whether to attack with bomb or not and record to output stringbuilder.
            if (bomb != null)
            {
                playField.AttackWithBomb(bomb.X, bomb.Y, bomb.Radius);
                //algoOutput.AppendLine(String.Format("bomb {0} {1} {2}", bomb.Radius, bomb.X, bomb.Y));
            }

            //Evaluate for pigs.
            playField.EvaluatePlayFieldForPigs();

            //Find highest score and attack with pigs and record to output stringbuilder.
            Point bestPigAttackPoint;
            int pigsNeededForDetonation;

            while (playField.GoldAvailableForAttack >= GameRules.PigPrice && playField.ResultScore < playField.GoldSpentForDefense)
            {
                bestPigAttackPoint = playField.GetMostEffectivePigPoint();
                pigsNeededForDetonation = playField.GetPigsNeededForDetonation(bestPigAttackPoint.X, bestPigAttackPoint.Y);
                playField.AttackWithPigsAndEvaluate(bestPigAttackPoint.X, bestPigAttackPoint.Y, pigsNeededForDetonation);
                //algoOutput.AppendLine(String.Format("pigs {0} {1} {2}", pigsNeededForDetonation, bestPigAttackPoint.X, bestPigAttackPoint.Y));
            }

            //Return output stringbuilder variable.
            return playField.PerformedActions.ToString().TrimEnd();
        }

        //Pricey chicken.
        static string GetOutputPC(PlayField playField, Bomb bomb = null)
        {
            //Decide whether to attack with bomb or not and record to output stringbuilder.
            if (bomb != null)
            {
                playField.AttackWithBomb(bomb.X, bomb.Y, bomb.Radius);
                //algoOutput.AppendLine(String.Format("bomb {0} {1} {2}", bomb.Radius, bomb.X, bomb.Y));
            }

            //Evaluate for pigs.
            playField.EvaluatePlayFieldForPigsPC();

            //Find highest score and attack with pigs and record to output stringbuilder.
            Point bestPigAttackPoint;
            int pigsNeededForDetonation;

            while (playField.GoldAvailableForAttack >= GameRules.PigPrice && playField.ResultScore < playField.GoldSpentForDefense)
            {
                bestPigAttackPoint = playField.GetMostEffectivePigPoint();
                pigsNeededForDetonation = playField.GetPigsNeededForDetonation(bestPigAttackPoint.X, bestPigAttackPoint.Y);
                playField.AttackWithPigsAndEvaluatePC(bestPigAttackPoint.X, bestPigAttackPoint.Y, pigsNeededForDetonation);
                //algoOutput.AppendLine(String.Format("pigs {0} {1} {2}", pigsNeededForDetonation, bestPigAttackPoint.X, bestPigAttackPoint.Y));
            }

            //Return output stringbuilder variable.
            return playField.PerformedActions.ToString().TrimEnd();
        }

        //More pricey chicken.
        static string GetOutputMPC(PlayField playField, Bomb bomb = null)
        {
            //Decide whether to attack with bomb or not and record to output stringbuilder.
            if (bomb != null)
            {
                playField.AttackWithBomb(bomb.X, bomb.Y, bomb.Radius);
                //algoOutput.AppendLine(String.Format("bomb {0} {1} {2}", bomb.Radius, bomb.X, bomb.Y));
            }

            //Evaluate for pigs.
            playField.EvaluatePlayFieldForPigsMPC();

            //Find highest score and attack with pigs and record to output stringbuilder.
            Point bestPigAttackPoint;
            int pigsNeededForDetonation;

            while (playField.GoldAvailableForAttack >= GameRules.PigPrice && playField.ResultScore < playField.GoldSpentForDefense)
            {
                bestPigAttackPoint = playField.GetMostEffectivePigPoint();
                pigsNeededForDetonation = playField.GetPigsNeededForDetonation(bestPigAttackPoint.X, bestPigAttackPoint.Y);
                playField.AttackWithPigsAndEvaluateMPC(bestPigAttackPoint.X, bestPigAttackPoint.Y, pigsNeededForDetonation);
                //algoOutput.AppendLine(String.Format("pigs {0} {1} {2}", pigsNeededForDetonation, bestPigAttackPoint.X, bestPigAttackPoint.Y));
            }

            //Return output stringbuilder variable.
            return playField.PerformedActions.ToString().TrimEnd();
        }

        static void PrintStatistics(PlayField playField)
        {
            Console.WriteLine("Printing statistics for a playField object: ------------");
            Console.WriteLine("GoldForAttack: {0}", playField.GoldAvailableForAttack);
            Console.WriteLine("GoldForDefense: {0}", playField.GoldSpentForDefense);
            if (playField.MinesCount == 0)
            {
                Console.WriteLine("Result Gold: {0}", playField.ResultScore * 2);
            }
            else
            {
                Console.WriteLine("Result Gold: {0}", playField.ResultScore);
            }
            Console.WriteLine();
        }

        static int GetResultScore(PlayField playField)
        {
            int resultScore;

            if (playField.MinesCount == 0)
            {
                resultScore = playField.ResultScore * 2;
            }
            else
            {
                resultScore = playField.ResultScore;
            }

            return resultScore;
        }

        static string GetMaxScoreOutput(params PlayField[] fields)
        {
            int maxScore = -1;
            string output = String.Empty;

            foreach (PlayField field in fields)
            {
                if (maxScore < GetResultScore(field))
                {
                    maxScore = GetResultScore(field);
                    output = field.PerformedActions.ToString().TrimEnd();
                }
            }

            return output;
        }
    }
}
