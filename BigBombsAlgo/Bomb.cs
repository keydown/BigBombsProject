using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public class Bomb
    {
        int x;
        int y;
        int radius;
        int price;

        public int X
        {
            get
            {
                return x;
            }
        }

        public int Y
        {
            get
            {
                return y;
            }
        }

        public int Radius
        {
            get
            {
                return radius;
            }
        }

        public int Price
        {
            get
            {
                return price;
            }
        }

        public Bomb(int x, int y, int radius)
        {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.price = (radius + 1) * GameRules.BombPricePerRadius;
        }
    }
}
