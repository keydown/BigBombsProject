using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using BigBombsWeb.Models;

namespace BigBombsWeb
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            //OAuthWebSecurity.RegisterMicrosoftClient(
            //    clientId: "",
            //    clientSecret: "");

            //OAuthWebSecurity.RegisterTwitterClient(
            //    consumerKey: "",
            //    consumerSecret: "");

            OAuthWebSecurity.RegisterFacebookClient(
                appId: "158919177597038",
                appSecret: "d8ad8f9bf18b4ea07a90b9b9a8fe3d09");

            OAuthWebSecurity.RegisterGoogleClient();
        }
    }
}
