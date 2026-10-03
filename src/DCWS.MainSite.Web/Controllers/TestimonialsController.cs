using DCWS.MainSite.Web.Models;
using DCWS.MainSite.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace DCWS.MainSite.Web.Controllers;

[Route("testimonials")]
public sealed class TestimonialsController(ITestimonialService testimonialService) : Controller
{
    private static readonly bool TestimonialsVisible = false;

    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        if (!TestimonialsVisible)
        {
            return RedirectToAction("Index", "Home");
        }

        var testimonials = await testimonialService.GetPublishedAsync(cancellationToken);
        return View(new TestimonialsPageViewModel { Testimonials = testimonials });
    }
}
