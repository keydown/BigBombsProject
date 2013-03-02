using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public class MatrixPartialSumsFinder
    {
        int[,] inputMatrix;
        int[,] integralSums;
        int inputMatrixWidth;
        int inputMatrixHeight;
        int rowTempSum = 0;
        int colTempSum = 0;

        public MatrixPartialSumsFinder(int[,] matrix)
        {
            inputMatrix = matrix;
            inputMatrixHeight = matrix.GetLength(0);
            inputMatrixWidth = matrix.GetLength(1);

            CalculateIntegralSums();
        }

        private void CalculateIntegralSums()
        {
            integralSums = new int[inputMatrixHeight, inputMatrixWidth];

            if (inputMatrixHeight == inputMatrixWidth)
            {
                for (int row = 0; row < inputMatrixHeight; row++)
                {
                    rowTempSum += inputMatrix[row, 0];
                    colTempSum += inputMatrix[0, row];

                    integralSums[row, 0] = rowTempSum;
                    integralSums[0, row] = colTempSum;
                }
            }
            else
            {
                for (int row = 0; row < inputMatrixHeight; row++)
                {
                    rowTempSum += inputMatrix[row, 0];
                    integralSums[row, 0] = rowTempSum;
                }

                for (int col = 0; col < inputMatrixWidth; col++)
                {
                    colTempSum += inputMatrix[0, col];
                    integralSums[0, col] = colTempSum;
                }
            }

            for (int row = 1; row < inputMatrixHeight; row++)
            {
                for (int col = 1; col < inputMatrixWidth; col++)
                {
                    integralSums[row, col] = integralSums[row - 1, col] + integralSums[row, col - 1] + inputMatrix[row, col] - integralSums[row - 1, col - 1];
                }
            }
        }

        public int GetSum(int topLeftX, int topLeftY, int bottomRightX, int bottomRightY)
        {
            //if ((topLeftX < 0 && bottomRightX < 0) || 
            //    (topLeftY < 0 && bottomRightY < 0) || 
            //    (topLeftX > inputMatrixHeight - 1 && bottomRightX > inputMatrixHeight - 1) ||
            //    (topLeftY > inputMatrixWidth - 1 && bottomRightY > inputMatrixWidth - 1))
            //{
            //    return 0;
            //}

            if (bottomRightX < 0 ||
                bottomRightY < 0 ||
                topLeftX > inputMatrixHeight - 1 ||
                topLeftY > inputMatrixWidth - 1)
            {
                return 0;
            }

            if (topLeftX < 0)
            {
                topLeftX = 0;
            }
            if (topLeftY < 0)
            {
                topLeftY = 0;
            }
            if (bottomRightX < 0)
            {
                bottomRightX = 0;
            }
            if (bottomRightY < 0)
            {
                bottomRightY = 0;
            }
            if (topLeftX > inputMatrixHeight - 1)
            {
                topLeftX = inputMatrixHeight - 1;
            }
            if (topLeftY > inputMatrixWidth - 1)
            {
                topLeftY = inputMatrixWidth - 1;
            }
            if (bottomRightX > inputMatrixHeight - 1)
            {
                bottomRightX = inputMatrixHeight - 1;
            }
            if (bottomRightY > inputMatrixWidth - 1)
            {
                bottomRightY = inputMatrixWidth - 1;
            }

            int sum = integralSums[bottomRightX, bottomRightY]
                - ((topLeftY > 0) ? integralSums[bottomRightX, topLeftY - 1] : 0)
                - ((topLeftX > 0) ? integralSums[topLeftX - 1, bottomRightY] : 0)
                + ((topLeftX > 0 && topLeftY > 0) ? integralSums[topLeftX - 1, topLeftY - 1] : 0);

            return sum;
        }
    }
}
