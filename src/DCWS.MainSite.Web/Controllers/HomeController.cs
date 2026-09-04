using System.Diagnostics;
using DCWS.MainSite.Web.Models;
using DCWS.MainSite.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace DCWS.MainSite.Web.Controllers;

public class HomeController(ITestimonialService testimonialService) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var testimonials = await testimonialService.GetPublishedAsync(cancellationToken);
        return View(new HomeViewModel
        {
            Testimonials = testimonials.Take(3).ToList()
        });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
        });
    }
}
