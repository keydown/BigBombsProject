using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BigBombsWeb.Models;

namespace BigBombsWeb.DAL
{
    public class BigBombsDAL
    {
        public static int GetUserIDByName(string username)
        {
            UsersContext _uc = new UsersContext();
            UserProfile up =  _uc.UserProfiles.SingleOrDefault(x => x.UserName == username);
            return up.UserId;
        }
    }
}