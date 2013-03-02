using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BigBombsAlgo
{
    public class Point
    {
        int x;
        int y;

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

        public Point(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
    }
}
