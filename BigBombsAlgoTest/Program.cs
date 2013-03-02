using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BigBombsAlgo;

namespace BigBombsAlgoTest
{
    class Program
    {
        static void Main(string[] args)
        {
            //Some testing.
            DateTime start = DateTime.Now;

            PlayField playField = new PlayField();
            //playField.InsertMine(1, 2);
            //playField.InsertChicken(0, 0, 1);
            //playField.InsertChicken(5, 5, 1);
            //playField.InsertMine(0, 0);

            for (int x = 0; x < playField.Size; x++)
            {
                for (int y = 0; y < playField.Size; y++)
                {
                    playField.InsertChicken(x, y);
                }
            }

            //playField.AttackWithPigs(100, 100, 10);

            playField.AttackWithBomb(50, 50, 50);

            //for (int i = 0; i < 25; i++)
            //{
            //    playField.EvaluatePlayFieldForPigs();
            //}

            playField.EvaluatePlayFieldForBomb();

            playField.EvaluatePlayFieldForPigs();

            //Console.WriteLine(playField.ToString());
            //Console.WriteLine(result);
            //Console.WriteLine(playField.GetPigsScores());

            //for (int i = 0; i < 90; i++)
            //{
            //    playField.AttackWithPigs(5 + i, 5 + i, 7);
            //}

            //Console.WriteLine(playField.GetPigsScores());

            //int[,] testM = {
            //                   {1,2,5,3},
            //                   {8,1,6,2},
            //                   {1,2,1,2}
            //               };

            //MatrixPartialSumsFinder sf = new MatrixPartialSumsFinder(testM);
            //for (int i = 0; i < 400000; i++)
            //{
            //    sf.GetSum(0, 0, 0, 0);
            //}
            //Console.WriteLine(sf.GetSum(-1, -2, -1, 23));

            Console.WriteLine((DateTime.Now - start).TotalMilliseconds);
        }
    }
}
