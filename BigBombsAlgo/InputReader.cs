using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public class InputReader
    {
        DefenseUnitTypes unitType;
        int unitCount;
        int x;
        int y;

        public DefenseUnitTypes UnitType
        {
            get
            {
                return unitType;
            }
            set
            {
                this.unitType = value;
            }
        }

        public int UnitCount
        {
            get
            {
                return unitCount;
            }
            set
            {
                this.unitCount = value;
            }
        }

        public int X
        {
            get
            {
                return x;
            }
            set
            {
                this.x = value;
            }
        }

        public int Y
        {
            get
            {
                return y;
            }
            set
            {
                this.y = value;
            }
        }

        public InputReader(string unitType, int unitCount, int x, int y)
        {
            switch (unitType)
            {
                case "chickens":
                    this.UnitType = DefenseUnitTypes.Chicken;
                    break;
                case "mine":
                    this.UnitType = DefenseUnitTypes.Mine;
                    break;
                default:
                    this.UnitType = DefenseUnitTypes.Empty;
                    break;
            }
            this.UnitCount = UnitCount;
            this.X = x;
            this.Y = y;
        }

        public InputReader(string[] inputLine)
        {
            switch (inputLine[0])
            {
                case "chickens":
                    this.UnitType = DefenseUnitTypes.Chicken;
                    this.UnitCount = int.Parse(inputLine[1]);
                    this.X = int.Parse(inputLine[2]);
                    this.Y = int.Parse(inputLine[3]);
                    break;
                case "mine":
                    this.UnitType = DefenseUnitTypes.Mine;
                    this.X = int.Parse(inputLine[1]);
                    this.Y = int.Parse(inputLine[2]);
                    this.UnitCount = 1;
                    break;
                default:
                    this.UnitType = DefenseUnitTypes.Empty;
                    break;
            }
        }
    }
}
