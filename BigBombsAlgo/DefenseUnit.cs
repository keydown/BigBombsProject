namespace BigBombsAlgo
{
    public class DefenseUnit
    {
        DefenseUnitTypes type;
        int count;
        float range;
        int price;

        public DefenseUnitTypes Type
        {
            get
            {
                return type;
            }
        }

        public int Count
        {
            get
            {
                return count;
            }
        }

        public float Range
        {
            get
            {
                return range;
            }
        }

        public int Price
        {
            get
            {
                return price;
            }
        }

        public DefenseUnit(DefenseUnitTypes type, int count = 1)
        {
            switch (type)
            {
                case DefenseUnitTypes.Empty:
                    this.type = type;
                    this.count = 0;
                    this.range = 0;
                    this.price = 0;
                    break;
                case DefenseUnitTypes.Chicken:
                    this.type = type;
                    this.count = count;
                    this.range = GameRules.ChickenRange;
                    this.price = GameRules.ChickenPrice;
                    break;
                case DefenseUnitTypes.Mine:
                    this.type = type;
                    this.count = 1;
                    this.range = 0;
                    this.price = GameRules.MinePrice;
                    break;
                default:
                    break;
            }
        }
    }
}
