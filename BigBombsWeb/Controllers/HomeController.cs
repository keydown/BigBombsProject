using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BigBombsWeb.Models;

namespace BigBombsWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [Authorize]
        public ActionResult Multiplayer()
        {
            return View();
        }
        public ActionResult HallOfFame()
        {
            UsersContext uc = new UsersContext();
            List<UserProfile> lup = uc.UserProfiles.OrderByDescending(x => x.Experience).Take(10).ToList();
            return PartialView("HallOfFameWinsPartial", lup);
        }
        public ActionResult HowTo()
        {
            return PartialView("HowTo");
        }
        public ActionResult About()
        {
            return PartialView("About");
        }
    }
}
