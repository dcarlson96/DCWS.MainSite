using Microsoft.AspNetCore.Mvc;

namespace DCWS.MainSite.Web.Controllers;

public class PortfolioController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
