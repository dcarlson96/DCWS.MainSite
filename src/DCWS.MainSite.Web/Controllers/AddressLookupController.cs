using Microsoft.AspNetCore.Mvc;

namespace DCWS.MainSite.Web.Controllers;

[Route("address-lookup")]
public sealed class AddressLookupController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}
