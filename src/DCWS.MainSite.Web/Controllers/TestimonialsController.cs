using DCWS.MainSite.Web.Models;
using DCWS.MainSite.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace DCWS.MainSite.Web.Controllers;

[Route("testimonials")]
public sealed class TestimonialsController(ITestimonialService testimonialService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var testimonials = await testimonialService.GetPublishedAsync(cancellationToken);
        return View(new TestimonialsPageViewModel { Testimonials = testimonials });
    }
}
