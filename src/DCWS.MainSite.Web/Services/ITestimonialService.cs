using DCWS.MainSite.Web.Models;

namespace DCWS.MainSite.Web.Services;

public interface ITestimonialService
{
    Task<IReadOnlyList<Testimonial>> GetPublishedAsync(CancellationToken cancellationToken = default);
}
