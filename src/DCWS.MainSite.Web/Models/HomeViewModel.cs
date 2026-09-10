namespace DCWS.MainSite.Web.Models;

public sealed class HomeViewModel
{
    public IReadOnlyList<Testimonial> Testimonials { get; init; } = [];
}
