using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AdminServiceDotNET.Controllers
{
    public class BaseController : ControllerBase
    {
        protected string GetUserEmail()
        {
            // Since NameClaimType = "sub" is configured, User.Identity.Name should contain the email
            var email = User.Identity?.Name ?? "unknown";
            
            Console.WriteLine($"[AUDIT] User email from JWT: {email}");
            return email;
        }
    }
}
